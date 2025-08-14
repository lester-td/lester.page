document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".menu-open");
  const closeBtn = document.querySelector(".menu-close");
  const sidebar = document.querySelector(".sidebar");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      sidebar.classList.add("visible");
      document.body.classList.add("menu-active");
    });
    openBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      sidebar.classList.add("visible");
      document.body.classList.add("menu-active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("visible");
      document.body.classList.remove("menu-active");
    });
    closeBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      sidebar.classList.remove("visible");
      document.body.classList.remove("menu-active");
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      sidebar.classList.remove("visible");
      document.body.classList.remove("menu-active");
    }
  });
});
