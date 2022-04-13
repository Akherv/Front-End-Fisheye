/* eslint-disable no-use-before-define */
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
          console.log('1');
          media.classList.remove('active');
          media.setAttribute('data-state', false);
          media.setAttribute('data-count', `${likes - 1}`);
          likesNumbers[idx].textContent = likes - 1;
          currentItem[0].likes -= 1;
          currentItem[0].state = false;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems));

          refreshGlobalLikesCounter();
        } else {
          console.log('2');
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
        [...el.parentElement.children].forEach((elt) => {
          if (elt.getAttribute('aria-selected') === 'true') {
            elt.setAttribute('aria-selected', 'false');
          }
        });
        const portfolioFocus = document.querySelectorAll('.media');
        el.setAttribute('aria-selected', 'true');
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
        closeSelect(el);
        portfolioFocus[0].focus();
      }
      if ((event.key || event.code) === 'Escape') {
        const portfolioFocus = document.querySelectorAll('.media');
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
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
function customSelect() {
  function openSelect() {
    const mediasPortfolioBtn = document.querySelectorAll('.media');
    const x = document.querySelector('.selection.open p span').textContent;
    document.querySelector('.selection.open p span').style.display = 'none';

    document.querySelectorAll('.new-select .new-option').forEach((el) => {
      el.classList.add('reveal');
      el.style.position = 'unset';
      el.parentElement.overflow = 'visible';
      mediasPortfolioBtn.forEach((elt) => elt.setAttribute('tabindex', '-1'));

      if ((el.textContent).toLowerCase() === x.toLowerCase()) {
        el.style.position = 'absolute';
        el.style.top = '0';
        // const elBefore = document.querySelector('::before');
        el.setAttribute('tabindex', '-1');
        if ((el.nextElementSibling != null) && (el.nextElementSibling.style.display !== 'none')) {
          // el.nextElementSibling.setAttribute('tabindex', '0');
          el.nextElementSibling.focus();
        } else {
          const firstEl = document.querySelectorAll('.new-option')[0];
          // firstEl.setAttribute('tabindex', 0);
          el.setAttribute('aria-selected', 'true');
          firstEl.focus();
        }
      }
    });
  }

  function closeSelect(elt) {
    const mediasPortfolioBtn = document.querySelectorAll('.media');
    document.querySelector('.selection p span').style.display = 'block';

    if (elt) {
      document.querySelector('.selection p span').innerHTML = elt.textContent;
      document.querySelector('.new-option').setAttribute('tabindex', '-1');
    }
    document.querySelectorAll('.new-select .new-option').forEach((el) => {
      el.previousElementSibling.classList.remove('open');
      el.classList.remove('reveal');
      el.style.position = 'absolute';
      el.parentElement.overflow = '-moz-hidden-unscrollable';
      el.parentElement.setAttribute('aria-expanded', 'false');
      el.setAttribute('tabindex', '-1');
      document.querySelector('.new-option').setAttribute('tabindex', '-1');
      // mediasPortfolioBtn.forEach((element) => element.setAttribute('tabindex', '0'));
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
    document.querySelector('.new-select').innerHTML += `<div class="new-option" data-value="${newValue}" role="listbox" aria-selected="false" tabindex="-1"><p>${newHTML}</p></div>`;
    if (newValue === 'popularite') {
      document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');
    }
  });

  closeSelect();

  // Ouverture / Fermeture
  const selection = document.querySelector('.selection');
  selection.addEventListener('click', function () {
    this.classList.toggle('open');
    if (this.classList.contains('open') === true) {
      openSelect();
      selection.setAttribute('aria-expanded', 'true');
    } else { closeSelect(); selection.setAttribute('aria-expanded', 'false'); }
  });

  selection.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Enter') {
      selection.classList.toggle('open');
      if (selection.classList.contains('open') === true) { openSelect(); selection.setAttribute('aria-expanded', 'true'); } else { closeSelect(); selection.setAttribute('aria-expanded', 'false'); }
    }
    if ((event.key || event.code) === 'Escape') {
      const portfolioFocus = document.querySelectorAll('.media');
      closeSelect();
      selection.classList.remove('open');
      portfolioFocus[0].focus();
    }
    if ((event.key || event.code) === 'tab') {
      if (e.shiftKey) {
        e.preventDefault();
        const contactModalBtn = document.querySelector('.photograph-header .contact_button');
        contactModalBtn.focus();
      }
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
    document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
    document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');
    document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');

    // Selection Old Select
    document.querySelector('.old-select option[selected]').removeAttribute('selected');
    document.querySelector(`.old-select option[value="${newValue}"]`).setAttribute('selected', '');

    // change textContent
    document.querySelector('.selection.open p span').textContent = this.textContent;
    this.setAttribute('aria-selected', 'true');
    // el.setAttribute('tabindex', '0');

    // hide from list selected textContent
    // this.style.display = 'none';
    this.style.position = 'absolute';
    this.style.top = '0';
    const x = document.querySelectorAll('.new-option');
    const z = [...x].filter((elt) => elt.dataset.value !== newValue);
    z.forEach((elt) => {
      // elt.style.display = 'block';
      elt.style.position = 'static';
    });
    closeSelect();

    // style case : last element Date
    // if(this)
  }));

  document.querySelectorAll('.new-option').forEach((el) => el.addEventListener('keydown', (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      el.setAttribute('tabindex', -1);
      document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
      document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');

      if ((el.nextElementSibling != null) && (el.nextElementSibling.style.display !== 'none')) {
        const nextEl = el.nextElementSibling;
        // nextEl.setAttribute('tabindex', 0);
        el.setAttribute('aria-selected', 'true');
        nextEl.focus();
      } else {
        const firstEl = document.querySelectorAll('.new-option')[0];
        // firstEl.setAttribute('tabindex', 0);
        el.setAttribute('aria-selected', 'true');
        firstEl.focus();
      }

      if (e.shiftKey) {
        e.preventDefault();
        el.setAttribute('tabindex', -1);
        document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
        document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');
        if (el.previousElementSibling.classList.contains('selection')) {
          const lastEl = document.querySelectorAll('.new-option')[2];
          // lastEl.setAttribute('tabindex', 0);
          el.setAttribute('aria-selected', 'true');
          lastEl.focus();
        } else {
          const prevEl = el.previousElementSibling;
          // prevEl.setAttribute('tabindex', 0);
          el.setAttribute('aria-selected', 'true');
          prevEl.focus();
        }
      }
    }
  }));
}

customSelect();

// accessibility exit photographer page
// const header = document.querySelector('header');
// header.addEventListener('keydown', (event) => {
//   if ((event.key || event.code) === 'Enter') {
//     header.children[0].focus();
//   }
// }, true);
