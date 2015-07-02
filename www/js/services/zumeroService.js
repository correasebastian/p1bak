app.factory('zumeroService', [
  '$q',
  '$cordovaDevice',
  '$cordovaSQLite',
  'offlineService',
  'intermediateService',
  'updateSyncService',
  'toastService',
  '$timeout',
  'ngAuthSettings',
  '$interval',
  '$ionicLoading',
  // 'onlineStatusService',
  function ($q, $cordovaDevice, $cordovaSQLite, offlineService, intermediateService, updateSyncService, toastService, $timeout, ngAuthSettings, $interval, $ionicLoading) {
    var zumero = null;
    var interval = null;
    var intervalEj = null;
    var nEj = 0;
    var n = 0;
    var zumeroServiceFactory = {};
    var _setDbPath = function () {
      var _options = {
        Android: '/data/data/' + zumeroServiceFactory.packageName + '/databases/' + zumeroServiceFactory.dbfileComplete,
        iOS: 'cdvfile://localhost/persistent/' + zumeroServiceFactory.dbfileComplete,
        win32nt: '/' + zumeroServiceFactory.dbfileComplete
      };
      zumeroServiceFactory.dbpath = _options[$cordovaDevice.getPlatform()];
    };
    var _setZumero = function (dbfile) {
      zumeroServiceFactory.dbfile = dbfile;
      zumeroServiceFactory.dbfileComplete = zumeroServiceFactory.dbfile + '.db';
      //open db con sqliteplugin brody
      db = $cordovaSQLite.openDB(zumeroServiceFactory.dbfileComplete, 1);
      zumero = cordova.require('cordova/plugin/zumero');
      zumeroServiceFactory.server = ngAuthSettings.apiServiceBaseUri + ':8080/';
      //http://190.145.39.138:8080/';
      //'http://192.168.0.51:8080/';
      // TODO: DEPENDE SI ESTOY EN MI CASA O EN LA OFICINA'http://192.168.1.13:8080/';
      zumeroServiceFactory.packageName = 'com.ajustev.b';
      _setDbPath();
    };
    // TODO:  recordar k esto es una promesa y desencadena acciones, si es resuelta o si es reject , vallidar
    var _zync = function (i) {
      var q = $q.defer();
      if (!offlineService.data.offlineMode) {
        _show();
      }
      // _onIn();
      // TODO: abriri el puerto para zumero en el firewall
      // TODO: crear una servicio global para de ahi sacar el idinspeccion actual, incusive despues de un zync para saber que es el adecuado
      // TODO: el proceso se realiza en backgroud, pero bloquea la base de datos por eso no me puedo mover entre vistas, por que hacen consultas a la ase de datos
      var timer = $timeout(function () {
        console.log('a inZync');
        _inZync(i).then(function (res) {
          console.log('zyn promise ok', res);
          q.resolve(res);
        }, function (e) {
          console.log('zync promise error', e);
          q.reject(e);
        });
      }, 120);
      return q.promise;
    };
    _inZync = function (i) {
      var q = $q.defer();
      if (offlineService.data.offlineMode) {
        // || !onlineStatusService.data.isOnline) {
        // TODO: me parece mas logico retornar un reject si esta en modo offline
        q.reject('offlineMode o sin conexion');
        console.log('offline mode activado');  // _hide();
      } else {
        console.log('init zync' + i);
        console.time('zync' + i);
        /*var timer = $timeout(function () {
          toastService.showShortBottom('sincronizando..');
        }, 2500);*/
        // n = 0;
        // interval = $interval(function () {
        //   n += 1;
        //   console.log('interval' + n);  // toastService.showShortBottom('sincronizando..');
        // }, 500);
        zumero.sync(zumeroServiceFactory.dbpath, '', zumeroServiceFactory.server, zumeroServiceFactory.dbfile, null, null, null, function () {
          console.log('ok');
          console.timeEnd('zync' + i);
          if (!intermediateService.data.idinspeccionSync && intermediateService.data.placa) {
            /*   $timeout.cancel(timer);*/
            _hide();
            // $interval.cancel(interval);
            // updateSyncService.updateSync(intermediateService.data.placa, true).then(function () {
            updateSyncService.selectIdinspeccionSync(intermediateService.data.placa).then(function () {
              toastService.showShortBottom('sinc: ok');
              q.resolve('zync ok');
            });  // });
          } else {
            /*$timeout.cancel(timer);*/
            _hide();
            // $interval.cancel(interval);
            toastService.showShortBottom('sinc: ok');
            q.resolve('zync ok');
          }
        }, function (error) {
          console.log(error);
          // $timeout.cancel(timer);
          _hide();
          // $interval.cancel(interval);
          console.timeEnd('zync' + i);
          if (error.code === 456) {
            offlineService.data.offlineMode = true;
          }
          toastService.showShortBottom('sinc: error');
          q.reject(error);
        });
      }
      return q.promise;
    };
    _onIn = function () {
      intervalEj = $interval(function () {
        nEj += 1;
        console.log('interval' + nEj);
        toastService.showShortBottom('sincronizando..');
      }, 2000);
      console.log(intervalEj);
    };
    _offIn = function () {
      $interval.cancel(intervalEj);
    };
    _show = function () {
      // _onIn();
      $ionicLoading.show({ template: '<ion-spinner icon="android"></ion-spinner>' });
    };
    _hide = function () {
      // _offIn();
      $ionicLoading.hide();
    };
    zumeroServiceFactory.setZumero = _setZumero;
    zumeroServiceFactory.zync = _zync;
    zumeroServiceFactory.onIn = _onIn;
    zumeroServiceFactory.offIn = _offIn;
    zumeroServiceFactory.show = _show;
    zumeroServiceFactory.hide = _hide;
    return zumeroServiceFactory;
  }
]);