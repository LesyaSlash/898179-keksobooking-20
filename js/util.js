'use strict';

(function () {
  var MAX_PRICE = 1000000;

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

  // функция блокировки полей форм
  var changeDisabledStatus = function (elements, disable) {
    elements.forEach(function (element) {
      element.disabled = disable;
    });
  };

  // экспорт
  window.util = {
    MAX_PRICE: MAX_PRICE,
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getSlicedElements: getSlicedElements,
    changeDisabledStatus: changeDisabledStatus
  };
})();
