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
        templateUrl: 'js/placas/placas.html',
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
  }).state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'js/settings/settings.html',
        controller: 'Settings  as St'  // ,
                           // controllerAs: 'vm'
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
      // console.log(event, toState, toParams, fromState, fromParams);
      var authData = localStorageService.get('authorizationData');
      if (toState.name === 'app.login') {
        // doe she/he try to go to login? - let him/her go
        return;
      }
      // console.log(authData, momentService.diffNow(authData.exp, 'm'), '> -60');
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
            // console.log(checkFileService.fileEntry, checkFileService.file);
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
        // console.log(placasServiceFactory.all);
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
(function () {
  angular.module('starter').factory('dltFileSrv', dltFileSrv);
  dltFileSrv.$inject = ['$cordovaFile'];
  function dltFileSrv($cordovaFile) {
    var dltFileFac = { dltImg: dltImg };
    return dltFileFac;
    // body...
    function dltImg(fullPath) {
      var FileName = fullPath.replace(/^.*[\\\/]/, '');
      var path = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
      return $cordovaFile.removeFile(path, FileName);  // body...
    }
  }
}());
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
(function () {
  angular.module('starter').controller('Settings', Settings);
  Settings.inject = [
    '$log',
    'settingsSrv',
    'errorService'
  ];
  function Settings($log, settingsSrv, errorService) {
    var vm = this;
    vm.deleteImgs = deleteImgs;
    vm.pics = [];
    activate();
    function activate() {
      settingsSrv.getImg2Dlt().then(selectOk).catch(errorService.consoleError);
    }
    function selectOk() {
      vm.pics = settingsSrv.pics;
      $log.debug('select ok');  // body...
    }
    function deleteImgs() {
      if (vm.pics.length) {
        $log.debug('deleteImgs');
        settingsSrv.dltImgs().then(activate).catch(errorService.consoleError);
      }
    }
  }
}());
(function () {
  angular.module('starter').factory('settingsSrv', settingsSrv);
  settingsSrv.$inject = [
    'intermediateService',
    'sqliteService',
    'momentService',
    'authService',
    'toastService',
    'deviceService',
    'dltFileSrv',
    'errorService',
    '$log',
    '$q'
  ];
  function settingsSrv(intermediateService, sqliteService, momentService, authService, toastService, deviceService, dltFileSrv, errorService, $log, $q) {
    var stFactory = {
      pics: [],
      getImg2Dlt: getImg2Dlt,
      dltImgs: dltImgs
    };
    return stFactory;
    function getImg2Dlt() {
      var query = 'SELECT   f.idfoto, f.path ';
      query += 'FROM  idinspeccion id ';
      query += 'inner join idfotos f on f.idinspeccion=id.idinspeccion ';
      query += 'WHERE     id.uuid = ? AND id.UserName = ?  ';
      query += 'and f.sync=1 ';
      query += 'and f.deleted=0 ';
      query += 'and id.fecha< ? ORDER BY f.idfoto DESC ';
      var binding = [
        deviceService.data.uuid,
        authService.authentication.userName,
        momentService.addDays(+1)  // -2
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        stFactory.pics = sqliteService.rtnArray(res);  /* console.log(array);
        if (array.length) {
          dltImgs(array);
        }*/
      }, function (error) {
        console.log(error);
      });
    }
    function dltImgs() {
      toastService.showShortBottom('Eliminando Fotos');
      var query = 'UPDATE [idfotos]SET [deleted] = 1  WHERE idfoto=?';
      var bindings = [];
      var qArray = [];
      angular.forEach(stFactory.pics, function (obj, key) {
        /*qArray.push(
          dltFileSrv.dltImg(obj.path).then(function () {
          var binding = [];
          binding.push(obj.idfoto);
          bindings.push(binding);
        })
          .catch(errorService.consoleError)
          ); */
        var binding = [];
        binding.push(obj.idfoto);
        bindings.push(binding);
        /*  (function insertOne() {
          var q = $q.defer();
          try {
            dltFileSrv.dltImg(obj.path).then(function () {
              q.resolve();
            }, function (err) {
              if (err.code !== 1) {
                q.reject(error);
                return;
              }
              q.resolve();
            });
          } catch (exception) {
            q.reject(exception);
          }
          qArray.push(q.promise);
        }());*/
        qArray.push(iifeDlt(obj.path));
      });

      return preUpdateCollection (qArray, query,  bindings)
     /* return $q.all(qArray).then(function () {
        if (bindings.length) {
          return updateCollection(bindings).then(updOk).catch(errorService.consoleError);
        }
      }).catch(errorService.consoleError)*/;
    }
    /*   function insertBinding (idfoto) {
      var binding=[]
      binding.push(idfoto);
      bindings.push(binding);
      
    }*/
    //TODO: ejemplo traido de insertcollection fom ngcordova
    function iifeDlt(path) {
      // return function insertOne() {
      var q = $q.defer();
      try {
        dltFileSrv.dltImg(path).then(function () {
          q.resolve();
        }, function (err) {
          if (err.code !== 1) {
            q.reject(error);
            return;
          }
          q.resolve();
        });
      } catch (exception) {
        q.reject(exception);
      }
      return q.promise;  // }();
    }

    function preUpdateCollection (qArray, query,  bindings) {
       return $q.all(qArray).then(function () {
        if (bindings.length) {
          return updateCollection(query,bindings).then(updOk).catch(errorService.consoleError);
        }
      }).catch(errorService.consoleError)
    }
    function updateCollection(query, bindings) {
      $log.debug(bindings);      
      return sqliteService.insertCollection(query, bindings);  // body...
    }
    function updOk() {
      $log.debug('upd collection ok');
    }
  }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiRm90b3MvRm90b0NvbnRyb2xsZXIuanMiLCJGb3Rvcy9mb3Rvc1NlcnZpY2UuanMiLCJGb3Rvcy9ydG5GaW5kLmpzIiwiY29kRmFzL0NvZEZhcy5qcyIsImNvZEZhcy9jb2RmYXNTcnYuanMiLCJjb250cm9sbGVycy9BY2Nlc29yaW9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9WaWRlb0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJpbnNwZWNjaW9uL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiaW5zcGVjY2lvbi9pbnNwZWNjaW9uU2VydmljZS5qcyIsInBsYWNhcy9QbGFjYXNDb250cm9sbGVyLmpzIiwicGxhY2FzL3BsYWNhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZGx0RmlsZS5qcyIsInNlcnZpY2VzL2Vhc3lEaXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZXJyb3JTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlsZVRyYW5zZmVyU2VydmljZS5qcyIsInNlcnZpY2VzL2ZpcnN0SW5pdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9mb2N1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9nZXRWaWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9ncHNTZXJ2aWNlLmpzIiwic2VydmljZXMvaW50ZXJtZWRpYXRlU2VydmljZS5qcyIsInNlcnZpY2VzL21vbWVudFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vZmZsaW5lU2VydmljZS5qcyIsInNlcnZpY2VzL29ubGluZVN0YXR1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9zcWxpdGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdGl0bGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvdW5zeW5jU2VydmljZS5qcyIsInNlcnZpY2VzL3VwZGF0ZVN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9TZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmpzIiwic2VydmljZXMvenVtZXJvU2VydmljZS5qcyIsInNldHRpbmdzL1NldHRpbmdzLmpzIiwic2V0dGluZ3Mvc2V0dGluZ3NTcnYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDblJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDclNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4vLyB2YXIgbHMgPSBudWxsO1xuLy8gdmFyIHp1bWVybyA9IG51bGw7XG4vLyB2YXIgY3MgPSBudWxsO1xuLy8gdmFyIHpzID0gbnVsbDtcbi8vIHZhciBwcyA9IG51bGw7XG4vLyB2YXIgcGMgPSBudWxsO1xuLy8gdmFyIGNmID0gbnVsbDtcbi8vIHZhciBlZCA9IG51bGw7XG4vLyB2YXIgY2MgPSBudWxsO1xuLy8gcHJ1ZWJhcyBsb2NhbGVzXG52YXIgZGIgPSBudWxsO1xuLy8gdmFyIHNlcnZpY2VzID0ge307XG4vLyB2YXIgbmdDb3Jkb3ZhID0ge307XG4vLyB2YXIgYWxyZWFkeUluc3BlY3QgPSBmYWxzZTtcbi8vIHZhciBycCA9IG51bGw7XG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbXG4gICdpb25pYycsXG4gICdzdGFydGVyLmNvbnRyb2xsZXJzJyxcbiAgJ25nU3RvcmFnZScsXG4gICduZ0NvcmRvdmEnLFxuICAndWkudXRpbHMnLFxuICAnbmdGeCcsXG4gICduZ0FuaW1hdGUnLFxuICAnYW5ndWxhci1sb2FkaW5nLWJhcicsXG4gICdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsIGNmcExvYWRpbmdCYXJQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yU2VydmljZScpO1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgIHVybDogJy9hcHAnLFxuICAgIGFic3RyYWN0OiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FwcEN0cmwnXG4gIH0pLnN0YXRlKCdhcHAuc2VhcmNoJywge1xuICAgIHVybDogJy9zZWFyY2gnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvc2VhcmNoLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLmJyb3dzZScsIHtcbiAgICB1cmw6ICcvYnJvd3NlJyxcbiAgICB2aWV3czogeyAnbWVudUNvbnRlbnQnOiB7IHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2Jyb3dzZS5odG1sJyB9IH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGF5bGlzdHMnLCB7XG4gICAgdXJsOiAnL3BsYXlsaXN0cycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxheWxpc3RzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAucGxhY2FzJywge1xuICAgIHVybDogJy9wbGFjYXMnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcGxhY2FzL3BsYWNhcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYWNhc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnNpbmdsZScsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzLzpwbGF5bGlzdElkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYXlsaXN0Q3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuZm90bycsIHtcbiAgICB1cmw6ICcvZm90b3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL0ZvdG9zL2ZvdG8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3RvQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAudmlkZW8nLCB7XG4gICAgdXJsOiAnL3ZpZGVvLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdmlkZW8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWaWRlb0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgdXJsOiAnL2luc3BlY2Npb24vOmlkLzpwbGFjYS86Y2FsaWZpY2FkbycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9pbnNwZWNjaW9uL2luc3BlY2Npb24uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbnNwZWNjaW9uQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XG4gICAgdXJsOiAnL3NldHRpbmdzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3NldHRpbmdzL3NldHRpbmdzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3MgIGFzIFN0JyAgLy8gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udHJvbGxlckFzOiAndm0nXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmNvZEZhcycsIHtcbiAgICB1cmw6ICcvY29kZmFzLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb2RGYXMvY29kZmFzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ29kRmFzIGFzIHZtJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luSW9uaWMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmFjY2Vzb3Jpb3MnLCB7XG4gICAgdXJsOiAnL2FjY2Vzb3Jpb3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY2Nlc29yaW9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWNjZXNvcmlvc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9sb2dpbicpO1xuICAvLyBUT0RPOiBwYXJhIHF1ZSBzZSBjb25zaWRlcmVuIHNhbmFzIGxhcyBuZy1zcmMgcXVlIHRlbmdhbiBlc3RhIHNpbnRheGlzO1xuICAkY29tcGlsZVByb3ZpZGVyLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZpbGV8YmxvYnxjZHZmaWxlfGNvbnRlbnQpOnxkYXRhOmltYWdlXFwvLyk7XG4gICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZCh0cnVlKTtcbn0pO1xudmFyIHNlcnZpY2VCYXNlID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLyc7XG5hcHAuY29uc3RhbnQoJ25nQXV0aFNldHRpbmdzJywge1xuICBhcGlTZXJ2aWNlQmFzZVVyaTogc2VydmljZUJhc2UsXG4gIGNsaWVudElkOiAnbmdBdXRoQXBwJ1xufSkuY29uZmlnKGZ1bmN0aW9uICgkcHJvdmlkZSkge1xuICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRleGNlcHRpb25IYW5kbGVyJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSwgJGluamVjdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleGNlcHRpb24sIGNhdXNlKSB7XG4gICAgICAkZGVsZWdhdGUoZXhjZXB0aW9uLCBjYXVzZSk7XG4gICAgICBpZiAoZGIpIHtcbiAgICAgICAgdmFyIHNxbGl0ZVNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdzcWxpdGVTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBtb21lbnRTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnbW9tZW50U2VydmljZScpO1xuICAgICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUICBJTlRPIFtsb2dzXShbZXhdLFtlbWFpbF0sW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyknO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgICBhbmd1bGFyLnRvSnNvbihleGNlcHRpb24pLFxuICAgICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lIHx8ICcnLFxuICAgICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgICBdO1xuICAgICAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH0pICAvLyB2YXIgYWxlcnRpbmcgPSAkaW5qZWN0b3IuZ2V0KFwiYWxlcnRpbmdcIik7XG4gICAgICAgICAgICAvLyBhbGVydGluZy5hZGREYW5nZXIoZXhjZXB0aW9uLm1lc3NhZ2UpO1xuO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufSkucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkdGltZW91dCwgJGlvbmljUGxhdGZvcm0sICRsb2NhbFN0b3JhZ2UsICRjb3Jkb3ZhU1FMaXRlLCBjaGVja0ZpbGVTZXJ2aWNlLCB2aWRlb1RodW1ibmFpbFNlcnZpY2UsICRjb3Jkb3ZhQ2FtZXJhLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCAkY29yZG92YUZpbGUsIGVhc3lEaXJTZXJ2aWNlLCBnZXRWaWRlb1NlcnZpY2UsIGNvcHlGaWxlU2VydmljZSwgYWNjZXNvcmlvc1NlcnZpY2UsIGluc3BlY2Npb25TZXJ2aWNlLCBwbGFjYXNTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBjb3Jkb3ZhRXZlbnRzU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgbW9tZW50U2VydmljZSwgZmlyc3RJbml0U2VydmljZSwgYXV0aFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIGxvY2FsU3RvcmFnZVNlcnZpY2UsICRzdGF0ZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdW5zeW5jU2VydmljZSwgZm90b3NTZXJ2aWNlLCBncHNTZXJ2aWNlKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xuICAgIH1cbiAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTtcbiAgICAvLyAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXh0LCBjdXJyZW50KTtcbiAgICAvLyB9KTtcbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKHRvU3RhdGUubmFtZSA9PT0gJ2FwcC5sb2dpbicpIHtcbiAgICAgICAgLy8gZG9lIHNoZS9oZSB0cnkgdG8gZ28gdG8gbG9naW4/IC0gbGV0IGhpbS9oZXIgZ29cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coYXV0aERhdGEsIG1vbWVudFNlcnZpY2UuZGlmZk5vdyhhdXRoRGF0YS5leHAsICdtJyksICc+IC02MCcpO1xuICAgICAgaWYgKCFhdXRoRGF0YSB8fCBtb21lbnRTZXJ2aWNlLmRpZmZOb3coYXV0aERhdGEuZXhwLCAnbScpID4gLTYwKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVkaXJlY3QnKTtcbiAgICAgICAgICAvL1dhcyBjYWxsaW5nIHRoaXMgYnV0IGNvbW1lbnRpbmcgb3V0IHRvIGtlZXAgaXQgc2ltcGxlOiBhdXRoU2VydmljZS5yZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAvL0NoYW5nZXMgVVJMIGJ1dCBub3QgdGhlIHZpZXcgLSBnb2VzIHRvIG9yaWdpbmFsIHZpZXcgdGhhdCBJJ20gdHJ5aW5nIHRvIHJlZGlyZWN0XG4gICAgICAgICAgLy9hd2F5IGZyb20gbm93IHdpdGggMS4zLiBGaW5lIHdpdGggaXQgYnV0IGludGVyZXN0ZWQgaW4gdW5kZXJzdGFuZGluZyB0aGUgXG4gICAgICAgICAgLy9cInByb3BlclwiIHdheSB0byBkbyBpdCBub3cgc28gbG9naW4gdmlldyBnZXRzIHJlZGlyZWN0ZWQgdG8uXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTsgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy9OaWNlIGFkZGl0aW9uISBDYW4ndCBkbyBhbnkgcmVkaXJlY3Qgd2hlbiBpdCdzIGNhbGxlZCB0aG91Z2hcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gbHMgPSAkbG9jYWxTdG9yYWdlO1xuICAgIC8vIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZSA9IHp1bWVyb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZ2V0VmlkZW9TZXJ2aWNlID0gZ2V0VmlkZW9TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmNvcHlGaWxlU2VydmljZSA9IGNvcHlGaWxlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5maWxlVHJhbnNmZXJTZXJ2aWNlID0gZmlsZVRyYW5zZmVyU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy52aWRlb1RodW1ibmFpbFNlcnZpY2UgPSB2aWRlb1RodW1ibmFpbFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZWFzeURpclNlcnZpY2UgPSBlYXN5RGlyU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5jaGVja0ZpbGVTZXJ2aWNlID0gY2hlY2tGaWxlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5hY2Nlc29yaW9zU2VydmljZSA9IGFjY2Vzb3Jpb3NTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmluc3BlY2Npb25TZXJ2aWNlID0gaW5zcGVjY2lvblNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMudW5zeW5jU2VydmljZSA9IHVuc3luY1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMucGxhY2FzU2VydmljZSA9IHBsYWNhc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMub25saW5lU3RhdHVzU2VydmljZSA9IG9ubGluZVN0YXR1c1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuY29yZG92YUV2ZW50c1NlcnZpY2UgPSBjb3Jkb3ZhRXZlbnRzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy50b2FzdFNlcnZpY2UgPSB0b2FzdFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMub2ZmbGluZVNlcnZpY2UgPSBvZmZsaW5lU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5sb2NhbFN0b3JhZ2UgPSAkbG9jYWxTdG9yYWdlO1xuICAgIC8vIHNlcnZpY2VzLmZpcnN0SW5pdFNlcnZpY2UgPSBmaXJzdEluaXRTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLm1vbWVudFNlcnZpY2UgPSBtb21lbnRTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZGV2aWNlU2VydmljZSA9IGRldmljZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuaW50ZXJtZWRpYXRlU2VydmljZSA9IGludGVybWVkaWF0ZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZm90b3NTZXJ2aWNlID0gZm90b3NTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmdwc1NlcnZpY2UgPSBncHNTZXJ2aWNlO1xuICAgIC8vIG5nQ29yZG92YS5jb3Jkb3ZhU1FMaXRlID0gJGNvcmRvdmFTUUxpdGU7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFGaWxlID0gJGNvcmRvdmFGaWxlO1xuICAgIC8vIG5nQ29yZG92YS5jb3Jkb3ZhQ2FtZXJhID0gJGNvcmRvdmFDYW1lcmE7XG4gICAgLy8genMgPSB6dW1lcm9TZXJ2aWNlO1xuICAgIC8vIGNzID0gO1xuICAgIC8vIGNmID0gO1xuICAgIC8vIGVkID0gZWFzeURpclNlcnZpY2U7XG4gICAgLy8gZGIgPSAkY29yZG92YVNRTGl0ZS5vcGVuREIoJ3pkYmZpbGUuZGInLCAxKTtcbiAgICAvLyBjYyA9ICRjb3Jkb3ZhQ2FtZXJhO1xuICAgIC8vIGNjID0gZ2V0VmlkZW9TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6ZGJmaWxlJyk7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZS5zZXRadW1lcm8oJ3p1bWVyb3Rlc3RkYmZpbGUnKTtcbiAgICB6dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnenVtZXJvdGVzdGRiZmlsZScpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PbmxpbmUoKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLm9uT2ZmbGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUoKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLmNvbm5UeXBlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25QYXVzZSgpO1xuICAgIGNvcmRvdmFFdmVudHNTZXJ2aWNlLm9uUmVzdW1lKCk7XG4gICAgZGV2aWNlU2VydmljZS5zZXRJbmZvKCk7XG4gICAgLy8gVE9ETzogIHZlcmlmaWNhciBzaSBleGlzdGUgZW4gZWwgbG9jYWxzdG9yYWdlIGFsZ3VuYSBiYW5kZXJhIHF1ZSBkaWdhIHNpIHlhIHNlIHN5bmMgYWxndW5hIHZleiBcbiAgICAkbG9jYWxTdG9yYWdlLm1lc3NhZ2UgPSAnSGVsbG8gV29ybGQnO1xuICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpOyAgLy8gdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoIWF1dGhEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhuLmRpZmYoZSwgJ3NlY29uZHMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4gdGVzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgfSk7XG59KTsgIC8vIGFwcC5ydW4oW1xuICAgICAvLyAgICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgICAgLy8gICAnJGxvY2F0aW9uJyxcbiAgICAgLy8gICBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSwgJGxvY2F0aW9uKSB7XG4gICAgIC8vICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgLy8gICAgIGlmICghYXV0aERhdGEpIHtcbiAgICAgLy8gICAgICAgY29uc29sZS5sb2coJ3Rva2VuIHJlZGlyZWN0IGxvZ2luJyk7XG4gICAgIC8vICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgIC8vICAgICAgIC8vIFRPRE86IGVzdG8gbm8gZXMgbmVjZXNhcmlvLCBwb3IgcXVlIGFsIGludGVudGFyIHNpbmNyb25pemFyIHVuYSBpbWFnZW4geSBlbCB0b2tlbiBlc3RhIHZlbmNpZG8sIHNlIHJlZGlyZWNjaW9uYSBhIGxvZ2luIGF1dG9tYXRpY2FtZW50ZVxuICAgICAvLyAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAvLyAgICAgICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZyhuLmRpZmYoZSwgJ3NlY29uZHMnKSk7XG4gICAgIC8vICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA+IDApIHtcbiAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgIC8vICAgICAgIH1cbiAgICAgLy8gICAgIH1cbiAgICAgLy8gICB9XG4gICAgIC8vIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLCBbXSkuY29udHJvbGxlcignQXBwQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY01vZGFsLCAkdGltZW91dCkge1xuICAvLyBGb3JtIGRhdGEgZm9yIHRoZSBsb2dpbiBtb2RhbFxuICAkc2NvcGUubG9naW5EYXRhID0ge307XG4gIC8vIENyZWF0ZSB0aGUgbG9naW4gbW9kYWwgdGhhdCB3ZSB3aWxsIHVzZSBsYXRlclxuICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9sb2dpbi5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gIH0pO1xuICAvLyBUcmlnZ2VyZWQgaW4gdGhlIGxvZ2luIG1vZGFsIHRvIGNsb3NlIGl0XG4gICRzY29wZS5jbG9zZUxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gIH07XG4gIC8vIE9wZW4gdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICB9O1xuICAvLyBQZXJmb3JtIHRoZSBsb2dpbiBhY3Rpb24gd2hlbiB0aGUgdXNlciBzdWJtaXRzIHRoZSBsb2dpbiBmb3JtXG4gICRzY29wZS5kb0xvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdEb2luZyBsb2dpbicsICRzY29wZS5sb2dpbkRhdGEpO1xuICAgIC8vIFNpbXVsYXRlIGEgbG9naW4gZGVsYXkuIFJlbW92ZSB0aGlzIGFuZCByZXBsYWNlIHdpdGggeW91ciBsb2dpblxuICAgIC8vIGNvZGUgaWYgdXNpbmcgYSBsb2dpbiBzeXN0ZW1cbiAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuY2xvc2VMb2dpbigpO1xuICAgIH0sIDEwMDApO1xuICB9O1xufSkuY29udHJvbGxlcignUGxheWxpc3RzQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgJHNjb3BlLnBsYXlsaXN0cyA9IFtcbiAgICB7XG4gICAgICB0aXRsZTogJ1JlZ2dhZScsXG4gICAgICBpZDogMVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdDaGlsbCcsXG4gICAgICBpZDogMlxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdEdWJzdGVwJyxcbiAgICAgIGlkOiAzXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0luZGllJyxcbiAgICAgIGlkOiA0XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ1JhcCcsXG4gICAgICBpZDogNVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdDb3diZWxsJyxcbiAgICAgIGlkOiA2XG4gICAgfVxuICBdO1xufSkuY29udHJvbGxlcignUGxheWxpc3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG59KTsiLCJhcHAuY29udHJvbGxlcignRm90b0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnZm90b3NTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnJGZpbHRlcicsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgJyRsb2cnLFxuICAnJGlvbmljTW9kYWwnLFxuICBmdW5jdGlvbiAocywgZm90b3NTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGdwc1NlcnZpY2UsICRsb2csICRpb25pY01vZGFsKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCdqcy9Gb3Rvcy9mb3RvTW9kYWwuaHRtbCcsIHtcbiAgICAgICAgc2NvcGU6IHMsXG4gICAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICAgcy5tb2RhbCA9IG1vZGFsO1xuICAgICAgICAkbG9nLmRlYnVnKG1vZGFsKTtcbiAgICAgIH0pO1xuICAgICAgLy8gcy50aXR0bGUgPSAnJztcbiAgICAgIHMudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgcy5pbWdVbnN5bmMgPSBbXTtcbiAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IGZhbHNlO1xuICAgICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLm9mZiA9IG9mZmxpbmVTZXJ2aWNlLmRhdGE7XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEVcbiAgICAgIC8vIHMub25saW5lU3RhdHVzID0gb25saW5lU3RhdHVzU2VydmljZTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBSRVFVSUVSRSBPVFJPIERJR0VTVCBQQVJBIFFVRSBGVU5DSU9ORVxuICAgICAgLy8gcy5vc3MgPSB7IG9ubGluZTogb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSB9O1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIEZVTkNJT05BIEJJRU4gUEFSQSBWRVIgRUwgQ0FNQklPIElOTUVESUFUQU1FTlRFICBFUyBNRUpPUiBSQVNUUkVBUiBTSUVNUFJFIFVOIE9CSkVUT1xuICAgICAgcy5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICAvLyAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgLy8gVE9ETzogb25ob2xkIGNhbiBlZGl0IHBsYWNhLCBvbiBzd2lwZSBsZWZ0IGRlbGV0ZSB3aXRoIGNvbmZpcm1cbiAgICAgIC8vIFRPRE86IGFsd2F5cyB1c2UgaW9uLW5hdi10aXRsZSAsIHBhcmEgcG9kZXJsZSBwb25lciBsb3MgdGl0dWxvcyBxdWUgcXVpZXJvXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICBzLnBob3RvcyA9IGZvdG9zU2VydmljZS5waG90b3M7XG4gICAgICBzLm5hbWVzID0gZm90b3NTZXJ2aWNlLm5hbWVzO1xuICAgICAgcy5mb3Rvc0ZhbHQgPSBbXTtcbiAgICAgIHMuZ2V0UGhvdG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPOiBjcmVvIGsgZXMgbWVqb3IgaGFjZXIgcmVmZXJlbmNpYSBkaXJlY3RhbWVudGUgYSBpbnRlcm1lZGlhdGVzZXJ2aWNlLkRBVEEgLmlkaW5zcGVjY2lvbiBrIGEgcy5pZGluc3BlY2Npb247XG4gICAgICAgIGZvdG9zU2VydmljZS5nZXRQaG90b3MoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5waG90b3MgPSBmb3Rvc1NlcnZpY2UucGhvdG9zO1xuICAgICAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICAgICAgcy5mb3Rvc0ZhbHQgPSBmb3Rvc1NlcnZpY2UuZm90b3NGYWx0O1xuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuZ2V0UGhvdG9zKCk7XG4gICAgICBzLiRvbignbXlFdmVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215IGV2ZW50IG9jY3VycmVkJywgcy5pZGluc3BlY2Npb24sIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICBzLmdldFBob3RvcygpO1xuICAgICAgfSk7XG4gICAgICB2YXIgX2ZpbHRlclVuc3luYyA9IGZ1bmN0aW9uIChlcXVhbCkge1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKShzLnBob3RvcywgeyBzeW5jOiBlcXVhbCB9LCB0cnVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocy5waG90b3MsIGZvdW5kKTtcbiAgICAgICAgcy5pbWdVbnN5bmMgPSBmb3VuZDtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgICBpZiAocy5tYXNzaXZlVXBsb2FkKSB7XG4gICAgICAgICAgICBzLm1hc3NpdmVMZW5ndGggPSBzLm1hc3NpdmVMZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKHMubWFzc2l2ZUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBfZmlsdGVyVW5zeW5jKDApO1xuICAgICAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHMubWFzc2l2ZUxlbmd0aCwgJ3N5bmMnKTtcbiAgICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnN5bmMgPSBzeW5jO1xuICAgICAgICBvYmpWaWRlby5vblVwbG9hZCA9IG9udXBsb2FkO1xuICAgICAgICB1cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgIC8vVE9ETyA6IENVQU5ETyBFUyBVTkEgU09MQSBFU1RBIEJJRU4sIENVRU5BT0QgRVMgVU4gQVJSQVkgREVCTyBERSBIQUNFUiBRVUUgU1lOQyBDT04gTEEgVUxUSU1BIEZPVE8gVU4gLkxFTlRIRyBQVUVERSBTRVJcbiAgICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICAvLyB2YXIgcnRuVGlwb0ZvdG89ZnVuY3Rpb24oKXtcbiAgICAgIC8vICAgcmV0dXJuIFxuICAgICAgLy8gfVxuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgICBpZiAoZm90b3NTZXJ2aWNlLnRpcG9Gb3RvLmNhbnRpZGFkID4gMCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcy5mb3Rvc0ZhbHQuaW5kZXhPZihmb3Rvc1NlcnZpY2UudGlwb0ZvdG8pO1xuICAgICAgICAgICAgJGxvZy5kZWJ1ZyhpbmRleCk7XG4gICAgICAgICAgICBzLmZvdG9zRmFsdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHJlZnJlc2hQcm9ncmVzcyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgcGVyY2VudGFnZSkge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpGb3RvLnByb2dyZXNzID0gcGVyY2VudGFnZTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICAvLyBUT0RPOiB5YSBub2UgcyBuZWNlc2FyaW8gcG9yIHF1ZSBvZmZsaW5lIHRhbWJpZW4gZXN0YSBlbiBvbmxpbG5lc3RhdHVzc3JlcnZpY2VcbiAgICAgICAgICAvLyB8fCAhb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSkge1xuICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHJ0bk9iamVjdEZvdG8gPSBmdW5jdGlvbiAocGxhY2EsIHBhdGgsIHN5bmMsIG9uVXBsb2FkLCBpZHRpcG8pIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKSxcbiAgICAgICAgICBpZHRpcG86IGlkdGlwb1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICAvLyBUT0RPOiBIQUJSQSBPVFJBIEZPUk1BIERFIEZJTFRBUiBNQVMgUkFQSURBIEsgRUwgU1RSSU5HIFBBVEg7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHBhdGg6IHNyY0ltZyB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmb3VuZFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGZvdW5kIGluIGFycmF5IHNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcy5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgIHMudHJ5VXBsb2FkID0gZnVuY3Rpb24gKGZvdG8pIHtcbiAgICAgICAgdmFyIG9iakZvdG8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9iakZvdG8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKG9iakZvdG8pO1xuICAgICAgfTtcbiAgICAgIC8vIHMuc2V0T2ZmbGluZU1vZGUgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgICAgLy8gICBzLm9mZi5vZmZsaW5lTW9kZSA9IGJvb2w7XG4gICAgICAvLyAgIGlmIChib29sKSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJ09mZmxpbmUgTW9kZScpO1xuICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgLy8gICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKHRpdGxlU2VydmljZS50aXRsZSk7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH07XG4gICAgICBzLnN5bmNJbWdVbnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubWFzc2l2ZVVwbG9hZCA9IHRydWU7XG4gICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMuaW1nVW5zeW5jLmxlbmd0aDtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHMuaW1nVW5zeW5jLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgICBzLnRyeVVwbG9hZChvYmopO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzLnNldG5hbWUgPSBmdW5jdGlvbiAoaWR0aXBvLCBmb3RvKSB7XG4gICAgICAgIC8vYmV0YWRvcGFyYXBydWViYXNjb25zb2xlLmxvZyhub21icmUsIGZvdG8pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZHRpcG8sIGZvdG8pO1xuICAgICAgICBmb3Rvc1NlcnZpY2Uuc2V0TmFtZShpZHRpcG8sIGZvdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHMuZm90b3NGYWx0ID0gZm90b3NTZXJ2aWNlLmZvdG9zRmFsdDtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSB0cnVlO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGFrZWRwaWMoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICAgIC8vIFRPRE86IHBhcmEgbGFzIHRhYmxldHMgYXBhZ28gZWwgZ3BzLCB5IGFsZ28gcGFzYSBjb24gbGEgY2FtYXJhXG4gICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGltYWdlVVJJKTtcbiAgICAgICAgICAvLyBmb3Rvc1NlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAgICAgICB2YXIgb251cGxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gVE9ETzogZXMgbWVqb3IgaMK/Z3VhcmRhciBhcXVpIGVsIHNxbGl0ZSB5IGx1ZWdvIGFjdHVhbGl6YXJsbyBzaSBzdWJlIGV4aXRvc287XG4gICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqZWN0Rm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkLCBmb3Rvc1NlcnZpY2UudGlwb0ZvdG8uaWRUaXBvRm90byk7XG4gICAgICAgICAgICBzLnBob3Rvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbWFpblNjcm9sbCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGxsYW1hciBhIHVuYSBmdW5jaW9uLCBwb3IgcXVlIGFzaSBzZSBlamVjdXRhIHBhcmEgY2FkYSB1bm8sIHkgc2UgZWplY3V0YSBiaWVuLCBlbiB2ZXogZGUgbGxhbWFyIGZpbHVwbG9hZCBkZXNkZSBhY2FcbiAgICAgICAgICAgIC8vcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTsgIC8vICRzY29wZS5waG90b3MucHVzaChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgICBzLnNldElkVGlwb0ZvdG8gPSBmdW5jdGlvbiAodGlwb0ZvdG8pIHtcbiAgICAgICAgJGxvZy5kZWJ1Zyh0aXBvRm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS50aXBvRm90byA9IHRpcG9Gb3RvO1xuICAgICAgICBzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgLy8gXG4gICAgICAgIHMuZ2V0UGljRmlsZSgpO1xuICAgICAgfTtcbiAgICAgIHMuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgcy5saXN0UGljcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk0LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ1BsYWNhJyxcbiAgICAgICAgICAnb3JkZW4nOiAnMScsXG4gICAgICAgICAgJ2NhbnRpZGFkJzogJzEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDYyNSxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdGcmVudGUgTGljZW5jaWEgVHJhbnNpdG8nLFxuICAgICAgICAgICdvcmRlbic6IDEwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTUsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRGVsYW50ZXJhIERlcmVjaGEnLFxuICAgICAgICAgICdvcmRlbic6IDQwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTYsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRGVsYW50ZXJhIEl6cXVpZXJkYScsXG4gICAgICAgICAgJ29yZGVuJzogMzAsXG4gICAgICAgICAgJ2NhbnRpZGFkJzogJzEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDQ5NyxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdUcmFzZXJhIERlcmVjaGEnLFxuICAgICAgICAgICdvcmRlbic6IDUwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9XG4gICAgICBdO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZm90b3NTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJGNvcmRvdmFGaWxlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3J0bkZpbmQnLFxuICAnJGZpbHRlcicsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJGNvcmRvdmFGaWxlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBydG5GaW5kLCAkZmlsdGVyKSB7XG4gICAgdmFyIGZvdG9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IFtdO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zRmFsdCA9IFtdO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudGlwb0ZvdG8gPSB7fTtcbiAgICAvLyBbe1xuICAgIC8vICAgICBwbGFjYTogJ0FCQzExMScsXG4gICAgLy8gICAgIHNyYzogJycsXG4gICAgLy8gICAgIHN5bmM6IGZhbHNlXG4gICAgLy8gICB9XTtcbiAgICB2YXIgX3JlbW92ZSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3Muc3BsaWNlKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLmluZGV4T2YocGxhY2EpLCAxKTtcbiAgICB9O1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZHBpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBxdWFsaXR5OiA0NSxcbiAgICAgICAgLy81MCxcbiAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkZJTEVfVVJJLFxuICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBLFxuICAgICAgICAvLyBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICB0YXJnZXRXaWR0aDogMTAwMCxcbiAgICAgICAgLy9pbXBvcnRhbnRlIGNvbiAxMDAgc2UgdmVpYSBob3JyaWJsZVxuICAgICAgICB0YXJnZXRIZWlnaHQ6IDEwMDAsXG4gICAgICAgIC8vIFRPRE86IHJldmlzYXIgcGFyYSBxdWUgc2lydmUgZXN0YSBvcGNpb25cbiAgICAgICAgLy8gcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxuICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgIHJldHVybiBpbWFnZVVSSTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRQaG90b3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGZvdG9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2lkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIF9nZXROYW1lcygpOyAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXROYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgaWRUaXBvRm90bywgTm9tYnJlRm90bywgZW5hYmxlZCAgIGZyb20gdGlwb3NGb3RvIFdIRVJFIGVuYWJsZWQ9MSBvcmRlciBieSBub21icmVmb3RvJztcbiAgICAgIHZhciBxdWVyeSA9ICcgc2VsZWN0IGZjLmlkVGlwb0ZvdG8sIE5vbWJyZUZvdG8sZmMub3JkZW4sIGZjLmNhbnRpZGFkICc7XG4gICAgICBxdWVyeSArPSAnIGZyb20gdGlwb3NGb3RvIHRmICc7XG4gICAgICBxdWVyeSArPSAnIGlubmVyIGpvaW4gZm90b3NjaWEgZmMgb24gdGYuaWRUaXBvRm90bz1mYy5pZFRpcG9Gb3RvICc7XG4gICAgICBxdWVyeSArPSAnIGFuZCB0Zi5lbmFibGVkPTEgYW5kIGZjLmVuYWJsZWQ9MSAnO1xuICAgICAgcXVlcnkgKz0gJ29yZGVyIGJ5IGZjLm9yZGVuICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgICAvLyBhbmd1bGFyLmNvcHkoZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcywgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQpO1xuICAgICAgICAvLyBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm9yZGVyQnkoZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQsICdvcmRlbicsIGZhbHNlKTtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb3JkZXJCeSA9IGZ1bmN0aW9uIChhcnJheSwgZXhwcmVzc2lvbiwgcmV2ZXJzZSkge1xuICAgICAgYXJyYXkgPSAkZmlsdGVyKCdvcmRlckJ5JykoYXJyYXksIGV4cHJlc3Npb24sIHJldmVyc2UpO1xuICAgIH07XG4gICAgdmFyIF9mb3Rvc1BlbmRpZW50ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmNvcHkoZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcywgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQpO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIGZpbHRlck9iaiA9IHsgaWRUaXBvRm90bzogb2JqLmlkdGlwbyB9O1xuICAgICAgICBydG5GaW5kLnJtT2JqRnJvbUFycmF5KGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0LCBmaWx0ZXJPYmopO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NvcHlGaWxlID0gZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBpbWFnZVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgbmV3RmlsZU5hbWUgPSAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUoY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnksIEZpbGVOYW1lLCBjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgbmV3RmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkZm90b3MoaWRpbnNwZWNjaW9uLCBwYXRoLHN5bmMsdXVpZCxkZWxldGVkLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2LCBpZHRpcG8pIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LCA/LD8pJztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbWFnZVVSSSxcbiAgICAgICAgc3luYyxcbiAgICAgICAgJ3Rlc3R1dWlkJyxcbiAgICAgICAgMCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYoaW1hZ2VVUkkpLFxuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnRpcG9Gb3RvLmlkVGlwb0ZvdG9cbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIHBhdGgsIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAvL1RPRE86IGVzIGVsIHBhdGggbGEgbWVqb3IgZm9ybWEgeSBtYXMgZWZlY3RpdmEgZGUgaGFjZXIgZWwgd2hlcmUgZGUgbGEgY29uc3VsdGFcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgaWRpbnNwZWNjaW9uID0/IEFORCBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICAvLyBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfc2V0TmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgaWR0aXBvPT8gIFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZHRpcG8sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGZvdG8ucGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkucmVtb3ZlID0gX3JlbW92ZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IF9hbGw7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS50YWtlZHBpYyA9IF90YWtlZHBpYztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmNvcHlGaWxlID0gX2NvcHlGaWxlO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuaW5zZXJ0Rm90byA9IF9pbnNlcnRGb3RvO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZ2V0UGhvdG9zID0gX2dldFBob3RvcztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZUZvdG8gPSBfdXBkYXRlRm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnNldE5hbWUgPSBfc2V0TmFtZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zUGVuZGllbnRlcyA9IF9mb3Rvc1BlbmRpZW50ZXM7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5vcmRlckJ5ID0gX29yZGVyQnk7XG4gICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgncnRuRmluZCcsIFtcbiAgICAnJGZpbHRlcicsXG4gICAgJyRsb2cnLFxuICAgIHJ0bkZpbmRcbiAgXSk7XG4gIGZ1bmN0aW9uIHJ0bkZpbmQoJGZpbHRlciwgJGxvZykge1xuICAgIHZhciBydG5GaW5kRmFjdG9yeSA9IHsgcm1PYmpGcm9tQXJyYXk6IHJtT2JqRnJvbUFycmF5IH07XG4gICAgcmV0dXJuIHJ0bkZpbmRGYWN0b3J5O1xuICAgIC8vIGJvZHkuLi5cbiAgICBmdW5jdGlvbiBybU9iakZyb21BcnJheShhcnJheSwgZmlsdGVyT2JqKSB7XG4gICAgICB2YXIgc3ViQXJyYXkgPSAkZmlsdGVyKCdmaWx0ZXInKShhcnJheSwgZmlsdGVyT2JqLCB0cnVlKTtcbiAgICAgICRsb2cuZGVidWcoc3ViQXJyYXkpO1xuICAgICAgaWYgKHN1YkFycmF5Lmxlbmd0aCkge1xuICAgICAgICB2YXIgb2JqID0gc3ViQXJyYXlbMF07XG4gICAgICAgIGlmIChvYmouY2FudGlkYWQgPiAwKSB7XG4gICAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihvYmopO1xuICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5jb250cm9sbGVyKCdDb2RGYXMnLCBbXG4gICAgJyRsb2cnLFxuICAgICdjZnNlcicsXG4gICAgJ2Vycm9yU2VydmljZScsXG4gICAgY29kRmFzXG4gIF0pO1xuICBmdW5jdGlvbiBjb2RGYXMoJGxvZywgY2ZzZXIsIGVycm9yU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ubWFyY2FzID0gW107XG4gICAgdm0uZGF0YSA9IGNmc2VyLm9iakNvZEZhcztcbiAgICAvLyB2bS5maWx0ZXIgPSB7IG1hcmNhOiAnJyB9O1xuICAgIHZtLnNldENvZEZhcyA9IHNldENvZEZhcztcbiAgICB2bS51cGRDb2RGYXMgPSB1cGRDb2RGYXM7XG4gICAgYWN0aXZhdGUoKTtcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgIGNmc2VyLmdldENvZEZhcygpLnRoZW4oc2VsZWN0T2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb2RGYXMoKSB7XG4gICAgICAkbG9nLmRlYnVnKCdvcGVuIHNldGNvZGZhcycsIHZtLmRhdGEpO1xuICAgICAgY2ZzZXIuaW5zZXJ0Q29kRmFzKCkudGhlbihpbnNlcnRPaykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZENvZEZhcygpIHtcbiAgICAgIGNmc2VyLnVwZENvZEZhcygpLnRoZW4odXBkT2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgICAvLy8vLy8vXG4gICAgZnVuY3Rpb24gaW5zZXJ0T2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCdpbnNlcnQgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0T2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCdzZWxlY3Qgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkT2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCd1cGQgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5mYWN0b3J5KCdjZnNlcicsIFtcbiAgICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAgICdtb21lbnRTZXJ2aWNlJyxcbiAgICAnenVtZXJvU2VydmljZScsXG4gICAgJ3RvYXN0U2VydmljZScsXG4gICAgY2ZzZXJcbiAgXSk7XG4gIGZ1bmN0aW9uIGNmc2VyKGludGVybWVkaWF0ZVNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIHRvYXN0U2VydmljZSkge1xuICAgIHZhciBjZkZhY3RvcnkgPSB7XG4gICAgICBvYmpDb2RGYXM6IHtcbiAgICAgICAgY29kRmFzZWNvbGRhOiBudWxsLFxuICAgICAgICBhbHJlYWR5U2V0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGluc2VydENvZEZhczogaW5zZXJ0Q29kRmFzLFxuICAgICAgdXBkQ29kRmFzOiB1cGRDb2RGYXMsXG4gICAgICBnZXRDb2RGYXM6IGdldENvZEZhc1xuICAgIH07XG4gICAgcmV0dXJuIGNmRmFjdG9yeTtcbiAgICBmdW5jdGlvbiBpbnNlcnRDb2RGYXMoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGFdIChbaWRpbnNwZWNjaW9uXSAsW3BsYWNhXSAgLFtjb2RGYXNlY29sZGFdICAsW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyw/KSAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuYWxyZWFkeVNldCA9IHRydWU7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NvZGlnbyBpbmdyZXNhZG8nKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDI0KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkQ29kRmFzKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRpbnNwZWNjaW9uQ29kaWdvc0Zhc2Vjb2xkYV0gJztcbiAgICAgIHF1ZXJ5ICs9ICdTRVQgW2NvZEZhc2Vjb2xkYV0gPSA/ICwgJztcbiAgICAgIHF1ZXJ5ICs9ICdbZmVjaGFdID0gPyAsICc7XG4gICAgICBxdWVyeSArPSAnW2lkYWp1c3Rldl0gPSBOVUxMICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgaWRpbnNwZWNjaW9uPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnY29kaWdvIGFjdHVhbGl6YWRvJyk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyNCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENvZEZhcygpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGEgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgYXJyYXkgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSA9IGFycmF5WzBdLmNvZEZhc2Vjb2xkYTtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuY29kRmFzZWNvbGRhID0gbnVsbDtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuY29udHJvbGxlcignQWNjZXNvcmlvc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTW9kYWwnLFxuICAnYWNjZXNvcmlvc1NlcnZpY2UnLFxuICAnZm90b3NTZXJ2aWNlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgenVtZXJvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sIHBsYWNhc1NlcnZpY2UsICRpb25pY05hdkJhckRlbGVnYXRlLCAkbG9jYXRpb24sICRpb25pY1BvcHVwLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZm9jdXMsICRzdGF0ZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNNb2RhbCwgYWNjZXNvcmlvc1NlcnZpY2UsIGZvdG9zU2VydmljZSwgY29weUZpbGVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIGNoZWNrRmlsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgJHNjb3BlLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vXG4gICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KGZhbHNlKTtcbiAgICAgICRzY29wZS5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGVuTmV3QWNjZXNvcmlvLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5hY2NlcyA9IFtdO1xuICAgICAgJHNjb3BlLnNldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjZXMgPSBhY2Nlc29yaW9zU2VydmljZS5hbGw7XG4gICAgICB9O1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldCBpdGVtcyBlbiAgZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgIH0pO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuaW5pdE9wdGlvbnMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBjb250cm9sYWRvcicpO1xuICAgICAgICAkc2NvcGUub3B0aW9ucyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXREYXRhO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuaW5pdGFjYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjYyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXRBY2MoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuc2hvd01vZGFsTmV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuaW5pdGFjYygpO1xuICAgICAgICAkc2NvcGUubW9kc2hvdyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZS5zYXZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoNCk7XG4gICAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7ICAvLyAkc2NvcGUuYWNjZXMucHVzaCgkc2NvcGUuYWNjKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5wYXRoID0gJ2h0dHA6Ly9pLmRhaWx5bWFpbC5jby51ay9pL3BpeC8yMDE0LzAzLzIzL2FydGljbGUtMjU4NzQ1NC0xQzg2NDk5MTAwMDAwNTc4LTQzOF82MzR4NDMwLmpwZyc7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1vZCA9IGZ1bmN0aW9uIChhY2MpIHtcbiAgICAgICAgJHNjb3BlLm1vZHNob3cgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuYWNjID0gYWNjO1xuICAgICAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZUFjdE1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPOiBBUVVJIFRFTkRSSUEgUVVFIEhBQ0VSIEVMIFVQREFURSBcbiAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICB2YXIgaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmluc2VydEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLnN5bmMgPSBzeW5jO1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5vblVwbG9hZCA9IG9uVXBsb2FkO1xuICAgICAgICB1cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgICRzY29wZS50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICBmb3RvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChmb3RvKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gdHJ1ZTtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnRha2VkcGljKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnN5bmMgPSBzeW5jO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcub25VcGxvYWQgPSBvblVwbG9hZDtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnBhdGggPSByZXMubmF0aXZlVVJMO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcucnV0YVNydiA9IG1vbWVudFNlcnZpY2UucnV0YVNydihyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIGluc2VydEZvdG8ocmVzLm5hdGl2ZVVSTCwgc3luYywgb25VcGxvYWQpO1xuICAgICAgICAgICAgcHJlRmlsZVVwbG9hZCgkc2NvcGUuYWNjLmltZyk7XG4gICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGZuRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgb2ZmbGluZVNlcnZpY2UsIHRpdGxlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgenVtZXJvU2VydmljZSwgdG9hc3RTZXJ2aWNlLCB1bnN5bmNTZXJ2aWNlLCAkc3RhdGUsIGF1dGhTZXJ2aWNlKSB7XG4gICRzY29wZS5vZmYgPSBvZmZsaW5lU2VydmljZS5kYXRhO1xuICAkc2NvcGUuaW50ZXJtZWRpYXRlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhO1xuICAkc2NvcGUuc2V0T2ZmbGluZU1vZGUgPSBmdW5jdGlvbiAoYm9vbCkge1xuICAgICRzY29wZS5vZmYub2ZmbGluZU1vZGUgPSBib29sO1xuICAgIC8vIGlmIChib29sKSB7XG4gICAgLy8gICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKHRpdGxlU2VydmljZS50aXRsZSk7XG4gICAgLy8gfVxuICAgIGlmICghYm9vbCAmJiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnc2luY3Jvbml6YW5kbycpO1xuICAgICAgdW5zeW5jU2VydmljZS5zeW5jSW1hZ2VzKCkgIC8vIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB6dW1lcm9TZXJ2aWNlLnp5bmMoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7ICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMCk7XG47XG4gICAgfVxuICB9O1xuICAkc2NvcGUubG9nT3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gIH07XG59KTsiLCJhcHAuY29udHJvbGxlcignVGVzdEN0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnc3FsU2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1BsYXRmb3JtLCBzcWxTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgICAkc2NvcGUub3BlbmRiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB4ID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2UoeyBuYW1lOiAnenVtZXJvdGVzdGRiZmlsZScgfSwgZnVuY3Rpb24gKHJlc3VsdE9iaiwgZnVsbFBhdGhQYXJhbSwgZGJPYmplY3QpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYk9iamVjdCwgJ2Rib2JqZWN0Jyk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0T2JqLCAnZnVscGF0aDonLCBmdWxsUGF0aFBhcmFtKTsgIC8vSW1wb3J0YW50ISAgSWYgeW91IGRvbid0IGNsb3NlIHRoZSBkYXRhYmFzZSBvYmplY3QsIGZ1dHVyZSBjYWxscyB0byBvcGVuRGF0YWJhc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd29uJ3QgY2FsbCB0aGUgc3VjY2VzcyBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGJPYmplY3QuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlZGIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjZXJyYW5kbycsIHgpO1xuICAgICAgICAvLyBpZiAoIXgpIHtcbiAgICAgICAgeC5jbG9zZSgpO1xuICAgICAgICAvLyB6dW1lcm8gc3FsaXRlIGZ1bmNpb25hIGFzaSAuY2xvc2UgPSBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcikgeyBwZXJvIG5vIHNlIHVzYW4gYWwgbGxhbWFyIGNvcm9kdmEuZXhlXG4gICAgICAgIGNvbnNvbGUubG9nKHgub3BlbkRCUyk7ICAvLyB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmdWxsUGF0aFBhcmFtID0gJy9kYXRhL2RhdGEvY29tLmlvbmljZnJhbWV3b3JrLmZvdG9zdmlldzM5MDc0Ny9kYXRhYmFzZXMvenVtZXJvdGVzdGRiLmRiJztcbiAgICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vMTkyLjE2OC4xLjEzOjgwODAvJztcbiAgICAgICAgdmFyIGRiZmlsZSA9ICd6dW1lcm90ZXN0ZGJmaWxlJztcbiAgICAgICAgdmFyIG5vdGlmeVN1Y2Nlc3MgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbm90aWZ5RXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9O1xuICAgICAgICB6dW1lcm8uc3luYyhmdWxsUGF0aFBhcmFtLCAnJywgc2VydmVyLCBkYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIG5vdGlmeVN1Y2Nlc3MsIG5vdGlmeUVycm9yKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubyA9IHtcbiAgICAgICAgczogdHJ1ZSxcbiAgICAgICAgZTogdHJ1ZSxcbiAgICAgICAgdTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHNxbFNlcnZpY2Uuc3luYygpO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignVmlkZW9DdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3ZpZGVvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJyRmaWx0ZXInLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLFxuICAnZ2V0VmlkZW9TZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHMsIHZpZGVvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRpb25pY1Njcm9sbERlbGVnYXRlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCAkZmlsdGVyLCAkc3RhdGVQYXJhbXMsICRpb25pY05hdkJhckRlbGVnYXRlLCBjb3B5RmlsZVNlcnZpY2UsIHZpZGVvVGh1bWJuYWlsU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGVycm9yU2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIC8vIHMudGl0dGxlID0gJyc7XG4gICAgICBzLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICAvL3ZpZGVvU2VydmljZS5hbGwoKTtcbiAgICAgIHZpZGVvU2VydmljZS5nZXRWaWRlb3MoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMudmlkZW9zID0gdmlkZW9TZXJ2aWNlLnZpZGVvcztcbiAgICAgIH0pO1xuICAgICAgLy8gdmFyIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcbiAgICAgIC8vIH07XG4gICAgICB2YXIgaW5zZXJ0VmlkZW8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLmluc2VydFZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIGluc2VydCBzcWxpdGUgdmlkZW8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVWaWRlbyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgdGh1bWJuYWlsLCBvbnVwbG9hZCkge1xuICAgICAgICB2aWRlb1NlcnZpY2UudXBkYXRlVmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgdmlkZW8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnN5bmMgPSBzeW5jO1xuICAgICAgICBvYmpWaWRlby5vblVwbG9hZCA9IG9udXBsb2FkO1xuICAgICAgICAvLyBpbnNlcnRWaWRlbyhpbWFnZVVSSSwgc3luYywgb2JqVmlkZW8udGh1bWJuYWlsKTtcbiAgICAgICAgdXBkYXRlVmlkZW8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDMpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpWaWRlby5wcm9ncmVzcyA9IHBlcmNlbnRhZ2U7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0YW50IHByb2dyZXNzIHVwZGF0ZXNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHByb2dyZXNzKTtcbiAgICAgICAgICAgIC8vIHJlZnJlc2hQcm9ncmVzcyhpbWFnZVVSSSwgTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHJ0bk9ialZpZGVvID0gZnVuY3Rpb24gKHBsYWNhLCBwYXRoLCBzeW5jLCBvblVwbG9hZCwgdGh1bWJuYWlsKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgc3luYzogc3luYyxcbiAgICAgICAgICBvblVwbG9hZDogb25VcGxvYWQsXG4gICAgICAgICAgLy9zLm9zcy5vbmxpbmUgPT09IHRydWUgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB0aHVtYm5haWw6IHRodW1ibmFpbCxcbiAgICAgICAgICBydXRhU3J2OiBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH07XG4gICAgICB2YXIgc2VhcmNoT25lSW5BcnJheSA9IGZ1bmN0aW9uIChzcmNJbWcpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy52aWRlb3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgbG9hZFRodW1ibmFpbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmdlbmVyYXRlVGh1bWJuYWlsKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICh0aHVtYm5haWxTcmMpIHtcbiAgICAgICAgICBzZWFyY2hPbmVJbkFycmF5KG9iai5wYXRoKS50aHVtYm5haWwgPSB0aHVtYm5haWxTcmM7XG4gICAgICAgICAgdmFyIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBUT0RPOiBvbnVwbG9hZCBkZXBlbmRlcmEgc2kgZXN0YSBvbmxpbmUgbyBubyBwYXJhIHNhYmVyIHNpIHNlIGludGVudGEgc3ViaXI7XG4gICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICBpbnNlcnRWaWRlbyhvYmoucGF0aCwgc3luYywgdGh1bWJuYWlsU3JjLCBvblVwbG9hZCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChvYmpWaWRlbyk7XG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICB2aWRlb1NlcnZpY2UudGFrZWRWaWQoKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgICBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codmlkZW9EYXRhKTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godmlkZW9EYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZSh2YWx1ZS5mdWxsUGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBydG5PYmpWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIGZhbHNlLCB0cnVlLCAnJyk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgICBzLnZpZGVvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgIGxvYWRUaHVtYm5haWwob2JqKTsgIC8vIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICAgIHMuZ2V0VmlkRmlsZUNvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICBnZXRWaWRlb1NlcnZpY2UuZ2V0VmlkZW9Db21wcmVzcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICB2YXIgcmVzVmlkZW9Db21wcmVzcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgIC8vIFRPRE86IDEyNTgyOTEyIHNvbiAxMk1CIDtcbiAgICAgICAgICBpZiAoY2hlY2tGaWxlU2VydmljZS5maWxlLnNpemUgPCAxMjU4MjkxMikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZ2V0VmlkZW9TZXJ2aWNlLmZpbGVFbnRyeSk7XG4gICAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUocmVzVmlkZW9Db21wcmVzcy5uYXRpdmVVUkwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjb3B5RmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjb3B5RmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnZWwgYXJjaGl2byBzdXBlcmEgZWwgdGFtYVxceEYxYSBtYXhpbW8gcGVybWl0aWRvLiBtYXhpbW8gMTJNQicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbXG4gICckc2NvcGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJ2F1dGhTZXJ2aWNlJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckc3RhdGUnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIGF1dGhTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRzdGF0ZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5zcmMgPSAnaW1nL2ljb24ucG5nJztcbiAgICAgIC8vIFRPRE86IHZlcmlmaWNhciBzaSBlc3RvIHNlIHB1ZWRlIGhhY2VyIGVuIGVsIHJ1biwgcGVybyBjb24gc3RhdGUuZ28gYXBwLnBsYWNhc1xuICAgICAgdmFyIF9hbHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgdmFyIG4gPSBtb21lbnQoKTtcbiAgICAgICAgICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICBpZiAobi5kaWZmKGUsICdzZWNvbmRzJykgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgcGxhY2FzJyk7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2FwcC9wbGFjYXMnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF9hbHJlYWR5KCk7XG4gICAgICAkc2NvcGUubG9nZ2VkTm93ID0gZmFsc2U7XG4gICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KGZhbHNlKTtcbiAgICAgICRzY29wZS5sb2dpbkRhdGEgPSB7XG4gICAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgfTtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gJyc7XG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgICAgYXV0aFNlcnZpY2UubG9naW4oJHNjb3BlLmxvZ2luRGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5vbkxvZ2dlZCgpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gJ3ZlcmlmaXF1ZSBxdWUgZGlzcG9uZ2EgZGUgY29uZXhpb24gYSBpbnRlcm5ldCwgZSBpbnRlbnRlIGRlIG51ZXZvJztcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5vbkxvZ2dlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnL29yZGVycycpO1xuICAgICAgICAvLyAkc2NvcGUubG9nZ2VkKHRydWUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLCRsb2NhdGlvbik7XG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gJyc7XG4gICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wbGFjYXMnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aEV4dGVybmFsUHJvdmlkZXIgPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIHJlZGlyZWN0VXJpID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArICcvYXV0aGNvbXBsZXRlLmh0bWwnO1xuICAgICAgICB2YXIgZXh0ZXJuYWxQcm92aWRlclVybCA9IG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJ2FwaS9BY2NvdW50L0V4dGVybmFsTG9naW4/cHJvdmlkZXI9JyArIHByb3ZpZGVyICsgJyZyZXNwb25zZV90eXBlPXRva2VuJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQgKyAnJnJlZGlyZWN0X3VyaT0nICsgcmVkaXJlY3RVcmk7XG4gICAgICAgIHdpbmRvdy4kd2luZG93U2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHZhciBvYXV0aFdpbmRvdyA9IHdpbmRvdy5vcGVuKGV4dGVybmFsUHJvdmlkZXJVcmwsICdBdXRoZW50aWNhdGUgQWNjb3VudCcsICdsb2NhdGlvbj0wLHN0YXR1cz0wLHdpZHRoPTYwMCxoZWlnaHQ9NzUwJyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmF1dGhDb21wbGV0ZWRDQiA9IGZ1bmN0aW9uIChmcmFnbWVudCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZnJhZ21lbnQuaGFzbG9jYWxhY2NvdW50ID09PSAnRmFsc2UnKSB7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmV4dGVybmFsQXV0aERhdGEgPSB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBmcmFnbWVudC5wcm92aWRlcixcbiAgICAgICAgICAgICAgdXNlck5hbWU6IGZyYWdtZW50LmV4dGVybmFsX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZnJhZ21lbnQuZXh0ZXJuYWxfYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9hc3NvY2lhdGUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9PYnRhaW4gYWNjZXNzIHRva2VuIGFuZCByZWRpcmVjdCB0byBvcmRlcnNcbiAgICAgICAgICAgIHZhciBleHRlcm5hbERhdGEgPSB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBmcmFnbWVudC5wcm92aWRlcixcbiAgICAgICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZnJhZ21lbnQuZXh0ZXJuYWxfYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXV0aFNlcnZpY2Uub2J0YWluQWNjZXNzVG9rZW4oZXh0ZXJuYWxEYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL29yZGVycycpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IGVyci5lcnJvcl9kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9ICAvLyAkc2NvcGUuYWxyZWFkeUxvZ2dlZCgpOyAgICAgICAgICAgICAgIFxuO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignSW5zcGVjY2lvbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB0aXRsZVNlcnZpY2UsIGluc3BlY2Npb25TZXJ2aWNlLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNNb2RhbCwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRpb25pY0xvYWRpbmcsICR0aW1lb3V0LCAkZmlsdGVyLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBzcWxpdGVTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KGZhbHNlKTtcbiAgICAkc2NvcGUuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZCA9IHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5jYWxpZmljYWRvKSA9PT0gMSA/IHRydWUgOiBmYWxzZTtcbiAgICAkc2NvcGUuYWxyZWFkeVNhdmVkID0gaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkO1xuICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgIC8vcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkc2NvcGUudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgJHNjb3BlLmRhdGEgPSBpbnNwZWNjaW9uU2VydmljZS5kYXRhO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvb3BjaW9uTW9kYWwuaHRtbCcsIHsgc2NvcGU6ICRzY29wZSB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gICAgfSk7XG4gICAgLy8gVE9ETzogY29tbyBlc3RvIHNlIHNpbmNyb25pemEgdW5hIHNvbGEgdmV6LCBubyBoYXkgcHJvYmxlbWEgY29uIGVsIGlkaW5zcGVjY2lvbiwgZWwgcHJvYmxlbWEgZXN0YSBlbiBhY2Nlc29yaW9zIHkgZW4gZm90b3MsIHF1ZSBzZSBzdWJlIHVubyBhIHVubywgZW50b25jZXMgcG9kcmlhIGNhbWJpYXIsIG8gZW4gYWNjZXNvcmlvcyBoYWNlciB1biBiZWZvcmxlYXZlIGRlIHZpZXcsIG1pIHByZWd1bnRhIGVzICwgc2kgbm8gYWJhbmRvbmEgbGEgdmlldywgY29tbyBzaW5jcm9uaXpvPyBvdHJhIG1hcyBzaSBwYXNvIGEgYmFja2dyb3VuZCBwdWVkbyBzaW5jcm9uaXphcj8/P1xuICAgIC8vIFRPRE86IGVzdGEgdmFyaWFibGUgbWUgbGEgZGEgbGEgcGJhc2UgZGUgc2F0b3MsIHNpIHlhIGVzdGEgY2FsaWZpY2FkbyBvIG5vXG4gICAgJHNjb3BlLm9iaiA9IHsgY3VzdG9tc2VjdGlvbjogMCB9O1xuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgIH07XG4gICAgLy8gJHNjb3BlLnNob3coKTtcbiAgICAvLyAkdGltZW91dCgkc2NvcGUuaGlkZSwgMTUwMDApO1xuICAgICRzY29wZS5pdGVtcyA9IFtdO1xuICAgIC8vIGluaXRpYWwgaW1hZ2UgaW5kZXhcbiAgICAkc2NvcGUuX0luZGV4ID0gMDtcbiAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbiA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuc2VjdGlvbnMsIGkpO1xuICAgICAgJHNjb3BlLm9iai5jdXN0b21zZWN0aW9uID0gJHNjb3BlLnNlY3Rpb25zW2ldLmN1c3RvbXNlY3Rpb247XG4gICAgICAvLyAkc2NvcGUuc2V0TWluKCk7XG4gICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICB9O1xuICAgIC8vcmVmZW5jZSBzZXJ2aWNlXG4gICAgLy8gaWYgYSBjdXJyZW50IGltYWdlIGlzIHRoZSBzYW1lIGFzIHJlcXVlc3RlZCBpbWFnZVxuICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgcmV0dXJuICRzY29wZS5fSW5kZXggPT09IGluZGV4O1xuICAgIH07XG4gICAgLy8gc2hvdyBwcmV2IGltYWdlXG4gICAgJHNjb3BlLnNob3dQcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPiAwID8gLS0kc2NvcGUuX0luZGV4IDogJHNjb3BlLnNlY3Rpb25zLmxlbmd0aCAtIDE7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8vIHNob3cgbmV4dCBpbWFnZVxuICAgICRzY29wZS5zaG93TmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5fSW5kZXggPSAkc2NvcGUuX0luZGV4IDwgJHNjb3BlLnNlY3Rpb25zLmxlbmd0aCAtIDEgPyArKyRzY29wZS5fSW5kZXggOiAwO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAvKiBTaG93IGxpc3QgKi9cbiAgICAkc2NvcGUuc2hvd0l0ZW1zID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIC8vIFRPRE86IHBhcmEgZGVzaGFiaWxpdGFyIGVsIHVwZGF0ZSwgYXVucXVlIHlhIGVzdGEgbW9udGFkbywgbWUgcHJlb2N1cGEgZXMgZWwgenluYyBjYWRhIHF1ZSBzZSBoYWdhIHVuIHVwZGF0ZVxuICAgICAgaWYgKCRzY29wZS5hbHJlYWR5U2F2ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXRlbS5kaXJ0eSA9IHRydWU7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5pdGVtID0gaXRlbTtcbiAgICAgICRzY29wZS5pdGVtID0gaW5zcGVjY2lvblNlcnZpY2UuaXRlbTtcbiAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgfTtcbiAgICAvKiBIaWRlIGxpc3QgKi9cbiAgICAkc2NvcGUuaGlkZUl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICB9O1xuICAgICRzY29wZS52YWxpZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uIChvcGNpb24pIHtcbiAgICAgIC8vIFNldCBzZWxlY3RlZCB0ZXh0XG4gICAgICAkc2NvcGUuaXRlbS5zbC5sYWJlbCA9IG9wY2lvbi5sYWJlbDtcbiAgICAgIC8vIFNldCBzZWxlY3RlZCB2YWx1ZVxuICAgICAgJHNjb3BlLml0ZW0uc2wudmFsdWUgPSBvcGNpb24udmFsdWU7XG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZS51cGRhdGVTaW5nbGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2sgdXBkYXRlJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSGlkZSBpdGVtc1xuICAgICAgJHNjb3BlLmhpZGVJdGVtcygpOyAgLy8gRXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvblxuICAgIH07XG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnR3VhcmRhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5zYXZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgICRzY29wZS5jbG9zZU1vZGFsT25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lLmhpZGUoKTtcbiAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlLmNsZWFyVGlwbygpO1xuICAgICAgJHNjb3BlLmNsLmlkY2xhc2UgPSBudWxsO1xuICAgICAgJHNjb3BlLmNsLmlkY2Fycm9jZXJpYSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wudGlwbyA9IG51bGw7XG4gICAgfTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9tb2RhbEdldEl0ZW1zLmh0bWwnLCB7XG4gICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZSA9IG1vZGFsO1xuICAgIH0pO1xuICAgICRzY29wZS5vcGVuTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuc2hvdygpO1xuICAgIH07XG4gICAgJHNjb3BlLmdldENsYXNlcyA9IGZ1bmN0aW9uIChpZHRpcG8pIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldENsYXNlcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuY2xhc2VzID0gaW5zcGVjY2lvblNlcnZpY2UuY2xhc2VzO1xuICAgICAgICAkc2NvcGUuY2Fycm9jZXJpYXMgPSBpbnNwZWNjaW9uU2VydmljZS5jYXJyb2NlcmlhcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldENhcnJvY2VyaWFzID0gZnVuY3Rpb24gKGlkY2xhc2UpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldENhcnJvY2VyaWFzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jYXJyb2NlcmlhcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNhcnJvY2VyaWFzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuaXRlbXMgPSBpbnNwZWNjaW9uU2VydmljZS5hbGw7XG4gICAgICAkc2NvcGUuc2VjdGlvbnMgPSBpbnNwZWNjaW9uU2VydmljZS5zZWN0aW9ucztcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgJHNjb3BlLnNldElkQ2xhQ2EgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5zZXRJZENsYUNhKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXRJZENsYUNhIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICAgICRzY29wZS5jbG9zZU1vZGFsT25lKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldEFscmVhZHlJbnNwZWN0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXRBbHJlYWR5SW5zcGVjdCBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS50aXBvcyA9IGluc3BlY2Npb25TZXJ2aWNlLnRpcG9zO1xuICAgICAgJHNjb3BlLmNsID0gaW5zcGVjY2lvblNlcnZpY2UuY2w7XG4gICAgICAvLyBUT0RPOiBhcXVpIHZhbGlkbyBzaSB5YSBzZSBjYWxpZmljbyBvIHNpIGFwZW5hcyBzZSB2YSBhIHJlYWxpemFyXG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICAkc2NvcGUuZ2V0QWxyZWFkeUluc3BlY3QoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBvbiBpbml0XG4gICAgJHNjb3BlLmluaXQoKTtcbiAgfSk7XG59KTsiLCJhcHAuZmFjdG9yeSgnaW5zcGVjY2lvblNlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRxLCAkZmlsdGVyLCBlcnJvclNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgICB2YXIgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uID0gMDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaXRlbSA9IHt9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAga2lsb21ldHJhamU6ICcnLFxuICAgICAgb2JzZXJ2YWNpb246ICcnXG4gICAgfTtcbiAgICB2YXIgX3NldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHByZUl0ZW1zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiBvYmouY29udHJvbEpzb25bMF0uaWQsXG4gICAgICAgICAgbGFiZWw6IG9iai5jb250cm9sSnNvblswXS50ZXh0XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgb2JqLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBwcmVJdGVtcztcbiAgICB9O1xuICAgIHZhciBfc2VjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2VjdGlvbnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJGZpbHRlcigndW5pcXVlJykoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCwgJ2N1c3RvbXNlY3Rpb24nKSwgJ2N1c3RvbXNlY3Rpb24nKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb24nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBfc2V0SXRlbXMoKTtcbiAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgLy8gVE9ETzogbG9naWNhIHBhcmEgc2FiZXIgc2kgeWEgZnVlIGNhbGlmaWNhZG9cbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZHNlcnZpY2lvLFxuICAgICAgICBvYmouaWRpdGVtLFxuICAgICAgICBvYmouaWRQYXJlbnRJdGVtLFxuICAgICAgICBvYmoubm9tYnJlLFxuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wubGFiZWxcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxYXJyYXkgPSBbXTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRBbGxJdGVtcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRPYnNlcnZhY2lvbigpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRLaWxvbWV0cmFqZSgpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocWFycmF5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBzZXJ2aWNpbyBpbnNwZWNjaW9uJyk7XG4gICAgICAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKCdpbmdyZXNvIG9rJywgcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRBbGxJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRwcm9waWVkYWRlc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAsW2lkaXRlbV0sW2lkcGFyZW50aXRlbV0gICxbbm9tYnJlXSAsW2lkb3BjaW9uXSAgLFtzZWxlY2Npb25dICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZ3MgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgYmluZGluZ3MucHVzaChfcnRuQmluZGluZyhvYmopKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRPYnNlcnZhY2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbb2JzZXJ2YWNpb25lc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAgLFtvYnNlcnZhY2lvbl0sIFtwbGFjYV0pICAgVkFMVUVTICg/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5LFxuICAgICAgICAvL19jbC50aXBvLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0S2lsb21ldHJhamUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2tpbG9tZXRyYWplc10gICAgICAgIChbaWRpbnNwZWNjaW9uXSwgW2tpbG9tZXRyYWplXSwgW3BsYWNhXSkgICAgICBWQUxVRVMgKD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmdVcGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLmxhYmVsLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NsID0ge1xuICAgICAgaWRjbGFzZTogbnVsbCxcbiAgICAgIGlkY2Fycm9jZXJpYTogbnVsbCxcbiAgICAgIHRpcG86IG51bGxcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBbXTtcbiAgICAvLyBUT0RPOiBwYXJhIGxhIGltcGxlbWVudGFjaW9uIGRlIHBlc2Fkb3MgeSBtb3RvcywgeWEgc2kgZGViZSBzZXIgdW5hIGNvbnN1bHRhXG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnRpcG9zID0gW3tcbiAgICAgICAgdmFsdWU6IDgyOSxcbiAgICAgICAgbGFiZWw6ICdMaXZpYW5vcydcbiAgICAgIH0gIC8vICxcbiAgICAgICAgIC8vIHtcbiAgICAgICAgIC8vICAgdmFsdWU6IDg0NCxcbiAgICAgICAgIC8vICAgbGFiZWw6ICdQZXNhZG9zJ1xuICAgICAgICAgLy8gfVxuXTtcbiAgICB2YXIgX2dldENsYXNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChfY2wudGlwbykgJiYgYW5ndWxhci5pc051bWJlcihwYXJzZUludChfY2wudGlwbykpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGRpc3RpbmN0IGNjLmlkY2xhc2UgYXMgdmFsdWUgICwgYnQuTm9tYnJlIGFzIGxhYmVsICBGUk9NIGNsYXNlc190aXBvVmVoaWN1bG8gY3QgIGlubmVyIGpvaW4gICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjbGFzZT1jdC5pZGNsYXNlICAgaW5uZXIgam9pbiBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz1jYy5pZGNsYXNlICB3aGVyZSBjdC5pZHRpcG92ZWhpY3Vsbz0/JztcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbcGFyc2VJbnQoX2NsLnRpcG8pXTtcbiAgICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBUT0RPOiBBU0kgTk8gU0lSVkUgLCBubyBzZSBhY3R1YWxpemEgZWwgZXhwdWVzdG8gLCxfY2xhc2VzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgX2NsLmlkY2xhc2UgPSBudWxsO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IFtdO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoX2NsLmlkY2xhc2UpICYmIGFuZ3VsYXIuaXNOdW1iZXIocGFyc2VJbnQoX2NsLmlkY2xhc2UpKSkge1xuICAgICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBkaXN0aW5jdCBjYy5pZGNhcnJvY2VyaWEgYXMgdmFsdWUgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gICAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2Fycm9jZXJpYSAgIHdoZXJlIGNjLmlkY2xhc2U9Pyc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW3BhcnNlSW50KF9jbC5pZGNsYXNlKV07XG4gICAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIF9jbC5pZGNhcnJvY2VyaWEgPSBudWxsO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgW2lkY2xhc2VjYXJyb2NlcmlhXSAsW2lkY2xhc2VdICxbaWRjYXJyb2NlcmlhXSAgLFtpZGNvZGlnb2NhbGlmaWNhY2lvbl0gICxbaWRleHRyYWluZm9dICAgRlJPTSBbY2xhc2VzX2NhcnJvY2VyaWFzXSBXSEVSRSBpZGNsYXNlPT8gYW5kIGlkY2Fycm9jZXJpYT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2xhc2UpLFxuICAgICAgICBwYXJzZUludChfY2wuaWRjYXJyb2NlcmlhKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGNsYXNlY2Fycm9jZXJpYTtcbiAgICAgICAgcmV0dXJuIF9nZXRUb0luc3BlY3Qoc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkY29kaWdvY2FsaWZpY2FjaW9uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRKc29uID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHZhbHVlLmNvbnRyb2xKc29uID0gYW5ndWxhci5mcm9tSnNvbih2YWx1ZS5jb250cm9sSnNvbik7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUuY29udHJvbEpzb25bMF0udmFsdWUsXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmNvbnRyb2xKc29uWzBdLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24gPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFsdWUuY29udHJvbEpzb24gPSBhbmd1bGFyLmZyb21Kc29uKHZhbHVlLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gVE9ETzogZWwganNvbiBkZSBjb250cm9sSnNvbiBkZXZ1ZWx2ZSB1biB2YWx1ZT0gXCJcIiBzdHJpbmcsIHZlciBzaSBzZSBwdWVkZSBtZWpvcmFyO1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLnZhbHVlLnRvU3RyaW5nKCksXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9jbGVhck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUgPSAnJztcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gJyc7XG4gICAgfTtcbiAgICAvLyB2YXIgX2NsZWFyVGlwbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbC5pZGNsYXNlID0ge1xuICAgIC8vICAgICBpZGNsYXNlOiBudWxsLFxuICAgIC8vICAgICBpZGNhcnJvY2VyaWE6IG51bGwsXG4gICAgLy8gICAgIHRpcG86IG51bGxcbiAgICAvLyAgIH07XG4gICAgLy8gfTtcbiAgICB2YXIgX2dldFRvSW5zcGVjdCA9IGZ1bmN0aW9uIChpZGNvZGlnb2NhbGlmaWNhY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBvaWYuaWRzZXJ2aWNpbyAsIGNwYy5pZGl0ZW0sIGlkUGFyZW50SXRlbSwgbm9tYnJlLGN1c3RvbXNlY3Rpb24sIGN1c3RvbW9yZGVyICwgY29udHJvbEpzb24gZnJvbSAgdmlld1YzIG9pZiAnO1xuICAgICAgLy9zaWVtcHJlIGRlamFyIHVuIGVzcGFjaW8gZW4gYmxhbmNvICBcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNhbGlmaWNhY2lvbnBpZXphc2NvZGlnbyBjcGMgb24gIGNwYy5pZGl0ZW09IG9pZi5pZGl0ZW0gIGFuZCBvaWYudGlwbz0xICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjb250cm9sRWxlbWVudG9zIGNlIG9uIGNlLmlkY29udHJvbCA9b2lmLmlkY29udHJvbCAnO1xuICAgICAgcXVlcnkgKz0gJ3doZXJlIG9pZi5pZHNlcnZpY2lvPT8gYW5kIGNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICA4MjksXG4gICAgICAgIC8vcGFyc2VJbnQoX2NsLnRpcG8pLFxuICAgICAgICBpZGNvZGlnb2NhbGlmaWNhY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICBfY2xlYXJPYnNLbSgpOyAgLy8gX2NsZWFyVGlwbygpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3Nlck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgICBvLmlkb2JzZXJ2YWNpb24sICAgb2JzZXJ2YWNpb24sIGtpbG9tZXRyYWplIEZST00gICBvYnNlcnZhY2lvbmVzIG8gaW5uZXIgam9pbiBraWxvbWV0cmFqZXMgayBvbiBrLmlkaW5zcGVjY2lvbj1vLmlkaW5zcGVjY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFICAgICAoby5pZGluc3BlY2Npb24gPSA/KSBBTkQgKGlkc3VicHJvY2VzbyA9ID8pIE9yZGVyIGJ5IG8uaWRvYnNlcnZhY2lvbiBkZXNjIGxpbWl0IDEgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgb2JzS20gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF07XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gb2JzS20ub2JzZXJ2YWNpb247XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gb2JzS20ua2lsb21ldHJhamU7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgb2lmLmlkUGFyZW50SXRlbSwgb2lmLm5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uICwgaWRwLmlkb3BjaW9uIGFzIHZhbHVlLCBpZHAuc2VsZWNjaW9uIGFzIGxhYmVsICc7XG4gICAgICBxdWVyeSArPSAnZnJvbSAgdmlld1Zkb3Mgb2lmIGlubmVyIGpvaW4gY2FsaWZpY2FjaW9ucGllemFzY29kaWdvIGNwYyBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjIG9uIGNjLmlkY29kaWdvY2FsaWZpY2FjaW9uPWNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRpbnNwZWNjaW9uIGkgb24gaS5pZENsYXNlQ2Fycm9jZXJpYT1jYy5pZGNsYXNlY2Fycm9jZXJpYSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRwcm9waWVkYWRlcyBpZHAgb24gaWRwLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbiBhbmQgaWRwLmlkaXRlbSA9IGNwYy5pZGl0ZW0gJztcbiAgICAgIHF1ZXJ5ICs9ICd3aGVyZSAgaS5pZGluc3BlY2Npb24gPT8gYW5kIG9pZi5pZHNlcnZpY2lvPT8gICAgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBfc2V0QWxyZWFkeUluc3BlY3RKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICByZXR1cm4gX3Nlck9ic0ttKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZGluc3BlY2Npb25dICAgU0VUIFtpZENsYXNlQ2Fycm9jZXJpYV0gPT8gV0hFUkUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfaW5zZXJ0U3RhdGUoNDc3KTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRTdGF0ZSA9IGZ1bmN0aW9uIChpZGVzdGFkbykge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHN1YnByb2Nlc29zZWd1aW1pZW50b10gKFtpZGluc3BlY2Npb25dICAgICxbaWRzdWJwcm9jZXNvXSAgICxbaWRlc3RhZG9dICAgLFtmZWNoYV0gICkgIFZBTFVFUyAgICAoPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9fY2wudGlwbyxcbiAgICAgICAgaWRlc3RhZG8sXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSB0cnVlO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7ICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wudGlwbyA9IG51bGw7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbCA9IF9jbDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2xhc2VzID0gX2dldENsYXNlcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2Fycm9jZXJpYXMgPSBfZ2V0Q2Fycm9jZXJpYXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNldElkQ2xhQ2EgPSBfc2V0SWRDbGFDYTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0QWxyZWFkeUluc3BlY3QgPSBfZ2V0QWxyZWFkeUluc3BlY3Q7XG4gICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsZWFyVGlwbyA9IF9jbGVhclRpcG87XG4gICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1BsYWNhc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdmaXJzdEluaXRTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gICckZmlsdGVyJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCB0aXRsZVNlcnZpY2UsICRpb25pY01vZGFsLCB0b2FzdFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRmaWx0ZXIsIGludGVybWVkaWF0ZVNlcnZpY2UsICR0aW1lb3V0KSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgLy8gcGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vIHBzID0gcGxhY2FzU2VydmljZTtcbiAgICAgIC8vIHBjID0gJHNjb3BlO1xuICAgICAgLy8gJHNjb3BlLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLm9iaiA9IHsgZmlsdGVyOiAnJyB9O1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAkc2NvcGUucGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZS5hbGwpO1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gJ1BsYWNhcyc7XG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NhcmdhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuZ2V0UGxhY2FzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5mSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlyc3RJbml0U2VydmljZS5pbml0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLmhpZGUoKTtcbiAgICAgICAgICAkc2NvcGUuZ2V0UGxhY2FzKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAvLyBUT0RPOiBzZXJpYSBidWVubyBxdWUgbGEgY29uc3VsdGEgZGUgcGxhY2FzIHN1cGllcmEgdG9kbywgY29tbyBwb3IgZWplbXBsbyBzaSB5YSBzZSBjYWxpZmljbywgc2kgeWEgdGllbmUgYWxndW5hIGZvdG8gbyB1biB2aWRlbywgcHVlZGUgc2VyIG1hcmNhbmRvbG8gY29uIGFsZ3VuYSBjbGFzZVxuICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLmRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnNob3coKTtcbiAgICAgICAgLy8gVE9ETzogcHVlZG8gcG9kZXIgb2JqPW51bGwsIHBhcmEgcXVlIG1lIGVsaW1pbmUgbGEgYmFzZSBkZSBkYXRvcyBzaSB5YSBlc3RhIGNyZWFkYSB5IHZ1ZWx2YSBhIHNpbmNyb25pemFyLCBlc3RvIHNlcmlhIGJlbmVmaWNpb3NvIHNpIHRlbmdvIHF1ZSBoYWNlciB1biBjYW1iaW8gZW4gbGEgYmFzZSBkZSBkZGF0b3MgcXVlIHJlcXVpZXJhIHJlY29uc3RydWlybGFcbiAgICAgICAgJHRpbWVvdXQoJHNjb3BlLmZJbml0LCAzMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmdldFBsYWNhcygpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnBsYWNhUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IG9yZ2FuaXphciBlbCBmb2N1cyBlbiBlbCBpbnB1dCBkZWwgcG9wdXBcbiAgICAgICAgdmFyIG15cHJvbXB0ID0gJGlvbmljUG9wdXAucHJvbXB0KHtcbiAgICAgICAgICB0aXRsZTogJ051ZXZhIFBsYWNhJyxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ0luZ3Jlc2UgbGEgbnVldmEgcGxhY2EnLFxuICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnLFxuICAgICAgICAgIGlucHV0UGxhY2Vob2xkZXI6ICdQbGFjYSdcbiAgICAgICAgfSk7XG4gICAgICAgIG15cHJvbXB0LnRoZW4oZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgICAgJHNjb3BlLmFkZFBsYWNhKHBsYWNhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmFkZFBsYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHBsYWNhKSkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3ZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZScpO1xuICAgICAgICAgIC8vIGFsZXJ0KFwidmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2EubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2xvbmdpdHVkIGRlIHBsYWNhIG11eSBjb3J0YScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLnBsYWNhcywgeyBwbGFjYTogcGxhY2EgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdwbGFjYSB5YSByZWdpc3RyYWRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnSW5ncmVzYW5kbyBudWV2YSBwbGFjYScpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlLmluc2VydFBMYWNhKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5wbGFjYXMgPSBwbGFjYXNTZXJ2aWNlLmFsbDtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAkc2NvcGUuc2V0Rm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IHRydWU7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgZm9jdXMuZm9jdXMoJ3NlYXJjaFByaW1hcnknKTsgIC8vbm8gZXMgbmVjZXNhcmlvIGFicmlyIGVsIGtleWJvYXJkIHNlIGFicmUgc29sbyBjdWFuZG8gYXNpZ25hbW9zIGVsIGZvY3VzIC8vIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm5vRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnJyk7XG4gICAgICAgICRzY29wZS5vYmouZmlsdGVyID0gJyc7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNldEludERhdGEgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIC8vIFRPRE86IHNpIGxhcyBwbGFjYXMgc29uIGlndWFsZXMsIHB1ZWRlIHNlciBxdWUgc2UgaGF5YSBzaW5jcm9uaXphZG8geSBubyBzZSBoYXlhIGFjeWF1bGl6YWRvIGxhIGxpc3RhIGRlIHBsYWNhcywgZW50b25jZXMgc2UgcGFzYXJpYSB1biBpZGluc3BlY2Npb24gcXVlIG5vICxlcyBlc3RvIGN1YW5kbyBvZmZsaW5lIGNyZW8gdW5hIHBsYWNhLCBtZSBwb25nbyBvbmxpbmUgeSBsdWVnbyBvbiBwYXVzZSBoYWdvIGVsIHN5bmMsIGF1bnF1ZSBoYXlxIHVlIHBlbnNhciBxdWUgY3VhbmRvIGxlIHBvbmdvIG9ubGluZSwgZGViZXJpYSBzaW5jcm9uaXphciBzaSBoYXkgc2XDsWFsIDRnIG8gd2lmaSBwYXJhIGltYWdlbmVzIG8gcGFyYSB0b2RvXG4gICAgICAgIGlmIChvYmoucGxhY2EgIT09IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkge1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSA9IG9iai5wbGFjYTtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IG9iai5zeW5jID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSBvYmouaWRpbnNwZWNjaW9uO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvRm90b3MgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmZvdG8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pOyAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvZm90b3MvJyArIG9iai5pZGluc3BlY2Npb24pOyAgLy8gVE9ETzogY2FtYmlhciBwb3Igc3RhdGUuZ28gbWFzIHBhcmFtZXRyb3MsIHZlciBiZXN0IHByYWN0aWNlc1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb1ZpZGVvID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC92aWRlby8nICsgb2JqLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnZpZGVvJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29JbnNwZWNjaW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyBUT0RPOiBhcXVpIHBvZHJpYSBldmFsdWFyIHNpIHlhIHNlIGNhbGlmaWNvIG8gbm8sIHNpIG5vIHNlIGhhIGNhbGlmaWNhZG8gcG9kcmlhIGRlc3BsZWdhciBlbCBtb2RhbCBkZSBjbGFzZSBjYXJyb2NlcmlhXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgICAgICAgaWQ6IG9iai5pZGluc3BlY2Npb24sXG4gICAgICAgICAgcGxhY2E6IG9iai5wbGFjYSxcbiAgICAgICAgICBjYWxpZmljYWRvOiBvYmouY2FsaWZpY2Fkb1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29BY2Nlc29yaW9zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hY2Nlc29yaW9zJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29Db2RGYXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmNvZEZhcycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNyZWF0ZUV4Y2VwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchJyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgncGxhY2FzU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHJvb3RTY29wZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2F1dGhTZXJ2aWNlJyxcbiAgJ2RldmljZVNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3VwZGF0ZVN5bmNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRyb290U2NvcGUsIG1vbWVudFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1cGRhdGVTeW5jU2VydmljZSkge1xuICAgIHZhciBwbGFjYXNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIHZhciBfc2VsZWN0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRlc3QgPSBbe1xuICAgICAgICAgIGlkaW5zcGVjY2lvbjogMSxcbiAgICAgICAgICBwbGFjYTogJ2FiYzExMSdcbiAgICAgICAgfV07XG4gICAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh0ZXN0KTsgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFBsYWNhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGkuaWRpbnNwZWNjaW9uLCBwbGFjYSwgaS5zeW5jLCAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgY2FzZSB3aGVuIGlzcy5pZGluc3BlY2Npb24gaXMgbnVsbCB0aGVuIDAgZWxzZSAxIGVuZCBhcyBjYWxpZmljYWRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgIGZyb20gaWRpbnNwZWNjaW9uIGkgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgIGxlZnQgam9pbiAoc2VsZWN0IGlkaW5zcGVjY2lvbiBmcm9tICBpZHN1YnByb2Nlc29zZWd1aW1pZW50byAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgICAgICAgICAgIHdoZXJlIGlkZXN0YWRvPTQ3NykgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgaXNzIG9uIGlzcy5pZGluc3BlY2Npb249aS5pZGluc3BlY2Npb24nO1xuICAgICAgcXVlcnkgKz0gJyAgICAgIFdIRVJFIFVzZXJOYW1lPT8gYW5kIGZlY2hhPiA/JztcbiAgICAgIHF1ZXJ5ICs9ICcgT3JkZXIgYnkgaS5pZGluc3BlY2Npb24gREVTQyBMaW1pdCAxMCc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCk7XG4gICAgICAgIF9pbnNlcnREZXZpY2UoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHZhciBfdXBkYXRlU3luYyA9IGZ1bmN0aW9uIChwbGFjYSwgc3luYykge1xuICAgIC8vICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGluc3BlY2Npb24gc2V0IHN5bmM9PyAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+Pyc7XG4gICAgLy8gICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgIC8vICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgLy8gICAgIHN5bmMsXG4gICAgLy8gICAgIHBsYWNhLFxuICAgIC8vICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAvLyAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIC8vICAgXTtcbiAgICAvLyAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIC8vIH07XG4gICAgdmFyIF9pbnNlcnRQTGFjYSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkaW5zcGVjY2lvbihwbGFjYSwgZmVjaGEsVXNlck5hbWUsdXVpZCwgc3luYykgVkFMVUVTICg/LD8sPyw/LCA/KSc7XG4gICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAvLyAwIG1lYW5zIGZhbHNlXG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS51dWlkLFxuICAgICAgICBzeW5jXG4gICAgICBdO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gcGxhY2E7XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRQbGFjYXMoKTsgIC8vIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh7XG4gICAgICAgIC8vICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAvLyAgIGlkaW5zcGVjY2lvbjogcmVzLmluc2VydElkXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gcmVzLmluc2VydElkO1xuICAgICAgICAvKiByZXR1cm4genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3Igb24genVtZXJvIHN5bmMgZGVzZGUgcHMnKTtcbiAgICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgICB9KTsqL1xuICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBPUiBJR05PUkUgSU5UTyBbZGV2aWNlc10oW3V1aWRdLFttb2RlbF0pICBWQUxVRVMoPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS5tb2RlbFxuICAgICAgXTtcbiAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5zZWxlY3RBbGwgPSBfc2VsZWN0QWxsO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmdldFBsYWNhcyA9IF9nZXRQbGFjYXM7XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuaW5zZXJ0UExhY2EgPSBfaW5zZXJ0UExhY2E7XG4gICAgLy8gcGxhY2FzU2VydmljZUZhY3RvcnkuaW5zZXJ0RGV2aWNlID0gX2luc2VydERldmljZTtcbiAgICByZXR1cm4gcGxhY2FzU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdhY2Nlc29yaW9zU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHEnLFxuICAnJGZpbHRlcicsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcSwgJGZpbHRlciwgZXJyb3JTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gICAgdmFyIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBbXTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gZmFsc2U7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbiA9IDA7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0gPSB7fTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEgPSB7fTtcbiAgICB2YXIgX2dldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRhY2Nlc29yaW9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2FjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldCBpdGVtcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfbm9tYnJlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ3RleHRhJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICd0ZXh0YicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX2VzdGFkb3MgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdlc3RhZG9hJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdlc3RhZG9iJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfY2FudGlkYWRlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJzEnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJzInLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9zZXROb21icmVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIxJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb24pO1xuICAgICAgICAvLyB2YXIganNvbiA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYW5ndWxhci5mcm9tSnNvbihqc29uKSk7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5ub21icmVzID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pOyAgLy9hbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0RXN0YWRvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMCc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmVzdGFkb3MgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0Q2FudGlkYWRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMic7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmNhbnRpZGFkZXMgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUT0RPOiAgdW5hIGJhbmRlcmEgcGFyYSBzYWJlciBxdWUgeWEgc2Ugc2V0aW8sIHVuYSB2ZXosIHkgZXZpdGFyIG1hcyBjb25zdWxhdHMsIGEgbWVub3MgcXVlIHNlIGhhZ2EgdW5hIGFjdHVhbGl6YWNpb24gZGVsIHNlcnZpZG9yXG4gICAgICB2YXIgcWFycmF5ID0gW107XG4gICAgICBxYXJyYXkucHVzaChfc2V0Tm9tYnJlcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXRDYW50aWRhZGVzKCkpO1xuICAgICAgcWFycmF5LnB1c2goX3NldEVzdGFkb3MoKSk7XG4gICAgICByZXR1cm4gJHEuYWxsKHFhcnJheSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbml0QWNjID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVE9ETzogc2VyaWEgYnVlbm8gaW5pY2lhciBlc3RvcyBkZGwgc2luIHZhbG9yZXMsICBwZXJvIHRlbmRyaWEgcXVlIHZhbGlkYXIgcXVlIHNpIHNlIHNlbGVjY2lvbmUgYWxnbztcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtID0ge1xuICAgICAgICBub21icmU6IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5ub21icmVzWzBdLFxuICAgICAgICBlc3RhZG86IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5lc3RhZG9zWzBdLFxuICAgICAgICBjYW50aWRhZDogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmNhbnRpZGFkZXNbMF0sXG4gICAgICAgIHZhbG9yOiAwLFxuICAgICAgICBtYXJjYTogJycsXG4gICAgICAgIHJlZmVyZW5jaWE6ICcnLFxuICAgICAgICBpbWc6IHtcbiAgICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgICBzeW5jOiBmYWxzZSxcbiAgICAgICAgICBvblVwbG9hZDogZmFsc2UsXG4gICAgICAgICAgaWRpbnNwZWNjaW9uOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW07XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLFxuICAgICAgICBvYmoubm9tYnJlLmxhYmVsLFxuICAgICAgICBvYmouZXN0YWRvLmxhYmVsLFxuICAgICAgICBwYXJzZUludChvYmouY2FudGlkYWQudmFsdWUpLFxuICAgICAgICBvYmoubWFyY2EsXG4gICAgICAgIG9iai5yZWZlcmVuY2lhLFxuICAgICAgICBvYmoudmFsb3IsXG4gICAgICAgIG9iai5pbWcucGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF9zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZGFjY2Vzb3Jpb3NdIChbaWRpbnNwZWNjaW9uXSAsW3BsYWNhXSAsW25vbWJyZV0gLFtlc3RhZG9dICxbY2FudGlkYWRdICxbbWFyY2FdICxbcmVmZXJlbmNpYV0sW3ZhbG9yXSxbaW1nU3JjXSkgVkFMVUVTICAoPyw/LD8sPyw/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmcoYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRJdGVtcygpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmdVcGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLnRleHQsXG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZGl0ZW1cbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlU2luZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRwcm9waWVkYWRlc10gc2V0IFtpZG9wY2lvbl09PyAsIFtzZWxlY2Npb25dPSA/IFdIRVJFIFtpZGluc3BlY2Npb25dPT8gYW5kIFtpZGl0ZW1dPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmdVcGRhdGUoYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzaW5nbGUnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0T3B0aW9ucyA9IF9pbml0T3B0aW9ucztcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdEFjYyA9IF9pbml0QWNjO1xuICAgIHJldHVybiBhY2Nlc29yaW9zU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJywgW1xuICAnJHEnLFxuICAnJGxvY2F0aW9uJyxcbiAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAnJGluamVjdG9yJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnc3FsaXRlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkaW5qZWN0b3IsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UpIHtcbiAgICB2YXIgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3JlcXVlc3QgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9O1xuICAgIHZhciBfcmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgIC8vIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7XG4gICAgICAvLyB2YXIgcXVlcnkgPSAnSU5TRVJUICBJTlRPIFtsb2dzXShbZXhdLFtlbWFpbF0sW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyknO1xuICAgICAgLy8gdmFyIGJpbmRpbmcgPSBbXG4gICAgICAvLyAgIGFuZ3VsYXIudG9Kc29uKHJlamVjdGlvbiksXG4gICAgICAvLyAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lIHx8ICcnLFxuICAgICAgLy8gICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgIC8vIF07XG4gICAgICAvLyBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAvLyB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAvLyAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIC8vIH0pO1xuICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgaWYgKGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcmVmcmVzaCcpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgIH07XG4gICAgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkucmVxdWVzdCA9IF9yZXF1ZXN0O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlc3BvbnNlRXJyb3IgPSBfcmVzcG9uc2VFcnJvcjtcbiAgICByZXR1cm4gYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdhdXRoU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgJyRxJyxcbiAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkaHR0cCwgJHEsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHNlcnZpY2VCYXNlID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmk7XG4gICAgdmFyIGF1dGhTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfYXV0aGVudGljYXRpb24gPSB7XG4gICAgICBpc0F1dGg6IGZhbHNlLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICBsYXN0TG9naW5nOiAnJ1xuICAgIH07XG4gICAgdmFyIF9leHRlcm5hbEF1dGhEYXRhID0ge1xuICAgICAgcHJvdmlkZXI6ICcnLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogJydcbiAgICB9O1xuICAgIHZhciBfc2F2ZVJlZ2lzdHJhdGlvbiA9IGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcbiAgICAgIF9sb2dPdXQoKTtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L3JlZ2lzdGVyJywgcmVnaXN0cmF0aW9uKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfbG9naW4gPSBmdW5jdGlvbiAobG9naW5EYXRhKSB7XG4gICAgICB2YXIgZGF0YSA9ICdncmFudF90eXBlPXBhc3N3b3JkJnVzZXJuYW1lPScgKyBsb2dpbkRhdGEudXNlck5hbWUgKyAnJnBhc3N3b3JkPScgKyBsb2dpbkRhdGEucGFzc3dvcmQgKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAvL3NpZW1wcmUgdm95IGEgbWFuZGFyIGVsIGNsaWVudGlkXG4gICAgICAvKmlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xyXG4gICAgICAgICAgIGRhdGEgPSBkYXRhICsgXCImY2xpZW50X2lkPVwiICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XHJcbiAgICAgICB9Ki9cbiAgICAgIC8vdGVuZ28gcXVlIHJldmlzYXIgbG9zIGNyb3NzIG9yaWdpbiwgZW4gbGEgYmFzZSBkZSBkYXRvcyAsIHkgaGFiaWxpdGFybG8gZW4gZWwgbmF2ZWdhZG9yIGNocm9tZSAsIGltcG9ydGFudGVcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgZCA9IG1vbWVudCgpO1xuICAgICAgJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICd0b2tlbicsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKVxuICAgICAgICBycCA9IHJlc3BvbnNlO1xuICAgICAgICBpZiAobG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgdXNlck5hbWU6IGxvZ2luRGF0YS51c2VyTmFtZSxcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2UucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IHRydWUsXG4gICAgICAgICAgICBsYXN0TG9naW46IGQgIC8vICxcbiAgICAgICAgICAgICAgIC8vIGV4cDptb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuLFxuICAgICAgICAgICAgZXhwOiBtb21lbnRTZXJ2aWNlLmFkZFNlY29uZHMocmVzcG9uc2UuZXhwaXJlc19pbilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgdXNlck5hbWU6IGxvZ2luRGF0YS51c2VyTmFtZSxcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3RMb2dpbjogZCAgLy8gLFxuICAgICAgICAgICAgICAgLy8gZXhwOm1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJylcbixcbiAgICAgICAgICAgIGV4cDogbW9tZW50U2VydmljZS5hZGRTZWNvbmRzKHJlc3BvbnNlLmV4cGlyZXNfaW4pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5sYXN0TG9naW5nID0gbW9tZW50KCk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IGxvZ2luRGF0YS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBsb2dpbkRhdGEudXNlUmVmcmVzaFRva2VucztcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX2xvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IGZhbHNlO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gJyc7XG4gICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgIH07XG4gICAgdmFyIF9maWxsQXV0aERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gYXV0aERhdGEudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gYXV0aERhdGEudXNlUmVmcmVzaFRva2VucztcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfcmVmcmVzaFRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIGlmIChhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSAnZ3JhbnRfdHlwZT1yZWZyZXNoX3Rva2VuJnJlZnJlc2hfdG9rZW49JyArIGF1dGhEYXRhLnJlZnJlc2hUb2tlbiArICcmY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZDtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ3Rva2VuJywgZGF0YSwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9IH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZS5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9vYnRhaW5BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uIChleHRlcm5hbERhdGEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyAnYXBpL2FjY291bnQvT2J0YWluTG9jYWxBY2Nlc3NUb2tlbicsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgcHJvdmlkZXI6IGV4dGVybmFsRGF0YS5wcm92aWRlcixcbiAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBleHRlcm5hbERhdGEuZXh0ZXJuYWxBY2Nlc3NUb2tlblxuICAgICAgICB9XG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IHJlc3BvbnNlLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfcmVnaXN0ZXJFeHRlcm5hbCA9IGZ1bmN0aW9uIChyZWdpc3RlckV4dGVybmFsRGF0YSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAnYXBpL2FjY291bnQvcmVnaXN0ZXJleHRlcm5hbCcsIHJlZ2lzdGVyRXh0ZXJuYWxEYXRhKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IHJlc3BvbnNlLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5zYXZlUmVnaXN0cmF0aW9uID0gX3NhdmVSZWdpc3RyYXRpb247XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmxvZ2luID0gX2xvZ2luO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5sb2dPdXQgPSBfbG9nT3V0O1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5maWxsQXV0aERhdGEgPSBfZmlsbEF1dGhEYXRhO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5hdXRoZW50aWNhdGlvbiA9IF9hdXRoZW50aWNhdGlvbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVmcmVzaFRva2VuID0gX3JlZnJlc2hUb2tlbjtcbiAgICBhdXRoU2VydmljZUZhY3Rvcnkub2J0YWluQWNjZXNzVG9rZW4gPSBfb2J0YWluQWNjZXNzVG9rZW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmV4dGVybmFsQXV0aERhdGEgPSBfZXh0ZXJuYWxBdXRoRGF0YTtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVnaXN0ZXJFeHRlcm5hbCA9IF9yZWdpc3RlckV4dGVybmFsO1xuICAgIHJldHVybiBhdXRoU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjaGVja0ZpbGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEpIHtcbiAgICB2YXIgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgICAgRmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZSA9IGZpbGU7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX2NoZWNrRmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgLy8gdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNoZWNrRmlsZShwYXRoLCBGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIHJldHVybiBfZmlsZURldGFpbChGaWxlRW50cnkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5jaGVja0ZpbGUgPSBfY2hlY2tGaWxlO1xuICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVEZXRhaWwgPSBfZmlsZURldGFpbDtcbiAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjb3B5RmlsZVNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNvcHlGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICAvLyB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgLy8gICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIC8vICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICBGaWxlRW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgIC8vICAgICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGUgPSBmaWxlO1xuICAgIC8vICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIC8vIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gRmlsZU5hbWU7XG4gICAgICAvLyAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUocGF0aCwgRmlsZU5hbWUsIGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBuZXdGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIC8vIHJldHVybiBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeT1GaWxlRW50cnk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVEZXRhaWwoRmlsZUVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICByZXR1cm4gY29weUZpbGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NvcmRvdmFFdmVudHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9vblJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZXN1bWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgYXBwbGljYXRpb24gaXMgcmVzdW1pbmcgZnJvbSB0aGUgYmFja2dyb3VuZCcpO1xuICAgICAgfSwgMCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuICB2YXIgX29uUGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9jYWxsWnluYygpO1xuICAgICAgICBjb25zb2xlLmxvZygnVGhlIGFwcGxpY2F0aW9uIGlzIHBhdXNpbmcgdG8gdGhlIGJhY2tncm91bmQnKTtcbiAgICAgIH0sIDApO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcbiAgdmFyIF9jYWxsWnluYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBldmFsdWFyIHRvZGFzIGxhcyBwb3NpYmlsaWRhZGVzIGRlIGVzdG8gYWNhLCBwb3IgcXVlIHNpIGxhIHNlw7FhbCBlcyBtdXkgbWFsYSBxdWUgcHVlZGUgcGFzYXIsIGF1bnF1ZSBlbCB6eW5jIGRlIGJhc2VzIGRlIGRhdG9zIG51bmNhIGhhc2lkbyBtdXkgZ3JhbmRlIGVuIGluZm9ybWFjaW9uXG4gICAgaWYgKG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSAmJiAhaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljICYmICFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQpIHtcbiAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKTtcbiAgICB9XG4gIH07XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblBhdXNlID0gX29uUGF1c2U7XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblJlc3VtZSA9IF9vblJlc3VtZTtcbiAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5LmNhbGxaeW5jID0gX2NhbGxaeW5jO1xuICByZXR1cm4gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2NyZWF0ZURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9jcmVhdGVEaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNyZWF0ZURpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgZGlyKS50aGVuKGZ1bmN0aW9uIChzdWNjZXMpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2NlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY3JlYXRlRGlyU2VydmljZUZhY3RvcnkuY3JlYXRlRGlyID0gX2NyZWF0ZURpcjtcbiAgICByZXR1cm4gY3JlYXRlRGlyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gKCRjb3Jkb3ZhRGV2aWNlKSB7XG4gIHZhciBkZXZpY2VTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3NldEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgZGV2aWNlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGRldmljZTogJGNvcmRvdmFEZXZpY2UuZ2V0RGV2aWNlKCksXG4gICAgICBjb3Jkb3ZhOiAkY29yZG92YURldmljZS5nZXRDb3Jkb3ZhKCksXG4gICAgICBtb2RlbDogJGNvcmRvdmFEZXZpY2UuZ2V0TW9kZWwoKSxcbiAgICAgIHBsYXRmb3JtOiAkY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpLFxuICAgICAgdXVpZDogJGNvcmRvdmFEZXZpY2UuZ2V0VVVJRCgpLFxuICAgICAgdmVyc2lvbjogJGNvcmRvdmFEZXZpY2UuZ2V0VmVyc2lvbigpXG4gICAgfTtcbiAgfTtcbiAgZGV2aWNlU2VydmljZUZhY3Rvcnkuc2V0SW5mbyA9IF9zZXRJbmZvO1xuICByZXR1cm4gZGV2aWNlU2VydmljZUZhY3Rvcnk7XG59KTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ2RsdEZpbGVTcnYnLCBkbHRGaWxlU3J2KTtcbiAgZGx0RmlsZVNydi4kaW5qZWN0ID0gWyckY29yZG92YUZpbGUnXTtcbiAgZnVuY3Rpb24gZGx0RmlsZVNydigkY29yZG92YUZpbGUpIHtcbiAgICB2YXIgZGx0RmlsZUZhYyA9IHsgZGx0SW1nOiBkbHRJbWcgfTtcbiAgICByZXR1cm4gZGx0RmlsZUZhYztcbiAgICAvLyBib2R5Li4uXG4gICAgZnVuY3Rpb24gZGx0SW1nKGZ1bGxQYXRoKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBmdWxsUGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICB2YXIgcGF0aCA9IGZ1bGxQYXRoLnN1YnN0cmluZygwLCBmdWxsUGF0aC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLnJlbW92ZUZpbGUocGF0aCwgRmlsZU5hbWUpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuZmFjdG9yeSgnZWFzeURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlKSB7XG4gICAgdmFyIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfY3JlYXRlRGlyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvZGF5ID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICB2YXIgQ3VycmVudERhdGUgPSBtb21lbnQoKS51bml4KCk7XG4gICAgICAkY29yZG92YUZpbGUuY2hlY2tEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIHRvZGF5KS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbHJlYWR5ZXhpc3QnKTsgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAkY29yZG92YUZpbGUuY3JlYXRlRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCB0b2RheSwgZmFsc2UpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGlyIGNyZWF0ZWQnLCB0b2RheSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY3JlYXRlZCBkaXInLCB0b2RheSk7XG4gICAgICAgIH0pOyAgLy8gZXJyb3JcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZWFzeURpclNlcnZpY2VGYWN0b3J5LmNyZWF0ZURpciA9IF9jcmVhdGVEaXI7XG4gICAgcmV0dXJuIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2Vycm9yU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgZXJyb3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2NvbnNvbGVFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gIH07XG4gIGVycm9yU2VydmljZUZhY3RvcnkuY29uc29sZUVycm9yID0gX2NvbnNvbGVFcnJvcjtcbiAgcmV0dXJuIGVycm9yU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZmlsZVRyYW5zZmVyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZVRyYW5zZmVyJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZVRyYW5zZmVyKSB7XG4gICAgdmFyIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDE3MDAwO1xuICAgIHZhciBfZmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG9iai5wYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIHZhciBmaWxlRXh0ID0gb2JqLnBhdGguc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdleHRlbnNpb24nLCBmaWxlRXh0KTtcbiAgICAgIHZhciBtaW1ldHlwZSA9ICdpbWFnZS9qcGVnJztcbiAgICAgIC8vIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAyMDAwMDtcbiAgICAgIGlmIChmaWxlRXh0ID09PSAnbXA0Jykge1xuICAgICAgICBtaW1ldHlwZSA9ICd2aWRlby9tcDQnO1xuICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gNjAwMDA7XG4gICAgICB9XG4gICAgICB2YXIgc2VydmVyID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoL2FwaS9maWxlJztcbiAgICAgIC8vICdodHRwczovL3d3dy5hanVzdGV2c2l2YS5jb20vYXV0aC9hcGkvZmlsZSc7XG4gICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgb3B0aW9ucy5maWxlS2V5ID0gJ2ZpbGUnO1xuICAgICAgb3B0aW9ucy5maWxlTmFtZSA9IG9iai5wYXRoLnN1YnN0cihvYmoucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBvcHRpb25zLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICAvKnZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xyXG4gICAgICAgaWYgKGF1dGhEYXRhKSB7XHJcbiAgICAgICAgIHZhciBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuIH07XHJcbiAgICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICAgICB9Ki9cbiAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgIHBhcmFtcy5wYXRoRmlsZVNlcnZlciA9IG9iai5ydXRhU3J2LnN1YnN0cmluZygwLCBvYmoucnV0YVNydi5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICAvLyAnMjAxNS9NYXJjaC8xOC9QUlVFQkE3MDAnO1xuICAgICAgLy8gdXJsOy8vVXBQcm9taXNlLnBhdGhGaWxlU2VydmVyO1xuICAgICAgcGFyYW1zLnZhbHVlMiA9ICdwYXJhbSc7XG4gICAgICBvcHRpb25zLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgIC8vIFRPRE86IGRlZmluaXIgdW4gc2VydmljaW8gcGFyYSBzZXQgZWwgdGltZW91dCBkZXBlbmRpZW5kbyBzaSBlcyBmb3RvIG8gdmlkZW87XG4gICAgICBvcHRpb25zLnRpbWVvdXQgPSBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0O1xuICAgICAgLy8kc2NvcGUuZGF0YS50aW1lb3V0O1xuICAgICAgLy81MDA7Ly8zMDAwMDsvL21pbGlzZWNvbmRzXG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGVUcmFuc2Zlci51cGxvYWQoc2VydmVyLCBvYmoucGF0aCwgb3B0aW9ucykudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgIC8vIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICByZXR1cm4gc3VjY2VzczsgIC8vVE9ETzogdmVyaWZpY2FyIHNpIHB1ZWRvIHBvbmVyIGVsIGVycm9yIGFjYSB5IGRpc3BhcmFyIGVsIG9vZmxpbmVtb2RlIGRlc2RlIGFjYSB5IG5vIGRlc2RlIHRvZG9zIGxvcyBjb250cm9sbGVyc1xuICAgICAgfSAgLy8gVE9ETzogc2kgZWplY3V0byBlbiBlbCBzZXJ2aWNpbyBubyBsbGVnYSBhbCBjb250cm9sYWRvciwgYXVucXVlIHBvZHJpYSBoYWNlciB1bmEgcHJhY3RpY2EgcGFyYSBkZWZpbmlyIGxvcyBwYXJhbWV0cm9zIGRlIGFmdGVydXBsb2FkIGFxdWkgbWlzbW8sIHkgcXVlZGEgbXVjaG8gbWVqb3JcbiAgICAgICAgIC8vICwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgICAvLyB9XG4pO1xuICAgIH07XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3RvcnkuZmlsZVVwbG9hZCA9IF9maWxlVXBsb2FkO1xuICAgIHJldHVybiBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZpcnN0SW5pdFNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnJGxvY2FsU3RvcmFnZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSwgbW9tZW50U2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgJGxvY2FsU3RvcmFnZSwgenVtZXJvU2VydmljZSwgJGlvbmljTG9hZGluZykge1xuICAgIHZhciBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7IHRlbXBsYXRlOiAnPHNwYW4+SW5pY2lhbGl6YW5kbzwvc3Bhbj48aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICB2YXIgX2hpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhbmRvIG9iaiBsb2NhbHN0b3JhZ2UnKTtcbiAgICAgIGlmIChvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgX3Nob3coKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBpbml0IG9rJyk7XG4gICAgICAgICAgJGxvY2FsU3RvcmFnZS5kYXRhID0ge1xuICAgICAgICAgICAgbGFzdERpckNyZWF0ZWQ6ICcnLFxuICAgICAgICAgICAgZmlyc3RaeW5jOiBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZpcnN0IGluaXQgZXJyb3InLCBlKTtcbiAgICAgICAgICBfaGlkZSgpO1xuICAgICAgICAgIHEucmVqZWN0KGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHEucmVqZWN0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH07XG4gICAgZmlyc3RJbml0U2VydmljZUZhY3RvcnkuaW5pdCA9IF9pbml0O1xuICAgIHJldHVybiBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZvY3VzJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBmb2N1c0ZhY3RvcnkgPSB7fTtcbiAgdmFyIF9mb2N1cyA9IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIHRpbWVvdXQgbWFrZXMgc3VyZSB0aGF0IGlzIGludm9rZWQgYWZ0ZXIgYW55IG90aGVyIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcbiAgICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcbiAgICAvLyBhcmUgdHJpZ2dlcmVkLlxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb2N1c0ZhY3RvcnkuZm9jdXMgPSBfZm9jdXM7XG4gIHJldHVybiBmb2N1c0ZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZ2V0VmlkZW9TZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIC8vZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnk9bnVsbDsvLyBwZXJkZXJpYSBsYSB1bHRpbWEgaW5mb3JtYWNpb24gc2kgbG8gdnVlbHZvIGEgcmVmZXJlbmNpYXI7XG4gICAgLy8gVE9ETzogIGVzdG8gc2UgZGViZSBkZSBsbGFtYXIgZGVudHJvIGRlIGxhIG1pc21hIGZ1bmNpb24sIHBvciBxdWUgc2kgbG8gaW5pY2lhbGl6YW1vcyBwb3IgZnVlcmEsIGVsIHB1Z2luIG5vIGhhIGNhcmdhZG8geSBvYnRlbmdvIGNhbWVyYSBpcyBub3QgZGVmaW5lZFxuICAgIC8vIHZhciBfZ2V0RmlsZUVudHJ5ID0gZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHZpZGVvQ29udGVudFBhdGgpO1xuICAgIC8vICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAvLyAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHZpZGVvQ29udGVudFBhdGgsIGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAvLyAgICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgLy8gfTtcbiAgICAvLyBUT0RPOiBjcmVhdGUgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgeSAuZmlsZSwgcGFyYSBkZXZvbHZlciBsYSBwcm9tZXNhIHNpbiBkYXRhIHkgcmVmZXJlbmNpYXIgZWwgY29udHJvbGFkb3IgY29uIGxhIHByb3BpZWRhZCBkZWRsIHNlcnZpY2lvIHRvZGQgbW90XG4gICAgdmFyIF9nZXRWaWRlb0NvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZVR5cGU6IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5TQVZFRFBIT1RPQUxCVU0sXG4gICAgICAgIG1lZGlhVHlwZTogQ2FtZXJhLk1lZGlhVHlwZS5WSURFT1xuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRGaWxlRW50cnkodmlkZW9Db250ZW50UGF0aCk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmNoZWNrRmlsZSh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5nZXRWaWRlb0NvbXByZXNzID0gX2dldFZpZGVvQ29tcHJlc3M7XG4gICAgcmV0dXJuIGdldFZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdncHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBlcnJvclNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsIG1vbWVudFNlcnZpY2UsICRxLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlKSB7XG4gIHZhciBncHNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2dwc0h0bWxQcm9taXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIG1heGltdW1BZ2U6IDkwMDAwLFxuICAgICAgdGltZW91dDogMTUwMDAwLFxuICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgfTtcbiAgICAvL3ZhciBvcHQ9IHsgbWF4aW11bUFnZTogOTAwMDAsIHRpbWVvdXQ6IDMwMDAsIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSB9Oy8vdGFtYmllbiBzZSBwcm9ibyBjb24gMjIsIHBlcm8gc2UgYmFqYSBoYXN0YSAxM1xuICAgIC8vIGNvbnNvbGUubG9nKG5hdmlnYXRvciwgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAvL2JldGFkb3BhcmFwcnVlYmFzY29uc29sZS5sb2coXCJncHNIdG1sUHJvbWlzZSBcIiwgcmVzdWx0KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIC8vIEFuIGVycm9yIG9jY3VyZWQuIFNob3cgYSBtZXNzYWdlIHRvIHRoZSB1c2VyXG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTsgIC8vJHNjb3BlLmRpYWxvZyhlcnIpO1xuICAgIH0sIG9wdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG4gIHZhciBfZ3BzSHRtbCA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24pIHtcbiAgICAvLyBUT0RPOiBhdW4gc2luIHdpIGZpIG5pIGRhdG9zIGVsIGdwcyBzaWd1ZSBmdW5jaW9uYW5kb1xuICAgIC8vIFRPRE86IHBvciBxdWUgbWUgZGlzcGFyYSBlbCB2ZW50byBkZSBvbiBvbmxpbmUsIG1hcyBxdWUgdG9kbyBjb24gZWwgd2lmaT8/Pz9cbiAgICBpZiAoISRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzIHx8IG1vbWVudFNlcnZpY2UuZGlmZk5vdygkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcykgPiA3KSB7XG4gICAgICB2YXIgb3B0ID0ge1xuICAgICAgICBtYXhpbXVtQWdlOiAzMDAwLFxuICAgICAgICB0aW1lb3V0OiAxNTAwMDAsXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcbiAgICAgICAgX2luc2VydEdwc0xvZyhpZGluc3BlY2Npb24sIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yLCBvcHQpO1xuICAgIH1cbiAgfTtcbiAgdmFyIF9pbnNlcnRHcHNMb2cgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBjb29yZHMpIHtcbiAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2dwc0xvZ3NdIChbaWRpbnNwZWNjaW9uXSAgICxbZmVjaGFdICxbYWNjdXJhY3ldICAsW2FsdGl0dWRlXSwgJztcbiAgICBxdWVyeSArPSAnW2FsdGl0dWRlQWNjdXJhY3ldICAsW2hlYWRpbmddICAsW2xhdGl0dWRlXSAsW2xvbmdpdHVkZV0sW3NwZWVkXSkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPyknO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgY29vcmRzLmFjY3VyYWN5LFxuICAgICAgY29vcmRzLmFsdGl0dWRlLFxuICAgICAgY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICBjb29yZHMuaGVhZGluZyxcbiAgICAgIGNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgIGNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBjb29yZHMuc3BlZWRcbiAgICBdO1xuICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzID0gbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpO1xuICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICB9O1xuICBncHNTZXJ2aWNlRmFjdG9yeS5ncHNIdG1sUHJvbWlzZSA9IF9ncHNIdG1sUHJvbWlzZTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbCA9IF9ncHNIdG1sO1xuICByZXR1cm4gZ3BzU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnaW50ZXJtZWRpYXRlU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICBpc1Rha2luZ1BpYzogZmFsc2UsXG4gICAgaXNUYWtpbmdWaWQ6IGZhbHNlLFxuICAgIG5hdkJhclNlYXJjaDogZmFsc2UsXG4gICAgcGxhY2E6IG51bGwsXG4gICAgaWRpbnNwZWNjaW9uU3luYzogZmFsc2UsXG4gICAgaWRpbnNwZWNjaW9uOiBudWxsXG4gIH07XG4gIHJldHVybiBpbnRlcm1lZGlhdGVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdtb21lbnRTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciBtb21lbnRTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2dldERhdGVUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGREYXlzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkSG91cnMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ2hvdXJzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkU2Vjb25kcyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAncycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX3J1dGFTcnYgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHZhciBmaWxlbmFtZSA9IHBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBydXRhID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZL01NTU0vREQvJykgKyBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EgKyAnLycgKyBmaWxlbmFtZTtcbiAgICByZXR1cm4gcnV0YTtcbiAgfTtcbiAgdmFyIF9kaWZmTm93ID0gZnVuY3Rpb24gKGIsIHRpcG8pIHtcbiAgICB2YXIgcnRhID0gbW9tZW50KCkuZGlmZihtb21lbnQoYiksIHRpcG8pO1xuICAgIGNvbnNvbGUubG9nKHJ0YSwgJ2RpZmYnKTtcbiAgICByZXR1cm4gcnRhO1xuICB9O1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5nZXREYXRlVGltZSA9IF9nZXREYXRlVGltZTtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkRGF5cyA9IF9hZGREYXlzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGRIb3VycyA9IF9hZGRIb3VycztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkU2Vjb25kcyA9IF9hZGRTZWNvbmRzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5ydXRhU3J2ID0gX3J1dGFTcnY7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmRpZmZOb3cgPSBfZGlmZk5vdztcbiAgcmV0dXJuIG1vbWVudFNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ29mZmxpbmVTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBvZmZsaW5lU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgb2ZmbGluZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7fTtcbiAgLy8gdmFyIF9mb2N1cyA9IGZ1bmN0aW9uIChpZCkge1xuICAvLyAgIC8vIHRpbWVvdXQgbWFrZXMgc3VyZSB0aGF0IGlzIGludm9rZWQgYWZ0ZXIgYW55IG90aGVyIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgLy8gICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcbiAgLy8gICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcbiAgLy8gICAvLyBhcmUgdHJpZ2dlcmVkLlxuICAvLyAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAvLyAgICAgaWYgKGVsZW1lbnQpIHtcbiAgLy8gICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9O1xuICBvZmZsaW5lU2VydmljZUZhY3RvcnkuZGF0YS5vZmZsaW5lTW9kZSA9IGZhbHNlO1xuICByZXR1cm4gb2ZmbGluZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ29ubGluZVN0YXR1c1NlcnZpY2UnLCBbXG4gICckcm9vdFNjb3BlJyxcbiAgJyRxJyxcbiAgJyRpbmplY3RvcicsXG4gICckbG9jYXRpb24nLFxuICAnJGNvcmRvdmFOZXR3b3JrJyxcbiAgJyRpb25pY1BvcHVwJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCAkaW5qZWN0b3IsICRsb2NhdGlvbiwgJGNvcmRvdmFOZXR3b3JrLCAkaW9uaWNQb3B1cCwgenVtZXJvU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIHRvYXN0U2VydmljZSkge1xuICAgIHZhciBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBpc09ubGluZTogZmFsc2UsXG4gICAgICBjb25uVHlwZTogJ25vbmUnXG4gICAgfTtcbiAgICB2YXIgX2lzT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSAkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKTtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSAkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKTtcbiAgICB9O1xuICAgIHZhciBfdHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gJGNvcmRvdmFOZXR3b3JrLmdldE5ldHdvcmsoKTtcbiAgICB9O1xuICAgIHZhciBfb25PbmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkcm9vdFNjb3BlLiRvbignJGNvcmRvdmFOZXR3b3JrOm9ubGluZScsIGZ1bmN0aW9uIChldmVudCwgbmV0d29ya1N0YXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXR3b3JrU3RhdGUpO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IG5ldHdvcmtTdGF0ZTtcbiAgICAgICAgLy8gVE9ETzogZXZhbHVhciB0b2RhcyBsYXMgcG9zaWJpbGlkYWRlcyBkZSBlc3RvIGFjYSwgcG9yIHF1ZSBzaSBsYSBzZcOxYWwgZXMgbXV5IG1hbGEgcXVlIHB1ZWRlIHBhc2FyLCBhdW5xdWUgZWwgenluYyBkZSBiYXNlcyBkZSBkYXRvcyBudW5jYSBoYXNpZG8gbXV5IGdyYW5kZSBlbiBpbmZvcm1hY2lvblxuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7ICAvLyBjb3Jkb3ZhRXZlbnRzU2VydmljZS5jYWxsWnluYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmlmKCFzaWduYWxTZXJ2aWNlLmlzSW5pdCl7XG4gICAgICAgICAgICAgICAgICAgIHNpZ25hbFNlcnZpY2Uuc3RhcnRIdWIoKTtcblxuICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRjb3Jkb3ZhTmV0d29yazpzaWduYWwnLHsnbmV0d29ya1N0YXRlJzpuZXR3b3JrU3RhdGV9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9vbk9mZmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBsaXN0ZW4gZm9yIE9mZmxpbmUgZXZlbnRcbiAgICAgICRyb290U2NvcGUuJG9uKCckY29yZG92YU5ldHdvcms6b2ZmbGluZScsIGZ1bmN0aW9uIChldmVudCwgbmV0d29ya1N0YXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXR3b3JrU3RhdGUpO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gZmFsc2U7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBuZXR3b3JrU3RhdGU7ICAvKiBpZihuZXR3b3JrU3RhdGUgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiSW50ZXJuZXQgRGlzY29ubmVjdGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRoZSBpbnRlcm5ldCBpcyBkaXNjb25uZWN0ZWQgb24geW91ciBkZXZpY2UuXCJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0uZXhpdEFwcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cbiAgICAgIH0pO1xuICAgIH07XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnkub25PbmxpbmUgPSBfb25PbmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnkub25PZmZsaW5lID0gX29uT2ZmbGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IF9pc09ubGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IF90eXBlO1xuICAgIHJldHVybiBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3NxbGl0ZVNlcnZpY2UnLCBbXG4gICckY29yZG92YVNRTGl0ZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YVNRTGl0ZSkge1xuICAgIHZhciBzcWxpdGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZXhlY3V0ZVF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5LCBiaW5kaW5nKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgcXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydENvbGxlY3Rpb24gPSBmdW5jdGlvbiAocXVlcnksIGJpbmRpbmdzKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFTUUxpdGUuaW5zZXJ0Q29sbGVjdGlvbihkYiwgcXVlcnksIGJpbmRpbmdzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9ydG5BcnJheSA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgaWYgKHJlcy5yb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2gocmVzLnJvd3MuaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfVxuICAgIH07XG4gICAgLy8gVE9ETzogc2kgeW8gY2FtYmlvIGVsIHRpcG8gZGUgZGF0byBkZSB1bmEgY29sdW1uYSwgZWplbXBsbyBzdHJpbmcgdG8gaW50LCBkZWJvIHJlZXN0YWJsZWNlciBsYSBiYXNlIGRlIGRhdG9zIHp1bWVybywgcGFyYSBhZ3JlZ2FyIHVuYSBjb2x1bW5hIG5vIHRlbmdvIHByb2JsZW1hXG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkuZXhlY3V0ZVF1ZXJ5ID0gX2V4ZWN1dGVRdWVyeTtcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5pbnNlcnRDb2xsZWN0aW9uID0gX2luc2VydENvbGxlY3Rpb247XG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkucnRuQXJyYXkgPSBfcnRuQXJyYXk7XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgndGl0bGVTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciB0aXRsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHRpdGxlU2VydmljZUZhY3RvcnkudGl0bGUgPSAnJztcbiAgcmV0dXJuIHRpdGxlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRjb3Jkb3ZhVG9hc3QpIHtcbiAgdmFyIHRvYXN0U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9zaG93TG9uZ0JvdHRvbSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICByZXR1cm4gJGNvcmRvdmFUb2FzdC5zaG93TG9uZ0JvdHRvbShtc2cpO1xuICB9O1xuICB2YXIgX3Nob3dTaG9ydEJvdHRvbSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICByZXR1cm4gJGNvcmRvdmFUb2FzdC5zaG93U2hvcnRCb3R0b20obXNnKTtcbiAgfTtcbiAgdG9hc3RTZXJ2aWNlRmFjdG9yeS5zaG93TG9uZ0JvdHRvbSA9IF9zaG93TG9uZ0JvdHRvbTtcbiAgdG9hc3RTZXJ2aWNlRmFjdG9yeS5zaG93U2hvcnRCb3R0b20gPSBfc2hvd1Nob3J0Qm90dG9tO1xuICByZXR1cm4gdG9hc3RTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd1bnN5bmNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgdmFyIHVuc3luY1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYyA9IFtdO1xuICB2YXIgX2dldEltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgICBpZGZvdG8sIGkuaWRpbnNwZWNjaW9uLCBwYXRoLCBmLnN5bmMsICBpLnBsYWNhLCBmLnJ1dGFTcnYgJztcbiAgICBxdWVyeSArPSAnRlJPTSAgICAgIGlkaW5zcGVjY2lvbiBpICAgIGlubmVyIGpvaW4gIGlkZm90b3MgZiBvbiBpLmlkaW5zcGVjY2lvbiA9IGYuaWRpbnNwZWNjaW9uICc7XG4gICAgcXVlcnkgKz0gJ1dIRVJFICAgIGkudXNlck5hbWUgPSA/IEFORCAgaS5mZWNoYT4/IEFORCAoZi5zeW5jID0gMCkgQU5EIChkZWxldGVkID0gMCkgJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5sZW5ndGg7XG4gICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gIH07XG4gIHZhciBfc3luY0ltYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfZ2V0SW1nVW5zeW5jKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoIDwgMSkge1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICBfcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIHZhciBfcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgLy8gVE9ETzogeWEgbm9lIHMgbmVjZXNhcmlvIHBvciBxdWUgb2ZmbGluZSB0YW1iaWVuIGVzdGEgZW4gb25saWxuZXN0YXR1c3NyZXJ2aWNlXG4gICAgICAvLyB8fCAhb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSkge1xuICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHZhciBfdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgX3VwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgfTtcbiAgdmFyIF91cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgIC8vIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA9IHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCAtIDE7XG4gICAgICBpZiAodW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyB9XG4gICAgICAvLyBfZmlsdGVyVW5zeW5jKDApOyAgICAgICAgICBcbiAgICAgIGNvbnNvbGUubG9nKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCwgJ3N5bmMnKTtcbiAgICAgIC8vIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgIHp1bWVyb1NlcnZpY2UuenluYygwKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdteUV2ZW50Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdW5zeW5jU2VydmljZUZhY3RvcnkuZ2V0SW1nVW5zeW5jID0gX2dldEltZ1Vuc3luYztcbiAgdW5zeW5jU2VydmljZUZhY3Rvcnkuc3luY0ltYWdlcyA9IF9zeW5jSW1hZ2VzO1xuICByZXR1cm4gdW5zeW5jU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndXBkYXRlU3luY1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGF1dGhTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciB1cGRhdGVTeW5jU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF91cGRhdGVTeW5jID0gZnVuY3Rpb24gKHBsYWNhLCBzeW5jKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGluc3BlY2Npb24gc2V0IHN5bmM9PyAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+Pyc7XG4gICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIHN5bmMsXG4gICAgICBwbGFjYSxcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgfTtcbiAgdmFyIF9zZWxlY3RJZGluc3BlY2Npb25TeW5jID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBpZGluc3BlY2Npb24gZnJvbSBpZGluc3BlY2Npb24gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8gT3JkZXIgYnkgaWRpbnNwZWNjaW9uIERFU0MgTGltaXQgMSc7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBwbGFjYSxcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uaWRpbnNwZWNjaW9uO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgPSB0cnVlO1xuICAgICAgcmV0dXJuIF91cGRhdGVTeW5jKHBsYWNhLCB0cnVlKTtcbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSwgJ2Vycm9yJyk7XG4gICAgfSk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgICAgICAvLyB9KTtcbiAgfTtcbiAgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVN5bmMgPSBfdXBkYXRlU3luYztcbiAgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnNlbGVjdElkaW5zcGVjY2lvblN5bmMgPSBfc2VsZWN0SWRpbnNwZWNjaW9uU3luYztcbiAgLy8gdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnN5bmNJbWFnZXMgPSBfc3luY0ltYWdlcztcbiAgcmV0dXJuIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd2aWRlb1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhcHR1cmUnLFxuICAnc3FsaXRlU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYXB0dXJlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZpZGVvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyA9IFtdO1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZFZpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBsaW1pdDogMSxcbiAgICAgICAgZHVyYXRpb246IDEyXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FwdHVyZS5jYXB0dXJlVmlkZW8ob3B0aW9ucykudGhlbihmdW5jdGlvbiAodmlkZW9EYXRhKSB7XG4gICAgICAgIHJldHVybiB2aWRlb0RhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0VmlkZW9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRWaWRlb3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyh2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgdGh1bWJuYWlsLCBvblVwbG9hZCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkVmlkZW9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsdGh1bWJuYWlsLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2ICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sID8pJztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgICBwYXRoLFxuICAgICAgICBzeW5jLFxuICAgICAgICAndGVzdHV1aWQnLFxuICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgbW9tZW50U2VydmljZS5ydXRhU3J2KHBhdGgpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIC8vVE9ETzogZXMgZWwgcGF0aCBsYSBtZWpvciBmb3JtYSB5IG1hcyBlZmVjdGl2YSBkZSBoYWNlciBlbCB3aGVyZSBkZSBsYSBjb25zdWx0YVxuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZFZpZGVvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LmFsbCA9IF9hbGw7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS50YWtlZFZpZCA9IF90YWtlZFZpZDtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LmdldFZpZGVvcyA9IF9nZXRWaWRlb3M7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5pbnNlcnRWaWRlbyA9IF9pbnNlcnRWaWRlbztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVZpZGVvID0gX3VwZGF0ZVZpZGVvO1xuICAgIHJldHVybiB2aWRlb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgndmlkZW9UaHVtYm5haWxTZXJ2aWNlJywgW1xuICAnJHEnLFxuICBmdW5jdGlvbiAoJHEpIHtcbiAgICB2YXIgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZ2VuZXJhdGVUaHVtYm5haWwgPSBmdW5jdGlvbiAobmF0aXZlVVJMKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIG5hbWUgPSBuYXRpdmVVUkwuc2xpY2UoMCwgLTQpO1xuICAgICAgd2luZG93LlBLVmlkZW9UaHVtYm5haWwuY3JlYXRlVGh1bWJuYWlsKG5hdGl2ZVVSTCwgbmFtZSArICcucG5nJywgZnVuY3Rpb24gKHByZXZTdWNjKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByZXZTdWNjKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcmV2U3VjYyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZ2VuZXJuYWRvIHRodW1ibmFpbCcsIGUpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeS5nZW5lcmF0ZVRodW1ibmFpbCA9IF9nZW5lcmF0ZVRodW1ibmFpbDtcbiAgICByZXR1cm4gdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3p1bWVyb1NlcnZpY2UnLCBbXG4gICckcScsXG4gICckY29yZG92YURldmljZScsXG4gICckY29yZG92YVNRTGl0ZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3VwZGF0ZVN5bmNTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICckdGltZW91dCcsXG4gIC8vICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRxLCAkY29yZG92YURldmljZSwgJGNvcmRvdmFTUUxpdGUsIG9mZmxpbmVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1cGRhdGVTeW5jU2VydmljZSwgdG9hc3RTZXJ2aWNlLCAkdGltZW91dCkge1xuICAgIHZhciB6dW1lcm8gPSBudWxsO1xuICAgIHZhciB6dW1lcm9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfc2V0RGJQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9vcHRpb25zID0ge1xuICAgICAgICBBbmRyb2lkOiAnL2RhdGEvZGF0YS8nICsgenVtZXJvU2VydmljZUZhY3RvcnkucGFja2FnZU5hbWUgKyAnL2RhdGFiYXNlcy8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsXG4gICAgICAgIGlPUzogJ2NkdmZpbGU6Ly9sb2NhbGhvc3QvcGVyc2lzdGVudC8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsXG4gICAgICAgIHdpbjMybnQ6ICcvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlXG4gICAgICB9O1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJwYXRoID0gX29wdGlvbnNbJGNvcmRvdmFEZXZpY2UuZ2V0UGxhdGZvcm0oKV07XG4gICAgfTtcbiAgICB2YXIgX3NldFp1bWVybyA9IGZ1bmN0aW9uIChkYmZpbGUpIHtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZSA9IGRiZmlsZTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlID0genVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlICsgJy5kYic7XG4gICAgICAvL29wZW4gZGIgY29uIHNxbGl0ZXBsdWdpbiBicm9keVxuICAgICAgZGIgPSAkY29yZG92YVNRTGl0ZS5vcGVuREIoenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsIDEpO1xuICAgICAgenVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNlcnZlciA9ICdodHRwOi8vMTkwLjE0NS4zOS4xMzg6ODA4MC8nO1xuICAgICAgLy8naHR0cDovLzE5Mi4xNjguMC41MTo4MDgwLyc7XG4gICAgICAvLyBUT0RPOiBERVBFTkRFIFNJIEVTVE9ZIEVOIE1JIENBU0EgTyBFTiBMQSBPRklDSU5BJ2h0dHA6Ly8xOTIuMTY4LjEuMTM6ODA4MC8nO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkucGFja2FnZU5hbWUgPSAnY29tLmFqdXN0ZXYuYic7XG4gICAgICBfc2V0RGJQYXRoKCk7XG4gICAgfTtcbiAgICAvLyBUT0RPOiAgcmVjb3JkYXIgayBlc3RvIGVzIHVuYSBwcm9tZXNhIHkgZGVzZW5jYWRlbmEgYWNjaW9uZXMsIHNpIGVzIHJlc3VlbHRhIG8gc2kgZXMgcmVqZWN0ICwgdmFsbGlkYXJcbiAgICB2YXIgX3p5bmMgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgLy8gVE9ETzogYWJyaXJpIGVsIHB1ZXJ0byBwYXJhIHp1bWVybyBlbiBlbCBmaXJld2FsbFxuICAgICAgLy8gVE9ETzogY3JlYXIgdW5hIHNlcnZpY2lvIGdsb2JhbCBwYXJhIGRlIGFoaSBzYWNhciBlbCBpZGluc3BlY2Npb24gYWN0dWFsLCBpbmN1c2l2ZSBkZXNwdWVzIGRlIHVuIHp5bmMgcGFyYSBzYWJlciBxdWUgZXMgZWwgYWRlY3VhZG9cbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgLy8gVE9ETzogbWUgcGFyZWNlIG1hcyBsb2dpY28gcmV0b3JuYXIgdW4gcmVqZWN0IHNpIGVzdGEgZW4gbW9kbyBvZmZsaW5lXG4gICAgICAgIHEucmVqZWN0KCdvZmZsaW5lTW9kZSBvIHNpbiBjb25leGlvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnb2ZmbGluZSBtb2RlIGFjdGl2YWRvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLnRpbWUoJ3p5bmMnICsgaSk7XG4gICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdzaW5jcm9uaXphbmRvLi4nKTtcbiAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgIHp1bWVyby5zeW5jKHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRicGF0aCwgJycsIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNlcnZlciwgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlLCBudWxsLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ29rJyk7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmICghaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgJiYgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlU3luY1NlcnZpY2UudXBkYXRlU3luYyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHRydWUpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXBkYXRlU3luY1NlcnZpY2Uuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBxLnJlc29sdmUoJ3p5bmMgb2snKTtcbiAgICAgICAgICAgIH0pOyAgLy8gfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICBxLnJlc29sdmUoJ3p5bmMgb2snKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnenluYycgKyBpKTtcbiAgICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gNDU2KSB7XG4gICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfTtcbiAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXRadW1lcm8gPSBfc2V0WnVtZXJvO1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5Lnp5bmMgPSBfenluYztcbiAgICByZXR1cm4genVtZXJvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuY29udHJvbGxlcignU2V0dGluZ3MnLCBTZXR0aW5ncyk7XG4gIFNldHRpbmdzLmluamVjdCA9IFtcbiAgICAnJGxvZycsXG4gICAgJ3NldHRpbmdzU3J2JyxcbiAgICAnZXJyb3JTZXJ2aWNlJ1xuICBdO1xuICBmdW5jdGlvbiBTZXR0aW5ncygkbG9nLCBzZXR0aW5nc1NydiwgZXJyb3JTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5kZWxldGVJbWdzID0gZGVsZXRlSW1ncztcbiAgICB2bS5waWNzID0gW107XG4gICAgYWN0aXZhdGUoKTtcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgIHNldHRpbmdzU3J2LmdldEltZzJEbHQoKS50aGVuKHNlbGVjdE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2VsZWN0T2soKSB7XG4gICAgICB2bS5waWNzID0gc2V0dGluZ3NTcnYucGljcztcbiAgICAgICRsb2cuZGVidWcoJ3NlbGVjdCBvaycpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgICBmdW5jdGlvbiBkZWxldGVJbWdzKCkge1xuICAgICAgaWYgKHZtLnBpY3MubGVuZ3RoKSB7XG4gICAgICAgICRsb2cuZGVidWcoJ2RlbGV0ZUltZ3MnKTtcbiAgICAgICAgc2V0dGluZ3NTcnYuZGx0SW1ncygpLnRoZW4oYWN0aXZhdGUpLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ3NldHRpbmdzU3J2Jywgc2V0dGluZ3NTcnYpO1xuICBzZXR0aW5nc1Nydi4kaW5qZWN0ID0gW1xuICAgICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgICAnc3FsaXRlU2VydmljZScsXG4gICAgJ21vbWVudFNlcnZpY2UnLFxuICAgICdhdXRoU2VydmljZScsXG4gICAgJ3RvYXN0U2VydmljZScsXG4gICAgJ2RldmljZVNlcnZpY2UnLFxuICAgICdkbHRGaWxlU3J2JyxcbiAgICAnZXJyb3JTZXJ2aWNlJyxcbiAgICAnJGxvZycsXG4gICAgJyRxJ1xuICBdO1xuICBmdW5jdGlvbiBzZXR0aW5nc1NydihpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBhdXRoU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCBkbHRGaWxlU3J2LCBlcnJvclNlcnZpY2UsICRsb2csICRxKSB7XG4gICAgdmFyIHN0RmFjdG9yeSA9IHtcbiAgICAgIHBpY3M6IFtdLFxuICAgICAgZ2V0SW1nMkRsdDogZ2V0SW1nMkRsdCxcbiAgICAgIGRsdEltZ3M6IGRsdEltZ3NcbiAgICB9O1xuICAgIHJldHVybiBzdEZhY3Rvcnk7XG4gICAgZnVuY3Rpb24gZ2V0SW1nMkRsdCgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICBmLmlkZm90bywgZi5wYXRoICc7XG4gICAgICBxdWVyeSArPSAnRlJPTSAgaWRpbnNwZWNjaW9uIGlkICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZGZvdG9zIGYgb24gZi5pZGluc3BlY2Npb249aWQuaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIGlkLnV1aWQgPSA/IEFORCBpZC5Vc2VyTmFtZSA9ID8gICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGYuc3luYz0xICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGYuZGVsZXRlZD0wICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGlkLmZlY2hhPCA/IE9SREVSIEJZIGYuaWRmb3RvIERFU0MgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygrMSkgIC8vIC0yXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgc3RGYWN0b3J5LnBpY3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7ICAvKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBkbHRJbWdzKGFycmF5KTtcbiAgICAgICAgfSovXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRsdEltZ3MoKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdFbGltaW5hbmRvIEZvdG9zJyk7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZGZvdG9zXVNFVCBbZGVsZXRlZF0gPSAxICBXSEVSRSBpZGZvdG89Pyc7XG4gICAgICB2YXIgYmluZGluZ3MgPSBbXTtcbiAgICAgIHZhciBxQXJyYXkgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdEZhY3RvcnkucGljcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIC8qcUFycmF5LnB1c2goXG4gICAgICAgICAgZGx0RmlsZVNydi5kbHRJbWcob2JqLnBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgICAgYmluZGluZy5wdXNoKG9iai5pZGZvdG8pO1xuICAgICAgICAgIGJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpXG4gICAgICAgICAgKTsgKi9cbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgICAgYmluZGluZy5wdXNoKG9iai5pZGZvdG8pO1xuICAgICAgICBiaW5kaW5ncy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICAvKiAgKGZ1bmN0aW9uIGluc2VydE9uZSgpIHtcbiAgICAgICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRsdEZpbGVTcnYuZGx0SW1nKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHEucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHFBcnJheS5wdXNoKHEucHJvbWlzZSk7XG4gICAgICAgIH0oKSk7Ki9cbiAgICAgICAgcUFycmF5LnB1c2goaWlmZURsdChvYmoucGF0aCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwcmVVcGRhdGVDb2xsZWN0aW9uIChxQXJyYXksIHF1ZXJ5LCAgYmluZGluZ3MpXG4gICAgIC8qIHJldHVybiAkcS5hbGwocUFycmF5KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVDb2xsZWN0aW9uKGJpbmRpbmdzKS50aGVuKHVwZE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcikqLztcbiAgICB9XG4gICAgLyogICBmdW5jdGlvbiBpbnNlcnRCaW5kaW5nIChpZGZvdG8pIHtcbiAgICAgIHZhciBiaW5kaW5nPVtdXG4gICAgICBiaW5kaW5nLnB1c2goaWRmb3RvKTtcbiAgICAgIGJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgICBcbiAgICB9Ki9cbiAgICAvL1RPRE86IGVqZW1wbG8gdHJhaWRvIGRlIGluc2VydGNvbGxlY3Rpb24gZm9tIG5nY29yZG92YVxuICAgIGZ1bmN0aW9uIGlpZmVEbHQocGF0aCkge1xuICAgICAgLy8gcmV0dXJuIGZ1bmN0aW9uIGluc2VydE9uZSgpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRsdEZpbGVTcnYuZGx0SW1nKHBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAxKSB7XG4gICAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICBxLnJlamVjdChleGNlcHRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTsgIC8vIH0oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVVcGRhdGVDb2xsZWN0aW9uIChxQXJyYXksIHF1ZXJ5LCAgYmluZGluZ3MpIHtcbiAgICAgICByZXR1cm4gJHEuYWxsKHFBcnJheSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlQ29sbGVjdGlvbihxdWVyeSxiaW5kaW5ncykudGhlbih1cGRPaykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpXG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKSB7XG4gICAgICAkbG9nLmRlYnVnKGJpbmRpbmdzKTsgICAgICBcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmluc2VydENvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkT2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCd1cGQgY29sbGVjdGlvbiBvaycpO1xuICAgIH1cbiAgfVxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=