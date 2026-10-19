#!/usr/bin/env python3
"""
Serves LangFlash locally, exiting CLEANLY (code 0) when told to stop
(same pattern as usa-location-data/serve.py — plain http.server dies -15 on
Windows when killed, which Hermes reports as a background-task failure).

Usage:
    python serve.py [port]            # default 8123
    curl http://127.0.0.1:8123/__shutdown__   # clean stop
"""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
os.chdir(os.path.dirname(os.path.abspath(__file__)))
FAVICON = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c6360000200000500017a5eab3f0000000049454e44ae426082")

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = self.path.split("?")[0].lstrip("/")
        if p == "__shutdown__":
            self.send_response(200); self.end_headers()
            self.wfile.write(b"shutting down\n")
            print("[serve.py] clean shutdown (exit 0)", flush=True)
            os._exit(0)
        if p == "favicon.ico":
            self.send_response(200)
            self.send_header("Content-Type", "image/x-icon")
            self.send_header("Content-Length", str(len(FAVICON)))
            self.end_headers()
            try: self.wfile.write(FAVICON)
            except Exception: pass
            return
        super().do_GET()

    def log_message(self, fmt, *args):
        if "/favicon.ico" in (args[0] if args else ""):
            return

if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"LangFlash serving at http://127.0.0.1:{PORT}/index.html", flush=True)
        httpd.serve_forever()
