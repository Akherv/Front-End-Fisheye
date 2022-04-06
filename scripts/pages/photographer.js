async function initPhotographerPage() {

  let filterState = 'popularite';

  const photographerId = new URL(location.href).searchParams.get('id')
  const photographerBio = await getPhotographerBio(photographerId)
  const photographerMedias = await getPhotographerMedias(photographerId, filterState)
  const photographer = photographerBio[0]
  const photographerName = photographerBio[0].name

  displayBio(photographer)
  displayPortfolio(photographerMedias, photographerName)
  displaySlider(photographerMedias)
  initContactModal(photographerName)
  initCounter(photographerMedias, photographerId);

  // refreshGlobalLikesCounter(photographerMedias);

  //get photographer bio datas from localStorage
  function getPhotographerBio(photographerId) {
    const photographersBio = JSON.parse(localStorage.getItem('photographersBio'))
    const userBio = photographersBio.filter(el => el.id === +photographerId)
    return userBio
  }

  //get portfolio datas from localStorage & add filter
  function getPhotographerMedias(photographerId, filterState) {
    const photographersMedias = JSON.parse(localStorage.getItem('photographersMedias'))
    const portfolio = photographersMedias.filter(el => el.photographerId === +photographerId)

    //filter
    if (filterState === 'popularite') {
      portfolio.sort((a, b) => b.likes - a.likes);
      return portfolio
    } else if (filterState === 'date') {
      portfolio.sort((a, b) => new Date(a.date) - new Date(b.date));
      return portfolio
    } else if (filterState === 'title') {
      portfolio.sort(
        function (a, b) {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      return portfolio
    } else {
      return portfolio
    }
  }

  //create & display bio datas
  function displayBio(data) {
    const {
      name,
      city,
      country,
      tagline,
      price,
      portrait
    } = data

    const heart = `assets/icons/heart-black.svg`
    const picture = `assets/photographers/Photographers_ID/${portrait}`

    const photographHeader = document.querySelector('.photograph-header')
    const presentationDiv = document.querySelector('.photograph-header__presentation')
    const presentationTextDiv = document.querySelector('.presentationTextDiv')
    const informationDiv = document.querySelector('.informationdiv')
    const informationLikes = document.querySelector('.informationLikes')

    const h1 = `<h1>${name}</h1>`
    const p1 = `<p>${city}, ${country}</p>`
    const p2 = `<p>${tagline}</p>`
    const img = `<img class="photograph-header__picture" src="${picture}" alt="${name}"></img>`

    const informationLikesSpan1 = `<span class="informationLikesNumber"></span>`
    const imgHeart = `<img class="informationDiv_imgHeart" src="${heart}" alt="likes"></img>`
    const informationPrice = `<span class="informationDiv__price">${price}€/jour</span>`


    presentationDiv.insertAdjacentHTML('afterbegin', h1)

    presentationTextDiv.insertAdjacentHTML('afterend', p1)
    presentationTextDiv.insertAdjacentHTML('beforeend', p2)

    photographHeader.insertAdjacentHTML('beforeend', img)

    informationLikes.insertAdjacentHTML('beforeend', informationLikesSpan1)
    informationLikes.insertAdjacentHTML('beforeend', imgHeart)

    informationDiv.insertAdjacentHTML('beforeend', informationPrice)

  }

  //create & display portofolio datas with the medias factory
  function displayPortfolio(photographerMedias, photographerName) {
    const main = document.querySelector('main')
    if (main.querySelector(".portfolio") != null) {
      main.lastChild.remove()
    }
    const portfolioDiv = document.createElement('div')
    portfolioDiv.classList.add('portfolio')

    photographerMedias.forEach((media) => {
      const mediaModel = mediaFactory(media, photographerName)
      const userMediaDOM = mediaModel.getUserMediaDOM()
      portfolioDiv.appendChild(userMediaDOM)
    })
    main.appendChild(portfolioDiv)
  }

  //Change the filterstate according to the change event & reload the creation of the medias
  function checkStateFilterBtn() {
    const filterBtn = document.querySelector('#filter')
    filterBtn.addEventListener('change', sortMedia)

    function sortMedia(e) {
      elt = e.target.value
      if (elt === 'date') {
        filterState = 'date'
      }
      if (elt === 'title') {
        filterState = 'title'
      }
      if (elt === 'popularite') {
        filterState = 'popularite'
      }
      let photographerMediasFiltered = getPhotographerMedias(photographerId, filterState)
      displayPortfolio(photographerMediasFiltered, photographerName)
      displaySlider(photographerMedias)
      initCounter(photographerMedias, photographerId);
    }
  }
  checkStateFilterBtn();

  function initContactModal() {
    const modalHeader = document.querySelector('#modalHeader')
    const span = document.createElement('span')
    span.innerHTML = `<br>${photographerName}`;
    modalHeader.appendChild(span)
  }

  function initCounter(photographerMedias, photographerId) {

    const likesMedia = document.querySelectorAll(".portfolioMediaContent .heart")
    const likesNumbers = document.querySelectorAll('.likesNumber')
    const informationLikesNumber = document.querySelector('.informationLikesNumber')

    function likeCheck(photographerMedias, photographerId) {

      likesMedia.forEach((media, idx) => media.addEventListener('click', function () {

        const localIdx = photographerMedias[idx].id;
        let arrItems = JSON.parse(localStorage.getItem('photographersMedias'));
        let currentItem = arrItems.filter(el => el.id === localIdx)

        let dataState = media.getAttribute('data-state')
        let likes = currentItem[0].likes;

        if (dataState === 'true') {
          media.classList.remove('active')
          media.setAttribute('data-state', false);
          media.setAttribute('data-count', `${likes-1}`);
          likesNumbers[idx].textContent = likes - 1;
          currentItem[0].likes--;
          currentItem[0].state = false;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems))

          refreshGlobalLikesCounter()

        } else {
          media.classList.add('active')
          media.setAttribute('data-state', true);
          media.setAttribute('data-count', `${likes+1}`);
          likesNumbers[idx].textContent = likes + 1;
          currentItem[0].likes++
          currentItem[0].state = true;
          localStorage.setItem('photographersMedias', JSON.stringify(arrItems))

          refreshGlobalLikesCounter()

        }
      }))
    }
    likeCheck(photographerMedias, photographerId)


    //change sum variable
    function refreshGlobalLikesCounter() {
      let sum = 0;
      let arrItemsUpdated = JSON.parse(localStorage.getItem('photographersMedias'));
      let currentsItemUpdated = arrItemsUpdated.filter(el => el.photographerId === +photographerId)
      currentsItemUpdated.forEach((media) => sum += media.likes)
      informationLikesNumber.textContent = `${sum}`
      return sum
    }
    refreshGlobalLikesCounter()


  }
}
initPhotographerPage()