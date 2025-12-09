// Mobile menu toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active")
    hamburger.classList.toggle("open", isOpen)
    hamburger.setAttribute("aria-expanded", String(isOpen))
  })

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("open")
      hamburger.setAttribute("aria-expanded", "false")
    })
  })

  // On resize, ensure menu resets when switching to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active")
      hamburger.classList.remove("open")
      hamburger.setAttribute("aria-expanded", "false")
    }
  })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

function updateNavbarState() {
  const navbar = document.querySelector(".navbar")
  if (!navbar) return

  if (window.scrollY === 0) {
    navbar.classList.remove("scrolled")
  } else {
    navbar.classList.add("scrolled")
  }
}

// Run once on page load
window.addEventListener("DOMContentLoaded", updateNavbarState)

// Run again on scroll
window.addEventListener("scroll", updateNavbarState)

// Contact Form Handling
const contactForm = document.getElementById("contactForm")
const successMessage = document.getElementById("successMessage")

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Show success message
    successMessage.style.display = "block"

    // Reset form
    contactForm.reset()

    // Hide message after 3 seconds
    setTimeout(() => {
      successMessage.style.display = "none"
    }, 3000)
  })
}

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
      observer.unobserve(entry.target)
    }
  })
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
})

// Page loader: show on navigation, hide on load
;(function () {
  const loaderEl = document.getElementById("page-loader")
  if (!loaderEl) return

  function showLoader() {
    loaderEl.classList.remove("hidden")
    loaderEl.setAttribute("aria-hidden", "false")
  }
  function hideLoader() {
    loaderEl.classList.add("hidden")
    loaderEl.setAttribute("aria-hidden", "true")
  }

  // Hide on initial load (including bfcache/pageshow)
  window.addEventListener("pageshow", (e) => {
    hideLoader()
  })
  window.addEventListener("load", hideLoader)

  // Show on beforeunload (covers refresh / form submit / back/forward)
  window.addEventListener("beforeunload", () => {
    showLoader()
  })

  // Intercept internal link clicks and show loader before navigating.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a")
    if (!a) return
    const href = a.getAttribute("href")
    // skip empty, hash-only anchors, mailto, tel, javascript or target="_blank"
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      a.target === "_blank"
    ) return

    // Only show loader for same-origin / relative links
    try {
      const url = new URL(href, location.href)
      if (url.origin !== location.origin) return
    } catch (err) {
      return
    }

    // Prevent instant jump for single-page anchors handled elsewhere
    e.preventDefault()
    showLoader()

    // Increase this value to delay navigation longer (milliseconds)
    const NAV_DELAY = 1200  // Changed from 600ms to 1200ms

    setTimeout(() => {
      window.location.href = href
    }, NAV_DELAY)
  })
})()

;(function () {
  // target mission and vision containers (no HTML edits)
  const groups = Array.from(document.querySelectorAll(".mission .mission-content, .vision .vision-content"))
  if (!groups.length) return

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      // collect items to animate:
      // - direct children (image / text columns)
      // - interior text elements (headings, paragraphs, list items)
      // - vision boxes (treated as individual items)
      const items = Array.from(entry.target.querySelectorAll(
        ':scope > *, ' +
        ':scope .mission-text > *, ' +
        ':scope .mission-list li, ' +
        ':scope .vision-text > *, ' +
        ':scope .vision-box'
      )).filter(Boolean)

      items.forEach((item, i) => {
        // stagger, small ramp for nicer effect
        item.style.transitionDelay = `${i * 120}ms`
        item.classList.add("in-view")
      })

      // stop observing this group
      obs.unobserve(entry.target)
    })
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: "0px 0px -80px 0px"
  })

  groups.forEach((g) => io.observe(g))
})()

;(function () {
  // Observe .mission and .vision sections and stagger-fade their inner elements
  const sections = document.querySelectorAll(".mission, .vision")
  if (!sections.length) return

  const itemSelector = "h1,h2,h3,p,li,.card,img,.vision-box,.mission-image,.section-header > *"

  // set initial hidden state for items
  sections.forEach((sec) => {
    const items = Array.from(sec.querySelectorAll(itemSelector))
    items.forEach((it) => {
      it.style.opacity = "0"
      it.style.transform = "translateY(20px)"
      it.style.transition = "opacity 700ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1)"
    })
  })

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const sec = entry.target
      const items = Array.from(sec.querySelectorAll(itemSelector))

      items.forEach((it, i) => {
        it.style.transitionDelay = `${i * 120}ms` // stagger
        // trigger animation (inline styles so it works without extra CSS)
        requestAnimationFrame(() => {
          it.style.opacity = "1"
          it.style.transform = "translateY(0)"
        })
      })

      obs.unobserve(sec)
    })
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: "0px 0px -80px 0px",
  })

  sections.forEach((s) => io.observe(s))
})()

// Stagger cards inside each .cards-grid so they fade up one-by-one
document.querySelectorAll(".cards-grid").forEach((grid) => {
  const cards = Array.from(grid.querySelectorAll(".card"))
  if (!cards.length) return

  // initial hidden state
  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 1.0s ease, transform 1.0s cubic-bezier(.2,.9,.2,1)"
  })

  const gridObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * 250}ms` // stagger delay
          // trigger animation on next frame for reliability
          requestAnimationFrame(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          })
        })

        obs.unobserve(entry.target)
      })
    },
    { threshold: 0.08, rootMargin: "0px 0px -80px 0px" }
  )

  gridObserver.observe(grid)
})

// Fallback: any .card not inside a .cards-grid — animate individually
document.querySelectorAll(".card").forEach((card) => {
  if (card.closest(".cards-grid")) return
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "opacity 1.0s ease, transform 1.0s cubic-bezier(.2,.9,.2,1)"
  observer.observe(card)
})

// Add per-grid stagger observer for team-grid and values-grid (fade up one-by-one)
;(function () {
  const staggerObserver = (selector, itemSelector = ".team-card", stagger = 120) => {
    document.querySelectorAll(selector).forEach((grid) => {
      const items = Array.from(grid.querySelectorAll(itemSelector))
      if (!items.length) return

      // prepare items
      items.forEach((it) => {
        it.classList.add("stagger-item")
      })

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          items.forEach((it, i) => {
            it.style.transitionDelay = `${i * stagger}ms`
            requestAnimationFrame(() => it.classList.add("in-view"))
          })
          obs.unobserve(entry.target)
        })
      }, { threshold: 0.06, rootMargin: "0px 0px -80px 0px" })

      io.observe(grid)
    })
  }

  // apply to team grid and values grid
  staggerObserver(".team-grid", ".team-card", 140)
  staggerObserver(".values-grid", ".value-card", 100)
})()

// Fixed back-to-top button: show when scrolled, smooth scroll to top when clicked
;(function () {
  const backBtn = document.getElementById("backToTopFixed")
  if (!backBtn) return

  const SHOW_AFTER = 300 // px scrolled before showing

  function updateBackBtn() {
    if (window.scrollY > SHOW_AFTER) backBtn.classList.add("show")
    else backBtn.classList.remove("show")
  }

  // initial state and on scroll
  updateBackBtn()
  window.addEventListener("scroll", updateBackBtn, { passive: true })

  // smooth scroll to top
  backBtn.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  // ensure hidden after page show (bfcache)
  window.addEventListener("pageshow", updateBackBtn)
})()

// Accordion toggle functionality
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const isExpanded = header.getAttribute("aria-expanded") === "true"
    
    // close all other accordions
    document.querySelectorAll(".accordion-header").forEach((h) => {
      h.setAttribute("aria-expanded", "false")
    })

    // toggle current
    header.setAttribute("aria-expanded", !isExpanded)
  })
})

// Accordion items fade-up stagger animation
;(function () {
  const accordionContainer = document.querySelector(".directorates-accordion")
  if (!accordionContainer) return

  const accordionItems = Array.from(accordionContainer.querySelectorAll(".accordion-item"))
  if (!accordionItems.length) return

  // set initial hidden state
  accordionItems.forEach((item) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    item.style.transition = "opacity .8s cubic-bezier(.2,.9,.2,1), transform 0.8s cubic-bezier(.2,.9,.2,1)"
  })

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const items = Array.from(entry.target.querySelectorAll(".accordion-item"))
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 300}ms`
        requestAnimationFrame(() => {
          item.style.opacity = "1"
          item.style.transform = "translateY(0)"
        })
      })

      obs.unobserve(entry.target)
    })
  }, { threshold: 0.06, rootMargin: "0px 0px -80px 0px" })

  io.observe(accordionContainer)
})()

// Stagger fade-up for multiple sections (Partnership & FAQ)
;(function () {
  const sections = [
    { selector: ".partners-grid", itemSelector: ".partner-card" },
    { selector: ".faq-grid", itemSelector: ".faq-item" },
  ];

  sections.forEach(({ selector, itemSelector }) => {
    const grid = document.querySelector(selector);
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll(itemSelector));
    if (!items.length) return;

    // initial hidden state
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition =
        "opacity 1.0s ease, transform 1.0s cubic-bezier(.2,.9,.2,1)";
    });

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 200}ms`; // stagger
          requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          });
        });

        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -80px 0px"
    });

    io.observe(grid);
  });
})();
