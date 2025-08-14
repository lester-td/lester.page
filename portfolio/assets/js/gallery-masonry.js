document.addEventListener("DOMContentLoaded", () => {
  const galleryBlocks = document.querySelectorAll(".gallery");

  galleryBlocks.forEach(gallery => {
    // Get all class names excluding "gallery"
    const classList = Array.from(gallery.classList).filter(c => c !== "gallery");

    if (classList.length === 0) {
      console.warn("No gallery name found for block:", gallery);
      return;
    }

    // Construct gallery name for .json and image path, e.g. "portraits-jane"
    const galleryName = classList.join("-");
    const galleryPath = classList.join("/");

    fetch(`assets/data/${galleryName}.json`)
      .then(res => res.json())
      .then(images => {
        const fragment = document.createDocumentFragment();

        images.forEach(img => {
          const a = document.createElement("a");
          a.href = `assets/images/${galleryPath}/${img}`;
          a.setAttribute("data-fancybox", galleryName);

          const image = document.createElement("img");
          image.src = `assets/images/${galleryPath}/${img}`;
          image.alt = "";

          a.appendChild(image);
          fragment.appendChild(a);
        });

        gallery.appendChild(fragment);

        // Wait for all images before initializing Masonry
        imagesLoaded(gallery, () => {
          new Masonry(gallery, {
            itemSelector: "a",
            columnWidth: "a",
            percentPosition: true,
            gutter: 8
          });
        });
      })
      .catch(err => {
        console.error(`Failed to load assets/data/${galleryName}.json`, err);
      });
  });
});
