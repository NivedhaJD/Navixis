"""
A* Search Algorithm
-------------------
f(n) = g(n) + h(n)
  g(n) = actual cost from start to n
  h(n) = Manhattan distance heuristic from n to goal

A* is OPTIMAL and generally the FASTEST among the three algorithms
because it uses the heuristic to guide the search toward the goal.
"""

import heapq


def manhattan(a, b):
    """Manhattan distance between two grid cells (no diagonals)."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def astar(grid, start, end, rows, cols):
    """
    Run A* search from `start` to `end` on the given grid.

    Parameters
    ----------
    grid   : 2D list  –  0 = walkable, 1 = obstacle
    start  : (row, col) tuple
    end    : (row, col) tuple
    rows   : total row count
    cols   : total column count

    Returns
    -------
    path     : list of (row, col) from start→end, empty if none found
    explored : list of (row, col) in the order they were visited
    """

    # Priority queue entries: (f_score, g_score, node)
    open_heap = []
    heapq.heappush(open_heap, (0 + manhattan(start, end), 0, start))

    # Track the best g-score seen for each node
    g_score = {start: 0}

    # Parent map to reconstruct path
    came_from = {}

    # Nodes explored (in order) for visualization
    explored = []

    # Set for quick membership check
    closed = set()

    # 4-directional movement: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while open_heap:
        f, g, current = heapq.heappop(open_heap)

        # Skip if already processed
        if current in closed:
            continue
        closed.add(current)
        explored.append(list(current))

        # Goal reached – reconstruct path
        if current == end:
            path = []
            node = end
            while node in came_from:
                path.append(list(node))
                node = came_from[node]
            path.append(list(start))
            path.reverse()
            return path, explored

        # Expand neighbours
        for dr, dc in directions:
            nr, nc = current[0] + dr, current[1] + dc
            neighbour = (nr, nc)

            # Bounds check
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            # Obstacle check
            if grid[nr][nc] == 1:
                continue
            # Already processed
            if neighbour in closed:
                continue

            tentative_g = g + 1  # uniform edge cost = 1

            if tentative_g < g_score.get(neighbour, float("inf")):
                g_score[neighbour] = tentative_g
                came_from[neighbour] = current
                f_new = tentative_g + manhattan(neighbour, end)
                heapq.heappush(open_heap, (f_new, tentative_g, neighbour))

    # No path found
    return [], explored
