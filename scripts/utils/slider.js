function displaySlider() {
  const body = document.querySelector('body');
  const main = document.querySelector('#main');
  const landmarks = document.querySelectorAll('#header a, #main .contact_button, .selection');
  const mediasPortfolio = document.querySelectorAll('.portfolio .media');
  const likesBtn = document.querySelectorAll('.heart');
  const portfolioMediaContainer = document.querySelectorAll('.portfolio_mediaContainer');
  const sliderModal = document.querySelector('#slider_modal');
  const sliderCloseBtn = document.querySelector('#slider_modal .closeBtn');
  const prevBtn = document.querySelector('#prevBtn');
  const mediaContainer = document.querySelector('#mediaContainer');
  const nextBtn = document.querySelector('#nextBtn');

  // create by cloning portofolio datas
  function createMediaDOM(currentIndex) {
    const media = mediasPortfolio[currentIndex];
    const mediaChilds = media.children;
    const mediaTitle = document.querySelector('#mediaTitle');
    const mediaFullsize = (media.src).split('-medium.jpg').join('');

    // if video
    if (mediaChilds.length >= 1) {
      const childClone = media.children[0].cloneNode();
      const parentClone = media.cloneNode();
      parentClone.classList.remove('portfolio_video');
      parentClone.classList.add('mediaModal');
      parentClone.setAttribute('controls', '');
      parentClone.setAttribute('preload', 'auto');
      parentClone.appendChild(childClone);
      mediaContainer.appendChild(parentClone);
      mediaTitle.textContent = media.dataset.title;
    } else { // if img
      const mediaClone = media.cloneNode();
      mediaClone.classList.remove('portfolio_picture');
      mediaClone.classList.add('mediaModal');
      mediaClone.setAttribute('src', `${mediaFullsize}.jpg`);
      mediaContainer.appendChild(mediaClone);
      mediaTitle.textContent = media.alt;
    }
  }

  // remove the media on Slider closing
  function removeSliderDOM() {
    const media = document.querySelectorAll('.mediaModal');
    media.forEach((el) => el.remove());
  }

  // Fire the removeSliderDOM function & Close the slider modal
  function closeSliderModal(idx) {
    removeSliderDOM();

    sliderModal.style.display = 'none';
    sliderCloseBtn.setAttribute('tabindex', '-1');
    sliderModal.removeAttribute('aria-modal');
    sliderModal.setAttribute('hidden', '');

    body.style.overflow = 'auto';

    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('inert');
    });
    likesBtn.forEach((el) => el.setAttribute('tabindex', '0'));
    mediasPortfolio.forEach((el) => el.setAttribute('tabindex', '0'));

    main.style.display = 'block';

    mediasPortfolio[idx].focus();
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
      if ((event.key || event.code) === 'ArrowLeft') {
        decreaseSlideIndex();
      }
      if ((event.key || event.code) === 'ArrowRight') {
        increaseSlideIndex();
      }
    }, true);

    prevBtn.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === 'Enter') {
        decreaseSlideIndex();
      }
    }, true);
    nextBtn.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === 'Enter') {
        increaseSlideIndex();
      }
    }, true);

    window.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === 'Escape') {
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

    body.style.overflow = 'hidden';

    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
    });
    likesBtn.forEach((el) => el.setAttribute('tabindex', '-1'));
    mediasPortfolio.forEach((el) => el.setAttribute('tabindex', '-1'));

    main.style.display = 'none';

    sliderCloseBtn.focus();
  }

  mediasPortfolio.forEach((media, idx) => media.addEventListener('click', (e) => {
    displaySliderModal(e, idx);
  }));

  portfolioMediaContainer.forEach((media, idx) => {
    const currentMediaChild = media.children[0];
    currentMediaChild.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === 'Enter') {
        displaySliderModal(event, idx);
      }
    });
  });

  sliderCloseBtn.addEventListener('click', closeSliderModal);
  sliderCloseBtn.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Enter') {
      closeSliderModal();
    }
  }, true);
}
export default displaySlider;
