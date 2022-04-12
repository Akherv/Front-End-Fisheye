/* eslint-disable no-console */
function mediaFactory(media, name) {
  const {
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
      const imageMedium = image.split('.jpg').slice(0, 1).join();
      return `assets/photographers/${photographerName}/${imageMedium}-medium.jpg`;
    } if (video) {
      const link = video.split('.mp4').slice(0, 1).join();
      const posterLink = `assets/photographers/${photographerName}/${link}.jpg`;
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
    if (image) {
      const mediaContainer = document.createElement('article');
      const imageMedia = document.createElement('img');

      mediaContainer.classList.add('portfolio_mediaContainer');
      // mediaContainer.setAttribute('tabindex', '0');
      imageMedia.setAttribute('src', mediaLink);
      imageMedia.setAttribute('alt', title);
      imageMedia.classList.add('media', 'portfolio_picture');
      imageMedia.setAttribute('tabindex', '0');
      imageMedia.setAttribute('role', 'button');
      // imageMedia.setAttribute('aria-pressed', 'false');
      imageMedia.setAttribute('aria-label', 'ouvrir modal');
      imageMedia.setAttribute('aria-haspopup', 'dialog');

      const h2 = document.createElement('h2');
      h2.textContent = title;

      const portfolioMediaContent = document.createElement('div');
      portfolioMediaContent.classList.add('portfolioMediaContent');
      // portfolioMediaContent.setAttribute('tabindex', '0');
      const p = document.createElement('p');
      const span1 = document.createElement('span');
      span1.classList.add('likesNumber');

      const span2 = document.createElement('span');
      const img = document.createElement('img');
      span1.innerHTML = likes;
      img.setAttribute('src', heart);
      img.setAttribute('alt', 'likes');
      img.setAttribute('data-count', likes);
      if (state) {
        img.setAttribute('data-state', state);
        img.classList.add('heart', 'active');
      } else {
        img.setAttribute('data-state', false);
        img.classList.add('heart');
      }
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-checked', 'false');
      img.setAttribute('aria-label', 'like');

      img.classList.add('heart');

      span2.appendChild(img);
      p.appendChild(span1);
      p.appendChild(span2);
      portfolioMediaContent.appendChild(h2);
      portfolioMediaContent.appendChild(p);
      mediaContainer.appendChild(imageMedia);
      mediaContainer.appendChild(portfolioMediaContent);

      return mediaContainer;
    } if (video) {
      const mediaContainer = document.createElement('article');
      const videoMedia = document.createElement('video');
      const source = document.createElement('source');

      mediaContainer.classList.add('portfolio_mediaContainer');
      // mediaContainer.setAttribute('tabindex', '0');
      videoMedia.classList.add('media', 'portfolio_video');
      videoMedia.setAttribute('poster', mediaLinkPoster.posterLink);
      videoMedia.setAttribute('preload', 'none');
      videoMedia.setAttribute('data-title', media.title);
      // videoMedia.setAttribute('tabindex', '0');
      videoMedia.setAttribute('role', 'button');
      // videoMedia.setAttribute('aria-pressed', 'false');
      videoMedia.setAttribute('aria-label', 'ouvrir modal');
      videoMedia.setAttribute('aria-haspopup', 'dialog');
      source.setAttribute('src', mediaLinkPoster.videoLink);
      source.setAttribute('type', 'video/mp4');

      const h2 = document.createElement('h2');
      h2.textContent = title;

      const portfolioMediaContent = document.createElement('div');
      portfolioMediaContent.classList.add('portfolioMediaContent');
      // portfolioMediaContent.setAttribute('tabindex', '0');
      const p = document.createElement('p');
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      const img = document.createElement('img');
      span1.innerHTML = likes;
      span1.classList.add('likesNumber');
      img.setAttribute('src', heart);
      img.setAttribute('alt', 'likes');
      img.setAttribute('data-count', '');
      if (state) {
        img.setAttribute('data-state', state);
        img.classList.add('heart', 'active');
      } else {
        img.setAttribute('data-state', false);
        img.classList.add('heart');
      }
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-checked', 'false');
      img.setAttribute('aria-label', 'like');

      span2.appendChild(img);
      p.appendChild(span1);
      p.appendChild(span2);
      portfolioMediaContent.appendChild(h2);
      portfolioMediaContent.appendChild(p);
      videoMedia.appendChild(source);
      mediaContainer.appendChild(videoMedia);
      mediaContainer.appendChild(portfolioMediaContent);

      return mediaContainer;
    }
    console.log('error: aucun média');
    return 0;
  }

  return {
    mediaLink,
    getUserMediaDOM,
  };
}
export default mediaFactory;
