/* Provinet Empresas Glosario — interacciones del sitio
   Sin dependencias externas. Sin rastreadores. */
(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Buscador interno ---------- */
  var searchToggle = document.querySelector(".search-toggle");
  var searchPanel = document.querySelector(".search-panel");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var INDEX = window.PROVINET_INDEX || [];

  function openSearch() {
    if (!searchPanel) return;
    searchPanel.classList.add("open");
    searchToggle.setAttribute("aria-expanded", "true");
    if (searchInput) { searchInput.focus(); }
  }
  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove("open");
    searchToggle.setAttribute("aria-expanded", "false");
  }
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", function () {
      if (searchPanel.classList.contains("open")) { closeSearch(); }
      else { openSearch(); }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeSearch(); }
  });

  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function render(term) {
    if (!searchResults) return;
    var q = normalize(term).trim();
    searchResults.innerHTML = "";
    if (!q) { return; }
    var hits = INDEX.filter(function (item) {
      var hay = normalize(item.title + " " + item.cat + " " + (item.keywords || ""));
      return hay.indexOf(q) !== -1;
    });
    if (hits.length === 0) {
      var empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = 'No encontramos nada para “' + term + '”. Prueba con otro término.';
      searchResults.appendChild(empty);
      return;
    }
    hits.slice(0, 8).forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.url;
      a.innerHTML = '<span class="sr-cat">' + item.cat + "</span> " + item.title;
      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function (e) { render(e.target.value); });
  }

  /* ---------- Banner de consentimiento de cookies (RGPD) ---------- */
  var KEY = "provinet_cookie_consent";
  var banner = document.getElementById("cookie-banner");

  function hasChoice() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }
  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }
  function showBanner() { if (banner) { banner.classList.add("show"); } }
  function hideBanner() { if (banner) { banner.classList.remove("show"); } }

  if (banner && !hasChoice()) {
    // Pequeño retardo para no competir con la carga del contenido.
    window.setTimeout(showBanner, 600);
  }
  var acceptBtn = document.getElementById("cookie-accept");
  var rejectBtn = document.getElementById("cookie-reject");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      setChoice("accepted");
      hideBanner();
      // Aquí se activaría la publicidad personalizada solo TRAS el consentimiento.
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      setChoice("rejected");
      hideBanner();
      // Sin consentimiento: no se cargan cookies de personalización publicitaria.
    });
  }

  /* ---------- Año dinámico en el pie ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
