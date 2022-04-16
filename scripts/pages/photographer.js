import bioFactory from '../factories/bio-factory.js';
import mediaFactory from '../factories/media-factory.js';
import displayContactModal from '../utils/contactForm.js';
import customSelect from '../utils/customSelect.js';
import displaySlider from '../utils/slider.js';

async function initPhotographerPage() {
  let filterState = 'popularite';

  // check if there are already datas on the local storage before re-fetching if necessary
  if (!localStorage.getItem('photographersBio') && !localStorage.getItem('photographersMedias')) {
    const myHeaders = new Headers();

    const myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
    };

    const url = './data/photographers.json';

    try {
      const response = await fetch(url, myInit);
      const datas = await response.json();
      console.log(datas);

      localStorage.setItem('photographersBio', JSON.stringify(datas.photographers));
      localStorage.setItem('photographersMedias', JSON.stringify(datas.media));
    } catch (error) {
      console.log('Fetch error: ', error);
    }
  }

  // get the photographer ID from URL
  // eslint-disable-next-line no-restricted-globals
  const photographerId = new URL(location.href).searchParams.get('id');

  // get photographer bio datas from localStorage
  function getPhotographerBio(id) {
    const photographersBio = JSON.parse(localStorage.getItem('photographersBio'));
    const userBio = photographersBio.filter((el) => el.id === +id);
    return userBio;
  }
  const photographerBio = await getPhotographerBio(photographerId);
  const photographer = photographerBio[0];
  const photographerName = photographerBio[0].name;

  // get portfolio datas from localStorage & add filter
  function getPhotographerMedias(id, state) {
    const photographersMedias = JSON.parse(localStorage.getItem('photographersMedias'));
    const portfolio = photographersMedias.filter((el) => el.photographerId === +id);

    // filter portfolio datas by popularity/date/title
    if (state === 'popularite') {
      portfolio.sort((a, b) => b.likes - a.likes);
      return portfolio;
    }
    if (state === 'date') {
      portfolio.sort((a, b) => new Date(a.date) - new Date(b.date));
      return portfolio;
    }
    if (state === 'title') {
      portfolio.sort(
        (a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        },
      );
      return portfolio;
    }
    return portfolio;
  }
  const photographerMedias = await getPhotographerMedias(photographerId, filterState);

  // create & display bio datas
  function displayBio(data) {
    bioFactory(data);
  }
  displayBio(photographer);

  // create & display portofolio datas with the media factory
  function displayPortfolio(medias, name) {
    const main = document.querySelector('main');
    if (main.querySelector('.portfolio') != null) {
      main.lastChild.remove();
    }
    const portfolioDiv = document.createElement('div');
    portfolioDiv.classList.add('portfolio');

    medias.forEach((media) => {
      const mediaModel = mediaFactory(media, name);
      const userMediaDOM = mediaModel.getUserMediaDOM();
      portfolioDiv.appendChild(userMediaDOM);
    });
    main.appendChild(portfolioDiv);
  }
  displayPortfolio(photographerMedias, photographerName);

  // create & initialize likes counters
  function initCounter(medias) {
    const likesMedia = document.querySelectorAll('.portfolioMediaContent .heart');
    const likesNumbers = document.querySelectorAll('.likesNumber');
    const informationLikesNumber = document.querySelector('.informationLikesNumber');

    // refresh global sum variable
    function refreshGlobalLikesCounter() {
      let sum = 0;
      const arrElUpdated = JSON.parse(localStorage.getItem('photographersMedias'));
      const currentsElUpdated = arrElUpdated.filter((el) => el.photographerId === +photographerId);
      currentsElUpdated.forEach((media) => sum += media.likes);
      informationLikesNumber.textContent = `${sum}`;
      return sum;
    }
    refreshGlobalLikesCounter();

    // handle local likes variable & fire the global refresh function at the end
    function likeCheck() {
      function likesChangeState(media, idx) {
        const x = document.querySelectorAll('.portfolio_mediaContainer');
        const localIdx = x[idx].firstChild.dataset.id;
        const arrItems = JSON.parse(localStorage.getItem('photographersMedias'));
        const currentItem = arrItems.filter((el) => el.id === +localIdx);
        
        const dataState = media.getAttribute('data-state');
        const {
          likes,
        } = currentItem[0];

        if (dataState === 'true') {
          media.classList.remove('active');
          media.setAttribute('data-state', false);
          media.setAttribute('data-count', `${likes - 1}`);
          likesNumbers[idx].textContent = likes - 1;
          likesNumbers[idx].setAttribute('aria-pressed', 'false');
          currentItem[0].likes -= 1;
          currentItem[0].state = false;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems));

          refreshGlobalLikesCounter();
        } else {
          media.classList.add('active');
          media.setAttribute('data-state', true);
          media.setAttribute('data-count', `${likes + 1}`);
          likesNumbers[idx].textContent = likes + 1;
          likesNumbers[idx].setAttribute('aria-pressed', 'true');
          currentItem[0].likes += 1;
          currentItem[0].state = true;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems));

          refreshGlobalLikesCounter();
        }
      }
      likesMedia.forEach((media, idx) => media.addEventListener('click', () => {
        likesChangeState(media, idx);
      }));

      // accessibility
      likesMedia.forEach((media, idx) => media.addEventListener('keydown', (event) => {
        if ((event.key || event.code) === 'Enter') {
          likesChangeState(media, idx);
        }
      }));
    }
    likeCheck(medias);
  }
  initCounter(photographerMedias, photographerId);

  // reload the creation of the portfolio according to the filterstate
  function checkStateFilterBtn() {
    function sortMedia(el) {
      const elt = el.dataset.value;
      if (elt === 'date') {
        filterState = 'date';
      }
      if (elt === 'title') {
        filterState = 'title';
      }
      if (elt === 'popularite') {
        filterState = 'popularite';
      }
      const photographerMediasFiltered = getPhotographerMedias(photographerId, filterState);
      displayPortfolio(photographerMediasFiltered, photographerName);
      displaySlider(photographerMedias);
      initCounter(photographerMedias, photographerId);
    }
    const filterBtn = document.querySelectorAll('.new-option');
    filterBtn.forEach((el) => el.addEventListener('click', () => {
      sortMedia(el);
    }));
    // accessibility
    filterBtn.forEach((el) => el.addEventListener('keydown', (event) => {
      if ((event.key || event.code) === 'Enter') {
        sortMedia(el);
        [...el.parentElement.children].forEach((elt) => {
          if (elt.getAttribute('aria-selected') === 'true') {
            elt.setAttribute('aria-selected', 'false');
          }
        });
        el.setAttribute('aria-selected', 'true');
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
      }
      if ((event.key || event.code) === 'Escape') {
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
      }
    }, true));
  }
  checkStateFilterBtn();

  // create & display the contact modal
  function initContactModal(name) {
    const modalHeader = document.querySelector('#modalHeader');
    const span = document.createElement('span');
    span.innerHTML = name;
    modalHeader.appendChild(span);
  }
  initContactModal(photographerName, photographerId);

  displayContactModal();

  displaySlider(photographerMedias);
}
initPhotographerPage();

// filter re-created for styling purpose
customSelect();
