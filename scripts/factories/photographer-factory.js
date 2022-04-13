function photographerFactory(data) {
  const {
    name,
    id,
    city,
    country,
    tagline,
    price,
    portrait,
  } = data;

  const picture = `assets/photographers/Photographers_ID/${portrait}`;
  const portfolio = `photographer.html?id=${id}`;

  function getUserCardDOM() {
    const article = document.createElement('article');
    // article.setAttribute('tabindex', '0');
    const a = document.createElement('a');
    a.setAttribute('href', portfolio);
    a.setAttribute('aria-labelledby', `photographer-${id}`);
    // a.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.setAttribute('src', picture);
    img.setAttribute('id', `photographer-${id}`);
    img.setAttribute('alt', name);
    // img.setAttribute('tabindex', '0');
    img.classList.add('photographer_section_picture');
    const h2 = document.createElement('h2');
    h2.textContent = name;

    const p = document.createElement('p');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span');
    span1.innerHTML = `${city}, ${country}<br>`;
    span2.innerHTML = `${tagline}<br>`;
    span3.innerText = `${price}€/jour`;

    a.appendChild(img);
    a.appendChild(h2);
    article.appendChild(a);
    p.appendChild(span1);
    p.appendChild(span2);
    p.appendChild(span3);

    article.appendChild(p);
    return (article);
  }

  return {
    name,
    picture,
    getUserCardDOM,
  };
}
export default photographerFactory;
