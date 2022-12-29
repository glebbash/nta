export async function handleErrors(request: Promise<Response>) {
  const res = await request;
  if (!res.ok) {
    throw new Error("Request error " + res.status + ": " + (await res.text()));
  }
  return res;
}
