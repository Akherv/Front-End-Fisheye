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

  function initContactModal() {
    const modalHeader = document.querySelector('#modalHeader');
    const span = document.createElement('span');
    span.innerHTML = `<br>${photographerName}`;
    modalHeader.appendChild(span);
  }
  initContactModal(photographerName);

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
      likesMedia.forEach((media, idx) => media.addEventListener('click', () => {
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
      }));
    }
    likeCheck(medias);
  }
  initCounter(photographerMedias, photographerId);

  // Change the filterstate according to the change event & reload the creation of the medias
  function checkStateFilterBtn() {
    function sortMedia(e) {
      const elt = e.target.value;
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
    const filterBtn = document.querySelector('#filter');
    filterBtn.addEventListener('change', sortMedia);
  }
  checkStateFilterBtn();

  displaySlider(photographerMedias);
}
initPhotographerPage();

// function getChildren(n, skipMe) {
//   const r = [];
//   for (; n; n = n.nextSibling) { if (n.nodeType == 1 && n != skipMe) r.push(n); }
//   return r;
// }

// function getSiblings(n) {
//   return getChildren(n.parentNode.firstChild, n);
// }

// const DropDown = (function () {
//   let
//     dropdown;
//   let parent;
//   let options;

//   const _init = function () {
//     dropdown = document.querySelector('select');
//     parent = dropdown.parentNode;
//     options = Array.from(dropdown.options);

//     _createDropdown();
//     _handleEvents();
//   };

//   const _renderList = function (opts) {
//     return `
//       <ul class="e-dropdown__list is-hidden">
//         ${opts.map((opt) => `
//           <li data-value="${opt.value}">${opt.text}</li>
//         `).join('')}
//       </ul>
//     `;
//   };

//   const _createDropdown = function () {
//     const newDropdown = `
//     <div class="e-dropdown">
//       <button class="e-dropdown__btn">
//         <div>popularite</div>
//       </button>
//       ${_renderList(options)}
//     </div>
//   `;
//     parent.innerHTML += newDropdown;
//   };

//   const _handleEvents = function () {
//     const apDropdown = document.querySelector('.e-dropdown');
//     const apDropdownBtn = apDropdown.querySelector('button');
//     const apDropdownValues = apDropdown.querySelectorAll('[data-value]');

//     apDropdownBtn.addEventListener('click', function () {
//       const apList = getSiblings(this)[0];
//       this.classList.toggle('is-active');
//       apList.classList.toggle('is-hidden');
//     }, false);

//     for (const [i, item] of apDropdownValues.entries()) {
//       item.addEventListener('click', function () {
//         const value = this.getAttribute('data-value');
//         for (const item of apDropdownValues) {
//           item.classList.remove('is-active');
//         }
//         document.querySelector('select').value = value;
//         this.classList.toggle('is-active');
//       }, false);
//     }
//   };

//   return {
//     init: _init,
//   };
// }());

// DropDown.init();
