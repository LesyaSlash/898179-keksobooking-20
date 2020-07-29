'use strict';

(function () {
  // функция для неактивного состояния страницы
  var disableService = function () {
    window.map.disable();
    window.pins.remove();
    window.form.disable();
    window.filter.disable();
    window.form.renderAddress(window.map.getPinPosition());
    window.map.mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    window.map.mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  var successLoadHandler = function (data) {
    window.pins.render(data);
    window.offers = data;
  };

  // функция перехода в активное состояние
  var enableService = function () {
    window.map.enable();
    window.form.enable();
    window.filter.enable();
    window.form.renderAddress(window.map.getPinPosition());
    window.backend.loadData(successLoadHandler);
    window.map.mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    window.map.mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
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

  // отправка формы
  var uploadSuccessHandler = function () {
    window.message.showSuccess();
    disableService();
  };

  var uploadErrorHandler = function () {
    window.message.showError();
  };

  window.form.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.uploadData(uploadSuccessHandler, uploadErrorHandler, new FormData(window.form.adForm));
  });

  // очистка формы
  window.form.adForm.addEventListener('reset', function () {
    disableService();
  });

  // фильтры по клику
  var debouncedChangeFilterCallback = window.debounce(function () {
    var filteredOffers = window.filter.getData(window.offers);
    window.card.closeAd();
    window.pins.render(filteredOffers);
  });

  window.filter.filtersForm.addEventListener('change', function () {
    debouncedChangeFilterCallback();
  });

  disableService();
})();
