export async function loadPage(path) {
  const res = await fetch(path);
  return await res.json();
}
