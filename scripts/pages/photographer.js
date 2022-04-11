/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import mediaFactory from '../factories/media-factory.js';
import displaySlider from '../utils/slider.js';

async function initPhotographerPage() {
  let filterState = 'popularite';

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

    // filter
    if (state === 'popularite') {
      portfolio.sort((a, b) => b.likes - a.likes);
      return portfolio;
    } if (state === 'date') {
      portfolio.sort((a, b) => new Date(a.date) - new Date(b.date));
      return portfolio;
    } if (state === 'title') {
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
    const {
      name,
      city,
      country,
      tagline,
      price,
      portrait,
    } = data;

    const heart = 'assets/icons/heart-black.svg';
    const picture = `assets/photographers/Photographers_ID/${portrait}`;

    const photographHeader = document.querySelector('.photograph-header');
    const presentationDiv = document.querySelector('.photograph-header__presentation');
    const presentationTextDiv = document.querySelector('.presentationTextDiv');
    const informationDiv = document.querySelector('.informationdiv');
    const informationLikes = document.querySelector('.informationLikes');

    const h1 = `<h1>${name}</h1>`;
    const p1 = `<p>${city}, ${country}</p>`;
    const p2 = `<p>${tagline}</p>`;
    const img = `<img class="photograph-header__picture" src="${picture}" alt="${name}"></img>`;

    const informationLikesSpan1 = '<span class="informationLikesNumber"></span>';
    const imgHeart = `<img class="informationDiv_imgHeart" src="${heart}" alt="likes"></img>`;
    const informationPrice = `<span class="informationDiv__price">${price}€/jour</span>`;

    presentationDiv.insertAdjacentHTML('afterbegin', h1);

    presentationTextDiv.insertAdjacentHTML('afterend', p1);
    presentationTextDiv.insertAdjacentHTML('beforeend', p2);

    photographHeader.insertAdjacentHTML('beforeend', img);

    informationLikes.insertAdjacentHTML('beforeend', informationLikesSpan1);
    informationLikes.insertAdjacentHTML('beforeend', imgHeart);

    informationDiv.insertAdjacentHTML('beforeend', informationPrice);
  }
  displayBio(photographer);

  // create & display portofolio datas with the medias factory
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

  function initContactModal(name) {
    const modalHeader = document.querySelector('#modalHeader');
    const span = document.createElement('span');
    span.innerHTML = `<br>${name}`;
    modalHeader.appendChild(span);
  }
  initContactModal(photographerName, photographerId);

  function initCounter(medias) {
    const likesMedia = document.querySelectorAll('.portfolioMediaContent .heart');
    const likesNumbers = document.querySelectorAll('.likesNumber');
    const informationLikesNumber = document.querySelector('.informationLikesNumber');

    // change sum variable
    function refreshGlobalLikesCounter() {
      let sum = 0;
      const arrItemsUpdated = JSON.parse(localStorage.getItem('photographersMedias'));
      const currentsItemUpdated = arrItemsUpdated.filter((el) => el.photographerId === +photographerId);
      currentsItemUpdated.forEach((media) => sum += media.likes);
      informationLikesNumber.textContent = `${sum}`;
      return sum;
    }
    refreshGlobalLikesCounter();

    function likeCheck() {
      function likesChangeState(media, idx) {
        const localIdx = medias[idx].id;
        const arrItems = JSON.parse(localStorage.getItem('photographersMedias'));
        const currentItem = arrItems.filter((el) => el.id === localIdx);

        const dataState = media.getAttribute('data-state');
        const { likes } = currentItem[0];

        if (dataState === 'true') {
          media.classList.remove('active');
          media.setAttribute('data-state', false);
          media.setAttribute('data-count', `${likes - 1}`);
          likesNumbers[idx].textContent = likes - 1;
          currentItem[0].likes -= 1;
          currentItem[0].state = false;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems));

          refreshGlobalLikesCounter();
        } else {
          media.classList.add('active');
          media.setAttribute('data-state', true);
          media.setAttribute('data-count', `${likes + 1}`);
          likesNumbers[idx].textContent = likes + 1;
          currentItem[0].likes += 1;
          currentItem[0].state = true;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems));

          refreshGlobalLikesCounter();
        }
      }
      likesMedia.forEach((media, idx) => media.addEventListener('click', () => { likesChangeState(media, idx); }));
      // accessibility
      likesMedia.forEach((media, idx) => media.addEventListener('keydown', (event) => {
        if ((event.key || event.code) === 'Enter') {
          likesChangeState(media, idx);
        }
      }));
      const portfolioMediaContent = document.querySelectorAll('.portfolioMediaContent');
      // accessibility
      portfolioMediaContent.forEach((media, idx) => media.addEventListener('keydown', (event) => {
        if ((event.key || event.code) === 'Enter') {
          likesChangeState(media, idx);
        }
      }));
    }
    likeCheck(medias);
  }
  initCounter(photographerMedias, photographerId);

  // Change the filterstate according to the change event & reload the creation of the medias
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
      }
      if ((event.key || event.code) === 'Escape') {
        const portfolioFocus = document.querySelectorAll('.media');
        el.parentElement.classList.remove('open');
        closeSelect();
        portfolioFocus[0].focus();
      }
    }, true));
  }
  checkStateFilterBtn();

  displaySlider(photographerMedias);
}
initPhotographerPage();

// select filter re-created for styling purpose
function openSelect() {
  document.querySelectorAll('.new-select .new-option').forEach((el) => {
    el.classList.add('reveal');
    el.style.boxShadow = '0 1px 1px rgba(0,0,0,0.1)';
    el.style.position = 'unset';
    el.parentElement.overflow = 'visible';

    const x = document.querySelector('.selection.open p span').textContent;
    if (el.textContent === x) {
      el.style.display = 'none';
    }
  });
}

function closeSelect() {
  document.querySelectorAll('.new-select .new-option').forEach((el) => {
    el.previousElementSibling.classList.remove('open');
    el.classList.remove('reveal');
    el.style.position = 'absolute';
    el.parentElement.overflow = '-moz-hidden-unscrollable';
  });
}

// Initialisation
if (document.querySelector('.old-select option[selected]').length === 1) {
  document.querySelector('.selection p span').innerHTML = document.querySelector('.old-select option[selected]').innerHTML;
} else {
  document.querySelector('.selection p span').innerHTML = document.querySelector('.old-select option:first-child').innerHTML;
}

document.querySelectorAll('.old-select option').forEach((el) => {
  const newValue = el.value;
  const newHTML = el.innerHTML;
  document.querySelector('.new-select').innerHTML += `<div class="new-option" data-value="${newValue}" role="listbox" tabindex="0"><p>${newHTML}</p></div>`;
});

closeSelect();

// Ouverture / Fermeture
const selection = document.querySelector('.selection');
selection.addEventListener('click', function () {
  this.classList.toggle('open');
  if (this.classList.contains('open') === true) { openSelect(); } else { closeSelect(); }
});

selection.addEventListener('keydown', (event) => {
  if ((event.key || event.code) === 'Enter') {
    selection.classList.toggle('open');
    if (selection.classList.contains('open') === true) { openSelect(); } else { closeSelect(); }
  }
  if ((event.key || event.code) === 'Escape') {
    const portfolioFocus = document.querySelectorAll('.media');
    selection.classList.remove('open');
    closeSelect();
    portfolioFocus[0].focus();
  }
}, true);

// close filter on click outside
const ignoreClickOnMeElement = document.querySelector('.new-select');

document.addEventListener('click', (e) => {
  const isClickInsideElement = ignoreClickOnMeElement.contains(e.target);
  if (!isClickInsideElement) {
    closeSelect();
  }
});

// Selection
document.querySelectorAll('.new-option').forEach((el) => el.addEventListener('click', function () {
  const newValue = this.dataset.value;

  // Selection New Select
  document.querySelectorAll('.selection p span').innerHTML = this.querySelector('p').innerHTML;

  // Selection Old Select
  document.querySelector('.old-select option[selected]').removeAttribute('selected');
  document.querySelector(`.old-select option[value="${newValue}"]`).setAttribute('selected', '');

  // change textContent
  document.querySelector('.selection.open p span').textContent = this.textContent;

  // hide from list selected textContent
  this.style.display = 'none';
  const x = document.querySelectorAll('.new-option');
  const z = [...x].filter((elt) => elt.dataset.value !== newValue);
  z.forEach((elt) => elt.style.display = 'block');

  // style case : last element Date
  // if(this)
}));

// accessibility exit photographer page
const header = document.querySelector('header');
header.addEventListener('keydown', (event) => {
  if ((event.key || event.code) === 'Enter') {
    header.children[0].focus();
  }
}, true);
