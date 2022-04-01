function displaySlider(photographerMedias) {

    const mediasPortfolio = document.querySelectorAll(".portfolio .media")
    const sliderModal = document.querySelector('#slider_modal')
    const sliderModalCloseBtn = document.querySelector('#slider_modal .closeBtn')
    const prevBtn = document.querySelector('#prevBtn')
    const mediaContainer = document.querySelector('#mediaContainer')
    const nextBtn = document.querySelector('#nextBtn')

    mediasPortfolio.forEach(btn => btn.addEventListener('click', displaySliderModal))
    sliderModalCloseBtn.addEventListener('click', closeSliderModal)

    function displaySliderModal(e) {
        const el = e.target
        let currentIndex = [...el.parentElement.children].indexOf(el)
        createSliderDOM(el)
        MediaNavigation(this, currentIndex)
        return sliderModal.style.display = "block"
    }

    function closeSliderModal() {
        removeSliderDOM()
        return sliderModal.style.display = "none"
    }

    async function createSliderDOM(el) {
        const media = el
        const mediaChilds = media.children
        let mediaClone;

        if (mediaChilds.length >= 1) {
            let child = await getChilds(mediaChilds);

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
        const media = document.querySelector('.mediaModal')
        media.remove()
    }

    function MediaNavigation(el, index) {
        let currentIndex = index
        console.log(currentIndex)

        if (currentIndex >= 0) {
            prevBtn.addEventListener('click', decreaseSlideIndex)
            nextBtn.addEventListener('click', increaseSlideIndex)

            function decreaseSlideIndex() {
                if(currentIndex > 0) {
                    currentIndex--
                }
                changeCurrentMedia(el,currentIndex)
            }

            function increaseSlideIndex() {
                if(currentIndex < mediasPortfolio.length-1) {
                    currentIndex++
                }
                changeCurrentMedia(el,currentIndex)
            }

            function changeCurrentMedia(el,currentIndex) {
                const media = document.querySelector('.mediaModal')
                console.log(media,currentIndex)
                if (media.tagName === 'IMG') {
                    media.setAttribute('src', mediasPortfolio[currentIndex].src)
                    media.setAttribute('alt', mediasPortfolio[currentIndex].alt)
                } 
                if (media.tagName === 'VIDEO') {
                    let firstMediaChild = media.firstChild;
                    firstMediaChild.setAttribute('src', mediasPortfolio[currentIndex].src)
                }
            }
         
        }
    }
}