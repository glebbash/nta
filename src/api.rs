use std::fs;
use warp::{filters::BoxedFilter, Filter, Reply};

pub fn route() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(warp::path!("api" / "pages" / String))
        .map(|path| {
            let paths: Vec<String> = fs::read_dir(format!("client/data/{path}"))
                .unwrap()
                .map(|p| p.unwrap().file_name().into_string().unwrap())
                .map(|page| format!("{path}/{page}"))
                .collect();

            warp::reply::json(&paths)
        })
        .boxed()
}
