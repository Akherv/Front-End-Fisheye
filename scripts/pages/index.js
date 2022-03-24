    async function getPhotographers() {
        var myHeaders = new Headers();

        var myInit = { method: 'GET',
                       headers: myHeaders,
                       mode: 'cors',
                       cache: 'default' };

        let url = "./data/photographers.json";

        try {
            const response = await fetch(url, myInit);
            const datas = await response.json()
            // const {
            //     photographers
            // } = datas;
            console.log(datas);
            return ({
                photographers: [...datas.photographers]
            });
        } catch (error) {
            console.log('Fetch error: ', error);
        }


    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });

        
        
     
    };

    async function init() {
        // Récupère les datas des photographes
        const {
            photographers
        } = await getPhotographers();
        displayData(photographers);
    };

    init();