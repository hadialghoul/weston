const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const form = document.getElementById("visit-form");
const formError = document.getElementById("form-error");
const year = document.getElementById("year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !phone || !email || !message || !form.reportValidity()) {
    formError.hidden = false;
    return;
  }

  formError.hidden = true;
  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    "",
    message
  ].join("\n");

  const compose = new URL("https://mail.google.com/mail/");
  compose.searchParams.set("view", "cm");
  compose.searchParams.set("fs", "1");
  compose.searchParams.set("to", "Hussein@westonhandyman.estate");
  compose.searchParams.set("su", "Estate care visit request");
  compose.searchParams.set("body", body);
  window.location.assign(compose.href);
});
