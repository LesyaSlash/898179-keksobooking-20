'use strict';

(function () {
  var FILTER_DEFAULT_VALUE = 'any';
  var typeFilter = window.map.mapFiltersForm.querySelector('#housing-type');

  typeFilter.addEventListener('change', function () {
    window.card.closeAdCard();
    var filteredOffers = window.offers.filter(function (ad) {
      return typeFilter.value === FILTER_DEFAULT_VALUE || typeFilter.value === ad.offer.type;
    });
    window.pins.renderPins(filteredOffers);
  });
})();
