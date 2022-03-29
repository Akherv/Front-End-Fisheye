(async function () {
  const photographerId = getphotographerId();
  const photographerData = await getPhotographerDatas(photographerId);
  const medias = await getPhotographerMedias(photographerId)
  const photographer_name = photographerData[0].name;
  displayPhotographerBio(photographerData[0]);
  displayPortfolio(medias,photographer_name);
})()


function getphotographerId() {
  return new URL(location.href).searchParams.get('id');
}

function getPhotographerDatas(photographerId) {
  const dataPhotographers = localStorage.getItem('dataPhotographers');
  const photographers = JSON.parse(dataPhotographers);
  const bio = photographers.filter(el => el.id === +photographerId);
  return bio;
}

function getPhotographerMedias(photographerId) {
  const dataMedias = localStorage.getItem('dataMedias');
  const medias = JSON.parse(dataMedias);
  const portfolio = medias.filter(el => el.photographerId === +photographerId);

  return portfolio;
}


function displayPhotographerBio(data) {
  const {
    name,
    city,
    country,
    tagline,
    price,
    portrait
  } = data;


  const picture = `assets/photographers/Photographers_ID/${portrait}`;

  const photographHeader = document.querySelector('.photograph-header');
  const contactBtn = document.querySelector('.contact_button');

  const presentationDiv = document.createElement('div');
  presentationDiv.classList.add('photograph-header__presentation');
  const h1 = document.createElement('h1');
  h1.textContent = name;
  const presentationText = document.createElement('p');
  presentationText.innerHTML = `${city}, ${country}<br>${tagline}`;
  presentationDiv.appendChild(h1);
  presentationDiv.appendChild(presentationText);

  const img = document.createElement('img');
  img.setAttribute('src', picture);
  img.setAttribute('alt', name);
  img.classList.add('photograph-header__picture');


  const informationDiv = document.createElement('div');
  const informationLikes = document.createElement('p');
  informationLikes.textContent = '-200 000';
  const informationPrice = document.createElement('p');
  informationPrice.textContent = `${price}€/jour`;
  informationDiv.appendChild(informationLikes);
  informationDiv.appendChild(informationPrice);


  photographHeader.appendChild(presentationDiv);
  photographHeader.insertBefore(presentationDiv, contactBtn);
  photographHeader.appendChild(img);

  main.appendChild(informationDiv);

  return (main, presentationDiv);
}

function displayPortfolio(medias,photographer_name) {
  const main = document.querySelector('main');

  medias.forEach((media) => {
    const mediaModel = mediaFactory(media, photographer_name);
    const userMediaDOM = mediaModel.getUserMediaDOM();
    
    main.appendChild(userMediaDOM);
  });

}

function mediaFactory(data,photographer_name) {
  const {
    id,
    title,
    image,
    likes,
    date,
    price,
    video
  } = data;

  console.log(photographer_name)

  const photographerName = photographer_name;
  
  let mediaLink = getImgOrVideo();
  function getImgOrVideo() {
    if (image) {
      return `assets/photographers/${photographerName}/${image}`;
    } else {
      return `assets/photographers/${photographerName}/${video}`;
    }
  }
  const mediaDisplay = displayImgOrVideo();
  function displayImgOrVideo() {
    if (image) {
      const image = document.createElement('img');
      image.setAttribute('src', mediaLink);
      image.setAttribute('alt', title);
      image.classList.add('portfolio_picture');
      console.log(image)
      return image;

    } else {
      const video = document.createElement('video');
      const source = document.createElement('source');
      video.setAttribute('controls', '');
      video.classList.add('portfolio_video');
      source.setAttribute('src', mediaLink);
      source.setAttribute('type', "video/mp4");
      video.appendChild(source);
      console.log(video)
      return video;
    }
  }

  function getUserMediaDOM() {
    const portfolioDiv = document.createElement('div');
    portfolioDiv.classList.add('portfolio');
    portfolioDiv.appendChild(mediaDisplay);
    return (portfolioDiv);
  }
  return {
    mediaLink,
    getUserMediaDOM
  };
}

//Contact-form

// const contactBtn = document.querySelector('.contact_button');
// const closeBtn = document.querySelectorAll('.closeBtn');

const contactModal = document.querySelector('.contact_Modal');
// contactBtn.addEventListener('click', openContactModal)
// closeBtn.forEach(btn=>btn.addEventListener('click', closeModal))

function displayModal() {
  contactModal.style.display = 'block'
}


function closeModal() {
  contactModal.style.display = 'none'
}