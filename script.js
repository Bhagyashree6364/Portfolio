(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var root = document.documentElement;

  function revealAll() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".topnav a[href^='#']")
  );

  function setActive(id) {
    links.forEach(function (link) {
      var on = (link.getAttribute("href") || "") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  var sections = ["about", "skills", "experience", "projects", "certifications", "education", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  if (!reduce && root.classList.contains("motion") && "IntersectionObserver" in window) {
    document.querySelectorAll(".hero .reveal").forEach(function (el) {
      el.classList.add("in");
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });

    document.addEventListener("focusin", function (event) {
      var block = event.target.closest ? event.target.closest(".reveal") : null;
      if (block) block.classList.add("in");
    });
  } else {
    revealAll();
  }

  if (fine && !reduce) {
    window.addEventListener("pointermove", function (event) {
      root.style.setProperty("--px", event.clientX + "px");
      root.style.setProperty("--py", event.clientY + "px");
    }, { passive: true });

    document.querySelectorAll(".spot").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--lx", (event.clientX - rect.left) + "px");
        card.style.setProperty("--ly", (event.clientY - rect.top) + "px");
      });
    });

    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        var x = event.clientX - (rect.left + rect.width / 2);
        var y = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = "translate(" + (x * 0.16) + "px, " + (y * 0.28) + "px)";
      });
      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
      });
    });
  }
})();
