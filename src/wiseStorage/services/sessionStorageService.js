angular
  .module('wise-storage.sessionStorage', ['wise-storage.cookieStorage'])
  .service('sessionStorage', sessionStorageService);

sessionStorageService.$inject = ['$window', '$injector'];

function sessionStorageService($window, $injector) {
  var sessionStorageAvailable = false;

  try {
    $window.sessionStorage.setItem('testKey', 'test');
    $window.sessionStorage.removeItem('testKey');
    sessionStorageAvailable = true;
  } catch (e) {
    sessionStorageAvailable = false;
  }

  function get(key) {
    return $window.sessionStorage.getItem(key);
  }

  function set(key, value) {
    return $window.sessionStorage.setItem(key, value);
  }

  function remove(key) {
    return $window.sessionStorage.removeItem(key);
  }

  function clear() { $window.sessionStorage.clear(); }

  function keys() {
    var k = [];
    for (var key in $window.sessionStorage) {
      if ($window.sessionStorage.hasOwnProperty(key)) {
        k.push(key);
      }
    }
    return k;
  }


  var service = {
    get: get,
    set: set,
    remove: remove,
    clear: clear,
    keys: keys
  };

  if (!sessionStorageAvailable) {
    var cookieStorage = $injector.get('cookieStorage');
    service.get = cookieStorage.get;
    service.set = cookieStorage.set;
    service.remove = cookieStorage.remove;
    service.clear = cookieStorage.clear;
  }

  return service;
}
