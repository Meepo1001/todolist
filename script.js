const STORAGE_KEY = "todo2026.tasks";
const ARCHIVE_KEY = "todo2026.completedArchive";
const START_TIME_KEY = "todo2026.dayStartTime";
const PLANS_KEY = "todo2026.plans";
const PROJECTS_KEY = "todo2026.projects";
const CALENDAR_CACHE_KEY = "todo2026.calendarCache";
const DB_NAME = "todo2026.calendar";
const STORE_NAME = "handles";
const DIRECTORY_HANDLE_KEY = "workbookDirectory";

const label = {
  high: "\u9ad8",
  medium: "\u4e2d",
  low: "\u4f4e",
  important: "\u91cd\u8981",
  minute: "\u5206\u949f",
  edit: "\u7f16\u8f91",
  delete: "\u5220\u9664",
  save: "\u4fdd\u5b58",
  cancel: "\u53d6\u6d88",
  yes: "\u662f",
  no: "\u5426",
  taskName: "\u4efb\u52a1\u540d\u79f0",
  priority: "\u91cd\u8981\u7a0b\u5ea6",
  plannedTime: "\u8ba1\u5212\u7528\u65f6",
  taskDate: "\u4efb\u52a1\u65e5\u671f",
  startTime: "\u5f00\u59cb\u65f6\u95f4",
  meeting: "\u62c9\u4f1a",
  week: "\u672c\u5468",
  busy: "\u5df2\u5b89\u6392",
  completed: "\u662f\u5426\u5b8c\u6210",
  todoTitle: "\u6211\u7684\u5f85\u529e\u6e05\u5355",
  calendarTitle: "\u5de5\u4f5c\u65e5\u5386",
  noFolder: "\u8fd8\u6ca1\u6709\u8bbe\u7f6e\u6570\u636e\u6587\u4ef6\u5939\u3002",
  chooseFolderFirst: "\u8bf7\u5148\u901a\u8fc7\u9f7f\u8f6e\u8bbe\u7f6e\u6570\u636e\u6587\u4ef6\u5939\u3002",
  folderReady: "\u5df2\u8bbe\u7f6e\u9ed8\u8ba4\u6570\u636e\u6587\u4ef6\u5939\u3002",
  unsupportedFolder: "\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6587\u4ef6\u5939\u6388\u6743\uff0c\u8bf7\u6362\u7528 Chrome \u6216 Edge\u3002",
  loading: "\u6b63\u5728\u8bfb\u53d6\u6bcf\u65e5\u8868\u683c...",
  loaded: "\u5df2\u8bfb\u53d6",
  files: "\u4e2a\u8868\u683c\u6587\u4ef6",
  noFiles: "\u6587\u4ef6\u5939\u91cc\u8fd8\u6ca1\u6709\u53ef\u8bfb\u53d6\u7684 .xlsx \u8868\u683c\u3002",
  permissionNeeded: "\u9700\u8981\u91cd\u65b0\u6388\u6743\u624d\u80fd\u8bfb\u5199\u8fd9\u4e2a\u6587\u4ef6\u5939\u3002",
  exportSaved: "\u8868\u683c\u5df2\u66f4\u65b0\u5230\u9ed8\u8ba4\u6570\u636e\u6587\u4ef6\u5939\u3002",
  exportDownloaded: "\u6ca1\u6709\u53ef\u5199\u5165\u7684\u6570\u636e\u6587\u4ef6\u5939\uff0c\u5df2\u6539\u4e3a\u666e\u901a\u4e0b\u8f7d\u3002",
  parseWarning: "\u90e8\u5206\u6587\u4ef6\u6ca1\u6709\u8bfb\u53d6\u6210\u529f\uff0c\u8bf7\u786e\u8ba4\u5b83\u4eec\u662f\u672c\u5e94\u7528\u751f\u6210\u7684 .xlsx\u3002",
  plannedTasks: "\u8ba1\u5212\u4efb\u52a1",
  actualCompleted: "\u5b9e\u9645\u5b8c\u6210",
  completionRate: "\u5b8c\u6210\u5ea6",
  totalTime: "\u8ba1\u5212\u603b\u7528\u65f6",
  longest: "\u8017\u65f6\u6700\u957f",
  shortest: "\u8017\u65f6\u6700\u77ed",
  none: "\u6682\u65e0",
  totalDays: "\u8bb0\u5f55\u5929\u6570",
  totalTasks: "\u603b\u4efb\u52a1",
  completedTasks: "\u5df2\u5b8c\u6210",
  selectDay: "\u9009\u62e9\u4e00\u5929\u67e5\u770b\u4efb\u52a1\u8be6\u60c5\u3002",
  emptyDay: "\u8fd9\u4e00\u5929\u6ca1\u6709\u4efb\u52a1\u8bb0\u5f55\u3002"
};

const priorityMap = {
  high: { label: label.high, color: "#f05252", rank: 3 },
  medium: { label: label.medium, color: "#e6a700", rank: 2 },
  low: { label: label.low, color: "#2ab673", rank: 1 }
};

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const prioritySelect = document.querySelector("#prioritySelect");
const timeInput = document.querySelector("#timeInput");
const taskDateInput = document.querySelector("#taskDateInput");
const dayStartInput = document.querySelector("#dayStartInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const clearCompletedButton = document.querySelector("#clearCompletedButton");
const deferButton = document.querySelector("#deferButton");
const clearAllButton = document.querySelector("#clearAllButton");
const summaryButton = document.querySelector("#summaryButton");
const summaryDialog = document.querySelector("#summaryDialog");
const closeSummaryButton = document.querySelector("#closeSummaryButton");
const summaryContent = document.querySelector("#summaryContent");
const calendarButton = document.querySelector("#calendarButton");
const meetingButton = document.querySelector("#meetingButton");
const calendarSettingsButton = document.querySelector("#calendarSettingsButton");
const calendarDialog = document.querySelector("#calendarDialog");
const closeCalendarButton = document.querySelector("#closeCalendarButton");
const calendarStatus = document.querySelector("#calendarStatus");
const calendarStats = document.querySelector("#calendarStats");
const calendarScroller = document.querySelector("#calendarScroller");
const dayDetail = document.querySelector("#dayDetail");
const settingsDialog = document.querySelector("#settingsDialog");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const folderStatus = document.querySelector("#folderStatus");
const chooseFolderButton = document.querySelector("#chooseFolderButton");
const refreshCalendarButton = document.querySelector("#refreshCalendarButton");
const clearFolderButton = document.querySelector("#clearFolderButton");
const meetingDialog = document.querySelector("#meetingDialog");
const closeMeetingButton = document.querySelector("#closeMeetingButton");
const meetingStatus = document.querySelector("#meetingStatus");
const meetingWeekLabel = document.querySelector("#meetingWeekLabel");
const meetingGrid = document.querySelector("#meetingGrid");
const meetingGridWrap = document.querySelector("#meetingGridWrap");
const prevWeekButton = document.querySelector("#prevWeekButton");
const nextWeekButton = document.querySelector("#nextWeekButton");
const plansButton = document.querySelector("#plansButton");
const projectsButton = document.querySelector("#projectsButton");
const plansDialog = document.querySelector("#plansDialog");
const projectsDialog = document.querySelector("#projectsDialog");
const closePlansButton = document.querySelector("#closePlansButton");
const closeProjectsButton = document.querySelector("#closeProjectsButton");
const planForm = document.querySelector("#planForm");
const planTitleInput = document.querySelector("#planTitleInput");
const planStartInput = document.querySelector("#planStartInput");
const planEndInput = document.querySelector("#planEndInput");
const planTotalHoursInput = document.querySelector("#planTotalHoursInput");
const planDailyHoursInput = document.querySelector("#planDailyHoursInput");
const planStartTimeInput = document.querySelector("#planStartTimeInput");
const planPriorityInput = document.querySelector("#planPriorityInput");
const plansList = document.querySelector("#plansList");
const projectForm = document.querySelector("#projectForm");
const projectTitleInput = document.querySelector("#projectTitleInput");
const projectsList = document.querySelector("#projectsList");
const appDialog = document.querySelector("#appDialog");
const appDialogTitle = document.querySelector("#appDialogTitle");
const appDialogMessage = document.querySelector("#appDialogMessage");
const appDialogInput = document.querySelector("#appDialogInput");
const appDialogCloseButton = document.querySelector("#appDialogCloseButton");
const appDialogCancelButton = document.querySelector("#appDialogCancelButton");
const appDialogConfirmButton = document.querySelector("#appDialogConfirmButton");

let tasks = loadJson(STORAGE_KEY, []);
let completedArchive = loadJson(ARCHIVE_KEY, []);
let plans = loadJson(PLANS_KEY, []);
let projects = loadJson(PROJECTS_KEY, []);
let dayStartTime = localStorage.getItem(START_TIME_KEY) || "09:00";
let sortRules = [];
let sortClickTimer = null;
let directoryHandle = null;
let calendarDays = [];
let selectedDay = null;
let meetingWeekStart = parseDate(formatDate(new Date()));
let draggedTaskId = null;
let editingPlanId = null;

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clearCalendarCache() {
  localStorage.removeItem(CALENDAR_CACHE_KEY);
}

function showAppDialog({ title = "\u63d0\u793a", message = "", input = false, placeholder = "", confirmText = "\u786e\u5b9a", cancelText = "\u53d6\u6d88" }) {
  return new Promise((resolve) => {
    appDialogTitle.textContent = title;
    appDialogMessage.textContent = message;
    appDialogInput.value = "";
    appDialogInput.placeholder = placeholder;
    appDialog.classList.toggle("with-input", input);
    appDialogConfirmButton.textContent = confirmText;
    appDialogCancelButton.textContent = cancelText;
    appDialogCancelButton.style.display = cancelText ? "" : "none";

    const cleanup = (result) => {
      appDialogConfirmButton.removeEventListener("click", confirm);
      appDialogCancelButton.removeEventListener("click", cancel);
      appDialogCloseButton.removeEventListener("click", cancel);
      appDialog.removeEventListener("cancel", cancel);
      appDialog.removeEventListener("close", closeWithoutAction);
      if (appDialog.open) {
        appDialog.close();
      }
      resolve(result);
    };

    const confirm = () => cleanup(input ? appDialogInput.value : true);
    const cancel = (event) => {
      event?.preventDefault();
      cleanup(input ? null : false);
    };
    const closeWithoutAction = () => cleanup(input ? null : false);

    appDialogConfirmButton.addEventListener("click", confirm);
    appDialogCancelButton.addEventListener("click", cancel);
    appDialogCloseButton.addEventListener("click", cancel);
    appDialog.addEventListener("cancel", cancel);
    appDialog.addEventListener("close", closeWithoutAction, { once: true });
    appDialog.showModal();
    if (input) {
      appDialogInput.focus();
    } else {
      appDialogConfirmButton.focus();
    }
  });
}

function appAlert(message, title = "\u63d0\u793a") {
  return showAppDialog({ title, message, cancelText: "" });
}

function appConfirm(message, title = "\u8bf7\u786e\u8ba4") {
  return showAppDialog({ title, message });
}

function appPrompt(message, placeholder = "", title = "\u8bf7\u8f93\u5165") {
  return showAppDialog({ title, message, input: true, placeholder });
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(completedArchive));
  localStorage.setItem(START_TIME_KEY, dayStartTime);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
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

function parseDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getMonday(date) {
  const current = new Date(date);
  const day = current.getDay() || 7;
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() - day + 1);
  return current;
}

function getWeekDates(startDate) {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value || "09:00").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 9 * 60;
  }
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minutes = String(normalized % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeTaskDate(task) {
  return task.date || formatDate();
}

function getSelectedDate() {
  return taskDateInput?.value || formatDate();
}

function getVisibleTasks() {
  const selectedDate = getSelectedDate();
  return tasks.filter((task) => normalizeTaskDate(task) === selectedDate);
}

function getVisibleArchivedTasks() {
  const selectedDate = getSelectedDate();
  return completedArchive.filter((task) => normalizeTaskDate(task) === selectedDate);
}

function getScheduledTasks(sourceTasks = getSortedTasks()) {
  const cursors = new Map();

  return sourceTasks.map((task) => {
    const date = normalizeTaskDate(task);
    const cursor = cursors.get(date) ?? timeToMinutes(dayStartTime);
    const startTime = task.startTime || minutesToTime(cursor);
    const startMinutes = timeToMinutes(startTime);
    const hasConflict = startMinutes < cursor;
    const scheduled = {
      ...task,
      date,
      startTime,
      hasConflict,
      expectedStartTime: minutesToTime(cursor)
    };
    cursors.set(date, startMinutes + Number(task.minutes || 0));
    return scheduled;
  });
}

function getCurrentScheduleRange() {
  const scheduled = getScheduledTasks(getSortedTasks(getVisibleTasks()));
  if (!scheduled.length) {
    return label.none;
  }

  const start = scheduled[0].startTime;
  const end = minutesToTime(timeToMinutes(start) + scheduled.reduce((sum, task) => sum + Number(task.minutes || 0), 0));
  return `${start} - ${end}`;
}

function createTask(text, priority, minutes, date) {
  const sameDayOrders = tasks
    .filter((task) => normalizeTaskDate(task) === date)
    .map((task) => Number.isFinite(task.order) ? task.order : 0);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    text,
    date,
    order: sameDayOrders.length ? Math.max(...sameDayOrders) + 1 : 0,
    priority,
    minutes,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function createPlanTask(plan, minutes, date, order, startTime) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    planId: plan.id,
    text: plan.title,
    date,
    order,
    priority: plan.priority,
    minutes,
    startTime,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function archiveCompleted(items) {
  const scheduledById = new Map(getScheduledTasks(getSortedTasks(items)).map((task) => [task.id, task]));
  const archived = items
    .filter((task) => task.completed)
    .map((task) => ({
      ...(scheduledById.get(task.id) || task),
      archivedAt: new Date().toISOString(),
      completedAt: task.completedAt || new Date().toISOString()
    }));

  completedArchive = [...completedArchive, ...archived];
}

function getReportTasks() {
  return [...getScheduledTasks(getSortedTasks(getVisibleTasks())), ...getVisibleArchivedTasks()];
}

function getSortedTasks(sourceTasks = tasks) {
  const indexed = sourceTasks.map((task, index) => ({ task, index }));

  indexed.sort((left, right) => {
    const leftDate = normalizeTaskDate(left.task);
    const rightDate = normalizeTaskDate(right.task);
    if (leftDate !== rightDate) {
      return leftDate.localeCompare(rightDate);
    }

    for (const rule of sortRules) {
      const result = compareTasks(left.task, right.task, rule);
      if (result !== 0) {
        return result;
      }
    }
    const leftOrder = Number.isFinite(left.task.order) ? left.task.order : left.index;
    const rightOrder = Number.isFinite(right.task.order) ? right.task.order : right.index;
    return leftOrder - rightOrder;
  });

  return indexed.map((item) => item.task);
}

function compareTasks(left, right, rule) {
  const direction = rule.direction === "asc" ? 1 : -1;
  let leftValue;
  let rightValue;

  if (rule.key === "priority") {
    leftValue = priorityMap[left.priority]?.rank || 0;
    rightValue = priorityMap[right.priority]?.rank || 0;
  } else {
    leftValue = Number(left.minutes || 0);
    rightValue = Number(right.minutes || 0);
  }

  if (leftValue === rightValue) {
    return 0;
  }
  return leftValue > rightValue ? direction : -direction;
}

function applySort(key, direction) {
  sortRules = [{ key, direction }, ...sortRules.filter((rule) => rule.key !== key)];
  render();
}

function bindSortControl(element, key) {
  const normalDirection = key === "priority" ? "desc" : "asc";
  const reverseDirection = key === "priority" ? "asc" : "desc";

  element.title = key === "priority"
    ? "\u5355\u51fb\u6309\u9ad8\u5230\u4f4e\u6392\u5e8f\uff0c\u53cc\u51fb\u6309\u4f4e\u5230\u9ad8\u6392\u5e8f"
    : "\u5355\u51fb\u6309\u77ed\u5230\u957f\u6392\u5e8f\uff0c\u53cc\u51fb\u6309\u957f\u5230\u77ed\u6392\u5e8f";
  element.tabIndex = 0;
  element.setAttribute("role", "button");

  element.addEventListener("click", () => {
    clearTimeout(sortClickTimer);
    sortClickTimer = setTimeout(() => applySort(key, normalDirection), 180);
  });
  element.addEventListener("dblclick", () => {
    clearTimeout(sortClickTimer);
    applySort(key, reverseDirection);
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      applySort(key, normalDirection);
    }
  });
}

function render() {
  taskList.innerHTML = "";

  getScheduledTasks(getSortedTasks(getVisibleTasks())).forEach((task) => {
    const priority = priorityMap[task.priority] || priorityMap.medium;
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}${task.hasConflict ? " conflict" : ""}`;
    item.style.setProperty("--priority-color", priority.color);
    item.dataset.id = task.id;
    item.draggable = true;
    item.addEventListener("dragstart", handleTaskDragStart);
    item.addEventListener("dragover", handleTaskDragOver);
    item.addEventListener("dragleave", handleTaskDragLeave);
    item.addEventListener("drop", handleTaskDrop);
    item.addEventListener("dragend", handleTaskDragEnd);

    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `\u6807\u8bb0 ${task.text} \u4e3a\u5b8c\u6210`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const main = document.createElement("div");
    main.className = "task-main";

    const priorityPill = document.createElement("span");
    priorityPill.className = "task-pill sortable-chip";
    priorityPill.textContent = `${priority.label}${label.important}`;
    bindSortControl(priorityPill, "priority");

    const time = document.createElement("span");
    time.className = "task-time sortable-chip";
    time.textContent = `${task.minutes}${label.minute}`;
    bindSortControl(time, "time");

    const start = document.createElement("span");
    start.className = `task-start${task.hasConflict ? " task-conflict" : ""}`;
    start.textContent = task.startTime;
    if (task.hasConflict) {
      start.title = `\u65f6\u95f4\u51b2\u7a81\uff1a\u4e0a\u4e00\u4efb\u52a1\u7ed3\u675f\u540e\u5efa\u8bae\u4ece ${task.expectedStartTime} \u5f00\u59cb`;
    }

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    main.append(priorityPill, time, start, text);
    if (task.hasConflict) {
      const conflict = document.createElement("span");
      conflict.className = "task-conflict-note";
      conflict.textContent = `\u65f6\u95f4\u51b2\u7a81\uff0c\u5efa\u8bae\u6539\u4e3a ${task.expectedStartTime} \u6216\u8c03\u6574\u524d\u9762\u4efb\u52a1`;
      main.append(conflict);
    }

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = label.edit;
    editButton.addEventListener("click", () => startEdit(task.id, item));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.textContent = label.delete;
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    buttons.append(editButton, deleteButton);
    item.append(checkbox, main, buttons);
    taskList.append(item);
  });

  const visibleTasks = getVisibleTasks();
  const completed = visibleTasks.filter((task) => task.completed).length;
  pendingCount.textContent = String(visibleTasks.length - completed);
  completedCount.textContent = String(completed);
  emptyState.classList.toggle("show", visibleTasks.length === 0);
  if (plansDialog?.open) {
    renderPlans();
  }
}

function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  const task = createTask(text, prioritySelect.value, normalizeMinutes(timeInput.value), taskDateInput.value || formatDate());
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
  const changedTask = tasks.find((task) => task.id === id);
  if (changedTask?.completed && changedTask.projectId && changedTask.moduleId && changedTask.subtaskId) {
    setProjectSubtaskCompleted(changedTask.projectId, changedTask.moduleId, changedTask.subtaskId, true);
  }
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save();
  render();
}

function handleTaskDragStart(event) {
  draggedTaskId = event.currentTarget.dataset.id;
  event.currentTarget.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
}

function handleTaskDragOver(event) {
  event.preventDefault();
  const target = event.currentTarget;
  if (target.dataset.id !== draggedTaskId) {
    target.classList.add("drag-over");
  }
}

function handleTaskDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

function handleTaskDrop(event) {
  event.preventDefault();
  const targetId = event.currentTarget.dataset.id;
  event.currentTarget.classList.remove("drag-over");
  if (!draggedTaskId || draggedTaskId === targetId) {
    return;
  }

  reorderTasks(draggedTaskId, targetId);
}

function handleTaskDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  taskList.querySelectorAll(".drag-over").forEach((item) => item.classList.remove("drag-over"));
  draggedTaskId = null;
}

function reorderTasks(sourceId, targetId) {
  const selectedDate = getSelectedDate();
  const ordered = getSortedTasks(getVisibleTasks());
  const sourceIndex = ordered.findIndex((task) => task.id === sourceId);
  const targetIndex = ordered.findIndex((task) => task.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) {
    return;
  }

  const [moved] = ordered.splice(sourceIndex, 1);
  ordered.splice(targetIndex, 0, moved);
  const orderMap = new Map(ordered.map((task, index) => [task.id, index]));
  tasks = tasks.map((task) =>
    normalizeTaskDate(task) === selectedDate
      ? { ...task, order: orderMap.get(task.id) ?? task.order }
      : task
  );
  sortRules = [];
  save();
  render();
}

function startEdit(id, item) {
  const task = tasks.find((entry) => entry.id === id);
  if (!task) {
    return;
  }
  const scheduledTask = getScheduledTasks().find((entry) => entry.id === id) || task;

  const main = item.querySelector(".task-main");
  const editButton = item.querySelector(".task-buttons button");
  const deleteButton = item.querySelector(".delete-task");
  const saveButton = editButton.cloneNode(false);
  const cancelButton = deleteButton.cloneNode(false);
  main.innerHTML = "";

  const priority = document.createElement("select");
  priority.className = "task-edit-input";
  priority.setAttribute("aria-label", "\u7f16\u8f91\u91cd\u8981\u7a0b\u5ea6");
  Object.entries(priorityMap).forEach(([value, entry]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = entry.label;
    option.selected = value === task.priority;
    priority.append(option);
  });

  const date = document.createElement("input");
  date.className = "task-edit-input";
  date.type = "date";
  date.value = normalizeTaskDate(task);
  date.min = formatDate();
  date.max = formatDate(addDays(new Date(), 6));
  date.setAttribute("aria-label", "\u7f16\u8f91\u4efb\u52a1\u65e5\u671f");

  const minutes = document.createElement("input");
  minutes.className = "task-edit-input";
  minutes.type = "number";
  minutes.min = "10";
  minutes.max = "120";
  minutes.step = "10";
  minutes.value = task.minutes;
  minutes.setAttribute("aria-label", "\u7f16\u8f91\u8ba1\u5212\u7528\u65f6");

  const start = document.createElement("input");
  start.className = "task-edit-input";
  start.type = "time";
  start.value = scheduledTask.startTime || dayStartTime;
  start.setAttribute("aria-label", "\u7f16\u8f91\u5f00\u59cb\u65f6\u95f4");

  const text = document.createElement("input");
  text.className = "task-edit-input";
  text.type = "text";
  text.value = task.text;
  text.setAttribute("aria-label", "\u7f16\u8f91\u4efb\u52a1\u5185\u5bb9");

  main.append(priority, date, minutes, start, text);
  saveButton.textContent = label.save;
  cancelButton.textContent = label.cancel;
  editButton.replaceWith(saveButton);
  deleteButton.replaceWith(cancelButton);
  text.focus();
  text.select();

  const commit = () => {
    const nextText = text.value.trim();
    if (!nextText) {
      text.focus();
      return;
    }

    tasks = tasks.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            text: nextText,
            date: date.value || formatDate(),
            priority: priority.value,
            minutes: normalizeMinutes(minutes.value),
            startTime: start.value || scheduledTask.startTime || dayStartTime
          }
        : entry
    );
    save();
    render();
  };

  const cancel = () => render();
  saveButton.addEventListener("click", commit);
  cancelButton.addEventListener("click", cancel);

  [priority, date, minutes, start, text].forEach((control) => {
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        commit();
      }
      if (event.key === "Escape") {
        cancel();
      }
    });
  });
}

function clearCompleted() {
  const selectedDate = getSelectedDate();
  const visibleTasks = tasks.filter((task) => normalizeTaskDate(task) === selectedDate);
  archiveCompleted(visibleTasks);
  tasks = tasks.filter((task) => normalizeTaskDate(task) !== selectedDate || !task.completed);
  save();
  render();
}

async function deferUnfinishedTasks() {
  const selectedDate = getSelectedDate();
  const nextDate = formatDate(addDays(parseDate(selectedDate), 1));
  if (nextDate > taskDateInput.max) {
    await appAlert("\u5df2\u7ecf\u662f\u53ef\u7ba1\u7406\u7684\u6700\u540e\u4e00\u5929\uff0c\u65e0\u6cd5\u7ee7\u7eed\u987a\u5ef6\u3002");
    return;
  }

  const unfinished = tasks.filter((task) => normalizeTaskDate(task) === selectedDate && !task.completed);
  if (!unfinished.length) {
    return;
  }

  const confirmed = await appConfirm(`\u786e\u5b9a\u8981\u628a ${unfinished.length} \u4e2a\u672a\u5b8c\u6210\u4efb\u52a1\u987a\u5ef6\u5230 ${nextDate} \u5417\uff1f`);
  if (!confirmed) {
    return;
  }

  const nextOrders = tasks
    .filter((task) => normalizeTaskDate(task) === nextDate)
    .map((task) => Number.isFinite(task.order) ? task.order : 0);
  let order = nextOrders.length ? Math.max(...nextOrders) + 1 : 0;

  tasks = tasks.map((task) => {
    if (normalizeTaskDate(task) !== selectedDate || task.completed) {
      return task;
    }

    const moved = {
      ...task,
      date: nextDate,
      order,
      completed: false,
      completedAt: null,
      startTime: ""
    };
    order += 1;
    return moved;
  });

  save();
  render();
}

async function createPlan(event) {
  event.preventDefault();

  const nextPlan = readPlanForm();

  if (!nextPlan.title || !nextPlan.startDate || !nextPlan.endDate || nextPlan.endDate < nextPlan.startDate || nextPlan.totalMinutes <= 0 || nextPlan.dailyMinutes <= 0) {
    await appAlert("\u8bf7\u68c0\u67e5\u76ee\u6807\u540d\u79f0\u3001\u65e5\u671f\u548c\u7528\u65f6\u8bbe\u7f6e\u3002");
    return;
  }

  if (editingPlanId) {
    plans = plans.map((plan) =>
      plan.id === editingPlanId
        ? { ...plan, ...nextPlan, updatedAt: new Date().toISOString() }
        : plan
    );
    save();
    render();
    renderPlans();
    resetPlanForm();
    return;
  }

  const plan = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    ...nextPlan,
    createdAt: new Date().toISOString()
  };

  const generated = await generatePlanTasks(plan);
  if (!generated.length) {
    await appAlert("\u5f53\u524d\u5468\u671f\u5185\u6ca1\u6709\u53ef\u7528\u65e5\u671f\uff0c\u8bf7\u8c03\u6574\u4e0d\u53ef\u5b89\u6392\u661f\u671f\u6216\u622a\u6b62\u65e5\u671f\u3002");
    return;
  }

  plans = [plan, ...plans];
  tasks = [...tasks, ...generated];
  save();
  render();
  renderPlans();
  resetPlanForm();
}

function readPlanForm() {
  return {
    title: planTitleInput.value.trim(),
    startDate: planStartInput.value,
    endDate: planEndInput.value,
    totalMinutes: Math.round(Number(planTotalHoursInput.value) * 60),
    dailyMinutes: Math.round(Number(planDailyHoursInput.value) * 60),
    startTime: planStartTimeInput.value || dayStartTime,
    priority: planPriorityInput.value,
    blockedWeekdays: [...planForm.querySelectorAll("input[name='blockedWeekday']:checked")].map((input) => Number(input.value))
  };
}

async function generatePlanTasks(plan) {
  let remaining = plan.totalMinutes;
  const generated = [];
  const generatedByDate = new Map();
  let cursor = parseDate(plan.startDate);
  const end = parseDate(plan.endDate);

  while (cursor <= end && remaining > 0) {
    const weekday = cursor.getDay();
    const date = formatDate(cursor);
    if (!plan.blockedWeekdays.includes(weekday)) {
      const minutes = Math.min(plan.dailyMinutes, remaining);
      const plannedForDate = generatedByDate.get(date) || [];
      const occupied = getScheduledTasks(getSortedTasks([
        ...tasks.filter((task) => normalizeTaskDate(task) === date),
        ...plannedForDate
      ]));
      const lastEnd = occupied.reduce((latest, task) => {
        const endMinutes = timeToMinutes(task.startTime) + Number(task.minutes || 0);
        return Math.max(latest, endMinutes);
      }, timeToMinutes(plan.startTime));
      const startTime = minutesToTime(lastEnd);
      const sameDayOrders = [...tasks, ...generated]
        .filter((task) => normalizeTaskDate(task) === date)
        .map((task) => Number.isFinite(task.order) ? task.order : 0);
      const order = sameDayOrders.length ? Math.max(...sameDayOrders) + 1 : 0;
      const task = createPlanTask(plan, minutes, date, order, startTime);
      generated.push(task);
      generatedByDate.set(date, [...plannedForDate, task]);
      remaining -= minutes;
    }
    cursor = addDays(cursor, 1);
  }

  if (remaining > 0) {
    await appAlert(`\u8fd8\u6709 ${Math.ceil(remaining / 60 * 10) / 10} \u5c0f\u65f6\u6ca1\u6709\u6392\u8fdb\u622a\u6b62\u65e5\u671f\u524d\uff0c\u5df2\u5148\u751f\u6210\u53ef\u6392\u90e8\u5206\u3002`);
  }

  return generated;
}

function renderPlans() {
  if (!plans.length) {
    plansList.innerHTML = `<p class="empty-state show">\u8fd8\u6ca1\u6709\u76ee\u6807\u8ba1\u5212\uff0c\u5148\u628a\u4e00\u4e2a\u5927\u4efb\u52a1\u62c6\u6210\u6bcf\u65e5\u4efb\u52a1\u5427\u3002</p>`;
    return;
  }

  plansList.innerHTML = plans.map((plan) => {
    const planTasks = tasks.filter((task) => task.planId === plan.id);
    const doneMinutes = planTasks
      .filter((task) => task.completed)
      .reduce((sum, task) => sum + Number(task.minutes || 0), 0);
    const percent = plan.totalMinutes ? Math.min(100, Math.round(doneMinutes / plan.totalMinutes * 100)) : 0;
    const generatedMinutes = planTasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0);

    return `<article class="plan-card">
      <header>
        <h3>${escapeHtml(plan.title)}</h3>
      </header>
      <div class="plan-meta">
        <span>${escapeHtml(plan.startDate)} - ${escapeHtml(plan.endDate)}</span>
        <span>\u603b\u7528\u65f6 ${Math.round(plan.totalMinutes / 60 * 10) / 10} \u5c0f\u65f6</span>
        <span>\u5df2\u5b8c\u6210 ${Math.round(doneMinutes / 60 * 10) / 10} \u5c0f\u65f6</span>
        <span>\u5df2\u751f\u6210 ${Math.round(generatedMinutes / 60 * 10) / 10} \u5c0f\u65f6</span>
        <span>${percent}%</span>
      </div>
      <div class="plan-progress" style="--progress:${percent}%"><span></span></div>
      <div class="plan-actions">
        <button class="soft-button" type="button" data-plan-action="edit" data-plan-id="${escapeHtml(plan.id)}">\u7f16\u8f91</button>
        <button class="soft-button" type="button" data-plan-action="regen" data-plan-id="${escapeHtml(plan.id)}">\u91cd\u65b0\u751f\u6210\u672a\u5b8c\u6210</button>
        <button class="danger-button" type="button" data-plan-action="delete" data-plan-id="${escapeHtml(plan.id)}">\u5220\u9664</button>
      </div>
    </article>`;
  }).join("");

  plansList.querySelectorAll("[data-plan-action]").forEach((button) => {
    button.addEventListener("click", () => handlePlanAction(button.dataset.planAction, button.dataset.planId));
  });
}

function initializePlanFormDates() {
  const today = formatDate();
  planStartInput.min = today;
  planStartInput.value = today;
  planEndInput.min = today;
  planEndInput.value = formatDate(addDays(new Date(), 6));
  planStartTimeInput.value = dayStartTime;
}

function resetPlanForm() {
  editingPlanId = null;
  planForm.reset();
  planForm.querySelector(".primary-button").textContent = "\u751f\u6210\u6bcf\u65e5\u4efb\u52a1";
  initializePlanFormDates();
}

function handlePlanAction(action, planId) {
  const plan = plans.find((item) => item.id === planId);
  if (!plan) {
    return;
  }

  if (action === "edit") {
    fillPlanForm(plan);
  }
  if (action === "regen") {
    regenerateUnfinishedPlanTasks(plan);
  }
  if (action === "delete") {
    deletePlan(plan);
  }
}

function fillPlanForm(plan) {
  editingPlanId = plan.id;
  planTitleInput.value = plan.title;
  planStartInput.value = plan.startDate;
  planEndInput.value = plan.endDate;
  planTotalHoursInput.value = plan.totalMinutes / 60;
  planDailyHoursInput.value = plan.dailyMinutes / 60;
  planStartTimeInput.value = plan.startTime;
  planPriorityInput.value = plan.priority;
  planForm.querySelectorAll("input[name='blockedWeekday']").forEach((input) => {
    input.checked = plan.blockedWeekdays.includes(Number(input.value));
  });
  planForm.querySelector(".primary-button").textContent = "\u4fdd\u5b58\u76ee\u6807\u4fe1\u606f";
  planTitleInput.focus();
}

async function regenerateUnfinishedPlanTasks(plan) {
  const completedPlanTasks = tasks.filter((task) => task.planId === plan.id && task.completed);
  const doneMinutes = completedPlanTasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const remainingMinutes = Math.max(0, plan.totalMinutes - doneMinutes);
  const confirmed = await appConfirm("\u786e\u5b9a\u8981\u5220\u9664\u8be5\u76ee\u6807\u7684\u672a\u5b8c\u6210\u4efb\u52a1\uff0c\u5e76\u6309\u5f53\u524d\u76ee\u6807\u8bbe\u7f6e\u91cd\u65b0\u751f\u6210\u5417\uff1f");
  if (!confirmed) {
    return;
  }

  tasks = tasks.filter((task) => task.planId !== plan.id || task.completed);
  if (remainingMinutes > 0) {
    const generated = await generatePlanTasks({ ...plan, totalMinutes: remainingMinutes });
    tasks = [...tasks, ...generated];
  }
  save();
  render();
  renderPlans();
}

async function deletePlan(plan) {
  const deleteTasks = await appConfirm("\u5220\u9664\u76ee\u6807\u8ba1\u5212\u65f6\uff0c\u662f\u5426\u4e00\u5e76\u5220\u9664\u8be5\u76ee\u6807\u4e0b\u672a\u5b8c\u6210\u7684\u6bcf\u65e5\u4efb\u52a1\uff1f\u5df2\u5b8c\u6210\u4efb\u52a1\u4f1a\u4fdd\u7559\u3002");
  plans = plans.filter((item) => item.id !== plan.id);
  if (deleteTasks) {
    tasks = tasks.filter((task) => task.planId !== plan.id || task.completed);
  }
  if (editingPlanId === plan.id) {
    resetPlanForm();
  }
  save();
  render();
  renderPlans();
}

function createProject(event) {
  event.preventDefault();
  const title = projectTitleInput.value.trim();
  if (!title) {
    projectTitleInput.focus();
    return;
  }

  projects = [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      title,
      modules: [],
      createdAt: new Date().toISOString()
    },
    ...projects
  ];
  projectForm.reset();
  save();
  renderProjects();
}

function renderProjects() {
  if (!projects.length) {
    projectsList.innerHTML = `<p class="empty-state show">\u8fd8\u6ca1\u6709\u9879\u76ee\u8ba1\u5212\uff0c\u53ef\u4ee5\u5148\u5efa\u4e00\u4e2a\u6e38\u620f\u3001\u5c0f\u7a0b\u5e8f\u6216\u8bfe\u7a0b\u9879\u76ee\u3002</p>`;
    return;
  }

  projectsList.innerHTML = projects.map((project) => {
    const subtasks = project.modules.flatMap((module) => module.subtasks || []);
    const done = subtasks.filter((subtask) => subtask.completed).length;
    const percent = subtasks.length ? Math.round(done / subtasks.length * 100) : 0;
    const modules = project.modules.map((module) => renderProjectModule(project, module)).join("");

    return `<article class="project-card">
      <header>
        <h3>${escapeHtml(project.title)}</h3>
      </header>
      <div class="plan-meta">
        <span>\u6a21\u5757 ${project.modules.length} \u4e2a</span>
        <span>\u5b50\u4efb\u52a1 ${done}/${subtasks.length}</span>
        <span>${percent}%</span>
      </div>
      <div class="plan-progress" style="--progress:${percent}%"><span></span></div>
      <div class="plan-actions">
        <button class="soft-button" type="button" data-project-action="module" data-project-id="${escapeHtml(project.id)}">\u6dfb\u52a0\u6a21\u5757</button>
        <button class="danger-button" type="button" data-project-action="delete" data-project-id="${escapeHtml(project.id)}">\u5220\u9664\u9879\u76ee</button>
      </div>
      ${modules}
    </article>`;
  }).join("");

  projectsList.querySelectorAll("[data-project-action]").forEach((button) => {
    button.addEventListener("click", () => handleProjectAction(button.dataset.projectAction, button.dataset.projectId, button.dataset.moduleId, button.dataset.subtaskId));
  });
  projectsList.querySelectorAll("[data-subtask-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => toggleProjectSubtask(checkbox.dataset.projectId, checkbox.dataset.moduleId, checkbox.dataset.subtaskId));
  });
}

function renderProjectModule(project, module) {
  const subtasks = (module.subtasks || []).map((subtask) => `
    <li class="${subtask.completed ? "done" : ""}">
      <input type="checkbox" ${subtask.completed ? "checked" : ""} data-subtask-toggle="true" data-project-id="${escapeHtml(project.id)}" data-module-id="${escapeHtml(module.id)}" data-subtask-id="${escapeHtml(subtask.id)}">
      <span>${escapeHtml(subtask.title)}</span>
      <button class="soft-button" type="button" ${isSubtaskAddedToday(subtask.id) ? "disabled" : ""} data-project-action="today" data-project-id="${escapeHtml(project.id)}" data-module-id="${escapeHtml(module.id)}" data-subtask-id="${escapeHtml(subtask.id)}">${isSubtaskAddedToday(subtask.id) ? "\u5df2\u6dfb\u52a0" : "\u52a0\u5165\u4eca\u65e5"}</button>
    </li>
  `).join("");

  return `<section class="project-module">
    <header>
      <h4>${escapeHtml(module.title)}</h4>
      <button class="soft-button" type="button" data-project-action="subtask" data-project-id="${escapeHtml(project.id)}" data-module-id="${escapeHtml(module.id)}">\u6dfb\u52a0\u5b50\u4efb\u52a1</button>
    </header>
    <ul class="subtask-list">${subtasks || `<li><span>\u8fd8\u6ca1\u6709\u5b50\u4efb\u52a1</span></li>`}</ul>
  </section>`;
}

function isSubtaskAddedToday(subtaskId) {
  const selectedDate = getSelectedDate();
  return tasks.some((task) => task.subtaskId === subtaskId && normalizeTaskDate(task) === selectedDate);
}

function handleProjectAction(action, projectId, moduleId, subtaskId) {
  if (action === "module") {
    addProjectModule(projectId);
  }
  if (action === "subtask") {
    addProjectSubtask(projectId, moduleId);
  }
  if (action === "today") {
    addSubtaskToToday(projectId, moduleId, subtaskId);
  }
  if (action === "delete") {
    deleteProject(projectId);
  }
}

async function addProjectModule(projectId) {
  const title = await appPrompt("\u8f93\u5165\u6a21\u5757\u540d\u79f0\uff0c\u4f8b\u5982\uff1a\u524d\u7aef\u3001\u540e\u53f0\u3001\u5267\u60c5\u811a\u672c");
  if (!title?.trim()) {
    return;
  }

  projects = projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          modules: [
            ...project.modules,
            {
              id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
              title: title.trim(),
              subtasks: []
            }
          ]
        }
      : project
  );
  save();
  renderProjects();
}

async function addProjectSubtask(projectId, moduleId) {
  const title = await appPrompt("\u8f93\u5165\u5b50\u4efb\u52a1\uff0c\u4f8b\u5982\uff1a\u5b8c\u6210\u767b\u5f55\u9875\u9762");
  if (!title?.trim()) {
    return;
  }

  projects = projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          modules: project.modules.map((module) =>
            module.id === moduleId
              ? {
                  ...module,
                  subtasks: [
                    ...(module.subtasks || []),
                    {
                      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
                      title: title.trim(),
                      completed: false
                    }
                  ]
                }
              : module
          )
        }
      : project
  );
  save();
  renderProjects();
}

function toggleProjectSubtask(projectId, moduleId, subtaskId) {
  setProjectSubtaskCompleted(projectId, moduleId, subtaskId);
  save();
  renderProjects();
}

function setProjectSubtaskCompleted(projectId, moduleId, subtaskId, forcedValue) {
  projects = projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          modules: project.modules.map((module) =>
            module.id === moduleId
              ? {
                  ...module,
                  subtasks: (module.subtasks || []).map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, completed: typeof forcedValue === "boolean" ? forcedValue : !subtask.completed }
                      : subtask
                  )
                }
              : module
          )
        }
      : project
  );
}

function addSubtaskToToday(projectId, moduleId, subtaskId) {
  if (isSubtaskAddedToday(subtaskId)) {
    return;
  }

  const project = projects.find((item) => item.id === projectId);
  const module = project?.modules.find((item) => item.id === moduleId);
  const subtask = module?.subtasks.find((item) => item.id === subtaskId);
  if (!project || !module || !subtask) {
    return;
  }

  const date = getSelectedDate();
  const task = createTask(`${project.title} - ${module.title} - ${subtask.title}`, "medium", normalizeMinutes(timeInput.value), date);
  task.projectId = projectId;
  task.moduleId = moduleId;
  task.subtaskId = subtaskId;
  tasks = [task, ...tasks];
  save();
  render();
  renderProjects();
}

async function deleteProject(projectId) {
  const confirmed = await appConfirm("\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u4e2a\u9879\u76ee\u8ba1\u5212\u5417\uff1f\u4e0d\u4f1a\u5220\u9664\u5df2\u52a0\u5165\u6bcf\u65e5\u6e05\u5355\u7684\u4efb\u52a1\u3002");
  if (!confirmed) {
    return;
  }
  projects = projects.filter((project) => project.id !== projectId);
  save();
  renderProjects();
}

async function clearAll() {
  const selectedDate = getSelectedDate();
  const hasCurrentData = tasks.some((task) => normalizeTaskDate(task) === selectedDate)
    || completedArchive.some((task) => normalizeTaskDate(task) === selectedDate);
  if (!hasCurrentData) {
    return;
  }

  const confirmed = await appConfirm("\u786e\u5b9a\u8981\u6e05\u7a7a\u5f53\u524d\u65e5\u671f\u7684\u6240\u6709\u4efb\u52a1\u5417\uff1f\u8fd9\u4f1a\u771f\u6b63\u5220\u9664\u8fd9\u4e00\u5929\u7684\u5f53\u524d\u4efb\u52a1\u548c\u5df2\u5f52\u6863\u5b8c\u6210\u8bb0\u5f55\u3002");
  if (!confirmed) {
    return;
  }

  tasks = tasks.filter((task) => normalizeTaskDate(task) !== selectedDate);
  completedArchive = completedArchive.filter((task) => normalizeTaskDate(task) !== selectedDate);
  save();
  render();
}

async function showSummary() {
  const all = getReportTasks();
  const planned = all.length;
  const completed = all.filter((task) => task.completed).length;
  const completionRate = planned ? Math.round((completed / planned) * 100) : 0;
  const totalMinutes = all.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const longest = all.reduce((result, task) => (!result || task.minutes > result.minutes ? task : result), null);
  const shortest = all.reduce((result, task) => (!result || task.minutes < result.minutes ? task : result), null);

  const cells = [
    [label.plannedTasks, `${planned} \u4e2a`],
    [label.actualCompleted, `${completed} \u4e2a`],
    [label.completionRate, `${completionRate}%`],
    [label.totalTime, `${totalMinutes} ${label.minute}`],
    [label.startTime, getCurrentScheduleRange()],
    [label.longest, longest ? `${longest.text}\uff08${longest.minutes}${label.minute}\uff09` : label.none],
    [label.shortest, shortest ? `${shortest.text}\uff08${shortest.minutes}${label.minute}\uff09` : label.none]
  ];

  summaryContent.innerHTML = cells
    .map(([name, value]) => `<section class="summary-cell"><span>${escapeHtml(name)}</span><strong>${escapeHtml(value)}</strong></section>`)
    .join("");

  if (typeof summaryDialog.showModal === "function") {
    summaryDialog.showModal();
  } else {
    await appAlert(cells.map(([name, value]) => `${name}\uff1a${value}`).join("\n"), label.actualCompleted);
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

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getColumnName(index) {
  let name = "";
  let current = index;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }

  return name;
}

function createCell(value, rowIndex, columnIndex) {
  const ref = `${getColumnName(columnIndex)}${rowIndex}`;
  return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
}

function createSheetXml(rows) {
  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row.map((cell, columnIndex) => createCell(cell, rowIndex + 1, columnIndex + 1)).join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetRows}</sheetData>
</worksheet>`;
}

function makeCrcTable() {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }

  return table;
}

const crcTable = makeCrcTable();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;

  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });

  return output;
}

function makeZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  const { time, date } = dosDateTime();
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const checksum = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, time, true);
    localView.setUint16(12, date, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, time, true);
    centralView.setUint16(14, date, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  });

  const centralDirectory = concatBytes(centralParts);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, offset, true);

  return concatBytes([...localParts, centralDirectory, endRecord]);
}

function createXlsxBlob(rows) {
  const files = [
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${label.todoTitle}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: createSheetXml(rows)
    }
  ];

  return new Blob([makeZip(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function saveWorkbookToDirectory(blob, fileName) {
  if (!directoryHandle || !directoryHandle.getFileHandle) {
    return false;
  }

  const allowed = await ensureDirectoryPermission(directoryHandle, "readwrite");
  if (!allowed) {
    return false;
  }

  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

function createCurrentWorkbookBlob() {
  const selectedDate = getSelectedDate();
  const rows = getReportTasks().map((task) => [
    task.date || formatDate(),
    task.text,
    priorityMap[task.priority]?.label || label.medium,
    `${task.minutes}${label.minute}`,
    task.startTime || "",
    task.completed ? label.yes : label.no
  ]);

  const workbookRows = [
    [`${label.todoTitle} ${selectedDate}`, "", "", "", "", ""],
    [label.taskDate, label.taskName, label.priority, label.plannedTime, label.startTime, label.completed],
    ...rows
  ];
  return {
    blob: createXlsxBlob(workbookRows),
    fileName: `${selectedDate}.xlsx`
  };
}

async function syncCurrentDayWorkbook({ notify = true, fallbackDownload = true, refresh = true } = {}) {
  const { blob, fileName } = createCurrentWorkbookBlob();

  try {
    if (await saveWorkbookToDirectory(blob, fileName)) {
      if (refresh) {
        await refreshCalendarData();
      }
      if (notify) {
        await appAlert(label.exportSaved);
      }
      return;
    }
  } catch {
    updateFolderStatus(label.permissionNeeded);
  }

  if (fallbackDownload) {
    downloadBlob(blob, fileName);
    if (notify) {
      await appAlert(label.exportDownloaded);
    }
  }
}

async function exportExcel() {
  await syncCurrentDayWorkbook();
}

function openHandleDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStoredDirectoryHandle() {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(DIRECTORY_HANDLE_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function storeDirectoryHandle(handle) {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(handle, DIRECTORY_HANDLE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearStoredDirectoryHandle() {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(DIRECTORY_HANDLE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function ensureDirectoryPermission(handle, mode = "read") {
  const options = { mode };
  if ((await handle.queryPermission(options)) === "granted") {
    return true;
  }
  return (await handle.requestPermission(options)) === "granted";
}

async function chooseCalendarFolder() {
  if (!window.showDirectoryPicker) {
    updateFolderStatus(label.unsupportedFolder);
    return;
  }

  try {
    directoryHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    clearCalendarCache();
    await storeDirectoryHandle(directoryHandle);
    updateFolderStatus(label.folderReady);
    await refreshCalendarData();
  } catch (error) {
    if (error.name !== "AbortError") {
      updateFolderStatus(label.permissionNeeded);
    }
  }
}

function updateFolderStatus(message) {
  folderStatus.textContent = message;
  calendarStatus.textContent = message;
}

async function initCalendarSettings() {
  try {
    directoryHandle = await getStoredDirectoryHandle();
    updateFolderStatus(directoryHandle ? label.folderReady : label.noFolder);
  } catch {
    updateFolderStatus(label.noFolder);
  }
}

async function openCalendar() {
  if (typeof calendarDialog.showModal === "function") {
    calendarDialog.showModal();
  }
  calendarStatus.textContent = label.loading;
  await syncCurrentDayWorkbook({ notify: false, fallbackDownload: false, refresh: false });
  await refreshCalendarData();
}

async function refreshCalendarData({ force = false } = {}) {
  if (!directoryHandle) {
    calendarDays = [];
    selectedDay = null;
    updateFolderStatus(label.chooseFolderFirst);
    renderCalendar();
    return;
  }

  const allowed = await ensureDirectoryPermission(directoryHandle);
  if (!allowed) {
    updateFolderStatus(label.permissionNeeded);
    return;
  }

  calendarStatus.textContent = label.loading;
  const days = [];
  const cache = loadJson(CALENDAR_CACHE_KEY, {});
  const nextCache = {};
  let readFiles = 0;
  let failed = 0;

  for await (const entry of directoryHandle.values()) {
    if (entry.kind !== "file" || !entry.name.toLowerCase().endsWith(".xlsx")) {
      continue;
    }

    try {
      const file = await entry.getFile();
      const cached = cache[entry.name];
      const cacheIsFresh = !force && cached && cached.size === file.size && cached.lastModified === file.lastModified;
      const parsedDays = cacheIsFresh ? cached.days : await parseWorkbookFile(file);
      const normalizedDays = parsedDays ? (Array.isArray(parsedDays) ? parsedDays : [parsedDays]) : [];

      if (normalizedDays.length) {
        days.push(...normalizedDays);
      }
      nextCache[entry.name] = {
        size: file.size,
        lastModified: file.lastModified,
        days: normalizedDays
      };
      readFiles += 1;
    } catch {
      failed += 1;
    }
  }

  saveJson(CALENDAR_CACHE_KEY, nextCache);

  calendarDays = mergeDays(days).sort((left, right) => left.date.localeCompare(right.date));
  selectedDay = calendarDays.at(-1)?.date || null;

  if (!calendarDays.length) {
    calendarStatus.textContent = label.noFiles;
  } else {
    calendarStatus.textContent = `${label.loaded} ${readFiles} ${label.files}\uff0c\u751f\u6210 ${calendarDays.length} \u5929\u8bb0\u5f55${failed ? `\uff0c${label.parseWarning}` : ""}`;
  }
  renderCalendar();
}

function mergeDays(days) {
  const map = new Map();
  days.forEach((day) => {
    const existing = map.get(day.date);
    if (!existing) {
      map.set(day.date, day);
      return;
    }
    existing.tasks.push(...day.tasks);
  });
  return [...map.values()];
}

async function parseWorkbookFile(file) {
  const buffer = await file.arrayBuffer();
  const entries = await readZipEntries(buffer);
  const sheetXml = entries.get("xl/worksheets/sheet1.xml");
  if (!sheetXml) {
    return null;
  }

  const sharedStrings = parseSharedStrings(entries.get("xl/sharedStrings.xml"));
  const rows = parseSheetRows(sheetXml, sharedStrings);
  const date = extractDate(file.name) || extractDate(rows[0]?.[0]);
  if (!date) {
    return null;
  }

  const header = rows[1] || [];
  const hasDateColumn = header[0] === label.taskDate || header.includes(label.taskDate);
  const hasStartColumn = header.includes(label.startTime);
  const taskRows = rows.slice(2).filter((row) => row[0]);
  const dayMap = new Map();

  taskRows.forEach((row) => {
    const taskDate = hasDateColumn ? row[0] || date : date;
    const offset = hasDateColumn ? 1 : 0;
    const task = {
      text: row[offset] || "",
      priority: row[offset + 1] || label.medium,
      minutes: Number.parseInt(row[offset + 2], 10) || 0,
      startTime: hasStartColumn ? row[offset + 3] || "" : "",
      completed: (hasStartColumn ? row[offset + 4] : row[offset + 3]) === label.yes
    };
    if (!dayMap.has(taskDate)) {
      dayMap.set(taskDate, []);
    }
    dayMap.get(taskDate).push(task);
  });

  return [...dayMap.entries()].map(([taskDate, dayTasks]) => ({ date: taskDate, tasks: dayTasks }));
}

async function readZipEntries(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  const entries = new Map();
  let offset = 0;

  while (offset + 30 < bytes.length) {
    const signature = view.getUint32(offset, true);
    if (signature !== 0x04034b50) {
      break;
    }

    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const name = decoder.decode(bytes.slice(nameStart, nameStart + fileNameLength));

    if (flags & 0x08) {
      throw new Error("Unsupported xlsx data descriptor");
    }

    if (method !== 0 && method !== 8) {
      throw new Error("Unsupported xlsx compression");
    }

    const data = bytes.slice(dataStart, dataStart + compressedSize);
    const content = method === 8 ? await inflateRaw(data) : data;
    entries.set(name, decoder.decode(content));
    offset = dataStart + compressedSize;
  }

  return entries;
}

async function inflateRaw(data) {
  if (!("DecompressionStream" in window)) {
    throw new Error("DecompressionStream is not supported");
  }

  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function parseSharedStrings(xml) {
  if (!xml) {
    return [];
  }
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("si")].map((item) => [...item.querySelectorAll("t")].map((node) => node.textContent).join(""));
}

function parseSheetRows(xml, sharedStrings) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return [...doc.querySelectorAll("row")].map((rowNode) => {
    const row = [];
    [...rowNode.querySelectorAll("c")].forEach((cell) => {
      const ref = cell.getAttribute("r") || "A1";
      const column = columnNameToIndex(ref.replace(/\d+/g, ""));
      const type = cell.getAttribute("t");
      let value = "";

      if (type === "inlineStr") {
        value = [...cell.querySelectorAll("t")].map((node) => node.textContent).join("");
      } else {
        const raw = cell.querySelector("v")?.textContent || "";
        value = type === "s" ? sharedStrings[Number(raw)] || "" : raw;
      }

      row[column] = value;
    });
    return row.map((value) => value || "");
  });
}

function columnNameToIndex(name) {
  return [...name].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function extractDate(value) {
  return String(value || "").match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function renderCalendar() {
  const totalTasks = calendarDays.reduce((sum, day) => sum + day.tasks.length, 0);
  const completed = calendarDays.reduce((sum, day) => sum + day.tasks.filter((task) => task.completed).length, 0);
  const totalMinutes = calendarDays.reduce((sum, day) => sum + day.tasks.reduce((daySum, task) => daySum + task.minutes, 0), 0);
  const rate = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  calendarStats.innerHTML = [
    [label.totalDays, `${calendarDays.length} \u5929`],
    [label.totalTasks, `${totalTasks} \u4e2a`],
    [label.completedTasks, `${completed} \u4e2a`],
    [label.completionRate, `${rate}%`],
    [label.totalTime, `${totalMinutes} ${label.minute}`]
  ]
    .map(([name, value]) => `<section class="calendar-stat"><span>${escapeHtml(name)}</span><strong>${escapeHtml(value)}</strong></section>`)
    .join("");

  calendarScroller.innerHTML = calendarDays
    .map((day) => {
      const done = day.tasks.filter((task) => task.completed).length;
      const minutes = day.tasks.reduce((sum, task) => sum + task.minutes, 0);
      const dayRate = day.tasks.length ? Math.round((done / day.tasks.length) * 100) : 0;
      return `<button class="day-card${day.date === selectedDay ? " active" : ""}" type="button" data-date="${escapeHtml(day.date)}">
        <span class="day-date">${escapeHtml(day.date)}</span>
        <span>${label.completedTasks} ${done}/${day.tasks.length}</span>
        <strong>${dayRate}%</strong>
        <span>${minutes} ${label.minute}</span>
      </button>`;
    })
    .join("");

  calendarScroller.querySelectorAll(".day-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedDay = card.dataset.date;
      renderCalendar();
    });
  });

  renderDayDetail();
}

function renderDayDetail() {
  const day = calendarDays.find((item) => item.date === selectedDay);
  if (!day) {
    dayDetail.innerHTML = `<p>${calendarDays.length ? label.selectDay : label.emptyDay}</p>`;
    return;
  }

  const rows = day.tasks
    .map((task) => {
      const priority = findPriorityByLabel(task.priority);
      return `<tr>
        <td><span class="detail-pill" style="background:${priority.color}">${escapeHtml(task.priority)}</span></td>
        <td class="detail-time">${task.minutes}${label.minute}</td>
        <td class="detail-start">${escapeHtml(task.startTime || "")}</td>
        <td class="day-task-name">${escapeHtml(task.text)}</td>
        <td class="detail-done">${task.completed ? label.yes : label.no}</td>
      </tr>`;
    })
    .join("");

  dayDetail.innerHTML = `<h3>${escapeHtml(day.date)}</h3>
    <div class="day-table-wrap">
      <table>
        <thead>
          <tr>
            <th>${label.priority}</th>
            <th>${label.plannedTime}</th>
            <th>${label.startTime}</th>
            <th>${label.taskName}</th>
            <th>${label.completed}</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="5">${label.emptyDay}</td></tr>`}</tbody>
      </table>
    </div>`;
}

function findPriorityByLabel(value) {
  return Object.values(priorityMap).find((priority) => priority.label === value) || priorityMap.medium;
}

async function openMeeting() {
  if (typeof meetingDialog.showModal === "function") {
    meetingDialog.showModal();
  }

  meetingWeekStart = parseDate(formatDate(new Date()));
  meetingStatus.textContent = label.loading;
  await syncCurrentDayWorkbook({ notify: false, fallbackDownload: false, refresh: false });
  if (directoryHandle) {
    await refreshCalendarData();
  }
  renderMeetingGrid();
}

function renderMeetingGrid() {
  const weekDates = getWeekDates(meetingWeekStart);
  const weekKeys = weekDates.map(formatDate);
  const weekDayNames = ["\u5468\u65e5", "\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d"];
  const slots = createMeetingSlots();
  const meetingDays = getMeetingDays();
  const busyMap = buildBusyMap(weekKeys, slots, meetingDays);

  meetingWeekLabel.textContent = `${weekKeys[0]} - ${weekKeys[6]}`;
  meetingStatus.textContent = meetingDays.length
    ? "\u6de1\u84dd\u8272\u8868\u793a\u6211\u5df2\u7ecf\u5b89\u6392\u7684\u65f6\u95f4\u6bb5\uff0c\u5305\u542b\u5f53\u524d\u5f85\u529e\u91cc\u5c1a\u672a\u5bfc\u51fa\u7684\u4efb\u52a1\u3002"
    : "\u8bf7\u5148\u5728\u5de5\u4f5c\u65e5\u5386\u4e2d\u8bfb\u53d6\u6bcf\u65e5\u8868\u683c\u6570\u636e\u3002";

  const header = [
    `<div class="meeting-cell meeting-head meeting-time meeting-corner">\u65f6\u95f4</div>`,
    ...weekDates.map((date, index) => {
      const key = formatDate(date);
      return `<div class="meeting-cell meeting-head"><strong>${weekDayNames[date.getDay()]}</strong><br>${key}</div>`;
    })
  ].join("");

  const body = slots
    .map((slot) => {
      const row = [`<div class="meeting-cell meeting-time">${slot.label}</div>`];
      weekKeys.forEach((dateKey) => {
        const busy = busyMap.get(`${dateKey}|${slot.label}`);
        row.push(
          `<div class="meeting-cell${busy ? " meeting-busy" : ""}"></div>`
        );
      });
      return row.join("");
    })
    .join("");

  meetingGrid.innerHTML = header + body;
}

function getMeetingDays() {
  const currentMap = new Map();
  getScheduledTasks().forEach((task) => {
    const date = normalizeTaskDate(task);
    if (!currentMap.has(date)) {
      currentMap.set(date, []);
    }
    currentMap.get(date).push({
      text: task.text,
      priority: priorityMap[task.priority]?.label || label.medium,
      minutes: Number(task.minutes || 0),
      startTime: task.startTime,
      completed: task.completed
    });
  });

  const currentDates = new Set(currentMap.keys());
  const importedDays = calendarDays.filter((day) => !currentDates.has(day.date));
  const currentDays = [...currentMap.entries()].map(([date, dayTasks]) => ({ date, tasks: dayTasks }));
  return mergeDays([...importedDays, ...currentDays]);
}

function createMeetingSlots() {
  const slots = [];
  for (let minutes = 8 * 60; minutes < 22 * 60; minutes += 30) {
    slots.push({ label: minutesToTime(minutes), start: minutes, end: minutes + 30 });
  }
  return slots;
}

function buildBusyMap(weekKeys, slots, sourceDays) {
  const map = new Map();

  sourceDays
    .filter((day) => weekKeys.includes(day.date))
    .forEach((day) => {
      day.tasks.forEach((task) => {
        if (!task.startTime || !task.minutes) {
          return;
        }

        const start = timeToMinutes(task.startTime);
        const end = start + Number(task.minutes || 0);
        slots.forEach((slot) => {
          const overlaps = start < slot.end && end > slot.start;
          if (!overlaps) {
            return;
          }
          const key = `${day.date}|${slot.label}`;
          const existing = map.get(key);
          map.set(key, {
            title: existing ? `${existing.title}\uff1b${task.text}` : task.text,
            first: !existing && start >= slot.start && start < slot.end
          });
        });
      });
    });

  return map;
}

function closeDialogOnBackdrop(dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function bindHorizontalWheel(element) {
  let lastPointer = { x: -1, y: -1 };

  const isPointerInside = () => {
    const rect = element.getBoundingClientRect();
    return (
      lastPointer.x >= rect.left &&
      lastPointer.x <= rect.right &&
      lastPointer.y >= rect.top &&
      lastPointer.y <= rect.bottom
    );
  };

  const handleWheel = (event) => {
    if (!calendarDialog.open || !isPointerInside() || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.preventDefault();
    element.scrollLeft += event.deltaY;
  };

  document.addEventListener("pointermove", (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
  });
  element.addEventListener(
    "wheel",
    handleWheel,
    { passive: false }
  );
  document.addEventListener(
    "wheel",
    handleWheel,
    { passive: false }
  );
}

taskForm.addEventListener("submit", addTask);
clearCompletedButton.addEventListener("click", clearCompleted);
deferButton.addEventListener("click", deferUnfinishedTasks);
clearAllButton.addEventListener("click", clearAll);
summaryButton.addEventListener("click", showSummary);
closeSummaryButton.addEventListener("click", () => summaryDialog.close());
calendarButton.addEventListener("click", openCalendar);
meetingButton.addEventListener("click", openMeeting);
plansButton.addEventListener("click", () => {
  initializePlanFormDates();
  renderPlans();
  plansDialog.showModal();
});
projectsButton.addEventListener("click", () => {
  renderProjects();
  projectsDialog.showModal();
});
calendarSettingsButton.addEventListener("click", () => settingsDialog.showModal());
closeCalendarButton.addEventListener("click", () => calendarDialog.close());
closeMeetingButton.addEventListener("click", () => meetingDialog.close());
closePlansButton.addEventListener("click", () => plansDialog.close());
closeProjectsButton.addEventListener("click", () => projectsDialog.close());
closeSettingsButton.addEventListener("click", () => settingsDialog.close());
planForm.addEventListener("submit", createPlan);
projectForm.addEventListener("submit", createProject);
chooseFolderButton.addEventListener("click", chooseCalendarFolder);
refreshCalendarButton.addEventListener("click", () => refreshCalendarData({ force: true }));
prevWeekButton.addEventListener("click", () => {
  meetingWeekStart = addDays(meetingWeekStart, -7);
  renderMeetingGrid();
});
nextWeekButton.addEventListener("click", () => {
  meetingWeekStart = addDays(meetingWeekStart, 7);
  renderMeetingGrid();
});
clearFolderButton.addEventListener("click", async () => {
  directoryHandle = null;
  calendarDays = [];
  selectedDay = null;
  clearCalendarCache();
  await clearStoredDirectoryHandle();
  updateFolderStatus(label.noFolder);
  renderCalendar();
});
closeDialogOnBackdrop(summaryDialog);
closeDialogOnBackdrop(calendarDialog);
closeDialogOnBackdrop(settingsDialog);
closeDialogOnBackdrop(meetingDialog);
closeDialogOnBackdrop(plansDialog);
closeDialogOnBackdrop(projectsDialog);
bindHorizontalWheel(calendarScroller);

timeInput.addEventListener("change", () => {
  timeInput.value = normalizeMinutes(timeInput.value);
});

dayStartInput.value = dayStartTime;
taskDateInput.min = formatDate();
taskDateInput.max = formatDate(addDays(new Date(), 365));
taskDateInput.value = formatDate();
taskDateInput.addEventListener("change", render);
dayStartInput.addEventListener("change", () => {
  dayStartTime = dayStartInput.value || "09:00";
  save();
  render();
});

render();
initCalendarSettings();
initializePlanFormDates();
