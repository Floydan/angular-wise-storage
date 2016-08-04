angular
  .module('wise-storage.localStorage', ['wise-storage.cookieStorage'])
  .service('localStorage', localStorageService);

localStorageService.$inject = ['$window', '$injector'];

function localStorageService($window, $injector) {
  var localStorageAvailable = false;

  try {
    $window.localStorage.setItem('testKey', 'test');
    $window.localStorage.removeItem('testKey');
    localStorageAvailable = true;
  } catch (e) {
    localStorageAvailable = false;
  }

  function get(key) {
    return $window.localStorage.getItem(key);
  }

  function set(key, value) {
    return $window.localStorage.setItem(key, value);
  }

  function remove(key) {
    return $window.localStorage.removeItem(key);
  }

  function clear() { $window.localStorage.clear(); }

  function keys(namespace) {
    var k = [];
    for (var key in $window.localStorage) {
      if ($window.localStorage.hasOwnProperty(key)) {
        if(namespace)
        {
          var r = new RegExp('^' + namespace.replace('/\\./g', '\\.') + '\\.');
          if(r.test(key))
            k.push(key);
        }
        else {
          k.push(key);
        }
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

  if (!localStorageAvailable) {
    var cookieStorage = $injector.get('cookieStorage');
    service.get = cookieStorage.get;
    service.set = cookieStorage.set;
    service.remove = cookieStorage.remove;
    service.clear = cookieStorage.clear;
  }

  return service;
}
