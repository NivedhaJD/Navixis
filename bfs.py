"""
Breadth-First Search (BFS)
--------------------------
Uses a FIFO queue.  Explores all nodes at distance d before any node
at distance d+1, which guarantees the SHORTEST path in an unweighted graph.

BFS is OPTIMAL (finds shortest path) but can be SLOWER than A* because
it does not use a heuristic — it explores in all directions equally.
"""

from collections import deque


def bfs(grid, start, end, rows, cols):
    """
    Run BFS from `start` to `end` on the given grid.

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
    explored : list of (row, col) in the order they were dequeued
    """

    # FIFO queue holds (node, path_so_far)
    queue = deque()
    queue.append((start, [list(start)]))

    # Visited set prevents re-processing
    visited = set()
    visited.add(start)

    # Explored list for visualization (order of dequeue)
    explored = []

    # 4-directional movement
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        current, path = queue.popleft()  # FIFO – oldest entry first
        explored.append(list(current))

        # Goal check
        if current == end:
            return path, explored

        # Expand neighbours
        for dr, dc in directions:
            nr, nc = current[0] + dr, current[1] + dc
            neighbour = (nr, nc)

            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1:
                continue
            if neighbour in visited:
                continue

            visited.add(neighbour)
            # Append new path (copy to avoid mutation)
            queue.append((neighbour, path + [list(neighbour)]))

    # No path found
    return [], explored
