/* Shared language, navigation and native dialogs. No third-party runtime. */
(() => {
  "use strict";
  const translations = window.portfolioTranslations;
  const languageNames = {
    en: "EN",
    ru: "RU",
    ja: "JA",
    ms: "MS",
    th: "TH",
    vi: "VI",
  };
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* Storage may be disabled. */
      }
    },
  };
  const supported = (lang) => Object.hasOwn(translations.index, lang);
  const detectLanguage = () => {
    const saved = store.get(translations.storageKey);
    if (store.get("portfolio-language-source") === "manual" && supported(saved))
      return saved;
    for (const locale of navigator.languages || [navigator.language]) {
      const language = locale.toLowerCase().split(/[-_]/)[0];
      if (supported(language)) return language;
      if (["be", "kk", "ky", "hy", "az", "tg", "tk", "uz"].includes(language))
        return "ru";
    }
    return translations.defaultLang;
  };
  const get = (path) =>
    path
      .split(".")
      .reduce((value, key) => value?.[key], translations.index[api.lang]);
  const text = (key) =>
    get("ui." + key) || translations.index.en.ui[key] || key;
  const translate = (root = document) => {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = get(element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
    root
      .querySelectorAll("[data-label]")
      .forEach((element) =>
        element.setAttribute("aria-label", text(element.dataset.label)),
      );
  };
  const switcher = document.querySelector(".language-switcher");
  const trigger = switcher?.querySelector(".language-trigger");
  const menu = switcher?.querySelector(".language-menu");
  const options = [...(menu?.querySelectorAll("[data-lang]") || [])];
  const closeLanguageMenu = (restoreFocus = false) => {
    if (!menu) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
  };
  const setLanguage = (lang, manual = false) => {
    api.lang = supported(lang) ? lang : "en";
    document.documentElement.lang = api.lang;
    if (manual) {
      store.set(translations.storageKey, api.lang);
      store.set("portfolio-language-source", "manual");
    }
    translate();
    if (trigger)
      trigger.querySelector(".language-code").textContent =
        languageNames[api.lang];
    options.forEach((option) =>
      option.setAttribute(
        "aria-checked",
        String(option.dataset.lang === api.lang),
      ),
    );
    closeLanguageMenu(manual);
    document.dispatchEvent(
      new CustomEvent("portfolio:language", { detail: { lang: api.lang } }),
    );
  };
  trigger?.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    trigger.setAttribute("aria-expanded", String(!menu.hidden));
    if (!menu.hidden)
      (
        options.find((option) => option.dataset.lang === api.lang) || options[0]
      ).focus();
  });
  trigger?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    options[event.key === "ArrowUp" ? options.length - 1 : 0].focus();
  });
  menu?.addEventListener("keydown", (event) => {
    const index = options.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeLanguageMenu(true);
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? options.length - 1
            : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
              options.length;
      options[next].focus();
    } else if (event.key === "Tab") closeLanguageMenu();
  });
  options.forEach((option) =>
    option.addEventListener("click", () =>
      setLanguage(option.dataset.lang, true),
    ),
  );
  document.addEventListener("click", (event) => {
    if (!switcher?.contains(event.target)) closeLanguageMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!switcher?.contains(event.target)) closeLanguageMenu();
  });

  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const setNavigation = (open, restoreFocus = false) => {
    nav?.classList.toggle("is-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.dataset.label = open ? "menuClose" : "menuOpen";
      navToggle.setAttribute("aria-label", text(navToggle.dataset.label));
    }
    const mobileOpen = open && matchMedia("(max-width: 980px)").matches;
    document.querySelector("main").inert = mobileOpen;
    document.querySelector("footer").inert = mobileOpen;
    if (restoreFocus) navToggle?.focus();
  };
  navToggle?.addEventListener("click", () =>
    setNavigation(!nav.classList.contains("is-open")),
  );
  nav
    ?.querySelectorAll("a")
    .forEach((link) =>
      link.addEventListener("click", () => setNavigation(false)),
    );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (nav?.classList.contains("is-open")) setNavigation(false, true);
      if (menu && !menu.hidden) closeLanguageMenu(true);
    }
    if (event.key === "Tab" && nav?.classList.contains("is-open")) {
      const controls = [
        ...document.querySelectorAll(".site-header a, .site-header button"),
      ].filter((element) => element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  matchMedia("(max-width: 980px)").addEventListener("change", () =>
    setNavigation(false),
  );

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog
      .querySelectorAll("[data-close-dialog]")
      .forEach((button) =>
        button.addEventListener("click", () => dialog.close()),
      );
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      )
        dialog.close();
    });
  });
  document
    .querySelectorAll("[data-year]")
    .forEach((element) => (element.textContent = new Date().getFullYear()));
  const api = {
    lang: detectLanguage(),
    get,
    text,
    translate,
    setLanguage,
    store,
  };
  window.portfolio = api;
  document.documentElement.classList.add("js");
  setLanguage(api.lang);
})();
