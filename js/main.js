'use strict';

(function () {
  // функция для неактивного состояния страницы
  var disableService = function () {
    window.map.disableMap();
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

  disableService();
})();
