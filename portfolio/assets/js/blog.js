document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-container");

  fetch("assets/data/posts.json")
    .then(res => res.json())
    .then(posts => {
      if (!posts.length) {
        container.innerHTML = "<p>No blog posts found.</p>";
        return;
      }

      const promises = posts.map((post, index) =>
        fetch(`assets/posts/${post.file}`)
          .then(res => res.text())
          .then(md => {
            const groupName = `post-${index}`;
            const isGrid = md.includes("<!-- grid -->");
            md = md.replace("<!-- grid -->", "");

            const section = document.createElement("section");
            section.classList.add("blog-post");

            const bodyDiv = document.createElement("div");
            bodyDiv.classList.add("blog-body");
            bodyDiv.innerHTML = marked.parse(md);

            const galleryDiv = document.createElement("div");
            if (isGrid) galleryDiv.classList.add("blog-grid-gallery");

            bodyDiv.querySelectorAll("img").forEach(img => {
              const src = img.getAttribute("src");
              const wrapper = document.createElement("a");
              wrapper.href = src.startsWith("http") || src.startsWith("/")
                ? src
                : `/portfolio/${src}`;
              wrapper.setAttribute("data-fancybox", groupName);

              img.replaceWith(wrapper);
              wrapper.appendChild(img);

              if (isGrid) {
                galleryDiv.appendChild(wrapper);
              } else {
                bodyDiv.appendChild(wrapper);
              }
            });

            section.appendChild(bodyDiv);
            if (isGrid) section.appendChild(galleryDiv);
            section.insertAdjacentHTML("beforeend", "<hr />");

            return section;
          })
          .catch(err => {
            console.error(`Failed to load ${post.file}`, err);
            return null;
          })
      );

      Promise.all(promises).then(sections => {
        sections.forEach(section => {
          if (section) container.appendChild(section);
        });
      });
    })
    .catch(err => {
      container.innerHTML = "<p>Error loading blog.</p>";
      console.error(err);
    });
});
