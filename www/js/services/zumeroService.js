app.factory('zumeroService', [
  '$q',
  '$cordovaDevice',
  '$cordovaSQLite',
  'offlineService',
  'intermediateService',
  'updateSyncService',
  'toastService',
  '$timeout',
  // 'onlineStatusService',
  function ($q, $cordovaDevice, $cordovaSQLite, offlineService, intermediateService, updateSyncService, toastService, $timeout) {
    var zumero = null;
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
      zumeroServiceFactory.server = 'http://190.145.39.138:8080/';
      //'http://192.168.0.51:8080/';
      // TODO: DEPENDE SI ESTOY EN MI CASA O EN LA OFICINA'http://192.168.1.13:8080/';
      zumeroServiceFactory.packageName = 'com.ajustev.b';
      _setDbPath();
    };
    // TODO:  recordar k esto es una promesa y desencadena acciones, si es resuelta o si es reject , vallidar
    var _zync = function (i) {
      // TODO: abriri el puerto para zumero en el firewall
      // TODO: crear una servicio global para de ahi sacar el idinspeccion actual, incusive despues de un zync para saber que es el adecuado
      var q = $q.defer();
      if (offlineService.data.offlineMode) {
        // || !onlineStatusService.data.isOnline) {
        // TODO: me parece mas logico retornar un reject si esta en modo offline
        q.reject('offlineMode o sin conexion');
        console.log('offline mode activado');
      } else {
        console.time('zync' + i);
        var timer = $timeout(function () {
          toastService.showShortBottom('sincronizando..');
        }, 2500);
        zumero.sync(zumeroServiceFactory.dbpath, '', zumeroServiceFactory.server, zumeroServiceFactory.dbfile, null, null, null, function () {
          console.log('ok');
          console.timeEnd('zync' + i);
          if (!intermediateService.data.idinspeccionSync && intermediateService.data.placa) {
            $timeout.cancel(timer);
            // updateSyncService.updateSync(intermediateService.data.placa, true).then(function () {
            updateSyncService.selectIdinspeccionSync(intermediateService.data.placa).then(function () {
              q.resolve('zync ok');
            });  // });
          } else {
            $timeout.cancel(timer);
            q.resolve('zync ok');
          }
        }, function (error) {
          console.log(error);
          $timeout.cancel(timer);
          console.timeEnd('zync' + i);
          if (error.code === 456) {
            offlineService.data.offlineMode = true;
          }
          q.reject(error);
        });
      }
      return q.promise;
    };
    zumeroServiceFactory.setZumero = _setZumero;
    zumeroServiceFactory.zync = _zync;
    return zumeroServiceFactory;
  }
]);