use serde::Serialize;
use std::fs;
use warp::{filters::BoxedFilter, http::Response, Filter, Reply};

const PAGES_ROOT: &str = "pages";

#[derive(Debug, Serialize)]
struct PageInfo {
    id: String,
    title: String,
}

pub fn route() -> BoxedFilter<(impl Reply,)> {
    list_pages().or(load_page()).or(save_page()).boxed()
}

pub fn list_pages() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(warp::path!("pages"))
        .map(|| {
            let pages = fs::read_dir(PAGES_ROOT)
                .unwrap()
                .map(|path| {
                    path.unwrap()
                        .path()
                        .file_stem()
                        .and_then(|x| x.to_str())
                        .unwrap()
                        .to_string()
                })
                .map(|id| PageInfo {
                    title: load_page_title(&id),
                    id,
                })
                .collect::<Vec<_>>();

            warp::reply::json(&pages)
        })
        .boxed()
}

pub fn load_page() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(warp::path!("pages" / String))
        .map(|id| {
            let data = fs::read_to_string(page_path(&id)).unwrap();
            Response::builder().body(data)
        })
        .boxed()
}

pub fn save_page() -> BoxedFilter<(impl Reply,)> {
    warp::post()
        .and(warp::path!("pages" / String))
        .and(warp::body::bytes())
        .map(|id, data| {
            fs::write(page_path(&id), data).unwrap();
            warp::reply()
        })
        .boxed()
}

fn load_page_title(id: &String) -> String {
    let data = fs::read_to_string(page_path(id)).unwrap();
    let result: serde_json::Value = serde_json::from_str(&data).unwrap();

    result
        .as_object()
        .and_then(|o| o.get("title"))
        .and_then(|t| t.as_str())
        .unwrap()
        .to_string()
}

fn page_path(id: &String) -> String {
    format!("{PAGES_ROOT}/{id}.json")
}
