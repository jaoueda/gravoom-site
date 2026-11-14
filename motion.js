// Gravoom motion: one orchestrated moment on the home page, and motion that answers what people do
// (opening a question, opening the visit request). Everything is visible without this file.
import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";

const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = [0.23, 1, 0.32, 1];

/* ---------- home: text settles, then the before/after sweeps and the report ticks off ---------- */
async function heroMoment() {
  const items = [...document.querySelectorAll("[data-in]")];
  const ba = document.querySelector(".ba");
  const report = [...document.querySelectorAll(".rep-list li")];
  // The page only hides [data-in] while .m-pre is set; if the fallback timer already removed it, do nothing.
  if (!root.classList.contains("m-pre") || reduce || !items.length) return;

  items.forEach((el) => (el.style.opacity = "0"));
  report.forEach((el) => (el.style.opacity = "0"));
  if (ba && window.gravoomBA) window.gravoomBA(88);
  root.classList.remove("m-pre");

  await animate(items, { opacity: [0, 1], y: [14, 0] }, { duration: 0.8, delay: stagger(0.09), ease });

  if (ba && window.gravoomBA && !ba.classList.contains("is-drag")) {
    await animate(88, 50, {
      duration: 1.4,
      ease,
      onUpdate: (v) => { if (!ba.classList.contains("is-drag")) window.gravoomBA(v); },
    });
  }
  if (report.length) {
    animate(report, { opacity: [0, 1], x: [-6, 0] }, { duration: 0.45, delay: stagger(0.22), ease });
  }
}

/* ---------- questions open and close with their height ---------- */
function faq() {
  if (reduce) return;
  document.querySelectorAll("details").forEach((d) => {
    const summary = d.querySelector("summary");
    const body = summary && summary.nextElementSibling;
    if (!body) return;
    let running = null;
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (running) running.stop();
      body.style.overflow = "hidden";
      const opening = !d.open;
      let anim;
      if (opening) {
        d.open = true;
        anim = animate(body, { height: [0, body.scrollHeight], opacity: [0, 1] }, { duration: 0.38, ease });
      } else {
        anim = animate(body, { height: [body.offsetHeight, 0], opacity: [1, 0] }, { duration: 0.28, ease });
      }
      running = anim;
      anim.then(() => {
        if (running !== anim) return; // a newer click took over
        if (!opening) d.open = false;
        body.style.height = "";
        body.style.overflow = "";
        body.style.opacity = "";
        running = null;
      });
    });
  });
}

/* ---------- the visit request dialog arrives instead of popping ---------- */
function finder() {
  const dlg = document.getElementById("finder");
  if (!dlg || reduce) return;
  new MutationObserver(() => {
    if (dlg.open) animate(dlg, { opacity: [0, 1], y: [18, 0], scale: [0.985, 1] }, { duration: 0.42, ease });
  }).observe(dlg, { attributes: true, attributeFilter: ["open"] });
}

faq();
finder();
heroMoment();
