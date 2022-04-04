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
      console.log(portfolio)
      return portfolio
    } else if (filterState === 'date') {
      portfolio.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log(portfolio)
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
      console.log(portfolio)
      return portfolio
    } else {
      console.log(portfolio)
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
    const contactBtn = document.querySelector('.contact_button')

    const presentationDiv = document.createElement('div')
    presentationDiv.classList.add('photograph-header__presentation')
    const h1 = document.createElement('h1')
    h1.textContent = name
    const presentationTextDiv = document.createElement('div')
    presentationTextDiv.classList.add('presentationTextDiv')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    p1.textContent = `${city}, ${country}`
    p2.textContent = `${tagline}`
    presentationTextDiv.appendChild(p1)
    presentationTextDiv.appendChild(p2)
    presentationDiv.appendChild(h1)
    presentationDiv.appendChild(presentationTextDiv)

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    img.setAttribute('alt', name)
    img.classList.add('photograph-header__picture')
    const informationDiv = document.createElement('div')
    const informationLikes = document.createElement('span')
    informationLikes.textContent = '-200 000' ////////////////////////// TODO
    const imgHeart = document.createElement('img')
    imgHeart.setAttribute('src', heart)
    imgHeart.setAttribute('alt', 'likes')
    imgHeart.classList.add('informationDiv_imgHeart')
    const informationPrice = document.createElement('span')
    informationDiv.classList.add('informationDiv')
    informationPrice.textContent = `${price}€/jour`

    informationLikes.appendChild(imgHeart)
    informationDiv.appendChild(informationLikes)
    informationDiv.appendChild(informationPrice)
    photographHeader.appendChild(presentationDiv)
    photographHeader.insertBefore(presentationDiv, contactBtn)
    photographHeader.appendChild(img)
    main.appendChild(informationDiv)

    return (main, presentationDiv)
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
    }
  }
  checkStateFilterBtn();

  function initContactModal() {
    const modalHeader = document.querySelector('#modalHeader')
    const span = document.createElement('span')
    span.innerHTML= `<br>${photographerName}`;
    modalHeader.appendChild(span)
  }


}
initPhotographerPage()