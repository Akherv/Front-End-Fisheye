function mediaFactory(media, name) {
  const {
    id,
    title,
    image,
    likes,
    video,
    state,
  } = media;

  const photographerName = name;
  const heart = 'assets/icons/heart.svg';

  function getMediaLink() {
    if (image) {
      const imageSmall = image.split('.jpg').slice(0, 1).join();
      return `assets/photographers/${photographerName}/${imageSmall}-small.jpg`;
    } if (video) {
      const link = video.split('.mp4').slice(0, 1).join();
      const posterLink = `assets/photographers/${photographerName}/${link}-small.jpg`;
      const videoLink = `assets/photographers/${photographerName}/${video}`;
      return {
        videoLink,
        posterLink,
      };
    }
    console.log('error: aucun média');
    return 0;
  }
  const mediaLink = getMediaLink();
  const mediaLinkPoster = getMediaLink();

  function getUserMediaDOM() {
    const mediaWrapper = document.createElement('li');
    const mediaContainer = document.createElement('article');
    mediaContainer.classList.add('portfolio_media-container');
    const imageMedia = document.createElement('img');
    const imageVideoMedia = document.createElement('img');

    if (image) {
      imageMedia.setAttribute('src', mediaLink);
      imageMedia.setAttribute('alt', `${title}, close up view`);
      imageMedia.classList.add('media', 'portfolio_picture');
      imageMedia.setAttribute('tabindex', '0');
      imageMedia.setAttribute('role', 'button');
      imageMedia.setAttribute('aria-haspopup', 'dialog');
      imageMedia.dataset.id = id;
    }
    if (video) {
      imageVideoMedia.setAttribute('src', mediaLinkPoster.posterLink);
      imageVideoMedia.setAttribute('alt', `${title}, close up view`);
      imageVideoMedia.classList.add('media', 'portfolio_video');
      imageVideoMedia.setAttribute('tabindex', '0');
      imageVideoMedia.setAttribute('role', 'button');
      imageVideoMedia.setAttribute('aria-haspopup', 'dialog');
      imageVideoMedia.dataset.id = id;
    }

    const h2 = document.createElement('h2');
    h2.textContent = title;

    const portfolioMediaInfos = document.createElement('div');
    portfolioMediaInfos.classList.add('portfolio_media-informations');
    const p = document.createElement('p');
    const span1 = document.createElement('span');
    span1.classList.add('likesNumber');
    span1.dataset.id = id;

    const span2 = document.createElement('span');
    const img = document.createElement('img');
    span1.innerHTML = likes;
    img.setAttribute('src', heart);
    img.setAttribute('alt', 'likes');
    img.setAttribute('data-count', likes);
    img.setAttribute('aria-label', 'likes');
    if (state) {
      img.setAttribute('data-state', state);
      img.classList.add('heart', 'active');
    } else {
      img.setAttribute('data-state', false);
      img.classList.add('heart');
    }
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'checkbox');
    img.setAttribute('aria-checked', 'false');

    img.classList.add('heart');

    span2.appendChild(img);
    p.appendChild(span1);
    p.appendChild(span2);
    portfolioMediaInfos.appendChild(h2);
    portfolioMediaInfos.appendChild(p);

    if (image) {
      mediaContainer.appendChild(imageMedia);
    }
    if (video) {
      mediaContainer.appendChild(imageVideoMedia);
    }
    mediaContainer.appendChild(portfolioMediaInfos);
    mediaWrapper.appendChild(mediaContainer)
    return mediaWrapper;
  }
  return {
    mediaLink,
    getUserMediaDOM,
  };
}
export default mediaFactory;
