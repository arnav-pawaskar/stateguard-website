#!/usr/bin/env python3
"""Print the CSP sha256-source for index.html's inline pre-paint theme script.

Run after editing that <script> block, then paste the output into the
script-src directive in vercel.json.
"""
import base64
import hashlib
import pathlib
import re

html = (pathlib.Path(__file__).parent.parent / "index.html").read_text()
match = re.search(r"<script>\n(.*?)</script>", html, re.S)
if not match:
    raise SystemExit("couldn't find the bare <script> tag in index.html")

digest = hashlib.sha256(match.group(1).encode()).digest()
print("sha256-" + base64.b64encode(digest).decode())
