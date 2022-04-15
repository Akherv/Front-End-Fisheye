/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
import mediaFactory from '../factories/media-factory.js';
import displaySlider from '../utils/slider.js';
import displayContactModal from '../utils/contactForm.js';

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

  function initCounter(medias) {
    const likesMedia = document.querySelectorAll('.portfolioMediaContent .heart');
    const likesNumbers = document.querySelectorAll('.likesNumber');
    const informationLikesNumber = document.querySelector('.informationLikesNumber');

    // change sum variable
    function refreshGlobalLikesCounter() {
      let sum = 0;
      const arrElUpdated = JSON.parse(localStorage.getItem('photographersMedias'));
      const currentsElUpdated = arrElUpdated.filter((el) => el.photographerId === +photographerId);
      currentsElUpdated.forEach((media) => sum += media.likes);
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
        el.setAttribute('aria-selected', 'true');
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
        // closeSelect();
      }
      if ((event.key || event.code) === 'Escape') {
        el.parentElement.classList.remove('open');
        el.parentElement.setAttribute('aria-expanded', 'false');
        // closeSelect();
      }
    }, true));
  }
  checkStateFilterBtn();

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
function customSelect() {
  // DOM selection
  const oldSelectedOption = document.querySelector('.old-select option[selected]');
  const oldSelectedOptionDefault = document.querySelector('.old-select option:first-child');
  const oldOptions = document.querySelectorAll('.old-select option');
  const listboxContainer = document.querySelector('.new-select');
  const listboxLabel = document.querySelector('.selection p span');

  // Initialisation
  function createNewDOMSelect() {
    if (oldSelectedOption.length === 1) {
      listboxLabel.innerHTML = oldSelectedOption.innerHTML;
    } else {
      listboxLabel.innerHTML = oldSelectedOptionDefault.innerHTML;
    }

    oldOptions.forEach((el) => {
      const newValue = el.value;
      const newHTML = el.innerHTML;
      listboxContainer.innerHTML += `<div class="new-option" data-value="${newValue}" role="option" aria-labelledby="${el.value}" aria-selected="false" tabindex="-1"><p id="${el.value}">${newHTML}</p></div>`;
      if (newValue === 'popularite') {
        document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');
      }
    });
  }
  createNewDOMSelect();

  // DOM selection for element who need to wait for initialisation
  const listbox = document.querySelector('.selection');
  const newOptions = document.querySelectorAll('.new-option');

  function openSelect() {
    // handle change on container
    listboxContainer.classList.add('open');
    listbox.setAttribute('aria-expanded', 'true');
    const listboxLabelOpenContent = document.querySelector('.selection.open p span').textContent;
    // handle change on options
    newOptions.forEach((el) => {
      // if the current option is selected hide from list
      if ((el.textContent).toLowerCase() === listboxLabelOpenContent.toLowerCase()) {
        el.classList.add('hideCurrentOption');
        el.setAttribute('tabindex', '-1');
        if ((el.nextElementSibling != null) && (el.nextElementSibling.style.display !== 'none')) {
          // Move focus to the sibling
          el.nextElementSibling.focus();
        } else {
          el.setAttribute('aria-selected', 'true');
        }
      } else { // reveal others options
        el.classList.remove('hideCurrentOption');
        el.classList.add('reveal');
      }
    });
  }

  function closeSelect() {
    // handle change on container
    listboxContainer.classList.remove('open');
    listbox.classList.remove('open');
    listbox.setAttribute('aria-expanded', 'false');
    // handle change on options
    newOptions.forEach((el) => {
      el.classList.remove('reveal');
      el.classList.remove('hideCurrentOption');
      el.setAttribute('tabindex', '-1');
    });
    // Move focus to the listbox container
    document.querySelector('.selection').focus();
  }
  closeSelect();

  // handle Open / Close filter
  function toggleOpen() {
    listbox.classList.toggle('open');
    if (listbox.classList.contains('open')) {
      openSelect();
    } else {
      closeSelect();
    }
  }

  // open filter on Click
  listbox.addEventListener('click', toggleOpen);

  // open filter on Keyboard Enter
  listbox.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Enter') {
      toggleOpen();
    }
  }, true);

  // close filter on Keyboard Escape
  newOptions.forEach((el) => el.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Escape') {
      console.log('ok');
      closeSelect();
    }
  }, true));

  // close filter on Click outside
  document.addEventListener('click', (e) => {
    const isClickInsideElement = listboxContainer.contains(e.target);
    if (!isClickInsideElement) {
      closeSelect();
    }
  });

  // handle options change inside the filter
  function handleChangeOptions(el) {
    const newValue = this.dataset.value;
    const listboxLabelOpen = document.querySelector('.selection.open p span');

    // Selection New Select
    listboxLabelOpen.innerHTML = this.querySelector('p').innerHTML;
    document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
    document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');
    document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');

    // Selection Old Select
    oldSelectedOption.removeAttribute('selected');
    document.querySelector(`.old-select option[value="${newValue}"]`).setAttribute('selected', '');

    // change textContent
    this.setAttribute('aria-selected', 'true');
    this.setAttribute('tabindex', '0');

    // hide from list selected textContent
    this.classList.remove('reveal');
    this.classList.add('hideCurrentOption');
    const optionsNotSelected = [...newOptions].filter((elt) => elt.dataset.value !== newValue);
    optionsNotSelected.forEach((elt) => {
      elt.classList.remove('hideCurrentOption');
      elt.classList.add('reveal');
      elt.setAttribute('tabindex', '-1');
    });

    closeSelect();
  }

  // fire handle option change on Click
  document.querySelectorAll('.new-option').forEach((el) => el.addEventListener('click', handleChangeOptions));

  // fire handle option change on Keyboard
  document.querySelectorAll('.new-option').forEach((el) => el.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Enter') {
      e.preventDefault();
      handleChangeOptions(el);
      // el.setAttribute('tabindex', -1);
      // document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
      // document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');

      // if ((el.nextElementSibling != null) && (el.nextElementSibling.style.display !== 'none')) {
      //   const nextEl = el.nextElementSibling;
      //   el.setAttribute('aria-selected', 'true');
      //   nextEl.focus();
      // } else {
      //   const firstEl = document.querySelectorAll('.new-option')[0];
      //   el.setAttribute('aria-selected', 'true');
      //   firstEl.focus();
      // }

      // if (e.shiftKey) {
      //   e.preventDefault();
      //   el.setAttribute('tabindex', -1);
      //   document.querySelector('.new-option[aria-selected="true"]').setAttribute('tabindex', '-1');
      //   document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');
      //   if (el.previousElementSibling.classList.contains('selection')) {
      //     const lastEl = document.querySelectorAll('.new-option')[2];
      //     el.setAttribute('aria-selected', 'true');
      //     lastEl.focus();
      //   } else {
      //     const prevEl = el.previousElementSibling;
      //     el.setAttribute('aria-selected', 'true');
      //     prevEl.focus();
      //   }
      // }
    }
  }));
}
customSelect();
