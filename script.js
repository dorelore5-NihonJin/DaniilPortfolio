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

const uiCopy = {
  brandRole: {
    en: "IT Support Specialist",
    ja: "ITサポートスペシャリスト",
    ms: "Pakar Sokongan IT",
    th: "IT Support Specialist",
    vi: "Chuyen vien Ho tro CNTT"
  },
  navToggleLabel: {
    en: "Toggle navigation",
    ja: "ナビゲーションを切り替える",
    ms: "Tukar navigasi",
    th: "สลับเมนูนำทาง",
    vi: "Mo hoac dong dieu huong"
  },
  languageLabel: {
    en: "Language selector",
    ja: "言語の選択",
    ms: "Pemilih bahasa",
    th: "ตัวเลือกภาษา",
    vi: "Lua chon ngon ngu"
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
    builder(item, values[index], index);
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

  setSectionList(navLinks, content.nav, (item, value) => {
    item.textContent = value;
  });

  const heroProofItems = document.querySelectorAll(".hero-proof > div");
  const heroSignals = document.querySelectorAll(".hero-signal");
  const heroSignalContent = [
    {
      en: ["Windows Support", "L1/L2 troubleshooting"],
      ja: ["Windowsサポート", "L1/L2 トラブルシュート"],
      ms: ["Sokongan Windows", "Troubleshooting L1/L2"],
      th: ["Windows Support", "L1/L2 troubleshooting"],
      vi: ["Ho tro Windows", "Xu ly su co L1/L2"]
    },
    {
      en: ["Ubuntu VPS", "SSH, Apache, MySQL"],
      ja: ["Ubuntu VPS", "SSH・Apache・MySQL"],
      ms: ["Ubuntu VPS", "SSH, Apache, MySQL"],
      th: ["Ubuntu VPS", "SSH, Apache, MySQL"],
      vi: ["Ubuntu VPS", "SSH, Apache, MySQL"]
    },
    {
      en: ["Infrastructure habits", "Documentation, routine maintenance"],
      ja: ["運用の基礎姿勢", "ドキュメント作成・定期保守"],
      ms: ["Tabiat infrastruktur", "Dokumentasi, maintenance rutin"],
      th: ["แนวทางงานระบบ", "เอกสารและการดูแลตามรอบ"],
      vi: ["Thoi quen van hanh", "Tai lieu va bao tri dinh ky"]
    }
  ];

  const eyebrow = document.querySelector(".hero .eyebrow");
  const heroRole = document.querySelector(".hero-role");
  const heroTitle = document.querySelector(".hero-copy h1");
  const heroText = document.querySelector(".hero-text");
  const heroActions = document.querySelectorAll(".hero-actions a");

  if (eyebrow) eyebrow.textContent = content.hero.eyebrow;
  if (heroRole) heroRole.textContent = content.hero.role;
  if (heroTitle) heroTitle.textContent = content.hero.title;
  if (heroText) heroText.textContent = content.hero.text;

  setSectionList(heroActions, content.hero.actions, (item, value) => {
    item.textContent = value;
  });

  setSectionList(heroProofItems, content.hero.proof, (item, value) => {
    const [label, strong] = item.children;
    if (label) label.textContent = value[0];
    if (strong) strong.textContent = value[1];
  });

  setSectionList(heroSignals, heroSignalContent, (item, value) => {
    const localized = value[lang] || value.en;
    const [label, strong] = item.children;
    if (label) label.textContent = localized[0];
    if (strong) strong.textContent = localized[1];
  });

  const sectionHeads = {
    about: document.querySelector("#about .section-head"),
    skills: document.querySelector("#skills .section-head"),
    projects: document.querySelector("#projects .section-head"),
    resume: document.querySelector("#resume .section-head"),
    contact: document.querySelector("#contact .section-head")
  };

  const aboutCopy = document.querySelectorAll(".about-copy p");
  const aboutFacts = document.querySelectorAll(".about-facts > div");

  if (sectionHeads.about) {
    sectionHeads.about.querySelector(".section-kicker").textContent = content.about.kicker;
    sectionHeads.about.querySelector("h2").textContent = content.about.title;
  }

  setSectionList(aboutCopy, content.about.copy, (item, value) => {
    item.textContent = value;
  });

  setSectionList(aboutFacts, content.about.facts, (item, value) => {
    const [label, strong, text] = item.children;
    if (label) label.textContent = value[0];
    if (strong) strong.textContent = value[1];
    if (text) text.textContent = value[2];
  });

  const skillGroups = document.querySelectorAll(".skill-group");
  if (sectionHeads.skills) {
    sectionHeads.skills.querySelector(".section-kicker").textContent = content.skills.kicker;
    sectionHeads.skills.querySelector("h2").textContent = content.skills.title;
  }

  setSectionList(skillGroups, content.skills.groups, (item, value) => {
    const heading = item.querySelector("h3");
    const listItems = item.querySelectorAll("li");
    if (heading) heading.textContent = value[0];
    setSectionList(listItems, value[1], (listItem, listValue) => {
      listItem.textContent = listValue;
    });
  });

  const projectCards = document.querySelectorAll(".project-card");
  if (sectionHeads.projects) {
    sectionHeads.projects.querySelector(".section-kicker").textContent = content.projects.kicker;
    sectionHeads.projects.querySelector("h2").textContent = content.projects.title;
  }

  setSectionList(projectCards, content.projects.cards, (item, value) => {
    const projectTag = item.querySelector(".project-tag");
    const projectTitle = item.querySelector("h3");
    const projectText = item.querySelector(".project-body > p:not(.project-tag)");
    const projectTasks = item.querySelectorAll("li");
    const cta = item.querySelector(".project-cta");

    if (projectTag) projectTag.textContent = value[0];
    if (projectTitle) projectTitle.textContent = value[1];
    if (projectText) projectText.textContent = value[2];
    setSectionList(projectTasks, value[3], (taskItem, taskValue) => {
      taskItem.textContent = taskValue;
    });
    if (cta) cta.textContent = value[4];
  });

  const resumePanels = document.querySelectorAll(".resume-panel");
  if (sectionHeads.resume) {
    sectionHeads.resume.querySelector(".section-kicker").textContent = content.resume.kicker;
    sectionHeads.resume.querySelector("h2").textContent = content.resume.title;
  }

  setSectionList(resumePanels, content.resume.panels, (item, value) => {
    const heading = item.querySelector("h3");
    const listItems = item.querySelectorAll("li");
    if (heading) heading.textContent = value[0];
    setSectionList(listItems, value[1], (listItem, listValue) => {
      listItem.textContent = listValue;
    });

    const button = item.querySelector(".button");
    if (button && value[2]) {
      button.textContent = value[2];
    }
  });

  const contactCopy = document.querySelector(".contact-copy p");
  const contactItems = document.querySelectorAll(".contact-list a");
  if (sectionHeads.contact) {
    sectionHeads.contact.querySelector(".section-kicker").textContent = content.contact.kicker;
    sectionHeads.contact.querySelector("h2").textContent = content.contact.title;
  }
  if (contactCopy) {
    contactCopy.textContent = content.contact.text;
  }
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
  window.setTimeout(() => {
    applyIndexTranslations(nextLang);
    window.requestAnimationFrame(() => {
      pageContent.classList.remove("is-switching");
    });
  }, 120);
};

revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index * 45, 220)}ms`);
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
    threshold: 0.18,
    rootMargin: "0px 0px -6% 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

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
    if (window.innerWidth > 760) {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
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

  const detectedLanguage = await detectLanguageByIp();
  switchLanguage(detectedLanguage || "en", "auto");
};

applyTheme(getStoredTheme());
initializeLanguage();

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
