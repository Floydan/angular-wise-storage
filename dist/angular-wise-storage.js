(function() {
  'use strict';

angular.module('wise-storage', [
  'wise-storage.store'
]);

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

angular
  .module('wise-storage.internalStore', ['wise-storage.localStorage', 'wise-storage.sessionStorage'])
  .factory('InternalStore', internalStoreFactory);

internalStoreFactory.$inject = ['$log', '$injector'];

function internalStoreFactory($log, $injector) {
  /*jshint validthis:true */

  function InternalStore(namespace, storage, delimiter, useCache) {
    this.namespace = namespace || null;
    if (angular.isUndefined(useCache) || useCache === null) {
      useCache = true;
    }
    this.useCache = useCache;
    this.delimiter = delimiter || '.';
    this.inMemoryCache = {};
    this.storage = $injector.get(storage || 'localStorage');
  }

  InternalStore.prototype.getNamespacedKey = function (key) {
    if (!this.namespace) {
      return key;
    } else {
      return [this.namespace, key].join(this.delimiter);
    }
  };

  InternalStore.prototype.set = function (name, elem) {
    if (this.useCache) {
      this.inMemoryCache[name] = elem;
    }
    this.storage.set(this.getNamespacedKey(name), JSON.stringify(elem));
  };

  InternalStore.prototype.get = function (name) {
    var obj = null;
    if (this.useCache && name in this.inMemoryCache) {
      return this.inMemoryCache[name];
    }
    var saved = this.storage.get(this.getNamespacedKey(name));
    try {

      if (typeof saved === 'undefined' || saved === 'undefined') {
        obj = undefined;
      } else {
        obj = JSON.parse(saved);
      }

      if (this.useCache) {
        this.inMemoryCache[name] = obj;
      }
    } catch (e) {
      $log.error('Error parsing saved value', e);
      this.remove(name);
    }
    return obj;
  };

  InternalStore.prototype.remove = function (name) {
    if (this.useCache) {
      this.inMemoryCache[name] = null;
    }
    this.storage.remove(this.getNamespacedKey(name));
  };

  InternalStore.prototype.clear = function () {
    this.inMemoryCache = {};
    this.storage.clear();
  };


  InternalStore.prototype.keys = function () {
    this.storage.keys(this.namespace);
  };

  return InternalStore;
}

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

  if (!sessionStorageAvailable) {
    var cookieStorage = $injector.get('cookieStorage');
    service.get = cookieStorage.get;
    service.set = cookieStorage.set;
    service.remove = cookieStorage.remove;
    service.clear = cookieStorage.clear;
  }

  return service;
}

angular
  .module('wise-storage.store', ['wise-storage.internalStore'])
  .provider('wiseStore', wiseStoreProvider);

function wiseStoreProvider() {
  /*jshint validthis:true */
  var self = this;

  self.storage = 'localStorage';
  self.caching = true;
  self.prefix = 'wise';
  self.delimiter = '.';
  self.cookie = {
    expiry: 30,
    path: '/'
  };

  self.setStore = function (storage) {
    if (storage && angular.isString(storage)) {
      self.storage = storage;
    }
    return this;
  };

  self.setCaching = function (useCache) {
    self.caching = !!useCache;
    return this;
  };

  self.setPrefix = function (prefix) {
    if (prefix && angular.isString(prefix)) {
      self.prefix = prefix;
    }
    return this;
  };

  self.setDelimiter = function (delimiter) {
    if (delimiter && angular.isString(delimiter)) {
      self.delimiter = delimiter;
    }
    return this;
  };

  self.setStorageCookie = function (exp, path, domain) {
    self.cookie.expiry = exp || self.cookie.expiry;
    self.cookie.path = path || self.cookie.path;
    self.cookie.domain = domain || self.cookie.domain;
    return this;
  };

  self.$get = storeFactory;

    storeFactory.$inject = ['InternalStore'];

    function storeFactory(internalStore) {
      var store = new internalStore(self.prefix, self.storage, self.delimiter, self.useCache);

      store.getNamespacedStore = function (namespace, storage, delimiter, useCache) {
        return new internalStore(namespace, storage, delimiter, useCache);
      };

      return store;
    }
}

}());
