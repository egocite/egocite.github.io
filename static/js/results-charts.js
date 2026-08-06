(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numberFormat = new Intl.NumberFormat("en-US");
  const oneDecimalFormat = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const styles = {
    "EgoCITE-GPT": { color: "#1452a3", pointStyle: "circle", dash: [] },
    "EgoCITE-GPT (5 rounds)": { color: "#1452a3", pointStyle: "circle", dash: [] },
    "EgoCITE-GPT (1 round)": { color: "#4f83c2", pointStyle: "circle", dash: [5, 4] },
    "GPT-5.4 agent": { color: "#d68a00", pointStyle: "circle", dash: [7, 4] },
    "Gemini-3.1-Pro agent": { color: "#d55e00", pointStyle: "circle", dash: [3, 3] },
    "WorldMM-GPT": { color: "#008b83", pointStyle: "circle", dash: [3, 3] },
    "VideoRAG": { color: "#6f5aa8", pointStyle: "circle", dash: [8, 3] },
    "A-MEM": { color: "#a65086", pointStyle: "circle", dash: [2, 3] },
    "EgoRAG": { color: "#8b6a00", pointStyle: "circle", dash: [9, 4] }
  };

  function rgba(hex, alpha) {
    const value = hex.replace("#", "");
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function animation() {
    return reducedMotion ? false : { duration: 260, easing: "easeOutQuart" };
  }

  function updateMode() {
    return reducedMotion ? "none" : undefined;
  }

  function useFivePointTicks(scale) {
    const firstTick = Math.ceil(scale.min / 5) * 5;
    const lastTick = Math.floor(scale.max / 5) * 5;
    scale.ticks = [];
    for (let value = firstTick; value <= lastTick; value += 5) {
      scale.ticks.push({ value });
    }
  }

  function activateFigure(root) {
    root.classList.add("is-interactive");
    root.querySelectorAll("[data-chart-toolbar], [data-chart-inspector], [data-chart-instruction]").forEach((element) => {
      element.hidden = false;
    });
  }

  function prepareCanvas(root) {
    const wrap = root.querySelector("[data-chart-canvas-wrap]");
    wrap.hidden = false;
    return root.querySelector("[data-chart-canvas]");
  }

  function setupFigureTabs() {
    const tabList = document.querySelector("[data-figure-tabs]");
    if (!tabList) return;
    const switcher = tabList.closest("[data-figure-switcher]");
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function selectTab(selectedTab, moveFocus) {
      tabs.forEach((tab) => {
        const selected = tab === selectedTab;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        const indicator = tab.querySelector("[data-tab-indicator]");
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (indicator) indicator.textContent = selected ? "✓" : "→";
        if (panel) panel.hidden = !selected;
      });

      if (moveFocus) selectedTab.focus();
      const selectedPanel = document.getElementById(selectedTab.getAttribute("aria-controls"));
      window.requestAnimationFrame(() => {
        const canvas = selectedPanel ? selectedPanel.querySelector("[data-chart-canvas]") : null;
        const chart = canvas ? window.Chart.getChart(canvas) : null;
        if (chart) {
          chart.resize();
          chart.update("none");
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab, false));
      tab.addEventListener("keydown", (event) => {
        let nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (typeof nextIndex !== "number") return;
        event.preventDefault();
        selectTab(tabs[nextIndex], true);
      });
    });

    tabList.hidden = false;
    if (switcher) switcher.hidden = false;
    const hashPanel = window.location.hash.slice(1);
    const initialTab = tabs.find((tab) => tab.getAttribute("aria-controls") === hashPanel) || tabs[0];
    selectTab(initialTab, false);
  }

  function failFigure(root, error) {
    const wrap = root.querySelector("[data-chart-canvas-wrap]");
    if (wrap) wrap.hidden = true;
    console.error("Interactive figure failed to initialize.", error);
  }

  function populateSelect(select, items, valueFor, labelFor) {
    select.replaceChildren();
    items.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = valueFor ? valueFor(item, index) : String(item);
      option.textContent = labelFor ? labelFor(item, index) : String(item);
      select.append(option);
    });
  }

  function parseMetric(cell) {
    const match = cell.textContent.trim().replaceAll(",", "").match(/^(-?\d+(?:\.\d+)?)\s*([kKmM])?/);
    if (!match) return Number.NaN;
    const multiplier = match[2]?.toLowerCase() === "m" ? 1000000 : match[2]?.toLowerCase() === "k" ? 1000 : 1;
    return Number(match[1]) * multiplier;
  }

  function decorateRankedCell(cell, rank) {
    if (!cell || cell.dataset.rank) return;

    const valueText = cell.textContent.trim();
    const content = document.createElement("span");
    content.className = "rank-cell-content";
    const value = document.createElement("span");
    value.className = "rank-cell-value";
    while (cell.firstChild) value.append(cell.firstChild);

    const badge = document.createElement("span");
    badge.className = "rank-badge";
    badge.setAttribute("aria-hidden", "true");
    const rankLabel = `${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : "rd"}`;
    badge.dataset.label = rankLabel;
    badge.textContent = rankLabel;
    content.append(value, badge);
    cell.append(content);
    cell.dataset.rank = String(rank);
    cell.setAttribute("aria-label", `${valueText}; ${rankLabel} in this metric`);
  }

  function rankCells(cells, direction) {
    const parsed = cells
      .map((cell) => ({ cell, value: parseMetric(cell) }))
      .filter((item) => Number.isFinite(item.value));
    const values = [...new Set(parsed.map((item) => item.value))]
      .sort((left, right) => direction === "asc" ? left - right : right - left)
      .slice(0, 3);

    parsed.forEach((item) => {
      const rank = values.indexOf(item.value) + 1;
      if (rank > 0) decorateRankedCell(item.cell, rank);
    });
  }

  function dataRows(table) {
    return [...table.querySelectorAll("tbody tr")].filter((row) => !row.classList.contains("group"));
  }

  function rankTableColumns(table, directions) {
    if (!table) return;
    const rows = dataRows(table);
    directions.forEach((direction, columnIndex) => {
      if (!direction) return;
      rankCells(rows.map((row) => row.cells[columnIndex]).filter(Boolean), direction);
    });
  }

  function rankTableRows(table, direction) {
    if (!table) return;
    dataRows(table).forEach((row) => rankCells([...row.cells].slice(1), direction));
  }

  function rankStaticTables() {
    rankTableColumns(document.querySelector(".benchmark-table"), [null, null, "desc", "desc", "desc", "desc", "desc", "desc"]);
    rankTableColumns(document.querySelector(".temporal-table"), [null, "desc"]);
    rankTableColumns(document.querySelector(".habit-table"), [null, "desc", "desc"]);
    rankTableRows(document.querySelector(".rounds-table"), "desc");
  }

  function mountLegend(container, chart, datasetIndexes, onChange) {
    const buttons = new Map();

    function sync() {
      datasetIndexes.forEach((datasetIndex) => {
        const button = buttons.get(datasetIndex);
        if (!button) return;
        const visible = chart.isDatasetVisible(datasetIndex);
        button.setAttribute("aria-pressed", String(visible));
        button.title = `${visible ? "Hide" : "Show"} ${chart.data.datasets[datasetIndex].label}`;
      });
    }

    container.replaceChildren();
    const groupLabel = document.createElement("span");
    groupLabel.className = "toolbar-label";
    groupLabel.textContent = "Methods";
    container.append(groupLabel);
    datasetIndexes.forEach((datasetIndex) => {
      const dataset = chart.data.datasets[datasetIndex];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "legend-toggle";
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", `Toggle ${dataset.label}`);
      button.style.setProperty("--series-color", dataset.borderColor);

      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.setProperty("--series-color", dataset.borderColor);
      swatch.setAttribute("aria-hidden", "true");
      button.append(swatch, document.createTextNode(dataset.label));
      button.addEventListener("click", () => {
        chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
        chart.update(updateMode());
        sync();
        if (onChange) onChange();
      });
      buttons.set(datasetIndex, button);
      container.append(button);
    });

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "legend-reset";
    reset.textContent = "Show all";
    reset.addEventListener("click", () => {
      datasetIndexes.forEach((datasetIndex) => chart.setDatasetVisibility(datasetIndex, true));
      chart.update(updateMode());
      sync();
      if (onChange) onChange();
    });
    container.append(reset);
    sync();

    return { sync };
  }

  function setupRadar(radarData) {
    const root = document.querySelector('[data-chart="radar"]');
    if (!root) return;
    const canvas = prepareCanvas(root);
    const benchmarkButtons = Array.from(root.querySelectorAll("[data-radar-benchmark]"));
    let benchmark = "EgoLifeQA";
    const methods = Object.keys(radarData[benchmark].series);

    const datasets = methods.map((method) => {
      const style = styles[method];
      const isOurs = method === "EgoCITE-GPT";
      return {
        label: method,
        data: radarData[benchmark].series[method],
        borderColor: style.color,
        backgroundColor: isOurs ? rgba(style.color, 0.15) : "transparent",
        borderWidth: isOurs ? 3 : 1.7,
        borderDash: style.dash,
        pointStyle: style.pointStyle,
        pointRadius: isOurs ? 4 : 3,
        pointHoverRadius: 6,
        pointHitRadius: 10,
        pointBackgroundColor: style.color,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.2,
        fill: isOurs
      };
    });

    const chart = new window.Chart(canvas, {
      type: "radar",
      data: { labels: radarData[benchmark].categories, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animation(),
        interaction: { mode: "nearest", intersect: false },
        layout: { padding: { top: 12, right: 18, bottom: 8, left: 18 } },
        scales: {
          r: {
            min: radarData[benchmark].range[0],
            max: radarData[benchmark].range[1],
            beginAtZero: false,
            angleLines: { color: "#dfe5ec", lineWidth: 1 },
            grid: { color: "#dfe5ec" },
            pointLabels: {
              color: "#303943",
              padding: 10,
              font: { family: "Noto Sans", size: 13, weight: 600 },
              callback: (label) => label.split(" ")
            },
            ticks: {
              stepSize: radarData[benchmark].step,
              color: "#7b8590",
              backdropColor: "rgba(255,255,255,.85)",
              callback: (value) => `${Number(value).toFixed(1)}%`
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#17263a",
            padding: 11,
            callbacks: {
              title: (items) => `${benchmark} - ${radarData[benchmark].categories[items[0].dataIndex]}`,
              label: (context) => `${context.dataset.label}: ${Number(context.raw).toFixed(1)}%`
            }
          }
        },
        onClick: (_event, elements) => {
          if (!elements.length) {
            chart.setActiveElements([]);
            chart.tooltip.setActiveElements([], { x: 0, y: 0 });
            chart.update("none");
            return;
          }
          const selected = elements[0];
          const point = chart.getDatasetMeta(selected.datasetIndex).data[selected.index];
          if (!point) return;
          const active = [{ datasetIndex: selected.datasetIndex, index: selected.index }];
          chart.setActiveElements(active);
          chart.tooltip.setActiveElements(active, { x: point.x, y: point.y });
          chart.update("none");
        }
      }
    });

    function switchBenchmark(nextBenchmark) {
      benchmark = nextBenchmark;
      const current = radarData[benchmark];
      benchmarkButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.radarBenchmark === benchmark)));
      chart.data.labels = current.categories;
      chart.data.datasets.forEach((dataset) => {
        dataset.data = current.series[dataset.label];
      });
      chart.options.scales.r.min = current.range[0];
      chart.options.scales.r.max = current.range[1];
      chart.options.scales.r.ticks.stepSize = current.step;
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      chart.update(updateMode());
    }

    mountLegend(root.querySelector("[data-chart-legend]"), chart, methods.map((_method, index) => index));
    benchmarkButtons.forEach((button) => button.addEventListener("click", () => switchBenchmark(button.dataset.radarBenchmark)));
    activateFigure(root);
  }

  const dayGuidePlugin = {
    id: "selectedDayGuide",
    afterDatasetsDraw(chart) {
      if (typeof chart.$selectedDayIndex !== "number") return;
      const x = chart.scales.x.getPixelForValue(chart.$selectedDayIndex);
      const area = chart.chartArea;
      const context = chart.ctx;
      context.save();
      context.strokeStyle = "rgba(154, 101, 0, .72)";
      context.lineWidth = 1.5;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(x, area.top);
      context.lineTo(x, area.bottom);
      context.stroke();
      context.restore();
    }
  };

  function setupHorizon(horizonData) {
    const root = document.querySelector('[data-chart="horizon"]');
    if (!root) return;
    const canvas = prepareCanvas(root);
    const range = root.querySelector("[data-day-range]");
    const dayLabel = root.querySelector("[data-day-label]");
    const values = root.querySelector("[data-day-values]");
    const methods = Object.keys(horizonData.series);

    const datasets = methods.map((method) => {
      const style = styles[method];
      const isOurs = method === "EgoCITE-GPT";
      return {
        label: method,
        data: horizonData.series[method],
        borderColor: style.color,
        backgroundColor: style.color,
        borderWidth: isOurs ? 3.2 : 2,
        borderDash: style.dash,
        pointStyle: style.pointStyle,
        pointRadius: isOurs ? 4.5 : 3.5,
        pointHoverRadius: 6,
        pointHitRadius: 10,
        pointBackgroundColor: style.color,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.2,
        tension: 0,
        fill: false
      };
    });

    const chart = new window.Chart(canvas, {
      type: "line",
      data: { labels: horizonData.days.map((day) => `DAY${day}`), datasets },
      plugins: [dayGuidePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animation(),
        interaction: { mode: "index", intersect: false },
        layout: { padding: { top: 12, right: 16, bottom: 6, left: 8 } },
        scales: {
          x: {
            grid: { display: false },
            title: { display: true, text: "Days elapsed", color: "#3c4651", font: { weight: 600 } },
            ticks: { color: "#59636f" }
          },
          y: {
            min: 45,
            max: 71,
            afterBuildTicks: useFivePointTicks,
            grid: { color: "#e1e6ec" },
            title: { display: true, text: "Accuracy (%)", color: "#3c4651", font: { weight: 600 } },
            ticks: { stepSize: 5, color: "#59636f", callback: (value) => `${Number(value).toFixed(1)}%` }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#17263a",
            padding: 11,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${Number(context.raw).toFixed(1)}%`
            }
          }
        },
        onClick: (_event, elements) => {
          if (!elements.length) return;
          range.value = String(elements[0].index + 1);
          selectDay(elements[0].index, false);
        }
      }
    });

    function renderDayValues(index) {
      values.replaceChildren();
      methods.forEach((method, datasetIndex) => {
        if (!chart.isDatasetVisible(datasetIndex)) return;
        const item = document.createElement("div");
        item.className = "day-value";
        item.style.setProperty("--series-color", styles[method].color);
        const value = document.createElement("strong");
        value.textContent = `${horizonData.series[method][index].toFixed(1)}%`;
        const label = document.createElement("span");
        label.textContent = method;
        item.append(value, label);
        values.append(item);
      });
    }

    function selectDay(index, showTooltip) {
      chart.$selectedDayIndex = index;
      dayLabel.value = `DAY${index + 1}`;
      dayLabel.textContent = `DAY${index + 1}`;
      renderDayValues(index);
      const active = methods
        .map((_method, datasetIndex) => ({ datasetIndex, index }))
        .filter((item) => chart.isDatasetVisible(item.datasetIndex));
      chart.setActiveElements(active);
      if (showTooltip !== false && active.length) {
        chart.tooltip.setActiveElements(active, {
          x: chart.scales.x.getPixelForValue(index),
          y: chart.chartArea.top + 20
        });
      } else {
        chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      }
      chart.update("none");
    }

    const legend = mountLegend(root.querySelector("[data-chart-legend]"), chart, methods.map((_method, index) => index), () => selectDay(Number(range.value) - 1, false));
    void legend;
    range.addEventListener("input", () => selectDay(Number(range.value) - 1, false));
    activateFigure(root);
    selectDay(6, false);
  }

  function normalizedCost(point, pricing) {
    const weights = pricing[point.pricing];
    return weights.input * point.inputTokens + weights.output * point.outputTokens;
  }

  function compactCost(cost) {
    return cost >= 1000000 ? `${(cost / 1000000).toFixed(1)}M` : `${(cost / 1000).toFixed(1)}k`;
  }

  function latencyLabel(value) {
    return value.toFixed(1);
  }

  const tradeoffDirectionPlugin = {
    id: "tradeoffBetterDirection",
    afterDatasetsDraw(chart) {
      const { chartArea, ctx } = chart;
      if (!chartArea) return;

      const width = chartArea.right - chartArea.left;
      const height = chartArea.bottom - chartArea.top;
      const startX = chartArea.right - Math.min(width * 0.06, 44);
      const startY = chartArea.top + Math.min(height * 0.18, 70);
      const endX = startX - Math.min(width * 0.12, 94);
      const endY = startY - Math.min(height * 0.09, 42);
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowSize = width < 480 ? 8 : 10;
      const red = "#d92d20";

      ctx.save();
      ctx.strokeStyle = red;
      ctx.fillStyle = red;
      ctx.lineWidth = width < 480 ? 3 : 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle - Math.PI / 6),
        endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle + Math.PI / 6),
        endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      ctx.font = `italic 700 ${width < 480 ? 14 : 17}px "Noto Sans", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("better", endX + 8, endY - 7);
      ctx.restore();
    }
  };

  function setupTradeoff(tradeoffData) {
    const root = document.querySelector('[data-chart="tradeoff"]');
    if (!root) return;
    const canvas = prepareCanvas(root);
    const methodSelect = root.querySelector("[data-tradeoff-method]");
    const output = root.querySelector("[data-tradeoff-output]");
    const points = tradeoffData.points.map((point) => ({ ...point, cost: normalizedCost(point, tradeoffData.pricing) }));
    const sourceAreaScale = 0.0022 * 0.75 ** 2;
    const cssPixelsPerPoint = 96 / 72;
    const markerRadiusScale = 1.5;

    function bubbleRadius(cost) {
      const areaInPointsSquared = cost * sourceAreaScale;
      return Math.sqrt(areaInPointsSquared / Math.PI) * cssPixelsPerPoint * markerRadiusScale;
    }

    const paretoFrontier = {
      type: "line",
      label: "Pareto frontier",
      data: [
        { x: points[1].latency, y: points[1].accuracy },
        { x: points[0].latency, y: points[0].accuracy }
      ],
      borderColor: "#d92d20",
      borderWidth: 2.4,
      borderDash: [6, 5],
      pointRadius: 0,
      pointHitRadius: 0,
      fill: false,
      order: 10
    };

    const pointDatasets = points.map((point) => {
      const style = styles[point.method];
      return {
        type: "bubble",
        label: point.method,
        data: [{ x: point.latency, y: point.accuracy, r: bubbleRadius(point.cost), detail: point }],
        borderColor: style.color,
        backgroundColor: rgba(style.color, point.group === "ours" ? 0.72 : 0.55),
        pointStyle: "circle",
        borderWidth: point.group === "ours" ? 2.2 : 1.4,
        hoverBorderColor: "#9a6500",
        hoverBorderWidth: 3,
        hoverRadius: 3,
        hitRadius: 13,
        order: point.group === "ours" ? 0 : 2
      };
    });

    const chart = new window.Chart(canvas, {
      type: "scatter",
      data: { datasets: [paretoFrontier, ...pointDatasets] },
      plugins: [tradeoffDirectionPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animation(),
        interaction: { mode: "nearest", intersect: false },
        layout: { padding: { top: 15, right: 18, bottom: 6, left: 8 } },
        scales: {
          x: {
            type: "linear",
            min: 5,
            max: 50,
            grid: { color: "#e1e6ec" },
            title: { display: true, text: "Average latency per question (s)", color: "#3c4651", font: { weight: 600 } },
            ticks: { stepSize: 10, color: "#59636f", callback: (value) => Number(value).toFixed(1) }
          },
          y: {
            min: 31,
            max: 71,
            afterBuildTicks: useFivePointTicks,
            grid: { color: "#e1e6ec" },
            title: { display: true, text: "Accuracy (%)", color: "#3c4651", font: { weight: 600 } },
            ticks: { stepSize: 5, color: "#59636f", callback: (value) => `${Number(value).toFixed(1)}%` }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#17263a",
            padding: 11,
            filter: (item) => Boolean(item.raw && item.raw.detail),
            callbacks: {
              title: (items) => items.length && items[0].raw.detail ? items[0].raw.detail.method : "",
              label: (context) => {
                const point = context.raw.detail;
                return [
                  `Accuracy: ${point.accuracy.toFixed(1)}%`,
                  `Latency: ${latencyLabel(point.latency)} s`,
                  `Normalized cost: ${oneDecimalFormat.format(point.cost)} (${compactCost(point.cost)})`,
                  `Input / output tokens: ${numberFormat.format(point.inputTokens)} / ${numberFormat.format(point.outputTokens)}`
                ];
              }
            }
          }
        },
        onClick: (_event, elements) => {
          const pointElement = elements.find((element) => element.datasetIndex > 0);
          if (!pointElement) return;
          methodSelect.value = chart.data.datasets[pointElement.datasetIndex].label;
          selectMethod(methodSelect.value, true);
        }
      }
    });

    const datasetIndexes = points.map((_point, index) => index + 1);
    populateSelect(methodSelect, points, (point) => point.method, (point) => point.method);

    function metric(label, value) {
      const item = document.createElement("span");
      item.className = "tradeoff-value";
      const strong = document.createElement("strong");
      strong.textContent = value;
      const caption = document.createElement("span");
      caption.textContent = label;
      item.append(strong, caption);
      return item;
    }

    function renderPoint(point) {
      output.replaceChildren(
        metric("Accuracy", `${point.accuracy.toFixed(1)}%`),
        metric("Avg. latency", `${latencyLabel(point.latency)} s`),
        metric("Normalized cost", `${compactCost(point.cost)} (${oneDecimalFormat.format(point.cost)})`),
        metric("Input / output", `${numberFormat.format(point.inputTokens)} / ${numberFormat.format(point.outputTokens)}`)
      );
    }

    function selectMethod(method, showTooltip) {
      const pointIndex = points.findIndex((point) => point.method === method);
      if (pointIndex < 0) return;
      const datasetIndex = pointIndex + 1;
      if (!chart.isDatasetVisible(datasetIndex)) {
        chart.setDatasetVisibility(datasetIndex, true);
        legend.sync();
      }
      const point = points[pointIndex];
      renderPoint(point);
      chart.update("none");
      if (showTooltip !== false) {
        window.requestAnimationFrame(() => {
          const element = chart.getDatasetMeta(datasetIndex).data[0];
          if (!element) return;
          chart.setActiveElements([{ datasetIndex, index: 0 }]);
          chart.tooltip.setActiveElements([{ datasetIndex, index: 0 }], { x: element.x, y: element.y });
          chart.update("none");
        });
      }
    }

    function handleLegendChange() {
      const selectedIndex = chart.data.datasets.findIndex((dataset) => dataset.label === methodSelect.value);
      if (!chart.isDatasetVisible(selectedIndex)) {
        const nextVisible = datasetIndexes.find((datasetIndex) => chart.isDatasetVisible(datasetIndex));
        if (typeof nextVisible !== "number") {
          output.textContent = "All methods are hidden. Select Show all to restore the comparison.";
          return;
        }
        methodSelect.value = chart.data.datasets[nextVisible].label;
      }
      selectMethod(methodSelect.value, false);
    }

    const legend = mountLegend(root.querySelector("[data-chart-legend]"), chart, datasetIndexes, handleLegendChange);
    methodSelect.addEventListener("change", () => selectMethod(methodSelect.value, false));
    activateFigure(root);
    selectMethod(points[0].method, false);
  }

  async function init() {
    rankStaticTables();
    if (!window.Chart) {
      console.error("Chart.js did not load; static figure fallbacks remain visible.");
      return;
    }

    window.Chart.defaults.font.family = '"Noto Sans", sans-serif';
    window.Chart.defaults.font.size = 13;
    window.Chart.defaults.color = "#59636f";
    window.Chart.defaults.borderColor = "#dfe3e8";

    let data;
    try {
      const response = await fetch("static/data/results.json?v=8");
      if (!response.ok) throw new Error(`Results data request failed with ${response.status}.`);
      data = await response.json();
    } catch (error) {
      console.error("Results data could not be loaded; static figure fallbacks remain visible.", error);
      return;
    }

    [
      [document.querySelector('[data-chart="radar"]'), () => setupRadar(data.radar)],
      [document.querySelector('[data-chart="horizon"]'), () => setupHorizon(data.horizon)],
      [document.querySelector('[data-chart="tradeoff"]'), () => setupTradeoff(data.tradeoff)]
    ].forEach(([root, setup]) => {
      if (!root) return;
      try {
        setup();
      } catch (error) {
        failFigure(root, error);
      }
    });
    setupFigureTabs();
  }

  init();
})();
