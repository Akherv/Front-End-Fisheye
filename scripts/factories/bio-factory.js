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
export default bioFactory;
