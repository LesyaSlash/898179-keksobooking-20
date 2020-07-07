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
  return shuffledElements.slice(0, getRandomNumber(1, items.length + 1));
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
var offers = generateOffers(TOTAL_OFFERS);
var init = function () {

  renderPins(offers);

  map.classList.remove('map--faded'); // временно
};

init();

// --------------------------- module3-task3--------------------------------

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var cardElement = cardTemplate.cloneNode(false);

// добавление кнопки закрытия поп-апа
var addCloseButton = function () {
  cardElement.appendChild(cardTemplate.querySelector('.popup__close'));
};

// добавление заголовка объявления
var addCardTitle = function (offer) {
  var cardTitle = cardTemplate.querySelector('.popup__title');
  if (offer.offer.title) {
    cardTitle.textContent = offer.offer.title;
    cardElement.appendChild(cardTitle);
  }
};

// добавление адреса
var addCardAddress = function (offer) {
  var cardAddress = cardTemplate.querySelector('.popup__text--address');
  if (offer.offer.address) {
    cardAddress.textContent = offer.offer.address;
    cardElement.appendChild(cardAddress);
  }
};

// добавление цены
var addCardPrice = function (offer) {
  var cardPrice = cardTemplate.querySelector('.popup__text--price');
  if (offer.offer.price) {
    cardPrice.textContent = offer.offer.price + '₽/ночь';
    cardElement.appendChild(cardPrice);
  }
};

// тип жилья на русском
var getCardType = function (offer) {
  switch (offer.offer.type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }
  return offer.offer.type;
};

// добавление типа жилья
var addCardType = function (offer) {
  var cardType = cardTemplate.querySelector('.popup__type');
  if (offer.offer.type) {
    cardType.textContent = getCardType(offer);
    cardElement.appendChild(cardType);
  }
};

// добавление количества гостей и комнат + изменение окончаний существительных
var addCardCapacity = function (offer) {
  var cardCapacity = cardTemplate.querySelector('.popup__text--capacity');
  if (offer.offer.rooms && offer.offer.guests) {
    var messageRooms = '';
    if (offer.offer.rooms === 1) {
      messageRooms = ' комната';
    } else if (offer.offer.rooms >= 5) {
      messageRooms = ' комнат';
    } else {
      messageRooms = ' комнаты';
    }

    var messageGuests = (offer.offer.guests === 1) ?
      ' гостя' : ' гостей';

    cardCapacity.textContent = offer.offer.rooms + messageRooms + ' для ' + offer.offer.guests + messageGuests + '.';
    cardElement.appendChild(cardCapacity);
  }
};

// добавление времени заезда и выезда
var addCardTime = function (offer) {
  var cardTime = cardTemplate.querySelector('.popup__text--time');
  if (offer.offer.checkin && offer.offer.checkout) {
    cardTime.textContent = 'Заезд после ' + offer.offer.checkin + ' , выезд до ' + offer.offer.checkout + '.';
    cardElement.appendChild(cardTime);
  }
};

// переменные для features, для удобства проверки пока что здесь, позже вынесу в начало кода
var cardFeaturesTemplate = cardTemplate.querySelector('.popup__features');
var featureWifi = cardFeaturesTemplate.querySelector('.popup__feature--wifi');
var featureDishwasher = cardFeaturesTemplate.querySelector('.popup__feature--dishwasher');
var featureParking = cardFeaturesTemplate.querySelector('.popup__feature--parking');
var featureWasher = cardFeaturesTemplate.querySelector('.popup__feature--washer');
var featureElevator = cardFeaturesTemplate.querySelector('.popup__feature--elevator');
var featureConditioner = cardFeaturesTemplate.querySelector('.popup__feature--conditioner');

// соотносит элементы массива features и элементы списка из разметки
var getFeature = function (feature) {
  switch (feature) {
    case 'wifi':
      return featureWifi;
    case 'dishwasher':
      return featureDishwasher;
    case 'parking':
      return featureParking;
    case 'washer':
      return featureWasher;
    case 'elevator':
      return featureElevator;
    case 'conditioner':
      return featureConditioner;
  }
  return feature;
};

// добавление удобств
var addCardFeatures = function (offer) {
  var features = offer.offer.features;
  if (features.length > 0) {
    var cardFeatures = cardFeaturesTemplate.cloneNode(false);
    for (var i = 0; i < features.length; i++) {
      cardFeatures.appendChild(getFeature(features[i]));
    }
    cardElement.appendChild(cardFeatures);
  }
};

// добавление описания
var addCardDescription = function (offer) {
  var cardDescription = cardTemplate.querySelector('.popup__description');
  if (offer.offer.description) {
    cardDescription.textContent = offer.offer.description;
    cardElement.appendChild(cardDescription);
  }
};

// добавление фотографий
var addCardPhotos = function (offer) {
  var photos = offer.offer.photos;
  var cardPhotosTemplate = cardTemplate.querySelector('.popup__photos');
  if (photos.length > 0) {
    var cardPhotos = cardPhotosTemplate.cloneNode(false);
    var cardImage = cardPhotosTemplate.querySelector('img');

    for (var i = 0; i < photos.length; i++) {
      var imageCopy = cardImage.cloneNode(true);
      imageCopy.src = photos[i];
      cardPhotos.appendChild(imageCopy);
    }
  }
  cardElement.appendChild(cardPhotos);
};

// добавление аватара
var addCardAvatar = function (offer) {
  var cardAvatar = cardTemplate.querySelector('.popup__avatar');
  if (offer.author.avatar) {
    cardAvatar.src = offer.author.avatar;
    cardElement.appendChild(cardAvatar);
  }
};

// генерирование карточки
var getCard = function (item) {
  addCardAvatar(item);
  addCloseButton();
  addCardTitle(item);
  addCardAddress(item);
  addCardPrice(item);
  addCardType(item);
  addCardCapacity(item);
  addCardTime(item);
  addCardFeatures(item);
  addCardDescription(item);
  addCardPhotos(item);
};

// генерирование карточки первого объявления
getCard(offers[0]);

// вставка DOM-элемента в блок .map перед блоком .map__filters-container
var filtersContainer = document.querySelector('.map__filters-container');
filtersContainer.insertAdjacentElement('beforebegin', cardElement);
