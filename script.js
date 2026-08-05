// ===== 한국어 / 영어 토글 =====
(function () {
  "use strict";

  var STORAGE_KEY = "ringring-lang";
  var SUPPORTED = ["ko", "en"];

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "ko";

    // <html lang>
    document.documentElement.setAttribute("lang", lang);

    // 텍스트 콘텐츠 (data-ko / data-en) — innerHTML 허용 (제목의 <br> 등)
    var els = document.querySelectorAll("[data-ko][data-en]");
    els.forEach(function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value === null) return;
      if (el.tagName === "TITLE" || el.tagName === "META") {
        if (el.tagName === "META") {
          el.setAttribute("content", value);
        } else {
          el.textContent = value;
        }
      } else {
        el.innerHTML = value;
      }
    });

    // 이미지 대체 텍스트 (data-ko-alt / data-en-alt)
    var imgs = document.querySelectorAll("[data-ko-alt][data-en-alt]");
    imgs.forEach(function (img) {
      var altVal = img.getAttribute("data-" + lang + "-alt");
      if (altVal !== null) img.setAttribute("alt", altVal);
    });

    // 언어별 스토어 링크
    var links = document.querySelectorAll("[data-ko-href][data-en-href]");
    links.forEach(function (link) {
      var href = link.getAttribute("data-" + lang + "-href");
      if (href !== null) link.setAttribute("href", href);
    });

    // 토글 버튼 활성 표시
    var opts = document.querySelectorAll(".lang-opt");
    opts.forEach(function (opt) {
      opt.classList.toggle("is-active", opt.getAttribute("data-lang") === lang);
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage 비활성 환경 무시 */
    }
  }

  function initialLang() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* 무시 */
    }
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "ko").toLowerCase();
    return nav.indexOf("ko") === 0 ? "ko" : "en";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(initialLang());

    var toggle = document.getElementById("langToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("lang") === "en" ? "en" : "ko";
      applyLang(current === "ko" ? "en" : "ko");
    });
  });
})();
