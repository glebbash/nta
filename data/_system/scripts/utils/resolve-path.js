export function resolvePath(
  /** @type {string} */ folder,
  /** @type {string | undefined} */ path,
) {
  return path?.startsWith('.') ? folder + path.slice(1) : path;
}
