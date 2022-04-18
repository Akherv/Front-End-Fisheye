function customSelect() {
  // DOM selection
  const oldSelectedOption = document.querySelector('.old-select option[selected]');
  const oldSelectedOptionDefault = document.querySelector('.old-select option:first-child');
  const oldOptions = document.querySelectorAll('.old-select option');
  const listboxWrapper = document.querySelector('.new-select-wrapper');
  const listboxContainer = document.querySelector('.new-select');
  const listboxLabel = document.querySelector('.selection p span');
    // selection to keep focus inside modal
  const  focusableElements =
    '.new-option[aria-selected="true"], [tabindex]:not([tabindex="0"])';
  const firstFocusableElement = document.querySelector(".selection").querySelectorAll(focusableElements)[0];
  const focusableContent = document.querySelector(".selection").querySelectorAll(focusableElements);
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  // Initialisation
  function createNewDOMSelect() {
    if (oldSelectedOption.length === 1) {
      listboxLabel.innerHTML = oldSelectedOption.innerHTML;
    } else {
      listboxLabel.innerHTML = oldSelectedOptionDefault.innerHTML;
    }

    oldOptions.forEach((el) => {
      const newValue = el.value;
      const newHTML = el.innerHTML;
      document.querySelector('.selection').innerHTML += `<div id="${el.value}" class="new-option" data-value="${newValue}" role="option" aria-selected="false" tabindex="-1"><p id="id-${el.value}">${newHTML}</p></div>`;
      if (newValue === 'popularite') {
        document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');
        document.querySelector(".selection").setAttribute('aria-activedescendant', `${newValue}`);
      }
    });
  }
  createNewDOMSelect();

  // DOM selection for element who need to wait for initialisation
  const listbox = document.querySelector('.selection');
  const newOptions = document.querySelectorAll('.new-option');

  function openSelect() {
    // handle change on container
    listboxContainer.classList.add('open');
    listbox.setAttribute('aria-expanded', 'true');
    const listboxLabelOpenContent = document.querySelector('.selection.open p span').textContent;
    // handle change on options
    newOptions.forEach((el) => {
      // if the current option is selected hide from list
      if ((el.textContent).toLowerCase() === listboxLabelOpenContent.toLowerCase()) {
        el.classList.add('hideCurrentOption');
        el.setAttribute('tabindex', '-1');
        if ((el.nextElementSibling != null) && (el.nextElementSibling.style.display !== 'none')) {
          // Move focus to the sibling
          el.nextElementSibling.setAttribute('tabindex', '0');
          el.nextElementSibling.focus();
        } else {
          el.previousElementSibling.setAttribute('tabindex', '0');
          el.previousElementSibling.focus();
        }
      } else { // reveal others options
        el.classList.remove('hideCurrentOption');
        el.classList.add('reveal');
      }
    });
  }

  function closeSelect() {
    // handle change on container
    listboxContainer.classList.remove('open');
    listbox.classList.remove('open');
    listbox.setAttribute('aria-expanded', 'false');
    // handle change on options
    newOptions.forEach((el) => {
      el.classList.remove('reveal');
      el.classList.remove('hideCurrentOption');
      el.setAttribute('tabindex', '-1');
    });
    // Move focus to the listbox container
    document.querySelector('.selection').focus();
  }


  // handle Open / Close filter
  function toggleOpen() {
    const landmarks = document.querySelectorAll('.header, #header a, .contact_button, .media, .heart');
    listbox.classList.toggle('open');
    // remove focus behind
    landmarks.forEach((el) => {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
    });
    if (listbox.classList.contains('open')) {
      openSelect();
    } else {
      closeSelect();
      // reveal focus behind
      landmarks.forEach((el) => {
        if (el.classList.contains('header')) {
          console.log(el)
          el.removeAttribute('tabindex');
        } else {
          el.setAttribute('tabindex', '0');
        }
        el.removeAttribute('aria-hidden');
        el.removeAttribute('inert');
      });
    }
  }

  // open filter on Click
  listbox.addEventListener('click', toggleOpen);

  // open filter on Keyboard Enter
  listbox.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Enter') {
      toggleOpen();
    }
  }, true);

  // close filter on Keyboard Escape
  newOptions.forEach((el) => el.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Escape') {
      toggleOpen();
    }
  }, true));

  // close filter on Click outside
  // document.addEventListener('click', (e) => {
  //   const isClickInsideElement = listboxContainer.contains(e.target);
  //   if (!isClickInsideElement) {
  //     closeSelect();
  //   }
  // });

  // handle options change inside the filter
  function handleChangeOptions(elt) {
    let el = elt;
    if (this) {
      el = this;
    }
    const newValue = el.dataset.value;
    // Selection New Select
    document.querySelector('.selection p span').innerHTML = el.querySelector('p').innerHTML;
    document.querySelector('.new-option[aria-selected="true"]').setAttribute('aria-selected', 'false');
    document.querySelector(`.new-option[data-value="${newValue}"]`).setAttribute('aria-selected', 'true');

    // Selection Old Select
    oldSelectedOption.removeAttribute('selected');
    document.querySelector(`.old-select option[value="${newValue}"]`).setAttribute('selected', '');

    // change textContent
    el.setAttribute('aria-selected', 'true');
    el.setAttribute('tabindex', '0');
    document.querySelector(".selection").setAttribute('aria-activedescendant', `${newValue}`);
    // hide from list selected textContent
    el.classList.remove('reveal');
    el.classList.add('hideCurrentOption');
    const optionsUnselected = [...newOptions].filter((option) => option.dataset.value !== newValue);
    optionsUnselected.forEach((opt) => {
      opt.classList.remove('hideCurrentOption');
      opt.classList.add('reveal');
    });
    closeSelect();
  }

  // fire handle option change on Click
  newOptions.forEach((el) => el.addEventListener('click', handleChangeOptions));

  // fire handle option change on Keyboard
  newOptions.forEach((el) => el.addEventListener('keydown', (e) => {
    if ((e.key || e.code) === 'Enter') {
      e.preventDefault();
      handleChangeOptions(el);
    }

    if ((e.key || e.code) === 'Tab') {
      e.preventDefault();
      // el.setAttribute('tabindex', 0);
      const availableOptions = [...newOptions].filter((option) => !option.classList.contains('hideCurrentOption'));

      const focusOption = availableOptions[0] === document.activeElement
        ? availableOptions[1] : availableOptions[0];
      focusOption.focus();
    }
  }));

   // keep focus inside the slider modal
   document.addEventListener('keydown', function(e) {
    let isTabPressed = e.key === 'Tab' || e.code === 9;
  
    if (!isTabPressed) {
      return;
    }
  
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); 
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus(); 
        e.preventDefault();
      }
    }
  });

}
export default customSelect;
