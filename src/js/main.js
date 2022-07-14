'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /**
   * Switching Inputs Status
   */
  const inputsSwitcherBtns = document.querySelectorAll('.js-input-switcher');
  inputsSwitcherBtns.forEach( el => {
    el.addEventListener('click', function () {
      let thisStatus = this.dataset.status;
      let thisTargetEl = document.querySelector(this.dataset.target);
      thisTargetEl.disabled = !thisTargetEl.disabled;
      thisStatus === 'save' ?
        this.dataset.status = 'change' :
        this.dataset.status = 'save';
    });
  });

  /**
   * Init Phone Mask
   */
  const phoneMaskInputs = document.querySelectorAll('[type="tel"]');
  phoneMaskInputs.forEach( el => {
    IMask (
      el, {
        mask: '+{7}(000)000-0000'
      });
  });

  /**
   * Accordion
   */
  const accordion = document.querySelectorAll('.accordion');
  accordion.forEach( el => {
    const accordionHead = el.querySelector('.accordion__head');
    accordionHead.addEventListener('click', function () {
      el.classList.toggle('opened');
    });
  });

});