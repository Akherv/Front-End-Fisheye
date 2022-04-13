function displayContactModal() {
  const body = document.querySelector('body');
  const main = document.querySelector('main');
  const header = document.querySelector('header a');
  const selection = document.querySelector('.selection');
  const contactModalBtn = document.querySelector('.photograph-header .contact_button');
  const contactModal = document.getElementById('contact_modal');
  const contactModalCloseBtn = document.querySelector('#contact_modal .closeBtn');
  const contactModalSendBtn = document.querySelector('#contact_modal .contact_button');
  const form = document.querySelector('form');
  const fields = document.querySelectorAll('input');
  const textarea = form['Your message'];

  // contactModalCloseBtn.focus();

  function openContactModal() {
    const mediasPortfolioBtn = document.querySelectorAll('.media');
    const likesBtn = document.querySelectorAll('.heart');
    contactModal.style.display = 'block';
    contactModal.setAttribute('aria-hidden', 'false');
    contactModal.setAttribute('tabindex', '0');
    body.style.overflow = 'hidden';
    body.setAttribute('aria-hidden', 'true');
    body.setAttribute('tabindex', '-1');
    header.setAttribute('aria-hidden', 'true');
    header.setAttribute('tabindex', '-1');
    main.setAttribute('aria-hidden', 'true');
    main.setAttribute('tabindex', '-1');
    selection.setAttribute('aria-hidden', 'true');
    [...likesBtn].forEach((el) => el.setAttribute('tabindex', '-1'));
    [...mediasPortfolioBtn].forEach((el) => el.setAttribute('tabindex', '-1'));
    [...likesBtn].forEach((el) => {
      console.log(el.getAttribute('tabindex'));
    });
    [...mediasPortfolioBtn].forEach((el) => {
      console.log(el.getAttribute('tabindex'));
    });
    // console.log([...mediasPortfolioBtn].forEach((el) => el.getAttribute('tabindex')));
    // form['First name'].focus();
    selection.setAttribute('tabindex', '-1');
  }

  function closeContactModal() {
    const mediasPortfolioBtn = document.querySelectorAll('.media');
    const likesBtn = document.querySelectorAll('.heart');
    contactModal.style.display = 'none';
    contactModal.setAttribute('aria-hidden', 'true');
    // contactModal.setAttribute('tabindex', '0');
    body.style.overflow = 'scroll';
    // body.setAttribute('aria-hidden', 'false');
    // body.setAttribute('tabindex', '0');
    // main.setAttribute('aria-hidden', 'false');
    // main.setAttribute('tabindex', '0');
    // likesBtn.forEach((el) => el.setAttribute('tabindex', '0'));
    // mediasPortfolioBtn.forEach((el) => el.setAttribute('tabindex', '0'));
    // contactModalBtn.focus();
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
    if (event.keyCode === 9) {
      event.preventDefault;
      // contactModalCloseBtn.focus();
    }
  }, true);

  contactModalCloseBtn.addEventListener('keydown', (event) => {
    if ((event.key || event.code) === 'Enter') {
      closeContactModal();
    }
  }, true);

  // Global validation state
  let fieldsIsValid = false;
  const valuesArr = [];

  function checkfieldsIsValid() {
    let counter = 0;

    const textareaConditionIsValid = textarea.value.trim() !== '';

    class Obj {
      constructor(name, value) {
        this.name = name;
        this.value = value;
      }
    }

    fields.forEach((el) => {
      if (el.checkValidity()) {
        counter += 1;
        const newObj = new Obj(el.name, el.value);
        valuesArr.push(newObj);
      }
    });
    if (textareaConditionIsValid) {
      counter += 1;
      const newObj = new Obj(textarea.name, textarea.value);
      valuesArr.push(newObj);
    }

    // Final global check
    if (counter === 4) {
      fieldsIsValid = true;
      return valuesArr;
    }
    fieldsIsValid = false;
    return 0;
  }

  function validateOnSubmit(e) {
    e.preventDefault();
    checkfieldsIsValid();

    if (fieldsIsValid === false) {
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
export default displayContactModal();
