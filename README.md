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

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository

Download the project to your system:

```bash
git clone https://github.com/NivedhaJD/Navixis
cd Navixis
```

---

### 2️⃣ Install Required Libraries

Install all dependencies listed in the requirements file:

```bash
pip install -r requirements.txt
```

---

### 3️⃣ Run the Application

Start the Flask server:

```bash
python app.py
```

---

### 4️⃣ Open in Browser

After running the server, open your browser and go to:

```
http://127.0.0.1:5000
```

---

### 5️⃣ Use the Application

* Click to **set the ambulance (start point)**
* Click to **set the hospital (destination)**
* Drag to **add traffic/obstacles**
* Select an algorithm (**A*, BFS, DFS**)
* Click **Run** to visualize the pathfinding
* Observe the **path and performance metrics**

---

## 📌 Conclusion

Navixis demonstrates how AI search algorithms can be applied to **real-world emergency routing problems**, highlighting the importance of choosing the right algorithm for time-critical situations.

