export async function loadPage(path) {
  const res = await fetch(path);
  return await res.json();
}

export async function execQuery() {
  const res = await fetch("api/query");
  return await res.json();
}
