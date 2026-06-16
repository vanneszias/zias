const HASH_ALGORITHM = "pbkdf2-sha256";
const HASH_ITERATIONS = 100_000;
const MAX_HASH_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

const textEncoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array) {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;

  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return difference === 0;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer as ArrayBuffer;
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const passwordBytes = textEncoder.encode(password.normalize("NFKC"));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(passwordBytes),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const key = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: toArrayBuffer(salt),
      iterations,
    },
    keyMaterial,
    KEY_BYTES * 8,
  );

  return new Uint8Array(key);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await derivePasswordKey(password, salt, HASH_ITERATIONS);

  return [
    HASH_ALGORITHM,
    String(HASH_ITERATIONS),
    bytesToBase64Url(salt),
    bytesToBase64Url(key),
  ].join("$");
}

export async function verifyPassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) {
  const [algorithm, iterations, salt, key] = hash.split("$");
  if (algorithm !== HASH_ALGORITHM || !iterations || !salt || !key)
    return false;

  const parsedIterations = Number(iterations);
  if (!Number.isSafeInteger(parsedIterations) || parsedIterations <= 0)
    return false;
  if (parsedIterations > MAX_HASH_ITERATIONS) return false;

  const expectedKey = base64UrlToBytes(key);
  let actualKey: Uint8Array;
  try {
    actualKey = await derivePasswordKey(
      password,
      base64UrlToBytes(salt),
      parsedIterations,
    );
  } catch {
    return false;
  }

  return constantTimeEqual(actualKey, expectedKey);
}
