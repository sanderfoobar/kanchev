#!/usr/bin/python3
import re, sys, os, glob, json

bundle = b"""
var fs = require("fs");
var crypto = require("crypto");
"""

themes = {}
for d in glob.glob("templates/*"):
    if not os.path.isdir(d):
        continue
    theme_name = os.path.basename(d)
    data = {}
    for path_html in glob.glob(f"{d}/*.html"):
        f = open(path_html, "r")
        html_data = f.read()
        f.close()

        data[os.path.basename(path_html)] = html_data
    if data:
        themes[theme_name] = data

imports = []
themes_bundle = b"var default_themes = "
themes_bundle += json.dumps(themes, indent=True, sort_keys=True).encode()
themes_bundle += b";"


def read_js(fp):
    global imports
    data = b""
    with open(fp, "rb") as f:
        for line in f:
            ignore_files = [b"\"use strict\";", b"export default {", b"require(\""]
            if any(ext in line for ext in ignore_files):
                continue
            _import = re.findall(b"import (\w+) from ", line)
            if _import:
                imports.append(_import[0])
                continue

            data += line
    return data


for js in [
    b"utils.js",
    b"markdown.js",
    b"templating.js",
    b"highlight.js",
    b"kanchev.js"
]:
    bundle += read_js(js)

for i in imports:
    bundle = bundle.replace(i + b".", b"")

bundle = bundle.replace(b"var default_themes = {};", themes_bundle)
bundle += b"\nexport default { router }"
print(bundle.decode())
