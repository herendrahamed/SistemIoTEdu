const KEY = "embedded-for-kids-overrides";

function read() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function write(data) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function getOverride(path) {
  const parts = path.split(".");
  let node = read();
  for (const key of parts) {
    if (!node || typeof node !== "object") return undefined;
    node = node[key];
  }
  return node;
}

export function setOverride(path, value) {
  const parts = path.split(".");
  const data = read();
  let cursor = data;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") {
      cursor[parts[i]] = {};
    }
    cursor = cursor[parts[i]];
  }
  cursor[parts[parts.length - 1]] = value;
  write(data);
}

export function resolveField(fallback, path) {
  const v = getOverride(path);
  return v !== undefined && v !== null ? v : fallback;
}
