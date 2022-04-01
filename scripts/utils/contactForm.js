const contactModalBtn = document.querySelector(".photograph-header .contact_button") 
const contactModal = document.getElementById("contact_modal") 
const contactModalCloseBtn = document.querySelector('#contact_modal .closeBtn') 

contactModalBtn.addEventListener('click', displayContactModal) 
contactModalCloseBtn.addEventListener('click', closeContactModal) 

function displayContactModal() {
	contactModal.style.display = "block" 
}

function closeContactModal() {
    contactModal.style.display = "none" 
}
