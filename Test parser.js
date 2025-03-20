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
    var filter = new Lampa.Filter(object);
    var initialized = false;

    function searchByTag(tag) {
      var url = Defined.localhost + 'tags/' + encodeURIComponent(tag);
      network.req('native', url, function(data) {
        console.log('🔍 Search results:', data);
      }, function(error) {
        console.log('❌ Search error:', error);
      });
    }

    function bypassVIP() {
      Object.defineProperty(window, 'isVIP', { get: function() { return true; } });
      console.log('✅ VIP features unlocked');
    }

    bypassVIP();

    this.create = function() {
      var html = $('<div class="settings-folder selector"><div class="settings-folder__title">HQPorner Plugin</div></div>');
      html.on('hover:enter', function() {
        Lampa.Controller.toggle('content');
      });
      return html;
    };

    this.initialize = function() {
      if (!initialized) {
        initialized = true;
        console.log("✅ Plugin HQPorner Initialized");
      }
    };

    this.start = function() {
      this.initialize();
      Lampa.Controller.enable('content');
    };
  }

  // Проверка на наличие компонента и добавление его в систему
  if (typeof Lampa.Component.add === 'function') {
    Lampa.Component.add('hqporner', component);
  } else {
    console.log('❌ Lampa.Component.add не поддерживается');
  }

  // Добавление в меню настроек
  try {
    Lampa.Settings.main().render().find('.settings-container').append(new component().create());
  } catch (error) {
    console.log('❌ Ошибка при добавлении в меню:', error);
  }

})();
