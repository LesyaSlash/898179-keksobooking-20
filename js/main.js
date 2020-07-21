'use strict';

var TOTAL_OFFERS = 8;
var MAX_GUESTS = 8;
var MAX_ROOMS = 4;
var MAX_PRICE = 1000000;
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

  // по нажатию на пин открывается карточка объявления
  pinElement.addEventListener('click', function () {
    closeAdCard();
    openAdCard(ad);
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
var offers = generateOffers(TOTAL_OFFERS);

// --------------------------- module3-task3--------------------------------

var cardTemplate = document.querySelector('#card')
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

  // закрытие карточки по клику на крестик
  var cardCloseButton = cardElement.querySelector('.popup__close');
  cardCloseButton.addEventListener('click', closeAdCard);

  return cardElement;
};

// --------------------------- module4-task2--------------------------------
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');

var mapFiltersForm = document.querySelector('.map__filters');
var mapFiltersInputs = mapFiltersForm.querySelectorAll(':scope > *');

var mainPin = map.querySelector('.map__pin--main');

var addressInput = adForm.querySelector('input[name="address"]');
var roomsSelect = adForm.querySelector('select[name="rooms"]');
var capacitySelect = adForm.querySelector('select[name="capacity"]');

// функция блокировки полей форм
var changeDisabledStatus = function (elements, disable) {
  elements.forEach(function (element) {
    element.disabled = disable;
  });
};

// карта и форма разблокированы для активного состояния
var enableMap = function () {
  map.classList.remove('map--faded');
  changeDisabledStatus(mapFiltersInputs, false);
};

var enableForm = function () {
  adForm.classList.remove('ad-form--disabled');
  changeDisabledStatus(adFormFieldsets, false);
};

// проверяет, активна ли страница
var isMapActivated = function () {
  return !map.classList.contains('map--faded');
};

// функция рассчитывает положение главного пина на карте
var getPinPosition = function () {
  var positionX = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2);
  var positionY = (isMapActivated()) ? Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT_ACTIVE)
    : Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2);

  return positionX + ', ' + positionY;
};

// функция заполняет поле адреса
var renderAddress = function (pinPosition) {
  addressInput.value = pinPosition;
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
  changeDisabledStatus(adFormFieldsets, true);
  changeDisabledStatus(mapFiltersInputs, true);
  renderAddress(getPinPosition());
  mainPin.addEventListener('mousedown', mainPinMousedownHandler);
  mainPin.addEventListener('keydown', mainPinEnterPressHandler);
};

// функция перехода в активное состояние
var enableService = function () {
  enableMap();
  enableForm();
  renderAddress(getPinPosition());
  renderPins(offers);
  mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
  mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
};

// валидация полей "количество комнат" и "количество мест"
var roomsCapacityErrors = {
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
  if (roomsCapacityErrors[roomsQuantity].capacity.includes(guestsQuantity)) {
    roomsSelect.setCustomValidity('');
  } else {
    roomsSelect.setCustomValidity(roomsCapacityErrors[roomsQuantity].error);
    roomsSelect.reportValidity();
  }
};

var capacityChangeHandler = function () {
  validateCapacity();
};

disableService();

// --------------------------- module4-task3--------------------------------
// валидация заголовка
var TITLE_MIN_LENGTH = 30;
var TITLE_MAX_LENGTH = 100;

var titleInput = adForm.querySelector('#title');
var priceInput = adForm.querySelector('#price');
var checkinSelect = adForm.querySelector('#timein');
var checkoutSelect = adForm.querySelector('#timeout');

// валидация заголовка
titleInput.addEventListener('input', function () {
  var valueLength = titleInput.value.length;
  if (titleInput.validity.tooShort) {
    titleInput.setCustomValidity('Название слишком короткое. Введите ещё ' + (TITLE_MIN_LENGTH - valueLength) + ' симв.');
  } else if (titleInput.validity.tooLong) {
    titleInput.setCustomValidity('Название слишком длинное. Удалите лишние ' + (valueLength - TITLE_MAX_LENGTH) + ' симв.');
  } else if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Обязательное поле. Добавьте заголовок вашему объявлению');
  } else {
    titleInput.setCustomValidity('');
  }
  titleInput.reportValidity();
});

// валидация цены
priceInput.addEventListener('input', function () {
  if (priceInput.value > MAX_PRICE) {
    priceInput.setCustomValidity('Слишком дорого! Цена не должна превышать 1000000р.');
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле. Введите цену.');
  } else {
    priceInput.setCustomValidity('');
  }
  priceInput.reportValidity();
});

// валидация типа жилья
var typeSelect = adForm.querySelector('#type');
var typePriceErrors = {
  // пробовала изменить свойства по замечанию "Свойства этого объекта
  // должны быть в uppercase. Кавычки в названии свойство лучше
  // не использовать без необходимости." ('bungalo' на BUNGALO), но так
  // не срабатывала валидация ниже по коду, т.к. не получалось обратиться
  // к значению селекта. Вероятно, я что-то не поняла, но не придумала ничего
  // лучше, чем реализовать через индекс выбранной опции. Надеюсь, так тоже подойдет.
  0: {
    type: 'bungalo',
    minPrice: 0,
    error: ''
  },
  1: {
    type: 'flat',
    minPrice: 1000,
    error: 'Минимальная цена квартиры — 1000 р/ночь'
  },
  2: {
    type: 'house',
    minPrice: 5000,
    error: 'Минимальная цена дома — 5000 р/ночь'
  },
  3: {
    type: 'palace',
    minPrice: 10000,
    error: 'Минимальная цена дворца — 10000 р/ночь'
  }
};

var validateType = function () {
  var price = priceInput.value;
  var typeIndex = typeSelect.options.selectedIndex;
  if (price < typePriceErrors[typeIndex].minPrice) {
    typeSelect.setCustomValidity(typePriceErrors[typeIndex].error);
    typeSelect.reportValidity();
  } else {
    typeSelect.setCustomValidity('');
  }
  priceInput.setAttribute('min', typePriceErrors[typeIndex].minPrice);
  priceInput.setAttribute('placeholder', typePriceErrors[typeIndex].minPrice);
};

var typeChangeHandler = function () {
  validateType();
};

// валидация чекин-чекаут
var checkinChangeHandler = function () {
  checkoutSelect.value = checkinSelect.value;
};

var checkoutChangeHandler = function () {
  checkinSelect.value = checkoutSelect.value;
};

capacitySelect.addEventListener('change', capacityChangeHandler);
roomsSelect.addEventListener('change', capacityChangeHandler);
typeSelect.addEventListener('change', typeChangeHandler);
checkinSelect.addEventListener('change', checkinChangeHandler);
checkoutSelect.addEventListener('change', checkoutChangeHandler);
validateType();
validateCapacity();

// открытие карточки объявления
var openAdCard = function (ad) {
  getCard(ad);

  // вставка DOM-элемента в блок .map перед блоком .map__filters-container
  var filtersContainer = document.querySelector('.map__filters-container');
  filtersContainer.insertAdjacentElement('beforebegin', getCard(ad));

  document.addEventListener('keydown', adCardEscPressHandler);
};

// закрытие карточки объявления
var closeAdCard = function () {
  var cardPopup = document.querySelector('.popup');
  if (cardPopup) {
    cardPopup.remove();
  }
  document.removeEventListener('keydown', adCardEscPressHandler);
};

// закрытие карточки по нажатию на Esc
var adCardEscPressHandler = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeAdCard();
  }
};
