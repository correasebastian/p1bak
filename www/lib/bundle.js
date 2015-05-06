// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// var ls = null;
// var zumero = null;
// var cs = null;
// var zs = null;
// var ps = null;
// var pc = null;
// var cf = null;
// var ed = null;
// var cc = null;
// pruebas locales
var db = null;
// var services = {};
// var ngCordova = {};
// var alreadyInspect = false;
// var rp = null;
var app = angular.module('starter', [
  'ionic',
  'starter.controllers',
  'ngStorage',
  'ngCordova',
  'ui.utils',
  'ngFx',
  'ngAnimate',
  'angular-loading-bar',
  'LocalStorageModule'
]).config(function ($stateProvider, $urlRouterProvider, $compileProvider, cfpLoadingBarProvider, $httpProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  $httpProvider.interceptors.push('authInterceptorService');
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  }).state('app.search', {
    url: '/search',
    views: { 'menuContent': { templateUrl: 'templates/search.html' } }
  }).state('app.browse', {
    url: '/browse',
    views: { 'menuContent': { templateUrl: 'templates/browse.html' } }
  }).state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  }).state('app.placas', {
    url: '/placas',
    views: {
      'menuContent': {
        templateUrl: 'templates/placas.html',
        controller: 'PlacasCtrl'
      }
    }
  }).state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  }).state('app.foto', {
    url: '/fotos/:id',
    views: {
      'menuContent': {
        templateUrl: 'js/Fotos/foto.html',
        controller: 'FotoCtrl'
      }
    }
  }).state('app.video', {
    url: '/video/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/video.html',
        controller: 'VideoCtrl'
      }
    }
  }).state('app.inspeccion', {
    url: '/inspeccion/:id/:placa/:calificado',
    views: {
      'menuContent': {
        templateUrl: 'js/inspeccion/inspeccion.html',
        controller: 'InspeccionCtrl'
      }
    }
  }).state('app.codFas', {
    url: '/codfas/:id',
    views: {
      'menuContent': {
        templateUrl: 'js/codFas/codfas.html',
        controller: 'CodFas as vm'
      }
    }
  }).state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/loginIonic.html',
        controller: 'loginController'
      }
    }
  }).state('app.accesorios', {
    url: '/accesorios/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/accesorios.html',
        controller: 'AccesoriosCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
  // TODO: para que se consideren sanas las ng-src que tengan esta sintaxis;
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
  $compileProvider.debugInfoEnabled(true);
});
var serviceBase = 'http://190.145.39.138/auth/';
app.constant('ngAuthSettings', {
  apiServiceBaseUri: serviceBase,
  clientId: 'ngAuthApp'
}).config(function ($provide) {
  $provide.decorator('$exceptionHandler', function ($delegate, $injector) {
    return function (exception, cause) {
      $delegate(exception, cause);
      if (db) {
        var sqliteService = $injector.get('sqliteService');
        var authService = $injector.get('authService');
        var momentService = $injector.get('momentService');
        var query = 'INSERT  INTO [logs]([ex],[email],[fecha])  VALUES(?,?,?)';
        var binding = [
          angular.toJson(exception),
          authService.authentication.userName || '',
          momentService.getDateTime()
        ];
        sqliteService.executeQuery(query, binding).then(function (res) {
        }, function (err) {
          console.error(err);
        })  // var alerting = $injector.get("alerting");
            // alerting.addDanger(exception.message);
;
      }
    };
  });
}).run(function ($rootScope, $timeout, $ionicPlatform, $localStorage, $cordovaSQLite, checkFileService, videoThumbnailService, $cordovaCamera, fileTransferService, zumeroService, $cordovaFile, easyDirService, getVideoService, copyFileService, accesoriosService, inspeccionService, placasService, onlineStatusService, cordovaEventsService, toastService, offlineService, momentService, firstInitService, authService, deviceService, localStorageService, $state, intermediateService, unsyncService, fotosService, gpsService) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    authService.fillAuthData();
    // $rootScope.$on('$locationChangeStart', function (event, next, current) {
    //   console.log(event, next, current);
    // });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log(event, toState, toParams, fromState, fromParams);
      var authData = localStorageService.get('authorizationData');
      if (toState.name === 'app.login') {
        // doe she/he try to go to login? - let him/her go
        return;
      }
      console.log(authData, momentService.diffNow(authData.exp, 'm'), '> -60');
      if (!authData || momentService.diffNow(authData.exp, 'm') > -60) {
        event.preventDefault();
        $timeout(function () {
          console.log('redirect');
          //Was calling this but commenting out to keep it simple: authService.redirectToLogin();
          //Changes URL but not the view - goes to original view that I'm trying to redirect
          //away from now with 1.3. Fine with it but interested in understanding the 
          //"proper" way to do it now so login view gets redirected to.
          $state.go('app.login');  //event.preventDefault(); //Nice addition! Can't do any redirect when it's called though
        }, 0);
      }
    });
    // ls = $localStorage;
    // zumero = cordova.require('cordova/plugin/zumero');
    // services.zumeroService = zumeroService;
    // services.getVideoService = getVideoService;
    // services.copyFileService = copyFileService;
    // services.fileTransferService = fileTransferService;
    // services.videoThumbnailService = videoThumbnailService;
    // services.easyDirService = easyDirService;
    // services.checkFileService = checkFileService;
    // services.accesoriosService = accesoriosService;
    // services.inspeccionService = inspeccionService;
    // services.unsyncService = unsyncService;
    // services.placasService = placasService;
    // services.onlineStatusService = onlineStatusService;
    // services.cordovaEventsService = cordovaEventsService;
    // services.toastService = toastService;
    // services.offlineService = offlineService;
    // services.localStorage = $localStorage;
    // services.firstInitService = firstInitService;
    // services.momentService = momentService;
    // services.authService = authService;
    // services.deviceService = deviceService;
    // services.intermediateService = intermediateService;
    // services.fotosService = fotosService;
    // services.gpsService = gpsService;
    // ngCordova.cordovaSQLite = $cordovaSQLite;
    // ngCordova.cordovaFile = $cordovaFile;
    // ngCordova.cordovaCamera = $cordovaCamera;
    // zs = zumeroService;
    // cs = ;
    // cf = ;
    // ed = easyDirService;
    // db = $cordovaSQLite.openDB('zdbfile.db', 1);
    // cc = $cordovaCamera;
    // cc = getVideoService;
    // services.zumeroService.setZumero('zdbfile');
    // services.zumeroService.setZumero('zumerotestdbfile');
    zumeroService.setZumero('zumerotestdbfile');
    onlineStatusService.onOnline();
    onlineStatusService.onOffline();
    onlineStatusService.isOnline();
    onlineStatusService.connType();
    cordovaEventsService.onPause();
    cordovaEventsService.onResume();
    deviceService.setInfo();
    // TODO:  verificar si existe en el localstorage alguna bandera que diga si ya se sync alguna vez 
    $localStorage.message = 'Hello World';
    authService.fillAuthData();  // var authData = localStorageService.get('authorizationData');
                                 // if (!authData) {
                                 //   $state.go('app.login');
                                 // } else {
                                 //   var n = moment();
                                 //   var e = moment(authData.exp);
                                 //   console.log(n.diff(e, 'seconds'));
                                 //   if (n.diff(e, 'seconds') < 0) {
                                 //     console.log('token redirect login test');
                                 //     // $location.path('/app/placas');
                                 //     $state.go('app.login');
                                 //   }
                                 // }
  });
});  // app.run([
     //   'localStorageService',
     //   '$location',
     //   function (localStorageService, $location) {
     //     var authData = localStorageService.get('authorizationData');
     //     if (!authData) {
     //       console.log('token redirect login');
     //       $location.path('/login');
     //     } else {
     //       // TODO: esto no es necesario, por que al intentar sincronizar una imagen y el token esta vencido, se redirecciona a login automaticamente
     //       var n = moment();
     //       var e = moment(authData.exp);
     //       console.log(n.diff(e, 'seconds'));
     //       if (n.diff(e, 'seconds') > 0) {
     //         console.log('token redirect login');
     //         $location.path('/login');
     //       }
     //     }
     //   }
     // ]);

angular.module('starter.controllers', []).controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', { scope: $scope }).then(function (modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.login = function () {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeLogin();
    }, 1000);
  };
}).controller('PlaylistsCtrl', function ($scope) {
  $scope.playlists = [
    {
      title: 'Reggae',
      id: 1
    },
    {
      title: 'Chill',
      id: 2
    },
    {
      title: 'Dubstep',
      id: 3
    },
    {
      title: 'Indie',
      id: 4
    },
    {
      title: 'Rap',
      id: 5
    },
    {
      title: 'Cowbell',
      id: 6
    }
  ];
}).controller('PlaylistCtrl', function ($scope, $stateParams) {
});
app.controller('FotoCtrl', [
  '$scope',
  'fotosService',
  '$ionicPlatform',
  '$ionicScrollDelegate',
  'fileTransferService',
  '$filter',
  '$stateParams',
  '$ionicNavBarDelegate',
  'copyFileService',
  'checkFileService',
  'titleService',
  'offlineService',
  'errorService',
  'onlineStatusService',
  'intermediateService',
  'toastService',
  'zumeroService',
  'momentService',
  'gpsService',
  '$log',
  '$ionicModal',
  function (s, fotosService, $ionicPlatform, $ionicScrollDelegate, fileTransferService, $filter, $stateParams, $ionicNavBarDelegate, copyFileService, checkFileService, titleService, offlineService, errorService, onlineStatusService, intermediateService, toastService, zumeroService, momentService, gpsService, $log, $ionicModal) {
    $ionicPlatform.ready(function () {
      $ionicModal.fromTemplateUrl('js/Fotos/fotoModal.html', {
        scope: s,
        animation: 'slide-in-up'
      }).then(function (modal) {
        s.modal = modal;
        $log.debug(modal);
      });
      // s.tittle = '';
      s.tittle = intermediateService.data.placa;
      s.imgUnsync = [];
      s.massiveUpload = false;
      //$stateParams.id;
      titleService.title = intermediateService.data.placa;
      // $stateParams.id;
      s.idinspeccion = intermediateService.data.idinspeccion;
      // $stateParams.id;
      s.off = offlineService.data;
      // TODO: ESTA ESTRATEGIA FUNCIONA BIEN PARA VER EL CAMBIO INMEDIATAMENTE
      // s.onlineStatus = onlineStatusService;
      // TODO: ESTA ESTRATEGIA REQUIERE OTRO DIGEST PARA QUE FUNCIONE
      // s.oss = { online: onlineStatusService.isOnline };
      // TODO: ESTA ESTRATEGIA FUNCIONA BIEN PARA VER EL CAMBIO INMEDIATAMENTE  ES MEJOR RASTREAR SIEMPRE UN OBJETO
      s.oss = onlineStatusService.data;
      // $ionicNavBarDelegate.title($stateParams.id);
      // TODO: onhold can edit placa, on swipe left delete with confirm
      // TODO: always use ion-nav-title , para poderle poner los titulos que quiero
      // s.oss = { online: onlineStatusService.isOnline };
      s.photos = fotosService.photos;
      s.names = fotosService.names;
      s.fotosFalt = [];
      s.getPhotos = function () {
        // TODO: creo k es mejor hacer referencia directamente a intermediateservice.DATA .idinspeccion k a s.idinspeccion;
        fotosService.getPhotos(intermediateService.data.idinspeccion).then(function () {
          s.photos = fotosService.photos;
          s.names = fotosService.names;
          s.fotosFalt = fotosService.fotosFalt;
          _filterUnsync(0);
        });
      };
      s.getPhotos();
      s.$on('myEvent', function () {
        console.log('my event occurred', s.idinspeccion, intermediateService.data.idinspeccion);
        s.getPhotos();
      });
      var _filterUnsync = function (equal) {
        var found = $filter('filter')(s.photos, { sync: equal }, true);
        // console.log(s.photos, found);
        s.imgUnsync = found;
      };
      var updateFoto = function (imageURI, sync, onupload) {
        fotosService.updateFoto(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de update sqlite foto ');
          if (s.massiveUpload) {
            s.massiveLength = s.massiveLength - 1;
            if (s.massiveLength > 0) {
              console.log(s.massiveLength);
              return;
            }
          }
          _filterUnsync(0);
          s.massiveUpload = false;
          console.log(s.massiveLength, 'sync');
          zumeroService.zync(2);
        });
      };
      var updateAfterUpload = function (imageURI, sync, onupload) {
        var objVideo = searchOneInArray(imageURI);
        objVideo.sync = sync;
        objVideo.onUpload = onupload;
        updateFoto(imageURI, sync, onupload);
        //TODO : CUANDO ES UNA SOLA ESTA BIEN, CUENAOD ES UN ARRAY DEBO DE HACER QUE SYNC CON LA ULTIMA FOTO UN .LENTHG PUEDE SER
        // zumeroService.zync(2);
        intermediateService.data.isTakingPic = false;
      };
      // var rtnTipoFoto=function(){
      //   return 
      // }
      var insertFoto = function (imageURI, sync, onupload) {
        fotosService.insertFoto(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de sqlite foto ');
          if (fotosService.tipoFoto.cantidad > 0) {
            var index = s.fotosFalt.indexOf(fotosService.tipoFoto);
            $log.debug(index);
            s.fotosFalt.splice(index, 1);
          }
        });
      };
      var refreshProgress = function (imageURI, percentage) {
        var objFoto = searchOneInArray(imageURI);
        objFoto.progress = percentage;
      };
      var preFileUpload = function (obj) {
        if (offlineService.data.offlineMode) {
          // TODO: ya noe s necesario por que offline tambien esta en onlilnestatussrervice
          // || !onlineStatusService.isOnline) {
          updateAfterUpload(obj.path, 0, false);
        } else {
          fileTransferService.fileUpload(obj).then(function (res) {
            console.log(res);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, 1, false);
          }, function (e) {
            console.log(e);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, 0, false);
            if (e.code === 4) {
              console.log('error en el controller');
              offlineService.data.offlineMode = true;
              toastService.showShortBottom('activado modo offline');
            }
          }, function (progress) {
          });
        }
      };
      var rtnObjectFoto = function (placa, path, sync, onUpload, idtipo) {
        var obj = {
          placa: placa,
          path: path,
          sync: sync,
          onUpload: onUpload,
          //s.oss.online === true ? true : false
          rutaSrv: momentService.rutaSrv(path),
          idtipo: idtipo
        };
        return obj;
      };
      var searchOneInArray = function (srcImg) {
        // TODO: HABRA OTRA FORMA DE FILTAR MAS RAPIDA K EL STRING PATH;
        var found = $filter('filter')(s.photos, { path: srcImg }, true);
        if (found.length) {
          return found[0];
        } else {
          console.log('not found in array search');
        }
      };
      s.openModal = function () {
        s.modal.show();
      };
      s.tryUpload = function (foto) {
        var objFoto = searchOneInArray(foto.path);
        objFoto.onUpload = true;
        preFileUpload(objFoto);
      };
      // s.setOfflineMode = function (bool) {
      //   s.off.offlineMode = bool;
      //   if (bool) {
      //     $ionicNavBarDelegate.title('Offline Mode');
      //   } else {
      //     $ionicNavBarDelegate.title(titleService.title);
      //   }
      // };
      s.syncImgUnsync = function () {
        s.massiveUpload = true;
        s.massiveLength = s.imgUnsync.length;
        angular.forEach(s.imgUnsync, function (obj, key) {
          s.tryUpload(obj);
        });
      };
      s.setname = function (idtipo, foto) {
        //betadoparapruebasconsole.log(nombre, foto);
        // console.log(idtipo, foto);
        fotosService.setName(idtipo, foto).then(function () {
          s.fotosFalt = fotosService.fotosFalt;
        });
      };
      s.getPicFile = function () {
        intermediateService.data.isTakingPic = true;
        fotosService.takedpic().then(function (imageURI) {
          // TODO: para las tablets apago el gps, y algo pasa con la camara
          gpsService.gpsHtml(intermediateService.data.idinspeccion);
          // console.log(imageURI);
          // fotosService.copyFile(imageURI).then(function (res) {
          // copyFileService.copyFile(imageURI).then(function (res) {
          copyFileService.copyFile(imageURI).then(function () {
            // console.log(res, 'copyok');
            console.log(checkFileService.fileEntry, checkFileService.file);
            var res = checkFileService.fileEntry;
            var sync = 0;
            var onupload = true;
            // TODO: es mejor h¿guardar aqui el sqlite y luego actualizarlo si sube exitoso;
            var obj = rtnObjectFoto(intermediateService.data.placa, res.nativeURL, sync, onupload, fotosService.tipoFoto.idTipoFoto);
            s.photos.push(obj);
            insertFoto(res.nativeURL, sync, onupload);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
            // TODO: es mejor llamar a una funcion, por que asi se ejecuta para cada uno, y se ejecuta bien, en vez de llamar filupload desde aca
            //preFileUpload(res.nativeURL);  // $scope.photos.push(res.nativeURL);
            preFileUpload(obj);
          }, errorService.consoleError);
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
      s.setIdTipoFoto = function (tipoFoto) {
        $log.debug(tipoFoto);
        fotosService.tipoFoto = tipoFoto;
        s.closeModal();
        // 
        s.getPicFile();
      };
      s.closeModal = function () {
        s.modal.hide();
      };
      s.listPics = [
        {
          'idTipoFoto': 494,
          'nombreFoto': 'Placa',
          'orden': '1',
          'cantidad': '1'
        },
        {
          'idTipoFoto': 625,
          'nombreFoto': 'Frente Licencia Transito',
          'orden': 10,
          'cantidad': '1'
        },
        {
          'idTipoFoto': 495,
          'nombreFoto': 'Delantera Derecha',
          'orden': 40,
          'cantidad': '1'
        },
        {
          'idTipoFoto': 496,
          'nombreFoto': 'Delantera Izquierda',
          'orden': 30,
          'cantidad': '1'
        },
        {
          'idTipoFoto': 497,
          'nombreFoto': 'Trasera Derecha',
          'orden': 50,
          'cantidad': '1'
        }
      ];
    });
  }
]);
app.factory('fotosService', [
  '$cordovaCamera',
  '$cordovaFile',
  'sqliteService',
  'intermediateService',
  'momentService',
  'rtnFind',
  '$filter',
  function ($cordovaCamera, $cordovaFile, sqliteService, intermediateService, momentService, rtnFind, $filter) {
    var fotosServiceFactory = {};
    fotosServiceFactory.photos = [];
    fotosServiceFactory.names = [];
    fotosServiceFactory.fotosFalt = [];
    fotosServiceFactory.tipoFoto = {};
    // [{
    //     placa: 'ABC111',
    //     src: '',
    //     sync: false
    //   }];
    var _remove = function (placa) {
      fotosServiceFactory.photos.splice(fotosServiceFactory.photos.indexOf(placa), 1);
    };
    var _all = function () {
      return fotosServiceFactory.photos;
    };
    var _takedpic = function () {
      var options = {
        quality: 45,
        //50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        // allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        //importante con 100 se veia horrible
        targetHeight: 1000,
        // TODO: revisar para que sirve esta opcion
        // popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      return $cordovaCamera.getPicture(options).then(function (imageURI) {
        return imageURI;
      });
    };
    var _getPhotos = function (idinspeccion) {
      var query = 'select * from idfotos where idinspeccion=?';
      var binding = [idinspeccion];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        fotosServiceFactory.photos = sqliteService.rtnArray(res);
        // $rootScope.$apply();
        return _getNames();  // console.log(fotosServiceFactory.photos);
      }, function (error) {
        console.log(error);
      });
    };
    var _getNames = function () {
      // var query = 'select idTipoFoto, NombreFoto, enabled   from tiposFoto WHERE enabled=1 order by nombrefoto';
      var query = ' select fc.idTipoFoto, NombreFoto,fc.orden, fc.cantidad ';
      query += ' from tiposFoto tf ';
      query += ' inner join fotoscia fc on tf.idTipoFoto=fc.idTipoFoto ';
      query += ' and tf.enabled=1 and fc.enabled=1 ';
      query += 'order by fc.orden ';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        fotosServiceFactory.names = sqliteService.rtnArray(res);
        // $rootScope.$apply();
        // console.log(fotosServiceFactory.photos);
        // angular.copy(fotosServiceFactory.names, fotosServiceFactory.fotosFalt);
        // fotosServiceFactory.orderBy(fotosServiceFactory.fotosFalt, 'orden', false);
        fotosServiceFactory.fotosPendientes();
      }, function (error) {
        console.log(error);
      });
    };
    var _orderBy = function (array, expression, reverse) {
      array = $filter('orderBy')(array, expression, reverse);
    };
    var _fotosPendientes = function () {
      angular.copy(fotosServiceFactory.names, fotosServiceFactory.fotosFalt);
      angular.forEach(fotosServiceFactory.photos, function (obj, key) {
        var filterObj = { idTipoFoto: obj.idtipo };
        rtnFind.rmObjFromArray(fotosServiceFactory.fotosFalt, filterObj);
      });
    };
    var _copyFile = function (imageURI) {
      var FileName = imageURI.replace(/^.*[\\\/]/, '');
      console.log(FileName);
      var newFileName = 'new_' + FileName;
      return $cordovaFile.copyFile(cordova.file.externalCacheDirectory, FileName, cordova.file.dataDirectory, newFileName).then(function (success) {
        return success;
      });
    };
    var _insertFoto = function (idinspeccion, imageURI, sync, onUpload) {
      var query = 'INSERT INTO idfotos(idinspeccion, path,sync,uuid,deleted, onUpload, placa, fecha, rutaSrv, idtipo) VALUES (?,?,?,?,?,?,?,?, ?,?)';
      // TODO: el campo deleted es boolean , pero debe asignarsele 1 o 0
      // sync = sync ? 1 : 0;
      onUpload = onUpload ? 1 : 0;
      console.log();
      var binding = [
        idinspeccion,
        imageURI,
        sync,
        'testuuid',
        0,
        onUpload,
        intermediateService.data.placa,
        momentService.getDateTime(),
        momentService.rutaSrv(imageURI),
        fotosServiceFactory.tipoFoto.idTipoFoto
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
      }, function (err) {
        console.error(err);
      });
    };
    var _updateFoto = function (idinspeccion, path, sync, onUpload) {
      //TODO: es el path la mejor forma y mas efectiva de hacer el where de la consulta
      var query = 'UPDATE idfotos set sync=? , onUpload= ? WHERE idinspeccion =? AND path=?';
      // TODO: el campo deleted es boolean , pero debe asignarsele 1 o 0
      // TODO:  mucho cuidado por ejemplo el path debe ser nvarchar() NO  NCHAR
      // sync = sync ? 1 : 0;
      onUpload = onUpload ? 1 : 0;
      var binding = [
        sync,
        onUpload,
        intermediateService.data.idinspeccion,
        path
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        if (!res.rowsAffected) {
          console.log('Nothing was updated');
        } else {
          console.log(res.rowsAffected);
          console.log('update successful');
        }
      }, function (err) {
        console.error(err);
      });
    };
    var _setName = function (idtipo, foto) {
      var query = 'UPDATE idfotos set idtipo=?  WHERE idinspeccion =? AND path=?';
      var binding = [
        idtipo,
        intermediateService.data.idinspeccion,
        foto.path
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        if (!res.rowsAffected) {
          console.log('Nothing was updated');
        } else {
          console.log(res.rowsAffected);
          console.log('update successful');
          fotosServiceFactory.fotosPendientes();
        }
      }, function (err) {
        console.error(err);
      });
    };
    fotosServiceFactory.remove = _remove;
    fotosServiceFactory.all = _all;
    fotosServiceFactory.takedpic = _takedpic;
    fotosServiceFactory.copyFile = _copyFile;
    fotosServiceFactory.insertFoto = _insertFoto;
    fotosServiceFactory.getPhotos = _getPhotos;
    fotosServiceFactory.updateFoto = _updateFoto;
    fotosServiceFactory.setName = _setName;
    fotosServiceFactory.fotosPendientes = _fotosPendientes;
    fotosServiceFactory.orderBy = _orderBy;
    return fotosServiceFactory;
  }
]);
(function () {
  angular.module('starter').factory('rtnFind', [
    '$filter',
    '$log',
    rtnFind
  ]);
  function rtnFind($filter, $log) {
    var rtnFindFactory = { rmObjFromArray: rmObjFromArray };
    return rtnFindFactory;
    // body...
    function rmObjFromArray(array, filterObj) {
      var subArray = $filter('filter')(array, filterObj, true);
      $log.debug(subArray);
      if (subArray.length) {
        var obj = subArray[0];
        if (obj.cantidad > 0) {
          var index = array.indexOf(obj);
          array.splice(index, 1);
        }
      }
    }
  }
}());
(function () {
  angular.module('starter').controller('CodFas', [
    '$log',
    'cfser',
    'errorService',
    codFas
  ]);
  function codFas($log, cfser, errorService) {
    var vm = this;
    vm.marcas = [];
    vm.data = cfser.objCodFas;
    // vm.filter = { marca: '' };
    vm.setCodFas = setCodFas;
    vm.updCodFas = updCodFas;
    activate();
    function activate() {
      cfser.getCodFas().then(selectOk).catch(errorService.consoleError);
    }
    function setCodFas() {
      $log.debug('open setcodfas', vm.data);
      cfser.insertCodFas().then(insertOk).catch(errorService.consoleError);
    }
    function updCodFas() {
      cfser.updCodFas().then(updOk).catch(errorService.consoleError);  // body...
    }
    ///////
    function insertOk() {
      $log.debug('insert ok');  // body...
    }
    function selectOk() {
      $log.debug('select ok');  // body...
    }
    function updOk() {
      $log.debug('upd ok');  // body...
    }
  }
}());
(function () {
  angular.module('starter').factory('cfser', [
    'intermediateService',
    'sqliteService',
    'momentService',
    'zumeroService',
    'toastService',
    cfser
  ]);
  function cfser(intermediateService, sqliteService, momentService, zumeroService, toastService) {
    var cfFactory = {
      objCodFas: {
        codFasecolda: null,
        alreadySet: false
      },
      insertCodFas: insertCodFas,
      updCodFas: updCodFas,
      getCodFas: getCodFas
    };
    return cfFactory;
    function insertCodFas() {
      var query = 'INSERT INTO [idinspeccionCodigosFasecolda] ([idinspeccion] ,[placa]  ,[codFasecolda]  ,[fecha])  VALUES(?,?,?,?) ';
      var binding = [
        intermediateService.data.idinspeccion,
        intermediateService.data.placa,
        cfFactory.objCodFas.codFasecolda,
        momentService.getDateTime()
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        cfFactory.objCodFas.alreadySet = true;
        toastService.showShortBottom('codigo ingresado');
        zumeroService.zync(24);
      }, function (error) {
        console.log(error);
      });
    }
    function updCodFas() {
      var query = 'UPDATE [idinspeccionCodigosFasecolda] ';
      query += 'SET [codFasecolda] = ? , ';
      query += '[fecha] = ? , ';
      query += '[idajustev] = NULL ';
      query += 'WHERE idinspeccion=? ';
      var binding = [
        cfFactory.objCodFas.codFasecolda,
        momentService.getDateTime(),
        intermediateService.data.idinspeccion
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        toastService.showShortBottom('codigo actualizado');
        zumeroService.zync(24);
      }, function (error) {
        console.log(error);
      });
    }
    function getCodFas() {
      var query = 'select * from idinspeccionCodigosFasecolda where idinspeccion=?';
      var binding = [intermediateService.data.idinspeccion];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        var array = sqliteService.rtnArray(res);
        if (array.length) {
          cfFactory.objCodFas.codFasecolda = array[0].codFasecolda;
          cfFactory.objCodFas.alreadySet = true;
        } else {
          cfFactory.objCodFas.codFasecolda = null;
          cfFactory.objCodFas.alreadySet = false;
        }
      }, function (error) {
        console.log(error);
      });
    }
  }
}());
app.controller('AccesoriosCtrl', [
  '$scope',
  'zumeroService',
  '$ionicPlatform',
  'placasService',
  '$ionicNavBarDelegate',
  '$location',
  '$ionicPopup',
  '$ionicScrollDelegate',
  'focus',
  '$state',
  '$ionicSideMenuDelegate',
  '$stateParams',
  '$ionicModal',
  'accesoriosService',
  'fotosService',
  'copyFileService',
  'errorService',
  'checkFileService',
  'offlineService',
  'fileTransferService',
  'onlineStatusService',
  'intermediateService',
  'toastService',
  'zumeroService',
  'momentService',
  function ($scope, zumeroService, $ionicPlatform, placasService, $ionicNavBarDelegate, $location, $ionicPopup, $ionicScrollDelegate, focus, $state, $ionicSideMenuDelegate, $stateParams, $ionicModal, accesoriosService, fotosService, copyFileService, errorService, checkFileService, offlineService, fileTransferService, onlineStatusService, intermediateService, toastService, zumeroService, momentService) {
    $ionicPlatform.ready(function () {
      $scope.idinspeccion = intermediateService.data.idinspeccion;
      // parseInt($stateParams.id);
      accesoriosService.idinspeccion = intermediateService.data.idinspeccion;
      //parseInt($stateParams.id);
      $scope.tittle = intermediateService.data.placa;
      //
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.oss = onlineStatusService.data;
      $ionicModal.fromTemplateUrl('templates/openNewAccesorio.html', { scope: $scope }).then(function (modal) {
        $scope.modal = modal;
      });
      $scope.acces = [];
      $scope.setItems = function () {
        $scope.acces = accesoriosService.all;
      };
      accesoriosService.getItems().then(function () {
        console.log('get items en  el controller');
        $scope.setItems();
      });
      accesoriosService.initOptions().then(function () {
        console.log('resueltas las 3 promesas en el controlador');
        $scope.options = accesoriosService.initData;
      });
      $scope.initacc = function () {
        $scope.acc = accesoriosService.initAcc();
      };
      $scope.showModalNew = function () {
        $scope.initacc();
        $scope.modshow = false;
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        accesoriosService.save().then(function () {
          console.log('en el controller');
          $scope.setItems();
          zumeroService.zync(4);
          $scope.modal.hide();
          $ionicScrollDelegate.scrollTop();
        });  // $scope.acces.push($scope.acc);
      };
      $scope.hideItems = function () {
        $scope.modal.hide();
      };
      $scope.getPicFile = function () {
        $scope.acc.img.path = 'http://i.dailymail.co.uk/i/pix/2014/03/23/article-2587454-1C86499100000578-438_634x430.jpg';
      };
      $scope.mod = function (acc) {
        $scope.modshow = true;
        $scope.acc = acc;
        $scope.modal.show();
      };
      $scope.closeActModal = function () {
        // TODO: AQUI TENDRIA QUE HACER EL UPDATE 
        $scope.modal.hide();
      };
      var insertFoto = function (imageURI, sync, onupload) {
        fotosService.insertFoto(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de sqlite foto ');
        });
      };
      var preFileUpload = function (obj) {
        if (offlineService.data.offlineMode) {
          updateAfterUpload(obj.path, 0, false);
        } else {
          fileTransferService.fileUpload(obj).then(function (res) {
            console.log(res);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, 1, false);
          }, function (e) {
            console.log(e);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, 0, false);
            if (e.code === 4) {
              offlineService.data.offlineMode = true;
              toastService.showShortBottom('activado modo offline');
            }
          }, function (progress) {
          });
        }
      };
      var updateFoto = function (imageURI, sync, onupload) {
        fotosService.updateFoto(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de update sqlite foto ');
        });
      };
      var updateAfterUpload = function (imageURI, sync, onUpload) {
        $scope.acc.img.sync = sync;
        $scope.acc.img.onUpload = onUpload;
        updateFoto(imageURI, sync, onUpload);
        intermediateService.data.isTakingPic = false;
      };
      $scope.tryUpload = function (foto) {
        foto.onUpload = true;
        preFileUpload(foto);
      };
      $scope.getPicFile = function () {
        intermediateService.data.isTakingPic = true;
        fotosService.takedpic().then(function (imageURI) {
          copyFileService.copyFile(imageURI).then(function () {
            var res = checkFileService.fileEntry;
            var sync = 0;
            var onUpload = true;
            $scope.acc.img.sync = sync;
            $scope.acc.img.onUpload = onUpload;
            $scope.acc.img.path = res.nativeURL;
            $scope.acc.img.rutaSrv = momentService.rutaSrv(res.nativeURL);
            insertFoto(res.nativeURL, sync, onUpload);
            preFileUpload($scope.acc.img);
          }, errorService.consoleError);
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,fnError); // only for FILE_URI  
      };
    });
  }
]);
app.controller('MainCtrl', function ($scope, $ionicNavBarDelegate, offlineService, titleService, intermediateService, onlineStatusService, zumeroService, toastService, unsyncService, $state, authService) {
  $scope.off = offlineService.data;
  $scope.intermediate = intermediateService.data;
  $scope.setOfflineMode = function (bool) {
    $scope.off.offlineMode = bool;
    // if (bool) {
    //   $ionicNavBarDelegate.title('Offline Mode');
    // } else {
    //   $ionicNavBarDelegate.title(titleService.title);
    // }
    if (!bool && onlineStatusService.data.isOnline) {
      toastService.showLongBottom('sincronizando');
      unsyncService.syncImages()  // .then(function(){
                                  //   zumeroService.zync(0);
                                  // });  // zumeroService.zync(0);
;
    }
  };
  $scope.logOut = function () {
    authService.logOut();
    $state.go('app.login');
  };
});
app.controller('PlacasCtrl', [
  '$scope',
  'zumeroService',
  '$ionicPlatform',
  'placasService',
  '$ionicNavBarDelegate',
  '$location',
  '$ionicPopup',
  '$ionicScrollDelegate',
  'focus',
  '$state',
  'titleService',
  '$ionicModal',
  'toastService',
  'firstInitService',
  '$localStorage',
  '$ionicLoading',
  '$filter',
  'intermediateService',
  '$timeout',
  function ($scope, zumeroService, $ionicPlatform, placasService, $ionicNavBarDelegate, $location, $ionicPopup, $ionicScrollDelegate, focus, $state, titleService, $ionicModal, toastService, firstInitService, $localStorage, $ionicLoading, $filter, intermediateService, $timeout) {
    $ionicPlatform.ready(function () {
      // $scope.placas = placasService.all;
      // placasService.selectAll();
      // ps = placasService;
      // pc = $scope;
      // $scope.placasService = placasService;
      $scope.placas = placasService.all;
      $scope.obj = { filter: '' };
      // zumeroService.zync(1).then(function () {
      //   $scope.placasService.selectAll();
      //   console.log(placasService.all);
      // }, function (error) {
      //   console.log(error);
      // });
      // zumeroService.zync(1);
      titleService.title = 'Placas';
      $scope.show = function () {
        $ionicLoading.show({ template: '<ion-spinner icon="android"></ion-spinner>' });
      };
      $scope.hide = function () {
        $ionicLoading.hide();
      };
      $scope.getPlacas = function () {
        // toastService.showShortBottom('cargando informacion');
        placasService.getPlacas().then(function () {
          console.log('en el controller');
          $scope.placas = placasService.all;
        });
      };
      $scope.fInit = function () {
        firstInitService.init().then(function () {
          $scope.hide();
          $scope.getPlacas();
        }, function () {
          $scope.hide();
        });
      };
      // TODO: seria bueno que la consulta de placas supiera todo, como por ejemplo si ya se califico, si ya tiene alguna foto o un video, puede ser marcandolo con alguna clase
      if (!$localStorage.data) {
        $scope.show();
        // TODO: puedo poder obj=null, para que me elimine la base de datos si ya esta creada y vuelva a sincronizar, esto seria beneficioso si tengo que hacer un cambio en la base de ddatos que requiera reconstruirla
        $timeout($scope.fInit, 300);
      } else {
        $scope.getPlacas();
      }
      $scope.placaPopup = function () {
        // TODO: organizar el focus en el input del popup
        var myprompt = $ionicPopup.prompt({
          title: 'Nueva Placa',
          template: 'Ingrese la nueva placa',
          inputType: 'text',
          inputPlaceholder: 'Placa'
        });
        myprompt.then(function (placa) {
          $scope.addPlaca(placa);
        }, function (e) {
        });
      };
      $scope.addPlaca = function (placa) {
        if (angular.isUndefined(placa)) {
          toastService.showShortBottom('verifique la placa e ingrese nuevamente');
          // alert("verifique la placa e ingrese nuevamente");
          return;
        }
        if (placa.length < 4) {
          toastService.showShortBottom('longitud de placa muy corta');
          return;
        }
        placa = placa.replace(/[^\w\s]/gi, '').toUpperCase();
        placa = placa.replace(/\s/g, '');
        var found = $filter('filter')($scope.placas, { placa: placa }, true);
        if (found.length) {
          toastService.showShortBottom('placa ya registrada');
          return;
        }
        toastService.showLongBottom('Ingresando nueva placa');
        placasService.insertPLaca(placa).then(function () {
          console.log('en el controller');
          $scope.placas = placasService.all;
          $ionicScrollDelegate.scrollTop();
        });
      };
      $scope.hasFocus = false;
      $scope.setFocus = function () {
        $scope.hasFocus = true;
        $ionicNavBarDelegate.title('');
        focus.focus('searchPrimary');  //no es necesario abrir el keyboard se abre solo cuando asignamos el focus // cordova.plugins.Keyboard.show();
      };
      $scope.noFocus = function () {
        $scope.hasFocus = false;
        $ionicNavBarDelegate.title('');
        $scope.obj.filter = '';
      };
      $scope.setIntData = function (obj) {
        // TODO: si las placas son iguales, puede ser que se haya sincronizado y no se haya acyaulizado la lista de placas, entonces se pasaria un idinspeccion que no ,es esto cuando offline creo una placa, me pongo online y luego on pause hago el sync, aunque hayq ue pensar que cuando le pongo online, deberia sincronizar si hay señal 4g o wifi para imagenes o para todo
        if (obj.placa !== intermediateService.data.placa) {
          intermediateService.data.placa = obj.placa;
          intermediateService.data.idinspeccionSync = obj.sync === 1 ? true : false;
          intermediateService.data.idinspeccion = obj.idinspeccion;
        }
      };
      $scope.goFotos = function (obj) {
        $scope.setIntData(obj);
        $state.go('app.foto', { id: obj.idinspeccion });  // $location.path('/app/fotos/' + obj.idinspeccion);  // TODO: cambiar por state.go mas parametros, ver best practices
      };
      $scope.goVideo = function (obj) {
        $scope.setIntData(obj);
        // $location.path('/app/video/' + obj.idinspeccion);
        $state.go('app.video', { id: obj.idinspeccion });
      };
      $scope.goInspeccion = function (obj) {
        $scope.setIntData(obj);
        // TODO: aqui podria evaluar si ya se califico o no, si no se ha calificado podria desplegar el modal de clase carroceria
        $state.go('app.inspeccion', {
          id: obj.idinspeccion,
          placa: obj.placa,
          calificado: obj.calificado
        });
      };
      $scope.goAccesorios = function (obj) {
        $scope.setIntData(obj);
        $state.go('app.accesorios', { id: obj.idinspeccion });
      };
      $scope.goCodFas = function (obj) {
        $scope.setIntData(obj);
        $state.go('app.codFas', { id: obj.idinspeccion });
      };
      $scope.createException = function () {
        throw new Error('Something has gone terribly wrong!');
      };
    });
  }
]);
app.controller('TestCtrl', [
  '$scope',
  '$ionicPlatform',
  'sqlService',
  function ($scope, $ionicPlatform, sqlService) {
    $ionicPlatform.ready(function () {
      // var zumero = cordova.require('cordova/plugin/zumero');
      $scope.opendb = function () {
        x = window.sqlitePlugin.openDatabase({ name: 'zumerotestdbfile' }, function (resultObj, fullPathParam, dbObject) {
          console.log(dbObject, 'dbobject');
          console.log(resultObj, 'fulpath:', fullPathParam);  //Important!  If you don't close the database object, future calls to openDatabase 
                                                              //won't call the success function.
                                                              // dbObject.close();
        });
      };
      $scope.closedb = function () {
        console.log('cerrando', x);
        // if (!x) {
        x.close();
        // zumero sqlite funciona asi .close = function(success, error) { pero no se usan al llamar corodva.exe
        console.log(x.openDBS);  // }
      };
      $scope.sync = function () {
        var fullPathParam = '/data/data/com.ionicframework.fotosview390747/databases/zumerotestdb.db';
        var server = 'http://192.168.1.13:8080/';
        var dbfile = 'zumerotestdbfile';
        var notifySuccess = function (s) {
          console.log(s);
        };
        var notifyError = function (e) {
          console.log(e);
        };
        zumero.sync(fullPathParam, '', server, dbfile, null, null, null, notifySuccess, notifyError);
      };
      $scope.o = {
        s: true,
        e: true,
        u: true
      };
      sqlService.sync();
    });
  }
]);
app.controller('VideoCtrl', [
  '$scope',
  'videoService',
  '$ionicPlatform',
  '$ionicScrollDelegate',
  'fileTransferService',
  '$filter',
  '$stateParams',
  '$ionicNavBarDelegate',
  'copyFileService',
  'videoThumbnailService',
  'getVideoService',
  'checkFileService',
  'titleService',
  'offlineService',
  'onlineStatusService',
  'intermediateService',
  'toastService',
  'errorService',
  'zumeroService',
  'momentService',
  'gpsService',
  function (s, videoService, $ionicPlatform, $ionicScrollDelegate, fileTransferService, $filter, $stateParams, $ionicNavBarDelegate, copyFileService, videoThumbnailService, getVideoService, checkFileService, titleService, offlineService, onlineStatusService, intermediateService, toastService, errorService, zumeroService, momentService, gpsService) {
    $ionicPlatform.ready(function () {
      titleService.title = intermediateService.data.placa;
      // $stateParams.id;
      // s.tittle = '';
      s.tittle = intermediateService.data.placa;
      // $stateParams.id;
      s.idinspeccion = intermediateService.data.idinspeccion;
      //$stateParams.id;
      s.oss = onlineStatusService.data;
      s.videos = videoService.videos;
      //videoService.all();
      videoService.getVideos(intermediateService.data.idinspeccion).then(function () {
        s.videos = videoService.videos;
      });
      // var errorService.consoleError = function (e) {
      //   console.log('error', e);
      // };
      var insertVideo = function (imageURI, sync, thumbnail, onupload) {
        videoService.insertVideo(intermediateService.data.idinspeccion, imageURI, sync, thumbnail, onupload).then(function () {
          console.log('en el controller despues de insert sqlite video ');
        });
      };
      var updateVideo = function (imageURI, sync, thumbnail, onupload) {
        videoService.updateVideo(intermediateService.data.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de update sqlite video ');
        });
      };
      var updateAfterUpload = function (imageURI, sync, onupload) {
        var objVideo = searchOneInArray(imageURI);
        objVideo.sync = sync;
        objVideo.onUpload = onupload;
        // insertVideo(imageURI, sync, objVideo.thumbnail);
        updateVideo(imageURI, sync, onupload);
        zumeroService.zync(3);
        intermediateService.data.isTakingVid = false;
      };
      var refreshProgress = function (imageURI, percentage) {
        var objVideo = searchOneInArray(imageURI);
        objVideo.progress = percentage;
      };
      var preFileUpload = function (obj) {
        if (offlineService.data.offlineMode) {
          updateAfterUpload(obj.path, false, false);
        } else {
          fileTransferService.fileUpload(obj).then(function (res) {
            console.log(res);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, true, false);
          }, function (e) {
            console.log(e);
            console.timeEnd('fileUpload');
            updateAfterUpload(obj.path, false, false);
            if (e.code === 4) {
              offlineService.data.offlineMode = true;
              toastService.showShortBottom('activado modo offline');
            }
          }, function (progress) {
            // constant progress updates
            // console.log(progress);
            // refreshProgress(imageURI, Math.round(progress.loaded / progress.total * 100));
            console.log(Math.round(progress.loaded / progress.total * 100));
          });
        }
      };
      var rtnObjVideo = function (placa, path, sync, onUpload, thumbnail) {
        var obj = {
          placa: placa,
          path: path,
          sync: sync,
          onUpload: onUpload,
          //s.oss.online === true ? true : false
          thumbnail: thumbnail,
          rutaSrv: momentService.rutaSrv(path)
        };
        return obj;
      };
      var searchOneInArray = function (srcImg) {
        var found = $filter('filter')(s.videos, { path: srcImg }, true);
        if (found.length) {
          return found[0];
        } else {
          console.log('not found in array search');
        }
      };
      var loadThumbnail = function (obj) {
        videoThumbnailService.generateThumbnail(obj.path).then(function (thumbnailSrc) {
          searchOneInArray(obj.path).thumbnail = thumbnailSrc;
          var sync = false;
          // TODO: onupload dependera si esta online o no para saber si se intenta subir;
          var onUpload = true;
          insertVideo(obj.path, sync, thumbnailSrc, onUpload);
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
          preFileUpload(obj);
        }, errorService.consoleError);
      };
      s.tryUpload = function (foto) {
        var objVideo = searchOneInArray(foto.path);
        objVideo.onUpload = true;
        preFileUpload(objVideo);
      };
      s.getVidFile = function () {
        intermediateService.data.isTakingVid = true;
        videoService.takedVid().then(function (videoData) {
          gpsService.gpsHtml(intermediateService.data.idinspeccion);
          // console.log(videoData);
          angular.forEach(videoData, function (value, key) {
            // console.log(key + ': ' + value);
            copyFileService.copyFile(value.fullPath).then(function () {
              // console.log(checkFileService.fileEntry, checkFileService.file);
              var res = checkFileService.fileEntry;
              var obj = rtnObjVideo(intermediateService.data.placa, res.nativeURL, false, true, '');
              // console.log(res, 'copyok');
              s.videos.push(obj);
              loadThumbnail(obj);  // preFileUpload(obj);
            }, errorService.consoleError);
          });
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
      s.getVidFileCompress = function () {
        intermediateService.data.isTakingVid = true;
        getVideoService.getVideoCompress().then(function () {
          gpsService.gpsHtml(intermediateService.data.idinspeccion);
          var resVideoCompress = checkFileService.fileEntry;
          // TODO: 12582912 son 12MB ;
          if (checkFileService.file.size < 12582912) {
            // console.log(getVideoService.fileEntry);
            copyFileService.copyFile(resVideoCompress.nativeURL).then(function () {
              // console.log(copyFileService.fileEntry, copyFileService.file);
              var res = checkFileService.fileEntry;
              var obj = rtnObjVideo(intermediateService.data.placa, res.nativeURL, false, true, '');
              // console.log(res, 'copyok');
              s.videos.push(obj);
              loadThumbnail(obj);  // preFileUpload(res.nativeURL);
            }, errorService.consoleError);
          } else {
            alert('el archivo supera el tama\xF1a maximo permitido. maximo 12MB');
          }
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
    });
  }
]);
'use strict';
app.controller('loginController', [
  '$scope',
  '$location',
  'authService',
  'ngAuthSettings',
  '$ionicSideMenuDelegate',
  'localStorageService',
  '$ionicPlatform',
  '$state',
  function ($scope, $location, authService, ngAuthSettings, $ionicSideMenuDelegate, localStorageService, $ionicPlatform, $state) {
    $ionicPlatform.ready(function () {
      $scope.src = 'img/icon.png';
      // TODO: verificar si esto se puede hacer en el run, pero con state.go app.placas
      var _already = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
          var n = moment();
          var e = moment(authData.exp);
          console.log(n.diff(e, 'seconds'));
          if (n.diff(e, 'seconds') < 0) {
            console.log('token redirect placas');
            $location.path('/app/placas');
            $state.go('app.placas');
          }
        }
      };
      _already();
      $scope.loggedNow = false;
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.loginData = {
        userName: '',
        password: '',
        useRefreshTokens: false
      };
      $scope.message = '';
      $scope.login = function () {
        if (true) {
          authService.login($scope.loginData).then(function (response) {
            $scope.onLogged();
          }, function (err) {
            $scope.message = err.error_description;
          });
        } else {
          $scope.message = 'verifique que disponga de conexion a internet, e intente de nuevo';
        }
      };
      $scope.onLogged = function () {
        //$location.path('/orders');
        // $scope.logged(true);
        //console.log(response,$location);
        $scope.message = '';
        // $location.path('/app/placas');
        $state.go('app.placas');
      };
      $scope.authExternalProvider = function (provider) {
        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + 'api/Account/ExternalLogin?provider=' + provider + '&response_type=token&client_id=' + ngAuthSettings.clientId + '&redirect_uri=' + redirectUri;
        window.$windowScope = $scope;
        var oauthWindow = window.open(externalProviderUrl, 'Authenticate Account', 'location=0,status=0,width=600,height=750');
      };
      $scope.authCompletedCB = function (fragment) {
        $scope.$apply(function () {
          if (fragment.haslocalaccount === 'False') {
            authService.logOut();
            authService.externalAuthData = {
              provider: fragment.provider,
              userName: fragment.external_user_name,
              externalAccessToken: fragment.external_access_token
            };
            $location.path('/associate');
          } else {
            //Obtain access token and redirect to orders
            var externalData = {
              provider: fragment.provider,
              externalAccessToken: fragment.external_access_token
            };
            authService.obtainAccessToken(externalData).then(function (response) {
              $location.path('/orders');
            }, function (err) {
              $scope.message = err.error_description;
            });
          }
        });
      }  // $scope.alreadyLogged();               
;
    });
  }
]);
app.controller('InspeccionCtrl', function ($scope, titleService, inspeccionService, $ionicScrollDelegate, $stateParams, $ionicModal, $ionicNavBarDelegate, $ionicLoading, $timeout, $filter, $ionicSideMenuDelegate, sqliteService, $ionicPlatform, intermediateService, toastService) {
  $ionicPlatform.ready(function () {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.idinspeccion = intermediateService.data.idinspeccion;
    // parseInt($stateParams.id);
    inspeccionService.alreadySaved = parseInt($stateParams.calificado) === 1 ? true : false;
    $scope.alreadySaved = inspeccionService.alreadySaved;
    titleService.title = intermediateService.data.placa;
    //$stateParams.id;
    // parseInt($stateParams.id);
    //parseInt($stateParams.id);
    $scope.tittle = intermediateService.data.placa;
    inspeccionService.idinspeccion = intermediateService.data.idinspeccion;
    $scope.data = inspeccionService.data;
    // parseInt($stateParams.id);
    $ionicModal.fromTemplateUrl('templates/opcionModal.html', { scope: $scope }).then(function (modal) {
      $scope.modal = modal;
    });
    // TODO: como esto se sincroniza una sola vez, no hay problema con el idinspeccion, el problema esta en accesorios y en fotos, que se sube uno a uno, entonces podria cambiar, o en accesorios hacer un beforleave de view, mi pregunta es , si no abandona la view, como sincronizo? otra mas si paso a background puedo sincronizar???
    // TODO: esta variable me la da la pbase de satos, si ya esta calificado o no
    $scope.obj = { customsection: 0 };
    $scope.show = function () {
      $ionicLoading.show({ template: '<ion-spinner icon="android"></ion-spinner>' });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };
    // $scope.show();
    // $timeout($scope.hide, 15000);
    $scope.items = [];
    // initial image index
    $scope._Index = 0;
    $scope.setCustomSection = function (i) {
      // console.log($scope.sections, i);
      $scope.obj.customsection = $scope.sections[i].customsection;
      // $scope.setMin();
      $ionicScrollDelegate.scrollTop();
    };
    //refence service
    // if a current image is the same as requested image
    $scope.isActive = function (index) {
      return $scope._Index === index;
    };
    // show prev image
    $scope.showPrev = function () {
      $scope._Index = $scope._Index > 0 ? --$scope._Index : $scope.sections.length - 1;
      $scope.setCustomSection($scope._Index);
    };
    // show next image
    $scope.showNext = function () {
      $scope._Index = $scope._Index < $scope.sections.length - 1 ? ++$scope._Index : 0;
      $scope.setCustomSection($scope._Index);
    };
    /* Show list */
    $scope.showItems = function (item) {
      // TODO: para deshabilitar el update, aunque ya esta montado, me preocupa es el zync cada que se haga un update
      if ($scope.alreadySaved) {
        return;
      }
      item.dirty = true;
      inspeccionService.item = item;
      $scope.item = inspeccionService.item;
      $scope.modal.show();
    };
    /* Hide list */
    $scope.hideItems = function () {
      $scope.modal.hide();
    };
    $scope.validateSingle = function (opcion) {
      // Set selected text
      $scope.item.sl.label = opcion.label;
      // Set selected value
      $scope.item.sl.value = opcion.value;
      if ($scope.alreadySaved) {
        inspeccionService.updateSingle().then(function () {
          console.log('ok update');
        });
      }
      // Hide items
      $scope.hideItems();  // Execute callback function
    };
    $scope.save = function (items) {
      toastService.showLongBottom('Guardando informacion');
      inspeccionService.save().then(function () {
        $scope.alreadySaved = inspeccionService.alreadySaved;
      });
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $scope.closeModalOne = function () {
      $scope.modalOne.hide();
      // inspeccionService.clearTipo();
      $scope.cl.idclase = null;
      $scope.cl.idcarroceria = null;
      $scope.cl.tipo = null;
    };
    $ionicModal.fromTemplateUrl('templates/modalGetItems.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalOne = modal;
    });
    $scope.openModalOne = function () {
      $scope.modalOne.show();
    };
    $scope.getClases = function (idtipo) {
      inspeccionService.getClases().then(function () {
        $scope.clases = inspeccionService.clases;
        $scope.carrocerias = inspeccionService.carrocerias;
      });
    };
    $scope.getCarrocerias = function (idclase) {
      inspeccionService.getCarrocerias().then(function () {
        $scope.carrocerias = inspeccionService.carrocerias;
      });
    };
    $scope.setItems = function () {
      $scope.items = inspeccionService.all;
      $scope.sections = inspeccionService.sections;
      $scope.setCustomSection($scope._Index);
    };
    $scope.setIdClaCa = function () {
      inspeccionService.setIdClaCa().then(function () {
        console.log('setIdClaCa en el controller');
        $scope.setItems();
        $scope.closeModalOne();
      });
    };
    $scope.getAlreadyInspect = function () {
      inspeccionService.getAlreadyInspect().then(function () {
        console.log('getAlreadyInspect en el controller');
        $scope.setItems();
      });
    };
    $scope.init = function () {
      $scope.tipos = inspeccionService.tipos;
      $scope.cl = inspeccionService.cl;
      // TODO: aqui valido si ya se califico o si apenas se va a realizar
      if ($scope.alreadySaved) {
        $scope.getAlreadyInspect();
      } else {
      }
    };
    // on init
    $scope.init();
  });
});
app.factory('inspeccionService', [
  'sqliteService',
  '$q',
  '$filter',
  'errorService',
  'momentService',
  'zumeroService',
  'intermediateService',
  function (sqliteService, $q, $filter, errorService, momentService, zumeroService, intermediateService) {
    var inspeccionServiceFactory = {};
    inspeccionServiceFactory.all = [];
    inspeccionServiceFactory.sections = [];
    inspeccionServiceFactory.alreadySaved = false;
    inspeccionServiceFactory.idinspeccion = 0;
    inspeccionServiceFactory.item = {};
    inspeccionServiceFactory.data = {
      kilometraje: '',
      observacion: ''
    };
    var _setItems = function () {
      angular.forEach(preItems, function (obj, key) {
        var sl = {
          value: obj.controlJson[0].id,
          label: obj.controlJson[0].text
        };
        // console.log('primer');
        obj.sl = sl;
      });
      inspeccionServiceFactory.all = preItems;
    };
    var _sections = function () {
      inspeccionServiceFactory.sections = $filter('orderBy')($filter('unique')(inspeccionServiceFactory.all, 'customsection'), 'customsection');
    };
    var _getItems = function () {
      var query = 'select * from idinspeccion';
      var binding = [];
      var deferred = $q.defer();
      _setItems();
      _sections();
      // TODO: logica para saber si ya fue calificado
      inspeccionServiceFactory.alreadySaved = false;
      deferred.resolve();
      return deferred.promise;
    };
    var _rtnBinding = function (obj) {
      var binding = [
        // inspeccionServiceFactory.idinspeccion,
        intermediateService.data.idinspeccion,
        obj.idservicio,
        obj.iditem,
        obj.idParentItem,
        obj.nombre,
        parseInt(obj.sl.value),
        obj.sl.label
      ];
      return binding;
    };
    var _save = function () {
      var qarray = [];
      qarray.push(_insertAllItems());
      qarray.push(_insertObservacion());
      qarray.push(_insertKilometraje());
      return $q.all(qarray).then(function (res) {
        console.log('resueltas las 3 promesas en el servicio inspeccion');
        return _updateIdClaseCarroceria();
      }, errorService.consoleError);  // return sqliteService.insertCollection(query, bindings).then(function (res) {
                                      //   // console.log('ingreso ok', res);
                                      //   return _updateIdClaseCarroceria();
                                      // }, function (e) {
                                      //   console.log(e);
                                      // });
    };
    var _insertAllItems = function () {
      var query = 'INSERT INTO [idpropiedades] ([idinspeccion] ,[idsubproceso] ,[iditem],[idparentitem]  ,[nombre] ,[idopcion]  ,[seleccion] ) VALUES (?,?,?,?,?,?,?)';
      var bindings = [];
      angular.forEach(inspeccionServiceFactory.all, function (obj, key) {
        bindings.push(_rtnBinding(obj));
      });
      return sqliteService.insertCollection(query, bindings);
    };
    var _insertObservacion = function () {
      var query = 'INSERT INTO [observaciones] ([idinspeccion] ,[idsubproceso]  ,[observacion], [placa])   VALUES (?,?,?,?)';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        829,
        //_cl.tipo,
        inspeccionServiceFactory.data.observacion,
        intermediateService.data.placa
      ];
      return sqliteService.executeQuery(query, binding);
    };
    var _insertKilometraje = function () {
      var query = 'INSERT INTO [kilometrajes]        ([idinspeccion], [kilometraje], [placa])      VALUES (?,?,?)';
      var binding = [
        // inspeccionServiceFactory.idinspeccion,
        intermediateService.data.idinspeccion,
        inspeccionServiceFactory.data.kilometraje,
        intermediateService.data.placa
      ];
      return sqliteService.executeQuery(query, binding);
    };
    var _rtnBindingUpdate = function (obj) {
      var binding = [
        parseInt(obj.sl.value),
        obj.sl.label,
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        obj.iditem
      ];
      return binding;
    };
    var _updateSingle = function () {
      var query = 'UPDATE [idpropiedades] set [idopcion]=? , [seleccion]= ? WHERE [idinspeccion]=? and [iditem]=? ';
      var binding = _rtnBindingUpdate(inspeccionServiceFactory.item);
      return sqliteService.executeQuery(query, binding).then(function (res) {
        console.log('update single', res);
      }, function (e) {
        console.log(e);
      });
    };
    var _cl = {
      idclase: null,
      idcarroceria: null,
      tipo: null
    };
    inspeccionServiceFactory.clases = [];
    inspeccionServiceFactory.carrocerias = [];
    // TODO: para la implementacion de pesados y motos, ya si debe ser una consulta
    inspeccionServiceFactory.tipos = [{
        value: 829,
        label: 'Livianos'
      }  // ,
         // {
         //   value: 844,
         //   label: 'Pesados'
         // }
];
    var _getClases = function () {
      if (angular.isDefined(_cl.tipo) && angular.isNumber(parseInt(_cl.tipo))) {
        var query = 'SELECT  distinct cc.idclase as value  , bt.Nombre as label  FROM clases_tipoVehiculo ct  inner join   clases_carrocerias cc on cc.idclase=ct.idclase   inner join Base_Tipos bt on bt.IdTipo=cc.idclase  where ct.idtipovehiculo=?';
        var binding = [parseInt(_cl.tipo)];
        return sqliteService.executeQuery(query, binding).then(function (res) {
          // TODO: ASI NO SIRVE , no se actualiza el expuesto ,,_clases = sqliteService.rtnArray(res);
          inspeccionServiceFactory.clases = sqliteService.rtnArray(res);
          _cl.idclase = null;
          inspeccionServiceFactory.carrocerias = [];
        }, errorService.consoleError);
      }
    };
    var _getCarrocerias = function () {
      if (angular.isDefined(_cl.idclase) && angular.isNumber(parseInt(_cl.idclase))) {
        var query = 'SELECT  distinct cc.idcarroceria as value , bt.Nombre as label  FROM    clases_carrocerias cc  inner join Base_Tipos bt on bt.IdTipo=cc.idcarroceria   where cc.idclase=?';
        var binding = [parseInt(_cl.idclase)];
        return sqliteService.executeQuery(query, binding).then(function (res) {
          inspeccionServiceFactory.carrocerias = sqliteService.rtnArray(res);
          _cl.idcarroceria = null;
        }, errorService.consoleError);
      }
    };
    var _setIdClaCa = function () {
      var query = 'SELECT [idclasecarroceria] ,[idclase] ,[idcarroceria]  ,[idcodigocalificacion]  ,[idextrainfo]   FROM [clases_carrocerias] WHERE idclase=? and idcarroceria=? ';
      var binding = [
        parseInt(_cl.idclase),
        parseInt(_cl.idcarroceria)
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        inspeccionServiceFactory.idClaseCarroceria = sqliteService.rtnArray(res)[0].idclasecarroceria;
        return _getToInspect(sqliteService.rtnArray(res)[0].idcodigocalificacion);
      }, errorService.consoleError);
    };
    var _setJson = function (array) {
      angular.forEach(array, function (value, key) {
        value.controlJson = angular.fromJson(value.controlJson);
        var sl = {
          value: value.controlJson[0].value,
          label: value.controlJson[0].label
        };
        // console.log('primer');
        value.sl = sl;
      });
      inspeccionServiceFactory.all = array;
    };
    var _setAlreadyInspectJson = function (array) {
      angular.forEach(array, function (value, key) {
        value.controlJson = angular.fromJson(value.controlJson);
        // TODO: el json de controlJson devuelve un value= "" string, ver si se puede mejorar;
        var sl = {
          value: value.value.toString(),
          label: value.label
        };
        // console.log('primer');
        value.sl = sl;
      });
      inspeccionServiceFactory.all = array;
    };
    var _clearObsKm = function () {
      inspeccionServiceFactory.data.kilometraje = '';
      inspeccionServiceFactory.data.observacion = '';
    };
    // var _clearTipo = function () {
    //   inspeccionServiceFactory.cl.idclase = {
    //     idclase: null,
    //     idcarroceria: null,
    //     tipo: null
    //   };
    // };
    var _getToInspect = function (idcodigocalificacion) {
      var query = 'select oif.idservicio , cpc.iditem, idParentItem, nombre,customsection, customorder , controlJson from  viewV3 oif ';
      //siempre dejar un espacio en blanco  
      query += 'inner join calificacionpiezascodigo cpc on  cpc.iditem= oif.iditem  and oif.tipo=1 ';
      query += 'inner join controlElementos ce on ce.idcontrol =oif.idcontrol ';
      query += 'where oif.idservicio=? and cpc.idcodigocalificacion=?';
      var binding = [
        829,
        //parseInt(_cl.tipo),
        idcodigocalificacion
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        _setJson(sqliteService.rtnArray(res));
        _sections();
        _clearObsKm();  // _clearTipo();
      }, errorService.consoleError);
    };
    var _serObsKm = function () {
      var query = 'SELECT    o.idobservacion,   observacion, kilometraje FROM   observaciones o inner join kilometrajes k on k.idinspeccion=o.idinspeccion ';
      query += 'WHERE     (o.idinspeccion = ?) AND (idsubproceso = ?) Order by o.idobservacion desc limit 1 ';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        829
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        var obsKm = sqliteService.rtnArray(res)[0];
        inspeccionServiceFactory.data.observacion = obsKm.observacion;
        inspeccionServiceFactory.data.kilometraje = obsKm.kilometraje;
      }, errorService.consoleError);
    };
    var _getAlreadyInspect = function () {
      var query = 'select oif.idservicio , cpc.iditem, oif.idParentItem, oif.nombre,customsection, customorder , controlJson , idp.idopcion as value, idp.seleccion as label ';
      query += 'from  viewVdos oif inner join calificacionpiezascodigo cpc on  cpc.iditem= oif.iditem  and oif.tipo=1 ';
      query += 'inner join controlElementos ce on ce.idcontrol =oif.idcontrol ';
      query += 'inner join  clases_carrocerias cc on cc.idcodigocalificacion=cpc.idcodigocalificacion ';
      query += 'inner join idinspeccion i on i.idClaseCarroceria=cc.idclasecarroceria ';
      query += 'inner join idpropiedades idp on idp.idinspeccion=i.idinspeccion and idp.iditem = cpc.iditem ';
      query += 'where  i.idinspeccion =? and oif.idservicio=?    ';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        829
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        _setAlreadyInspectJson(sqliteService.rtnArray(res));
        _sections();
        return _serObsKm();
      }, errorService.consoleError);
    };
    var _updateIdClaseCarroceria = function () {
      var query = 'UPDATE [idinspeccion]   SET [idClaseCarroceria] =? WHERE idinspeccion=?';
      var binding = [
        inspeccionServiceFactory.idClaseCarroceria,
        intermediateService.data.idinspeccion
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return _insertState(477);
      }, errorService.consoleError);
    };
    var _insertState = function (idestado) {
      var query = 'INSERT INTO [idsubprocesoseguimiento] ([idinspeccion]    ,[idsubproceso]   ,[idestado]   ,[fecha]  )  VALUES    (?,?,?,?)';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        829,
        //_cl.tipo,
        idestado,
        momentService.getDateTime()
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        inspeccionServiceFactory.alreadySaved = true;
        zumeroService.zync(3);  // inspeccionServiceFactory.cl.tipo = null;
      }, errorService.consoleError);
    };
    inspeccionServiceFactory.getItems = _getItems;
    inspeccionServiceFactory.updateSingle = _updateSingle;
    inspeccionServiceFactory.save = _save;
    inspeccionServiceFactory.cl = _cl;
    inspeccionServiceFactory.getClases = _getClases;
    inspeccionServiceFactory.getCarrocerias = _getCarrocerias;
    inspeccionServiceFactory.setIdClaCa = _setIdClaCa;
    inspeccionServiceFactory.getAlreadyInspect = _getAlreadyInspect;
    // inspeccionServiceFactory.clearTipo = _clearTipo;
    return inspeccionServiceFactory;
  }
]);
app.factory('accesoriosService', [
  'sqliteService',
  '$q',
  '$filter',
  'errorService',
  'intermediateService',
  function (sqliteService, $q, $filter, errorService, intermediateService) {
    var accesoriosServiceFactory = {};
    accesoriosServiceFactory.all = [];
    accesoriosServiceFactory.alreadySaved = false;
    accesoriosServiceFactory.idinspeccion = 0;
    accesoriosServiceFactory.item = {};
    accesoriosServiceFactory.initData = {};
    var _getItems = function () {
      var query = 'select * from idaccesorios where idinspeccion=?';
      var binding = [accesoriosServiceFactory.idinspeccion];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        console.log('get items en el servicio');
        accesoriosServiceFactory.all = sqliteService.rtnArray(res);
      }, function (e) {
        console.log(e);
      });
    };
    var _nombres = [
      {
        text: 'texta',
        id: 1
      },
      {
        text: 'textb',
        id: 2
      }
    ];
    var _estados = [
      {
        text: 'estadoa',
        id: 1
      },
      {
        text: 'estadob',
        id: 2
      }
    ];
    var _cantidades = [
      {
        text: '1',
        id: 1
      },
      {
        text: '2',
        id: 2
      }
    ];
    var _setNombres = function () {
      var query = 'SELECT  idcontrolelemento, idcontrol, controlJson FROM  controlElementos WHERE   idcontrol = 21';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        // console.log(sqliteService.rtnArray(res));
        // console.log(sqliteService.rtnArray(res).controlJson);
        // var json = sqliteService.rtnArray(res).controlJson;
        // console.log(angular.fromJson(json));
        accesoriosServiceFactory.initData.nombres = angular.fromJson(sqliteService.rtnArray(res)[0].controlJson);  //angular.fromJson(sqliteService.rtnArray(res).controlJson);
      }, errorService.consoleError);
    };
    var _setEstados = function () {
      var query = 'SELECT  idcontrolelemento, idcontrol, controlJson FROM  controlElementos WHERE   idcontrol = 20';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        accesoriosServiceFactory.initData.estados = angular.fromJson(sqliteService.rtnArray(res)[0].controlJson);
      }, errorService.consoleError);
    };
    var _setCantidades = function () {
      var query = 'SELECT  idcontrolelemento, idcontrol, controlJson FROM  controlElementos WHERE   idcontrol = 22';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        accesoriosServiceFactory.initData.cantidades = angular.fromJson(sqliteService.rtnArray(res)[0].controlJson);
      }, errorService.consoleError);
    };
    var _initOptions = function () {
      // TODO:  una bandera para saber que ya se setio, una vez, y evitar mas consulats, a menos que se haga una actualizacion del servidor
      var qarray = [];
      qarray.push(_setNombres());
      qarray.push(_setCantidades());
      qarray.push(_setEstados());
      return $q.all(qarray).then(function (res) {
        console.log('resueltas las 3 promesas en el servicio');
      }, errorService.consoleError);
    };
    var _initAcc = function () {
      // TODO: seria bueno iniciar estos ddl sin valores,  pero tendria que validar que si se seleccione algo;
      accesoriosServiceFactory.item = {
        nombre: accesoriosServiceFactory.initData.nombres[0],
        estado: accesoriosServiceFactory.initData.estados[0],
        cantidad: accesoriosServiceFactory.initData.cantidades[0],
        valor: 0,
        marca: '',
        referencia: '',
        img: {
          path: '',
          sync: false,
          onUpload: false,
          idinspeccion: accesoriosServiceFactory.idinspeccion
        }
      };
      return accesoriosServiceFactory.item;
    };
    var _rtnBinding = function (obj) {
      var binding = [
        accesoriosServiceFactory.idinspeccion,
        intermediateService.data.placa,
        obj.nombre.label,
        obj.estado.label,
        parseInt(obj.cantidad.value),
        obj.marca,
        obj.referencia,
        obj.valor,
        obj.img.path
      ];
      return binding;
    };
    var _save = function () {
      var query = 'INSERT INTO [idaccesorios] ([idinspeccion] ,[placa] ,[nombre] ,[estado] ,[cantidad] ,[marca] ,[referencia],[valor],[imgSrc]) VALUES  (?,?,?,?,?,?,?,?,?)';
      var binding = _rtnBinding(accesoriosServiceFactory.item);
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return _getItems();
      }, errorService.consoleError);
    };
    var _rtnBindingUpdate = function (obj) {
      var binding = [
        parseInt(obj.sl.value),
        obj.sl.text,
        accesoriosServiceFactory.idinspeccion,
        obj.iditem
      ];
      return binding;
    };
    var _updateSingle = function () {
      var query = 'UPDATE [idpropiedades] set [idopcion]=? , [seleccion]= ? WHERE [idinspeccion]=? and [iditem]=? ';
      var binding = _rtnBindingUpdate(accesoriosServiceFactory.item);
      return sqliteService.executeQuery(query, binding).then(function (res) {
        console.log('update single', res);
      }, function (e) {
        console.log(e);
      });
    };
    accesoriosServiceFactory.getItems = _getItems;
    accesoriosServiceFactory.updateSingle = _updateSingle;
    accesoriosServiceFactory.save = _save;
    accesoriosServiceFactory.initOptions = _initOptions;
    accesoriosServiceFactory.initAcc = _initAcc;
    return accesoriosServiceFactory;
  }
]);
'use strict';
app.factory('authInterceptorService', [
  '$q',
  '$location',
  'localStorageService',
  '$injector',
  'momentService',
  'sqliteService',
  function ($q, $location, localStorageService, $injector, momentService, sqliteService) {
    var authInterceptorServiceFactory = {};
    var _request = function (config) {
      config.headers = config.headers || {};
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }
      return config;
    };
    var _responseError = function (rejection) {
      // var authService = $injector.get('authService');
      // var query = 'INSERT  INTO [logs]([ex],[email],[fecha])  VALUES(?,?,?)';
      // var binding = [
      //   angular.toJson(rejection),
      //   authService.authentication.userName || '',
      //   momentService.getDateTime()
      // ];
      // sqliteService.executeQuery(query, binding).then(function (res) {
      // }, function (err) {
      //   console.error(err);
      // });
      if (rejection.status === 401) {
        var authService = $injector.get('authService');
        var authData = localStorageService.get('authorizationData');
        if (authData) {
          if (authData.useRefreshTokens) {
            $location.path('/refresh');
            return $q.reject(rejection);
          }
        }
        authService.logOut();
        $location.path('/login');
      }
      return $q.reject(rejection);
    };
    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
    return authInterceptorServiceFactory;
  }
]);
'use strict';
app.factory('authService', [
  '$http',
  '$q',
  'localStorageService',
  'ngAuthSettings',
  'momentService',
  function ($http, $q, localStorageService, ngAuthSettings, momentService) {
    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};
    var _authentication = {
      isAuth: false,
      userName: '',
      useRefreshTokens: false,
      lastLoging: ''
    };
    var _externalAuthData = {
      provider: '',
      userName: '',
      externalAccessToken: ''
    };
    var _saveRegistration = function (registration) {
      _logOut();
      return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
        return response;
      });
    };
    var _login = function (loginData) {
      var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password + '&client_id=' + ngAuthSettings.clientId;
      //siempre voy a mandar el clientid
      /*if (loginData.useRefreshTokens) {
           data = data + "&client_id=" + ngAuthSettings.clientId;
       }*/
      //tengo que revisar los cross origin, en la base de datos , y habilitarlo en el navegador chrome , importante
      var deferred = $q.defer();
      var d = moment();
      $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
        // console.log(moment(response..expires).format('YYYY-MM-DD'))
        rp = response;
        if (loginData.useRefreshTokens) {
          localStorageService.set('authorizationData', {
            token: response.access_token,
            userName: loginData.userName,
            refreshToken: response.refresh_token,
            useRefreshTokens: true,
            lastLogin: d  // ,
               // exp:moment(response..expires).format('YYYY-MM-DD');
,
            exp: momentService.addSeconds(response.expires_in)
          });
        } else {
          localStorageService.set('authorizationData', {
            token: response.access_token,
            userName: loginData.userName,
            refreshToken: '',
            useRefreshTokens: false,
            lastLogin: d  // ,
               // exp:moment(response..expires).format('YYYY-MM-DD')
,
            exp: momentService.addSeconds(response.expires_in)
          });
        }
        _authentication.isAuth = true;
        _authentication.lastLoging = moment();
        _authentication.userName = loginData.userName;
        _authentication.useRefreshTokens = loginData.useRefreshTokens;
        deferred.resolve(response);
      }).error(function (err, status) {
        _logOut();
        deferred.reject(err);
      });
      return deferred.promise;
    };
    var _logOut = function () {
      localStorageService.remove('authorizationData');
      _authentication.isAuth = false;
      _authentication.userName = '';
      _authentication.useRefreshTokens = false;
    };
    var _fillAuthData = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        _authentication.isAuth = true;
        _authentication.userName = authData.userName;
        _authentication.useRefreshTokens = authData.useRefreshTokens;
      }
    };
    var _refreshToken = function () {
      var deferred = $q.defer();
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        if (authData.useRefreshTokens) {
          var data = 'grant_type=refresh_token&refresh_token=' + authData.refreshToken + '&client_id=' + ngAuthSettings.clientId;
          localStorageService.remove('authorizationData');
          $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            localStorageService.set('authorizationData', {
              token: response.access_token,
              userName: response.userName,
              refreshToken: response.refresh_token,
              useRefreshTokens: true
            });
            deferred.resolve(response);
          }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
          });
        }
      }
      return deferred.promise;
    };
    var _obtainAccessToken = function (externalData) {
      var deferred = $q.defer();
      $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', {
        params: {
          provider: externalData.provider,
          externalAccessToken: externalData.externalAccessToken
        }
      }).success(function (response) {
        localStorageService.set('authorizationData', {
          token: response.access_token,
          userName: response.userName,
          refreshToken: '',
          useRefreshTokens: false
        });
        _authentication.isAuth = true;
        _authentication.userName = response.userName;
        _authentication.useRefreshTokens = false;
        deferred.resolve(response);
      }).error(function (err, status) {
        _logOut();
        deferred.reject(err);
      });
      return deferred.promise;
    };
    var _registerExternal = function (registerExternalData) {
      var deferred = $q.defer();
      $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {
        localStorageService.set('authorizationData', {
          token: response.access_token,
          userName: response.userName,
          refreshToken: '',
          useRefreshTokens: false
        });
        _authentication.isAuth = true;
        _authentication.userName = response.userName;
        _authentication.useRefreshTokens = false;
        deferred.resolve(response);
      }).error(function (err, status) {
        _logOut();
        deferred.reject(err);
      });
      return deferred.promise;
    };
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;
    return authServiceFactory;
  }
]);
app.factory('checkFileService', [
  '$cordovaFile',
  '$q',
  function ($cordovaFile, $q) {
    var checkFileServiceFactory = {};
    var _fileDetail = function (FileEntry) {
      var deferred = $q.defer();
      checkFileServiceFactory.fileEntry = FileEntry;
      FileEntry.file(function (file) {
        checkFileServiceFactory.file = file;
        deferred.resolve();
      }, function (e) {
        deferred.reject(e);
      });
      return deferred.promise;
    };
    var _checkFile = function (mediaURI) {
      var FileName = mediaURI.replace(/^.*[\\\/]/, '');
      console.log(FileName);
      // var path=cordova.file.externalRootDirectory; // imagenes cordova.file.externalCacheDirectory
      var path = mediaURI.substring(0, mediaURI.lastIndexOf('/') + 1);
      console.log(path);
      // var newFileName = 'new_' + FileName;
      return $cordovaFile.checkFile(path, FileName).then(function (FileEntry) {
        return _fileDetail(FileEntry);
      });
    };
    checkFileServiceFactory.checkFile = _checkFile;
    checkFileServiceFactory.fileDetail = _fileDetail;
    return checkFileServiceFactory;
  }
]);
app.factory('copyFileService', [
  '$cordovaFile',
  '$q',
  'checkFileService',
  function ($cordovaFile, $q, checkFileService) {
    var copyFileServiceFactory = {};
    // var _fileDetail = function (FileEntry) {
    //   var deferred = $q.defer();
    //   copyFileServiceFactory.fileEntry = FileEntry;
    //   FileEntry.file(function (file) {
    //     copyFileServiceFactory.file = file;
    //     deferred.resolve();
    //   }, function (e) {
    //     deferred.reject(e);
    //   });
    //   return deferred.promise;
    // };
    var _copyFile = function (mediaURI) {
      var FileName = mediaURI.replace(/^.*[\\\/]/, '');
      console.log(FileName);
      // var path=cordova.file.externalRootDirectory; // imagenes cordova.file.externalCacheDirectory
      var path = mediaURI.substring(0, mediaURI.lastIndexOf('/') + 1);
      console.log(path);
      var newFileName = FileName;
      // 'new_' + FileName;
      return $cordovaFile.copyFile(path, FileName, cordova.file.dataDirectory, newFileName).then(function (FileEntry) {
        // return copyFileServiceFactory.fileEntry=FileEntry;
        return checkFileService.fileDetail(FileEntry);
      });
    };
    copyFileServiceFactory.copyFile = _copyFile;
    return copyFileServiceFactory;
  }
]);
app.factory('cordovaEventsService', function ($timeout, onlineStatusService, zumeroService, intermediateService) {
  var cordovaEventsServiceFactory = {};
  var _onResume = function () {
    document.addEventListener('resume', function () {
      $timeout(function () {
        console.log('The application is resuming from the background');
      }, 0);
    }, false);
  };
  var _onPause = function () {
    document.addEventListener('pause', function () {
      $timeout(function () {
        _callZync();
        console.log('The application is pausing to the background');
      }, 0);
    }, false);
  };
  var _callZync = function () {
    // TODO: evaluar todas las posibilidades de esto aca, por que si la señal es muy mala que puede pasar, aunque el zync de bases de datos nunca hasido muy grande en informacion
    if (onlineStatusService.data.isOnline && !intermediateService.data.isTakingPic && !intermediateService.data.isTakingVid) {
      zumeroService.zync(1);
    }
  };
  cordovaEventsServiceFactory.onPause = _onPause;
  cordovaEventsServiceFactory.onResume = _onResume;
  // cordovaEventsServiceFactory.callZync = _callZync;
  return cordovaEventsServiceFactory;
});
app.factory('createDirService', [
  '$cordovaFile',
  '$q',
  'checkFileService',
  function ($cordovaFile, $q, checkFileService) {
    var createDirServiceFactory = {};
    var _createDir = function (dir) {
      return $cordovaFile.createDir(cordova.file.dataDirectory, dir).then(function (succes) {
        return succes;
      });
    };
    createDirServiceFactory.createDir = _createDir;
    return createDirServiceFactory;
  }
]);
app.factory('deviceService', function ($cordovaDevice) {
  var deviceServiceFactory = {};
  var _setInfo = function () {
    deviceServiceFactory.data = {
      device: $cordovaDevice.getDevice(),
      cordova: $cordovaDevice.getCordova(),
      model: $cordovaDevice.getModel(),
      platform: $cordovaDevice.getPlatform(),
      uuid: $cordovaDevice.getUUID(),
      version: $cordovaDevice.getVersion()
    };
  };
  deviceServiceFactory.setInfo = _setInfo;
  return deviceServiceFactory;
});
app.factory('easyDirService', [
  '$cordovaFile',
  function ($cordovaFile) {
    var easyDirServiceFactory = {};
    var _createDir = function () {
      var today = moment().format('YYYY-MM-DD');
      var CurrentDate = moment().unix();
      $cordovaFile.checkDir(cordova.file.dataDirectory, today).then(function (success) {
        console.log('alreadyexist');  // success
      }, function (error) {
        $cordovaFile.createDir(cordova.file.dataDirectory, today, false).then(function (success) {
          console.log('dir created', today);
        }, function (error) {
          console.log('cannot created dir', today);
        });  // error
      });
    };
    easyDirServiceFactory.createDir = _createDir;
    return easyDirServiceFactory;
  }
]);
app.factory('errorService', function ($timeout) {
  var errorServiceFactory = {};
  var _consoleError = function (e) {
    console.log(e);
  };
  errorServiceFactory.consoleError = _consoleError;
  return errorServiceFactory;
});
app.factory('fileTransferService', [
  '$cordovaFileTransfer',
  function ($cordovaFileTransfer) {
    var fileTransferServiceFactory = {};
    fileTransferServiceFactory.setTimeOut = 17000;
    var _fileUpload = function (obj) {
      var FileName = obj.path.replace(/^.*[\\\/]/, '');
      console.log(FileName);
      var fileExt = obj.path.split('.').pop();
      console.log('extension', fileExt);
      var mimetype = 'image/jpeg';
      // fileTransferServiceFactory.setTimeOut = 20000;
      if (fileExt === 'mp4') {
        mimetype = 'video/mp4';
        fileTransferServiceFactory.setTimeOut = 60000;
      }
      var server = 'http://190.145.39.138/auth/api/file';
      // 'https://www.ajustevsiva.com/auth/api/file';
      var options = {};
      options.fileKey = 'file';
      options.fileName = obj.path.substr(obj.path.lastIndexOf('/') + 1);
      options.mimeType = mimetype;
      /*var authData = localStorageService.get('authorizationData');
       if (authData) {
         var headers = { 'Authorization': 'Bearer ' + authData.token };
         options.headers = headers;
       }*/
      var params = {};
      params.pathFileServer = obj.rutaSrv.substring(0, obj.rutaSrv.lastIndexOf('/') + 1);
      // '2015/March/18/PRUEBA700';
      // url;//UpPromise.pathFileServer;
      params.value2 = 'param';
      options.params = params;
      // TODO: definir un servicio para set el timeout dependiendo si es foto o video;
      options.timeout = fileTransferServiceFactory.setTimeOut;
      //$scope.data.timeout;
      //500;//30000;//miliseconds
      console.time('fileUpload');
      return $cordovaFileTransfer.upload(server, obj.path, options).then(function (success) {
        console.log('succes en el servicio');
        // console.timeEnd('fileUpload');
        return success;  //TODO: verificar si puedo poner el error aca y disparar el ooflinemode desde aca y no desde todos los controllers
      }  // TODO: si ejecuto en el servicio no llega al controlador, aunque podria hacer una practica para definir los parametros de afterupload aqui mismo, y queda mucho mejor
         // , function (e) {
         //   console.log('error en el servicio');
         // }
);
    };
    fileTransferServiceFactory.fileUpload = _fileUpload;
    return fileTransferServiceFactory;
  }
]);
app.factory('firstInitService', [
  '$cordovaFile',
  '$q',
  'checkFileService',
  'momentService',
  'onlineStatusService',
  '$localStorage',
  'zumeroService',
  '$ionicLoading',
  function ($cordovaFile, $q, checkFileService, momentService, onlineStatusService, $localStorage, zumeroService, $ionicLoading) {
    var firstInitServiceFactory = {};
    var _show = function () {
      $ionicLoading.show({ template: '<span>Inicializando</span><ion-spinner icon="android"></ion-spinner>' });
    };
    var _hide = function () {
      $ionicLoading.hide();
    };
    var _init = function () {
      var q = $q.defer();
      console.log('creando obj localstorage');
      if (onlineStatusService.data.isOnline) {
        _show();
        zumeroService.zync(1).then(function () {
          console.log('first init ok');
          $localStorage.data = {
            lastDirCreated: '',
            firstZync: momentService.getDateTime()
          };
          _hide();
          q.resolve();
        }, function (e) {
          console.log('first init error', e);
          _hide();
          q.reject(e);
        });
      } else {
        q.reject();
      }
      return q.promise;
    };
    firstInitServiceFactory.init = _init;
    return firstInitServiceFactory;
  }
]);
app.factory('focus', function ($timeout) {
  var focusFactory = {};
  var _focus = function (id) {
    // timeout makes sure that is invoked after any other event has been triggered.
    // e.g. click events that need to run before the focus or
    // inputs elements that are in a disabled state but are enabled when those events
    // are triggered.
    $timeout(function () {
      var element = document.getElementById(id);
      if (element) {
        element.focus();
      }
    });
  };
  focusFactory.focus = _focus;
  return focusFactory;
});
app.factory('getVideoService', [
  '$cordovaCamera',
  '$q',
  'checkFileService',
  function ($cordovaCamera, $q, checkFileService) {
    var getVideoServiceFactory = {};
    //getVideoServiceFactory.fileEntry=null;// perderia la ultima informacion si lo vuelvo a referenciar;
    // TODO:  esto se debe de llamar dentro de la misma funcion, por que si lo inicializamos por fuera, el pugin no ha cargado y obtengo camera is not defined
    // var _getFileEntry = function (videoContentPath) {
    //   console.log(videoContentPath);
    //   var deferred = $q.defer();
    //   window.resolveLocalFileSystemURL(videoContentPath, function (FileEntry) {
    //     getVideoServiceFactory.fileEntry = FileEntry;
    //     deferred.resolve();
    //   }, function (e) {
    //     deferred.reject(e);
    //   });
    //   return deferred.promise;
    // };
    // TODO: create getVideoServiceFactory.fileEntry y .file, para devolver la promesa sin data y referenciar el controlador con la propiedad dedl servicio todd mot
    var _getVideoCompress = function () {
      var options = {
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: Camera.MediaType.VIDEO
      };
      return $cordovaCamera.getPicture(options).then(function (videoContentPath) {
        // return _getFileEntry(videoContentPath);
        return checkFileService.checkFile(videoContentPath);
      });
    };
    getVideoServiceFactory.getVideoCompress = _getVideoCompress;
    return getVideoServiceFactory;
  }
]);
app.factory('gpsService', function ($timeout, errorService, $localStorage, momentService, $q, intermediateService, sqliteService) {
  var gpsServiceFactory = {};
  var _gpsHtmlPromise = function () {
    var deferred = $q.defer();
    var opt = {
      maximumAge: 90000,
      timeout: 150000,
      enableHighAccuracy: true
    };
    //var opt= { maximumAge: 90000, timeout: 3000, enableHighAccuracy: true };//tambien se probo con 22, pero se baja hasta 13
    // console.log(navigator, navigator.geolocation.getCurrentPosition);
    navigator.geolocation.getCurrentPosition(function (result) {
      //betadoparapruebasconsole.log("gpsHtmlPromise ", result)
      deferred.resolve(result);
    }, function (err) {
      // An error occured. Show a message to the user
      deferred.reject(err);  //$scope.dialog(err);
    }, opt);
    return deferred.promise;
  };
  var _gpsHtml = function (idinspeccion) {
    // TODO: aun sin wi fi ni datos el gps sigue funcionando
    // TODO: por que me dispara el vento de on online, mas que todo con el wifi????
    if (!$localStorage.latestGps || momentService.diffNow($localStorage.latestGps) > 7) {
      var opt = {
        maximumAge: 3000,
        timeout: 150000,
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        _insertGpsLog(idinspeccion, position.coords);
      }, errorService.consoleError, opt);
    }
  };
  var _insertGpsLog = function (idinspeccion, coords) {
    var query = 'INSERT INTO [gpsLogs] ([idinspeccion]   ,[fecha] ,[accuracy]  ,[altitude], ';
    query += '[altitudeAccuracy]  ,[heading]  ,[latitude] ,[longitude],[speed]) VALUES (?,?,?,?,?,?,?,?,?)';
    var binding = [
      idinspeccion,
      momentService.getDateTime(),
      coords.accuracy,
      coords.altitude,
      coords.altitudeAccuracy,
      coords.heading,
      coords.latitude,
      coords.longitude,
      coords.speed
    ];
    sqliteService.executeQuery(query, binding).then(function (res) {
      $localStorage.latestGps = momentService.getDateTime();
    }, errorService.consoleError);
  };
  gpsServiceFactory.gpsHtmlPromise = _gpsHtmlPromise;
  gpsServiceFactory.gpsHtml = _gpsHtml;
  return gpsServiceFactory;
});
app.factory('intermediateService', function ($timeout) {
  var intermediateServiceFactory = {};
  intermediateServiceFactory.data = {
    isTakingPic: false,
    isTakingVid: false,
    navBarSearch: false,
    placa: null,
    idinspeccionSync: false,
    idinspeccion: null
  };
  return intermediateServiceFactory;
});
app.factory('momentService', function ($timeout, intermediateService) {
  var momentServiceFactory = {};
  var _getDateTime = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  };
  var _addDays = function (x) {
    return moment().add(x, 'days').format('YYYY-MM-DD HH:mm:ss');
  };
  var _addHours = function (x) {
    return moment().add(x, 'hours').format('YYYY-MM-DD HH:mm:ss');
  };
  var _addSeconds = function (x) {
    return moment().add(x, 's').format('YYYY-MM-DD HH:mm:ss');
  };
  var _rutaSrv = function (path) {
    var filename = path.replace(/^.*[\\\/]/, '');
    var ruta = moment().format('YYYY/MMMM/DD/') + intermediateService.data.placa + '/' + filename;
    return ruta;
  };
  var _diffNow = function (b, tipo) {
    var rta = moment().diff(moment(b), tipo);
    console.log(rta, 'diff');
    return rta;
  };
  momentServiceFactory.getDateTime = _getDateTime;
  momentServiceFactory.addDays = _addDays;
  momentServiceFactory.addHours = _addHours;
  momentServiceFactory.addSeconds = _addSeconds;
  momentServiceFactory.rutaSrv = _rutaSrv;
  momentServiceFactory.diffNow = _diffNow;
  return momentServiceFactory;
});
app.factory('offlineService', function ($timeout) {
  var offlineServiceFactory = {};
  offlineServiceFactory.data = {};
  // var _focus = function (id) {
  //   // timeout makes sure that is invoked after any other event has been triggered.
  //   // e.g. click events that need to run before the focus or
  //   // inputs elements that are in a disabled state but are enabled when those events
  //   // are triggered.
  //   $timeout(function () {
  //     var element = document.getElementById(id);
  //     if (element) {
  //       element.focus();
  //     }
  //   });
  // };
  offlineServiceFactory.data.offlineMode = false;
  return offlineServiceFactory;
});
'use strict';
app.factory('onlineStatusService', [
  '$rootScope',
  '$q',
  '$injector',
  '$location',
  '$cordovaNetwork',
  '$ionicPopup',
  'zumeroService',
  'offlineService',
  'toastService',
  function ($rootScope, $q, $injector, $location, $cordovaNetwork, $ionicPopup, zumeroService, offlineService, toastService) {
    var onlineStatusServiceFactory = {};
    onlineStatusServiceFactory.data = {
      isOnline: false,
      connType: 'none'
    };
    var _isOnline = function () {
      onlineStatusServiceFactory.isOnline = $cordovaNetwork.isOnline();
      onlineStatusServiceFactory.data.isOnline = $cordovaNetwork.isOnline();
    };
    var _type = function () {
      onlineStatusServiceFactory.connType = $cordovaNetwork.getNetwork();
    };
    var _onOnline = function () {
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        console.log(event, networkState);
        onlineStatusServiceFactory.data.isOnline = true;
        onlineStatusServiceFactory.isOnline = true;
        onlineStatusServiceFactory.connType = networkState;
        // TODO: evaluar todas las posibilidades de esto aca, por que si la señal es muy mala que puede pasar, aunque el zync de bases de datos nunca hasido muy grande en informacion
        zumeroService.zync(1);  // cordovaEventsService.callZync();
                                /*if(!signalService.isInit){
                    signalService.startHub();

                }*/
                                // $rootScope.$broadcast('$cordovaNetwork:signal',{'networkState':networkState});
      });
    };
    var _onOffline = function () {
      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        console.log(event, networkState);
        onlineStatusServiceFactory.data.isOnline = false;
        toastService.showShortBottom('activado modo offline');
        offlineService.data.offlineMode = true;
        onlineStatusServiceFactory.isOnline = false;
        onlineStatusServiceFactory.connType = networkState;  /* if(networkState == 'none') {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
                */
      });
    };
    onlineStatusServiceFactory.onOnline = _onOnline;
    onlineStatusServiceFactory.onOffline = _onOffline;
    onlineStatusServiceFactory.isOnline = _isOnline;
    onlineStatusServiceFactory.connType = _type;
    return onlineStatusServiceFactory;
  }
]);
app.factory('placasService', [
  'sqliteService',
  '$rootScope',
  'momentService',
  'authService',
  'deviceService',
  'zumeroService',
  'intermediateService',
  'updateSyncService',
  function (sqliteService, $rootScope, momentService, authService, deviceService, zumeroService, intermediateService, updateSyncService) {
    var placasServiceFactory = {};
    placasServiceFactory.all = [];
    var _selectAll = function () {
      var test = [{
          idinspeccion: 1,
          placa: 'abc111'
        }];
      placasServiceFactory.all.push(test);  // var query = 'select * from idinspeccion';
                                            // var binding = [];
                                            // sqliteService.executeQuery(query, binding).then(function (res) {
                                            //   console.log(sqliteService.rtnArray(res));
                                            //   placasServiceFactory.all = sqliteService.rtnArray(res);
                                            //   // $rootScope.$apply();
                                            //   console.log(placasServiceFactory.all);
                                            // }, function (error) {
                                            //   console.log(error);
                                            // });
    };
    var _getPlacas = function () {
      // var query = 'select * from idinspeccion';
      var query = 'select i.idinspeccion, placa, i.sync, ';
      query += '        case when iss.idinspeccion is null then 0 else 1 end as calificado ';
      query += '          from idinspeccion i ';
      query += '        left join (select idinspeccion from  idsubprocesoseguimiento ';
      query += '                  where idestado=477) ';
      query += '       iss on iss.idinspeccion=i.idinspeccion';
      query += '      WHERE UserName=? and fecha> ?';
      query += ' Order by i.idinspeccion DESC Limit 10';
      var binding = [
        authService.authentication.userName,
        momentService.addDays(-3)
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        // console.log(sqliteService.rtnArray(res));
        placasServiceFactory.all = sqliteService.rtnArray(res);
        // $rootScope.$apply();
        console.log(placasServiceFactory.all);
        _insertDevice();
      }, function (error) {
        console.log(error);
      });
    };
    // var _updateSync = function (placa, sync) {
    //   var query = 'UPDATE idinspeccion set sync=?  WHERE placa=? and userName=? and fecha>?';
    //   sync = sync ? 1 : 0;
    //   var binding = [
    //     sync,
    //     placa,
    //     authService.authentication.userName,
    //     momentService.addDays(-3)
    //   ];
    //   return sqliteService.executeQuery(query, binding);  // .then(function (res) {
    //                                                       //   return ;
    //                                                       // });
    // };
    var _insertPLaca = function (placa) {
      var query = 'INSERT INTO idinspeccion(placa, fecha,UserName,uuid, sync) VALUES (?,?,?,?, ?)';
      var sync = 0;
      // 0 means false
      var binding = [
        placa,
        momentService.getDateTime(),
        authService.authentication.userName,
        deviceService.data.uuid,
        sync
      ];
      intermediateService.data.placa = placa;
      intermediateService.data.idinspeccionSync = false;
      return sqliteService.executeQuery(query, binding).then(function (res) {
        // return _getPlacas();  // return placasServiceFactory.all.push({
        //   placa: placa,
        //   idinspeccion: res.insertId
        // });
        intermediateService.data.idinspeccion = res.insertId;
        /* return zumeroService.zync(1).then(function () {
          return updateSyncService.selectIdinspeccionSync(placa).then(function () {
            return _getPlacas();
          });
        }, function () {
          console.log('error on zumero sync desde ps');
          return _getPlacas();
        });*/
        return _getPlacas();
      }, function (err) {
        console.error(err);
      });
    };
    var _insertDevice = function () {
      var query = 'INSERT OR IGNORE INTO [devices]([uuid],[model])  VALUES(?,?)';
      var binding = [
        deviceService.data.uuid,
        deviceService.data.model
      ];
      sqliteService.executeQuery(query, binding).then(function (res) {
        console.log('insert device', res);
      }, function (err) {
        console.error(err);
      });
    };
    placasServiceFactory.selectAll = _selectAll;
    placasServiceFactory.getPlacas = _getPlacas;
    placasServiceFactory.insertPLaca = _insertPLaca;
    // placasServiceFactory.insertDevice = _insertDevice;
    return placasServiceFactory;
  }
]);
app.factory('sqliteService', [
  '$cordovaSQLite',
  function ($cordovaSQLite) {
    var sqliteServiceFactory = {};
    var _executeQuery = function (query, binding) {
      return $cordovaSQLite.execute(db, query, binding).then(function (res) {
        return res;
      });
    };
    var _insertCollection = function (query, bindings) {
      return $cordovaSQLite.insertCollection(db, query, bindings).then(function (res) {
        return res;
      });
    };
    var _rtnArray = function (res) {
      var array = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          array.push(res.rows.item(i));
        }
        return array;
      } else {
        return array;
      }
    };
    // TODO: si yo cambio el tipo de dato de una columna, ejemplo string to int, debo reestablecer la base de datos zumero, para agregar una columna no tengo problema
    sqliteServiceFactory.executeQuery = _executeQuery;
    sqliteServiceFactory.insertCollection = _insertCollection;
    sqliteServiceFactory.rtnArray = _rtnArray;
    return sqliteServiceFactory;
  }
]);
app.factory('titleService', function ($timeout) {
  var titleServiceFactory = {};
  titleServiceFactory.title = '';
  return titleServiceFactory;
});
app.factory('toastService', function ($cordovaToast) {
  var toastServiceFactory = {};
  var _showLongBottom = function (msg) {
    return $cordovaToast.showLongBottom(msg);
  };
  var _showShortBottom = function (msg) {
    return $cordovaToast.showShortBottom(msg);
  };
  toastServiceFactory.showLongBottom = _showLongBottom;
  toastServiceFactory.showShortBottom = _showShortBottom;
  return toastServiceFactory;
});
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
app.factory('updateSyncService', function ($timeout, authService, momentService, sqliteService, intermediateService) {
  var updateSyncServiceFactory = {};
  var _updateSync = function (placa, sync) {
    var query = 'UPDATE idinspeccion set sync=?  WHERE placa=? and userName=? and fecha>?';
    sync = sync ? 1 : 0;
    var binding = [
      sync,
      placa,
      authService.authentication.userName,
      momentService.addDays(-3)
    ];
    return sqliteService.executeQuery(query, binding);  // .then(function (res) {
                                                        //   return ;
                                                        // });
  };
  var _selectIdinspeccionSync = function (placa) {
    var query = 'select idinspeccion from idinspeccion  WHERE placa=? and userName=? and fecha>? Order by idinspeccion DESC Limit 1';
    var binding = [
      placa,
      authService.authentication.userName,
      momentService.addDays(-3)
    ];
    return sqliteService.executeQuery(query, binding).then(function (res) {
      intermediateService.data.idinspeccion = sqliteService.rtnArray(res)[0].idinspeccion;
      intermediateService.data.idinspeccionSync = true;
      return _updateSync(placa, true);
    }, function (e) {
      console.log(e, 'error');
    });  // .then(function (res) {
         //   return ;
         // });
  };
  updateSyncServiceFactory.updateSync = _updateSync;
  updateSyncServiceFactory.selectIdinspeccionSync = _selectIdinspeccionSync;
  // updateSyncServiceFactory.syncImages = _syncImages;
  return updateSyncServiceFactory;
});
app.factory('videoService', [
  '$cordovaCapture',
  'sqliteService',
  'intermediateService',
  'momentService',
  function ($cordovaCapture, sqliteService, intermediateService, momentService) {
    var videoServiceFactory = {};
    videoServiceFactory.videos = [];
    var _all = function () {
      return videoServiceFactory.videos;
    };
    var _takedVid = function () {
      var options = {
        limit: 1,
        duration: 12
      };
      return $cordovaCapture.captureVideo(options).then(function (videoData) {
        return videoData;
      });
    };
    var _getVideos = function (idinspeccion) {
      var query = 'select * from idVideos where idinspeccion=?';
      var binding = [idinspeccion];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        videoServiceFactory.videos = sqliteService.rtnArray(res);
        console.log(videoServiceFactory.videos);
      }, function (error) {
        console.log(error);
      });
    };
    var _insertVideo = function (idinspeccion, path, sync, thumbnail, onUpload) {
      var query = 'INSERT INTO idVideos(idinspeccion, path,sync,uuid,thumbnail, onUpload, placa, fecha, rutaSrv ) VALUES (?,?,?,?,?,?,?,?, ?)';
      // TODO: el campo deleted es boolean , pero debe asignarsele 1 o 0
      sync = sync ? 1 : 0;
      onUpload = onUpload ? 1 : 0;
      console.log();
      var binding = [
        idinspeccion,
        path,
        sync,
        'testuuid',
        thumbnail,
        onUpload,
        intermediateService.data.placa,
        momentService.getDateTime(),
        momentService.rutaSrv(path)
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
      }, function (err) {
        console.error(err);
      });
    };
    var _updateVideo = function (idinspeccion, path, sync, onUpload) {
      //TODO: es el path la mejor forma y mas efectiva de hacer el where de la consulta
      var query = 'UPDATE idVideos set sync=? , onUpload= ? WHERE path=?';
      // TODO: el campo deleted es boolean , pero debe asignarsele 1 o 0
      // TODO:  mucho cuidado por ejemplo el path debe ser nvarchar() NO  NCHAR
      sync = sync ? 1 : 0;
      onUpload = onUpload ? 1 : 0;
      var binding = [
        sync,
        onUpload,
        path
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        if (!res.rowsAffected) {
          console.log('Nothing was updated');
        } else {
          console.log(res.rowsAffected);
          console.log('update successful');
        }
      }, function (err) {
        console.error(err);
      });
    };
    videoServiceFactory.all = _all;
    videoServiceFactory.takedVid = _takedVid;
    videoServiceFactory.getVideos = _getVideos;
    videoServiceFactory.insertVideo = _insertVideo;
    videoServiceFactory.updateVideo = _updateVideo;
    return videoServiceFactory;
  }
]);
app.factory('videoThumbnailService', [
  '$q',
  function ($q) {
    var videoThumbnailServiceFactory = {};
    var _generateThumbnail = function (nativeURL) {
      var deferred = $q.defer();
      var name = nativeURL.slice(0, -4);
      window.PKVideoThumbnail.createThumbnail(nativeURL, name + '.png', function (prevSucc) {
        console.log(prevSucc);
        deferred.resolve(prevSucc);
      }, function (e) {
        console.log('error genernado thumbnail', e);
        deferred.reject(e);
      });
      return deferred.promise;
    };
    videoThumbnailServiceFactory.generateThumbnail = _generateThumbnail;
    return videoThumbnailServiceFactory;
  }
]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiRm90b3MvRm90b0NvbnRyb2xsZXIuanMiLCJGb3Rvcy9mb3Rvc1NlcnZpY2UuanMiLCJGb3Rvcy9ydG5GaW5kLmpzIiwiY29kRmFzL0NvZEZhcy5qcyIsImNvZEZhcy9jb2RmYXNTcnYuanMiLCJjb250cm9sbGVycy9BY2Nlc29yaW9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvUGxhY2FzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL1Rlc3RDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVmlkZW9Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbG9naW5Db250cm9sbGVyLmpzIiwiaW5zcGVjY2lvbi9JbnNwZWNjaW9uQ29udHJvbGxlci5qcyIsImluc3BlY2Npb24vaW5zcGVjY2lvblNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZWFzeURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9lcnJvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9maWxlVHJhbnNmZXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlyc3RJbml0U2VydmljZS5qcyIsInNlcnZpY2VzL2ZvY3VzU2VydmljZS5qcyIsInNlcnZpY2VzL2dldFZpZGVvU2VydmljZS5qcyIsInNlcnZpY2VzL2dwc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9pbnRlcm1lZGlhdGVTZXJ2aWNlLmpzIiwic2VydmljZXMvbW9tZW50U2VydmljZS5qcyIsInNlcnZpY2VzL29mZmxpbmVTZXJ2aWNlLmpzIiwic2VydmljZXMvb25saW5lU3RhdHVzU2VydmljZS5qcyIsInNlcnZpY2VzL3BsYWNhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9zcWxpdGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdGl0bGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvdW5zeW5jU2VydmljZS5qcyIsInNlcnZpY2VzL3VwZGF0ZVN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9TZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmpzIiwic2VydmljZXMvenVtZXJvU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuLy8gdmFyIGxzID0gbnVsbDtcbi8vIHZhciB6dW1lcm8gPSBudWxsO1xuLy8gdmFyIGNzID0gbnVsbDtcbi8vIHZhciB6cyA9IG51bGw7XG4vLyB2YXIgcHMgPSBudWxsO1xuLy8gdmFyIHBjID0gbnVsbDtcbi8vIHZhciBjZiA9IG51bGw7XG4vLyB2YXIgZWQgPSBudWxsO1xuLy8gdmFyIGNjID0gbnVsbDtcbi8vIHBydWViYXMgbG9jYWxlc1xudmFyIGRiID0gbnVsbDtcbi8vIHZhciBzZXJ2aWNlcyA9IHt9O1xuLy8gdmFyIG5nQ29yZG92YSA9IHt9O1xuLy8gdmFyIGFscmVhZHlJbnNwZWN0ID0gZmFsc2U7XG4vLyB2YXIgcnAgPSBudWxsO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJywgW1xuICAnaW9uaWMnLFxuICAnc3RhcnRlci5jb250cm9sbGVycycsXG4gICduZ1N0b3JhZ2UnLFxuICAnbmdDb3Jkb3ZhJyxcbiAgJ3VpLnV0aWxzJyxcbiAgJ25nRngnLFxuICAnbmdBbmltYXRlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJ1xuXSkuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCBjZnBMb2FkaW5nQmFyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG4gICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvclNlcnZpY2UnKTtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FwcCcsIHtcbiAgICB1cmw6ICcvYXBwJyxcbiAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tZW51Lmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdBcHBDdHJsJ1xuICB9KS5zdGF0ZSgnYXBwLnNlYXJjaCcsIHtcbiAgICB1cmw6ICcvc2VhcmNoJyxcbiAgICB2aWV3czogeyAnbWVudUNvbnRlbnQnOiB7IHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3NlYXJjaC5odG1sJyB9IH1cbiAgfSkuc3RhdGUoJ2FwcC5icm93c2UnLCB7XG4gICAgdXJsOiAnL2Jyb3dzZScsXG4gICAgdmlld3M6IHsgJ21lbnVDb250ZW50JzogeyB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9icm93c2UuaHRtbCcgfSB9XG4gIH0pLnN0YXRlKCdhcHAucGxheWxpc3RzJywge1xuICAgIHVybDogJy9wbGF5bGlzdHMnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0cy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYXlsaXN0c0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnBsYWNhcycsIHtcbiAgICB1cmw6ICcvcGxhY2FzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGFjYXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGFjYXNDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5zaW5nbGUnLCB7XG4gICAgdXJsOiAnL3BsYXlsaXN0cy86cGxheWxpc3RJZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxheWxpc3QuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdEN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmZvdG8nLCB7XG4gICAgdXJsOiAnL2ZvdG9zLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9Gb3Rvcy9mb3RvLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRm90b0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnZpZGVvJywge1xuICAgIHVybDogJy92aWRlby86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3ZpZGVvLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVmlkZW9DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5pbnNwZWNjaW9uJywge1xuICAgIHVybDogJy9pbnNwZWNjaW9uLzppZC86cGxhY2EvOmNhbGlmaWNhZG8nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaW5zcGVjY2lvbi9pbnNwZWNjaW9uLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSW5zcGVjY2lvbkN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmNvZEZhcycsIHtcbiAgICB1cmw6ICcvY29kZmFzLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RGYXMvY29kZmFzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ29kRmFzIGFzIHZtJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luSW9uaWMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmFjY2Vzb3Jpb3MnLCB7XG4gICAgdXJsOiAnL2FjY2Vzb3Jpb3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY2Nlc29yaW9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWNjZXNvcmlvc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9sb2dpbicpO1xuICAvLyBUT0RPOiBwYXJhIHF1ZSBzZSBjb25zaWRlcmVuIHNhbmFzIGxhcyBuZy1zcmMgcXVlIHRlbmdhbiBlc3RhIHNpbnRheGlzO1xuICAkY29tcGlsZVByb3ZpZGVyLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZpbGV8YmxvYnxjZHZmaWxlfGNvbnRlbnQpOnxkYXRhOmltYWdlXFwvLyk7XG4gICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZCh0cnVlKTtcbn0pO1xudmFyIHNlcnZpY2VCYXNlID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLyc7XG5hcHAuY29uc3RhbnQoJ25nQXV0aFNldHRpbmdzJywge1xuICBhcGlTZXJ2aWNlQmFzZVVyaTogc2VydmljZUJhc2UsXG4gIGNsaWVudElkOiAnbmdBdXRoQXBwJ1xufSkuY29uZmlnKGZ1bmN0aW9uICgkcHJvdmlkZSkge1xuICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRleGNlcHRpb25IYW5kbGVyJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSwgJGluamVjdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleGNlcHRpb24sIGNhdXNlKSB7XG4gICAgICAkZGVsZWdhdGUoZXhjZXB0aW9uLCBjYXVzZSk7XG4gICAgICBpZiAoZGIpIHtcbiAgICAgICAgdmFyIHNxbGl0ZVNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdzcWxpdGVTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBtb21lbnRTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnbW9tZW50U2VydmljZScpO1xuICAgICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUICBJTlRPIFtsb2dzXShbZXhdLFtlbWFpbF0sW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyknO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgICBhbmd1bGFyLnRvSnNvbihleGNlcHRpb24pLFxuICAgICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lIHx8ICcnLFxuICAgICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgICBdO1xuICAgICAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH0pICAvLyB2YXIgYWxlcnRpbmcgPSAkaW5qZWN0b3IuZ2V0KFwiYWxlcnRpbmdcIik7XG4gICAgICAgICAgICAvLyBhbGVydGluZy5hZGREYW5nZXIoZXhjZXB0aW9uLm1lc3NhZ2UpO1xuO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkdGltZW91dCwgJGlvbmljUGxhdGZvcm0sICRsb2NhbFN0b3JhZ2UsICRjb3Jkb3ZhU1FMaXRlLCBjaGVja0ZpbGVTZXJ2aWNlLCB2aWRlb1RodW1ibmFpbFNlcnZpY2UsICRjb3Jkb3ZhQ2FtZXJhLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCAkY29yZG92YUZpbGUsIGVhc3lEaXJTZXJ2aWNlLCBnZXRWaWRlb1NlcnZpY2UsIGNvcHlGaWxlU2VydmljZSwgYWNjZXNvcmlvc1NlcnZpY2UsIGluc3BlY2Npb25TZXJ2aWNlLCBwbGFjYXNTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBjb3Jkb3ZhRXZlbnRzU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgbW9tZW50U2VydmljZSwgZmlyc3RJbml0U2VydmljZSwgYXV0aFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIGxvY2FsU3RvcmFnZVNlcnZpY2UsICRzdGF0ZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdW5zeW5jU2VydmljZSwgZm90b3NTZXJ2aWNlLCBncHNTZXJ2aWNlKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcbiAgICAvLyAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXh0LCBjdXJyZW50KTtcbiAgICAvLyB9KTtcbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PT0gJ2FwcC5sb2dpbicpIHtcbiAgICAgICAgLy8gZG9lIHNoZS9oZSB0cnkgdG8gZ28gdG8gbG9naW4/IC0gbGV0IGhpbS9oZXIgZ29cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coYXV0aERhdGEsIG1vbWVudFNlcnZpY2UuZGlmZk5vdyhhdXRoRGF0YS5leHAsICdtJyksICc+IC02MCcpO1xuICAgICAgaWYgKCFhdXRoRGF0YSB8fCBtb21lbnRTZXJ2aWNlLmRpZmZOb3coYXV0aERhdGEuZXhwLCAnbScpID4gLTYwKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVkaXJlY3QnKTtcbiAgICAgICAgICAvL1dhcyBjYWxsaW5nIHRoaXMgYnV0IGNvbW1lbnRpbmcgb3V0IHRvIGtlZXAgaXQgc2ltcGxlOiBhdXRoU2VydmljZS5yZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAvL0NoYW5nZXMgVVJMIGJ1dCBub3QgdGhlIHZpZXcgLSBnb2VzIHRvIG9yaWdpbmFsIHZpZXcgdGhhdCBJJ20gdHJ5aW5nIHRvIHJlZGlyZWN0XG4gICAgICAgICAgLy9hd2F5IGZyb20gbm93IHdpdGggMS4zLiBGaW5lIHdpdGggaXQgYnV0IGludGVyZXN0ZWQgaW4gdW5kZXJzdGFuZGluZyB0aGUgXG4gICAgICAgICAgLy9cInByb3BlclwiIHdheSB0byBkbyBpdCBub3cgc28gbG9naW4gdmlldyBnZXRzIHJlZGlyZWN0ZWQgdG8uXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTsgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9OaWNlIGFkZGl0aW9uISBDYW4ndCBkbyBhbnkgcmVkaXJlY3Qgd2hlbiBpdCdzIGNhbGxlZCB0aG91Z2hcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gbHMgPSAkbG9jYWxTdG9yYWdlO1xuICAgIC8vIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZSA9IHp1bWVyb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZ2V0VmlkZW9TZXJ2aWNlID0gZ2V0VmlkZW9TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmNvcHlGaWxlU2VydmljZSA9IGNvcHlGaWxlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5maWxlVHJhbnNmZXJTZXJ2aWNlID0gZmlsZVRyYW5zZmVyU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy52aWRlb1RodW1ibmFpbFNlcnZpY2UgPSB2aWRlb1RodW1ibmFpbFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZWFzeURpclNlcnZpY2UgPSBlYXN5RGlyU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5jaGVja0ZpbGVTZXJ2aWNlID0gY2hlY2tGaWxlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5hY2Nlc29yaW9zU2VydmljZSA9IGFjY2Vzb3Jpb3NTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmluc3BlY2Npb25TZXJ2aWNlID0gaW5zcGVjY2lvblNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMudW5zeW5jU2VydmljZSA9IHVuc3luY1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMucGxhY2FzU2VydmljZSA9IHBsYWNhc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMub25saW5lU3RhdHVzU2VydmljZSA9IG9ubGluZVN0YXR1c1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuY29yZG92YUV2ZW50c1NlcnZpY2UgPSBjb3Jkb3ZhRXZlbnRzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy50b2FzdFNlcnZpY2UgPSB0b2FzdFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMub2ZmbGluZVNlcnZpY2UgPSBvZmZsaW5lU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5sb2NhbFN0b3JhZ2UgPSAkbG9jYWxTdG9yYWdlO1xuICAgIC8vIHNlcnZpY2VzLmZpcnN0SW5pdFNlcnZpY2UgPSBmaXJzdEluaXRTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLm1vbWVudFNlcnZpY2UgPSBtb21lbnRTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZGV2aWNlU2VydmljZSA9IGRldmljZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuaW50ZXJtZWRpYXRlU2VydmljZSA9IGludGVybWVkaWF0ZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZm90b3NTZXJ2aWNlID0gZm90b3NTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmdwc1NlcnZpY2UgPSBncHNTZXJ2aWNlO1xuICAgIC8vIG5nQ29yZG92YS5jb3Jkb3ZhU1FMaXRlID0gJGNvcmRvdmFTUUxpdGU7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFGaWxlID0gJGNvcmRvdmFGaWxlO1xuICAgIC8vIG5nQ29yZG92YS5jb3Jkb3ZhQ2FtZXJhID0gJGNvcmRvdmFDYW1lcmE7XG4gICAgLy8genMgPSB6dW1lcm9TZXJ2aWNlO1xuICAgIC8vIGNzID0gO1xuICAgIC8vIGNmID0gO1xuICAgIC8vIGVkID0gZWFzeURpclNlcnZpY2U7XG4gICAgLy8gZGIgPSAkY29yZG92YVNRTGl0ZS5vcGVuREIoJ3pkYmZpbGUuZGInLCAxKTtcbiAgICAvLyBjYyA9ICRjb3Jkb3ZhQ2FtZXJhO1xuICAgIC8vIGNjID0gZ2V0VmlkZW9TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6ZGJmaWxlJyk7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZS5zZXRadW1lcm8oJ3p1bWVyb3Rlc3RkYmZpbGUnKTtcbiAgICB6dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnenVtZXJvdGVzdGRiZmlsZScpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PbmxpbmUoKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLm9uT2ZmbGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUoKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLmNvbm5UeXBlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25QYXVzZSgpO1xuICAgIGNvcmRvdmFFdmVudHNTZXJ2aWNlLm9uUmVzdW1lKCk7XG4gICAgZGV2aWNlU2VydmljZS5zZXRJbmZvKCk7XG4gICAgLy8gVE9ETzogIHZlcmlmaWNhciBzaSBleGlzdGUgZW4gZWwgbG9jYWxzdG9yYWdlIGFsZ3VuYSBiYW5kZXJhIHF1ZSBkaWdhIHNpIHlhIHNlIHN5bmMgYWxndW5hIHZleiBcbiAgICAkbG9jYWxTdG9yYWdlLm1lc3NhZ2UgPSAnSGVsbG8gV29ybGQnO1xuICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpOyAgLy8gdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhuLmRpZmYoZSwgJ3NlY29uZHMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4gdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgfSk7XG59KTsgIC8vIGFwcC5ydW4oW1xuICAgICAvLyAgICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgICAgLy8gICAnJGxvY2F0aW9uJyxcbiAgICAgLy8gICBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSwgJGxvY2F0aW9uKSB7XG4gICAgIC8vICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgLy8gICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgLy8gICAgICAgY29uc29sZS5sb2coJ3Rva2VuIHJlZGlyZWN0IGxvZ2luJyk7XG4gICAgIC8vICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgIC8vICAgICAgIC8vIFRPRE86IGVzdG8gbm8gZXMgbmVjZXNhcmlvLCBwb3IgcXVlIGFsIGludGVudGFyIHNpbmNyb25pemFyIHVuYSBpbWFnZW4geSBlbCB0b2tlbiBlc3RhIHZlbmNpZG8sIHNlIHJlZGlyZWNjaW9uYSBhIGxvZ2luIGF1dG9tYXRpY2FtZW50ZVxuICAgICAvLyAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAvLyAgICAgICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhuLmRpZmYoZSwgJ3NlY29uZHMnKSk7XG4gICAgIC8vICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA+IDApIHtcbiAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgIC8vICAgICAgIH1cbiAgICAgLy8gICAgIH1cbiAgICAgLy8gICB9XG4gICAgIC8vIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLCBbXSkuY29udHJvbGxlcignQXBwQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY01vZGFsLCAkdGltZW91dCkge1xuICAvLyBGb3JtIGRhdGEgZm9yIHRoZSBsb2dpbiBtb2RhbFxuICAkc2NvcGUubG9naW5EYXRhID0ge307XG4gIC8vIENyZWF0ZSB0aGUgbG9naW4gbW9kYWwgdGhhdCB3ZSB3aWxsIHVzZSBsYXRlclxuICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9sb2dpbi5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gIH0pO1xuICAvLyBUcmlnZ2VyZWQgaW4gdGhlIGxvZ2luIG1vZGFsIHRvIGNsb3NlIGl0XG4gICRzY29wZS5jbG9zZUxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gIH07XG4gIC8vIE9wZW4gdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICB9O1xuICAvLyBQZXJmb3JtIHRoZSBsb2dpbiBhY3Rpb24gd2hlbiB0aGUgdXNlciBzdWJtaXRzIHRoZSBsb2dpbiBmb3JtXG4gICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEb2luZyBsb2dpbicsICRzY29wZS5sb2dpbkRhdGEpO1xuICAgIC8vIFNpbXVsYXRlIGEgbG9naW4gZGVsYXkuIFJlbW92ZSB0aGlzIGFuZCByZXBsYWNlIHdpdGggeW91ciBsb2dpblxuICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cbiAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuY2xvc2VMb2dpbigpO1xuICAgIH0sIDEwMDApO1xuICB9O1xufSkuY29udHJvbGxlcignUGxheWxpc3RzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgJHNjb3BlLnBsYXlsaXN0cyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ1JlZ2dhZScsXG4gICAgICBpZDogMVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdDaGlsbCcsXG4gICAgICBpZDogMlxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdEdWJzdGVwJyxcbiAgICAgIGlkOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0luZGllJyxcbiAgICAgIGlkOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ1JhcCcsXG4gICAgICBpZDogNVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdDb3diZWxsJyxcbiAgICAgIGlkOiA2XG4gICAgfVxuICBdO1xufSkuY29udHJvbGxlcignUGxheWxpc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG59KTsiLCJhcHAuY29udHJvbGxlcignRm90b0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnZm90b3NTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnJGZpbHRlcicsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgJyRsb2cnLFxuICAnJGlvbmljTW9kYWwnLFxuICBmdW5jdGlvbiAocywgZm90b3NTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGdwc1NlcnZpY2UsICRsb2csICRpb25pY01vZGFsKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCdqcy9Gb3Rvcy9mb3RvTW9kYWwuaHRtbCcsIHtcbiAgICAgICAgc2NvcGU6IHMsXG4gICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICAgcy5tb2RhbCA9IG1vZGFsO1xuICAgICAgICAkbG9nLmRlYnVnKG1vZGFsKTtcbiAgICAgIH0pO1xuICAgICAgLy8gcy50aXR0bGUgPSAnJztcbiAgICAgIHMudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgcy5pbWdVbnN5bmMgPSBbXTtcbiAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IGZhbHNlO1xuICAgICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLm9mZiA9IG9mZmxpbmVTZXJ2aWNlLmRhdGE7XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEVcbiAgICAgIC8vIHMub25saW5lU3RhdHVzID0gb25saW5lU3RhdHVzU2VydmljZTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBSRVFVSUVSRSBPVFJPIERJR0VTVCBQQVJBIFFVRSBGVU5DSU9ORVxuICAgICAgLy8gcy5vc3MgPSB7IG9ubGluZTogb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSB9O1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIEZVTkNJT05BIEJJRU4gUEFSQSBWRVIgRUwgQ0FNQklPIElOTUVESUFUQU1FTlRFICBFUyBNRUpPUiBSQVNUUkVBUiBTSUVNUFJFIFVOIE9CSkVUT1xuICAgICAgcy5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICAvLyAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgLy8gVE9ETzogb25ob2xkIGNhbiBlZGl0IHBsYWNhLCBvbiBzd2lwZSBsZWZ0IGRlbGV0ZSB3aXRoIGNvbmZpcm1cbiAgICAgIC8vIFRPRE86IGFsd2F5cyB1c2UgaW9uLW5hdi10aXRsZSAsIHBhcmEgcG9kZXJsZSBwb25lciBsb3MgdGl0dWxvcyBxdWUgcXVpZXJvXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICBzLnBob3RvcyA9IGZvdG9zU2VydmljZS5waG90b3M7XG4gICAgICBzLm5hbWVzID0gZm90b3NTZXJ2aWNlLm5hbWVzO1xuICAgICAgcy5mb3Rvc0ZhbHQgPSBbXTtcbiAgICAgIHMuZ2V0UGhvdG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPOiBjcmVvIGsgZXMgbWVqb3IgaGFjZXIgcmVmZXJlbmNpYSBkaXJlY3RhbWVudGUgYSBpbnRlcm1lZGlhdGVzZXJ2aWNlLkRBVEEgLmlkaW5zcGVjY2lvbiBrIGEgcy5pZGluc3BlY2Npb247XG4gICAgICAgIGZvdG9zU2VydmljZS5nZXRQaG90b3MoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5waG90b3MgPSBmb3Rvc1NlcnZpY2UucGhvdG9zO1xuICAgICAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICAgICAgcy5mb3Rvc0ZhbHQgPSBmb3Rvc1NlcnZpY2UuZm90b3NGYWx0O1xuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuZ2V0UGhvdG9zKCk7XG4gICAgICBzLiRvbignbXlFdmVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215IGV2ZW50IG9jY3VycmVkJywgcy5pZGluc3BlY2Npb24sIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICBzLmdldFBob3RvcygpO1xuICAgICAgfSk7XG4gICAgICB2YXIgX2ZpbHRlclVuc3luYyA9IGZ1bmN0aW9uIChlcXVhbCkge1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKShzLnBob3RvcywgeyBzeW5jOiBlcXVhbCB9LCB0cnVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocy5waG90b3MsIGZvdW5kKTtcbiAgICAgICAgcy5pbWdVbnN5bmMgPSBmb3VuZDtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgICBpZiAocy5tYXNzaXZlVXBsb2FkKSB7XG4gICAgICAgICAgICBzLm1hc3NpdmVMZW5ndGggPSBzLm1hc3NpdmVMZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKHMubWFzc2l2ZUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBfZmlsdGVyVW5zeW5jKDApO1xuICAgICAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHMubWFzc2l2ZUxlbmd0aCwgJ3N5bmMnKTtcbiAgICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnN5bmMgPSBzeW5jO1xuICAgICAgICBvYmpWaWRlby5vblVwbG9hZCA9IG9udXBsb2FkO1xuICAgICAgICB1cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgIC8vVE9ETyA6IENVQU5ETyBFUyBVTkEgU09MQSBFU1RBIEJJRU4sIENVRU5BT0QgRVMgVU4gQVJSQVkgREVCTyBERSBIQUNFUiBRVUUgU1lOQyBDT04gTEEgVUxUSU1BIEZPVE8gVU4gLkxFTlRIRyBQVUVERSBTRVJcbiAgICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICAvLyB2YXIgcnRuVGlwb0ZvdG89ZnVuY3Rpb24oKXtcbiAgICAgIC8vICAgcmV0dXJuIFxuICAgICAgLy8gfVxuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgICBpZiAoZm90b3NTZXJ2aWNlLnRpcG9Gb3RvLmNhbnRpZGFkID4gMCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcy5mb3Rvc0ZhbHQuaW5kZXhPZihmb3Rvc1NlcnZpY2UudGlwb0ZvdG8pO1xuICAgICAgICAgICAgJGxvZy5kZWJ1ZyhpbmRleCk7XG4gICAgICAgICAgICBzLmZvdG9zRmFsdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHJlZnJlc2hQcm9ncmVzcyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgcGVyY2VudGFnZSkge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpGb3RvLnByb2dyZXNzID0gcGVyY2VudGFnZTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB5YSBub2UgcyBuZWNlc2FyaW8gcG9yIHF1ZSBvZmZsaW5lIHRhbWJpZW4gZXN0YSBlbiBvbmxpbG5lc3RhdHVzc3JlcnZpY2VcbiAgICAgICAgICAvLyB8fCAhb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSkge1xuICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHJ0bk9iamVjdEZvdG8gPSBmdW5jdGlvbiAocGxhY2EsIHBhdGgsIHN5bmMsIG9uVXBsb2FkLCBpZHRpcG8pIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKSxcbiAgICAgICAgICBpZHRpcG86IGlkdGlwb1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICAvLyBUT0RPOiBIQUJSQSBPVFJBIEZPUk1BIERFIEZJTFRBUiBNQVMgUkFQSURBIEsgRUwgU1RSSU5HIFBBVEg7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHBhdGg6IHNyY0ltZyB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmb3VuZFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGZvdW5kIGluIGFycmF5IHNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcy5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgIHMudHJ5VXBsb2FkID0gZnVuY3Rpb24gKGZvdG8pIHtcbiAgICAgICAgdmFyIG9iakZvdG8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9iakZvdG8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKG9iakZvdG8pO1xuICAgICAgfTtcbiAgICAgIC8vIHMuc2V0T2ZmbGluZU1vZGUgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgICAgLy8gICBzLm9mZi5vZmZsaW5lTW9kZSA9IGJvb2w7XG4gICAgICAvLyAgIGlmIChib29sKSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJ09mZmxpbmUgTW9kZScpO1xuICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgLy8gICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKHRpdGxlU2VydmljZS50aXRsZSk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH07XG4gICAgICBzLnN5bmNJbWdVbnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IHRydWU7XG4gICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMuaW1nVW5zeW5jLmxlbmd0aDtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHMuaW1nVW5zeW5jLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgICBzLnRyeVVwbG9hZChvYmopO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzLnNldG5hbWUgPSBmdW5jdGlvbiAoaWR0aXBvLCBmb3RvKSB7XG4gICAgICAgIC8vYmV0YWRvcGFyYXBydWViYXNjb25zb2xlLmxvZyhub21icmUsIGZvdG8pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZHRpcG8sIGZvdG8pO1xuICAgICAgICBmb3Rvc1NlcnZpY2Uuc2V0TmFtZShpZHRpcG8sIGZvdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHMuZm90b3NGYWx0ID0gZm90b3NTZXJ2aWNlLmZvdG9zRmFsdDtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSB0cnVlO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGFrZWRwaWMoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICAgIC8vIFRPRE86IHBhcmEgbGFzIHRhYmxldHMgYXBhZ28gZWwgZ3BzLCB5IGFsZ28gcGFzYSBjb24gbGEgY2FtYXJhXG4gICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGltYWdlVVJJKTtcbiAgICAgICAgICAvLyBmb3Rvc1NlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAgICAgICB2YXIgb251cGxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gVE9ETzogZXMgbWVqb3IgaMK/Z3VhcmRhciBhcXVpIGVsIHNxbGl0ZSB5IGx1ZWdvIGFjdHVhbGl6YXJsbyBzaSBzdWJlIGV4aXRvc287XG4gICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqZWN0Rm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkLCBmb3Rvc1NlcnZpY2UudGlwb0ZvdG8uaWRUaXBvRm90byk7XG4gICAgICAgICAgICBzLnBob3Rvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbWFpblNjcm9sbCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGxsYW1hciBhIHVuYSBmdW5jaW9uLCBwb3IgcXVlIGFzaSBzZSBlamVjdXRhIHBhcmEgY2FkYSB1bm8sIHkgc2UgZWplY3V0YSBiaWVuLCBlbiB2ZXogZGUgbGxhbWFyIGZpbHVwbG9hZCBkZXNkZSBhY2FcbiAgICAgICAgICAgIC8vcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTsgIC8vICRzY29wZS5waG90b3MucHVzaChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgICBzLnNldElkVGlwb0ZvdG8gPSBmdW5jdGlvbiAodGlwb0ZvdG8pIHtcbiAgICAgICAgJGxvZy5kZWJ1Zyh0aXBvRm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS50aXBvRm90byA9IHRpcG9Gb3RvO1xuICAgICAgICBzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgLy8gXG4gICAgICAgIHMuZ2V0UGljRmlsZSgpO1xuICAgICAgfTtcbiAgICAgIHMuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgcy5saXN0UGljcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk0LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ1BsYWNhJyxcbiAgICAgICAgICAnb3JkZW4nOiAnMScsXG4gICAgICAgICAgJ2NhbnRpZGFkJzogJzEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDYyNSxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdGcmVudGUgTGljZW5jaWEgVHJhbnNpdG8nLFxuICAgICAgICAgICdvcmRlbic6IDEwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTUsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRGVsYW50ZXJhIERlcmVjaGEnLFxuICAgICAgICAgICdvcmRlbic6IDQwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTYsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRGVsYW50ZXJhIEl6cXVpZXJkYScsXG4gICAgICAgICAgJ29yZGVuJzogMzAsXG4gICAgICAgICAgJ2NhbnRpZGFkJzogJzEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDQ5NyxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdUcmFzZXJhIERlcmVjaGEnLFxuICAgICAgICAgICdvcmRlbic6IDUwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9XG4gICAgICBdO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZm90b3NTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJGNvcmRvdmFGaWxlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3J0bkZpbmQnLFxuICAnJGZpbHRlcicsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJGNvcmRvdmFGaWxlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBydG5GaW5kLCAkZmlsdGVyKSB7XG4gICAgdmFyIGZvdG9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IFtdO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zRmFsdCA9IFtdO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudGlwb0ZvdG8gPSB7fTtcbiAgICAvLyBbe1xuICAgIC8vICAgICBwbGFjYTogJ0FCQzExMScsXG4gICAgLy8gICAgIHNyYzogJycsXG4gICAgLy8gICAgIHN5bmM6IGZhbHNlXG4gICAgLy8gICB9XTtcbiAgICB2YXIgX3JlbW92ZSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3Muc3BsaWNlKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLmluZGV4T2YocGxhY2EpLCAxKTtcbiAgICB9O1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZHBpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBxdWFsaXR5OiA0NSxcbiAgICAgICAgLy81MCxcbiAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkZJTEVfVVJJLFxuICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBLFxuICAgICAgICAvLyBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICB0YXJnZXRXaWR0aDogMTAwMCxcbiAgICAgICAgLy9pbXBvcnRhbnRlIGNvbiAxMDAgc2UgdmVpYSBob3JyaWJsZVxuICAgICAgICB0YXJnZXRIZWlnaHQ6IDEwMDAsXG4gICAgICAgIC8vIFRPRE86IHJldmlzYXIgcGFyYSBxdWUgc2lydmUgZXN0YSBvcGNpb25cbiAgICAgICAgLy8gcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxuICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgIHJldHVybiBpbWFnZVVSSTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRQaG90b3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGZvdG9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2lkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIF9nZXROYW1lcygpOyAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXROYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgaWRUaXBvRm90bywgTm9tYnJlRm90bywgZW5hYmxlZCAgIGZyb20gdGlwb3NGb3RvIFdIRVJFIGVuYWJsZWQ9MSBvcmRlciBieSBub21icmVmb3RvJztcbiAgICAgIHZhciBxdWVyeSA9ICcgc2VsZWN0IGZjLmlkVGlwb0ZvdG8sIE5vbWJyZUZvdG8sZmMub3JkZW4sIGZjLmNhbnRpZGFkICc7XG4gICAgICBxdWVyeSArPSAnIGZyb20gdGlwb3NGb3RvIHRmICc7XG4gICAgICBxdWVyeSArPSAnIGlubmVyIGpvaW4gZm90b3NjaWEgZmMgb24gdGYuaWRUaXBvRm90bz1mYy5pZFRpcG9Gb3RvICc7XG4gICAgICBxdWVyeSArPSAnIGFuZCB0Zi5lbmFibGVkPTEgYW5kIGZjLmVuYWJsZWQ9MSAnO1xuICAgICAgcXVlcnkgKz0gJ29yZGVyIGJ5IGZjLm9yZGVuICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgICAvLyBhbmd1bGFyLmNvcHkoZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcywgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQpO1xuICAgICAgICAvLyBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm9yZGVyQnkoZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQsICdvcmRlbicsIGZhbHNlKTtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb3JkZXJCeSA9IGZ1bmN0aW9uIChhcnJheSwgZXhwcmVzc2lvbiwgcmV2ZXJzZSkge1xuICAgICAgYXJyYXkgPSAkZmlsdGVyKCdvcmRlckJ5JykoYXJyYXksIGV4cHJlc3Npb24sIHJldmVyc2UpO1xuICAgIH07XG4gICAgdmFyIF9mb3Rvc1BlbmRpZW50ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmNvcHkoZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcywgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQpO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIGZpbHRlck9iaiA9IHsgaWRUaXBvRm90bzogb2JqLmlkdGlwbyB9O1xuICAgICAgICBydG5GaW5kLnJtT2JqRnJvbUFycmF5KGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0LCBmaWx0ZXJPYmopO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NvcHlGaWxlID0gZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBpbWFnZVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgbmV3RmlsZU5hbWUgPSAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUoY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnksIEZpbGVOYW1lLCBjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgbmV3RmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkZm90b3MoaWRpbnNwZWNjaW9uLCBwYXRoLHN5bmMsdXVpZCxkZWxldGVkLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2LCBpZHRpcG8pIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LCA/LD8pJztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbWFnZVVSSSxcbiAgICAgICAgc3luYyxcbiAgICAgICAgJ3Rlc3R1dWlkJyxcbiAgICAgICAgMCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYoaW1hZ2VVUkkpLFxuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnRpcG9Gb3RvLmlkVGlwb0ZvdG9cbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIHBhdGgsIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAvL1RPRE86IGVzIGVsIHBhdGggbGEgbWVqb3IgZm9ybWEgeSBtYXMgZWZlY3RpdmEgZGUgaGFjZXIgZWwgd2hlcmUgZGUgbGEgY29uc3VsdGFcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgaWRpbnNwZWNjaW9uID0/IEFORCBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICAvLyBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfc2V0TmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgaWR0aXBvPT8gIFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZHRpcG8sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGZvdG8ucGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkucmVtb3ZlID0gX3JlbW92ZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IF9hbGw7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS50YWtlZHBpYyA9IF90YWtlZHBpYztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmNvcHlGaWxlID0gX2NvcHlGaWxlO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuaW5zZXJ0Rm90byA9IF9pbnNlcnRGb3RvO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZ2V0UGhvdG9zID0gX2dldFBob3RvcztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZUZvdG8gPSBfdXBkYXRlRm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnNldE5hbWUgPSBfc2V0TmFtZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zUGVuZGllbnRlcyA9IF9mb3Rvc1BlbmRpZW50ZXM7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5vcmRlckJ5ID0gX29yZGVyQnk7XG4gICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgncnRuRmluZCcsIFtcbiAgICAnJGZpbHRlcicsXG4gICAgJyRsb2cnLFxuICAgIHJ0bkZpbmRcbiAgXSk7XG4gIGZ1bmN0aW9uIHJ0bkZpbmQoJGZpbHRlciwgJGxvZykge1xuICAgIHZhciBydG5GaW5kRmFjdG9yeSA9IHsgcm1PYmpGcm9tQXJyYXk6IHJtT2JqRnJvbUFycmF5IH07XG4gICAgcmV0dXJuIHJ0bkZpbmRGYWN0b3J5O1xuICAgIC8vIGJvZHkuLi5cbiAgICBmdW5jdGlvbiBybU9iakZyb21BcnJheShhcnJheSwgZmlsdGVyT2JqKSB7XG4gICAgICB2YXIgc3ViQXJyYXkgPSAkZmlsdGVyKCdmaWx0ZXInKShhcnJheSwgZmlsdGVyT2JqLCB0cnVlKTtcbiAgICAgICRsb2cuZGVidWcoc3ViQXJyYXkpO1xuICAgICAgaWYgKHN1YkFycmF5Lmxlbmd0aCkge1xuICAgICAgICB2YXIgb2JqID0gc3ViQXJyYXlbMF07XG4gICAgICAgIGlmIChvYmouY2FudGlkYWQgPiAwKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihvYmopO1xuICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5jb250cm9sbGVyKCdDb2RGYXMnLCBbXG4gICAgJyRsb2cnLFxuICAgICdjZnNlcicsXG4gICAgJ2Vycm9yU2VydmljZScsXG4gICAgY29kRmFzXG4gIF0pO1xuICBmdW5jdGlvbiBjb2RGYXMoJGxvZywgY2ZzZXIsIGVycm9yU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ubWFyY2FzID0gW107XG4gICAgdm0uZGF0YSA9IGNmc2VyLm9iakNvZEZhcztcbiAgICAvLyB2bS5maWx0ZXIgPSB7IG1hcmNhOiAnJyB9O1xuICAgIHZtLnNldENvZEZhcyA9IHNldENvZEZhcztcbiAgICB2bS51cGRDb2RGYXMgPSB1cGRDb2RGYXM7XG4gICAgYWN0aXZhdGUoKTtcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgIGNmc2VyLmdldENvZEZhcygpLnRoZW4oc2VsZWN0T2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb2RGYXMoKSB7XG4gICAgICAkbG9nLmRlYnVnKCdvcGVuIHNldGNvZGZhcycsIHZtLmRhdGEpO1xuICAgICAgY2ZzZXIuaW5zZXJ0Q29kRmFzKCkudGhlbihpbnNlcnRPaykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZENvZEZhcygpIHtcbiAgICAgIGNmc2VyLnVwZENvZEZhcygpLnRoZW4odXBkT2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgICAvLy8vLy8vXG4gICAgZnVuY3Rpb24gaW5zZXJ0T2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCdpbnNlcnQgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0T2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCdzZWxlY3Qgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkT2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCd1cGQgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5mYWN0b3J5KCdjZnNlcicsIFtcbiAgICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAgICdtb21lbnRTZXJ2aWNlJyxcbiAgICAnenVtZXJvU2VydmljZScsXG4gICAgJ3RvYXN0U2VydmljZScsXG4gICAgY2ZzZXJcbiAgXSk7XG4gIGZ1bmN0aW9uIGNmc2VyKGludGVybWVkaWF0ZVNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIHRvYXN0U2VydmljZSkge1xuICAgIHZhciBjZkZhY3RvcnkgPSB7XG4gICAgICBvYmpDb2RGYXM6IHtcbiAgICAgICAgY29kRmFzZWNvbGRhOiBudWxsLFxuICAgICAgICBhbHJlYWR5U2V0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGluc2VydENvZEZhczogaW5zZXJ0Q29kRmFzLFxuICAgICAgdXBkQ29kRmFzOiB1cGRDb2RGYXMsXG4gICAgICBnZXRDb2RGYXM6IGdldENvZEZhc1xuICAgIH07XG4gICAgcmV0dXJuIGNmRmFjdG9yeTtcbiAgICBmdW5jdGlvbiBpbnNlcnRDb2RGYXMoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGFdIChbaWRpbnNwZWNjaW9uXSAsW3BsYWNhXSAgLFtjb2RGYXNlY29sZGFdICAsW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyw/KSAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuYWxyZWFkeVNldCA9IHRydWU7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NvZGlnbyBpbmdyZXNhZG8nKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDI0KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkQ29kRmFzKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRpbnNwZWNjaW9uQ29kaWdvc0Zhc2Vjb2xkYV0gJztcbiAgICAgIHF1ZXJ5ICs9ICdTRVQgW2NvZEZhc2Vjb2xkYV0gPSA/ICwgJztcbiAgICAgIHF1ZXJ5ICs9ICdbZmVjaGFdID0gPyAsICc7XG4gICAgICBxdWVyeSArPSAnW2lkYWp1c3Rldl0gPSBOVUxMICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgaWRpbnNwZWNjaW9uPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnY29kaWdvIGFjdHVhbGl6YWRvJyk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyNCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENvZEZhcygpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGEgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgYXJyYXkgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSA9IGFycmF5WzBdLmNvZEZhc2Vjb2xkYTtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuY29kRmFzZWNvbGRhID0gbnVsbDtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuY29udHJvbGxlcignQWNjZXNvcmlvc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTW9kYWwnLFxuICAnYWNjZXNvcmlvc1NlcnZpY2UnLFxuICAnZm90b3NTZXJ2aWNlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgenVtZXJvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sIHBsYWNhc1NlcnZpY2UsICRpb25pY05hdkJhckRlbGVnYXRlLCAkbG9jYXRpb24sICRpb25pY1BvcHVwLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZm9jdXMsICRzdGF0ZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNNb2RhbCwgYWNjZXNvcmlvc1NlcnZpY2UsIGZvdG9zU2VydmljZSwgY29weUZpbGVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIGNoZWNrRmlsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgJHNjb3BlLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vXG4gICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KGZhbHNlKTtcbiAgICAgICRzY29wZS5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGVuTmV3QWNjZXNvcmlvLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5hY2NlcyA9IFtdO1xuICAgICAgJHNjb3BlLnNldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjZXMgPSBhY2Nlc29yaW9zU2VydmljZS5hbGw7XG4gICAgICB9O1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldCBpdGVtcyBlbiAgZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgIH0pO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuaW5pdE9wdGlvbnMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBjb250cm9sYWRvcicpO1xuICAgICAgICAkc2NvcGUub3B0aW9ucyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXREYXRhO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuaW5pdGFjYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjYyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXRBY2MoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuc2hvd01vZGFsTmV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuaW5pdGFjYygpO1xuICAgICAgICAkc2NvcGUubW9kc2hvdyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZS5zYXZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoNCk7XG4gICAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7ICAvLyAkc2NvcGUuYWNjZXMucHVzaCgkc2NvcGUuYWNjKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5wYXRoID0gJ2h0dHA6Ly9pLmRhaWx5bWFpbC5jby51ay9pL3BpeC8yMDE0LzAzLzIzL2FydGljbGUtMjU4NzQ1NC0xQzg2NDk5MTAwMDAwNTc4LTQzOF82MzR4NDMwLmpwZyc7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1vZCA9IGZ1bmN0aW9uIChhY2MpIHtcbiAgICAgICAgJHNjb3BlLm1vZHNob3cgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuYWNjID0gYWNjO1xuICAgICAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZUFjdE1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPOiBBUVVJIFRFTkRSSUEgUVVFIEhBQ0VSIEVMIFVQREFURSBcbiAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICB2YXIgaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmluc2VydEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLnN5bmMgPSBzeW5jO1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5vblVwbG9hZCA9IG9uVXBsb2FkO1xuICAgICAgICB1cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgICRzY29wZS50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICBmb3RvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChmb3RvKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gdHJ1ZTtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnRha2VkcGljKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnN5bmMgPSBzeW5jO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcub25VcGxvYWQgPSBvblVwbG9hZDtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnBhdGggPSByZXMubmF0aXZlVVJMO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcucnV0YVNydiA9IG1vbWVudFNlcnZpY2UucnV0YVNydihyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIGluc2VydEZvdG8ocmVzLm5hdGl2ZVVSTCwgc3luYywgb25VcGxvYWQpO1xuICAgICAgICAgICAgcHJlRmlsZVVwbG9hZCgkc2NvcGUuYWNjLmltZyk7XG4gICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGZuRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgb2ZmbGluZVNlcnZpY2UsIHRpdGxlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgenVtZXJvU2VydmljZSwgdG9hc3RTZXJ2aWNlLCB1bnN5bmNTZXJ2aWNlLCAkc3RhdGUsIGF1dGhTZXJ2aWNlKSB7XG4gICRzY29wZS5vZmYgPSBvZmZsaW5lU2VydmljZS5kYXRhO1xuICAkc2NvcGUuaW50ZXJtZWRpYXRlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhO1xuICAkc2NvcGUuc2V0T2ZmbGluZU1vZGUgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgICRzY29wZS5vZmYub2ZmbGluZU1vZGUgPSBib29sO1xuICAgIC8vIGlmIChib29sKSB7XG4gICAgLy8gICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKHRpdGxlU2VydmljZS50aXRsZSk7XG4gICAgLy8gfVxuICAgIGlmICghYm9vbCAmJiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnc2luY3Jvbml6YW5kbycpO1xuICAgICAgdW5zeW5jU2VydmljZS5zeW5jSW1hZ2VzKCkgIC8vIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB6dW1lcm9TZXJ2aWNlLnp5bmMoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7ICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMCk7XG47XG4gICAgfVxuICB9O1xuICAkc2NvcGUubG9nT3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gIH07XG59KTsiLCJhcHAuY29udHJvbGxlcignUGxhY2FzQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJ3BsYWNhc1NlcnZpY2UnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRpb25pY1BvcHVwJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZvY3VzJyxcbiAgJyRzdGF0ZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnJGlvbmljTW9kYWwnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ2ZpcnN0SW5pdFNlcnZpY2UnLFxuICAnJGxvY2FsU3RvcmFnZScsXG4gICckaW9uaWNMb2FkaW5nJyxcbiAgJyRmaWx0ZXInLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICckdGltZW91dCcsXG4gIGZ1bmN0aW9uICgkc2NvcGUsIHp1bWVyb1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBwbGFjYXNTZXJ2aWNlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGxvY2F0aW9uLCAkaW9uaWNQb3B1cCwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZvY3VzLCAkc3RhdGUsIHRpdGxlU2VydmljZSwgJGlvbmljTW9kYWwsIHRvYXN0U2VydmljZSwgZmlyc3RJbml0U2VydmljZSwgJGxvY2FsU3RvcmFnZSwgJGlvbmljTG9hZGluZywgJGZpbHRlciwgaW50ZXJtZWRpYXRlU2VydmljZSwgJHRpbWVvdXQpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAvLyBwbGFjYXNTZXJ2aWNlLnNlbGVjdEFsbCgpO1xuICAgICAgLy8gcHMgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgLy8gcGMgPSAkc2NvcGU7XG4gICAgICAvLyAkc2NvcGUucGxhY2FzU2VydmljZSA9IHBsYWNhc1NlcnZpY2U7XG4gICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAkc2NvcGUub2JqID0geyBmaWx0ZXI6ICcnIH07XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgICRzY29wZS5wbGFjYXNTZXJ2aWNlLnNlbGVjdEFsbCgpO1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhwbGFjYXNTZXJ2aWNlLmFsbCk7XG4gICAgICAvLyB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgLy8gfSk7XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7XG4gICAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSAnUGxhY2FzJztcbiAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBsYWNhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnY2FyZ2FuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgICAgcGxhY2FzU2VydmljZS5nZXRQbGFjYXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5wbGFjYXMgPSBwbGFjYXNTZXJ2aWNlLmFsbDtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmZJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmaXJzdEluaXRTZXJ2aWNlLmluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIHF1ZSBsYSBjb25zdWx0YSBkZSBwbGFjYXMgc3VwaWVyYSB0b2RvLCBjb21vIHBvciBlamVtcGxvIHNpIHlhIHNlIGNhbGlmaWNvLCBzaSB5YSB0aWVuZSBhbGd1bmEgZm90byBvIHVuIHZpZGVvLCBwdWVkZSBzZXIgbWFyY2FuZG9sbyBjb24gYWxndW5hIGNsYXNlXG4gICAgICBpZiAoISRsb2NhbFN0b3JhZ2UuZGF0YSkge1xuICAgICAgICAkc2NvcGUuc2hvdygpO1xuICAgICAgICAvLyBUT0RPOiBwdWVkbyBwb2RlciBvYmo9bnVsbCwgcGFyYSBxdWUgbWUgZWxpbWluZSBsYSBiYXNlIGRlIGRhdG9zIHNpIHlhIGVzdGEgY3JlYWRhIHkgdnVlbHZhIGEgc2luY3Jvbml6YXIsIGVzdG8gc2VyaWEgYmVuZWZpY2lvc28gc2kgdGVuZ28gcXVlIGhhY2VyIHVuIGNhbWJpbyBlbiBsYSBiYXNlIGRlIGRkYXRvcyBxdWUgcmVxdWllcmEgcmVjb25zdHJ1aXJsYVxuICAgICAgICAkdGltZW91dCgkc2NvcGUuZkluaXQsIDMwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUuZ2V0UGxhY2FzKCk7XG4gICAgICB9XG4gICAgICAkc2NvcGUucGxhY2FQb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogb3JnYW5pemFyIGVsIGZvY3VzIGVuIGVsIGlucHV0IGRlbCBwb3B1cFxuICAgICAgICB2YXIgbXlwcm9tcHQgPSAkaW9uaWNQb3B1cC5wcm9tcHQoe1xuICAgICAgICAgIHRpdGxlOiAnTnVldmEgUGxhY2EnLFxuICAgICAgICAgIHRlbXBsYXRlOiAnSW5ncmVzZSBsYSBudWV2YSBwbGFjYScsXG4gICAgICAgICAgaW5wdXRUeXBlOiAndGV4dCcsXG4gICAgICAgICAgaW5wdXRQbGFjZWhvbGRlcjogJ1BsYWNhJ1xuICAgICAgICB9KTtcbiAgICAgICAgbXlwcm9tcHQudGhlbihmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgICAgICAkc2NvcGUuYWRkUGxhY2EocGxhY2EpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYWRkUGxhY2EgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQocGxhY2EpKSB7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgndmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlJyk7XG4gICAgICAgICAgLy8gYWxlcnQoXCJ2ZXJpZmlxdWUgbGEgcGxhY2EgZSBpbmdyZXNlIG51ZXZhbWVudGVcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGFjYS5sZW5ndGggPCA0KSB7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnbG9uZ2l0dWQgZGUgcGxhY2EgbXV5IGNvcnRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvW15cXHdcXHNdL2dpLCAnJykudG9VcHBlckNhc2UoKTtcbiAgICAgICAgcGxhY2EgPSBwbGFjYS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKSgkc2NvcGUucGxhY2FzLCB7IHBsYWNhOiBwbGFjYSB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3BsYWNhIHlhIHJlZ2lzdHJhZGEnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdJbmdyZXNhbmRvIG51ZXZhIHBsYWNhJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuaW5zZXJ0UExhY2EocGxhY2EpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICRzY29wZS5zZXRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJycpO1xuICAgICAgICBmb2N1cy5mb2N1cygnc2VhcmNoUHJpbWFyeScpOyAgLy9ubyBlcyBuZWNlc2FyaW8gYWJyaXIgZWwga2V5Ym9hcmQgc2UgYWJyZSBzb2xvIGN1YW5kbyBhc2lnbmFtb3MgZWwgZm9jdXMgLy8gY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubm9Gb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgJHNjb3BlLm9iai5maWx0ZXIgPSAnJztcbiAgICAgIH07XG4gICAgICAkc2NvcGUuc2V0SW50RGF0YSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgLy8gVE9ETzogc2kgbGFzIHBsYWNhcyBzb24gaWd1YWxlcywgcHVlZGUgc2VyIHF1ZSBzZSBoYXlhIHNpbmNyb25pemFkbyB5IG5vIHNlIGhheWEgYWN5YXVsaXphZG8gbGEgbGlzdGEgZGUgcGxhY2FzLCBlbnRvbmNlcyBzZSBwYXNhcmlhIHVuIGlkaW5zcGVjY2lvbiBxdWUgbm8gLGVzIGVzdG8gY3VhbmRvIG9mZmxpbmUgY3JlbyB1bmEgcGxhY2EsIG1lIHBvbmdvIG9ubGluZSB5IGx1ZWdvIG9uIHBhdXNlIGhhZ28gZWwgc3luYywgYXVucXVlIGhheXEgdWUgcGVuc2FyIHF1ZSBjdWFuZG8gbGUgcG9uZ28gb25saW5lLCBkZWJlcmlhIHNpbmNyb25pemFyIHNpIGhheSBzZcOxYWwgNGcgbyB3aWZpIHBhcmEgaW1hZ2VuZXMgbyBwYXJhIHRvZG9cbiAgICAgICAgaWYgKG9iai5wbGFjYSAhPT0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gb2JqLnBsYWNhO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gb2JqLnN5bmMgPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IG9iai5pZGluc3BlY2Npb247XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29Gb3RvcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZm90bycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7ICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9mb3Rvcy8nICsgb2JqLmlkaW5zcGVjY2lvbik7ICAvLyBUT0RPOiBjYW1iaWFyIHBvciBzdGF0ZS5nbyBtYXMgcGFyYW1ldHJvcywgdmVyIGJlc3QgcHJhY3RpY2VzXG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvVmlkZW8gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3ZpZGVvLycgKyBvYmouaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAudmlkZW8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0luc3BlY2Npb24gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vIFRPRE86IGFxdWkgcG9kcmlhIGV2YWx1YXIgc2kgeWEgc2UgY2FsaWZpY28gbyBubywgc2kgbm8gc2UgaGEgY2FsaWZpY2FkbyBwb2RyaWEgZGVzcGxlZ2FyIGVsIG1vZGFsIGRlIGNsYXNlIGNhcnJvY2VyaWFcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5zcGVjY2lvbicsIHtcbiAgICAgICAgICBpZDogb2JqLmlkaW5zcGVjY2lvbixcbiAgICAgICAgICBwbGFjYTogb2JqLnBsYWNhLFxuICAgICAgICAgIGNhbGlmaWNhZG86IG9iai5jYWxpZmljYWRvXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0FjY2Vzb3Jpb3MgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFjY2Vzb3Jpb3MnLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0NvZEZhcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuY29kRmFzJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY3JlYXRlRXhjZXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWV0aGluZyBoYXMgZ29uZSB0ZXJyaWJseSB3cm9uZyEnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdUZXN0Q3RybCcsIFtcbiAgJyRzY29wZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdzcWxTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljUGxhdGZvcm0sIHNxbFNlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB2YXIgenVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAgICRzY29wZS5vcGVuZGIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHggPSB3aW5kb3cuc3FsaXRlUGx1Z2luLm9wZW5EYXRhYmFzZSh7IG5hbWU6ICd6dW1lcm90ZXN0ZGJmaWxlJyB9LCBmdW5jdGlvbiAocmVzdWx0T2JqLCBmdWxsUGF0aFBhcmFtLCBkYk9iamVjdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGRiT2JqZWN0LCAnZGJvYmplY3QnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRPYmosICdmdWxwYXRoOicsIGZ1bGxQYXRoUGFyYW0pOyAgLy9JbXBvcnRhbnQhICBJZiB5b3UgZG9uJ3QgY2xvc2UgdGhlIGRhdGFiYXNlIG9iamVjdCwgZnV0dXJlIGNhbGxzIHRvIG9wZW5EYXRhYmFzZSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy93b24ndCBjYWxsIHRoZSBzdWNjZXNzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYk9iamVjdC5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VkYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NlcnJhbmRvJywgeCk7XG4gICAgICAgIC8vIGlmICgheCkge1xuICAgICAgICB4LmNsb3NlKCk7XG4gICAgICAgIC8vIHp1bWVybyBzcWxpdGUgZnVuY2lvbmEgYXNpIC5jbG9zZSA9IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7IHBlcm8gbm8gc2UgdXNhbiBhbCBsbGFtYXIgY29yb2R2YS5leGVcbiAgICAgICAgY29uc29sZS5sb2coeC5vcGVuREJTKTsgIC8vIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZ1bGxQYXRoUGFyYW0gPSAnL2RhdGEvZGF0YS9jb20uaW9uaWNmcmFtZXdvcmsuZm90b3N2aWV3MzkwNzQ3L2RhdGFiYXNlcy96dW1lcm90ZXN0ZGIuZGInO1xuICAgICAgICB2YXIgc2VydmVyID0gJ2h0dHA6Ly8xOTIuMTY4LjEuMTM6ODA4MC8nO1xuICAgICAgICB2YXIgZGJmaWxlID0gJ3p1bWVyb3Rlc3RkYmZpbGUnO1xuICAgICAgICB2YXIgbm90aWZ5U3VjY2VzcyA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocyk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBub3RpZnlFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH07XG4gICAgICAgIHp1bWVyby5zeW5jKGZ1bGxQYXRoUGFyYW0sICcnLCBzZXJ2ZXIsIGRiZmlsZSwgbnVsbCwgbnVsbCwgbnVsbCwgbm90aWZ5U3VjY2Vzcywgbm90aWZ5RXJyb3IpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5vID0ge1xuICAgICAgICBzOiB0cnVlLFxuICAgICAgICBlOiB0cnVlLFxuICAgICAgICB1OiB0cnVlXG4gICAgICB9O1xuICAgICAgc3FsU2VydmljZS5zeW5jKCk7XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdWaWRlb0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAndmlkZW9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnJGZpbHRlcicsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ3ZpZGVvVGh1bWJuYWlsU2VydmljZScsXG4gICdnZXRWaWRlb1NlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICBmdW5jdGlvbiAocywgdmlkZW9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCBnZXRWaWRlb1NlcnZpY2UsIGNoZWNrRmlsZVNlcnZpY2UsIHRpdGxlU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgZXJyb3JTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBncHNTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgLy8gcy50aXR0bGUgPSAnJztcbiAgICAgIHMudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIHMudmlkZW9zID0gdmlkZW9TZXJ2aWNlLnZpZGVvcztcbiAgICAgIC8vdmlkZW9TZXJ2aWNlLmFsbCgpO1xuICAgICAgdmlkZW9TZXJ2aWNlLmdldFZpZGVvcyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy52aWRlb3MgPSB2aWRlb1NlcnZpY2UudmlkZW9zO1xuICAgICAgfSk7XG4gICAgICAvLyB2YXIgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xuICAgICAgLy8gfTtcbiAgICAgIHZhciBpbnNlcnRWaWRlbyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgdGh1bWJuYWlsLCBvbnVwbG9hZCkge1xuICAgICAgICB2aWRlb1NlcnZpY2UuaW5zZXJ0VmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgaW5zZXJ0IHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS51cGRhdGVWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIC8vIGluc2VydFZpZGVvKGltYWdlVVJJLCBzeW5jLCBvYmpWaWRlby50aHVtYm5haWwpO1xuICAgICAgICB1cGRhdGVWaWRlbyhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIHZhciByZWZyZXNoUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnByb2dyZXNzID0gcGVyY2VudGFnZTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgICAgLy8gY29uc3RhbnQgcHJvZ3Jlc3MgdXBkYXRlc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgLy8gcmVmcmVzaFByb2dyZXNzKGltYWdlVVJJLCBNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqVmlkZW8gPSBmdW5jdGlvbiAocGxhY2EsIHBhdGgsIHN5bmMsIG9uVXBsb2FkLCB0aHVtYm5haWwpIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHRodW1ibmFpbDogdGh1bWJuYWlsLFxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKShzLnZpZGVvcywgeyBwYXRoOiBzcmNJbWcgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ25vdCBmb3VuZCBpbiBhcnJheSBzZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBsb2FkVGh1bWJuYWlsID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2aWRlb1RodW1ibmFpbFNlcnZpY2UuZ2VuZXJhdGVUaHVtYm5haWwob2JqLnBhdGgpLnRoZW4oZnVuY3Rpb24gKHRodW1ibmFpbFNyYykge1xuICAgICAgICAgIHNlYXJjaE9uZUluQXJyYXkob2JqLnBhdGgpLnRodW1ibmFpbCA9IHRodW1ibmFpbFNyYztcbiAgICAgICAgICB2YXIgc3luYyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFRPRE86IG9udXBsb2FkIGRlcGVuZGVyYSBzaSBlc3RhIG9ubGluZSBvIG5vIHBhcmEgc2FiZXIgc2kgc2UgaW50ZW50YSBzdWJpcjtcbiAgICAgICAgICB2YXIgb25VcGxvYWQgPSB0cnVlO1xuICAgICAgICAgIGluc2VydFZpZGVvKG9iai5wYXRoLCBzeW5jLCB0aHVtYm5haWxTcmMsIG9uVXBsb2FkKTtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ21haW5TY3JvbGwnKS5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH07XG4gICAgICBzLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqVmlkZW8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKG9ialZpZGVvKTtcbiAgICAgIH07XG4gICAgICBzLmdldFZpZEZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIHZpZGVvU2VydmljZS50YWtlZFZpZCgpLnRoZW4oZnVuY3Rpb24gKHZpZGVvRGF0YSkge1xuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2aWRlb0RhdGEpO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2aWRlb0RhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkgKyAnOiAnICsgdmFsdWUpO1xuICAgICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKHZhbHVlLmZ1bGxQYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlQ29tcHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIGdldFZpZGVvU2VydmljZS5nZXRWaWRlb0NvbXByZXNzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIHZhciByZXNWaWRlb0NvbXByZXNzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgLy8gVE9ETzogMTI1ODI5MTIgc29uIDEyTUIgO1xuICAgICAgICAgIGlmIChjaGVja0ZpbGVTZXJ2aWNlLmZpbGUuc2l6ZSA8IDEyNTgyOTEyKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhnZXRWaWRlb1NlcnZpY2UuZmlsZUVudHJ5KTtcbiAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShyZXNWaWRlb0NvbXByZXNzLm5hdGl2ZVVSTCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvcHlGaWxlU2VydmljZS5maWxlRW50cnksIGNvcHlGaWxlU2VydmljZS5maWxlKTtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqVmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBmYWxzZSwgdHJ1ZSwgJycpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgICAgcy52aWRlb3MucHVzaChvYmopO1xuICAgICAgICAgICAgICBsb2FkVGh1bWJuYWlsKG9iaik7ICAvLyBwcmVGaWxlVXBsb2FkKHJlcy5uYXRpdmVVUkwpO1xuICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdlbCBhcmNoaXZvIHN1cGVyYSBlbCB0YW1hXFx4RjFhIG1heGltbyBwZXJtaXRpZG8uIG1heGltbyAxMk1CJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFtcbiAgJyRzY29wZScsXG4gICckbG9jYXRpb24nLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJHN0YXRlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnNyYyA9ICdpbWcvaWNvbi5wbmcnO1xuICAgICAgLy8gVE9ETzogdmVyaWZpY2FyIHNpIGVzdG8gc2UgcHVlZGUgaGFjZXIgZW4gZWwgcnVuLCBwZXJvIGNvbiBzdGF0ZS5nbyBhcHAucGxhY2FzXG4gICAgICB2YXIgX2FscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBwbGFjYXMnKTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGxhY2FzJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX2FscmVhZHkoKTtcbiAgICAgICRzY29wZS5sb2dnZWROb3cgPSBmYWxzZTtcbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHtcbiAgICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbigkc2NvcGUubG9naW5EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLm9uTG9nZ2VkKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAndmVyaWZpcXVlIHF1ZSBkaXNwb25nYSBkZSBjb25leGlvbiBhIGludGVybmV0LCBlIGludGVudGUgZGUgbnVldm8nO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm9uTG9nZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgIC8vICRzY29wZS5sb2dnZWQodHJ1ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UsJGxvY2F0aW9uKTtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hdXRoRXh0ZXJuYWxQcm92aWRlciA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgcmVkaXJlY3RVcmkgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgJy9hdXRoY29tcGxldGUuaHRtbCc7XG4gICAgICAgIHZhciBleHRlcm5hbFByb3ZpZGVyVXJsID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnYXBpL0FjY291bnQvRXh0ZXJuYWxMb2dpbj9wcm92aWRlcj0nICsgcHJvdmlkZXIgKyAnJnJlc3BvbnNlX3R5cGU9dG9rZW4mY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZCArICcmcmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdFVyaTtcbiAgICAgICAgd2luZG93LiR3aW5kb3dTY29wZSA9ICRzY29wZTtcbiAgICAgICAgdmFyIG9hdXRoV2luZG93ID0gd2luZG93Lm9wZW4oZXh0ZXJuYWxQcm92aWRlclVybCwgJ0F1dGhlbnRpY2F0ZSBBY2NvdW50JywgJ2xvY2F0aW9uPTAsc3RhdHVzPTAsd2lkdGg9NjAwLGhlaWdodD03NTAnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aENvbXBsZXRlZENCID0gZnVuY3Rpb24gKGZyYWdtZW50KSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChmcmFnbWVudC5oYXNsb2NhbGFjY291bnQgPT09ICdGYWxzZScpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogZnJhZ21lbnQuZXh0ZXJuYWxfdXNlcl9uYW1lLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Fzc29jaWF0ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL09idGFpbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZGlyZWN0IHRvIG9yZGVyc1xuICAgICAgICAgICAgdmFyIGV4dGVybmFsRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdXRoU2VydmljZS5vYnRhaW5BY2Nlc3NUb2tlbihleHRlcm5hbERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gIC8vICRzY29wZS5hbHJlYWR5TG9nZ2VkKCk7ICAgICAgICAgICAgICAgXG47XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdJbnNwZWNjaW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHRpdGxlU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRmaWx0ZXIsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIHNxbGl0ZVNlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmNhbGlmaWNhZG8pID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAkc2NvcGUuZGF0YSA9IGluc3BlY2Npb25TZXJ2aWNlLmRhdGE7XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGNpb25Nb2RhbC5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICB9KTtcbiAgICAvLyBUT0RPOiBjb21vIGVzdG8gc2Ugc2luY3Jvbml6YSB1bmEgc29sYSB2ZXosIG5vIGhheSBwcm9ibGVtYSBjb24gZWwgaWRpbnNwZWNjaW9uLCBlbCBwcm9ibGVtYSBlc3RhIGVuIGFjY2Vzb3Jpb3MgeSBlbiBmb3RvcywgcXVlIHNlIHN1YmUgdW5vIGEgdW5vLCBlbnRvbmNlcyBwb2RyaWEgY2FtYmlhciwgbyBlbiBhY2Nlc29yaW9zIGhhY2VyIHVuIGJlZm9ybGVhdmUgZGUgdmlldywgbWkgcHJlZ3VudGEgZXMgLCBzaSBubyBhYmFuZG9uYSBsYSB2aWV3LCBjb21vIHNpbmNyb25pem8/IG90cmEgbWFzIHNpIHBhc28gYSBiYWNrZ3JvdW5kIHB1ZWRvIHNpbmNyb25pemFyPz8/XG4gICAgLy8gVE9ETzogZXN0YSB2YXJpYWJsZSBtZSBsYSBkYSBsYSBwYmFzZSBkZSBzYXRvcywgc2kgeWEgZXN0YSBjYWxpZmljYWRvIG8gbm9cbiAgICAkc2NvcGUub2JqID0geyBjdXN0b21zZWN0aW9uOiAwIH07XG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuc2hvdygpO1xuICAgIC8vICR0aW1lb3V0KCRzY29wZS5oaWRlLCAxNTAwMCk7XG4gICAgJHNjb3BlLml0ZW1zID0gW107XG4gICAgLy8gaW5pdGlhbCBpbWFnZSBpbmRleFxuICAgICRzY29wZS5fSW5kZXggPSAwO1xuICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5zZWN0aW9ucywgaSk7XG4gICAgICAkc2NvcGUub2JqLmN1c3RvbXNlY3Rpb24gPSAkc2NvcGUuc2VjdGlvbnNbaV0uY3VzdG9tc2VjdGlvbjtcbiAgICAgIC8vICRzY29wZS5zZXRNaW4oKTtcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgIH07XG4gICAgLy9yZWZlbmNlIHNlcnZpY2VcbiAgICAvLyBpZiBhIGN1cnJlbnQgaW1hZ2UgaXMgdGhlIHNhbWUgYXMgcmVxdWVzdGVkIGltYWdlXG4gICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gJHNjb3BlLl9JbmRleCA9PT0gaW5kZXg7XG4gICAgfTtcbiAgICAvLyBzaG93IHByZXYgaW1hZ2VcbiAgICAkc2NvcGUuc2hvd1ByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuX0luZGV4ID0gJHNjb3BlLl9JbmRleCA+IDAgPyAtLSRzY29wZS5fSW5kZXggOiAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgLy8gc2hvdyBuZXh0IGltYWdlXG4gICAgJHNjb3BlLnNob3dOZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPCAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMSA/ICsrJHNjb3BlLl9JbmRleCA6IDA7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8qIFNob3cgbGlzdCAqL1xuICAgICRzY29wZS5zaG93SXRlbXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgLy8gVE9ETzogcGFyYSBkZXNoYWJpbGl0YXIgZWwgdXBkYXRlLCBhdW5xdWUgeWEgZXN0YSBtb250YWRvLCBtZSBwcmVvY3VwYSBlcyBlbCB6eW5jIGNhZGEgcXVlIHNlIGhhZ2EgdW4gdXBkYXRlXG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVtLmRpcnR5ID0gdHJ1ZTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLml0ZW0gPSBpdGVtO1xuICAgICAgJHNjb3BlLml0ZW0gPSBpbnNwZWNjaW9uU2VydmljZS5pdGVtO1xuICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICB9O1xuICAgIC8qIEhpZGUgbGlzdCAqL1xuICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnZhbGlkYXRlU2luZ2xlID0gZnVuY3Rpb24gKG9wY2lvbikge1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHRleHRcbiAgICAgICRzY29wZS5pdGVtLnNsLmxhYmVsID0gb3BjaW9uLmxhYmVsO1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHZhbHVlXG4gICAgICAkc2NvcGUuaXRlbS5zbC52YWx1ZSA9IG9wY2lvbi52YWx1ZTtcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnVwZGF0ZVNpbmdsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvayB1cGRhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBIaWRlIGl0ZW1zXG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zKCk7ICAvLyBFeGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgfTtcbiAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdHdWFyZGFuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFscmVhZHlTYXZlZCA9IGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuaGlkZSgpO1xuICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2UuY2xlYXJUaXBvKCk7XG4gICAgICAkc2NvcGUuY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICRzY29wZS5jbC50aXBvID0gbnVsbDtcbiAgICB9O1xuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL21vZGFsR2V0SXRlbXMuaHRtbCcsIHtcbiAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lID0gbW9kYWw7XG4gICAgfSk7XG4gICAgJHNjb3BlLm9wZW5Nb2RhbE9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZS5zaG93KCk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKGlkdGlwbykge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2xhc2VzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jbGFzZXMgPSBpbnNwZWNjaW9uU2VydmljZS5jbGFzZXM7XG4gICAgICAgICRzY29wZS5jYXJyb2NlcmlhcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNhcnJvY2VyaWFzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoaWRjbGFzZSkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2Fycm9jZXJpYXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNhcnJvY2VyaWFzID0gaW5zcGVjY2lvblNlcnZpY2UuY2Fycm9jZXJpYXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5pdGVtcyA9IGluc3BlY2Npb25TZXJ2aWNlLmFsbDtcbiAgICAgICRzY29wZS5zZWN0aW9ucyA9IGluc3BlY2Npb25TZXJ2aWNlLnNlY3Rpb25zO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNldElkQ2xhQ2EoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldElkQ2xhQ2EgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldEFscmVhZHlJbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0QWxyZWFkeUluc3BlY3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldEFscmVhZHlJbnNwZWN0IGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnRpcG9zID0gaW5zcGVjY2lvblNlcnZpY2UudGlwb3M7XG4gICAgICAkc2NvcGUuY2wgPSBpbnNwZWNjaW9uU2VydmljZS5jbDtcbiAgICAgIC8vIFRPRE86IGFxdWkgdmFsaWRvIHNpIHlhIHNlIGNhbGlmaWNvIG8gc2kgYXBlbmFzIHNlIHZhIGEgcmVhbGl6YXJcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIG9uIGluaXRcbiAgICAkc2NvcGUuaW5pdCgpO1xuICB9KTtcbn0pOyIsImFwcC5mYWN0b3J5KCdpbnNwZWNjaW9uU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHEnLFxuICAnJGZpbHRlcicsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHEsICRmaWx0ZXIsIGVycm9yU2VydmljZSwgbW9tZW50U2VydmljZSwgenVtZXJvU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICAgIHZhciBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNlY3Rpb25zID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBraWxvbWV0cmFqZTogJycsXG4gICAgICBvYnNlcnZhY2lvbjogJydcbiAgICB9O1xuICAgIHZhciBfc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocHJlSXRlbXMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IG9iai5jb250cm9sSnNvblswXS5pZCxcbiAgICAgICAgICBsYWJlbDogb2JqLmNvbnRyb2xKc29uWzBdLnRleHRcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICBvYmouc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IHByZUl0ZW1zO1xuICAgIH07XG4gICAgdmFyIF9zZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkZmlsdGVyKCd1bmlxdWUnKShpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCAnY3VzdG9tc2VjdGlvbicpLCAnY3VzdG9tc2VjdGlvbicpO1xuICAgIH07XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIF9zZXRJdGVtcygpO1xuICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAvLyBUT0RPOiBsb2dpY2EgcGFyYSBzYWJlciBzaSB5YSBmdWUgY2FsaWZpY2Fkb1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkc2VydmljaW8sXG4gICAgICAgIG9iai5pZGl0ZW0sXG4gICAgICAgIG9iai5pZFBhcmVudEl0ZW0sXG4gICAgICAgIG9iai5ub21icmUsXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC5sYWJlbFxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF9zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEFsbEl0ZW1zKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydE9ic2VydmFjaW9uKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEtpbG9tZXRyYWplKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvIGluc3BlY2Npb24nKTtcbiAgICAgICAgcmV0dXJuIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSgpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ2luZ3Jlc28gb2snLCByZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEFsbEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHByb3BpZWRhZGVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICxbaWRpdGVtXSxbaWRwYXJlbnRpdGVtXSAgLFtub21icmVdICxbaWRvcGNpb25dICAsW3NlbGVjY2lvbl0gKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5ncyA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICBiaW5kaW5ncy5wdXNoKF9ydG5CaW5kaW5nKG9iaikpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncyk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydE9ic2VydmFjaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtvYnNlcnZhY2lvbmVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICAsW29ic2VydmFjaW9uXSwgW3BsYWNhXSkgICBWQUxVRVMgKD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjksXG4gICAgICAgIC8vX2NsLnRpcG8sXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2FcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRLaWxvbWV0cmFqZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBba2lsb21ldHJhamVzXSAgICAgICAgKFtpZGluc3BlY2Npb25dLCBba2lsb21ldHJhamVdLCBbcGxhY2FdKSAgICAgIFZBTFVFUyAoPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZ1VwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wubGFiZWwsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZGl0ZW1cbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlU2luZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRwcm9waWVkYWRlc10gc2V0IFtpZG9wY2lvbl09PyAsIFtzZWxlY2Npb25dPSA/IFdIRVJFIFtpZGluc3BlY2Npb25dPT8gYW5kIFtpZGl0ZW1dPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmdVcGRhdGUoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzaW5nbGUnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfY2wgPSB7XG4gICAgICBpZGNsYXNlOiBudWxsLFxuICAgICAgaWRjYXJyb2NlcmlhOiBudWxsLFxuICAgICAgdGlwbzogbnVsbFxuICAgIH07XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsYXNlcyA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IFtdO1xuICAgIC8vIFRPRE86IHBhcmEgbGEgaW1wbGVtZW50YWNpb24gZGUgcGVzYWRvcyB5IG1vdG9zLCB5YSBzaSBkZWJlIHNlciB1bmEgY29uc3VsdGFcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudGlwb3MgPSBbe1xuICAgICAgICB2YWx1ZTogODI5LFxuICAgICAgICBsYWJlbDogJ0xpdmlhbm9zJ1xuICAgICAgfSAgLy8gLFxuICAgICAgICAgLy8ge1xuICAgICAgICAgLy8gICB2YWx1ZTogODQ0LFxuICAgICAgICAgLy8gICBsYWJlbDogJ1Blc2Fkb3MnXG4gICAgICAgICAvLyB9XG5dO1xuICAgIHZhciBfZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKF9jbC50aXBvKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KF9jbC50aXBvKSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgZGlzdGluY3QgY2MuaWRjbGFzZSBhcyB2YWx1ZSAgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gY2xhc2VzX3RpcG9WZWhpY3VsbyBjdCAgaW5uZXIgam9pbiAgIGNsYXNlc19jYXJyb2NlcmlhcyBjYyBvbiBjYy5pZGNsYXNlPWN0LmlkY2xhc2UgICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2xhc2UgIHdoZXJlIGN0LmlkdGlwb3ZlaGljdWxvPT8nO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtwYXJzZUludChfY2wudGlwbyldO1xuICAgICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIFRPRE86IEFTSSBOTyBTSVJWRSAsIG5vIHNlIGFjdHVhbGl6YSBlbCBleHB1ZXN0byAsLF9jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsYXNlcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBfY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gW107XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9nZXRDYXJyb2NlcmlhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChfY2wuaWRjbGFzZSkgJiYgYW5ndWxhci5pc051bWJlcihwYXJzZUludChfY2wuaWRjbGFzZSkpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGRpc3RpbmN0IGNjLmlkY2Fycm9jZXJpYSBhcyB2YWx1ZSAsIGJ0Lk5vbWJyZSBhcyBsYWJlbCAgRlJPTSAgICBjbGFzZXNfY2Fycm9jZXJpYXMgY2MgIGlubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG89Y2MuaWRjYXJyb2NlcmlhICAgd2hlcmUgY2MuaWRjbGFzZT0/JztcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbcGFyc2VJbnQoX2NsLmlkY2xhc2UpXTtcbiAgICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgX2NsLmlkY2Fycm9jZXJpYSA9IG51bGw7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9zZXRJZENsYUNhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCBbaWRjbGFzZWNhcnJvY2VyaWFdICxbaWRjbGFzZV0gLFtpZGNhcnJvY2VyaWFdICAsW2lkY29kaWdvY2FsaWZpY2FjaW9uXSAgLFtpZGV4dHJhaW5mb10gICBGUk9NIFtjbGFzZXNfY2Fycm9jZXJpYXNdIFdIRVJFIGlkY2xhc2U9PyBhbmQgaWRjYXJyb2NlcmlhPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChfY2wuaWRjbGFzZSksXG4gICAgICAgIHBhcnNlSW50KF9jbC5pZGNhcnJvY2VyaWEpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkY2xhc2VjYXJyb2NlcmlhO1xuICAgICAgICByZXR1cm4gX2dldFRvSW5zcGVjdChzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uaWRjb2RpZ29jYWxpZmljYWNpb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldEpzb24gPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFsdWUuY29udHJvbEpzb24gPSBhbmd1bGFyLmZyb21Kc29uKHZhbHVlLmNvbnRyb2xKc29uKTtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZS5jb250cm9sSnNvblswXS52YWx1ZSxcbiAgICAgICAgICBsYWJlbDogdmFsdWUuY29udHJvbEpzb25bMF0ubGFiZWxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICB2YWx1ZS5zbCA9IHNsO1xuICAgICAgfSk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gYXJyYXk7XG4gICAgfTtcbiAgICB2YXIgX3NldEFscmVhZHlJbnNwZWN0SnNvbiA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YWx1ZS5jb250cm9sSnNvbiA9IGFuZ3VsYXIuZnJvbUpzb24odmFsdWUuY29udHJvbEpzb24pO1xuICAgICAgICAvLyBUT0RPOiBlbCBqc29uIGRlIGNvbnRyb2xKc29uIGRldnVlbHZlIHVuIHZhbHVlPSBcIlwiIHN0cmluZywgdmVyIHNpIHNlIHB1ZWRlIG1lam9yYXI7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUudmFsdWUudG9TdHJpbmcoKSxcbiAgICAgICAgICBsYWJlbDogdmFsdWUubGFiZWxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICB2YWx1ZS5zbCA9IHNsO1xuICAgICAgfSk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gYXJyYXk7XG4gICAgfTtcbiAgICB2YXIgX2NsZWFyT2JzS20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZSA9ICcnO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEub2JzZXJ2YWNpb24gPSAnJztcbiAgICB9O1xuICAgIC8vIHZhciBfY2xlYXJUaXBvID0gZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsLmlkY2xhc2UgPSB7XG4gICAgLy8gICAgIGlkY2xhc2U6IG51bGwsXG4gICAgLy8gICAgIGlkY2Fycm9jZXJpYTogbnVsbCxcbiAgICAvLyAgICAgdGlwbzogbnVsbFxuICAgIC8vICAgfTtcbiAgICAvLyB9O1xuICAgIHZhciBfZ2V0VG9JbnNwZWN0ID0gZnVuY3Rpb24gKGlkY29kaWdvY2FsaWZpY2FjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgaWRQYXJlbnRJdGVtLCBub21icmUsY3VzdG9tc2VjdGlvbiwgY3VzdG9tb3JkZXIgLCBjb250cm9sSnNvbiBmcm9tICB2aWV3VjMgb2lmICc7XG4gICAgICAvL3NpZW1wcmUgZGVqYXIgdW4gZXNwYWNpbyBlbiBibGFuY28gIFxuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY2FsaWZpY2FjaW9ucGllemFzY29kaWdvIGNwYyBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICBxdWVyeSArPSAnd2hlcmUgb2lmLmlkc2VydmljaW89PyBhbmQgY3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9wYXJzZUludChfY2wudGlwbyksXG4gICAgICAgIGlkY29kaWdvY2FsaWZpY2FjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgX3NldEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAgIF9jbGVhck9ic0ttKCk7ICAvLyBfY2xlYXJUaXBvKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2VyT2JzS20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgIG8uaWRvYnNlcnZhY2lvbiwgICBvYnNlcnZhY2lvbiwga2lsb21ldHJhamUgRlJPTSAgIG9ic2VydmFjaW9uZXMgbyBpbm5lciBqb2luIGtpbG9tZXRyYWplcyBrIG9uIGsuaWRpbnNwZWNjaW9uPW8uaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIChvLmlkaW5zcGVjY2lvbiA9ID8pIEFORCAoaWRzdWJwcm9jZXNvID0gPykgT3JkZXIgYnkgby5pZG9ic2VydmFjaW9uIGRlc2MgbGltaXQgMSAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZhciBvYnNLbSA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXTtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEub2JzZXJ2YWNpb24gPSBvYnNLbS5vYnNlcnZhY2lvbjtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUgPSBvYnNLbS5raWxvbWV0cmFqZTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9nZXRBbHJlYWR5SW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3Qgb2lmLmlkc2VydmljaW8gLCBjcGMuaWRpdGVtLCBvaWYuaWRQYXJlbnRJdGVtLCBvaWYubm9tYnJlLGN1c3RvbXNlY3Rpb24sIGN1c3RvbW9yZGVyICwgY29udHJvbEpzb24gLCBpZHAuaWRvcGNpb24gYXMgdmFsdWUsIGlkcC5zZWxlY2Npb24gYXMgbGFiZWwgJztcbiAgICAgIHF1ZXJ5ICs9ICdmcm9tICB2aWV3VmRvcyBvaWYgaW5uZXIgam9pbiBjYWxpZmljYWNpb25waWV6YXNjb2RpZ28gY3BjIG9uICBjcGMuaWRpdGVtPSBvaWYuaWRpdGVtICBhbmQgb2lmLnRpcG89MSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY29udHJvbEVsZW1lbnRvcyBjZSBvbiBjZS5pZGNvbnRyb2wgPW9pZi5pZGNvbnRyb2wgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjb2RpZ29jYWxpZmljYWNpb249Y3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZGluc3BlY2Npb24gaSBvbiBpLmlkQ2xhc2VDYXJyb2NlcmlhPWNjLmlkY2xhc2VjYXJyb2NlcmlhICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZHByb3BpZWRhZGVzIGlkcCBvbiBpZHAuaWRpbnNwZWNjaW9uPWkuaWRpbnNwZWNjaW9uIGFuZCBpZHAuaWRpdGVtID0gY3BjLmlkaXRlbSAnO1xuICAgICAgcXVlcnkgKz0gJ3doZXJlICBpLmlkaW5zcGVjY2lvbiA9PyBhbmQgb2lmLmlkc2VydmljaW89PyAgICAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAgIHJldHVybiBfc2VyT2JzS20oKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkaW5zcGVjY2lvbl0gICBTRVQgW2lkQ2xhc2VDYXJyb2NlcmlhXSA9PyBXSEVSRSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIF9pbnNlcnRTdGF0ZSg0NzcpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFN0YXRlID0gZnVuY3Rpb24gKGlkZXN0YWRvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkc3VicHJvY2Vzb3NlZ3VpbWllbnRvXSAoW2lkaW5zcGVjY2lvbl0gICAgLFtpZHN1YnByb2Nlc29dICAgLFtpZGVzdGFkb10gICAsW2ZlY2hhXSAgKSAgVkFMVUVTICAgICg/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5LFxuICAgICAgICAvL19jbC50aXBvLFxuICAgICAgICBpZGVzdGFkbyxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IHRydWU7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygzKTsgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbC50aXBvID0gbnVsbDtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldEl0ZW1zID0gX2dldEl0ZW1zO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS51cGRhdGVTaW5nbGUgPSBfdXBkYXRlU2luZ2xlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zYXZlID0gX3NhdmU7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsID0gX2NsO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDbGFzZXMgPSBfZ2V0Q2xhc2VzO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDYXJyb2NlcmlhcyA9IF9nZXRDYXJyb2NlcmlhcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2V0SWRDbGFDYSA9IF9zZXRJZENsYUNhO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRBbHJlYWR5SW5zcGVjdCA9IF9nZXRBbHJlYWR5SW5zcGVjdDtcbiAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2xlYXJUaXBvID0gX2NsZWFyVGlwbztcbiAgICByZXR1cm4gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnYWNjZXNvcmlvc1NlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHEsICRmaWx0ZXIsIGVycm9yU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICAgIHZhciBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhID0ge307XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkYWNjZXNvcmlvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFthY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX25vbWJyZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICd0ZXh0YScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAndGV4dGInLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9lc3RhZG9zID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX2NhbnRpZGFkZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcxJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcyJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfc2V0Tm9tYnJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gdmFyIGpzb24gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb247XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuZ3VsYXIuZnJvbUpzb24oanNvbikpO1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTsgIC8vYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldEVzdGFkb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5lc3RhZG9zID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldENhbnRpZGFkZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjInO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luaXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVE9ETzogIHVuYSBiYW5kZXJhIHBhcmEgc2FiZXIgcXVlIHlhIHNlIHNldGlvLCB1bmEgdmV6LCB5IGV2aXRhciBtYXMgY29uc3VsYXRzLCBhIG1lbm9zIHF1ZSBzZSBoYWdhIHVuYSBhY3R1YWxpemFjaW9uIGRlbCBzZXJ2aWRvclxuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX3NldE5vbWJyZXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfc2V0Q2FudGlkYWRlcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXRFc3RhZG9zKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdEFjYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIGluaWNpYXIgZXN0b3MgZGRsIHNpbiB2YWxvcmVzLCAgcGVybyB0ZW5kcmlhIHF1ZSB2YWxpZGFyIHF1ZSBzaSBzZSBzZWxlY2Npb25lIGFsZ287XG4gICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSA9IHtcbiAgICAgICAgbm9tYnJlOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlc1swXSxcbiAgICAgICAgZXN0YWRvOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuZXN0YWRvc1swXSxcbiAgICAgICAgY2FudGlkYWQ6IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzWzBdLFxuICAgICAgICB2YWxvcjogMCxcbiAgICAgICAgbWFyY2E6ICcnLFxuICAgICAgICByZWZlcmVuY2lhOiAnJyxcbiAgICAgICAgaW1nOiB7XG4gICAgICAgICAgcGF0aDogJycsXG4gICAgICAgICAgc3luYzogZmFsc2UsXG4gICAgICAgICAgb25VcGxvYWQ6IGZhbHNlLFxuICAgICAgICAgIGlkaW5zcGVjY2lvbjogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvblxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgb2JqLm5vbWJyZS5sYWJlbCxcbiAgICAgICAgb2JqLmVzdGFkby5sYWJlbCxcbiAgICAgICAgcGFyc2VJbnQob2JqLmNhbnRpZGFkLnZhbHVlKSxcbiAgICAgICAgb2JqLm1hcmNhLFxuICAgICAgICBvYmoucmVmZXJlbmNpYSxcbiAgICAgICAgb2JqLnZhbG9yLFxuICAgICAgICBvYmouaW1nLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRhY2Nlc29yaW9zXSAoW2lkaW5zcGVjY2lvbl0gLFtwbGFjYV0gLFtub21icmVdICxbZXN0YWRvXSAsW2NhbnRpZGFkXSAsW21hcmNhXSAsW3JlZmVyZW5jaWFdLFt2YWxvcl0sW2ltZ1NyY10pIFZBTFVFUyAgKD8sPyw/LD8sPyw/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfZ2V0SXRlbXMoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nVXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC50ZXh0LFxuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuZ2V0SXRlbXMgPSBfZ2V0SXRlbXM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVNpbmdsZSA9IF91cGRhdGVTaW5nbGU7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnNhdmUgPSBfc2F2ZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdE9wdGlvbnMgPSBfaW5pdE9wdGlvbnM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXRBY2MgPSBfaW5pdEFjYztcbiAgICByZXR1cm4gYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yU2VydmljZScsIFtcbiAgJyRxJyxcbiAgJyRsb2NhdGlvbicsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpbmplY3RvcicsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHEsICRsb2NhdGlvbiwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGluamVjdG9yLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlKSB7XG4gICAgdmFyIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9yZXF1ZXN0ID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfTtcbiAgICB2YXIgX3Jlc3BvbnNlRXJyb3IgPSBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAvLyB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgLy8gdmFyIHF1ZXJ5ID0gJ0lOU0VSVCAgSU5UTyBbbG9nc10oW2V4XSxbZW1haWxdLFtmZWNoYV0pICBWQUxVRVMoPyw/LD8pJztcbiAgICAgIC8vIHZhciBiaW5kaW5nID0gW1xuICAgICAgLy8gICBhbmd1bGFyLnRvSnNvbihyZWplY3Rpb24pLFxuICAgICAgLy8gICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSB8fCAnJyxcbiAgICAgIC8vICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAvLyBdO1xuICAgICAgLy8gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgLy8gICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAvLyB9KTtcbiAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICAgIGlmIChhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3JlZnJlc2gnKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICB9O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlcXVlc3QgPSBfcmVxdWVzdDtcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeS5yZXNwb25zZUVycm9yID0gX3Jlc3BvbnNlRXJyb3I7XG4gICAgcmV0dXJuIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnYXV0aFNlcnZpY2UnLCBbXG4gICckaHR0cCcsXG4gICckcScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGh0dHAsICRxLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgbW9tZW50U2VydmljZSkge1xuICAgIHZhciBzZXJ2aWNlQmFzZSA9IG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpO1xuICAgIHZhciBhdXRoU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2F1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgaXNBdXRoOiBmYWxzZSxcbiAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlLFxuICAgICAgbGFzdExvZ2luZzogJydcbiAgICB9O1xuICAgIHZhciBfZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46ICcnXG4gICAgfTtcbiAgICB2YXIgX3NhdmVSZWdpc3RyYXRpb24gPSBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XG4gICAgICBfbG9nT3V0KCk7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICdhcGkvYWNjb3VudC9yZWdpc3RlcicsIHJlZ2lzdHJhdGlvbikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2xvZ2luID0gZnVuY3Rpb24gKGxvZ2luRGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSAnZ3JhbnRfdHlwZT1wYXNzd29yZCZ1c2VybmFtZT0nICsgbG9naW5EYXRhLnVzZXJOYW1lICsgJyZwYXNzd29yZD0nICsgbG9naW5EYXRhLnBhc3N3b3JkICsgJyZjbGllbnRfaWQ9JyArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xuICAgICAgLy9zaWVtcHJlIHZveSBhIG1hbmRhciBlbCBjbGllbnRpZFxuICAgICAgLyppZiAobG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcclxuICAgICAgICAgICBkYXRhID0gZGF0YSArIFwiJmNsaWVudF9pZD1cIiArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xyXG4gICAgICAgfSovXG4gICAgICAvL3RlbmdvIHF1ZSByZXZpc2FyIGxvcyBjcm9zcyBvcmlnaW4sIGVuIGxhIGJhc2UgZGUgZGF0b3MgLCB5IGhhYmlsaXRhcmxvIGVuIGVsIG5hdmVnYWRvciBjaHJvbWUgLCBpbXBvcnRhbnRlXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIGQgPSBtb21lbnQoKTtcbiAgICAgICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAndG9rZW4nLCBkYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcbiAgICAgICAgcnAgPSByZXNwb25zZTtcbiAgICAgICAgaWYgKGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiB0cnVlLFxuICAgICAgICAgICAgbGFzdExvZ2luOiBkICAvLyAsXG4gICAgICAgICAgICAgICAvLyBleHA6bW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbixcbiAgICAgICAgICAgIGV4cDogbW9tZW50U2VydmljZS5hZGRTZWNvbmRzKHJlc3BvbnNlLmV4cGlyZXNfaW4pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICAgICAgICBsYXN0TG9naW46IGQgIC8vICxcbiAgICAgICAgICAgICAgIC8vIGV4cDptb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4sXG4gICAgICAgICAgICBleHA6IG1vbWVudFNlcnZpY2UuYWRkU2Vjb25kcyhyZXNwb25zZS5leHBpcmVzX2luKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24ubGFzdExvZ2luZyA9IG1vbWVudCgpO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSBsb2dpbkRhdGEudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gbG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSBmYWxzZTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9ICcnO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICB9O1xuICAgIHZhciBfZmlsbEF1dGhEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IGF1dGhEYXRhLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX3JlZnJlc2hUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBpZiAoYXV0aERhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgIHZhciBkYXRhID0gJ2dyYW50X3R5cGU9cmVmcmVzaF90b2tlbiZyZWZyZXNoX3Rva2VuPScgKyBhdXRoRGF0YS5yZWZyZXNoVG9rZW4gKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgICAgJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICd0b2tlbicsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2UucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfb2J0YWluQWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoZXh0ZXJuYWxEYXRhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAuZ2V0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L09idGFpbkxvY2FsQWNjZXNzVG9rZW4nLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHByb3ZpZGVyOiBleHRlcm5hbERhdGEucHJvdmlkZXIsXG4gICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZXh0ZXJuYWxEYXRhLmV4dGVybmFsQWNjZXNzVG9rZW5cbiAgICAgICAgfVxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3JlZ2lzdGVyRXh0ZXJuYWwgPSBmdW5jdGlvbiAocmVnaXN0ZXJFeHRlcm5hbERhdGEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L3JlZ2lzdGVyZXh0ZXJuYWwnLCByZWdpc3RlckV4dGVybmFsRGF0YSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICBhdXRoU2VydmljZUZhY3Rvcnkuc2F2ZVJlZ2lzdHJhdGlvbiA9IF9zYXZlUmVnaXN0cmF0aW9uO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5sb2dpbiA9IF9sb2dpbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkubG9nT3V0ID0gX2xvZ091dDtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuZmlsbEF1dGhEYXRhID0gX2ZpbGxBdXRoRGF0YTtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuYXV0aGVudGljYXRpb24gPSBfYXV0aGVudGljYXRpb247XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnJlZnJlc2hUb2tlbiA9IF9yZWZyZXNoVG9rZW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5Lm9idGFpbkFjY2Vzc1Rva2VuID0gX29idGFpbkFjY2Vzc1Rva2VuO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5leHRlcm5hbEF1dGhEYXRhID0gX2V4dGVybmFsQXV0aERhdGE7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnJlZ2lzdGVyRXh0ZXJuYWwgPSBfcmVnaXN0ZXJFeHRlcm5hbDtcbiAgICByZXR1cm4gYXV0aFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY2hlY2tGaWxlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxKSB7XG4gICAgdmFyIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9maWxlRGV0YWlsID0gZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAgIEZpbGVFbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGUgPSBmaWxlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9jaGVja0ZpbGUgPSBmdW5jdGlvbiAobWVkaWFVUkkpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG1lZGlhVVJJLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIC8vIHZhciBwYXRoPWNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3Rvcnk7IC8vIGltYWdlbmVzIGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5XG4gICAgICB2YXIgcGF0aCA9IG1lZGlhVVJJLnN1YnN0cmluZygwLCBtZWRpYVVSSS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIC8vIHZhciBuZXdGaWxlTmFtZSA9ICduZXdfJyArIEZpbGVOYW1lO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jaGVja0ZpbGUocGF0aCwgRmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgICByZXR1cm4gX2ZpbGVEZXRhaWwoRmlsZUVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuY2hlY2tGaWxlID0gX2NoZWNrRmlsZTtcbiAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRGV0YWlsID0gX2ZpbGVEZXRhaWw7XG4gICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY29weUZpbGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgLy8gdmFyIF9maWxlRGV0YWlsID0gZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgIC8vICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAvLyAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgIC8vICAgRmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAvLyAgICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlID0gZmlsZTtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAvLyB9O1xuICAgIHZhciBfY29weUZpbGUgPSBmdW5jdGlvbiAobWVkaWFVUkkpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG1lZGlhVVJJLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIC8vIHZhciBwYXRoPWNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3Rvcnk7IC8vIGltYWdlbmVzIGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5XG4gICAgICB2YXIgcGF0aCA9IG1lZGlhVVJJLnN1YnN0cmluZygwLCBtZWRpYVVSSS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIHZhciBuZXdGaWxlTmFtZSA9IEZpbGVOYW1lO1xuICAgICAgLy8gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNvcHlGaWxlKHBhdGgsIEZpbGVOYW1lLCBjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgbmV3RmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgICAvLyByZXR1cm4gY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnk9RmlsZUVudHJ5O1xuICAgICAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZS5maWxlRGV0YWlsKEZpbGVFbnRyeSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuY29weUZpbGUgPSBfY29weUZpbGU7XG4gICAgcmV0dXJuIGNvcHlGaWxlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjb3Jkb3ZhRXZlbnRzU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgb25saW5lU3RhdHVzU2VydmljZSwgenVtZXJvU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfb25SZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVzdW1lJywgZnVuY3Rpb24gKCkge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnVGhlIGFwcGxpY2F0aW9uIGlzIHJlc3VtaW5nIGZyb20gdGhlIGJhY2tncm91bmQnKTtcbiAgICAgIH0sIDApO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcbiAgdmFyIF9vblBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfY2FsbFp5bmMoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBhcHBsaWNhdGlvbiBpcyBwYXVzaW5nIHRvIHRoZSBiYWNrZ3JvdW5kJyk7XG4gICAgICB9LCAwKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG4gIHZhciBfY2FsbFp5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogZXZhbHVhciB0b2RhcyBsYXMgcG9zaWJpbGlkYWRlcyBkZSBlc3RvIGFjYSwgcG9yIHF1ZSBzaSBsYSBzZcOxYWwgZXMgbXV5IG1hbGEgcXVlIHB1ZWRlIHBhc2FyLCBhdW5xdWUgZWwgenluYyBkZSBiYXNlcyBkZSBkYXRvcyBudW5jYSBoYXNpZG8gbXV5IGdyYW5kZSBlbiBpbmZvcm1hY2lvblxuICAgIGlmIChvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUgJiYgIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyAmJiAhaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nVmlkKSB7XG4gICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7XG4gICAgfVxuICB9O1xuICBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnkub25QYXVzZSA9IF9vblBhdXNlO1xuICBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnkub25SZXN1bWUgPSBfb25SZXN1bWU7XG4gIC8vIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5jYWxsWnluYyA9IF9jYWxsWnluYztcbiAgcmV0dXJuIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdjcmVhdGVEaXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfY3JlYXRlRGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jcmVhdGVEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIGRpcikudGhlbihmdW5jdGlvbiAoc3VjY2VzKSB7XG4gICAgICAgIHJldHVybiBzdWNjZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5LmNyZWF0ZURpciA9IF9jcmVhdGVEaXI7XG4gICAgcmV0dXJuIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZGV2aWNlU2VydmljZScsIGZ1bmN0aW9uICgkY29yZG92YURldmljZSkge1xuICB2YXIgZGV2aWNlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9zZXRJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIGRldmljZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBkZXZpY2U6ICRjb3Jkb3ZhRGV2aWNlLmdldERldmljZSgpLFxuICAgICAgY29yZG92YTogJGNvcmRvdmFEZXZpY2UuZ2V0Q29yZG92YSgpLFxuICAgICAgbW9kZWw6ICRjb3Jkb3ZhRGV2aWNlLmdldE1vZGVsKCksXG4gICAgICBwbGF0Zm9ybTogJGNvcmRvdmFEZXZpY2UuZ2V0UGxhdGZvcm0oKSxcbiAgICAgIHV1aWQ6ICRjb3Jkb3ZhRGV2aWNlLmdldFVVSUQoKSxcbiAgICAgIHZlcnNpb246ICRjb3Jkb3ZhRGV2aWNlLmdldFZlcnNpb24oKVxuICAgIH07XG4gIH07XG4gIGRldmljZVNlcnZpY2VGYWN0b3J5LnNldEluZm8gPSBfc2V0SW5mbztcbiAgcmV0dXJuIGRldmljZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2Vhc3lEaXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSkge1xuICAgIHZhciBlYXN5RGlyU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2NyZWF0ZURpciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0b2RheSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgdmFyIEN1cnJlbnREYXRlID0gbW9tZW50KCkudW5peCgpO1xuICAgICAgJGNvcmRvdmFGaWxlLmNoZWNrRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCB0b2RheSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxyZWFkeWV4aXN0Jyk7ICAvLyBzdWNjZXNzXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgJGNvcmRvdmFGaWxlLmNyZWF0ZURpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgdG9kYXksIGZhbHNlKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2RpciBjcmVhdGVkJywgdG9kYXkpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2Fubm90IGNyZWF0ZWQgZGlyJywgdG9kYXkpO1xuICAgICAgICB9KTsgIC8vIGVycm9yXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeS5jcmVhdGVEaXIgPSBfY3JlYXRlRGlyO1xuICAgIHJldHVybiBlYXN5RGlyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdlcnJvclNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGVycm9yU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9jb25zb2xlRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICB9O1xuICBlcnJvclNlcnZpY2VGYWN0b3J5LmNvbnNvbGVFcnJvciA9IF9jb25zb2xlRXJyb3I7XG4gIHJldHVybiBlcnJvclNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGVUcmFuc2ZlcicsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGVUcmFuc2Zlcikge1xuICAgIHZhciBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAxNzAwMDtcbiAgICB2YXIgX2ZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBvYmoucGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgZmlsZUV4dCA9IG9iai5wYXRoLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICBjb25zb2xlLmxvZygnZXh0ZW5zaW9uJywgZmlsZUV4dCk7XG4gICAgICB2YXIgbWltZXR5cGUgPSAnaW1hZ2UvanBlZyc7XG4gICAgICAvLyBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gMjAwMDA7XG4gICAgICBpZiAoZmlsZUV4dCA9PT0gJ21wNCcpIHtcbiAgICAgICAgbWltZXR5cGUgPSAndmlkZW8vbXA0JztcbiAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDYwMDAwO1xuICAgICAgfVxuICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC9hcGkvZmlsZSc7XG4gICAgICAvLyAnaHR0cHM6Ly93d3cuYWp1c3RldnNpdmEuY29tL2F1dGgvYXBpL2ZpbGUnO1xuICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgIG9wdGlvbnMuZmlsZUtleSA9ICdmaWxlJztcbiAgICAgIG9wdGlvbnMuZmlsZU5hbWUgPSBvYmoucGF0aC5zdWJzdHIob2JqLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgb3B0aW9ucy5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgLyp2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcclxuICAgICAgIGlmIChhdXRoRGF0YSkge1xyXG4gICAgICAgICB2YXIgaGVhZGVycyA9IHsgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbiB9O1xyXG4gICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgfSovXG4gICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICBwYXJhbXMucGF0aEZpbGVTZXJ2ZXIgPSBvYmoucnV0YVNydi5zdWJzdHJpbmcoMCwgb2JqLnJ1dGFTcnYubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgLy8gJzIwMTUvTWFyY2gvMTgvUFJVRUJBNzAwJztcbiAgICAgIC8vIHVybDsvL1VwUHJvbWlzZS5wYXRoRmlsZVNlcnZlcjtcbiAgICAgIHBhcmFtcy52YWx1ZTIgPSAncGFyYW0nO1xuICAgICAgb3B0aW9ucy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAvLyBUT0RPOiBkZWZpbmlyIHVuIHNlcnZpY2lvIHBhcmEgc2V0IGVsIHRpbWVvdXQgZGVwZW5kaWVuZG8gc2kgZXMgZm90byBvIHZpZGVvO1xuICAgICAgb3B0aW9ucy50aW1lb3V0ID0gZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dDtcbiAgICAgIC8vJHNjb3BlLmRhdGEudGltZW91dDtcbiAgICAgIC8vNTAwOy8vMzAwMDA7Ly9taWxpc2Vjb25kc1xuICAgICAgY29uc29sZS50aW1lKCdmaWxlVXBsb2FkJyk7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlVHJhbnNmZXIudXBsb2FkKHNlcnZlciwgb2JqLnBhdGgsIG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1Y2NlcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7ICAvL1RPRE86IHZlcmlmaWNhciBzaSBwdWVkbyBwb25lciBlbCBlcnJvciBhY2EgeSBkaXNwYXJhciBlbCBvb2ZsaW5lbW9kZSBkZXNkZSBhY2EgeSBubyBkZXNkZSB0b2RvcyBsb3MgY29udHJvbGxlcnNcbiAgICAgIH0gIC8vIFRPRE86IHNpIGVqZWN1dG8gZW4gZWwgc2VydmljaW8gbm8gbGxlZ2EgYWwgY29udHJvbGFkb3IsIGF1bnF1ZSBwb2RyaWEgaGFjZXIgdW5hIHByYWN0aWNhIHBhcmEgZGVmaW5pciBsb3MgcGFyYW1ldHJvcyBkZSBhZnRlcnVwbG9hZCBhcXVpIG1pc21vLCB5IHF1ZWRhIG11Y2hvIG1lam9yXG4gICAgICAgICAvLyAsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdlcnJvciBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICAgLy8gfVxuKTtcbiAgICB9O1xuICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LmZpbGVVcGxvYWQgPSBfZmlsZVVwbG9hZDtcbiAgICByZXR1cm4gZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdmaXJzdEluaXRTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNMb2FkaW5nJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsICRsb2NhbFN0b3JhZ2UsIHp1bWVyb1NlcnZpY2UsICRpb25pY0xvYWRpbmcpIHtcbiAgICB2YXIgZmlyc3RJbml0U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3Nob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxzcGFuPkluaWNpYWxpemFuZG88L3NwYW4+PGlvbi1zcGlubmVyIGljb249XCJhbmRyb2lkXCI+PC9pb24tc3Bpbm5lcj4nIH0pO1xuICAgIH07XG4gICAgdmFyIF9oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICB2YXIgX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICBjb25zb2xlLmxvZygnY3JlYW5kbyBvYmogbG9jYWxzdG9yYWdlJyk7XG4gICAgICBpZiAob25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICAgIF9zaG93KCk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZmlyc3QgaW5pdCBvaycpO1xuICAgICAgICAgICRsb2NhbFN0b3JhZ2UuZGF0YSA9IHtcbiAgICAgICAgICAgIGxhc3REaXJDcmVhdGVkOiAnJyxcbiAgICAgICAgICAgIGZpcnN0WnluYzogbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfaGlkZSgpO1xuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBpbml0IGVycm9yJywgZSk7XG4gICAgICAgICAgX2hpZGUoKTtcbiAgICAgICAgICBxLnJlamVjdChlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxLnJlamVjdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICB9O1xuICAgIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5LmluaXQgPSBfaW5pdDtcbiAgICByZXR1cm4gZmlyc3RJbml0U2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdmb2N1cycsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgZm9jdXNGYWN0b3J5ID0ge307XG4gIHZhciBfZm9jdXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAgLy8gZS5nLiBjbGljayBldmVudHMgdGhhdCBuZWVkIHRvIHJ1biBiZWZvcmUgdGhlIGZvY3VzIG9yXG4gICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXG4gICAgLy8gYXJlIHRyaWdnZXJlZC5cbiAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgZm9jdXNGYWN0b3J5LmZvY3VzID0gX2ZvY3VzO1xuICByZXR1cm4gZm9jdXNGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2dldFZpZGVvU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FtZXJhJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYW1lcmEsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGdldFZpZGVvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICAvL2dldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5PW51bGw7Ly8gcGVyZGVyaWEgbGEgdWx0aW1hIGluZm9ybWFjaW9uIHNpIGxvIHZ1ZWx2byBhIHJlZmVyZW5jaWFyO1xuICAgIC8vIFRPRE86ICBlc3RvIHNlIGRlYmUgZGUgbGxhbWFyIGRlbnRybyBkZSBsYSBtaXNtYSBmdW5jaW9uLCBwb3IgcXVlIHNpIGxvIGluaWNpYWxpemFtb3MgcG9yIGZ1ZXJhLCBlbCBwdWdpbiBubyBoYSBjYXJnYWRvIHkgb2J0ZW5nbyBjYW1lcmEgaXMgbm90IGRlZmluZWRcbiAgICAvLyB2YXIgX2dldEZpbGVFbnRyeSA9IGZ1bmN0aW9uICh2aWRlb0NvbnRlbnRQYXRoKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZyh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAvLyAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgLy8gICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCh2aWRlb0NvbnRlbnRQYXRoLCBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgLy8gICAgIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgIC8vICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIC8vIH07XG4gICAgLy8gVE9ETzogY3JlYXRlIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5IHkgLmZpbGUsIHBhcmEgZGV2b2x2ZXIgbGEgcHJvbWVzYSBzaW4gZGF0YSB5IHJlZmVyZW5jaWFyIGVsIGNvbnRyb2xhZG9yIGNvbiBsYSBwcm9waWVkYWQgZGVkbCBzZXJ2aWNpbyB0b2RkIG1vdFxuICAgIHZhciBfZ2V0VmlkZW9Db21wcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuU0FWRURQSE9UT0FMQlVNLFxuICAgICAgICBtZWRpYVR5cGU6IENhbWVyYS5NZWRpYVR5cGUuVklERU9cbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uICh2aWRlb0NvbnRlbnRQYXRoKSB7XG4gICAgICAgIC8vIHJldHVybiBfZ2V0RmlsZUVudHJ5KHZpZGVvQ29udGVudFBhdGgpO1xuICAgICAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZS5jaGVja0ZpbGUodmlkZW9Db250ZW50UGF0aCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZ2V0VmlkZW9Db21wcmVzcyA9IF9nZXRWaWRlb0NvbXByZXNzO1xuICAgIHJldHVybiBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZ3BzU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgZXJyb3JTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCBtb21lbnRTZXJ2aWNlLCAkcSwgaW50ZXJtZWRpYXRlU2VydmljZSwgc3FsaXRlU2VydmljZSkge1xuICB2YXIgZ3BzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9ncHNIdG1sUHJvbWlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIHZhciBvcHQgPSB7XG4gICAgICBtYXhpbXVtQWdlOiA5MDAwMCxcbiAgICAgIHRpbWVvdXQ6IDE1MDAwMCxcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgIH07XG4gICAgLy92YXIgb3B0PSB7IG1heGltdW1BZ2U6IDkwMDAwLCB0aW1lb3V0OiAzMDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUgfTsvL3RhbWJpZW4gc2UgcHJvYm8gY29uIDIyLCBwZXJvIHNlIGJhamEgaGFzdGEgMTNcbiAgICAvLyBjb25zb2xlLmxvZyhuYXZpZ2F0b3IsIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24pO1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKFwiZ3BzSHRtbFByb21pc2UgXCIsIHJlc3VsdClcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAvLyBBbiBlcnJvciBvY2N1cmVkLiBTaG93IGEgbWVzc2FnZSB0byB0aGUgdXNlclxuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7ICAvLyRzY29wZS5kaWFsb2coZXJyKTtcbiAgICB9LCBvcHQpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuICB2YXIgX2dwc0h0bWwgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgLy8gVE9ETzogYXVuIHNpbiB3aSBmaSBuaSBkYXRvcyBlbCBncHMgc2lndWUgZnVuY2lvbmFuZG9cbiAgICAvLyBUT0RPOiBwb3IgcXVlIG1lIGRpc3BhcmEgZWwgdmVudG8gZGUgb24gb25saW5lLCBtYXMgcXVlIHRvZG8gY29uIGVsIHdpZmk/Pz8/XG4gICAgaWYgKCEkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcyB8fCBtb21lbnRTZXJ2aWNlLmRpZmZOb3coJGxvY2FsU3RvcmFnZS5sYXRlc3RHcHMpID4gNykge1xuICAgICAgdmFyIG9wdCA9IHtcbiAgICAgICAgbWF4aW11bUFnZTogMzAwMCxcbiAgICAgICAgdGltZW91dDogMTUwMDAwLFxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICAgIH07XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgIF9pbnNlcnRHcHNMb2coaWRpbnNwZWNjaW9uLCBwb3NpdGlvbi5jb29yZHMpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvciwgb3B0KTtcbiAgICB9XG4gIH07XG4gIHZhciBfaW5zZXJ0R3BzTG9nID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgY29vcmRzKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtncHNMb2dzXSAoW2lkaW5zcGVjY2lvbl0gICAsW2ZlY2hhXSAsW2FjY3VyYWN5XSAgLFthbHRpdHVkZV0sICc7XG4gICAgcXVlcnkgKz0gJ1thbHRpdHVkZUFjY3VyYWN5XSAgLFtoZWFkaW5nXSAgLFtsYXRpdHVkZV0gLFtsb25naXR1ZGVdLFtzcGVlZF0pIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LD8pJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgIGNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgY29vcmRzLmhlYWRpbmcsXG4gICAgICBjb29yZHMubGF0aXR1ZGUsXG4gICAgICBjb29yZHMubG9uZ2l0dWRlLFxuICAgICAgY29vcmRzLnNwZWVkXG4gICAgXTtcbiAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcyA9IG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKTtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbFByb21pc2UgPSBfZ3BzSHRtbFByb21pc2U7XG4gIGdwc1NlcnZpY2VGYWN0b3J5Lmdwc0h0bWwgPSBfZ3BzSHRtbDtcbiAgcmV0dXJuIGdwc1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2ludGVybWVkaWF0ZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgaXNUYWtpbmdQaWM6IGZhbHNlLFxuICAgIGlzVGFraW5nVmlkOiBmYWxzZSxcbiAgICBuYXZCYXJTZWFyY2g6IGZhbHNlLFxuICAgIHBsYWNhOiBudWxsLFxuICAgIGlkaW5zcGVjY2lvblN5bmM6IGZhbHNlLFxuICAgIGlkaW5zcGVjY2lvbjogbnVsbFxuICB9O1xuICByZXR1cm4gaW50ZXJtZWRpYXRlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnbW9tZW50U2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgbW9tZW50U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9nZXREYXRlVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkRGF5cyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZEhvdXJzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZFNlY29uZHMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ3MnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9ydXRhU3J2ID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgZmlsZW5hbWUgPSBwYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgcnV0YSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS9NTU1NL0RELycpICsgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhICsgJy8nICsgZmlsZW5hbWU7XG4gICAgcmV0dXJuIHJ1dGE7XG4gIH07XG4gIHZhciBfZGlmZk5vdyA9IGZ1bmN0aW9uIChiLCB0aXBvKSB7XG4gICAgdmFyIHJ0YSA9IG1vbWVudCgpLmRpZmYobW9tZW50KGIpLCB0aXBvKTtcbiAgICBjb25zb2xlLmxvZyhydGEsICdkaWZmJyk7XG4gICAgcmV0dXJuIHJ0YTtcbiAgfTtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuZ2V0RGF0ZVRpbWUgPSBfZ2V0RGF0ZVRpbWU7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZERheXMgPSBfYWRkRGF5cztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkSG91cnMgPSBfYWRkSG91cnM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZFNlY29uZHMgPSBfYWRkU2Vjb25kcztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkucnV0YVNydiA9IF9ydXRhU3J2O1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5kaWZmTm93ID0gX2RpZmZOb3c7XG4gIHJldHVybiBtb21lbnRTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdvZmZsaW5lU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgb2ZmbGluZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge307XG4gIC8vIHZhciBfZm9jdXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgLy8gICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gIC8vICAgLy8gZS5nLiBjbGljayBldmVudHMgdGhhdCBuZWVkIHRvIHJ1biBiZWZvcmUgdGhlIGZvY3VzIG9yXG4gIC8vICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXG4gIC8vICAgLy8gYXJlIHRyaWdnZXJlZC5cbiAgLy8gICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gIC8vICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgLy8gICAgIGlmIChlbGVtZW50KSB7XG4gIC8vICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfTtcbiAgb2ZmbGluZVNlcnZpY2VGYWN0b3J5LmRhdGEub2ZmbGluZU1vZGUgPSBmYWxzZTtcbiAgcmV0dXJuIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdvbmxpbmVTdGF0dXNTZXJ2aWNlJywgW1xuICAnJHJvb3RTY29wZScsXG4gICckcScsXG4gICckaW5qZWN0b3InLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRjb3Jkb3ZhTmV0d29yaycsXG4gICckaW9uaWNQb3B1cCcsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgJGluamVjdG9yLCAkbG9jYXRpb24sICRjb3Jkb3ZhTmV0d29yaywgJGlvbmljUG9wdXAsIHp1bWVyb1NlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAgaXNPbmxpbmU6IGZhbHNlLFxuICAgICAgY29ublR5cGU6ICdub25lJ1xuICAgIH07XG4gICAgdmFyIF9pc09ubGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgfTtcbiAgICB2YXIgX3R5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9ICRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCk7XG4gICAgfTtcbiAgICB2YXIgX29uT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHJvb3RTY29wZS4kb24oJyRjb3Jkb3ZhTmV0d29yazpvbmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBuZXR3b3JrU3RhdGU7XG4gICAgICAgIC8vIFRPRE86IGV2YWx1YXIgdG9kYXMgbGFzIHBvc2liaWxpZGFkZXMgZGUgZXN0byBhY2EsIHBvciBxdWUgc2kgbGEgc2XDsWFsIGVzIG11eSBtYWxhIHF1ZSBwdWVkZSBwYXNhciwgYXVucXVlIGVsIHp5bmMgZGUgYmFzZXMgZGUgZGF0b3MgbnVuY2EgaGFzaWRvIG11eSBncmFuZGUgZW4gaW5mb3JtYWNpb25cbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpOyAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2UuY2FsbFp5bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyppZighc2lnbmFsU2VydmljZS5pc0luaXQpe1xuICAgICAgICAgICAgICAgICAgICBzaWduYWxTZXJ2aWNlLnN0YXJ0SHViKCk7XG5cbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckY29yZG92YU5ldHdvcms6c2lnbmFsJyx7J25ldHdvcmtTdGF0ZSc6bmV0d29ya1N0YXRlfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb25PZmZsaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gbGlzdGVuIGZvciBPZmZsaW5lIGV2ZW50XG4gICAgICAkcm9vdFNjb3BlLiRvbignJGNvcmRvdmFOZXR3b3JrOm9mZmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IGZhbHNlO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gZmFsc2U7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gbmV0d29ya1N0YXRlOyAgLyogaWYobmV0d29ya1N0YXRlID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmV0IERpc2Nvbm5lY3RlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJUaGUgaW50ZXJuZXQgaXMgZGlzY29ubmVjdGVkIG9uIHlvdXIgZGV2aWNlLlwiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLmV4aXRBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT25saW5lID0gX29uT25saW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT2ZmbGluZSA9IF9vbk9mZmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSBfaXNPbmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBfdHlwZTtcbiAgICByZXR1cm4gb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdwbGFjYXNTZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcm9vdFNjb3BlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnZGV2aWNlU2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndXBkYXRlU3luY1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHJvb3RTY29wZSwgbW9tZW50U2VydmljZSwgYXV0aFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVwZGF0ZVN5bmNTZXJ2aWNlKSB7XG4gICAgdmFyIHBsYWNhc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgdmFyIF9zZWxlY3RBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGVzdCA9IFt7XG4gICAgICAgICAgaWRpbnNwZWNjaW9uOiAxLFxuICAgICAgICAgIHBsYWNhOiAnYWJjMTExJ1xuICAgICAgICB9XTtcbiAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbC5wdXNoKHRlc3QpOyAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGxhY2FzID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaS5pZGluc3BlY2Npb24sIHBsYWNhLCBpLnN5bmMsICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICBjYXNlIHdoZW4gaXNzLmlkaW5zcGVjY2lvbiBpcyBudWxsIHRoZW4gMCBlbHNlIDEgZW5kIGFzIGNhbGlmaWNhZG8gJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgICAgZnJvbSBpZGluc3BlY2Npb24gaSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luIChzZWxlY3QgaWRpbnNwZWNjaW9uIGZyb20gIGlkc3VicHJvY2Vzb3NlZ3VpbWllbnRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgICAgICAgICAgd2hlcmUgaWRlc3RhZG89NDc3KSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICBpc3Mgb24gaXNzLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbic7XG4gICAgICBxdWVyeSArPSAnICAgICAgV0hFUkUgVXNlck5hbWU9PyBhbmQgZmVjaGE+ID8nO1xuICAgICAgcXVlcnkgKz0gJyBPcmRlciBieSBpLmlkaW5zcGVjY2lvbiBERVNDIExpbWl0IDEwJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgX2luc2VydERldmljZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gdmFyIF91cGRhdGVTeW5jID0gZnVuY3Rpb24gKHBsYWNhLCBzeW5jKSB7XG4gICAgLy8gICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICAvLyAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgLy8gICB2YXIgYmluZGluZyA9IFtcbiAgICAvLyAgICAgc3luYyxcbiAgICAvLyAgICAgcGxhY2EsXG4gICAgLy8gICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgIC8vICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgLy8gICBdO1xuICAgIC8vICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgLy8gfTtcbiAgICB2YXIgX2luc2VydFBMYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gaWRpbnNwZWNjaW9uKHBsYWNhLCBmZWNoYSxVc2VyTmFtZSx1dWlkLCBzeW5jKSBWQUxVRVMgKD8sPyw/LD8sID8pJztcbiAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgIC8vIDAgbWVhbnMgZmFsc2VcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIHN5bmNcbiAgICAgIF07XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EgPSBwbGFjYTtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gZmFsc2U7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyByZXR1cm4gX2dldFBsYWNhcygpOyAgLy8gcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbC5wdXNoKHtcbiAgICAgICAgLy8gICBwbGFjYTogcGxhY2EsXG4gICAgICAgIC8vICAgaWRpbnNwZWNjaW9uOiByZXMuaW5zZXJ0SWRcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSByZXMuaW5zZXJ0SWQ7XG4gICAgICAgIC8qIHJldHVybiB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZVN5bmNTZXJ2aWNlLnNlbGVjdElkaW5zcGVjY2lvblN5bmMocGxhY2EpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9nZXRQbGFjYXMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBvbiB6dW1lcm8gc3luYyBkZXNkZSBwcycpO1xuICAgICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICAgIH0pOyovXG4gICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnREZXZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIE9SIElHTk9SRSBJTlRPIFtkZXZpY2VzXShbdXVpZF0sW21vZGVsXSkgIFZBTFVFUyg/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLm1vZGVsXG4gICAgICBdO1xuICAgICAgc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0IGRldmljZScsIHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcGxhY2FzU2VydmljZUZhY3Rvcnkuc2VsZWN0QWxsID0gX3NlbGVjdEFsbDtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5nZXRQbGFjYXMgPSBfZ2V0UGxhY2FzO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydFBMYWNhID0gX2luc2VydFBMYWNhO1xuICAgIC8vIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydERldmljZSA9IF9pbnNlcnREZXZpY2U7XG4gICAgcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnc3FsaXRlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhU1FMaXRlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhU1FMaXRlKSB7XG4gICAgdmFyIHNxbGl0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9leGVjdXRlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnksIGJpbmRpbmcpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uIChxdWVyeSwgYmluZGluZ3MpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5pbnNlcnRDb2xsZWN0aW9uKGRiLCBxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkFycmF5ID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICBpZiAocmVzLnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChyZXMucm93cy5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBUT0RPOiBzaSB5byBjYW1iaW8gZWwgdGlwbyBkZSBkYXRvIGRlIHVuYSBjb2x1bW5hLCBlamVtcGxvIHN0cmluZyB0byBpbnQsIGRlYm8gcmVlc3RhYmxlY2VyIGxhIGJhc2UgZGUgZGF0b3MgenVtZXJvLCBwYXJhIGFncmVnYXIgdW5hIGNvbHVtbmEgbm8gdGVuZ28gcHJvYmxlbWFcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5leGVjdXRlUXVlcnkgPSBfZXhlY3V0ZVF1ZXJ5O1xuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5Lmluc2VydENvbGxlY3Rpb24gPSBfaW5zZXJ0Q29sbGVjdGlvbjtcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5ydG5BcnJheSA9IF9ydG5BcnJheTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd0aXRsZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIHRpdGxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdGl0bGVTZXJ2aWNlRmFjdG9yeS50aXRsZSA9ICcnO1xuICByZXR1cm4gdGl0bGVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd0b2FzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJGNvcmRvdmFUb2FzdCkge1xuICB2YXIgdG9hc3RTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3Nob3dMb25nQm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dMb25nQm90dG9tKG1zZyk7XG4gIH07XG4gIHZhciBfc2hvd1Nob3J0Qm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShtc2cpO1xuICB9O1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dMb25nQm90dG9tID0gX3Nob3dMb25nQm90dG9tO1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dTaG9ydEJvdHRvbSA9IF9zaG93U2hvcnRCb3R0b207XG4gIHJldHVybiB0b2FzdFNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3Vuc3luY1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGVycm9yU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIGZvdG9zU2VydmljZSwgenVtZXJvU2VydmljZSwgJHJvb3RTY29wZSkge1xuICB2YXIgdW5zeW5jU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gW107XG4gIHZhciBfZ2V0SW1nVW5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICAgIGlkZm90bywgaS5pZGluc3BlY2Npb24sIHBhdGgsIGYuc3luYywgIGkucGxhY2EsIGYucnV0YVNydiAnO1xuICAgIHF1ZXJ5ICs9ICdGUk9NICAgICAgaWRpbnNwZWNjaW9uIGkgICAgaW5uZXIgam9pbiAgaWRmb3RvcyBmIG9uIGkuaWRpbnNwZWNjaW9uID0gZi5pZGluc3BlY2Npb24gJztcbiAgICBxdWVyeSArPSAnV0hFUkUgICAgaS51c2VyTmFtZSA9ID8gQU5EICBpLmZlY2hhPj8gQU5EIChmLnN5bmMgPSAwKSBBTkQgKGRlbGV0ZWQgPSAwKSAnO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmxlbmd0aDtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgdmFyIF9zeW5jSW1hZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIF9nZXRJbWdVbnN5bmMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPCAxKSB7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYW5ndWxhci5mb3JFYWNoKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIF9wcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIF9wcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAvLyBUT0RPOiB5YSBub2UgcyBuZWNlc2FyaW8gcG9yIHF1ZSBvZmZsaW5lIHRhbWJpZW4gZXN0YSBlbiBvbmxpbG5lc3RhdHVzc3JlcnZpY2VcbiAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgdmFyIF91cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICBfdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICB9O1xuICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgLy8gaWYgKHMubWFzc2l2ZVVwbG9hZCkge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoIC0gMTtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIH1cbiAgICAgIC8vIF9maWx0ZXJVbnN5bmMoMCk7ICAgICAgICAgIFxuICAgICAgY29uc29sZS5sb2codW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoLCAnc3luYycpO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgenVtZXJvU2VydmljZS56eW5jKDApLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ215RXZlbnQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5nZXRJbWdVbnN5bmMgPSBfZ2V0SW1nVW5zeW5jO1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5zeW5jSW1hZ2VzID0gX3N5bmNJbWFnZXM7XG4gIHJldHVybiB1bnN5bmNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd1cGRhdGVTeW5jU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3VwZGF0ZVN5bmMgPSBmdW5jdGlvbiAocGxhY2EsIHN5bmMpIHtcbiAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgc3luYyxcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICB9O1xuICB2YXIgX3NlbGVjdElkaW5zcGVjY2lvblN5bmMgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkaW5zcGVjY2lvbiBmcm9tIGlkaW5zcGVjY2lvbiAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+PyBPcmRlciBieSBpZGluc3BlY2Npb24gREVTQyBMaW1pdCAxJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGluc3BlY2Npb247XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IHRydWU7XG4gICAgICByZXR1cm4gX3VwZGF0ZVN5bmMocGxhY2EsIHRydWUpO1xuICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlLCAnZXJyb3InKTtcbiAgICB9KTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAgICAgIC8vIH0pO1xuICB9O1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3RvcnkudXBkYXRlU3luYyA9IF91cGRhdGVTeW5jO1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyA9IF9zZWxlY3RJZGluc3BlY2Npb25TeW5jO1xuICAvLyB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc3luY0ltYWdlcyA9IF9zeW5jSW1hZ2VzO1xuICByZXR1cm4gdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3ZpZGVvU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FwdHVyZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhcHR1cmUsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UpIHtcbiAgICB2YXIgdmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gW107XG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3M7XG4gICAgfTtcbiAgICB2YXIgX3Rha2VkVmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGxpbWl0OiAxLFxuICAgICAgICBkdXJhdGlvbjogMTJcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYXB0dXJlLmNhcHR1cmVWaWRlbyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvRGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRWaWRlb3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZFZpZGVvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0VmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCB0aHVtYm5haWwsIG9uVXBsb2FkKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gaWRWaWRlb3MoaWRpbnNwZWNjaW9uLCBwYXRoLHN5bmMsdXVpZCx0aHVtYm5haWwsIG9uVXBsb2FkLCBwbGFjYSwgZmVjaGEsIHJ1dGFTcnYgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyknO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZGluc3BlY2Npb24sXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aClcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlVmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkVmlkZW9zIHNldCBzeW5jPT8gLCBvblVwbG9hZD0gPyBXSEVSRSBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuYWxsID0gX2FsbDtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnRha2VkVmlkID0gX3Rha2VkVmlkO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuZ2V0VmlkZW9zID0gX2dldFZpZGVvcztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5Lmluc2VydFZpZGVvID0gX2luc2VydFZpZGVvO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudXBkYXRlVmlkZW8gPSBfdXBkYXRlVmlkZW87XG4gICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLCBbXG4gICckcScsXG4gIGZ1bmN0aW9uICgkcSkge1xuICAgIHZhciB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9nZW5lcmF0ZVRodW1ibmFpbCA9IGZ1bmN0aW9uIChuYXRpdmVVUkwpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgbmFtZSA9IG5hdGl2ZVVSTC5zbGljZSgwLCAtNCk7XG4gICAgICB3aW5kb3cuUEtWaWRlb1RodW1ibmFpbC5jcmVhdGVUaHVtYm5haWwobmF0aXZlVVJMLCBuYW1lICsgJy5wbmcnLCBmdW5jdGlvbiAocHJldlN1Y2MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocHJldlN1Y2MpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByZXZTdWNjKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBnZW5lcm5hZG8gdGh1bWJuYWlsJywgZSk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5LmdlbmVyYXRlVGh1bWJuYWlsID0gX2dlbmVyYXRlVGh1bWJuYWlsO1xuICAgIHJldHVybiB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnenVtZXJvU2VydmljZScsIFtcbiAgJyRxJyxcbiAgJyRjb3Jkb3ZhRGV2aWNlJyxcbiAgJyRjb3Jkb3ZhU1FMaXRlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndXBkYXRlU3luY1NlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJyR0aW1lb3V0JyxcbiAgLy8gJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHEsICRjb3Jkb3ZhRGV2aWNlLCAkY29yZG92YVNRTGl0ZSwgb2ZmbGluZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVwZGF0ZVN5bmNTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsICR0aW1lb3V0KSB7XG4gICAgdmFyIHp1bWVybyA9IG51bGw7XG4gICAgdmFyIHp1bWVyb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9zZXREYlBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX29wdGlvbnMgPSB7XG4gICAgICAgIEFuZHJvaWQ6ICcvZGF0YS9kYXRhLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5wYWNrYWdlTmFtZSArICcvZGF0YWJhc2VzLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgaU9TOiAnY2R2ZmlsZTovL2xvY2FsaG9zdC9wZXJzaXN0ZW50LycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgd2luMzJudDogJy8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGVcbiAgICAgIH07XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYnBhdGggPSBfb3B0aW9uc1skY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpXTtcbiAgICB9O1xuICAgIHZhciBfc2V0WnVtZXJvID0gZnVuY3Rpb24gKGRiZmlsZSkge1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlID0gZGJmaWxlO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUgPSB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUgKyAnLmRiJztcbiAgICAgIC8vb3BlbiBkYiBjb24gc3FsaXRlcGx1Z2luIGJyb2R5XG4gICAgICBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQih6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSwgMSk7XG4gICAgICB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgICAgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzODo4MDgwLyc7XG4gICAgICAvLydodHRwOi8vMTkyLjE2OC4wLjUxOjgwODAvJztcbiAgICAgIC8vIFRPRE86IERFUEVOREUgU0kgRVNUT1kgRU4gTUkgQ0FTQSBPIEVOIExBIE9GSUNJTkEnaHR0cDovLzE5Mi4xNjguMS4xMzo4MDgwLyc7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5wYWNrYWdlTmFtZSA9ICdjb20uYWp1c3Rldi5iJztcbiAgICAgIF9zZXREYlBhdGgoKTtcbiAgICB9O1xuICAgIC8vIFRPRE86ICByZWNvcmRhciBrIGVzdG8gZXMgdW5hIHByb21lc2EgeSBkZXNlbmNhZGVuYSBhY2Npb25lcywgc2kgZXMgcmVzdWVsdGEgbyBzaSBlcyByZWplY3QgLCB2YWxsaWRhclxuICAgIHZhciBfenluYyA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAvLyBUT0RPOiBhYnJpcmkgZWwgcHVlcnRvIHBhcmEgenVtZXJvIGVuIGVsIGZpcmV3YWxsXG4gICAgICAvLyBUT0RPOiBjcmVhciB1bmEgc2VydmljaW8gZ2xvYmFsIHBhcmEgZGUgYWhpIHNhY2FyIGVsIGlkaW5zcGVjY2lvbiBhY3R1YWwsIGluY3VzaXZlIGRlc3B1ZXMgZGUgdW4genluYyBwYXJhIHNhYmVyIHF1ZSBlcyBlbCBhZGVjdWFkb1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgLy8gfHwgIW9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgICAvLyBUT0RPOiBtZSBwYXJlY2UgbWFzIGxvZ2ljbyByZXRvcm5hciB1biByZWplY3Qgc2kgZXN0YSBlbiBtb2RvIG9mZmxpbmVcbiAgICAgICAgcS5yZWplY3QoJ29mZmxpbmVNb2RlIG8gc2luIGNvbmV4aW9uJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvZmZsaW5lIG1vZGUgYWN0aXZhZG8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUudGltZSgnenluYycgKyBpKTtcbiAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3NpbmNyb25pemFuZG8uLicpO1xuICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgenVtZXJvLnN5bmMoenVtZXJvU2VydmljZUZhY3RvcnkuZGJwYXRoLCAnJywgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyLCB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2snKTtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3p5bmMnICsgaSk7XG4gICAgICAgICAgaWYgKCFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyAmJiBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICAvLyB1cGRhdGVTeW5jU2VydmljZS51cGRhdGVTeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgdHJ1ZSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgICAgfSk7ICAvLyB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0NTYpIHtcbiAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICB9O1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNldFp1bWVybyA9IF9zZXRadW1lcm87XG4gICAgenVtZXJvU2VydmljZUZhY3RvcnkuenluYyA9IF96eW5jO1xuICAgIHJldHVybiB6dW1lcm9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9