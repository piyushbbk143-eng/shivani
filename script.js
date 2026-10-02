const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  const arrivalPaths = [
    [-38, -34], [35, -31], [-29, 36], [34, 38],
    [0, -46], [-48, 0], [0, 44], [47, 0]
  ];
  let letterIndex = 0;

  document.querySelectorAll("h1").forEach((heading) => {
    const accessibleText = heading.innerText.replace(/\s+/g, " ").trim();
    heading.setAttribute("aria-label", accessibleText);

    const animateTextNode = (textNode) => {
      const fragment = document.createDocumentFragment();
      const parts = textNode.textContent.match(/\s+|\S+/g) || [];

      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }

        const word = document.createElement("span");
        word.className = "letter-word";

        for (const character of part) {
          const letter = document.createElement("span");
          const [x, y] = arrivalPaths[letterIndex % arrivalPaths.length];
          letter.className = "letter-arrive";
          letter.setAttribute("aria-hidden", "true");
          letter.textContent = character;
          letter.style.setProperty("--letter-x", `${x}px`);
          letter.style.setProperty("--letter-y", `${y}px`);
          letter.style.setProperty("--letter-delay", `${Math.min(letterIndex * 32, 1100)}ms`);
          word.append(letter);
          letterIndex += 1;
        }

        fragment.append(word);
      });

      textNode.replaceWith(fragment);
    };

    const animateChildren = (parent) => {
      Array.from(parent.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          animateTextNode(child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          animateChildren(child);
        }
      });
    };

    animateChildren(heading);
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const rotatingText = document.querySelector(".rotating-text");
if (rotatingText && !reduceMotion) {
  const words = (rotatingText.dataset.words || "").split("|").filter(Boolean);
  let wordIndex = 0;

  if (words.length > 1) {
    window.setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatingText.classList.add("is-changing");
      window.setTimeout(() => {
        rotatingText.textContent = words[wordIndex];
        rotatingText.classList.remove("is-changing");
      }, 180);
    }, 2600);
  }
}
