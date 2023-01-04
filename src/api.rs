use serde::Serialize;
use std::fs;
use warp::{filters::BoxedFilter, http::Response, path::FullPath, Filter, Reply};

#[derive(Debug, Serialize)]
struct FileInfo {
    name: String,
}

pub fn route() -> BoxedFilter<(impl Reply,)> {
    load_file().or(save_file()).or(list_files()).boxed()
}

pub fn list_files() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(path_starting_with("/api/fs/", true))
        .map(|folder| {
            let pages = fs::read_dir(folder)
                .unwrap()
                .map(|path| path.unwrap().path().to_str().unwrap().to_string())
                .map(|name| FileInfo { name })
                .collect::<Vec<_>>();

            warp::reply::json(&pages)
        })
        .boxed()
}

pub fn load_file() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(path_starting_with("/api/fs/", false))
        .map(|path| {
            let data = fs::read_to_string(path).unwrap();
            Response::builder().body(data)
        })
        .boxed()
}

pub fn save_file() -> BoxedFilter<(impl Reply,)> {
    warp::post()
        .and(path_starting_with("/api/fs/", false))
        .and(warp::body::bytes())
        .map(|path, data| {
            fs::write(path, data).unwrap();
            warp::reply()
        })
        .boxed()
}

fn path_starting_with(prefix: &'static str, end_with_slash: bool) -> BoxedFilter<(String,)> {
    warp::path::full()
        .and_then(move |path: FullPath| async move {
            let path = path.as_str().to_string();
            if !path.starts_with(&prefix) || end_with_slash != path.ends_with("/") {
                return Err(warp::reject::not_found());
            }
            Ok(path[prefix.len()..].to_string())
        })
        .boxed()
}
