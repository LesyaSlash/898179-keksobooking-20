'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  // функция для неактивного состояния страницы
  var disableService = function () {
    window.map.disableMap();
    window.map.setMainPinPosition();
    window.pins.removePins();
    window.form.disableForm();
    window.form.renderAddress(window.map.getPinPosition());
    window.map.mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    window.map.mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  // функция перехода в активное состояние
  var enableService = function () {
    window.map.enableMap();
    window.form.enableForm();
    window.form.renderAddress(window.map.getPinPosition());
    window.backend.loadData(window.pins.renderPins);
    window.map.mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    window.map.mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  // обработчик нажатия левой кнопки мыши
  var mainPinMousedownHandler = function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      enableService();
    }
  };

  // обработчик нажатия клавиши Enter
  var mainPinEnterPressHandler = function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      enableService();
    }
  };

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
    disableService();
  };

  var openSuccessPopup = function () {
    var successElement = successMessageTemplate.cloneNode(true);
    document.querySelector('main').appendChild(successElement);

    document.addEventListener('keydown', successPopupEscPressHandler);
    document.addEventListener('click', successPopupClickHandler);
  };

  var uploadSuccessHandler = function () {
    openSuccessPopup();
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

  var openErrorPopup = function () {
    var errorElement = errorMessageTemplate.cloneNode(true);
    var message = document.querySelector('main').appendChild(errorElement);
    var errorButton = message.querySelector('.error__button');

    document.addEventListener('keydown', errorPopupEscPressHandler);
    document.addEventListener('click', errorPopupClickHandler);
    errorButton.addEventListener('click', errorButtonClickHandler);
  };

  var uploadErrorHandler = function () {
    openErrorPopup();
  };

  // отправка формы
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(uploadSuccessHandler, uploadErrorHandler, new FormData(adForm));
  });

  // очистка формы
  adForm.addEventListener('reset', function () {
    disableService();
  });

  disableService();
})();
