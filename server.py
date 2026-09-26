"""Tiny static server with SPA fallback for the cloned route."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).parent.resolve()
STATIC_ASSETS = {"styles.css", "app.js", "logo-sem-fundo.png"}


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):  # noqa: N802 - stdlib handler hook
        path = urlsplit(self.path).path
        requested = (ROOT / path.lstrip("/")).resolve()
        route_asset = Path(path).name
        if path.startswith("/pt/apps/") and route_asset in STATIC_ASSETS:
            self.path = f"/{route_asset}"
        elif path in {"/pt/apps/", "/pt/apps/girar-roleta-aleatoria"} and not requested.is_file():
            self.path = "/index.html"
        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 4173), AppHandler)
    print("Roleta de Ideias em http://127.0.0.1:4173/pt/apps/girar-roleta-aleatoria")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
