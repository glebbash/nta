use serde::Serialize;
use std::fs;
use warp::{filters::BoxedFilter, http::Response, path::FullPath, Filter, Reply};

#[derive(Debug, Serialize)]
struct FileInfo {
    name: String,
}

pub fn route() -> BoxedFilter<(impl Reply,)> {
    warp::path!("api" / "fs" / ..)
        .and(load_file().or(list_files()).or(save_file()))
        .boxed()
}

pub fn list_files() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(warp::path::full().and_then(|path: FullPath| async move {
            let path = path.as_str().to_string();
            if !path.ends_with("/") {
                return Err(warp::reject::not_found());
            }
            Ok(path["/api/fs/".len()..].to_string())
        }))
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
        .and(warp::path::full())
        .and_then(|path: FullPath| async move {
            let path = path.as_str().to_string();
            if path.ends_with("/") {
                return Err(warp::reject::not_found());
            }
            Ok(path["/api/fs/".len()..].to_string())
        })
        .map(|path| {
            println!("load {}", path);
            let data = fs::read_to_string(path).unwrap();
            Response::builder().body(data)
        })
        .boxed()
}

pub fn save_file() -> BoxedFilter<(impl Reply,)> {
    warp::post()
        .and(warp::path::full())
        .and_then(|path: FullPath| async move {
            let path = path.as_str().to_string();
            if path.ends_with("/") {
                return Err(warp::reject::not_found());
            }
            Ok(path["/api/fs/".len()..].to_string())
        })
        .and(warp::body::bytes())
        .map(|path, data| {
            fs::write(path, data).unwrap();
            warp::reply()
        })
        .boxed()
}
