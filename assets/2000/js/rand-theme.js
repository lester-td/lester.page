const themes = [
    "assets/2000/std.css",
    "assets/2000/slate.css",
    "assets/2000/classic.css",
    "assets/2000/lilac.css",
    "assets/2000/spruce.css",
    "assets/2000/pumpkin.css",
    "assets/2000/rose.css",    
];

function applyTheme(themeIndex) {
    const theme = themes[themeIndex];
    const stylesheet = document.getElementById("theme-stylesheet");
    if (stylesheet) {
        stylesheet.setAttribute("href", theme);
    }
}

function getNextThemeIndex() {
    const currentIndex = parseInt(localStorage.getItem("currentThemeIndex") || 0);
    return (currentIndex + 1) % themes.length;
}

function swapTheme() {
    const nextThemeIndex = getNextThemeIndex();
    localStorage.setItem("currentThemeIndex", nextThemeIndex);
    applyTheme(nextThemeIndex);
}

swapTheme();
