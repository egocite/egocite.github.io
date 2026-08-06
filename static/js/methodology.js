(() => {
  const table = document.querySelector("#method-view-table");
  const controls = [...document.querySelectorAll("[data-method-control]")];
  const status = document.querySelector("#method-table-status");
  const tablePanel = document.querySelector("#method-table-panel");
  const retrievalPanel = document.querySelector("#method-retrieval-panel");
  const constructionTitle = document.querySelector("#construction-title");
  const constructionIntro = document.querySelector("#construction-intro");
  const constructionDetails = [...document.querySelectorAll("[data-construction-detail]")];

  if (!table || !tablePanel || !retrievalPanel || controls.length === 0) return;

  const announcements = {
    index: "EgoIndex selected. The View and Component columns are highlighted.",
    scheme: "EgoScheme selected. The Specification and Example columns are highlighted.",
    retrv: "EgoRetrv selected. The index construction table is hidden and the dual-agent retrieval workflow is shown."
  };
  const constructionTitles = {
    index: "EgoIndex Multi-View Egocentric Memory Indexing",
    scheme: "EgoScheme Context-Augmented Index Construction"
  };
  const constructionIntros = {
    index: "EgoIndex separates experience along two axes: physical behavior versus spoken interaction, and fine- versus coarse-grained semantics. This results in four views: action, activity, utterance, and conversation.",
    scheme: "EgoScheme uses local multimodal context to transform fragmentary captions and transcripts into self-contained atomic memory indices. It defines a structured specification for all four views using two principles: (1) human-centered indices anchor each memory to a specific person, while (2) decoupled indices capture one coherent behavior, activity, utterance, or conversational topic."
  };

  function selectComponent(component, moveFocus = false) {
    if (!(component in announcements)) return;

    const showRetrieval = component === "retrv";
    table.dataset.methodFocus = component;
    tablePanel.dataset.methodFocus = component;
    controls.forEach((control) => {
      const selected = control.dataset.methodControl === component;
      control.setAttribute("aria-selected", String(selected));
      control.tabIndex = selected ? 0 : -1;
    });
    tablePanel.hidden = showRetrieval;
    if (!showRetrieval) tablePanel.setAttribute("aria-labelledby", `method-tab-${component}`);
    if (constructionTitle && component in constructionTitles) constructionTitle.textContent = constructionTitles[component];
    if (constructionIntro && component in constructionIntros) constructionIntro.textContent = constructionIntros[component];
    constructionDetails.forEach((detail) => {
      detail.hidden = detail.dataset.constructionDetail !== component;
    });
    retrievalPanel.hidden = !showRetrieval;

    if (status) status.textContent = announcements[component];
    if (moveFocus) controls.find((control) => control.dataset.methodControl === component)?.focus();
  }

  controls.forEach((control, index) => {
    control.addEventListener("click", () => selectComponent(control.dataset.methodControl));
    control.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % controls.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + controls.length) % controls.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = controls.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      selectComponent(controls[nextIndex].dataset.methodControl, true);
    });
  });

  selectComponent(controls.find((control) => control.getAttribute("aria-selected") === "true")?.dataset.methodControl || "index");
})();
