'use strict';

(function () {
  var MAX_PINS_COUNT = 5;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  // создание пина
  var getOfferPin = function (ad) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
    pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';

    var pinImage = pinElement.querySelector('img');
    pinImage.src = ad.author.avatar;
    pinImage.alt = ad.offer.title;

    // по нажатию на пин открывается карточка объявления
    pinElement.addEventListener('click', function () {
      window.card.closeAdCard();
      window.card.openAdCard(ad);
    });

    return pinElement;
  };

  // отрисовка меток
  var renderPins = function (items) {
    removePins();
    var fragment = document.createDocumentFragment();
    items.slice(0, MAX_PINS_COUNT).forEach(function (item) {
      fragment.appendChild(getOfferPin(item));
    });
    mapPins.appendChild(fragment);
  };

  // удаление меток
  var removePins = function () {
    var renderedPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    renderedPins.forEach(function (pin) {
      pin.remove();
    });
  };

  // экспорт
  window.pins = {
    renderPins: renderPins,
    removePins: removePins
  };
})();
