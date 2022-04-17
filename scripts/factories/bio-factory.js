function bioFactory(data) {
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
  const presentationDiv = document.querySelector('.photograph-header_presentation');
  const photographText = document.querySelector('.photograph-header_presentation-text');
  const informations = document.querySelector('.informations');
  const informationsLikes = document.querySelector('.informations_likes');

  const h1 = `<h1>${name}</h1>`;
  const span1 = `<span>${city}, ${country}</span>`;
  const span2 = `<span>${tagline}</span>`;
  const img = `<img class="photograph-header_picture" src="${picture}" alt="${name}"></img>`;

  const informationsLikesSpan1 = '<span class="informations_likes-number"></span>';
  const imgHeart = `<img class="informations_img-heart" src="${heart}" alt="likes"></img>`;
  const informationPrice = `<span class="informations_price">${price}€/jour</span>`;

  presentationDiv.insertAdjacentHTML('afterbegin', h1);

  photographText.insertAdjacentHTML('beforeend', span1);
  photographText.insertAdjacentHTML('beforeend', span2);

  photographHeader.insertAdjacentHTML('beforeend', img);

  informationsLikes.insertAdjacentHTML('beforeend', informationsLikesSpan1);
  informationsLikes.insertAdjacentHTML('beforeend', imgHeart);

  informations.insertAdjacentHTML('beforeend', informationPrice);
}
export default bioFactory;
