(() => {
  const root = document.querySelector("[data-retrieval-workflow]");
  if (!root) return;

  const controls = [...root.querySelectorAll("[data-workflow-control]")];
  const panels = [...root.querySelectorAll("[data-workflow-panel]")];
  const status = root.querySelector("[data-workflow-status]");

  if (controls.length === 0 || panels.length === 0) return;

  const announcements = {
    drafting: "Drafting agent selected. It performs high-recall, multi-round retrieval and accumulates timestamped indices in the index pool.",
    sampling: "Sampling agent selected. It uses temporal intent to curate a coherent, non-redundant index set from the timestamped index pool."
  };

  function selectStage(stage, moveFocus = false) {
    if (!(stage in announcements)) return;

    root.dataset.workflowStage = stage;
    controls.forEach((control) => {
      const selected = control.dataset.workflowControl === stage;
      control.setAttribute("aria-selected", String(selected));
      control.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.workflowPanel !== stage;
    });

    if (status) status.textContent = announcements[stage];
    if (moveFocus) controls.find((control) => control.dataset.workflowControl === stage)?.focus();
  }

  controls.forEach((control, index) => {
    control.addEventListener("click", () => selectStage(control.dataset.workflowControl));
    control.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % controls.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + controls.length) % controls.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = controls.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      selectStage(controls[nextIndex].dataset.workflowControl, true);
    });
  });

  selectStage(controls.find((control) => control.getAttribute("aria-selected") === "true")?.dataset.workflowControl || "drafting");
})();
