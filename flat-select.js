/**
 * 扁平风格自定义下拉：展开时齿轮旋转 + 0.3s 渐显动画
 */
(function (global) {
  const OPEN_DURATION_MS = 300;
  let openInstance = null;

  function createFlatSelect(config) {
    const {
      ariaLabel,
      options,
      value,
      onChange,
      formatLabel = (opt) => opt.label,
    } = config;

    const root = document.createElement("div");
    root.className = "flat-select";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "flat-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", ariaLabel);

    const gear = document.createElement("span");
    gear.className = "flat-select-gear";
    gear.setAttribute("aria-hidden", "true");
    gear.textContent = "⚙";

    const valueEl = document.createElement("span");
    valueEl.className = "flat-select-value";

    const panel = document.createElement("ul");
    panel.className = "flat-select-panel";
    panel.setAttribute("role", "listbox");
    panel.hidden = true;

    let currentValue = value;
    let isOpen = false;
    let closeTimer = null;

    function getOption(val) {
      return options.find((o) => o.value === val) || options[0];
    }

    function updateTriggerLabel() {
      const opt = getOption(currentValue);
      valueEl.textContent = formatLabel(opt);
      trigger.setAttribute(
        "aria-label",
        `${ariaLabel}：${formatLabel(opt)}`
      );
    }

    options.forEach((opt) => {
      const li = document.createElement("li");
      li.className = "flat-select-option";
      li.setAttribute("role", "option");
      li.dataset.value = opt.value;
      li.textContent = formatLabel(opt);
      if (opt.value === currentValue) {
        li.setAttribute("aria-selected", "true");
        li.classList.add("is-selected");
      }
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        selectValue(opt.value);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        closePanel();
      });
      panel.appendChild(li);
    });

    function selectValue(val) {
      currentValue = val;
      panel.querySelectorAll(".flat-select-option").forEach((el) => {
        const selected = el.dataset.value === val;
        el.classList.toggle("is-selected", selected);
        el.setAttribute("aria-selected", selected ? "true" : "false");
      });
      updateTriggerLabel();
      onChange?.(val);
    }

    function openPanel() {
      if (isOpen) return;

      if (openInstance && openInstance !== api) {
        openInstance.close();
      }
      openInstance = api;
      isOpen = true;
      panel.hidden = false;
      root.classList.add("is-open", "is-animating");
      trigger.setAttribute("aria-expanded", "true");

      requestAnimationFrame(() => {
        panel.classList.add("is-visible");
      });

      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        root.classList.remove("is-animating");
      }, OPEN_DURATION_MS);
    }

    function closePanel() {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove("is-open", "is-animating");
      panel.classList.remove("is-visible");
      trigger.setAttribute("aria-expanded", "false");
      clearTimeout(closeTimer);

      closeTimer = setTimeout(() => {
        panel.hidden = true;
      }, OPEN_DURATION_MS);

      if (openInstance === api) {
        openInstance = null;
      }
    }

    trigger.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    root.addEventListener("click", (e) => e.stopPropagation());

    trigger.appendChild(gear);
    trigger.appendChild(valueEl);
    root.appendChild(trigger);
    root.appendChild(panel);
    updateTriggerLabel();

    const api = {
      element: root,
      getValue: () => currentValue,
      setValue: (val) => {
        if (options.some((o) => o.value === val)) {
          selectValue(val);
        }
      },
      close: closePanel,
      destroy: () => {
        closePanel();
        root.remove();
      },
    };

    return api;
  }

  document.addEventListener("click", () => {
    if (openInstance) {
      openInstance.close();
    }
  });

  global.FlatSelect = { create: createFlatSelect };
})(window);
