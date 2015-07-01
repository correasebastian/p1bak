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
var f = null;
var i = null;
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
        templateUrl: 'js/videos/video.html',
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
var serviceBase = 'http://ajustevsiva.com';
//auth/';// 'http://190.145.39.138/auth/';
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
          // gpsService.gpsHtml(intermediateService.data.idinspeccion);
          if (!intermediateService.dataisTakingGeo) {
            intermediateService.dataisTakingGeo = true;
            gpsService.gpsHtml(intermediateService.data.idinspeccion);
          }
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
    $scope.getTipos = function () {
      inspeccionService.getTipos().then(function () {
        $scope.tipos = inspeccionService.tipos;
      });
    };
    $scope.getConjuntoPanel = function () {
      inspeccionService.getConjuntoPanel().then(function () {
        $scope.conjuntoPanel = inspeccionService.conjuntoPanel;
      });
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
      $scope.getTipos();
      $scope.getConjuntoPanel();
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
    i = inspeccionServiceFactory;
    f = $filter;
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
      // inspeccionServiceFactory.sections = $filter('orderBy')($filter('unique')(inspeccionServiceFactory.all, 'customsection'), 'customsection');  
      inspeccionServiceFactory.sections = $filter('orderBy')($filter('unique')(inspeccionServiceFactory.all, 'customsection'), 'Orden');
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
      tipo: null,
      conjuntoPanel: null
    };
    inspeccionServiceFactory.clases = [];
    inspeccionServiceFactory.carrocerias = [];
    inspeccionServiceFactory.tipos = [];
    inspeccionServiceFactory.conjuntoPanel = [];
    // TODO: para la implementacion de pesados y motos, ya si debe ser una consulta
    /*    inspeccionServiceFactory.tipos = [{
        value: 829,
        label: 'Livianos'
      }  // ,
         // {
         //   value: 844,
         //   label: 'Pesados'
         // }
];*/
    var _getTipos = function () {
      var query = 'select idtipovehiculo as value , nombre as label from tipos where enabled=1';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return inspeccionServiceFactory.tipos = sqliteService.rtnArray(res);
      }, errorService.consoleError);
    };
    var _getConjuntoPanel = function () {
      var query = 'SELECT    IdTipo as value, Nombre as label FROM    Base_Tipos  WHERE     (IdMaestroTipos = 73)';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return inspeccionServiceFactory.conjuntoPanel = sqliteService.rtnArray(res);
      }, errorService.consoleError);
    };
    var _getClases = function () {
      if (angular.isDefined(_cl.tipo) && angular.isNumber(parseInt(_cl.tipo))) {
        var query = 'SELECT  distinct cc.idclase as value  , bt.Nombre as label  FROM clases_tipoVehiculo ct  inner join   clases_carrocerias cc on cc.idclase=ct.idclase   inner join Base_Tipos bt on bt.IdTipo=cc.idclase  where ct.idtipovehiculo=?';
        var binding = [parseInt(_cl.tipo)];
        return sqliteService.executeQuery(query, binding).then(function (res) {
          // TODO: ASI NO SIRVE , no se actualiza el expuesto ,,_clases = sqliteService.rtnArray(res);
          inspeccionServiceFactory.clases = sqliteService.rtnArray(res);
          _cl.idclase = null;
          _cl.conjuntoPanel = null;
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
      console.log(_cl.conjuntoPanel);
      var query = null;
      var binding = [];
      if (_cl.conjuntoPanel === null) {
        query = 'SELECT [idclasecarroceria] ,[idclase] ,[idcarroceria]  ,[idcodigocalificacion]  ,[idextrainfo]   FROM [clases_carrocerias] WHERE idclase=? and idcarroceria=? ';
        binding = [
          parseInt(_cl.idclase),
          parseInt(_cl.idcarroceria)
        ];
      } else {
        query = 'SELECT [idclasecarroceria] ,[idclase] ,[idcarroceria]  ,[idcodigocalificacion]  ,[idextrainfo]   FROM [clases_carrocerias] WHERE idclase=? and idcarroceria=? and idextrainfo=? ';
        binding = [
          parseInt(_cl.idclase),
          parseInt(_cl.idcarroceria),
          parseInt(_cl.conjuntoPanel)
        ];
      }
      return sqliteService.executeQuery(query, binding).then(function (res) {
        var arr = sqliteService.rtnArray(res)[0];
        inspeccionServiceFactory.idClaseCarroceria = arr.idclasecarroceria;
        return _getToInspect(arr.idcodigocalificacion, inspeccionServiceFactory.idClaseCarroceria);
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
    var _getToInspect = function (idcodigocalificacion, idClaseCarroceria) {
      var query = 'select oif.idservicio  as idservicio, cpc.iditem as iditem, idParentItem, oif.nombre as nombre,customsection, customorder , controlJson, bt.Orden as Orden ';
      //siempre dejar un espacio en blanco 
      query += 'from  viewV3 oif  ';
      query += 'inner join calificacionpiezascodigo cpc on  cpc.iditem= oif.iditem  and oif.tipo=1 ';
      query += 'inner join controlElementos ce on ce.idcontrol =oif.idcontrol ';
      query += 'inner join Base_Tipos bt on bt.IdTipo =oif.customsection ';
      query += 'where oif.idservicio=? and cpc.idcodigocalificacion=? ';
      var binding = [
        _cl.tipo,
        //829,
        //parseInt(_cl.tipo),
        idcodigocalificacion
      ];
      if (_cl.conjuntoPanel !== null) {
        console.log('para la carroceria');
        query += 'union ';
        query += 'select oif.idservicio as idservicio , cpc.iditem as iditem, idParentItem,  oif.nombre  as nombre ,customsection, customorder , controlJson, bt.Orden as Orden  ';
        query += 'from calificacionPiezasCodigoCarroceria cpc    ';
        query += 'inner join viewV3 oif on  cpc.iditem= oif.iditem  and oif.tipo=1 ';
        query += 'inner join Base_Tipos bt on bt.IdTipo =oif.customsection ';
        query += 'inner join controlElementos ce on ce.idcontrol =oif.idcontrol ';
        query += 'where  cpc.idclasecarroceria=?';        
        binding.push(idClaseCarroceria);

      }
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
    inspeccionServiceFactory.getTipos = _getTipos;
    inspeccionServiceFactory.getConjuntoPanel = _getConjuntoPanel;
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
      $scope.services = [];
      $scope.obj = { filter: '' };
      $scope.data = {
        placa: null,
        sl: null
      };
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
      $scope.cleanData = function () {
        $scope.data.placa = null;
        $scope.data.sl = null;
      };
      $scope.placaPopup = function () {
        placasService.getSrvs().then(function () {
          $scope.services = placasService.srvs;
          var myprompt = $ionicPopup.prompt({
            title: 'Nueva Placa',
            // template: 'Ingrese la nueva placa',
            templateUrl: 'templates/insertPlaca.html',
            scope: $scope,
            buttons: [
              {
                text: 'Cancel',
                onTap: function (e) {
                  $scope.cleanData();
                }
              },
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function (e) {
                  if ($scope.data.placa === null || $scope.data.sl === null) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.placa;
                  }
                }
              }
            ]
          });
          myprompt.then(function (placa) {
            if (placa !== null) {
              $scope.addPlaca(placa);
            }
          }, function (e) {
          });
        });  // TODO: organizar el focus en el input del popup
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
        placasService.insertPLaca(placa, $scope.data.sl).then(function () {
          console.log('en el controller');
          $scope.placas = placasService.all;
          $scope.cleanData();
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
      $scope.onInitSrv = function () {
        $scope.services.length < 2 ? $scope.data.sl = $scope.services[0].value : $scope.data.sl = null;
      };
      // TODO: seria bueno que la consulta de placas supiera todo, como por ejemplo si ya se califico, si ya tiene alguna foto o un video, puede ser marcandolo con alguna clase
      if (!$localStorage.data) {
        $scope.show();
        // TODO: puedo poder obj=null, para que me elimine la base de datos si ya esta creada y vuelva a sincronizar, esto seria beneficioso si tengo que hacer un cambio en la base de ddatos que requiera reconstruirla
        $timeout($scope.fInit, 300);
      } else {
        $scope.getPlacas();
      }
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
    placasServiceFactory.srvs = [];
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
      var query = 'select i.idinspeccion, placa, i.sync, bt.Nombre as servicio, ';
      query += '        case when iss.idinspeccion is null then 0 else 1 end as calificado ';
      query += '          from idinspeccion i ';
      query += '        left join  Base_Tipos bt on bt.IdTipo= i.appidsrv ';
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
    var _insertPLaca = function (placa, srv) {
      var query = 'INSERT INTO idinspeccion(placa, fecha,UserName,uuid, sync, appidsrv) VALUES (?,?,?,?, ?, ?)';
      var sync = 0;
      // 0 means false
      var binding = [
        placa,
        momentService.getDateTime(),
        authService.authentication.userName,
        deviceService.data.uuid,
        sync,
        srv
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
    var _getSrvs = function () {
      var query = 'SELECT [IdTipo] as value ,[Nombre] as label FROM Base_Tipos bt  inner join ro_servicios rs on rs.idSrv=bt.IdTipo   where rs.enabled=1   order by label';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return placasServiceFactory.srvs = sqliteService.rtnArray(res);
      }, function (error) {
        console.log(error);
      });
    };
    placasServiceFactory.selectAll = _selectAll;
    placasServiceFactory.getPlacas = _getPlacas;
    placasServiceFactory.insertPLaca = _insertPLaca;
    placasServiceFactory.getSrvs = _getSrvs;
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
    // optional method
    var _requestError = function (rejection) {
      // do something on error
      console.log('reject request', rejection);
      return $q.reject(rejection);
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
      if (rejection.status === 0) {
        var authService = $injector.get('authService');  // authService.toggleServer();
      }
      return $q.reject(rejection);
    };
    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
    authInterceptorServiceFactory.requestError = _requestError;
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
  'toastService',
  function ($http, $q, localStorageService, ngAuthSettings, momentService, toastService) {
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
      return $http.post(ngAuthSettings.apiServiceBaseUri + '/auth/api/account/register', registration).then(function (response) {
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
      $http.post(ngAuthSettings.apiServiceBaseUri + '/auth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
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
        console.log(err, status, 'error callin logging');
        //TODO: STATUS 0 MEANS UNREACHABLE URL
        /*if (status === 0) {
          var server = authServiceFactory.toggleServer();
        }*/
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
          $http.post(ngAuthSettings.apiServiceBaseUri + '/auth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
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
      $http.get(ngAuthSettings.apiServiceBaseUri + '/auth/api/account/ObtainLocalAccessToken', {
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
      $http.post(ngAuthSettings.apiServiceBaseUri + '/auth/api/account/registerexternal', registerExternalData).success(function (response) {
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
    var _toggleServer = function () {
      if (ngAuthSettings.apiServiceBaseUri === 'http://190.145.39.138/auth/') {
        ngAuthSettings.apiServiceBaseUri = 'http://201.232.104.196/auth/';
        toastService.showShortBottom('Cambiando a servidor 196');
      } else {
        ngAuthSettings.apiServiceBaseUri = 'http://190.145.39.138/auth/';
        toastService.showShortBottom('Cambiando a servidor 138');
      }
      authServiceFactory.getServer();
    };
    var _getServer = function () {
      if (ngAuthSettings.apiServiceBaseUri === 'http://190.145.39.138/auth/') {
        authServiceFactory.server = '138';
      } else {
        authServiceFactory.server = '196';
      }
    };
    _getServer(ngAuthSettings.apiServiceBaseUri);
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;
    authServiceFactory.toggleServer = _toggleServer;
    authServiceFactory.getServer = _getServer;
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
  'ngAuthSettings',
  function ($cordovaFileTransfer, ngAuthSettings) {
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
      var server = 'http://www.ajustevsiva.com';
      // 'http://190.145.39.138/auth/api/file';
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
      return $cordovaFileTransfer.upload(ngAuthSettings.apiServiceBaseUri + '/auth/api/file', obj.path, options).then(function (success) {
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
        timeout: 360000,
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        intermediateService.dataisTakingGeo = false;
        _insertGpsLog(idinspeccion, position.coords);
      }, function () {
        intermediateService.dataisTakingGeo = false;
        return errorService.consoleError;
      }, opt);
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
    isTakingGeo: false,
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
  'ngAuthSettings',
  '$interval',
  // 'onlineStatusService',
  function ($q, $cordovaDevice, $cordovaSQLite, offlineService, intermediateService, updateSyncService, toastService, $timeout, ngAuthSettings, $interval) {
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
      zumeroServiceFactory.server = ngAuthSettings.apiServiceBaseUri + ':8080/';
      //http://190.145.39.138:8080/';
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
        /*var timer = $timeout(function () {
          toastService.showShortBottom('sincronizando..');
        }, 2500);*/
        var interval = $interval(function () {
          toastService.showShortBottom('sincronizando..');
        }, 1500);
        zumero.sync(zumeroServiceFactory.dbpath, '', zumeroServiceFactory.server, zumeroServiceFactory.dbfile, null, null, null, function () {
          console.log('ok');
          console.timeEnd('zync' + i);
          if (!intermediateService.data.idinspeccionSync && intermediateService.data.placa) {
            /*   $timeout.cancel(timer);*/
            $interval.cancel(interval);
            // updateSyncService.updateSync(intermediateService.data.placa, true).then(function () {
            updateSyncService.selectIdinspeccionSync(intermediateService.data.placa).then(function () {
              q.resolve('zync ok');
            });  // });
          } else {
            /*$timeout.cancel(timer);*/
            $interval.cancel(interval);
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
    'errorService',
    'authService'
  ];
  function Settings($log, settingsSrv, errorService, authService) {
    var vm = this;
    vm.pics = [];
    vm.vds = [];
    vm.server = '';
    vm.deleteVds = deleteVds;
    vm.deleteImgs = deleteImgs;
    vm.toggleServer = toggleServer;
    activate();
    function activate() {
      settingsSrv.get2Dlt().then(selectOk).catch(errorService.consoleError);
    }
    function selectOk() {
      vm.pics = settingsSrv.pics;
      vm.vds = settingsSrv.vds;
      authService.getServer();
      vm.server = authService.server;
      $log.debug('select ok');  // body...
    }
    function deleteImgs() {
      if (vm.pics.length) {
        $log.debug('deleteImgs');
        settingsSrv.dltImgs().then(activate).catch(errorService.consoleError);
      }
    }
    function deleteVds() {
      if (vm.vds.length) {
        $log.debug('deleteImgs');
        settingsSrv.dltVds().then(activate).catch(errorService.consoleError);
      }
    }
    function toggleServer() {
      authService.toggleServer();
      vm.server = authService.server;
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
      vds: [],
      get2Dlt: get2Dlt,
      dltImgs: dltImgs,
      dltVds: dltVds
    };
    return stFactory;
    function get2Dlt() {
      var qArray = [];
      qArray.push(getImg2Dlt());
      qArray.push(getVds2Dlt());
      return $q.all(qArray);  // body...
    }
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
        momentService.addDays(+1)  // -2 // en 0 seria mejor por si se llena la memoria
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
    function getVds2Dlt() {
      var query = 'SELECT   v.idvideo, v.path ';
      query += 'FROM  idinspeccion id ';
      query += 'inner join idvideos v on v.idinspeccion=id.idinspeccion ';
      query += 'WHERE     id.uuid = ? AND id.UserName = ?  ';
      query += 'and v.sync=1 ';
      query += 'and v.deleted=0 ';
      query += 'and id.fecha< ? ORDER BY v.idvideo ';
      var binding = [
        deviceService.data.uuid,
        authService.authentication.userName,
        momentService.addDays(+1)  // -2
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        stFactory.vds = sqliteService.rtnArray(res);  /* console.log(array);
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
      return preUpdateCollection(qArray, query, bindings)  /* return $q.all(qArray).then(function () {
        if (bindings.length) {
          return updateCollection(bindings).then(updOk).catch(errorService.consoleError);
        }
      }).catch(errorService.consoleError)*/;
    }
    function dltVds() {
      toastService.showShortBottom('Eliminando Videos');
      var query = 'UPDATE [idvideos]SET [deleted] = 1  WHERE idvideo=?';
      var bindings = [];
      var qArray = [];
      angular.forEach(stFactory.vds, function (obj, key) {
        var binding = [];
        binding.push(obj.idvideo);
        bindings.push(binding);
        qArray.push(iifeDlt(obj.path));
      });
      return preUpdateCollection(qArray, query, bindings);
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
    function preUpdateCollection(qArray, query, bindings) {
      return $q.all(qArray).then(function () {
        if (bindings.length) {
          return updateCollection(query, bindings).then(updOk).catch(errorService.consoleError);
        }
      }).catch(errorService.consoleError);
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
  '$log',
  function (s, videoService, $ionicPlatform, $ionicScrollDelegate, fileTransferService, $filter, $stateParams, $ionicNavBarDelegate, copyFileService, videoThumbnailService, getVideoService, checkFileService, titleService, offlineService, onlineStatusService, intermediateService, toastService, errorService, zumeroService, momentService, gpsService, $log) {
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
      var insertVideo = function (imageURI, sync, thumbnail, onupload, defaultPath) {
        videoService.insertVideo(intermediateService.data.idinspeccion, imageURI, sync, thumbnail, onupload, defaultPath).then(function () {
          console.log('en el controller despues de insert sqlite video ');
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
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
      var rtnObjVideo = function (placa, path, sync, onUpload, thumbnail, defaultPath) {
        var obj = {
          placa: placa,
          path: path,
          sync: sync,
          onUpload: onUpload,
          //s.oss.online === true ? true : false
          thumbnail: thumbnail,
          rutaSrv: momentService.rutaSrv(path),
          defaultPath: defaultPath
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
          insertVideo(obj.path, sync, thumbnailSrc, onUpload, obj.defaultPath);
          // $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
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
          if (!intermediateService.dataisTakingGeo) {
            intermediateService.dataisTakingGeo = true;
            gpsService.gpsHtml(intermediateService.data.idinspeccion);
          }
          // ;
          // console.log(videoData);
          angular.forEach(videoData, function (value, key) {
            (function () {
              var defaultPath = value.fullPath;
              copyFileService.copyFile(defaultPath).then(function () {
                // console.log(checkFileService.fileEntry, checkFileService.file);
                var res = checkFileService.fileEntry;
                var obj = rtnObjVideo(intermediateService.data.placa, res.nativeURL, false, true, '', defaultPath);
                // console.log(res, 'copyok');
                s.videos.push(obj);
                loadThumbnail(obj);  // preFileUpload(obj);
              }, errorService.consoleError);
            }());
          });
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
      s.getVidFileCompress = function () {
        intermediateService.data.isTakingVid = true;
        getVideoService.getVideoCompress().then(function () {
          // gpsService.gpsHtml(intermediateService.data.idinspeccion);
          var resVideoCompress = checkFileService.fileEntry;
          // TODO: 12582912 son 12MB ;
          if (checkFileService.file.size < 12582912) {
            (function () {
              var defaultPath = value.fullPath;
              copyFileService.copyFile(defaultPath).then(function () {
                // console.log(checkFileService.fileEntry, checkFileService.file);
                var res = checkFileService.fileEntry;
                var obj = rtnObjVideo(intermediateService.data.placa, res.nativeURL, false, true, '', defaultPath);
                // console.log(res, 'copyok');
                s.videos.push(obj);
                loadThumbnail(obj);  // preFileUpload(obj);
              }, errorService.consoleError);
            }());
          } else {
            alert('el archivo supera el tama\xF1a maximo permitido. maximo 12MB');
          }
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
      function success(r) {
        console.log('Success', r);
      }
      function error(code) {
        if (code === 1) {
          console.log('No file handler found');
        } else {
          console.log('Undefined error');
        }
      }
      s.play = function () {
        // TODO : no logro reproducir los videos grabados con el media de cordova , en cambio si lo puedo hacer con los grabados con la camara filmadora fuera de ajustevapp, sera por la ubicacion del archivo???
        // cordova.plugins.disusered.open('file:///data/data/com.ajustev.b/files/20150507_174726.mp4', success, error);
        cordova.plugins.disusered.open('file:/storage/emulated/0/dcim/camera/20150504_063009.mp4', success, error);
      };
      s.playVideo = function (fullPath) {
        videoService.playVideo(fullPath).then(success).catch(errorService.consoleError);
      };
    });
  }
]);
(function () {
  angular.module('starter').factory('playVds', playVds);
  playVds.$inject = ['$q'];
  function playVds($q) {
    return { playVd: playVd };
    function playVd(path) {
      // var path = 'file:/storage/emulated/0/dcim/camera/' + fileName;
      var q = $q.defer();
      try {
        cordova.plugins.disusered.open(path, function (res) {
          q.resolve(res);
        }, function (err) {
          q.reject(error);
        });
      } catch (exception) {
        q.reject(exception);
      }
      return q.promise;
    }
  }
}());
app.factory('videoService', [
  '$cordovaCapture',
  'sqliteService',
  'intermediateService',
  'momentService',
  'playVds',
  function ($cordovaCapture, sqliteService, intermediateService, momentService, playVds) {
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
    var _insertVideo = function (idinspeccion, path, sync, thumbnail, onUpload, defaultPath) {
      var query = 'INSERT INTO idVideos(idinspeccion, path,sync,uuid,thumbnail, onUpload, placa, fecha, rutaSrv, defaultPath  ) VALUES (?,?,?,?,?,?,?,?, ?,?)';
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
        momentService.rutaSrv(path),
        defaultPath
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
    var _playVideo = function (fullPath) {
      var fileName = fullPath.replace(/^.*[\\\/]/, '');
      return playVds.playVd(fullPath);
    };
    videoServiceFactory.all = _all;
    videoServiceFactory.takedVid = _takedVid;
    videoServiceFactory.getVideos = _getVideos;
    videoServiceFactory.insertVideo = _insertVideo;
    videoServiceFactory.updateVideo = _updateVideo;
    videoServiceFactory.playVideo = _playVideo;
    return videoServiceFactory;
  }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiRm90b3MvRm90b0NvbnRyb2xsZXIuanMiLCJGb3Rvcy9mb3Rvc1NlcnZpY2UuanMiLCJGb3Rvcy9ydG5GaW5kLmpzIiwiY29kRmFzL0NvZEZhcy5qcyIsImNvZEZhcy9jb2RmYXNTcnYuanMiLCJjb250cm9sbGVycy9BY2Nlc29yaW9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJpbnNwZWNjaW9uL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiaW5zcGVjY2lvbi9pbnNwZWNjaW9uU2VydmljZS5qcyIsInBsYWNhcy9QbGFjYXNDb250cm9sbGVyLmpzIiwicGxhY2FzL3BsYWNhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZGx0RmlsZS5qcyIsInNlcnZpY2VzL2Vhc3lEaXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZXJyb3JTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlsZVRyYW5zZmVyU2VydmljZS5qcyIsInNlcnZpY2VzL2ZpcnN0SW5pdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9mb2N1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9nZXRWaWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9ncHNTZXJ2aWNlLmpzIiwic2VydmljZXMvaW50ZXJtZWRpYXRlU2VydmljZS5qcyIsInNlcnZpY2VzL21vbWVudFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vZmZsaW5lU2VydmljZS5qcyIsInNlcnZpY2VzL29ubGluZVN0YXR1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9zcWxpdGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdGl0bGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvdW5zeW5jU2VydmljZS5qcyIsInNlcnZpY2VzL3VwZGF0ZVN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmpzIiwic2VydmljZXMvenVtZXJvU2VydmljZS5qcyIsInNldHRpbmdzL1NldHRpbmdzLmpzIiwic2V0dGluZ3Mvc2V0dGluZ3NTcnYuanMiLCJ2aWRlb3MvVmlkZW9Db250cm9sbGVyLmpzIiwidmlkZW9zL3BsYXlWZHMuanMiLCJ2aWRlb3MvdmlkZW9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbi8vIHZhciBscyA9IG51bGw7XG4vLyB2YXIgenVtZXJvID0gbnVsbDtcbi8vIHZhciBjcyA9IG51bGw7XG4vLyB2YXIgenMgPSBudWxsO1xuLy8gdmFyIHBzID0gbnVsbDtcbi8vIHZhciBwYyA9IG51bGw7XG4vLyB2YXIgY2YgPSBudWxsO1xuLy8gdmFyIGVkID0gbnVsbDtcbi8vIHZhciBjYyA9IG51bGw7XG4vLyBwcnVlYmFzIGxvY2FsZXNcbnZhciBkYiA9IG51bGw7XG52YXIgZiA9IG51bGw7XG52YXIgaSA9IG51bGw7XG4vLyB2YXIgc2VydmljZXMgPSB7fTtcbi8vIHZhciBuZ0NvcmRvdmEgPSB7fTtcbi8vIHZhciBhbHJlYWR5SW5zcGVjdCA9IGZhbHNlO1xuLy8gdmFyIHJwID0gbnVsbDtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFtcbiAgJ2lvbmljJyxcbiAgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLFxuICAnbmdTdG9yYWdlJyxcbiAgJ25nQ29yZG92YScsXG4gICd1aS51dGlscycsXG4gICduZ0Z4JyxcbiAgJ25nQW5pbWF0ZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZSdcbl0pLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJyk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhcHAnLCB7XG4gICAgdXJsOiAnL2FwcCcsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVudS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQXBwQ3RybCdcbiAgfSkuc3RhdGUoJ2FwcC5zZWFyY2gnLCB7XG4gICAgdXJsOiAnL3NlYXJjaCcsXG4gICAgdmlld3M6IHsgJ21lbnVDb250ZW50JzogeyB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9zZWFyY2guaHRtbCcgfSB9XG4gIH0pLnN0YXRlKCdhcHAuYnJvd3NlJywge1xuICAgIHVybDogJy9icm93c2UnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnJvd3NlLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLnBsYXlsaXN0cycsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdHMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdHNDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGFjYXMnLCB7XG4gICAgdXJsOiAnL3BsYWNhcycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9wbGFjYXMvcGxhY2FzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxhY2FzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuc2luZ2xlJywge1xuICAgIHVybDogJy9wbGF5bGlzdHMvOnBsYXlsaXN0SWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5mb3RvJywge1xuICAgIHVybDogJy9mb3Rvcy86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvRm90b3MvZm90by5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0ZvdG9DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC52aWRlbycsIHtcbiAgICB1cmw6ICcvdmlkZW8vOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZGVvcy92aWRlby5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1ZpZGVvQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuaW5zcGVjY2lvbicsIHtcbiAgICB1cmw6ICcvaW5zcGVjY2lvbi86aWQvOnBsYWNhLzpjYWxpZmljYWRvJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2luc3BlY2Npb24vaW5zcGVjY2lvbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0luc3BlY2Npb25DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcbiAgICB1cmw6ICcvc2V0dGluZ3MnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5ncyAgYXMgU3QnICAvLyAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyQXM6ICd2bSdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuY29kRmFzJywge1xuICAgIHVybDogJy9jb2RmYXMvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZEZhcy9jb2RmYXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb2RGYXMgYXMgdm0nXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgIHVybDogJy9sb2dpbicsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW5Jb25pYy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcidcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuYWNjZXNvcmlvcycsIHtcbiAgICB1cmw6ICcvYWNjZXNvcmlvcy86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FjY2Vzb3Jpb3MuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBY2Nlc29yaW9zQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2xvZ2luJyk7XG4gIC8vIFRPRE86IHBhcmEgcXVlIHNlIGNvbnNpZGVyZW4gc2FuYXMgbGFzIG5nLXNyYyBxdWUgdGVuZ2FuIGVzdGEgc2ludGF4aXM7XG4gICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZmlsZXxibG9ifGNkdmZpbGV8Y29udGVudCk6fGRhdGE6aW1hZ2VcXC8vKTtcbiAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKHRydWUpO1xufSk7XG52YXIgc2VydmljZUJhc2UgPSAnaHR0cDovL2FqdXN0ZXZzaXZhLmNvbSc7XG4vL2F1dGgvJzsvLyAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvJztcbmFwcC5jb25zdGFudCgnbmdBdXRoU2V0dGluZ3MnLCB7XG4gIGFwaVNlcnZpY2VCYXNlVXJpOiBzZXJ2aWNlQmFzZSxcbiAgY2xpZW50SWQ6ICduZ0F1dGhBcHAnXG59KS5jb25maWcoZnVuY3Rpb24gKCRwcm92aWRlKSB7XG4gICRwcm92aWRlLmRlY29yYXRvcignJGV4Y2VwdGlvbkhhbmRsZXInLCBmdW5jdGlvbiAoJGRlbGVnYXRlLCAkaW5qZWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4Y2VwdGlvbiwgY2F1c2UpIHtcbiAgICAgICRkZWxlZ2F0ZShleGNlcHRpb24sIGNhdXNlKTtcbiAgICAgIGlmIChkYikge1xuICAgICAgICB2YXIgc3FsaXRlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ3NxbGl0ZVNlcnZpY2UnKTtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgICAgdmFyIG1vbWVudFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdtb21lbnRTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgIElOVE8gW2xvZ3NdKFtleF0sW2VtYWlsXSxbZmVjaGFdKSAgVkFMVUVTKD8sPyw/KSc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICAgIGFuZ3VsYXIudG9Kc29uKGV4Y2VwdGlvbiksXG4gICAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUgfHwgJycsXG4gICAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAgIF07XG4gICAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfSkgIC8vIHZhciBhbGVydGluZyA9ICRpbmplY3Rvci5nZXQoXCJhbGVydGluZ1wiKTtcbiAgICAgICAgICAgIC8vIGFsZXJ0aW5nLmFkZERhbmdlcihleGNlcHRpb24ubWVzc2FnZSk7XG47XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KS5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0LCAkaW9uaWNQbGF0Zm9ybSwgJGxvY2FsU3RvcmFnZSwgJGNvcmRvdmFTUUxpdGUsIGNoZWNrRmlsZVNlcnZpY2UsIHZpZGVvVGh1bWJuYWlsU2VydmljZSwgJGNvcmRvdmFDYW1lcmEsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsICRjb3Jkb3ZhRmlsZSwgZWFzeURpclNlcnZpY2UsIGdldFZpZGVvU2VydmljZSwgY29weUZpbGVTZXJ2aWNlLCBhY2Nlc29yaW9zU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsIHBsYWNhc1NlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGNvcmRvdmFFdmVudHNTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBmaXJzdEluaXRTZXJ2aWNlLCBhdXRoU2VydmljZSwgZGV2aWNlU2VydmljZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJHN0YXRlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1bnN5bmNTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIGdwc1NlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xuICAgIC8vICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgIC8vICAgY29uc29sZS5sb2coZXZlbnQsIG5leHQsIGN1cnJlbnQpO1xuICAgIC8vIH0pO1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpO1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAodG9TdGF0ZS5uYW1lID09PSAnYXBwLmxvZ2luJykge1xuICAgICAgICAvLyBkb2Ugc2hlL2hlIHRyeSB0byBnbyB0byBsb2dpbj8gLSBsZXQgaGltL2hlciBnb1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZyhhdXRoRGF0YSwgbW9tZW50U2VydmljZS5kaWZmTm93KGF1dGhEYXRhLmV4cCwgJ20nKSwgJz4gLTYwJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhIHx8IG1vbWVudFNlcnZpY2UuZGlmZk5vdyhhdXRoRGF0YS5leHAsICdtJykgPiAtNjApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWRpcmVjdCcpO1xuICAgICAgICAgIC8vV2FzIGNhbGxpbmcgdGhpcyBidXQgY29tbWVudGluZyBvdXQgdG8ga2VlcCBpdCBzaW1wbGU6IGF1dGhTZXJ2aWNlLnJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIC8vQ2hhbmdlcyBVUkwgYnV0IG5vdCB0aGUgdmlldyAtIGdvZXMgdG8gb3JpZ2luYWwgdmlldyB0aGF0IEknbSB0cnlpbmcgdG8gcmVkaXJlY3RcbiAgICAgICAgICAvL2F3YXkgZnJvbSBub3cgd2l0aCAxLjMuIEZpbmUgd2l0aCBpdCBidXQgaW50ZXJlc3RlZCBpbiB1bmRlcnN0YW5kaW5nIHRoZSBcbiAgICAgICAgICAvL1wicHJvcGVyXCIgd2F5IHRvIGRvIGl0IG5vdyBzbyBsb2dpbiB2aWV3IGdldHMgcmVkaXJlY3RlZCB0by5cbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpOyAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvL05pY2UgYWRkaXRpb24hIENhbid0IGRvIGFueSByZWRpcmVjdCB3aGVuIGl0J3MgY2FsbGVkIHRob3VnaFxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBscyA9ICRsb2NhbFN0b3JhZ2U7XG4gICAgLy8genVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlID0genVtZXJvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5nZXRWaWRlb1NlcnZpY2UgPSBnZXRWaWRlb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuY29weUZpbGVTZXJ2aWNlID0gY29weUZpbGVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmZpbGVUcmFuc2ZlclNlcnZpY2UgPSBmaWxlVHJhbnNmZXJTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnZpZGVvVGh1bWJuYWlsU2VydmljZSA9IHZpZGVvVGh1bWJuYWlsU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5lYXN5RGlyU2VydmljZSA9IGVhc3lEaXJTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmNoZWNrRmlsZVNlcnZpY2UgPSBjaGVja0ZpbGVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmFjY2Vzb3Jpb3NTZXJ2aWNlID0gYWNjZXNvcmlvc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuaW5zcGVjY2lvblNlcnZpY2UgPSBpbnNwZWNjaW9uU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy51bnN5bmNTZXJ2aWNlID0gdW5zeW5jU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5wbGFjYXNTZXJ2aWNlID0gcGxhY2FzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5vbmxpbmVTdGF0dXNTZXJ2aWNlID0gb25saW5lU3RhdHVzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5jb3Jkb3ZhRXZlbnRzU2VydmljZSA9IGNvcmRvdmFFdmVudHNTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnRvYXN0U2VydmljZSA9IHRvYXN0U2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5vZmZsaW5lU2VydmljZSA9IG9mZmxpbmVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmxvY2FsU3RvcmFnZSA9ICRsb2NhbFN0b3JhZ2U7XG4gICAgLy8gc2VydmljZXMuZmlyc3RJbml0U2VydmljZSA9IGZpcnN0SW5pdFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMubW9tZW50U2VydmljZSA9IG1vbWVudFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5kZXZpY2VTZXJ2aWNlID0gZGV2aWNlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5pbnRlcm1lZGlhdGVTZXJ2aWNlID0gaW50ZXJtZWRpYXRlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5mb3Rvc1NlcnZpY2UgPSBmb3Rvc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZ3BzU2VydmljZSA9IGdwc1NlcnZpY2U7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFTUUxpdGUgPSAkY29yZG92YVNRTGl0ZTtcbiAgICAvLyBuZ0NvcmRvdmEuY29yZG92YUZpbGUgPSAkY29yZG92YUZpbGU7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFDYW1lcmEgPSAkY29yZG92YUNhbWVyYTtcbiAgICAvLyB6cyA9IHp1bWVyb1NlcnZpY2U7XG4gICAgLy8gY3MgPSA7XG4gICAgLy8gY2YgPSA7XG4gICAgLy8gZWQgPSBlYXN5RGlyU2VydmljZTtcbiAgICAvLyBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQignemRiZmlsZS5kYicsIDEpO1xuICAgIC8vIGNjID0gJGNvcmRvdmFDYW1lcmE7XG4gICAgLy8gY2MgPSBnZXRWaWRlb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZS5zZXRadW1lcm8oJ3pkYmZpbGUnKTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnenVtZXJvdGVzdGRiZmlsZScpO1xuICAgIHp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6dW1lcm90ZXN0ZGJmaWxlJyk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5vbk9ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PZmZsaW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuY29ublR5cGUoKTtcbiAgICBjb3Jkb3ZhRXZlbnRzU2VydmljZS5vblBhdXNlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25SZXN1bWUoKTtcbiAgICBkZXZpY2VTZXJ2aWNlLnNldEluZm8oKTtcbiAgICAvLyBUT0RPOiAgdmVyaWZpY2FyIHNpIGV4aXN0ZSBlbiBlbCBsb2NhbHN0b3JhZ2UgYWxndW5hIGJhbmRlcmEgcXVlIGRpZ2Egc2kgeWEgc2Ugc3luYyBhbGd1bmEgdmV6IFxuICAgICRsb2NhbFN0b3JhZ2UubWVzc2FnZSA9ICdIZWxsbyBXb3JsZCc7XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7ICAvLyB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbiB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICB9KTtcbn0pOyAgLy8gYXBwLnJ1bihbXG4gICAgIC8vICAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAgICAvLyAgICckbG9jYXRpb24nLFxuICAgICAvLyAgIGZ1bmN0aW9uIChsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgICAgLy8gICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAvLyAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgLy8gICAgICAgLy8gVE9ETzogZXN0byBubyBlcyBuZWNlc2FyaW8sIHBvciBxdWUgYWwgaW50ZW50YXIgc2luY3Jvbml6YXIgdW5hIGltYWdlbiB5IGVsIHRva2VuIGVzdGEgdmVuY2lkbywgc2UgcmVkaXJlY2Npb25hIGEgbG9naW4gYXV0b21hdGljYW1lbnRlXG4gICAgIC8vICAgICAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgIC8vICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgIC8vICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgLy8gICAgICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpID4gMCkge1xuICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbicpO1xuICAgICAvLyAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgICAgfVxuICAgICAvLyAgICAgfVxuICAgICAvLyAgIH1cbiAgICAgLy8gXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycsIFtdKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTW9kYWwsICR0aW1lb3V0KSB7XG4gIC8vIEZvcm0gZGF0YSBmb3IgdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcbiAgLy8gQ3JlYXRlIHRoZSBsb2dpbiBtb2RhbCB0aGF0IHdlIHdpbGwgdXNlIGxhdGVyXG4gICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL2xvZ2luLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgfSk7XG4gIC8vIFRyaWdnZXJlZCBpbiB0aGUgbG9naW4gbW9kYWwgdG8gY2xvc2UgaXRcbiAgJHNjb3BlLmNsb3NlTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgfTtcbiAgLy8gT3BlbiB0aGUgbG9naW4gbW9kYWxcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gIH07XG4gIC8vIFBlcmZvcm0gdGhlIGxvZ2luIGFjdGlvbiB3aGVuIHRoZSB1c2VyIHN1Ym1pdHMgdGhlIGxvZ2luIGZvcm1cbiAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RvaW5nIGxvZ2luJywgJHNjb3BlLmxvZ2luRGF0YSk7XG4gICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXG4gICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jbG9zZUxvZ2luKCk7XG4gICAgfSwgMTAwMCk7XG4gIH07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAkc2NvcGUucGxheWxpc3RzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnUmVnZ2FlJyxcbiAgICAgIGlkOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NoaWxsJyxcbiAgICAgIGlkOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0R1YnN0ZXAnLFxuICAgICAgaWQ6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnSW5kaWUnLFxuICAgICAgaWQ6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUmFwJyxcbiAgICAgIGlkOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0Nvd2JlbGwnLFxuICAgICAgaWQ6IDZcbiAgICB9XG4gIF07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdGb3RvQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICckZmlsdGVyJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICAnJGxvZycsXG4gICckaW9uaWNNb2RhbCcsXG4gIGZ1bmN0aW9uIChzLCBmb3Rvc1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgJGZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgY29weUZpbGVTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSwgJGxvZywgJGlvbmljTW9kYWwpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2pzL0ZvdG9zL2ZvdG9Nb2RhbC5odG1sJywge1xuICAgICAgICBzY29wZTogcyxcbiAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgICBzLm1vZGFsID0gbW9kYWw7XG4gICAgICAgICRsb2cuZGVidWcobW9kYWwpO1xuICAgICAgfSk7XG4gICAgICAvLyBzLnRpdHRsZSA9ICcnO1xuICAgICAgcy50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICBzLmltZ1Vuc3luYyA9IFtdO1xuICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBGVU5DSU9OQSBCSUVOIFBBUkEgVkVSIEVMIENBTUJJTyBJTk1FRElBVEFNRU5URVxuICAgICAgLy8gcy5vbmxpbmVTdGF0dXMgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIFJFUVVJRVJFIE9UUk8gRElHRVNUIFBBUkEgUVVFIEZVTkNJT05FXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEUgIEVTIE1FSk9SIFJBU1RSRUFSIFNJRU1QUkUgVU4gT0JKRVRPXG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIC8vICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAvLyBUT0RPOiBvbmhvbGQgY2FuIGVkaXQgcGxhY2EsIG9uIHN3aXBlIGxlZnQgZGVsZXRlIHdpdGggY29uZmlybVxuICAgICAgLy8gVE9ETzogYWx3YXlzIHVzZSBpb24tbmF2LXRpdGxlICwgcGFyYSBwb2RlcmxlIHBvbmVyIGxvcyB0aXR1bG9zIHF1ZSBxdWllcm9cbiAgICAgIC8vIHMub3NzID0geyBvbmxpbmU6IG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUgfTtcbiAgICAgIHMucGhvdG9zID0gZm90b3NTZXJ2aWNlLnBob3RvcztcbiAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICBzLmZvdG9zRmFsdCA9IFtdO1xuICAgICAgcy5nZXRQaG90b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IGNyZW8gayBlcyBtZWpvciBoYWNlciByZWZlcmVuY2lhIGRpcmVjdGFtZW50ZSBhIGludGVybWVkaWF0ZXNlcnZpY2UuREFUQSAuaWRpbnNwZWNjaW9uIGsgYSBzLmlkaW5zcGVjY2lvbjtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmdldFBob3RvcyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzLnBob3RvcyA9IGZvdG9zU2VydmljZS5waG90b3M7XG4gICAgICAgICAgcy5uYW1lcyA9IGZvdG9zU2VydmljZS5uYW1lcztcbiAgICAgICAgICBzLmZvdG9zRmFsdCA9IGZvdG9zU2VydmljZS5mb3Rvc0ZhbHQ7XG4gICAgICAgICAgX2ZpbHRlclVuc3luYygwKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIHMuJG9uKCdteUV2ZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXkgZXZlbnQgb2NjdXJyZWQnLCBzLmlkaW5zcGVjY2lvbiwgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgIHMuZ2V0UGhvdG9zKCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBfZmlsdGVyVW5zeW5jID0gZnVuY3Rpb24gKGVxdWFsKSB7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHN5bmM6IGVxdWFsIH0sIHRydWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzLnBob3RvcywgZm91bmQpO1xuICAgICAgICBzLmltZ1Vuc3luYyA9IGZvdW5kO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMubWFzc2l2ZUxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocy5tYXNzaXZlTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzLm1hc3NpdmVMZW5ndGgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoLCAnc3luYycpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgLy9UT0RPIDogQ1VBTkRPIEVTIFVOQSBTT0xBIEVTVEEgQklFTiwgQ1VFTkFPRCBFUyBVTiBBUlJBWSBERUJPIERFIEhBQ0VSIFFVRSBTWU5DIENPTiBMQSBVTFRJTUEgRk9UTyBVTiAuTEVOVEhHIFBVRURFIFNFUlxuICAgICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIC8vIHZhciBydG5UaXBvRm90bz1mdW5jdGlvbigpe1xuICAgICAgLy8gICByZXR1cm4gXG4gICAgICAvLyB9XG4gICAgICB2YXIgaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmluc2VydEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChmb3Rvc1NlcnZpY2UudGlwb0ZvdG8uY2FudGlkYWQgPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzLmZvdG9zRmFsdC5pbmRleE9mKGZvdG9zU2VydmljZS50aXBvRm90byk7XG4gICAgICAgICAgICAkbG9nLmRlYnVnKGluZGV4KTtcbiAgICAgICAgICAgIHMuZm90b3NGYWx0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpGb3RvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9iakZvdG8ucHJvZ3Jlc3MgPSBwZXJjZW50YWdlO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqZWN0Rm90byA9IGZ1bmN0aW9uIChwbGFjYSwgcGF0aCwgc3luYywgb25VcGxvYWQsIGlkdGlwbykge1xuICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgIHBsYWNhOiBwbGFjYSxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHN5bmM6IHN5bmMsXG4gICAgICAgICAgb25VcGxvYWQ6IG9uVXBsb2FkLFxuICAgICAgICAgIC8vcy5vc3Mub25saW5lID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgcnV0YVNydjogbW9tZW50U2VydmljZS5ydXRhU3J2KHBhdGgpLFxuICAgICAgICAgIGlkdGlwbzogaWR0aXBvXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9O1xuICAgICAgdmFyIHNlYXJjaE9uZUluQXJyYXkgPSBmdW5jdGlvbiAoc3JjSW1nKSB7XG4gICAgICAgIC8vIFRPRE86IEhBQlJBIE9UUkEgRk9STUEgREUgRklMVEFSIE1BUyBSQVBJREEgSyBFTCBTVFJJTkcgUEFUSDtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy5waG90b3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqRm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQob2JqRm90byk7XG4gICAgICB9O1xuICAgICAgLy8gcy5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgICAvLyAgIHMub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAgIC8vICAgaWYgKGJvb2wpIHtcbiAgICAgIC8vICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfTtcbiAgICAgIHMuc3luY0ltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcy5tYXNzaXZlTGVuZ3RoID0gcy5pbWdVbnN5bmMubGVuZ3RoO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gocy5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgIHMudHJ5VXBsb2FkKG9iaik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuc2V0bmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKG5vbWJyZSwgZm90byk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkdGlwbywgZm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS5zZXROYW1lKGlkdGlwbywgZm90bykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5mb3Rvc0ZhbHQgPSBmb3Rvc1NlcnZpY2UuZm90b3NGYWx0O1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IHRydWU7XG4gICAgICAgIGZvdG9zU2VydmljZS50YWtlZHBpYygpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgICAgLy8gVE9ETzogcGFyYSBsYXMgdGFibGV0cyBhcGFnbyBlbCBncHMsIHkgYWxnbyBwYXNhIGNvbiBsYSBjYW1hcmFcbiAgICAgICAgICAvLyBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgaWYgKCFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGFpc1Rha2luZ0dlbykge1xuICAgICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhaXNUYWtpbmdHZW8gPSB0cnVlO1xuICAgICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZVVSSSk7XG4gICAgICAgICAgLy8gZm90b3NTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9udXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGjCv2d1YXJkYXIgYXF1aSBlbCBzcWxpdGUgeSBsdWVnbyBhY3R1YWxpemFybG8gc2kgc3ViZSBleGl0b3NvO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9iamVjdEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCwgZm90b3NTZXJ2aWNlLnRpcG9Gb3RvLmlkVGlwb0ZvdG8pO1xuICAgICAgICAgICAgcy5waG90b3MucHVzaChvYmopO1xuICAgICAgICAgICAgaW5zZXJ0Rm90byhyZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ21haW5TY3JvbGwnKS5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBlcyBtZWpvciBsbGFtYXIgYSB1bmEgZnVuY2lvbiwgcG9yIHF1ZSBhc2kgc2UgZWplY3V0YSBwYXJhIGNhZGEgdW5vLCB5IHNlIGVqZWN1dGEgYmllbiwgZW4gdmV6IGRlIGxsYW1hciBmaWx1cGxvYWQgZGVzZGUgYWNhXG4gICAgICAgICAgICAvL3ByZUZpbGVVcGxvYWQocmVzLm5hdGl2ZVVSTCk7ICAvLyAkc2NvcGUucGhvdG9zLnB1c2gocmVzLm5hdGl2ZVVSTCk7XG4gICAgICAgICAgICBwcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgcy5zZXRJZFRpcG9Gb3RvID0gZnVuY3Rpb24gKHRpcG9Gb3RvKSB7XG4gICAgICAgICRsb2cuZGVidWcodGlwb0ZvdG8pO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGlwb0ZvdG8gPSB0aXBvRm90bztcbiAgICAgICAgcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgIC8vIFxuICAgICAgICBzLmdldFBpY0ZpbGUoKTtcbiAgICAgIH07XG4gICAgICBzLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgIHMubGlzdFBpY3MgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDQ5NCxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdQbGFjYScsXG4gICAgICAgICAgJ29yZGVuJzogJzEnLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA2MjUsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRnJlbnRlIExpY2VuY2lhIFRyYW5zaXRvJyxcbiAgICAgICAgICAnb3JkZW4nOiAxMCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk1LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ0RlbGFudGVyYSBEZXJlY2hhJyxcbiAgICAgICAgICAnb3JkZW4nOiA0MCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk2LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ0RlbGFudGVyYSBJenF1aWVyZGEnLFxuICAgICAgICAgICdvcmRlbic6IDMwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTcsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnVHJhc2VyYSBEZXJlY2hhJyxcbiAgICAgICAgICAnb3JkZW4nOiA1MCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZvdG9zU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FtZXJhJyxcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdydG5GaW5kJyxcbiAgJyRmaWx0ZXInLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYW1lcmEsICRjb3Jkb3ZhRmlsZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgbW9tZW50U2VydmljZSwgcnRuRmluZCwgJGZpbHRlcikge1xuICAgIHZhciBmb3Rvc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm5hbWVzID0gW107XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnRpcG9Gb3RvID0ge307XG4gICAgLy8gW3tcbiAgICAvLyAgICAgcGxhY2E6ICdBQkMxMTEnLFxuICAgIC8vICAgICBzcmM6ICcnLFxuICAgIC8vICAgICBzeW5jOiBmYWxzZVxuICAgIC8vICAgfV07XG4gICAgdmFyIF9yZW1vdmUgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLnNwbGljZShmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcy5pbmRleE9mKHBsYWNhKSwgMSk7XG4gICAgfTtcbiAgICB2YXIgX2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcztcbiAgICB9O1xuICAgIHZhciBfdGFrZWRwaWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgcXVhbGl0eTogNDUsXG4gICAgICAgIC8vNTAsXG4gICAgICAgIGRlc3RpbmF0aW9uVHlwZTogQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5GSUxFX1VSSSxcbiAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgLy8gYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgICBlbmNvZGluZ1R5cGU6IENhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgICAgdGFyZ2V0V2lkdGg6IDEwMDAsXG4gICAgICAgIC8vaW1wb3J0YW50ZSBjb24gMTAwIHNlIHZlaWEgaG9ycmlibGVcbiAgICAgICAgdGFyZ2V0SGVpZ2h0OiAxMDAwLFxuICAgICAgICAvLyBUT0RPOiByZXZpc2FyIHBhcmEgcXVlIHNpcnZlIGVzdGEgb3BjaW9uXG4gICAgICAgIC8vIHBvcG92ZXJPcHRpb25zOiBDYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2VcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICByZXR1cm4gaW1hZ2VVUkk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGhvdG9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRmb3RvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBfZ2V0TmFtZXMoKTsgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0TmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkVGlwb0ZvdG8sIE5vbWJyZUZvdG8sIGVuYWJsZWQgICBmcm9tIHRpcG9zRm90byBXSEVSRSBlbmFibGVkPTEgb3JkZXIgYnkgbm9tYnJlZm90byc7XG4gICAgICB2YXIgcXVlcnkgPSAnIHNlbGVjdCBmYy5pZFRpcG9Gb3RvLCBOb21icmVGb3RvLGZjLm9yZGVuLCBmYy5jYW50aWRhZCAnO1xuICAgICAgcXVlcnkgKz0gJyBmcm9tIHRpcG9zRm90byB0ZiAnO1xuICAgICAgcXVlcnkgKz0gJyBpbm5lciBqb2luIGZvdG9zY2lhIGZjIG9uIHRmLmlkVGlwb0ZvdG89ZmMuaWRUaXBvRm90byAnO1xuICAgICAgcXVlcnkgKz0gJyBhbmQgdGYuZW5hYmxlZD0xIGFuZCBmYy5lbmFibGVkPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdvcmRlciBieSBmYy5vcmRlbiAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgICAgLy8gYW5ndWxhci5jb3B5KGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMsIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0KTtcbiAgICAgICAgLy8gZm90b3NTZXJ2aWNlRmFjdG9yeS5vcmRlckJ5KGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0LCAnb3JkZW4nLCBmYWxzZSk7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NQZW5kaWVudGVzKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX29yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXksIGV4cHJlc3Npb24sIHJldmVyc2UpIHtcbiAgICAgIGFycmF5ID0gJGZpbHRlcignb3JkZXJCeScpKGFycmF5LCBleHByZXNzaW9uLCByZXZlcnNlKTtcbiAgICB9O1xuICAgIHZhciBfZm90b3NQZW5kaWVudGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgYW5ndWxhci5jb3B5KGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMsIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0KTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIHZhciBmaWx0ZXJPYmogPSB7IGlkVGlwb0ZvdG86IG9iai5pZHRpcG8gfTtcbiAgICAgICAgcnRuRmluZC5ybU9iakZyb21BcnJheShmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zRmFsdCwgZmlsdGVyT2JqKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gaW1hZ2VVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNvcHlGaWxlKGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5LCBGaWxlTmFtZSwgY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG5ld0ZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBzdWNjZXNzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZGZvdG9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsZGVsZXRlZCwgb25VcGxvYWQsIHBsYWNhLCBmZWNoYSwgcnV0YVNydiwgaWR0aXBvKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyw/KSc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIC8vIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgICAgaW1hZ2VVUkksXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIDAsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgbW9tZW50U2VydmljZS5ydXRhU3J2KGltYWdlVVJJKSxcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS50aXBvRm90by5pZFRpcG9Gb3RvXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IHN5bmM9PyAsIG9uVXBsb2FkPSA/IFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3NldE5hbWUgPSBmdW5jdGlvbiAoaWR0aXBvLCBmb3RvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IGlkdGlwbz0/ICBXSEVSRSBpZGluc3BlY2Npb24gPT8gQU5EIHBhdGg9Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWR0aXBvLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBmb3RvLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5yb3dzQWZmZWN0ZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB3YXMgdXBkYXRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5yb3dzQWZmZWN0ZWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NQZW5kaWVudGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnJlbW92ZSA9IF9yZW1vdmU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBfYWxsO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudGFrZWRwaWMgPSBfdGFrZWRwaWM7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lmluc2VydEZvdG8gPSBfaW5zZXJ0Rm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmdldFBob3RvcyA9IF9nZXRQaG90b3M7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS51cGRhdGVGb3RvID0gX3VwZGF0ZUZvdG87XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5zZXROYW1lID0gX3NldE5hbWU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMgPSBfZm90b3NQZW5kaWVudGVzO1xuICAgIGZvdG9zU2VydmljZUZhY3Rvcnkub3JkZXJCeSA9IF9vcmRlckJ5O1xuICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ3J0bkZpbmQnLCBbXG4gICAgJyRmaWx0ZXInLFxuICAgICckbG9nJyxcbiAgICBydG5GaW5kXG4gIF0pO1xuICBmdW5jdGlvbiBydG5GaW5kKCRmaWx0ZXIsICRsb2cpIHtcbiAgICB2YXIgcnRuRmluZEZhY3RvcnkgPSB7IHJtT2JqRnJvbUFycmF5OiBybU9iakZyb21BcnJheSB9O1xuICAgIHJldHVybiBydG5GaW5kRmFjdG9yeTtcbiAgICAvLyBib2R5Li4uXG4gICAgZnVuY3Rpb24gcm1PYmpGcm9tQXJyYXkoYXJyYXksIGZpbHRlck9iaikge1xuICAgICAgdmFyIHN1YkFycmF5ID0gJGZpbHRlcignZmlsdGVyJykoYXJyYXksIGZpbHRlck9iaiwgdHJ1ZSk7XG4gICAgICAkbG9nLmRlYnVnKHN1YkFycmF5KTtcbiAgICAgIGlmIChzdWJBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHN1YkFycmF5WzBdO1xuICAgICAgICBpZiAob2JqLmNhbnRpZGFkID4gMCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2Yob2JqKTtcbiAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuY29udHJvbGxlcignQ29kRmFzJywgW1xuICAgICckbG9nJyxcbiAgICAnY2ZzZXInLFxuICAgICdlcnJvclNlcnZpY2UnLFxuICAgIGNvZEZhc1xuICBdKTtcbiAgZnVuY3Rpb24gY29kRmFzKCRsb2csIGNmc2VyLCBlcnJvclNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLm1hcmNhcyA9IFtdO1xuICAgIHZtLmRhdGEgPSBjZnNlci5vYmpDb2RGYXM7XG4gICAgLy8gdm0uZmlsdGVyID0geyBtYXJjYTogJycgfTtcbiAgICB2bS5zZXRDb2RGYXMgPSBzZXRDb2RGYXM7XG4gICAgdm0udXBkQ29kRmFzID0gdXBkQ29kRmFzO1xuICAgIGFjdGl2YXRlKCk7XG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICBjZnNlci5nZXRDb2RGYXMoKS50aGVuKHNlbGVjdE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29kRmFzKCkge1xuICAgICAgJGxvZy5kZWJ1Zygnb3BlbiBzZXRjb2RmYXMnLCB2bS5kYXRhKTtcbiAgICAgIGNmc2VyLmluc2VydENvZEZhcygpLnRoZW4oaW5zZXJ0T2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRDb2RGYXMoKSB7XG4gICAgICBjZnNlci51cGRDb2RGYXMoKS50aGVuKHVwZE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgLy8vLy8vL1xuICAgIGZ1bmN0aW9uIGluc2VydE9rKCkge1xuICAgICAgJGxvZy5kZWJ1ZygnaW5zZXJ0IG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlbGVjdE9rKCkge1xuICAgICAgJGxvZy5kZWJ1Zygnc2VsZWN0IG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZE9rKCkge1xuICAgICAgJGxvZy5kZWJ1ZygndXBkIG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgnY2ZzZXInLCBbXG4gICAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAgICdzcWxpdGVTZXJ2aWNlJyxcbiAgICAnbW9tZW50U2VydmljZScsXG4gICAgJ3p1bWVyb1NlcnZpY2UnLFxuICAgICd0b2FzdFNlcnZpY2UnLFxuICAgIGNmc2VyXG4gIF0pO1xuICBmdW5jdGlvbiBjZnNlcihpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgY2ZGYWN0b3J5ID0ge1xuICAgICAgb2JqQ29kRmFzOiB7XG4gICAgICAgIGNvZEZhc2Vjb2xkYTogbnVsbCxcbiAgICAgICAgYWxyZWFkeVNldDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBpbnNlcnRDb2RGYXM6IGluc2VydENvZEZhcyxcbiAgICAgIHVwZENvZEZhczogdXBkQ29kRmFzLFxuICAgICAgZ2V0Q29kRmFzOiBnZXRDb2RGYXNcbiAgICB9O1xuICAgIHJldHVybiBjZkZhY3Rvcnk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0Q29kRmFzKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZGluc3BlY2Npb25Db2RpZ29zRmFzZWNvbGRhXSAoW2lkaW5zcGVjY2lvbl0gLFtwbGFjYV0gICxbY29kRmFzZWNvbGRhXSAgLFtmZWNoYV0pICBWQUxVRVMoPyw/LD8sPykgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuY29kRmFzZWNvbGRhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSB0cnVlO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdjb2RpZ28gaW5ncmVzYWRvJyk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyNCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZENvZEZhcygpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGFdICc7XG4gICAgICBxdWVyeSArPSAnU0VUIFtjb2RGYXNlY29sZGFdID0gPyAsICc7XG4gICAgICBxdWVyeSArPSAnW2ZlY2hhXSA9ID8gLCAnO1xuICAgICAgcXVlcnkgKz0gJ1tpZGFqdXN0ZXZdID0gTlVMTCAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFIGlkaW5zcGVjY2lvbj0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NvZGlnbyBhY3R1YWxpemFkbycpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMjQpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDb2RGYXMoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb25Db2RpZ29zRmFzZWNvbGRhIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2ludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEgPSBhcnJheVswXS5jb2RGYXNlY29sZGE7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5hbHJlYWR5U2V0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSA9IG51bGw7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5hbHJlYWR5U2V0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0oKSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0FjY2Vzb3Jpb3NDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAncGxhY2FzU2VydmljZScsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICckbG9jYXRpb24nLFxuICAnJGlvbmljUG9wdXAnLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZm9jdXMnLFxuICAnJHN0YXRlJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ2FjY2Vzb3Jpb3NTZXJ2aWNlJyxcbiAgJ2ZvdG9zU2VydmljZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsIHp1bWVyb1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBwbGFjYXNTZXJ2aWNlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGxvY2F0aW9uLCAkaW9uaWNQb3B1cCwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZvY3VzLCAkc3RhdGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZVBhcmFtcywgJGlvbmljTW9kYWwsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIGNvcHlGaWxlU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvL1xuICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XG4gICAgICAkc2NvcGUub3NzID0gb25saW5lU3RhdHVzU2VydmljZS5kYXRhO1xuICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvb3Blbk5ld0FjY2Vzb3Jpby5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuYWNjZXMgPSBbXTtcbiAgICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjY2VzID0gYWNjZXNvcmlvc1NlcnZpY2UuYWxsO1xuICAgICAgfTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXRPcHRpb25zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgY29udHJvbGFkb3InKTtcbiAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0RGF0YTtcbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLmluaXRhY2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2MgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0QWNjKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNob3dNb2RhbE5ldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmluaXRhY2MoKTtcbiAgICAgICAgJHNjb3BlLm1vZHNob3cgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2Uuc2F2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDQpO1xuICAgICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0pOyAgLy8gJHNjb3BlLmFjY2VzLnB1c2goJHNjb3BlLmFjYyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGVJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcucGF0aCA9ICdodHRwOi8vaS5kYWlseW1haWwuY28udWsvaS9waXgvMjAxNC8wMy8yMy9hcnRpY2xlLTI1ODc0NTQtMUM4NjQ5OTEwMDAwMDU3OC00MzhfNjM0eDQzMC5qcGcnO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5tb2QgPSBmdW5jdGlvbiAoYWNjKSB7XG4gICAgICAgICRzY29wZS5tb2RzaG93ID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmFjYyA9IGFjYztcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VBY3RNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogQVFVSSBURU5EUklBIFFVRSBIQUNFUiBFTCBVUERBVEUgXG4gICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcub25VcGxvYWQgPSBvblVwbG9hZDtcbiAgICAgICAgdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUudHJ5VXBsb2FkID0gZnVuY3Rpb24gKGZvdG8pIHtcbiAgICAgICAgZm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQoZm90byk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IHRydWU7XG4gICAgICAgIGZvdG9zU2VydmljZS50YWtlZHBpYygpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgICAgICAgIHZhciBvblVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLm9uVXBsb2FkID0gb25VcGxvYWQ7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5wYXRoID0gcmVzLm5hdGl2ZVVSTDtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnJ1dGFTcnYgPSBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocmVzLm5hdGl2ZVVSTCk7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9uVXBsb2FkKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQoJHNjb3BlLmFjYy5pbWcpO1xuICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxmbkVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsIG9mZmxpbmVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIHRvYXN0U2VydmljZSwgdW5zeW5jU2VydmljZSwgJHN0YXRlLCBhdXRoU2VydmljZSkge1xuICAkc2NvcGUub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLmludGVybWVkaWF0ZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLnNldE9mZmxpbmVNb2RlID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAkc2NvcGUub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAvLyBpZiAoYm9vbCkge1xuICAgIC8vICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJ09mZmxpbmUgTW9kZScpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSh0aXRsZVNlcnZpY2UudGl0bGUpO1xuICAgIC8vIH1cbiAgICBpZiAoIWJvb2wgJiYgb25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd0xvbmdCb3R0b20oJ3NpbmNyb25pemFuZG8nKTtcbiAgICAgIHVuc3luY1NlcnZpY2Uuc3luY0ltYWdlcygpICAvLyAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgenVtZXJvU2VydmljZS56eW5jKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pOyAgLy8genVtZXJvU2VydmljZS56eW5jKDApO1xuO1xuICAgIH1cbiAgfTtcbiAgJHNjb3BlLmxvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICB9O1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Rlc3RDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJ3NxbFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNQbGF0Zm9ybSwgc3FsU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgICAgJHNjb3BlLm9wZW5kYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgeCA9IHdpbmRvdy5zcWxpdGVQbHVnaW4ub3BlbkRhdGFiYXNlKHsgbmFtZTogJ3p1bWVyb3Rlc3RkYmZpbGUnIH0sIGZ1bmN0aW9uIChyZXN1bHRPYmosIGZ1bGxQYXRoUGFyYW0sIGRiT2JqZWN0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZGJPYmplY3QsICdkYm9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE9iaiwgJ2Z1bHBhdGg6JywgZnVsbFBhdGhQYXJhbSk7ICAvL0ltcG9ydGFudCEgIElmIHlvdSBkb24ndCBjbG9zZSB0aGUgZGF0YWJhc2Ugb2JqZWN0LCBmdXR1cmUgY2FsbHMgdG8gb3BlbkRhdGFiYXNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dvbid0IGNhbGwgdGhlIHN1Y2Nlc3MgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRiT2JqZWN0LmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZWRiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2VycmFuZG8nLCB4KTtcbiAgICAgICAgLy8gaWYgKCF4KSB7XG4gICAgICAgIHguY2xvc2UoKTtcbiAgICAgICAgLy8genVtZXJvIHNxbGl0ZSBmdW5jaW9uYSBhc2kgLmNsb3NlID0gZnVuY3Rpb24oc3VjY2VzcywgZXJyb3IpIHsgcGVybyBubyBzZSB1c2FuIGFsIGxsYW1hciBjb3JvZHZhLmV4ZVxuICAgICAgICBjb25zb2xlLmxvZyh4Lm9wZW5EQlMpOyAgLy8gfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZnVsbFBhdGhQYXJhbSA9ICcvZGF0YS9kYXRhL2NvbS5pb25pY2ZyYW1ld29yay5mb3Rvc3ZpZXczOTA3NDcvZGF0YWJhc2VzL3p1bWVyb3Rlc3RkYi5kYic7XG4gICAgICAgIHZhciBzZXJ2ZXIgPSAnaHR0cDovLzE5Mi4xNjguMS4xMzo4MDgwLyc7XG4gICAgICAgIHZhciBkYmZpbGUgPSAnenVtZXJvdGVzdGRiZmlsZSc7XG4gICAgICAgIHZhciBub3RpZnlTdWNjZXNzID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG5vdGlmeUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfTtcbiAgICAgICAgenVtZXJvLnN5bmMoZnVsbFBhdGhQYXJhbSwgJycsIHNlcnZlciwgZGJmaWxlLCBudWxsLCBudWxsLCBudWxsLCBub3RpZnlTdWNjZXNzLCBub3RpZnlFcnJvcik7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm8gPSB7XG4gICAgICAgIHM6IHRydWUsXG4gICAgICAgIGU6IHRydWUsXG4gICAgICAgIHU6IHRydWVcbiAgICAgIH07XG4gICAgICBzcWxTZXJ2aWNlLnN5bmMoKTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFtcbiAgJyRzY29wZScsXG4gICckbG9jYXRpb24nLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJHN0YXRlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnNyYyA9ICdpbWcvaWNvbi5wbmcnO1xuICAgICAgLy8gVE9ETzogdmVyaWZpY2FyIHNpIGVzdG8gc2UgcHVlZGUgaGFjZXIgZW4gZWwgcnVuLCBwZXJvIGNvbiBzdGF0ZS5nbyBhcHAucGxhY2FzXG4gICAgICB2YXIgX2FscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBwbGFjYXMnKTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGxhY2FzJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX2FscmVhZHkoKTtcbiAgICAgICRzY29wZS5sb2dnZWROb3cgPSBmYWxzZTtcbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHtcbiAgICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbigkc2NvcGUubG9naW5EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLm9uTG9nZ2VkKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAndmVyaWZpcXVlIHF1ZSBkaXNwb25nYSBkZSBjb25leGlvbiBhIGludGVybmV0LCBlIGludGVudGUgZGUgbnVldm8nO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm9uTG9nZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgIC8vICRzY29wZS5sb2dnZWQodHJ1ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UsJGxvY2F0aW9uKTtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hdXRoRXh0ZXJuYWxQcm92aWRlciA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgcmVkaXJlY3RVcmkgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgJy9hdXRoY29tcGxldGUuaHRtbCc7XG4gICAgICAgIHZhciBleHRlcm5hbFByb3ZpZGVyVXJsID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnYXBpL0FjY291bnQvRXh0ZXJuYWxMb2dpbj9wcm92aWRlcj0nICsgcHJvdmlkZXIgKyAnJnJlc3BvbnNlX3R5cGU9dG9rZW4mY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZCArICcmcmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdFVyaTtcbiAgICAgICAgd2luZG93LiR3aW5kb3dTY29wZSA9ICRzY29wZTtcbiAgICAgICAgdmFyIG9hdXRoV2luZG93ID0gd2luZG93Lm9wZW4oZXh0ZXJuYWxQcm92aWRlclVybCwgJ0F1dGhlbnRpY2F0ZSBBY2NvdW50JywgJ2xvY2F0aW9uPTAsc3RhdHVzPTAsd2lkdGg9NjAwLGhlaWdodD03NTAnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aENvbXBsZXRlZENCID0gZnVuY3Rpb24gKGZyYWdtZW50KSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChmcmFnbWVudC5oYXNsb2NhbGFjY291bnQgPT09ICdGYWxzZScpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogZnJhZ21lbnQuZXh0ZXJuYWxfdXNlcl9uYW1lLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Fzc29jaWF0ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL09idGFpbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZGlyZWN0IHRvIG9yZGVyc1xuICAgICAgICAgICAgdmFyIGV4dGVybmFsRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdXRoU2VydmljZS5vYnRhaW5BY2Nlc3NUb2tlbihleHRlcm5hbERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gIC8vICRzY29wZS5hbHJlYWR5TG9nZ2VkKCk7ICAgICAgICAgICAgICAgXG47XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdJbnNwZWNjaW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHRpdGxlU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRmaWx0ZXIsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIHNxbGl0ZVNlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmNhbGlmaWNhZG8pID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAkc2NvcGUuZGF0YSA9IGluc3BlY2Npb25TZXJ2aWNlLmRhdGE7XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGNpb25Nb2RhbC5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICB9KTtcbiAgICAvLyBUT0RPOiBjb21vIGVzdG8gc2Ugc2luY3Jvbml6YSB1bmEgc29sYSB2ZXosIG5vIGhheSBwcm9ibGVtYSBjb24gZWwgaWRpbnNwZWNjaW9uLCBlbCBwcm9ibGVtYSBlc3RhIGVuIGFjY2Vzb3Jpb3MgeSBlbiBmb3RvcywgcXVlIHNlIHN1YmUgdW5vIGEgdW5vLCBlbnRvbmNlcyBwb2RyaWEgY2FtYmlhciwgbyBlbiBhY2Nlc29yaW9zIGhhY2VyIHVuIGJlZm9ybGVhdmUgZGUgdmlldywgbWkgcHJlZ3VudGEgZXMgLCBzaSBubyBhYmFuZG9uYSBsYSB2aWV3LCBjb21vIHNpbmNyb25pem8/IG90cmEgbWFzIHNpIHBhc28gYSBiYWNrZ3JvdW5kIHB1ZWRvIHNpbmNyb25pemFyPz8/XG4gICAgLy8gVE9ETzogZXN0YSB2YXJpYWJsZSBtZSBsYSBkYSBsYSBwYmFzZSBkZSBzYXRvcywgc2kgeWEgZXN0YSBjYWxpZmljYWRvIG8gbm9cbiAgICAkc2NvcGUub2JqID0geyBjdXN0b21zZWN0aW9uOiAwIH07XG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuc2hvdygpO1xuICAgIC8vICR0aW1lb3V0KCRzY29wZS5oaWRlLCAxNTAwMCk7XG4gICAgJHNjb3BlLml0ZW1zID0gW107XG4gICAgLy8gaW5pdGlhbCBpbWFnZSBpbmRleFxuICAgICRzY29wZS5fSW5kZXggPSAwO1xuICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5zZWN0aW9ucywgaSk7XG4gICAgICAkc2NvcGUub2JqLmN1c3RvbXNlY3Rpb24gPSAkc2NvcGUuc2VjdGlvbnNbaV0uY3VzdG9tc2VjdGlvbjtcbiAgICAgIC8vICRzY29wZS5zZXRNaW4oKTtcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgIH07XG4gICAgLy9yZWZlbmNlIHNlcnZpY2VcbiAgICAvLyBpZiBhIGN1cnJlbnQgaW1hZ2UgaXMgdGhlIHNhbWUgYXMgcmVxdWVzdGVkIGltYWdlXG4gICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gJHNjb3BlLl9JbmRleCA9PT0gaW5kZXg7XG4gICAgfTtcbiAgICAvLyBzaG93IHByZXYgaW1hZ2VcbiAgICAkc2NvcGUuc2hvd1ByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuX0luZGV4ID0gJHNjb3BlLl9JbmRleCA+IDAgPyAtLSRzY29wZS5fSW5kZXggOiAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgLy8gc2hvdyBuZXh0IGltYWdlXG4gICAgJHNjb3BlLnNob3dOZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPCAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMSA/ICsrJHNjb3BlLl9JbmRleCA6IDA7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8qIFNob3cgbGlzdCAqL1xuICAgICRzY29wZS5zaG93SXRlbXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgLy8gVE9ETzogcGFyYSBkZXNoYWJpbGl0YXIgZWwgdXBkYXRlLCBhdW5xdWUgeWEgZXN0YSBtb250YWRvLCBtZSBwcmVvY3VwYSBlcyBlbCB6eW5jIGNhZGEgcXVlIHNlIGhhZ2EgdW4gdXBkYXRlXG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVtLmRpcnR5ID0gdHJ1ZTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLml0ZW0gPSBpdGVtO1xuICAgICAgJHNjb3BlLml0ZW0gPSBpbnNwZWNjaW9uU2VydmljZS5pdGVtO1xuICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICB9O1xuICAgIC8qIEhpZGUgbGlzdCAqL1xuICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnZhbGlkYXRlU2luZ2xlID0gZnVuY3Rpb24gKG9wY2lvbikge1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHRleHRcbiAgICAgICRzY29wZS5pdGVtLnNsLmxhYmVsID0gb3BjaW9uLmxhYmVsO1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHZhbHVlXG4gICAgICAkc2NvcGUuaXRlbS5zbC52YWx1ZSA9IG9wY2lvbi52YWx1ZTtcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnVwZGF0ZVNpbmdsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvayB1cGRhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBIaWRlIGl0ZW1zXG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zKCk7ICAvLyBFeGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgfTtcbiAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdHdWFyZGFuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFscmVhZHlTYXZlZCA9IGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuaGlkZSgpO1xuICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2UuY2xlYXJUaXBvKCk7XG4gICAgICAkc2NvcGUuY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICRzY29wZS5jbC50aXBvID0gbnVsbDtcbiAgICB9O1xuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL21vZGFsR2V0SXRlbXMuaHRtbCcsIHtcbiAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lID0gbW9kYWw7XG4gICAgfSk7XG4gICAgJHNjb3BlLm9wZW5Nb2RhbE9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZS5zaG93KCk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0VGlwb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRUaXBvcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUudGlwb3MgPSBpbnNwZWNjaW9uU2VydmljZS50aXBvcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldENvbmp1bnRvUGFuZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRDb25qdW50b1BhbmVsKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jb25qdW50b1BhbmVsID0gaW5zcGVjY2lvblNlcnZpY2UuY29uanVudG9QYW5lbDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldENsYXNlcyA9IGZ1bmN0aW9uIChpZHRpcG8pIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldENsYXNlcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuY2xhc2VzID0gaW5zcGVjY2lvblNlcnZpY2UuY2xhc2VzO1xuICAgICAgICAkc2NvcGUuY2Fycm9jZXJpYXMgPSBpbnNwZWNjaW9uU2VydmljZS5jYXJyb2NlcmlhcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldENhcnJvY2VyaWFzID0gZnVuY3Rpb24gKGlkY2xhc2UpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldENhcnJvY2VyaWFzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jYXJyb2NlcmlhcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNhcnJvY2VyaWFzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuaXRlbXMgPSBpbnNwZWNjaW9uU2VydmljZS5hbGw7XG4gICAgICAkc2NvcGUuc2VjdGlvbnMgPSBpbnNwZWNjaW9uU2VydmljZS5zZWN0aW9ucztcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgJHNjb3BlLnNldElkQ2xhQ2EgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5zZXRJZENsYUNhKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXRJZENsYUNhIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICAgICRzY29wZS5jbG9zZU1vZGFsT25lKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldEFscmVhZHlJbnNwZWN0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXRBbHJlYWR5SW5zcGVjdCBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5nZXRUaXBvcygpO1xuICAgICAgJHNjb3BlLmdldENvbmp1bnRvUGFuZWwoKTtcbiAgICAgICRzY29wZS5jbCA9IGluc3BlY2Npb25TZXJ2aWNlLmNsO1xuICAgICAgLy8gVE9ETzogYXF1aSB2YWxpZG8gc2kgeWEgc2UgY2FsaWZpY28gbyBzaSBhcGVuYXMgc2UgdmEgYSByZWFsaXphclxuICAgICAgaWYgKCRzY29wZS5hbHJlYWR5U2F2ZWQpIHtcbiAgICAgICAgJHNjb3BlLmdldEFscmVhZHlJbnNwZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgfVxuICAgIH07XG4gICAgLy8gb24gaW5pdFxuICAgICRzY29wZS5pbml0KCk7XG4gIH0pO1xufSk7IiwiYXBwLmZhY3RvcnkoJ2luc3BlY2Npb25TZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcScsXG4gICckZmlsdGVyJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcSwgJGZpbHRlciwgZXJyb3JTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gICAgdmFyIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGkgPSBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnk7XG4gICAgZiA9ICRmaWx0ZXI7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uID0gMDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaXRlbSA9IHt9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAga2lsb21ldHJhamU6ICcnLFxuICAgICAgb2JzZXJ2YWNpb246ICcnXG4gICAgfTtcbiAgICB2YXIgX3NldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHByZUl0ZW1zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiBvYmouY29udHJvbEpzb25bMF0uaWQsXG4gICAgICAgICAgbGFiZWw6IG9iai5jb250cm9sSnNvblswXS50ZXh0XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgb2JqLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBwcmVJdGVtcztcbiAgICB9O1xuICAgIHZhciBfc2VjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2VjdGlvbnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJGZpbHRlcigndW5pcXVlJykoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCwgJ2N1c3RvbXNlY3Rpb24nKSwgJ2N1c3RvbXNlY3Rpb24nKTsgIFxuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNlY3Rpb25zID0gJGZpbHRlcignb3JkZXJCeScpKCRmaWx0ZXIoJ3VuaXF1ZScpKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwsICdjdXN0b21zZWN0aW9uJyksICdPcmRlbicpO1xuICAgIH07XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIF9zZXRJdGVtcygpO1xuICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAvLyBUT0RPOiBsb2dpY2EgcGFyYSBzYWJlciBzaSB5YSBmdWUgY2FsaWZpY2Fkb1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkc2VydmljaW8sXG4gICAgICAgIG9iai5pZGl0ZW0sXG4gICAgICAgIG9iai5pZFBhcmVudEl0ZW0sXG4gICAgICAgIG9iai5ub21icmUsXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC5sYWJlbFxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF9zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEFsbEl0ZW1zKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydE9ic2VydmFjaW9uKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEtpbG9tZXRyYWplKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvIGluc3BlY2Npb24nKTtcbiAgICAgICAgcmV0dXJuIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSgpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ2luZ3Jlc28gb2snLCByZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEFsbEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHByb3BpZWRhZGVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICxbaWRpdGVtXSxbaWRwYXJlbnRpdGVtXSAgLFtub21icmVdICxbaWRvcGNpb25dICAsW3NlbGVjY2lvbl0gKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5ncyA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICBiaW5kaW5ncy5wdXNoKF9ydG5CaW5kaW5nKG9iaikpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncyk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydE9ic2VydmFjaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtvYnNlcnZhY2lvbmVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICAsW29ic2VydmFjaW9uXSwgW3BsYWNhXSkgICBWQUxVRVMgKD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjksXG4gICAgICAgIC8vX2NsLnRpcG8sXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2FcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRLaWxvbWV0cmFqZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBba2lsb21ldHJhamVzXSAgICAgICAgKFtpZGluc3BlY2Npb25dLCBba2lsb21ldHJhamVdLCBbcGxhY2FdKSAgICAgIFZBTFVFUyAoPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZ1VwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wubGFiZWwsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZGl0ZW1cbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlU2luZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRwcm9waWVkYWRlc10gc2V0IFtpZG9wY2lvbl09PyAsIFtzZWxlY2Npb25dPSA/IFdIRVJFIFtpZGluc3BlY2Npb25dPT8gYW5kIFtpZGl0ZW1dPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmdVcGRhdGUoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzaW5nbGUnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfY2wgPSB7XG4gICAgICBpZGNsYXNlOiBudWxsLFxuICAgICAgaWRjYXJyb2NlcmlhOiBudWxsLFxuICAgICAgdGlwbzogbnVsbCxcbiAgICAgIGNvbmp1bnRvUGFuZWw6IG51bGxcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudGlwb3MgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY29uanVudG9QYW5lbCA9IFtdO1xuICAgIC8vIFRPRE86IHBhcmEgbGEgaW1wbGVtZW50YWNpb24gZGUgcGVzYWRvcyB5IG1vdG9zLCB5YSBzaSBkZWJlIHNlciB1bmEgY29uc3VsdGFcbiAgICAvKiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudGlwb3MgPSBbe1xuICAgICAgICB2YWx1ZTogODI5LFxuICAgICAgICBsYWJlbDogJ0xpdmlhbm9zJ1xuICAgICAgfSAgLy8gLFxuICAgICAgICAgLy8ge1xuICAgICAgICAgLy8gICB2YWx1ZTogODQ0LFxuICAgICAgICAgLy8gICBsYWJlbDogJ1Blc2Fkb3MnXG4gICAgICAgICAvLyB9XG5dOyovXG4gICAgdmFyIF9nZXRUaXBvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaWR0aXBvdmVoaWN1bG8gYXMgdmFsdWUgLCBub21icmUgYXMgbGFiZWwgZnJvbSB0aXBvcyB3aGVyZSBlbmFibGVkPTEnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudGlwb3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0Q29uanVudG9QYW5lbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICAgSWRUaXBvIGFzIHZhbHVlLCBOb21icmUgYXMgbGFiZWwgRlJPTSAgICBCYXNlX1RpcG9zICBXSEVSRSAgICAgKElkTWFlc3Ryb1RpcG9zID0gNzMpJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNvbmp1bnRvUGFuZWwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKF9jbC50aXBvKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KF9jbC50aXBvKSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgZGlzdGluY3QgY2MuaWRjbGFzZSBhcyB2YWx1ZSAgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gY2xhc2VzX3RpcG9WZWhpY3VsbyBjdCAgaW5uZXIgam9pbiAgIGNsYXNlc19jYXJyb2NlcmlhcyBjYyBvbiBjYy5pZGNsYXNlPWN0LmlkY2xhc2UgICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2xhc2UgIHdoZXJlIGN0LmlkdGlwb3ZlaGljdWxvPT8nO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtwYXJzZUludChfY2wudGlwbyldO1xuICAgICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIFRPRE86IEFTSSBOTyBTSVJWRSAsIG5vIHNlIGFjdHVhbGl6YSBlbCBleHB1ZXN0byAsLF9jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsYXNlcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBfY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAgICAgX2NsLmNvbmp1bnRvUGFuZWwgPSBudWxsO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IFtdO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoX2NsLmlkY2xhc2UpICYmIGFuZ3VsYXIuaXNOdW1iZXIocGFyc2VJbnQoX2NsLmlkY2xhc2UpKSkge1xuICAgICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBkaXN0aW5jdCBjYy5pZGNhcnJvY2VyaWEgYXMgdmFsdWUgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gICAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2Fycm9jZXJpYSAgIHdoZXJlIGNjLmlkY2xhc2U9Pyc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW3BhcnNlSW50KF9jbC5pZGNsYXNlKV07XG4gICAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIF9jbC5pZGNhcnJvY2VyaWEgPSBudWxsO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKF9jbC5jb25qdW50b1BhbmVsKTtcbiAgICAgIHZhciBxdWVyeSA9IG51bGw7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgaWYgKF9jbC5jb25qdW50b1BhbmVsID09PSBudWxsKSB7XG4gICAgICAgIHF1ZXJ5ID0gJ1NFTEVDVCBbaWRjbGFzZWNhcnJvY2VyaWFdICxbaWRjbGFzZV0gLFtpZGNhcnJvY2VyaWFdICAsW2lkY29kaWdvY2FsaWZpY2FjaW9uXSAgLFtpZGV4dHJhaW5mb10gICBGUk9NIFtjbGFzZXNfY2Fycm9jZXJpYXNdIFdIRVJFIGlkY2xhc2U9PyBhbmQgaWRjYXJyb2NlcmlhPT8gJztcbiAgICAgICAgYmluZGluZyA9IFtcbiAgICAgICAgICBwYXJzZUludChfY2wuaWRjbGFzZSksXG4gICAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2Fycm9jZXJpYSlcbiAgICAgICAgXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5ID0gJ1NFTEVDVCBbaWRjbGFzZWNhcnJvY2VyaWFdICxbaWRjbGFzZV0gLFtpZGNhcnJvY2VyaWFdICAsW2lkY29kaWdvY2FsaWZpY2FjaW9uXSAgLFtpZGV4dHJhaW5mb10gICBGUk9NIFtjbGFzZXNfY2Fycm9jZXJpYXNdIFdIRVJFIGlkY2xhc2U9PyBhbmQgaWRjYXJyb2NlcmlhPT8gYW5kIGlkZXh0cmFpbmZvPT8gJztcbiAgICAgICAgYmluZGluZyA9IFtcbiAgICAgICAgICBwYXJzZUludChfY2wuaWRjbGFzZSksXG4gICAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2Fycm9jZXJpYSksXG4gICAgICAgICAgcGFyc2VJbnQoX2NsLmNvbmp1bnRvUGFuZWwpXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgYXJyID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdO1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRDbGFzZUNhcnJvY2VyaWEgPSBhcnIuaWRjbGFzZWNhcnJvY2VyaWE7XG4gICAgICAgIHJldHVybiBfZ2V0VG9JbnNwZWN0KGFyci5pZGNvZGlnb2NhbGlmaWNhY2lvbiwgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRKc29uID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHZhbHVlLmNvbnRyb2xKc29uID0gYW5ndWxhci5mcm9tSnNvbih2YWx1ZS5jb250cm9sSnNvbik7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUuY29udHJvbEpzb25bMF0udmFsdWUsXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmNvbnRyb2xKc29uWzBdLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24gPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFsdWUuY29udHJvbEpzb24gPSBhbmd1bGFyLmZyb21Kc29uKHZhbHVlLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gVE9ETzogZWwganNvbiBkZSBjb250cm9sSnNvbiBkZXZ1ZWx2ZSB1biB2YWx1ZT0gXCJcIiBzdHJpbmcsIHZlciBzaSBzZSBwdWVkZSBtZWpvcmFyO1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLnZhbHVlLnRvU3RyaW5nKCksXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9jbGVhck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUgPSAnJztcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gJyc7XG4gICAgfTtcbiAgICAvLyB2YXIgX2NsZWFyVGlwbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbC5pZGNsYXNlID0ge1xuICAgIC8vICAgICBpZGNsYXNlOiBudWxsLFxuICAgIC8vICAgICBpZGNhcnJvY2VyaWE6IG51bGwsXG4gICAgLy8gICAgIHRpcG86IG51bGxcbiAgICAvLyAgIH07XG4gICAgLy8gfTtcbiAgICB2YXIgX2dldFRvSW5zcGVjdCA9IGZ1bmN0aW9uIChpZGNvZGlnb2NhbGlmaWNhY2lvbiwgaWRDbGFzZUNhcnJvY2VyaWEpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3Qgb2lmLmlkc2VydmljaW8gIGFzIGlkc2VydmljaW8sIGNwYy5pZGl0ZW0gYXMgaWRpdGVtLCBpZFBhcmVudEl0ZW0sIG9pZi5ub21icmUgYXMgbm9tYnJlLGN1c3RvbXNlY3Rpb24sIGN1c3RvbW9yZGVyICwgY29udHJvbEpzb24sIGJ0Lk9yZGVuIGFzIE9yZGVuICc7XG4gICAgICAvL3NpZW1wcmUgZGVqYXIgdW4gZXNwYWNpbyBlbiBibGFuY28gXG4gICAgICBxdWVyeSArPSAnZnJvbSAgdmlld1YzIG9pZiAgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNhbGlmaWNhY2lvbnBpZXphc2NvZGlnbyBjcGMgb24gIGNwYy5pZGl0ZW09IG9pZi5pZGl0ZW0gIGFuZCBvaWYudGlwbz0xICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjb250cm9sRWxlbWVudG9zIGNlIG9uIGNlLmlkY29udHJvbCA9b2lmLmlkY29udHJvbCAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG8gPW9pZi5jdXN0b21zZWN0aW9uICc7XG4gICAgICBxdWVyeSArPSAnd2hlcmUgb2lmLmlkc2VydmljaW89PyBhbmQgY3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBfY2wudGlwbyxcbiAgICAgICAgLy84MjksXG4gICAgICAgIC8vcGFyc2VJbnQoX2NsLnRpcG8pLFxuICAgICAgICBpZGNvZGlnb2NhbGlmaWNhY2lvblxuICAgICAgXTtcbiAgICAgIGlmIChfY2wuY29uanVudG9QYW5lbCAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygncGFyYSBsYSBjYXJyb2NlcmlhJyk7XG4gICAgICAgIHF1ZXJ5ICs9ICd1bmlvbiAnO1xuICAgICAgICBxdWVyeSArPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvIGFzIGlkc2VydmljaW8gLCBjcGMuaWRpdGVtIGFzIGlkaXRlbSwgaWRQYXJlbnRJdGVtLCAgb2lmLm5vbWJyZSAgYXMgbm9tYnJlICxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uLCBidC5PcmRlbiBhcyBPcmRlbiAgJztcbiAgICAgICAgcXVlcnkgKz0gJ2Zyb20gY2FsaWZpY2FjaW9uUGllemFzQ29kaWdvQ2Fycm9jZXJpYSBjcGMgICAgJztcbiAgICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gdmlld1YzIG9pZiBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG8gPW9pZi5jdXN0b21zZWN0aW9uICc7XG4gICAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICAgIHF1ZXJ5ICs9ICd3aGVyZSAgY3BjLmlkY2xhc2VjYXJyb2NlcmlhPT8nOyAgICAgICAgXG4gICAgICAgIGJpbmRpbmcucHVzaChpZENsYXNlQ2Fycm9jZXJpYSk7XG5cbiAgICAgIH1cbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICBfY2xlYXJPYnNLbSgpOyAgLy8gX2NsZWFyVGlwbygpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3Nlck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgICBvLmlkb2JzZXJ2YWNpb24sICAgb2JzZXJ2YWNpb24sIGtpbG9tZXRyYWplIEZST00gICBvYnNlcnZhY2lvbmVzIG8gaW5uZXIgam9pbiBraWxvbWV0cmFqZXMgayBvbiBrLmlkaW5zcGVjY2lvbj1vLmlkaW5zcGVjY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFICAgICAoby5pZGluc3BlY2Npb24gPSA/KSBBTkQgKGlkc3VicHJvY2VzbyA9ID8pIE9yZGVyIGJ5IG8uaWRvYnNlcnZhY2lvbiBkZXNjIGxpbWl0IDEgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgb2JzS20gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF07XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gb2JzS20ub2JzZXJ2YWNpb247XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gb2JzS20ua2lsb21ldHJhamU7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgb2lmLmlkUGFyZW50SXRlbSwgb2lmLm5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uICwgaWRwLmlkb3BjaW9uIGFzIHZhbHVlLCBpZHAuc2VsZWNjaW9uIGFzIGxhYmVsICc7XG4gICAgICBxdWVyeSArPSAnZnJvbSAgdmlld1Zkb3Mgb2lmIGlubmVyIGpvaW4gY2FsaWZpY2FjaW9ucGllemFzY29kaWdvIGNwYyBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjIG9uIGNjLmlkY29kaWdvY2FsaWZpY2FjaW9uPWNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRpbnNwZWNjaW9uIGkgb24gaS5pZENsYXNlQ2Fycm9jZXJpYT1jYy5pZGNsYXNlY2Fycm9jZXJpYSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRwcm9waWVkYWRlcyBpZHAgb24gaWRwLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbiBhbmQgaWRwLmlkaXRlbSA9IGNwYy5pZGl0ZW0gJztcbiAgICAgIHF1ZXJ5ICs9ICd3aGVyZSAgaS5pZGluc3BlY2Npb24gPT8gYW5kIG9pZi5pZHNlcnZpY2lvPT8gICAgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBfc2V0QWxyZWFkeUluc3BlY3RKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICByZXR1cm4gX3Nlck9ic0ttKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZGluc3BlY2Npb25dICAgU0VUIFtpZENsYXNlQ2Fycm9jZXJpYV0gPT8gV0hFUkUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfaW5zZXJ0U3RhdGUoNDc3KTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRTdGF0ZSA9IGZ1bmN0aW9uIChpZGVzdGFkbykge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHN1YnByb2Nlc29zZWd1aW1pZW50b10gKFtpZGluc3BlY2Npb25dICAgICxbaWRzdWJwcm9jZXNvXSAgICxbaWRlc3RhZG9dICAgLFtmZWNoYV0gICkgIFZBTFVFUyAgICAoPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9fY2wudGlwbyxcbiAgICAgICAgaWRlc3RhZG8sXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSB0cnVlO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7ICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wudGlwbyA9IG51bGw7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbCA9IF9jbDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2xhc2VzID0gX2dldENsYXNlcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2Fycm9jZXJpYXMgPSBfZ2V0Q2Fycm9jZXJpYXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNldElkQ2xhQ2EgPSBfc2V0SWRDbGFDYTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0QWxyZWFkeUluc3BlY3QgPSBfZ2V0QWxyZWFkeUluc3BlY3Q7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldFRpcG9zID0gX2dldFRpcG9zO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDb25qdW50b1BhbmVsID0gX2dldENvbmp1bnRvUGFuZWw7XG4gICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsZWFyVGlwbyA9IF9jbGVhclRpcG87XG4gICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1BsYWNhc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdmaXJzdEluaXRTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gICckZmlsdGVyJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCB0aXRsZVNlcnZpY2UsICRpb25pY01vZGFsLCB0b2FzdFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRmaWx0ZXIsIGludGVybWVkaWF0ZVNlcnZpY2UsICR0aW1lb3V0KSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgLy8gcGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vIHBzID0gcGxhY2FzU2VydmljZTtcbiAgICAgIC8vIHBjID0gJHNjb3BlO1xuICAgICAgLy8gJHNjb3BlLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLnNlcnZpY2VzID0gW107XG4gICAgICAkc2NvcGUub2JqID0geyBmaWx0ZXI6ICcnIH07XG4gICAgICAkc2NvcGUuZGF0YSA9IHtcbiAgICAgICAgcGxhY2E6IG51bGwsXG4gICAgICAgIHNsOiBudWxsXG4gICAgICB9O1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAkc2NvcGUucGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZS5hbGwpO1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gJ1BsYWNhcyc7XG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NhcmdhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuZ2V0UGxhY2FzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5mSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlyc3RJbml0U2VydmljZS5pbml0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLmhpZGUoKTtcbiAgICAgICAgICAkc2NvcGUuZ2V0UGxhY2FzKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xlYW5EYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuZGF0YS5wbGFjYSA9IG51bGw7XG4gICAgICAgICRzY29wZS5kYXRhLnNsID0gbnVsbDtcbiAgICAgIH07XG4gICAgICAkc2NvcGUucGxhY2FQb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcGxhY2FzU2VydmljZS5nZXRTcnZzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLnNlcnZpY2VzID0gcGxhY2FzU2VydmljZS5zcnZzO1xuICAgICAgICAgIHZhciBteXByb21wdCA9ICRpb25pY1BvcHVwLnByb21wdCh7XG4gICAgICAgICAgICB0aXRsZTogJ051ZXZhIFBsYWNhJyxcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlOiAnSW5ncmVzZSBsYSBudWV2YSBwbGFjYScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9pbnNlcnRQbGFjYS5odG1sJyxcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICBvblRhcDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5jbGVhbkRhdGEoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnPGI+U2F2ZTwvYj4nLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdidXR0b24tcG9zaXRpdmUnLFxuICAgICAgICAgICAgICAgIG9uVGFwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5kYXRhLnBsYWNhID09PSBudWxsIHx8ICRzY29wZS5kYXRhLnNsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZG9uJ3QgYWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdW5sZXNzIGhlIGVudGVycyB3aWZpIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZGF0YS5wbGFjYTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBteXByb21wdC50aGVuKGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgICAgICAgaWYgKHBsYWNhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICRzY29wZS5hZGRQbGFjYShwbGFjYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7ICAvLyBUT0RPOiBvcmdhbml6YXIgZWwgZm9jdXMgZW4gZWwgaW5wdXQgZGVsIHBvcHVwXG4gICAgICB9O1xuICAgICAgJHNjb3BlLmFkZFBsYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHBsYWNhKSkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3ZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZScpO1xuICAgICAgICAgIC8vIGFsZXJ0KFwidmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2EubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2xvbmdpdHVkIGRlIHBsYWNhIG11eSBjb3J0YScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLnBsYWNhcywgeyBwbGFjYTogcGxhY2EgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdwbGFjYSB5YSByZWdpc3RyYWRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnSW5ncmVzYW5kbyBudWV2YSBwbGFjYScpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlLmluc2VydFBMYWNhKHBsYWNhLCAkc2NvcGUuZGF0YS5zbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgICAgJHNjb3BlLmNsZWFuRGF0YSgpO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICRzY29wZS5zZXRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJycpO1xuICAgICAgICBmb2N1cy5mb2N1cygnc2VhcmNoUHJpbWFyeScpOyAgLy9ubyBlcyBuZWNlc2FyaW8gYWJyaXIgZWwga2V5Ym9hcmQgc2UgYWJyZSBzb2xvIGN1YW5kbyBhc2lnbmFtb3MgZWwgZm9jdXMgLy8gY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubm9Gb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgJHNjb3BlLm9iai5maWx0ZXIgPSAnJztcbiAgICAgIH07XG4gICAgICAkc2NvcGUuc2V0SW50RGF0YSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgLy8gVE9ETzogc2kgbGFzIHBsYWNhcyBzb24gaWd1YWxlcywgcHVlZGUgc2VyIHF1ZSBzZSBoYXlhIHNpbmNyb25pemFkbyB5IG5vIHNlIGhheWEgYWN5YXVsaXphZG8gbGEgbGlzdGEgZGUgcGxhY2FzLCBlbnRvbmNlcyBzZSBwYXNhcmlhIHVuIGlkaW5zcGVjY2lvbiBxdWUgbm8gLGVzIGVzdG8gY3VhbmRvIG9mZmxpbmUgY3JlbyB1bmEgcGxhY2EsIG1lIHBvbmdvIG9ubGluZSB5IGx1ZWdvIG9uIHBhdXNlIGhhZ28gZWwgc3luYywgYXVucXVlIGhheXEgdWUgcGVuc2FyIHF1ZSBjdWFuZG8gbGUgcG9uZ28gb25saW5lLCBkZWJlcmlhIHNpbmNyb25pemFyIHNpIGhheSBzZcOxYWwgNGcgbyB3aWZpIHBhcmEgaW1hZ2VuZXMgbyBwYXJhIHRvZG9cbiAgICAgICAgaWYgKG9iai5wbGFjYSAhPT0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gb2JqLnBsYWNhO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gb2JqLnN5bmMgPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IG9iai5pZGluc3BlY2Npb247XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29Gb3RvcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZm90bycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7ICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9mb3Rvcy8nICsgb2JqLmlkaW5zcGVjY2lvbik7ICAvLyBUT0RPOiBjYW1iaWFyIHBvciBzdGF0ZS5nbyBtYXMgcGFyYW1ldHJvcywgdmVyIGJlc3QgcHJhY3RpY2VzXG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvVmlkZW8gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3ZpZGVvLycgKyBvYmouaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAudmlkZW8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0luc3BlY2Npb24gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vIFRPRE86IGFxdWkgcG9kcmlhIGV2YWx1YXIgc2kgeWEgc2UgY2FsaWZpY28gbyBubywgc2kgbm8gc2UgaGEgY2FsaWZpY2FkbyBwb2RyaWEgZGVzcGxlZ2FyIGVsIG1vZGFsIGRlIGNsYXNlIGNhcnJvY2VyaWFcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5zcGVjY2lvbicsIHtcbiAgICAgICAgICBpZDogb2JqLmlkaW5zcGVjY2lvbixcbiAgICAgICAgICBwbGFjYTogb2JqLnBsYWNhLFxuICAgICAgICAgIGNhbGlmaWNhZG86IG9iai5jYWxpZmljYWRvXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0FjY2Vzb3Jpb3MgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFjY2Vzb3Jpb3MnLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0NvZEZhcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuY29kRmFzJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY3JlYXRlRXhjZXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbWV0aGluZyBoYXMgZ29uZSB0ZXJyaWJseSB3cm9uZyEnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUub25Jbml0U3J2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2VydmljZXMubGVuZ3RoIDwgMiA/ICRzY29wZS5kYXRhLnNsID0gJHNjb3BlLnNlcnZpY2VzWzBdLnZhbHVlIDogJHNjb3BlLmRhdGEuc2wgPSBudWxsO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIHF1ZSBsYSBjb25zdWx0YSBkZSBwbGFjYXMgc3VwaWVyYSB0b2RvLCBjb21vIHBvciBlamVtcGxvIHNpIHlhIHNlIGNhbGlmaWNvLCBzaSB5YSB0aWVuZSBhbGd1bmEgZm90byBvIHVuIHZpZGVvLCBwdWVkZSBzZXIgbWFyY2FuZG9sbyBjb24gYWxndW5hIGNsYXNlXG4gICAgICBpZiAoISRsb2NhbFN0b3JhZ2UuZGF0YSkge1xuICAgICAgICAkc2NvcGUuc2hvdygpO1xuICAgICAgICAvLyBUT0RPOiBwdWVkbyBwb2RlciBvYmo9bnVsbCwgcGFyYSBxdWUgbWUgZWxpbWluZSBsYSBiYXNlIGRlIGRhdG9zIHNpIHlhIGVzdGEgY3JlYWRhIHkgdnVlbHZhIGEgc2luY3Jvbml6YXIsIGVzdG8gc2VyaWEgYmVuZWZpY2lvc28gc2kgdGVuZ28gcXVlIGhhY2VyIHVuIGNhbWJpbyBlbiBsYSBiYXNlIGRlIGRkYXRvcyBxdWUgcmVxdWllcmEgcmVjb25zdHJ1aXJsYVxuICAgICAgICAkdGltZW91dCgkc2NvcGUuZkluaXQsIDMwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkc2NvcGUuZ2V0UGxhY2FzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdwbGFjYXNTZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcm9vdFNjb3BlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnZGV2aWNlU2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndXBkYXRlU3luY1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHJvb3RTY29wZSwgbW9tZW50U2VydmljZSwgYXV0aFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVwZGF0ZVN5bmNTZXJ2aWNlKSB7XG4gICAgdmFyIHBsYWNhc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgcGxhY2FzU2VydmljZUZhY3Rvcnkuc3J2cyA9IFtdO1xuICAgIHZhciBfc2VsZWN0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRlc3QgPSBbe1xuICAgICAgICAgIGlkaW5zcGVjY2lvbjogMSxcbiAgICAgICAgICBwbGFjYTogJ2FiYzExMSdcbiAgICAgICAgfV07XG4gICAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh0ZXN0KTsgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFBsYWNhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGkuaWRpbnNwZWNjaW9uLCBwbGFjYSwgaS5zeW5jLCBidC5Ob21icmUgYXMgc2VydmljaW8sICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICBjYXNlIHdoZW4gaXNzLmlkaW5zcGVjY2lvbiBpcyBudWxsIHRoZW4gMCBlbHNlIDEgZW5kIGFzIGNhbGlmaWNhZG8gJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgICAgZnJvbSBpZGluc3BlY2Npb24gaSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luICBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz0gaS5hcHBpZHNydiAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luIChzZWxlY3QgaWRpbnNwZWNjaW9uIGZyb20gIGlkc3VicHJvY2Vzb3NlZ3VpbWllbnRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgICAgICAgICAgd2hlcmUgaWRlc3RhZG89NDc3KSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICBpc3Mgb24gaXNzLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbic7XG4gICAgICBxdWVyeSArPSAnICAgICAgV0hFUkUgVXNlck5hbWU9PyBhbmQgZmVjaGE+ID8nO1xuICAgICAgcXVlcnkgKz0gJyBPcmRlciBieSBpLmlkaW5zcGVjY2lvbiBERVNDIExpbWl0IDEwJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgX2luc2VydERldmljZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gdmFyIF91cGRhdGVTeW5jID0gZnVuY3Rpb24gKHBsYWNhLCBzeW5jKSB7XG4gICAgLy8gICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICAvLyAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgLy8gICB2YXIgYmluZGluZyA9IFtcbiAgICAvLyAgICAgc3luYyxcbiAgICAvLyAgICAgcGxhY2EsXG4gICAgLy8gICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgIC8vICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgLy8gICBdO1xuICAgIC8vICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgLy8gfTtcbiAgICB2YXIgX2luc2VydFBMYWNhID0gZnVuY3Rpb24gKHBsYWNhLCBzcnYpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZGluc3BlY2Npb24ocGxhY2EsIGZlY2hhLFVzZXJOYW1lLHV1aWQsIHN5bmMsIGFwcGlkc3J2KSBWQUxVRVMgKD8sPyw/LD8sID8sID8pJztcbiAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgIC8vIDAgbWVhbnMgZmFsc2VcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIHN5bmMsXG4gICAgICAgIHNydlxuICAgICAgXTtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSA9IHBsYWNhO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIHJldHVybiBfZ2V0UGxhY2FzKCk7ICAvLyByZXR1cm4gcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsLnB1c2goe1xuICAgICAgICAvLyAgIHBsYWNhOiBwbGFjYSxcbiAgICAgICAgLy8gICBpZGluc3BlY2Npb246IHJlcy5pbnNlcnRJZFxuICAgICAgICAvLyB9KTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IHJlcy5pbnNlcnRJZDtcbiAgICAgICAgLyogcmV0dXJuIHp1bWVyb1NlcnZpY2UuenluYygxKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlU3luY1NlcnZpY2Uuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyhwbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIG9uIHp1bWVybyBzeW5jIGRlc2RlIHBzJyk7XG4gICAgICAgICAgcmV0dXJuIF9nZXRQbGFjYXMoKTtcbiAgICAgICAgfSk7Ki9cbiAgICAgICAgcmV0dXJuIF9nZXRQbGFjYXMoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgT1IgSUdOT1JFIElOVE8gW2RldmljZXNdKFt1dWlkXSxbbW9kZWxdKSAgVkFMVUVTKD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS51dWlkLFxuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEubW9kZWxcbiAgICAgIF07XG4gICAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRTcnZzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCBbSWRUaXBvXSBhcyB2YWx1ZSAsW05vbWJyZV0gYXMgbGFiZWwgRlJPTSBCYXNlX1RpcG9zIGJ0ICBpbm5lciBqb2luIHJvX3NlcnZpY2lvcyBycyBvbiBycy5pZFNydj1idC5JZFRpcG8gICB3aGVyZSBycy5lbmFibGVkPTEgICBvcmRlciBieSBsYWJlbCc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5LnNydnMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5zZWxlY3RBbGwgPSBfc2VsZWN0QWxsO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmdldFBsYWNhcyA9IF9nZXRQbGFjYXM7XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuaW5zZXJ0UExhY2EgPSBfaW5zZXJ0UExhY2E7XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuZ2V0U3J2cyA9IF9nZXRTcnZzO1xuICAgIC8vIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydERldmljZSA9IF9pbnNlcnREZXZpY2U7XG4gICAgcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnYWNjZXNvcmlvc1NlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHEsICRmaWx0ZXIsIGVycm9yU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICAgIHZhciBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhID0ge307XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkYWNjZXNvcmlvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFthY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX25vbWJyZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICd0ZXh0YScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAndGV4dGInLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9lc3RhZG9zID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX2NhbnRpZGFkZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcxJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcyJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfc2V0Tm9tYnJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gdmFyIGpzb24gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb247XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuZ3VsYXIuZnJvbUpzb24oanNvbikpO1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTsgIC8vYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldEVzdGFkb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5lc3RhZG9zID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldENhbnRpZGFkZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjInO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luaXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVE9ETzogIHVuYSBiYW5kZXJhIHBhcmEgc2FiZXIgcXVlIHlhIHNlIHNldGlvLCB1bmEgdmV6LCB5IGV2aXRhciBtYXMgY29uc3VsYXRzLCBhIG1lbm9zIHF1ZSBzZSBoYWdhIHVuYSBhY3R1YWxpemFjaW9uIGRlbCBzZXJ2aWRvclxuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX3NldE5vbWJyZXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfc2V0Q2FudGlkYWRlcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXRFc3RhZG9zKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdEFjYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIGluaWNpYXIgZXN0b3MgZGRsIHNpbiB2YWxvcmVzLCAgcGVybyB0ZW5kcmlhIHF1ZSB2YWxpZGFyIHF1ZSBzaSBzZSBzZWxlY2Npb25lIGFsZ287XG4gICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSA9IHtcbiAgICAgICAgbm9tYnJlOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlc1swXSxcbiAgICAgICAgZXN0YWRvOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuZXN0YWRvc1swXSxcbiAgICAgICAgY2FudGlkYWQ6IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzWzBdLFxuICAgICAgICB2YWxvcjogMCxcbiAgICAgICAgbWFyY2E6ICcnLFxuICAgICAgICByZWZlcmVuY2lhOiAnJyxcbiAgICAgICAgaW1nOiB7XG4gICAgICAgICAgcGF0aDogJycsXG4gICAgICAgICAgc3luYzogZmFsc2UsXG4gICAgICAgICAgb25VcGxvYWQ6IGZhbHNlLFxuICAgICAgICAgIGlkaW5zcGVjY2lvbjogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvblxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgb2JqLm5vbWJyZS5sYWJlbCxcbiAgICAgICAgb2JqLmVzdGFkby5sYWJlbCxcbiAgICAgICAgcGFyc2VJbnQob2JqLmNhbnRpZGFkLnZhbHVlKSxcbiAgICAgICAgb2JqLm1hcmNhLFxuICAgICAgICBvYmoucmVmZXJlbmNpYSxcbiAgICAgICAgb2JqLnZhbG9yLFxuICAgICAgICBvYmouaW1nLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRhY2Nlc29yaW9zXSAoW2lkaW5zcGVjY2lvbl0gLFtwbGFjYV0gLFtub21icmVdICxbZXN0YWRvXSAsW2NhbnRpZGFkXSAsW21hcmNhXSAsW3JlZmVyZW5jaWFdLFt2YWxvcl0sW2ltZ1NyY10pIFZBTFVFUyAgKD8sPyw/LD8sPyw/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfZ2V0SXRlbXMoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nVXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC50ZXh0LFxuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuZ2V0SXRlbXMgPSBfZ2V0SXRlbXM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVNpbmdsZSA9IF91cGRhdGVTaW5nbGU7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnNhdmUgPSBfc2F2ZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdE9wdGlvbnMgPSBfaW5pdE9wdGlvbnM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXRBY2MgPSBfaW5pdEFjYztcbiAgICByZXR1cm4gYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yU2VydmljZScsIFtcbiAgJyRxJyxcbiAgJyRsb2NhdGlvbicsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpbmplY3RvcicsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHEsICRsb2NhdGlvbiwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGluamVjdG9yLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlKSB7XG4gICAgdmFyIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9yZXF1ZXN0ID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25maWc7XG4gICAgfTtcbiAgICAvLyBvcHRpb25hbCBtZXRob2RcbiAgICB2YXIgX3JlcXVlc3RFcnJvciA9IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxuICAgICAgY29uc29sZS5sb2coJ3JlamVjdCByZXF1ZXN0JywgcmVqZWN0aW9uKTtcbiAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICB9O1xuICAgIHZhciBfcmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgIC8vIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7XG4gICAgICAvLyB2YXIgcXVlcnkgPSAnSU5TRVJUICBJTlRPIFtsb2dzXShbZXhdLFtlbWFpbF0sW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyknO1xuICAgICAgLy8gdmFyIGJpbmRpbmcgPSBbXG4gICAgICAvLyAgIGFuZ3VsYXIudG9Kc29uKHJlamVjdGlvbiksXG4gICAgICAvLyAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lIHx8ICcnLFxuICAgICAgLy8gICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgIC8vIF07XG4gICAgICAvLyBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAvLyB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAvLyAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIC8vIH0pO1xuICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgaWYgKGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcmVmcmVzaCcpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgfVxuICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTsgIC8vIGF1dGhTZXJ2aWNlLnRvZ2dsZVNlcnZlcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgIH07XG4gICAgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkucmVxdWVzdCA9IF9yZXF1ZXN0O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlc3BvbnNlRXJyb3IgPSBfcmVzcG9uc2VFcnJvcjtcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeS5yZXF1ZXN0RXJyb3IgPSBfcmVxdWVzdEVycm9yO1xuICAgIHJldHVybiBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgW1xuICAnJGh0dHAnLFxuICAnJHEnLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICduZ0F1dGhTZXR0aW5ncycsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gIGZ1bmN0aW9uICgkaHR0cCwgJHEsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCBtb21lbnRTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgc2VydmljZUJhc2UgPSBuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaTtcbiAgICB2YXIgYXV0aFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9hdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgIGlzQXV0aDogZmFsc2UsXG4gICAgICB1c2VyTmFtZTogJycsXG4gICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZSxcbiAgICAgIGxhc3RMb2dpbmc6ICcnXG4gICAgfTtcbiAgICB2YXIgX2V4dGVybmFsQXV0aERhdGEgPSB7XG4gICAgICBwcm92aWRlcjogJycsXG4gICAgICB1c2VyTmFtZTogJycsXG4gICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiAnJ1xuICAgIH07XG4gICAgdmFyIF9zYXZlUmVnaXN0cmF0aW9uID0gZnVuY3Rpb24gKHJlZ2lzdHJhdGlvbikge1xuICAgICAgX2xvZ091dCgpO1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnL2F1dGgvYXBpL2FjY291bnQvcmVnaXN0ZXInLCByZWdpc3RyYXRpb24pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9sb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkRhdGEpIHtcbiAgICAgIHZhciBkYXRhID0gJ2dyYW50X3R5cGU9cGFzc3dvcmQmdXNlcm5hbWU9JyArIGxvZ2luRGF0YS51c2VyTmFtZSArICcmcGFzc3dvcmQ9JyArIGxvZ2luRGF0YS5wYXNzd29yZCArICcmY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZDtcbiAgICAgIC8vc2llbXByZSB2b3kgYSBtYW5kYXIgZWwgY2xpZW50aWRcbiAgICAgIC8qaWYgKGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgIGRhdGEgPSBkYXRhICsgXCImY2xpZW50X2lkPVwiICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgfSovXG4gICAgICAvL3RlbmdvIHF1ZSByZXZpc2FyIGxvcyBjcm9zcyBvcmlnaW4sIGVuIGxhIGJhc2UgZGUgZGF0b3MgLCB5IGhhYmlsaXRhcmxvIGVuIGVsIG5hdmVnYWRvciBjaHJvbWUgLCBpbXBvcnRhbnRlXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIGQgPSBtb21lbnQoKTtcbiAgICAgICRodHRwLnBvc3QobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnL2F1dGgvdG9rZW4nLCBkYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcbiAgICAgICAgcnAgPSByZXNwb25zZTtcbiAgICAgICAgaWYgKGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiB0cnVlLFxuICAgICAgICAgICAgbGFzdExvZ2luOiBkICAvLyAsXG4gICAgICAgICAgICAgICAvLyBleHA6bW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbixcbiAgICAgICAgICAgIGV4cDogbW9tZW50U2VydmljZS5hZGRTZWNvbmRzKHJlc3BvbnNlLmV4cGlyZXNfaW4pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICAgICAgICBsYXN0TG9naW46IGQgIC8vICxcbiAgICAgICAgICAgICAgIC8vIGV4cDptb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4sXG4gICAgICAgICAgICBleHA6IG1vbWVudFNlcnZpY2UuYWRkU2Vjb25kcyhyZXNwb25zZS5leHBpcmVzX2luKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24ubGFzdExvZ2luZyA9IG1vbWVudCgpO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSBsb2dpbkRhdGEudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gbG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVyciwgc3RhdHVzLCAnZXJyb3IgY2FsbGluIGxvZ2dpbmcnKTtcbiAgICAgICAgLy9UT0RPOiBTVEFUVVMgMCBNRUFOUyBVTlJFQUNIQUJMRSBVUkxcbiAgICAgICAgLyppZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgdmFyIHNlcnZlciA9IGF1dGhTZXJ2aWNlRmFjdG9yeS50b2dnbGVTZXJ2ZXIoKTtcbiAgICAgICAgfSovXG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSBmYWxzZTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9ICcnO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICB9O1xuICAgIHZhciBfZmlsbEF1dGhEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IGF1dGhEYXRhLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX3JlZnJlc2hUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBpZiAoYXV0aERhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgIHZhciBkYXRhID0gJ2dyYW50X3R5cGU9cmVmcmVzaF90b2tlbiZyZWZyZXNoX3Rva2VuPScgKyBhdXRoRGF0YS5yZWZyZXNoVG9rZW4gKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgICAgJGh0dHAucG9zdChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICcvYXV0aC90b2tlbicsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2UucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfb2J0YWluQWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoZXh0ZXJuYWxEYXRhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAuZ2V0KG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJy9hdXRoL2FwaS9hY2NvdW50L09idGFpbkxvY2FsQWNjZXNzVG9rZW4nLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHByb3ZpZGVyOiBleHRlcm5hbERhdGEucHJvdmlkZXIsXG4gICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZXh0ZXJuYWxEYXRhLmV4dGVybmFsQWNjZXNzVG9rZW5cbiAgICAgICAgfVxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3JlZ2lzdGVyRXh0ZXJuYWwgPSBmdW5jdGlvbiAocmVnaXN0ZXJFeHRlcm5hbERhdGEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5wb3N0KG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJy9hdXRoL2FwaS9hY2NvdW50L3JlZ2lzdGVyZXh0ZXJuYWwnLCByZWdpc3RlckV4dGVybmFsRGF0YSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3RvZ2dsZVNlcnZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSA9PT0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLycpIHtcbiAgICAgICAgbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgPSAnaHR0cDovLzIwMS4yMzIuMTA0LjE5Ni9hdXRoLyc7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ0NhbWJpYW5kbyBhIHNlcnZpZG9yIDE5NicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgPSAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvJztcbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnQ2FtYmlhbmRvIGEgc2Vydmlkb3IgMTM4Jyk7XG4gICAgICB9XG4gICAgICBhdXRoU2VydmljZUZhY3RvcnkuZ2V0U2VydmVyKCk7XG4gICAgfTtcbiAgICB2YXIgX2dldFNlcnZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSA9PT0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLycpIHtcbiAgICAgICAgYXV0aFNlcnZpY2VGYWN0b3J5LnNlcnZlciA9ICcxMzgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXV0aFNlcnZpY2VGYWN0b3J5LnNlcnZlciA9ICcxOTYnO1xuICAgICAgfVxuICAgIH07XG4gICAgX2dldFNlcnZlcihuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSk7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnNhdmVSZWdpc3RyYXRpb24gPSBfc2F2ZVJlZ2lzdHJhdGlvbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkubG9naW4gPSBfbG9naW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmxvZ091dCA9IF9sb2dPdXQ7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmZpbGxBdXRoRGF0YSA9IF9maWxsQXV0aERhdGE7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmF1dGhlbnRpY2F0aW9uID0gX2F1dGhlbnRpY2F0aW9uO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5yZWZyZXNoVG9rZW4gPSBfcmVmcmVzaFRva2VuO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5vYnRhaW5BY2Nlc3NUb2tlbiA9IF9vYnRhaW5BY2Nlc3NUb2tlbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuZXh0ZXJuYWxBdXRoRGF0YSA9IF9leHRlcm5hbEF1dGhEYXRhO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5yZWdpc3RlckV4dGVybmFsID0gX3JlZ2lzdGVyRXh0ZXJuYWw7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnRvZ2dsZVNlcnZlciA9IF90b2dnbGVTZXJ2ZXI7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmdldFNlcnZlciA9IF9nZXRTZXJ2ZXI7XG4gICAgcmV0dXJuIGF1dGhTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NoZWNrRmlsZVNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSkge1xuICAgIHZhciBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZmlsZURldGFpbCA9IGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgICBGaWxlRW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlID0gZmlsZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfY2hlY2tGaWxlID0gZnVuY3Rpb24gKG1lZGlhVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBtZWRpYVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICAvLyB2YXIgcGF0aD1jb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5OyAvLyBpbWFnZW5lcyBjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxDYWNoZURpcmVjdG9yeVxuICAgICAgdmFyIHBhdGggPSBtZWRpYVVSSS5zdWJzdHJpbmcoMCwgbWVkaWFVUkkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICAvLyB2YXIgbmV3RmlsZU5hbWUgPSAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY2hlY2tGaWxlKHBhdGgsIEZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgICAgcmV0dXJuIF9maWxlRGV0YWlsKEZpbGVFbnRyeSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmNoZWNrRmlsZSA9IF9jaGVja0ZpbGU7XG4gICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZURldGFpbCA9IF9maWxlRGV0YWlsO1xuICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NvcHlGaWxlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgY29weUZpbGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIC8vIHZhciBfZmlsZURldGFpbCA9IGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAvLyAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgLy8gICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAvLyAgIEZpbGVFbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgLy8gICAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZSA9IGZpbGU7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgLy8gfTtcbiAgICB2YXIgX2NvcHlGaWxlID0gZnVuY3Rpb24gKG1lZGlhVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBtZWRpYVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICAvLyB2YXIgcGF0aD1jb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5OyAvLyBpbWFnZW5lcyBjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxDYWNoZURpcmVjdG9yeVxuICAgICAgdmFyIHBhdGggPSBtZWRpYVVSSS5zdWJzdHJpbmcoMCwgbWVkaWFVUkkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICB2YXIgbmV3RmlsZU5hbWUgPSBGaWxlTmFtZTtcbiAgICAgIC8vICduZXdfJyArIEZpbGVOYW1lO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jb3B5RmlsZShwYXRoLCBGaWxlTmFtZSwgY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG5ld0ZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgICAgLy8gcmV0dXJuIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5PUZpbGVFbnRyeTtcbiAgICAgICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2UuZmlsZURldGFpbChGaWxlRW50cnkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmNvcHlGaWxlID0gX2NvcHlGaWxlO1xuICAgIHJldHVybiBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY29yZG92YUV2ZW50c1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIG9ubGluZVN0YXR1c1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX29uUmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3VtZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBhcHBsaWNhdGlvbiBpcyByZXN1bWluZyBmcm9tIHRoZSBiYWNrZ3JvdW5kJyk7XG4gICAgICB9LCAwKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG4gIHZhciBfb25QYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX2NhbGxaeW5jKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgYXBwbGljYXRpb24gaXMgcGF1c2luZyB0byB0aGUgYmFja2dyb3VuZCcpO1xuICAgICAgfSwgMCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuICB2YXIgX2NhbGxaeW5jID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IGV2YWx1YXIgdG9kYXMgbGFzIHBvc2liaWxpZGFkZXMgZGUgZXN0byBhY2EsIHBvciBxdWUgc2kgbGEgc2XDsWFsIGVzIG11eSBtYWxhIHF1ZSBwdWVkZSBwYXNhciwgYXVucXVlIGVsIHp5bmMgZGUgYmFzZXMgZGUgZGF0b3MgbnVuY2EgaGFzaWRvIG11eSBncmFuZGUgZW4gaW5mb3JtYWNpb25cbiAgICBpZiAob25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lICYmICFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgJiYgIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCkge1xuICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgIH1cbiAgfTtcbiAgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5Lm9uUGF1c2UgPSBfb25QYXVzZTtcbiAgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5Lm9uUmVzdW1lID0gX29uUmVzdW1lO1xuICAvLyBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3RvcnkuY2FsbFp5bmMgPSBfY2FsbFp5bmM7XG4gIHJldHVybiBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnY3JlYXRlRGlyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgY3JlYXRlRGlyU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2NyZWF0ZURpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY3JlYXRlRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBkaXIpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlcykge1xuICAgICAgICByZXR1cm4gc3VjY2VzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeS5jcmVhdGVEaXIgPSBfY3JlYXRlRGlyO1xuICAgIHJldHVybiBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2RldmljZVNlcnZpY2UnLCBmdW5jdGlvbiAoJGNvcmRvdmFEZXZpY2UpIHtcbiAgdmFyIGRldmljZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfc2V0SW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBkZXZpY2VTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAgZGV2aWNlOiAkY29yZG92YURldmljZS5nZXREZXZpY2UoKSxcbiAgICAgIGNvcmRvdmE6ICRjb3Jkb3ZhRGV2aWNlLmdldENvcmRvdmEoKSxcbiAgICAgIG1vZGVsOiAkY29yZG92YURldmljZS5nZXRNb2RlbCgpLFxuICAgICAgcGxhdGZvcm06ICRjb3Jkb3ZhRGV2aWNlLmdldFBsYXRmb3JtKCksXG4gICAgICB1dWlkOiAkY29yZG92YURldmljZS5nZXRVVUlEKCksXG4gICAgICB2ZXJzaW9uOiAkY29yZG92YURldmljZS5nZXRWZXJzaW9uKClcbiAgICB9O1xuICB9O1xuICBkZXZpY2VTZXJ2aWNlRmFjdG9yeS5zZXRJbmZvID0gX3NldEluZm87XG4gIHJldHVybiBkZXZpY2VTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgnZGx0RmlsZVNydicsIGRsdEZpbGVTcnYpO1xuICBkbHRGaWxlU3J2LiRpbmplY3QgPSBbJyRjb3Jkb3ZhRmlsZSddO1xuICBmdW5jdGlvbiBkbHRGaWxlU3J2KCRjb3Jkb3ZhRmlsZSkge1xuICAgIHZhciBkbHRGaWxlRmFjID0geyBkbHRJbWc6IGRsdEltZyB9O1xuICAgIHJldHVybiBkbHRGaWxlRmFjO1xuICAgIC8vIGJvZHkuLi5cbiAgICBmdW5jdGlvbiBkbHRJbWcoZnVsbFBhdGgpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IGZ1bGxQYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIHZhciBwYXRoID0gZnVsbFBhdGguc3Vic3RyaW5nKDAsIGZ1bGxQYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUucmVtb3ZlRmlsZShwYXRoLCBGaWxlTmFtZSk7ICAvLyBib2R5Li4uXG4gICAgfVxuICB9XG59KCkpOyIsImFwcC5mYWN0b3J5KCdlYXN5RGlyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUpIHtcbiAgICB2YXIgZWFzeURpclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9jcmVhdGVEaXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdG9kYXkgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgIHZhciBDdXJyZW50RGF0ZSA9IG1vbWVudCgpLnVuaXgoKTtcbiAgICAgICRjb3Jkb3ZhRmlsZS5jaGVja0Rpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgdG9kYXkpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FscmVhZHlleGlzdCcpOyAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICRjb3Jkb3ZhRmlsZS5jcmVhdGVEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIHRvZGF5LCBmYWxzZSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXIgY3JlYXRlZCcsIHRvZGF5KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Nhbm5vdCBjcmVhdGVkIGRpcicsIHRvZGF5KTtcbiAgICAgICAgfSk7ICAvLyBlcnJvclxuICAgICAgfSk7XG4gICAgfTtcbiAgICBlYXN5RGlyU2VydmljZUZhY3RvcnkuY3JlYXRlRGlyID0gX2NyZWF0ZURpcjtcbiAgICByZXR1cm4gZWFzeURpclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZXJyb3JTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBlcnJvclNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfY29uc29sZUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgfTtcbiAgZXJyb3JTZXJ2aWNlRmFjdG9yeS5jb25zb2xlRXJyb3IgPSBfY29uc29sZUVycm9yO1xuICByZXR1cm4gZXJyb3JTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdmaWxlVHJhbnNmZXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlVHJhbnNmZXInLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlVHJhbnNmZXIsIG5nQXV0aFNldHRpbmdzKSB7XG4gICAgdmFyIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDE3MDAwO1xuICAgIHZhciBfZmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG9iai5wYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIHZhciBmaWxlRXh0ID0gb2JqLnBhdGguc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdleHRlbnNpb24nLCBmaWxlRXh0KTtcbiAgICAgIHZhciBtaW1ldHlwZSA9ICdpbWFnZS9qcGVnJztcbiAgICAgIC8vIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAyMDAwMDtcbiAgICAgIGlmIChmaWxlRXh0ID09PSAnbXA0Jykge1xuICAgICAgICBtaW1ldHlwZSA9ICd2aWRlby9tcDQnO1xuICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gNjAwMDA7XG4gICAgICB9XG4gICAgICB2YXIgc2VydmVyID0gJ2h0dHA6Ly93d3cuYWp1c3RldnNpdmEuY29tJztcbiAgICAgIC8vICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC9hcGkvZmlsZSc7XG4gICAgICAvLyAnaHR0cHM6Ly93d3cuYWp1c3RldnNpdmEuY29tL2F1dGgvYXBpL2ZpbGUnO1xuICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgIG9wdGlvbnMuZmlsZUtleSA9ICdmaWxlJztcbiAgICAgIG9wdGlvbnMuZmlsZU5hbWUgPSBvYmoucGF0aC5zdWJzdHIob2JqLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgb3B0aW9ucy5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgLyp2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgIHZhciBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuIH07XG4gICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSBoZWFkZXJzO1xuICAgICAgIH0qL1xuICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgcGFyYW1zLnBhdGhGaWxlU2VydmVyID0gb2JqLnJ1dGFTcnYuc3Vic3RyaW5nKDAsIG9iai5ydXRhU3J2Lmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIC8vICcyMDE1L01hcmNoLzE4L1BSVUVCQTcwMCc7XG4gICAgICAvLyB1cmw7Ly9VcFByb21pc2UucGF0aEZpbGVTZXJ2ZXI7XG4gICAgICBwYXJhbXMudmFsdWUyID0gJ3BhcmFtJztcbiAgICAgIG9wdGlvbnMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgLy8gVE9ETzogZGVmaW5pciB1biBzZXJ2aWNpbyBwYXJhIHNldCBlbCB0aW1lb3V0IGRlcGVuZGllbmRvIHNpIGVzIGZvdG8gbyB2aWRlbztcbiAgICAgIG9wdGlvbnMudGltZW91dCA9IGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQ7XG4gICAgICAvLyRzY29wZS5kYXRhLnRpbWVvdXQ7XG4gICAgICAvLzUwMDsvLzMwMDAwOy8vbWlsaXNlY29uZHNcbiAgICAgIGNvbnNvbGUudGltZSgnZmlsZVVwbG9hZCcpO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZVRyYW5zZmVyLnVwbG9hZChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICcvYXV0aC9hcGkvZmlsZScsIG9iai5wYXRoLCBvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIHJldHVybiBzdWNjZXNzOyAgLy9UT0RPOiB2ZXJpZmljYXIgc2kgcHVlZG8gcG9uZXIgZWwgZXJyb3IgYWNhIHkgZGlzcGFyYXIgZWwgb29mbGluZW1vZGUgZGVzZGUgYWNhIHkgbm8gZGVzZGUgdG9kb3MgbG9zIGNvbnRyb2xsZXJzXG4gICAgICB9ICAvLyBUT0RPOiBzaSBlamVjdXRvIGVuIGVsIHNlcnZpY2lvIG5vIGxsZWdhIGFsIGNvbnRyb2xhZG9yLCBhdW5xdWUgcG9kcmlhIGhhY2VyIHVuYSBwcmFjdGljYSBwYXJhIGRlZmluaXIgbG9zIHBhcmFtZXRyb3MgZGUgYWZ0ZXJ1cGxvYWQgYXF1aSBtaXNtbywgeSBxdWVkYSBtdWNobyBtZWpvclxuICAgICAgICAgLy8gLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgLy8gICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgIC8vIH1cbik7XG4gICAgfTtcbiAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5maWxlVXBsb2FkID0gX2ZpbGVVcGxvYWQ7XG4gICAgcmV0dXJuIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZmlyc3RJbml0U2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICckbG9jYWxTdG9yYWdlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNMb2FkaW5nKSB7XG4gICAgdmFyIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8c3Bhbj5JbmljaWFsaXphbmRvPC9zcGFuPjxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgIHZhciBfaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgIH07XG4gICAgdmFyIF9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgY29uc29sZS5sb2coJ2NyZWFuZG8gb2JqIGxvY2Fsc3RvcmFnZScpO1xuICAgICAgaWYgKG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgICBfc2hvdygpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZpcnN0IGluaXQgb2snKTtcbiAgICAgICAgICAkbG9jYWxTdG9yYWdlLmRhdGEgPSB7XG4gICAgICAgICAgICBsYXN0RGlyQ3JlYXRlZDogJycsXG4gICAgICAgICAgICBmaXJzdFp5bmM6IG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgX2hpZGUoKTtcbiAgICAgICAgICBxLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZmlyc3QgaW5pdCBlcnJvcicsIGUpO1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgcS5yZWplY3QoZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcS5yZWplY3QoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfTtcbiAgICBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeS5pbml0ID0gX2luaXQ7XG4gICAgcmV0dXJuIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZm9jdXMnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGZvY3VzRmFjdG9yeSA9IHt9O1xuICB2YXIgX2ZvY3VzID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgLy8gdGltZW91dCBtYWtlcyBzdXJlIHRoYXQgaXMgaW52b2tlZCBhZnRlciBhbnkgb3RoZXIgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgIC8vIGUuZy4gY2xpY2sgZXZlbnRzIHRoYXQgbmVlZCB0byBydW4gYmVmb3JlIHRoZSBmb2N1cyBvclxuICAgIC8vIGlucHV0cyBlbGVtZW50cyB0aGF0IGFyZSBpbiBhIGRpc2FibGVkIHN0YXRlIGJ1dCBhcmUgZW5hYmxlZCB3aGVuIHRob3NlIGV2ZW50c1xuICAgIC8vIGFyZSB0cmlnZ2VyZWQuXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGZvY3VzRmFjdG9yeS5mb2N1cyA9IF9mb2N1cztcbiAgcmV0dXJuIGZvY3VzRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdnZXRWaWRlb1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhbWVyYScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhQ2FtZXJhLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgLy9nZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeT1udWxsOy8vIHBlcmRlcmlhIGxhIHVsdGltYSBpbmZvcm1hY2lvbiBzaSBsbyB2dWVsdm8gYSByZWZlcmVuY2lhcjtcbiAgICAvLyBUT0RPOiAgZXN0byBzZSBkZWJlIGRlIGxsYW1hciBkZW50cm8gZGUgbGEgbWlzbWEgZnVuY2lvbiwgcG9yIHF1ZSBzaSBsbyBpbmljaWFsaXphbW9zIHBvciBmdWVyYSwgZWwgcHVnaW4gbm8gaGEgY2FyZ2FkbyB5IG9idGVuZ28gY2FtZXJhIGlzIG5vdCBkZWZpbmVkXG4gICAgLy8gdmFyIF9nZXRGaWxlRW50cnkgPSBmdW5jdGlvbiAodmlkZW9Db250ZW50UGF0aCkge1xuICAgIC8vICAgY29uc29sZS5sb2codmlkZW9Db250ZW50UGF0aCk7XG4gICAgLy8gICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIC8vICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwodmlkZW9Db250ZW50UGF0aCwgZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgIC8vICAgICBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAvLyB9O1xuICAgIC8vIFRPRE86IGNyZWF0ZSBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSB5IC5maWxlLCBwYXJhIGRldm9sdmVyIGxhIHByb21lc2Egc2luIGRhdGEgeSByZWZlcmVuY2lhciBlbCBjb250cm9sYWRvciBjb24gbGEgcHJvcGllZGFkIGRlZGwgc2VydmljaW8gdG9kZCBtb3RcbiAgICB2YXIgX2dldFZpZGVvQ29tcHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLlNBVkVEUEhPVE9BTEJVTSxcbiAgICAgICAgbWVkaWFUeXBlOiBDYW1lcmEuTWVkaWFUeXBlLlZJREVPXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FtZXJhLmdldFBpY3R1cmUob3B0aW9ucykudGhlbihmdW5jdGlvbiAodmlkZW9Db250ZW50UGF0aCkge1xuICAgICAgICAvLyByZXR1cm4gX2dldEZpbGVFbnRyeSh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2UuY2hlY2tGaWxlKHZpZGVvQ29udGVudFBhdGgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmdldFZpZGVvQ29tcHJlc3MgPSBfZ2V0VmlkZW9Db21wcmVzcztcbiAgICByZXR1cm4gZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2dwc1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGVycm9yU2VydmljZSwgJGxvY2FsU3RvcmFnZSwgbW9tZW50U2VydmljZSwgJHEsIGludGVybWVkaWF0ZVNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UpIHtcbiAgdmFyIGdwc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfZ3BzSHRtbFByb21pc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgb3B0ID0ge1xuICAgICAgbWF4aW11bUFnZTogOTAwMDAsXG4gICAgICB0aW1lb3V0OiAxNTAwMDAsXG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICB9O1xuICAgIC8vdmFyIG9wdD0geyBtYXhpbXVtQWdlOiA5MDAwMCwgdGltZW91dDogMzAwMCwgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlIH07Ly90YW1iaWVuIHNlIHByb2JvIGNvbiAyMiwgcGVybyBzZSBiYWphIGhhc3RhIDEzXG4gICAgLy8gY29uc29sZS5sb2cobmF2aWdhdG9yLCBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIC8vYmV0YWRvcGFyYXBydWViYXNjb25zb2xlLmxvZyhcImdwc0h0bWxQcm9taXNlIFwiLCByZXN1bHQpXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgLy8gQW4gZXJyb3Igb2NjdXJlZC4gU2hvdyBhIG1lc3NhZ2UgdG8gdGhlIHVzZXJcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpOyAgLy8kc2NvcGUuZGlhbG9nKGVycik7XG4gICAgfSwgb3B0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcbiAgdmFyIF9ncHNIdG1sID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgIC8vIFRPRE86IGF1biBzaW4gd2kgZmkgbmkgZGF0b3MgZWwgZ3BzIHNpZ3VlIGZ1bmNpb25hbmRvXG4gICAgLy8gVE9ETzogcG9yIHF1ZSBtZSBkaXNwYXJhIGVsIHZlbnRvIGRlIG9uIG9ubGluZSwgbWFzIHF1ZSB0b2RvIGNvbiBlbCB3aWZpPz8/P1xuICAgIGlmICghJGxvY2FsU3RvcmFnZS5sYXRlc3RHcHMgfHwgbW9tZW50U2VydmljZS5kaWZmTm93KCRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzKSA+IDcpIHtcbiAgICAgIHZhciBvcHQgPSB7XG4gICAgICAgIG1heGltdW1BZ2U6IDMwMDAsXG4gICAgICAgIHRpbWVvdXQ6IDM2MDAwMCxcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGFpc1Rha2luZ0dlbyA9IGZhbHNlO1xuICAgICAgICBfaW5zZXJ0R3BzTG9nKGlkaW5zcGVjY2lvbiwgcG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhaXNUYWtpbmdHZW8gPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3I7XG4gICAgICB9LCBvcHQpO1xuICAgIH1cbiAgfTtcbiAgdmFyIF9pbnNlcnRHcHNMb2cgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBjb29yZHMpIHtcbiAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2dwc0xvZ3NdIChbaWRpbnNwZWNjaW9uXSAgICxbZmVjaGFdICxbYWNjdXJhY3ldICAsW2FsdGl0dWRlXSwgJztcbiAgICBxdWVyeSArPSAnW2FsdGl0dWRlQWNjdXJhY3ldICAsW2hlYWRpbmddICAsW2xhdGl0dWRlXSAsW2xvbmdpdHVkZV0sW3NwZWVkXSkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPyknO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgY29vcmRzLmFjY3VyYWN5LFxuICAgICAgY29vcmRzLmFsdGl0dWRlLFxuICAgICAgY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICBjb29yZHMuaGVhZGluZyxcbiAgICAgIGNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgIGNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBjb29yZHMuc3BlZWRcbiAgICBdO1xuICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzID0gbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpO1xuICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICB9O1xuICBncHNTZXJ2aWNlRmFjdG9yeS5ncHNIdG1sUHJvbWlzZSA9IF9ncHNIdG1sUHJvbWlzZTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbCA9IF9ncHNIdG1sO1xuICByZXR1cm4gZ3BzU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnaW50ZXJtZWRpYXRlU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICBpc1Rha2luZ1BpYzogZmFsc2UsXG4gICAgaXNUYWtpbmdWaWQ6IGZhbHNlLFxuICAgIGlzVGFraW5nR2VvOiBmYWxzZSxcbiAgICBuYXZCYXJTZWFyY2g6IGZhbHNlLFxuICAgIHBsYWNhOiBudWxsLFxuICAgIGlkaW5zcGVjY2lvblN5bmM6IGZhbHNlLFxuICAgIGlkaW5zcGVjY2lvbjogbnVsbFxuICB9O1xuICByZXR1cm4gaW50ZXJtZWRpYXRlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnbW9tZW50U2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgbW9tZW50U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9nZXREYXRlVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkRGF5cyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZEhvdXJzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZFNlY29uZHMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ3MnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9ydXRhU3J2ID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgZmlsZW5hbWUgPSBwYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgcnV0YSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS9NTU1NL0RELycpICsgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhICsgJy8nICsgZmlsZW5hbWU7XG4gICAgcmV0dXJuIHJ1dGE7XG4gIH07XG4gIHZhciBfZGlmZk5vdyA9IGZ1bmN0aW9uIChiLCB0aXBvKSB7XG4gICAgdmFyIHJ0YSA9IG1vbWVudCgpLmRpZmYobW9tZW50KGIpLCB0aXBvKTtcbiAgICBjb25zb2xlLmxvZyhydGEsICdkaWZmJyk7XG4gICAgcmV0dXJuIHJ0YTtcbiAgfTtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuZ2V0RGF0ZVRpbWUgPSBfZ2V0RGF0ZVRpbWU7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZERheXMgPSBfYWRkRGF5cztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkSG91cnMgPSBfYWRkSG91cnM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZFNlY29uZHMgPSBfYWRkU2Vjb25kcztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkucnV0YVNydiA9IF9ydXRhU3J2O1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5kaWZmTm93ID0gX2RpZmZOb3c7XG4gIHJldHVybiBtb21lbnRTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdvZmZsaW5lU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgb2ZmbGluZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge307XG4gIC8vIHZhciBfZm9jdXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgLy8gICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gIC8vICAgLy8gZS5nLiBjbGljayBldmVudHMgdGhhdCBuZWVkIHRvIHJ1biBiZWZvcmUgdGhlIGZvY3VzIG9yXG4gIC8vICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXG4gIC8vICAgLy8gYXJlIHRyaWdnZXJlZC5cbiAgLy8gICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gIC8vICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgLy8gICAgIGlmIChlbGVtZW50KSB7XG4gIC8vICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfTtcbiAgb2ZmbGluZVNlcnZpY2VGYWN0b3J5LmRhdGEub2ZmbGluZU1vZGUgPSBmYWxzZTtcbiAgcmV0dXJuIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdvbmxpbmVTdGF0dXNTZXJ2aWNlJywgW1xuICAnJHJvb3RTY29wZScsXG4gICckcScsXG4gICckaW5qZWN0b3InLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRjb3Jkb3ZhTmV0d29yaycsXG4gICckaW9uaWNQb3B1cCcsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgJGluamVjdG9yLCAkbG9jYXRpb24sICRjb3Jkb3ZhTmV0d29yaywgJGlvbmljUG9wdXAsIHp1bWVyb1NlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAgaXNPbmxpbmU6IGZhbHNlLFxuICAgICAgY29ublR5cGU6ICdub25lJ1xuICAgIH07XG4gICAgdmFyIF9pc09ubGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgfTtcbiAgICB2YXIgX3R5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9ICRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCk7XG4gICAgfTtcbiAgICB2YXIgX29uT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHJvb3RTY29wZS4kb24oJyRjb3Jkb3ZhTmV0d29yazpvbmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBuZXR3b3JrU3RhdGU7XG4gICAgICAgIC8vIFRPRE86IGV2YWx1YXIgdG9kYXMgbGFzIHBvc2liaWxpZGFkZXMgZGUgZXN0byBhY2EsIHBvciBxdWUgc2kgbGEgc2XDsWFsIGVzIG11eSBtYWxhIHF1ZSBwdWVkZSBwYXNhciwgYXVucXVlIGVsIHp5bmMgZGUgYmFzZXMgZGUgZGF0b3MgbnVuY2EgaGFzaWRvIG11eSBncmFuZGUgZW4gaW5mb3JtYWNpb25cbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpOyAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2UuY2FsbFp5bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyppZighc2lnbmFsU2VydmljZS5pc0luaXQpe1xuICAgICAgICAgICAgICAgICAgICBzaWduYWxTZXJ2aWNlLnN0YXJ0SHViKCk7XG5cbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckY29yZG92YU5ldHdvcms6c2lnbmFsJyx7J25ldHdvcmtTdGF0ZSc6bmV0d29ya1N0YXRlfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb25PZmZsaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gbGlzdGVuIGZvciBPZmZsaW5lIGV2ZW50XG4gICAgICAkcm9vdFNjb3BlLiRvbignJGNvcmRvdmFOZXR3b3JrOm9mZmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IGZhbHNlO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gZmFsc2U7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gbmV0d29ya1N0YXRlOyAgLyogaWYobmV0d29ya1N0YXRlID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmV0IERpc2Nvbm5lY3RlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJUaGUgaW50ZXJuZXQgaXMgZGlzY29ubmVjdGVkIG9uIHlvdXIgZGV2aWNlLlwiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLmV4aXRBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT25saW5lID0gX29uT25saW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT2ZmbGluZSA9IF9vbk9mZmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSBfaXNPbmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBfdHlwZTtcbiAgICByZXR1cm4gb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdzcWxpdGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFTUUxpdGUnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFTUUxpdGUpIHtcbiAgICB2YXIgc3FsaXRlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2V4ZWN1dGVRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeSwgYmluZGluZykge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRDb2xsZWN0aW9uID0gZnVuY3Rpb24gKHF1ZXJ5LCBiaW5kaW5ncykge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhU1FMaXRlLmluc2VydENvbGxlY3Rpb24oZGIsIHF1ZXJ5LCBiaW5kaW5ncykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfcnRuQXJyYXkgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgIGlmIChyZXMucm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKHJlcy5yb3dzLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRPRE86IHNpIHlvIGNhbWJpbyBlbCB0aXBvIGRlIGRhdG8gZGUgdW5hIGNvbHVtbmEsIGVqZW1wbG8gc3RyaW5nIHRvIGludCwgZGVibyByZWVzdGFibGVjZXIgbGEgYmFzZSBkZSBkYXRvcyB6dW1lcm8sIHBhcmEgYWdyZWdhciB1bmEgY29sdW1uYSBubyB0ZW5nbyBwcm9ibGVtYVxuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5LmV4ZWN1dGVRdWVyeSA9IF9leGVjdXRlUXVlcnk7XG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkuaW5zZXJ0Q29sbGVjdGlvbiA9IF9pbnNlcnRDb2xsZWN0aW9uO1xuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5LnJ0bkFycmF5ID0gX3J0bkFycmF5O1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3RpdGxlU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgdGl0bGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB0aXRsZVNlcnZpY2VGYWN0b3J5LnRpdGxlID0gJyc7XG4gIHJldHVybiB0aXRsZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3RvYXN0U2VydmljZScsIGZ1bmN0aW9uICgkY29yZG92YVRvYXN0KSB7XG4gIHZhciB0b2FzdFNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfc2hvd0xvbmdCb3R0b20gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgcmV0dXJuICRjb3Jkb3ZhVG9hc3Quc2hvd0xvbmdCb3R0b20obXNnKTtcbiAgfTtcbiAgdmFyIF9zaG93U2hvcnRCb3R0b20gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgcmV0dXJuICRjb3Jkb3ZhVG9hc3Quc2hvd1Nob3J0Qm90dG9tKG1zZyk7XG4gIH07XG4gIHRvYXN0U2VydmljZUZhY3Rvcnkuc2hvd0xvbmdCb3R0b20gPSBfc2hvd0xvbmdCb3R0b207XG4gIHRvYXN0U2VydmljZUZhY3Rvcnkuc2hvd1Nob3J0Qm90dG9tID0gX3Nob3dTaG9ydEJvdHRvbTtcbiAgcmV0dXJuIHRvYXN0U2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndW5zeW5jU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBhdXRoU2VydmljZSwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgZm90b3NTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG4gIHZhciB1bnN5bmNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMgPSBbXTtcbiAgdmFyIF9nZXRJbWdVbnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgICAgaWRmb3RvLCBpLmlkaW5zcGVjY2lvbiwgcGF0aCwgZi5zeW5jLCAgaS5wbGFjYSwgZi5ydXRhU3J2ICc7XG4gICAgcXVlcnkgKz0gJ0ZST00gICAgICBpZGluc3BlY2Npb24gaSAgICBpbm5lciBqb2luICBpZGZvdG9zIGYgb24gaS5pZGluc3BlY2Npb24gPSBmLmlkaW5zcGVjY2lvbiAnO1xuICAgIHF1ZXJ5ICs9ICdXSEVSRSAgICBpLnVzZXJOYW1lID0gPyBBTkQgIGkuZmVjaGE+PyBBTkQgKGYuc3luYyA9IDApIEFORCAoZGVsZXRlZCA9IDApICc7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykubGVuZ3RoO1xuICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICB9O1xuICB2YXIgX3N5bmNJbWFnZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2dldEltZ1Vuc3luYygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA8IDEpIHtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhbmd1bGFyLmZvckVhY2godW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgX3ByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB2YXIgX3ByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgLy8gfHwgIW9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUpIHtcbiAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICB2YXIgX3VwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgIF91cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCk7XG4gIH07XG4gIHZhciBfdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAvLyBpZiAocy5tYXNzaXZlVXBsb2FkKSB7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPSB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggLSAxO1xuICAgICAgaWYgKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc29sZS5sb2codW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gfVxuICAgICAgLy8gX2ZpbHRlclVuc3luYygwKTsgICAgICAgICAgXG4gICAgICBjb25zb2xlLmxvZyh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGgsICdzeW5jJyk7XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXlFdmVudCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LmdldEltZ1Vuc3luYyA9IF9nZXRJbWdVbnN5bmM7XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LnN5bmNJbWFnZXMgPSBfc3luY0ltYWdlcztcbiAgcmV0dXJuIHVuc3luY1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3VwZGF0ZVN5bmNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBhdXRoU2VydmljZSwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfdXBkYXRlU3luYyA9IGZ1bmN0aW9uIChwbGFjYSwgc3luYykge1xuICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRpbnNwZWNjaW9uIHNldCBzeW5jPT8gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8nO1xuICAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBzeW5jLFxuICAgICAgcGxhY2EsXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gIH07XG4gIHZhciBfc2VsZWN0SWRpbnNwZWNjaW9uU3luYyA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaWRpbnNwZWNjaW9uIGZyb20gaWRpbnNwZWNjaW9uICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/IE9yZGVyIGJ5IGlkaW5zcGVjY2lvbiBERVNDIExpbWl0IDEnO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgcGxhY2EsXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkaW5zcGVjY2lvbjtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gdHJ1ZTtcbiAgICAgIHJldHVybiBfdXBkYXRlU3luYyhwbGFjYSwgdHJ1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUsICdlcnJvcicpO1xuICAgIH0pOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgICAgICAgLy8gfSk7XG4gIH07XG4gIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS51cGRhdGVTeW5jID0gX3VwZGF0ZVN5bmM7XG4gIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS5zZWxlY3RJZGluc3BlY2Npb25TeW5jID0gX3NlbGVjdElkaW5zcGVjY2lvblN5bmM7XG4gIC8vIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS5zeW5jSW1hZ2VzID0gX3N5bmNJbWFnZXM7XG4gIHJldHVybiB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndmlkZW9UaHVtYm5haWxTZXJ2aWNlJywgW1xuICAnJHEnLFxuICBmdW5jdGlvbiAoJHEpIHtcbiAgICB2YXIgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZ2VuZXJhdGVUaHVtYm5haWwgPSBmdW5jdGlvbiAobmF0aXZlVVJMKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIG5hbWUgPSBuYXRpdmVVUkwuc2xpY2UoMCwgLTQpO1xuICAgICAgd2luZG93LlBLVmlkZW9UaHVtYm5haWwuY3JlYXRlVGh1bWJuYWlsKG5hdGl2ZVVSTCwgbmFtZSArICcucG5nJywgZnVuY3Rpb24gKHByZXZTdWNjKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByZXZTdWNjKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcmV2U3VjYyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZ2VuZXJuYWRvIHRodW1ibmFpbCcsIGUpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeS5nZW5lcmF0ZVRodW1ibmFpbCA9IF9nZW5lcmF0ZVRodW1ibmFpbDtcbiAgICByZXR1cm4gdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3p1bWVyb1NlcnZpY2UnLCBbXG4gICckcScsXG4gICckY29yZG92YURldmljZScsXG4gICckY29yZG92YVNRTGl0ZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3VwZGF0ZVN5bmNTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICckdGltZW91dCcsXG4gICduZ0F1dGhTZXR0aW5ncycsXG4gICckaW50ZXJ2YWwnLFxuICAvLyAnb25saW5lU3RhdHVzU2VydmljZScsXG4gIGZ1bmN0aW9uICgkcSwgJGNvcmRvdmFEZXZpY2UsICRjb3Jkb3ZhU1FMaXRlLCBvZmZsaW5lU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdXBkYXRlU3luY1NlcnZpY2UsIHRvYXN0U2VydmljZSwgJHRpbWVvdXQsIG5nQXV0aFNldHRpbmdzLCAkaW50ZXJ2YWwpIHtcbiAgICB2YXIgenVtZXJvID0gbnVsbDtcbiAgICB2YXIgenVtZXJvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3NldERiUGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfb3B0aW9ucyA9IHtcbiAgICAgICAgQW5kcm9pZDogJy9kYXRhL2RhdGEvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnBhY2thZ2VOYW1lICsgJy9kYXRhYmFzZXMvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLFxuICAgICAgICBpT1M6ICdjZHZmaWxlOi8vbG9jYWxob3N0L3BlcnNpc3RlbnQvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLFxuICAgICAgICB3aW4zMm50OiAnLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZVxuICAgICAgfTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRicGF0aCA9IF9vcHRpb25zWyRjb3Jkb3ZhRGV2aWNlLmdldFBsYXRmb3JtKCldO1xuICAgIH07XG4gICAgdmFyIF9zZXRadW1lcm8gPSBmdW5jdGlvbiAoZGJmaWxlKSB7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUgPSBkYmZpbGU7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSA9IHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZSArICcuZGInO1xuICAgICAgLy9vcGVuIGRiIGNvbiBzcWxpdGVwbHVnaW4gYnJvZHlcbiAgICAgIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLCAxKTtcbiAgICAgIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXJ2ZXIgPSBuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICc6ODA4MC8nO1xuICAgICAgLy9odHRwOi8vMTkwLjE0NS4zOS4xMzg6ODA4MC8nO1xuICAgICAgLy8naHR0cDovLzE5Mi4xNjguMC41MTo4MDgwLyc7XG4gICAgICAvLyBUT0RPOiBERVBFTkRFIFNJIEVTVE9ZIEVOIE1JIENBU0EgTyBFTiBMQSBPRklDSU5BJ2h0dHA6Ly8xOTIuMTY4LjEuMTM6ODA4MC8nO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkucGFja2FnZU5hbWUgPSAnY29tLmFqdXN0ZXYuYic7XG4gICAgICBfc2V0RGJQYXRoKCk7XG4gICAgfTtcbiAgICAvLyBUT0RPOiAgcmVjb3JkYXIgayBlc3RvIGVzIHVuYSBwcm9tZXNhIHkgZGVzZW5jYWRlbmEgYWNjaW9uZXMsIHNpIGVzIHJlc3VlbHRhIG8gc2kgZXMgcmVqZWN0ICwgdmFsbGlkYXJcbiAgICB2YXIgX3p5bmMgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgLy8gVE9ETzogYWJyaXJpIGVsIHB1ZXJ0byBwYXJhIHp1bWVybyBlbiBlbCBmaXJld2FsbFxuICAgICAgLy8gVE9ETzogY3JlYXIgdW5hIHNlcnZpY2lvIGdsb2JhbCBwYXJhIGRlIGFoaSBzYWNhciBlbCBpZGluc3BlY2Npb24gYWN0dWFsLCBpbmN1c2l2ZSBkZXNwdWVzIGRlIHVuIHp5bmMgcGFyYSBzYWJlciBxdWUgZXMgZWwgYWRlY3VhZG9cbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgLy8gVE9ETzogbWUgcGFyZWNlIG1hcyBsb2dpY28gcmV0b3JuYXIgdW4gcmVqZWN0IHNpIGVzdGEgZW4gbW9kbyBvZmZsaW5lXG4gICAgICAgIHEucmVqZWN0KCdvZmZsaW5lTW9kZSBvIHNpbiBjb25leGlvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnb2ZmbGluZSBtb2RlIGFjdGl2YWRvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLnRpbWUoJ3p5bmMnICsgaSk7XG4gICAgICAgIC8qdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3NpbmNyb25pemFuZG8uLicpO1xuICAgICAgICB9LCAyNTAwKTsqL1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3NpbmNyb25pemFuZG8uLicpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgenVtZXJvLnN5bmMoenVtZXJvU2VydmljZUZhY3RvcnkuZGJwYXRoLCAnJywgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyLCB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2snKTtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3p5bmMnICsgaSk7XG4gICAgICAgICAgaWYgKCFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyAmJiBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpIHtcbiAgICAgICAgICAgIC8qICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTsqL1xuICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAvLyB1cGRhdGVTeW5jU2VydmljZS51cGRhdGVTeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgdHJ1ZSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgICAgfSk7ICAvLyB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyokdGltZW91dC5jYW5jZWwodGltZXIpOyovXG4gICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0NTYpIHtcbiAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICB9O1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNldFp1bWVybyA9IF9zZXRadW1lcm87XG4gICAgenVtZXJvU2VydmljZUZhY3RvcnkuenluYyA9IF96eW5jO1xuICAgIHJldHVybiB6dW1lcm9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5jb250cm9sbGVyKCdTZXR0aW5ncycsIFNldHRpbmdzKTtcbiAgU2V0dGluZ3MuaW5qZWN0ID0gW1xuICAgICckbG9nJyxcbiAgICAnc2V0dGluZ3NTcnYnLFxuICAgICdlcnJvclNlcnZpY2UnLFxuICAgICdhdXRoU2VydmljZSdcbiAgXTtcbiAgZnVuY3Rpb24gU2V0dGluZ3MoJGxvZywgc2V0dGluZ3NTcnYsIGVycm9yU2VydmljZSwgYXV0aFNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnBpY3MgPSBbXTtcbiAgICB2bS52ZHMgPSBbXTtcbiAgICB2bS5zZXJ2ZXIgPSAnJztcbiAgICB2bS5kZWxldGVWZHMgPSBkZWxldGVWZHM7XG4gICAgdm0uZGVsZXRlSW1ncyA9IGRlbGV0ZUltZ3M7XG4gICAgdm0udG9nZ2xlU2VydmVyID0gdG9nZ2xlU2VydmVyO1xuICAgIGFjdGl2YXRlKCk7XG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICBzZXR0aW5nc1Nydi5nZXQyRGx0KCkudGhlbihzZWxlY3RPaykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlbGVjdE9rKCkge1xuICAgICAgdm0ucGljcyA9IHNldHRpbmdzU3J2LnBpY3M7XG4gICAgICB2bS52ZHMgPSBzZXR0aW5nc1Nydi52ZHM7XG4gICAgICBhdXRoU2VydmljZS5nZXRTZXJ2ZXIoKTtcbiAgICAgIHZtLnNlcnZlciA9IGF1dGhTZXJ2aWNlLnNlcnZlcjtcbiAgICAgICRsb2cuZGVidWcoJ3NlbGVjdCBvaycpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgICBmdW5jdGlvbiBkZWxldGVJbWdzKCkge1xuICAgICAgaWYgKHZtLnBpY3MubGVuZ3RoKSB7XG4gICAgICAgICRsb2cuZGVidWcoJ2RlbGV0ZUltZ3MnKTtcbiAgICAgICAgc2V0dGluZ3NTcnYuZGx0SW1ncygpLnRoZW4oYWN0aXZhdGUpLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkZWxldGVWZHMoKSB7XG4gICAgICBpZiAodm0udmRzLmxlbmd0aCkge1xuICAgICAgICAkbG9nLmRlYnVnKCdkZWxldGVJbWdzJyk7XG4gICAgICAgIHNldHRpbmdzU3J2LmRsdFZkcygpLnRoZW4oYWN0aXZhdGUpLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiB0b2dnbGVTZXJ2ZXIoKSB7XG4gICAgICBhdXRoU2VydmljZS50b2dnbGVTZXJ2ZXIoKTtcbiAgICAgIHZtLnNlcnZlciA9IGF1dGhTZXJ2aWNlLnNlcnZlcjtcbiAgICB9XG4gIH1cbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5mYWN0b3J5KCdzZXR0aW5nc1NydicsIHNldHRpbmdzU3J2KTtcbiAgc2V0dGluZ3NTcnYuJGluamVjdCA9IFtcbiAgICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAgICdtb21lbnRTZXJ2aWNlJyxcbiAgICAnYXV0aFNlcnZpY2UnLFxuICAgICd0b2FzdFNlcnZpY2UnLFxuICAgICdkZXZpY2VTZXJ2aWNlJyxcbiAgICAnZGx0RmlsZVNydicsXG4gICAgJ2Vycm9yU2VydmljZScsXG4gICAgJyRsb2cnLFxuICAgICckcSdcbiAgXTtcbiAgZnVuY3Rpb24gc2V0dGluZ3NTcnYoaW50ZXJtZWRpYXRlU2VydmljZSwgc3FsaXRlU2VydmljZSwgbW9tZW50U2VydmljZSwgYXV0aFNlcnZpY2UsIHRvYXN0U2VydmljZSwgZGV2aWNlU2VydmljZSwgZGx0RmlsZVNydiwgZXJyb3JTZXJ2aWNlLCAkbG9nLCAkcSkge1xuICAgIHZhciBzdEZhY3RvcnkgPSB7XG4gICAgICBwaWNzOiBbXSxcbiAgICAgIHZkczogW10sXG4gICAgICBnZXQyRGx0OiBnZXQyRGx0LFxuICAgICAgZGx0SW1nczogZGx0SW1ncyxcbiAgICAgIGRsdFZkczogZGx0VmRzXG4gICAgfTtcbiAgICByZXR1cm4gc3RGYWN0b3J5O1xuICAgIGZ1bmN0aW9uIGdldDJEbHQoKSB7XG4gICAgICB2YXIgcUFycmF5ID0gW107XG4gICAgICBxQXJyYXkucHVzaChnZXRJbWcyRGx0KCkpO1xuICAgICAgcUFycmF5LnB1c2goZ2V0VmRzMkRsdCgpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocUFycmF5KTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SW1nMkRsdCgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICBmLmlkZm90bywgZi5wYXRoICc7XG4gICAgICBxdWVyeSArPSAnRlJPTSAgaWRpbnNwZWNjaW9uIGlkICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZGZvdG9zIGYgb24gZi5pZGluc3BlY2Npb249aWQuaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIGlkLnV1aWQgPSA/IEFORCBpZC5Vc2VyTmFtZSA9ID8gICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGYuc3luYz0xICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGYuZGVsZXRlZD0wICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGlkLmZlY2hhPCA/IE9SREVSIEJZIGYuaWRmb3RvIERFU0MgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygrMSkgIC8vIC0yIC8vIGVuIDAgc2VyaWEgbWVqb3IgcG9yIHNpIHNlIGxsZW5hIGxhIG1lbW9yaWFcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBzdEZhY3RvcnkucGljcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTsgIC8qIGNvbnNvbGUubG9nKGFycmF5KTtcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgIGRsdEltZ3MoYXJyYXkpO1xuICAgICAgICB9Ki9cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0VmRzMkRsdCgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICB2LmlkdmlkZW8sIHYucGF0aCAnO1xuICAgICAgcXVlcnkgKz0gJ0ZST00gIGlkaW5zcGVjY2lvbiBpZCAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWR2aWRlb3MgdiBvbiB2LmlkaW5zcGVjY2lvbj1pZC5pZGluc3BlY2Npb24gJztcbiAgICAgIHF1ZXJ5ICs9ICdXSEVSRSAgICAgaWQudXVpZCA9ID8gQU5EIGlkLlVzZXJOYW1lID0gPyAgJztcbiAgICAgIHF1ZXJ5ICs9ICdhbmQgdi5zeW5jPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdhbmQgdi5kZWxldGVkPTAgJztcbiAgICAgIHF1ZXJ5ICs9ICdhbmQgaWQuZmVjaGE8ID8gT1JERVIgQlkgdi5pZHZpZGVvICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoKzEpICAvLyAtMlxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHN0RmFjdG9yeS52ZHMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7ICAvKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBkbHRJbWdzKGFycmF5KTtcbiAgICAgICAgfSovXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRsdEltZ3MoKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdFbGltaW5hbmRvIEZvdG9zJyk7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZGZvdG9zXVNFVCBbZGVsZXRlZF0gPSAxICBXSEVSRSBpZGZvdG89Pyc7XG4gICAgICB2YXIgYmluZGluZ3MgPSBbXTtcbiAgICAgIHZhciBxQXJyYXkgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdEZhY3RvcnkucGljcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIC8qcUFycmF5LnB1c2goXG4gICAgICAgICAgZGx0RmlsZVNydi5kbHRJbWcob2JqLnBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgICAgYmluZGluZy5wdXNoKG9iai5pZGZvdG8pO1xuICAgICAgICAgIGJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpXG4gICAgICAgICAgKTsgKi9cbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgICAgYmluZGluZy5wdXNoKG9iai5pZGZvdG8pO1xuICAgICAgICBiaW5kaW5ncy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICAvKiAgKGZ1bmN0aW9uIGluc2VydE9uZSgpIHtcbiAgICAgICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRsdEZpbGVTcnYuZGx0SW1nKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIuY29kZSAhPT0gMSkge1xuICAgICAgICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHEucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHFBcnJheS5wdXNoKHEucHJvbWlzZSk7XG4gICAgICAgIH0oKSk7Ki9cbiAgICAgICAgcUFycmF5LnB1c2goaWlmZURsdChvYmoucGF0aCkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJlVXBkYXRlQ29sbGVjdGlvbihxQXJyYXksIHF1ZXJ5LCBiaW5kaW5ncykgIC8qIHJldHVybiAkcS5hbGwocUFycmF5KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVDb2xsZWN0aW9uKGJpbmRpbmdzKS50aGVuKHVwZE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcikqLztcbiAgICB9XG4gICAgZnVuY3Rpb24gZGx0VmRzKCkge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnRWxpbWluYW5kbyBWaWRlb3MnKTtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkdmlkZW9zXVNFVCBbZGVsZXRlZF0gPSAxICBXSEVSRSBpZHZpZGVvPT8nO1xuICAgICAgdmFyIGJpbmRpbmdzID0gW107XG4gICAgICB2YXIgcUFycmF5ID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goc3RGYWN0b3J5LnZkcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgIGJpbmRpbmcucHVzaChvYmouaWR2aWRlbyk7XG4gICAgICAgIGJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgICAgIHFBcnJheS5wdXNoKGlpZmVEbHQob2JqLnBhdGgpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByZVVwZGF0ZUNvbGxlY3Rpb24ocUFycmF5LCBxdWVyeSwgYmluZGluZ3MpO1xuICAgIH1cbiAgICAvKiAgIGZ1bmN0aW9uIGluc2VydEJpbmRpbmcgKGlkZm90bykge1xuICAgICAgdmFyIGJpbmRpbmc9W11cbiAgICAgIGJpbmRpbmcucHVzaChpZGZvdG8pO1xuICAgICAgYmluZGluZ3MucHVzaChiaW5kaW5nKTtcbiAgICAgIFxuICAgIH0qL1xuICAgIC8vVE9ETzogZWplbXBsbyB0cmFpZG8gZGUgaW5zZXJ0Y29sbGVjdGlvbiBmb20gbmdjb3Jkb3ZhXG4gICAgZnVuY3Rpb24gaWlmZURsdChwYXRoKSB7XG4gICAgICAvLyByZXR1cm4gZnVuY3Rpb24gaW5zZXJ0T25lKCkge1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGx0RmlsZVNydi5kbHRJbWcocGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyLmNvZGUgIT09IDEpIHtcbiAgICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIHEucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlOyAgLy8gfSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwcmVVcGRhdGVDb2xsZWN0aW9uKHFBcnJheSwgcXVlcnksIGJpbmRpbmdzKSB7XG4gICAgICByZXR1cm4gJHEuYWxsKHFBcnJheSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlQ29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpLnRoZW4odXBkT2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlQ29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpIHtcbiAgICAgICRsb2cuZGVidWcoYmluZGluZ3MpO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRPaygpIHtcbiAgICAgICRsb2cuZGVidWcoJ3VwZCBjb2xsZWN0aW9uIG9rJyk7XG4gICAgfVxuICB9XG59KCkpOyIsImFwcC5jb250cm9sbGVyKCdWaWRlb0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAndmlkZW9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnJGZpbHRlcicsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ3ZpZGVvVGh1bWJuYWlsU2VydmljZScsXG4gICdnZXRWaWRlb1NlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICAnJGxvZycsXG4gIGZ1bmN0aW9uIChzLCB2aWRlb1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgJGZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgY29weUZpbGVTZXJ2aWNlLCB2aWRlb1RodW1ibmFpbFNlcnZpY2UsIGdldFZpZGVvU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGdwc1NlcnZpY2UsICRsb2cpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAvLyBzLnRpdHRsZSA9ICcnO1xuICAgICAgcy50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvLyAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMub3NzID0gb25saW5lU3RhdHVzU2VydmljZS5kYXRhO1xuICAgICAgcy52aWRlb3MgPSB2aWRlb1NlcnZpY2UudmlkZW9zO1xuICAgICAgLy92aWRlb1NlcnZpY2UuYWxsKCk7XG4gICAgICB2aWRlb1NlcnZpY2UuZ2V0VmlkZW9zKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICB9KTtcbiAgICAgIC8vIHZhciBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yJywgZSk7XG4gICAgICAvLyB9O1xuICAgICAgdmFyIGluc2VydFZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkLCBkZWZhdWx0UGF0aCkge1xuICAgICAgICB2aWRlb1NlcnZpY2UuaW5zZXJ0VmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQsIGRlZmF1bHRQYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIGluc2VydCBzcWxpdGUgdmlkZW8gJyk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlVmlkZW8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLnVwZGF0ZVZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIHZpZGVvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpWaWRlby5zeW5jID0gc3luYztcbiAgICAgICAgb2JqVmlkZW8ub25VcGxvYWQgPSBvbnVwbG9hZDtcbiAgICAgICAgLy8gaW5zZXJ0VmlkZW8oaW1hZ2VVUkksIHN5bmMsIG9ialZpZGVvLnRodW1ibmFpbCk7XG4gICAgICAgIHVwZGF0ZVZpZGVvKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygzKTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nVmlkID0gZmFsc2U7XG4gICAgICB9O1xuICAgICAgdmFyIHJlZnJlc2hQcm9ncmVzcyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgcGVyY2VudGFnZSkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8ucHJvZ3Jlc3MgPSBwZXJjZW50YWdlO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAvLyBjb25zdGFudCBwcm9ncmVzcyB1cGRhdGVzXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwcm9ncmVzcyk7XG4gICAgICAgICAgICAvLyByZWZyZXNoUHJvZ3Jlc3MoaW1hZ2VVUkksIE1hdGgucm91bmQocHJvZ3Jlc3MubG9hZGVkIC8gcHJvZ3Jlc3MudG90YWwgKiAxMDApKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKE1hdGgucm91bmQocHJvZ3Jlc3MubG9hZGVkIC8gcHJvZ3Jlc3MudG90YWwgKiAxMDApKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBydG5PYmpWaWRlbyA9IGZ1bmN0aW9uIChwbGFjYSwgcGF0aCwgc3luYywgb25VcGxvYWQsIHRodW1ibmFpbCwgZGVmYXVsdFBhdGgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHRodW1ibmFpbDogdGh1bWJuYWlsLFxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKSxcbiAgICAgICAgICBkZWZhdWx0UGF0aDogZGVmYXVsdFBhdGhcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH07XG4gICAgICB2YXIgc2VhcmNoT25lSW5BcnJheSA9IGZ1bmN0aW9uIChzcmNJbWcpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy52aWRlb3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgbG9hZFRodW1ibmFpbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmdlbmVyYXRlVGh1bWJuYWlsKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICh0aHVtYm5haWxTcmMpIHtcbiAgICAgICAgICBzZWFyY2hPbmVJbkFycmF5KG9iai5wYXRoKS50aHVtYm5haWwgPSB0aHVtYm5haWxTcmM7XG4gICAgICAgICAgdmFyIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBUT0RPOiBvbnVwbG9hZCBkZXBlbmRlcmEgc2kgZXN0YSBvbmxpbmUgbyBubyBwYXJhIHNhYmVyIHNpIHNlIGludGVudGEgc3ViaXI7XG4gICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICBpbnNlcnRWaWRlbyhvYmoucGF0aCwgc3luYywgdGh1bWJuYWlsU3JjLCBvblVwbG9hZCwgb2JqLmRlZmF1bHRQYXRoKTtcbiAgICAgICAgICAvLyAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ21haW5TY3JvbGwnKS5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH07XG4gICAgICBzLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqVmlkZW8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKG9ialZpZGVvKTtcbiAgICAgIH07XG4gICAgICBzLmdldFZpZEZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIHZpZGVvU2VydmljZS50YWtlZFZpZCgpLnRoZW4oZnVuY3Rpb24gKHZpZGVvRGF0YSkge1xuICAgICAgICAgIGlmICghaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhaXNUYWtpbmdHZW8pIHtcbiAgICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YWlzVGFraW5nR2VvID0gdHJ1ZTtcbiAgICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZpZGVvRGF0YSk7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZpZGVvRGF0YSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBkZWZhdWx0UGF0aCA9IHZhbHVlLmZ1bGxQYXRoO1xuICAgICAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoZGVmYXVsdFBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqVmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBmYWxzZSwgdHJ1ZSwgJycsIGRlZmF1bHRQYXRoKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgICAgICBzLnZpZGVvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlQ29tcHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIGdldFZpZGVvU2VydmljZS5nZXRWaWRlb0NvbXByZXNzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIHZhciByZXNWaWRlb0NvbXByZXNzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgLy8gVE9ETzogMTI1ODI5MTIgc29uIDEyTUIgO1xuICAgICAgICAgIGlmIChjaGVja0ZpbGVTZXJ2aWNlLmZpbGUuc2l6ZSA8IDEyNTgyOTEyKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgZGVmYXVsdFBhdGggPSB2YWx1ZS5mdWxsUGF0aDtcbiAgICAgICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGRlZmF1bHRQYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeSwgY2hlY2tGaWxlU2VydmljZS5maWxlKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnLCBkZWZhdWx0UGF0aCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgICAgcy52aWRlb3MucHVzaChvYmopO1xuICAgICAgICAgICAgICAgIGxvYWRUaHVtYm5haWwob2JqKTsgIC8vIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnZWwgYXJjaGl2byBzdXBlcmEgZWwgdGFtYVxceEYxYSBtYXhpbW8gcGVybWl0aWRvLiBtYXhpbW8gMTJNQicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBzdWNjZXNzKHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1N1Y2Nlc3MnLCByKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGVycm9yKGNvZGUpIHtcbiAgICAgICAgaWYgKGNvZGUgPT09IDEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZmlsZSBoYW5kbGVyIGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1VuZGVmaW5lZCBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE8gOiBubyBsb2dybyByZXByb2R1Y2lyIGxvcyB2aWRlb3MgZ3JhYmFkb3MgY29uIGVsIG1lZGlhIGRlIGNvcmRvdmEgLCBlbiBjYW1iaW8gc2kgbG8gcHVlZG8gaGFjZXIgY29uIGxvcyBncmFiYWRvcyBjb24gbGEgY2FtYXJhIGZpbG1hZG9yYSBmdWVyYSBkZSBhanVzdGV2YXBwLCBzZXJhIHBvciBsYSB1YmljYWNpb24gZGVsIGFyY2hpdm8/Pz9cbiAgICAgICAgLy8gY29yZG92YS5wbHVnaW5zLmRpc3VzZXJlZC5vcGVuKCdmaWxlOi8vL2RhdGEvZGF0YS9jb20uYWp1c3Rldi5iL2ZpbGVzLzIwMTUwNTA3XzE3NDcyNi5tcDQnLCBzdWNjZXNzLCBlcnJvcik7XG4gICAgICAgIGNvcmRvdmEucGx1Z2lucy5kaXN1c2VyZWQub3BlbignZmlsZTovc3RvcmFnZS9lbXVsYXRlZC8wL2RjaW0vY2FtZXJhLzIwMTUwNTA0XzA2MzAwOS5tcDQnLCBzdWNjZXNzLCBlcnJvcik7XG4gICAgICB9O1xuICAgICAgcy5wbGF5VmlkZW8gPSBmdW5jdGlvbiAoZnVsbFBhdGgpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLnBsYXlWaWRlbyhmdWxsUGF0aCkudGhlbihzdWNjZXNzKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgncGxheVZkcycsIHBsYXlWZHMpO1xuICBwbGF5VmRzLiRpbmplY3QgPSBbJyRxJ107XG4gIGZ1bmN0aW9uIHBsYXlWZHMoJHEpIHtcbiAgICByZXR1cm4geyBwbGF5VmQ6IHBsYXlWZCB9O1xuICAgIGZ1bmN0aW9uIHBsYXlWZChwYXRoKSB7XG4gICAgICAvLyB2YXIgcGF0aCA9ICdmaWxlOi9zdG9yYWdlL2VtdWxhdGVkLzAvZGNpbS9jYW1lcmEvJyArIGZpbGVOYW1lO1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29yZG92YS5wbHVnaW5zLmRpc3VzZXJlZC5vcGVuKHBhdGgsIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBxLnJlc29sdmUocmVzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgcS5yZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfVxuICB9XG59KCkpOyIsImFwcC5mYWN0b3J5KCd2aWRlb1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhcHR1cmUnLFxuICAnc3FsaXRlU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAncGxheVZkcycsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhcHR1cmUsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHBsYXlWZHMpIHtcbiAgICB2YXIgdmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gW107XG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3M7XG4gICAgfTtcbiAgICB2YXIgX3Rha2VkVmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGxpbWl0OiAxLFxuICAgICAgICBkdXJhdGlvbjogMTJcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYXB0dXJlLmNhcHR1cmVWaWRlbyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvRGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRWaWRlb3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZFZpZGVvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0VmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCB0aHVtYm5haWwsIG9uVXBsb2FkLCBkZWZhdWx0UGF0aCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkVmlkZW9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsdGh1bWJuYWlsLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2LCBkZWZhdWx0UGF0aCAgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyw/KSc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgICAgcGF0aCxcbiAgICAgICAgc3luYyxcbiAgICAgICAgJ3Rlc3R1dWlkJyxcbiAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKSxcbiAgICAgICAgZGVmYXVsdFBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlVmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkVmlkZW9zIHNldCBzeW5jPT8gLCBvblVwbG9hZD0gPyBXSEVSRSBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfcGxheVZpZGVvID0gZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBmdWxsUGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICByZXR1cm4gcGxheVZkcy5wbGF5VmQoZnVsbFBhdGgpO1xuICAgIH07XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5hbGwgPSBfYWxsO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudGFrZWRWaWQgPSBfdGFrZWRWaWQ7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5nZXRWaWRlb3MgPSBfZ2V0VmlkZW9zO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuaW5zZXJ0VmlkZW8gPSBfaW5zZXJ0VmlkZW87XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS51cGRhdGVWaWRlbyA9IF91cGRhdGVWaWRlbztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnBsYXlWaWRlbyA9IF9wbGF5VmlkZW87XG4gICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==