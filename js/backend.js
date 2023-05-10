'use strict';

(function () {
  var StatusCode = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
  };
  var TIMEOUT_IN_MS = 10000;
  var URL = {
    LOAD: 'https://dl.dropboxusercontent.com/s/2up1iy6w994janr/data.json?dl=0',
    UPLOAD: 'https://26.javascript.pages.academy/keksobooking'
  };

  var getXHR = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.OK:
          successHandler(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case StatusCode.NOT_FOUND:
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
    xhr.open('GET', URL.LOAD);
    xhr.send();
  };

  var uploadData = function (successHandler, errorHandler, data) {
    var xhr = getXHR(successHandler, errorHandler);
    xhr.open('POST', URL.UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    loadData: loadData,
    uploadData: uploadData
  };
})();
