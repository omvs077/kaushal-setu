"""
Kaushal Setu Server Runner
Starts uvicorn ASGI server on port 8000 with cross-platform PYTHONPATH & reload support.
"""

import os
import sys
from pathlib import Path

# Safe stdout encoding on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import uvicorn

# Ensure the repository root directory is on sys.path and PYTHONPATH
ROOT_DIR = str(Path(__file__).resolve().parent.parent)

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

existing_pythonpath = os.environ.get("PYTHONPATH", "")
if ROOT_DIR not in existing_pythonpath:
    os.environ["PYTHONPATH"] = f"{ROOT_DIR}{os.pathsep}{existing_pythonpath}" if existing_pythonpath else ROOT_DIR

if __name__ == "__main__":
    print("=" * 70)
    print("Starting Kaushal Setu Backend API Server...")
    print("Serving on http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)")
    print(f"Project root: {ROOT_DIR}")
    print("=" * 70)
    uvicorn.run(
        "backend.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        app_dir=ROOT_DIR
    )
