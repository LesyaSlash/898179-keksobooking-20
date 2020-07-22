'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;
  var map = document.querySelector('.map');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersInputs = mapFiltersForm.querySelectorAll(':scope > *');

  var mainPin = map.querySelector('.map__pin--main');

  // карта разблокирована для активного состояния
  var enableMap = function () {
    map.classList.remove('map--faded');
    window.util.changeDisabledStatus(mapFiltersInputs, false);
  };

  // проверяет, активна ли страница
  var isMapActivated = function () {
    return !map.classList.contains('map--faded');
  };

  // функция рассчитывает положение главного пина на карте
  var getPinPosition = function () {
    var positionX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2);
    var positionY = (isMapActivated()) ? Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT_ACTIVE) :
      Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2);

    return positionX + ', ' + positionY;
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

  // функция для неактивного состояния страницы
  var disableService = function () {
    window.util.changeDisabledStatus(window.form.adFormFieldsets, true);
    window.util.changeDisabledStatus(mapFiltersInputs, true);
    window.form.renderAddress(getPinPosition());
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  // функция перехода в активное состояние
  var enableService = function () {
    enableMap();
    window.form.enableForm();
    window.form.renderAddress(getPinPosition());
    window.pins.renderPins(window.data.offers);
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  disableService();
})();
