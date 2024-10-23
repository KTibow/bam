export default async function* (body: ReadableStream<Uint8Array>) {
  const d = new TextDecoder("utf8");
  const reader = body.getReader();
  let buffer = "";
  while (true) {
    try {
      const data = await reader.read();
      if (data.done) break;
      buffer += d.decode(data.value);
    } catch (e) {
      console.warn(e);
      break;
    }
    let lines = buffer.split("\n");
    buffer = lines.pop() as string;

    let out = { text: "" };
    for (const m of lines.map((m) =>
      m.startsWith("data: ") ? m.slice(6).trim() : undefined
    )) {
      if (!m) continue;
      if (m == "[DONE]") break;
      const obj = JSON.parse(m);

      const delta = obj.choices[0].delta;
      if (delta && delta.content) {
        out.text += delta.content;
      }
    }
    if (out.text) yield out.text;
  }
}
