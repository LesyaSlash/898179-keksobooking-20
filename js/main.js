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
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_HEIGHT_ACTIVE = 84;

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
var getOfferPin = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';

  var pinImage = pinElement.querySelector('img');
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.title;

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

// --------------------------- module3-task3--------------------------------

/* var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var EMPTY_VALUE = 'EMPTY_VALUE';

// тип жилья на русском
var getCardType = function (ad) {
  switch (ad.offer.type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return ad.offer.type;
  }
};

// изменение окончаний существительных
var getMessageRooms = function (ad) {
  var messageRooms = '';
  if (ad.offer.rooms === 1) {
    messageRooms = ' комната';
  } else if (ad.offer.rooms >= 5) {
    messageRooms = ' комнат';
  } else {
    messageRooms = ' комнаты';
  }
  return messageRooms;
};

var getMessageGuests = function (ad) {
  var messageGuests = (ad.offer.guests === 1) ?
    ' гостя' : ' гостей';
  return messageGuests;
};

// создание элемента фичи
var getFeature = function (feature) {
  var featureItem = document.createElement('li');
  featureItem.classList.add('popup__feature');
  featureItem.classList.add('popup__feature--' + feature);
  return featureItem;
};

// добавление фич
var addCardFeatures = function (ad, cardElement) {
  var features = ad.offer.features;
  var cardFeatures = cardElement.querySelector('.popup__features');
  if (features.length > 0) {
    for (var i = 0; i < features.length; i++) {
      cardFeatures.appendChild(getFeature(features[i]));
    }
  } else {
    cardFeatures.classList.add('hidden');
  }
};

// добавление фотографий
var addCardPhotos = function (ad, cardElement) {
  var photos = ad.offer.photos;
  var cardPhotos = cardElement.querySelector('.popup__photos');
  if (photos.length > 0) {
    var cardImage = cardPhotos.querySelector('img');
    for (var i = 0; i < photos.length; i++) {
      var imageCopy = cardImage.cloneNode(true);
      imageCopy.src = photos[i];
      cardPhotos.appendChild(imageCopy);
    }
    cardPhotos.removeChild(cardPhotos.firstElementChild);
  } else {
    cardPhotos.classList.add('hidden');
  }
};

// добавление аватара
var addCardAvatar = function (ad, cardElement) {
  var cardAvatar = cardElement.querySelector('.popup__avatar');
  if (ad.author.avatar) {
    cardAvatar.src = ad.author.avatar;
  } else {
    cardAvatar.classList.add('hidden');
  }
};

// генерирование карточки
var getCard = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = ad.offer.title || EMPTY_VALUE;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address || EMPTY_VALUE;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь' || EMPTY_VALUE;
  cardElement.querySelector('.popup__type').textContent = getCardType(ad) || EMPTY_VALUE;
  cardElement.querySelector('.popup__text--capacity').
    textContent = ad.offer.rooms + getMessageRooms(ad) + ' для ' + ad.offer.guests + getMessageGuests(ad) + '.' || EMPTY_VALUE;
  cardElement.querySelector('.popup__text--time')
    .textContent = 'Заезд после ' + ad.offer.checkin + ' , выезд до ' + ad.offer.checkout + '.' || EMPTY_VALUE;
  cardElement.querySelector('.popup__description').textContent = ad.offer.description || EMPTY_VALUE;
  addCardAvatar(ad, cardElement);
  addCardFeatures(ad, cardElement);
  addCardPhotos(ad, cardElement);

  var childElements = cardElement.querySelectorAll(':scope > *');
  childElements.forEach(function (element) {
    if (element.textContent === EMPTY_VALUE) {
      element.classList.add('hidden');
    }
  });
  return cardElement;
};

// генерирование карточки первого объявления
var card = getCard(offers[0]);

// вставка DOM-элемента в блок .map перед блоком .map__filters-container
var filtersContainer = document.querySelector('.map__filters-container');
filtersContainer.insertAdjacentElement('beforebegin', card); */

// --------------------------- module4-task2--------------------------------
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');

var mapFiltersForm = document.querySelector('.map__filters');
var mapFiltersInputs = mapFiltersForm.querySelectorAll(':scope > *');

var mainPin = map.querySelector('.map__pin--main');

var addressInput = adForm.querySelector('input[name="address"]');
var roomsSelect = adForm.querySelector('select[name="rooms"]');
var capacitySelect = adForm.querySelector('select[name="capacity"]');

// функция блокировки полей форм для неактивного состояния
var disableInputs = function () {
  adFormFieldsets.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });
  mapFiltersInputs.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });
};

// поля форм разблокированы для активного состояния
var enableInputs = function () {
  adFormFieldsets.forEach(function (element) {
    element.removeAttribute('disabled');
  });
  mapFiltersInputs.forEach(function (element) {
    element.removeAttribute('disabled');
  });
};

// карта и форма разблокированы для активного состояния
var enableMap = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
};

// функция рассчитывает положение главного пина на карте
var getPinPosition = function (pin, width, height) {
  var positionX = Math.round(pin.offsetLeft + width / 2);
  var positionY = Math.round(pin.offsetTop + height);

  return positionX + ', ' + positionY;
};

// функция заполняет поле адреса в зависимости от состояния страницы
var renderAdress = function (isServiceActive) {
  if (isServiceActive) {
    addressInput.value = getPinPosition(mainPin, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);
  } else {
    addressInput.value = getPinPosition(mainPin, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);
  }
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
  disableInputs();
  renderAdress(false);
  mainPin.addEventListener('mousedown', mainPinMousedownHandler);
  mainPin.addEventListener('keydown', mainPinEnterPressHandler);
};

// функция перехода в активное состояние
var enableService = function () {
  enableMap();
  enableInputs();
  renderAdress(true);
  renderPins(offers);
  mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
  mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  capacitySelect.addEventListener('change', capacityChangeHandler);
  roomsSelect.addEventListener('change', capacityChangeHandler);
  validateCapacity();
};

// валидация полей "количество комнат" и "количество мест"
var roomsCapacityError = {
  1: {
    capacity: ['1'],
    error: 'Одна комната только для 1 гостя. Измените выбранные параметры.'
  },
  2: {
    capacity: ['1', '2'],
    error: 'Две комнаты для 1 или 2 гостей. Измените выбранные параметры.'
  },
  3: {
    capacity: ['1', '2', '3'],
    error: 'Три комнаты для 1, 2 или 3 гостей. Измените выбранные параметры.'
  },
  100: {
    capacity: ['100'],
    error: 'Сто комнат не предназначены для гостей. Измените выбранные параметры.'
  }
};

var validateCapacity = function () {
  var guestsQuantity = capacitySelect.value;
  var roomsQuantity = roomsSelect.value;
  if (roomsCapacityError[roomsQuantity].capacity.includes(guestsQuantity)) {
    roomsSelect.setCustomValidity('');
  } else {
    roomsSelect.setCustomValidity(roomsCapacityError[roomsQuantity].error);
    roomsSelect.reportValidity();
  }
};

var capacityChangeHandler = function () {
  validateCapacity();
};

disableService();
