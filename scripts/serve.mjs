import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "site");
const port = Number(process.env.PORT ?? 4173);
const prefix = "/neha-gaur-portfolio";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === prefix) {
      response.writeHead(308, { Location: `${prefix}/` }).end();
      return;
    }
    if (pathname.startsWith(`${prefix}/`)) pathname = pathname.slice(prefix.length);
    const file = resolve(root, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
    if (!file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (!(await stat(file)).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    } else if (error instanceof URIError) {
      response.writeHead(400).end("Malformed URL");
    } else {
      console.error(error);
      response.writeHead(500).end("Server error");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio: http://127.0.0.1:${port}${prefix}/`);
});
