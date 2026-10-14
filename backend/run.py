"""
Kaushal Setu Server Runner
Starts uvicorn ASGI server on port 8000.
"""

import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print("Starting Kaushal Setu (कौशल सेतु) Backend API Server...")
    print("Serving on http://localhost:8000 (Docs: http://localhost:8000/docs)")
    print("=" * 70)
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
