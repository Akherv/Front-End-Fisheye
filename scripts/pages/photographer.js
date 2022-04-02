async function initPhotographerPage() {
  const photographerId = new URL(location.href).searchParams.get('id')
  const photographerBio = await getPhotographerBio(photographerId)
  const photographerMedias = await getPhotographerMedias(photographerId)
  const photographer = photographerBio[0]
  const photographerName = photographerBio[0].name

  displayBio(photographer)
  displayPortfolio(photographerMedias, photographerName)
  displaySlider(photographerMedias)


  var filterState = 'all';

  function getPhotographerBio(photographerId) {
    const photographersBio = JSON.parse(localStorage.getItem('photographersBio'))
    const userBio = photographersBio.filter(el => el.id === +photographerId)
    return userBio
  }

  function getPhotographerMedias(photographerId) {
    const photographersMedias = JSON.parse(localStorage.getItem('photographersMedias'))
    const portfolio = photographersMedias.filter(el => el.photographerId === +photographerId)
    return portfolio
  }

  function displayBio(data) {
    const {
      name,
      city,
      country,
      tagline,
      price,
      portrait
    } = data


    const picture = `assets/photographers/Photographers_ID/${portrait}`

    const photographHeader = document.querySelector('.photograph-header')
    const contactBtn = document.querySelector('.contact_button')

    const presentationDiv = document.createElement('div')
    presentationDiv.classList.add('photograph-header__presentation')
    const h1 = document.createElement('h1')
    h1.textContent = name
    const presentationText = document.createElement('p')
    presentationText.innerHTML = `${city}, ${country}<br>${tagline}`
    presentationDiv.appendChild(h1)
    presentationDiv.appendChild(presentationText)

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    img.setAttribute('alt', name)
    img.classList.add('photograph-header__picture')


    const informationDiv = document.createElement('div')
    const informationLikes = document.createElement('p')
    informationLikes.textContent = '-200 000'
    const informationPrice = document.createElement('p')
    informationPrice.textContent = `${price}€/jour`
    informationDiv.appendChild(informationLikes)
    informationDiv.appendChild(informationPrice)


    photographHeader.appendChild(presentationDiv)
    photographHeader.insertBefore(presentationDiv, contactBtn)
    photographHeader.appendChild(img)

    main.appendChild(informationDiv)
    return (main, presentationDiv)
  }

  function displayPortfolio(photographerMedias, photographerName) {
    const main = document.querySelector('main')
    if (main.querySelector(".portfolio") != null) {
      main.lastChild.remove()
    }
    const portfolioDiv = document.createElement('div')
    portfolioDiv.classList.add('portfolio')
    var arr = []

    photographerMedias.forEach((media) => {
      const mediaModel = mediaFactory(media, photographerName)
      const userMediaDOM = mediaModel.getUserMediaDOM()
      arr.push(userMediaDOM)
    })
    var fragment = document.createDocumentFragment();
    arr.forEach(function (item) {
      fragment.appendChild(item)
    });
    for (el of arr) {
      // if(el.tagName === 'IMG') {
      var z = filterMedias(el, filterState)
      console.log(z)
      portfolioDiv.appendChild(z)
    }
    // }
    main.appendChild(portfolioDiv)
  }

  function checkStateFilterBtn() {
    const filterBtn = document.querySelector('#filter')
    filterBtn.addEventListener('change', sortMedia)

    function sortMedia(e) {
      elt = e.target.value
      if (elt === 'img') {
        filterState = 'img'
        displayPortfolio(photographerMedias, photographerName)
      } else if (elt === 'video') {
        filterState = 'video'
        displayPortfolio(photographerMedias, photographerName)
      } else {
        filterState = 'all'
      }
      return filterState
    }
    return filterState
  }
  checkStateFilterBtn();

  function filterMedias(medias, filterState) {

    if (filterState === 'img') {
      if (medias.tagName === 'IMG') {
        console.log(medias)
        return medias
      } 
      else {
        delete medias
      }
    } else if (filterState === 'video') {
      if (medias.tagName === 'VIDEO') {
        console.log(medias)
        return medias
      } 
      // else {
      //   delete medias
      // }
    } else {
      return medias
    }
  }
  console.log(filterState)
}
initPhotographerPage()