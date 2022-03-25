//Mettre le code JavaScript lié à la page photographer.html

    (async function () {
        const photographerId = getphotographerId();
        const photographerData = await getPhotographerData(photographerId);
        console.log(photographerData);
        displayPortfolio(photographerData);
      })()
      
      function getphotographerId() {
        return new URL(location.href).searchParams.get('id');
      }

      function getPhotographerData(photographerId) {
        return fetch("./data/photographers.json")
          .then(res => res.json())
          .then(data => {
              const photographer = data.photographers;
              const portfolio = photographer.filter(el=>el.id===+photographerId);
              return portfolio;
          })
          .catch(function(error) {
            // alert(error)
          })
      }
      
      function displayPortfolio(photographerData) {
        const {
            name,
            id,
            city,
            country,
            tagline,
            price,
            portrait
        } = photographerData[0];

        const picture = `assets/photographers/Photographers_ID/${portrait}`;

        const photographHeader = document.querySelector(".photograph-header");
        const contactBtn = document.querySelector(".contact_button");
         
        const presentationDiv = document.createElement('div');
        presentationDiv.classList.add("photograph-header__presentation");
        const h1 = document.createElement('h1');
        h1.textContent = name; 
        const presentationText = document.createElement('p');
        presentationText.innerHTML = `${city}, ${country}<br>${tagline}`;
        presentationDiv.appendChild(h1);
        presentationDiv.appendChild(presentationText);

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        img.classList.add("photograph-header__picture");
  
        photographHeader.appendChild(presentationDiv);
        photographHeader.insertBefore(presentationDiv,contactBtn);
        photographHeader.appendChild(img);

        const informationDiv = document.createElement('div');
        const informationLikes = document.createElement('p');
        informationLikes.textContent = '--297 081--';
        const informationPrice = document.createElement('p');
        informationPrice.textContent = `${price}€/jour`;

        informationDiv.appendChild(informationLikes,);
        informationDiv.appendChild(informationPrice);

        return (presentationDiv, informationDiv);
      }
   


function mediaFactory(data) {

}