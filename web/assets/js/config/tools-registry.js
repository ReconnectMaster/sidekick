/**
 * Central registry of calculator tools.
 *
 * To REMOVE a tool:
 * 1. Delete its folder under web/tools/<id>/
 * 2. Delete its feature files under assets/js/features/<id>/
 * 3. Remove its entry from TOOLS below
 *
 * The home page, navigation, and routing all read from this file only.
 */

export const TOOLS = [
  {
    id: "shopping",
    path: "/tools/shopping/",
    navKey: "shopping",
    homeKey: "shopping",
    icon: "shopping",
    accent: "blue",
    scripts: ["/assets/js/features/shopping/shopping.ui.js"],
  },
  {
    id: "discount",
    path: "/tools/discount/",
    navKey: "discount",
    homeKey: "discount",
    icon: "discount",
    accent: "green",
    scripts: ["/assets/js/features/discount/discount.ui.js"],
  },
  {
    id: "gold",
    path: "/tools/gold/",
    navKey: "gold",
    homeKey: "gold",
    icon: "gold",
    accent: "yellow",
    scripts: ["/assets/js/features/gold/gold.ui.js"],
  },
  {
    id: "vat",
    path: "/tools/vat/",
    navKey: "vat",
    homeKey: "vat",
    icon: "vat",
    accent: "amber",
    scripts: ["/assets/js/features/vat/vat.ui.js"],
  },
  {
    id: "profit",
    path: "/tools/profit/",
    navKey: "profit",
    homeKey: "profit",
    icon: "profit",
    accent: "purple",
    scripts: ["/assets/js/features/profit/profit.ui.js"],
  },
  {
    id: "word-count",
    path: "/tools/word-count/",
    navKey: "wordCount",
    homeKey: "wordCount",
    icon: "wordCount",
    accent: "indigo",
    scripts: ["/assets/js/features/word-count/word-count.ui.js"],
  },
];

/** Lookup a tool by its URL pathname (e.g. "/tools/shopping/"). */
export function findToolByPath(pathname) {
  let path = pathname.replace(/\/index\.html$/, "/");
  if (!path.endsWith("/")) path = `${path}/`;
  return TOOLS.find((tool) => tool.path === path) ?? null;
}
