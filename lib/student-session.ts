const STUDENT_SESSION_TTL_SECONDS = 60 * 60 * 8;

export const STUDENT_SESSION_COOKIE_NAME = "student_session";

export interface StudentSessionPayload {
  accountId: string;
  expiresAt: number;
  mustChangePassword: boolean;
  nim: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encodeBase64Url(value: Uint8Array) {
  const binary = Array.from(value, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = atob(`${normalized}${padding}`);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function getStudentSessionSecret() {
  const secret = process.env.STUDENT_SESSION_SECRET?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!secret) {
    throw new Error(
      "Missing STUDENT_SESSION_SECRET. Add it to .env.local to enable mahasiswa session cookies safely.",
    );
  }

  return secret;
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getStudentSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signValue(value: string) {
  const signingKey = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", signingKey, encoder.encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

export async function createStudentSessionToken(
  input: Pick<StudentSessionPayload, "accountId" | "mustChangePassword" | "nim">,
) {
  const payload: StudentSessionPayload = {
    ...input,
    expiresAt: Date.now() + STUDENT_SESSION_TTL_SECONDS * 1000,
  };
  const encodedPayload = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyStudentSessionToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const signingKey = await getSigningKey();
  const isValidSignature = await crypto.subtle.verify(
    "HMAC",
    signingKey,
    decodeBase64Url(signature),
    encoder.encode(encodedPayload),
  );

  if (!isValidSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(decoder.decode(decodeBase64Url(encodedPayload))) as StudentSessionPayload;

    if (!payload.nim || !payload.accountId || payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
