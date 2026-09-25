"""Tiny static server with SPA fallback for the cloned route."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).parent.resolve()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):  # noqa: N802 - stdlib handler hook
        requested = (ROOT / self.path.lstrip("/")).resolve()
        if self.path.startswith("/pt/apps/girar-roleta-aleatoria") and not requested.is_file():
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
