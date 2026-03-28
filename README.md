# 🚑 NAVIXIS

## AI-Powered Emergency Route Optimization System

**“Because every second matters.”**

Navixis is a premium, interactive web application that simulates **real-time emergency routing for ambulances** using core AI search algorithms. It visually demonstrates how different algorithms navigate complex traffic scenarios to reach a hospital efficiently.

---

## 🧠 About the Project

In real-world emergency situations, **delays in navigation can cost lives**. Navixis addresses this problem by simulating how intelligent systems can compute the **fastest and most efficient route** in a dynamic traffic environment.

The system compares three fundamental AI search algorithms:

* **A*** (heuristic-based optimal pathfinding)
* **Breadth-First Search (BFS)**
* **Depth-First Search (DFS)**

It allows users to visually understand how each algorithm behaves in terms of:

* speed
* efficiency
* path optimality

---

## ✨ Key Features

* **🚑 Interactive Grid Environment**
  Create a dynamic city map by placing an ambulance (start), hospital (goal), and traffic obstacles.

* **⚡ Real-Time Algorithm Visualization**
  Watch A*, BFS, and DFS explore the grid step-by-step with smooth animations.

* **📊 Live Performance Metrics**
  Compare:

  * Path length
  * Nodes explored
  * Execution time (ms)

* **🎮 Full Interactivity**

  * Click to set start and destination
  * Drag to simulate traffic conditions
  * Adjust speed dynamically

* **🎨 Professional Dashboard UI**
  Modern glassmorphism-inspired interface with clean layout and responsive design.

---

## ⚙️ Algorithms Used

### 🔹 A* Algorithm

* Uses **f(n) = g(n) + h(n)**
* Heuristic: Manhattan Distance
* ✅ Optimal and efficient

### 🔹 Breadth-First Search (BFS)

* Explores level by level using a queue (FIFO)
* ✅ Guarantees shortest path
* ❌ Explores many nodes

### 🔹 Depth-First Search (DFS)

* Explores deeply using a stack (LIFO)
* ❌ Does not guarantee shortest path
* ⚡ Can be faster but unreliable

---

## 📊 Algorithm Comparison

| Algorithm | Optimal Path | Speed      | Nodes Explored  |
| --------- | ------------ | ---------- | --------------- |
| A*        | ✅ Yes        | ⚡ Fast     | 🔽 Low          |
| BFS       | ✅ Yes        | ⏳ Medium   | 🔼 High         |
| DFS       | ❌ No         | ⚡ Variable | ❓ Unpredictable |

---

## 🌍 Real-World Applications

* 🚑 Emergency ambulance routing
* 🚓 Police and fire response systems
* 🏙️ Smart city traffic management
* 🤖 Robotics path planning
* 🚚 Logistics and delivery optimization

---

## 🛠️ Technologies Used

**Backend**

* Python
* Flask

**Frontend**

* HTML5
* CSS3 (Grid + Flexbox)
* Vanilla JavaScript

**Algorithms**

* A* Search
* Breadth-First Search (BFS)
* Depth-First Search (DFS)

---

## 📁 Project Structure

```
Navixis/
│
├── app.py
├── astar.py
├── bfs.py
├── dfs.py
├── requirements.txt
│
├── templates/
│     └── index.html
│
└── static/
      ├── style.css
      └── script.js
```

---

## 📸 Demo

*(Add screenshots here after uploading images to your repo)*

```
![Dashboard](demo.png)
![Pathfinding](path.png)
![Comparison](comparison.png)
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NivedhaJD/Navixis
cd Navixis
```

### 2️⃣ Create Virtual Environment (Optional)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the Application

```bash
python app.py
```

### 5️⃣ Open in Browser

```
http://127.0.0.1:5000
```

---

## 🎯 Learning Outcomes

* Understanding **uninformed vs informed search algorithms**
* Comparing algorithm efficiency and optimality
* Applying AI concepts to **real-world problems**
* Building a **full-stack AI application**

---

## 📌 Conclusion

Navixis demonstrates how artificial intelligence can be applied to **critical real-world scenarios** like emergency response. By comparing A*, BFS, and DFS, it highlights the importance of choosing the right algorithm for time-sensitive applications.

