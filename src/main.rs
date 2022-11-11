use warp::Filter;

const STATIC_FILES_DIR: &str = "./client";

mod collab;

#[tokio::main]
async fn main() {
    let static_files = warp::get().and(warp::fs::dir(STATIC_FILES_DIR));

    let (awareness, bcast) = collab::setup_yrs().await;
    let ws = warp::path("collab")
        .and(warp::ws())
        .and(warp::any().map(move || awareness.clone()))
        .and(warp::any().map(move || bcast.clone()))
        .and_then(collab::ws_handler);

    let routes = ws.or(static_files);

    warp::serve(routes).run(([0, 0, 0, 0], 8000)).await;
}
