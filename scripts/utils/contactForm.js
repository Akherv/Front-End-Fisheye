const body = document.querySelector('body');
const contactModalBtn = document.querySelector('.photograph-header .contact_button');
const contactModal = document.getElementById('contact_modal');
const contactModalCloseBtn = document.querySelector('#contact_modal .closeBtn');

function displayContactModal() {
  contactModal.style.display = 'block';
  body.style.overflow = 'hidden';
}

function closeContactModal() {
  contactModal.style.display = 'none';
  body.style.overflow = 'scroll';
}

contactModalBtn.addEventListener('click', displayContactModal);
contactModalCloseBtn.addEventListener('click', closeContactModal);
