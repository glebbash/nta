export async function loadPage(id) {
  const res = await fetch(`pages/${id}`);

  await handleRequestErrors(res);

  return await res.json();
}

export async function savePage(id, data) {
  const res = await fetch(`pages/${id}`, {
    method: "POST",
    body: JSON.stringify(data, null, 2),
  });

  await handleRequestErrors(res);
}

export async function listPages() {
  const res = await fetch("pages");

  await handleRequestErrors(res);

  return await res.json();
}

async function handleRequestErrors(res) {
  if (!res.ok) {
    throw new Error("Request error " + res.status + ": " + await res.text());
  }
}
