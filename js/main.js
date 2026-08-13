(function () {
  const SUPPORTED = ["de", "ru", "en", "tr"];
  const DEFAULT_LANG = "de";

  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  function applyLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    const dict = translations[lang];
    document.documentElement.setAttribute("lang", lang);
    document.title = dict.meta_title;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getValue(dict, key);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = getValue(dict, key);
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll(".lang-menu button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    const currentCode = document.querySelector(".lang-current-code");
    if (currentCode) currentCode.textContent = lang.toUpperCase();

    localStorage.setItem("bastron_lang", lang);
  }

  function initLang() {
    const saved = localStorage.getItem("bastron_lang");
    const browser = (navigator.language || "de").slice(0, 2);
    const initial = saved || (SUPPORTED.includes(browser) ? browser : DEFAULT_LANG);
    applyLanguage(initial);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLang();

    const langDropdown = document.querySelector(".lang-dropdown");
    const langCurrent = document.querySelector(".lang-current");
    if (langDropdown && langCurrent) {
      langCurrent.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !langDropdown.classList.contains("open");
        langDropdown.classList.toggle("open", willOpen);
        langCurrent.setAttribute("aria-expanded", String(willOpen));
      });
      document.addEventListener("click", (e) => {
        if (!langDropdown.contains(e.target)) {
          langDropdown.classList.remove("open");
          langCurrent.setAttribute("aria-expanded", "false");
        }
      });
    }

    document.querySelectorAll(".lang-menu button").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyLanguage(btn.getAttribute("data-lang"));
        if (langDropdown) {
          langDropdown.classList.remove("open");
          langCurrent.setAttribute("aria-expanded", "false");
        }
      });
    });

    const burger = document.querySelector(".burger");
    const nav = document.querySelector("nav.main-nav");
    if (burger && nav) {
      burger.addEventListener("click", () => nav.classList.toggle("open"));
      nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
    }

    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const id = trigger.getAttribute("data-open-modal");
        document.getElementById(id).classList.add("open");
      });
    });
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.classList.contains("close-btn")) {
          overlay.classList.remove("open");
        }
      });
    });

    const header = document.querySelector(".site-header");
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 20 ? "0 8px 24px -12px rgba(0,0,0,.35)" : "none";
      lastY = window.scrollY;
    });
  });
})();
