/* Page controls only. Simulation decisions remain in the exported NetLogo model. */
(() => {
  "use strict";
  const load = document.getElementById("load-model");
  const status = document.getElementById("runtime-status");
  const expand = document.getElementById("expand-model");
  const size = document.getElementById("model-size");
  const mount = document.getElementById("runtime-mount");
  const scroll = document.getElementById("runtime-scroll");
  let frame;
  let ready = false;
  let originalSize = false;
  let naturalWidth = 1215;
  let naturalHeight = 780;
  let layoutPending = false;
  let overflow = false;

  // The status line is in the sticky toolbar, so it stays visible after the page scrolls to the model.
  function updateStatus() {
    const text = overflow
      ? "Ready. Press setup, then go. The model is wider than this screen: scroll sideways inside the frame to see the strategy histories."
      : "Ready. Press setup, then go.";
    if (status.textContent !== text) status.textContent = text;
  }

  function fitModel() {
    if (!frame) return;
    const fullScreen = document.fullscreenElement === scroll;
    const availableWidth = scroll.clientWidth - (fullScreen ? 24 : 0);
    const availableHeight = Math.max(480, window.innerHeight - (fullScreen ? 60 : 140));
    // Preserve readable controls on phones; the original-size option is also useful
    // for inspecting individual marks without fractional scaling.
    const scale = originalSize ? 1 : Math.min(1, Math.max(0.72,
      Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight)));
    frame.width = String(naturalWidth);
    frame.height = String(naturalHeight);
    frame.style.transform = `scale(${scale})`;
    mount.style.width = `${Math.ceil(naturalWidth * scale)}px`;
    mount.style.height = `${Math.ceil(naturalHeight * scale)}px`;
    // Warn when part of the model, usually the view, lies outside the frame.
    overflow = naturalWidth * scale > scroll.clientWidth + 1;
    if (ready) updateStatus();
  }

  function scheduleLayout() {
    if (layoutPending) return;
    layoutPending = true;
    requestAnimationFrame(() => {
      layoutPending = false;
      fitModel();
    });
  }

  load.addEventListener("click", () => {
    if (frame) return;
    load.disabled = true;
    load.textContent = "Loading NetLogo Web…";
    status.textContent = "Preparing the model. This may take a few seconds.";
    frame = document.createElement("iframe");
    frame.src = "model.html?disableAnalytics&rev=b1abd23d3632";
    frame.title = "SBRUG interactive NetLogo model";
    frame.className = "runtime-frame";
    frame.width = "1215";
    frame.height = "780";
    frame.addEventListener("error", () => {
      status.textContent = "The model could not load. Try ‘Open separately’ or download the desktop model.";
    });
    document.getElementById("runtime-placeholder").hidden = true;
    mount.append(frame);
    fitModel();
  });

  window.addEventListener("message", (event) => {
    if (!frame || event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || !["sbrug:ready", "sbrug:resize"].includes(data.type)) return;
    if (Number.isFinite(data.height)) naturalHeight = Math.ceil(Math.min(2400, Math.max(400, data.height)));
    if (Number.isFinite(data.width)) naturalWidth = Math.ceil(Math.min(2400, Math.max(900, data.width)));
    scheduleLayout();
    if (data.type === "sbrug:ready" && !ready) {
      ready = true;
      load.hidden = true;
      expand.hidden = false;
      size.hidden = false;
      updateStatus();
      const box = scroll.getBoundingClientRect();
      // On narrow screens the toolbar does not stick (see styles.css), so show it above the model:
      // its status line may say that the model is wider than the screen.
      const target = window.matchMedia("(max-width: 600px)").matches ? document.querySelector(".runtime-toolbar") : scroll;
      if (box.top < window.innerHeight && box.bottom > 0) {
        target.scrollIntoView({ block: "start", behavior:
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    }
  });

  size.addEventListener("click", () => {
    originalSize = !originalSize;
    size.textContent = originalSize ? "Fit model" : "Original size (100%)";
    size.setAttribute("aria-pressed", String(originalSize));
    fitModel();
    if (!originalSize) scroll.scrollIntoView({ block: "start", behavior: "auto" });
  });

  expand.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (scroll.requestFullscreen) await scroll.requestFullscreen();
      else window.open("model.html?disableAnalytics&rev=b1abd23d3632", "_blank", "noopener");
    } catch {
      status.textContent = "Use ‘Open separately’ to give the model more space.";
    }
  });
  document.addEventListener("fullscreenchange", () => {
    expand.textContent = document.fullscreenElement ? "Exit full screen ↙" : "Expand model ⤢";
    scheduleLayout();
    if (!document.fullscreenElement) requestAnimationFrame(() =>
      scroll.scrollIntoView({ block: "start", behavior: "auto" }));
  });
  document.getElementById("exit-model-fullscreen").addEventListener("click", () => document.exitFullscreen());
  window.addEventListener("resize", scheduleLayout);
  if (window.ResizeObserver) new ResizeObserver(scheduleLayout).observe(scroll);
})();
