"""
Depth-First Search (DFS)
------------------------
Uses a LIFO stack.  Dives as deep as possible along each branch before
backtracking.  DFS is NOT OPTIMAL – it may find a path but it is
unlikely to be the shortest one.

DFS is included here to contrast with A* and BFS and illustrate why
heuristic-driven / level-order search is preferred for route-finding.
"""


def dfs(grid, start, end, rows, cols):
    """
    Run DFS from `start` to `end` on the given grid.

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
    explored : list of (row, col) in the order they were popped
    """

    # LIFO stack holds (node, path_so_far)
    stack = [(start, [list(start)])]

    # Visited set prevents infinite loops
    visited = set()
    visited.add(start)

    # Explored list for visualization
    explored = []

    # 4-directional movement (order affects which branch is explored first)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while stack:
        current, path = stack.pop()  # LIFO – most-recently-added first
        explored.append(list(current))

        # Goal check
        if current == end:
            return path, explored

        # Push neighbours onto stack (reversed so top = first direction)
        for dr, dc in reversed(directions):
            nr, nc = current[0] + dr, current[1] + dc
            neighbour = (nr, nc)

            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1:
                continue
            if neighbour in visited:
                continue

            visited.add(neighbour)
            stack.append((neighbour, path + [list(neighbour)]))

    # No path found
    return [], explored
