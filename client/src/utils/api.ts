const BASE_URL = import.meta.env.BASE_URL;

export async function loadPage(id: string) {
  const res = await fetch(BASE_URL + `pages/${id}`);

  await handleRequestErrors(res);

  return await res.json();
}

export async function savePage(id: string, data: unknown) {
  const res = await fetch(BASE_URL + `pages/${id}`, {
    method: "POST",
    body: JSON.stringify(data, null, 2),
  });

  await handleRequestErrors(res);
}

export async function listPages() {
  const res = await fetch(BASE_URL + "pages");

  await handleRequestErrors(res);

  return await res.json();
}

async function handleRequestErrors(res: Response) {
  if (!res.ok) {
    throw new Error("Request error " + res.status + ": " + (await res.text()));
  }
}
