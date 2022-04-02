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
            const image = document.createElement('img')
            image.setAttribute('src', mediaLink)
            image.setAttribute('alt', title)
            image.classList.add('media', 'portfolio_picture')
            return image

        } else if (video) {
            const video = document.createElement('video')
            const source = document.createElement('source')
            video.classList.add('media', 'portfolio_video')
            source.setAttribute('src', mediaLink)
            source.setAttribute('type', "video/mp4")
            video.appendChild(source)
            return video
        } else {
            console.log('error: aucun média')
        }
    }

    return {
        mediaLink,
        getUserMediaDOM
    }
}