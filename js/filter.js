'use strict';

(function () {
  var FILTER_DEFAULT_VALUE = 'any';
  var filtersForm = document.querySelector('.map__filters');
  var filtersInputs = filtersForm.querySelectorAll(':scope > *');

  var typeFilter = filtersForm.querySelector('#housing-type');
  var priceFilter = filtersForm.querySelector('#housing-price');
  var roomsFilter = filtersForm.querySelector('#housing-rooms');
  var guestsFilter = filtersForm.querySelector('#housing-guests');
  var featuresFilter = filtersForm.querySelector('#housing-features');

  var enableFilter = function () {
    window.util.changeDisabledStatus(filtersInputs, false);
  };

  var disableFilter = function () {
    window.util.changeDisabledStatus(filtersInputs, true);
  };

  // фильтр по цене
  var PriceRange = {
    LOW: 10000,
    HIGH: 50000
  };

  var comparePrice = function (adParameter) {
    switch (priceFilter.value) {
      case 'low':
        return adParameter < PriceRange.LOW;
      case 'high':
        return adParameter > PriceRange.HIGH;
      case 'middle':
        return adParameter >= PriceRange.LOW && adParameter <= PriceRange.HIGH;
      default:
        return true;
    }
  };

  // общий фильтр для типа, комнат и гостей
  var compareFilter = function (filterSelect, adParameter) {
    return filterSelect.value === FILTER_DEFAULT_VALUE
      || filterSelect.value === String(adParameter);
  };

  // фильтр фич
  var compareFeatures = function (adParameter) {
    var checkedFeatures = featuresFilter.querySelectorAll('input:checked');
    var features = Array.from(checkedFeatures);
    return features.every(function (feature) {
      return adParameter.includes(feature.value);
    });
  };

  // объединение фильтров
  var getData = function (ads) {
    return ads.filter(function (ad) {
      return compareFilter(typeFilter, ad.offer.type)
        && comparePrice(ad.offer.price)
        && compareFilter(roomsFilter, ad.offer.rooms)
        && compareFilter(guestsFilter, ad.offer.guests)
        && compareFeatures(ad.offer.features);
    });
  };

  window.filter = {
    getData: getData,
    filtersForm: filtersForm,
    enable: enableFilter,
    disable: disableFilter,
  };
})();
