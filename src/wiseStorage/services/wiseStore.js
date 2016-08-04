(function () {
    'use strict';

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
})();