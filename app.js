/**
 * 待办事项应用 — 扁平风格 + 自定义下拉 + 计划用时
 */

const STORAGE_KEY = "todo-app-tasks";
const STORAGE_PREFS = "todo-app-prefs";
const STORAGE_ARCHIVE = "todo-app-completed-archive";
const PRIORITIES = ["high", "medium", "low"];
const PRIORITY_LABELS = { high: "高", medium: "中", low: "低" };
const DURATION_MIN = 10;
const DURATION_MAX = 120;
const DURATION_STEP = 10;

/** @type {{ id: string, text: string, completed: boolean, priority: string, durationMinutes: number }[]} */
let tasks = [];
/** @type {string | null} */
let editingTaskId = null;

const taskInput = document.getElementById("taskInput");
const durationInput = document.getElementById("durationInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");
const emptyState = document.getElementById("emptyState");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const todayReportBtn = document.getElementById("todayReportBtn");
const reportModal = document.getElementById("reportModal");
const reportContent = document.getElementById("reportContent");
const closeReportBtn = document.getElementById("closeReportBtn");
const prioritySelectHost = document.getElementById("prioritySelectHost");
const durationSelectHost = document.getElementById("durationSelectHost");

const priorityOptions = PRIORITIES.map((p) => ({
  value: p,
  label: PRIORITY_LABELS[p],
}));

const durationOptions = [];
for (let m = DURATION_MIN; m <= DURATION_MAX; m += DURATION_STEP) {
  durationOptions.push({ value: String(m), label: `${m} 分钟` });
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFS);
    if (!raw) return { priority: "medium", duration: 30 };
    const p = JSON.parse(raw);
    return {
      priority: normalizePriority(p.priority),
      duration: normalizeDuration(p.duration),
    };
  } catch {
    return { priority: "medium", duration: 30 };
  }
}

function savePrefs(priority, duration) {
  localStorage.setItem(
    STORAGE_PREFS,
    JSON.stringify({ priority, duration })
  );
}

const prefs = loadPrefs();

/** @type {ReturnType<typeof FlatSelect.create>} */
let addPrioritySelect;
/** @type {ReturnType<typeof FlatSelect.create>} */
let addDurationSelect;

function initAddFormSelects() {
  addPrioritySelect = FlatSelect.create({
    ariaLabel: "重要程度",
    options: priorityOptions,
    value: prefs.priority,
    onChange: (val) => {
      savePrefs(val, getDurationFromInput());
    },
  });
  prioritySelectHost.appendChild(addPrioritySelect.element);

  addDurationSelect = FlatSelect.create({
    ariaLabel: "计划用时",
    options: durationOptions,
    value: String(prefs.duration),
    onChange: (val) => {
      durationInput.value = val;
      savePrefs(addPrioritySelect.getValue(), Number(val));
    },
  });
  durationSelectHost.appendChild(addDurationSelect.element);
  durationInput.value = String(prefs.duration);
}

function normalizePriority(value) {
  return PRIORITIES.includes(value) ? value : "medium";
}

function normalizeDuration(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 30;
  return Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.round(n)));
}

function getDurationFromInput() {
  return normalizeDuration(durationInput.value);
}

function isToday(isoString) {
  if (!isoString) return false;
  const d = new Date(isoString);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function parseCreatedAtFromId(id) {
  const match = id.match(/^task_(\d+)_/);
  if (match) {
    return new Date(Number(match[1])).toISOString();
  }
  return new Date().toISOString();
}

function migrateTask(raw) {
  const createdAt = raw.createdAt || parseCreatedAtFromId(raw.id);
  const durationMinutes = normalizeDuration(raw.durationMinutes ?? 30);
  let completedAt = raw.completedAt || null;
  let actualDurationMinutes =
    raw.actualDurationMinutes != null
      ? normalizeDuration(raw.actualDurationMinutes)
      : null;

  if (raw.completed && !completedAt) {
    completedAt = createdAt;
    actualDurationMinutes = actualDurationMinutes ?? durationMinutes;
  }

  if (!raw.completed) {
    completedAt = null;
    actualDurationMinutes = null;
  }

  return {
    ...raw,
    priority: normalizePriority(raw.priority),
    durationMinutes,
    createdAt,
    completedAt,
    actualDurationMinutes,
    archivedAt: raw.archivedAt || null,
  };
}

function formatMinutes(total) {
  if (total <= 0) return "0 分钟";
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h > 0 && m > 0) return `${h} 小时 ${m} 分钟`;
  if (h > 0) return `${h} 小时`;
  return `${m} 分钟`;
}

function getTodayDateLabel() {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

function loadArchive() {
  try {
    const raw = localStorage.getItem(STORAGE_ARCHIVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item) => migrateTask({ ...item, completed: true })) : [];
  } catch {
    return [];
  }
}

function saveArchive(archive) {
  localStorage.setItem(STORAGE_ARCHIVE, JSON.stringify(archive));
}

function snapshotTask(task) {
  return {
    id: task.id,
    text: task.text,
    completed: true,
    priority: normalizePriority(task.priority),
    durationMinutes: normalizeDuration(task.durationMinutes),
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    actualDurationMinutes:
      task.actualDurationMinutes ?? normalizeDuration(task.durationMinutes),
    archivedAt: new Date().toISOString(),
  };
}

function archiveTasks(taskList) {
  if (taskList.length === 0) return;
  const archive = loadArchive();
  const existingIds = new Set(archive.map((t) => t.id));
  taskList.forEach((t) => {
    const snap = snapshotTask(t);
    if (!existingIds.has(snap.id)) {
      archive.push(snap);
      existingIds.add(snap.id);
    }
  });
  saveArchive(archive);
}

function getTodayPlannedItems() {
  const archive = loadArchive();
  const map = new Map();

  tasks.forEach((t) => {
    if (isToday(t.createdAt)) {
      map.set(t.id, t);
    }
  });

  archive.forEach((t) => {
    if (isToday(t.createdAt) && !map.has(t.id)) {
      map.set(t.id, t);
    }
  });

  return Array.from(map.values());
}

function getTodayCompletedItems() {
  const archive = loadArchive();
  const map = new Map();

  tasks.forEach((t) => {
    if (t.completed && isToday(t.completedAt)) {
      map.set(t.id, t);
    }
  });

  archive.forEach((t) => {
    if (isToday(t.completedAt) && !map.has(t.id)) {
      map.set(t.id, t);
    }
  });

  return Array.from(map.values());
}

function buildTodayReport() {
  const plannedToday = getTodayPlannedItems();
  const completedToday = getTodayCompletedItems();

  const plannedCount = plannedToday.length;
  const doneCount = completedToday.length;
  const completionRate =
    plannedCount > 0 ? Math.round((doneCount / plannedCount) * 100) : 0;

  const totalPlannedMinutes = plannedToday.reduce(
    (sum, t) => sum + t.durationMinutes,
    0
  );
  const totalActualMinutes = completedToday.reduce(
    (sum, t) => sum + (t.actualDurationMinutes ?? t.durationMinutes),
    0
  );

  let longest = null;
  let shortest = null;

  completedToday.forEach((t) => {
    const mins = t.actualDurationMinutes ?? t.durationMinutes;
    if (!longest || mins > longest._mins) {
      longest = { ...t, _mins: mins };
    }
    if (!shortest || mins < shortest._mins) {
      shortest = { ...t, _mins: mins };
    }
  });

  return {
    plannedCount,
    doneCount,
    completionRate,
    totalPlannedMinutes,
    totalActualMinutes,
    longest,
    shortest,
    clearedCount: loadArchive().filter((t) => isToday(t.archivedAt)).length,
  };
}

function showTodayReport() {
  const report = buildTodayReport();

  if (report.plannedCount === 0 && report.doneCount === 0) {
    reportContent.innerHTML = `
      <p class="report-empty">今天还没有任务记录。<br />添加任务并完成后再来看看成果吧～</p>
    `;
  } else {
    const longestText = report.longest
      ? `「${escapeHtml(report.longest.text)}」（${report.longest._mins} 分钟）`
      : "—";
    const shortestText = report.shortest
      ? `「${escapeHtml(report.shortest.text)}」（${report.shortest._mins} 分钟）`
      : "—";

    reportContent.innerHTML = `
      <p><strong>${getTodayDateLabel()}</strong> 学习 / 工作小结：</p>
      <ul>
        <li>今日计划任务：<span class="report-highlight">${report.plannedCount}</span> 项</li>
        <li>实际完成任务：<span class="report-highlight">${report.doneCount}</span> 项</li>
        <li>完成度：<span class="report-highlight">${
          report.plannedCount > 0 ? `${report.completionRate}%` : "—"
        }</span></li>
        <li>计划总用时：${formatMinutes(report.totalPlannedMinutes)}</li>
        <li>实际总用时：${formatMinutes(report.totalActualMinutes)}</li>
        <li>耗时最长：${longestText}</li>
        <li>耗时最短：${shortestText}</li>
        ${
          report.clearedCount > 0
            ? `<li>已清空但仍计入统计：${report.clearedCount} 项</li>`
            : ""
        }
      </ul>
    `;
  }

  reportModal.hidden = false;
  reportModal.setAttribute("aria-hidden", "false");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function closeTodayReport() {
  reportModal.hidden = true;
  reportModal.setAttribute("aria-hidden", "true");
}

function syncDurationSelectFromInput() {
  const d = getDurationFromInput();
  durationInput.value = String(d);
  if (durationOptions.some((o) => o.value === String(d))) {
    addDurationSelect.setValue(String(d));
  }
}

durationInput.addEventListener("change", () => {
  const d = getDurationFromInput();
  durationInput.value = String(d);
  if (durationOptions.some((o) => o.value === String(d))) {
    addDurationSelect.setValue(String(d));
  }
  savePrefs(addPrioritySelect.getValue(), d);
});

durationInput.addEventListener("blur", () => {
  syncDurationSelectFromInput();
});

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      tasks = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      tasks = [];
      return;
    }
    tasks = parsed
      .filter(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.text === "string" &&
          typeof t.completed === "boolean"
      )
      .map((t) => migrateTask(t));
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function updateStats() {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;
  pendingCountEl.textContent = String(pending);
  completedCountEl.textContent = String(completed);

  const isEmpty = tasks.length === 0;
  emptyState.hidden = !isEmpty;
  taskList.hidden = isEmpty;

  clearCompletedBtn.disabled = completed === 0;
  clearAllBtn.disabled = tasks.length === 0;
}

function createFlatSelectForPriority(value, onChange) {
  const sel = FlatSelect.create({
    ariaLabel: "重要程度",
    options: priorityOptions,
    value: normalizePriority(value),
    onChange,
  });
  return sel;
}

function createFlatSelectForDuration(value, onChange) {
  const d = normalizeDuration(value);
  const val = durationOptions.some((o) => o.value === String(d))
    ? String(d)
    : String(Math.round(d / DURATION_STEP) * DURATION_STEP);
  const sel = FlatSelect.create({
    ariaLabel: "计划用时",
    options: durationOptions,
    value: val,
    onChange,
  });
  return sel;
}

function createPriorityBadge(priority) {
  const badge = document.createElement("span");
  badge.className = `priority-badge priority-${priority}`;
  badge.textContent = PRIORITY_LABELS[priority];
  return badge;
}

function createDurationBadge(minutes) {
  const badge = document.createElement("span");
  badge.className = "duration-badge";
  badge.textContent = `${minutes}分`;
  badge.setAttribute("aria-label", `计划用时 ${minutes} 分钟`);
  return badge;
}

function renderEditRow(task, li) {
  li.className = "task-item task-item-editing";
  li.dataset.id = task.id;

  const wrap = document.createElement("div");
  wrap.className = "edit-form";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "task-input edit-input";
  input.value = task.text;
  input.maxLength = 200;

  let editPriority = normalizePriority(task.priority);
  let editDuration = normalizeDuration(task.durationMinutes);

  const pri = createFlatSelectForPriority(task.priority, (v) => {
    editPriority = v;
  });

  const durRow = document.createElement("div");
  durRow.className = "duration-field edit-duration-row";

  const durSel = createFlatSelectForDuration(task.durationMinutes, (v) => {
    editDuration = Number(v);
    durManual.value = v;
  });

  const durManual = document.createElement("input");
  durManual.type = "number";
  durManual.className = "duration-input";
  durManual.min = String(DURATION_MIN);
  durManual.max = String(DURATION_MAX);
  durManual.value = String(editDuration);
  durManual.setAttribute("aria-label", "计划用时（分钟）");

  durManual.addEventListener("change", () => {
    editDuration = normalizeDuration(durManual.value);
    durManual.value = String(editDuration);
    if (durationOptions.some((o) => o.value === String(editDuration))) {
      durSel.setValue(String(editDuration));
    }
  });

  durRow.appendChild(durSel.element);
  durRow.appendChild(durManual);

  const actions = document.createElement("div");
  actions.className = "edit-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn btn-primary btn-sm";
  saveBtn.textContent = "保存";
  saveBtn.addEventListener("click", () =>
    saveEdit(task.id, input.value, editPriority, getEditDuration())
  );

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-secondary btn-sm";
  cancelBtn.textContent = "取消";
  cancelBtn.addEventListener("click", () => {
    editingTaskId = null;
    render();
  });

  function getEditDuration() {
    return normalizeDuration(durManual.value);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveEdit(task.id, input.value, editPriority, getEditDuration());
    }
    if (e.key === "Escape") {
      editingTaskId = null;
      render();
    }
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  wrap.appendChild(input);
  wrap.appendChild(pri.element);
  wrap.appendChild(durRow);
  wrap.appendChild(actions);
  li.appendChild(wrap);

  setTimeout(() => input.focus(), 0);
}

function renderTaskRow(task) {
  const li = document.createElement("li");
  const priority = normalizePriority(task.priority);
  const duration = normalizeDuration(task.durationMinutes);

  if (editingTaskId === task.id) {
    renderEditRow(task, li);
    return li;
  }

  li.className =
    `task-item priority-border-${priority}` + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "标记完成");
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const body = document.createElement("div");
  body.className = "task-body";

  const mainLine = document.createElement("div");
  mainLine.className = "task-main-line";

  const badges = document.createElement("div");
  badges.className = "task-meta-badges";
  badges.appendChild(createPriorityBadge(priority));
  badges.appendChild(createDurationBadge(duration));

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  span.title = task.text + "（双击编辑）";
  span.addEventListener("dblclick", () => startEdit(task.id));

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn-edit";
  editBtn.textContent = "编辑";
  editBtn.addEventListener("click", () => startEdit(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "删除";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  mainLine.appendChild(badges);
  mainLine.appendChild(span);
  mainLine.appendChild(actions);
  body.appendChild(mainLine);

  li.appendChild(checkbox);
  li.appendChild(body);
  return li;
}

function render() {
  taskList.innerHTML = "";

  const sorted = [...tasks].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (
      order[normalizePriority(a.priority)] - order[normalizePriority(b.priority)]
    );
  });

  sorted.forEach((task) => {
    taskList.appendChild(renderTaskRow(task));
  });

  updateStats();
}

function startEdit(id) {
  editingTaskId = id;
  render();
}

function saveEdit(id, text, priority, durationMinutes) {
  const trimmed = text.trim();
  if (!trimmed) {
    alert("任务内容不能为空");
    return;
  }
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.text = trimmed;
  task.priority = normalizePriority(priority);
  task.durationMinutes = normalizeDuration(durationMinutes);
  if (task.completed) {
    task.actualDurationMinutes = task.durationMinutes;
  }
  editingTaskId = null;
  saveTasks();
  render();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  const priority = addPrioritySelect.getValue();
  const duration = getDurationFromInput();

  tasks.unshift({
    id: createId(),
    text,
    completed: false,
    priority: normalizePriority(priority),
    durationMinutes: duration,
    createdAt: new Date().toISOString(),
    completedAt: null,
    actualDurationMinutes: null,
  });

  taskInput.value = "";
  savePrefs(priority, duration);
  saveTasks();
  render();
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  if (!task.completed) {
    task.completed = true;
    task.completedAt = new Date().toISOString();
    task.actualDurationMinutes = task.durationMinutes;
  } else {
    task.completed = false;
    task.completedAt = null;
    task.actualDurationMinutes = null;
  }

  saveTasks();
  render();
}

function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (editingTaskId === id) editingTaskId = null;
  if (task?.completed) {
    archiveTasks([task]);
  }
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  const toArchive = tasks.filter((t) => t.completed);
  if (toArchive.length === 0) return;
  archiveTasks(toArchive);
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

function clearAll() {
  if (tasks.length === 0) return;
  if (
    !confirm(
      "确定要清空全部任务吗？此操作将直接删除列表中的任务（不可恢复）。\n若需保留今日成果统计，请先使用「清空已完成」。"
    )
  ) {
    return;
  }
  editingTaskId = null;
  tasks = [];
  saveTasks();
  render();
}

addBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompleted);
clearAllBtn.addEventListener("click", clearAll);
todayReportBtn.addEventListener("click", showTodayReport);
closeReportBtn.addEventListener("click", closeTodayReport);
reportModal.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeTodayReport);
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

initAddFormSelects();
loadTasks();
render();
