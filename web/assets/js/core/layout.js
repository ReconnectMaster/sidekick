/**
 * App shell: sidebar navigation, mobile menu, language toggle, theme button.
 * Reads tool list from tools-registry.js — no hardcoded nav links.
 */

import { APP_NAME } from "../config/constants.js";
import { TOOLS } from "../config/tools-registry.js";
import { getLang, setLang, t } from "./i18n.js";
import { getTheme, toggleTheme } from "./theme.js";
import { getIcon } from "../shared/ui/icons.js";

function isActivePath(href) {
  const path = window.location.pathname;
  if (href === "/") {
    return path === "/" || path === "/index.html";
  }
  return path.startsWith(href.replace(/\/$/, ""));
}

function createNavLink(item, labels, onNavigate) {
  const link = document.createElement("a");
  link.href = item.path;
  link.className = "nav-link";
  if (isActivePath(item.path)) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }

  link.innerHTML = `${getIcon(item.icon)}<span data-i18n="nav.${item.navKey}">${labels.nav[item.navKey]}</span>`;

  if (onNavigate) {
    link.addEventListener("click", onNavigate);
  }

  return link;
}

function buildNavLinks(container, onNavigate) {
  container.replaceChildren();
  const labels = t();

  const homeLink = document.createElement("a");
  homeLink.href = "/";
  homeLink.className = "nav-link";
  if (isActivePath("/")) {
    homeLink.classList.add("is-active");
    homeLink.setAttribute("aria-current", "page");
  }
  homeLink.innerHTML = `${getIcon("home")}<span data-i18n="nav.home">${labels.nav.home}</span>`;
  if (onNavigate) homeLink.addEventListener("click", onNavigate);
  container.appendChild(homeLink);

  TOOLS.forEach((tool) => {
    container.appendChild(createNavLink(tool, labels, onNavigate));
  });
}

function buildLangToggle() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "lang-toggle";
  button.setAttribute("aria-label", "Toggle language");

  function render() {
    const lang = getLang();
    button.innerHTML = `
      <span class="${lang === "en" ? "is-on" : ""}">EN</span>
      <span class="sep">|</span>
      <span class="${lang === "th" ? "is-on" : ""}">TH</span>
    `;
  }

  button.addEventListener("click", () => {
    setLang(getLang() === "en" ? "th" : "en");
    render();
    refreshI18nText();
    document.dispatchEvent(new CustomEvent("layoutrefresh"));
  });

  render();
  return button;
}

function buildThemeButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-ghost theme-toggle";

  function render() {
    const dark = getTheme() === "dark";
    button.innerHTML = `${dark ? getIcon("sun") : getIcon("moon")}<span class="theme-label" data-i18n="common.${dark ? "lightMode" : "darkMode"}">${dark ? t().common.lightMode : t().common.darkMode}</span>`;
  }

  button.addEventListener("click", () => {
    toggleTheme();
    render();
  });

  document.addEventListener("themechange", render);
  render();
  return button;
}

/** Update every element that has a data-i18n attribute. */
export function refreshI18nText() {
  const labels = t();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = key.split(".").reduce((obj, part) => obj?.[part], labels);
    if (typeof value === "string") {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const value = key.split(".").reduce((obj, part) => obj?.[part], labels);
    if (typeof value === "string") {
      el.setAttribute("placeholder", value);
    }
  });
}

function buildHomeCards(container) {
  container.replaceChildren();
  const labels = t();

  TOOLS.forEach((tool, index) => {
    const entry = labels.home.tools[tool.homeKey];
    if (!entry) return;

    const card = document.createElement("a");
    card.href = tool.path;
    card.className = `tool-card tool-card--${tool.accent}`;
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <div class="tool-card__icon">${getIcon(tool.icon)}</div>
      <h2 class="tool-card__title">${entry.title}</h2>
      <p class="tool-card__desc">${entry.desc}</p>
      <span class="tool-card__arrow" aria-hidden="true">→</span>
    `;

    container.appendChild(card);
  });
}

function setupMobileMenu() {
  const openBtn = document.getElementById("mobile-menu-open");
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-backdrop");
  const nav = document.getElementById("mobile-nav");

  if (!openBtn || !drawer || !nav) return;

  function close() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
  }

  function open() {
    buildNavLinks(nav, close);
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
  }

  openBtn.addEventListener("click", open);
  backdrop?.addEventListener("click", close);
}

/** Initialize layout chrome on every page. */
export function initLayout() {
  const sidebarNav = document.getElementById("sidebar-nav");
  const homeGrid = document.getElementById("home-tool-grid");
  const langDesktop = document.getElementById("lang-toggle-desktop");
  const langMobile = document.getElementById("lang-toggle-mobile");
  const themeDesktop = document.getElementById("theme-toggle-desktop");
  const themeMobile = document.getElementById("theme-toggle-mobile");
  const brandEls = document.querySelectorAll("[data-brand]");

  brandEls.forEach((el) => {
    el.textContent = APP_NAME;
  });

  if (sidebarNav) buildNavLinks(sidebarNav);
  if (homeGrid) buildHomeCards(homeGrid);
  if (langDesktop) langDesktop.replaceWith(buildLangToggle());
  if (langMobile) langMobile.replaceWith(buildLangToggle());
  if (themeDesktop) themeDesktop.replaceWith(buildThemeButton());
  if (themeMobile) {
    const mobileTheme = buildThemeButton();
    mobileTheme.classList.add("btn-icon");
    mobileTheme.querySelector(".theme-label")?.remove();
    themeMobile.replaceWith(mobileTheme);
  }

  setupMobileMenu();
  refreshI18nText();

  document.addEventListener("langchange", () => {
    if (sidebarNav) buildNavLinks(sidebarNav);
    if (homeGrid) buildHomeCards(homeGrid);
    refreshI18nText();
  });
}
