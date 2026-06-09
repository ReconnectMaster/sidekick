/**
 * Lightweight tab component for elements marked with [data-tabs].
 *
 * HTML pattern:
 * <div data-tabs>
 *   <div class="tab-list" role="tablist">
 *     <button type="button" role="tab" data-tab="a" aria-selected="true">A</button>
 *   </div>
 *   <div role="tabpanel" data-tab-panel="a">...</div>
 * </div>
 */

function activateTab(root, tabId) {
  const triggers = root.querySelectorAll("[role='tab'][data-tab]");
  const panels = root.querySelectorAll("[data-tab-panel]");

  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.tab === tabId;
    trigger.setAttribute("aria-selected", String(isActive));
    trigger.classList.toggle("is-active", isActive);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

/** Wire up all tab groups inside a container (defaults to document). */
export function initTabs(container = document) {
  const groups = container.querySelectorAll("[data-tabs]");

  groups.forEach((root) => {
    const triggers = root.querySelectorAll("[role='tab'][data-tab]");
    if (triggers.length === 0) return;

    const initial =
      [...triggers].find((t) => t.classList.contains("is-active"))?.dataset.tab ??
      triggers[0].dataset.tab;

    activateTab(root, initial);

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        activateTab(root, trigger.dataset.tab);
      });
    });
  });
}
