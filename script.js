/* Daniil Kulakov | IT Support Specialist Portfolio Interactive Logic */

const translations = window.portfolioTranslations;
const pageContent = document.getElementById("page-content");
const metaDescription = document.querySelector('meta[name="description"]');

const revealItems = document.querySelectorAll(".reveal");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const languageSwitcher = document.querySelector(".language-switcher");

const languageMeta = {
  en: { name: "English", code: "EN" },
  ru: { name: "Русский", code: "RU" },
  ja: { name: "Japanese", code: "日本語" },
  ms: { name: "Malay", code: "BM" },
  th: { name: "Thai", code: "ไทย" },
  vi: { name: "Vietnamese", code: "VI" }
};

const languageSourceKey = "portfolio-language-source";
const themeStorageKey = "portfolio-theme";
const autoLanguageMap = {
  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",
  AM: "ru",
  AZ: "ru",
  MD: "ru",
  TJ: "ru",
  TM: "ru",
  UZ: "ru",
  JP: "ja",
  MY: "ms",
  TH: "th",
  VN: "vi"
};
const russianFallbackLanguages = new Set(["be", "kk", "ky", "hy", "az", "tg", "tk", "uz"]);

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
const themeCopy = {
  en: { light: "Dark mode", dark: "Light mode", ariaLight: "Switch to dark theme", ariaDark: "Switch to light theme" },
  ru: { light: "Тёмная тема", dark: "Светлая тема", ariaLight: "Переключить на тёмную тему", ariaDark: "Переключить на светлую тему" }
};

const uiCopy = {
  brandRole: {
    en: "IT Support Specialist",
    ru: "Специалист технической поддержки",
    ja: "ITサポートスペシャリスト",
    ms: "Pakar Sokongan IT",
    th: "IT Support Specialist",
    vi: "Chuyên viên Hỗ trợ IT"
  },
  navToggleLabel: {
    en: "Toggle navigation",
    ru: "Открыть или закрыть навигацию",
    ja: "ナビゲーションを切り替える",
    ms: "Tukar navigasi",
    th: "สลับเมนูนำทาง",
    vi: "Mở hoặc đóng điều hướng"
  },
  languageLabel: {
    en: "Language selector",
    ru: "Выбор языка",
    ja: "言語の選択",
    ms: "Pemilih bahasa",
    th: "ตัวเลือกภาษา",
    vi: "Lựa chọn ngôn ngữ"
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

  ["en", "ru", "ja", "ms", "th", "vi"].forEach((lang) => {
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
  return translations?.index?.[stored] ? stored : translations?.defaultLang || "en";
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
  const currentLanguage = document.documentElement.lang || "en";
  const localizedTheme = themeCopy[currentLanguage] || themeCopy.en;
  const icon = headerUi.themeToggle?.querySelector(".theme-toggle-icon");
  const label = headerUi.themeToggle?.querySelector(".theme-toggle-label");

  if (icon) {
    icon.textContent = themeMeta[theme].icon;
  }

  if (label) {
    label.textContent = localizedTheme[theme];
  }

  if (headerUi.themeToggle) {
    headerUi.themeToggle.setAttribute("aria-label", nextMode === "dark" ? localizedTheme.ariaLight : localizedTheme.ariaDark);
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

const detectLanguageFromBrowser = () => {
  const browserLanguages = Array.isArray(window.navigator.languages) && window.navigator.languages.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const locale of browserLanguages) {
    const normalizedLocale = String(locale || "").trim().toLowerCase().replace("_", "-");
    const [language, region] = normalizedLocale.split("-");

    if (languageMeta[language]) {
      return language;
    }

    if (russianFallbackLanguages.has(language) || autoLanguageMap[String(region || "").toUpperCase()] === "ru") {
      return "ru";
    }
  }

  return null;
};

const detectPreferredLanguage = async () => {
  return detectLanguageFromBrowser() || await detectLanguageByIp() || translations?.defaultLang || "en";
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

const setSectionList = (items, values, builder) => {
  items.forEach((item, index) => {
    if (values[index]) builder(item, values[index], index);
  });
};

const applyIndexTranslations = (lang) => {
  const content = translations?.index?.[lang] || translations?.index?.en;
  if (!content) {
    return;
  }

  document.documentElement.lang = lang;
  document.title = content.title;

  if (metaDescription) {
    metaDescription.setAttribute("content", content.description);
  }

  const brandRole = document.querySelector(".brand-copy span:last-child");
  if (brandRole) {
    brandRole.textContent = uiCopy.brandRole[lang] || uiCopy.brandRole.en;
  }

  if (navToggle) {
    navToggle.setAttribute("aria-label", uiCopy.navToggleLabel[lang] || uiCopy.navToggleLabel.en);
  }

  if (languageSwitcher) {
    languageSwitcher.setAttribute("aria-label", uiCopy.languageLabel[lang] || uiCopy.languageLabel.en);
  }

  applyTheme(document.documentElement.dataset.theme || getStoredTheme());

  setSectionList(navLinks, content.nav, (item, value) => {
    item.textContent = value;
  });

  const heroRole = document.querySelector(".hero-role");
  const heroTitle = document.querySelector(".hero-copy h1");
  const heroText = document.querySelector(".hero-text");
  const heroActions = document.querySelectorAll(".hero-actions .button");
  const heroProofItems = document.querySelectorAll(".hero-proof-item");

  if (heroRole) heroRole.textContent = content.hero.role;
  if (heroTitle) heroTitle.textContent = content.hero.title;
  if (heroText) heroText.textContent = content.hero.text;

  setSectionList(heroActions, content.hero.actions, (item, value) => {
    // Keep text node content but preserve child icons
    const icon = item.querySelector("i");
    item.innerHTML = "";
    if (icon) item.appendChild(icon);
    item.appendChild(document.createTextNode((icon ? " " : "") + value));
  });

  setSectionList(heroProofItems, content.hero.proof, (item, value) => {
    const label = item.querySelector("span");
    const strong = item.querySelector("strong");
    if (label) label.textContent = value[0];
    if (strong) strong.textContent = value[1];
  });

  // Localize Ops Console
  const consoleContent = content.opsConsole;
  if (consoleContent) {
    const consoleLabel = document.querySelector(".ops-console-head .ops-console-window-title");
    const consoleStatus = document.querySelector(".ops-status");
    const consoleNodes = document.querySelectorAll(".ops-node span");
    const logItems = document.querySelectorAll(".ops-log p");
    
    if (consoleLabel) consoleLabel.textContent = `operator@daniil-systems:~`;
    if (consoleStatus) consoleStatus.textContent = consoleContent.status;
    consoleNodes.forEach((nodeSpan, idx) => {
      if (consoleContent.nodes[idx]) {
        nodeSpan.textContent = consoleContent.nodes[idx];
      }
    });

    // Update active node details
    const activeNode = document.querySelector(".ops-node.is-active");
    if (activeNode) {
      const activeIdx = Number(activeNode.dataset.node || 0);
      setOpsLayer(activeIdx);
    }

    logItems.forEach((logP, idx) => {
      if (consoleContent.logLines[idx]) {
        logP.textContent = consoleContent.logLines[idx];
      }
    });
  }

  // Localize Bento Grid About
  const bentoBioHead = document.querySelector(".bento-bio h3");
  const bentoBioParagraphs = document.querySelectorAll(".bento-bio-text p");
  if (bentoBioHead) bentoBioHead.textContent = content.about.facts[0][2].split("/")[0].trim();
  setSectionList(bentoBioParagraphs, content.about.copy, (item, value) => {
    item.textContent = value;
  });

  const bentoExperience = document.querySelector(".bento-experience");
  if (bentoExperience) {
    const label = bentoExperience.querySelector(".bento-label");
    const company = bentoExperience.querySelector("strong");
    const role = bentoExperience.querySelector("h4");
    const subtext = bentoExperience.querySelector(".bento-subtext");
    if (label) label.textContent = content.about.facts[0][0];
    if (company) company.textContent = content.about.facts[0][1];
    if (role) role.textContent = content.about.facts[0][2].split("/")[0].trim();
    if (subtext) subtext.textContent = content.about.facts[0][2].split("/")[1]?.trim() || "";
  }

  const bentoEducation = document.querySelector(".bento-education");
  if (bentoEducation) {
    const label = bentoEducation.querySelector(".bento-label");
    const school = bentoEducation.querySelector("strong");
    const program = bentoEducation.querySelector("h4");
    const degree = bentoEducation.querySelector(".bento-subtext");
    if (label) label.textContent = content.about.facts[1][0];
    if (school) school.textContent = content.about.facts[1][1].split("/")[0].trim();
    if (program) program.textContent = content.about.facts[1][1].split("/")[1]?.trim() || content.about.facts[1][1];
    if (degree) degree.textContent = content.about.facts[1][2];
  }

  const langLabel = document.querySelector(".bento-languages .bento-label");
  if (langLabel) langLabel.textContent = content.about.facts[2][0];
  
  const ruBadge = document.querySelector(".lang-ru");
  const enBadge = document.querySelector(".lang-en");
  const jaBadge = document.querySelector(".lang-ja");
  const langNames = document.querySelectorAll(".bento-lang-item span");
  
  const langTranslations = {
    en: { names: ["Russian", "English", "Japanese"], ru: "Native", en: "B2 Fluent", ja: "JLPT N2" },
    ru: { names: ["Русский", "Английский", "Японский"], ru: "Родной", en: "B2", ja: "JLPT N2" },
    ja: { names: ["ロシア語", "英語", "日本語"], ru: "ネイティブ", en: "B2流暢", ja: "JLPT N2合格" },
    ms: { names: ["Rusia", "Inggeris", "Jepun"], ru: "Asli", en: "Fasih B2", ja: "JLPT N2" },
    th: { names: ["รัสเซีย", "อังกฤษ", "ญี่ปุ่น"], ru: "ภาษาแม่", en: "คล่องแคล่ว B2", ja: "JLPT N2" },
    vi: { names: ["Tiếng Nga", "Tiếng Anh", "Tiếng Nhật"], ru: "Bản ngữ", en: "Lưu loát B2", ja: "JLPT N2" }
  };
  
  const lTrans = langTranslations[lang] || langTranslations.en;
  if (langNames.length >= 3) {
    langNames[0].textContent = lTrans.names[0];
    langNames[1].textContent = lTrans.names[1];
    langNames[2].textContent = lTrans.names[2];
  }
  if (ruBadge) ruBadge.textContent = lTrans.ru;
  if (enBadge) enBadge.textContent = lTrans.en;
  if (jaBadge) jaBadge.textContent = lTrans.ja;

  const relocLabel = document.querySelector(".bento-relocation .bento-label");
  const relocStatus = document.querySelector(".bento-status strong");
  const relocItems = document.querySelectorAll(".bento-reloc-item");
  
  const relocTranslations = {
    en: { label: "Relocation", status: "Sponsorship Ready", countries: ["Vietnam", "Thailand", "Malaysia"] },
    ru: { label: "Релокация", status: "Требуется визовая поддержка", countries: ["Вьетнам", "Таиланд", "Малайзия"] },
    ja: { label: "海外移住", status: "スポンサー準備可", countries: ["ベトナム", "タイ", "マレーシア"] },
    ms: { label: "Relokasi", status: "Sedia Ditaja", countries: ["Vietnam", "Thailand", "Malaysia"] },
    th: { label: "ย้ายประเทศ", status: "ต้องการสปอนเซอร์", countries: ["เวียดนาม", "ไทย", "มาเลเซีย"] },
    vi: { label: "Tái định cư", status: "Sẵn sàng tài trợ", countries: ["Việt Nam", "Thái Lan", "Malaysia"] }
  };
  
  const rTrans = relocTranslations[lang] || relocTranslations.en;
  if (relocLabel) relocLabel.textContent = rTrans.label;
  if (relocStatus) relocStatus.textContent = rTrans.status;
  relocItems.forEach((item, idx) => {
    if (rTrans.countries[idx]) {
      item.innerHTML = `<i class="ph-bold ph-map-pin"></i>${rTrans.countries[idx]}`;
    }
  });

  // Localize Skills Heading
  const skillsHead = document.querySelector("#skills h2");
  if (skillsHead) skillsHead.textContent = content.skills.title;

  const skillGroups = document.querySelectorAll(".skill-group");
  setSectionList(skillGroups, content.skills.groups, (item, value) => {
    const heading = item.querySelector("h3");
    const listItems = item.querySelectorAll("li");
    if (heading) heading.textContent = value[0];
    setSectionList(listItems, value[1], (listItem, listValue) => {
      listItem.textContent = listValue;
    });
  });

  // Localize Projects
  const projectsHead = document.querySelector("#projects h2");
  if (projectsHead) projectsHead.textContent = content.projects.title;

  const projectCards = document.querySelectorAll(".project-card");
  setSectionList(projectCards, content.projects.cards, (item, value) => {
    const projectTag = item.querySelector(".project-tag");
    const projectTitle = item.querySelector("h3");
    const projectText = item.querySelector(".project-body p:not(.project-tag)");
    const cta = item.querySelector(".project-cta");

    if (projectTag) projectTag.textContent = value[0];
    if (projectTitle) projectTitle.textContent = value[1];
    if (projectText) projectText.textContent = value[2];
    if (cta) {
      cta.innerHTML = "";
      cta.appendChild(document.createTextNode(value[4]));
    }
  });

  // Update current project preview
  const activeProj = document.querySelector(".project-card.is-active");
  if (activeProj) {
    const activeProjIdx = Number(activeProj.dataset.projectPreview || 0);
    setProjectPreview(activeProjIdx);
  }

  // Localize Resume
  const resumeHead = document.querySelector("#resume h2");
  if (resumeHead) resumeHead.textContent = content.resume.title;

  const resumePanels = document.querySelectorAll(".resume-panel");
  setSectionList(resumePanels, content.resume.panels, (item, value) => {
    const heading = item.querySelector("h3");
    const listItems = item.querySelectorAll("li");
    if (heading) heading.textContent = value[0];
    setSectionList(listItems, value[1], (listItem, listValue) => {
      listItem.textContent = listValue;
    });

    const button = item.querySelector(".button");
    if (button && value[2]) {
      const icon = button.querySelector("i");
      button.innerHTML = "";
      if (icon) button.appendChild(icon);
      button.appendChild(document.createTextNode((icon ? " " : "") + value[2]));
    }
  });

  // Localize Contact
  const contactHead = document.querySelector("#contact h2");
  const contactCopy = document.querySelector(".contact-copy p");
  const contactItems = document.querySelectorAll(".contact-item");
  if (contactHead) contactHead.textContent = content.contact.title;
  if (contactCopy) contactCopy.textContent = content.contact.text;
  setSectionList(contactItems, content.contact.labels, (item, value) => {
    const label = item.querySelector("span");
    if (label) {
      label.textContent = value;
    }
  });
};

const switchLanguage = (lang, source = "manual") => {
  const nextLang = translations?.index?.[lang] ? lang : translations?.defaultLang || "en";
  window.localStorage.setItem(translations?.storageKey || "portfolio-language", nextLang);
  window.localStorage.setItem(languageSourceKey, source);
  updateLanguageButtons(nextLang);
  languageUi.closeMenu?.();

  if (!pageContent) {
    applyIndexTranslations(nextLang);
    return;
  }

  pageContent.classList.add("is-switching");
  applyIndexTranslations(nextLang);
  window.requestAnimationFrame(() => {
    pageContent.classList.remove("is-switching");
  });
};

// --- REVEAL ON SCROLL OBSERVER ---
revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index * 35, 180)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -4% 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

// --- NAVIGATION MENU MOBILE ---
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// --- NAVIGATION SCROLL SPY ---
if (navLinks.length) {
  const spyObserverOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px",
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("is-active");
          } else {
            link.classList.remove("is-active");
          }
        });
      }
    });
  }, spyObserverOptions);

  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => spyObserver.observe(section));
}

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

  const detectedLanguage = await detectPreferredLanguage();
  switchLanguage(detectedLanguage || "en", "auto");
};

// Execute theme & language config
applyTheme(getStoredTheme());
initializeLanguage();

// --- VIDEO INTRODUCTION MODAL ---
const introVideoButton = document.getElementById("open-intro-video");
const introVideoModal = document.getElementById("intro-video-modal");
const introVideoPlayer = document.getElementById("intro-video-player");
const introVideoCloseButtons = document.querySelectorAll("[data-video-close]");

const openIntroVideo = () => {
  if (!introVideoModal) {
    return;
  }

  if (introVideoPlayer) {
    introVideoPlayer.volume = 0.5;
  }

  introVideoModal.classList.add("is-open");
  introVideoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeIntroVideo = () => {
  if (!introVideoModal) {
    return;
  }

  introVideoModal.classList.remove("is-open");
  introVideoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (introVideoPlayer) {
    introVideoPlayer.pause();
  }
};

introVideoButton?.addEventListener("click", openIntroVideo);
introVideoCloseButtons.forEach((button) => {
  button.addEventListener("click", closeIntroVideo);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && introVideoModal?.classList.contains("is-open")) {
    closeIntroVideo();
  }
});

// --- INTERACTIVE OPS CONSOLE TELEMETRY ---
const opsReadout = document.getElementById("ops-readout");
const opsNodes = document.querySelectorAll(".ops-node");
const opsLayers = [
  {
    title: "Windows support",
    text: "L1/L2 troubleshooting, clean installs, drivers, recovery, user-ready setup."
  },
  {
    title: "Hardware diagnostics",
    text: "PSU, RAM, SSD, GPU, peripherals, assembly, upgrades, and replacement work."
  },
  {
    title: "Linux and VPS",
    text: "Ubuntu VPS, SSH, Apache, MySQL, WinSCP, updates, and routine maintenance."
  },
  {
    title: "Network basics",
    text: "IP addressing, Wi-Fi issues, router setup, connectivity checks, and isolation."
  }
];

const updateOpsSchematic = (index) => {
  const schematicEl = document.getElementById("ops-schematic");
  if (!schematicEl) return;
  
  let content = "";
  if (index === 0) {
    content = `[ACTIVE SERVICES]
● Spooler ............ RUNNING
● WinRM .............. STANDBY
● DHCPClient ......... RUNNING
● WindowsUpdate ...... IDLE
● GroupPolicy ........ SYNCED`;
  } else if (index === 1) {
    content = `[HARDWARE TELEMETRY]
CPU Temp ............ 42°C [OK]
PSU Voltage ......... 12.06V [OK]
SSD Life ............ 98% [OK]
RAM Usage ........... 4.2GB / 16GB
GPU Fan Speed ....... 1200 RPM`;
  } else if (index === 2) {
    content = `[vps-server:~$ journalctl -n 4]
systemd[1]: Starting Apache...
apache2[1042]: HTTP/2 active.
mysqld[892]: Port 3306 listening.
systemd[1]: Services operational.`;
  } else if (index === 3) {
    content = `[PING TELEMETRY]
8.8.8.8 ............. 24ms
1.1.1.1 ............. 18ms
Local Gateway ....... 1ms
Packet Loss ......... 0%
Link Speed .......... 1 Gbps`;
  }
  schematicEl.textContent = content;
};

const setOpsLayer = (index) => {
  const currentLang = document.documentElement.lang || "en";
  const consoleContent = translations?.index?.[currentLang]?.opsConsole || translations?.index?.en?.opsConsole;
  const layers = consoleContent?.layers || opsLayers;
  const layer = layers[index] || layers[0];
  
  opsNodes.forEach((node) => {
    node.classList.toggle("is-active", Number(node.dataset.node) === index);
  });

  if (!opsReadout) {
    return;
  }

  const title = opsReadout.querySelector("strong");
  const text = opsReadout.querySelector("p");
  if (title) title.textContent = layer.title;
  if (text) text.textContent = layer.text;
  
  updateOpsSchematic(index);
};

opsNodes.forEach((node) => {
  node.addEventListener("click", () => setOpsLayer(Number(node.dataset.node || 0)));
});

// Start clock Loop
const startClock = () => {
  const clockEl = document.getElementById("ops-clock");
  if (!clockEl) return;
  const update = () => {
    const now = new Date();
    clockEl.textContent = now.toTimeString().split(' ')[0];
  };
  update();
  window.setInterval(update, 1000);
};
startClock();

// --- TILT INTERACTION CARD ---
const tiltCards = document.querySelectorAll("[data-tilt-card]");
tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

// --- SKILLS DYNAMIC FILTER ---
const skillFilters = document.querySelectorAll(".skill-filter");
const skillGroupsFiltered = document.querySelectorAll(".skill-group[data-skill]");

skillFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const nextFilter = filter.dataset.filter || "all";
    skillFilters.forEach((item) => item.classList.toggle("is-active", item === filter));
    skillGroupsFiltered.forEach((group) => {
      const isMatch = nextFilter === "all" || group.dataset.skill === nextFilter;
      group.classList.toggle("is-dimmed", !isMatch);
      // Toggle is-active-filter class for matching cards when a specific section is chosen
      group.classList.toggle("is-active-filter", isMatch && nextFilter !== "all");
    });
  });
});

// --- PROJECTS PREVIEW DYNAMIC HANDLERS ---
const projectPreview = document.getElementById("project-preview");
const projectPreviewCards = document.querySelectorAll("[data-project-preview]");
const previewLiveLink = document.getElementById("preview-live-link");
const projectPreviewData = [
  {
    title: "Windows Deployment, Repair, and PC Build Work",
    text: "Desktop support work across Windows reinstallations, driver setup, hardware diagnostics, and ready-to-use systems.",
    visual: "workstation",
    badge: { en: "Ready", ru: "Готово", ja: "完了", ms: "Sedia", th: "พร้อม", vi: "Sẵn sàng" },
    address: "https://daniil-systems.net/projects/pc-support",
    terminal: `[SYSTEM_OPERATIONS]
STATUS ....... OK
HOST ......... win-dep-01
HARDWARE ..... 50+ PC Builds
TELEMETRY .... Validated
DEPLOYMENT ... Active`
  },
  {
    title: "JKT Personal Website on Ubuntu VPS",
    text: "A self-managed Ubuntu VPS website with Apache, MySQL, SSH access, remote file work, and maintenance routines.",
    visual: "server",
    badge: { en: "Online", ru: "Онлайн", ja: "稼働中", ms: "Aktif", th: "ออนไลน์", vi: "Trực tuyến" },
    address: "https://daniil-systems.net/projects/jkt-site",
    terminal: `[vps-health:~$ uptime]
19:37:14 up 42 days, 3:12
Load average: 0.12, 0.08, 0.02
HTTPD status: Operational
MySQL connection: Established`
  },
  {
    title: "Self-Hosted VPN and Telegram Web App",
    text: "Remote Linux administration for hosted services, including updates, SSH operations, VPN setup, and service upkeep.",
    visual: "vpn",
    badge: { en: "Secured", ru: "Защищено", ja: "安全", ms: "Selamat", th: "ปลอดภัย", vi: "Bảo mật" },
    address: "https://daniil-systems.net/projects/telegram-app",
    terminal: `[vpn-route:~$ wireguard status]
Interface: wg0 (enabled)
Peers connected: 4 active
Traffic IN: 4.8 GB
Traffic OUT: 5.2 GB
Firewall Rules: Enforced`
  },
  {
    title: "MinatoCargo Global Marketplace Platform",
    text: "A full-stack marketplace project with catalog browsing, product pages, seller operations, admin tooling, support pages, localization, and currency-aware UI.",
    visual: "marketplace",
    badge: { en: "Live build", ru: "Рабочая версия", ja: "Live build", ms: "Live build", th: "Live build", vi: "Live build" },
    address: "https://daniil-systems.net/projects/minatocargo",
    terminal: `[marketplace:release]
Catalog pages ..... Ready
Seller workspace .. Active
Admin tools ....... Active
Localization ...... 4 languages
Currency layer .... 12h refresh`
  }
];

const setProjectPreview = (index) => {
  const preview = projectPreviewData[index] || projectPreviewData[0];
  projectPreviewCards.forEach((card) => {
    card.classList.toggle("is-active", Number(card.dataset.projectPreview) === index);
  });

  if (!projectPreview) {
    return;
  }

  const currentLang = document.documentElement.lang || "en";

  const title = projectPreview.querySelector("strong");
  const text = projectPreview.querySelector("p");
  const badge = projectPreview.querySelector(".preview-badge");
  const address = projectPreview.querySelector(".browser-address");
  const previewImg = document.getElementById("preview-image");
  const previewTerm = document.getElementById("preview-terminal");

  // Get localized card translation title/text
  const localizedCard = translations?.index?.[currentLang]?.projects?.cards?.[index] || translations?.index?.en?.projects?.cards?.[index];
  if (title) title.textContent = localizedCard ? localizedCard[1] : preview.title;
  if (text) text.textContent = localizedCard ? localizedCard[2] : preview.text;

  // Localize Badge Status
  if (badge) {
    badge.textContent = preview.badge[currentLang] || preview.badge.en;
  }

  // Update address URL mock
  if (address) {
    address.textContent = preview.address;
  }

  // Handle Dynamic Mock Swap
  const originalProj = window.projectData?.[Object.keys(window.projectData)[index]];
  if (previewLiveLink) {
    const liveLabel = originalProj?.liveLabel?.[currentLang] || originalProj?.liveLabel?.en;
    previewLiveLink.hidden = !originalProj?.liveUrl;
    previewLiveLink.href = originalProj?.liveUrl || "#";
    const liveLabelElement = previewLiveLink.querySelector("span");
    if (liveLabelElement && liveLabel) {
      liveLabelElement.textContent = liveLabel;
    }
  }

  if (originalProj && originalProj.screenshots && originalProj.screenshots.length > 0) {
    // Show image mockup
    if (previewImg) {
      previewImg.src = originalProj.screenshots[0];
      previewImg.style.display = "block";
    }
    if (previewTerm) {
      previewTerm.style.display = "none";
    }
  } else {
    // Show terminal fallback mockup
    if (previewImg) {
      previewImg.style.display = "none";
    }
    if (previewTerm) {
      previewTerm.textContent = preview.terminal;
      previewTerm.style.display = "block";
    }
  }
};

projectPreviewCards.forEach((card) => {
  const index = Number(card.dataset.projectPreview || 0);
  card.addEventListener("pointerenter", () => setProjectPreview(index));
  card.addEventListener("mouseenter", () => setProjectPreview(index));
  card.addEventListener("focus", () => setProjectPreview(index));
});

if ("IntersectionObserver" in window && projectPreviewCards.length) {
  const projectPreviewObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setProjectPreview(Number(visibleEntry.target.dataset.projectPreview || 0));
      }
    },
    {
      threshold: [0.35, 0.55, 0.75],
      rootMargin: "-10% 0px -20% 0px"
    }
  );

  projectPreviewCards.forEach((card) => projectPreviewObserver.observe(card));
}
