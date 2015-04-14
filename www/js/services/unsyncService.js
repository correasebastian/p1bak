app.factory('unsyncService', function ($timeout, authService, momentService, sqliteService, errorService) {
  var unsyncServiceFactory = {};
  unsyncServiceFactory.imgUnsync = [];
  var _getImgUnsync = function () {
    var query = 'SELECT     idfoto, idinspeccion, path, sync,  placa, idajustev, onUpload  ';
    query += 'FROM      idinspeccion i    inner join  idfotos f on i.idinspeccion = f.idinspeccion ';
    query += 'WHERE    i.userName = ? AND  i.fecha>? AND (sync = 0) AND (deleted = 0) ';
    var binding = [
      authService.authentication.userName,
      momentService.addDays(-3)
    ];
    return sqliteService.executeQuery(query, binding).then(function (res) {
      unsyncServiceFactory.imgUnsync = sqliteService.rtnArray(res);
    }, errorService.consoleError);
  };
  unsyncServiceFactory.getImgUnsync = _getImgUnsync;
  return unsyncServiceFactory;
});