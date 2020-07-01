'use strict';

var TOTAL_OFFERS = 8;
var MAX_GUESTS = 8;
var MAX_ROOMS = 4;
var MAX_PRICE = 10000;
var MIN_X = 0;
var MIN_Y = 130;
var MAX_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var TITLES = ['Объявление №1', 'Объявление №2', 'Объявление №3', 'Объявление №4', 'Объявление №5', 'Объявление №6', 'Объявление №7', 'Объявление №8'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12: 00', '13: 00', '14: 00'];
var CHECKOUTS = ['12: 00', '13: 00', '14: 00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTIONS = ['Описание №1', 'Описание №2', 'Описание №3', 'Описание №4', 'Описание №5', 'Описание №6', 'Описание №7', 'Описание №8'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');
var layoutMaxX = map.clientWidth;
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

// рандом числа
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// рандом элемента массива
var getRandomElement = function (items) {
  var randomIndex = getRandomNumber(0, items.length - 1);
  return items[randomIndex];
};

// перемешивание массивов (для features и photos)
var shuffleElements = function (items) {
  var clonedItems = items.slice();
  for (var i = 0; i < items.length; i++) {
    var swap = clonedItems[i];
    var j = getRandomNumber(0, items.length);
    clonedItems[i] = clonedItems[j];
    clonedItems[j] = swap;
  }
  return clonedItems;
};

// создание массива случайной длины после перемешивания
var getSlicedElements = function (items) {
  var shuffledElements = shuffleElements(items);
  return shuffledElements.slice(0, getRandomElement(1, items.length));
};

// создание случайного объявления
var createOffer = function (i) {
  var objectAddress = {
    'x': getRandomNumber(MIN_X, layoutMaxX),
    'y': getRandomNumber(MIN_Y, MAX_Y)
  };
  var randomOffer = {
    'author': {
      'avatar': 'img/avatars/user0' + getRandomNumber(1, TOTAL_OFFERS) + '.png'
    },
    'offer': {
      'title': TITLES[i],
      'address': objectAddress.x + ' , ' + objectAddress.y,
      'price': getRandomNumber(0, MAX_PRICE),
      'type': getRandomElement(TYPES),
      'rooms': getRandomNumber(1, MAX_ROOMS),
      'guests': getRandomNumber(1, MAX_GUESTS),
      'checkin': getRandomElement(CHECKINS),
      'checkout': getRandomElement(CHECKOUTS),
      'features': getSlicedElements(FEATURES),
      'description': getRandomElement(DESCRIPTIONS),
      'photos': getSlicedElements(PHOTOS)
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

// создание пина
var getOfferPin = function (offer) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = offer.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = offer.location.y - PIN_HEIGHT + 'px';

  var pinImage = pinElement.querySelector('img');
  pinImage.src = offer.author.avatar;
  pinImage.alt = offer.offer.title;

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

var init = function () {
  var offers = generateOffers(TOTAL_OFFERS);
  renderPins(offers);

  map.classList.remove('map--faded'); // временно
};

init();
