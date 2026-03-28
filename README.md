# 🚑 NAVIXIS

## AI-Powered Emergency Route Optimization System

**“Because every second matters.”**

Navixis is an interactive web application that simulates **real-time ambulance routing in traffic environments** using core AI search algorithms. It demonstrates how different algorithms navigate a grid-based city map to reach a hospital efficiently, helping users understand their performance in critical situations.

---

## ✨ Features

* Interactive grid to place **ambulance (start), hospital (goal), and traffic obstacles**
* Real-time visualization of **A*, BFS, and DFS** algorithms
* Animated pathfinding with step-by-step exploration
* Performance comparison including:

  * Path length
  * Nodes explored
  * Execution time
* Adjustable speed for better visualization
* Clean and modern dashboard-style UI

---

## ⚙️ Algorithms Used

* **A*** → Uses heuristic (Manhattan distance) for optimal and efficient pathfinding
* **BFS (Breadth-First Search)** → Guarantees shortest path but explores more nodes
* **DFS (Depth-First Search)** → Explores deeply, faster in some cases but not optimal

---

## 🌍 Real-World Relevance

Navixis models real-world emergency scenarios where **fast and efficient routing is critical**, such as:

* Ambulance navigation
* Disaster response systems
* Smart traffic management

---

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **Frontend:** HTML, CSS, JavaScript

---

## 🚀 Run Locally

```bash
pip install -r requirements.txt
python app.py
```

Open in browser:
http://127.0.0.1:5000
