async function initPhotographerPage() {

  var filterState = 'popularite';

  const photographerId = new URL(location.href).searchParams.get('id')
  const photographerBio = await getPhotographerBio(photographerId)
  const photographerMedias = await getPhotographerMedias(photographerId,filterState)
  const photographer = photographerBio[0]
  const photographerName = photographerBio[0].name

  displayBio(photographer)
  displayPortfolio(photographerMedias, photographerName)
  displaySlider(photographerMedias)

  function getPhotographerBio(photographerId) {
    const photographersBio = JSON.parse(localStorage.getItem('photographersBio'))
    const userBio = photographersBio.filter(el => el.id === +photographerId)
    return userBio
  }

  function getPhotographerMedias(photographerId, filterState) {
    const photographersMedias = JSON.parse(localStorage.getItem('photographersMedias'))
    const portfolio = photographersMedias.filter(el => el.photographerId === +photographerId)

    if(filterState === 'popularite') {
      portfolio.sort((a,b)=>a.likes-b.likes);
      return portfolio
    } else if(filterState === 'date') {
      portfolio.sort((a,b)=> new Date(a.date)- new Date(b.date));
      return portfolio
    } else if(filterState === 'title') {
      portfolio.sort(
        function(a, b){
          if(a.title < b.title) { return -1; }
          if(a.title > b.title) { return 1; }
          return 0;
        });
      return portfolio
    } else {
      return portfolio
    }
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

    photographerMedias.forEach((media) => {
      const mediaModel = mediaFactory(media, photographerName)
      const userMediaDOM = mediaModel.getUserMediaDOM()
      portfolioDiv.appendChild(userMediaDOM)
    })
    main.appendChild(portfolioDiv)
  }

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
      if(elt === 'popularite') {
        filterState = 'popularite'
      }
      let photographerMediasFiltered =  getPhotographerMedias(photographerId,filterState)
      displayPortfolio(photographerMediasFiltered, photographerName)
    }
  }
  checkStateFilterBtn();

}
initPhotographerPage()