window.currentZIndex = 100;

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");
  const clock = document.getElementById("clock");
  const taskbar = document.getElementById("taskbar");

  if (startMenu) startMenu.style.display = "none";
  if (taskbar) taskbar.style.zIndex = 1000;

  function toggleStartMenu(event) {
    event.stopPropagation();
    deactivateAllWindows();
    if (startMenu.style.display === "block") {
      startMenu.style.display = "none";
      if (startButton) startButton.classList.remove("active");
    } else {
      startMenu.style.display = "block";
      if (startButton) startButton.classList.add("active");
    }
  }
  if (startButton) {
    startButton.addEventListener("mousedown", toggleStartMenu);
    startButton.addEventListener("touchstart", toggleStartMenu);
  }

  function taskbarHandler(event) {
    if (!event.target.closest("#program-list a")) {
      if (startMenu) startMenu.style.display = "none";
      if (startButton) startButton.classList.remove("active");
      deactivateAllWindows();
    }
  }
  if (taskbar) {
    taskbar.addEventListener("mousedown", taskbarHandler);
    taskbar.addEventListener("touchstart", taskbarHandler);
  }

  function documentHandler(event) {
    if (
      startMenu &&
      !startMenu.contains(event.target) &&
      event.target !== startButton
    ) {
      startMenu.style.display = "none";
      if (startButton) startButton.classList.remove("active");
      if (!event.target.closest(".window") && !event.target.closest("#taskbar")) {
        deactivateAllWindows();
      }
    }
  }
  document.addEventListener("mousedown", documentHandler);
  document.addEventListener("touchstart", documentHandler);

  function updateClock() {
    if (clock) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      clock.textContent = `${hours}:${minutes}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  const windows = document.querySelectorAll(".window");
  const taskbarItems = document.querySelectorAll("#program-list a");

  function deactivateAllWindows() {
    windows.forEach((win, index) => {
      const titlebar = win.querySelector(".titlebar");
      if (titlebar) titlebar.classList.add("inactive");
      if (taskbarItems[index]) {
        taskbarItems[index].classList.remove("program-active");
        taskbarItems[index].classList.add("program-inactive");
      }
    });
  }

  function activateWindow(win) {
    windows.forEach((otherWin, index) => {
      const titlebar = otherWin.querySelector(".titlebar");
      if (otherWin === win) {
        if (titlebar) titlebar.classList.remove("inactive");
        if (window.currentZIndex >= 999) window.currentZIndex = 100;
        window.currentZIndex++;
        otherWin.style.zIndex = window.currentZIndex;
        if (taskbarItems[index]) {
          taskbarItems[index].classList.remove("program-inactive");
          taskbarItems[index].classList.add("program-active");
        }
      } else {
        if (titlebar) titlebar.classList.add("inactive");
        if (taskbarItems[index]) {
          taskbarItems[index].classList.remove("program-active");
          taskbarItems[index].classList.add("program-inactive");
        }
      }
    });
    if (taskbar) taskbar.style.zIndex = 1000;
  }

  windows.forEach(win => {
    function windowHandler(e) {
      if (startMenu && startMenu.style.display === "block") {
        startMenu.style.display = "none";
        if (startButton) startButton.classList.remove("active");
      }
      activateWindow(win);
      e.stopPropagation();
    }
    win.addEventListener("mousedown", windowHandler);
    win.addEventListener("touchstart", windowHandler);
  });

  taskbarItems.forEach((item, index) => {
    function taskbarItemHandler(e) {
      if (startMenu && startMenu.style.display === "block") {
        startMenu.style.display = "none";
        if (startButton) startButton.classList.remove("active");
      }
      const win = windows[index];
      if (win) activateWindow(win);
      e.stopPropagation();
    }
    item.addEventListener("mousedown", taskbarItemHandler);
    item.addEventListener("touchstart", taskbarItemHandler);
  });

  if (windows.length > 0) activateWindow(windows[0]);

  const desktopIcons = document.querySelectorAll(".desktop-icon");

  document.querySelectorAll('.icon-img').forEach(iconImg => {
    const imgElement = iconImg.querySelector('img');
    if (imgElement && imgElement.src) {
      iconImg.style.setProperty('--mask-url', `url(${imgElement.src})`);
    }
  });

  desktopIcons.forEach(icon => {
    icon.addEventListener("click", function(e) {
      desktopIcons.forEach(item => {
        item.classList.remove("active");
        const label = item.querySelector(".icon-label");
        if (label) label.classList.remove("active");
      });
      icon.classList.add("active");
      const label = icon.querySelector(".icon-label");
      if (label) label.classList.add("active");
      e.stopPropagation();
    });
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest("#desktop-icon-grid")) {
      desktopIcons.forEach(item => {
        item.classList.remove("active");
        const label = item.querySelector(".icon-label");
        if (label) label.classList.remove("active");
      });
    }
  });

  const submenus = {
    "start-menu-item-programs": "start-menu-programs",
    "start-menu-item-documents": "start-menu-documents",
    "start-menu-item-settings": "start-menu-settings",
    "start-menu-item-search": "start-menu-search",
    "start-menu-programs-accessories": "start-menu-accessories",
    "start-menu-programs-systools": "start-menu-systools",
    "start-menu-programs-startup": "start-menu-startup"
  };
  
  let openSubmenus = [];
  
  Object.entries(submenus).forEach(([triggerId, submenuId]) => {
    const trigger = document.getElementById(triggerId);
    const submenu = document.getElementById(submenuId);
  
    if (trigger && submenu) {
      trigger.addEventListener("mouseenter", () => showSubmenu(trigger, submenu));
      trigger.addEventListener("touchstart", (event) => {
        event.preventDefault();
        showSubmenu(trigger, submenu);
      });
      submenu.addEventListener("mouseenter", () => keepSubmenuOpen(submenu));
    }
  });
  
  function showSubmenu(trigger, submenu) {
    while (openSubmenus.length && !trigger.closest(`#${openSubmenus[openSubmenus.length - 1].id}`)) {
      hideSubmenu(openSubmenus.pop());
    }
  
    submenu.style.display = "block";
    positionSubMenu(trigger, submenu);
    openSubmenus.push(submenu);
  }
  
  function keepSubmenuOpen(submenu) {
    if (!openSubmenus.includes(submenu)) {
      openSubmenus.push(submenu);
    }
  }
  
  function hideSubmenu(submenu) {
    submenu.style.display = "none";
    const index = openSubmenus.indexOf(submenu);
    if (index > -1) {
      openSubmenus.splice(index, 1);
    }
  }
  
  function positionSubMenu(trigger, menu) {
    const triggerRect = trigger.getBoundingClientRect();
    menu.style.position = "absolute";
    menu.style.left = `${triggerRect.right - 2}px`;
    menu.style.top = `${triggerRect.top - 2}px`;
  }
  
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#start-menu")) {
      closeAllSubmenus();
    }
  });
  
  function closeAllSubmenus() {
    while (openSubmenus.length) {
      hideSubmenu(openSubmenus.pop());
    }
  }
});

