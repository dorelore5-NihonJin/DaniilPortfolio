(() => {
  "use strict";
  const api = window.portfolio;
  const projectId = new URLSearchParams(location.search).get("project");
  const project = Object.hasOwn(window.projectData, projectId)
    ? window.projectData[projectId]
    : null;
  const main = document.getElementById("page-content");
  const localized = (value) => value?.[api.lang] ?? value?.en ?? "";
  const setText = (id, value) =>
    (document.getElementById(id).textContent = value);
  const list = (element, values, tag = "li") => {
    element.replaceChildren(
      ...values.map((value) => {
        const item = document.createElement(tag);
        item.textContent = value;
        return item;
      }),
    );
  };
  if (!project) {
    const state = document.createElement("section");
    state.className = "empty-state";
    const heading = document.createElement("h1");
    heading.dataset.i18n = "ui.notFound";
    const message = document.createElement("p");
    message.dataset.i18n = "ui.notFoundText";
    const back = document.createElement("a");
    back.href = "index.html#projects";
    back.className = "button button-primary";
    back.dataset.i18n = "ui.back";
    state.append(heading, message, back);
    main.replaceChildren(state);
    const renderError = () => {
      api.translate(main);
      document.title = api.text("notFound") + " | Daniil Kulakov";
      document.querySelector('meta[name="description"]').content =
        api.text("notFoundText");
    };
    document.addEventListener("portfolio:language", renderError);
    renderError();
    return;
  }
  document.getElementById("project-title").removeAttribute("data-i18n");
  const image = document.getElementById("gallery-image");
  const featured = document.getElementById("gallery-featured");
  const thumbnails = document.getElementById("gallery-thumbnails");
  const previous = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  const lightbox = document.getElementById("image-lightbox");
  const fullImage = document.getElementById("lightbox-image");
  const stage = document.getElementById("image-stage");
  let activeImage = 0;
  let zoom = 1;
  const screenshots = project.screenshots || [];
  const updateZoom = () => {
    const fitWidth = Math.min(
      stage.clientWidth,
      fullImage.naturalWidth || stage.clientWidth,
    );
    fullImage.style.width = Math.round(fitWidth * zoom) + "px";
    document.getElementById("zoom-reset").textContent =
      Math.round(zoom * 100) + "%";
    document.getElementById("zoom-out").disabled = zoom <= 1;
    document.getElementById("zoom-in").disabled = zoom >= 3;
  };
  const setZoom = (value) => {
    zoom = Math.max(1, Math.min(3, value));
    updateZoom();
  };
  const selectImage = (index) => {
    activeImage = (index + screenshots.length) % screenshots.length;
    image.src = `assets/images/${projectId}-${activeImage + 1}-1200.webp`;
    image.alt = `${localized(project.title)} — ${api.text("image")} ${activeImage + 1}`;
    featured.href = screenshots[activeImage];
    featured.setAttribute(
      "aria-label",
      `${api.text("openImage")} ${activeImage + 1}`,
    );
    setText(
      "gallery-count",
      `${String(activeImage + 1).padStart(2, "0")} / ${String(screenshots.length).padStart(2, "0")}`,
    );
    [...thumbnails.children].forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === activeImage)),
    );
    if (lightbox.open) {
      fullImage.src = screenshots[activeImage];
      fullImage.alt = image.alt;
      setText(
        "viewer-title",
        `${api.text("image")} ${activeImage + 1} / ${screenshots.length}`,
      );
      setZoom(1);
    }
  };
  const render = () => {
    for (const key of [
      "title",
      "tag",
      "summary",
      "overview",
      "role",
      "outcome",
    ])
      setText("project-" + key, localized(project[key]));
    document.title = localized(project.title) + " | Daniil Kulakov";
    document.querySelector('meta[name="description"]').content = localized(
      project.summary,
    );
    document.querySelector('meta[property="og:title"]').content =
      document.title;
    document.querySelector('meta[property="og:description"]').content =
      localized(project.summary);
    list(document.getElementById("project-tasks"), localized(project.tasks));
    list(
      document.getElementById("project-tools"),
      localized(project.tools),
      "span",
    );
    const live = document.getElementById("project-live-link");
    live.hidden = !project.liveUrl;
    if (project.liveUrl) {
      live.href = project.liveUrl;
      live.textContent = localized(project.liveLabel) + " ↗";
    }
    const snapshot = document.getElementById("project-snapshot");
    snapshot.replaceChildren();
    for (const [value, label] of localized(project.snapshot) || []) {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      snapshot.append(row);
    }
    const focus = document.getElementById("project-focus");
    focus.replaceChildren();
    const focusItems = localized(project.focus);
    if (Array.isArray(focusItems) && focusItems.length) {
      const ul = document.createElement("ul");
      list(ul, focusItems);
      focus.append(ul);
    }
    thumbnails.replaceChildren();
    screenshots.forEach((path, index) => {
      const button = document.createElement("button");
      button.className = "gallery-thumbnail";
      button.type = "button";
      button.setAttribute("aria-label", `${api.text("image")} ${index + 1}`);
      const thumbnail = document.createElement("img");
      thumbnail.src = `assets/images/${projectId}-${index + 1}-${index === 0 ? 640 : 1200}.webp`;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";
      button.append(thumbnail);
      button.addEventListener("click", () => selectImage(index));
      thumbnails.append(button);
    });
    previous.disabled = next.disabled = screenshots.length < 2;
    if (screenshots.length) selectImage(activeImage);
    else document.querySelector(".project-gallery").hidden = true;
  };
  previous.addEventListener("click", () => selectImage(activeImage - 1));
  next.addEventListener("click", () => selectImage(activeImage + 1));
  document
    .querySelector(".project-gallery")
    .addEventListener("keydown", (event) => {
      if (
        ["ArrowLeft", "ArrowRight"].includes(event.key) &&
        screenshots.length > 1
      ) {
        event.preventDefault();
        selectImage(activeImage + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
  featured.addEventListener("click", (event) => {
    event.preventDefault();
    fullImage.src = screenshots[activeImage];
    fullImage.alt = image.alt;
    setText(
      "viewer-title",
      `${api.text("image")} ${activeImage + 1} / ${screenshots.length}`,
    );
    lightbox.setAttribute("aria-label", api.text("openImage"));
    lightbox.showModal();
    setZoom(1);
  });
  fullImage.addEventListener("load", updateZoom);
  lightbox.addEventListener("close", () => {
    setZoom(1);
    stage.scrollTop = stage.scrollLeft = 0;
  });
  lightbox.addEventListener("keydown", (event) => {
    if (
      ["ArrowLeft", "ArrowRight"].includes(event.key) &&
      zoom === 1 &&
      screenshots.length > 1
    ) {
      event.preventDefault();
      selectImage(activeImage + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  document
    .getElementById("zoom-in")
    .addEventListener("click", () => setZoom(zoom + 0.25));
  document
    .getElementById("zoom-out")
    .addEventListener("click", () => setZoom(zoom - 0.25));
  document
    .getElementById("zoom-reset")
    .addEventListener("click", () => setZoom(1));
  window.addEventListener("resize", () => {
    if (lightbox.open) updateZoom();
  });
  document.addEventListener("portfolio:language", render);
  render();
})();
