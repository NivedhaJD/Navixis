# NAVIXIS 🚑
## AI-Powered Emergency Route Optimization System

A premium, interactive web dashboard that visualizes and compares pathfinding algorithms (A*, BFS, DFS) for emergency vehicle routing. Built with a Python/Flask backend and an ultra-modern, glassmorphic UI.

---

## 📸 Features

- **Tactical Dashboard UI**: Deep glassmorphism aesthetic with subtle glowing neon elements and scroll-safe bounds.
- **Interactive Grid Sandbox**: Place ambulances and hospitals, then dynamically draw complex traffic blockades to test routing.
- **Live Algorithm Comparison**: Visualize and race exactly how A*, Breadth-First Search (BFS), and Depth-First Search (DFS) explore the environment.
- **Performance Metrics**: View live statistics on nodes explored, execution time (in ms), and shortest path lengths to prove algorithmic optimality.
- **Dynamic Speed Control**: Adjust the playback speed in real-time to watch the algorithms snake through the map visually.

## 🛠️ Technologies Used

- **Backend Logic**: Python, Flask
- **Frontend**: HTML5, Vanilla JavaScript, CSS3 (CSS Grid & Flexbox)
- **Algorithms Implemented**: A* Search (Heuristic-guided), BFS (Queue-based FIFO), DFS (Stack-based LIFO)

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-link>
   cd ambulance-route-finder
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```

5. **Open the Dashboard:**
   Navigate your web browser to \`http://localhost:5000\`
