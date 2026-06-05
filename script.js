const STORAGE_KEY = "todo2026.tasks";
const ARCHIVE_KEY = "todo2026.completedArchive";

const priorityMap = {
  high: { label: "高", color: "#f05252" },
  medium: { label: "中", color: "#e6a700" },
  low: { label: "低", color: "#2ab673" }
};

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const prioritySelect = document.querySelector("#prioritySelect");
const timeInput = document.querySelector("#timeInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const clearCompletedButton = document.querySelector("#clearCompletedButton");
const clearAllButton = document.querySelector("#clearAllButton");
const summaryButton = document.querySelector("#summaryButton");
const summaryDialog = document.querySelector("#summaryDialog");
const closeSummaryButton = document.querySelector("#closeSummaryButton");
const summaryContent = document.querySelector("#summaryContent");
const exportButton = document.querySelector("#exportButton");

let tasks = loadJson(STORAGE_KEY, []);
let completedArchive = loadJson(ARCHIVE_KEY, []);

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(completedArchive));
}

function normalizeMinutes(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) {
    return 30;
  }
  return Math.min(120, Math.max(10, Math.round(minutes)));
}

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createTask(text, priority, minutes) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    text,
    priority,
    minutes,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function archiveCompleted(items) {
  const archived = items
    .filter((task) => task.completed)
    .map((task) => ({
      ...task,
      archivedAt: new Date().toISOString(),
      completedAt: task.completedAt || new Date().toISOString()
    }));

  completedArchive = [...completedArchive, ...archived];
}

function getReportTasks() {
  return [...tasks, ...completedArchive];
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const priority = priorityMap[task.priority] || priorityMap.medium;
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    item.style.setProperty("--priority-color", priority.color);
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `标记 ${task.text} 为完成`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const main = document.createElement("div");
    main.className = "task-main";

    const priorityPill = document.createElement("span");
    priorityPill.className = "task-pill";
    priorityPill.textContent = `${priority.label}重要`;

    const time = document.createElement("span");
    time.className = "task-time";
    time.textContent = `${task.minutes}分钟`;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    main.append(priorityPill, time, text);

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "编辑";
    editButton.addEventListener("click", () => startEdit(task.id, main));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    buttons.append(editButton, deleteButton);
    item.append(checkbox, main, buttons);
    taskList.append(item);
  });

  const completed = tasks.filter((task) => task.completed).length;
  pendingCount.textContent = String(tasks.length - completed);
  completedCount.textContent = String(completed);
  emptyState.classList.toggle("show", tasks.length === 0);
}

function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  const task = createTask(text, prioritySelect.value, normalizeMinutes(timeInput.value));
  tasks = [task, ...tasks];
  save();
  render();
  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }
    const completed = !task.completed;
    return {
      ...task,
      completed,
      completedAt: completed ? new Date().toISOString() : null
    };
  });
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save();
  render();
}

function startEdit(id, main) {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  main.innerHTML = "";

  const priority = document.createElement("select");
  priority.className = "task-edit-input";
  priority.setAttribute("aria-label", "编辑重要程度");
  Object.entries(priorityMap).forEach(([value, item]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = item.label;
    option.selected = value === task.priority;
    priority.append(option);
  });

  const minutes = document.createElement("input");
  minutes.className = "task-edit-input";
  minutes.type = "number";
  minutes.min = "10";
  minutes.max = "120";
  minutes.step = "10";
  minutes.value = task.minutes;
  minutes.setAttribute("aria-label", "编辑计划用时");

  const text = document.createElement("input");
  text.className = "task-edit-input";
  text.type = "text";
  text.value = task.text;
  text.setAttribute("aria-label", "编辑任务内容");

  main.append(priority, minutes, text);
  text.focus();
  text.select();

  const commit = () => {
    const nextText = text.value.trim();
    if (!nextText) {
      render();
      return;
    }

    tasks = tasks.map((item) =>
      item.id === id
        ? {
            ...item,
            text: nextText,
            priority: priority.value,
            minutes: normalizeMinutes(minutes.value)
          }
        : item
    );
    save();
    render();
  };

  [priority, minutes, text].forEach((control) => {
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        commit();
      }
      if (event.key === "Escape") {
        render();
      }
    });
  });

  text.addEventListener("blur", commit, { once: true });
}

function clearCompleted() {
  archiveCompleted(tasks);
  tasks = tasks.filter((task) => !task.completed);
  save();
  render();
}

function clearAll() {
  if (!tasks.length && !completedArchive.length) {
    return;
  }

  const confirmed = confirm("确定要全部清空吗？这会真正删除当前任务和已归档的完成记录。");
  if (!confirmed) {
    return;
  }

  tasks = [];
  completedArchive = [];
  save();
  render();
}

function showSummary() {
  const all = getReportTasks();
  const planned = all.length;
  const completed = all.filter((task) => task.completed).length;
  const completionRate = planned ? Math.round((completed / planned) * 100) : 0;
  const totalMinutes = all.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const longest = all.reduce((result, task) => (!result || task.minutes > result.minutes ? task : result), null);
  const shortest = all.reduce((result, task) => (!result || task.minutes < result.minutes ? task : result), null);

  const cells = [
    ["计划任务", `${planned} 个`],
    ["实际完成", `${completed} 个`],
    ["完成度", `${completionRate}%`],
    ["计划总用时", `${totalMinutes} 分钟`],
    ["耗时最长", longest ? `${longest.text}（${longest.minutes}分钟）` : "暂无"],
    ["耗时最短", shortest ? `${shortest.text}（${shortest.minutes}分钟）` : "暂无"]
  ];

  summaryContent.innerHTML = cells
    .map(([label, value]) => `<section class="summary-cell"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></section>`)
    .join("");

  if (typeof summaryDialog.showModal === "function") {
    summaryDialog.showModal();
  } else {
    alert(cells.map(([label, value]) => `${label}：${value}`).join("\n"));
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function exportExcel() {
  const rows = getReportTasks().map((task) => [
    task.text,
    priorityMap[task.priority]?.label || "中",
    `${task.minutes}分钟`,
    task.completed ? "是" : "否"
  ]);

  const tableRows = [
    `<tr><th colspan="4">我的待办清单 ${formatDate()}</th></tr>`,
    "<tr><th>任务名称</th><th>重要程度</th><th>计划用时</th><th>是否完成</th></tr>",
    ...rows.map(
      (row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
  ].join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${tableRows}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${formatDate()}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

taskForm.addEventListener("submit", addTask);
clearCompletedButton.addEventListener("click", clearCompleted);
clearAllButton.addEventListener("click", clearAll);
summaryButton.addEventListener("click", showSummary);
closeSummaryButton.addEventListener("click", () => summaryDialog.close());
exportButton.addEventListener("click", exportExcel);
summaryDialog.addEventListener("click", (event) => {
  if (event.target === summaryDialog) {
    summaryDialog.close();
  }
});

timeInput.addEventListener("change", () => {
  timeInput.value = normalizeMinutes(timeInput.value);
});

render();
