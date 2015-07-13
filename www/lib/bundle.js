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
var z = null;
var p = null;
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
    url: '/inspeccion/:id/:placa/:calificado/:revest',
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
    z = zumeroService;
    p = placasService;
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
    $scope.revEst = parseInt($stateParams.revest);
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
        inspeccionService.getRevEst().then(function () {
          $scope.getAlreadyInspect();
        });
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
      observacion: '',
      revEst: null
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
        obj.sl.label,
        intermediateService.data.placa
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
      var query = 'INSERT INTO [idpropiedades] ([idinspeccion] ,[idsubproceso] ,[iditem],[idparentitem]  ,[nombre] ,[idopcion]  ,[seleccion], [placa] ) VALUES (?,?,?,?,?,?,?, ?)';
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
        // 829,
        // _cl.tipo,
        inspeccionServiceFactory.data.revEst,
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
          inspeccionServiceFactory.data.revEst = _cl.tipo;
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
      // var deferred = $q.defer();     
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
      _sections();  // deferred.resolve();      
                    // return deferred.promise;
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
        inspeccionServiceFactory.data.revEst,
        // _cl.tipo,
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
        // 829
        inspeccionServiceFactory.data.revEst
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        var obsKm = sqliteService.rtnArray(res)[0];
        inspeccionServiceFactory.data.observacion = obsKm.observacion;
        inspeccionServiceFactory.data.kilometraje = obsKm.kilometraje;
      }, errorService.consoleError);
    };
    var _getAlreadyInspect = function () {
      var query = 'select oif.idservicio , cpc.iditem, oif.idParentItem, oif.nombre,customsection, customorder , controlJson , idp.idopcion as value, idp.seleccion as label , bt.Orden as Orden ';
      query += 'from  viewVdos oif inner join calificacionpiezascodigo cpc on  cpc.iditem= oif.iditem  and oif.tipo=1 ';
      query += 'inner join controlElementos ce on ce.idcontrol =oif.idcontrol ';
      query += 'inner join  clases_carrocerias cc on cc.idcodigocalificacion=cpc.idcodigocalificacion ';
      query += 'inner join idinspeccion i on i.idClaseCarroceria=cc.idclasecarroceria ';
      query += 'inner join idpropiedades idp on idp.idinspeccion=i.idinspeccion and idp.iditem = cpc.iditem ';
      query += 'inner join Base_Tipos bt on bt.IdTipo =oif.customsection ';
      query += 'where  i.idinspeccion =? and oif.idservicio=?    ';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        // 829
        inspeccionServiceFactory.data.revEst
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        _setAlreadyInspectJson(sqliteService.rtnArray(res));
        return _serObsKm();
      }, errorService.consoleError);
    };
    var _updateIdClaseCarroceria = function () {
      var query = 'UPDATE [idinspeccion]   SET [idClaseCarroceria] =? , [revEst]=?  WHERE idinspeccion=?';
      var binding = [
        inspeccionServiceFactory.idClaseCarroceria,
        inspeccionServiceFactory.data.revEst,
        intermediateService.data.idinspeccion
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return _insertState(477);
      }, errorService.consoleError);
    };
    var _insertState = function (idestado) {
      var query = 'INSERT INTO [idsubprocesoseguimiento] ([idinspeccion]    ,[idsubproceso]   ,[idestado]   ,[fecha] , [placa] )  VALUES    (?,?,?,?,?)';
      var binding = [
        intermediateService.data.idinspeccion,
        // inspeccionServiceFactory.idinspeccion,
        // 829,
        // _cl.tipo,
        inspeccionServiceFactory.data.revEst,
        idestado,
        momentService.getDateTime(),
        intermediateService.data.placa
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        inspeccionServiceFactory.alreadySaved = true;
        zumeroService.zync(3);  // inspeccionServiceFactory.cl.tipo = null;
      }, errorService.consoleError);
    };
    var _getRevEst = function () {
      var idestado = 477;
      var query = 'SELECT [idsubproceso]    FROM [idsubprocesoseguimiento]where idinspeccion=? and idestado=? ';
      var binding = [
        intermediateService.data.idinspeccion,
        idestado
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return inspeccionServiceFactory.data.revEst = sqliteService.rtnArray(res)[0].idsubproceso;
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
    inspeccionServiceFactory.getRevEst = _getRevEst;
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
          console.log($scope.services.length);
          if ($scope.services.length < 1) {
            placasService.getSrvs().then(function () {
              $scope.services = placasService.srvs;
            });
          }
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
        // placasService.getSrvs().then(function () {
        // $scope.services = placasService.srvs;
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
          }  /* }, function (e) {
          });*/
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
          calificado: obj.calificado,
          revest: obj.revEst
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
        if ($scope.services.length > 0) {
          $scope.services.length < 2 ? $scope.data.sl = $scope.services[0].value : $scope.data.sl = null;
        }
      };
      $scope.setOpciones = function (revEst) {
        // console.log(revEst);
        if (!revEst) {
          return false;
        }
        return true;
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
      var query = 'select i.idinspeccion, placa, i.sync, bt.Nombre as servicio, ro.idsub as revEst, ';
      query += '        case when iss.idinspeccion is null then 0 else 1 end as calificado , iss.idsubproceso as idsubproceso ';
      query += '          from idinspeccion i ';
      query += '        left join  Base_Tipos bt on bt.IdTipo= i.appidsrv ';
      query += '        left join  Ro_Servicios ro on ro.idSrv= i.appidsrv ';
      query += '        left join (select idinspeccion, idsubproceso from  idsubprocesoseguimiento ';
      query += '                  where idestado=477) ';
      query += '         iss on iss.idinspeccion=i.idinspeccion';
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
      var query = 'SELECT [IdTipo] as value ,[Nombre] as label, rs.idsub as revEst FROM Base_Tipos bt  inner join ro_servicios rs on rs.idSrv=bt.IdTipo   where rs.enabled=1   order by label';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiRm90b3MvRm90b0NvbnRyb2xsZXIuanMiLCJGb3Rvcy9mb3Rvc1NlcnZpY2UuanMiLCJGb3Rvcy9ydG5GaW5kLmpzIiwiY29kRmFzL0NvZEZhcy5qcyIsImNvZEZhcy9jb2RmYXNTcnYuanMiLCJjb250cm9sbGVycy9BY2Nlc29yaW9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJpbnNwZWNjaW9uL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiaW5zcGVjY2lvbi9pbnNwZWNjaW9uU2VydmljZS5qcyIsInBsYWNhcy9QbGFjYXNDb250cm9sbGVyLmpzIiwicGxhY2FzL3BsYWNhc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZGx0RmlsZS5qcyIsInNlcnZpY2VzL2Vhc3lEaXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZXJyb3JTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlsZVRyYW5zZmVyU2VydmljZS5qcyIsInNlcnZpY2VzL2ZpcnN0SW5pdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9mb2N1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9nZXRWaWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9ncHNTZXJ2aWNlLmpzIiwic2VydmljZXMvaW50ZXJtZWRpYXRlU2VydmljZS5qcyIsInNlcnZpY2VzL21vbWVudFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vZmZsaW5lU2VydmljZS5qcyIsInNlcnZpY2VzL29ubGluZVN0YXR1c1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9zcWxpdGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdGl0bGVTZXJ2aWNlLmpzIiwic2VydmljZXMvdG9hc3RTZXJ2aWNlLmpzIiwic2VydmljZXMvdW5zeW5jU2VydmljZS5qcyIsInNlcnZpY2VzL3VwZGF0ZVN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmpzIiwic2VydmljZXMvenVtZXJvU2VydmljZS5qcyIsInNldHRpbmdzL1NldHRpbmdzLmpzIiwic2V0dGluZ3Mvc2V0dGluZ3NTcnYuanMiLCJ2aWRlb3MvVmlkZW9Db250cm9sbGVyLmpzIiwidmlkZW9zL3BsYXlWZHMuanMiLCJ2aWRlb3MvdmlkZW9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4vLyB2YXIgbHMgPSBudWxsO1xuLy8gdmFyIHp1bWVybyA9IG51bGw7XG4vLyB2YXIgY3MgPSBudWxsO1xuLy8gdmFyIHpzID0gbnVsbDtcbi8vIHZhciBwcyA9IG51bGw7XG4vLyB2YXIgcGMgPSBudWxsO1xuLy8gdmFyIGNmID0gbnVsbDtcbi8vIHZhciBlZCA9IG51bGw7XG4vLyB2YXIgY2MgPSBudWxsO1xuLy8gcHJ1ZWJhcyBsb2NhbGVzXG52YXIgZGIgPSBudWxsO1xudmFyIGYgPSBudWxsO1xudmFyIGkgPSBudWxsO1xudmFyIHogPSBudWxsO1xudmFyIHAgPSBudWxsO1xuLy8gdmFyIHNlcnZpY2VzID0ge307XG4vLyB2YXIgbmdDb3Jkb3ZhID0ge307XG4vLyB2YXIgYWxyZWFkeUluc3BlY3QgPSBmYWxzZTtcbi8vIHZhciBycCA9IG51bGw7XG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbXG4gICdpb25pYycsXG4gICdzdGFydGVyLmNvbnRyb2xsZXJzJyxcbiAgJ25nU3RvcmFnZScsXG4gICduZ0NvcmRvdmEnLFxuICAndWkudXRpbHMnLFxuICAnbmdGeCcsXG4gICduZ0FuaW1hdGUnLFxuICAnYW5ndWxhci1sb2FkaW5nLWJhcicsXG4gICdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsIGNmcExvYWRpbmdCYXJQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yU2VydmljZScpO1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgIHVybDogJy9hcHAnLFxuICAgIGFic3RyYWN0OiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FwcEN0cmwnXG4gIH0pLnN0YXRlKCdhcHAuc2VhcmNoJywge1xuICAgIHVybDogJy9zZWFyY2gnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvc2VhcmNoLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLmJyb3dzZScsIHtcbiAgICB1cmw6ICcvYnJvd3NlJyxcbiAgICB2aWV3czogeyAnbWVudUNvbnRlbnQnOiB7IHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2Jyb3dzZS5odG1sJyB9IH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGF5bGlzdHMnLCB7XG4gICAgdXJsOiAnL3BsYXlsaXN0cycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxheWxpc3RzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAucGxhY2FzJywge1xuICAgIHVybDogJy9wbGFjYXMnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcGxhY2FzL3BsYWNhcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYWNhc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnNpbmdsZScsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzLzpwbGF5bGlzdElkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYXlsaXN0Q3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuZm90bycsIHtcbiAgICB1cmw6ICcvZm90b3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL0ZvdG9zL2ZvdG8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3RvQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAudmlkZW8nLCB7XG4gICAgdXJsOiAnL3ZpZGVvLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWRlb3MvdmlkZW8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWaWRlb0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgdXJsOiAnL2luc3BlY2Npb24vOmlkLzpwbGFjYS86Y2FsaWZpY2Fkby86cmV2ZXN0JyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2luc3BlY2Npb24vaW5zcGVjY2lvbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0luc3BlY2Npb25DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcbiAgICB1cmw6ICcvc2V0dGluZ3MnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5ncyAgYXMgU3QnICAvLyAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyQXM6ICd2bSdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuY29kRmFzJywge1xuICAgIHVybDogJy9jb2RmYXMvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvZEZhcy9jb2RmYXMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb2RGYXMgYXMgdm0nXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgIHVybDogJy9sb2dpbicsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW5Jb25pYy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcidcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuYWNjZXNvcmlvcycsIHtcbiAgICB1cmw6ICcvYWNjZXNvcmlvcy86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FjY2Vzb3Jpb3MuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBY2Nlc29yaW9zQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2xvZ2luJyk7XG4gIC8vIFRPRE86IHBhcmEgcXVlIHNlIGNvbnNpZGVyZW4gc2FuYXMgbGFzIG5nLXNyYyBxdWUgdGVuZ2FuIGVzdGEgc2ludGF4aXM7XG4gICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZmlsZXxibG9ifGNkdmZpbGV8Y29udGVudCk6fGRhdGE6aW1hZ2VcXC8vKTtcbiAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKHRydWUpO1xufSk7XG52YXIgc2VydmljZUJhc2UgPSAnaHR0cDovL2FqdXN0ZXZzaXZhLmNvbSc7XG4vL2F1dGgvJzsvLyAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvJztcbmFwcC5jb25zdGFudCgnbmdBdXRoU2V0dGluZ3MnLCB7XG4gIGFwaVNlcnZpY2VCYXNlVXJpOiBzZXJ2aWNlQmFzZSxcbiAgY2xpZW50SWQ6ICduZ0F1dGhBcHAnXG59KS5jb25maWcoZnVuY3Rpb24gKCRwcm92aWRlKSB7XG4gICRwcm92aWRlLmRlY29yYXRvcignJGV4Y2VwdGlvbkhhbmRsZXInLCBmdW5jdGlvbiAoJGRlbGVnYXRlLCAkaW5qZWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4Y2VwdGlvbiwgY2F1c2UpIHtcbiAgICAgICRkZWxlZ2F0ZShleGNlcHRpb24sIGNhdXNlKTtcbiAgICAgIGlmIChkYikge1xuICAgICAgICB2YXIgc3FsaXRlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ3NxbGl0ZVNlcnZpY2UnKTtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgICAgdmFyIG1vbWVudFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdtb21lbnRTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgIElOVE8gW2xvZ3NdKFtleF0sW2VtYWlsXSxbZmVjaGFdKSAgVkFMVUVTKD8sPyw/KSc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICAgIGFuZ3VsYXIudG9Kc29uKGV4Y2VwdGlvbiksXG4gICAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUgfHwgJycsXG4gICAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAgIF07XG4gICAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfSkgIC8vIHZhciBhbGVydGluZyA9ICRpbmplY3Rvci5nZXQoXCJhbGVydGluZ1wiKTtcbiAgICAgICAgICAgIC8vIGFsZXJ0aW5nLmFkZERhbmdlcihleGNlcHRpb24ubWVzc2FnZSk7XG47XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59KS5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0LCAkaW9uaWNQbGF0Zm9ybSwgJGxvY2FsU3RvcmFnZSwgJGNvcmRvdmFTUUxpdGUsIGNoZWNrRmlsZVNlcnZpY2UsIHZpZGVvVGh1bWJuYWlsU2VydmljZSwgJGNvcmRvdmFDYW1lcmEsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsICRjb3Jkb3ZhRmlsZSwgZWFzeURpclNlcnZpY2UsIGdldFZpZGVvU2VydmljZSwgY29weUZpbGVTZXJ2aWNlLCBhY2Nlc29yaW9zU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsIHBsYWNhc1NlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGNvcmRvdmFFdmVudHNTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBmaXJzdEluaXRTZXJ2aWNlLCBhdXRoU2VydmljZSwgZGV2aWNlU2VydmljZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJHN0YXRlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1bnN5bmNTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIGdwc1NlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgeiA9IHp1bWVyb1NlcnZpY2U7XG4gICAgcCA9IHBsYWNhc1NlcnZpY2U7XG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICAgIGF1dGhTZXJ2aWNlLmZpbGxBdXRoRGF0YSgpO1xuICAgIC8vICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgIC8vICAgY29uc29sZS5sb2coZXZlbnQsIG5leHQsIGN1cnJlbnQpO1xuICAgIC8vIH0pO1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpO1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAodG9TdGF0ZS5uYW1lID09PSAnYXBwLmxvZ2luJykge1xuICAgICAgICAvLyBkb2Ugc2hlL2hlIHRyeSB0byBnbyB0byBsb2dpbj8gLSBsZXQgaGltL2hlciBnb1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZyhhdXRoRGF0YSwgbW9tZW50U2VydmljZS5kaWZmTm93KGF1dGhEYXRhLmV4cCwgJ20nKSwgJz4gLTYwJyk7XG4gICAgICBpZiAoIWF1dGhEYXRhIHx8IG1vbWVudFNlcnZpY2UuZGlmZk5vdyhhdXRoRGF0YS5leHAsICdtJykgPiAtNjApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZWRpcmVjdCcpO1xuICAgICAgICAgIC8vV2FzIGNhbGxpbmcgdGhpcyBidXQgY29tbWVudGluZyBvdXQgdG8ga2VlcCBpdCBzaW1wbGU6IGF1dGhTZXJ2aWNlLnJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIC8vQ2hhbmdlcyBVUkwgYnV0IG5vdCB0aGUgdmlldyAtIGdvZXMgdG8gb3JpZ2luYWwgdmlldyB0aGF0IEknbSB0cnlpbmcgdG8gcmVkaXJlY3RcbiAgICAgICAgICAvL2F3YXkgZnJvbSBub3cgd2l0aCAxLjMuIEZpbmUgd2l0aCBpdCBidXQgaW50ZXJlc3RlZCBpbiB1bmRlcnN0YW5kaW5nIHRoZSBcbiAgICAgICAgICAvL1wicHJvcGVyXCIgd2F5IHRvIGRvIGl0IG5vdyBzbyBsb2dpbiB2aWV3IGdldHMgcmVkaXJlY3RlZCB0by5cbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpOyAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvL05pY2UgYWRkaXRpb24hIENhbid0IGRvIGFueSByZWRpcmVjdCB3aGVuIGl0J3MgY2FsbGVkIHRob3VnaFxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBscyA9ICRsb2NhbFN0b3JhZ2U7XG4gICAgLy8genVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlID0genVtZXJvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5nZXRWaWRlb1NlcnZpY2UgPSBnZXRWaWRlb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuY29weUZpbGVTZXJ2aWNlID0gY29weUZpbGVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmZpbGVUcmFuc2ZlclNlcnZpY2UgPSBmaWxlVHJhbnNmZXJTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnZpZGVvVGh1bWJuYWlsU2VydmljZSA9IHZpZGVvVGh1bWJuYWlsU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5lYXN5RGlyU2VydmljZSA9IGVhc3lEaXJTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmNoZWNrRmlsZVNlcnZpY2UgPSBjaGVja0ZpbGVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmFjY2Vzb3Jpb3NTZXJ2aWNlID0gYWNjZXNvcmlvc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuaW5zcGVjY2lvblNlcnZpY2UgPSBpbnNwZWNjaW9uU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy51bnN5bmNTZXJ2aWNlID0gdW5zeW5jU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5wbGFjYXNTZXJ2aWNlID0gcGxhY2FzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5vbmxpbmVTdGF0dXNTZXJ2aWNlID0gb25saW5lU3RhdHVzU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5jb3Jkb3ZhRXZlbnRzU2VydmljZSA9IGNvcmRvdmFFdmVudHNTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnRvYXN0U2VydmljZSA9IHRvYXN0U2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5vZmZsaW5lU2VydmljZSA9IG9mZmxpbmVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmxvY2FsU3RvcmFnZSA9ICRsb2NhbFN0b3JhZ2U7XG4gICAgLy8gc2VydmljZXMuZmlyc3RJbml0U2VydmljZSA9IGZpcnN0SW5pdFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMubW9tZW50U2VydmljZSA9IG1vbWVudFNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5kZXZpY2VTZXJ2aWNlID0gZGV2aWNlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5pbnRlcm1lZGlhdGVTZXJ2aWNlID0gaW50ZXJtZWRpYXRlU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5mb3Rvc1NlcnZpY2UgPSBmb3Rvc1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZ3BzU2VydmljZSA9IGdwc1NlcnZpY2U7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFTUUxpdGUgPSAkY29yZG92YVNRTGl0ZTtcbiAgICAvLyBuZ0NvcmRvdmEuY29yZG92YUZpbGUgPSAkY29yZG92YUZpbGU7XG4gICAgLy8gbmdDb3Jkb3ZhLmNvcmRvdmFDYW1lcmEgPSAkY29yZG92YUNhbWVyYTtcbiAgICAvLyB6cyA9IHp1bWVyb1NlcnZpY2U7XG4gICAgLy8gY3MgPSA7XG4gICAgLy8gY2YgPSA7XG4gICAgLy8gZWQgPSBlYXN5RGlyU2VydmljZTtcbiAgICAvLyBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQignemRiZmlsZS5kYicsIDEpO1xuICAgIC8vIGNjID0gJGNvcmRvdmFDYW1lcmE7XG4gICAgLy8gY2MgPSBnZXRWaWRlb1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuenVtZXJvU2VydmljZS5zZXRadW1lcm8oJ3pkYmZpbGUnKTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnenVtZXJvdGVzdGRiZmlsZScpO1xuICAgIHp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6dW1lcm90ZXN0ZGJmaWxlJyk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5vbk9ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PZmZsaW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuY29ublR5cGUoKTtcbiAgICBjb3Jkb3ZhRXZlbnRzU2VydmljZS5vblBhdXNlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25SZXN1bWUoKTtcbiAgICBkZXZpY2VTZXJ2aWNlLnNldEluZm8oKTtcbiAgICAvLyBUT0RPOiAgdmVyaWZpY2FyIHNpIGV4aXN0ZSBlbiBlbCBsb2NhbHN0b3JhZ2UgYWxndW5hIGJhbmRlcmEgcXVlIGRpZ2Egc2kgeWEgc2Ugc3luYyBhbGd1bmEgdmV6IFxuICAgICRsb2NhbFN0b3JhZ2UubWVzc2FnZSA9ICdIZWxsbyBXb3JsZCc7XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7ICAvLyB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbiB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICB9KTtcbn0pOyAgLy8gYXBwLnJ1bihbXG4gICAgIC8vICAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAgICAvLyAgICckbG9jYXRpb24nLFxuICAgICAvLyAgIGZ1bmN0aW9uIChsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgICAgLy8gICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAvLyAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgLy8gICAgICAgLy8gVE9ETzogZXN0byBubyBlcyBuZWNlc2FyaW8sIHBvciBxdWUgYWwgaW50ZW50YXIgc2luY3Jvbml6YXIgdW5hIGltYWdlbiB5IGVsIHRva2VuIGVzdGEgdmVuY2lkbywgc2UgcmVkaXJlY2Npb25hIGEgbG9naW4gYXV0b21hdGljYW1lbnRlXG4gICAgIC8vICAgICAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgIC8vICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgIC8vICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgLy8gICAgICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpID4gMCkge1xuICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbicpO1xuICAgICAvLyAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgICAgfVxuICAgICAvLyAgICAgfVxuICAgICAvLyAgIH1cbiAgICAgLy8gXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycsIFtdKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTW9kYWwsICR0aW1lb3V0KSB7XG4gIC8vIEZvcm0gZGF0YSBmb3IgdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcbiAgLy8gQ3JlYXRlIHRoZSBsb2dpbiBtb2RhbCB0aGF0IHdlIHdpbGwgdXNlIGxhdGVyXG4gICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL2xvZ2luLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgfSk7XG4gIC8vIFRyaWdnZXJlZCBpbiB0aGUgbG9naW4gbW9kYWwgdG8gY2xvc2UgaXRcbiAgJHNjb3BlLmNsb3NlTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgfTtcbiAgLy8gT3BlbiB0aGUgbG9naW4gbW9kYWxcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gIH07XG4gIC8vIFBlcmZvcm0gdGhlIGxvZ2luIGFjdGlvbiB3aGVuIHRoZSB1c2VyIHN1Ym1pdHMgdGhlIGxvZ2luIGZvcm1cbiAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RvaW5nIGxvZ2luJywgJHNjb3BlLmxvZ2luRGF0YSk7XG4gICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXG4gICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jbG9zZUxvZ2luKCk7XG4gICAgfSwgMTAwMCk7XG4gIH07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAkc2NvcGUucGxheWxpc3RzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnUmVnZ2FlJyxcbiAgICAgIGlkOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NoaWxsJyxcbiAgICAgIGlkOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0R1YnN0ZXAnLFxuICAgICAgaWQ6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnSW5kaWUnLFxuICAgICAgaWQ6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUmFwJyxcbiAgICAgIGlkOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0Nvd2JlbGwnLFxuICAgICAgaWQ6IDZcbiAgICB9XG4gIF07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdGb3RvQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICckZmlsdGVyJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICAnJGxvZycsXG4gICckaW9uaWNNb2RhbCcsXG4gIGZ1bmN0aW9uIChzLCBmb3Rvc1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgJGZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgY29weUZpbGVTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSwgJGxvZywgJGlvbmljTW9kYWwpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2pzL0ZvdG9zL2ZvdG9Nb2RhbC5odG1sJywge1xuICAgICAgICBzY29wZTogcyxcbiAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgICBzLm1vZGFsID0gbW9kYWw7XG4gICAgICAgICRsb2cuZGVidWcobW9kYWwpO1xuICAgICAgfSk7XG4gICAgICAvLyBzLnRpdHRsZSA9ICcnO1xuICAgICAgcy50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICBzLmltZ1Vuc3luYyA9IFtdO1xuICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBGVU5DSU9OQSBCSUVOIFBBUkEgVkVSIEVMIENBTUJJTyBJTk1FRElBVEFNRU5URVxuICAgICAgLy8gcy5vbmxpbmVTdGF0dXMgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIFJFUVVJRVJFIE9UUk8gRElHRVNUIFBBUkEgUVVFIEZVTkNJT05FXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEUgIEVTIE1FSk9SIFJBU1RSRUFSIFNJRU1QUkUgVU4gT0JKRVRPXG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIC8vICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAvLyBUT0RPOiBvbmhvbGQgY2FuIGVkaXQgcGxhY2EsIG9uIHN3aXBlIGxlZnQgZGVsZXRlIHdpdGggY29uZmlybVxuICAgICAgLy8gVE9ETzogYWx3YXlzIHVzZSBpb24tbmF2LXRpdGxlICwgcGFyYSBwb2RlcmxlIHBvbmVyIGxvcyB0aXR1bG9zIHF1ZSBxdWllcm9cbiAgICAgIC8vIHMub3NzID0geyBvbmxpbmU6IG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUgfTtcbiAgICAgIHMucGhvdG9zID0gZm90b3NTZXJ2aWNlLnBob3RvcztcbiAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICBzLmZvdG9zRmFsdCA9IFtdO1xuICAgICAgcy5nZXRQaG90b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IGNyZW8gayBlcyBtZWpvciBoYWNlciByZWZlcmVuY2lhIGRpcmVjdGFtZW50ZSBhIGludGVybWVkaWF0ZXNlcnZpY2UuREFUQSAuaWRpbnNwZWNjaW9uIGsgYSBzLmlkaW5zcGVjY2lvbjtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmdldFBob3RvcyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzLnBob3RvcyA9IGZvdG9zU2VydmljZS5waG90b3M7XG4gICAgICAgICAgcy5uYW1lcyA9IGZvdG9zU2VydmljZS5uYW1lcztcbiAgICAgICAgICBzLmZvdG9zRmFsdCA9IGZvdG9zU2VydmljZS5mb3Rvc0ZhbHQ7XG4gICAgICAgICAgX2ZpbHRlclVuc3luYygwKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIHMuJG9uKCdteUV2ZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXkgZXZlbnQgb2NjdXJyZWQnLCBzLmlkaW5zcGVjY2lvbiwgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgIHMuZ2V0UGhvdG9zKCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBfZmlsdGVyVW5zeW5jID0gZnVuY3Rpb24gKGVxdWFsKSB7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHN5bmM6IGVxdWFsIH0sIHRydWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzLnBob3RvcywgZm91bmQpO1xuICAgICAgICBzLmltZ1Vuc3luYyA9IGZvdW5kO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMubWFzc2l2ZUxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocy5tYXNzaXZlTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzLm1hc3NpdmVMZW5ndGgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoLCAnc3luYycpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgLy9UT0RPIDogQ1VBTkRPIEVTIFVOQSBTT0xBIEVTVEEgQklFTiwgQ1VFTkFPRCBFUyBVTiBBUlJBWSBERUJPIERFIEhBQ0VSIFFVRSBTWU5DIENPTiBMQSBVTFRJTUEgRk9UTyBVTiAuTEVOVEhHIFBVRURFIFNFUlxuICAgICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIC8vIHZhciBydG5UaXBvRm90bz1mdW5jdGlvbigpe1xuICAgICAgLy8gICByZXR1cm4gXG4gICAgICAvLyB9XG4gICAgICB2YXIgaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmluc2VydEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChmb3Rvc1NlcnZpY2UudGlwb0ZvdG8uY2FudGlkYWQgPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzLmZvdG9zRmFsdC5pbmRleE9mKGZvdG9zU2VydmljZS50aXBvRm90byk7XG4gICAgICAgICAgICAkbG9nLmRlYnVnKGluZGV4KTtcbiAgICAgICAgICAgIHMuZm90b3NGYWx0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpGb3RvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9iakZvdG8ucHJvZ3Jlc3MgPSBwZXJjZW50YWdlO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqZWN0Rm90byA9IGZ1bmN0aW9uIChwbGFjYSwgcGF0aCwgc3luYywgb25VcGxvYWQsIGlkdGlwbykge1xuICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgIHBsYWNhOiBwbGFjYSxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHN5bmM6IHN5bmMsXG4gICAgICAgICAgb25VcGxvYWQ6IG9uVXBsb2FkLFxuICAgICAgICAgIC8vcy5vc3Mub25saW5lID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgcnV0YVNydjogbW9tZW50U2VydmljZS5ydXRhU3J2KHBhdGgpLFxuICAgICAgICAgIGlkdGlwbzogaWR0aXBvXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9O1xuICAgICAgdmFyIHNlYXJjaE9uZUluQXJyYXkgPSBmdW5jdGlvbiAoc3JjSW1nKSB7XG4gICAgICAgIC8vIFRPRE86IEhBQlJBIE9UUkEgRk9STUEgREUgRklMVEFSIE1BUyBSQVBJREEgSyBFTCBTVFJJTkcgUEFUSDtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy5waG90b3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqRm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQob2JqRm90byk7XG4gICAgICB9O1xuICAgICAgLy8gcy5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgICAvLyAgIHMub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAgIC8vICAgaWYgKGJvb2wpIHtcbiAgICAgIC8vICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfTtcbiAgICAgIHMuc3luY0ltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcy5tYXNzaXZlTGVuZ3RoID0gcy5pbWdVbnN5bmMubGVuZ3RoO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gocy5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgIHMudHJ5VXBsb2FkKG9iaik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuc2V0bmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKG5vbWJyZSwgZm90byk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkdGlwbywgZm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS5zZXROYW1lKGlkdGlwbywgZm90bykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5mb3Rvc0ZhbHQgPSBmb3Rvc1NlcnZpY2UuZm90b3NGYWx0O1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IHRydWU7XG4gICAgICAgIGZvdG9zU2VydmljZS50YWtlZHBpYygpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgICAgLy8gVE9ETzogcGFyYSBsYXMgdGFibGV0cyBhcGFnbyBlbCBncHMsIHkgYWxnbyBwYXNhIGNvbiBsYSBjYW1hcmFcbiAgICAgICAgICAvLyBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgaWYgKCFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGFpc1Rha2luZ0dlbykge1xuICAgICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhaXNUYWtpbmdHZW8gPSB0cnVlO1xuICAgICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZVVSSSk7XG4gICAgICAgICAgLy8gZm90b3NTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9udXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGjCv2d1YXJkYXIgYXF1aSBlbCBzcWxpdGUgeSBsdWVnbyBhY3R1YWxpemFybG8gc2kgc3ViZSBleGl0b3NvO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9iamVjdEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCwgZm90b3NTZXJ2aWNlLnRpcG9Gb3RvLmlkVGlwb0ZvdG8pO1xuICAgICAgICAgICAgcy5waG90b3MucHVzaChvYmopO1xuICAgICAgICAgICAgaW5zZXJ0Rm90byhyZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ21haW5TY3JvbGwnKS5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBlcyBtZWpvciBsbGFtYXIgYSB1bmEgZnVuY2lvbiwgcG9yIHF1ZSBhc2kgc2UgZWplY3V0YSBwYXJhIGNhZGEgdW5vLCB5IHNlIGVqZWN1dGEgYmllbiwgZW4gdmV6IGRlIGxsYW1hciBmaWx1cGxvYWQgZGVzZGUgYWNhXG4gICAgICAgICAgICAvL3ByZUZpbGVVcGxvYWQocmVzLm5hdGl2ZVVSTCk7ICAvLyAkc2NvcGUucGhvdG9zLnB1c2gocmVzLm5hdGl2ZVVSTCk7XG4gICAgICAgICAgICBwcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgcy5zZXRJZFRpcG9Gb3RvID0gZnVuY3Rpb24gKHRpcG9Gb3RvKSB7XG4gICAgICAgICRsb2cuZGVidWcodGlwb0ZvdG8pO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGlwb0ZvdG8gPSB0aXBvRm90bztcbiAgICAgICAgcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgIC8vIFxuICAgICAgICBzLmdldFBpY0ZpbGUoKTtcbiAgICAgIH07XG4gICAgICBzLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgIHMubGlzdFBpY3MgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAnaWRUaXBvRm90byc6IDQ5NCxcbiAgICAgICAgICAnbm9tYnJlRm90byc6ICdQbGFjYScsXG4gICAgICAgICAgJ29yZGVuJzogJzEnLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA2MjUsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnRnJlbnRlIExpY2VuY2lhIFRyYW5zaXRvJyxcbiAgICAgICAgICAnb3JkZW4nOiAxMCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk1LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ0RlbGFudGVyYSBEZXJlY2hhJyxcbiAgICAgICAgICAnb3JkZW4nOiA0MCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdpZFRpcG9Gb3RvJzogNDk2LFxuICAgICAgICAgICdub21icmVGb3RvJzogJ0RlbGFudGVyYSBJenF1aWVyZGEnLFxuICAgICAgICAgICdvcmRlbic6IDMwLFxuICAgICAgICAgICdjYW50aWRhZCc6ICcxJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ2lkVGlwb0ZvdG8nOiA0OTcsXG4gICAgICAgICAgJ25vbWJyZUZvdG8nOiAnVHJhc2VyYSBEZXJlY2hhJyxcbiAgICAgICAgICAnb3JkZW4nOiA1MCxcbiAgICAgICAgICAnY2FudGlkYWQnOiAnMSdcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZvdG9zU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FtZXJhJyxcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdydG5GaW5kJyxcbiAgJyRmaWx0ZXInLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYW1lcmEsICRjb3Jkb3ZhRmlsZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgbW9tZW50U2VydmljZSwgcnRuRmluZCwgJGZpbHRlcikge1xuICAgIHZhciBmb3Rvc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm5hbWVzID0gW107XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc0ZhbHQgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnRpcG9Gb3RvID0ge307XG4gICAgLy8gW3tcbiAgICAvLyAgICAgcGxhY2E6ICdBQkMxMTEnLFxuICAgIC8vICAgICBzcmM6ICcnLFxuICAgIC8vICAgICBzeW5jOiBmYWxzZVxuICAgIC8vICAgfV07XG4gICAgdmFyIF9yZW1vdmUgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLnNwbGljZShmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcy5pbmRleE9mKHBsYWNhKSwgMSk7XG4gICAgfTtcbiAgICB2YXIgX2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcztcbiAgICB9O1xuICAgIHZhciBfdGFrZWRwaWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgcXVhbGl0eTogNDUsXG4gICAgICAgIC8vNTAsXG4gICAgICAgIGRlc3RpbmF0aW9uVHlwZTogQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5GSUxFX1VSSSxcbiAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgLy8gYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgICBlbmNvZGluZ1R5cGU6IENhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgICAgdGFyZ2V0V2lkdGg6IDEwMDAsXG4gICAgICAgIC8vaW1wb3J0YW50ZSBjb24gMTAwIHNlIHZlaWEgaG9ycmlibGVcbiAgICAgICAgdGFyZ2V0SGVpZ2h0OiAxMDAwLFxuICAgICAgICAvLyBUT0RPOiByZXZpc2FyIHBhcmEgcXVlIHNpcnZlIGVzdGEgb3BjaW9uXG4gICAgICAgIC8vIHBvcG92ZXJPcHRpb25zOiBDYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2VcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICByZXR1cm4gaW1hZ2VVUkk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGhvdG9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRmb3RvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBfZ2V0TmFtZXMoKTsgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0TmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkVGlwb0ZvdG8sIE5vbWJyZUZvdG8sIGVuYWJsZWQgICBmcm9tIHRpcG9zRm90byBXSEVSRSBlbmFibGVkPTEgb3JkZXIgYnkgbm9tYnJlZm90byc7XG4gICAgICB2YXIgcXVlcnkgPSAnIHNlbGVjdCBmYy5pZFRpcG9Gb3RvLCBOb21icmVGb3RvLGZjLm9yZGVuLCBmYy5jYW50aWRhZCAnO1xuICAgICAgcXVlcnkgKz0gJyBmcm9tIHRpcG9zRm90byB0ZiAnO1xuICAgICAgcXVlcnkgKz0gJyBpbm5lciBqb2luIGZvdG9zY2lhIGZjIG9uIHRmLmlkVGlwb0ZvdG89ZmMuaWRUaXBvRm90byAnO1xuICAgICAgcXVlcnkgKz0gJyBhbmQgdGYuZW5hYmxlZD0xIGFuZCBmYy5lbmFibGVkPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdvcmRlciBieSBmYy5vcmRlbiAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgICAgLy8gYW5ndWxhci5jb3B5KGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMsIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0KTtcbiAgICAgICAgLy8gZm90b3NTZXJ2aWNlRmFjdG9yeS5vcmRlckJ5KGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0LCAnb3JkZW4nLCBmYWxzZSk7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NQZW5kaWVudGVzKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX29yZGVyQnkgPSBmdW5jdGlvbiAoYXJyYXksIGV4cHJlc3Npb24sIHJldmVyc2UpIHtcbiAgICAgIGFycmF5ID0gJGZpbHRlcignb3JkZXJCeScpKGFycmF5LCBleHByZXNzaW9uLCByZXZlcnNlKTtcbiAgICB9O1xuICAgIHZhciBfZm90b3NQZW5kaWVudGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgYW5ndWxhci5jb3B5KGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMsIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NGYWx0KTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIHZhciBmaWx0ZXJPYmogPSB7IGlkVGlwb0ZvdG86IG9iai5pZHRpcG8gfTtcbiAgICAgICAgcnRuRmluZC5ybU9iakZyb21BcnJheShmb3Rvc1NlcnZpY2VGYWN0b3J5LmZvdG9zRmFsdCwgZmlsdGVyT2JqKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gaW1hZ2VVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNvcHlGaWxlKGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5LCBGaWxlTmFtZSwgY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG5ld0ZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBzdWNjZXNzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZGZvdG9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsZGVsZXRlZCwgb25VcGxvYWQsIHBsYWNhLCBmZWNoYSwgcnV0YVNydiwgaWR0aXBvKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyw/KSc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIC8vIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgICAgaW1hZ2VVUkksXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIDAsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgbW9tZW50U2VydmljZS5ydXRhU3J2KGltYWdlVVJJKSxcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS50aXBvRm90by5pZFRpcG9Gb3RvXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IHN5bmM9PyAsIG9uVXBsb2FkPSA/IFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3NldE5hbWUgPSBmdW5jdGlvbiAoaWR0aXBvLCBmb3RvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IGlkdGlwbz0/ICBXSEVSRSBpZGluc3BlY2Npb24gPT8gQU5EIHBhdGg9Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWR0aXBvLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBmb3RvLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5yb3dzQWZmZWN0ZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB3YXMgdXBkYXRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5yb3dzQWZmZWN0ZWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZm90b3NQZW5kaWVudGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnJlbW92ZSA9IF9yZW1vdmU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBfYWxsO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudGFrZWRwaWMgPSBfdGFrZWRwaWM7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lmluc2VydEZvdG8gPSBfaW5zZXJ0Rm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmdldFBob3RvcyA9IF9nZXRQaG90b3M7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS51cGRhdGVGb3RvID0gX3VwZGF0ZUZvdG87XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5zZXROYW1lID0gX3NldE5hbWU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5mb3Rvc1BlbmRpZW50ZXMgPSBfZm90b3NQZW5kaWVudGVzO1xuICAgIGZvdG9zU2VydmljZUZhY3Rvcnkub3JkZXJCeSA9IF9vcmRlckJ5O1xuICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ3J0bkZpbmQnLCBbXG4gICAgJyRmaWx0ZXInLFxuICAgICckbG9nJyxcbiAgICBydG5GaW5kXG4gIF0pO1xuICBmdW5jdGlvbiBydG5GaW5kKCRmaWx0ZXIsICRsb2cpIHtcbiAgICB2YXIgcnRuRmluZEZhY3RvcnkgPSB7IHJtT2JqRnJvbUFycmF5OiBybU9iakZyb21BcnJheSB9O1xuICAgIHJldHVybiBydG5GaW5kRmFjdG9yeTtcbiAgICAvLyBib2R5Li4uXG4gICAgZnVuY3Rpb24gcm1PYmpGcm9tQXJyYXkoYXJyYXksIGZpbHRlck9iaikge1xuICAgICAgdmFyIHN1YkFycmF5ID0gJGZpbHRlcignZmlsdGVyJykoYXJyYXksIGZpbHRlck9iaiwgdHJ1ZSk7XG4gICAgICAkbG9nLmRlYnVnKHN1YkFycmF5KTtcbiAgICAgIGlmIChzdWJBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHN1YkFycmF5WzBdO1xuICAgICAgICBpZiAob2JqLmNhbnRpZGFkID4gMCkge1xuICAgICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2Yob2JqKTtcbiAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuY29udHJvbGxlcignQ29kRmFzJywgW1xuICAgICckbG9nJyxcbiAgICAnY2ZzZXInLFxuICAgICdlcnJvclNlcnZpY2UnLFxuICAgIGNvZEZhc1xuICBdKTtcbiAgZnVuY3Rpb24gY29kRmFzKCRsb2csIGNmc2VyLCBlcnJvclNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLm1hcmNhcyA9IFtdO1xuICAgIHZtLmRhdGEgPSBjZnNlci5vYmpDb2RGYXM7XG4gICAgLy8gdm0uZmlsdGVyID0geyBtYXJjYTogJycgfTtcbiAgICB2bS5zZXRDb2RGYXMgPSBzZXRDb2RGYXM7XG4gICAgdm0udXBkQ29kRmFzID0gdXBkQ29kRmFzO1xuICAgIGFjdGl2YXRlKCk7XG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICBjZnNlci5nZXRDb2RGYXMoKS50aGVuKHNlbGVjdE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29kRmFzKCkge1xuICAgICAgJGxvZy5kZWJ1Zygnb3BlbiBzZXRjb2RmYXMnLCB2bS5kYXRhKTtcbiAgICAgIGNmc2VyLmluc2VydENvZEZhcygpLnRoZW4oaW5zZXJ0T2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRDb2RGYXMoKSB7XG4gICAgICBjZnNlci51cGRDb2RGYXMoKS50aGVuKHVwZE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgLy8vLy8vL1xuICAgIGZ1bmN0aW9uIGluc2VydE9rKCkge1xuICAgICAgJGxvZy5kZWJ1ZygnaW5zZXJ0IG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlbGVjdE9rKCkge1xuICAgICAgJGxvZy5kZWJ1Zygnc2VsZWN0IG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZE9rKCkge1xuICAgICAgJGxvZy5kZWJ1ZygndXBkIG9rJyk7ICAvLyBib2R5Li4uXG4gICAgfVxuICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgnY2ZzZXInLCBbXG4gICAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAgICdzcWxpdGVTZXJ2aWNlJyxcbiAgICAnbW9tZW50U2VydmljZScsXG4gICAgJ3p1bWVyb1NlcnZpY2UnLFxuICAgICd0b2FzdFNlcnZpY2UnLFxuICAgIGNmc2VyXG4gIF0pO1xuICBmdW5jdGlvbiBjZnNlcihpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgY2ZGYWN0b3J5ID0ge1xuICAgICAgb2JqQ29kRmFzOiB7XG4gICAgICAgIGNvZEZhc2Vjb2xkYTogbnVsbCxcbiAgICAgICAgYWxyZWFkeVNldDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBpbnNlcnRDb2RGYXM6IGluc2VydENvZEZhcyxcbiAgICAgIHVwZENvZEZhczogdXBkQ29kRmFzLFxuICAgICAgZ2V0Q29kRmFzOiBnZXRDb2RGYXNcbiAgICB9O1xuICAgIHJldHVybiBjZkZhY3Rvcnk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0Q29kRmFzKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZGluc3BlY2Npb25Db2RpZ29zRmFzZWNvbGRhXSAoW2lkaW5zcGVjY2lvbl0gLFtwbGFjYV0gICxbY29kRmFzZWNvbGRhXSAgLFtmZWNoYV0pICBWQUxVRVMoPyw/LD8sPykgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIGNmRmFjdG9yeS5vYmpDb2RGYXMuY29kRmFzZWNvbGRhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmFscmVhZHlTZXQgPSB0cnVlO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdjb2RpZ28gaW5ncmVzYWRvJyk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyNCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZENvZEZhcygpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkaW5zcGVjY2lvbkNvZGlnb3NGYXNlY29sZGFdICc7XG4gICAgICBxdWVyeSArPSAnU0VUIFtjb2RGYXNlY29sZGFdID0gPyAsICc7XG4gICAgICBxdWVyeSArPSAnW2ZlY2hhXSA9ID8gLCAnO1xuICAgICAgcXVlcnkgKz0gJ1tpZGFqdXN0ZXZdID0gTlVMTCAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFIGlkaW5zcGVjY2lvbj0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NvZGlnbyBhY3R1YWxpemFkbycpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMjQpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDb2RGYXMoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb25Db2RpZ29zRmFzZWNvbGRhIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2ludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5jb2RGYXNlY29sZGEgPSBhcnJheVswXS5jb2RGYXNlY29sZGE7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5hbHJlYWR5U2V0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjZkZhY3Rvcnkub2JqQ29kRmFzLmNvZEZhc2Vjb2xkYSA9IG51bGw7XG4gICAgICAgICAgY2ZGYWN0b3J5Lm9iakNvZEZhcy5hbHJlYWR5U2V0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0oKSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0FjY2Vzb3Jpb3NDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAncGxhY2FzU2VydmljZScsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICckbG9jYXRpb24nLFxuICAnJGlvbmljUG9wdXAnLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZm9jdXMnLFxuICAnJHN0YXRlJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ2FjY2Vzb3Jpb3NTZXJ2aWNlJyxcbiAgJ2ZvdG9zU2VydmljZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsIHp1bWVyb1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBwbGFjYXNTZXJ2aWNlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGxvY2F0aW9uLCAkaW9uaWNQb3B1cCwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZvY3VzLCAkc3RhdGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZVBhcmFtcywgJGlvbmljTW9kYWwsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIGNvcHlGaWxlU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvL1xuICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XG4gICAgICAkc2NvcGUub3NzID0gb25saW5lU3RhdHVzU2VydmljZS5kYXRhO1xuICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvb3Blbk5ld0FjY2Vzb3Jpby5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuYWNjZXMgPSBbXTtcbiAgICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjY2VzID0gYWNjZXNvcmlvc1NlcnZpY2UuYWxsO1xuICAgICAgfTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXRPcHRpb25zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgY29udHJvbGFkb3InKTtcbiAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0RGF0YTtcbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLmluaXRhY2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2MgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0QWNjKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNob3dNb2RhbE5ldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmluaXRhY2MoKTtcbiAgICAgICAgJHNjb3BlLm1vZHNob3cgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2Uuc2F2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDQpO1xuICAgICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0pOyAgLy8gJHNjb3BlLmFjY2VzLnB1c2goJHNjb3BlLmFjYyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGVJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcucGF0aCA9ICdodHRwOi8vaS5kYWlseW1haWwuY28udWsvaS9waXgvMjAxNC8wMy8yMy9hcnRpY2xlLTI1ODc0NTQtMUM4NjQ5OTEwMDAwMDU3OC00MzhfNjM0eDQzMC5qcGcnO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5tb2QgPSBmdW5jdGlvbiAoYWNjKSB7XG4gICAgICAgICRzY29wZS5tb2RzaG93ID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmFjYyA9IGFjYztcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VBY3RNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogQVFVSSBURU5EUklBIFFVRSBIQUNFUiBFTCBVUERBVEUgXG4gICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcub25VcGxvYWQgPSBvblVwbG9hZDtcbiAgICAgICAgdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUudHJ5VXBsb2FkID0gZnVuY3Rpb24gKGZvdG8pIHtcbiAgICAgICAgZm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQoZm90byk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IHRydWU7XG4gICAgICAgIGZvdG9zU2VydmljZS50YWtlZHBpYygpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgICAgICAgIHZhciBvblVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLm9uVXBsb2FkID0gb25VcGxvYWQ7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5wYXRoID0gcmVzLm5hdGl2ZVVSTDtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnJ1dGFTcnYgPSBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocmVzLm5hdGl2ZVVSTCk7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9uVXBsb2FkKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQoJHNjb3BlLmFjYy5pbWcpO1xuICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxmbkVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsIG9mZmxpbmVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIHRvYXN0U2VydmljZSwgdW5zeW5jU2VydmljZSwgJHN0YXRlLCBhdXRoU2VydmljZSkge1xuICAkc2NvcGUub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLmludGVybWVkaWF0ZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLnNldE9mZmxpbmVNb2RlID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAkc2NvcGUub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAvLyBpZiAoYm9vbCkge1xuICAgIC8vICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJ09mZmxpbmUgTW9kZScpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSh0aXRsZVNlcnZpY2UudGl0bGUpO1xuICAgIC8vIH1cbiAgICBpZiAoIWJvb2wgJiYgb25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd0xvbmdCb3R0b20oJ3NpbmNyb25pemFuZG8nKTtcbiAgICAgIHVuc3luY1NlcnZpY2Uuc3luY0ltYWdlcygpICAvLyAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgenVtZXJvU2VydmljZS56eW5jKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pOyAgLy8genVtZXJvU2VydmljZS56eW5jKDApO1xuO1xuICAgIH1cbiAgfTtcbiAgJHNjb3BlLmxvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICB9O1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1Rlc3RDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJ3NxbFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNQbGF0Zm9ybSwgc3FsU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgICAgJHNjb3BlLm9wZW5kYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgeCA9IHdpbmRvdy5zcWxpdGVQbHVnaW4ub3BlbkRhdGFiYXNlKHsgbmFtZTogJ3p1bWVyb3Rlc3RkYmZpbGUnIH0sIGZ1bmN0aW9uIChyZXN1bHRPYmosIGZ1bGxQYXRoUGFyYW0sIGRiT2JqZWN0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZGJPYmplY3QsICdkYm9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdE9iaiwgJ2Z1bHBhdGg6JywgZnVsbFBhdGhQYXJhbSk7ICAvL0ltcG9ydGFudCEgIElmIHlvdSBkb24ndCBjbG9zZSB0aGUgZGF0YWJhc2Ugb2JqZWN0LCBmdXR1cmUgY2FsbHMgdG8gb3BlbkRhdGFiYXNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dvbid0IGNhbGwgdGhlIHN1Y2Nlc3MgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRiT2JqZWN0LmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jbG9zZWRiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2VycmFuZG8nLCB4KTtcbiAgICAgICAgLy8gaWYgKCF4KSB7XG4gICAgICAgIHguY2xvc2UoKTtcbiAgICAgICAgLy8genVtZXJvIHNxbGl0ZSBmdW5jaW9uYSBhc2kgLmNsb3NlID0gZnVuY3Rpb24oc3VjY2VzcywgZXJyb3IpIHsgcGVybyBubyBzZSB1c2FuIGFsIGxsYW1hciBjb3JvZHZhLmV4ZVxuICAgICAgICBjb25zb2xlLmxvZyh4Lm9wZW5EQlMpOyAgLy8gfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZnVsbFBhdGhQYXJhbSA9ICcvZGF0YS9kYXRhL2NvbS5pb25pY2ZyYW1ld29yay5mb3Rvc3ZpZXczOTA3NDcvZGF0YWJhc2VzL3p1bWVyb3Rlc3RkYi5kYic7XG4gICAgICAgIHZhciBzZXJ2ZXIgPSAnaHR0cDovLzE5Mi4xNjguMS4xMzo4MDgwLyc7XG4gICAgICAgIHZhciBkYmZpbGUgPSAnenVtZXJvdGVzdGRiZmlsZSc7XG4gICAgICAgIHZhciBub3RpZnlTdWNjZXNzID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG5vdGlmeUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfTtcbiAgICAgICAgenVtZXJvLnN5bmMoZnVsbFBhdGhQYXJhbSwgJycsIHNlcnZlciwgZGJmaWxlLCBudWxsLCBudWxsLCBudWxsLCBub3RpZnlTdWNjZXNzLCBub3RpZnlFcnJvcik7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm8gPSB7XG4gICAgICAgIHM6IHRydWUsXG4gICAgICAgIGU6IHRydWUsXG4gICAgICAgIHU6IHRydWVcbiAgICAgIH07XG4gICAgICBzcWxTZXJ2aWNlLnN5bmMoKTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFtcbiAgJyRzY29wZScsXG4gICckbG9jYXRpb24nLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJHN0YXRlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnNyYyA9ICdpbWcvaWNvbi5wbmcnO1xuICAgICAgLy8gVE9ETzogdmVyaWZpY2FyIHNpIGVzdG8gc2UgcHVlZGUgaGFjZXIgZW4gZWwgcnVuLCBwZXJvIGNvbiBzdGF0ZS5nbyBhcHAucGxhY2FzXG4gICAgICB2YXIgX2FscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBwbGFjYXMnKTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGxhY2FzJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX2FscmVhZHkoKTtcbiAgICAgICRzY29wZS5sb2dnZWROb3cgPSBmYWxzZTtcbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHtcbiAgICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbigkc2NvcGUubG9naW5EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLm9uTG9nZ2VkKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAndmVyaWZpcXVlIHF1ZSBkaXNwb25nYSBkZSBjb25leGlvbiBhIGludGVybmV0LCBlIGludGVudGUgZGUgbnVldm8nO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm9uTG9nZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgIC8vICRzY29wZS5sb2dnZWQodHJ1ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UsJGxvY2F0aW9uKTtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hdXRoRXh0ZXJuYWxQcm92aWRlciA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgcmVkaXJlY3RVcmkgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgJy9hdXRoY29tcGxldGUuaHRtbCc7XG4gICAgICAgIHZhciBleHRlcm5hbFByb3ZpZGVyVXJsID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnYXBpL0FjY291bnQvRXh0ZXJuYWxMb2dpbj9wcm92aWRlcj0nICsgcHJvdmlkZXIgKyAnJnJlc3BvbnNlX3R5cGU9dG9rZW4mY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZCArICcmcmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdFVyaTtcbiAgICAgICAgd2luZG93LiR3aW5kb3dTY29wZSA9ICRzY29wZTtcbiAgICAgICAgdmFyIG9hdXRoV2luZG93ID0gd2luZG93Lm9wZW4oZXh0ZXJuYWxQcm92aWRlclVybCwgJ0F1dGhlbnRpY2F0ZSBBY2NvdW50JywgJ2xvY2F0aW9uPTAsc3RhdHVzPTAsd2lkdGg9NjAwLGhlaWdodD03NTAnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aENvbXBsZXRlZENCID0gZnVuY3Rpb24gKGZyYWdtZW50KSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChmcmFnbWVudC5oYXNsb2NhbGFjY291bnQgPT09ICdGYWxzZScpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogZnJhZ21lbnQuZXh0ZXJuYWxfdXNlcl9uYW1lLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Fzc29jaWF0ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL09idGFpbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZGlyZWN0IHRvIG9yZGVyc1xuICAgICAgICAgICAgdmFyIGV4dGVybmFsRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdXRoU2VydmljZS5vYnRhaW5BY2Nlc3NUb2tlbihleHRlcm5hbERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gIC8vICRzY29wZS5hbHJlYWR5TG9nZ2VkKCk7ICAgICAgICAgICAgICAgXG47XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdJbnNwZWNjaW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHRpdGxlU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRmaWx0ZXIsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIHNxbGl0ZVNlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmNhbGlmaWNhZG8pID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICRzY29wZS5yZXZFc3QgPSBwYXJzZUludCgkc3RhdGVQYXJhbXMucmV2ZXN0KTtcbiAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgIC8vcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkc2NvcGUudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgJHNjb3BlLmRhdGEgPSBpbnNwZWNjaW9uU2VydmljZS5kYXRhO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvb3BjaW9uTW9kYWwuaHRtbCcsIHsgc2NvcGU6ICRzY29wZSB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gICAgfSk7XG4gICAgLy8gVE9ETzogY29tbyBlc3RvIHNlIHNpbmNyb25pemEgdW5hIHNvbGEgdmV6LCBubyBoYXkgcHJvYmxlbWEgY29uIGVsIGlkaW5zcGVjY2lvbiwgZWwgcHJvYmxlbWEgZXN0YSBlbiBhY2Nlc29yaW9zIHkgZW4gZm90b3MsIHF1ZSBzZSBzdWJlIHVubyBhIHVubywgZW50b25jZXMgcG9kcmlhIGNhbWJpYXIsIG8gZW4gYWNjZXNvcmlvcyBoYWNlciB1biBiZWZvcmxlYXZlIGRlIHZpZXcsIG1pIHByZWd1bnRhIGVzICwgc2kgbm8gYWJhbmRvbmEgbGEgdmlldywgY29tbyBzaW5jcm9uaXpvPyBvdHJhIG1hcyBzaSBwYXNvIGEgYmFja2dyb3VuZCBwdWVkbyBzaW5jcm9uaXphcj8/P1xuICAgIC8vIFRPRE86IGVzdGEgdmFyaWFibGUgbWUgbGEgZGEgbGEgcGJhc2UgZGUgc2F0b3MsIHNpIHlhIGVzdGEgY2FsaWZpY2FkbyBvIG5vXG4gICAgJHNjb3BlLm9iaiA9IHsgY3VzdG9tc2VjdGlvbjogMCB9O1xuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgIH07XG4gICAgLy8gJHNjb3BlLnNob3coKTtcbiAgICAvLyAkdGltZW91dCgkc2NvcGUuaGlkZSwgMTUwMDApO1xuICAgICRzY29wZS5pdGVtcyA9IFtdO1xuICAgIC8vIGluaXRpYWwgaW1hZ2UgaW5kZXhcbiAgICAkc2NvcGUuX0luZGV4ID0gMDtcbiAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbiA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuc2VjdGlvbnMsIGkpO1xuICAgICAgJHNjb3BlLm9iai5jdXN0b21zZWN0aW9uID0gJHNjb3BlLnNlY3Rpb25zW2ldLmN1c3RvbXNlY3Rpb247XG4gICAgICAvLyAkc2NvcGUuc2V0TWluKCk7XG4gICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICB9O1xuICAgIC8vcmVmZW5jZSBzZXJ2aWNlXG4gICAgLy8gaWYgYSBjdXJyZW50IGltYWdlIGlzIHRoZSBzYW1lIGFzIHJlcXVlc3RlZCBpbWFnZVxuICAgICRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgcmV0dXJuICRzY29wZS5fSW5kZXggPT09IGluZGV4O1xuICAgIH07XG4gICAgLy8gc2hvdyBwcmV2IGltYWdlXG4gICAgJHNjb3BlLnNob3dQcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPiAwID8gLS0kc2NvcGUuX0luZGV4IDogJHNjb3BlLnNlY3Rpb25zLmxlbmd0aCAtIDE7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8vIHNob3cgbmV4dCBpbWFnZVxuICAgICRzY29wZS5zaG93TmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5fSW5kZXggPSAkc2NvcGUuX0luZGV4IDwgJHNjb3BlLnNlY3Rpb25zLmxlbmd0aCAtIDEgPyArKyRzY29wZS5fSW5kZXggOiAwO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAvKiBTaG93IGxpc3QgKi9cbiAgICAkc2NvcGUuc2hvd0l0ZW1zID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIC8vIFRPRE86IHBhcmEgZGVzaGFiaWxpdGFyIGVsIHVwZGF0ZSwgYXVucXVlIHlhIGVzdGEgbW9udGFkbywgbWUgcHJlb2N1cGEgZXMgZWwgenluYyBjYWRhIHF1ZSBzZSBoYWdhIHVuIHVwZGF0ZVxuICAgICAgaWYgKCRzY29wZS5hbHJlYWR5U2F2ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXRlbS5kaXJ0eSA9IHRydWU7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5pdGVtID0gaXRlbTtcbiAgICAgICRzY29wZS5pdGVtID0gaW5zcGVjY2lvblNlcnZpY2UuaXRlbTtcbiAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgfTtcbiAgICAvKiBIaWRlIGxpc3QgKi9cbiAgICAkc2NvcGUuaGlkZUl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICB9O1xuICAgICRzY29wZS52YWxpZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uIChvcGNpb24pIHtcbiAgICAgIC8vIFNldCBzZWxlY3RlZCB0ZXh0XG4gICAgICAkc2NvcGUuaXRlbS5zbC5sYWJlbCA9IG9wY2lvbi5sYWJlbDtcbiAgICAgIC8vIFNldCBzZWxlY3RlZCB2YWx1ZVxuICAgICAgJHNjb3BlLml0ZW0uc2wudmFsdWUgPSBvcGNpb24udmFsdWU7XG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZS51cGRhdGVTaW5nbGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2sgdXBkYXRlJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSGlkZSBpdGVtc1xuICAgICAgJHNjb3BlLmhpZGVJdGVtcygpOyAgLy8gRXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvblxuICAgIH07XG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnR3VhcmRhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5zYXZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuICAgIH0pO1xuICAgICRzY29wZS5jbG9zZU1vZGFsT25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lLmhpZGUoKTtcbiAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlLmNsZWFyVGlwbygpO1xuICAgICAgJHNjb3BlLmNsLmlkY2xhc2UgPSBudWxsO1xuICAgICAgJHNjb3BlLmNsLmlkY2Fycm9jZXJpYSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wudGlwbyA9IG51bGw7XG4gICAgfTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9tb2RhbEdldEl0ZW1zLmh0bWwnLCB7XG4gICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgYW5pbWF0aW9uOiAnc2xpZGUtaW4tdXAnXG4gICAgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZSA9IG1vZGFsO1xuICAgIH0pO1xuICAgICRzY29wZS5vcGVuTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuc2hvdygpO1xuICAgIH07XG4gICAgJHNjb3BlLmdldFRpcG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0VGlwb3MoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnRpcG9zID0gaW5zcGVjY2lvblNlcnZpY2UudGlwb3M7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRDb25qdW50b1BhbmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q29uanVudG9QYW5lbCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuY29uanVudG9QYW5lbCA9IGluc3BlY2Npb25TZXJ2aWNlLmNvbmp1bnRvUGFuZWw7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRDbGFzZXMgPSBmdW5jdGlvbiAoaWR0aXBvKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRDbGFzZXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNsYXNlcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNsYXNlcztcbiAgICAgICAgJHNjb3BlLmNhcnJvY2VyaWFzID0gaW5zcGVjY2lvblNlcnZpY2UuY2Fycm9jZXJpYXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRDYXJyb2NlcmlhcyA9IGZ1bmN0aW9uIChpZGNsYXNlKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRDYXJyb2NlcmlhcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuY2Fycm9jZXJpYXMgPSBpbnNwZWNjaW9uU2VydmljZS5jYXJyb2NlcmlhcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLnNldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLml0ZW1zID0gaW5zcGVjY2lvblNlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLnNlY3Rpb25zID0gaW5zcGVjY2lvblNlcnZpY2Uuc2VjdGlvbnM7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgICRzY29wZS5zZXRJZENsYUNhID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2Uuc2V0SWRDbGFDYSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0SWRDbGFDYSBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbE9uZSgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRBbHJlYWR5SW5zcGVjdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0QWxyZWFkeUluc3BlY3QgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuZ2V0VGlwb3MoKTtcbiAgICAgICRzY29wZS5nZXRDb25qdW50b1BhbmVsKCk7XG4gICAgICAkc2NvcGUuY2wgPSBpbnNwZWNjaW9uU2VydmljZS5jbDtcbiAgICAgIC8vIFRPRE86IGFxdWkgdmFsaWRvIHNpIHlhIHNlIGNhbGlmaWNvIG8gc2kgYXBlbmFzIHNlIHZhIGEgcmVhbGl6YXJcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlLmdldFJldkVzdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBvbiBpbml0XG4gICAgJHNjb3BlLmluaXQoKTtcbiAgfSk7XG59KTsiLCJhcHAuZmFjdG9yeSgnaW5zcGVjY2lvblNlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRxLCAkZmlsdGVyLCBlcnJvclNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgICB2YXIgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgaSA9IGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeTtcbiAgICBmID0gJGZpbHRlcjtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNlY3Rpb25zID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBraWxvbWV0cmFqZTogJycsXG4gICAgICBvYnNlcnZhY2lvbjogJycsXG4gICAgICByZXZFc3Q6IG51bGxcbiAgICB9O1xuICAgIHZhciBfc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocHJlSXRlbXMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IG9iai5jb250cm9sSnNvblswXS5pZCxcbiAgICAgICAgICBsYWJlbDogb2JqLmNvbnRyb2xKc29uWzBdLnRleHRcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICBvYmouc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IHByZUl0ZW1zO1xuICAgIH07XG4gICAgdmFyIF9zZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkZmlsdGVyKCd1bmlxdWUnKShpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCAnY3VzdG9tc2VjdGlvbicpLCAnY3VzdG9tc2VjdGlvbicpOyAgXG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2VjdGlvbnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJGZpbHRlcigndW5pcXVlJykoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCwgJ2N1c3RvbXNlY3Rpb24nKSwgJ09yZGVuJyk7XG4gICAgfTtcbiAgICB2YXIgX2dldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgX3NldEl0ZW1zKCk7XG4gICAgICBfc2VjdGlvbnMoKTtcbiAgICAgIC8vIFRPRE86IGxvZ2ljYSBwYXJhIHNhYmVyIHNpIHlhIGZ1ZSBjYWxpZmljYWRvXG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gZmFsc2U7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRzZXJ2aWNpbyxcbiAgICAgICAgb2JqLmlkaXRlbSxcbiAgICAgICAgb2JqLmlkUGFyZW50SXRlbSxcbiAgICAgICAgb2JqLm5vbWJyZSxcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLmxhYmVsLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2FcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxYXJyYXkgPSBbXTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRBbGxJdGVtcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRPYnNlcnZhY2lvbigpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRLaWxvbWV0cmFqZSgpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocWFycmF5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBzZXJ2aWNpbyBpbnNwZWNjaW9uJyk7XG4gICAgICAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKCdpbmdyZXNvIG9rJywgcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRBbGxJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRwcm9waWVkYWRlc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAsW2lkaXRlbV0sW2lkcGFyZW50aXRlbV0gICxbbm9tYnJlXSAsW2lkb3BjaW9uXSAgLFtzZWxlY2Npb25dLCBbcGxhY2FdICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LCA/KSc7XG4gICAgICB2YXIgYmluZGluZ3MgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgYmluZGluZ3MucHVzaChfcnRuQmluZGluZyhvYmopKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRPYnNlcnZhY2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbb2JzZXJ2YWNpb25lc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAgLFtvYnNlcnZhY2lvbl0sIFtwbGFjYV0pICAgVkFMVUVTICg/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gODI5LFxuICAgICAgICAvLyBfY2wudGlwbyxcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEucmV2RXN0LFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0S2lsb21ldHJhamUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2tpbG9tZXRyYWplc10gICAgICAgIChbaWRpbnNwZWNjaW9uXSwgW2tpbG9tZXRyYWplXSwgW3BsYWNhXSkgICAgICBWQUxVRVMgKD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmdVcGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLmxhYmVsLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NsID0ge1xuICAgICAgaWRjbGFzZTogbnVsbCxcbiAgICAgIGlkY2Fycm9jZXJpYTogbnVsbCxcbiAgICAgIHRpcG86IG51bGwsXG4gICAgICBjb25qdW50b1BhbmVsOiBudWxsXG4gICAgfTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2xhc2VzID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnRpcG9zID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNvbmp1bnRvUGFuZWwgPSBbXTtcbiAgICAvLyBUT0RPOiBwYXJhIGxhIGltcGxlbWVudGFjaW9uIGRlIHBlc2Fkb3MgeSBtb3RvcywgeWEgc2kgZGViZSBzZXIgdW5hIGNvbnN1bHRhXG4gICAgLyogICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnRpcG9zID0gW3tcbiAgICAgICAgdmFsdWU6IDgyOSxcbiAgICAgICAgbGFiZWw6ICdMaXZpYW5vcydcbiAgICAgIH0gIC8vICxcbiAgICAgICAgIC8vIHtcbiAgICAgICAgIC8vICAgdmFsdWU6IDg0NCxcbiAgICAgICAgIC8vICAgbGFiZWw6ICdQZXNhZG9zJ1xuICAgICAgICAgLy8gfVxuXTsqL1xuICAgIHZhciBfZ2V0VGlwb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkdGlwb3ZlaGljdWxvIGFzIHZhbHVlICwgbm9tYnJlIGFzIGxhYmVsIGZyb20gdGlwb3Mgd2hlcmUgZW5hYmxlZD0xJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnRpcG9zID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2dldENvbmp1bnRvUGFuZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgIElkVGlwbyBhcyB2YWx1ZSwgTm9tYnJlIGFzIGxhYmVsIEZST00gICAgQmFzZV9UaXBvcyAgV0hFUkUgICAgIChJZE1hZXN0cm9UaXBvcyA9IDczKSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jb25qdW50b1BhbmVsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2dldENsYXNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChfY2wudGlwbykgJiYgYW5ndWxhci5pc051bWJlcihwYXJzZUludChfY2wudGlwbykpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGRpc3RpbmN0IGNjLmlkY2xhc2UgYXMgdmFsdWUgICwgYnQuTm9tYnJlIGFzIGxhYmVsICBGUk9NIGNsYXNlc190aXBvVmVoaWN1bG8gY3QgIGlubmVyIGpvaW4gICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjbGFzZT1jdC5pZGNsYXNlICAgaW5uZXIgam9pbiBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz1jYy5pZGNsYXNlICB3aGVyZSBjdC5pZHRpcG92ZWhpY3Vsbz0/JztcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbcGFyc2VJbnQoX2NsLnRpcG8pXTtcbiAgICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBUT0RPOiBBU0kgTk8gU0lSVkUgLCBubyBzZSBhY3R1YWxpemEgZWwgZXhwdWVzdG8gLCxfY2xhc2VzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEucmV2RXN0ID0gX2NsLnRpcG87XG4gICAgICAgICAgX2NsLmlkY2xhc2UgPSBudWxsO1xuICAgICAgICAgIF9jbC5jb25qdW50b1BhbmVsID0gbnVsbDtcbiAgICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBbXTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX2dldENhcnJvY2VyaWFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKF9jbC5pZGNsYXNlKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KF9jbC5pZGNsYXNlKSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgZGlzdGluY3QgY2MuaWRjYXJyb2NlcmlhIGFzIHZhbHVlICwgYnQuTm9tYnJlIGFzIGxhYmVsICBGUk9NICAgIGNsYXNlc19jYXJyb2NlcmlhcyBjYyAgaW5uZXIgam9pbiBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz1jYy5pZGNhcnJvY2VyaWEgICB3aGVyZSBjYy5pZGNsYXNlPT8nO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtwYXJzZUludChfY2wuaWRjbGFzZSldO1xuICAgICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBfY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX3NldElkQ2xhQ2EgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhfY2wuY29uanVudG9QYW5lbCk7XG4gICAgICB2YXIgcXVlcnkgPSBudWxsO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIGlmIChfY2wuY29uanVudG9QYW5lbCA9PT0gbnVsbCkge1xuICAgICAgICBxdWVyeSA9ICdTRUxFQ1QgW2lkY2xhc2VjYXJyb2NlcmlhXSAsW2lkY2xhc2VdICxbaWRjYXJyb2NlcmlhXSAgLFtpZGNvZGlnb2NhbGlmaWNhY2lvbl0gICxbaWRleHRyYWluZm9dICAgRlJPTSBbY2xhc2VzX2NhcnJvY2VyaWFzXSBXSEVSRSBpZGNsYXNlPT8gYW5kIGlkY2Fycm9jZXJpYT0/ICc7XG4gICAgICAgIGJpbmRpbmcgPSBbXG4gICAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2xhc2UpLFxuICAgICAgICAgIHBhcnNlSW50KF9jbC5pZGNhcnJvY2VyaWEpXG4gICAgICAgIF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeSA9ICdTRUxFQ1QgW2lkY2xhc2VjYXJyb2NlcmlhXSAsW2lkY2xhc2VdICxbaWRjYXJyb2NlcmlhXSAgLFtpZGNvZGlnb2NhbGlmaWNhY2lvbl0gICxbaWRleHRyYWluZm9dICAgRlJPTSBbY2xhc2VzX2NhcnJvY2VyaWFzXSBXSEVSRSBpZGNsYXNlPT8gYW5kIGlkY2Fycm9jZXJpYT0/IGFuZCBpZGV4dHJhaW5mbz0/ICc7XG4gICAgICAgIGJpbmRpbmcgPSBbXG4gICAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2xhc2UpLFxuICAgICAgICAgIHBhcnNlSW50KF9jbC5pZGNhcnJvY2VyaWEpLFxuICAgICAgICAgIHBhcnNlSW50KF9jbC5jb25qdW50b1BhbmVsKVxuICAgICAgICBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmFyIGFyciA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXTtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhID0gYXJyLmlkY2xhc2VjYXJyb2NlcmlhO1xuICAgICAgICByZXR1cm4gX2dldFRvSW5zcGVjdChhcnIuaWRjb2RpZ29jYWxpZmljYWNpb24sIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0SnNvbiA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YWx1ZS5jb250cm9sSnNvbiA9IGFuZ3VsYXIuZnJvbUpzb24odmFsdWUuY29udHJvbEpzb24pO1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLmNvbnRyb2xKc29uWzBdLnZhbHVlLFxuICAgICAgICAgIGxhYmVsOiB2YWx1ZS5jb250cm9sSnNvblswXS5sYWJlbFxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJpbWVyJyk7XG4gICAgICAgIHZhbHVlLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBhcnJheTtcbiAgICB9O1xuICAgIHZhciBfc2V0QWxyZWFkeUluc3BlY3RKc29uID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAvLyB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpOyAgICAgXG4gICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHZhbHVlLmNvbnRyb2xKc29uID0gYW5ndWxhci5mcm9tSnNvbih2YWx1ZS5jb250cm9sSnNvbik7XG4gICAgICAgIC8vIFRPRE86IGVsIGpzb24gZGUgY29udHJvbEpzb24gZGV2dWVsdmUgdW4gdmFsdWU9IFwiXCIgc3RyaW5nLCB2ZXIgc2kgc2UgcHVlZGUgbWVqb3JhcjtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZS52YWx1ZS50b1N0cmluZygpLFxuICAgICAgICAgIGxhYmVsOiB2YWx1ZS5sYWJlbFxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJpbWVyJyk7XG4gICAgICAgIHZhbHVlLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBhcnJheTtcbiAgICAgIF9zZWN0aW9ucygpOyAgLy8gZGVmZXJyZWQucmVzb2x2ZSgpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfY2xlYXJPYnNLbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gJyc7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvbiA9ICcnO1xuICAgIH07XG4gICAgLy8gdmFyIF9jbGVhclRpcG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wuaWRjbGFzZSA9IHtcbiAgICAvLyAgICAgaWRjbGFzZTogbnVsbCxcbiAgICAvLyAgICAgaWRjYXJyb2NlcmlhOiBudWxsLFxuICAgIC8vICAgICB0aXBvOiBudWxsXG4gICAgLy8gICB9O1xuICAgIC8vIH07XG4gICAgdmFyIF9nZXRUb0luc3BlY3QgPSBmdW5jdGlvbiAoaWRjb2RpZ29jYWxpZmljYWNpb24sIGlkQ2xhc2VDYXJyb2NlcmlhKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICBhcyBpZHNlcnZpY2lvLCBjcGMuaWRpdGVtIGFzIGlkaXRlbSwgaWRQYXJlbnRJdGVtLCBvaWYubm9tYnJlIGFzIG5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uLCBidC5PcmRlbiBhcyBPcmRlbiAnO1xuICAgICAgLy9zaWVtcHJlIGRlamFyIHVuIGVzcGFjaW8gZW4gYmxhbmNvIFxuICAgICAgcXVlcnkgKz0gJ2Zyb20gIHZpZXdWMyBvaWYgICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjYWxpZmljYWNpb25waWV6YXNjb2RpZ28gY3BjIG9uICBjcGMuaWRpdGVtPSBvaWYuaWRpdGVtICBhbmQgb2lmLnRpcG89MSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY29udHJvbEVsZW1lbnRvcyBjZSBvbiBjZS5pZGNvbnRyb2wgPW9pZi5pZGNvbnRyb2wgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvID1vaWYuY3VzdG9tc2VjdGlvbiAnO1xuICAgICAgcXVlcnkgKz0gJ3doZXJlIG9pZi5pZHNlcnZpY2lvPT8gYW5kIGNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbj0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEucmV2RXN0LFxuICAgICAgICAvLyBfY2wudGlwbyxcbiAgICAgICAgLy84MjksXG4gICAgICAgIC8vcGFyc2VJbnQoX2NsLnRpcG8pLFxuICAgICAgICBpZGNvZGlnb2NhbGlmaWNhY2lvblxuICAgICAgXTtcbiAgICAgIGlmIChfY2wuY29uanVudG9QYW5lbCAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZygncGFyYSBsYSBjYXJyb2NlcmlhJyk7XG4gICAgICAgIHF1ZXJ5ICs9ICd1bmlvbiAnO1xuICAgICAgICBxdWVyeSArPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvIGFzIGlkc2VydmljaW8gLCBjcGMuaWRpdGVtIGFzIGlkaXRlbSwgaWRQYXJlbnRJdGVtLCAgb2lmLm5vbWJyZSAgYXMgbm9tYnJlICxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uLCBidC5PcmRlbiBhcyBPcmRlbiAgJztcbiAgICAgICAgcXVlcnkgKz0gJ2Zyb20gY2FsaWZpY2FjaW9uUGllemFzQ29kaWdvQ2Fycm9jZXJpYSBjcGMgICAgJztcbiAgICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gdmlld1YzIG9pZiBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG8gPW9pZi5jdXN0b21zZWN0aW9uICc7XG4gICAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICAgIHF1ZXJ5ICs9ICd3aGVyZSAgY3BjLmlkY2xhc2VjYXJyb2NlcmlhPT8nO1xuICAgICAgICBiaW5kaW5nLnB1c2goaWRDbGFzZUNhcnJvY2VyaWEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgX3NldEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAgIF9jbGVhck9ic0ttKCk7ICAvLyBfY2xlYXJUaXBvKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2VyT2JzS20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgIG8uaWRvYnNlcnZhY2lvbiwgICBvYnNlcnZhY2lvbiwga2lsb21ldHJhamUgRlJPTSAgIG9ic2VydmFjaW9uZXMgbyBpbm5lciBqb2luIGtpbG9tZXRyYWplcyBrIG9uIGsuaWRpbnNwZWNjaW9uPW8uaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIChvLmlkaW5zcGVjY2lvbiA9ID8pIEFORCAoaWRzdWJwcm9jZXNvID0gPykgT3JkZXIgYnkgby5pZG9ic2VydmFjaW9uIGRlc2MgbGltaXQgMSAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIC8vIDgyOVxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5yZXZFc3RcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgb2JzS20gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF07XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gb2JzS20ub2JzZXJ2YWNpb247XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gb2JzS20ua2lsb21ldHJhamU7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgb2lmLmlkUGFyZW50SXRlbSwgb2lmLm5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uICwgaWRwLmlkb3BjaW9uIGFzIHZhbHVlLCBpZHAuc2VsZWNjaW9uIGFzIGxhYmVsICwgYnQuT3JkZW4gYXMgT3JkZW4gJztcbiAgICAgIHF1ZXJ5ICs9ICdmcm9tICB2aWV3VmRvcyBvaWYgaW5uZXIgam9pbiBjYWxpZmljYWNpb25waWV6YXNjb2RpZ28gY3BjIG9uICBjcGMuaWRpdGVtPSBvaWYuaWRpdGVtICBhbmQgb2lmLnRpcG89MSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY29udHJvbEVsZW1lbnRvcyBjZSBvbiBjZS5pZGNvbnRyb2wgPW9pZi5pZGNvbnRyb2wgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjb2RpZ29jYWxpZmljYWNpb249Y3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZGluc3BlY2Npb24gaSBvbiBpLmlkQ2xhc2VDYXJyb2NlcmlhPWNjLmlkY2xhc2VjYXJyb2NlcmlhICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZHByb3BpZWRhZGVzIGlkcCBvbiBpZHAuaWRpbnNwZWNjaW9uPWkuaWRpbnNwZWNjaW9uIGFuZCBpZHAuaWRpdGVtID0gY3BjLmlkaXRlbSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG8gPW9pZi5jdXN0b21zZWN0aW9uICc7XG4gICAgICBxdWVyeSArPSAnd2hlcmUgIGkuaWRpbnNwZWNjaW9uID0/IGFuZCBvaWYuaWRzZXJ2aWNpbz0/ICAgICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgLy8gODI5XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLnJldkVzdFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgcmV0dXJuIF9zZXJPYnNLbSgpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRpbnNwZWNjaW9uXSAgIFNFVCBbaWRDbGFzZUNhcnJvY2VyaWFdID0/ICwgW3JldkVzdF09PyAgV0hFUkUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSxcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEucmV2RXN0LFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIF9pbnNlcnRTdGF0ZSg0NzcpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFN0YXRlID0gZnVuY3Rpb24gKGlkZXN0YWRvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkc3VicHJvY2Vzb3NlZ3VpbWllbnRvXSAoW2lkaW5zcGVjY2lvbl0gICAgLFtpZHN1YnByb2Nlc29dICAgLFtpZGVzdGFkb10gICAsW2ZlY2hhXSAsIFtwbGFjYV0gKSAgVkFMVUVTICAgICg/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICAvLyA4MjksXG4gICAgICAgIC8vIF9jbC50aXBvLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5yZXZFc3QsXG4gICAgICAgIGlkZXN0YWRvLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSB0cnVlO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7ICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wudGlwbyA9IG51bGw7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UmV2RXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGlkZXN0YWRvID0gNDc3O1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCBbaWRzdWJwcm9jZXNvXSAgICBGUk9NIFtpZHN1YnByb2Nlc29zZWd1aW1pZW50b113aGVyZSBpZGluc3BlY2Npb249PyBhbmQgaWRlc3RhZG89PyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGlkZXN0YWRvXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLnJldkVzdCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZHN1YnByb2Nlc287XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbCA9IF9jbDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2xhc2VzID0gX2dldENsYXNlcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2Fycm9jZXJpYXMgPSBfZ2V0Q2Fycm9jZXJpYXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNldElkQ2xhQ2EgPSBfc2V0SWRDbGFDYTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0QWxyZWFkeUluc3BlY3QgPSBfZ2V0QWxyZWFkeUluc3BlY3Q7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldFRpcG9zID0gX2dldFRpcG9zO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDb25qdW50b1BhbmVsID0gX2dldENvbmp1bnRvUGFuZWw7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldFJldkVzdCA9IF9nZXRSZXZFc3Q7XG4gICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsZWFyVGlwbyA9IF9jbGVhclRpcG87XG4gICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1BsYWNhc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdmaXJzdEluaXRTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gICckZmlsdGVyJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCB0aXRsZVNlcnZpY2UsICRpb25pY01vZGFsLCB0b2FzdFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRmaWx0ZXIsIGludGVybWVkaWF0ZVNlcnZpY2UsICR0aW1lb3V0KSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgLy8gcGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vIHBzID0gcGxhY2FzU2VydmljZTtcbiAgICAgIC8vIHBjID0gJHNjb3BlO1xuICAgICAgLy8gJHNjb3BlLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLnNlcnZpY2VzID0gW107XG4gICAgICAkc2NvcGUub2JqID0geyBmaWx0ZXI6ICcnIH07XG4gICAgICAkc2NvcGUuZGF0YSA9IHtcbiAgICAgICAgcGxhY2E6IG51bGwsXG4gICAgICAgIHNsOiBudWxsXG4gICAgICB9O1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAkc2NvcGUucGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZS5hbGwpO1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gJ1BsYWNhcyc7XG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NhcmdhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuZ2V0UGxhY2FzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlcnZpY2VzLmxlbmd0aCk7XG4gICAgICAgICAgaWYgKCRzY29wZS5zZXJ2aWNlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBwbGFjYXNTZXJ2aWNlLmdldFNydnMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLnNlcnZpY2VzID0gcGxhY2FzU2VydmljZS5zcnZzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZkluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpcnN0SW5pdFNlcnZpY2UuaW5pdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5oaWRlKCk7XG4gICAgICAgICAgJHNjb3BlLmdldFBsYWNhcygpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsZWFuRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmRhdGEucGxhY2EgPSBudWxsO1xuICAgICAgICAkc2NvcGUuZGF0YS5zbCA9IG51bGw7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnBsYWNhUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHBsYWNhc1NlcnZpY2UuZ2V0U3J2cygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAkc2NvcGUuc2VydmljZXMgPSBwbGFjYXNTZXJ2aWNlLnNydnM7XG4gICAgICAgIHZhciBteXByb21wdCA9ICRpb25pY1BvcHVwLnByb21wdCh7XG4gICAgICAgICAgdGl0bGU6ICdOdWV2YSBQbGFjYScsXG4gICAgICAgICAgLy8gdGVtcGxhdGU6ICdJbmdyZXNlIGxhIG51ZXZhIHBsYWNhJyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9pbnNlcnRQbGFjYS5odG1sJyxcbiAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgIG9uVGFwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbGVhbkRhdGEoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogJzxiPlNhdmU8L2I+JyxcbiAgICAgICAgICAgICAgdHlwZTogJ2J1dHRvbi1wb3NpdGl2ZScsXG4gICAgICAgICAgICAgIG9uVGFwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZGF0YS5wbGFjYSA9PT0gbnVsbCB8fCAkc2NvcGUuZGF0YS5zbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgLy9kb24ndCBhbGxvdyB0aGUgdXNlciB0byBjbG9zZSB1bmxlc3MgaGUgZW50ZXJzIHdpZmkgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5kYXRhLnBsYWNhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICAgIG15cHJvbXB0LnRoZW4oZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgICAgaWYgKHBsYWNhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAkc2NvcGUuYWRkUGxhY2EocGxhY2EpO1xuICAgICAgICAgIH0gIC8qIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgfSk7Ki9cbiAgICAgICAgfSk7ICAvLyBUT0RPOiBvcmdhbml6YXIgZWwgZm9jdXMgZW4gZWwgaW5wdXQgZGVsIHBvcHVwXG4gICAgICB9O1xuICAgICAgJHNjb3BlLmFkZFBsYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHBsYWNhKSkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3ZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZScpO1xuICAgICAgICAgIC8vIGFsZXJ0KFwidmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2EubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2xvbmdpdHVkIGRlIHBsYWNhIG11eSBjb3J0YScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLnBsYWNhcywgeyBwbGFjYTogcGxhY2EgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdwbGFjYSB5YSByZWdpc3RyYWRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnSW5ncmVzYW5kbyBudWV2YSBwbGFjYScpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlLmluc2VydFBMYWNhKHBsYWNhLCAkc2NvcGUuZGF0YS5zbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgICAgJHNjb3BlLmNsZWFuRGF0YSgpO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICRzY29wZS5zZXRGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJycpO1xuICAgICAgICBmb2N1cy5mb2N1cygnc2VhcmNoUHJpbWFyeScpOyAgLy9ubyBlcyBuZWNlc2FyaW8gYWJyaXIgZWwga2V5Ym9hcmQgc2UgYWJyZSBzb2xvIGN1YW5kbyBhc2lnbmFtb3MgZWwgZm9jdXMgLy8gY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubm9Gb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgJHNjb3BlLm9iai5maWx0ZXIgPSAnJztcbiAgICAgIH07XG4gICAgICAkc2NvcGUuc2V0SW50RGF0YSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgLy8gVE9ETzogc2kgbGFzIHBsYWNhcyBzb24gaWd1YWxlcywgcHVlZGUgc2VyIHF1ZSBzZSBoYXlhIHNpbmNyb25pemFkbyB5IG5vIHNlIGhheWEgYWN5YXVsaXphZG8gbGEgbGlzdGEgZGUgcGxhY2FzLCBlbnRvbmNlcyBzZSBwYXNhcmlhIHVuIGlkaW5zcGVjY2lvbiBxdWUgbm8gLGVzIGVzdG8gY3VhbmRvIG9mZmxpbmUgY3JlbyB1bmEgcGxhY2EsIG1lIHBvbmdvIG9ubGluZSB5IGx1ZWdvIG9uIHBhdXNlIGhhZ28gZWwgc3luYywgYXVucXVlIGhheXEgdWUgcGVuc2FyIHF1ZSBjdWFuZG8gbGUgcG9uZ28gb25saW5lLCBkZWJlcmlhIHNpbmNyb25pemFyIHNpIGhheSBzZcOxYWwgNGcgbyB3aWZpIHBhcmEgaW1hZ2VuZXMgbyBwYXJhIHRvZG9cbiAgICAgICAgaWYgKG9iai5wbGFjYSAhPT0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gb2JqLnBsYWNhO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gb2JqLnN5bmMgPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IG9iai5pZGluc3BlY2Npb247XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29Gb3RvcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZm90bycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7ICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9mb3Rvcy8nICsgb2JqLmlkaW5zcGVjY2lvbik7ICAvLyBUT0RPOiBjYW1iaWFyIHBvciBzdGF0ZS5nbyBtYXMgcGFyYW1ldHJvcywgdmVyIGJlc3QgcHJhY3RpY2VzXG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvVmlkZW8gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3ZpZGVvLycgKyBvYmouaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAudmlkZW8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0luc3BlY2Npb24gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgIC8vIFRPRE86IGFxdWkgcG9kcmlhIGV2YWx1YXIgc2kgeWEgc2UgY2FsaWZpY28gbyBubywgc2kgbm8gc2UgaGEgY2FsaWZpY2FkbyBwb2RyaWEgZGVzcGxlZ2FyIGVsIG1vZGFsIGRlIGNsYXNlIGNhcnJvY2VyaWFcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuaW5zcGVjY2lvbicsIHtcbiAgICAgICAgICBpZDogb2JqLmlkaW5zcGVjY2lvbixcbiAgICAgICAgICBwbGFjYTogb2JqLnBsYWNhLFxuICAgICAgICAgIGNhbGlmaWNhZG86IG9iai5jYWxpZmljYWRvLFxuICAgICAgICAgIHJldmVzdDogb2JqLnJldkVzdFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29BY2Nlc29yaW9zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hY2Nlc29yaW9zJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29Db2RGYXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmNvZEZhcycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNyZWF0ZUV4Y2VwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchJyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm9uSW5pdFNydiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCRzY29wZS5zZXJ2aWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgJHNjb3BlLnNlcnZpY2VzLmxlbmd0aCA8IDIgPyAkc2NvcGUuZGF0YS5zbCA9ICRzY29wZS5zZXJ2aWNlc1swXS52YWx1ZSA6ICRzY29wZS5kYXRhLnNsID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5zZXRPcGNpb25lcyA9IGZ1bmN0aW9uIChyZXZFc3QpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmV2RXN0KTtcbiAgICAgICAgaWYgKCFyZXZFc3QpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgICAgLy8gVE9ETzogc2VyaWEgYnVlbm8gcXVlIGxhIGNvbnN1bHRhIGRlIHBsYWNhcyBzdXBpZXJhIHRvZG8sIGNvbW8gcG9yIGVqZW1wbG8gc2kgeWEgc2UgY2FsaWZpY28sIHNpIHlhIHRpZW5lIGFsZ3VuYSBmb3RvIG8gdW4gdmlkZW8sIHB1ZWRlIHNlciBtYXJjYW5kb2xvIGNvbiBhbGd1bmEgY2xhc2VcbiAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5kYXRhKSB7XG4gICAgICAgICRzY29wZS5zaG93KCk7XG4gICAgICAgIC8vIFRPRE86IHB1ZWRvIHBvZGVyIG9iaj1udWxsLCBwYXJhIHF1ZSBtZSBlbGltaW5lIGxhIGJhc2UgZGUgZGF0b3Mgc2kgeWEgZXN0YSBjcmVhZGEgeSB2dWVsdmEgYSBzaW5jcm9uaXphciwgZXN0byBzZXJpYSBiZW5lZmljaW9zbyBzaSB0ZW5nbyBxdWUgaGFjZXIgdW4gY2FtYmlvIGVuIGxhIGJhc2UgZGUgZGRhdG9zIHF1ZSByZXF1aWVyYSByZWNvbnN0cnVpcmxhXG4gICAgICAgICR0aW1lb3V0KCRzY29wZS5mSW5pdCwgMzAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3BsYWNhc1NlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRyb290U2NvcGUnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdhdXRoU2VydmljZScsXG4gICdkZXZpY2VTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd1cGRhdGVTeW5jU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcm9vdFNjb3BlLCBtb21lbnRTZXJ2aWNlLCBhdXRoU2VydmljZSwgZGV2aWNlU2VydmljZSwgenVtZXJvU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdXBkYXRlU3luY1NlcnZpY2UpIHtcbiAgICB2YXIgcGxhY2FzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwgPSBbXTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5zcnZzID0gW107XG4gICAgdmFyIF9zZWxlY3RBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGVzdCA9IFt7XG4gICAgICAgICAgaWRpbnNwZWNjaW9uOiAxLFxuICAgICAgICAgIHBsYWNhOiAnYWJjMTExJ1xuICAgICAgICB9XTtcbiAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbC5wdXNoKHRlc3QpOyAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGxhY2FzID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaS5pZGluc3BlY2Npb24sIHBsYWNhLCBpLnN5bmMsIGJ0Lk5vbWJyZSBhcyBzZXJ2aWNpbywgcm8uaWRzdWIgYXMgcmV2RXN0LCAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgY2FzZSB3aGVuIGlzcy5pZGluc3BlY2Npb24gaXMgbnVsbCB0aGVuIDAgZWxzZSAxIGVuZCBhcyBjYWxpZmljYWRvICwgaXNzLmlkc3VicHJvY2VzbyBhcyBpZHN1YnByb2Nlc28gJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgICAgZnJvbSBpZGluc3BlY2Npb24gaSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luICBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz0gaS5hcHBpZHNydiAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luICBSb19TZXJ2aWNpb3Mgcm8gb24gcm8uaWRTcnY9IGkuYXBwaWRzcnYgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgIGxlZnQgam9pbiAoc2VsZWN0IGlkaW5zcGVjY2lvbiwgaWRzdWJwcm9jZXNvIGZyb20gIGlkc3VicHJvY2Vzb3NlZ3VpbWllbnRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgICAgICAgICAgd2hlcmUgaWRlc3RhZG89NDc3KSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgIGlzcyBvbiBpc3MuaWRpbnNwZWNjaW9uPWkuaWRpbnNwZWNjaW9uJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICBXSEVSRSBVc2VyTmFtZT0/IGFuZCBmZWNoYT4gPyc7XG4gICAgICBxdWVyeSArPSAnIE9yZGVyIGJ5IGkuaWRpbnNwZWNjaW9uIERFU0MgTGltaXQgMTAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwpO1xuICAgICAgICBfaW5zZXJ0RGV2aWNlKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB2YXIgX3VwZGF0ZVN5bmMgPSBmdW5jdGlvbiAocGxhY2EsIHN5bmMpIHtcbiAgICAvLyAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRpbnNwZWNjaW9uIHNldCBzeW5jPT8gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8nO1xuICAgIC8vICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAvLyAgIHZhciBiaW5kaW5nID0gW1xuICAgIC8vICAgICBzeW5jLFxuICAgIC8vICAgICBwbGFjYSxcbiAgICAvLyAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgLy8gICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICAvLyAgIF07XG4gICAgLy8gICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAvLyB9O1xuICAgIHZhciBfaW5zZXJ0UExhY2EgPSBmdW5jdGlvbiAocGxhY2EsIHNydikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkaW5zcGVjY2lvbihwbGFjYSwgZmVjaGEsVXNlck5hbWUsdXVpZCwgc3luYywgYXBwaWRzcnYpIFZBTFVFUyAoPyw/LD8sPywgPywgPyknO1xuICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgLy8gMCBtZWFucyBmYWxzZVxuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBsYWNhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgc3luYyxcbiAgICAgICAgc3J2XG4gICAgICBdO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gcGxhY2E7XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRQbGFjYXMoKTsgIC8vIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh7XG4gICAgICAgIC8vICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAvLyAgIGlkaW5zcGVjY2lvbjogcmVzLmluc2VydElkXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gcmVzLmluc2VydElkO1xuICAgICAgICAvKiByZXR1cm4genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3Igb24genVtZXJvIHN5bmMgZGVzZGUgcHMnKTtcbiAgICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgICB9KTsqL1xuICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBPUiBJR05PUkUgSU5UTyBbZGV2aWNlc10oW3V1aWRdLFttb2RlbF0pICBWQUxVRVMoPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS5tb2RlbFxuICAgICAgXTtcbiAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFNydnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUIFtJZFRpcG9dIGFzIHZhbHVlICxbTm9tYnJlXSBhcyBsYWJlbCwgcnMuaWRzdWIgYXMgcmV2RXN0IEZST00gQmFzZV9UaXBvcyBidCAgaW5uZXIgam9pbiByb19zZXJ2aWNpb3MgcnMgb24gcnMuaWRTcnY9YnQuSWRUaXBvICAgd2hlcmUgcnMuZW5hYmxlZD0xICAgb3JkZXIgYnkgbGFiZWwnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5zcnZzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcGxhY2FzU2VydmljZUZhY3Rvcnkuc2VsZWN0QWxsID0gX3NlbGVjdEFsbDtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5nZXRQbGFjYXMgPSBfZ2V0UGxhY2FzO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydFBMYWNhID0gX2luc2VydFBMYWNhO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmdldFNydnMgPSBfZ2V0U3J2cztcbiAgICAvLyBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5pbnNlcnREZXZpY2UgPSBfaW5zZXJ0RGV2aWNlO1xuICAgIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2FjY2Vzb3Jpb3NTZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcScsXG4gICckZmlsdGVyJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRxLCAkZmlsdGVyLCBlcnJvclNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgICB2YXIgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uID0gMDtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSA9IHt9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YSA9IHt9O1xuICAgIHZhciBfZ2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGFjY2Vzb3Jpb3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0IGl0ZW1zIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9ub21icmVzID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAndGV4dGEnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ3RleHRiJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfZXN0YWRvcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ2VzdGFkb2EnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ2VzdGFkb2InLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9jYW50aWRhZGVzID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnMScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnMicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX3NldE5vbWJyZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjEnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbik7XG4gICAgICAgIC8vIHZhciBqc29uID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmd1bGFyLmZyb21Kc29uKGpzb24pKTtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLm5vbWJyZXMgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7ICAvL2FuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRFc3RhZG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIwJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuZXN0YWRvcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRDYW50aWRhZGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIyJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuY2FudGlkYWRlcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbml0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRPRE86ICB1bmEgYmFuZGVyYSBwYXJhIHNhYmVyIHF1ZSB5YSBzZSBzZXRpbywgdW5hIHZleiwgeSBldml0YXIgbWFzIGNvbnN1bGF0cywgYSBtZW5vcyBxdWUgc2UgaGFnYSB1bmEgYWN0dWFsaXphY2lvbiBkZWwgc2Vydmlkb3JcbiAgICAgIHZhciBxYXJyYXkgPSBbXTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXROb21icmVzKCkpO1xuICAgICAgcWFycmF5LnB1c2goX3NldENhbnRpZGFkZXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfc2V0RXN0YWRvcygpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocWFycmF5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luaXRBY2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUT0RPOiBzZXJpYSBidWVubyBpbmljaWFyIGVzdG9zIGRkbCBzaW4gdmFsb3JlcywgIHBlcm8gdGVuZHJpYSBxdWUgdmFsaWRhciBxdWUgc2kgc2Ugc2VsZWNjaW9uZSBhbGdvO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0gPSB7XG4gICAgICAgIG5vbWJyZTogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLm5vbWJyZXNbMF0sXG4gICAgICAgIGVzdGFkbzogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmVzdGFkb3NbMF0sXG4gICAgICAgIGNhbnRpZGFkOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuY2FudGlkYWRlc1swXSxcbiAgICAgICAgdmFsb3I6IDAsXG4gICAgICAgIG1hcmNhOiAnJyxcbiAgICAgICAgcmVmZXJlbmNpYTogJycsXG4gICAgICAgIGltZzoge1xuICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgIHN5bmM6IGZhbHNlLFxuICAgICAgICAgIG9uVXBsb2FkOiBmYWxzZSxcbiAgICAgICAgICBpZGluc3BlY2Npb246IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb25cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG9iai5ub21icmUubGFiZWwsXG4gICAgICAgIG9iai5lc3RhZG8ubGFiZWwsXG4gICAgICAgIHBhcnNlSW50KG9iai5jYW50aWRhZC52YWx1ZSksXG4gICAgICAgIG9iai5tYXJjYSxcbiAgICAgICAgb2JqLnJlZmVyZW5jaWEsXG4gICAgICAgIG9iai52YWxvcixcbiAgICAgICAgb2JqLmltZy5wYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3NhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkYWNjZXNvcmlvc10gKFtpZGluc3BlY2Npb25dICxbcGxhY2FdICxbbm9tYnJlXSAsW2VzdGFkb10gLFtjYW50aWRhZF0gLFttYXJjYV0gLFtyZWZlcmVuY2lhXSxbdmFsb3JdLFtpbWdTcmNdKSBWQUxVRVMgICg/LD8sPyw/LD8sPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBfcnRuQmluZGluZyhhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gX2dldEl0ZW1zKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZ1VwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wudGV4dCxcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkaXRlbVxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVTaW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZHByb3BpZWRhZGVzXSBzZXQgW2lkb3BjaW9uXT0/ICwgW3NlbGVjY2lvbl09ID8gV0hFUkUgW2lkaW5zcGVjY2lvbl09PyBhbmQgW2lkaXRlbV09PyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBfcnRuQmluZGluZ1VwZGF0ZShhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHNpbmdsZScsIHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmdldEl0ZW1zID0gX2dldEl0ZW1zO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS51cGRhdGVTaW5nbGUgPSBfdXBkYXRlU2luZ2xlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5zYXZlID0gX3NhdmU7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXRPcHRpb25zID0gX2luaXRPcHRpb25zO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0QWNjID0gX2luaXRBY2M7XG4gICAgcmV0dXJuIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvclNlcnZpY2UnLCBbXG4gICckcScsXG4gICckbG9jYXRpb24nLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICckaW5qZWN0b3InLFxuICAnbW9tZW50U2VydmljZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24sIGxvY2FsU3RvcmFnZVNlcnZpY2UsICRpbmplY3RvciwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSkge1xuICAgIHZhciBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfcmVxdWVzdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgYXV0aERhdGEudG9rZW47XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH07XG4gICAgLy8gb3B0aW9uYWwgbWV0aG9kXG4gICAgdmFyIF9yZXF1ZXN0RXJyb3IgPSBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAvLyBkbyBzb21ldGhpbmcgb24gZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nKCdyZWplY3QgcmVxdWVzdCcsIHJlamVjdGlvbik7XG4gICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgfTtcbiAgICB2YXIgX3Jlc3BvbnNlRXJyb3IgPSBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAvLyB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgLy8gdmFyIHF1ZXJ5ID0gJ0lOU0VSVCAgSU5UTyBbbG9nc10oW2V4XSxbZW1haWxdLFtmZWNoYV0pICBWQUxVRVMoPyw/LD8pJztcbiAgICAgIC8vIHZhciBiaW5kaW5nID0gW1xuICAgICAgLy8gICBhbmd1bGFyLnRvSnNvbihyZWplY3Rpb24pLFxuICAgICAgLy8gICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSB8fCAnJyxcbiAgICAgIC8vICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAvLyBdO1xuICAgICAgLy8gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgLy8gICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAvLyB9KTtcbiAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICAgIGlmIChhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3JlZnJlc2gnKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSAwKSB7XG4gICAgICAgIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7ICAvLyBhdXRoU2VydmljZS50b2dnbGVTZXJ2ZXIoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICB9O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlcXVlc3QgPSBfcmVxdWVzdDtcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeS5yZXNwb25zZUVycm9yID0gX3Jlc3BvbnNlRXJyb3I7XG4gICAgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkucmVxdWVzdEVycm9yID0gX3JlcXVlc3RFcnJvcjtcbiAgICByZXR1cm4gYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdhdXRoU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgJyRxJyxcbiAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnbW9tZW50U2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGh0dHAsICRxLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgbW9tZW50U2VydmljZSwgdG9hc3RTZXJ2aWNlKSB7XG4gICAgdmFyIHNlcnZpY2VCYXNlID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmk7XG4gICAgdmFyIGF1dGhTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfYXV0aGVudGljYXRpb24gPSB7XG4gICAgICBpc0F1dGg6IGZhbHNlLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICBsYXN0TG9naW5nOiAnJ1xuICAgIH07XG4gICAgdmFyIF9leHRlcm5hbEF1dGhEYXRhID0ge1xuICAgICAgcHJvdmlkZXI6ICcnLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogJydcbiAgICB9O1xuICAgIHZhciBfc2F2ZVJlZ2lzdHJhdGlvbiA9IGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcbiAgICAgIF9sb2dPdXQoKTtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJy9hdXRoL2FwaS9hY2NvdW50L3JlZ2lzdGVyJywgcmVnaXN0cmF0aW9uKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfbG9naW4gPSBmdW5jdGlvbiAobG9naW5EYXRhKSB7XG4gICAgICB2YXIgZGF0YSA9ICdncmFudF90eXBlPXBhc3N3b3JkJnVzZXJuYW1lPScgKyBsb2dpbkRhdGEudXNlck5hbWUgKyAnJnBhc3N3b3JkPScgKyBsb2dpbkRhdGEucGFzc3dvcmQgKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAvL3NpZW1wcmUgdm95IGEgbWFuZGFyIGVsIGNsaWVudGlkXG4gICAgICAvKmlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgICBkYXRhID0gZGF0YSArIFwiJmNsaWVudF9pZD1cIiArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xuICAgICAgIH0qL1xuICAgICAgLy90ZW5nbyBxdWUgcmV2aXNhciBsb3MgY3Jvc3Mgb3JpZ2luLCBlbiBsYSBiYXNlIGRlIGRhdG9zICwgeSBoYWJpbGl0YXJsbyBlbiBlbCBuYXZlZ2Fkb3IgY2hyb21lICwgaW1wb3J0YW50ZVxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBkID0gbW9tZW50KCk7XG4gICAgICAkaHR0cC5wb3N0KG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJy9hdXRoL3Rva2VuJywgZGF0YSwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9IH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJykpXG4gICAgICAgIHJwID0gcmVzcG9uc2U7XG4gICAgICAgIGlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICB1c2VyTmFtZTogbG9naW5EYXRhLnVzZXJOYW1lLFxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZS5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3RMb2dpbjogZCAgLy8gLFxuICAgICAgICAgICAgICAgLy8gZXhwOm1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4sXG4gICAgICAgICAgICBleHA6IG1vbWVudFNlcnZpY2UuYWRkU2Vjb25kcyhyZXNwb25zZS5leHBpcmVzX2luKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICB1c2VyTmFtZTogbG9naW5EYXRhLnVzZXJOYW1lLFxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdExvZ2luOiBkICAvLyAsXG4gICAgICAgICAgICAgICAvLyBleHA6bW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuLFxuICAgICAgICAgICAgZXhwOiBtb21lbnRTZXJ2aWNlLmFkZFNlY29uZHMocmVzcG9uc2UuZXhwaXJlc19pbilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmxhc3RMb2dpbmcgPSBtb21lbnQoKTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gbG9naW5EYXRhLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIsIHN0YXR1cywgJ2Vycm9yIGNhbGxpbiBsb2dnaW5nJyk7XG4gICAgICAgIC8vVE9ETzogU1RBVFVTIDAgTUVBTlMgVU5SRUFDSEFCTEUgVVJMXG4gICAgICAgIC8qaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgIHZhciBzZXJ2ZXIgPSBhdXRoU2VydmljZUZhY3RvcnkudG9nZ2xlU2VydmVyKCk7XG4gICAgICAgIH0qL1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfbG9nT3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gZmFsc2U7XG4gICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSAnJztcbiAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgfTtcbiAgICB2YXIgX2ZpbGxBdXRoRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSBhdXRoRGF0YS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9yZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgaWYgKGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9ICdncmFudF90eXBlPXJlZnJlc2hfdG9rZW4mcmVmcmVzaF90b2tlbj0nICsgYXV0aERhdGEucmVmcmVzaFRva2VuICsgJyZjbGllbnRfaWQ9JyArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICAgICRodHRwLnBvc3QobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnL2F1dGgvdG9rZW4nLCBkYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX29idGFpbkFjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKGV4dGVybmFsRGF0YSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICcvYXV0aC9hcGkvYWNjb3VudC9PYnRhaW5Mb2NhbEFjY2Vzc1Rva2VuJywge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBwcm92aWRlcjogZXh0ZXJuYWxEYXRhLnByb3ZpZGVyLFxuICAgICAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46IGV4dGVybmFsRGF0YS5leHRlcm5hbEFjY2Vzc1Rva2VuXG4gICAgICAgIH1cbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gcmVzcG9uc2UudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9yZWdpc3RlckV4dGVybmFsID0gZnVuY3Rpb24gKHJlZ2lzdGVyRXh0ZXJuYWxEYXRhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAucG9zdChuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICcvYXV0aC9hcGkvYWNjb3VudC9yZWdpc3RlcmV4dGVybmFsJywgcmVnaXN0ZXJFeHRlcm5hbERhdGEpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gcmVzcG9uc2UudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF90b2dnbGVTZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgPT09ICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC8nKSB7XG4gICAgICAgIG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpID0gJ2h0dHA6Ly8yMDEuMjMyLjEwNC4xOTYvYXV0aC8nO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdDYW1iaWFuZG8gYSBzZXJ2aWRvciAxOTYnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLyc7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ0NhbWJpYW5kbyBhIHNlcnZpZG9yIDEzOCcpO1xuICAgICAgfVxuICAgICAgYXV0aFNlcnZpY2VGYWN0b3J5LmdldFNlcnZlcigpO1xuICAgIH07XG4gICAgdmFyIF9nZXRTZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgPT09ICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC8nKSB7XG4gICAgICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5zZXJ2ZXIgPSAnMTM4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5zZXJ2ZXIgPSAnMTk2JztcbiAgICAgIH1cbiAgICB9O1xuICAgIF9nZXRTZXJ2ZXIobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkpO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5zYXZlUmVnaXN0cmF0aW9uID0gX3NhdmVSZWdpc3RyYXRpb247XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmxvZ2luID0gX2xvZ2luO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5sb2dPdXQgPSBfbG9nT3V0O1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5maWxsQXV0aERhdGEgPSBfZmlsbEF1dGhEYXRhO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5hdXRoZW50aWNhdGlvbiA9IF9hdXRoZW50aWNhdGlvbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVmcmVzaFRva2VuID0gX3JlZnJlc2hUb2tlbjtcbiAgICBhdXRoU2VydmljZUZhY3Rvcnkub2J0YWluQWNjZXNzVG9rZW4gPSBfb2J0YWluQWNjZXNzVG9rZW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmV4dGVybmFsQXV0aERhdGEgPSBfZXh0ZXJuYWxBdXRoRGF0YTtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVnaXN0ZXJFeHRlcm5hbCA9IF9yZWdpc3RlckV4dGVybmFsO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS50b2dnbGVTZXJ2ZXIgPSBfdG9nZ2xlU2VydmVyO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2ZXIgPSBfZ2V0U2VydmVyO1xuICAgIHJldHVybiBhdXRoU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjaGVja0ZpbGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEpIHtcbiAgICB2YXIgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgICAgRmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZSA9IGZpbGU7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX2NoZWNrRmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgLy8gdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNoZWNrRmlsZShwYXRoLCBGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIHJldHVybiBfZmlsZURldGFpbChGaWxlRW50cnkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5jaGVja0ZpbGUgPSBfY2hlY2tGaWxlO1xuICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVEZXRhaWwgPSBfZmlsZURldGFpbDtcbiAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjb3B5RmlsZVNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNvcHlGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICAvLyB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgLy8gICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIC8vICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICBGaWxlRW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgIC8vICAgICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGUgPSBmaWxlO1xuICAgIC8vICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIC8vIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gRmlsZU5hbWU7XG4gICAgICAvLyAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUocGF0aCwgRmlsZU5hbWUsIGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBuZXdGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIC8vIHJldHVybiBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeT1GaWxlRW50cnk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVEZXRhaWwoRmlsZUVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICByZXR1cm4gY29weUZpbGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NvcmRvdmFFdmVudHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9vblJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZXN1bWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgYXBwbGljYXRpb24gaXMgcmVzdW1pbmcgZnJvbSB0aGUgYmFja2dyb3VuZCcpO1xuICAgICAgfSwgMCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuICB2YXIgX29uUGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9jYWxsWnluYygpO1xuICAgICAgICBjb25zb2xlLmxvZygnVGhlIGFwcGxpY2F0aW9uIGlzIHBhdXNpbmcgdG8gdGhlIGJhY2tncm91bmQnKTtcbiAgICAgIH0sIDApO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcbiAgdmFyIF9jYWxsWnluYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBldmFsdWFyIHRvZGFzIGxhcyBwb3NpYmlsaWRhZGVzIGRlIGVzdG8gYWNhLCBwb3IgcXVlIHNpIGxhIHNlw7FhbCBlcyBtdXkgbWFsYSBxdWUgcHVlZGUgcGFzYXIsIGF1bnF1ZSBlbCB6eW5jIGRlIGJhc2VzIGRlIGRhdG9zIG51bmNhIGhhc2lkbyBtdXkgZ3JhbmRlIGVuIGluZm9ybWFjaW9uXG4gICAgaWYgKG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSAmJiAhaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljICYmICFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQpIHtcbiAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKTtcbiAgICB9XG4gIH07XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblBhdXNlID0gX29uUGF1c2U7XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblJlc3VtZSA9IF9vblJlc3VtZTtcbiAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5LmNhbGxaeW5jID0gX2NhbGxaeW5jO1xuICByZXR1cm4gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2NyZWF0ZURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9jcmVhdGVEaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNyZWF0ZURpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgZGlyKS50aGVuKGZ1bmN0aW9uIChzdWNjZXMpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2NlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY3JlYXRlRGlyU2VydmljZUZhY3RvcnkuY3JlYXRlRGlyID0gX2NyZWF0ZURpcjtcbiAgICByZXR1cm4gY3JlYXRlRGlyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gKCRjb3Jkb3ZhRGV2aWNlKSB7XG4gIHZhciBkZXZpY2VTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3NldEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgZGV2aWNlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGRldmljZTogJGNvcmRvdmFEZXZpY2UuZ2V0RGV2aWNlKCksXG4gICAgICBjb3Jkb3ZhOiAkY29yZG92YURldmljZS5nZXRDb3Jkb3ZhKCksXG4gICAgICBtb2RlbDogJGNvcmRvdmFEZXZpY2UuZ2V0TW9kZWwoKSxcbiAgICAgIHBsYXRmb3JtOiAkY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpLFxuICAgICAgdXVpZDogJGNvcmRvdmFEZXZpY2UuZ2V0VVVJRCgpLFxuICAgICAgdmVyc2lvbjogJGNvcmRvdmFEZXZpY2UuZ2V0VmVyc2lvbigpXG4gICAgfTtcbiAgfTtcbiAgZGV2aWNlU2VydmljZUZhY3Rvcnkuc2V0SW5mbyA9IF9zZXRJbmZvO1xuICByZXR1cm4gZGV2aWNlU2VydmljZUZhY3Rvcnk7XG59KTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ2RsdEZpbGVTcnYnLCBkbHRGaWxlU3J2KTtcbiAgZGx0RmlsZVNydi4kaW5qZWN0ID0gWyckY29yZG92YUZpbGUnXTtcbiAgZnVuY3Rpb24gZGx0RmlsZVNydigkY29yZG92YUZpbGUpIHtcbiAgICB2YXIgZGx0RmlsZUZhYyA9IHsgZGx0SW1nOiBkbHRJbWcgfTtcbiAgICByZXR1cm4gZGx0RmlsZUZhYztcbiAgICAvLyBib2R5Li4uXG4gICAgZnVuY3Rpb24gZGx0SW1nKGZ1bGxQYXRoKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBmdWxsUGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICB2YXIgcGF0aCA9IGZ1bGxQYXRoLnN1YnN0cmluZygwLCBmdWxsUGF0aC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLnJlbW92ZUZpbGUocGF0aCwgRmlsZU5hbWUpOyAgLy8gYm9keS4uLlxuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuZmFjdG9yeSgnZWFzeURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlKSB7XG4gICAgdmFyIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfY3JlYXRlRGlyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvZGF5ID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICB2YXIgQ3VycmVudERhdGUgPSBtb21lbnQoKS51bml4KCk7XG4gICAgICAkY29yZG92YUZpbGUuY2hlY2tEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIHRvZGF5KS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbHJlYWR5ZXhpc3QnKTsgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAkY29yZG92YUZpbGUuY3JlYXRlRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCB0b2RheSwgZmFsc2UpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGlyIGNyZWF0ZWQnLCB0b2RheSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY3JlYXRlZCBkaXInLCB0b2RheSk7XG4gICAgICAgIH0pOyAgLy8gZXJyb3JcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZWFzeURpclNlcnZpY2VGYWN0b3J5LmNyZWF0ZURpciA9IF9jcmVhdGVEaXI7XG4gICAgcmV0dXJuIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2Vycm9yU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgZXJyb3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2NvbnNvbGVFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gIH07XG4gIGVycm9yU2VydmljZUZhY3RvcnkuY29uc29sZUVycm9yID0gX2NvbnNvbGVFcnJvcjtcbiAgcmV0dXJuIGVycm9yU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZmlsZVRyYW5zZmVyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZVRyYW5zZmVyJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZVRyYW5zZmVyLCBuZ0F1dGhTZXR0aW5ncykge1xuICAgIHZhciBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAxNzAwMDtcbiAgICB2YXIgX2ZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBvYmoucGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgZmlsZUV4dCA9IG9iai5wYXRoLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICBjb25zb2xlLmxvZygnZXh0ZW5zaW9uJywgZmlsZUV4dCk7XG4gICAgICB2YXIgbWltZXR5cGUgPSAnaW1hZ2UvanBlZyc7XG4gICAgICAvLyBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gMjAwMDA7XG4gICAgICBpZiAoZmlsZUV4dCA9PT0gJ21wNCcpIHtcbiAgICAgICAgbWltZXR5cGUgPSAndmlkZW8vbXA0JztcbiAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDYwMDAwO1xuICAgICAgfVxuICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vd3d3LmFqdXN0ZXZzaXZhLmNvbSc7XG4gICAgICAvLyAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvYXBpL2ZpbGUnO1xuICAgICAgLy8gJ2h0dHBzOi8vd3d3LmFqdXN0ZXZzaXZhLmNvbS9hdXRoL2FwaS9maWxlJztcbiAgICAgIHZhciBvcHRpb25zID0ge307XG4gICAgICBvcHRpb25zLmZpbGVLZXkgPSAnZmlsZSc7XG4gICAgICBvcHRpb25zLmZpbGVOYW1lID0gb2JqLnBhdGguc3Vic3RyKG9iai5wYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIG9wdGlvbnMubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgIC8qdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICB2YXIgaGVhZGVycyA9IHsgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbiB9O1xuICAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gaGVhZGVycztcbiAgICAgICB9Ki9cbiAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgIHBhcmFtcy5wYXRoRmlsZVNlcnZlciA9IG9iai5ydXRhU3J2LnN1YnN0cmluZygwLCBvYmoucnV0YVNydi5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICAvLyAnMjAxNS9NYXJjaC8xOC9QUlVFQkE3MDAnO1xuICAgICAgLy8gdXJsOy8vVXBQcm9taXNlLnBhdGhGaWxlU2VydmVyO1xuICAgICAgcGFyYW1zLnZhbHVlMiA9ICdwYXJhbSc7XG4gICAgICBvcHRpb25zLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgIC8vIFRPRE86IGRlZmluaXIgdW4gc2VydmljaW8gcGFyYSBzZXQgZWwgdGltZW91dCBkZXBlbmRpZW5kbyBzaSBlcyBmb3RvIG8gdmlkZW87XG4gICAgICBvcHRpb25zLnRpbWVvdXQgPSBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0O1xuICAgICAgLy8kc2NvcGUuZGF0YS50aW1lb3V0O1xuICAgICAgLy81MDA7Ly8zMDAwMDsvL21pbGlzZWNvbmRzXG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGVUcmFuc2Zlci51cGxvYWQobmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnL2F1dGgvYXBpL2ZpbGUnLCBvYmoucGF0aCwgb3B0aW9ucykudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgIC8vIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICByZXR1cm4gc3VjY2VzczsgIC8vVE9ETzogdmVyaWZpY2FyIHNpIHB1ZWRvIHBvbmVyIGVsIGVycm9yIGFjYSB5IGRpc3BhcmFyIGVsIG9vZmxpbmVtb2RlIGRlc2RlIGFjYSB5IG5vIGRlc2RlIHRvZG9zIGxvcyBjb250cm9sbGVyc1xuICAgICAgfSAgLy8gVE9ETzogc2kgZWplY3V0byBlbiBlbCBzZXJ2aWNpbyBubyBsbGVnYSBhbCBjb250cm9sYWRvciwgYXVucXVlIHBvZHJpYSBoYWNlciB1bmEgcHJhY3RpY2EgcGFyYSBkZWZpbmlyIGxvcyBwYXJhbWV0cm9zIGRlIGFmdGVydXBsb2FkIGFxdWkgbWlzbW8sIHkgcXVlZGEgbXVjaG8gbWVqb3JcbiAgICAgICAgIC8vICwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgICAvLyB9XG4pO1xuICAgIH07XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3RvcnkuZmlsZVVwbG9hZCA9IF9maWxlVXBsb2FkO1xuICAgIHJldHVybiBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZpcnN0SW5pdFNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnJGxvY2FsU3RvcmFnZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSwgbW9tZW50U2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgJGxvY2FsU3RvcmFnZSwgenVtZXJvU2VydmljZSwgJGlvbmljTG9hZGluZykge1xuICAgIHZhciBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7IHRlbXBsYXRlOiAnPHNwYW4+SW5pY2lhbGl6YW5kbzwvc3Bhbj48aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICB2YXIgX2hpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhbmRvIG9iaiBsb2NhbHN0b3JhZ2UnKTtcbiAgICAgIGlmIChvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgX3Nob3coKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBpbml0IG9rJyk7XG4gICAgICAgICAgJGxvY2FsU3RvcmFnZS5kYXRhID0ge1xuICAgICAgICAgICAgbGFzdERpckNyZWF0ZWQ6ICcnLFxuICAgICAgICAgICAgZmlyc3RaeW5jOiBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZpcnN0IGluaXQgZXJyb3InLCBlKTtcbiAgICAgICAgICBfaGlkZSgpO1xuICAgICAgICAgIHEucmVqZWN0KGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHEucmVqZWN0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH07XG4gICAgZmlyc3RJbml0U2VydmljZUZhY3RvcnkuaW5pdCA9IF9pbml0O1xuICAgIHJldHVybiBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZvY3VzJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBmb2N1c0ZhY3RvcnkgPSB7fTtcbiAgdmFyIF9mb2N1cyA9IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIHRpbWVvdXQgbWFrZXMgc3VyZSB0aGF0IGlzIGludm9rZWQgYWZ0ZXIgYW55IG90aGVyIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcbiAgICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcbiAgICAvLyBhcmUgdHJpZ2dlcmVkLlxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb2N1c0ZhY3RvcnkuZm9jdXMgPSBfZm9jdXM7XG4gIHJldHVybiBmb2N1c0ZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZ2V0VmlkZW9TZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIC8vZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnk9bnVsbDsvLyBwZXJkZXJpYSBsYSB1bHRpbWEgaW5mb3JtYWNpb24gc2kgbG8gdnVlbHZvIGEgcmVmZXJlbmNpYXI7XG4gICAgLy8gVE9ETzogIGVzdG8gc2UgZGViZSBkZSBsbGFtYXIgZGVudHJvIGRlIGxhIG1pc21hIGZ1bmNpb24sIHBvciBxdWUgc2kgbG8gaW5pY2lhbGl6YW1vcyBwb3IgZnVlcmEsIGVsIHB1Z2luIG5vIGhhIGNhcmdhZG8geSBvYnRlbmdvIGNhbWVyYSBpcyBub3QgZGVmaW5lZFxuICAgIC8vIHZhciBfZ2V0RmlsZUVudHJ5ID0gZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHZpZGVvQ29udGVudFBhdGgpO1xuICAgIC8vICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAvLyAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHZpZGVvQ29udGVudFBhdGgsIGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAvLyAgICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgLy8gfTtcbiAgICAvLyBUT0RPOiBjcmVhdGUgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgeSAuZmlsZSwgcGFyYSBkZXZvbHZlciBsYSBwcm9tZXNhIHNpbiBkYXRhIHkgcmVmZXJlbmNpYXIgZWwgY29udHJvbGFkb3IgY29uIGxhIHByb3BpZWRhZCBkZWRsIHNlcnZpY2lvIHRvZGQgbW90XG4gICAgdmFyIF9nZXRWaWRlb0NvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZVR5cGU6IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5TQVZFRFBIT1RPQUxCVU0sXG4gICAgICAgIG1lZGlhVHlwZTogQ2FtZXJhLk1lZGlhVHlwZS5WSURFT1xuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRGaWxlRW50cnkodmlkZW9Db250ZW50UGF0aCk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmNoZWNrRmlsZSh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5nZXRWaWRlb0NvbXByZXNzID0gX2dldFZpZGVvQ29tcHJlc3M7XG4gICAgcmV0dXJuIGdldFZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdncHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBlcnJvclNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsIG1vbWVudFNlcnZpY2UsICRxLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlKSB7XG4gIHZhciBncHNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2dwc0h0bWxQcm9taXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIG1heGltdW1BZ2U6IDkwMDAwLFxuICAgICAgdGltZW91dDogMTUwMDAwLFxuICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgfTtcbiAgICAvL3ZhciBvcHQ9IHsgbWF4aW11bUFnZTogOTAwMDAsIHRpbWVvdXQ6IDMwMDAsIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSB9Oy8vdGFtYmllbiBzZSBwcm9ibyBjb24gMjIsIHBlcm8gc2UgYmFqYSBoYXN0YSAxM1xuICAgIC8vIGNvbnNvbGUubG9nKG5hdmlnYXRvciwgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAvL2JldGFkb3BhcmFwcnVlYmFzY29uc29sZS5sb2coXCJncHNIdG1sUHJvbWlzZSBcIiwgcmVzdWx0KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIC8vIEFuIGVycm9yIG9jY3VyZWQuIFNob3cgYSBtZXNzYWdlIHRvIHRoZSB1c2VyXG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTsgIC8vJHNjb3BlLmRpYWxvZyhlcnIpO1xuICAgIH0sIG9wdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG4gIHZhciBfZ3BzSHRtbCA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24pIHtcbiAgICAvLyBUT0RPOiBhdW4gc2luIHdpIGZpIG5pIGRhdG9zIGVsIGdwcyBzaWd1ZSBmdW5jaW9uYW5kb1xuICAgIC8vIFRPRE86IHBvciBxdWUgbWUgZGlzcGFyYSBlbCB2ZW50byBkZSBvbiBvbmxpbmUsIG1hcyBxdWUgdG9kbyBjb24gZWwgd2lmaT8/Pz9cbiAgICBpZiAoISRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzIHx8IG1vbWVudFNlcnZpY2UuZGlmZk5vdygkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcykgPiA3KSB7XG4gICAgICB2YXIgb3B0ID0ge1xuICAgICAgICBtYXhpbXVtQWdlOiAzMDAwLFxuICAgICAgICB0aW1lb3V0OiAzNjAwMDAsXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhaXNUYWtpbmdHZW8gPSBmYWxzZTtcbiAgICAgICAgX2luc2VydEdwc0xvZyhpZGluc3BlY2Npb24sIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YWlzVGFraW5nR2VvID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yO1xuICAgICAgfSwgb3B0KTtcbiAgICB9XG4gIH07XG4gIHZhciBfaW5zZXJ0R3BzTG9nID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgY29vcmRzKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtncHNMb2dzXSAoW2lkaW5zcGVjY2lvbl0gICAsW2ZlY2hhXSAsW2FjY3VyYWN5XSAgLFthbHRpdHVkZV0sICc7XG4gICAgcXVlcnkgKz0gJ1thbHRpdHVkZUFjY3VyYWN5XSAgLFtoZWFkaW5nXSAgLFtsYXRpdHVkZV0gLFtsb25naXR1ZGVdLFtzcGVlZF0pIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LD8pJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgIGNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgY29vcmRzLmhlYWRpbmcsXG4gICAgICBjb29yZHMubGF0aXR1ZGUsXG4gICAgICBjb29yZHMubG9uZ2l0dWRlLFxuICAgICAgY29vcmRzLnNwZWVkXG4gICAgXTtcbiAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcyA9IG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKTtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbFByb21pc2UgPSBfZ3BzSHRtbFByb21pc2U7XG4gIGdwc1NlcnZpY2VGYWN0b3J5Lmdwc0h0bWwgPSBfZ3BzSHRtbDtcbiAgcmV0dXJuIGdwc1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2ludGVybWVkaWF0ZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgaXNUYWtpbmdQaWM6IGZhbHNlLFxuICAgIGlzVGFraW5nVmlkOiBmYWxzZSxcbiAgICBpc1Rha2luZ0dlbzogZmFsc2UsXG4gICAgbmF2QmFyU2VhcmNoOiBmYWxzZSxcbiAgICBwbGFjYTogbnVsbCxcbiAgICBpZGluc3BlY2Npb25TeW5jOiBmYWxzZSxcbiAgICBpZGluc3BlY2Npb246IG51bGxcbiAgfTtcbiAgcmV0dXJuIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ21vbWVudFNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIG1vbWVudFNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfZ2V0RGF0ZVRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZERheXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGRIb3VycyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAnaG91cnMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGRTZWNvbmRzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfcnV0YVNydiA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGZpbGVuYW1lID0gcGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIHJ1dGEgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVkvTU1NTS9ERC8nKSArIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSArICcvJyArIGZpbGVuYW1lO1xuICAgIHJldHVybiBydXRhO1xuICB9O1xuICB2YXIgX2RpZmZOb3cgPSBmdW5jdGlvbiAoYiwgdGlwbykge1xuICAgIHZhciBydGEgPSBtb21lbnQoKS5kaWZmKG1vbWVudChiKSwgdGlwbyk7XG4gICAgY29uc29sZS5sb2cocnRhLCAnZGlmZicpO1xuICAgIHJldHVybiBydGE7XG4gIH07XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmdldERhdGVUaW1lID0gX2dldERhdGVUaW1lO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGREYXlzID0gX2FkZERheXM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZEhvdXJzID0gX2FkZEhvdXJzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGRTZWNvbmRzID0gX2FkZFNlY29uZHM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LnJ1dGFTcnYgPSBfcnV0YVNydjtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuZGlmZk5vdyA9IF9kaWZmTm93O1xuICByZXR1cm4gbW9tZW50U2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnb2ZmbGluZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICBvZmZsaW5lU2VydmljZUZhY3RvcnkuZGF0YSA9IHt9O1xuICAvLyB2YXIgX2ZvY3VzID0gZnVuY3Rpb24gKGlkKSB7XG4gIC8vICAgLy8gdGltZW91dCBtYWtlcyBzdXJlIHRoYXQgaXMgaW52b2tlZCBhZnRlciBhbnkgb3RoZXIgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAvLyAgIC8vIGUuZy4gY2xpY2sgZXZlbnRzIHRoYXQgbmVlZCB0byBydW4gYmVmb3JlIHRoZSBmb2N1cyBvclxuICAvLyAgIC8vIGlucHV0cyBlbGVtZW50cyB0aGF0IGFyZSBpbiBhIGRpc2FibGVkIHN0YXRlIGJ1dCBhcmUgZW5hYmxlZCB3aGVuIHRob3NlIGV2ZW50c1xuICAvLyAgIC8vIGFyZSB0cmlnZ2VyZWQuXG4gIC8vICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAvLyAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIC8vICAgICBpZiAoZWxlbWVudCkge1xuICAvLyAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vIH07XG4gIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeS5kYXRhLm9mZmxpbmVNb2RlID0gZmFsc2U7XG4gIHJldHVybiBvZmZsaW5lU2VydmljZUZhY3Rvcnk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb25saW5lU3RhdHVzU2VydmljZScsIFtcbiAgJyRyb290U2NvcGUnLFxuICAnJHEnLFxuICAnJGluamVjdG9yJyxcbiAgJyRsb2NhdGlvbicsXG4gICckY29yZG92YU5ldHdvcmsnLFxuICAnJGlvbmljUG9wdXAnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsICRpbmplY3RvciwgJGxvY2F0aW9uLCAkY29yZG92YU5ldHdvcmssICRpb25pY1BvcHVwLCB6dW1lcm9TZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgdG9hc3RTZXJ2aWNlKSB7XG4gICAgdmFyIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGlzT25saW5lOiBmYWxzZSxcbiAgICAgIGNvbm5UeXBlOiAnbm9uZSdcbiAgICB9O1xuICAgIHZhciBfaXNPbmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9ICRjb3Jkb3ZhTmV0d29yay5pc09ubGluZSgpO1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9ICRjb3Jkb3ZhTmV0d29yay5pc09ubGluZSgpO1xuICAgIH07XG4gICAgdmFyIF90eXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSAkY29yZG92YU5ldHdvcmsuZ2V0TmV0d29yaygpO1xuICAgIH07XG4gICAgdmFyIF9vbk9ubGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRyb290U2NvcGUuJG9uKCckY29yZG92YU5ldHdvcms6b25saW5lJywgZnVuY3Rpb24gKGV2ZW50LCBuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIG5ldHdvcmtTdGF0ZSk7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gbmV0d29ya1N0YXRlO1xuICAgICAgICAvLyBUT0RPOiBldmFsdWFyIHRvZGFzIGxhcyBwb3NpYmlsaWRhZGVzIGRlIGVzdG8gYWNhLCBwb3IgcXVlIHNpIGxhIHNlw7FhbCBlcyBtdXkgbWFsYSBxdWUgcHVlZGUgcGFzYXIsIGF1bnF1ZSBlbCB6eW5jIGRlIGJhc2VzIGRlIGRhdG9zIG51bmNhIGhhc2lkbyBtdXkgZ3JhbmRlIGVuIGluZm9ybWFjaW9uXG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKTsgIC8vIGNvcmRvdmFFdmVudHNTZXJ2aWNlLmNhbGxaeW5jKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qaWYoIXNpZ25hbFNlcnZpY2UuaXNJbml0KXtcbiAgICAgICAgICAgICAgICAgICAgc2lnbmFsU2VydmljZS5zdGFydEh1YigpO1xuXG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJGNvcmRvdmFOZXR3b3JrOnNpZ25hbCcseyduZXR3b3JrU3RhdGUnOm5ldHdvcmtTdGF0ZX0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX29uT2ZmbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGxpc3RlbiBmb3IgT2ZmbGluZSBldmVudFxuICAgICAgJHJvb3RTY29wZS4kb24oJyRjb3Jkb3ZhTmV0d29yazpvZmZsaW5lJywgZnVuY3Rpb24gKGV2ZW50LCBuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIG5ldHdvcmtTdGF0ZSk7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IGZhbHNlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IG5ldHdvcmtTdGF0ZTsgIC8qIGlmKG5ldHdvcmtTdGF0ZSA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJJbnRlcm5ldCBEaXNjb25uZWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiVGhlIGludGVybmV0IGlzIGRpc2Nvbm5lY3RlZCBvbiB5b3VyIGRldmljZS5cIlxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpb25pYy5QbGF0Zm9ybS5leGl0QXBwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5vbk9ubGluZSA9IF9vbk9ubGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5vbk9mZmxpbmUgPSBfb25PZmZsaW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gX2lzT25saW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gX3R5cGU7XG4gICAgcmV0dXJuIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnc3FsaXRlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhU1FMaXRlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhU1FMaXRlKSB7XG4gICAgdmFyIHNxbGl0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9leGVjdXRlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnksIGJpbmRpbmcpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uIChxdWVyeSwgYmluZGluZ3MpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5pbnNlcnRDb2xsZWN0aW9uKGRiLCBxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkFycmF5ID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICBpZiAocmVzLnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChyZXMucm93cy5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBUT0RPOiBzaSB5byBjYW1iaW8gZWwgdGlwbyBkZSBkYXRvIGRlIHVuYSBjb2x1bW5hLCBlamVtcGxvIHN0cmluZyB0byBpbnQsIGRlYm8gcmVlc3RhYmxlY2VyIGxhIGJhc2UgZGUgZGF0b3MgenVtZXJvLCBwYXJhIGFncmVnYXIgdW5hIGNvbHVtbmEgbm8gdGVuZ28gcHJvYmxlbWFcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5leGVjdXRlUXVlcnkgPSBfZXhlY3V0ZVF1ZXJ5O1xuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5Lmluc2VydENvbGxlY3Rpb24gPSBfaW5zZXJ0Q29sbGVjdGlvbjtcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5ydG5BcnJheSA9IF9ydG5BcnJheTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd0aXRsZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIHRpdGxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdGl0bGVTZXJ2aWNlRmFjdG9yeS50aXRsZSA9ICcnO1xuICByZXR1cm4gdGl0bGVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd0b2FzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJGNvcmRvdmFUb2FzdCkge1xuICB2YXIgdG9hc3RTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3Nob3dMb25nQm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dMb25nQm90dG9tKG1zZyk7XG4gIH07XG4gIHZhciBfc2hvd1Nob3J0Qm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShtc2cpO1xuICB9O1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dMb25nQm90dG9tID0gX3Nob3dMb25nQm90dG9tO1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dTaG9ydEJvdHRvbSA9IF9zaG93U2hvcnRCb3R0b207XG4gIHJldHVybiB0b2FzdFNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3Vuc3luY1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGVycm9yU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIGZvdG9zU2VydmljZSwgenVtZXJvU2VydmljZSwgJHJvb3RTY29wZSkge1xuICB2YXIgdW5zeW5jU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gW107XG4gIHZhciBfZ2V0SW1nVW5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICAgIGlkZm90bywgaS5pZGluc3BlY2Npb24sIHBhdGgsIGYuc3luYywgIGkucGxhY2EsIGYucnV0YVNydiAnO1xuICAgIHF1ZXJ5ICs9ICdGUk9NICAgICAgaWRpbnNwZWNjaW9uIGkgICAgaW5uZXIgam9pbiAgaWRmb3RvcyBmIG9uIGkuaWRpbnNwZWNjaW9uID0gZi5pZGluc3BlY2Npb24gJztcbiAgICBxdWVyeSArPSAnV0hFUkUgICAgaS51c2VyTmFtZSA9ID8gQU5EICBpLmZlY2hhPj8gQU5EIChmLnN5bmMgPSAwKSBBTkQgKGRlbGV0ZWQgPSAwKSAnO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmxlbmd0aDtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgdmFyIF9zeW5jSW1hZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIF9nZXRJbWdVbnN5bmMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPCAxKSB7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYW5ndWxhci5mb3JFYWNoKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIF9wcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIF9wcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAvLyBUT0RPOiB5YSBub2UgcyBuZWNlc2FyaW8gcG9yIHF1ZSBvZmZsaW5lIHRhbWJpZW4gZXN0YSBlbiBvbmxpbG5lc3RhdHVzc3JlcnZpY2VcbiAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgdmFyIF91cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICBfdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICB9O1xuICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgLy8gaWYgKHMubWFzc2l2ZVVwbG9hZCkge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoIC0gMTtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIH1cbiAgICAgIC8vIF9maWx0ZXJVbnN5bmMoMCk7ICAgICAgICAgIFxuICAgICAgY29uc29sZS5sb2codW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoLCAnc3luYycpO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgenVtZXJvU2VydmljZS56eW5jKDApLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ215RXZlbnQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5nZXRJbWdVbnN5bmMgPSBfZ2V0SW1nVW5zeW5jO1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5zeW5jSW1hZ2VzID0gX3N5bmNJbWFnZXM7XG4gIHJldHVybiB1bnN5bmNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd1cGRhdGVTeW5jU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3VwZGF0ZVN5bmMgPSBmdW5jdGlvbiAocGxhY2EsIHN5bmMpIHtcbiAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgc3luYyxcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICB9O1xuICB2YXIgX3NlbGVjdElkaW5zcGVjY2lvblN5bmMgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkaW5zcGVjY2lvbiBmcm9tIGlkaW5zcGVjY2lvbiAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+PyBPcmRlciBieSBpZGluc3BlY2Npb24gREVTQyBMaW1pdCAxJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGluc3BlY2Npb247XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IHRydWU7XG4gICAgICByZXR1cm4gX3VwZGF0ZVN5bmMocGxhY2EsIHRydWUpO1xuICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlLCAnZXJyb3InKTtcbiAgICB9KTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAgICAgIC8vIH0pO1xuICB9O1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3RvcnkudXBkYXRlU3luYyA9IF91cGRhdGVTeW5jO1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyA9IF9zZWxlY3RJZGluc3BlY2Npb25TeW5jO1xuICAvLyB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc3luY0ltYWdlcyA9IF9zeW5jSW1hZ2VzO1xuICByZXR1cm4gdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3ZpZGVvVGh1bWJuYWlsU2VydmljZScsIFtcbiAgJyRxJyxcbiAgZnVuY3Rpb24gKCRxKSB7XG4gICAgdmFyIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2dlbmVyYXRlVGh1bWJuYWlsID0gZnVuY3Rpb24gKG5hdGl2ZVVSTCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBuYW1lID0gbmF0aXZlVVJMLnNsaWNlKDAsIC00KTtcbiAgICAgIHdpbmRvdy5QS1ZpZGVvVGh1bWJuYWlsLmNyZWF0ZVRodW1ibmFpbChuYXRpdmVVUkwsIG5hbWUgKyAnLnBuZycsIGZ1bmN0aW9uIChwcmV2U3VjYykge1xuICAgICAgICBjb25zb2xlLmxvZyhwcmV2U3VjYyk7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJldlN1Y2MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGdlbmVybmFkbyB0aHVtYm5haWwnLCBlKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3RvcnkuZ2VuZXJhdGVUaHVtYm5haWwgPSBfZ2VuZXJhdGVUaHVtYm5haWw7XG4gICAgcmV0dXJuIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd6dW1lcm9TZXJ2aWNlJywgW1xuICAnJHEnLFxuICAnJGNvcmRvdmFEZXZpY2UnLFxuICAnJGNvcmRvdmFTUUxpdGUnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd1cGRhdGVTeW5jU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnJGludGVydmFsJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICAvLyAnb25saW5lU3RhdHVzU2VydmljZScsXG4gIGZ1bmN0aW9uICgkcSwgJGNvcmRvdmFEZXZpY2UsICRjb3Jkb3ZhU1FMaXRlLCBvZmZsaW5lU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdXBkYXRlU3luY1NlcnZpY2UsIHRvYXN0U2VydmljZSwgJHRpbWVvdXQsIG5nQXV0aFNldHRpbmdzLCAkaW50ZXJ2YWwsICRpb25pY0xvYWRpbmcpIHtcbiAgICB2YXIgenVtZXJvID0gbnVsbDtcbiAgICB2YXIgaW50ZXJ2YWwgPSBudWxsO1xuICAgIHZhciBpbnRlcnZhbEVqID0gbnVsbDtcbiAgICB2YXIgbkVqID0gMDtcbiAgICB2YXIgbiA9IDA7XG4gICAgdmFyIHp1bWVyb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9zZXREYlBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX29wdGlvbnMgPSB7XG4gICAgICAgIEFuZHJvaWQ6ICcvZGF0YS9kYXRhLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5wYWNrYWdlTmFtZSArICcvZGF0YWJhc2VzLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgaU9TOiAnY2R2ZmlsZTovL2xvY2FsaG9zdC9wZXJzaXN0ZW50LycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgd2luMzJudDogJy8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGVcbiAgICAgIH07XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYnBhdGggPSBfb3B0aW9uc1skY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpXTtcbiAgICB9O1xuICAgIHZhciBfc2V0WnVtZXJvID0gZnVuY3Rpb24gKGRiZmlsZSkge1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlID0gZGJmaWxlO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUgPSB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUgKyAnLmRiJztcbiAgICAgIC8vb3BlbiBkYiBjb24gc3FsaXRlcGx1Z2luIGJyb2R5XG4gICAgICBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQih6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSwgMSk7XG4gICAgICB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgICAgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnOjgwODAvJztcbiAgICAgIC8vaHR0cDovLzE5MC4xNDUuMzkuMTM4OjgwODAvJztcbiAgICAgIC8vJ2h0dHA6Ly8xOTIuMTY4LjAuNTE6ODA4MC8nO1xuICAgICAgLy8gVE9ETzogREVQRU5ERSBTSSBFU1RPWSBFTiBNSSBDQVNBIE8gRU4gTEEgT0ZJQ0lOQSdodHRwOi8vMTkyLjE2OC4xLjEzOjgwODAvJztcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnBhY2thZ2VOYW1lID0gJ2NvbS5hanVzdGV2LmInO1xuICAgICAgX3NldERiUGF0aCgpO1xuICAgIH07XG4gICAgLy8gVE9ETzogIHJlY29yZGFyIGsgZXN0byBlcyB1bmEgcHJvbWVzYSB5IGRlc2VuY2FkZW5hIGFjY2lvbmVzLCBzaSBlcyByZXN1ZWx0YSBvIHNpIGVzIHJlamVjdCAsIHZhbGxpZGFyXG4gICAgdmFyIF96eW5jID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGlmICghb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICBfc2hvdygpO1xuICAgICAgfVxuICAgICAgLy8gX29uSW4oKTtcbiAgICAgIC8vIFRPRE86IGFicmlyaSBlbCBwdWVydG8gcGFyYSB6dW1lcm8gZW4gZWwgZmlyZXdhbGxcbiAgICAgIC8vIFRPRE86IGNyZWFyIHVuYSBzZXJ2aWNpbyBnbG9iYWwgcGFyYSBkZSBhaGkgc2FjYXIgZWwgaWRpbnNwZWNjaW9uIGFjdHVhbCwgaW5jdXNpdmUgZGVzcHVlcyBkZSB1biB6eW5jIHBhcmEgc2FiZXIgcXVlIGVzIGVsIGFkZWN1YWRvXG4gICAgICAvLyBUT0RPOiBlbCBwcm9jZXNvIHNlIHJlYWxpemEgZW4gYmFja2dyb3VkLCBwZXJvIGJsb3F1ZWEgbGEgYmFzZSBkZSBkYXRvcyBwb3IgZXNvIG5vIG1lIHB1ZWRvIG1vdmVyIGVudHJlIHZpc3RhcywgcG9yIHF1ZSBoYWNlbiBjb25zdWx0YXMgYSBsYSBhc2UgZGUgZGF0b3NcbiAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2EgaW5aeW5jJyk7XG4gICAgICAgIF9pblp5bmMoaSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3p5biBwcm9taXNlIG9rJywgcmVzKTtcbiAgICAgICAgICBxLnJlc29sdmUocmVzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnenluYyBwcm9taXNlIGVycm9yJywgZSk7XG4gICAgICAgICAgcS5yZWplY3QoZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgMTIwKTtcbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfTtcbiAgICBfaW5aeW5jID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgLy8gVE9ETzogbWUgcGFyZWNlIG1hcyBsb2dpY28gcmV0b3JuYXIgdW4gcmVqZWN0IHNpIGVzdGEgZW4gbW9kbyBvZmZsaW5lXG4gICAgICAgIHEucmVqZWN0KCdvZmZsaW5lTW9kZSBvIHNpbiBjb25leGlvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnb2ZmbGluZSBtb2RlIGFjdGl2YWRvJyk7ICAvLyBfaGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2luaXQgenluYycgKyBpKTtcbiAgICAgICAgY29uc29sZS50aW1lKCd6eW5jJyArIGkpO1xuICAgICAgICAvKnZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdzaW5jcm9uaXphbmRvLi4nKTtcbiAgICAgICAgfSwgMjUwMCk7Ki9cbiAgICAgICAgLy8gbiA9IDA7XG4gICAgICAgIC8vIGludGVydmFsID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICBuICs9IDE7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ2ludGVydmFsJyArIG4pOyAgLy8gdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnc2luY3Jvbml6YW5kby4uJyk7XG4gICAgICAgIC8vIH0sIDUwMCk7XG4gICAgICAgIHp1bWVyby5zeW5jKHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRicGF0aCwgJycsIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNlcnZlciwgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlLCBudWxsLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ29rJyk7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmICghaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgJiYgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgICAvKiAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7Ki9cbiAgICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgICAvLyAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVN5bmNTZXJ2aWNlLnVwZGF0ZVN5bmMoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCB0cnVlKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVwZGF0ZVN5bmNTZXJ2aWNlLnNlbGVjdElkaW5zcGVjY2lvblN5bmMoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnc2luYzogb2snKTtcbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCd6eW5jIG9rJyk7XG4gICAgICAgICAgICB9KTsgIC8vIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiR0aW1lb3V0LmNhbmNlbCh0aW1lcik7Ki9cbiAgICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgICAvLyAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3NpbmM6IG9rJyk7XG4gICAgICAgICAgICBxLnJlc29sdmUoJ3p5bmMgb2snKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAvLyAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgLy8gJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0NTYpIHtcbiAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdzaW5jOiBlcnJvcicpO1xuICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH07XG4gICAgX29uSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnRlcnZhbEVqID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbkVqICs9IDE7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnRlcnZhbCcgKyBuRWopO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdzaW5jcm9uaXphbmRvLi4nKTtcbiAgICAgIH0sIDIwMDApO1xuICAgICAgY29uc29sZS5sb2coaW50ZXJ2YWxFaik7XG4gICAgfTtcbiAgICBfb2ZmSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsRWopO1xuICAgIH07XG4gICAgX3Nob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBfb25JbigpO1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICBfaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIF9vZmZJbigpO1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXRadW1lcm8gPSBfc2V0WnVtZXJvO1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5Lnp5bmMgPSBfenluYztcbiAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5vbkluID0gX29uSW47XG4gICAgenVtZXJvU2VydmljZUZhY3Rvcnkub2ZmSW4gPSBfb2ZmSW47XG4gICAgenVtZXJvU2VydmljZUZhY3Rvcnkuc2hvdyA9IF9zaG93O1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmhpZGUgPSBfaGlkZTtcbiAgICByZXR1cm4genVtZXJvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuY29udHJvbGxlcignU2V0dGluZ3MnLCBTZXR0aW5ncyk7XG4gIFNldHRpbmdzLmluamVjdCA9IFtcbiAgICAnJGxvZycsXG4gICAgJ3NldHRpbmdzU3J2JyxcbiAgICAnZXJyb3JTZXJ2aWNlJyxcbiAgICAnYXV0aFNlcnZpY2UnXG4gIF07XG4gIGZ1bmN0aW9uIFNldHRpbmdzKCRsb2csIHNldHRpbmdzU3J2LCBlcnJvclNlcnZpY2UsIGF1dGhTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5waWNzID0gW107XG4gICAgdm0udmRzID0gW107XG4gICAgdm0uc2VydmVyID0gJyc7XG4gICAgdm0uZGVsZXRlVmRzID0gZGVsZXRlVmRzO1xuICAgIHZtLmRlbGV0ZUltZ3MgPSBkZWxldGVJbWdzO1xuICAgIHZtLnRvZ2dsZVNlcnZlciA9IHRvZ2dsZVNlcnZlcjtcbiAgICBhY3RpdmF0ZSgpO1xuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgc2V0dGluZ3NTcnYuZ2V0MkRsdCgpLnRoZW4oc2VsZWN0T2spLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZWxlY3RPaygpIHtcbiAgICAgIHZtLnBpY3MgPSBzZXR0aW5nc1Nydi5waWNzO1xuICAgICAgdm0udmRzID0gc2V0dGluZ3NTcnYudmRzO1xuICAgICAgYXV0aFNlcnZpY2UuZ2V0U2VydmVyKCk7XG4gICAgICB2bS5zZXJ2ZXIgPSBhdXRoU2VydmljZS5zZXJ2ZXI7XG4gICAgICAkbG9nLmRlYnVnKCdzZWxlY3Qgb2snKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gZGVsZXRlSW1ncygpIHtcbiAgICAgIGlmICh2bS5waWNzLmxlbmd0aCkge1xuICAgICAgICAkbG9nLmRlYnVnKCdkZWxldGVJbWdzJyk7XG4gICAgICAgIHNldHRpbmdzU3J2LmRsdEltZ3MoKS50aGVuKGFjdGl2YXRlKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGVsZXRlVmRzKCkge1xuICAgICAgaWYgKHZtLnZkcy5sZW5ndGgpIHtcbiAgICAgICAgJGxvZy5kZWJ1ZygnZGVsZXRlSW1ncycpO1xuICAgICAgICBzZXR0aW5nc1Nydi5kbHRWZHMoKS50aGVuKGFjdGl2YXRlKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdG9nZ2xlU2VydmVyKCkge1xuICAgICAgYXV0aFNlcnZpY2UudG9nZ2xlU2VydmVyKCk7XG4gICAgICB2bS5zZXJ2ZXIgPSBhdXRoU2VydmljZS5zZXJ2ZXI7XG4gICAgfVxuICB9XG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuZmFjdG9yeSgnc2V0dGluZ3NTcnYnLCBzZXR0aW5nc1Nydik7XG4gIHNldHRpbmdzU3J2LiRpbmplY3QgPSBbXG4gICAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAgICdzcWxpdGVTZXJ2aWNlJyxcbiAgICAnbW9tZW50U2VydmljZScsXG4gICAgJ2F1dGhTZXJ2aWNlJyxcbiAgICAndG9hc3RTZXJ2aWNlJyxcbiAgICAnZGV2aWNlU2VydmljZScsXG4gICAgJ2RsdEZpbGVTcnYnLFxuICAgICdlcnJvclNlcnZpY2UnLFxuICAgICckbG9nJyxcbiAgICAnJHEnXG4gIF07XG4gIGZ1bmN0aW9uIHNldHRpbmdzU3J2KGludGVybWVkaWF0ZVNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIGRsdEZpbGVTcnYsIGVycm9yU2VydmljZSwgJGxvZywgJHEpIHtcbiAgICB2YXIgc3RGYWN0b3J5ID0ge1xuICAgICAgcGljczogW10sXG4gICAgICB2ZHM6IFtdLFxuICAgICAgZ2V0MkRsdDogZ2V0MkRsdCxcbiAgICAgIGRsdEltZ3M6IGRsdEltZ3MsXG4gICAgICBkbHRWZHM6IGRsdFZkc1xuICAgIH07XG4gICAgcmV0dXJuIHN0RmFjdG9yeTtcbiAgICBmdW5jdGlvbiBnZXQyRGx0KCkge1xuICAgICAgdmFyIHFBcnJheSA9IFtdO1xuICAgICAgcUFycmF5LnB1c2goZ2V0SW1nMkRsdCgpKTtcbiAgICAgIHFBcnJheS5wdXNoKGdldFZkczJEbHQoKSk7XG4gICAgICByZXR1cm4gJHEuYWxsKHFBcnJheSk7ICAvLyBib2R5Li4uXG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEltZzJEbHQoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgZi5pZGZvdG8sIGYucGF0aCAnO1xuICAgICAgcXVlcnkgKz0gJ0ZST00gIGlkaW5zcGVjY2lvbiBpZCAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRmb3RvcyBmIG9uIGYuaWRpbnNwZWNjaW9uPWlkLmlkaW5zcGVjY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFICAgICBpZC51dWlkID0gPyBBTkQgaWQuVXNlck5hbWUgPSA/ICAnO1xuICAgICAgcXVlcnkgKz0gJ2FuZCBmLnN5bmM9MSAnO1xuICAgICAgcXVlcnkgKz0gJ2FuZCBmLmRlbGV0ZWQ9MCAnO1xuICAgICAgcXVlcnkgKz0gJ2FuZCBpZC5mZWNoYTwgPyBPUkRFUiBCWSBmLmlkZm90byBERVNDICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoKzEpICAvLyAtMiAvLyBlbiAwIHNlcmlhIG1lam9yIHBvciBzaSBzZSBsbGVuYSBsYSBtZW1vcmlhXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgc3RGYWN0b3J5LnBpY3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7ICAvKiBjb25zb2xlLmxvZyhhcnJheSk7XG4gICAgICAgIGlmIChhcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBkbHRJbWdzKGFycmF5KTtcbiAgICAgICAgfSovXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFZkczJEbHQoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgdi5pZHZpZGVvLCB2LnBhdGggJztcbiAgICAgIHF1ZXJ5ICs9ICdGUk9NICBpZGluc3BlY2Npb24gaWQgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGlkdmlkZW9zIHYgb24gdi5pZGluc3BlY2Npb249aWQuaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIGlkLnV1aWQgPSA/IEFORCBpZC5Vc2VyTmFtZSA9ID8gICc7XG4gICAgICBxdWVyeSArPSAnYW5kIHYuc3luYz0xICc7XG4gICAgICBxdWVyeSArPSAnYW5kIHYuZGVsZXRlZD0wICc7XG4gICAgICBxdWVyeSArPSAnYW5kIGlkLmZlY2hhPCA/IE9SREVSIEJZIHYuaWR2aWRlbyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS51dWlkLFxuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKCsxKSAgLy8gLTJcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBzdEZhY3RvcnkudmRzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpOyAgLyogY29uc29sZS5sb2coYXJyYXkpO1xuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgZGx0SW1ncyhhcnJheSk7XG4gICAgICAgIH0qL1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkbHRJbWdzKCkge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnRWxpbWluYW5kbyBGb3RvcycpO1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRmb3Rvc11TRVQgW2RlbGV0ZWRdID0gMSAgV0hFUkUgaWRmb3RvPT8nO1xuICAgICAgdmFyIGJpbmRpbmdzID0gW107XG4gICAgICB2YXIgcUFycmF5ID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goc3RGYWN0b3J5LnBpY3MsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAvKnFBcnJheS5wdXNoKFxuICAgICAgICAgIGRsdEZpbGVTcnYuZGx0SW1nKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgICAgIGJpbmRpbmcucHVzaChvYmouaWRmb3RvKTtcbiAgICAgICAgICBiaW5kaW5ncy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKVxuICAgICAgICAgICk7ICovXG4gICAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgIGJpbmRpbmcucHVzaChvYmouaWRmb3RvKTtcbiAgICAgICAgYmluZGluZ3MucHVzaChiaW5kaW5nKTtcbiAgICAgICAgLyogIChmdW5jdGlvbiBpbnNlcnRPbmUoKSB7XG4gICAgICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkbHRGaWxlU3J2LmRsdEltZyhvYmoucGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyLmNvZGUgIT09IDEpIHtcbiAgICAgICAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBxLnJlamVjdChleGNlcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxQXJyYXkucHVzaChxLnByb21pc2UpO1xuICAgICAgICB9KCkpOyovXG4gICAgICAgIHFBcnJheS5wdXNoKGlpZmVEbHQob2JqLnBhdGgpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByZVVwZGF0ZUNvbGxlY3Rpb24ocUFycmF5LCBxdWVyeSwgYmluZGluZ3MpICAvKiByZXR1cm4gJHEuYWxsKHFBcnJheSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlQ29sbGVjdGlvbihiaW5kaW5ncykudGhlbih1cGRPaykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpKi87XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRsdFZkcygpIHtcbiAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ0VsaW1pbmFuZG8gVmlkZW9zJyk7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZHZpZGVvc11TRVQgW2RlbGV0ZWRdID0gMSAgV0hFUkUgaWR2aWRlbz0/JztcbiAgICAgIHZhciBiaW5kaW5ncyA9IFtdO1xuICAgICAgdmFyIHFBcnJheSA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHN0RmFjdG9yeS52ZHMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgICBiaW5kaW5nLnB1c2gob2JqLmlkdmlkZW8pO1xuICAgICAgICBiaW5kaW5ncy5wdXNoKGJpbmRpbmcpO1xuICAgICAgICBxQXJyYXkucHVzaChpaWZlRGx0KG9iai5wYXRoKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcmVVcGRhdGVDb2xsZWN0aW9uKHFBcnJheSwgcXVlcnksIGJpbmRpbmdzKTtcbiAgICB9XG4gICAgLyogICBmdW5jdGlvbiBpbnNlcnRCaW5kaW5nIChpZGZvdG8pIHtcbiAgICAgIHZhciBiaW5kaW5nPVtdXG4gICAgICBiaW5kaW5nLnB1c2goaWRmb3RvKTtcbiAgICAgIGJpbmRpbmdzLnB1c2goYmluZGluZyk7XG4gICAgICBcbiAgICB9Ki9cbiAgICAvL1RPRE86IGVqZW1wbG8gdHJhaWRvIGRlIGluc2VydGNvbGxlY3Rpb24gZm9tIG5nY29yZG92YVxuICAgIGZ1bmN0aW9uIGlpZmVEbHQocGF0aCkge1xuICAgICAgLy8gcmV0dXJuIGZ1bmN0aW9uIGluc2VydE9uZSgpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRsdEZpbGVTcnYuZGx0SW1nKHBhdGgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAxKSB7XG4gICAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICBxLnJlamVjdChleGNlcHRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTsgIC8vIH0oKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJlVXBkYXRlQ29sbGVjdGlvbihxQXJyYXksIHF1ZXJ5LCBiaW5kaW5ncykge1xuICAgICAgcmV0dXJuICRxLmFsbChxQXJyYXkpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoYmluZGluZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUNvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKS50aGVuKHVwZE9rKS5jYXRjaChlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKSB7XG4gICAgICAkbG9nLmRlYnVnKGJpbmRpbmdzKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmluc2VydENvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKTsgIC8vIGJvZHkuLi5cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkT2soKSB7XG4gICAgICAkbG9nLmRlYnVnKCd1cGQgY29sbGVjdGlvbiBvaycpO1xuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuY29udHJvbGxlcignVmlkZW9DdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3ZpZGVvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJyRmaWx0ZXInLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLFxuICAnZ2V0VmlkZW9TZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgJyRsb2cnLFxuICBmdW5jdGlvbiAocywgdmlkZW9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCBnZXRWaWRlb1NlcnZpY2UsIGNoZWNrRmlsZVNlcnZpY2UsIHRpdGxlU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgZXJyb3JTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBncHNTZXJ2aWNlLCAkbG9nKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgLy8gcy50aXR0bGUgPSAnJztcbiAgICAgIHMudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIHMudmlkZW9zID0gdmlkZW9TZXJ2aWNlLnZpZGVvcztcbiAgICAgIC8vdmlkZW9TZXJ2aWNlLmFsbCgpO1xuICAgICAgdmlkZW9TZXJ2aWNlLmdldFZpZGVvcyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy52aWRlb3MgPSB2aWRlb1NlcnZpY2UudmlkZW9zO1xuICAgICAgfSk7XG4gICAgICAvLyB2YXIgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xuICAgICAgLy8gfTtcbiAgICAgIHZhciBpbnNlcnRWaWRlbyA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgdGh1bWJuYWlsLCBvbnVwbG9hZCwgZGVmYXVsdFBhdGgpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLmluc2VydFZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkLCBkZWZhdWx0UGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBpbnNlcnQgc3FsaXRlIHZpZGVvICcpO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbWFpblNjcm9sbCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS51cGRhdGVWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIC8vIGluc2VydFZpZGVvKGltYWdlVVJJLCBzeW5jLCBvYmpWaWRlby50aHVtYm5haWwpO1xuICAgICAgICB1cGRhdGVWaWRlbyhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIHZhciByZWZyZXNoUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnByb2dyZXNzID0gcGVyY2VudGFnZTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgICAgLy8gY29uc3RhbnQgcHJvZ3Jlc3MgdXBkYXRlc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgLy8gcmVmcmVzaFByb2dyZXNzKGltYWdlVVJJLCBNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqVmlkZW8gPSBmdW5jdGlvbiAocGxhY2EsIHBhdGgsIHN5bmMsIG9uVXBsb2FkLCB0aHVtYm5haWwsIGRlZmF1bHRQYXRoKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgc3luYzogc3luYyxcbiAgICAgICAgICBvblVwbG9hZDogb25VcGxvYWQsXG4gICAgICAgICAgLy9zLm9zcy5vbmxpbmUgPT09IHRydWUgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB0aHVtYm5haWw6IHRodW1ibmFpbCxcbiAgICAgICAgICBydXRhU3J2OiBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aCksXG4gICAgICAgICAgZGVmYXVsdFBhdGg6IGRlZmF1bHRQYXRoXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9O1xuICAgICAgdmFyIHNlYXJjaE9uZUluQXJyYXkgPSBmdW5jdGlvbiAoc3JjSW1nKSB7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMudmlkZW9zLCB7IHBhdGg6IHNyY0ltZyB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmb3VuZFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGZvdW5kIGluIGFycmF5IHNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIGxvYWRUaHVtYm5haWwgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZpZGVvVGh1bWJuYWlsU2VydmljZS5nZW5lcmF0ZVRodW1ibmFpbChvYmoucGF0aCkudGhlbihmdW5jdGlvbiAodGh1bWJuYWlsU3JjKSB7XG4gICAgICAgICAgc2VhcmNoT25lSW5BcnJheShvYmoucGF0aCkudGh1bWJuYWlsID0gdGh1bWJuYWlsU3JjO1xuICAgICAgICAgIHZhciBzeW5jID0gZmFsc2U7XG4gICAgICAgICAgLy8gVE9ETzogb251cGxvYWQgZGVwZW5kZXJhIHNpIGVzdGEgb25saW5lIG8gbm8gcGFyYSBzYWJlciBzaSBzZSBpbnRlbnRhIHN1YmlyO1xuICAgICAgICAgIHZhciBvblVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgaW5zZXJ0VmlkZW8ob2JqLnBhdGgsIHN5bmMsIHRodW1ibmFpbFNyYywgb25VcGxvYWQsIG9iai5kZWZhdWx0UGF0aCk7XG4gICAgICAgICAgLy8gJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChvYmpWaWRlbyk7XG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICB2aWRlb1NlcnZpY2UudGFrZWRWaWQoKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgICBpZiAoIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YWlzVGFraW5nR2VvKSB7XG4gICAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGFpc1Rha2luZ0dlbyA9IHRydWU7XG4gICAgICAgICAgICBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIDtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2aWRlb0RhdGEpO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2aWRlb0RhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgZGVmYXVsdFBhdGggPSB2YWx1ZS5mdWxsUGF0aDtcbiAgICAgICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGRlZmF1bHRQYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeSwgY2hlY2tGaWxlU2VydmljZS5maWxlKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnLCBkZWZhdWx0UGF0aCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgICAgcy52aWRlb3MucHVzaChvYmopO1xuICAgICAgICAgICAgICAgIGxvYWRUaHVtYm5haWwob2JqKTsgIC8vIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICAgIHMuZ2V0VmlkRmlsZUNvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICBnZXRWaWRlb1NlcnZpY2UuZ2V0VmlkZW9Db21wcmVzcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICB2YXIgcmVzVmlkZW9Db21wcmVzcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgIC8vIFRPRE86IDEyNTgyOTEyIHNvbiAxMk1CIDtcbiAgICAgICAgICBpZiAoY2hlY2tGaWxlU2VydmljZS5maWxlLnNpemUgPCAxMjU4MjkxMikge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdmFyIGRlZmF1bHRQYXRoID0gdmFsdWUuZnVsbFBhdGg7XG4gICAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShkZWZhdWx0UGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSBydG5PYmpWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIGZhbHNlLCB0cnVlLCAnJywgZGVmYXVsdFBhdGgpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICBsb2FkVGh1bWJuYWlsKG9iaik7ICAvLyBwcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ2VsIGFyY2hpdm8gc3VwZXJhIGVsIHRhbWFcXHhGMWEgbWF4aW1vIHBlcm1pdGlkby4gbWF4aW1vIDEyTUInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzJywgcik7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBlcnJvcihjb2RlKSB7XG4gICAgICAgIGlmIChjb2RlID09PSAxKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vIGZpbGUgaGFuZGxlciBmb3VuZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdVbmRlZmluZWQgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcy5wbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPIDogbm8gbG9ncm8gcmVwcm9kdWNpciBsb3MgdmlkZW9zIGdyYWJhZG9zIGNvbiBlbCBtZWRpYSBkZSBjb3Jkb3ZhICwgZW4gY2FtYmlvIHNpIGxvIHB1ZWRvIGhhY2VyIGNvbiBsb3MgZ3JhYmFkb3MgY29uIGxhIGNhbWFyYSBmaWxtYWRvcmEgZnVlcmEgZGUgYWp1c3RldmFwcCwgc2VyYSBwb3IgbGEgdWJpY2FjaW9uIGRlbCBhcmNoaXZvPz8/XG4gICAgICAgIC8vIGNvcmRvdmEucGx1Z2lucy5kaXN1c2VyZWQub3BlbignZmlsZTovLy9kYXRhL2RhdGEvY29tLmFqdXN0ZXYuYi9maWxlcy8yMDE1MDUwN18xNzQ3MjYubXA0Jywgc3VjY2VzcywgZXJyb3IpO1xuICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuZGlzdXNlcmVkLm9wZW4oJ2ZpbGU6L3N0b3JhZ2UvZW11bGF0ZWQvMC9kY2ltL2NhbWVyYS8yMDE1MDUwNF8wNjMwMDkubXA0Jywgc3VjY2VzcywgZXJyb3IpO1xuICAgICAgfTtcbiAgICAgIHMucGxheVZpZGVvID0gZnVuY3Rpb24gKGZ1bGxQYXRoKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS5wbGF5VmlkZW8oZnVsbFBhdGgpLnRoZW4oc3VjY2VzcykuY2F0Y2goZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmZhY3RvcnkoJ3BsYXlWZHMnLCBwbGF5VmRzKTtcbiAgcGxheVZkcy4kaW5qZWN0ID0gWyckcSddO1xuICBmdW5jdGlvbiBwbGF5VmRzKCRxKSB7XG4gICAgcmV0dXJuIHsgcGxheVZkOiBwbGF5VmQgfTtcbiAgICBmdW5jdGlvbiBwbGF5VmQocGF0aCkge1xuICAgICAgLy8gdmFyIHBhdGggPSAnZmlsZTovc3RvcmFnZS9lbXVsYXRlZC8wL2RjaW0vY2FtZXJhLycgKyBmaWxlTmFtZTtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvcmRvdmEucGx1Z2lucy5kaXN1c2VyZWQub3BlbihwYXRoLCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgcS5yZXNvbHZlKHJlcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIHEucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH1cbiAgfVxufSgpKTsiLCJhcHAuZmFjdG9yeSgndmlkZW9TZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYXB0dXJlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3BsYXlWZHMnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYXB0dXJlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBwbGF5VmRzKSB7XG4gICAgdmFyIHZpZGVvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyA9IFtdO1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZFZpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBsaW1pdDogMSxcbiAgICAgICAgZHVyYXRpb246IDEyXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FwdHVyZS5jYXB0dXJlVmlkZW8ob3B0aW9ucykudGhlbihmdW5jdGlvbiAodmlkZW9EYXRhKSB7XG4gICAgICAgIHJldHVybiB2aWRlb0RhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0VmlkZW9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRWaWRlb3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyh2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgdGh1bWJuYWlsLCBvblVwbG9hZCwgZGVmYXVsdFBhdGgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZFZpZGVvcyhpZGluc3BlY2Npb24sIHBhdGgsc3luYyx1dWlkLHRodW1ibmFpbCwgb25VcGxvYWQsIHBsYWNhLCBmZWNoYSwgcnV0YVNydiwgZGVmYXVsdFBhdGggICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sID8sPyknO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZGluc3BlY2Npb24sXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aCksXG4gICAgICAgIGRlZmF1bHRQYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIC8vVE9ETzogZXMgZWwgcGF0aCBsYSBtZWpvciBmb3JtYSB5IG1hcyBlZmVjdGl2YSBkZSBoYWNlciBlbCB3aGVyZSBkZSBsYSBjb25zdWx0YVxuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZFZpZGVvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3BsYXlWaWRlbyA9IGZ1bmN0aW9uIChmdWxsUGF0aCkge1xuICAgICAgdmFyIGZpbGVOYW1lID0gZnVsbFBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgcmV0dXJuIHBsYXlWZHMucGxheVZkKGZ1bGxQYXRoKTtcbiAgICB9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuYWxsID0gX2FsbDtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnRha2VkVmlkID0gX3Rha2VkVmlkO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuZ2V0VmlkZW9zID0gX2dldFZpZGVvcztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5Lmluc2VydFZpZGVvID0gX2luc2VydFZpZGVvO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudXBkYXRlVmlkZW8gPSBfdXBkYXRlVmlkZW87XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5wbGF5VmlkZW8gPSBfcGxheVZpZGVvO1xuICAgIHJldHVybiB2aWRlb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=