document.addEventListener("DOMContentLoaded", () => {
  const galleryBlocks = document.querySelectorAll(".gallery");

  galleryBlocks.forEach(gallery => {
    const classList = Array.from(gallery.classList);
    const galleryName = classList.filter(c => c !== "gallery").join("-");

    if (!galleryName) {
      console.warn("No gallery name found in:", classList);
      return;
    }

    fetch(`assets/data/${galleryName}.json`)
      .then(res => res.json())
      .then(images => {
        images.forEach(img => {
          const a = document.createElement("a");
          a.href = `assets/images/${galleryName.replace(/-/g, "/")}/${img}`;
          a.setAttribute("data-fancybox", galleryName);

          const image = document.createElement("img");
          image.src = a.href;
          image.alt = "";

          a.appendChild(image);
          gallery.appendChild(a);
        });
      })
      .catch(err => {
        console.error(`Failed to load ${galleryName}.json`, err);
      });
  });
});
