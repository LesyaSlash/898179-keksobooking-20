'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;
  var map = document.querySelector('.map');

  var mainPin = map.querySelector('.map__pin--main');
  var mainPinStartPosition = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };

  // возврат метки в исходное положение
  var setMainPinPosition = function () {
    mainPin.style.left = mainPinStartPosition.x;
    mainPin.style.top = mainPinStartPosition.y;
  };

  // карта разблокирована для активного состояния
  var enableMap = function () {
    map.classList.remove('map--faded');
  };

  var disableMap = function () {
    map.classList.add('map--faded');
    setMainPinPosition();
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
    enable: enableMap,
    disable: disableMap,
  };
})();
