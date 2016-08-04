angular
  .module('wise-storage.cookieStorage', [])
  .service('cookieStorage', cookieStorageService);

cookieStorageService.$inject = ['$cookies'];

function cookieStorageService($cookies) {
  /*jshint validthis:true */

  this.get = function(key) {
    return $cookies.get(key);
  };

  this.set = function(key, value) {
    return $cookies.put(key, value);
  };

  this.remove = function(key) {
    return $cookies.remove(key);
  };

  this.keys = function() {
    var k = [];

    if(document.cookie)
      k = document.cookie.split(';').map(function(c) { return c.split('=')[0]; });

    return k;
  };

  this.clear = function() {
    var cookies = $cookies.getAll();
    angular.forEach(cookies, function(v, k) {
      $cookies.remove(k);
    });
  };
}
