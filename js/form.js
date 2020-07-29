'use strict';

(function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var IMAGE_SIZE = 70;
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var addressInput = adForm.querySelector('#address');
  var roomsSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var titleInput = adForm.querySelector('#title');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var checkinSelect = adForm.querySelector('#timein');
  var checkoutSelect = adForm.querySelector('#timeout');
  var avatarChooser = adForm.querySelector('#avatar');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var imageChooser = adForm.querySelector('#images');
  var imagePreview = adForm.querySelector('.ad-form__photo');
  var avatarDefaultSrc = avatarPreview.src;

  // форма разблокирована для активного состояния
  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
    window.util.changeDisabledStatus(adFormFieldsets, false);
  };

  var disableForm = function () {
    adForm.reset();
    clearImages();
    adForm.classList.add('ad-form--disabled');
    window.util.changeDisabledStatus(adFormFieldsets, true);
  };

  // функция заполняет поле адреса
  var renderAddress = function (pinPosition) {
    addressInput.value = pinPosition;
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
      capacity: ['0'],
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
    if (priceInput.value > window.util.MAX_PRICE) {
      priceInput.setCustomValidity('Слишком дорого! Цена не должна превышать 1000000р.');
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле. Введите цену.');
    } else {
      priceInput.setCustomValidity('');
    }
    priceInput.reportValidity();
  });

  // валидация типа жилья
  var typePriceErrors = {
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
    priceInput.setAttribute('min', typePriceErrors[typeIndex].minPrice);
    priceInput.setAttribute('placeholder', typePriceErrors[typeIndex].minPrice);

    if (price < typePriceErrors[typeIndex].minPrice) {
      typeSelect.setCustomValidity(typePriceErrors[typeIndex].error);
      typeSelect.reportValidity();
    } else {
      typeSelect.setCustomValidity('');
    }
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

  // загрузка превьюшек фото
  var addPhotoPreview = function (chooser, preview, cb) {
    var file = chooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (cb) {
          preview = cb();
        }
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  // создание элементов для фотографий жилья
  var createImage = function () {
    var imageElement = document.createElement('img');
    imageElement.width = IMAGE_SIZE;
    imageElement.height = IMAGE_SIZE;
    imagePreview.appendChild(imageElement);
    return imageElement;
  };

  // обработчики показа превьюшек
  var avatarChangeHandler = function () {
    addPhotoPreview(avatarChooser, avatarPreview);
  };

  var imageChangeHandler = function () {
    addPhotoPreview(imageChooser, imagePreview, createImage);
  };

  // удаление превью
  var clearImages = function () {
    avatarPreview.src = avatarDefaultSrc;
    var images = imagePreview.querySelectorAll('img');
    images.forEach(function (image) {
      image.remove();
    });
  };

  capacitySelect.addEventListener('change', capacityChangeHandler);
  roomsSelect.addEventListener('change', capacityChangeHandler);
  typeSelect.addEventListener('change', typeChangeHandler);
  priceInput.addEventListener('change', typeChangeHandler);
  checkinSelect.addEventListener('change', checkinChangeHandler);
  checkoutSelect.addEventListener('change', checkoutChangeHandler);
  avatarChooser.addEventListener('change', avatarChangeHandler);
  imageChooser.addEventListener('change', imageChangeHandler);
  validateType();
  validateCapacity();

  window.form = {
    adForm: adForm,
    enable: enableForm,
    disable: disableForm,
    renderAddress: renderAddress
  };
})();
