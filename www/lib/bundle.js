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
var db = null;
var services = {};
var ngCordova = {};
var alreadyInspect = false;
var rp = null;
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
        templateUrl: 'templates/foto.html',
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
        templateUrl: 'templates/inspeccion.html',
        controller: 'InspeccionCtrl'
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
  $urlRouterProvider.otherwise('/app/placas');
  // TODO: para que se consideren sanas las ng-src que tengan esta sintaxis;
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
  $compileProvider.debugInfoEnabled(true);
});
var serviceBase = 'http://190.145.39.138/auth/';
app.constant('ngAuthSettings', {
  apiServiceBaseUri: serviceBase,
  clientId: 'ngAuthApp'
})

.config(function($provide) {
        $provide.decorator("$exceptionHandler", function($delegate, $injector) {
            return function(exception, cause) {
                $delegate(exception, cause);
                var sqliteService = $injector.get("sqliteService");
                var authService = $injector.get("authService");
                var momentService = $injector.get("momentService");
                    var query = 'INSERT  INTO [logs]([ex],[email],[fecha])  VALUES(?,?,?)';
                    var binding = [
                      angular.toJson(exception),
                      authService.authentication.userName  || '', 
                      momentService.getDateTime(),                     
                    ];
                    sqliteService.executeQuery(query, binding)
                    .then(function (res) {                     
                    }, function (err) {
                      console.error(err);
                    })
                // var alerting = $injector.get("alerting");
                // alerting.addDanger(exception.message);
            };
        });
    })

.run(function ($rootScope, $timeout, $ionicPlatform, $localStorage, $cordovaSQLite, checkFileService, videoThumbnailService, $cordovaCamera, fileTransferService, zumeroService, $cordovaFile, easyDirService, getVideoService, copyFileService, accesoriosService, inspeccionService, placasService, onlineStatusService, cordovaEventsService, toastService, offlineService, momentService, firstInitService, authService, deviceService, localStorageService, $state, intermediateService, unsyncService, fotosService, gpsService) {
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
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log(event, toState, toParams, fromState, fromParams);
      var authData = localStorageService.get('authorizationData');
      if (toState.name === 'app.login') {
        // doe she/he try to go to login? - let him/her go
        return;
      }
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
    services.zumeroService = zumeroService;
    services.getVideoService = getVideoService;
    services.copyFileService = copyFileService;
    services.fileTransferService = fileTransferService;
    services.videoThumbnailService = videoThumbnailService;
    services.easyDirService = easyDirService;
    services.checkFileService = checkFileService;
    services.accesoriosService = accesoriosService;
    services.inspeccionService = inspeccionService;
    services.unsyncService = unsyncService;
    services.placasService = placasService;
    services.onlineStatusService = onlineStatusService;
    services.cordovaEventsService = cordovaEventsService;
    services.toastService = toastService;
    services.offlineService = offlineService;
    services.localStorage = $localStorage;
    services.firstInitService = firstInitService;
    services.momentService = momentService;
    services.authService = authService;
    services.deviceService = deviceService;
    services.intermediateService = intermediateService;
    services.fotosService = fotosService;
    services.gpsService = gpsService;
    ngCordova.cordovaSQLite = $cordovaSQLite;
    ngCordova.cordovaFile = $cordovaFile;
    ngCordova.cordovaCamera = $cordovaCamera;
    // zs = zumeroService;
    // cs = ;
    // cf = ;
    // ed = easyDirService;
    // db = $cordovaSQLite.openDB('zdbfile.db', 1);
    // cc = $cordovaCamera;
    // cc = getVideoService;
    // services.zumeroService.setZumero('zdbfile');
    services.zumeroService.setZumero('zumerotestdbfile');
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
        fotosService.insertFoto($scope.idinspeccion, imageURI, sync, onupload).then(function () {
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
        fotosService.updateFoto($scope.idinspeccion, imageURI, sync, onupload).then(function () {
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
  function (s, fotosService, $ionicPlatform, $ionicScrollDelegate, fileTransferService, $filter, $stateParams, $ionicNavBarDelegate, copyFileService, checkFileService, titleService, offlineService, errorService, onlineStatusService, intermediateService, toastService, zumeroService, momentService, gpsService) {
    $ionicPlatform.ready(function () {
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
      s.getPhotos = function () {
        fotosService.getPhotos(s.idinspeccion).then(function () {
          s.photos = fotosService.photos;
          s.names = fotosService.names;
          _filterUnsync(0);
        });
      };
      s.getPhotos();
      s.$on('myEvent', function () {
        console.log('my event occurred');
        s.getPhotos();
      });
      var _filterUnsync = function (equal) {
        var found = $filter('filter')(s.photos, { sync: equal }, true);
        // console.log(s.photos, found);
        s.imgUnsync = found;
      };
      var updateFoto = function (imageURI, sync, onupload) {
        fotosService.updateFoto(s.idinspeccion, imageURI, sync, onupload).then(function () {
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
      var insertFoto = function (imageURI, sync, onupload) {
        fotosService.insertFoto(s.idinspeccion, imageURI, sync, onupload).then(function () {
          console.log('en el controller despues de sqlite foto ');
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
      var rtnObjectFoto = function (placa, path, sync, onUpload) {
        var obj = {
          placa: placa,
          path: path,
          sync: sync,
          onUpload: onUpload,
          //s.oss.online === true ? true : false
          rutaSrv: momentService.rutaSrv(path)
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
            var obj = rtnObjectFoto(intermediateService.data.placa, res.nativeURL, sync, onupload);
            s.photos.push(obj);
            insertFoto(res.nativeURL, sync, onupload);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
            // TODO: es mejor llamar a una funcion, por que asi se ejecuta para cada uno, y se ejecuta bien, en vez de llamar filupload desde aca
            //preFileUpload(res.nativeURL);  // $scope.photos.push(res.nativeURL);
            preFileUpload(obj);
          }, errorService.consoleError);
        }, errorService.consoleError);  // $cordovaCamera.cleanup().then(fnSuccess,errorService.consoleError); // only for FILE_URI  
      };
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
  function ($scope, zumeroService, $ionicPlatform, placasService, $ionicNavBarDelegate, $location, $ionicPopup, $ionicScrollDelegate, focus, $state, titleService, $ionicModal, toastService, firstInitService, $localStorage, $ionicLoading, $filter, intermediateService) {
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
      // TODO: seria bueno que la consulta de placas supiera todo, como por ejemplo si ya se califico, si ya tiene alguna foto o un video, puede ser marcandolo con alguna clase
      if (!$localStorage.data) {
        $scope.show();
        // TODO: puedo poder obj=null, para que me elimine la base de datos si ya esta creada y vuelva a sincronizar, esto seria beneficioso si tengo que hacer un cambio en la base de ddatos que requiera reconstruirla
        firstInitService.init().then(function () {
          $scope.hide();
          $scope.getPlacas();
        }, function () {
          $scope.hide();
        });
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
      $scope.createException = function() {
            throw new Error("Something has gone terribly wrong!");
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
      videoService.getVideos(s.idinspeccion).then(function () {
        s.videos = videoService.videos;
      });
      // var errorService.consoleError = function (e) {
      //   console.log('error', e);
      // };
      var insertVideo = function (imageURI, sync, thumbnail, onupload) {
        videoService.insertVideo(s.idinspeccion, imageURI, sync, thumbnail, onupload).then(function () {
          console.log('en el controller despues de insert sqlite video ');
        });
      };
      var updateVideo = function (imageURI, sync, thumbnail, onupload) {
        videoService.updateVideo(s.idinspeccion, imageURI, sync, onupload).then(function () {
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
            // $location.path('/app/placas');
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
  '$injector',
  '$location',
  'localStorageService',
  function ($q, $injector, $location, localStorageService) {
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
app.factory('fotosService', [
  '$cordovaCamera',
  '$cordovaFile',
  'sqliteService',
  'intermediateService',
  'momentService',
  function ($cordovaCamera, $cordovaFile, sqliteService, intermediateService, momentService) {
    var fotosServiceFactory = {};
    fotosServiceFactory.photos = [];
    fotosServiceFactory.names = [];
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
      var query = 'SELECT  IdTipo, Nombre, Valor, Orden FROM  Base_Tipos WHERE (IdMaestroTipos = 25) order by Nombre';
      var binding = [];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        fotosServiceFactory.names = sqliteService.rtnArray(res);  // $rootScope.$apply();
                                                                  // console.log(fotosServiceFactory.photos);
      }, function (error) {
        console.log(error);
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
      var query = 'INSERT INTO idfotos(idinspeccion, path,sync,uuid,deleted, onUpload, placa, fecha, rutaSrv) VALUES (?,?,?,?,?,?,?,?, ?)';
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
        momentService.rutaSrv(imageURI)
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
    return fotosServiceFactory;
  }
]);
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
app.factory('inspeccionService', [
  'sqliteService',
  '$q',
  '$filter',
  'errorService',
  'momentService',
  'zumeroService',
  function (sqliteService, $q, $filter, errorService, momentService, zumeroService) {
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
        inspeccionServiceFactory.idinspeccion,
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
      var query = 'INSERT INTO [observaciones] ([idinspeccion] ,[idsubproceso]  ,[observacion])   VALUES (?,?,?)';
      var binding = [
        inspeccionServiceFactory.idinspeccion,
        829,
        //_cl.tipo,
        inspeccionServiceFactory.data.observacion
      ];
      return sqliteService.executeQuery(query, binding);
    };
    var _insertKilometraje = function () {
      var query = 'INSERT INTO [kilometrajes]        ([idinspeccion], [kilometraje])      VALUES (?,?)';
      var binding = [
        inspeccionServiceFactory.idinspeccion,
        inspeccionServiceFactory.data.kilometraje
      ];
      return sqliteService.executeQuery(query, binding);
    };
    var _rtnBindingUpdate = function (obj) {
      var binding = [
        parseInt(obj.sl.value),
        obj.sl.label,
        inspeccionServiceFactory.idinspeccion,
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
        inspeccionServiceFactory.idinspeccion,
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
        inspeccionServiceFactory.idinspeccion,
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
        inspeccionServiceFactory.idinspeccion
      ];
      return sqliteService.executeQuery(query, binding).then(function (res) {
        return _insertState(477);
      }, errorService.consoleError);
    };
    var _insertState = function (idestado) {
      var query = 'INSERT INTO [idsubprocesoseguimiento] ([idinspeccion]    ,[idsubproceso]   ,[idestado]   ,[fecha]  )  VALUES    (?,?,?,?)';
      var binding = [
        inspeccionServiceFactory.idinspeccion,
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
        return zumeroService.zync(1).then(function () {
          return updateSyncService.selectIdinspeccionSync(placa).then(function () {
            return _getPlacas();
          });
        }, function () {
          console.log('error on zumero sync desde ps');
          return _getPlacas();
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiY29udHJvbGxlcnMvQWNjZXNvcmlvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9Gb3RvQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9QbGFjYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9WaWRlb0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZWFzeURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9lcnJvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9maWxlVHJhbnNmZXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlyc3RJbml0U2VydmljZS5qcyIsInNlcnZpY2VzL2ZvY3VzU2VydmljZS5qcyIsInNlcnZpY2VzL2ZvdG9zU2VydmljZS5qcyIsInNlcnZpY2VzL2dldFZpZGVvU2VydmljZS5qcyIsInNlcnZpY2VzL2dwc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9pbnNwZWNjaW9uU2VydmljZS5qcyIsInNlcnZpY2VzL2ludGVybWVkaWF0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9tb21lbnRTZXJ2aWNlLmpzIiwic2VydmljZXMvb2ZmbGluZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vbmxpbmVTdGF0dXNTZXJ2aWNlLmpzIiwic2VydmljZXMvcGxhY2FzU2VydmljZS5qcyIsInNlcnZpY2VzL3NxbGl0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90aXRsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90b2FzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy91bnN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdXBkYXRlU3luY1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1RodW1ibmFpbFNlcnZpY2UuanMiLCJzZXJ2aWNlcy96dW1lcm9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbi8vIHZhciBscyA9IG51bGw7XG4vLyB2YXIgenVtZXJvID0gbnVsbDtcbi8vIHZhciBjcyA9IG51bGw7XG4vLyB2YXIgenMgPSBudWxsO1xuLy8gdmFyIHBzID0gbnVsbDtcbi8vIHZhciBwYyA9IG51bGw7XG4vLyB2YXIgY2YgPSBudWxsO1xuLy8gdmFyIGVkID0gbnVsbDtcbi8vIHZhciBjYyA9IG51bGw7XG52YXIgZGIgPSBudWxsO1xudmFyIHNlcnZpY2VzID0ge307XG52YXIgbmdDb3Jkb3ZhID0ge307XG52YXIgYWxyZWFkeUluc3BlY3QgPSBmYWxzZTtcbnZhciBycCA9IG51bGw7XG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbXG4gICdpb25pYycsXG4gICdzdGFydGVyLmNvbnRyb2xsZXJzJyxcbiAgJ25nU3RvcmFnZScsXG4gICduZ0NvcmRvdmEnLFxuICAndWkudXRpbHMnLFxuICAnbmdGeCcsXG4gICduZ0FuaW1hdGUnLFxuICAnYW5ndWxhci1sb2FkaW5nLWJhcicsXG4gICdMb2NhbFN0b3JhZ2VNb2R1bGUnXG5dKS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIsIGNmcExvYWRpbmdCYXJQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZTtcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yU2VydmljZScpO1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgIHVybDogJy9hcHAnLFxuICAgIGFic3RyYWN0OiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL21lbnUuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FwcEN0cmwnXG4gIH0pLnN0YXRlKCdhcHAuc2VhcmNoJywge1xuICAgIHVybDogJy9zZWFyY2gnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvc2VhcmNoLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLmJyb3dzZScsIHtcbiAgICB1cmw6ICcvYnJvd3NlJyxcbiAgICB2aWV3czogeyAnbWVudUNvbnRlbnQnOiB7IHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2Jyb3dzZS5odG1sJyB9IH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGF5bGlzdHMnLCB7XG4gICAgdXJsOiAnL3BsYXlsaXN0cycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxheWxpc3RzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAucGxhY2FzJywge1xuICAgIHVybDogJy9wbGFjYXMnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYWNhcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYWNhc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnNpbmdsZScsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzLzpwbGF5bGlzdElkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1BsYXlsaXN0Q3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuZm90bycsIHtcbiAgICB1cmw6ICcvZm90b3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9mb3RvLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRm90b0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLnZpZGVvJywge1xuICAgIHVybDogJy92aWRlby86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3ZpZGVvLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVmlkZW9DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5pbnNwZWNjaW9uJywge1xuICAgIHVybDogJy9pbnNwZWNjaW9uLzppZC86cGxhY2EvOmNhbGlmaWNhZG8nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2luc3BlY2Npb24uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdJbnNwZWNjaW9uQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAubG9naW4nLCB7XG4gICAgdXJsOiAnL2xvZ2luJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbklvbmljLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5hY2Nlc29yaW9zJywge1xuICAgIHVybDogJy9hY2Nlc29yaW9zLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWNjZXNvcmlvcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0FjY2Vzb3Jpb3NDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvcGxhY2FzJyk7XG4gIC8vIFRPRE86IHBhcmEgcXVlIHNlIGNvbnNpZGVyZW4gc2FuYXMgbGFzIG5nLXNyYyBxdWUgdGVuZ2FuIGVzdGEgc2ludGF4aXM7XG4gICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZmlsZXxibG9ifGNkdmZpbGV8Y29udGVudCk6fGRhdGE6aW1hZ2VcXC8vKTtcbiAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKHRydWUpO1xufSk7XG52YXIgc2VydmljZUJhc2UgPSAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvJztcbmFwcC5jb25zdGFudCgnbmdBdXRoU2V0dGluZ3MnLCB7XG4gIGFwaVNlcnZpY2VCYXNlVXJpOiBzZXJ2aWNlQmFzZSxcbiAgY2xpZW50SWQ6ICduZ0F1dGhBcHAnXG59KVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgICAgICRwcm92aWRlLmRlY29yYXRvcihcIiRleGNlcHRpb25IYW5kbGVyXCIsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSwgJGluamVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXhjZXB0aW9uLCBjYXVzZSkge1xuICAgICAgICAgICAgICAgICRkZWxlZ2F0ZShleGNlcHRpb24sIGNhdXNlKTtcbiAgICAgICAgICAgICAgICB2YXIgc3FsaXRlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoXCJzcWxpdGVTZXJ2aWNlXCIpO1xuICAgICAgICAgICAgICAgIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoXCJhdXRoU2VydmljZVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9tZW50U2VydmljZSA9ICRpbmplY3Rvci5nZXQoXCJtb21lbnRTZXJ2aWNlXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUICBJTlRPIFtsb2dzXShbZXhdLFtlbWFpbF0sW2ZlY2hhXSkgIFZBTFVFUyg/LD8sPyknO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLnRvSnNvbihleGNlcHRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lICB8fCAnJywgXG4gICAgICAgICAgICAgICAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLCAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykgeyAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIHZhciBhbGVydGluZyA9ICRpbmplY3Rvci5nZXQoXCJhbGVydGluZ1wiKTtcbiAgICAgICAgICAgICAgICAvLyBhbGVydGluZy5hZGREYW5nZXIoZXhjZXB0aW9uLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSlcblxuLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQsICRpb25pY1BsYXRmb3JtLCAkbG9jYWxTdG9yYWdlLCAkY29yZG92YVNRTGl0ZSwgY2hlY2tGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCAkY29yZG92YUNhbWVyYSwgZmlsZVRyYW5zZmVyU2VydmljZSwgenVtZXJvU2VydmljZSwgJGNvcmRvdmFGaWxlLCBlYXN5RGlyU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjb3B5RmlsZVNlcnZpY2UsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBpbnNwZWNjaW9uU2VydmljZSwgcGxhY2FzU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgY29yZG92YUV2ZW50c1NlcnZpY2UsIHRvYXN0U2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkc3RhdGUsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVuc3luY1NlcnZpY2UsIGZvdG9zU2VydmljZSwgZ3BzU2VydmljZSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICB9XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICBjb25zb2xlLmxvZyhldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmICh0b1N0YXRlLm5hbWUgPT09ICdhcHAubG9naW4nKSB7XG4gICAgICAgIC8vIGRvZSBzaGUvaGUgdHJ5IHRvIGdvIHRvIGxvZ2luPyAtIGxldCBoaW0vaGVyIGdvXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYXV0aERhdGEgfHwgbW9tZW50U2VydmljZS5kaWZmTm93KGF1dGhEYXRhLmV4cCwgJ20nKSA+IC02MCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlZGlyZWN0Jyk7XG4gICAgICAgICAgLy9XYXMgY2FsbGluZyB0aGlzIGJ1dCBjb21tZW50aW5nIG91dCB0byBrZWVwIGl0IHNpbXBsZTogYXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgLy9DaGFuZ2VzIFVSTCBidXQgbm90IHRoZSB2aWV3IC0gZ29lcyB0byBvcmlnaW5hbCB2aWV3IHRoYXQgSSdtIHRyeWluZyB0byByZWRpcmVjdFxuICAgICAgICAgIC8vYXdheSBmcm9tIG5vdyB3aXRoIDEuMy4gRmluZSB3aXRoIGl0IGJ1dCBpbnRlcmVzdGVkIGluIHVuZGVyc3RhbmRpbmcgdGhlIFxuICAgICAgICAgIC8vXCJwcm9wZXJcIiB3YXkgdG8gZG8gaXQgbm93IHNvIGxvZ2luIHZpZXcgZ2V0cyByZWRpcmVjdGVkIHRvLlxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7ICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vTmljZSBhZGRpdGlvbiEgQ2FuJ3QgZG8gYW55IHJlZGlyZWN0IHdoZW4gaXQncyBjYWxsZWQgdGhvdWdoXG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxzID0gJGxvY2FsU3RvcmFnZTtcbiAgICAvLyB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2UgPSB6dW1lcm9TZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmdldFZpZGVvU2VydmljZSA9IGdldFZpZGVvU2VydmljZTtcbiAgICBzZXJ2aWNlcy5jb3B5RmlsZVNlcnZpY2UgPSBjb3B5RmlsZVNlcnZpY2U7XG4gICAgc2VydmljZXMuZmlsZVRyYW5zZmVyU2VydmljZSA9IGZpbGVUcmFuc2ZlclNlcnZpY2U7XG4gICAgc2VydmljZXMudmlkZW9UaHVtYm5haWxTZXJ2aWNlID0gdmlkZW9UaHVtYm5haWxTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmVhc3lEaXJTZXJ2aWNlID0gZWFzeURpclNlcnZpY2U7XG4gICAgc2VydmljZXMuY2hlY2tGaWxlU2VydmljZSA9IGNoZWNrRmlsZVNlcnZpY2U7XG4gICAgc2VydmljZXMuYWNjZXNvcmlvc1NlcnZpY2UgPSBhY2Nlc29yaW9zU2VydmljZTtcbiAgICBzZXJ2aWNlcy5pbnNwZWNjaW9uU2VydmljZSA9IGluc3BlY2Npb25TZXJ2aWNlO1xuICAgIHNlcnZpY2VzLnVuc3luY1NlcnZpY2UgPSB1bnN5bmNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLm9ubGluZVN0YXR1c1NlcnZpY2UgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmNvcmRvdmFFdmVudHNTZXJ2aWNlID0gY29yZG92YUV2ZW50c1NlcnZpY2U7XG4gICAgc2VydmljZXMudG9hc3RTZXJ2aWNlID0gdG9hc3RTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLm9mZmxpbmVTZXJ2aWNlID0gb2ZmbGluZVNlcnZpY2U7XG4gICAgc2VydmljZXMubG9jYWxTdG9yYWdlID0gJGxvY2FsU3RvcmFnZTtcbiAgICBzZXJ2aWNlcy5maXJzdEluaXRTZXJ2aWNlID0gZmlyc3RJbml0U2VydmljZTtcbiAgICBzZXJ2aWNlcy5tb21lbnRTZXJ2aWNlID0gbW9tZW50U2VydmljZTtcbiAgICBzZXJ2aWNlcy5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmRldmljZVNlcnZpY2UgPSBkZXZpY2VTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmludGVybWVkaWF0ZVNlcnZpY2UgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmZvdG9zU2VydmljZSA9IGZvdG9zU2VydmljZTtcbiAgICBzZXJ2aWNlcy5ncHNTZXJ2aWNlID0gZ3BzU2VydmljZTtcbiAgICBuZ0NvcmRvdmEuY29yZG92YVNRTGl0ZSA9ICRjb3Jkb3ZhU1FMaXRlO1xuICAgIG5nQ29yZG92YS5jb3Jkb3ZhRmlsZSA9ICRjb3Jkb3ZhRmlsZTtcbiAgICBuZ0NvcmRvdmEuY29yZG92YUNhbWVyYSA9ICRjb3Jkb3ZhQ2FtZXJhO1xuICAgIC8vIHpzID0genVtZXJvU2VydmljZTtcbiAgICAvLyBjcyA9IDtcbiAgICAvLyBjZiA9IDtcbiAgICAvLyBlZCA9IGVhc3lEaXJTZXJ2aWNlO1xuICAgIC8vIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKCd6ZGJmaWxlLmRiJywgMSk7XG4gICAgLy8gY2MgPSAkY29yZG92YUNhbWVyYTtcbiAgICAvLyBjYyA9IGdldFZpZGVvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnemRiZmlsZScpO1xuICAgIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6dW1lcm90ZXN0ZGJmaWxlJyk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5vbk9ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PZmZsaW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuY29ublR5cGUoKTtcbiAgICBjb3Jkb3ZhRXZlbnRzU2VydmljZS5vblBhdXNlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25SZXN1bWUoKTtcbiAgICBkZXZpY2VTZXJ2aWNlLnNldEluZm8oKTtcbiAgICAvLyBUT0RPOiAgdmVyaWZpY2FyIHNpIGV4aXN0ZSBlbiBlbCBsb2NhbHN0b3JhZ2UgYWxndW5hIGJhbmRlcmEgcXVlIGRpZ2Egc2kgeWEgc2Ugc3luYyBhbGd1bmEgdmV6IFxuICAgICRsb2NhbFN0b3JhZ2UubWVzc2FnZSA9ICdIZWxsbyBXb3JsZCc7XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7ICAvLyB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbiB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICB9KTtcbn0pOyAgLy8gYXBwLnJ1bihbXG4gICAgIC8vICAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAgICAvLyAgICckbG9jYXRpb24nLFxuICAgICAvLyAgIGZ1bmN0aW9uIChsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgICAgLy8gICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAvLyAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgLy8gICAgICAgLy8gVE9ETzogZXN0byBubyBlcyBuZWNlc2FyaW8sIHBvciBxdWUgYWwgaW50ZW50YXIgc2luY3Jvbml6YXIgdW5hIGltYWdlbiB5IGVsIHRva2VuIGVzdGEgdmVuY2lkbywgc2UgcmVkaXJlY2Npb25hIGEgbG9naW4gYXV0b21hdGljYW1lbnRlXG4gICAgIC8vICAgICAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgIC8vICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgIC8vICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgLy8gICAgICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpID4gMCkge1xuICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbicpO1xuICAgICAvLyAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgICAgfVxuICAgICAvLyAgICAgfVxuICAgICAvLyAgIH1cbiAgICAgLy8gXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycsIFtdKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTW9kYWwsICR0aW1lb3V0KSB7XG4gIC8vIEZvcm0gZGF0YSBmb3IgdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcbiAgLy8gQ3JlYXRlIHRoZSBsb2dpbiBtb2RhbCB0aGF0IHdlIHdpbGwgdXNlIGxhdGVyXG4gICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL2xvZ2luLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgfSk7XG4gIC8vIFRyaWdnZXJlZCBpbiB0aGUgbG9naW4gbW9kYWwgdG8gY2xvc2UgaXRcbiAgJHNjb3BlLmNsb3NlTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgfTtcbiAgLy8gT3BlbiB0aGUgbG9naW4gbW9kYWxcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gIH07XG4gIC8vIFBlcmZvcm0gdGhlIGxvZ2luIGFjdGlvbiB3aGVuIHRoZSB1c2VyIHN1Ym1pdHMgdGhlIGxvZ2luIGZvcm1cbiAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RvaW5nIGxvZ2luJywgJHNjb3BlLmxvZ2luRGF0YSk7XG4gICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXG4gICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jbG9zZUxvZ2luKCk7XG4gICAgfSwgMTAwMCk7XG4gIH07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAkc2NvcGUucGxheWxpc3RzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnUmVnZ2FlJyxcbiAgICAgIGlkOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NoaWxsJyxcbiAgICAgIGlkOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0R1YnN0ZXAnLFxuICAgICAgaWQ6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnSW5kaWUnLFxuICAgICAgaWQ6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUmFwJyxcbiAgICAgIGlkOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0Nvd2JlbGwnLFxuICAgICAgaWQ6IDZcbiAgICB9XG4gIF07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdBY2Nlc29yaW9zQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJ3BsYWNhc1NlcnZpY2UnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRpb25pY1BvcHVwJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZvY3VzJyxcbiAgJyRzdGF0ZScsXG4gICckaW9uaWNTaWRlTWVudURlbGVnYXRlJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNNb2RhbCcsXG4gICdhY2Nlc29yaW9zU2VydmljZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCBhY2Nlc29yaW9zU2VydmljZSwgZm90b3NTZXJ2aWNlLCBjb3B5RmlsZVNlcnZpY2UsIGVycm9yU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvL3BhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAkc2NvcGUudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy9cbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL29wZW5OZXdBY2Nlc29yaW8uaHRtbCcsIHsgc2NvcGU6ICRzY29wZSB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLmFjY2VzID0gW107XG4gICAgICAkc2NvcGUuc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2NlcyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmFsbDtcbiAgICAgIH07XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0IGl0ZW1zIGVuICBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgfSk7XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5pbml0T3B0aW9ucygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIGNvbnRyb2xhZG9yJyk7XG4gICAgICAgICRzY29wZS5vcHRpb25zID0gYWNjZXNvcmlvc1NlcnZpY2UuaW5pdERhdGE7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5pbml0YWNjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjID0gYWNjZXNvcmlvc1NlcnZpY2UuaW5pdEFjYygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5zaG93TW9kYWxOZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5pbml0YWNjKCk7XG4gICAgICAgICRzY29wZS5tb2RzaG93ID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYyg0KTtcbiAgICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTsgIC8vICRzY29wZS5hY2Nlcy5wdXNoKCRzY29wZS5hY2MpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLnBhdGggPSAnaHR0cDovL2kuZGFpbHltYWlsLmNvLnVrL2kvcGl4LzIwMTQvMDMvMjMvYXJ0aWNsZS0yNTg3NDU0LTFDODY0OTkxMDAwMDA1NzgtNDM4XzYzNHg0MzAuanBnJztcbiAgICAgIH07XG4gICAgICAkc2NvcGUubW9kID0gZnVuY3Rpb24gKGFjYykge1xuICAgICAgICAkc2NvcGUubW9kc2hvdyA9IHRydWU7XG4gICAgICAgICRzY29wZS5hY2MgPSBhY2M7XG4gICAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlQWN0TW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IEFRVUkgVEVORFJJQSBRVUUgSEFDRVIgRUwgVVBEQVRFIFxuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgIHZhciBpbnNlcnRGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UuaW5zZXJ0Rm90bygkc2NvcGUuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKCRzY29wZS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcuc3luYyA9IHN5bmM7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLm9uVXBsb2FkID0gb25VcGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9uVXBsb2FkKTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gZmFsc2U7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIGZvdG8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKGZvdG8pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSB0cnVlO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGFrZWRwaWMoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAgICAgICB2YXIgb25VcGxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcuc3luYyA9IHN5bmM7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5vblVwbG9hZCA9IG9uVXBsb2FkO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcucGF0aCA9IHJlcy5uYXRpdmVVUkw7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5ydXRhU3J2ID0gbW9tZW50U2VydmljZS5ydXRhU3J2KHJlcy5uYXRpdmVVUkwpO1xuICAgICAgICAgICAgaW5zZXJ0Rm90byhyZXMubmF0aXZlVVJMLCBzeW5jLCBvblVwbG9hZCk7XG4gICAgICAgICAgICBwcmVGaWxlVXBsb2FkKCRzY29wZS5hY2MuaW1nKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZm5FcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdGb3RvQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICckZmlsdGVyJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICBmdW5jdGlvbiAocywgZm90b3NTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGdwc1NlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzLnRpdHRsZSA9ICcnO1xuICAgICAgcy50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICBzLmltZ1Vuc3luYyA9IFtdO1xuICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBGVU5DSU9OQSBCSUVOIFBBUkEgVkVSIEVMIENBTUJJTyBJTk1FRElBVEFNRU5URVxuICAgICAgLy8gcy5vbmxpbmVTdGF0dXMgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIFJFUVVJRVJFIE9UUk8gRElHRVNUIFBBUkEgUVVFIEZVTkNJT05FXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEUgIEVTIE1FSk9SIFJBU1RSRUFSIFNJRU1QUkUgVU4gT0JKRVRPXG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIC8vICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAvLyBUT0RPOiBvbmhvbGQgY2FuIGVkaXQgcGxhY2EsIG9uIHN3aXBlIGxlZnQgZGVsZXRlIHdpdGggY29uZmlybVxuICAgICAgLy8gVE9ETzogYWx3YXlzIHVzZSBpb24tbmF2LXRpdGxlICwgcGFyYSBwb2RlcmxlIHBvbmVyIGxvcyB0aXR1bG9zIHF1ZSBxdWllcm9cbiAgICAgIC8vIHMub3NzID0geyBvbmxpbmU6IG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUgfTtcbiAgICAgIHMucGhvdG9zID0gZm90b3NTZXJ2aWNlLnBob3RvcztcbiAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICBzLmdldFBob3RvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmdldFBob3RvcyhzLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5waG90b3MgPSBmb3Rvc1NlcnZpY2UucGhvdG9zO1xuICAgICAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICAgICAgX2ZpbHRlclVuc3luYygwKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIHMuJG9uKCdteUV2ZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXkgZXZlbnQgb2NjdXJyZWQnKTtcbiAgICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIF9maWx0ZXJVbnN5bmMgPSBmdW5jdGlvbiAoZXF1YWwpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy5waG90b3MsIHsgc3luYzogZXF1YWwgfSwgdHJ1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHMucGhvdG9zLCBmb3VuZCk7XG4gICAgICAgIHMuaW1nVW5zeW5jID0gZm91bmQ7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKHMuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMubWFzc2l2ZUxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocy5tYXNzaXZlTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzLm1hc3NpdmVMZW5ndGgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoLCAnc3luYycpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgLy9UT0RPIDogQ1VBTkRPIEVTIFVOQSBTT0xBIEVTVEEgQklFTiwgQ1VFTkFPRCBFUyBVTiBBUlJBWSBERUJPIERFIEhBQ0VSIFFVRSBTWU5DIENPTiBMQSBVTFRJTUEgRk9UTyBVTiAuTEVOVEhHIFBVRURFIFNFUlxuICAgICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIHZhciBpbnNlcnRGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UuaW5zZXJ0Rm90byhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpGb3RvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9iakZvdG8ucHJvZ3Jlc3MgPSBwZXJjZW50YWdlO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqZWN0Rm90byA9IGZ1bmN0aW9uIChwbGFjYSwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICAvLyBUT0RPOiBIQUJSQSBPVFJBIEZPUk1BIERFIEZJTFRBUiBNQVMgUkFQSURBIEsgRUwgU1RSSU5HIFBBVEg7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHBhdGg6IHNyY0ltZyB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmb3VuZFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGZvdW5kIGluIGFycmF5IHNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqRm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQob2JqRm90byk7XG4gICAgICB9O1xuICAgICAgLy8gcy5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgICAvLyAgIHMub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAgIC8vICAgaWYgKGJvb2wpIHtcbiAgICAgIC8vICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfTtcbiAgICAgIHMuc3luY0ltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcy5tYXNzaXZlTGVuZ3RoID0gcy5pbWdVbnN5bmMubGVuZ3RoO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gocy5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgIHMudHJ5VXBsb2FkKG9iaik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuc2V0bmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKG5vbWJyZSwgZm90byk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkdGlwbywgZm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS5zZXROYW1lKGlkdGlwbywgZm90bykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gdHJ1ZTtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnRha2VkcGljKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgICAvLyBUT0RPOiBwYXJhIGxhcyB0YWJsZXRzIGFwYWdvIGVsIGdwcywgeSBhbGdvIHBhc2EgY29uIGxhIGNhbWFyYVxuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZVVSSSk7XG4gICAgICAgICAgLy8gZm90b3NTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9udXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGjCv2d1YXJkYXIgYXF1aSBlbCBzcWxpdGUgeSBsdWVnbyBhY3R1YWxpemFybG8gc2kgc3ViZSBleGl0b3NvO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9iamVjdEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgICAgICBzLnBob3Rvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbWFpblNjcm9sbCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGxsYW1hciBhIHVuYSBmdW5jaW9uLCBwb3IgcXVlIGFzaSBzZSBlamVjdXRhIHBhcmEgY2FkYSB1bm8sIHkgc2UgZWplY3V0YSBiaWVuLCBlbiB2ZXogZGUgbGxhbWFyIGZpbHVwbG9hZCBkZXNkZSBhY2FcbiAgICAgICAgICAgIC8vcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTsgIC8vICRzY29wZS5waG90b3MucHVzaChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdJbnNwZWNjaW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHRpdGxlU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRmaWx0ZXIsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIHNxbGl0ZVNlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmNhbGlmaWNhZG8pID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAkc2NvcGUuZGF0YSA9IGluc3BlY2Npb25TZXJ2aWNlLmRhdGE7XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGNpb25Nb2RhbC5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICB9KTtcbiAgICAvLyBUT0RPOiBjb21vIGVzdG8gc2Ugc2luY3Jvbml6YSB1bmEgc29sYSB2ZXosIG5vIGhheSBwcm9ibGVtYSBjb24gZWwgaWRpbnNwZWNjaW9uLCBlbCBwcm9ibGVtYSBlc3RhIGVuIGFjY2Vzb3Jpb3MgeSBlbiBmb3RvcywgcXVlIHNlIHN1YmUgdW5vIGEgdW5vLCBlbnRvbmNlcyBwb2RyaWEgY2FtYmlhciwgbyBlbiBhY2Nlc29yaW9zIGhhY2VyIHVuIGJlZm9ybGVhdmUgZGUgdmlldywgbWkgcHJlZ3VudGEgZXMgLCBzaSBubyBhYmFuZG9uYSBsYSB2aWV3LCBjb21vIHNpbmNyb25pem8/IG90cmEgbWFzIHNpIHBhc28gYSBiYWNrZ3JvdW5kIHB1ZWRvIHNpbmNyb25pemFyPz8/XG4gICAgLy8gVE9ETzogZXN0YSB2YXJpYWJsZSBtZSBsYSBkYSBsYSBwYmFzZSBkZSBzYXRvcywgc2kgeWEgZXN0YSBjYWxpZmljYWRvIG8gbm9cbiAgICAkc2NvcGUub2JqID0geyBjdXN0b21zZWN0aW9uOiAwIH07XG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuc2hvdygpO1xuICAgIC8vICR0aW1lb3V0KCRzY29wZS5oaWRlLCAxNTAwMCk7XG4gICAgJHNjb3BlLml0ZW1zID0gW107XG4gICAgLy8gaW5pdGlhbCBpbWFnZSBpbmRleFxuICAgICRzY29wZS5fSW5kZXggPSAwO1xuICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5zZWN0aW9ucywgaSk7XG4gICAgICAkc2NvcGUub2JqLmN1c3RvbXNlY3Rpb24gPSAkc2NvcGUuc2VjdGlvbnNbaV0uY3VzdG9tc2VjdGlvbjtcbiAgICAgIC8vICRzY29wZS5zZXRNaW4oKTtcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgIH07XG4gICAgLy9yZWZlbmNlIHNlcnZpY2VcbiAgICAvLyBpZiBhIGN1cnJlbnQgaW1hZ2UgaXMgdGhlIHNhbWUgYXMgcmVxdWVzdGVkIGltYWdlXG4gICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gJHNjb3BlLl9JbmRleCA9PT0gaW5kZXg7XG4gICAgfTtcbiAgICAvLyBzaG93IHByZXYgaW1hZ2VcbiAgICAkc2NvcGUuc2hvd1ByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuX0luZGV4ID0gJHNjb3BlLl9JbmRleCA+IDAgPyAtLSRzY29wZS5fSW5kZXggOiAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgLy8gc2hvdyBuZXh0IGltYWdlXG4gICAgJHNjb3BlLnNob3dOZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPCAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMSA/ICsrJHNjb3BlLl9JbmRleCA6IDA7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8qIFNob3cgbGlzdCAqL1xuICAgICRzY29wZS5zaG93SXRlbXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgLy8gVE9ETzogcGFyYSBkZXNoYWJpbGl0YXIgZWwgdXBkYXRlLCBhdW5xdWUgeWEgZXN0YSBtb250YWRvLCBtZSBwcmVvY3VwYSBlcyBlbCB6eW5jIGNhZGEgcXVlIHNlIGhhZ2EgdW4gdXBkYXRlXG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVtLmRpcnR5ID0gdHJ1ZTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLml0ZW0gPSBpdGVtO1xuICAgICAgJHNjb3BlLml0ZW0gPSBpbnNwZWNjaW9uU2VydmljZS5pdGVtO1xuICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICB9O1xuICAgIC8qIEhpZGUgbGlzdCAqL1xuICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnZhbGlkYXRlU2luZ2xlID0gZnVuY3Rpb24gKG9wY2lvbikge1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHRleHRcbiAgICAgICRzY29wZS5pdGVtLnNsLmxhYmVsID0gb3BjaW9uLmxhYmVsO1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHZhbHVlXG4gICAgICAkc2NvcGUuaXRlbS5zbC52YWx1ZSA9IG9wY2lvbi52YWx1ZTtcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnVwZGF0ZVNpbmdsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvayB1cGRhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBIaWRlIGl0ZW1zXG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zKCk7ICAvLyBFeGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgfTtcbiAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdHdWFyZGFuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFscmVhZHlTYXZlZCA9IGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuaGlkZSgpO1xuICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2UuY2xlYXJUaXBvKCk7XG4gICAgICAkc2NvcGUuY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICRzY29wZS5jbC50aXBvID0gbnVsbDtcbiAgICB9O1xuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL21vZGFsR2V0SXRlbXMuaHRtbCcsIHtcbiAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lID0gbW9kYWw7XG4gICAgfSk7XG4gICAgJHNjb3BlLm9wZW5Nb2RhbE9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZS5zaG93KCk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKGlkdGlwbykge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2xhc2VzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jbGFzZXMgPSBpbnNwZWNjaW9uU2VydmljZS5jbGFzZXM7XG4gICAgICAgICRzY29wZS5jYXJyb2NlcmlhcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNhcnJvY2VyaWFzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoaWRjbGFzZSkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2Fycm9jZXJpYXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNhcnJvY2VyaWFzID0gaW5zcGVjY2lvblNlcnZpY2UuY2Fycm9jZXJpYXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5pdGVtcyA9IGluc3BlY2Npb25TZXJ2aWNlLmFsbDtcbiAgICAgICRzY29wZS5zZWN0aW9ucyA9IGluc3BlY2Npb25TZXJ2aWNlLnNlY3Rpb25zO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNldElkQ2xhQ2EoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldElkQ2xhQ2EgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldEFscmVhZHlJbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0QWxyZWFkeUluc3BlY3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldEFscmVhZHlJbnNwZWN0IGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnRpcG9zID0gaW5zcGVjY2lvblNlcnZpY2UudGlwb3M7XG4gICAgICAkc2NvcGUuY2wgPSBpbnNwZWNjaW9uU2VydmljZS5jbDtcbiAgICAgIC8vIFRPRE86IGFxdWkgdmFsaWRvIHNpIHlhIHNlIGNhbGlmaWNvIG8gc2kgYXBlbmFzIHNlIHZhIGEgcmVhbGl6YXJcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIG9uIGluaXRcbiAgICAkc2NvcGUuaW5pdCgpO1xuICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdNYWluQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY05hdkJhckRlbGVnYXRlLCBvZmZsaW5lU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHVuc3luY1NlcnZpY2UsICRzdGF0ZSwgYXV0aFNlcnZpY2UpIHtcbiAgJHNjb3BlLm9mZiA9IG9mZmxpbmVTZXJ2aWNlLmRhdGE7XG4gICRzY29wZS5pbnRlcm1lZGlhdGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGE7XG4gICRzY29wZS5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgJHNjb3BlLm9mZi5vZmZsaW5lTW9kZSA9IGJvb2w7XG4gICAgLy8gaWYgKGJvb2wpIHtcbiAgICAvLyAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCdPZmZsaW5lIE1vZGUnKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAvLyB9XG4gICAgaWYgKCFib29sICYmIG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdzaW5jcm9uaXphbmRvJyk7XG4gICAgICB1bnN5bmNTZXJ2aWNlLnN5bmNJbWFnZXMoKSAgLy8gLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHp1bWVyb1NlcnZpY2UuenluYygwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTsgIC8vIHp1bWVyb1NlcnZpY2UuenluYygwKTtcbjtcbiAgICB9XG4gIH07XG4gICRzY29wZS5sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgfTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdQbGFjYXNDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAncGxhY2FzU2VydmljZScsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICckbG9jYXRpb24nLFxuICAnJGlvbmljUG9wdXAnLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZm9jdXMnLFxuICAnJHN0YXRlJyxcbiAgJ3RpdGxlU2VydmljZScsXG4gICckaW9uaWNNb2RhbCcsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZmlyc3RJbml0U2VydmljZScsXG4gICckbG9jYWxTdG9yYWdlJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICAnJGZpbHRlcicsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgenVtZXJvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sIHBsYWNhc1NlcnZpY2UsICRpb25pY05hdkJhckRlbGVnYXRlLCAkbG9jYXRpb24sICRpb25pY1BvcHVwLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZm9jdXMsICRzdGF0ZSwgdGl0bGVTZXJ2aWNlLCAkaW9uaWNNb2RhbCwgdG9hc3RTZXJ2aWNlLCBmaXJzdEluaXRTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCAkaW9uaWNMb2FkaW5nLCAkZmlsdGVyLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgLy8gcGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vIHBzID0gcGxhY2FzU2VydmljZTtcbiAgICAgIC8vIHBjID0gJHNjb3BlO1xuICAgICAgLy8gJHNjb3BlLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLm9iaiA9IHsgZmlsdGVyOiAnJyB9O1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAkc2NvcGUucGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZS5hbGwpO1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gJ1BsYWNhcyc7XG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NhcmdhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuZ2V0UGxhY2FzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIHF1ZSBsYSBjb25zdWx0YSBkZSBwbGFjYXMgc3VwaWVyYSB0b2RvLCBjb21vIHBvciBlamVtcGxvIHNpIHlhIHNlIGNhbGlmaWNvLCBzaSB5YSB0aWVuZSBhbGd1bmEgZm90byBvIHVuIHZpZGVvLCBwdWVkZSBzZXIgbWFyY2FuZG9sbyBjb24gYWxndW5hIGNsYXNlXG4gICAgICBpZiAoISRsb2NhbFN0b3JhZ2UuZGF0YSkge1xuICAgICAgICAkc2NvcGUuc2hvdygpO1xuICAgICAgICAvLyBUT0RPOiBwdWVkbyBwb2RlciBvYmo9bnVsbCwgcGFyYSBxdWUgbWUgZWxpbWluZSBsYSBiYXNlIGRlIGRhdG9zIHNpIHlhIGVzdGEgY3JlYWRhIHkgdnVlbHZhIGEgc2luY3Jvbml6YXIsIGVzdG8gc2VyaWEgYmVuZWZpY2lvc28gc2kgdGVuZ28gcXVlIGhhY2VyIHVuIGNhbWJpbyBlbiBsYSBiYXNlIGRlIGRkYXRvcyBxdWUgcmVxdWllcmEgcmVjb25zdHJ1aXJsYVxuICAgICAgICBmaXJzdEluaXRTZXJ2aWNlLmluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmdldFBsYWNhcygpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnBsYWNhUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IG9yZ2FuaXphciBlbCBmb2N1cyBlbiBlbCBpbnB1dCBkZWwgcG9wdXBcbiAgICAgICAgdmFyIG15cHJvbXB0ID0gJGlvbmljUG9wdXAucHJvbXB0KHtcbiAgICAgICAgICB0aXRsZTogJ051ZXZhIFBsYWNhJyxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ0luZ3Jlc2UgbGEgbnVldmEgcGxhY2EnLFxuICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnLFxuICAgICAgICAgIGlucHV0UGxhY2Vob2xkZXI6ICdQbGFjYSdcbiAgICAgICAgfSk7XG4gICAgICAgIG15cHJvbXB0LnRoZW4oZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgICAgJHNjb3BlLmFkZFBsYWNhKHBsYWNhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmFkZFBsYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHBsYWNhKSkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3ZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZScpO1xuICAgICAgICAgIC8vIGFsZXJ0KFwidmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2EubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2xvbmdpdHVkIGRlIHBsYWNhIG11eSBjb3J0YScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLnBsYWNhcywgeyBwbGFjYTogcGxhY2EgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdwbGFjYSB5YSByZWdpc3RyYWRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnSW5ncmVzYW5kbyBudWV2YSBwbGFjYScpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlLmluc2VydFBMYWNhKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5wbGFjYXMgPSBwbGFjYXNTZXJ2aWNlLmFsbDtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAkc2NvcGUuc2V0Rm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IHRydWU7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgZm9jdXMuZm9jdXMoJ3NlYXJjaFByaW1hcnknKTsgIC8vbm8gZXMgbmVjZXNhcmlvIGFicmlyIGVsIGtleWJvYXJkIHNlIGFicmUgc29sbyBjdWFuZG8gYXNpZ25hbW9zIGVsIGZvY3VzIC8vIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm5vRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnJyk7XG4gICAgICAgICRzY29wZS5vYmouZmlsdGVyID0gJyc7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNldEludERhdGEgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIC8vIFRPRE86IHNpIGxhcyBwbGFjYXMgc29uIGlndWFsZXMsIHB1ZWRlIHNlciBxdWUgc2UgaGF5YSBzaW5jcm9uaXphZG8geSBubyBzZSBoYXlhIGFjeWF1bGl6YWRvIGxhIGxpc3RhIGRlIHBsYWNhcywgZW50b25jZXMgc2UgcGFzYXJpYSB1biBpZGluc3BlY2Npb24gcXVlIG5vICxlcyBlc3RvIGN1YW5kbyBvZmZsaW5lIGNyZW8gdW5hIHBsYWNhLCBtZSBwb25nbyBvbmxpbmUgeSBsdWVnbyBvbiBwYXVzZSBoYWdvIGVsIHN5bmMsIGF1bnF1ZSBoYXlxIHVlIHBlbnNhciBxdWUgY3VhbmRvIGxlIHBvbmdvIG9ubGluZSwgZGViZXJpYSBzaW5jcm9uaXphciBzaSBoYXkgc2XDsWFsIDRnIG8gd2lmaSBwYXJhIGltYWdlbmVzIG8gcGFyYSB0b2RvXG4gICAgICAgIGlmIChvYmoucGxhY2EgIT09IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkge1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSA9IG9iai5wbGFjYTtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IG9iai5zeW5jID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSBvYmouaWRpbnNwZWNjaW9uO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvRm90b3MgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmZvdG8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pOyAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvZm90b3MvJyArIG9iai5pZGluc3BlY2Npb24pOyAgLy8gVE9ETzogY2FtYmlhciBwb3Igc3RhdGUuZ28gbWFzIHBhcmFtZXRyb3MsIHZlciBiZXN0IHByYWN0aWNlc1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb1ZpZGVvID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC92aWRlby8nICsgb2JqLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnZpZGVvJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29JbnNwZWNjaW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyBUT0RPOiBhcXVpIHBvZHJpYSBldmFsdWFyIHNpIHlhIHNlIGNhbGlmaWNvIG8gbm8sIHNpIG5vIHNlIGhhIGNhbGlmaWNhZG8gcG9kcmlhIGRlc3BsZWdhciBlbCBtb2RhbCBkZSBjbGFzZSBjYXJyb2NlcmlhXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgICAgICAgaWQ6IG9iai5pZGluc3BlY2Npb24sXG4gICAgICAgICAgcGxhY2E6IG9iai5wbGFjYSxcbiAgICAgICAgICBjYWxpZmljYWRvOiBvYmouY2FsaWZpY2Fkb1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29BY2Nlc29yaW9zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hY2Nlc29yaW9zJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY3JlYXRlRXhjZXB0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchXCIpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignVGVzdEN0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnc3FsU2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1BsYXRmb3JtLCBzcWxTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgICAkc2NvcGUub3BlbmRiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB4ID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2UoeyBuYW1lOiAnenVtZXJvdGVzdGRiZmlsZScgfSwgZnVuY3Rpb24gKHJlc3VsdE9iaiwgZnVsbFBhdGhQYXJhbSwgZGJPYmplY3QpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYk9iamVjdCwgJ2Rib2JqZWN0Jyk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0T2JqLCAnZnVscGF0aDonLCBmdWxsUGF0aFBhcmFtKTsgIC8vSW1wb3J0YW50ISAgSWYgeW91IGRvbid0IGNsb3NlIHRoZSBkYXRhYmFzZSBvYmplY3QsIGZ1dHVyZSBjYWxscyB0byBvcGVuRGF0YWJhc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd29uJ3QgY2FsbCB0aGUgc3VjY2VzcyBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGJPYmplY3QuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlZGIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjZXJyYW5kbycsIHgpO1xuICAgICAgICAvLyBpZiAoIXgpIHtcbiAgICAgICAgeC5jbG9zZSgpO1xuICAgICAgICAvLyB6dW1lcm8gc3FsaXRlIGZ1bmNpb25hIGFzaSAuY2xvc2UgPSBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcikgeyBwZXJvIG5vIHNlIHVzYW4gYWwgbGxhbWFyIGNvcm9kdmEuZXhlXG4gICAgICAgIGNvbnNvbGUubG9nKHgub3BlbkRCUyk7ICAvLyB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmdWxsUGF0aFBhcmFtID0gJy9kYXRhL2RhdGEvY29tLmlvbmljZnJhbWV3b3JrLmZvdG9zdmlldzM5MDc0Ny9kYXRhYmFzZXMvenVtZXJvdGVzdGRiLmRiJztcbiAgICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vMTkyLjE2OC4xLjEzOjgwODAvJztcbiAgICAgICAgdmFyIGRiZmlsZSA9ICd6dW1lcm90ZXN0ZGJmaWxlJztcbiAgICAgICAgdmFyIG5vdGlmeVN1Y2Nlc3MgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbm90aWZ5RXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9O1xuICAgICAgICB6dW1lcm8uc3luYyhmdWxsUGF0aFBhcmFtLCAnJywgc2VydmVyLCBkYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIG5vdGlmeVN1Y2Nlc3MsIG5vdGlmeUVycm9yKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubyA9IHtcbiAgICAgICAgczogdHJ1ZSxcbiAgICAgICAgZTogdHJ1ZSxcbiAgICAgICAgdTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHNxbFNlcnZpY2Uuc3luYygpO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignVmlkZW9DdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3ZpZGVvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJyRmaWx0ZXInLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLFxuICAnZ2V0VmlkZW9TZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHMsIHZpZGVvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRpb25pY1Njcm9sbERlbGVnYXRlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCAkZmlsdGVyLCAkc3RhdGVQYXJhbXMsICRpb25pY05hdkJhckRlbGVnYXRlLCBjb3B5RmlsZVNlcnZpY2UsIHZpZGVvVGh1bWJuYWlsU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGVycm9yU2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIC8vIHMudGl0dGxlID0gJyc7XG4gICAgICBzLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICAvL3ZpZGVvU2VydmljZS5hbGwoKTtcbiAgICAgIHZpZGVvU2VydmljZS5nZXRWaWRlb3Mocy5pZGluc3BlY2Npb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICB9KTtcbiAgICAgIC8vIHZhciBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yJywgZSk7XG4gICAgICAvLyB9O1xuICAgICAgdmFyIGluc2VydFZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS5pbnNlcnRWaWRlbyhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgaW5zZXJ0IHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS51cGRhdGVWaWRlbyhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgdmlkZW8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnN5bmMgPSBzeW5jO1xuICAgICAgICBvYmpWaWRlby5vblVwbG9hZCA9IG9udXBsb2FkO1xuICAgICAgICAvLyBpbnNlcnRWaWRlbyhpbWFnZVVSSSwgc3luYywgb2JqVmlkZW8udGh1bWJuYWlsKTtcbiAgICAgICAgdXBkYXRlVmlkZW8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDMpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpWaWRlby5wcm9ncmVzcyA9IHBlcmNlbnRhZ2U7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0YW50IHByb2dyZXNzIHVwZGF0ZXNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHByb2dyZXNzKTtcbiAgICAgICAgICAgIC8vIHJlZnJlc2hQcm9ncmVzcyhpbWFnZVVSSSwgTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHJ0bk9ialZpZGVvID0gZnVuY3Rpb24gKHBsYWNhLCBwYXRoLCBzeW5jLCBvblVwbG9hZCwgdGh1bWJuYWlsKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgc3luYzogc3luYyxcbiAgICAgICAgICBvblVwbG9hZDogb25VcGxvYWQsXG4gICAgICAgICAgLy9zLm9zcy5vbmxpbmUgPT09IHRydWUgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB0aHVtYm5haWw6IHRodW1ibmFpbCxcbiAgICAgICAgICBydXRhU3J2OiBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH07XG4gICAgICB2YXIgc2VhcmNoT25lSW5BcnJheSA9IGZ1bmN0aW9uIChzcmNJbWcpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy52aWRlb3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgbG9hZFRodW1ibmFpbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmdlbmVyYXRlVGh1bWJuYWlsKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICh0aHVtYm5haWxTcmMpIHtcbiAgICAgICAgICBzZWFyY2hPbmVJbkFycmF5KG9iai5wYXRoKS50aHVtYm5haWwgPSB0aHVtYm5haWxTcmM7XG4gICAgICAgICAgdmFyIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBUT0RPOiBvbnVwbG9hZCBkZXBlbmRlcmEgc2kgZXN0YSBvbmxpbmUgbyBubyBwYXJhIHNhYmVyIHNpIHNlIGludGVudGEgc3ViaXI7XG4gICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICBpbnNlcnRWaWRlbyhvYmoucGF0aCwgc3luYywgdGh1bWJuYWlsU3JjLCBvblVwbG9hZCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChvYmpWaWRlbyk7XG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICB2aWRlb1NlcnZpY2UudGFrZWRWaWQoKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgICBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codmlkZW9EYXRhKTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godmlkZW9EYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZSh2YWx1ZS5mdWxsUGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBydG5PYmpWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIGZhbHNlLCB0cnVlLCAnJyk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgICBzLnZpZGVvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgIGxvYWRUaHVtYm5haWwob2JqKTsgIC8vIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICAgIHMuZ2V0VmlkRmlsZUNvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICBnZXRWaWRlb1NlcnZpY2UuZ2V0VmlkZW9Db21wcmVzcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICB2YXIgcmVzVmlkZW9Db21wcmVzcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgIC8vIFRPRE86IDEyNTgyOTEyIHNvbiAxMk1CIDtcbiAgICAgICAgICBpZiAoY2hlY2tGaWxlU2VydmljZS5maWxlLnNpemUgPCAxMjU4MjkxMikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZ2V0VmlkZW9TZXJ2aWNlLmZpbGVFbnRyeSk7XG4gICAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUocmVzVmlkZW9Db21wcmVzcy5uYXRpdmVVUkwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjb3B5RmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjb3B5RmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnZWwgYXJjaGl2byBzdXBlcmEgZWwgdGFtYVxceEYxYSBtYXhpbW8gcGVybWl0aWRvLiBtYXhpbW8gMTJNQicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbXG4gICckc2NvcGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJ2F1dGhTZXJ2aWNlJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckc3RhdGUnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIGF1dGhTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRzdGF0ZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5zcmMgPSAnaW1nL2ljb24ucG5nJztcbiAgICAgIC8vIFRPRE86IHZlcmlmaWNhciBzaSBlc3RvIHNlIHB1ZWRlIGhhY2VyIGVuIGVsIHJ1biwgcGVybyBjb24gc3RhdGUuZ28gYXBwLnBsYWNhc1xuICAgICAgdmFyIF9hbHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgdmFyIG4gPSBtb21lbnQoKTtcbiAgICAgICAgICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICBpZiAobi5kaWZmKGUsICdzZWNvbmRzJykgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgcGxhY2FzJyk7XG4gICAgICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9wbGFjYXMnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF9hbHJlYWR5KCk7XG4gICAgICAkc2NvcGUubG9nZ2VkTm93ID0gZmFsc2U7XG4gICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLmNhbkRyYWdDb250ZW50KGZhbHNlKTtcbiAgICAgICRzY29wZS5sb2dpbkRhdGEgPSB7XG4gICAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgfTtcbiAgICAgICRzY29wZS5tZXNzYWdlID0gJyc7XG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgICAgYXV0aFNlcnZpY2UubG9naW4oJHNjb3BlLmxvZ2luRGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5vbkxvZ2dlZCgpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gJ3ZlcmlmaXF1ZSBxdWUgZGlzcG9uZ2EgZGUgY29uZXhpb24gYSBpbnRlcm5ldCwgZSBpbnRlbnRlIGRlIG51ZXZvJztcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5vbkxvZ2dlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8kbG9jYXRpb24ucGF0aCgnL29yZGVycycpO1xuICAgICAgICAvLyAkc2NvcGUubG9nZ2VkKHRydWUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLCRsb2NhdGlvbik7XG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gJyc7XG4gICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wbGFjYXMnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aEV4dGVybmFsUHJvdmlkZXIgPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIHJlZGlyZWN0VXJpID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArICcvYXV0aGNvbXBsZXRlLmh0bWwnO1xuICAgICAgICB2YXIgZXh0ZXJuYWxQcm92aWRlclVybCA9IG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpICsgJ2FwaS9BY2NvdW50L0V4dGVybmFsTG9naW4/cHJvdmlkZXI9JyArIHByb3ZpZGVyICsgJyZyZXNwb25zZV90eXBlPXRva2VuJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQgKyAnJnJlZGlyZWN0X3VyaT0nICsgcmVkaXJlY3RVcmk7XG4gICAgICAgIHdpbmRvdy4kd2luZG93U2NvcGUgPSAkc2NvcGU7XG4gICAgICAgIHZhciBvYXV0aFdpbmRvdyA9IHdpbmRvdy5vcGVuKGV4dGVybmFsUHJvdmlkZXJVcmwsICdBdXRoZW50aWNhdGUgQWNjb3VudCcsICdsb2NhdGlvbj0wLHN0YXR1cz0wLHdpZHRoPTYwMCxoZWlnaHQ9NzUwJyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmF1dGhDb21wbGV0ZWRDQiA9IGZ1bmN0aW9uIChmcmFnbWVudCkge1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZnJhZ21lbnQuaGFzbG9jYWxhY2NvdW50ID09PSAnRmFsc2UnKSB7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmV4dGVybmFsQXV0aERhdGEgPSB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBmcmFnbWVudC5wcm92aWRlcixcbiAgICAgICAgICAgICAgdXNlck5hbWU6IGZyYWdtZW50LmV4dGVybmFsX3VzZXJfbmFtZSxcbiAgICAgICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZnJhZ21lbnQuZXh0ZXJuYWxfYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9hc3NvY2lhdGUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9PYnRhaW4gYWNjZXNzIHRva2VuIGFuZCByZWRpcmVjdCB0byBvcmRlcnNcbiAgICAgICAgICAgIHZhciBleHRlcm5hbERhdGEgPSB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBmcmFnbWVudC5wcm92aWRlcixcbiAgICAgICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZnJhZ21lbnQuZXh0ZXJuYWxfYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXV0aFNlcnZpY2Uub2J0YWluQWNjZXNzVG9rZW4oZXh0ZXJuYWxEYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL29yZGVycycpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IGVyci5lcnJvcl9kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9ICAvLyAkc2NvcGUuYWxyZWFkeUxvZ2dlZCgpOyAgICAgICAgICAgICAgIFxuO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnYWNjZXNvcmlvc1NlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHEsICRmaWx0ZXIsIGVycm9yU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICAgIHZhciBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhID0ge307XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkYWNjZXNvcmlvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFthY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX25vbWJyZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICd0ZXh0YScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAndGV4dGInLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9lc3RhZG9zID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnZXN0YWRvYicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX2NhbnRpZGFkZXMgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcxJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICcyJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfc2V0Tm9tYnJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gdmFyIGpzb24gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb247XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFuZ3VsYXIuZnJvbUpzb24oanNvbikpO1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTsgIC8vYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldEVzdGFkb3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5lc3RhZG9zID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldENhbnRpZGFkZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjInO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luaXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVE9ETzogIHVuYSBiYW5kZXJhIHBhcmEgc2FiZXIgcXVlIHlhIHNlIHNldGlvLCB1bmEgdmV6LCB5IGV2aXRhciBtYXMgY29uc3VsYXRzLCBhIG1lbm9zIHF1ZSBzZSBoYWdhIHVuYSBhY3R1YWxpemFjaW9uIGRlbCBzZXJ2aWRvclxuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX3NldE5vbWJyZXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfc2V0Q2FudGlkYWRlcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXRFc3RhZG9zKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdEFjYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIGluaWNpYXIgZXN0b3MgZGRsIHNpbiB2YWxvcmVzLCAgcGVybyB0ZW5kcmlhIHF1ZSB2YWxpZGFyIHF1ZSBzaSBzZSBzZWxlY2Npb25lIGFsZ287XG4gICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSA9IHtcbiAgICAgICAgbm9tYnJlOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEubm9tYnJlc1swXSxcbiAgICAgICAgZXN0YWRvOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuZXN0YWRvc1swXSxcbiAgICAgICAgY2FudGlkYWQ6IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5jYW50aWRhZGVzWzBdLFxuICAgICAgICB2YWxvcjogMCxcbiAgICAgICAgbWFyY2E6ICcnLFxuICAgICAgICByZWZlcmVuY2lhOiAnJyxcbiAgICAgICAgaW1nOiB7XG4gICAgICAgICAgcGF0aDogJycsXG4gICAgICAgICAgc3luYzogZmFsc2UsXG4gICAgICAgICAgb25VcGxvYWQ6IGZhbHNlLFxuICAgICAgICAgIGlkaW5zcGVjY2lvbjogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvblxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgb2JqLm5vbWJyZS5sYWJlbCxcbiAgICAgICAgb2JqLmVzdGFkby5sYWJlbCxcbiAgICAgICAgcGFyc2VJbnQob2JqLmNhbnRpZGFkLnZhbHVlKSxcbiAgICAgICAgb2JqLm1hcmNhLFxuICAgICAgICBvYmoucmVmZXJlbmNpYSxcbiAgICAgICAgb2JqLnZhbG9yLFxuICAgICAgICBvYmouaW1nLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRhY2Nlc29yaW9zXSAoW2lkaW5zcGVjY2lvbl0gLFtwbGFjYV0gLFtub21icmVdICxbZXN0YWRvXSAsW2NhbnRpZGFkXSAsW21hcmNhXSAsW3JlZmVyZW5jaWFdLFt2YWxvcl0sW2ltZ1NyY10pIFZBTFVFUyAgKD8sPyw/LD8sPyw/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfZ2V0SXRlbXMoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nVXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC50ZXh0LFxuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuZ2V0SXRlbXMgPSBfZ2V0SXRlbXM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVNpbmdsZSA9IF91cGRhdGVTaW5nbGU7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LnNhdmUgPSBfc2F2ZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdE9wdGlvbnMgPSBfaW5pdE9wdGlvbnM7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXRBY2MgPSBfaW5pdEFjYztcbiAgICByZXR1cm4gYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yU2VydmljZScsIFtcbiAgJyRxJyxcbiAgJyRpbmplY3RvcicsXG4gICckbG9jYXRpb24nLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkcSwgJGluamVjdG9yLCAkbG9jYXRpb24sIGxvY2FsU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3JlcXVlc3QgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9O1xuICAgIHZhciBfcmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uIChyZWplY3Rpb24pIHtcbiAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICAgIGlmIChhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3JlZnJlc2gnKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICB9O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlcXVlc3QgPSBfcmVxdWVzdDtcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeS5yZXNwb25zZUVycm9yID0gX3Jlc3BvbnNlRXJyb3I7XG4gICAgcmV0dXJuIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnYXV0aFNlcnZpY2UnLCBbXG4gICckaHR0cCcsXG4gICckcScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGh0dHAsICRxLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgbW9tZW50U2VydmljZSkge1xuICAgIHZhciBzZXJ2aWNlQmFzZSA9IG5nQXV0aFNldHRpbmdzLmFwaVNlcnZpY2VCYXNlVXJpO1xuICAgIHZhciBhdXRoU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2F1dGhlbnRpY2F0aW9uID0ge1xuICAgICAgaXNBdXRoOiBmYWxzZSxcbiAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlLFxuICAgICAgbGFzdExvZ2luZzogJydcbiAgICB9O1xuICAgIHZhciBfZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgIHVzZXJOYW1lOiAnJyxcbiAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46ICcnXG4gICAgfTtcbiAgICB2YXIgX3NhdmVSZWdpc3RyYXRpb24gPSBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XG4gICAgICBfbG9nT3V0KCk7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICdhcGkvYWNjb3VudC9yZWdpc3RlcicsIHJlZ2lzdHJhdGlvbikudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2xvZ2luID0gZnVuY3Rpb24gKGxvZ2luRGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSAnZ3JhbnRfdHlwZT1wYXNzd29yZCZ1c2VybmFtZT0nICsgbG9naW5EYXRhLnVzZXJOYW1lICsgJyZwYXNzd29yZD0nICsgbG9naW5EYXRhLnBhc3N3b3JkICsgJyZjbGllbnRfaWQ9JyArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xuICAgICAgLy9zaWVtcHJlIHZveSBhIG1hbmRhciBlbCBjbGllbnRpZFxuICAgICAgLyppZiAobG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcclxuICAgICAgICAgICBkYXRhID0gZGF0YSArIFwiJmNsaWVudF9pZD1cIiArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xyXG4gICAgICAgfSovXG4gICAgICAvL3RlbmdvIHF1ZSByZXZpc2FyIGxvcyBjcm9zcyBvcmlnaW4sIGVuIGxhIGJhc2UgZGUgZGF0b3MgLCB5IGhhYmlsaXRhcmxvIGVuIGVsIG5hdmVnYWRvciBjaHJvbWUgLCBpbXBvcnRhbnRlXG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIGQgPSBtb21lbnQoKTtcbiAgICAgICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAndG9rZW4nLCBkYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcbiAgICAgICAgcnAgPSByZXNwb25zZTtcbiAgICAgICAgaWYgKGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiB0cnVlLFxuICAgICAgICAgICAgbGFzdExvZ2luOiBkICAvLyAsXG4gICAgICAgICAgICAgICAvLyBleHA6bW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbixcbiAgICAgICAgICAgIGV4cDogbW9tZW50U2VydmljZS5hZGRTZWNvbmRzKHJlc3BvbnNlLmV4cGlyZXNfaW4pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgIHVzZXJOYW1lOiBsb2dpbkRhdGEudXNlck5hbWUsXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICAgICAgICBsYXN0TG9naW46IGQgIC8vICxcbiAgICAgICAgICAgICAgIC8vIGV4cDptb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4sXG4gICAgICAgICAgICBleHA6IG1vbWVudFNlcnZpY2UuYWRkU2Vjb25kcyhyZXNwb25zZS5leHBpcmVzX2luKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24ubGFzdExvZ2luZyA9IG1vbWVudCgpO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSBsb2dpbkRhdGEudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gbG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSBmYWxzZTtcbiAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9ICcnO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICB9O1xuICAgIHZhciBfZmlsbEF1dGhEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IGF1dGhEYXRhLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnM7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX3JlZnJlc2hUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBpZiAoYXV0aERhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgIHZhciBkYXRhID0gJ2dyYW50X3R5cGU9cmVmcmVzaF90b2tlbiZyZWZyZXNoX3Rva2VuPScgKyBhdXRoRGF0YS5yZWZyZXNoVG9rZW4gKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICAgICAgJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICd0b2tlbicsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2UucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfb2J0YWluQWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoZXh0ZXJuYWxEYXRhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAuZ2V0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L09idGFpbkxvY2FsQWNjZXNzVG9rZW4nLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHByb3ZpZGVyOiBleHRlcm5hbERhdGEucHJvdmlkZXIsXG4gICAgICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogZXh0ZXJuYWxEYXRhLmV4dGVybmFsQWNjZXNzVG9rZW5cbiAgICAgICAgfVxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3JlZ2lzdGVyRXh0ZXJuYWwgPSBmdW5jdGlvbiAocmVnaXN0ZXJFeHRlcm5hbERhdGEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L3JlZ2lzdGVyZXh0ZXJuYWwnLCByZWdpc3RlckV4dGVybmFsRGF0YSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ2F1dGhvcml6YXRpb25EYXRhJywge1xuICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSByZXNwb25zZS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBmYWxzZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICBhdXRoU2VydmljZUZhY3Rvcnkuc2F2ZVJlZ2lzdHJhdGlvbiA9IF9zYXZlUmVnaXN0cmF0aW9uO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5sb2dpbiA9IF9sb2dpbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkubG9nT3V0ID0gX2xvZ091dDtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuZmlsbEF1dGhEYXRhID0gX2ZpbGxBdXRoRGF0YTtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuYXV0aGVudGljYXRpb24gPSBfYXV0aGVudGljYXRpb247XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnJlZnJlc2hUb2tlbiA9IF9yZWZyZXNoVG9rZW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5Lm9idGFpbkFjY2Vzc1Rva2VuID0gX29idGFpbkFjY2Vzc1Rva2VuO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5leHRlcm5hbEF1dGhEYXRhID0gX2V4dGVybmFsQXV0aERhdGE7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnJlZ2lzdGVyRXh0ZXJuYWwgPSBfcmVnaXN0ZXJFeHRlcm5hbDtcbiAgICByZXR1cm4gYXV0aFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY2hlY2tGaWxlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxKSB7XG4gICAgdmFyIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9maWxlRGV0YWlsID0gZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAgIEZpbGVFbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGUgPSBmaWxlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9jaGVja0ZpbGUgPSBmdW5jdGlvbiAobWVkaWFVUkkpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG1lZGlhVVJJLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIC8vIHZhciBwYXRoPWNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3Rvcnk7IC8vIGltYWdlbmVzIGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5XG4gICAgICB2YXIgcGF0aCA9IG1lZGlhVVJJLnN1YnN0cmluZygwLCBtZWRpYVVSSS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIC8vIHZhciBuZXdGaWxlTmFtZSA9ICduZXdfJyArIEZpbGVOYW1lO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jaGVja0ZpbGUocGF0aCwgRmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgICByZXR1cm4gX2ZpbGVEZXRhaWwoRmlsZUVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuY2hlY2tGaWxlID0gX2NoZWNrRmlsZTtcbiAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRGV0YWlsID0gX2ZpbGVEZXRhaWw7XG4gICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY29weUZpbGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgLy8gdmFyIF9maWxlRGV0YWlsID0gZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgIC8vICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAvLyAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgIC8vICAgRmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAvLyAgICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlID0gZmlsZTtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAvLyB9O1xuICAgIHZhciBfY29weUZpbGUgPSBmdW5jdGlvbiAobWVkaWFVUkkpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG1lZGlhVVJJLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIC8vIHZhciBwYXRoPWNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3Rvcnk7IC8vIGltYWdlbmVzIGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5XG4gICAgICB2YXIgcGF0aCA9IG1lZGlhVVJJLnN1YnN0cmluZygwLCBtZWRpYVVSSS5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBjb25zb2xlLmxvZyhwYXRoKTtcbiAgICAgIHZhciBuZXdGaWxlTmFtZSA9IEZpbGVOYW1lO1xuICAgICAgLy8gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNvcHlGaWxlKHBhdGgsIEZpbGVOYW1lLCBjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgbmV3RmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgICAgICAvLyByZXR1cm4gY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnk9RmlsZUVudHJ5O1xuICAgICAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZS5maWxlRGV0YWlsKEZpbGVFbnRyeSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuY29weUZpbGUgPSBfY29weUZpbGU7XG4gICAgcmV0dXJuIGNvcHlGaWxlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjb3Jkb3ZhRXZlbnRzU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgb25saW5lU3RhdHVzU2VydmljZSwgenVtZXJvU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfb25SZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncmVzdW1lJywgZnVuY3Rpb24gKCkge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnVGhlIGFwcGxpY2F0aW9uIGlzIHJlc3VtaW5nIGZyb20gdGhlIGJhY2tncm91bmQnKTtcbiAgICAgIH0sIDApO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcbiAgdmFyIF9vblBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfY2FsbFp5bmMoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBhcHBsaWNhdGlvbiBpcyBwYXVzaW5nIHRvIHRoZSBiYWNrZ3JvdW5kJyk7XG4gICAgICB9LCAwKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG4gIHZhciBfY2FsbFp5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogZXZhbHVhciB0b2RhcyBsYXMgcG9zaWJpbGlkYWRlcyBkZSBlc3RvIGFjYSwgcG9yIHF1ZSBzaSBsYSBzZcOxYWwgZXMgbXV5IG1hbGEgcXVlIHB1ZWRlIHBhc2FyLCBhdW5xdWUgZWwgenluYyBkZSBiYXNlcyBkZSBkYXRvcyBudW5jYSBoYXNpZG8gbXV5IGdyYW5kZSBlbiBpbmZvcm1hY2lvblxuICAgIGlmIChvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUgJiYgIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyAmJiAhaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nVmlkKSB7XG4gICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7XG4gICAgfVxuICB9O1xuICBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnkub25QYXVzZSA9IF9vblBhdXNlO1xuICBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnkub25SZXN1bWUgPSBfb25SZXN1bWU7XG4gIC8vIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5jYWxsWnluYyA9IF9jYWxsWnluYztcbiAgcmV0dXJuIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdjcmVhdGVEaXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfY3JlYXRlRGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jcmVhdGVEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIGRpcikudGhlbihmdW5jdGlvbiAoc3VjY2VzKSB7XG4gICAgICAgIHJldHVybiBzdWNjZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5LmNyZWF0ZURpciA9IF9jcmVhdGVEaXI7XG4gICAgcmV0dXJuIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZGV2aWNlU2VydmljZScsIGZ1bmN0aW9uICgkY29yZG92YURldmljZSkge1xuICB2YXIgZGV2aWNlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9zZXRJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIGRldmljZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBkZXZpY2U6ICRjb3Jkb3ZhRGV2aWNlLmdldERldmljZSgpLFxuICAgICAgY29yZG92YTogJGNvcmRvdmFEZXZpY2UuZ2V0Q29yZG92YSgpLFxuICAgICAgbW9kZWw6ICRjb3Jkb3ZhRGV2aWNlLmdldE1vZGVsKCksXG4gICAgICBwbGF0Zm9ybTogJGNvcmRvdmFEZXZpY2UuZ2V0UGxhdGZvcm0oKSxcbiAgICAgIHV1aWQ6ICRjb3Jkb3ZhRGV2aWNlLmdldFVVSUQoKSxcbiAgICAgIHZlcnNpb246ICRjb3Jkb3ZhRGV2aWNlLmdldFZlcnNpb24oKVxuICAgIH07XG4gIH07XG4gIGRldmljZVNlcnZpY2VGYWN0b3J5LnNldEluZm8gPSBfc2V0SW5mbztcbiAgcmV0dXJuIGRldmljZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2Vhc3lEaXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSkge1xuICAgIHZhciBlYXN5RGlyU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2NyZWF0ZURpciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0b2RheSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgdmFyIEN1cnJlbnREYXRlID0gbW9tZW50KCkudW5peCgpO1xuICAgICAgJGNvcmRvdmFGaWxlLmNoZWNrRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCB0b2RheSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxyZWFkeWV4aXN0Jyk7ICAvLyBzdWNjZXNzXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgJGNvcmRvdmFGaWxlLmNyZWF0ZURpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgdG9kYXksIGZhbHNlKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2RpciBjcmVhdGVkJywgdG9kYXkpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2Fubm90IGNyZWF0ZWQgZGlyJywgdG9kYXkpO1xuICAgICAgICB9KTsgIC8vIGVycm9yXG4gICAgICB9KTtcbiAgICB9O1xuICAgIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeS5jcmVhdGVEaXIgPSBfY3JlYXRlRGlyO1xuICAgIHJldHVybiBlYXN5RGlyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdlcnJvclNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGVycm9yU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9jb25zb2xlRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICB9O1xuICBlcnJvclNlcnZpY2VGYWN0b3J5LmNvbnNvbGVFcnJvciA9IF9jb25zb2xlRXJyb3I7XG4gIHJldHVybiBlcnJvclNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGVUcmFuc2ZlcicsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGVUcmFuc2Zlcikge1xuICAgIHZhciBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAxNzAwMDtcbiAgICB2YXIgX2ZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBvYmoucGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgZmlsZUV4dCA9IG9iai5wYXRoLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICBjb25zb2xlLmxvZygnZXh0ZW5zaW9uJywgZmlsZUV4dCk7XG4gICAgICB2YXIgbWltZXR5cGUgPSAnaW1hZ2UvanBlZyc7XG4gICAgICAvLyBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gMjAwMDA7XG4gICAgICBpZiAoZmlsZUV4dCA9PT0gJ21wNCcpIHtcbiAgICAgICAgbWltZXR5cGUgPSAndmlkZW8vbXA0JztcbiAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDYwMDAwO1xuICAgICAgfVxuICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC9hcGkvZmlsZSc7XG4gICAgICAvLyAnaHR0cHM6Ly93d3cuYWp1c3RldnNpdmEuY29tL2F1dGgvYXBpL2ZpbGUnO1xuICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgIG9wdGlvbnMuZmlsZUtleSA9ICdmaWxlJztcbiAgICAgIG9wdGlvbnMuZmlsZU5hbWUgPSBvYmoucGF0aC5zdWJzdHIob2JqLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgb3B0aW9ucy5taW1lVHlwZSA9IG1pbWV0eXBlO1xuICAgICAgLyp2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcclxuICAgICAgIGlmIChhdXRoRGF0YSkge1xyXG4gICAgICAgICB2YXIgaGVhZGVycyA9IHsgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlbiB9O1xyXG4gICAgICAgICBvcHRpb25zLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG4gICAgICAgfSovXG4gICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICBwYXJhbXMucGF0aEZpbGVTZXJ2ZXIgPSBvYmoucnV0YVNydi5zdWJzdHJpbmcoMCwgb2JqLnJ1dGFTcnYubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgLy8gJzIwMTUvTWFyY2gvMTgvUFJVRUJBNzAwJztcbiAgICAgIC8vIHVybDsvL1VwUHJvbWlzZS5wYXRoRmlsZVNlcnZlcjtcbiAgICAgIHBhcmFtcy52YWx1ZTIgPSAncGFyYW0nO1xuICAgICAgb3B0aW9ucy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAvLyBUT0RPOiBkZWZpbmlyIHVuIHNlcnZpY2lvIHBhcmEgc2V0IGVsIHRpbWVvdXQgZGVwZW5kaWVuZG8gc2kgZXMgZm90byBvIHZpZGVvO1xuICAgICAgb3B0aW9ucy50aW1lb3V0ID0gZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dDtcbiAgICAgIC8vJHNjb3BlLmRhdGEudGltZW91dDtcbiAgICAgIC8vNTAwOy8vMzAwMDA7Ly9taWxpc2Vjb25kc1xuICAgICAgY29uc29sZS50aW1lKCdmaWxlVXBsb2FkJyk7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlVHJhbnNmZXIudXBsb2FkKHNlcnZlciwgb2JqLnBhdGgsIG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1Y2NlcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7ICAvL1RPRE86IHZlcmlmaWNhciBzaSBwdWVkbyBwb25lciBlbCBlcnJvciBhY2EgeSBkaXNwYXJhciBlbCBvb2ZsaW5lbW9kZSBkZXNkZSBhY2EgeSBubyBkZXNkZSB0b2RvcyBsb3MgY29udHJvbGxlcnNcbiAgICAgIH0gIC8vIFRPRE86IHNpIGVqZWN1dG8gZW4gZWwgc2VydmljaW8gbm8gbGxlZ2EgYWwgY29udHJvbGFkb3IsIGF1bnF1ZSBwb2RyaWEgaGFjZXIgdW5hIHByYWN0aWNhIHBhcmEgZGVmaW5pciBsb3MgcGFyYW1ldHJvcyBkZSBhZnRlcnVwbG9hZCBhcXVpIG1pc21vLCB5IHF1ZWRhIG11Y2hvIG1lam9yXG4gICAgICAgICAvLyAsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdlcnJvciBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICAgLy8gfVxuKTtcbiAgICB9O1xuICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LmZpbGVVcGxvYWQgPSBfZmlsZVVwbG9hZDtcbiAgICByZXR1cm4gZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdmaXJzdEluaXRTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNMb2FkaW5nJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsICRsb2NhbFN0b3JhZ2UsIHp1bWVyb1NlcnZpY2UsICRpb25pY0xvYWRpbmcpIHtcbiAgICB2YXIgZmlyc3RJbml0U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3Nob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxzcGFuPkluaWNpYWxpemFuZG88L3NwYW4+PGlvbi1zcGlubmVyIGljb249XCJhbmRyb2lkXCI+PC9pb24tc3Bpbm5lcj4nIH0pO1xuICAgIH07XG4gICAgdmFyIF9oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICB2YXIgX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICBjb25zb2xlLmxvZygnY3JlYW5kbyBvYmogbG9jYWxzdG9yYWdlJyk7XG4gICAgICBpZiAob25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICAgIF9zaG93KCk7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZmlyc3QgaW5pdCBvaycpO1xuICAgICAgICAgICRsb2NhbFN0b3JhZ2UuZGF0YSA9IHtcbiAgICAgICAgICAgIGxhc3REaXJDcmVhdGVkOiAnJyxcbiAgICAgICAgICAgIGZpcnN0WnluYzogbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICAgICAgfTtcbiAgICAgICAgICBfaGlkZSgpO1xuICAgICAgICAgIHEucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBpbml0IGVycm9yJywgZSk7XG4gICAgICAgICAgX2hpZGUoKTtcbiAgICAgICAgICBxLnJlamVjdChlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxLnJlamVjdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICB9O1xuICAgIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5LmluaXQgPSBfaW5pdDtcbiAgICByZXR1cm4gZmlyc3RJbml0U2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdmb2N1cycsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgZm9jdXNGYWN0b3J5ID0ge307XG4gIHZhciBfZm9jdXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAgLy8gZS5nLiBjbGljayBldmVudHMgdGhhdCBuZWVkIHRvIHJ1biBiZWZvcmUgdGhlIGZvY3VzIG9yXG4gICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXG4gICAgLy8gYXJlIHRyaWdnZXJlZC5cbiAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgZm9jdXNGYWN0b3J5LmZvY3VzID0gX2ZvY3VzO1xuICByZXR1cm4gZm9jdXNGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2ZvdG9zU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FtZXJhJyxcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJGNvcmRvdmFGaWxlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgdmFyIGZvdG9zU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IFtdO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBbXTtcbiAgICAvLyBbe1xuICAgIC8vICAgICBwbGFjYTogJ0FCQzExMScsXG4gICAgLy8gICAgIHNyYzogJycsXG4gICAgLy8gICAgIHN5bmM6IGZhbHNlXG4gICAgLy8gICB9XTtcbiAgICB2YXIgX3JlbW92ZSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3Muc3BsaWNlKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLmluZGV4T2YocGxhY2EpLCAxKTtcbiAgICB9O1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZHBpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBxdWFsaXR5OiA0NSxcbiAgICAgICAgLy81MCxcbiAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkZJTEVfVVJJLFxuICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBLFxuICAgICAgICAvLyBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICB0YXJnZXRXaWR0aDogMTAwMCxcbiAgICAgICAgLy9pbXBvcnRhbnRlIGNvbiAxMDAgc2UgdmVpYSBob3JyaWJsZVxuICAgICAgICB0YXJnZXRIZWlnaHQ6IDEwMDAsXG4gICAgICAgIC8vIFRPRE86IHJldmlzYXIgcGFyYSBxdWUgc2lydmUgZXN0YSBvcGNpb25cbiAgICAgICAgLy8gcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxuICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgIHJldHVybiBpbWFnZVVSSTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRQaG90b3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGZvdG9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2lkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIF9nZXROYW1lcygpOyAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXROYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIElkVGlwbywgTm9tYnJlLCBWYWxvciwgT3JkZW4gRlJPTSAgQmFzZV9UaXBvcyBXSEVSRSAoSWRNYWVzdHJvVGlwb3MgPSAyNSkgb3JkZXIgYnkgTm9tYnJlJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm5hbWVzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpOyAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfY29weUZpbGUgPSBmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IGltYWdlVVJJLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIHZhciBuZXdGaWxlTmFtZSA9ICduZXdfJyArIEZpbGVOYW1lO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jb3B5RmlsZShjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxDYWNoZURpcmVjdG9yeSwgRmlsZU5hbWUsIGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBuZXdGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gc3VjY2VzcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRGb3RvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gaWRmb3RvcyhpZGluc3BlY2Npb24sIHBhdGgsc3luYyx1dWlkLGRlbGV0ZWQsIG9uVXBsb2FkLCBwbGFjYSwgZmVjaGEsIHJ1dGFTcnYpIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LCA/KSc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIC8vIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgICAgaW1hZ2VVUkksXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIDAsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgbW9tZW50U2VydmljZS5ydXRhU3J2KGltYWdlVVJJKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVGb3RvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIC8vVE9ETzogZXMgZWwgcGF0aCBsYSBtZWpvciBmb3JtYSB5IG1hcyBlZmVjdGl2YSBkZSBoYWNlciBlbCB3aGVyZSBkZSBsYSBjb25zdWx0YVxuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGZvdG9zIHNldCBzeW5jPT8gLCBvblVwbG9hZD0gPyBXSEVSRSBpZGluc3BlY2Npb24gPT8gQU5EIHBhdGg9Pyc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIC8vIFRPRE86ICBtdWNobyBjdWlkYWRvIHBvciBlamVtcGxvIGVsIHBhdGggZGViZSBzZXIgbnZhcmNoYXIoKSBOTyAgTkNIQVJcbiAgICAgIC8vIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgc3luYyxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIHBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5yb3dzQWZmZWN0ZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB3YXMgdXBkYXRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5yb3dzQWZmZWN0ZWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9zZXROYW1lID0gZnVuY3Rpb24gKGlkdGlwbywgZm90bykge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGZvdG9zIHNldCBpZHRpcG89PyAgV0hFUkUgaWRpbnNwZWNjaW9uID0/IEFORCBwYXRoPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkdGlwbyxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgZm90by5wYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkucmVtb3ZlID0gX3JlbW92ZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IF9hbGw7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS50YWtlZHBpYyA9IF90YWtlZHBpYztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmNvcHlGaWxlID0gX2NvcHlGaWxlO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuaW5zZXJ0Rm90byA9IF9pbnNlcnRGb3RvO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuZ2V0UGhvdG9zID0gX2dldFBob3RvcztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnVwZGF0ZUZvdG8gPSBfdXBkYXRlRm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnNldE5hbWUgPSBfc2V0TmFtZTtcbiAgICByZXR1cm4gZm90b3NTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2dldFZpZGVvU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FtZXJhJyxcbiAgJyRxJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYW1lcmEsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGdldFZpZGVvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICAvL2dldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5PW51bGw7Ly8gcGVyZGVyaWEgbGEgdWx0aW1hIGluZm9ybWFjaW9uIHNpIGxvIHZ1ZWx2byBhIHJlZmVyZW5jaWFyO1xuICAgIC8vIFRPRE86ICBlc3RvIHNlIGRlYmUgZGUgbGxhbWFyIGRlbnRybyBkZSBsYSBtaXNtYSBmdW5jaW9uLCBwb3IgcXVlIHNpIGxvIGluaWNpYWxpemFtb3MgcG9yIGZ1ZXJhLCBlbCBwdWdpbiBubyBoYSBjYXJnYWRvIHkgb2J0ZW5nbyBjYW1lcmEgaXMgbm90IGRlZmluZWRcbiAgICAvLyB2YXIgX2dldEZpbGVFbnRyeSA9IGZ1bmN0aW9uICh2aWRlb0NvbnRlbnRQYXRoKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZyh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAvLyAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgLy8gICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCh2aWRlb0NvbnRlbnRQYXRoLCBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgLy8gICAgIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgIC8vICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIC8vIH07XG4gICAgLy8gVE9ETzogY3JlYXRlIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5IHkgLmZpbGUsIHBhcmEgZGV2b2x2ZXIgbGEgcHJvbWVzYSBzaW4gZGF0YSB5IHJlZmVyZW5jaWFyIGVsIGNvbnRyb2xhZG9yIGNvbiBsYSBwcm9waWVkYWQgZGVkbCBzZXJ2aWNpbyB0b2RkIG1vdFxuICAgIHZhciBfZ2V0VmlkZW9Db21wcmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuU0FWRURQSE9UT0FMQlVNLFxuICAgICAgICBtZWRpYVR5cGU6IENhbWVyYS5NZWRpYVR5cGUuVklERU9cbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uICh2aWRlb0NvbnRlbnRQYXRoKSB7XG4gICAgICAgIC8vIHJldHVybiBfZ2V0RmlsZUVudHJ5KHZpZGVvQ29udGVudFBhdGgpO1xuICAgICAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZS5jaGVja0ZpbGUodmlkZW9Db250ZW50UGF0aCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGdldFZpZGVvU2VydmljZUZhY3RvcnkuZ2V0VmlkZW9Db21wcmVzcyA9IF9nZXRWaWRlb0NvbXByZXNzO1xuICAgIHJldHVybiBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZ3BzU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgZXJyb3JTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCBtb21lbnRTZXJ2aWNlLCAkcSwgaW50ZXJtZWRpYXRlU2VydmljZSwgc3FsaXRlU2VydmljZSkge1xuICB2YXIgZ3BzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9ncHNIdG1sUHJvbWlzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIHZhciBvcHQgPSB7XG4gICAgICBtYXhpbXVtQWdlOiA5MDAwMCxcbiAgICAgIHRpbWVvdXQ6IDE1MDAwMCxcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgIH07XG4gICAgLy92YXIgb3B0PSB7IG1heGltdW1BZ2U6IDkwMDAwLCB0aW1lb3V0OiAzMDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUgfTsvL3RhbWJpZW4gc2UgcHJvYm8gY29uIDIyLCBwZXJvIHNlIGJhamEgaGFzdGEgMTNcbiAgICAvLyBjb25zb2xlLmxvZyhuYXZpZ2F0b3IsIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24pO1xuICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKFwiZ3BzSHRtbFByb21pc2UgXCIsIHJlc3VsdClcbiAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAvLyBBbiBlcnJvciBvY2N1cmVkLiBTaG93IGEgbWVzc2FnZSB0byB0aGUgdXNlclxuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7ICAvLyRzY29wZS5kaWFsb2coZXJyKTtcbiAgICB9LCBvcHQpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuICB2YXIgX2dwc0h0bWwgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgLy8gVE9ETzogYXVuIHNpbiB3aSBmaSBuaSBkYXRvcyBlbCBncHMgc2lndWUgZnVuY2lvbmFuZG9cbiAgICAvLyBUT0RPOiBwb3IgcXVlIG1lIGRpc3BhcmEgZWwgdmVudG8gZGUgb24gb25saW5lLCBtYXMgcXVlIHRvZG8gY29uIGVsIHdpZmk/Pz8/XG4gICAgaWYgKCEkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcyB8fCBtb21lbnRTZXJ2aWNlLmRpZmZOb3coJGxvY2FsU3RvcmFnZS5sYXRlc3RHcHMpID4gNykge1xuICAgICAgdmFyIG9wdCA9IHtcbiAgICAgICAgbWF4aW11bUFnZTogMzAwMCxcbiAgICAgICAgdGltZW91dDogMTUwMDAwLFxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICAgIH07XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgIF9pbnNlcnRHcHNMb2coaWRpbnNwZWNjaW9uLCBwb3NpdGlvbi5jb29yZHMpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvciwgb3B0KTtcbiAgICB9XG4gIH07XG4gIHZhciBfaW5zZXJ0R3BzTG9nID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgY29vcmRzKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtncHNMb2dzXSAoW2lkaW5zcGVjY2lvbl0gICAsW2ZlY2hhXSAsW2FjY3VyYWN5XSAgLFthbHRpdHVkZV0sICc7XG4gICAgcXVlcnkgKz0gJ1thbHRpdHVkZUFjY3VyYWN5XSAgLFtoZWFkaW5nXSAgLFtsYXRpdHVkZV0gLFtsb25naXR1ZGVdLFtzcGVlZF0pIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LD8pJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgIGNvb3Jkcy5hY2N1cmFjeSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZSxcbiAgICAgIGNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxuICAgICAgY29vcmRzLmhlYWRpbmcsXG4gICAgICBjb29yZHMubGF0aXR1ZGUsXG4gICAgICBjb29yZHMubG9uZ2l0dWRlLFxuICAgICAgY29vcmRzLnNwZWVkXG4gICAgXTtcbiAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcyA9IG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKTtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbFByb21pc2UgPSBfZ3BzSHRtbFByb21pc2U7XG4gIGdwc1NlcnZpY2VGYWN0b3J5Lmdwc0h0bWwgPSBfZ3BzSHRtbDtcbiAgcmV0dXJuIGdwc1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2luc3BlY2Npb25TZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcScsXG4gICckZmlsdGVyJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHEsICRmaWx0ZXIsIGVycm9yU2VydmljZSwgbW9tZW50U2VydmljZSwgenVtZXJvU2VydmljZSkge1xuICAgIHZhciBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNlY3Rpb25zID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24gPSAwO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtID0ge307XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBraWxvbWV0cmFqZTogJycsXG4gICAgICBvYnNlcnZhY2lvbjogJydcbiAgICB9O1xuICAgIHZhciBfc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocHJlSXRlbXMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IG9iai5jb250cm9sSnNvblswXS5pZCxcbiAgICAgICAgICBsYWJlbDogb2JqLmNvbnRyb2xKc29uWzBdLnRleHRcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICBvYmouc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IHByZUl0ZW1zO1xuICAgIH07XG4gICAgdmFyIF9zZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkZmlsdGVyKCd1bmlxdWUnKShpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCAnY3VzdG9tc2VjdGlvbicpLCAnY3VzdG9tc2VjdGlvbicpO1xuICAgIH07XG4gICAgdmFyIF9nZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIF9zZXRJdGVtcygpO1xuICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAvLyBUT0RPOiBsb2dpY2EgcGFyYSBzYWJlciBzaSB5YSBmdWUgY2FsaWZpY2Fkb1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IGZhbHNlO1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkc2VydmljaW8sXG4gICAgICAgIG9iai5pZGl0ZW0sXG4gICAgICAgIG9iai5pZFBhcmVudEl0ZW0sXG4gICAgICAgIG9iai5ub21icmUsXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC5sYWJlbFxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF9zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHFhcnJheSA9IFtdO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEFsbEl0ZW1zKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydE9ic2VydmFjaW9uKCkpO1xuICAgICAgcWFycmF5LnB1c2goX2luc2VydEtpbG9tZXRyYWplKCkpO1xuICAgICAgcmV0dXJuICRxLmFsbChxYXJyYXkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIHNlcnZpY2lvIGluc3BlY2Npb24nKTtcbiAgICAgICAgcmV0dXJuIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSgpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgLy8gY29uc29sZS5sb2coJ2luZ3Jlc28gb2snLCByZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEFsbEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHByb3BpZWRhZGVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICxbaWRpdGVtXSxbaWRwYXJlbnRpdGVtXSAgLFtub21icmVdICxbaWRvcGNpb25dICAsW3NlbGVjY2lvbl0gKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5ncyA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICBiaW5kaW5ncy5wdXNoKF9ydG5CaW5kaW5nKG9iaikpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5pbnNlcnRDb2xsZWN0aW9uKHF1ZXJ5LCBiaW5kaW5ncyk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydE9ic2VydmFjaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtvYnNlcnZhY2lvbmVzXSAoW2lkaW5zcGVjY2lvbl0gLFtpZHN1YnByb2Nlc29dICAsW29ic2VydmFjaW9uXSkgICBWQUxVRVMgKD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5LFxuICAgICAgICAvL19jbC50aXBvLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEtpbG9tZXRyYWplID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtraWxvbWV0cmFqZXNdICAgICAgICAoW2lkaW5zcGVjY2lvbl0sIFtraWxvbWV0cmFqZV0pICAgICAgVkFMVUVTICg/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmdVcGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLmxhYmVsLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRpdGVtXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVNpbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkcHJvcGllZGFkZXNdIHNldCBbaWRvcGNpb25dPT8gLCBbc2VsZWNjaW9uXT0gPyBXSEVSRSBbaWRpbnNwZWNjaW9uXT0/IGFuZCBbaWRpdGVtXT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IF9ydG5CaW5kaW5nVXBkYXRlKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pdGVtKTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc2luZ2xlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NsID0ge1xuICAgICAgaWRjbGFzZTogbnVsbCxcbiAgICAgIGlkY2Fycm9jZXJpYTogbnVsbCxcbiAgICAgIHRpcG86IG51bGxcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBbXTtcbiAgICAvLyBUT0RPOiBwYXJhIGxhIGltcGxlbWVudGFjaW9uIGRlIHBlc2Fkb3MgeSBtb3RvcywgeWEgc2kgZGViZSBzZXIgdW5hIGNvbnN1bHRhXG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnRpcG9zID0gW3tcbiAgICAgICAgdmFsdWU6IDgyOSxcbiAgICAgICAgbGFiZWw6ICdMaXZpYW5vcydcbiAgICAgIH0gIC8vICxcbiAgICAgICAgIC8vIHtcbiAgICAgICAgIC8vICAgdmFsdWU6IDg0NCxcbiAgICAgICAgIC8vICAgbGFiZWw6ICdQZXNhZG9zJ1xuICAgICAgICAgLy8gfVxuXTtcbiAgICB2YXIgX2dldENsYXNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChfY2wudGlwbykgJiYgYW5ndWxhci5pc051bWJlcihwYXJzZUludChfY2wudGlwbykpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGRpc3RpbmN0IGNjLmlkY2xhc2UgYXMgdmFsdWUgICwgYnQuTm9tYnJlIGFzIGxhYmVsICBGUk9NIGNsYXNlc190aXBvVmVoaWN1bG8gY3QgIGlubmVyIGpvaW4gICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjbGFzZT1jdC5pZGNsYXNlICAgaW5uZXIgam9pbiBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz1jYy5pZGNsYXNlICB3aGVyZSBjdC5pZHRpcG92ZWhpY3Vsbz0/JztcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbcGFyc2VJbnQoX2NsLnRpcG8pXTtcbiAgICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBUT0RPOiBBU0kgTk8gU0lSVkUgLCBubyBzZSBhY3R1YWxpemEgZWwgZXhwdWVzdG8gLCxfY2xhc2VzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgX2NsLmlkY2xhc2UgPSBudWxsO1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IFtdO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoX2NsLmlkY2xhc2UpICYmIGFuZ3VsYXIuaXNOdW1iZXIocGFyc2VJbnQoX2NsLmlkY2xhc2UpKSkge1xuICAgICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBkaXN0aW5jdCBjYy5pZGNhcnJvY2VyaWEgYXMgdmFsdWUgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gICAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2Fycm9jZXJpYSAgIHdoZXJlIGNjLmlkY2xhc2U9Pyc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW3BhcnNlSW50KF9jbC5pZGNsYXNlKV07XG4gICAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIF9jbC5pZGNhcnJvY2VyaWEgPSBudWxsO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgW2lkY2xhc2VjYXJyb2NlcmlhXSAsW2lkY2xhc2VdICxbaWRjYXJyb2NlcmlhXSAgLFtpZGNvZGlnb2NhbGlmaWNhY2lvbl0gICxbaWRleHRyYWluZm9dICAgRlJPTSBbY2xhc2VzX2NhcnJvY2VyaWFzXSBXSEVSRSBpZGNsYXNlPT8gYW5kIGlkY2Fycm9jZXJpYT0/ICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2xhc2UpLFxuICAgICAgICBwYXJzZUludChfY2wuaWRjYXJyb2NlcmlhKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGNsYXNlY2Fycm9jZXJpYTtcbiAgICAgICAgcmV0dXJuIF9nZXRUb0luc3BlY3Qoc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkY29kaWdvY2FsaWZpY2FjaW9uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRKc29uID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHZhbHVlLmNvbnRyb2xKc29uID0gYW5ndWxhci5mcm9tSnNvbih2YWx1ZS5jb250cm9sSnNvbik7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUuY29udHJvbEpzb25bMF0udmFsdWUsXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmNvbnRyb2xKc29uWzBdLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24gPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFsdWUuY29udHJvbEpzb24gPSBhbmd1bGFyLmZyb21Kc29uKHZhbHVlLmNvbnRyb2xKc29uKTtcbiAgICAgICAgLy8gVE9ETzogZWwganNvbiBkZSBjb250cm9sSnNvbiBkZXZ1ZWx2ZSB1biB2YWx1ZT0gXCJcIiBzdHJpbmcsIHZlciBzaSBzZSBwdWVkZSBtZWpvcmFyO1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLnZhbHVlLnRvU3RyaW5nKCksXG4gICAgICAgICAgbGFiZWw6IHZhbHVlLmxhYmVsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgdmFsdWUuc2wgPSBzbDtcbiAgICAgIH0pO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IGFycmF5O1xuICAgIH07XG4gICAgdmFyIF9jbGVhck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUgPSAnJztcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gJyc7XG4gICAgfTtcbiAgICAvLyB2YXIgX2NsZWFyVGlwbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbC5pZGNsYXNlID0ge1xuICAgIC8vICAgICBpZGNsYXNlOiBudWxsLFxuICAgIC8vICAgICBpZGNhcnJvY2VyaWE6IG51bGwsXG4gICAgLy8gICAgIHRpcG86IG51bGxcbiAgICAvLyAgIH07XG4gICAgLy8gfTtcbiAgICB2YXIgX2dldFRvSW5zcGVjdCA9IGZ1bmN0aW9uIChpZGNvZGlnb2NhbGlmaWNhY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBvaWYuaWRzZXJ2aWNpbyAsIGNwYy5pZGl0ZW0sIGlkUGFyZW50SXRlbSwgbm9tYnJlLGN1c3RvbXNlY3Rpb24sIGN1c3RvbW9yZGVyICwgY29udHJvbEpzb24gZnJvbSAgdmlld1YzIG9pZiAnO1xuICAgICAgLy9zaWVtcHJlIGRlamFyIHVuIGVzcGFjaW8gZW4gYmxhbmNvICBcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNhbGlmaWNhY2lvbnBpZXphc2NvZGlnbyBjcGMgb24gIGNwYy5pZGl0ZW09IG9pZi5pZGl0ZW0gIGFuZCBvaWYudGlwbz0xICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjb250cm9sRWxlbWVudG9zIGNlIG9uIGNlLmlkY29udHJvbCA9b2lmLmlkY29udHJvbCAnO1xuICAgICAgcXVlcnkgKz0gJ3doZXJlIG9pZi5pZHNlcnZpY2lvPT8gYW5kIGNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICA4MjksXG4gICAgICAgIC8vcGFyc2VJbnQoX2NsLnRpcG8pLFxuICAgICAgICBpZGNvZGlnb2NhbGlmaWNhY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICBfY2xlYXJPYnNLbSgpOyAgLy8gX2NsZWFyVGlwbygpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3Nlck9ic0ttID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgICBvLmlkb2JzZXJ2YWNpb24sICAgb2JzZXJ2YWNpb24sIGtpbG9tZXRyYWplIEZST00gICBvYnNlcnZhY2lvbmVzIG8gaW5uZXIgam9pbiBraWxvbWV0cmFqZXMgayBvbiBrLmlkaW5zcGVjY2lvbj1vLmlkaW5zcGVjY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ1dIRVJFICAgICAoby5pZGluc3BlY2Npb24gPSA/KSBBTkQgKGlkc3VicHJvY2VzbyA9ID8pIE9yZGVyIGJ5IG8uaWRvYnNlcnZhY2lvbiBkZXNjIGxpbWl0IDEgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2YXIgb2JzS20gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF07XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uID0gb2JzS20ub2JzZXJ2YWNpb247XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gb2JzS20ua2lsb21ldHJhamU7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgb2lmLmlkUGFyZW50SXRlbSwgb2lmLm5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uICwgaWRwLmlkb3BjaW9uIGFzIHZhbHVlLCBpZHAuc2VsZWNjaW9uIGFzIGxhYmVsICc7XG4gICAgICBxdWVyeSArPSAnZnJvbSAgdmlld1Zkb3Mgb2lmIGlubmVyIGpvaW4gY2FsaWZpY2FjaW9ucGllemFzY29kaWdvIGNwYyBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjIG9uIGNjLmlkY29kaWdvY2FsaWZpY2FjaW9uPWNwYy5pZGNvZGlnb2NhbGlmaWNhY2lvbiAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRpbnNwZWNjaW9uIGkgb24gaS5pZENsYXNlQ2Fycm9jZXJpYT1jYy5pZGNsYXNlY2Fycm9jZXJpYSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gaWRwcm9waWVkYWRlcyBpZHAgb24gaWRwLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbiBhbmQgaWRwLmlkaXRlbSA9IGNwYy5pZGl0ZW0gJztcbiAgICAgIHF1ZXJ5ICs9ICd3aGVyZSAgaS5pZGluc3BlY2Npb24gPT8gYW5kIG9pZi5pZHNlcnZpY2lvPT8gICAgJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBfc2V0QWxyZWFkeUluc3BlY3RKc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgICByZXR1cm4gX3Nlck9ic0ttKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZGluc3BlY2Npb25dICAgU0VUIFtpZENsYXNlQ2Fycm9jZXJpYV0gPT8gV0hFUkUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZENsYXNlQ2Fycm9jZXJpYSxcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvblxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiBfaW5zZXJ0U3RhdGUoNDc3KTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRTdGF0ZSA9IGZ1bmN0aW9uIChpZGVzdGFkbykge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZHN1YnByb2Nlc29zZWd1aW1pZW50b10gKFtpZGluc3BlY2Npb25dICAgICxbaWRzdWJwcm9jZXNvXSAgICxbaWRlc3RhZG9dICAgLFtmZWNoYV0gICkgIFZBTFVFUyAgICAoPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9fY2wudGlwbyxcbiAgICAgICAgaWRlc3RhZG8sXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSB0cnVlO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7ICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wudGlwbyA9IG51bGw7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbCA9IF9jbDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2xhc2VzID0gX2dldENsYXNlcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0Q2Fycm9jZXJpYXMgPSBfZ2V0Q2Fycm9jZXJpYXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNldElkQ2xhQ2EgPSBfc2V0SWRDbGFDYTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0QWxyZWFkeUluc3BlY3QgPSBfZ2V0QWxyZWFkeUluc3BlY3Q7XG4gICAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsZWFyVGlwbyA9IF9jbGVhclRpcG87XG4gICAgcmV0dXJuIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ludGVybWVkaWF0ZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgaXNUYWtpbmdQaWM6IGZhbHNlLFxuICAgIGlzVGFraW5nVmlkOiBmYWxzZSxcbiAgICBuYXZCYXJTZWFyY2g6IGZhbHNlLFxuICAgIHBsYWNhOiBudWxsLFxuICAgIGlkaW5zcGVjY2lvblN5bmM6IGZhbHNlLFxuICAgIGlkaW5zcGVjY2lvbjogbnVsbFxuICB9O1xuICByZXR1cm4gaW50ZXJtZWRpYXRlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnbW9tZW50U2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgbW9tZW50U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9nZXREYXRlVGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkRGF5cyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAnZGF5cycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZEhvdXJzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdob3VycycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZFNlY29uZHMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ3MnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9ydXRhU3J2ID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgZmlsZW5hbWUgPSBwYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICB2YXIgcnV0YSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS9NTU1NL0RELycpICsgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhICsgJy8nICsgZmlsZW5hbWU7XG4gICAgcmV0dXJuIHJ1dGE7XG4gIH07XG4gIHZhciBfZGlmZk5vdyA9IGZ1bmN0aW9uIChiLCB0aXBvKSB7XG4gICAgdmFyIHJ0YSA9IG1vbWVudCgpLmRpZmYobW9tZW50KGIpLCB0aXBvKTtcbiAgICBjb25zb2xlLmxvZyhydGEsICdkaWZmJyk7XG4gICAgcmV0dXJuIHJ0YTtcbiAgfTtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuZ2V0RGF0ZVRpbWUgPSBfZ2V0RGF0ZVRpbWU7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZERheXMgPSBfYWRkRGF5cztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkSG91cnMgPSBfYWRkSG91cnM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZFNlY29uZHMgPSBfYWRkU2Vjb25kcztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkucnV0YVNydiA9IF9ydXRhU3J2O1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5kaWZmTm93ID0gX2RpZmZOb3c7XG4gIHJldHVybiBtb21lbnRTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdvZmZsaW5lU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgb2ZmbGluZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge307XG4gIC8vIHZhciBfZm9jdXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgLy8gICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gIC8vICAgLy8gZS5nLiBjbGljayBldmVudHMgdGhhdCBuZWVkIHRvIHJ1biBiZWZvcmUgdGhlIGZvY3VzIG9yXG4gIC8vICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXG4gIC8vICAgLy8gYXJlIHRyaWdnZXJlZC5cbiAgLy8gICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gIC8vICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgLy8gICAgIGlmIChlbGVtZW50KSB7XG4gIC8vICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfTtcbiAgb2ZmbGluZVNlcnZpY2VGYWN0b3J5LmRhdGEub2ZmbGluZU1vZGUgPSBmYWxzZTtcbiAgcmV0dXJuIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdvbmxpbmVTdGF0dXNTZXJ2aWNlJywgW1xuICAnJHJvb3RTY29wZScsXG4gICckcScsXG4gICckaW5qZWN0b3InLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRjb3Jkb3ZhTmV0d29yaycsXG4gICckaW9uaWNQb3B1cCcsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgJGluamVjdG9yLCAkbG9jYXRpb24sICRjb3Jkb3ZhTmV0d29yaywgJGlvbmljUG9wdXAsIHp1bWVyb1NlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgICB2YXIgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAgaXNPbmxpbmU6IGZhbHNlLFxuICAgICAgY29ublR5cGU6ICdub25lJ1xuICAgIH07XG4gICAgdmFyIF9pc09ubGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gJGNvcmRvdmFOZXR3b3JrLmlzT25saW5lKCk7XG4gICAgfTtcbiAgICB2YXIgX3R5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9ICRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCk7XG4gICAgfTtcbiAgICB2YXIgX29uT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHJvb3RTY29wZS4kb24oJyRjb3Jkb3ZhTmV0d29yazpvbmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBuZXR3b3JrU3RhdGU7XG4gICAgICAgIC8vIFRPRE86IGV2YWx1YXIgdG9kYXMgbGFzIHBvc2liaWxpZGFkZXMgZGUgZXN0byBhY2EsIHBvciBxdWUgc2kgbGEgc2XDsWFsIGVzIG11eSBtYWxhIHF1ZSBwdWVkZSBwYXNhciwgYXVucXVlIGVsIHp5bmMgZGUgYmFzZXMgZGUgZGF0b3MgbnVuY2EgaGFzaWRvIG11eSBncmFuZGUgZW4gaW5mb3JtYWNpb25cbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpOyAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2UuY2FsbFp5bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyppZighc2lnbmFsU2VydmljZS5pc0luaXQpe1xuICAgICAgICAgICAgICAgICAgICBzaWduYWxTZXJ2aWNlLnN0YXJ0SHViKCk7XG5cbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckY29yZG92YU5ldHdvcms6c2lnbmFsJyx7J25ldHdvcmtTdGF0ZSc6bmV0d29ya1N0YXRlfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb25PZmZsaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gbGlzdGVuIGZvciBPZmZsaW5lIGV2ZW50XG4gICAgICAkcm9vdFNjb3BlLiRvbignJGNvcmRvdmFOZXR3b3JrOm9mZmxpbmUnLCBmdW5jdGlvbiAoZXZlbnQsIG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgbmV0d29ya1N0YXRlKTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9IGZhbHNlO1xuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gZmFsc2U7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gbmV0d29ya1N0YXRlOyAgLyogaWYobmV0d29ya1N0YXRlID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkludGVybmV0IERpc2Nvbm5lY3RlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJUaGUgaW50ZXJuZXQgaXMgZGlzY29ubmVjdGVkIG9uIHlvdXIgZGV2aWNlLlwiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlvbmljLlBsYXRmb3JtLmV4aXRBcHAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICB9KTtcbiAgICB9O1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT25saW5lID0gX29uT25saW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5Lm9uT2ZmbGluZSA9IF9vbk9mZmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSBfaXNPbmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBfdHlwZTtcbiAgICByZXR1cm4gb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdwbGFjYXNTZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcm9vdFNjb3BlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnZGV2aWNlU2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndXBkYXRlU3luY1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoc3FsaXRlU2VydmljZSwgJHJvb3RTY29wZSwgbW9tZW50U2VydmljZSwgYXV0aFNlcnZpY2UsIGRldmljZVNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVwZGF0ZVN5bmNTZXJ2aWNlKSB7XG4gICAgdmFyIHBsYWNhc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gW107XG4gICAgdmFyIF9zZWxlY3RBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGVzdCA9IFt7XG4gICAgICAgICAgaWRpbnNwZWNjaW9uOiAxLFxuICAgICAgICAgIHBsYWNhOiAnYWJjMTExJ1xuICAgICAgICB9XTtcbiAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbC5wdXNoKHRlc3QpOyAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGxhY2FzID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaS5pZGluc3BlY2Npb24sIHBsYWNhLCBpLnN5bmMsICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICBjYXNlIHdoZW4gaXNzLmlkaW5zcGVjY2lvbiBpcyBudWxsIHRoZW4gMCBlbHNlIDEgZW5kIGFzIGNhbGlmaWNhZG8gJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgICAgZnJvbSBpZGluc3BlY2Npb24gaSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgbGVmdCBqb2luIChzZWxlY3QgaWRpbnNwZWNjaW9uIGZyb20gIGlkc3VicHJvY2Vzb3NlZ3VpbWllbnRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgICAgICAgICAgd2hlcmUgaWRlc3RhZG89NDc3KSAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICBpc3Mgb24gaXNzLmlkaW5zcGVjY2lvbj1pLmlkaW5zcGVjY2lvbic7XG4gICAgICBxdWVyeSArPSAnICAgICAgV0hFUkUgVXNlck5hbWU9PyBhbmQgZmVjaGE+ID8nO1xuICAgICAgcXVlcnkgKz0gJyBPcmRlciBieSBpLmlkaW5zcGVjY2lvbiBERVNDIExpbWl0IDEwJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZUZhY3RvcnkuYWxsKTtcbiAgICAgICAgX2luc2VydERldmljZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gdmFyIF91cGRhdGVTeW5jID0gZnVuY3Rpb24gKHBsYWNhLCBzeW5jKSB7XG4gICAgLy8gICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICAvLyAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgLy8gICB2YXIgYmluZGluZyA9IFtcbiAgICAvLyAgICAgc3luYyxcbiAgICAvLyAgICAgcGxhY2EsXG4gICAgLy8gICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgIC8vICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgLy8gICBdO1xuICAgIC8vICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgLy8gfTtcbiAgICB2YXIgX2luc2VydFBMYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gaWRpbnNwZWNjaW9uKHBsYWNhLCBmZWNoYSxVc2VyTmFtZSx1dWlkLCBzeW5jKSBWQUxVRVMgKD8sPyw/LD8sID8pJztcbiAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgIC8vIDAgbWVhbnMgZmFsc2VcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIHN5bmNcbiAgICAgIF07XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EgPSBwbGFjYTtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gZmFsc2U7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyByZXR1cm4gX2dldFBsYWNhcygpOyAgLy8gcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbC5wdXNoKHtcbiAgICAgICAgLy8gICBwbGFjYTogcGxhY2EsXG4gICAgICAgIC8vICAgaWRpbnNwZWNjaW9uOiByZXMuaW5zZXJ0SWRcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSByZXMuaW5zZXJ0SWQ7XG4gICAgICAgIHJldHVybiB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZVN5bmNTZXJ2aWNlLnNlbGVjdElkaW5zcGVjY2lvblN5bmMocGxhY2EpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9nZXRQbGFjYXMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBvbiB6dW1lcm8gc3luYyBkZXNkZSBwcycpO1xuICAgICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0RGV2aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBPUiBJR05PUkUgSU5UTyBbZGV2aWNlc10oW3V1aWRdLFttb2RlbF0pICBWQUxVRVMoPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLnV1aWQsXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS5tb2RlbFxuICAgICAgXTtcbiAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2luc2VydCBkZXZpY2UnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LnNlbGVjdEFsbCA9IF9zZWxlY3RBbGw7XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuZ2V0UGxhY2FzID0gX2dldFBsYWNhcztcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5pbnNlcnRQTGFjYSA9IF9pbnNlcnRQTGFjYTtcbiAgICAvLyBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5pbnNlcnREZXZpY2UgPSBfaW5zZXJ0RGV2aWNlO1xuICAgIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3NxbGl0ZVNlcnZpY2UnLCBbXG4gICckY29yZG92YVNRTGl0ZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YVNRTGl0ZSkge1xuICAgIHZhciBzcWxpdGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZXhlY3V0ZVF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5LCBiaW5kaW5nKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFTUUxpdGUuZXhlY3V0ZShkYiwgcXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydENvbGxlY3Rpb24gPSBmdW5jdGlvbiAocXVlcnksIGJpbmRpbmdzKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFTUUxpdGUuaW5zZXJ0Q29sbGVjdGlvbihkYiwgcXVlcnksIGJpbmRpbmdzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9ydG5BcnJheSA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgaWYgKHJlcy5yb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMucm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFycmF5LnB1c2gocmVzLnJvd3MuaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgfVxuICAgIH07XG4gICAgLy8gVE9ETzogc2kgeW8gY2FtYmlvIGVsIHRpcG8gZGUgZGF0byBkZSB1bmEgY29sdW1uYSwgZWplbXBsbyBzdHJpbmcgdG8gaW50LCBkZWJvIHJlZXN0YWJsZWNlciBsYSBiYXNlIGRlIGRhdG9zIHp1bWVybywgcGFyYSBhZ3JlZ2FyIHVuYSBjb2x1bW5hIG5vIHRlbmdvIHByb2JsZW1hXG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkuZXhlY3V0ZVF1ZXJ5ID0gX2V4ZWN1dGVRdWVyeTtcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5pbnNlcnRDb2xsZWN0aW9uID0gX2luc2VydENvbGxlY3Rpb247XG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkucnRuQXJyYXkgPSBfcnRuQXJyYXk7XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgndGl0bGVTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciB0aXRsZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHRpdGxlU2VydmljZUZhY3RvcnkudGl0bGUgPSAnJztcbiAgcmV0dXJuIHRpdGxlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndG9hc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRjb3Jkb3ZhVG9hc3QpIHtcbiAgdmFyIHRvYXN0U2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9zaG93TG9uZ0JvdHRvbSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICByZXR1cm4gJGNvcmRvdmFUb2FzdC5zaG93TG9uZ0JvdHRvbShtc2cpO1xuICB9O1xuICB2YXIgX3Nob3dTaG9ydEJvdHRvbSA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICByZXR1cm4gJGNvcmRvdmFUb2FzdC5zaG93U2hvcnRCb3R0b20obXNnKTtcbiAgfTtcbiAgdG9hc3RTZXJ2aWNlRmFjdG9yeS5zaG93TG9uZ0JvdHRvbSA9IF9zaG93TG9uZ0JvdHRvbTtcbiAgdG9hc3RTZXJ2aWNlRmFjdG9yeS5zaG93U2hvcnRCb3R0b20gPSBfc2hvd1Nob3J0Qm90dG9tO1xuICByZXR1cm4gdG9hc3RTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd1bnN5bmNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgdmFyIHVuc3luY1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYyA9IFtdO1xuICB2YXIgX2dldEltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgICBpZGZvdG8sIGkuaWRpbnNwZWNjaW9uLCBwYXRoLCBmLnN5bmMsICBpLnBsYWNhLCBmLnJ1dGFTcnYgJztcbiAgICBxdWVyeSArPSAnRlJPTSAgICAgIGlkaW5zcGVjY2lvbiBpICAgIGlubmVyIGpvaW4gIGlkZm90b3MgZiBvbiBpLmlkaW5zcGVjY2lvbiA9IGYuaWRpbnNwZWNjaW9uICc7XG4gICAgcXVlcnkgKz0gJ1dIRVJFICAgIGkudXNlck5hbWUgPSA/IEFORCAgaS5mZWNoYT4/IEFORCAoZi5zeW5jID0gMCkgQU5EIChkZWxldGVkID0gMCkgJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5sZW5ndGg7XG4gICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gIH07XG4gIHZhciBfc3luY0ltYWdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfZ2V0SW1nVW5zeW5jKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoIDwgMSkge1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICBfcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIHZhciBfcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgLy8gVE9ETzogeWEgbm9lIHMgbmVjZXNhcmlvIHBvciBxdWUgb2ZmbGluZSB0YW1iaWVuIGVzdGEgZW4gb25saWxuZXN0YXR1c3NyZXJ2aWNlXG4gICAgICAvLyB8fCAhb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSkge1xuICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIHZhciBfdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgX3VwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgfTtcbiAgdmFyIF91cGRhdGVGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgIC8vIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgIHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA9IHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCAtIDE7XG4gICAgICBpZiAodW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyB9XG4gICAgICAvLyBfZmlsdGVyVW5zeW5jKDApOyAgICAgICAgICBcbiAgICAgIGNvbnNvbGUubG9nKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCwgJ3N5bmMnKTtcbiAgICAgIC8vIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgIHp1bWVyb1NlcnZpY2UuenluYygwKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdteUV2ZW50Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdW5zeW5jU2VydmljZUZhY3RvcnkuZ2V0SW1nVW5zeW5jID0gX2dldEltZ1Vuc3luYztcbiAgdW5zeW5jU2VydmljZUZhY3Rvcnkuc3luY0ltYWdlcyA9IF9zeW5jSW1hZ2VzO1xuICByZXR1cm4gdW5zeW5jU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndXBkYXRlU3luY1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGF1dGhTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciB1cGRhdGVTeW5jU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF91cGRhdGVTeW5jID0gZnVuY3Rpb24gKHBsYWNhLCBzeW5jKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGluc3BlY2Npb24gc2V0IHN5bmM9PyAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+Pyc7XG4gICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIHN5bmMsXG4gICAgICBwbGFjYSxcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgfTtcbiAgdmFyIF9zZWxlY3RJZGluc3BlY2Npb25TeW5jID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBpZGluc3BlY2Npb24gZnJvbSBpZGluc3BlY2Npb24gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8gT3JkZXIgYnkgaWRpbnNwZWNjaW9uIERFU0MgTGltaXQgMSc7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBwbGFjYSxcbiAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIF07XG4gICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uaWRpbnNwZWNjaW9uO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgPSB0cnVlO1xuICAgICAgcmV0dXJuIF91cGRhdGVTeW5jKHBsYWNhLCB0cnVlKTtcbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSwgJ2Vycm9yJyk7XG4gICAgfSk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgICAgICAvLyB9KTtcbiAgfTtcbiAgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVN5bmMgPSBfdXBkYXRlU3luYztcbiAgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnNlbGVjdElkaW5zcGVjY2lvblN5bmMgPSBfc2VsZWN0SWRpbnNwZWNjaW9uU3luYztcbiAgLy8gdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5LnN5bmNJbWFnZXMgPSBfc3luY0ltYWdlcztcbiAgcmV0dXJuIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd2aWRlb1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhcHR1cmUnLFxuICAnc3FsaXRlU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYXB0dXJlLCBzcWxpdGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHZpZGVvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyA9IFtdO1xuICAgIHZhciBfYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zO1xuICAgIH07XG4gICAgdmFyIF90YWtlZFZpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBsaW1pdDogMSxcbiAgICAgICAgZHVyYXRpb246IDEyXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FwdHVyZS5jYXB0dXJlVmlkZW8ob3B0aW9ucykudGhlbihmdW5jdGlvbiAodmlkZW9EYXRhKSB7XG4gICAgICAgIHJldHVybiB2aWRlb0RhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0VmlkZW9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRWaWRlb3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyh2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgdGh1bWJuYWlsLCBvblVwbG9hZCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkVmlkZW9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsdGh1bWJuYWlsLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2ICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sID8pJztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgICBwYXRoLFxuICAgICAgICBzeW5jLFxuICAgICAgICAndGVzdHV1aWQnLFxuICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgbW9tZW50U2VydmljZS5ydXRhU3J2KHBhdGgpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbiwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIC8vVE9ETzogZXMgZWwgcGF0aCBsYSBtZWpvciBmb3JtYSB5IG1hcyBlZmVjdGl2YSBkZSBoYWNlciBlbCB3aGVyZSBkZSBsYSBjb25zdWx0YVxuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZFZpZGVvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LmFsbCA9IF9hbGw7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS50YWtlZFZpZCA9IF90YWtlZFZpZDtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LmdldFZpZGVvcyA9IF9nZXRWaWRlb3M7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5pbnNlcnRWaWRlbyA9IF9pbnNlcnRWaWRlbztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnVwZGF0ZVZpZGVvID0gX3VwZGF0ZVZpZGVvO1xuICAgIHJldHVybiB2aWRlb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgndmlkZW9UaHVtYm5haWxTZXJ2aWNlJywgW1xuICAnJHEnLFxuICBmdW5jdGlvbiAoJHEpIHtcbiAgICB2YXIgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZ2VuZXJhdGVUaHVtYm5haWwgPSBmdW5jdGlvbiAobmF0aXZlVVJMKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIG5hbWUgPSBuYXRpdmVVUkwuc2xpY2UoMCwgLTQpO1xuICAgICAgd2luZG93LlBLVmlkZW9UaHVtYm5haWwuY3JlYXRlVGh1bWJuYWlsKG5hdGl2ZVVSTCwgbmFtZSArICcucG5nJywgZnVuY3Rpb24gKHByZXZTdWNjKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByZXZTdWNjKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcmV2U3VjYyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZ2VuZXJuYWRvIHRodW1ibmFpbCcsIGUpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeS5nZW5lcmF0ZVRodW1ibmFpbCA9IF9nZW5lcmF0ZVRodW1ibmFpbDtcbiAgICByZXR1cm4gdmlkZW9UaHVtYm5haWxTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3p1bWVyb1NlcnZpY2UnLCBbXG4gICckcScsXG4gICckY29yZG92YURldmljZScsXG4gICckY29yZG92YVNRTGl0ZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3VwZGF0ZVN5bmNTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICckdGltZW91dCcsXG4gIC8vICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRxLCAkY29yZG92YURldmljZSwgJGNvcmRvdmFTUUxpdGUsIG9mZmxpbmVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1cGRhdGVTeW5jU2VydmljZSwgdG9hc3RTZXJ2aWNlLCAkdGltZW91dCkge1xuICAgIHZhciB6dW1lcm8gPSBudWxsO1xuICAgIHZhciB6dW1lcm9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfc2V0RGJQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9vcHRpb25zID0ge1xuICAgICAgICBBbmRyb2lkOiAnL2RhdGEvZGF0YS8nICsgenVtZXJvU2VydmljZUZhY3RvcnkucGFja2FnZU5hbWUgKyAnL2RhdGFiYXNlcy8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsXG4gICAgICAgIGlPUzogJ2NkdmZpbGU6Ly9sb2NhbGhvc3QvcGVyc2lzdGVudC8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsXG4gICAgICAgIHdpbjMybnQ6ICcvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlXG4gICAgICB9O1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJwYXRoID0gX29wdGlvbnNbJGNvcmRvdmFEZXZpY2UuZ2V0UGxhdGZvcm0oKV07XG4gICAgfTtcbiAgICB2YXIgX3NldFp1bWVybyA9IGZ1bmN0aW9uIChkYmZpbGUpIHtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZSA9IGRiZmlsZTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlID0genVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlICsgJy5kYic7XG4gICAgICAvL29wZW4gZGIgY29uIHNxbGl0ZXBsdWdpbiBicm9keVxuICAgICAgZGIgPSAkY29yZG92YVNRTGl0ZS5vcGVuREIoenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUsIDEpO1xuICAgICAgenVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNlcnZlciA9ICdodHRwOi8vMTkwLjE0NS4zOS4xMzg6ODA4MC8nO1xuICAgICAgLy8naHR0cDovLzE5Mi4xNjguMC41MTo4MDgwLyc7XG4gICAgICAvLyBUT0RPOiBERVBFTkRFIFNJIEVTVE9ZIEVOIE1JIENBU0EgTyBFTiBMQSBPRklDSU5BJ2h0dHA6Ly8xOTIuMTY4LjEuMTM6ODA4MC8nO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkucGFja2FnZU5hbWUgPSAnY29tLmFqdXN0ZXYuYic7XG4gICAgICBfc2V0RGJQYXRoKCk7XG4gICAgfTtcbiAgICAvLyBUT0RPOiAgcmVjb3JkYXIgayBlc3RvIGVzIHVuYSBwcm9tZXNhIHkgZGVzZW5jYWRlbmEgYWNjaW9uZXMsIHNpIGVzIHJlc3VlbHRhIG8gc2kgZXMgcmVqZWN0ICwgdmFsbGlkYXJcbiAgICB2YXIgX3p5bmMgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgLy8gVE9ETzogYWJyaXJpIGVsIHB1ZXJ0byBwYXJhIHp1bWVybyBlbiBlbCBmaXJld2FsbFxuICAgICAgLy8gVE9ETzogY3JlYXIgdW5hIHNlcnZpY2lvIGdsb2JhbCBwYXJhIGRlIGFoaSBzYWNhciBlbCBpZGluc3BlY2Npb24gYWN0dWFsLCBpbmN1c2l2ZSBkZXNwdWVzIGRlIHVuIHp5bmMgcGFyYSBzYWJlciBxdWUgZXMgZWwgYWRlY3VhZG9cbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgLy8gVE9ETzogbWUgcGFyZWNlIG1hcyBsb2dpY28gcmV0b3JuYXIgdW4gcmVqZWN0IHNpIGVzdGEgZW4gbW9kbyBvZmZsaW5lXG4gICAgICAgIHEucmVqZWN0KCdvZmZsaW5lTW9kZSBvIHNpbiBjb25leGlvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnb2ZmbGluZSBtb2RlIGFjdGl2YWRvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLnRpbWUoJ3p5bmMnICsgaSk7XG4gICAgICAgIHZhciB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdzaW5jcm9uaXphbmRvLi4nKTtcbiAgICAgICAgfSwgMjUwMCk7XG4gICAgICAgIHp1bWVyby5zeW5jKHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRicGF0aCwgJycsIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNlcnZlciwgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlLCBudWxsLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ29rJyk7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmICghaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgJiYgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgICAgLy8gdXBkYXRlU3luY1NlcnZpY2UudXBkYXRlU3luYyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHRydWUpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXBkYXRlU3luY1NlcnZpY2Uuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBxLnJlc29sdmUoJ3p5bmMgb2snKTtcbiAgICAgICAgICAgIH0pOyAgLy8gfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICBxLnJlc29sdmUoJ3p5bmMgb2snKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnenluYycgKyBpKTtcbiAgICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gNDU2KSB7XG4gICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcS5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfTtcbiAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXRadW1lcm8gPSBfc2V0WnVtZXJvO1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5Lnp5bmMgPSBfenluYztcbiAgICByZXR1cm4genVtZXJvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==