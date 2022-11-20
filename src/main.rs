use warp::Filter;

const STATIC_FILES_DIR: &str = "./client";

mod api;
mod collab;

#[tokio::main]
async fn main() {
    let static_files_route = warp::get().and(warp::fs::dir(STATIC_FILES_DIR));

    let routes = api::route()
        .with(warp::cors())
        .or(collab::route().await)
        .or(static_files_route);

    warp::serve(routes).run(([0, 0, 0, 0], 8000)).await;
}
