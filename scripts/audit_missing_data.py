import os
import shutil
import subprocess

print("=== Audit Test: Build with data/github.json missing ===")
has_orig = os.path.exists("data/github.json")
if has_orig:
    os.rename("data/github.json", "data/github.json.bak")
    if os.path.exists("public/data/github.json"):
        os.rename("public/data/github.json", "public/data/github.json.bak")

try:
    res = subprocess.run(["npm.cmd", "run", "build"], capture_output=True, text=True)
    if res.returncode == 0:
        print("PASS: Build succeeded with data/github.json missing!")
    else:
        print("FAIL: Build failed with data/github.json missing!")
        print(res.stderr)
finally:
    if os.path.exists("data/github.json.bak"):
        os.rename("data/github.json.bak", "data/github.json")
    if os.path.exists("public/data/github.json.bak"):
        os.rename("public/data/github.json.bak", "public/data/github.json")

print("Restored data/github.json.")
