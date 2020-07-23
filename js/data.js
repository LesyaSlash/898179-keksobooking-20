'use strict';

(function () {
  var TOTAL_OFFERS = 8;
  var MAX_GUESTS = 8;
  var MAX_ROOMS = 4;
  var MIN_X = 0;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var TITLES = ['Объявление №1', 'Объявление №2', 'Объявление №3', 'Объявление №4', 'Объявление №5', 'Объявление №6', 'Объявление №7', 'Объявление №8'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12: 00', '13: 00', '14: 00'];
  var CHECKOUTS = ['12: 00', '13: 00', '14: 00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTIONS = ['Описание №1', 'Описание №2', 'Описание №3', 'Описание №4', 'Описание №5', 'Описание №6', 'Описание №7', 'Описание №8'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var map = document.querySelector('.map');
  var layoutMaxX = map.clientWidth;

  // создание случайного объявления
  var createOffer = function (i) {
    var objectAddress = {
      'x': window.util.getRandomNumber(MIN_X, layoutMaxX),
      'y': window.util.getRandomNumber(MIN_Y, MAX_Y)
    };
    var randomOffer = {
      'author': {
        'avatar': 'img/avatars/user0' + window.util.getRandomNumber(1, TOTAL_OFFERS) + '.png'
      },
      'offer': {
        'title': TITLES[i],
        'address': objectAddress.x + ' , ' + objectAddress.y,
        'price': window.util.getRandomNumber(0, window.util.MAX_PRICE),
        'type': window.util.getRandomElement(TYPES),
        'rooms': window.util.getRandomNumber(1, MAX_ROOMS),
        'guests': window.util.getRandomNumber(1, MAX_GUESTS),
        'checkin': window.util.getRandomElement(CHECKINS),
        'checkout': window.util.getRandomElement(CHECKOUTS),
        'features': window.util.getSlicedElements(FEATURES),
        'description': window.util.getRandomElement(DESCRIPTIONS),
        'photos': window.util.getSlicedElements(PHOTOS)
      },
      'location': objectAddress
    };
    return randomOffer;
  };

  // создание массива объектов
  var generateOffers = function (totalOffers) {
    var offers = [];
    for (var i = 0; i < totalOffers; i++) {
      offers.push(createOffer(i));
    }
    return offers;
  };

  window.data = {
    offers: generateOffers(TOTAL_OFFERS)
  };
})();
