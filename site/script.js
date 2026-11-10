const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const menuLabel = document.querySelector(".menu-label");
const mobileViewport = window.matchMedia("(max-width: 800px)");

function closeMenu({ returnFocus = false } = {}) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Menu";
  navigation.classList.remove("is-open");
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuLabel.textContent = isOpen ? "Close" : "Menu";
  navigation.classList.toggle("is-open", isOpen);
});

navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !mobileViewport.matches) return;
  closeMenu();
  if (link.hash) {
    const destination = document.getElementById(link.hash.slice(1));
    if (destination) {
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
      destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
    }
  } else {
    menuToggle.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu({ returnFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

mobileViewport.addEventListener("change", () => closeMenu());
menuToggle.hidden = false;
document.documentElement.classList.add("js-enabled");

const filterButtons = document.querySelectorAll("[data-filter]");
const publications = document.querySelectorAll(".publication");
const publicationCount = document.querySelector(".publication-count");

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    for (const publication of publications) {
      publication.hidden = filter !== "all" && publication.dataset.type !== filter;
      if (!publication.hidden) visibleCount += 1;
    }
    for (const filterButton of filterButtons) {
      filterButton.setAttribute("aria-pressed", String(filterButton === button));
    }
    const label = { all: "publications & preprints", journal: "journal articles", preprint: "preprints" }[filter];
    publicationCount.textContent = `${visibleCount} ${label}`;
  });
}
document.querySelector(".publication-filters").hidden = false;

const toast = document.querySelector(".toast");
let toastTimeout;

function showMessage(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimeout = setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.textContent = "";
  }, 6500);
}

for (const button of document.querySelectorAll(".copy-citation")) {
  button.hidden = false;
  button.addEventListener("click", async () => {
    const citation = button.closest(".publication").querySelector(".citation");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
      await navigator.clipboard.writeText(citation.textContent.trim());
      showMessage("Citation copied to your clipboard.");
    } catch (error) {
      console.warn("Could not copy citation:", error);
      citation.hidden = false;
      citation.setAttribute("tabindex", "-1");
      citation.focus({ preventScroll: true });
      showMessage("Copy was unavailable. The citation is shown below the paper for manual copying.");
    }
  });
}

if ("IntersectionObserver" in window) {
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
  for (const section of document.querySelectorAll("main > section[id]")) observer.observe(section);
}

document.querySelector("#copyright-year").textContent = String(new Date().getFullYear());
