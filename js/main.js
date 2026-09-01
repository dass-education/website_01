document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("details.mobile-menu");
  if (menu) {
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.removeAttribute("open")));
    document.addEventListener("pointerdown", (event) => { if (menu.open && !menu.contains(event.target)) menu.removeAttribute("open"); });
  }

  const gate = document.querySelector("[data-potential-gate]");
  if (!gate) return;

  const STORAGE_KEY = "dass-potential-completion-v1";
  const SIGNING_LABEL = "DASS-PC-V1";

  const hashCompletion = (text) => {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36).toUpperCase();
  };

  const isValidRecord = (record) => {
    if (!record || record.version !== 1 || record.answered !== 72 || !record.id || !record.completedAt || !record.sig) return false;
    const expected = hashCompletion(`${record.id}|${record.completedAt}|72|${SIGNING_LABEL}`);
    return expected === record.sig;
  };

  const readLocalRecord = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const record = JSON.parse(raw);
      return isValidRecord(record) ? record : null;
    } catch {
      return null;
    }
  };

  const readUrlRecord = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const record = {
        version: 1,
        answered: 72,
        id: params.get("pc_id") || "",
        completedAt: params.get("pc_ts") || "",
        sig: params.get("pc_sig") || ""
      };
      return isValidRecord(record) ? record : null;
    } catch {
      return null;
    }
  };

  const urlRecord = readUrlRecord();
  if (urlRecord) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(urlRecord)); } catch {}
  }

  const record = urlRecord || readLocalRecord();
  const locked = gate.querySelector("[data-potential-locked]");
  const unlocked = gate.querySelector("[data-potential-unlocked]");

  if (!record) {
    if (locked) locked.hidden = false;
    if (unlocked) unlocked.hidden = true;
    return;
  }

  if (locked) locked.hidden = true;
  if (unlocked) unlocked.hidden = false;

  const idEl = gate.querySelector("[data-potential-id]");
  const dateEl = gate.querySelector("[data-potential-date]");
  if (idEl) idEl.textContent = record.id;
  if (dateEl) {
    const date = new Date(record.completedAt);
    dateEl.textContent = Number.isNaN(date.getTime()) ? "" : `受検完了：${date.toLocaleString("ja-JP")}`;
  }
});
