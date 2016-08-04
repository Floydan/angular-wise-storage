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

  this.keys = function(namespace) {
    var k = [];

    if(document.cookie) {
      var ks = ((document.cookie || '').split(';') || []).map(function(c) { return c.split('=')[0].trim(); });
      if(namespace)
      {
        var r = new RegExp('^' + namespace + '\\.');
        for(var i = 0, l = ks.length; i < l; i++) {
          if(r.test(ks[i]))
            k.push(ks[i]);
        }
      }
      else {
        k = ks;
      }
    }

    return k;
  };

  this.clear = function() {
    var cookies = $cookies.getAll();
    angular.forEach(cookies, function(v, k) {
      $cookies.remove(k);
    });
  };
}
