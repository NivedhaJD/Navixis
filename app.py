"""
Smart Ambulance Route Finder
Main Flask application entry point
"""

from flask import Flask, render_template, request, jsonify
import time

from astar import astar
from bfs import bfs
from dfs import dfs

app = Flask(__name__)


@app.route("/")
def index():
    """Serve the main application page."""
    return render_template("index.html")


@app.route("/find_path", methods=["POST"])
def find_path():
    """
    POST endpoint that receives grid data and algorithm choice,
    runs the selected algorithm(s), and returns path + metrics.

    Expected JSON body:
    {
        "grid": 2D list (0 = open, 1 = obstacle),
        "start": [row, col],
        "end": [row, col],
        "algorithm": "astar" | "bfs" | "dfs" | "all"
    }
    """
    data = request.get_json()

    grid = data.get("grid")
    start = tuple(data.get("start"))
    end = tuple(data.get("end"))
    algorithm = data.get("algorithm", "astar")

    rows = len(grid)
    cols = len(grid[0])

    results = {}

    def run_algo(name, fn):
        t0 = time.perf_counter()
        path, explored = fn(grid, start, end, rows, cols)
        elapsed = round((time.perf_counter() - t0) * 1000, 3)  # ms
        return {
            "path": path,
            "explored": explored,
            "path_length": len(path),
            "nodes_explored": len(explored),
            "time_ms": elapsed,
        }

    if algorithm == "all":
        results["astar"] = run_algo("astar", astar)
        results["bfs"] = run_algo("bfs", bfs)
        results["dfs"] = run_algo("dfs", dfs)
    elif algorithm == "astar":
        results["astar"] = run_algo("astar", astar)
    elif algorithm == "bfs":
        results["bfs"] = run_algo("bfs", bfs)
    elif algorithm == "dfs":
        results["dfs"] = run_algo("dfs", dfs)
    else:
        return jsonify({"error": "Unknown algorithm"}), 400

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
