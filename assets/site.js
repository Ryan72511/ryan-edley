const siteConfig = fetch("content.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Content could not be loaded (${response.status})`);
    return response.json();
  });

function mountReel(reel) {
  const facade = document.querySelector("#reel-facade");
  const poster = document.querySelector("#reel-poster");
  const detail = document.querySelector("#reel-detail");
  const button = facade?.querySelector(".play-button");
  if (!facade || !poster || !button) return;

  facade.dataset.videoId = reel.videoId;
  facade.dataset.videoTitle = reel.title;
  poster.src = reel.thumbnail;
  poster.alt = `Frame from ${reel.title}`;
  button.setAttribute("aria-label", `Play ${reel.title}`);
  document.querySelector(".video-facade__label").firstChild.textContent = reel.title + " ";
  document.querySelector(".reel-caption").textContent = reel.caption;
  detail.textContent = `${reel.published} · ${reel.duration}`;

  button.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(reel.videoId)}?autoplay=1&rel=0`;
    frame.title = reel.title;
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.loading = "eager";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    facade.replaceChildren(frame);
    frame.focus();
  }, { once: true });
}

function mountContact(contact) {
  const placeholder = document.querySelector("#contact-placeholder");
  if (!placeholder) return;
  if (contact.email) {
    const link = document.createElement("a");
    link.className = "contact-email";
    link.href = `mailto:${contact.email}`;
    link.textContent = contact.email;
    placeholder.replaceChildren(link);
  } else {
    placeholder.textContent = contact.placeholder;
  }
}

siteConfig
  .then((config) => {
    mountReel(config.reel);
    mountContact(config.contact);
    document.querySelectorAll("[data-placeholder]").forEach((item) => {
      const placeholder = config.placeholders[item.dataset.placeholder];
      if (placeholder) item.setAttribute("aria-label", placeholder);
    });
    document.documentElement.dataset.ready = "true";
  })
  .catch((error) => {
    console.error(error);
    document.documentElement.dataset.contentError = "true";
  });
