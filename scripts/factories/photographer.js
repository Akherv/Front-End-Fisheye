function photographerFactory(data) {
    const {
        name,
        id,
        city,
        country,
        tagline,
        price,
        portrait
    } = data;

    const picture = `assets/photographers/Photographers_ID/${portrait}`;
    // const portfolio = `photographer.html/?id=${id}`;
    const portfolio = `#`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const a = document.createElement('a');
        a.setAttribute("href", portfolio);
        a.setAttribute("aria-label", name);
        a.addEventListener('click', function () {
            console.log(a);
            // let params = (new URL(document.location)).searchParams;
            // let idPortfolio = params.get('id'); 
            // console.log(idPortfolio);
        });
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", "");
        const h2 = document.createElement('h2');
        h2.textContent = name;

        const p = document.createElement('p');
        p.innerHTML = `${city}, ${country}<br>${tagline}<br>${price}€/jour`;

        a.appendChild(img);
        a.appendChild(h2);
        article.appendChild(a);

        article.appendChild(p);
        return (article);
    }

    return {
        name,
        picture,
        getUserCardDOM
    }
}



