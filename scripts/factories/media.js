function mediaFactory(data, photographer_name) {
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

    let mediaLink = getMediaLink();

    function getMediaLink() {
        if (image) {
            return `assets/photographers/${photographerName}/${image}`;
        } else {
            return `assets/photographers/${photographerName}/${video}`;
        }
    }

    const mediaType = getUserMediaDOM();

    function getUserMediaDOM() {
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

    return {
        mediaLink,
        getUserMediaDOM
    };
}