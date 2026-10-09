const CHUNK_SIZE = 800;
const MAX_CHARS = 12000;

export function logFullJson(label: string, value: unknown): void {
  let text: string;
  try {
    text = JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    text = String(value);
  }

  const truncated = text.length > MAX_CHARS;
  const body = truncated ? text.slice(0, MAX_CHARS) : text;
  const total = Math.max(1, Math.ceil(body.length / CHUNK_SIZE));
  console.log(
    `${label} — ${text.length} chars${
      truncated ? `, showing first ${MAX_CHARS}` : ''
    } in ${total} chunk(s)`,
  );
  for (let i = 0; i < total; i++) {
    console.log(
      `${label} [${i + 1}/${total}] ${body.slice(
        i * CHUNK_SIZE,
        (i + 1) * CHUNK_SIZE,
      )}`,
    );
  }
}
