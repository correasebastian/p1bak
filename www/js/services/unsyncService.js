app.factory('unsyncService', function ($timeout, intermediateService, toastService, authService, momentService, sqliteService, errorService, offlineService, fileTransferService, fotosService, zumeroService, $rootScope) {
  var unsyncServiceFactory = {};
  unsyncServiceFactory.imgUnsync = [];
  var _getImgUnsync = function () {
    var query = 'SELECT     idfoto, i.idinspeccion, path, f.sync,  i.placa, f.rutaSrv ';
    query += 'FROM      idinspeccion i    inner join  idfotos f on i.idinspeccion = f.idinspeccion ';
    query += 'WHERE    i.userName = ? AND  i.fecha>? AND (f.sync = 0) AND (deleted = 0) ';
    var binding = [
      authService.authentication.userName,
      momentService.addDays(-3)
    ];
    return sqliteService.executeQuery(query, binding).then(function (res) {
      unsyncServiceFactory.imgUnsync = sqliteService.rtnArray(res);
      unsyncServiceFactory.imgUnsyncLength = sqliteService.rtnArray(res).length;
    }, errorService.consoleError);
  };
  var _syncImages = function () {
    _getImgUnsync().then(function () {
      if (unsyncServiceFactory.imgUnsyncLength < 1) {
        zumeroService.zync(2);
        return;
      }
      angular.forEach(unsyncServiceFactory.imgUnsync, function (obj, key) {
        _preFileUpload(obj);
      });
    });
  };
  var _preFileUpload = function (obj) {
    if (offlineService.data.offlineMode) {
      // TODO: ya noe s necesario por que offline tambien esta en onlilnestatussrervice
      // || !onlineStatusService.isOnline) {
      _updateAfterUpload(obj.path, 0, false);
    } else {
      fileTransferService.fileUpload(obj).then(function (res) {
        console.log(res);
        console.timeEnd('fileUpload');
        _updateAfterUpload(obj.path, 1, false);
      }, function (e) {
        console.log(e);
        console.timeEnd('fileUpload');
        _updateAfterUpload(obj.path, 0, false);
        if (e.code === 4) {
          console.log('error en el controller');
          offlineService.data.offlineMode = true;
          toastService.showShortBottom('activado modo offline');
        }
      }, function (progress) {
      });
    }
  };
  var _updateAfterUpload = function (imageURI, sync, onupload) {
    _updateFoto(imageURI, sync, onupload);
  };
  var _updateFoto = function (imageURI, sync, onupload) {
    fotosService.updateFoto(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
      console.log('en el controller despues de update sqlite foto ');
      // if (s.massiveUpload) {
      unsyncServiceFactory.imgUnsyncLength = unsyncServiceFactory.imgUnsyncLength - 1;
      if (unsyncServiceFactory.imgUnsyncLength > 0) {
        console.log(unsyncServiceFactory.imgUnsyncLength);
        return;
      }
      // }
      // _filterUnsync(0);          
      console.log(unsyncServiceFactory.imgUnsyncLength, 'sync');
      // zumeroService.zync(2);
      zumeroService.zync(0).then(function () {
        $rootScope.$broadcast('myEvent');
      });
    });
  };
  unsyncServiceFactory.getImgUnsync = _getImgUnsync;
  unsyncServiceFactory.syncImages = _syncImages;
  return unsyncServiceFactory;
});