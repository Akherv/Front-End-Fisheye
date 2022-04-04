function displaySlider() {

    // const body = document.querySelector("body")
    const main = document.querySelector('main')
    const mediasPortfolio = document.querySelectorAll(".portfolio .media")
    const sliderModal = document.querySelector('#slider_modal')
    const sliderCloseBtn = document.querySelector('#slider_modal .closeBtn')
    const prevBtn = document.querySelector('#prevBtn')
    const mediaContainer = document.querySelector('#mediaContainer')
    const nextBtn = document.querySelector('#nextBtn')

    mediasPortfolio.forEach((media,idx) => media.addEventListener('click', function(e){
        displaySliderModal(e,idx)
    }))
    sliderCloseBtn.addEventListener('click', closeSliderModal)

    //Check the currentIndex of the ta& display the slider modal//////
    function displaySliderModal(e, idx) {
        console.log(idx);/////////todo
        const el = e.target
        // let currentIndex = [...el.parentElement.parentElement.children].indexOf(el.parentElement)
        let currentIndex = idx
        createMediaDOM(currentIndex)
        MediaNavigation(currentIndex)
        sliderModal.style.display = "block"
        // body.style.overflow = "hidden"
        main.style.display="none"

    }

    //Fire the removeSliderDOM function & Close the slider modal 
    function closeSliderModal() {
        removeSliderDOM()
        // body.style.overflow = "scroll"
        main.style.display="block"
        sliderModal.style.display = "none"
    }

    //create by cloning portofolio datas 
    function createMediaDOM(currentIndex) {
        let media = mediasPortfolio[currentIndex]
        const mediaChilds = media.children

        //if video
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

        } else {//if img
            let mediaClone = media.cloneNode()
            mediaClone.classList.remove('portfolio_picture')
            mediaClone.classList.add('mediaModal')
            mediaContainer.appendChild(mediaClone)
        }
    }

    //remove the media on Slider closing
    function removeSliderDOM() {
        const media = document.querySelectorAll('.mediaModal')
        media.forEach(el => el.remove())
    }

    //add the media btn navigation functionality
    function MediaNavigation(currentIndex) {
        prevBtn.addEventListener('click', decreaseSlideIndex)
        nextBtn.addEventListener('click', increaseSlideIndex)

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