'use strict';

(function () {
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
      features.forEach(function (feature) {
        cardFeatures.appendChild(getFeature(feature));
      });
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
      photos.forEach(function (photo) {
        var imageCopy = cardImage.cloneNode(true);
        imageCopy.src = photo;
        cardPhotos.appendChild(imageCopy);
      });
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
    cardCloseButton.addEventListener('click', closeButtonClickHandler);

    return cardElement;
  };

  // открытие карточки объявления
  var openAdCard = function (ad) {
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

  var closeButtonClickHandler = function () {
    closeAdCard();
  };

  // закрытие карточки по нажатию на Esc
  var adCardEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeAdCard();
    }
  };

  // экспорт
  window.card = {
    openAd: openAdCard,
    closeAd: closeAdCard
  };
})();
