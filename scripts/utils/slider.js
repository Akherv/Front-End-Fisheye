function displaySlider() {
  const body = document.querySelector('body');
  const main = document.querySelector('#main');
  const landmarks = document.querySelectorAll('.header, #header a, #main .contact_button, .selection, .new-option, .media, .heart');
  const mediasPortfolio = document.querySelectorAll('.portfolio .media');
  const mediaContent = document.querySelector('#slider_modal .content');
  const portfolioMediaContainer = document.querySelectorAll('.portfolio_media-container');
  const sliderModal = document.querySelector('#slider_modal');
  const sliderCloseBtn = document.querySelector('#slider_modal .closeBtn');
  const prevBtn = document.querySelector('#prevBtn');
  const mediaContainer = document.querySelector('#mediaContainer');
  const nextBtn = document.querySelector('#nextBtn');
  // selection to keep focus inside modal
  const  focusableElements =
    'img[role="button"], img, video, [tabindex]:not([tabindex="-1"])';
  const firstFocusableElement = sliderModal.querySelectorAll(focusableElements)[0];
  const focusableContent = sliderModal.querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  // create by cloning portofolio datas
  function createMediaDOM(currentIndex) {
    const media = mediasPortfolio[currentIndex];
    const mediaTitle = document.querySelector('#mediaTitle');
    const mediaFullsize = (media.src).split('-small.jpg').join('');
    const mediavideo = (media.src).split('-small.jpg').join('');

    // if video
    if (media.classList.contains('portfolio_video')) {
      const videoMedia = document.createElement('video');
      const source = document.createElement('source');

      videoMedia.classList.add('media', 'portfolio_video');
      videoMedia.setAttribute('poster', media.src);
      videoMedia.classList.add('mediaModal');
      videoMedia.setAttribute('controls', '');
      videoMedia.setAttribute('preload', 'none');
      videoMedia.setAttribute('tabindex', '0');
      videoMedia.removeAttribute('role');
      videoMedia.setAttribute('aria-label', media.alt);
      videoMedia.removeAttribute('aria-haspopup');
      videoMedia.dataset.id = currentIndex;
      source.setAttribute('src', `${mediavideo}.mp4`);
      source.setAttribute('type', 'video/mp4');
      source.setAttribute('tabindex', '0');
      videoMedia.appendChild(source);
      mediaContainer.insertBefore(videoMedia, mediaTitle);
      mediaTitle.textContent = media.alt;
      mediaContent.setAttribute('aria-label', 'video closeup view')
    } else { // if img
      const mediaClone = media.cloneNode();
      mediaClone.classList.remove('portfolio_picture');
      mediaClone.classList.add('mediaModal');
      mediaClone.setAttribute('src', `${mediaFullsize}-medium.jpg`);
      mediaClone.removeAttribute('role');
      mediaClone.setAttribute('aria-label', media.alt);
      mediaClone.setAttribute('tabindex', '-1');
      mediaClone.removeAttribute('aria-haspopup');
      mediaClone.dataset.id = currentIndex;
      mediaContainer.insertBefore(mediaClone, mediaTitle);
      mediaTitle.textContent = media.alt;
      mediaContent.setAttribute('aria-label', 'image closeup view')
    }
  }

  // remove the media on Slider closing
  function removeSliderDOM() {
    const media = document.querySelectorAll('.mediaModal');
    media.forEach((el) => el.remove());
  }

  // Fire the removeSliderDOM function & Close the slider modal
  function closeSliderModal() {
    removeSliderDOM();

    sliderModal.style.display = 'none';
    sliderCloseBtn.setAttribute('tabindex', '-1');
    sliderModal.removeAttribute('aria-modal');
    sliderModal.setAttribute('hidden', '');

    body.style.overflow = 'auto';

    landmarks.forEach((el) => {
      console.log(el.classList)
      if (el.classList.contains('header')) {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', '0');
      }
      el.removeAttribute('aria-hidden');
      el.removeAttribute('inert');
    });

    main.style.display = 'block';
    const mediaCurrentID = sliderModal.dataset.id;
    mediasPortfolio[mediaCurrentID].focus();
  }

  // add the media btn navigation functionality
  function MediaNavigation(index) {
    let currentIndex = index;
    function decreaseSlideIndex() {
      if (currentIndex > 0) {
        removeSliderDOM(currentIndex);
        currentIndex -= 1;
        createMediaDOM(currentIndex);
      }
    }

    function increaseSlideIndex() {
      if (currentIndex < mediasPortfolio.length - 1) {
        removeSliderDOM(currentIndex);
        currentIndex += 1;
        createMediaDOM(currentIndex);
      }
    }

    prevBtn.addEventListener('click', decreaseSlideIndex);
    nextBtn.addEventListener('click', increaseSlideIndex);

    window.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === ('ArrowLeft' || 37)) {
        decreaseSlideIndex();
      }
      if ((event.key || event.code) === ('ArrowRight' || 39)) {
        increaseSlideIndex();
      }
    }, true);

    prevBtn.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === ('Enter' || 13)) {
        decreaseSlideIndex();
      }
    }, true);
    nextBtn.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === ('Enter' || 13)) {
        increaseSlideIndex();
      }
    }, true);

    window.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === ('Escape' || 27)) {
        closeSliderModal(currentIndex);
      }
    }, true);
  }

  // Check the currentIndex of the ta& display the slider modal
  function displaySliderModal(e, idx) {
    const currentIndex = idx;

    createMediaDOM(currentIndex);
    MediaNavigation(currentIndex);

    sliderModal.style.display = 'block';
    sliderCloseBtn.setAttribute('tabindex', '0');
    sliderModal.setAttribute('aria-modal', 'true');
    sliderModal.removeAttribute('hidden');
    sliderModal.dataset.id = currentIndex;

    body.style.overflow = 'hidden';

    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
    });

    main.style.display = 'none';

    sliderCloseBtn.focus();
  }

  // listeners
  mediasPortfolio.forEach((media, idx) => media.addEventListener('click', (e) => {
    displaySliderModal(e, idx);
  }));

  portfolioMediaContainer.forEach((media, idx) => {
    const currentMediaChild = media.children[0];
    currentMediaChild.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === ('Enter' || 13)) {
        displaySliderModal(event, idx);
      }
    });
  });

  sliderCloseBtn.addEventListener('click', closeSliderModal);
  sliderCloseBtn.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === ('Enter' || 13)) {
      closeSliderModal();
    }
  }, true);

    // keep focus inside the slider modal
    document.addEventListener('keydown', function(e) {
      let isTabPressed = e.key === 'Tab' || e.code === 9;
    
      if (!isTabPressed) {
        return;
      }
    
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); 
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus(); 
          e.preventDefault();
        }
      }
    });
}
export default displaySlider;
