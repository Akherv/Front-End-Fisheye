const contactBtn = document.querySelector(".photograph-header .contact_button");
const modal = document.getElementById("contact_modal");
const closeBtn = document.querySelectorAll('.closeBtn');
const sliderModal = document.getElementById('slider_modal');


contactBtn.addEventListener('click', displayModal);
closeBtn.forEach(el=> el.addEventListener('click', closeModal));

function displayModal() {
	modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    sliderModal.style.display = 'none'
}
