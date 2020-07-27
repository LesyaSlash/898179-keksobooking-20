'use strict';

(function () {
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  // успешная отправка формы
  var successPopupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var successPopupClickHandler = function (evt) {
    if (evt.target === document.querySelector('.success')) {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var closeSuccessPopup = function () {
    document.querySelector('.success').remove();
    document.removeEventListener('keydown', successPopupEscPressHandler);
    document.removeEventListener('click', successPopupClickHandler);
  };

  var showSuccess = function () {
    var successElement = successMessageTemplate.cloneNode(true);
    document.querySelector('main').appendChild(successElement);

    document.addEventListener('keydown', successPopupEscPressHandler);
    document.addEventListener('click', successPopupClickHandler);
  };

  // ошибка при отправке формы
  var errorPopupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeErrorPopup();
    }
  };

  var errorPopupClickHandler = function (evt) {
    if (evt.target === document.querySelector('.error')) {
      evt.preventDefault();
      closeErrorPopup();
    }
  };

  var errorButtonClickHandler = function (evt) {
    evt.preventDefault();
    closeErrorPopup();
  };

  var closeErrorPopup = function () {
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', errorPopupEscPressHandler);
    document.removeEventListener('click', errorPopupClickHandler);
  };

  var showError = function () {
    var errorElement = errorMessageTemplate.cloneNode(true);
    var message = document.querySelector('main').appendChild(errorElement);
    var errorButton = message.querySelector('.error__button');

    document.addEventListener('keydown', errorPopupEscPressHandler);
    document.addEventListener('click', errorPopupClickHandler);
    errorButton.addEventListener('click', errorButtonClickHandler);
  };

  // экспорт
  window.message = {
    showSuccess: showSuccess,
    showError: showError
  };
})();
