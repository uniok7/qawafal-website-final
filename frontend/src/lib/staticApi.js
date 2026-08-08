/**
 * Static data layer.
 *
 * The site originally talked to a FastAPI + MongoDB backend. This file
 * intercepts those same GET requests and answers them from src/data/site.json,
 * so the app runs as a pure static site with no server and no hosting cost.
 *
 * Every page keeps using axios exactly as before — nothing else changed.
 * To edit the site's content, edit src/data/site.json and redeploy.
 */

import axios from "axios";
import site from "@/data/site.json";

const ok = (config, data) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const notFound = (config) => {
  const err = new Error("Not found");
  err.response = { ...ok(config, { detail: "Not found" }), status: 404 };
  return Promise.reject(err);
};

const byOrder = (a, b) => (a.order || 0) - (b.order || 0);

function queryProducts(params = {}) {
  const { category, is_new, sort = "newest", limit = 100, skip = 0 } = params;
  let rows = [...(site.products || [])];

  if (category) rows = rows.filter((p) => p.category_slug === category);

  // axios serialises booleans to the strings "true" / "false"
  if (is_new !== undefined && is_new !== null && is_new !== "") {
    const want = is_new === true || is_new === "true";
    rows = rows.filter((p) => Boolean(p.is_new) === want);
  }

  const sorters = {
    newest: (a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")),
    price_asc: (a, b) => (a.price || 0) - (b.price || 0),
    price_desc: (a, b) => (b.price || 0) - (a.price || 0),
  };
  rows.sort(sorters[sort] || sorters.newest);

  return rows.slice(Number(skip) || 0, (Number(skip) || 0) + (Number(limit) || 100));
}

function activeOffers() {
  const today = new Date().toISOString().slice(0, 10);
  return (site.offers || [])
    .filter((o) => !o.end_date || o.end_date >= today)
    .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

/** Returns the response body for a path, or undefined if unhandled. */
function resolve(path, params) {
  if (path === "/" || path === "") return { message: "static" };
  if (path === "/settings") return site.settings;
  if (path === "/categories") return [...(site.categories || [])].sort(byOrder);
  if (path === "/branches") return [...(site.branches || [])].sort(byOrder);
  if (path === "/offers") return activeOffers();
  if (path === "/school-bag-items") return [...(site.school_bag_items || [])].sort(byOrder);
  if (path === "/products") return queryProducts(params);

  const product = path.match(/^\/products\/(.+)$/);
  if (product) return (site.products || []).find((p) => p.id === product[1]) || null;

  return undefined;
}

export function installStaticApi() {
  axios.interceptors.request.use((config) => {
    const url = config.url || "";
    const marker = "/api";
    const i = url.indexOf(marker);
    if (i === -1) return config;

    // Only intercept reads. Writes belonged to the removed admin panel.
    if ((config.method || "get").toLowerCase() !== "get") return config;

    const path = url.slice(i + marker.length).split("?")[0];
    const body = resolve(path, config.params || {});
    if (body === undefined) return config;

    // Short-circuit: a per-request adapter resolves without any network call.
    config.adapter = (cfg) => (body === null ? notFound(cfg) : Promise.resolve(ok(cfg, body)));
    return config;
  });
}
