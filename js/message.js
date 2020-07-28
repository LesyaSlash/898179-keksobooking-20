'use strict';

(function () {
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var successElement = successMessageTemplate.cloneNode(true);

  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var errorElement = errorMessageTemplate.cloneNode(true);

  // успешная отправка формы
  var successPopupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var successPopupClickHandler = function (evt) {
    if (evt.target === successElement) {
      evt.preventDefault();
      closeSuccessPopup();
    }
  };

  var closeSuccessPopup = function () {
    successElement.remove();
    document.removeEventListener('keydown', successPopupEscPressHandler);
    document.removeEventListener('click', successPopupClickHandler);
  };

  var showSuccess = function () {
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
    if (evt.target === errorElement) {
      evt.preventDefault();
      closeErrorPopup();
    }
  };

  var errorButtonClickHandler = function (evt) {
    evt.preventDefault();
    closeErrorPopup();
  };

  var closeErrorPopup = function () {
    errorElement.remove();
    document.removeEventListener('keydown', errorPopupEscPressHandler);
    document.removeEventListener('click', errorPopupClickHandler);
  };

  var showError = function () {
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
