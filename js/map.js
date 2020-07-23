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

  var disableMap = function () {
    map.classList.add('map--faded');
    window.util.changeDisabledStatus(mapFiltersInputs, true);
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

  window.map = {
    MAIN_PIN_WIDTH: MAIN_PIN_WIDTH,
    MAIN_PIN_HEIGHT_ACTIVE: MAIN_PIN_HEIGHT_ACTIVE,
    mainPin: mainPin,
    getPinPosition: getPinPosition,
    enableMap: enableMap,
    disableMap: disableMap
  };

})();
