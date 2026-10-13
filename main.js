const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const form = document.getElementById("visit-form");
const formError = document.getElementById("form-error");
const formSuccess = document.getElementById("form-success");
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const inbox = form.dataset.inbox;
  const submitButton = form.querySelector("[type=submit]");

  if (!name || !phone || !email || !message || !form.reportValidity()) {
    formError.hidden = false;
    formError.textContent = "Add your name, a way to reach you, and a short note.";
    return;
  }

  formError.hidden = true;
  formSuccess.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = "Sending";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        message,
        _replyto: email,
        _subject: "Estate care visit request",
        _template: "table",
        _captcha: "false"
      })
    });

    if (!response.ok) {
      throw new Error("Request was not accepted");
    }

    form.reset();
    formSuccess.hidden = false;
  } catch (error) {
    formError.textContent = "The request did not send. Call (339) 213-5576 or email Hussein directly.";
    formError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send the request";
  }
});
