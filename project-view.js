const translations = window.portfolioTranslations;
const params = new URLSearchParams(window.location.search);
const projectId = params.get("project");
const project = window.projectData?.[projectId];

const pageContent = document.getElementById("page-content");
const metaDescription = document.querySelector('meta[name="description"]');
const languageSwitcher = document.querySelector(".language-switcher");

const titleEl = document.getElementById("project-title");
const tagEl = document.getElementById("project-tag");
const summaryEl = document.getElementById("project-summary");
const overviewEl = document.getElementById("project-overview");
const roleEl = document.getElementById("project-role");
const tasksEl = document.getElementById("project-tasks");
const outcomeEl = document.getElementById("project-outcome");
const toolsEl = document.getElementById("project-tools");
const snapshotGridEl = document.getElementById("project-snapshot-grid");
const focusListEl = document.getElementById("project-focus-list");
const galleryEl = document.getElementById("project-gallery");
const galleryWrapEl = document.getElementById("project-gallery-wrap");
const galleryNoteEl = document.getElementById("project-gallery-note");
const slideStatusEl = document.getElementById("project-slide-status");
const thumbStripEl = document.getElementById("project-thumb-strip");
const backButton = document.querySelector(".project-top-nav a");
const projectSectionHeadings = document.querySelectorAll(".project-detail-card h2");
const galleryHeading = document.querySelector(".project-gallery-head h2");
const brandSubtitle = document.querySelector(".brand-copy span:last-child");
const sideEyebrowEl = document.getElementById("project-side-eyebrow");

const lightbox = document.getElementById("image-lightbox");
const lightboxDialog = lightbox?.querySelector(".image-lightbox-dialog");
const lightboxImage = document.getElementById("image-lightbox-image");
const lightboxStage = document.getElementById("image-lightbox-stage");
const zoomInButton = document.getElementById("lightbox-zoom-in");
const zoomOutButton = document.getElementById("lightbox-zoom-out");
const zoomResetButton = document.getElementById("lightbox-reset");
const lightboxCloseButton = document.getElementById("lightbox-close");
const lightboxCloseButtons = document.querySelectorAll("[data-lightbox-close], #lightbox-close");

const languageMeta = {
  en: { name: "English", code: "EN" },
  ja: { name: "Japanese", code: "日本語" },
  ms: { name: "Malay", code: "BM" },
  th: { name: "Thai", code: "ไทย" },
  vi: { name: "Vietnamese", code: "VI" }
};

const languageSourceKey = "portfolio-language-source";
const themeStorageKey = "portfolio-theme";
const autoLanguageMap = {
  JP: "ja",
  MY: "ms",
  TH: "th",
  VN: "vi"
};

const themeMeta = {
  light: {
    icon: "◐",
    label: "Dark mode"
  },
  dark: {
    icon: "☀",
    label: "Light mode"
  }
};

let currentZoom = 1;
let lastLightboxTrigger = null;
let swiperInstance = null;
let isRenderingLanguage = false;

const projectUiExtras = {
  sideEyebrow: {
    en: "Project Snapshot",
    ja: "プロジェクト概要",
    ms: "Ringkasan Projek",
    th: "สรุปโปรเจกต์",
    vi: "Tom tat du an"
  },
  snapshotLabels: {
    en: ["Screens", "Tasks", "Tools"],
    ja: ["画面", "作業", "技術"],
    ms: ["Skrin", "Tugas", "Alat"],
    th: ["หน้าจอ", "งาน", "เครื่องมือ"],
    vi: ["Man hinh", "Nhiem vu", "Cong cu"]
  },
  focusTitle: {
    en: "What this project shows",
    ja: "このプロジェクトで示したこと",
    ms: "Apa yang projek ini tunjukkan",
    th: "สิ่งที่โปรเจกต์นี้แสดง",
    vi: "Du an nay the hien"
  },
  slideLabel: {
    en: "Screenshot",
    ja: "スクリーンショット",
    ms: "Tangkapan skrin",
    th: "ภาพหน้าจอ",
    vi: "Anh man hinh"
  },
  pageTitle: {
    en: "Project Details | Daniil Kulakov",
    ja: "プロジェクト詳細 | Daniil Kulakov",
    ms: "Butiran Projek | Daniil Kulakov",
    th: "รายละเอียดโปรเจกต์ | Daniil Kulakov",
    vi: "Chi tiet du an | Daniil Kulakov"
  },
  pageDescription: {
    en: "Detailed project view for Daniil Kulakov's IT Support Specialist portfolio.",
    ja: "Daniil Kulakov の IT サポートポートフォリオ向けプロジェクト詳細ページ。",
    ms: "Paparan terperinci projek untuk portfolio Pakar Sokongan IT Daniil Kulakov.",
    th: "หน้ารายละเอียดโปรเจกต์สำหรับพอร์ตโฟลิโอ IT Support Specialist ของ Daniil Kulakov",
    vi: "Trang chi tiet du an trong portfolio IT Support Specialist cua Daniil Kulakov."
  },
  brandSubtitle: {
    en: "Project Detail",
    ja: "プロジェクト詳細",
    ms: "Butiran Projek",
    th: "รายละเอียดโปรเจกต์",
    vi: "Chi tiet du an"
  },
  languageLabel: {
    en: "Language selector",
    ja: "言語の選択",
    ms: "Pemilih bahasa",
    th: "ตัวเลือกภาษา",
    vi: "Lua chon ngon ngu"
  },
  viewerLabel: {
    en: "Screenshot viewer",
    ja: "スクリーンショットビューア",
    ms: "Pemapar tangkapan skrin",
    th: "ตัวดูภาพหน้าจอ",
    vi: "Trinh xem anh man hinh"
  },
  zoomIn: {
    en: "Zoom in",
    ja: "拡大",
    ms: "Zum masuk",
    th: "ขยาย",
    vi: "Phong to"
  },
  zoomOut: {
    en: "Zoom out",
    ja: "縮小",
    ms: "Zum keluar",
    th: "ย่อ",
    vi: "Thu nho"
  },
  closeViewer: {
    en: "Close viewer",
    ja: "ビューアを閉じる",
    ms: "Tutup paparan",
    th: "ปิดตัวดูภาพ",
    vi: "Dong trinh xem"
  },
  galleryAlt: {
    en: "screenshot",
    ja: "スクリーンショット",
    ms: "tangkapan skrin",
    th: "ภาพหน้าจอ",
    vi: "anh man hinh"
  },
  openInViewer: {
    en: "Open screenshot",
    ja: "スクリーンショットを開く",
    ms: "Buka tangkapan skrin",
    th: "เปิดภาพหน้าจอ",
    vi: "Mo anh man hinh"
  },
  notAvailable: {
    en: "N/A",
    ja: "該当なし",
    ms: "Tiada",
    th: "ไม่มี",
    vi: "Khong co"
  }
};

const createLanguageOption = (lang) => {
  const button = document.createElement("button");
  const meta = languageMeta[lang];

  button.className = "language-option";
  button.type = "button";
  button.dataset.lang = lang;
  button.setAttribute("role", "menuitemradio");
  button.setAttribute("aria-checked", "false");
  button.innerHTML = `<span>${meta.name}</span><strong>${meta.code}</strong>`;

  return button;
};

const initializeHeaderActions = () => {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) {
    return { themeToggle: null };
  }

  let actions = siteHeader.querySelector(".header-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "header-actions";
    siteHeader.appendChild(actions);
  }

  if (languageSwitcher && languageSwitcher.parentElement !== actions) {
    actions.appendChild(languageSwitcher);
  }

  let themeToggle = actions.querySelector(".theme-toggle");
  if (!themeToggle) {
    themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.type = "button";
    themeToggle.setAttribute("aria-label", "Toggle color theme");
    themeToggle.innerHTML = `
      <span class="theme-toggle-icon" aria-hidden="true">◐</span>
      <span class="theme-toggle-label">Dark mode</span>
    `;
    actions.prepend(themeToggle);
  }

  return { themeToggle };
};

const headerUi = initializeHeaderActions();

const initializeLanguageSwitcher = () => {
  if (!languageSwitcher) {
    return { buttons: [], trigger: null, label: null, code: null };
  }

  ["en", "ja", "ms", "th", "vi"].forEach((lang) => {
    if (!languageSwitcher.querySelector(`[data-lang="${lang}"]`)) {
      languageSwitcher.appendChild(createLanguageOption(lang));
    }
  });

  let trigger = languageSwitcher.querySelector(".language-trigger");
  if (!trigger) {
    trigger = document.createElement("button");
    trigger.className = "language-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML = `
      <span class="language-trigger-label">English</span>
      <span class="language-trigger-code">EN</span>
    `;
    languageSwitcher.prepend(trigger);
  }

  let menu = languageSwitcher.querySelector(".language-menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.className = "language-menu";
    menu.setAttribute("role", "menu");
    languageSwitcher.appendChild(menu);
  }

  const buttons = Array.from(languageSwitcher.querySelectorAll("[data-lang]"));
  buttons.forEach((button) => {
    const meta = languageMeta[button.dataset.lang];
    button.classList.remove("language-button");
    button.classList.add("language-option");
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", button.classList.contains("is-active") ? "true" : "false");
    button.innerHTML = `<span>${meta.name}</span><strong>${meta.code}</strong>`;
    menu.appendChild(button);
  });

  const closeMenu = () => {
    languageSwitcher.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", () => {
    const nextState = !languageSwitcher.classList.contains("is-open");
    languageSwitcher.classList.toggle("is-open", nextState);
    trigger.setAttribute("aria-expanded", String(nextState));
  });

  document.addEventListener("click", (event) => {
    if (!languageSwitcher.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  return {
    buttons,
    trigger,
    label: trigger.querySelector(".language-trigger-label"),
    code: trigger.querySelector(".language-trigger-code"),
    closeMenu
  };
};

const languageUi = initializeLanguageSwitcher();

const getStoredLanguage = () => {
  const stored = window.localStorage.getItem(translations?.storageKey || "portfolio-language");
  return translations?.projectUi?.[stored] ? stored : translations?.defaultLang || "en";
};

const getStoredLanguageSource = () => {
  return window.localStorage.getItem(languageSourceKey);
};

const getStoredTheme = () => {
  const storedTheme = window.localStorage.getItem(themeStorageKey);
  return storedTheme === "dark" ? "dark" : "light";
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);

  const nextMode = theme === "dark" ? "light" : "dark";
  const icon = headerUi.themeToggle?.querySelector(".theme-toggle-icon");
  const label = headerUi.themeToggle?.querySelector(".theme-toggle-label");

  if (icon) {
    icon.textContent = themeMeta[theme].icon;
  }

  if (label) {
    label.textContent = themeMeta[theme].label;
  }

  if (headerUi.themeToggle) {
    headerUi.themeToggle.setAttribute("aria-label", `Switch to ${nextMode} theme`);
  }
};

const detectLanguageByIp = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);
    const response = await fetch("https://ipwho.is/", {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return "en";
    }

    const data = await response.json();
    const countryCode = String(data?.country_code || "").toUpperCase();
    return autoLanguageMap[countryCode] || "en";
  } catch {
    return "en";
  }
};

const getLocalizedValue = (field, lang) => {
  if (!field) {
    return "";
  }
  if (typeof field === "string") {
    return field;
  }
  return field[lang] || field.en || "";
};

const getLocalizedList = (field, lang) => {
  if (!field) {
    return [];
  }
  if (Array.isArray(field)) {
    return field;
  }
  return field[lang] || field.en || [];
};

const applyZoom = () => {
  if (lightboxImage) {
    lightboxImage.style.transform = `scale(${currentZoom})`;
  }
};

const openLightbox = (src, alt, trigger) => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lastLightboxTrigger = trigger;
  currentZoom = 1;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  applyZoom();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox || !lightbox.classList.contains("is-open")) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";

  if (lastLightboxTrigger) {
    lastLightboxTrigger.focus();
  }
};

const stepZoom = (delta) => {
  currentZoom = Math.min(4, Math.max(1, currentZoom + delta));
  applyZoom();
};

const updateLanguageButtons = (lang) => {
  languageUi.buttons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });

  if (languageUi.label && languageUi.code) {
    languageUi.label.textContent = languageMeta[lang]?.name || languageMeta.en.name;
    languageUi.code.textContent = languageMeta[lang]?.code || languageMeta.en.code;
  }
};

const applyProjectUi = (lang, content) => {
  const ui = translations?.projectUi?.[lang] || translations?.projectUi?.en;

  document.documentElement.lang = lang;
  document.title = content
    ? `${content.title} | Daniil Kulakov`
    : projectUiExtras.pageTitle[lang] || projectUiExtras.pageTitle.en;

  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      projectUiExtras.pageDescription[lang] || projectUiExtras.pageDescription.en
    );
  }

  if (brandSubtitle) {
    brandSubtitle.textContent = projectUiExtras.brandSubtitle[lang] || projectUiExtras.brandSubtitle.en;
  }

  if (languageSwitcher) {
    languageSwitcher.setAttribute("aria-label", projectUiExtras.languageLabel[lang] || projectUiExtras.languageLabel.en);
  }

  if (sideEyebrowEl) {
    sideEyebrowEl.textContent = projectUiExtras.sideEyebrow[lang] || projectUiExtras.sideEyebrow.en;
  }

  if (backButton) {
    backButton.textContent = ui.back;
  }

  const headings = [ui.overview, ui.role, ui.tasks, ui.outcome, ui.tools];
  projectSectionHeadings.forEach((heading, index) => {
    heading.textContent = headings[index] || heading.textContent;
  });

  if (galleryHeading) {
    galleryHeading.textContent = ui.gallery;
  }

  if (lightboxDialog) {
    lightboxDialog.setAttribute("aria-label", projectUiExtras.viewerLabel[lang] || projectUiExtras.viewerLabel.en);
  }

  if (zoomInButton) {
    zoomInButton.setAttribute("aria-label", projectUiExtras.zoomIn[lang] || projectUiExtras.zoomIn.en);
  }

  if (zoomOutButton) {
    zoomOutButton.setAttribute("aria-label", projectUiExtras.zoomOut[lang] || projectUiExtras.zoomOut.en);
  }

  if (zoomResetButton) {
    zoomResetButton.textContent = ui.reset;
  }

  if (lightboxCloseButton) {
    lightboxCloseButton.textContent = ui.close;
    lightboxCloseButton.setAttribute("aria-label", projectUiExtras.closeViewer[lang] || projectUiExtras.closeViewer.en);
  }
};

const renderFallback = (lang) => {
  const ui = translations?.projectUi?.[lang] || translations?.projectUi?.en;

  titleEl.textContent = ui.notFoundTitle;
  tagEl.textContent = projectUiExtras.brandSubtitle[lang] || projectUiExtras.brandSubtitle.en;
  summaryEl.textContent = ui.notFoundSummary;
  overviewEl.textContent = ui.notFoundOverview;
  roleEl.textContent = projectUiExtras.notAvailable[lang] || projectUiExtras.notAvailable.en;
  outcomeEl.textContent = projectUiExtras.notAvailable[lang] || projectUiExtras.notAvailable.en;
  tasksEl.innerHTML = "";
  toolsEl.innerHTML = "";
  if (snapshotGridEl) snapshotGridEl.innerHTML = "";
  if (focusListEl) focusListEl.innerHTML = "";
  galleryEl.innerHTML = "";
  if (thumbStripEl) thumbStripEl.innerHTML = "";
  if (slideStatusEl) slideStatusEl.textContent = "";
  galleryWrapEl.classList.add("is-empty");
  galleryNoteEl.textContent = ui.noScreens;
  applyProjectUi(lang, null);
};

const listFrom = (field, lang, fallback = []) => {
  if (!field) {
    return fallback;
  }

  if (Array.isArray(field)) {
    return field;
  }

  return field[lang] || field.en || fallback;
};

const renderProjectSide = (lang, content) => {
  const labels = projectUiExtras.snapshotLabels[lang] || projectUiExtras.snapshotLabels.en;
  const snapshotItems = listFrom(project.snapshot, lang, [
    [String(project.screenshots?.length || 0), labels[0]],
    [String(content.tasks.length), labels[1]],
    [String(content.tools.length), labels[2]]
  ]);
  const focusItems = listFrom(project.focus, lang, content.tasks.slice(0, 3));

  if (snapshotGridEl) {
    snapshotGridEl.innerHTML = "";
    snapshotItems.slice(0, 4).forEach((item) => {
      const value = Array.isArray(item) ? item[0] : "";
      const label = Array.isArray(item) ? item[1] : item;
      const stat = document.createElement("article");
      stat.className = "project-snapshot-item";
      stat.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
      snapshotGridEl.appendChild(stat);
    });
  }

  if (focusListEl) {
    focusListEl.innerHTML = "";
    const heading = document.createElement("h3");
    heading.textContent = projectUiExtras.focusTitle[lang] || projectUiExtras.focusTitle.en;
    focusListEl.appendChild(heading);

    const list = document.createElement("ul");
    focusItems.slice(0, 4).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    focusListEl.appendChild(list);
  }
};

const updateSlideStatus = (swiper, total, lang) => {
  if (!slideStatusEl || !total) {
    return;
  }

  const index = swiper ? swiper.realIndex + 1 : 1;
  const label = projectUiExtras.slideLabel[lang] || projectUiExtras.slideLabel.en;
  slideStatusEl.textContent = `${label} ${index} / ${total}`;
};

const renderProject = (lang) => {
  if (!project) {
    renderFallback(lang);
    return;
  }

  const ui = translations?.projectUi?.[lang] || translations?.projectUi?.en;
  const content = {
    tag: getLocalizedValue(project.tag, lang),
    title: getLocalizedValue(project.title, lang),
    summary: getLocalizedValue(project.summary, lang),
    overview: getLocalizedValue(project.overview, lang),
    role: getLocalizedValue(project.role, lang),
    outcome: getLocalizedValue(project.outcome, lang),
    tasks: getLocalizedList(project.tasks, lang),
    tools: getLocalizedList(project.tools, lang)
  };

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  tagEl.textContent = content.tag;
  titleEl.textContent = content.title;
  summaryEl.textContent = content.summary;
  overviewEl.textContent = content.overview;
  roleEl.textContent = content.role;
  outcomeEl.textContent = content.outcome;

  tasksEl.innerHTML = "";
  content.tasks.forEach((task) => {
    const item = document.createElement("li");
    item.textContent = task;
    tasksEl.appendChild(item);
  });

  toolsEl.innerHTML = "";
  content.tools.forEach((tool) => {
    const tag = document.createElement("span");
    tag.textContent = tool;
    toolsEl.appendChild(tag);
  });
  renderProjectSide(lang, content);

  galleryEl.innerHTML = "";
  if (thumbStripEl) {
    thumbStripEl.innerHTML = "";
  }
  galleryWrapEl.classList.remove("is-empty");

  if (!project.screenshots.length) {
    galleryWrapEl.classList.add("is-empty");
    galleryNoteEl.textContent = ui.noScreens;
    if (slideStatusEl) {
      slideStatusEl.textContent = "";
    }
  } else {
    galleryNoteEl.textContent = ui.galleryHint;

    project.screenshots.forEach((path, index) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const link = document.createElement("a");
      link.className = "project-gallery-item";
      link.href = path;
      link.setAttribute(
        "aria-label",
        `${projectUiExtras.openInViewer[lang] || projectUiExtras.openInViewer.en} ${index + 1}`
      );

      const image = document.createElement("img");
      image.src = path;
      image.alt = `${content.title} ${projectUiExtras.galleryAlt[lang] || projectUiExtras.galleryAlt.en} ${index + 1}`;
      image.loading = "lazy";

      link.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(path, image.alt, link);
      });

      link.appendChild(image);
      slide.appendChild(link);
      galleryEl.appendChild(slide);

      if (thumbStripEl) {
        const thumbButton = document.createElement("button");
        thumbButton.className = "project-thumb-button";
        thumbButton.type = "button";
        thumbButton.dataset.slideIndex = String(index);
        thumbButton.setAttribute("aria-label", `${projectUiExtras.slideLabel[lang] || projectUiExtras.slideLabel.en} ${index + 1}`);
        thumbButton.innerHTML = `<img src="${path}" alt="">`;
        thumbStripEl.appendChild(thumbButton);
      }
    });

    swiperInstance = new Swiper("#project-swiper", {
      loop: project.screenshots.length > 1,
      speed: 900,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      autoplay: project.screenshots.length > 1
        ? {
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }
        : false,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      on: {
        init(swiper) {
          updateSlideStatus(swiper, project.screenshots.length, lang);
          thumbStripEl?.querySelectorAll(".project-thumb-button").forEach((button) => {
            button.classList.toggle("is-active", Number(button.dataset.slideIndex) === swiper.realIndex);
          });
        },
        slideChange(swiper) {
          updateSlideStatus(swiper, project.screenshots.length, lang);
          thumbStripEl?.querySelectorAll(".project-thumb-button").forEach((button) => {
            button.classList.toggle("is-active", Number(button.dataset.slideIndex) === swiper.realIndex);
          });
        }
      }
    });

    thumbStripEl?.querySelectorAll(".project-thumb-button").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.slideIndex || 0);
        if (swiperInstance?.slideToLoop) {
          swiperInstance.slideToLoop(index);
        } else {
          swiperInstance?.slideTo(index);
        }
      });
    });
  }

  applyProjectUi(lang, content);
};

const switchLanguage = (lang, source = "manual") => {
  const nextLang = translations?.projectUi?.[lang] ? lang : translations?.defaultLang || "en";
  if (isRenderingLanguage) {
    return;
  }

  isRenderingLanguage = true;
  window.localStorage.setItem(translations?.storageKey || "portfolio-language", nextLang);
  window.localStorage.setItem(languageSourceKey, source);
  updateLanguageButtons(nextLang);
  languageUi.closeMenu?.();

  if (!pageContent) {
    renderProject(nextLang);
    isRenderingLanguage = false;
    return;
  }

  pageContent.classList.add("is-switching");
  renderProject(nextLang);
  window.requestAnimationFrame(() => {
    pageContent.classList.remove("is-switching");
    isRenderingLanguage = false;
  });
};

zoomInButton?.addEventListener("click", () => stepZoom(0.25));
zoomOutButton?.addEventListener("click", () => stepZoom(-0.25));
zoomResetButton?.addEventListener("click", () => {
  currentZoom = 1;
  applyZoom();
});

lightboxStage?.addEventListener(
  "wheel",
  (event) => {
    if (!lightbox?.classList.contains("is-open")) {
      return;
    }

    event.preventDefault();
    stepZoom(event.deltaY < 0 ? 0.2 : -0.2);
  },
  { passive: false }
);

lightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "+" || event.key === "=") {
    stepZoom(0.25);
  }

  if (event.key === "-") {
    stepZoom(-0.25);
  }
});

languageUi.buttons.forEach((button) => {
  button.addEventListener("click", () => {
    switchLanguage(button.dataset.lang, "manual");
  });
});

headerUi.themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

const initializeLanguage = async () => {
  const storedLanguage = getStoredLanguage();
  const storedSource = getStoredLanguageSource();

  if (storedSource === "manual") {
    switchLanguage(storedLanguage, "manual");
    return;
  }

  const detectedLanguage = await detectLanguageByIp();
  switchLanguage(detectedLanguage || "en", "auto");
};

applyTheme(getStoredTheme());
initializeLanguage();
