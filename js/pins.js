'use strict';

(function () {
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
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      fragment.appendChild(getOfferPin(items[i]));
    }
    mapPins.appendChild(fragment);
  };

  // экспорт
  window.pins = {
    renderPins: renderPins
  };
})();
