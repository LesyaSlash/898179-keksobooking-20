'use strict';

(function () {
  var StatusCodes = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
  };
  var TIMEOUT_IN_MS = 10000;
  var URL = 'https://javascript.pages.academy/keksobooking/data';

  var getXHR = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCodes.OK:
          successHandler(xhr.response);
          break;
        case StatusCodes.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case StatusCodes.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка запроса');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  };

  var loadData = function (successHandler, errorHandler) {
    var xhr = getXHR(successHandler, errorHandler);
    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    loadData: loadData
  };
})();
