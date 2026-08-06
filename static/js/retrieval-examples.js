(() => {
  const root = document.querySelector("[data-retrieval-examples]");
  if (!root) return;

  const mount = document.querySelector("[data-retrieval-examples-mount]");
  if (mount) mount.append(root);
  root.hidden = false;
  root.removeAttribute("role");
  root.removeAttribute("tabindex");
  root.setAttribute("aria-labelledby", "retrieval-demo-title");

  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const status = root.querySelector("[data-retrieval-status]");

  if (tabs.length === 0 || panels.length === 0) return;

  function selectTab(tab, moveFocus = false) {
    const panelId = tab.getAttribute("aria-controls");
    const panel = panels.find((candidate) => candidate.id === panelId);
    if (!panel) return;

    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((candidate) => {
      candidate.hidden = candidate !== panel;
    });

    if (status) {
      const label = tab.querySelector(".retrieval-tab-label")?.textContent.trim() || "trace example";
      const shift = tab.querySelector(".retrieval-tab-shift")?.textContent.trim() || "";
      status.textContent = `Showing ${label}. The target-overlapping index moves from ${shift.replace("→", "to")}.`;
    }

    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });

  selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
})();
