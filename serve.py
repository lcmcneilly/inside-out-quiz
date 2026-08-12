#!/usr/bin/env python3
"""Preview the onboarding package locally: python3 serve.py → http://127.0.0.1:8788/sol-map.html
macOS blocks `python3 -m http.server -d <dir>` from a sandboxed shell, so chdir instead."""
import http.server, os, socketserver
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = 8788
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), H) as httpd:
    print(f"http://127.0.0.1:{PORT}/sol-map.html")
    httpd.serve_forever()
