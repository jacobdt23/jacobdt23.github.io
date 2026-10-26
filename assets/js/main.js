(function () {
  "use strict";

  var root = document.documentElement;

  // 1. Dark/Light Theme Toggle
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // 2. Mobile Navigation Toggle
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // 3. Real-time Video Search & Category Filtering
  var searchInput = document.getElementById("video-search-input");
  var clearSearchBtn = document.getElementById("clear-search-btn");
  var filterBtns = document.querySelectorAll("#channel-filters .filter-btn");
  var videoCards = document.querySelectorAll("#video-cards-grid .video-card");
  var resultsCountText = document.getElementById("results-count-text");
  var noResultsBox = document.getElementById("no-search-results");
  var resetSearchBtn = document.getElementById("reset-search-btn");

  if (videoCards.length > 0 && searchInput) {
    var activeFilter = "all";

    function filterVideos() {
      var query = (searchInput.value || "").trim().toLowerCase();
      var visibleCount = 0;

      if (clearSearchBtn) {
        clearSearchBtn.style.display = query.length > 0 ? "inline-block" : "none";
      }

      videoCards.forEach(function (card) {
        var title = card.getAttribute("data-title") || "";
        var channel = card.getAttribute("data-channel") || "";
        var tags = card.getAttribute("data-tags") || "";
        var summary = card.getAttribute("data-summary") || "";
        var content = title + " " + channel + " " + tags + " " + summary;

        var matchesQuery = !query || content.indexOf(query) !== -1;
        var matchesFilter = true;

        if (activeFilter === "paracord") {
          matchesFilter = channel.indexOf("paracord") !== -1 || tags.indexOf("paracord") !== -1;
        } else if (activeFilter === "tech") {
          matchesFilter = channel.indexOf("tech") !== -1 || tags.indexOf("tech") !== -1 || tags.indexOf("fedora") !== -1;
        } else if (activeFilter === "tutorial") {
          matchesFilter = content.indexOf("tutorial") !== -1 || content.indexOf("how to") !== -1 || content.indexOf("knot") !== -1;
        } else if (activeFilter === "showcase") {
          matchesFilter = content.indexOf("showcase") !== -1;
        }

        if (matchesQuery && matchesFilter) {
          card.style.display = "";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (resultsCountText) {
        if (!query && activeFilter === "all") {
          resultsCountText.textContent = "Showing all " + visibleCount + " videos";
        } else {
          resultsCountText.textContent = "Found " + visibleCount + " video" + (visibleCount === 1 ? "" : "s");
        }
      }

      if (noResultsBox) {
        noResultsBox.style.display = visibleCount === 0 ? "block" : "none";
      }
    }

    searchInput.addEventListener("input", filterVideos);

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        filterVideos();
        searchInput.focus();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        activeFilter = "all";
        filterBtns.forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-filter") === "all");
        });
        filterVideos();
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        filterVideos();
      });
    });
  }

  // 4. Paracord Calculator Logic
  var wristSlider = document.getElementById("wrist-slider");
  var wristValDisplay = document.getElementById("wrist-val-display");
  var weaveSelect = document.getElementById("weave-style");
  var claspSelect = document.getElementById("clasp-type");
  var colorModeSelect = document.getElementById("color-mode");
  var unitToggles = document.querySelectorAll("#unit-toggles .btn-pill");

  if (wristSlider && weaveSelect && claspSelect) {
    var currentUnit = "inches";

    function updateCalculator() {
      var wristVal = parseFloat(wristSlider.value);
      var wristInInches = currentUnit === "cm" ? (wristVal / 2.54) : wristVal;

      if (wristValDisplay) {
        wristValDisplay.textContent = currentUnit === "cm" ? wristVal.toFixed(1) + " cm" : wristVal.toFixed(2) + '"';
      }

      var selectedWeaveOpt = weaveSelect.options[weaveSelect.selectedIndex];
      var weaveRate = parseFloat(selectedWeaveOpt.getAttribute("data-rate") || "12"); // inches of cord per inch of bracelet
      var tutorialUrl = selectedWeaveOpt.getAttribute("data-tutorial") || "/videos/";
      var weaveName = selectedWeaveOpt.textContent.split("(")[0].trim();

      var selectedClaspOpt = claspSelect.options[claspSelect.selectedIndex];
      var claspExtra = parseFloat(selectedClaspOpt.getAttribute("data-extra") || "1.0");

      var braceletLength = wristInInches + claspExtra;
      // Formula: (braceletLength * rate) + 12" safety buffer
      var totalInches = Math.round(braceletLength * weaveRate + 12);
      var totalFeet = Math.floor(totalInches / 12);
      var remInches = totalInches % 12;

      var totalMeters = (totalInches * 0.0254).toFixed(2);

      // Core length: standard 2-strand core
      var coreInches = Math.round(braceletLength * 2 + 8);
      var coreFeet = (coreInches / 12).toFixed(1);

      var resTotal = document.getElementById("res-total");
      var resMetric = document.getElementById("res-metric");
      var resCore = document.getElementById("res-core");
      var colorSplitBox = document.getElementById("color-split-box");
      var resColorA = document.getElementById("res-color-a");
      var resColorB = document.getElementById("res-color-b");
      var tutorialBtn = document.getElementById("tutorial-btn");
      var tutorialTitle = document.getElementById("tutorial-title");

      if (resTotal) resTotal.textContent = totalFeet + " ft " + remInches + " in";
      if (resMetric) resMetric.textContent = "(approx. " + totalMeters + " meters / " + totalInches + " inches)";
      if (resCore) resCore.textContent = coreInches + " in (" + coreFeet + " ft)";

      var isTwoTone = colorModeSelect && colorModeSelect.value === "two-tone";
      if (colorSplitBox) {
        colorSplitBox.style.display = isTwoTone ? "block" : "none";
        if (isTwoTone) {
          var halfInches = Math.round(totalInches / 2);
          var halfFt = Math.floor(halfInches / 12);
          var halfRem = halfInches % 12;
          var halfStr = halfFt + " ft " + halfRem + " in";
          if (resColorA) resColorA.textContent = halfStr;
          if (resColorB) resColorB.textContent = halfStr;
        }
      }

      if (tutorialBtn) tutorialBtn.href = tutorialUrl;
      if (tutorialTitle) tutorialTitle.textContent = "Learn how to make the " + weaveName + " step-by-step:";
    }

    wristSlider.addEventListener("input", updateCalculator);
    weaveSelect.addEventListener("change", updateCalculator);
    claspSelect.addEventListener("change", updateCalculator);
    if (colorModeSelect) colorModeSelect.addEventListener("change", updateCalculator);

    unitToggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        unitToggles.forEach(function (b) { b.classList.remove("active"); b.classList.add("btn-ghost"); });
        btn.classList.add("active");
        btn.classList.remove("btn-ghost");

        var newUnit = btn.getAttribute("data-unit");
        if (newUnit !== currentUnit) {
          currentUnit = newUnit;
          if (currentUnit === "cm") {
            wristSlider.min = "12";
            wristSlider.max = "26";
            wristSlider.step = "0.5";
            wristSlider.value = (parseFloat(wristSlider.value) * 2.54).toFixed(1);
          } else {
            wristSlider.min = "5";
            wristSlider.max = "10";
            wristSlider.step = "0.25";
            wristSlider.value = (parseFloat(wristSlider.value) / 2.54).toFixed(2);
          }
          updateCalculator();
        }
      });
    });

    updateCalculator();
  }

  // 5. Single Video Share & Theater Mode
  var copyLinkBtn = document.getElementById("copy-video-link-btn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      var url = copyLinkBtn.getAttribute("data-url") || window.location.href;
      navigator.clipboard.writeText(url).then(function () {
        var origText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = "<span>✅ Link Copied!</span>";
        setTimeout(function () { copyLinkBtn.innerHTML = origText; }, 2500);
      }).catch(function () {
        prompt("Copy this link:", url);
      });
    });
  }

  var theaterBtn = document.getElementById("theater-toggle-btn");
  var playerWrap = document.getElementById("video-player");
  if (theaterBtn && playerWrap) {
    theaterBtn.addEventListener("click", function () {
      playerWrap.classList.toggle("theater-mode");
      theaterBtn.classList.toggle("active");
      if (playerWrap.classList.contains("theater-mode")) {
        theaterBtn.innerHTML = "<span>⛶ Normal View</span>";
      } else {
        theaterBtn.innerHTML = "<span>⛶ Theater Mode</span>";
      }
    });
  }

  // 6. Right Side Panel: Table of Contents & ScrollSpy
  var tocSidebar = document.getElementById("toc-sidebar");
  var pageContent = document.getElementById("page-content");

  if (tocSidebar && pageContent) {
    var staticLinks = tocSidebar.querySelectorAll(".toc-list a");
    var dynamicList = document.getElementById("dynamic-toc-list");

    // If static links were not defined for this page, auto-discover headings
    if (staticLinks.length === 0 && dynamicList) {
      var headings = pageContent.querySelectorAll("h2, h3");
      headings.forEach(function (heading) {
        if (!heading.id) {
          heading.id = "sec-" + (heading.textContent || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
        }
        var li = document.createElement("li");
        li.className = "toc-item toc-" + heading.tagName.toLowerCase();
        var a = document.createElement("a");
        a.href = "#" + heading.id;
        a.textContent = heading.textContent.replace(/^[0-9.]+\s*/, "").trim();
        li.appendChild(a);
        dynamicList.appendChild(li);
      });
    }

    var allTocLinks = tocSidebar.querySelectorAll("nav a");

    // Smooth click-to-scroll
    allTocLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          var targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            history.pushState(null, null, targetId);
          }
        }
      });
    });

    // ScrollSpy & Scroll Progress Bar: highlight active link as user scrolls
    var progressBar = document.getElementById("toc-progress-bar");

    function updateScrollSpy() {
      // 1. Update Scroll Progress Bar
      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progressPercent = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
        progressBar.style.width = progressPercent.toFixed(1) + "%";
      }

      // 2. Update Active Section Highlight
      var scrollPos = window.scrollY + 160;
      var currentId = "";

      allTocLinks.forEach(function (link) {
        var targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          var targetEl = document.querySelector(targetId);
          if (targetEl && targetEl.offsetTop <= scrollPos) {
            currentId = targetId;
          }
        }
      });

      allTocLinks.forEach(function (link) {
        if (link.getAttribute("href") === currentId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", updateScrollSpy, { passive: true });
    updateScrollSpy();
  }
})();
