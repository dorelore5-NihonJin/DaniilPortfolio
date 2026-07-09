/* Daniil Kulakov | IT Support Specialist Portfolio Interactive Logic */

const translations = window.portfolioTranslations;
const pageContent = document.getElementById("page-content");
const metaDescription = document.querySelector('meta[name="description"]');

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
  },
  skillFilterLabel: {
    en: "Filter skill groups",
    ru: "Фильтр групп навыков",
    ja: "スキルグループを絞り込む",
    ms: "Tapis kumpulan kemahiran",
    th: "กรองกลุ่มทักษะ",
    vi: "Lọc nhóm kỹ năng"
  },
  skillFilters: {
    en: ["All", "Support", "Systems", "Process"],
    ru: ["Все", "Поддержка", "Системы", "Процессы"],
    ja: ["すべて", "サポート", "システム", "プロセス"],
    ms: ["Semua", "Sokongan", "Sistem", "Proses"],
    th: ["ทั้งหมด", "ซัพพอร์ต", "ระบบ", "กระบวนการ"],
    vi: ["Tất cả", "Hỗ trợ", "Hệ thống", "Quy trình"]
  },
  projectPreview: {
    en: "Project preview",
    ru: "Превью проекта",
    ja: "プロジェクトプレビュー",
    ms: "Pratonton projek",
    th: "ตัวอย่างโปรเจกต์",
    vi: "Xem trước dự án"
  },
  projectDetails: {
    en: "Details",
    ru: "Подробнее",
    ja: "詳細",
    ms: "Butiran",
    th: "รายละเอียด",
    vi: "Chi tiết"
  },
  projectLive: {
    en: "Open Telegram bot",
    ru: "Открыть Telegram-бота",
    ja: "Telegramボットを開く",
    ms: "Buka bot Telegram",
    th: "เปิดบอต Telegram",
    vi: "Mở bot Telegram"
  },
  skipLink: {
    en: "Skip to content",
    ru: "Перейти к содержимому",
    ja: "コンテンツへスキップ",
    ms: "Langkau ke kandungan",
    th: "ข้ามไปยังเนื้อหา",
    vi: "Chuyển đến nội dung"
  },
  footerCopy: {
    en: "© 2026 Daniil Kulakov. IT Support Specialist.",
    ru: "© 2026 Даниил Кулаков. Специалист технической поддержки.",
    ja: "© 2026 Daniil Kulakov. ITサポートスペシャリスト.",
    ms: "© 2026 Daniil Kulakov. Pakar Sokongan IT.",
    th: "© 2026 Daniil Kulakov. IT Support Specialist.",
    vi: "© 2026 Daniil Kulakov. Chuyên viên Hỗ trợ IT."
  },
  footerNav: {
    en: ["Contact", "Resume", "Email"],
    ru: ["Контакты", "Резюме", "Email"],
    ja: ["連絡先", "履歴書", "メール"],
    ms: ["Hubungi", "Resume", "E-mel"],
    th: ["ติดต่อ", "Resume", "อีเมล"],
    vi: ["Liên hệ", "CV", "Email"]
  },
  videoModal: {
    en: ["Video Introduction", "Short English self-introduction", "Close"],
    ru: ["Видеопрезентация", "Короткая самопрезентация на английском", "Закрыть"],
    ja: ["動画紹介", "英語による短い自己紹介", "閉じる"],
    ms: ["Pengenalan Video", "Pengenalan diri ringkas dalam bahasa Inggeris", "Tutup"],
    th: ["วิดีโอแนะนำตัว", "แนะนำตัวสั้น ๆ เป็นภาษาอังกฤษ", "ปิด"],
    vi: ["Video giới thiệu", "Phần tự giới thiệu ngắn bằng tiếng Anh", "Đóng"]
  },
  aboutLeadTitle: {
    en: "IT Operations & User Support",
    ru: "IT-операции и поддержка пользователей",
    ja: "IT運用とユーザーサポート",
    ms: "Operasi IT & Sokongan Pengguna",
    th: "งานระบบ IT และซัพพอร์ตผู้ใช้",
    vi: "Vận hành IT & Hỗ trợ người dùng"
  },
  educationField: {
    en: "IT Systems",
    ru: "IT-системы",
    ja: "ITシステム",
    ms: "Sistem IT",
    th: "ระบบ IT",
    vi: "Hệ thống IT"
  },
  educationProgram: {
    en: "Information Systems & Programming",
    ru: "Информационные системы и программирование",
    ja: "情報システムとプログラミング",
    ms: "Sistem Maklumat & Pengaturcaraan",
    th: "ระบบสารสนเทศและการเขียนโปรแกรม",
    vi: "Hệ thống thông tin & Lập trình"
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
  // Language switcher already exists in markup. No theme toggle (site is dark-only per design).
  return { themeToggle: null };
};

const headerUi = initializeHeaderActions();

const initializeLanguageSwitcher = () => {
  if (!languageSwitcher) {
    return { buttons: [], trigger: null, label: null, code: null, closeMenu: () => {} };
  }

  const trigger = languageSwitcher.querySelector(".language-trigger");
  const menu = languageSwitcher.querySelector(".language-menu");
  let buttons = Array.from(languageSwitcher.querySelectorAll("[data-lang]"));

  const closeMenu = () => {
    languageSwitcher.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  };

  if (trigger) {
    trigger.addEventListener("click", () => {
      const nextState = !languageSwitcher.classList.contains("is-open");
      languageSwitcher.classList.toggle("is-open", nextState);
      trigger.setAttribute("aria-expanded", String(nextState));
    });

    trigger.addEventListener("keydown", (event) => {
      if (!buttons.length || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      languageSwitcher.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const targetIndex = event.key === "ArrowUp" || event.key === "End" ? buttons.length - 1 : 0;
      buttons[targetIndex].focus();
    });
  }

  menu?.addEventListener("keydown", (event) => {
    const currentIndex = buttons.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      trigger?.focus();
      return;
    }
    if (!buttons.length || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  });

  document.addEventListener("click", (event) => {
    if (languageSwitcher && !languageSwitcher.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Ensure ARIA on existing buttons
  buttons.forEach((button) => {
    const lang = button.dataset.lang;
    if (languageMeta[lang]) {
      button.setAttribute("role", "menuitemradio");
    }
  });

  return {
    buttons,
    trigger,
    label: trigger ? trigger.querySelector(".language-trigger-label") : null,
    code: trigger ? trigger.querySelector(".language-trigger-code") : null,
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

const getStoredTheme = () => "dark";

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

const detectPreferredLanguage = () => {
  // Browser language only (fast, private, no external requests). IP-based was removed for performance/privacy.
  return detectLanguageFromBrowser() || translations?.defaultLang || "en";
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

  const aboutHead = document.querySelector("#about h2");
  if (aboutHead) aboutHead.textContent = content.about.title;

  // Localize Bento Grid About
  const bentoBioHead = document.querySelector(".bento-bio h3");
  const bentoBioParagraphs = document.querySelectorAll(".bento-bio-text p");
  if (bentoBioHead) bentoBioHead.textContent = uiCopy.aboutLeadTitle[lang] || uiCopy.aboutLeadTitle.en;
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
    if (school) school.textContent = uiCopy.educationField[lang] || uiCopy.educationField.en;
    if (program) program.textContent = uiCopy.educationProgram[lang] || uiCopy.educationProgram.en;
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
  
  const relocFlags = ["🇻🇳", "🇹🇭", "🇲🇾", "🇬🇪", "🇦🇲", "🇨🇾"];
  const relocTranslations = {
    en: { label: "Relocation", status: "Open to suitable opportunities", countries: ["Vietnam", "Thailand", "Malaysia", "Georgia", "Armenia", "Cyprus"] },
    ru: { label: "Релокация", status: "Открыт к подходящим возможностям", countries: ["Вьетнам", "Таиланд", "Малайзия", "Грузия", "Армения", "Кипр"] },
    ja: { label: "海外移住", status: "適した機会を検討可能", countries: ["ベトナム", "タイ", "マレーシア", "ジョージア", "アルメニア", "キプロス"] },
    ms: { label: "Relokasi", status: "Terbuka kepada peluang sesuai", countries: ["Vietnam", "Thailand", "Malaysia", "Georgia", "Armenia", "Cyprus"] },
    th: { label: "ย้ายประเทศ", status: "เปิดรับโอกาสที่เหมาะสม", countries: ["เวียดนาม", "ไทย", "มาเลเซีย", "จอร์เจีย", "อาร์เมเนีย", "ไซปรัส"] },
    vi: { label: "Tái định cư", status: "Sẵn sàng xem xét cơ hội phù hợp", countries: ["Việt Nam", "Thái Lan", "Malaysia", "Georgia", "Armenia", "Síp"] }
  };

  const rTrans = relocTranslations[lang] || relocTranslations.en;
  if (relocLabel) relocLabel.textContent = rTrans.label;
  if (relocStatus) relocStatus.textContent = rTrans.status;
  relocItems.forEach((item, idx) => {
    if (rTrans.countries[idx]) {
      item.innerHTML = `<span class="bento-reloc-flag" aria-hidden="true">${relocFlags[idx]}</span><span class="bento-reloc-name">${rTrans.countries[idx]}</span>`;
    }
  });

  // Localize Skills Heading
  const skillsHead = document.querySelector("#skills h2");
  if (skillsHead) skillsHead.textContent = content.skills.title;

  const skillControls = document.querySelector(".skill-controls");
  const skillFilterButtons = document.querySelectorAll(".skill-filter");
  if (skillControls) {
    skillControls.setAttribute("aria-label", uiCopy.skillFilterLabel[lang] || uiCopy.skillFilterLabel.en);
  }
  setSectionList(skillFilterButtons, uiCopy.skillFilters[lang] || uiCopy.skillFilters.en, (item, value) => {
    item.textContent = value;
  });

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

  const projectRows = document.querySelectorAll(".project-row");
  const projectDetailsLabel = uiCopy.projectDetails[lang] || uiCopy.projectDetails.en;
  const projectPreviewLabel = document.querySelector(".project-stage-label");

  if (projectPreviewLabel) {
    projectPreviewLabel.textContent = uiCopy.projectPreview[lang] || uiCopy.projectPreview.en;
  }

  setSectionList(projectRows, content.projects.cards, (item, value) => {
    const projectTag = item.querySelector(".project-tag");
    const projectTitle = item.querySelector("h3");
    const projectText = item.querySelector(".project-row-text");
    const cta = item.querySelector(".project-row-cta");

    if (projectTag) projectTag.textContent = value[0];
    if (projectTitle) projectTitle.textContent = value[1];
    if (projectText) projectText.textContent = value[2];
    if (cta) cta.textContent = value[4] || projectDetailsLabel;
    item.setAttribute("aria-label", `${projectDetailsLabel}: ${value[1]}`);
  });

  const activeIndex = Number(document.querySelector(".project-row.is-active")?.dataset.projectIndex || 0);
  setProjectStage(activeIndex, lang);

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

  const videoCopy = uiCopy.videoModal[lang] || uiCopy.videoModal.en;
  const videoEyebrow = document.querySelector(".video-modal-head p");
  const videoTitle = document.querySelector(".video-modal-head h3");
  const videoClose = document.querySelector(".video-modal-close");
  if (videoEyebrow) videoEyebrow.textContent = videoCopy[0];
  if (videoTitle) videoTitle.textContent = videoCopy[1];
  if (videoClose) videoClose.textContent = videoCopy[2];

  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.textContent = uiCopy.skipLink[lang] || uiCopy.skipLink.en;
  }

  const footerCopy = document.querySelector(".site-footer-copy");
  if (footerCopy) {
    footerCopy.textContent = uiCopy.footerCopy[lang] || uiCopy.footerCopy.en;
  }

  const footerLinks = document.querySelectorAll(".site-footer-nav a");
  const footerLabels = uiCopy.footerNav[lang] || uiCopy.footerNav.en;
  setSectionList(footerLinks, footerLabels, (item, value) => {
    item.textContent = value;
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

// --- NAVIGATION MENU MOBILE ---
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
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
    languageUi.trigger?.focus();
  });
});

headerUi.themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

const initializeLanguage = () => {
  const storedLanguage = getStoredLanguage();
  const storedSource = getStoredLanguageSource();

  if (storedSource === "manual") {
    switchLanguage(storedLanguage, "manual");
    return;
  }

  const detectedLanguage = detectPreferredLanguage();
  switchLanguage(detectedLanguage || "en", "auto");
};

// --- VIDEO INTRODUCTION MODAL ---
const introVideoButton = document.getElementById("open-intro-video");
const introVideoModal = document.getElementById("intro-video-modal");
const introVideoPlayer = document.getElementById("intro-video-player");
const introVideoCloseButtons = document.querySelectorAll("[data-video-close]");

const trapFocus = (container, onEscape) => {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      onEscape();
      return;
    }

    if (event.key !== "Tab" || !focusable.length) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", handleKeydown);
  first?.focus();

  return () => container.removeEventListener("keydown", handleKeydown);
};

let releaseVideoFocusTrap = null;

const fitIntroVideo = () => {
  if (!introVideoPlayer || !introVideoPlayer.videoWidth) {
    return;
  }

  const viewportHeight = window.innerHeight;
  const dialog = introVideoModal?.querySelector(".video-modal-dialog");
  const head = introVideoModal?.querySelector(".video-modal-head");
  const headHeight = head?.offsetHeight || 72;
  const verticalPadding = 48;
  const maxVideoHeight = Math.min(viewportHeight * 0.68, 520, viewportHeight - headHeight - verticalPadding);
  const aspectRatio = introVideoPlayer.videoWidth / introVideoPlayer.videoHeight;
  const widthFromHeight = maxVideoHeight * aspectRatio;

  introVideoPlayer.style.maxHeight = `${maxVideoHeight}px`;
  introVideoPlayer.style.width = widthFromHeight > 840 ? "100%" : "auto";
  introVideoPlayer.style.maxWidth = "100%";

  if (dialog) {
    dialog.style.maxHeight = `${Math.min(viewportHeight * 0.92, maxVideoHeight + headHeight + 36)}px`;
  }
};

const openIntroVideo = () => {
  if (!introVideoModal) {
    return;
  }

  if (introVideoPlayer) {
    introVideoPlayer.volume = 0.5;
    if (introVideoPlayer.readyState >= 1) {
      fitIntroVideo();
    } else {
      introVideoPlayer.addEventListener("loadedmetadata", fitIntroVideo, { once: true });
    }
  }

  introVideoModal.classList.add("is-open");
  introVideoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const dialog = introVideoModal.querySelector(".video-modal-dialog");
  if (dialog) {
    releaseVideoFocusTrap?.();
    releaseVideoFocusTrap = trapFocus(dialog, closeIntroVideo);
  }
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
    introVideoPlayer.currentTime = 0;
    introVideoPlayer.style.maxHeight = "";
    introVideoPlayer.style.width = "";
    introVideoPlayer.style.maxWidth = "";
  }

  const dialog = introVideoModal?.querySelector(".video-modal-dialog");
  if (dialog) {
    dialog.style.maxHeight = "";
  }

  releaseVideoFocusTrap?.();
  releaseVideoFocusTrap = null;
  introVideoButton?.focus();
};

introVideoButton?.addEventListener("click", openIntroVideo);
introVideoCloseButtons.forEach((button) => {
  button.addEventListener("click", closeIntroVideo);
});

window.addEventListener("resize", () => {
  if (introVideoModal?.classList.contains("is-open")) {
    fitIntroVideo();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && introVideoModal?.classList.contains("is-open")) {
    closeIntroVideo();
  }
});

// --- SKILLS DYNAMIC FILTER ---
const skillFilters = document.querySelectorAll(".skill-filter");
const skillGroupsFiltered = document.querySelectorAll(".skill-group[data-skill]");

skillFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const nextFilter = filter.dataset.filter || "all";
    skillFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    skillGroupsFiltered.forEach((group) => {
      const isMatch = nextFilter === "all" || group.dataset.skill === nextFilter;
      group.classList.toggle("is-dimmed", !isMatch);
      // Toggle is-active-filter class for matching cards when a specific section is chosen
      group.classList.toggle("is-active-filter", isMatch && nextFilter !== "all");
    });
  });
});

// --- PROJECTS STAGE (stable list + preview) ---
const projectStage = document.getElementById("project-stage");
const projectStageTitle = document.getElementById("project-stage-title");
const projectStageText = document.getElementById("project-stage-text");
const projectStageUrl = document.getElementById("project-stage-url");
const projectStageLive = document.getElementById("project-stage-live");
const projectStageShots = document.querySelectorAll(".project-stage-shot");
const projectRows = document.querySelectorAll(".project-row");

const projectStageMeta = [
  { id: "pc-support", slug: "portfolio / pc-support" },
  { id: "jkt-site", slug: "portfolio / jkt-site" },
  { id: "telegram-app", slug: "portfolio / telegram-app" },
  { id: "minatocargo-marketplace", slug: "portfolio / minatocargo" }
];

let activeProjectIndex = 0;

const setProjectStage = (index, lang = document.documentElement.lang || "en") => {
  const nextIndex = Number.isFinite(index) ? index : 0;
  activeProjectIndex = nextIndex;

  projectRows.forEach((row) => {
    row.classList.toggle("is-active", Number(row.dataset.projectIndex) === nextIndex);
  });

  projectStageShots.forEach((shot) => {
    shot.classList.toggle("is-active", Number(shot.dataset.projectIndex) === nextIndex);
  });

  const localizedCard = translations?.index?.[lang]?.projects?.cards?.[nextIndex]
    || translations?.index?.en?.projects?.cards?.[nextIndex];
  const meta = projectStageMeta[nextIndex];
  const project = meta ? window.projectData?.[meta.id] : null;

  if (projectStageTitle && localizedCard) {
    projectStageTitle.textContent = localizedCard[1];
  }

  if (projectStageText && localizedCard) {
    projectStageText.textContent = localizedCard[2];
  }

  if (projectStageUrl && meta) {
    projectStageUrl.textContent = meta.slug;
  }

  if (projectStageLive) {
    const liveLabel = project?.liveLabel?.[lang] || project?.liveLabel?.en;
    projectStageLive.hidden = !project?.liveUrl;
    projectStageLive.href = project?.liveUrl || "#";
    const liveLabelElement = projectStageLive.querySelector("span");
    if (liveLabelElement && liveLabel) {
      liveLabelElement.textContent = liveLabel;
    }
  }
};

const initializeProjectsStage = () => {
  if (!projectRows.length) {
    return;
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  projectRows.forEach((row) => {
    const index = Number(row.dataset.projectIndex || 0);

    if (canHover) {
      row.addEventListener("mouseenter", () => setProjectStage(index));
    }

    row.addEventListener("focus", () => setProjectStage(index));
  });

  setProjectStage(activeProjectIndex);
};

// --- BIOLUMINESCENT PARTICLE SPHERE ---
const initializeParticleSphere = () => {
  const canvas = document.getElementById("particle-sphere");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particleCount = window.innerWidth < 700 ? 360 : 720;
  const particles = Array.from({ length: particleCount }, (_, index) => {
    const y = 1 - (index / (particleCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    return {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: 0.55 + Math.random() * 1.2,
      pink: Math.random() > 0.91
    };
  });

  let width = 0;
  let height = 0;
  let frame = 0;
  let animationId = 0;

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    const time = reduceMotion ? 0.4 : frame * 0.0022;
    const cosine = Math.cos(time);
    const sine = Math.sin(time);
    const radius = Math.min(width, height) * 0.31;
    const centerX = width * 0.52;
    const centerY = height * 0.5;

    context.save();
    context.translate(centerX, centerY);
    context.strokeStyle = "rgba(141, 233, 227, 0.17)";
    context.lineWidth = 0.8;
    [-0.12, 0.08, 0.26].forEach((offset, index) => {
      context.save();
      context.rotate(offset);
      context.beginPath();
      context.ellipse(0, 0, radius * (1.43 + index * 0.08), radius * (0.32 + index * 0.035), 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    });
    context.restore();

    particles.forEach((particle) => {
      const rotatedX = particle.x * cosine - particle.z * sine;
      const rotatedZ = particle.x * sine + particle.z * cosine;
      const depth = (rotatedZ + 1) / 2;
      const perspective = 0.78 + depth * 0.3;
      const x = centerX + rotatedX * radius * perspective;
      const y = centerY + particle.y * radius * perspective;
      const alpha = 0.18 + depth * 0.78;
      const size = particle.size * (0.65 + depth * 0.75);

      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fillStyle = particle.pink
        ? `rgba(253, 233, 255, ${alpha * 0.8})`
        : `rgba(203, 255, 252, ${alpha})`;
      context.fill();
    });

    if (!reduceMotion) {
      frame += 1;
      animationId = window.requestAnimationFrame(draw);
    }
  };

  const observer = new ResizeObserver(() => {
    resize();
    if (reduceMotion) draw();
  });
  observer.observe(canvas);
  resize();
  draw();

  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    window.cancelAnimationFrame(animationId);
    if (!document.hidden) draw();
  });
};

// Initialize only after every function used by the translation renderer exists.
applyTheme(getStoredTheme());
initializeParticleSphere();
initializeProjectsStage();
initializeLanguage();
