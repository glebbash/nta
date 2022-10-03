use futures::StreamExt;
use std::{collections::HashMap, sync::Arc};
use tokio::{sync::mpsc, sync::Mutex, task};
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::{ws::WebSocket, Filter};

pub struct Client {
    pub id: String,
    pub sender: mpsc::UnboundedSender<warp::ws::Message>,
}

type Clients = Arc<Mutex<HashMap<String, Client>>>;

#[tokio::main]
async fn main() {
    let index = warp::get().and(warp::fs::dir("../client"));

    let clients = Arc::new(Mutex::new(HashMap::new()));
    let ws = warp::path("ws")
        .and(warp::ws())
        .and(warp::any().map(move || clients.clone()))
        .map(|ws: warp::ws::Ws, clients: Clients| {
            ws.on_upgrade(move |websocket| handle_ws_connection(websocket, clients))
        });

    let routes = index.or(ws);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}

async fn handle_ws_connection(websocket: WebSocket, clients: Clients) {
    let (ws_out, mut ws_in) = websocket.split();

    let (sender, receiver) = mpsc::unbounded_channel();
    let receiver = UnboundedReceiverStream::new(receiver);
    task::spawn(receiver.map(Ok).forward(ws_out));

    let client = Client {
        id: uuid::Uuid::new_v4().simple().to_string(),
        sender,
    };

    println!("Client {} connected", &client.id);

    while let Some(result) = ws_in.next().await {
        match result {
            Ok(msg) => handle_message(&client, &clients, msg).unwrap(),
            Err(error) => {
                eprintln!(
                    "error processing ws message from {}: {:?}",
                    client.id, error
                );
                break;
            }
        };
    }
}

fn handle_message(
    sender: &Client,
    _clients: &Clients,
    message: warp::ws::Message,
) -> Result<(), mpsc::error::SendError<warp::ws::Message>> {
    println!("Received a message from {}: {:?}", sender.id, message);
    sender.sender.send(message)
}
