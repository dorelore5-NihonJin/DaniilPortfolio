(() => {
  "use strict";
  const { get, text } = window.portfolio;
  const languageNames = {
    en: ["Russian", "English", "Japanese", "Native"],
    ru: ["Русский", "Английский", "Японский", "Родной"],
    ja: ["ロシア語", "英語", "日本語", "母語"],
    ms: ["Rusia", "Inggeris", "Jepun", "Asli"],
    th: ["รัสเซีย", "อังกฤษ", "ญี่ปุ่น", "ภาษาแม่"],
    vi: ["Tiếng Nga", "Tiếng Anh", "Tiếng Nhật", "Bản ngữ"],
  };
  const render = () => {
    document.title = get("title");
    const description = get("description");
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content =
      document.title;
    document.querySelector('meta[property="og:description"]').content =
      description;
    const names = languageNames[window.portfolio.lang];
    document
      .querySelectorAll("[data-language-name]")
      .forEach((element, index) => (element.textContent = names[index]));
    document.querySelector('[data-proficiency="native"]').textContent =
      names[3];
    document.querySelector(".hero-work-image img").alt =
      get("projects.cards.1.1") + " — JKT / Ubuntu VPS";
    document
      .querySelectorAll(".project-card img")
      .forEach(
        (image, index) => (image.alt = get(`projects.cards.${index}.1`)),
      );
    document.querySelector(".copy-status").textContent = "";
  };
  document.addEventListener("portfolio:language", render);
  render();
  const filters = [...document.querySelectorAll(".skill-filter")];
  const groups = [...document.querySelectorAll("[data-skill]")];
  filters.forEach((filter) =>
    filter.addEventListener("click", () => {
      filters.forEach((button) =>
        button.setAttribute("aria-pressed", String(button === filter)),
      );
      groups.forEach(
        (group) =>
          (group.hidden =
            filter.dataset.filter !== "all" &&
            group.dataset.skill !== filter.dataset.filter),
      );
    }),
  );
  const videoDialog = document.getElementById("intro-video-modal");
  const video = document.getElementById("intro-video-player");
  document.getElementById("open-intro-video").addEventListener("click", () => {
    videoDialog.showModal();
    if (video.readyState === HTMLMediaElement.HAVE_NOTHING) {
      video.preload = "metadata";
      video.load();
    }
  });
  videoDialog.addEventListener("close", () => video.pause());
  document.querySelector(".copy-email").addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText("dorelore5@gmail.com");
      status.textContent = text("copied");
    } catch {
      status.textContent = text("copyError");
    }
    status.classList.remove("sr-only");
    status.classList.add("small", "muted");
  });
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
  }
})();
