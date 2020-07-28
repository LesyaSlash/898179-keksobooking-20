'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');
  var filtersInputs = filtersForm.querySelectorAll(':scope > *');

  var enableFilter = function () {
    window.util.changeDisabledStatus(filtersInputs, false);
  };

  var disableFilter = function () {
    window.util.changeDisabledStatus(filtersInputs, true);
  };

  window.filter = {
    filtersForm: filtersForm,
    enableFilter: enableFilter,
    disableFilter: disableFilter
  };
})();
