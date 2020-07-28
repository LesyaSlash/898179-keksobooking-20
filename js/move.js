'use strict';

(function () {
  var mainMovingPin = window.map.mainPin;

  // Пределы перемещения по карте
  var mapBorders = {
    top: window.util.MIN_Y - window.map.MAIN_PIN_HEIGHT_ACTIVE,
    bottom: window.util.MAX_Y - window.map.MAIN_PIN_HEIGHT_ACTIVE,
    left: window.util.MIN_X - Math.ceil(window.map.MAIN_PIN_WIDTH / 2),
    right: window.util.layoutMaxX - Math.ceil(window.map.MAIN_PIN_WIDTH / 2)
  };

  mainMovingPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newCoords = {
        x: mainMovingPin.offsetLeft - shift.x,
        y: mainMovingPin.offsetTop - shift.y
      };

      // проверка перемещения в рамках границ
      if (newCoords.y < mapBorders.top) {
        mainMovingPin.style.top = mapBorders.top + 'px';
      } else if (newCoords.y > mapBorders.bottom) {
        mainMovingPin.style.top = mapBorders.bottom + 'px';
      } else {
        mainMovingPin.style.top = newCoords.y + 'px';
      }

      if (newCoords.x < mapBorders.left) {
        mainMovingPin.style.left = mapBorders.left + 'px';
      } else if (newCoords.x > mapBorders.right) {
        mainMovingPin.style.left = mapBorders.right + 'px';
      } else {
        mainMovingPin.style.left = newCoords.x + 'px';
      }

      window.form.renderAddress(window.map.getPinPosition());
    };

    var mainPinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  });
})();
