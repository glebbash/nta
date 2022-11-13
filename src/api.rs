use serde::Serialize;
use std::fs;
use warp::{filters::BoxedFilter, Filter, Reply};

#[derive(Debug, Serialize)]
struct PageInfo {
    path: String,
    title: String,
}

pub fn route() -> BoxedFilter<(impl Reply,)> {
    warp::get()
        .and(warp::path!("api" / "query"))
        .map(|| {
            let paths = fs::read_dir("client/pages")
                .unwrap()
                .map(|path| path.unwrap().file_name().into_string().unwrap())
                .map(|path| -> Result<PageInfo, String> {
                    let data = fs::read_to_string(format!("client/pages/{path}")).unwrap();
                    let result: serde_json::Value = serde_json::from_str(&data).unwrap();

                    let title = result
                        .as_object()
                        .and_then(|o| o.get("title"))
                        .and_then(|t| t.as_str())
                        .ok_or("does not have a title")?;

                    Ok(PageInfo {
                        path: format!("/pages/{path}"),
                        title: String::from(title),
                    })
                })
                .filter_map(Result::ok)
                .collect::<Vec<_>>();

            warp::reply::json(&paths)
        })
        .boxed()
}
