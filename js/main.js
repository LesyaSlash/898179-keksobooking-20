'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');


  // функция для неактивного состояния страницы
  var disableService = function () {
    window.map.disableMap();
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

  // отправка формы
  var uploadSuccessHandler = function () {
    window.message.showSuccess();
    disableService();
  };

  var uploadErrorHandler = function () {
    window.message.showError();
  };

  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(uploadSuccessHandler, uploadErrorHandler, new FormData(adForm));
  });

  // очистка формы
  window.form.adForm.addEventListener('reset', function () {
    disableService();
  });

  disableService();
})();
