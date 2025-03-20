(function() {
  'use strict';

  var Defined = {
    api: 'lampac',
    localhost: 'https://hqpornerxxx.com/',
    apn: 'https://apn.watch/'
  };

  var unic_id = Lampa.Storage.get('lampac_unic_id', '');
  if (!unic_id) {
    unic_id = Lampa.Utils.uid(8).toLowerCase();
    Lampa.Storage.set('lampac_unic_id', unic_id);
  }

  if (!window.rch) {
    Lampa.Utils.putScript(["https://rc.bwa.to/invc-rch.js"], function() {}, false, function() {
      if (!window.rch.startTypeInvoke)
        window.rch.typeInvoke('https://rc.bwa.to', function() {});
    }, true);
  }

  function BlazorNet() {
    this.net = new Lampa.Reguest();
    this.timeout = function(time) {
      this.net.timeout(time);
    };
    this.req = function(type, url, success, error, post) {
      var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var path = url.split(Defined.localhost).pop().split('?');
      if (path[0].indexOf('http') >= 0) return this.net[type](url, success, error, post, params);
      DotNet.invokeMethodAsync("JinEnergy", path[0], path[1]).then(function(result) {
        success(Lampa.Arrays.decodeJson(result, {}));
      }).catch(function(e) {
        console.log('Blazor', 'error:', e);
        error(e);
      });
    };
  }

  function component(object) {
    var network = new BlazorNet();
    var scroll = new Lampa.Scroll({ mask: true, over: true });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var sources = {};
    var last;
    var source;
    var balanser;
    var initialized;
    var images = [];

    function searchByTag(tag) {
      var url = Defined.localhost + 'tags/' + encodeURIComponent(tag);
      network.req('native', url, function(data) {
        console.log('Search results:', data);
      }, function(error) {
        console.log('Search error:', error);
      });
    }

    function bypassVIP() {
      Object.defineProperty(window, 'isVIP', { get: function() { return true; } });
      console.log('VIP features unlocked');
    }

    bypassVIP();
    
    this.initialize = function() {
      this.loading(true);
      filter.onSearch = function(value) {
        searchByTag(value);
      };
      filter.render().find('.selector').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      filter.render().find('.filter--search').appendTo(filter.render().find('.torrent-filter'));
      this.loading(false);
    };

    this.start = function() {
      if (!initialized) {
        initialized = true;
        this.initialize();
      }
      Lampa.Controller.enable('content');
    };
  }
  
  Lampa.Component.add('hqporner', component);
})();
