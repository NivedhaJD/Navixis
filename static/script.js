/* ─────────────────────────────────────────────────────────
   Smart Ambulance Route Finder – script.js
   Handles: grid rendering, user interactions, API calls,
            step-by-step animation, comparison table
──────────────────────────────────────────────────────────── */

// ── CONFIG ──────────────────────────────────────────────
const ROWS = 22;
const COLS = 32;

// Speed levels map slider value → delay in ms per step
const SPEED_MAP = { 1: 120, 2: 60, 3: 25, 4: 10, 5: 2 };

// ── STATE ────────────────────────────────────────────────
let grid        = [];   // 2D array: 0=open, 1=wall
let startCell   = null; // [row,col]
let endCell     = null; // [row,col]
let mode        = 'start'; // 'start'|'end'|'wall'|'erase'
let isMouseDown = false;
let isRunning   = false;
let animationQueue = []; // pending timeouts (for cancel)

// ── ALGORITHM INFO TEXT ──────────────────────────────────
const ALGO_INFO = {
  astar: `
    <h4>A* Search Algorithm</h4>
    <span class="tag tag-green">✔ Optimal</span>
    <span class="tag tag-green">✔ Fast</span>
    <span class="tag tag-blue">Heuristic-guided</span>
    <p>Uses <strong>f(n) = g(n) + h(n)</strong> where g(n) is the cost from start and h(n) is the Manhattan distance to the goal. The heuristic guides the search toward the hospital, making it the fastest algorithm in most cases.</p>`,

  bfs: `
    <h4>Breadth-First Search</h4>
    <span class="tag tag-green">✔ Optimal</span>
    <span class="tag tag-amber">Moderate speed</span>
    <span class="tag tag-blue">Queue (FIFO)</span>
    <p>Explores all nodes at distance <em>d</em> before any node at <em>d+1</em>. Guaranteed to find the shortest path but explores in all directions equally — no heuristic guidance. More nodes visited than A*.</p>`,

  dfs: `
    <h4>Depth-First Search</h4>
    <span class="tag tag-red">✘ Not Optimal</span>
    <span class="tag tag-amber">Unpredictable</span>
    <span class="tag tag-blue">Stack (LIFO)</span>
    <p>Dives as deep as possible along one branch before backtracking. Can find <em>a</em> path quickly but not the <em>shortest</em> path. Rarely used for routing in real emergency systems — included here for educational comparison.</p>`
};

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  showInfo('astar', document.querySelector('.info-tab'));
  setMode('start');

  // Radio change → update HUD
  document.querySelectorAll('input[name="algo"]').forEach(r =>
    r.addEventListener('change', updateHud)
  );

  // Speed slider
  document.getElementById('speed-slider').addEventListener('input', () => {});
});

// ── BUILD GRID ────────────────────────────────────────────
function buildGrid() {
  // Initialize 2D array
  grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));

  const container = document.getElementById('grid-container');
  container.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  // Calculate cell size to fit viewport (accounting for side panels)
  const maxW = Math.floor((window.innerWidth - 680) / COLS);
  const maxH = Math.floor((window.innerHeight - 180) / ROWS);
  const cellSize = Math.max(6, Math.min(maxW, maxH, 24));

  container.innerHTML = '';
  // Container width: (cols * cellSize) + ((cols - 1) * 2px gap) + 8px padding
  container.style.width  = `${(COLS * cellSize) + ((COLS - 1) * 2) + 8}px`;
  // Container height: (rows * cellSize) + ((rows - 1) * 2px gap) + 8px padding
  container.style.height = `${(ROWS * cellSize) + ((ROWS - 1) * 2) + 8}px`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.style.width  = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;

      // Mouse events
      cell.addEventListener('mousedown', onCellMouseDown);
      cell.addEventListener('mouseenter', onCellMouseEnter);

      container.appendChild(cell);
    }
  }

  document.addEventListener('mouseup', () => { isMouseDown = false; });

  // Place default start/end
  startCell = [3, 3];
  endCell   = [ROWS - 4, COLS - 4];
  applyCellClass(startCell, 'start');
  applyCellClass(endCell,   'end');
}

// ── CELL INTERACTION ──────────────────────────────────────
function onCellMouseDown(e) {
  if (isRunning) return;
  isMouseDown = true;
  handleCellClick(e.currentTarget);
}

function onCellMouseEnter(e) {
  if (!isMouseDown || isRunning) return;
  if (mode === 'wall' || mode === 'erase') {
    handleCellClick(e.currentTarget);
  }
}

function handleCellClick(cellEl) {
  const r = parseInt(cellEl.dataset.r);
  const c = parseInt(cellEl.dataset.c);

  if (mode === 'start') {
    // Remove old start
    if (startCell) getCellEl(...startCell)?.classList.remove('start','start-icon');
    startCell = [r, c];
    // Clear wall if placed on wall
    grid[r][c] = 0;
    applyCellClass([r,c], 'start');
    setMode('end');

  } else if (mode === 'end') {
    if (endCell) getCellEl(...endCell)?.classList.remove('end','end-icon');
    endCell = [r, c];
    grid[r][c] = 0;
    applyCellClass([r,c], 'end');
    setMode('wall');

  } else if (mode === 'wall') {
    if (isStartOrEnd(r,c)) return;
    grid[r][c] = 1;
    const el = getCellEl(r,c);
    el.className = 'cell wall';

  } else if (mode === 'erase') {
    if (isStartOrEnd(r,c)) return;
    grid[r][c] = 0;
    const el = getCellEl(r,c);
    el.className = 'cell';
  }
}

function isStartOrEnd(r, c) {
  return (startCell && startCell[0]===r && startCell[1]===c) ||
         (endCell   && endCell[0]===r   && endCell[1]===c);
}

function getCellEl(r, c) {
  return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function applyCellClass([r,c], cls) {
  const el = getCellEl(r,c);
  if (!el) return;
  // Remove path/explored/wall before adding start/end
  el.className = `cell ${cls} ${cls}-icon`;
}

// ── MODE ──────────────────────────────────────────────────
function setMode(m) {
  mode = m;
  ['start','end','wall','erase'].forEach(id => {
    document.getElementById(`btn-${id}`)?.classList.remove('active');
  });
  document.getElementById(`btn-${m}`)?.classList.add('active');
  updateHud();
}

function updateHud() {
  const modeLabel = {
    start: 'SET AMBULANCE LOCATION',
    end:   'SET HOSPITAL LOCATION',
    wall:  'DRAW TRAFFIC BLOCKS',
    erase: 'ERASE MODE'
  }[mode];
  document.getElementById('hud-mode').textContent = `MODE: ${modeLabel}`;

  const algo = document.querySelector('input[name="algo"]:checked')?.value.toUpperCase() || 'A*';
  document.getElementById('hud-algo').textContent = `ALGORITHM: ${algo === 'ASTAR' ? 'A★' : algo}`;
}

// ── RUN ALGORITHM ─────────────────────────────────────────
async function runAlgorithm() {
  if (isRunning) return;
  if (!startCell || !endCell) { showToast('⚠ Place ambulance and hospital first!'); return; }

  const algo = document.querySelector('input[name="algo"]:checked').value;

  // Cancel old animations
  animationQueue.forEach(clearTimeout);
  animationQueue = [];
  resetPathCells();

  isRunning = true;
  setStatus('DISPATCHING…', '#f59e0b');
  document.getElementById('btn-run').classList.add('running');
  document.getElementById('btn-run').disabled = true;
  document.getElementById('comparison-section').style.display = 'none';

  try {
    const payload = {
      grid,
      start: startCell,
      end: endCell,
      algorithm: algo
    };

    const res = await fetch('/find_path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (algo === 'all') {
      await animateAll(data);
    } else {
      await animateSingle(algo, data[algo]);
    }

  } catch (err) {
    showToast('❌ Server error: ' + err.message);
    finishRun();
  }
}

function finishRun() {
  isRunning = false;
  document.getElementById('btn-run').classList.remove('running');
  document.getElementById('btn-run').disabled = false;
}

// ── ANIMATE SINGLE ────────────────────────────────────────
function animateSingle(algoName, result) {
  return new Promise(resolve => {
    if (!result) { showToast('No result from server'); finishRun(); resolve(); return; }

    const { explored, path, nodes_explored, path_length, time_ms } = result;
    const delay = SPEED_MAP[document.getElementById('speed-slider').value] || 25;

    let i = 0;
    // Animate explored nodes
    function stepExplore() {
      if (i >= explored.length) {
        // After exploration → draw path
        animatePath(path, delay, () => {
          updateMetrics(nodes_explored, path_length, time_ms, path.length > 0);
          finishRun();
          resolve();
        });
        return;
      }
      const [r,c] = explored[i];
      if (!isStartOrEnd(r,c)) {
        const el = getCellEl(r,c);
        if (el) el.classList.add('explored');
      }
      i++;
      const tid = setTimeout(stepExplore, delay);
      animationQueue.push(tid);
    }
    stepExplore();
  });
}

function animatePath(path, delay, onDone) {
  if (!path || path.length === 0) {
    setStatus('NO ROUTE FOUND', '#ef4444');
    showToast('🚫 No path found! Remove some traffic blocks.');
    onDone && onDone();
    return;
  }
  let i = 0;
  function step() {
    if (i >= path.length) {
      setStatus('ROUTE FOUND ✓', '#22c55e');
      showToast('✅ Route dispatched successfully!');
      onDone && onDone();
      return;
    }
    const [r,c] = path[i];
    const el = getCellEl(r,c);
    if (el && !isStartOrEnd(r,c)) {
      el.classList.remove('explored');
      el.classList.add('path');
    }
    i++;
    const tid = setTimeout(step, delay * 3);
    animationQueue.push(tid);
  }
  step();
}

// ── ANIMATE ALL (compare mode) ────────────────────────────
async function animateAll(data) {
  const delay = SPEED_MAP[document.getElementById('speed-slider').value] || 25;
  const algos = ['astar','bfs','dfs'];

  for (const algo of algos) {
    const result = data[algo];
    if (!result) continue;

    resetPathCells();
    setStatus(`RUNNING ${algo.toUpperCase()}…`, '#f59e0b');
    await animateSingle(algo, result);

    // brief pause between algos
    await sleep(400);
  }

  // Show comparison table
  showComparison(data);
  finishRun();
}

// ── COMPARISON TABLE ──────────────────────────────────────
function showComparison(data) {
  const section = document.getElementById('comparison-section');
  const tbody   = document.getElementById('cmp-tbody');
  section.style.display = 'block';
  tbody.innerHTML = '';

  const rows = [
    { key:'astar', label:'A★ Search',   badge:'badge-astar' },
    { key:'bfs',   label:'BFS',         badge:'badge-bfs'   },
    { key:'dfs',   label:'DFS',         badge:'badge-dfs'   }
  ];

  // Determine best path length among those that found a path
  const found = rows.filter(r => data[r.key]?.path_length > 0);
  const minPath = found.length ? Math.min(...found.map(r => data[r.key].path_length)) : Infinity;

  rows.forEach(({ key, label, badge }) => {
    const d = data[key];
    if (!d) return;
    const tr = document.createElement('tr');
    const optimal = (key === 'astar' || key === 'bfs') && d.path_length === minPath && d.path_length > 0;
    if (optimal) tr.classList.add('best-row');

    tr.innerHTML = `
      <td><span class="algo-badge ${badge}">${label}</span></td>
      <td>${d.path_length || '—'}</td>
      <td>${d.nodes_explored}</td>
      <td>${d.time_ms}</td>
      <td>${optimal
        ? '<span class="badge-optimal">✔ Yes</span>'
        : (key==='dfs' ? '<span class="badge-no">✘ No</span>' : '<span class="badge-no">—</span>')
      }</td>`;
    tbody.appendChild(tr);
  });

  // Verdict
  const astar = data.astar;
  const bfs   = data.bfs;
  const dfs   = data.dfs;
  document.getElementById('verdict-box').innerHTML = `
    <strong>Verdict:</strong>
    A★ explored <strong>${astar?.nodes_explored ?? '?'}</strong> nodes vs
    BFS <strong>${bfs?.nodes_explored ?? '?'}</strong> —
    A★ is <strong>${bfs && astar ? Math.round((1 - astar.nodes_explored / bfs.nodes_explored)*100) : '?'}% more efficient</strong>
    thanks to its heuristic. DFS found a path of length
    <strong>${dfs?.path_length || 'none'}</strong>
    vs optimal <strong>${minPath === Infinity ? '?' : minPath}</strong> — confirming it is <em>not optimal</em>.`;
}

// ── METRICS ───────────────────────────────────────────────
function updateMetrics(explored, pathLen, time, found) {
  document.getElementById('m-explored').textContent = explored;
  document.getElementById('m-path').textContent     = pathLen || '—';
  document.getElementById('m-time').textContent     = time;
  document.getElementById('m-status').textContent   = found ? 'FOUND ✓' : 'NO PATH';
  document.getElementById('m-status').style.color   = found ? 'var(--green)' : 'var(--red)';
}

// ── STATUS ────────────────────────────────────────────────
function setStatus(txt, color='#94a3b8') {
  const el = document.getElementById('status-text');
  el.textContent = txt;
  el.style.color = color;
}

// ── CLEAR / RESET ─────────────────────────────────────────
function clearGrid() {
  animationQueue.forEach(clearTimeout);
  animationQueue = [];
  isRunning = false;
  startCell = null;
  endCell   = null;
  grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  document.querySelectorAll('.cell').forEach(el => { el.className = 'cell'; });
  document.getElementById('comparison-section').style.display = 'none';
  resetMetrics();
  setStatus('SYSTEM READY', '#22c55e');
  setMode('start');
  finishRun();
}

function resetPath() {
  animationQueue.forEach(clearTimeout);
  animationQueue = [];
  isRunning = false;
  resetPathCells();
  resetMetrics();
  setStatus('SYSTEM READY', '#22c55e');
  document.getElementById('comparison-section').style.display = 'none';
  finishRun();
}

function resetPathCells() {
  document.querySelectorAll('.cell.explored, .cell.path').forEach(el => {
    el.classList.remove('explored','path');
  });
}

function resetMetrics() {
  ['m-explored','m-path','m-time','m-status'].forEach(id => {
    document.getElementById(id).textContent = '—';
    document.getElementById(id).style.color = '';
  });
}

// ── INFO TABS ─────────────────────────────────────────────
function showInfo(key, btn) {
  document.querySelectorAll('.info-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('info-content').innerHTML = ALGO_INFO[key] || '';
}

// ── TOAST ─────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── UTIL ──────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
