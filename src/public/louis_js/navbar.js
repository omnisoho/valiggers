
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const loginBtn = document.querySelector(".login-btn");

  // CREATE PROFILE ICON IF LOGGED IN
  if (token) {
    if (loginBtn) {
      const profileIcon = document.createElement("a");
      profileIcon.href = "./profile.html";
      profileIcon.classList.add("btn", "btn-outline-light", "profile-btn");
      profileIcon.innerHTML = `<i data-lucide="user"></i>`;
      loginBtn.replaceWith(profileIcon);
      lucide.createIcons();
    }
  }

  // HIDE "Get Started" BUTTON WHEN LOGGED IN
  const getStartedBtn = document.querySelector(".btn-accent.btn-lg");

  if (token && getStartedBtn) {
    getStartedBtn.style.display = "none";
  }

  // NO TOKEN → REDIRECT TO LOGIN
  const protectedLinks = document.querySelectorAll(
    "a.nav-link, .get-started-btn, .feature-card, .cta-card"
  );

  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!token) {
        e.preventDefault();
        window.location.href = "./login.html";
      }
    });
  });
});
