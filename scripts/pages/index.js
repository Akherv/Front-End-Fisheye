    async function getPhotographers() {
        //fetch all datas
        var myHeaders = new Headers()

        var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        }

        let url = './data/photographers.json'

        try {
            const response = await fetch(url, myInit)
            const datas = await response.json()
            console.log(datas)

            if(!localStorage.getItem('photographersBio') && !localStorage.getItem('photographersMedias')) {
                localStorage.setItem('photographersBio', JSON.stringify(datas.photographers))
                localStorage.setItem('photographersMedias', JSON.stringify(datas.media))
            } else {
                console.log('local storage déjà rempli')
            }
         

            return ({
                photographers: [...datas.photographers]
            })
        } catch (error) {
            console.log('Fetch error: ', error)
        }
    }

    //create photographers datas with the photographer factory
    async function displayPhotographers(photographers) {
        const photographersSection = document.querySelector('.photographer_section')

        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer)
            const userCardDOM = photographerModel.getUserCardDOM()
            photographersSection.appendChild(userCardDOM)
        })
    }

    //display photographers datas
    async function init() {
        const {
            photographers
        } = await getPhotographers()
        displayPhotographers(photographers)
    }

    init()