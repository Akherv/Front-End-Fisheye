function displaySlider() {

    const mediasPortfolio = document.querySelectorAll(".portfolio .media")
    const sliderModal = document.querySelector('#slider_modal')
    const sliderCloseBtn = document.querySelector('#slider_modal .closeBtn')
    const prevBtn = document.querySelector('#prevBtn')
    const mediaContainer = document.querySelector('#mediaContainer')
    const nextBtn = document.querySelector('#nextBtn')


    mediasPortfolio.forEach(media => media.addEventListener('click', displaySliderModal))
    sliderCloseBtn.addEventListener('click', closeSliderModal)

    function displaySliderModal(e) {
        const el = e.target
        let currentIndex = [...el.parentElement.children].indexOf(el)
        createMediaDOM(currentIndex)
        MediaNavigation(currentIndex)
        sliderModal.style.display = "block"
    }

    function closeSliderModal() {
        removeSliderDOM()
        sliderModal.style.display = "none"
    }

    function createMediaDOM(currentIndex) {
        let media = mediasPortfolio[currentIndex]
        const mediaChilds = media.children

        if (mediaChilds.length >= 1) {
            let child = getChilds(mediaChilds);

            function getChilds(mediaChilds) {
                for (elt in mediaChilds) {
                    return mediaChilds[elt]
                }
            };
            let childClone = child.cloneNode();
            let parentClone = media.cloneNode()
            parentClone.classList.remove('portfolio_video')
            parentClone.classList.add('mediaModal')
            parentClone.setAttribute('controls', '')
            parentClone.appendChild(childClone)
            mediaContainer.appendChild(parentClone)

        } else {
            let mediaClone = media.cloneNode()
            mediaClone.classList.remove('portfolio_picture')
            mediaClone.classList.add('mediaModal')
            mediaContainer.appendChild(mediaClone)
        }
    }

    function removeSliderDOM() {
        const media = document.querySelectorAll('.mediaModal')
        media.forEach(el => el.remove())
    }

    function MediaNavigation(currentIndex) {
        // if (currentIndex === 0) {
        //     prevBtn.removeEventListener('click', decreaseSlideIndex)
        // } else if (currentIndex === mediasPortfolio.length - 1) {
        //     nextBtn.removeEventListener('click', increaseSlideIndex)
        // } else {
            prevBtn.addEventListener('click', decreaseSlideIndex)
            nextBtn.addEventListener('click', increaseSlideIndex)
        //}

        function decreaseSlideIndex() {
            if (currentIndex > 0) {
                removeSliderDOM(currentIndex)
                currentIndex--
                createMediaDOM(currentIndex)
            }
        }

        function increaseSlideIndex() {
            if (currentIndex < mediasPortfolio.length - 1) {
                removeSliderDOM(currentIndex)
                currentIndex++
                createMediaDOM(currentIndex)
            }
        }
    }
}