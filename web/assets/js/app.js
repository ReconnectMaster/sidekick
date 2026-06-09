/**
 * Application bootstrap — runs on every page.
 * Initializes theme, language, layout, tabs, then loads the active tool module.
 */

import { initI18n } from "./core/i18n.js";
import { initTheme } from "./core/theme.js";
import { initLayout } from "./core/layout.js";
import { initTabs } from "./shared/ui/tabs.js";
import { findToolByPath } from "./config/tools-registry.js";

async function loadToolModule() {
  const tool = findToolByPath(window.location.pathname);
  if (!tool) return;

  for (const src of tool.scripts) {
    await import(src);
  }
}

function boot() {
  initTheme();
  initI18n();
  initLayout();
  initTabs();
  loadToolModule().catch((error) => {
    console.error("Failed to load tool module:", error);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
