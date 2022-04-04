function mediaFactory(media, photographer_name) {
    const {
        id,
        title,
        image,
        likes,
        date,
        price,
        video
    } = media


    const photographerName = photographer_name
    const heart = 'assets/icons/heart.svg'
    const mediaLink = getMediaLink()

    function getMediaLink() {
        if (image) {
            return `assets/photographers/${photographerName}/${image}`
        } else if (video) {
            return `assets/photographers/${photographerName}/${video}`
        } else {
            console.log('error: aucun média')
        }
    }

    function getUserMediaDOM() {
        if (image) {
            const mediaContainer = document.createElement('article')
            const image = document.createElement('img')

            mediaContainer.classList.add('portfolio_mediaContainer')
            image.setAttribute('src', mediaLink)
            image.setAttribute('alt', title)
            image.classList.add('media', 'portfolio_picture')

            const h2 = document.createElement('h2') 
            h2.textContent = title 

            const portfolioMediaContent = document.createElement('div')
            portfolioMediaContent.classList.add('portfolioMediaContent')
            const p = document.createElement('p') 
            const span1 = document.createElement('span')
            const span2 = document.createElement('span')
            const img = document.createElement('img')
            span1.innerHTML = likes 
            img.setAttribute('src', heart)
            img.setAttribute('alt', 'likes')
            img.classList.add('heart')

            span2.appendChild(img)
            p.appendChild(span1)
            p.appendChild(span2)
            portfolioMediaContent.appendChild(h2)
            portfolioMediaContent.appendChild(p)
            mediaContainer.appendChild(image)
            mediaContainer.appendChild(portfolioMediaContent)

            return mediaContainer

        } else if (video) {
            const mediaContainer = document.createElement('article')
            const video = document.createElement('video')
            const source = document.createElement('source')

            mediaContainer.classList.add('portfolio_mediaContainer')
            video.classList.add('media', 'portfolio_video')
            source.setAttribute('src', mediaLink)
            source.setAttribute('type', "video/mp4")

            const h2 = document.createElement('h2') 
            h2.textContent = title 

            const portfolioMediaContent = document.createElement('div')
            portfolioMediaContent.classList.add('portfolioMediaContent')
            const p = document.createElement('p') 
            const span1 = document.createElement('span')
            const span2 = document.createElement('span')
            const img = document.createElement('img')
            span1.innerHTML = likes 
            img.setAttribute('src', heart)
            img.setAttribute('alt', 'likes')
            img.classList.add('heart')

            span2.appendChild(img)
            p.appendChild(span1)
            p.appendChild(span2)
            portfolioMediaContent.appendChild(h2)
            portfolioMediaContent.appendChild(p)
            video.appendChild(source)
            mediaContainer.appendChild(video)
            mediaContainer.appendChild(portfolioMediaContent)

            return mediaContainer
        } else {
            console.log('error: aucun média')
        }
    }


    return {
        mediaLink,
        getUserMediaDOM
    }
}