/* eslint-disable no-console */
function displayContactModal() {
  const body = document.querySelector('body');
  const landmarks = document.querySelectorAll('#header a, #main .contact_button, .selection');
  const mediasPortfolio = document.querySelectorAll('.media');
  const likesBtn = document.querySelectorAll('.heart');
  const contactModalBtn = document.querySelector('.contact_button.bio');
  const contactModal = document.getElementById('contact_modal');
  const contactModalHeader = document.querySelector('#modalHeader');
  const contactModalCloseBtn = document.querySelector('#contact_modal .closeBtn');
  const contactModalSendBtn = document.querySelector('#contact_modal .contact_button');
  const form = document.querySelector('form');
  const fields = document.querySelectorAll('.fields');

  function openContactModal() {
    // contactModal.style.display = 'block';
    contactModalCloseBtn.setAttribute('tabindex', '0');
    contactModal.setAttribute('aria-modal', 'true');
    contactModal.removeAttribute('hidden');

    body.style.overflow = 'hidden';

    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
    });
    likesBtn.forEach((el) => el.setAttribute('tabindex', '-1'));
    mediasPortfolio.forEach((el) => el.setAttribute('tabindex', '-1'));

    contactModalHeader.focus();
  }

  function closeContactModal() {
    // contactModal.style.display = 'none';
    contactModalCloseBtn.setAttribute('tabindex', '-1');
    contactModal.removeAttribute('aria-modal');
    contactModal.setAttribute('hidden', '');

    body.style.overflow = 'auto';

    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('inert');
    });
    likesBtn.forEach((el) => el.setAttribute('tabindex', '0'));
    mediasPortfolio.forEach((el) => el.setAttribute('tabindex', '0'));

    contactModalBtn.focus();
  }

  contactModalBtn.addEventListener('click', openContactModal);
  contactModalCloseBtn.addEventListener('click', closeContactModal);
  // accessibility
  window.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Escape') {
      closeContactModal();
    }
  }, true);
  contactModalSendBtn.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Enter') {
      closeContactModal();
    }
  }, true);
  contactModalCloseBtn.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Enter') {
      closeContactModal();
    }
  }, true);

  function validation() {
  // Global validation state
    let fieldsIsValid = false;
    let valuesArr = [];

    function checkfieldsIsValid() {
      let counter = 0;

      function checkConditionValidity(el) {
        let condition;
        let message;

        // Pattern
        const namePattern = /[a-zA-Z]{2,}/; // name must contains only letters and at least 2 characters
        // eslint-disable-next-line no-useless-escape
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // email must begin with a word or numeric character (one or more time), can be followed by punctuation & another word or numeric character, then must contains an @ symbol, followed by word or numeric character and finish with a top level domain of 2 or 3 characters. (ex:a0.aaa@aaaa.com)

        switch (el.name) {
          case 'Firstname':
            condition = el.value.trim() !== '' && el.value.trim().length >= 2 && namePattern.test(el.value.trim());
            message = 'Le prénom doit contenir au moins 2 lettres';
            break;
          case 'Lastname':
            condition = el.value.trim() !== '' && el.value.trim().length >= 2 && namePattern.test(el.value.trim());
            message = 'Le nom doit contenir au moins 2 lettres';
            break;
          case 'Email':
            condition = el.value.trim() !== '' && emailPattern.test(el.value.trim());
            message = 'L\'email doit être correct';
            break;
          case 'Yourmessage':
            condition = el.value.trim() !== '';
            message = 'Le message ne doit pas être vide';
            break;
          default:
            condition = el.value.trim() !== '';
            message = 'erreur';
            break;
        }

        class Obj {
          constructor(name, value) {
            this.name = name;
            this.value = value;
          }
        }

        if (condition) {
          counter += 1;
          const newObj = new Obj(el.name, el.value);
          valuesArr.push(newObj);
          el.parentElement.removeAttribute('data-error');
          el.parentElement.removeAttribute('data-error-visible');
          el.classList.remove('error');
        } else {
          el.parentElement.setAttribute('data-error', message);
          el.parentElement.setAttribute('data-error-visible', 'true');
          el.classList.add('error');
        }
      }

      fields.forEach((el) => {
        checkConditionValidity(el);
      });

      // Final global check
      if (counter === 4) {
        fieldsIsValid = true;
        return valuesArr;
      }
      fieldsIsValid = false;
      valuesArr = [];
      return 0;
    }

    function validateOnSubmit(e) {
      e.preventDefault();
      checkfieldsIsValid();

      if (fieldsIsValid === false) {
        checkfieldsIsValid();
        return false;
      }
      console.log(valuesArr);
      closeContactModal();
      this.reset();
      return true;
    }

    // Validation on Submit
    form.addEventListener('submit', validateOnSubmit);
  }
  validation();
}
export default displayContactModal;
