(async function () {
  const photographerId = new URL(location.href).searchParams.get('id') 
  const photographerBio = await getPhotographerBio(photographerId) 
  const photographerMedias = await getPhotographerMedias(photographerId)
  const photographer = photographerBio[0] 
  const photographerName = photographerBio[0].name 
  displayBio(photographer) 
  displayPortfolio(photographerMedias, photographerName) 
  displaySlider(photographerMedias) 
})()

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
  const portfolioDiv = document.createElement('div') 
  portfolioDiv.classList.add('portfolio') 

  photographerMedias.forEach((media) => {
    const mediaModel = mediaFactory(media, photographerName) 
    const userMediaDOM = mediaModel.getUserMediaDOM() 
    portfolioDiv.appendChild(userMediaDOM) 
    main.appendChild(portfolioDiv) 

    // console.log(mediaModel.mediaLink)
  }) 
}