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
  $urlRouterProvider.otherwise('/app/login');
  // TODO: para que se consideren sanas las ng-src que tengan esta sintaxis;
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
  $compileProvider.debugInfoEnabled(true);
});
var serviceBase = 'http://190.145.39.138/auth/';
app.constant('ngAuthSettings', {
  apiServiceBaseUri: serviceBase,
  clientId: 'ngAuthApp'
})  // .config(function ($provide) {
    //   $provide.decorator('$exceptionHandler', function ($delegate, $injector) {
    //     return function (exception, cause) {
    //       $delegate(exception, cause);
    //       var sqliteService = $injector.get('sqliteService');
    //       var authService = $injector.get('authService');
    //       var momentService = $injector.get('momentService');
    //       var query = 'INSERT  INTO [logs]([ex],[email],[fecha])  VALUES(?,?,?)';
    //       var binding = [
    //         angular.toJson(exception),
    //         authService.authentication.userName || '',
    //         momentService.getDateTime()
    //       ];
    //       sqliteService.executeQuery(query, binding).then(function (res) {
    //       }, function (err) {
    //         console.error(err);
    //       })  // var alerting = $injector.get("alerting");
    //           // alerting.addDanger(exception.message);
    // ;
    //     };
    //   });
    // })
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
  '$timeout',
  function ($scope, zumeroService, $ionicPlatform, placasService, $ionicNavBarDelegate, $location, $ionicPopup, $ionicScrollDelegate, focus, $state, titleService, $ionicModal, toastService, firstInitService, $localStorage, $ionicLoading, $filter, intermediateService,$timeout) {
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

      $scope.fInit=function(){
          firstInitService.init().then(function () {
          $scope.hide();
          $scope.getPlacas();
        }, function () {
          $scope.hide();
        });

      }
      // TODO: seria bueno que la consulta de placas supiera todo, como por ejemplo si ya se califico, si ya tiene alguna foto o un video, puede ser marcandolo con alguna clase
      if (!$localStorage.data) {
        $scope.show();
        // TODO: puedo poder obj=null, para que me elimine la base de datos si ya esta creada y vuelva a sincronizar, esto seria beneficioso si tengo que hacer un cambio en la base de ddatos que requiera reconstruirla
       $timeout($scope.fInit,300);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiY29udHJvbGxlcnMvQWNjZXNvcmlvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9Gb3RvQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9QbGFjYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9WaWRlb0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZWFzeURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9lcnJvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9maWxlVHJhbnNmZXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlyc3RJbml0U2VydmljZS5qcyIsInNlcnZpY2VzL2ZvY3VzU2VydmljZS5qcyIsInNlcnZpY2VzL2ZvdG9zU2VydmljZS5qcyIsInNlcnZpY2VzL2dldFZpZGVvU2VydmljZS5qcyIsInNlcnZpY2VzL2dwc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9pbnNwZWNjaW9uU2VydmljZS5qcyIsInNlcnZpY2VzL2ludGVybWVkaWF0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9tb21lbnRTZXJ2aWNlLmpzIiwic2VydmljZXMvb2ZmbGluZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vbmxpbmVTdGF0dXNTZXJ2aWNlLmpzIiwic2VydmljZXMvcGxhY2FzU2VydmljZS5qcyIsInNlcnZpY2VzL3NxbGl0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90aXRsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90b2FzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy91bnN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdXBkYXRlU3luY1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1RodW1ibmFpbFNlcnZpY2UuanMiLCJzZXJ2aWNlcy96dW1lcm9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbi8vIHZhciBscyA9IG51bGw7XG4vLyB2YXIgenVtZXJvID0gbnVsbDtcbi8vIHZhciBjcyA9IG51bGw7XG4vLyB2YXIgenMgPSBudWxsO1xuLy8gdmFyIHBzID0gbnVsbDtcbi8vIHZhciBwYyA9IG51bGw7XG4vLyB2YXIgY2YgPSBudWxsO1xuLy8gdmFyIGVkID0gbnVsbDtcbi8vIHZhciBjYyA9IG51bGw7XG4vLyBwcnVlYmFzIGxvY2FsZXNcbnZhciBkYiA9IG51bGw7XG4vLyB2YXIgc2VydmljZXMgPSB7fTtcbi8vIHZhciBuZ0NvcmRvdmEgPSB7fTtcbi8vIHZhciBhbHJlYWR5SW5zcGVjdCA9IGZhbHNlO1xuLy8gdmFyIHJwID0gbnVsbDtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFtcbiAgJ2lvbmljJyxcbiAgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLFxuICAnbmdTdG9yYWdlJyxcbiAgJ25nQ29yZG92YScsXG4gICd1aS51dGlscycsXG4gICduZ0Z4JyxcbiAgJ25nQW5pbWF0ZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZSdcbl0pLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJyk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhcHAnLCB7XG4gICAgdXJsOiAnL2FwcCcsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVudS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQXBwQ3RybCdcbiAgfSkuc3RhdGUoJ2FwcC5zZWFyY2gnLCB7XG4gICAgdXJsOiAnL3NlYXJjaCcsXG4gICAgdmlld3M6IHsgJ21lbnVDb250ZW50JzogeyB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9zZWFyY2guaHRtbCcgfSB9XG4gIH0pLnN0YXRlKCdhcHAuYnJvd3NlJywge1xuICAgIHVybDogJy9icm93c2UnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnJvd3NlLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLnBsYXlsaXN0cycsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdHMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdHNDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGFjYXMnLCB7XG4gICAgdXJsOiAnL3BsYWNhcycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxhY2FzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxhY2FzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuc2luZ2xlJywge1xuICAgIHVybDogJy9wbGF5bGlzdHMvOnBsYXlsaXN0SWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5mb3RvJywge1xuICAgIHVybDogJy9mb3Rvcy86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2ZvdG8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3RvQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAudmlkZW8nLCB7XG4gICAgdXJsOiAnL3ZpZGVvLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdmlkZW8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWaWRlb0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgdXJsOiAnL2luc3BlY2Npb24vOmlkLzpwbGFjYS86Y2FsaWZpY2FkbycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaW5zcGVjY2lvbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0luc3BlY2Npb25DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luSW9uaWMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmFjY2Vzb3Jpb3MnLCB7XG4gICAgdXJsOiAnL2FjY2Vzb3Jpb3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY2Nlc29yaW9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWNjZXNvcmlvc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9sb2dpbicpO1xuICAvLyBUT0RPOiBwYXJhIHF1ZSBzZSBjb25zaWRlcmVuIHNhbmFzIGxhcyBuZy1zcmMgcXVlIHRlbmdhbiBlc3RhIHNpbnRheGlzO1xuICAkY29tcGlsZVByb3ZpZGVyLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZpbGV8YmxvYnxjZHZmaWxlfGNvbnRlbnQpOnxkYXRhOmltYWdlXFwvLyk7XG4gICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZCh0cnVlKTtcbn0pO1xudmFyIHNlcnZpY2VCYXNlID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoLyc7XG5hcHAuY29uc3RhbnQoJ25nQXV0aFNldHRpbmdzJywge1xuICBhcGlTZXJ2aWNlQmFzZVVyaTogc2VydmljZUJhc2UsXG4gIGNsaWVudElkOiAnbmdBdXRoQXBwJ1xufSkgIC8vIC5jb25maWcoZnVuY3Rpb24gKCRwcm92aWRlKSB7XG4gICAgLy8gICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRleGNlcHRpb25IYW5kbGVyJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSwgJGluamVjdG9yKSB7XG4gICAgLy8gICAgIHJldHVybiBmdW5jdGlvbiAoZXhjZXB0aW9uLCBjYXVzZSkge1xuICAgIC8vICAgICAgICRkZWxlZ2F0ZShleGNlcHRpb24sIGNhdXNlKTtcbiAgICAvLyAgICAgICB2YXIgc3FsaXRlU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ3NxbGl0ZVNlcnZpY2UnKTtcbiAgICAvLyAgICAgICB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgIC8vICAgICAgIHZhciBtb21lbnRTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnbW9tZW50U2VydmljZScpO1xuICAgIC8vICAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgIElOVE8gW2xvZ3NdKFtleF0sW2VtYWlsXSxbZmVjaGFdKSAgVkFMVUVTKD8sPyw/KSc7XG4gICAgLy8gICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgLy8gICAgICAgICBhbmd1bGFyLnRvSnNvbihleGNlcHRpb24pLFxuICAgIC8vICAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUgfHwgJycsXG4gICAgLy8gICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAvLyAgICAgICBdO1xuICAgIC8vICAgICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAvLyAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgLy8gICAgICAgfSkgIC8vIHZhciBhbGVydGluZyA9ICRpbmplY3Rvci5nZXQoXCJhbGVydGluZ1wiKTtcbiAgICAvLyAgICAgICAgICAgLy8gYWxlcnRpbmcuYWRkRGFuZ2VyKGV4Y2VwdGlvbi5tZXNzYWdlKTtcbiAgICAvLyA7XG4gICAgLy8gICAgIH07XG4gICAgLy8gICB9KTtcbiAgICAvLyB9KVxuLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQsICRpb25pY1BsYXRmb3JtLCAkbG9jYWxTdG9yYWdlLCAkY29yZG92YVNRTGl0ZSwgY2hlY2tGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCAkY29yZG92YUNhbWVyYSwgZmlsZVRyYW5zZmVyU2VydmljZSwgenVtZXJvU2VydmljZSwgJGNvcmRvdmFGaWxlLCBlYXN5RGlyU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjb3B5RmlsZVNlcnZpY2UsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBpbnNwZWNjaW9uU2VydmljZSwgcGxhY2FzU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgY29yZG92YUV2ZW50c1NlcnZpY2UsIHRvYXN0U2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkc3RhdGUsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVuc3luY1NlcnZpY2UsIGZvdG9zU2VydmljZSwgZ3BzU2VydmljZSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICB9XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XG4gICAgLy8gJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhldmVudCwgbmV4dCwgY3VycmVudCk7XG4gICAgLy8gfSk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICBjb25zb2xlLmxvZyhldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmICh0b1N0YXRlLm5hbWUgPT09ICdhcHAubG9naW4nKSB7XG4gICAgICAgIC8vIGRvZSBzaGUvaGUgdHJ5IHRvIGdvIHRvIGxvZ2luPyAtIGxldCBoaW0vaGVyIGdvXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGF1dGhEYXRhLCBtb21lbnRTZXJ2aWNlLmRpZmZOb3coYXV0aERhdGEuZXhwLCAnbScpLCAnPiAtNjAnKTtcbiAgICAgIGlmICghYXV0aERhdGEgfHwgbW9tZW50U2VydmljZS5kaWZmTm93KGF1dGhEYXRhLmV4cCwgJ20nKSA+IC02MCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlZGlyZWN0Jyk7XG4gICAgICAgICAgLy9XYXMgY2FsbGluZyB0aGlzIGJ1dCBjb21tZW50aW5nIG91dCB0byBrZWVwIGl0IHNpbXBsZTogYXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgLy9DaGFuZ2VzIFVSTCBidXQgbm90IHRoZSB2aWV3IC0gZ29lcyB0byBvcmlnaW5hbCB2aWV3IHRoYXQgSSdtIHRyeWluZyB0byByZWRpcmVjdFxuICAgICAgICAgIC8vYXdheSBmcm9tIG5vdyB3aXRoIDEuMy4gRmluZSB3aXRoIGl0IGJ1dCBpbnRlcmVzdGVkIGluIHVuZGVyc3RhbmRpbmcgdGhlIFxuICAgICAgICAgIC8vXCJwcm9wZXJcIiB3YXkgdG8gZG8gaXQgbm93IHNvIGxvZ2luIHZpZXcgZ2V0cyByZWRpcmVjdGVkIHRvLlxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7ICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vTmljZSBhZGRpdGlvbiEgQ2FuJ3QgZG8gYW55IHJlZGlyZWN0IHdoZW4gaXQncyBjYWxsZWQgdGhvdWdoXG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxzID0gJGxvY2FsU3RvcmFnZTtcbiAgICAvLyB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgIC8vIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2UgPSB6dW1lcm9TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmdldFZpZGVvU2VydmljZSA9IGdldFZpZGVvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5jb3B5RmlsZVNlcnZpY2UgPSBjb3B5RmlsZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuZmlsZVRyYW5zZmVyU2VydmljZSA9IGZpbGVUcmFuc2ZlclNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMudmlkZW9UaHVtYm5haWxTZXJ2aWNlID0gdmlkZW9UaHVtYm5haWxTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmVhc3lEaXJTZXJ2aWNlID0gZWFzeURpclNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuY2hlY2tGaWxlU2VydmljZSA9IGNoZWNrRmlsZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMuYWNjZXNvcmlvc1NlcnZpY2UgPSBhY2Nlc29yaW9zU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5pbnNwZWNjaW9uU2VydmljZSA9IGluc3BlY2Npb25TZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnVuc3luY1NlcnZpY2UgPSB1bnN5bmNTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLm9ubGluZVN0YXR1c1NlcnZpY2UgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmNvcmRvdmFFdmVudHNTZXJ2aWNlID0gY29yZG92YUV2ZW50c1NlcnZpY2U7XG4gICAgLy8gc2VydmljZXMudG9hc3RTZXJ2aWNlID0gdG9hc3RTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLm9mZmxpbmVTZXJ2aWNlID0gb2ZmbGluZVNlcnZpY2U7XG4gICAgLy8gc2VydmljZXMubG9jYWxTdG9yYWdlID0gJGxvY2FsU3RvcmFnZTtcbiAgICAvLyBzZXJ2aWNlcy5maXJzdEluaXRTZXJ2aWNlID0gZmlyc3RJbml0U2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5tb21lbnRTZXJ2aWNlID0gbW9tZW50U2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmRldmljZVNlcnZpY2UgPSBkZXZpY2VTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmludGVybWVkaWF0ZVNlcnZpY2UgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlO1xuICAgIC8vIHNlcnZpY2VzLmZvdG9zU2VydmljZSA9IGZvdG9zU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy5ncHNTZXJ2aWNlID0gZ3BzU2VydmljZTtcbiAgICAvLyBuZ0NvcmRvdmEuY29yZG92YVNRTGl0ZSA9ICRjb3Jkb3ZhU1FMaXRlO1xuICAgIC8vIG5nQ29yZG92YS5jb3Jkb3ZhRmlsZSA9ICRjb3Jkb3ZhRmlsZTtcbiAgICAvLyBuZ0NvcmRvdmEuY29yZG92YUNhbWVyYSA9ICRjb3Jkb3ZhQ2FtZXJhO1xuICAgIC8vIHpzID0genVtZXJvU2VydmljZTtcbiAgICAvLyBjcyA9IDtcbiAgICAvLyBjZiA9IDtcbiAgICAvLyBlZCA9IGVhc3lEaXJTZXJ2aWNlO1xuICAgIC8vIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKCd6ZGJmaWxlLmRiJywgMSk7XG4gICAgLy8gY2MgPSAkY29yZG92YUNhbWVyYTtcbiAgICAvLyBjYyA9IGdldFZpZGVvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnemRiZmlsZScpO1xuICAgIC8vIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6dW1lcm90ZXN0ZGJmaWxlJyk7XG4gICAgenVtZXJvU2VydmljZS5zZXRadW1lcm8oJ3p1bWVyb3Rlc3RkYmZpbGUnKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLm9uT25saW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5vbk9mZmxpbmUoKTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5jb25uVHlwZSgpO1xuICAgIGNvcmRvdmFFdmVudHNTZXJ2aWNlLm9uUGF1c2UoKTtcbiAgICBjb3Jkb3ZhRXZlbnRzU2VydmljZS5vblJlc3VtZSgpO1xuICAgIGRldmljZVNlcnZpY2Uuc2V0SW5mbygpO1xuICAgIC8vIFRPRE86ICB2ZXJpZmljYXIgc2kgZXhpc3RlIGVuIGVsIGxvY2Fsc3RvcmFnZSBhbGd1bmEgYmFuZGVyYSBxdWUgZGlnYSBzaSB5YSBzZSBzeW5jIGFsZ3VuYSB2ZXogXG4gICAgJGxvY2FsU3RvcmFnZS5tZXNzYWdlID0gJ0hlbGxvIFdvcmxkJztcbiAgICBhdXRoU2VydmljZS5maWxsQXV0aERhdGEoKTsgIC8vIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKCFhdXRoRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdmFyIG4gPSBtb21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdmFyIGUgPSBtb21lbnQoYXV0aERhdGEuZXhwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBpZiAobi5kaWZmKGUsICdzZWNvbmRzJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3Rva2VuIHJlZGlyZWN0IGxvZ2luIHRlc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9wbGFjYXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gIH0pO1xufSk7ICAvLyBhcHAucnVuKFtcbiAgICAgLy8gICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICAgIC8vICAgJyRsb2NhdGlvbicsXG4gICAgIC8vICAgZnVuY3Rpb24gKGxvY2FsU3RvcmFnZVNlcnZpY2UsICRsb2NhdGlvbikge1xuICAgICAvLyAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgIC8vICAgICBpZiAoIWF1dGhEYXRhKSB7XG4gICAgIC8vICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbicpO1xuICAgICAvLyAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAvLyAgICAgICAvLyBUT0RPOiBlc3RvIG5vIGVzIG5lY2VzYXJpbywgcG9yIHF1ZSBhbCBpbnRlbnRhciBzaW5jcm9uaXphciB1bmEgaW1hZ2VuIHkgZWwgdG9rZW4gZXN0YSB2ZW5jaWRvLCBzZSByZWRpcmVjY2lvbmEgYSBsb2dpbiBhdXRvbWF0aWNhbWVudGVcbiAgICAgLy8gICAgICAgdmFyIG4gPSBtb21lbnQoKTtcbiAgICAgLy8gICAgICAgdmFyIGUgPSBtb21lbnQoYXV0aERhdGEuZXhwKTtcbiAgICAgLy8gICAgICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAvLyAgICAgICBpZiAobi5kaWZmKGUsICdzZWNvbmRzJykgPiAwKSB7XG4gICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ3Rva2VuIHJlZGlyZWN0IGxvZ2luJyk7XG4gICAgIC8vICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAvLyAgICAgICB9XG4gICAgIC8vICAgICB9XG4gICAgIC8vICAgfVxuICAgICAvLyBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJywgW10pLmNvbnRyb2xsZXIoJ0FwcEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaW9uaWNNb2RhbCwgJHRpbWVvdXQpIHtcbiAgLy8gRm9ybSBkYXRhIGZvciB0aGUgbG9naW4gbW9kYWxcbiAgJHNjb3BlLmxvZ2luRGF0YSA9IHt9O1xuICAvLyBDcmVhdGUgdGhlIGxvZ2luIG1vZGFsIHRoYXQgd2Ugd2lsbCB1c2UgbGF0ZXJcbiAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvbG9naW4uaHRtbCcsIHsgc2NvcGU6ICRzY29wZSB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICB9KTtcbiAgLy8gVHJpZ2dlcmVkIGluIHRoZSBsb2dpbiBtb2RhbCB0byBjbG9zZSBpdFxuICAkc2NvcGUuY2xvc2VMb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICB9O1xuICAvLyBPcGVuIHRoZSBsb2dpbiBtb2RhbFxuICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgfTtcbiAgLy8gUGVyZm9ybSB0aGUgbG9naW4gYWN0aW9uIHdoZW4gdGhlIHVzZXIgc3VibWl0cyB0aGUgbG9naW4gZm9ybVxuICAkc2NvcGUuZG9Mb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnRG9pbmcgbG9naW4nLCAkc2NvcGUubG9naW5EYXRhKTtcbiAgICAvLyBTaW11bGF0ZSBhIGxvZ2luIGRlbGF5LiBSZW1vdmUgdGhpcyBhbmQgcmVwbGFjZSB3aXRoIHlvdXIgbG9naW5cbiAgICAvLyBjb2RlIGlmIHVzaW5nIGEgbG9naW4gc3lzdGVtXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmNsb3NlTG9naW4oKTtcbiAgICB9LCAxMDAwKTtcbiAgfTtcbn0pLmNvbnRyb2xsZXIoJ1BsYXlsaXN0c0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICRzY29wZS5wbGF5bGlzdHMgPSBbXG4gICAge1xuICAgICAgdGl0bGU6ICdSZWdnYWUnLFxuICAgICAgaWQ6IDFcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnQ2hpbGwnLFxuICAgICAgaWQ6IDJcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnRHVic3RlcCcsXG4gICAgICBpZDogM1xuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdJbmRpZScsXG4gICAgICBpZDogNFxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdSYXAnLFxuICAgICAgaWQ6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnQ293YmVsbCcsXG4gICAgICBpZDogNlxuICAgIH1cbiAgXTtcbn0pLmNvbnRyb2xsZXIoJ1BsYXlsaXN0Q3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcykge1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0FjY2Vzb3Jpb3NDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAncGxhY2FzU2VydmljZScsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICckbG9jYXRpb24nLFxuICAnJGlvbmljUG9wdXAnLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZm9jdXMnLFxuICAnJHN0YXRlJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ2FjY2Vzb3Jpb3NTZXJ2aWNlJyxcbiAgJ2ZvdG9zU2VydmljZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICdvbmxpbmVTdGF0dXNTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsIHp1bWVyb1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBwbGFjYXNTZXJ2aWNlLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGxvY2F0aW9uLCAkaW9uaWNQb3B1cCwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZvY3VzLCAkc3RhdGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZVBhcmFtcywgJGlvbmljTW9kYWwsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBmb3Rvc1NlcnZpY2UsIGNvcHlGaWxlU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICAvL1xuICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XG4gICAgICAkc2NvcGUub3NzID0gb25saW5lU3RhdHVzU2VydmljZS5kYXRhO1xuICAgICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvb3Blbk5ld0FjY2Vzb3Jpby5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuYWNjZXMgPSBbXTtcbiAgICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjY2VzID0gYWNjZXNvcmlvc1NlcnZpY2UuYWxsO1xuICAgICAgfTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgaXRlbXMgZW4gIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmluaXRPcHRpb25zKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgY29udHJvbGFkb3InKTtcbiAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0RGF0YTtcbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLmluaXRhY2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2MgPSBhY2Nlc29yaW9zU2VydmljZS5pbml0QWNjKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNob3dNb2RhbE5ldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmluaXRhY2MoKTtcbiAgICAgICAgJHNjb3BlLm1vZHNob3cgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2Uuc2F2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDQpO1xuICAgICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0pOyAgLy8gJHNjb3BlLmFjY2VzLnB1c2goJHNjb3BlLmFjYyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGVJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcucGF0aCA9ICdodHRwOi8vaS5kYWlseW1haWwuY28udWsvaS9waXgvMjAxNC8wMy8yMy9hcnRpY2xlLTI1ODc0NTQtMUM4NjQ5OTEwMDAwMDU3OC00MzhfNjM0eDQzMC5qcGcnO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5tb2QgPSBmdW5jdGlvbiAoYWNjKSB7XG4gICAgICAgICRzY29wZS5tb2RzaG93ID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmFjYyA9IGFjYztcbiAgICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VBY3RNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogQVFVSSBURU5EUklBIFFVRSBIQUNFUiBFTCBVUERBVEUgXG4gICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKCRzY29wZS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oJHNjb3BlLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgZm90byAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcub25VcGxvYWQgPSBvblVwbG9hZDtcbiAgICAgICAgdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUudHJ5VXBsb2FkID0gZnVuY3Rpb24gKGZvdG8pIHtcbiAgICAgICAgZm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQoZm90byk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IHRydWU7XG4gICAgICAgIGZvdG9zU2VydmljZS50YWtlZHBpYygpLnRoZW4oZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgIHZhciBzeW5jID0gMDtcbiAgICAgICAgICAgIHZhciBvblVwbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5zeW5jID0gc3luYztcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLm9uVXBsb2FkID0gb25VcGxvYWQ7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5wYXRoID0gcmVzLm5hdGl2ZVVSTDtcbiAgICAgICAgICAgICRzY29wZS5hY2MuaW1nLnJ1dGFTcnYgPSBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocmVzLm5hdGl2ZVVSTCk7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9uVXBsb2FkKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQoJHNjb3BlLmFjYy5pbWcpO1xuICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxmbkVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0ZvdG9DdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ2ZvdG9zU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJyRmaWx0ZXInLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgJ3RpdGxlU2VydmljZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnZ3BzU2VydmljZScsXG4gIGZ1bmN0aW9uIChzLCBmb3Rvc1NlcnZpY2UsICRpb25pY1BsYXRmb3JtLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgJGZpbHRlciwgJHN0YXRlUGFyYW1zLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgY29weUZpbGVTZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBlcnJvclNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHMudGl0dGxlID0gJyc7XG4gICAgICBzLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIHMuaW1nVW5zeW5jID0gW107XG4gICAgICBzLm1hc3NpdmVVcGxvYWQgPSBmYWxzZTtcbiAgICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5vZmYgPSBvZmZsaW5lU2VydmljZS5kYXRhO1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIEZVTkNJT05BIEJJRU4gUEFSQSBWRVIgRUwgQ0FNQklPIElOTUVESUFUQU1FTlRFXG4gICAgICAvLyBzLm9ubGluZVN0YXR1cyA9IG9ubGluZVN0YXR1c1NlcnZpY2U7XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgUkVRVUlFUkUgT1RSTyBESUdFU1QgUEFSQSBRVUUgRlVOQ0lPTkVcbiAgICAgIC8vIHMub3NzID0geyBvbmxpbmU6IG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUgfTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBGVU5DSU9OQSBCSUVOIFBBUkEgVkVSIEVMIENBTUJJTyBJTk1FRElBVEFNRU5URSAgRVMgTUVKT1IgUkFTVFJFQVIgU0lFTVBSRSBVTiBPQkpFVE9cbiAgICAgIHMub3NzID0gb25saW5lU3RhdHVzU2VydmljZS5kYXRhO1xuICAgICAgLy8gJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgIC8vIFRPRE86IG9uaG9sZCBjYW4gZWRpdCBwbGFjYSwgb24gc3dpcGUgbGVmdCBkZWxldGUgd2l0aCBjb25maXJtXG4gICAgICAvLyBUT0RPOiBhbHdheXMgdXNlIGlvbi1uYXYtdGl0bGUgLCBwYXJhIHBvZGVybGUgcG9uZXIgbG9zIHRpdHVsb3MgcXVlIHF1aWVyb1xuICAgICAgLy8gcy5vc3MgPSB7IG9ubGluZTogb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSB9O1xuICAgICAgcy5waG90b3MgPSBmb3Rvc1NlcnZpY2UucGhvdG9zO1xuICAgICAgcy5uYW1lcyA9IGZvdG9zU2VydmljZS5uYW1lcztcbiAgICAgIHMuZ2V0UGhvdG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UuZ2V0UGhvdG9zKHMuaWRpbnNwZWNjaW9uKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzLnBob3RvcyA9IGZvdG9zU2VydmljZS5waG90b3M7XG4gICAgICAgICAgcy5uYW1lcyA9IGZvdG9zU2VydmljZS5uYW1lcztcbiAgICAgICAgICBfZmlsdGVyVW5zeW5jKDApO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzLmdldFBob3RvcygpO1xuICAgICAgcy4kb24oJ215RXZlbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdteSBldmVudCBvY2N1cnJlZCcpO1xuICAgICAgICBzLmdldFBob3RvcygpO1xuICAgICAgfSk7XG4gICAgICB2YXIgX2ZpbHRlclVuc3luYyA9IGZ1bmN0aW9uIChlcXVhbCkge1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKShzLnBob3RvcywgeyBzeW5jOiBlcXVhbCB9LCB0cnVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocy5waG90b3MsIGZvdW5kKTtcbiAgICAgICAgcy5pbWdVbnN5bmMgPSBmb3VuZDtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8ocy5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgICAgaWYgKHMubWFzc2l2ZVVwbG9hZCkge1xuICAgICAgICAgICAgcy5tYXNzaXZlTGVuZ3RoID0gcy5tYXNzaXZlTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChzLm1hc3NpdmVMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHMubWFzc2l2ZUxlbmd0aCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgX2ZpbHRlclVuc3luYygwKTtcbiAgICAgICAgICBzLm1hc3NpdmVVcGxvYWQgPSBmYWxzZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzLm1hc3NpdmVMZW5ndGgsICdzeW5jJyk7XG4gICAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlQWZ0ZXJVcGxvYWQgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpWaWRlby5zeW5jID0gc3luYztcbiAgICAgICAgb2JqVmlkZW8ub25VcGxvYWQgPSBvbnVwbG9hZDtcbiAgICAgICAgdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICAgICAgICAvL1RPRE8gOiBDVUFORE8gRVMgVU5BIFNPTEEgRVNUQSBCSUVOLCBDVUVOQU9EIEVTIFVOIEFSUkFZIERFQk8gREUgSEFDRVIgUVVFIFNZTkMgQ09OIExBIFVMVElNQSBGT1RPIFVOIC5MRU5USEcgUFVFREUgU0VSXG4gICAgICAgIC8vIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gZmFsc2U7XG4gICAgICB9O1xuICAgICAgdmFyIGluc2VydEZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS5pbnNlcnRGb3RvKHMuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciByZWZyZXNoUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgdmFyIG9iakZvdG8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqRm90by5wcm9ncmVzcyA9IHBlcmNlbnRhZ2U7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgLy8gVE9ETzogeWEgbm9lIHMgbmVjZXNhcmlvIHBvciBxdWUgb2ZmbGluZSB0YW1iaWVuIGVzdGEgZW4gb25saWxuZXN0YXR1c3NyZXJ2aWNlXG4gICAgICAgICAgLy8gfHwgIW9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2UuZmlsZVVwbG9hZChvYmopLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBydG5PYmplY3RGb3RvID0gZnVuY3Rpb24gKHBsYWNhLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgIHBsYWNhOiBwbGFjYSxcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHN5bmM6IHN5bmMsXG4gICAgICAgICAgb25VcGxvYWQ6IG9uVXBsb2FkLFxuICAgICAgICAgIC8vcy5vc3Mub25saW5lID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgcnV0YVNydjogbW9tZW50U2VydmljZS5ydXRhU3J2KHBhdGgpXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9O1xuICAgICAgdmFyIHNlYXJjaE9uZUluQXJyYXkgPSBmdW5jdGlvbiAoc3JjSW1nKSB7XG4gICAgICAgIC8vIFRPRE86IEhBQlJBIE9UUkEgRk9STUEgREUgRklMVEFSIE1BUyBSQVBJREEgSyBFTCBTVFJJTkcgUEFUSDtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy5waG90b3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIHZhciBvYmpGb3RvID0gc2VhcmNoT25lSW5BcnJheShmb3RvLnBhdGgpO1xuICAgICAgICBvYmpGb3RvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChvYmpGb3RvKTtcbiAgICAgIH07XG4gICAgICAvLyBzLnNldE9mZmxpbmVNb2RlID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAgIC8vICAgcy5vZmYub2ZmbGluZU1vZGUgPSBib29sO1xuICAgICAgLy8gICBpZiAoYm9vbCkge1xuICAgICAgLy8gICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCdPZmZsaW5lIE1vZGUnKTtcbiAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSh0aXRsZVNlcnZpY2UudGl0bGUpO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9O1xuICAgICAgcy5zeW5jSW1nVW5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzLm1hc3NpdmVVcGxvYWQgPSB0cnVlO1xuICAgICAgICBzLm1hc3NpdmVMZW5ndGggPSBzLmltZ1Vuc3luYy5sZW5ndGg7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzLmltZ1Vuc3luYywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgICAgcy50cnlVcGxvYWQob2JqKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5zZXRuYW1lID0gZnVuY3Rpb24gKGlkdGlwbywgZm90bykge1xuICAgICAgICAvL2JldGFkb3BhcmFwcnVlYmFzY29uc29sZS5sb2cobm9tYnJlLCBmb3RvKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaWR0aXBvLCBmb3RvKTtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnNldE5hbWUoaWR0aXBvLCBmb3RvKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSB0cnVlO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGFrZWRwaWMoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICAgIC8vIFRPRE86IHBhcmEgbGFzIHRhYmxldHMgYXBhZ28gZWwgZ3BzLCB5IGFsZ28gcGFzYSBjb24gbGEgY2FtYXJhXG4gICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGltYWdlVVJJKTtcbiAgICAgICAgICAvLyBmb3Rvc1NlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAgICAgICB2YXIgb251cGxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gVE9ETzogZXMgbWVqb3IgaMK/Z3VhcmRhciBhcXVpIGVsIHNxbGl0ZSB5IGx1ZWdvIGFjdHVhbGl6YXJsbyBzaSBzdWJlIGV4aXRvc287XG4gICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqZWN0Rm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgICAgIHMucGhvdG9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgIGluc2VydEZvdG8ocmVzLm5hdGl2ZVVSTCwgc3luYywgb251cGxvYWQpO1xuICAgICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogZXMgbWVqb3IgbGxhbWFyIGEgdW5hIGZ1bmNpb24sIHBvciBxdWUgYXNpIHNlIGVqZWN1dGEgcGFyYSBjYWRhIHVubywgeSBzZSBlamVjdXRhIGJpZW4sIGVuIHZleiBkZSBsbGFtYXIgZmlsdXBsb2FkIGRlc2RlIGFjYVxuICAgICAgICAgICAgLy9wcmVGaWxlVXBsb2FkKHJlcy5uYXRpdmVVUkwpOyAgLy8gJHNjb3BlLnBob3Rvcy5wdXNoKHJlcy5uYXRpdmVVUkwpO1xuICAgICAgICAgICAgcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmNvbnRyb2xsZXIoJ0luc3BlY2Npb25DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgdGl0bGVTZXJ2aWNlLCBpbnNwZWNjaW9uU2VydmljZSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsICRzdGF0ZVBhcmFtcywgJGlvbmljTW9kYWwsICRpb25pY05hdkJhckRlbGVnYXRlLCAkaW9uaWNMb2FkaW5nLCAkdGltZW91dCwgJGZpbHRlciwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgc3FsaXRlU2VydmljZSwgJGlvbmljUGxhdGZvcm0sIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XG4gICAgJHNjb3BlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQgPSBwYXJzZUludCgkc3RhdGVQYXJhbXMuY2FsaWZpY2FkbykgPT09IDEgPyB0cnVlIDogZmFsc2U7XG4gICAgJHNjb3BlLmFscmVhZHlTYXZlZCA9IGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZDtcbiAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAvL3BhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgJHNjb3BlLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICBpbnNwZWNjaW9uU2VydmljZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICRzY29wZS5kYXRhID0gaW5zcGVjY2lvblNlcnZpY2UuZGF0YTtcbiAgICAvLyBwYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL29wY2lvbk1vZGFsLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAgICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAgIH0pO1xuICAgIC8vIFRPRE86IGNvbW8gZXN0byBzZSBzaW5jcm9uaXphIHVuYSBzb2xhIHZleiwgbm8gaGF5IHByb2JsZW1hIGNvbiBlbCBpZGluc3BlY2Npb24sIGVsIHByb2JsZW1hIGVzdGEgZW4gYWNjZXNvcmlvcyB5IGVuIGZvdG9zLCBxdWUgc2Ugc3ViZSB1bm8gYSB1bm8sIGVudG9uY2VzIHBvZHJpYSBjYW1iaWFyLCBvIGVuIGFjY2Vzb3Jpb3MgaGFjZXIgdW4gYmVmb3JsZWF2ZSBkZSB2aWV3LCBtaSBwcmVndW50YSBlcyAsIHNpIG5vIGFiYW5kb25hIGxhIHZpZXcsIGNvbW8gc2luY3Jvbml6bz8gb3RyYSBtYXMgc2kgcGFzbyBhIGJhY2tncm91bmQgcHVlZG8gc2luY3Jvbml6YXI/Pz9cbiAgICAvLyBUT0RPOiBlc3RhIHZhcmlhYmxlIG1lIGxhIGRhIGxhIHBiYXNlIGRlIHNhdG9zLCBzaSB5YSBlc3RhIGNhbGlmaWNhZG8gbyBub1xuICAgICRzY29wZS5vYmogPSB7IGN1c3RvbXNlY3Rpb246IDAgfTtcbiAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7IHRlbXBsYXRlOiAnPGlvbi1zcGlubmVyIGljb249XCJhbmRyb2lkXCI+PC9pb24tc3Bpbm5lcj4nIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICB9O1xuICAgIC8vICRzY29wZS5zaG93KCk7XG4gICAgLy8gJHRpbWVvdXQoJHNjb3BlLmhpZGUsIDE1MDAwKTtcbiAgICAkc2NvcGUuaXRlbXMgPSBbXTtcbiAgICAvLyBpbml0aWFsIGltYWdlIGluZGV4XG4gICAgJHNjb3BlLl9JbmRleCA9IDA7XG4gICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24gPSBmdW5jdGlvbiAoaSkge1xuICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnNlY3Rpb25zLCBpKTtcbiAgICAgICRzY29wZS5vYmouY3VzdG9tc2VjdGlvbiA9ICRzY29wZS5zZWN0aW9uc1tpXS5jdXN0b21zZWN0aW9uO1xuICAgICAgLy8gJHNjb3BlLnNldE1pbigpO1xuICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgfTtcbiAgICAvL3JlZmVuY2Ugc2VydmljZVxuICAgIC8vIGlmIGEgY3VycmVudCBpbWFnZSBpcyB0aGUgc2FtZSBhcyByZXF1ZXN0ZWQgaW1hZ2VcbiAgICAkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuX0luZGV4ID09PSBpbmRleDtcbiAgICB9O1xuICAgIC8vIHNob3cgcHJldiBpbWFnZVxuICAgICRzY29wZS5zaG93UHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5fSW5kZXggPSAkc2NvcGUuX0luZGV4ID4gMCA/IC0tJHNjb3BlLl9JbmRleCA6ICRzY29wZS5zZWN0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAvLyBzaG93IG5leHQgaW1hZ2VcbiAgICAkc2NvcGUuc2hvd05leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuX0luZGV4ID0gJHNjb3BlLl9JbmRleCA8ICRzY29wZS5zZWN0aW9ucy5sZW5ndGggLSAxID8gKyskc2NvcGUuX0luZGV4IDogMDtcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgLyogU2hvdyBsaXN0ICovXG4gICAgJHNjb3BlLnNob3dJdGVtcyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAvLyBUT0RPOiBwYXJhIGRlc2hhYmlsaXRhciBlbCB1cGRhdGUsIGF1bnF1ZSB5YSBlc3RhIG1vbnRhZG8sIG1lIHByZW9jdXBhIGVzIGVsIHp5bmMgY2FkYSBxdWUgc2UgaGFnYSB1biB1cGRhdGVcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGl0ZW0uZGlydHkgPSB0cnVlO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuaXRlbSA9IGl0ZW07XG4gICAgICAkc2NvcGUuaXRlbSA9IGluc3BlY2Npb25TZXJ2aWNlLml0ZW07XG4gICAgICAkc2NvcGUubW9kYWwuc2hvdygpO1xuICAgIH07XG4gICAgLyogSGlkZSBsaXN0ICovXG4gICAgJHNjb3BlLmhpZGVJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgfTtcbiAgICAkc2NvcGUudmFsaWRhdGVTaW5nbGUgPSBmdW5jdGlvbiAob3BjaW9uKSB7XG4gICAgICAvLyBTZXQgc2VsZWN0ZWQgdGV4dFxuICAgICAgJHNjb3BlLml0ZW0uc2wubGFiZWwgPSBvcGNpb24ubGFiZWw7XG4gICAgICAvLyBTZXQgc2VsZWN0ZWQgdmFsdWVcbiAgICAgICRzY29wZS5pdGVtLnNsLnZhbHVlID0gb3BjaW9uLnZhbHVlO1xuICAgICAgaWYgKCRzY29wZS5hbHJlYWR5U2F2ZWQpIHtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2UudXBkYXRlU2luZ2xlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ29rIHVwZGF0ZScpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIEhpZGUgaXRlbXNcbiAgICAgICRzY29wZS5oaWRlSXRlbXMoKTsgIC8vIEV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICB9O1xuICAgICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd0xvbmdCb3R0b20oJ0d1YXJkYW5kbyBpbmZvcm1hY2lvbicpO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2Uuc2F2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWxyZWFkeVNhdmVkID0gaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbC5yZW1vdmUoKTtcbiAgICB9KTtcbiAgICAkc2NvcGUuY2xvc2VNb2RhbE9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZS5oaWRlKCk7XG4gICAgICAvLyBpbnNwZWNjaW9uU2VydmljZS5jbGVhclRpcG8oKTtcbiAgICAgICRzY29wZS5jbC5pZGNsYXNlID0gbnVsbDtcbiAgICAgICRzY29wZS5jbC5pZGNhcnJvY2VyaWEgPSBudWxsO1xuICAgICAgJHNjb3BlLmNsLnRpcG8gPSBudWxsO1xuICAgIH07XG4gICAgJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCd0ZW1wbGF0ZXMvbW9kYWxHZXRJdGVtcy5odG1sJywge1xuICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUgPSBtb2RhbDtcbiAgICB9KTtcbiAgICAkc2NvcGUub3Blbk1vZGFsT25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lLnNob3coKTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRDbGFzZXMgPSBmdW5jdGlvbiAoaWR0aXBvKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRDbGFzZXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNsYXNlcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNsYXNlcztcbiAgICAgICAgJHNjb3BlLmNhcnJvY2VyaWFzID0gaW5zcGVjY2lvblNlcnZpY2UuY2Fycm9jZXJpYXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5nZXRDYXJyb2NlcmlhcyA9IGZ1bmN0aW9uIChpZGNsYXNlKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRDYXJyb2NlcmlhcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuY2Fycm9jZXJpYXMgPSBpbnNwZWNjaW9uU2VydmljZS5jYXJyb2NlcmlhcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLnNldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLml0ZW1zID0gaW5zcGVjY2lvblNlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLnNlY3Rpb25zID0gaW5zcGVjY2lvblNlcnZpY2Uuc2VjdGlvbnM7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgICRzY29wZS5zZXRJZENsYUNhID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2Uuc2V0SWRDbGFDYSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0SWRDbGFDYSBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgICAkc2NvcGUuY2xvc2VNb2RhbE9uZSgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0QWxyZWFkeUluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZS5nZXRBbHJlYWR5SW5zcGVjdCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0QWxyZWFkeUluc3BlY3QgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUudGlwb3MgPSBpbnNwZWNjaW9uU2VydmljZS50aXBvcztcbiAgICAgICRzY29wZS5jbCA9IGluc3BlY2Npb25TZXJ2aWNlLmNsO1xuICAgICAgLy8gVE9ETzogYXF1aSB2YWxpZG8gc2kgeWEgc2UgY2FsaWZpY28gbyBzaSBhcGVuYXMgc2UgdmEgYSByZWFsaXphclxuICAgICAgaWYgKCRzY29wZS5hbHJlYWR5U2F2ZWQpIHtcbiAgICAgICAgJHNjb3BlLmdldEFscmVhZHlJbnNwZWN0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgfVxuICAgIH07XG4gICAgLy8gb24gaW5pdFxuICAgICRzY29wZS5pbml0KCk7XG4gIH0pO1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsIG9mZmxpbmVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIHRvYXN0U2VydmljZSwgdW5zeW5jU2VydmljZSwgJHN0YXRlLCBhdXRoU2VydmljZSkge1xuICAkc2NvcGUub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLmludGVybWVkaWF0ZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YTtcbiAgJHNjb3BlLnNldE9mZmxpbmVNb2RlID0gZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAkc2NvcGUub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAvLyBpZiAoYm9vbCkge1xuICAgIC8vICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJ09mZmxpbmUgTW9kZScpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSh0aXRsZVNlcnZpY2UudGl0bGUpO1xuICAgIC8vIH1cbiAgICBpZiAoIWJvb2wgJiYgb25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICB0b2FzdFNlcnZpY2Uuc2hvd0xvbmdCb3R0b20oJ3NpbmNyb25pemFuZG8nKTtcbiAgICAgIHVuc3luY1NlcnZpY2Uuc3luY0ltYWdlcygpICAvLyAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgenVtZXJvU2VydmljZS56eW5jKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pOyAgLy8genVtZXJvU2VydmljZS56eW5jKDApO1xuO1xuICAgIH1cbiAgfTtcbiAgJHNjb3BlLmxvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICB9O1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ1BsYWNhc0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnenVtZXJvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdwbGFjYXNTZXJ2aWNlJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJyRsb2NhdGlvbicsXG4gICckaW9uaWNQb3B1cCcsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmb2N1cycsXG4gICckc3RhdGUnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJyRpb25pY01vZGFsJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdmaXJzdEluaXRTZXJ2aWNlJyxcbiAgJyRsb2NhbFN0b3JhZ2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gICckZmlsdGVyJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCB0aXRsZVNlcnZpY2UsICRpb25pY01vZGFsLCB0b2FzdFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsICRpb25pY0xvYWRpbmcsICRmaWx0ZXIsIGludGVybWVkaWF0ZVNlcnZpY2UsJHRpbWVvdXQpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAvLyBwbGFjYXNTZXJ2aWNlLnNlbGVjdEFsbCgpO1xuICAgICAgLy8gcHMgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgLy8gcGMgPSAkc2NvcGU7XG4gICAgICAvLyAkc2NvcGUucGxhY2FzU2VydmljZSA9IHBsYWNhc1NlcnZpY2U7XG4gICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAkc2NvcGUub2JqID0geyBmaWx0ZXI6ICcnIH07XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgICRzY29wZS5wbGFjYXNTZXJ2aWNlLnNlbGVjdEFsbCgpO1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhwbGFjYXNTZXJ2aWNlLmFsbCk7XG4gICAgICAvLyB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgLy8gfSk7XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7XG4gICAgICB0aXRsZVNlcnZpY2UudGl0bGUgPSAnUGxhY2FzJztcbiAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBsYWNhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnY2FyZ2FuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgICAgcGxhY2FzU2VydmljZS5nZXRQbGFjYXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5wbGFjYXMgPSBwbGFjYXNTZXJ2aWNlLmFsbDtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuZkluaXQ9ZnVuY3Rpb24oKXtcbiAgICAgICAgICBmaXJzdEluaXRTZXJ2aWNlLmluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5oaWRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgICAvLyBUT0RPOiBzZXJpYSBidWVubyBxdWUgbGEgY29uc3VsdGEgZGUgcGxhY2FzIHN1cGllcmEgdG9kbywgY29tbyBwb3IgZWplbXBsbyBzaSB5YSBzZSBjYWxpZmljbywgc2kgeWEgdGllbmUgYWxndW5hIGZvdG8gbyB1biB2aWRlbywgcHVlZGUgc2VyIG1hcmNhbmRvbG8gY29uIGFsZ3VuYSBjbGFzZVxuICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLmRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnNob3coKTtcbiAgICAgICAgLy8gVE9ETzogcHVlZG8gcG9kZXIgb2JqPW51bGwsIHBhcmEgcXVlIG1lIGVsaW1pbmUgbGEgYmFzZSBkZSBkYXRvcyBzaSB5YSBlc3RhIGNyZWFkYSB5IHZ1ZWx2YSBhIHNpbmNyb25pemFyLCBlc3RvIHNlcmlhIGJlbmVmaWNpb3NvIHNpIHRlbmdvIHF1ZSBoYWNlciB1biBjYW1iaW8gZW4gbGEgYmFzZSBkZSBkZGF0b3MgcXVlIHJlcXVpZXJhIHJlY29uc3RydWlybGFcbiAgICAgICAkdGltZW91dCgkc2NvcGUuZkluaXQsMzAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5wbGFjYVBvcHVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBUT0RPOiBvcmdhbml6YXIgZWwgZm9jdXMgZW4gZWwgaW5wdXQgZGVsIHBvcHVwXG4gICAgICAgIHZhciBteXByb21wdCA9ICRpb25pY1BvcHVwLnByb21wdCh7XG4gICAgICAgICAgdGl0bGU6ICdOdWV2YSBQbGFjYScsXG4gICAgICAgICAgdGVtcGxhdGU6ICdJbmdyZXNlIGxhIG51ZXZhIHBsYWNhJyxcbiAgICAgICAgICBpbnB1dFR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICBpbnB1dFBsYWNlaG9sZGVyOiAnUGxhY2EnXG4gICAgICAgIH0pO1xuICAgICAgICBteXByb21wdC50aGVuKGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgICAgICRzY29wZS5hZGRQbGFjYShwbGFjYSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hZGRQbGFjYSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChwbGFjYSkpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCd2ZXJpZmlxdWUgbGEgcGxhY2EgZSBpbmdyZXNlIG51ZXZhbWVudGUnKTtcbiAgICAgICAgICAvLyBhbGVydChcInZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYWNhLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdsb25naXR1ZCBkZSBwbGFjYSBtdXkgY29ydGEnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGxhY2EgPSBwbGFjYS5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKCRzY29wZS5wbGFjYXMsIHsgcGxhY2E6IHBsYWNhIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgncGxhY2EgeWEgcmVnaXN0cmFkYScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd0xvbmdCb3R0b20oJ0luZ3Jlc2FuZG8gbnVldmEgcGxhY2EnKTtcbiAgICAgICAgcGxhY2FzU2VydmljZS5pbnNlcnRQTGFjYShwbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgJHNjb3BlLnNldEZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuaGFzRm9jdXMgPSB0cnVlO1xuICAgICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnJyk7XG4gICAgICAgIGZvY3VzLmZvY3VzKCdzZWFyY2hQcmltYXJ5Jyk7ICAvL25vIGVzIG5lY2VzYXJpbyBhYnJpciBlbCBrZXlib2FyZCBzZSBhYnJlIHNvbG8gY3VhbmRvIGFzaWduYW1vcyBlbCBmb2N1cyAvLyBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuc2hvdygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5ub0ZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuaGFzRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUoJycpO1xuICAgICAgICAkc2NvcGUub2JqLmZpbHRlciA9ICcnO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5zZXRJbnREYXRhID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAvLyBUT0RPOiBzaSBsYXMgcGxhY2FzIHNvbiBpZ3VhbGVzLCBwdWVkZSBzZXIgcXVlIHNlIGhheWEgc2luY3Jvbml6YWRvIHkgbm8gc2UgaGF5YSBhY3lhdWxpemFkbyBsYSBsaXN0YSBkZSBwbGFjYXMsIGVudG9uY2VzIHNlIHBhc2FyaWEgdW4gaWRpbnNwZWNjaW9uIHF1ZSBubyAsZXMgZXN0byBjdWFuZG8gb2ZmbGluZSBjcmVvIHVuYSBwbGFjYSwgbWUgcG9uZ28gb25saW5lIHkgbHVlZ28gb24gcGF1c2UgaGFnbyBlbCBzeW5jLCBhdW5xdWUgaGF5cSB1ZSBwZW5zYXIgcXVlIGN1YW5kbyBsZSBwb25nbyBvbmxpbmUsIGRlYmVyaWEgc2luY3Jvbml6YXIgc2kgaGF5IHNlw7FhbCA0ZyBvIHdpZmkgcGFyYSBpbWFnZW5lcyBvIHBhcmEgdG9kb1xuICAgICAgICBpZiAob2JqLnBsYWNhICE9PSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpIHtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EgPSBvYmoucGxhY2E7XG4gICAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgPSBvYmouc3luYyA9PT0gMSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gb2JqLmlkaW5zcGVjY2lvbjtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgICRzY29wZS5nb0ZvdG9zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5mb3RvJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTsgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL2ZvdG9zLycgKyBvYmouaWRpbnNwZWNjaW9uKTsgIC8vIFRPRE86IGNhbWJpYXIgcG9yIHN0YXRlLmdvIG1hcyBwYXJhbWV0cm9zLCB2ZXIgYmVzdCBwcmFjdGljZXNcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29WaWRlbyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvdmlkZW8vJyArIG9iai5pZGluc3BlY2Npb24pO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC52aWRlbycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvSW5zcGVjY2lvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgLy8gVE9ETzogYXF1aSBwb2RyaWEgZXZhbHVhciBzaSB5YSBzZSBjYWxpZmljbyBvIG5vLCBzaSBubyBzZSBoYSBjYWxpZmljYWRvIHBvZHJpYSBkZXNwbGVnYXIgZWwgbW9kYWwgZGUgY2xhc2UgY2Fycm9jZXJpYVxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5pbnNwZWNjaW9uJywge1xuICAgICAgICAgIGlkOiBvYmouaWRpbnNwZWNjaW9uLFxuICAgICAgICAgIHBsYWNhOiBvYmoucGxhY2EsXG4gICAgICAgICAgY2FsaWZpY2Fkbzogb2JqLmNhbGlmaWNhZG9cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvQWNjZXNvcmlvcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgJHNjb3BlLnNldEludERhdGEob2JqKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuYWNjZXNvcmlvcycsIHsgaWQ6IG9iai5pZGluc3BlY2Npb24gfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNyZWF0ZUV4Y2VwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb21ldGhpbmcgaGFzIGdvbmUgdGVycmlibHkgd3JvbmchJyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignVGVzdEN0cmwnLCBbXG4gICckc2NvcGUnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnc3FsU2VydmljZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY1BsYXRmb3JtLCBzcWxTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdmFyIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgICAkc2NvcGUub3BlbmRiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB4ID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2UoeyBuYW1lOiAnenVtZXJvdGVzdGRiZmlsZScgfSwgZnVuY3Rpb24gKHJlc3VsdE9iaiwgZnVsbFBhdGhQYXJhbSwgZGJPYmplY3QpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYk9iamVjdCwgJ2Rib2JqZWN0Jyk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0T2JqLCAnZnVscGF0aDonLCBmdWxsUGF0aFBhcmFtKTsgIC8vSW1wb3J0YW50ISAgSWYgeW91IGRvbid0IGNsb3NlIHRoZSBkYXRhYmFzZSBvYmplY3QsIGZ1dHVyZSBjYWxscyB0byBvcGVuRGF0YWJhc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd29uJ3QgY2FsbCB0aGUgc3VjY2VzcyBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGJPYmplY3QuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlZGIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjZXJyYW5kbycsIHgpO1xuICAgICAgICAvLyBpZiAoIXgpIHtcbiAgICAgICAgeC5jbG9zZSgpO1xuICAgICAgICAvLyB6dW1lcm8gc3FsaXRlIGZ1bmNpb25hIGFzaSAuY2xvc2UgPSBmdW5jdGlvbihzdWNjZXNzLCBlcnJvcikgeyBwZXJvIG5vIHNlIHVzYW4gYWwgbGxhbWFyIGNvcm9kdmEuZXhlXG4gICAgICAgIGNvbnNvbGUubG9nKHgub3BlbkRCUyk7ICAvLyB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmdWxsUGF0aFBhcmFtID0gJy9kYXRhL2RhdGEvY29tLmlvbmljZnJhbWV3b3JrLmZvdG9zdmlldzM5MDc0Ny9kYXRhYmFzZXMvenVtZXJvdGVzdGRiLmRiJztcbiAgICAgICAgdmFyIHNlcnZlciA9ICdodHRwOi8vMTkyLjE2OC4xLjEzOjgwODAvJztcbiAgICAgICAgdmFyIGRiZmlsZSA9ICd6dW1lcm90ZXN0ZGJmaWxlJztcbiAgICAgICAgdmFyIG5vdGlmeVN1Y2Nlc3MgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHMpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbm90aWZ5RXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9O1xuICAgICAgICB6dW1lcm8uc3luYyhmdWxsUGF0aFBhcmFtLCAnJywgc2VydmVyLCBkYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIG5vdGlmeVN1Y2Nlc3MsIG5vdGlmeUVycm9yKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUubyA9IHtcbiAgICAgICAgczogdHJ1ZSxcbiAgICAgICAgZTogdHJ1ZSxcbiAgICAgICAgdTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHNxbFNlcnZpY2Uuc3luYygpO1xuICAgIH0pO1xuICB9XG5dKTsiLCJhcHAuY29udHJvbGxlcignVmlkZW9DdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3ZpZGVvU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckaW9uaWNTY3JvbGxEZWxlZ2F0ZScsXG4gICdmaWxlVHJhbnNmZXJTZXJ2aWNlJyxcbiAgJyRmaWx0ZXInLFxuICAnJHN0YXRlUGFyYW1zJyxcbiAgJyRpb25pY05hdkJhckRlbGVnYXRlJyxcbiAgJ2NvcHlGaWxlU2VydmljZScsXG4gICd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLFxuICAnZ2V0VmlkZW9TZXJ2aWNlJyxcbiAgJ2NoZWNrRmlsZVNlcnZpY2UnLFxuICAndGl0bGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdncHNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHMsIHZpZGVvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRpb25pY1Njcm9sbERlbGVnYXRlLCBmaWxlVHJhbnNmZXJTZXJ2aWNlLCAkZmlsdGVyLCAkc3RhdGVQYXJhbXMsICRpb25pY05hdkJhckRlbGVnYXRlLCBjb3B5RmlsZVNlcnZpY2UsIHZpZGVvVGh1bWJuYWlsU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjaGVja0ZpbGVTZXJ2aWNlLCB0aXRsZVNlcnZpY2UsIG9mZmxpbmVTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIGVycm9yU2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSwgZ3BzU2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIC8vIHMudGl0dGxlID0gJyc7XG4gICAgICBzLnRpdHRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5vc3MgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGE7XG4gICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICAvL3ZpZGVvU2VydmljZS5hbGwoKTtcbiAgICAgIHZpZGVvU2VydmljZS5nZXRWaWRlb3Mocy5pZGluc3BlY2Npb24pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBzLnZpZGVvcyA9IHZpZGVvU2VydmljZS52aWRlb3M7XG4gICAgICB9KTtcbiAgICAgIC8vIHZhciBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yJywgZSk7XG4gICAgICAvLyB9O1xuICAgICAgdmFyIGluc2VydFZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS5pbnNlcnRWaWRlbyhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgaW5zZXJ0IHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZVZpZGVvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCB0aHVtYm5haWwsIG9udXBsb2FkKSB7XG4gICAgICAgIHZpZGVvU2VydmljZS51cGRhdGVWaWRlbyhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHVwZGF0ZSBzcWxpdGUgdmlkZW8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnN5bmMgPSBzeW5jO1xuICAgICAgICBvYmpWaWRlby5vblVwbG9hZCA9IG9udXBsb2FkO1xuICAgICAgICAvLyBpbnNlcnRWaWRlbyhpbWFnZVVSSSwgc3luYywgb2JqVmlkZW8udGh1bWJuYWlsKTtcbiAgICAgICAgdXBkYXRlVmlkZW8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDMpO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoaW1hZ2VVUkkpO1xuICAgICAgICBvYmpWaWRlby5wcm9ncmVzcyA9IHBlcmNlbnRhZ2U7XG4gICAgICB9O1xuICAgICAgdmFyIHByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSA0KSB7XG4gICAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdhY3RpdmFkbyBtb2RvIG9mZmxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0YW50IHByb2dyZXNzIHVwZGF0ZXNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHByb2dyZXNzKTtcbiAgICAgICAgICAgIC8vIHJlZnJlc2hQcm9ncmVzcyhpbWFnZVVSSSwgTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coTWF0aC5yb3VuZChwcm9ncmVzcy5sb2FkZWQgLyBwcm9ncmVzcy50b3RhbCAqIDEwMCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHJ0bk9ialZpZGVvID0gZnVuY3Rpb24gKHBsYWNhLCBwYXRoLCBzeW5jLCBvblVwbG9hZCwgdGh1bWJuYWlsKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgc3luYzogc3luYyxcbiAgICAgICAgICBvblVwbG9hZDogb25VcGxvYWQsXG4gICAgICAgICAgLy9zLm9zcy5vbmxpbmUgPT09IHRydWUgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB0aHVtYm5haWw6IHRodW1ibmFpbCxcbiAgICAgICAgICBydXRhU3J2OiBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH07XG4gICAgICB2YXIgc2VhcmNoT25lSW5BcnJheSA9IGZ1bmN0aW9uIChzcmNJbWcpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy52aWRlb3MsIHsgcGF0aDogc3JjSW1nIH0sIHRydWUpO1xuICAgICAgICBpZiAoZm91bmQubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdub3QgZm91bmQgaW4gYXJyYXkgc2VhcmNoJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgbG9hZFRodW1ibmFpbCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLmdlbmVyYXRlVGh1bWJuYWlsKG9iai5wYXRoKS50aGVuKGZ1bmN0aW9uICh0aHVtYm5haWxTcmMpIHtcbiAgICAgICAgICBzZWFyY2hPbmVJbkFycmF5KG9iai5wYXRoKS50aHVtYm5haWwgPSB0aHVtYm5haWxTcmM7XG4gICAgICAgICAgdmFyIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBUT0RPOiBvbnVwbG9hZCBkZXBlbmRlcmEgc2kgZXN0YSBvbmxpbmUgbyBubyBwYXJhIHNhYmVyIHNpIHNlIGludGVudGEgc3ViaXI7XG4gICAgICAgICAgdmFyIG9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICBpbnNlcnRWaWRlbyhvYmoucGF0aCwgc3luYywgdGh1bWJuYWlsU3JjLCBvblVwbG9hZCk7XG4gICAgICAgICAgJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdtYWluU2Nyb2xsJykuc2Nyb2xsQm90dG9tKHRydWUpO1xuICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGZvdG8ucGF0aCk7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcHJlRmlsZVVwbG9hZChvYmpWaWRlbyk7XG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICB2aWRlb1NlcnZpY2UudGFrZWRWaWQoKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgICBncHNTZXJ2aWNlLmdwc0h0bWwoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codmlkZW9EYXRhKTtcbiAgICAgICAgICBhbmd1bGFyLmZvckVhY2godmlkZW9EYXRhLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa2V5ICsgJzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZSh2YWx1ZS5mdWxsUGF0aCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICAgIHZhciBvYmogPSBydG5PYmpWaWRlbyhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsIHJlcy5uYXRpdmVVUkwsIGZhbHNlLCB0cnVlLCAnJyk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcywgJ2NvcHlvaycpO1xuICAgICAgICAgICAgICBzLnZpZGVvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgIGxvYWRUaHVtYm5haWwob2JqKTsgIC8vIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICAgIHMuZ2V0VmlkRmlsZUNvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQgPSB0cnVlO1xuICAgICAgICBnZXRWaWRlb1NlcnZpY2UuZ2V0VmlkZW9Db21wcmVzcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICB2YXIgcmVzVmlkZW9Db21wcmVzcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgIC8vIFRPRE86IDEyNTgyOTEyIHNvbiAxMk1CIDtcbiAgICAgICAgICBpZiAoY2hlY2tGaWxlU2VydmljZS5maWxlLnNpemUgPCAxMjU4MjkxMikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZ2V0VmlkZW9TZXJ2aWNlLmZpbGVFbnRyeSk7XG4gICAgICAgICAgICBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUocmVzVmlkZW9Db21wcmVzcy5uYXRpdmVVUkwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjb3B5RmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjb3B5RmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnZWwgYXJjaGl2byBzdXBlcmEgZWwgdGFtYVxceEYxYSBtYXhpbW8gcGVybWl0aWRvLiBtYXhpbW8gMTJNQicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbXG4gICckc2NvcGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJ2F1dGhTZXJ2aWNlJyxcbiAgJ25nQXV0aFNldHRpbmdzJyxcbiAgJyRpb25pY1NpZGVNZW51RGVsZWdhdGUnLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICckc3RhdGUnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCAkbG9jYXRpb24sIGF1dGhTZXJ2aWNlLCBuZ0F1dGhTZXR0aW5ncywgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgbG9jYWxTdG9yYWdlU2VydmljZSwgJGlvbmljUGxhdGZvcm0sICRzdGF0ZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5zcmMgPSAnaW1nL2ljb24ucG5nJztcbiAgICAgIC8vIFRPRE86IHZlcmlmaWNhciBzaSBlc3RvIHNlIHB1ZWRlIGhhY2VyIGVuIGVsIHJ1biwgcGVybyBjb24gc3RhdGUuZ28gYXBwLnBsYWNhc1xuICAgICAgdmFyIF9hbHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgdmFyIG4gPSBtb21lbnQoKTtcbiAgICAgICAgICB2YXIgZSA9IG1vbWVudChhdXRoRGF0YS5leHApO1xuICAgICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICBpZiAobi5kaWZmKGUsICdzZWNvbmRzJykgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgcGxhY2FzJyk7XG4gICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wbGFjYXMnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBfYWxyZWFkeSgpO1xuICAgICAgJHNjb3BlLmxvZ2dlZE5vdyA9IGZhbHNlO1xuICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS5jYW5EcmFnQ29udGVudChmYWxzZSk7XG4gICAgICAkc2NvcGUubG9naW5EYXRhID0ge1xuICAgICAgICB1c2VyTmFtZTogJycsXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2VcbiAgICAgIH07XG4gICAgICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHJ1ZSkge1xuICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luKCRzY29wZS5sb2dpbkRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUub25Mb2dnZWQoKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IGVyci5lcnJvcl9kZXNjcmlwdGlvbjtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9ICd2ZXJpZmlxdWUgcXVlIGRpc3BvbmdhIGRlIGNvbmV4aW9uIGEgaW50ZXJuZXQsIGUgaW50ZW50ZSBkZSBudWV2byc7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUub25Mb2dnZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoJy9vcmRlcnMnKTtcbiAgICAgICAgLy8gJHNjb3BlLmxvZ2dlZCh0cnVlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSwkbG9jYXRpb24pO1xuICAgICAgICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC9wbGFjYXMnKTtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAucGxhY2FzJyk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmF1dGhFeHRlcm5hbFByb3ZpZGVyID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciByZWRpcmVjdFVyaSA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyAnL2F1dGhjb21wbGV0ZS5odG1sJztcbiAgICAgICAgdmFyIGV4dGVybmFsUHJvdmlkZXJVcmwgPSBuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaSArICdhcGkvQWNjb3VudC9FeHRlcm5hbExvZ2luP3Byb3ZpZGVyPScgKyBwcm92aWRlciArICcmcmVzcG9uc2VfdHlwZT10b2tlbiZjbGllbnRfaWQ9JyArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkICsgJyZyZWRpcmVjdF91cmk9JyArIHJlZGlyZWN0VXJpO1xuICAgICAgICB3aW5kb3cuJHdpbmRvd1Njb3BlID0gJHNjb3BlO1xuICAgICAgICB2YXIgb2F1dGhXaW5kb3cgPSB3aW5kb3cub3BlbihleHRlcm5hbFByb3ZpZGVyVXJsLCAnQXV0aGVudGljYXRlIEFjY291bnQnLCAnbG9jYXRpb249MCxzdGF0dXM9MCx3aWR0aD02MDAsaGVpZ2h0PTc1MCcpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hdXRoQ29tcGxldGVkQ0IgPSBmdW5jdGlvbiAoZnJhZ21lbnQpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGZyYWdtZW50Lmhhc2xvY2FsYWNjb3VudCA9PT0gJ0ZhbHNlJykge1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5leHRlcm5hbEF1dGhEYXRhID0ge1xuICAgICAgICAgICAgICBwcm92aWRlcjogZnJhZ21lbnQucHJvdmlkZXIsXG4gICAgICAgICAgICAgIHVzZXJOYW1lOiBmcmFnbWVudC5leHRlcm5hbF91c2VyX25hbWUsXG4gICAgICAgICAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46IGZyYWdtZW50LmV4dGVybmFsX2FjY2Vzc190b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXNzb2NpYXRlJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vT2J0YWluIGFjY2VzcyB0b2tlbiBhbmQgcmVkaXJlY3QgdG8gb3JkZXJzXG4gICAgICAgICAgICB2YXIgZXh0ZXJuYWxEYXRhID0ge1xuICAgICAgICAgICAgICBwcm92aWRlcjogZnJhZ21lbnQucHJvdmlkZXIsXG4gICAgICAgICAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46IGZyYWdtZW50LmV4dGVybmFsX2FjY2Vzc190b2tlblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLm9idGFpbkFjY2Vzc1Rva2VuKGV4dGVybmFsRGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9vcmRlcnMnKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSAgLy8gJHNjb3BlLmFscmVhZHlMb2dnZWQoKTsgICAgICAgICAgICAgICBcbjtcbiAgICB9KTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2FjY2Vzb3Jpb3NTZXJ2aWNlJywgW1xuICAnc3FsaXRlU2VydmljZScsXG4gICckcScsXG4gICckZmlsdGVyJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRxLCAkZmlsdGVyLCBlcnJvclNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgICB2YXIgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uID0gMDtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSA9IHt9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YSA9IHt9O1xuICAgIHZhciBfZ2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGFjY2Vzb3Jpb3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0IGl0ZW1zIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9ub21icmVzID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAndGV4dGEnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ3RleHRiJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfZXN0YWRvcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ2VzdGFkb2EnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ2VzdGFkb2InLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9jYW50aWRhZGVzID0gW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnMScsXG4gICAgICAgIGlkOiAxXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnMicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX3NldE5vbWJyZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBpZGNvbnRyb2xlbGVtZW50bywgaWRjb250cm9sLCBjb250cm9sSnNvbiBGUk9NICBjb250cm9sRWxlbWVudG9zIFdIRVJFICAgaWRjb250cm9sID0gMjEnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbik7XG4gICAgICAgIC8vIHZhciBqc29uID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmd1bGFyLmZyb21Kc29uKGpzb24pKTtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLm5vbWJyZXMgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7ICAvL2FuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRFc3RhZG9zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIwJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuZXN0YWRvcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXRDYW50aWRhZGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIyJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuY2FudGlkYWRlcyA9IGFuZ3VsYXIuZnJvbUpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmNvbnRyb2xKc29uKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbml0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRPRE86ICB1bmEgYmFuZGVyYSBwYXJhIHNhYmVyIHF1ZSB5YSBzZSBzZXRpbywgdW5hIHZleiwgeSBldml0YXIgbWFzIGNvbnN1bGF0cywgYSBtZW5vcyBxdWUgc2UgaGFnYSB1bmEgYWN0dWFsaXphY2lvbiBkZWwgc2Vydmlkb3JcbiAgICAgIHZhciBxYXJyYXkgPSBbXTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXROb21icmVzKCkpO1xuICAgICAgcWFycmF5LnB1c2goX3NldENhbnRpZGFkZXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfc2V0RXN0YWRvcygpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocWFycmF5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luaXRBY2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUT0RPOiBzZXJpYSBidWVubyBpbmljaWFyIGVzdG9zIGRkbCBzaW4gdmFsb3JlcywgIHBlcm8gdGVuZHJpYSBxdWUgdmFsaWRhciBxdWUgc2kgc2Ugc2VsZWNjaW9uZSBhbGdvO1xuICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0gPSB7XG4gICAgICAgIG5vbWJyZTogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLm5vbWJyZXNbMF0sXG4gICAgICAgIGVzdGFkbzogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmVzdGFkb3NbMF0sXG4gICAgICAgIGNhbnRpZGFkOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEuY2FudGlkYWRlc1swXSxcbiAgICAgICAgdmFsb3I6IDAsXG4gICAgICAgIG1hcmNhOiAnJyxcbiAgICAgICAgcmVmZXJlbmNpYTogJycsXG4gICAgICAgIGltZzoge1xuICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgIHN5bmM6IGZhbHNlLFxuICAgICAgICAgIG9uVXBsb2FkOiBmYWxzZSxcbiAgICAgICAgICBpZGluc3BlY2Npb246IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb25cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EsXG4gICAgICAgIG9iai5ub21icmUubGFiZWwsXG4gICAgICAgIG9iai5lc3RhZG8ubGFiZWwsXG4gICAgICAgIHBhcnNlSW50KG9iai5jYW50aWRhZC52YWx1ZSksXG4gICAgICAgIG9iai5tYXJjYSxcbiAgICAgICAgb2JqLnJlZmVyZW5jaWEsXG4gICAgICAgIG9iai52YWxvcixcbiAgICAgICAgb2JqLmltZy5wYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3NhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkYWNjZXNvcmlvc10gKFtpZGluc3BlY2Npb25dICxbcGxhY2FdICxbbm9tYnJlXSAsW2VzdGFkb10gLFtjYW50aWRhZF0gLFttYXJjYV0gLFtyZWZlcmVuY2lhXSxbdmFsb3JdLFtpbWdTcmNdKSBWQUxVRVMgICg/LD8sPyw/LD8sPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBfcnRuQmluZGluZyhhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gX2dldEl0ZW1zKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZ1VwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wudGV4dCxcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkaXRlbVxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVTaW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZHByb3BpZWRhZGVzXSBzZXQgW2lkb3BjaW9uXT0/ICwgW3NlbGVjY2lvbl09ID8gV0hFUkUgW2lkaW5zcGVjY2lvbl09PyBhbmQgW2lkaXRlbV09PyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBfcnRuQmluZGluZ1VwZGF0ZShhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaXRlbSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHNpbmdsZScsIHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmdldEl0ZW1zID0gX2dldEl0ZW1zO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS51cGRhdGVTaW5nbGUgPSBfdXBkYXRlU2luZ2xlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5zYXZlID0gX3NhdmU7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXRPcHRpb25zID0gX2luaXRPcHRpb25zO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0QWNjID0gX2luaXRBY2M7XG4gICAgcmV0dXJuIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvclNlcnZpY2UnLCBbXG4gICckcScsXG4gICckbG9jYXRpb24nLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICckaW5qZWN0b3InLFxuICAnbW9tZW50U2VydmljZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24sIGxvY2FsU3RvcmFnZVNlcnZpY2UsICRpbmplY3RvciwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSkge1xuICAgIHZhciBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfcmVxdWVzdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgYXV0aERhdGEudG9rZW47XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH07XG4gICAgdmFyIF9yZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHJlamVjdGlvbikge1xuICAgICAgLy8gdmFyIGF1dGhTZXJ2aWNlID0gJGluamVjdG9yLmdldCgnYXV0aFNlcnZpY2UnKTtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdJTlNFUlQgIElOVE8gW2xvZ3NdKFtleF0sW2VtYWlsXSxbZmVjaGFdKSAgVkFMVUVTKD8sPyw/KSc7XG4gICAgICAvLyB2YXIgYmluZGluZyA9IFtcbiAgICAgIC8vICAgYW5ndWxhci50b0pzb24ocmVqZWN0aW9uKSxcbiAgICAgIC8vICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUgfHwgJycsXG4gICAgICAvLyAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgLy8gXTtcbiAgICAgIC8vIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIC8vIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIC8vICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgLy8gfSk7XG4gICAgICBpZiAocmVqZWN0aW9uLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgIHZhciBhdXRoU2VydmljZSA9ICRpbmplY3Rvci5nZXQoJ2F1dGhTZXJ2aWNlJyk7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgICBpZiAoYXV0aERhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9yZWZyZXNoJyk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgfTtcbiAgICBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeS5yZXF1ZXN0ID0gX3JlcXVlc3Q7XG4gICAgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkucmVzcG9uc2VFcnJvciA9IF9yZXNwb25zZUVycm9yO1xuICAgIHJldHVybiBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgW1xuICAnJGh0dHAnLFxuICAnJHEnLFxuICAnbG9jYWxTdG9yYWdlU2VydmljZScsXG4gICduZ0F1dGhTZXR0aW5ncycsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRodHRwLCAkcSwgbG9jYWxTdG9yYWdlU2VydmljZSwgbmdBdXRoU2V0dGluZ3MsIG1vbWVudFNlcnZpY2UpIHtcbiAgICB2YXIgc2VydmljZUJhc2UgPSBuZ0F1dGhTZXR0aW5ncy5hcGlTZXJ2aWNlQmFzZVVyaTtcbiAgICB2YXIgYXV0aFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9hdXRoZW50aWNhdGlvbiA9IHtcbiAgICAgIGlzQXV0aDogZmFsc2UsXG4gICAgICB1c2VyTmFtZTogJycsXG4gICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZSxcbiAgICAgIGxhc3RMb2dpbmc6ICcnXG4gICAgfTtcbiAgICB2YXIgX2V4dGVybmFsQXV0aERhdGEgPSB7XG4gICAgICBwcm92aWRlcjogJycsXG4gICAgICB1c2VyTmFtZTogJycsXG4gICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiAnJ1xuICAgIH07XG4gICAgdmFyIF9zYXZlUmVnaXN0cmF0aW9uID0gZnVuY3Rpb24gKHJlZ2lzdHJhdGlvbikge1xuICAgICAgX2xvZ091dCgpO1xuICAgICAgcmV0dXJuICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAnYXBpL2FjY291bnQvcmVnaXN0ZXInLCByZWdpc3RyYXRpb24pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9sb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkRhdGEpIHtcbiAgICAgIHZhciBkYXRhID0gJ2dyYW50X3R5cGU9cGFzc3dvcmQmdXNlcm5hbWU9JyArIGxvZ2luRGF0YS51c2VyTmFtZSArICcmcGFzc3dvcmQ9JyArIGxvZ2luRGF0YS5wYXNzd29yZCArICcmY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZDtcbiAgICAgIC8vc2llbXByZSB2b3kgYSBtYW5kYXIgZWwgY2xpZW50aWRcbiAgICAgIC8qaWYgKGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XHJcbiAgICAgICAgICAgZGF0YSA9IGRhdGEgKyBcIiZjbGllbnRfaWQ9XCIgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZDtcclxuICAgICAgIH0qL1xuICAgICAgLy90ZW5nbyBxdWUgcmV2aXNhciBsb3MgY3Jvc3Mgb3JpZ2luLCBlbiBsYSBiYXNlIGRlIGRhdG9zICwgeSBoYWJpbGl0YXJsbyBlbiBlbCBuYXZlZ2Fkb3IgY2hyb21lICwgaW1wb3J0YW50ZVxuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBkID0gbW9tZW50KCk7XG4gICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ3Rva2VuJywgZGF0YSwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9IH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJykpXG4gICAgICAgIHJwID0gcmVzcG9uc2U7XG4gICAgICAgIGlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICB1c2VyTmFtZTogbG9naW5EYXRhLnVzZXJOYW1lLFxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZS5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgdXNlUmVmcmVzaFRva2VuczogdHJ1ZSxcbiAgICAgICAgICAgIGxhc3RMb2dpbjogZCAgLy8gLFxuICAgICAgICAgICAgICAgLy8gZXhwOm1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4sXG4gICAgICAgICAgICBleHA6IG1vbWVudFNlcnZpY2UuYWRkU2Vjb25kcyhyZXNwb25zZS5leHBpcmVzX2luKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICB1c2VyTmFtZTogbG9naW5EYXRhLnVzZXJOYW1lLFxuICAgICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlLFxuICAgICAgICAgICAgbGFzdExvZ2luOiBkICAvLyAsXG4gICAgICAgICAgICAgICAvLyBleHA6bW9tZW50KHJlc3BvbnNlLi5leHBpcmVzKS5mb3JtYXQoJ1lZWVktTU0tREQnKVxuLFxuICAgICAgICAgICAgZXhwOiBtb21lbnRTZXJ2aWNlLmFkZFNlY29uZHMocmVzcG9uc2UuZXhwaXJlc19pbilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmxhc3RMb2dpbmcgPSBtb21lbnQoKTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gbG9naW5EYXRhLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGxvZ2luRGF0YS51c2VSZWZyZXNoVG9rZW5zO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfbG9nT3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gZmFsc2U7XG4gICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSAnJztcbiAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgfTtcbiAgICB2YXIgX2ZpbGxBdXRoRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5pc0F1dGggPSB0cnVlO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlck5hbWUgPSBhdXRoRGF0YS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9yZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XG4gICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgaWYgKGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9ICdncmFudF90eXBlPXJlZnJlc2hfdG9rZW4mcmVmcmVzaF90b2tlbj0nICsgYXV0aERhdGEucmVmcmVzaFRva2VuICsgJyZjbGllbnRfaWQ9JyArIG5nQXV0aFNldHRpbmdzLmNsaWVudElkO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICAgICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAndG9rZW4nLCBkYXRhLCB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgICAgdXNlck5hbWU6IHJlc3BvbnNlLnVzZXJOYW1lLFxuICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlLnJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX29idGFpbkFjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKGV4dGVybmFsRGF0YSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldChzZXJ2aWNlQmFzZSArICdhcGkvYWNjb3VudC9PYnRhaW5Mb2NhbEFjY2Vzc1Rva2VuJywge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBwcm92aWRlcjogZXh0ZXJuYWxEYXRhLnByb3ZpZGVyLFxuICAgICAgICAgIGV4dGVybmFsQWNjZXNzVG9rZW46IGV4dGVybmFsRGF0YS5leHRlcm5hbEFjY2Vzc1Rva2VuXG4gICAgICAgIH1cbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gcmVzcG9uc2UudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9yZWdpc3RlckV4dGVybmFsID0gZnVuY3Rpb24gKHJlZ2lzdGVyRXh0ZXJuYWxEYXRhKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICdhcGkvYWNjb3VudC9yZWdpc3RlcmV4dGVybmFsJywgcmVnaXN0ZXJFeHRlcm5hbERhdGEpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCdhdXRob3JpemF0aW9uRGF0YScsIHtcbiAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICByZWZyZXNoVG9rZW46ICcnLFxuICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gcmVzcG9uc2UudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gZmFsc2U7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgICAgIF9sb2dPdXQoKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LnNhdmVSZWdpc3RyYXRpb24gPSBfc2F2ZVJlZ2lzdHJhdGlvbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkubG9naW4gPSBfbG9naW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmxvZ091dCA9IF9sb2dPdXQ7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmZpbGxBdXRoRGF0YSA9IF9maWxsQXV0aERhdGE7XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmF1dGhlbnRpY2F0aW9uID0gX2F1dGhlbnRpY2F0aW9uO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5yZWZyZXNoVG9rZW4gPSBfcmVmcmVzaFRva2VuO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5vYnRhaW5BY2Nlc3NUb2tlbiA9IF9vYnRhaW5BY2Nlc3NUb2tlbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkuZXh0ZXJuYWxBdXRoRGF0YSA9IF9leHRlcm5hbEF1dGhEYXRhO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5yZWdpc3RlckV4dGVybmFsID0gX3JlZ2lzdGVyRXh0ZXJuYWw7XG4gICAgcmV0dXJuIGF1dGhTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NoZWNrRmlsZVNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSkge1xuICAgIHZhciBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfZmlsZURldGFpbCA9IGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgICBGaWxlRW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlID0gZmlsZTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfY2hlY2tGaWxlID0gZnVuY3Rpb24gKG1lZGlhVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBtZWRpYVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICAvLyB2YXIgcGF0aD1jb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5OyAvLyBpbWFnZW5lcyBjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxDYWNoZURpcmVjdG9yeVxuICAgICAgdmFyIHBhdGggPSBtZWRpYVVSSS5zdWJzdHJpbmcoMCwgbWVkaWFVUkkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICAvLyB2YXIgbmV3RmlsZU5hbWUgPSAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY2hlY2tGaWxlKHBhdGgsIEZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgICAgcmV0dXJuIF9maWxlRGV0YWlsKEZpbGVFbnRyeSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmNoZWNrRmlsZSA9IF9jaGVja0ZpbGU7XG4gICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZURldGFpbCA9IF9maWxlRGV0YWlsO1xuICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NvcHlGaWxlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgY29weUZpbGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIC8vIHZhciBfZmlsZURldGFpbCA9IGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAvLyAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgLy8gICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAvLyAgIEZpbGVFbnRyeS5maWxlKGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgLy8gICAgIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZSA9IGZpbGU7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgLy8gfTtcbiAgICB2YXIgX2NvcHlGaWxlID0gZnVuY3Rpb24gKG1lZGlhVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBtZWRpYVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICAvLyB2YXIgcGF0aD1jb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5OyAvLyBpbWFnZW5lcyBjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxDYWNoZURpcmVjdG9yeVxuICAgICAgdmFyIHBhdGggPSBtZWRpYVVSSS5zdWJzdHJpbmcoMCwgbWVkaWFVUkkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xuICAgICAgY29uc29sZS5sb2cocGF0aCk7XG4gICAgICB2YXIgbmV3RmlsZU5hbWUgPSBGaWxlTmFtZTtcbiAgICAgIC8vICduZXdfJyArIEZpbGVOYW1lO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZS5jb3B5RmlsZShwYXRoLCBGaWxlTmFtZSwgY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG5ld0ZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAgICAgLy8gcmV0dXJuIGNvcHlGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5PUZpbGVFbnRyeTtcbiAgICAgICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2UuZmlsZURldGFpbChGaWxlRW50cnkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmNvcHlGaWxlID0gX2NvcHlGaWxlO1xuICAgIHJldHVybiBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnY29yZG92YUV2ZW50c1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIG9ubGluZVN0YXR1c1NlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX29uUmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc3VtZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBhcHBsaWNhdGlvbiBpcyByZXN1bWluZyBmcm9tIHRoZSBiYWNrZ3JvdW5kJyk7XG4gICAgICB9LCAwKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG4gIHZhciBfb25QYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX2NhbGxaeW5jKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgYXBwbGljYXRpb24gaXMgcGF1c2luZyB0byB0aGUgYmFja2dyb3VuZCcpO1xuICAgICAgfSwgMCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuICB2YXIgX2NhbGxaeW5jID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IGV2YWx1YXIgdG9kYXMgbGFzIHBvc2liaWxpZGFkZXMgZGUgZXN0byBhY2EsIHBvciBxdWUgc2kgbGEgc2XDsWFsIGVzIG11eSBtYWxhIHF1ZSBwdWVkZSBwYXNhciwgYXVucXVlIGVsIHp5bmMgZGUgYmFzZXMgZGUgZGF0b3MgbnVuY2EgaGFzaWRvIG11eSBncmFuZGUgZW4gaW5mb3JtYWNpb25cbiAgICBpZiAob25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lICYmICFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgJiYgIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCkge1xuICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgIH1cbiAgfTtcbiAgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5Lm9uUGF1c2UgPSBfb25QYXVzZTtcbiAgY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5Lm9uUmVzdW1lID0gX29uUmVzdW1lO1xuICAvLyBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3RvcnkuY2FsbFp5bmMgPSBfY2FsbFp5bmM7XG4gIHJldHVybiBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnY3JlYXRlRGlyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgY3JlYXRlRGlyU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2NyZWF0ZURpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY3JlYXRlRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBkaXIpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlcykge1xuICAgICAgICByZXR1cm4gc3VjY2VzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeS5jcmVhdGVEaXIgPSBfY3JlYXRlRGlyO1xuICAgIHJldHVybiBjcmVhdGVEaXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2RldmljZVNlcnZpY2UnLCBmdW5jdGlvbiAoJGNvcmRvdmFEZXZpY2UpIHtcbiAgdmFyIGRldmljZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfc2V0SW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBkZXZpY2VTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAgZGV2aWNlOiAkY29yZG92YURldmljZS5nZXREZXZpY2UoKSxcbiAgICAgIGNvcmRvdmE6ICRjb3Jkb3ZhRGV2aWNlLmdldENvcmRvdmEoKSxcbiAgICAgIG1vZGVsOiAkY29yZG92YURldmljZS5nZXRNb2RlbCgpLFxuICAgICAgcGxhdGZvcm06ICRjb3Jkb3ZhRGV2aWNlLmdldFBsYXRmb3JtKCksXG4gICAgICB1dWlkOiAkY29yZG92YURldmljZS5nZXRVVUlEKCksXG4gICAgICB2ZXJzaW9uOiAkY29yZG92YURldmljZS5nZXRWZXJzaW9uKClcbiAgICB9O1xuICB9O1xuICBkZXZpY2VTZXJ2aWNlRmFjdG9yeS5zZXRJbmZvID0gX3NldEluZm87XG4gIHJldHVybiBkZXZpY2VTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdlYXN5RGlyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUpIHtcbiAgICB2YXIgZWFzeURpclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9jcmVhdGVEaXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdG9kYXkgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAgIHZhciBDdXJyZW50RGF0ZSA9IG1vbWVudCgpLnVuaXgoKTtcbiAgICAgICRjb3Jkb3ZhRmlsZS5jaGVja0Rpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgdG9kYXkpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FscmVhZHlleGlzdCcpOyAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICRjb3Jkb3ZhRmlsZS5jcmVhdGVEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIHRvZGF5LCBmYWxzZSkudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXIgY3JlYXRlZCcsIHRvZGF5KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Nhbm5vdCBjcmVhdGVkIGRpcicsIHRvZGF5KTtcbiAgICAgICAgfSk7ICAvLyBlcnJvclxuICAgICAgfSk7XG4gICAgfTtcbiAgICBlYXN5RGlyU2VydmljZUZhY3RvcnkuY3JlYXRlRGlyID0gX2NyZWF0ZURpcjtcbiAgICByZXR1cm4gZWFzeURpclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZXJyb3JTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBlcnJvclNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfY29uc29sZUVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgfTtcbiAgZXJyb3JTZXJ2aWNlRmFjdG9yeS5jb25zb2xlRXJyb3IgPSBfY29uc29sZUVycm9yO1xuICByZXR1cm4gZXJyb3JTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdmaWxlVHJhbnNmZXJTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlVHJhbnNmZXInLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlVHJhbnNmZXIpIHtcbiAgICB2YXIgZmlsZVRyYW5zZmVyU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gMTcwMDA7XG4gICAgdmFyIF9maWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIEZpbGVOYW1lID0gb2JqLnBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgdmFyIGZpbGVFeHQgPSBvYmoucGF0aC5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgY29uc29sZS5sb2coJ2V4dGVuc2lvbicsIGZpbGVFeHQpO1xuICAgICAgdmFyIG1pbWV0eXBlID0gJ2ltYWdlL2pwZWcnO1xuICAgICAgLy8gZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDIwMDAwO1xuICAgICAgaWYgKGZpbGVFeHQgPT09ICdtcDQnKSB7XG4gICAgICAgIG1pbWV0eXBlID0gJ3ZpZGVvL21wNCc7XG4gICAgICAgIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSA2MDAwMDtcbiAgICAgIH1cbiAgICAgIHZhciBzZXJ2ZXIgPSAnaHR0cDovLzE5MC4xNDUuMzkuMTM4L2F1dGgvYXBpL2ZpbGUnO1xuICAgICAgLy8gJ2h0dHBzOi8vd3d3LmFqdXN0ZXZzaXZhLmNvbS9hdXRoL2FwaS9maWxlJztcbiAgICAgIHZhciBvcHRpb25zID0ge307XG4gICAgICBvcHRpb25zLmZpbGVLZXkgPSAnZmlsZSc7XG4gICAgICBvcHRpb25zLmZpbGVOYW1lID0gb2JqLnBhdGguc3Vic3RyKG9iai5wYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIG9wdGlvbnMubWltZVR5cGUgPSBtaW1ldHlwZTtcbiAgICAgIC8qdmFyIGF1dGhEYXRhID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ2F1dGhvcml6YXRpb25EYXRhJyk7XHJcbiAgICAgICBpZiAoYXV0aERhdGEpIHtcclxuICAgICAgICAgdmFyIGhlYWRlcnMgPSB7ICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgYXV0aERhdGEudG9rZW4gfTtcclxuICAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gaGVhZGVycztcclxuICAgICAgIH0qL1xuICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgcGFyYW1zLnBhdGhGaWxlU2VydmVyID0gb2JqLnJ1dGFTcnYuc3Vic3RyaW5nKDAsIG9iai5ydXRhU3J2Lmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIC8vICcyMDE1L01hcmNoLzE4L1BSVUVCQTcwMCc7XG4gICAgICAvLyB1cmw7Ly9VcFByb21pc2UucGF0aEZpbGVTZXJ2ZXI7XG4gICAgICBwYXJhbXMudmFsdWUyID0gJ3BhcmFtJztcbiAgICAgIG9wdGlvbnMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgLy8gVE9ETzogZGVmaW5pciB1biBzZXJ2aWNpbyBwYXJhIHNldCBlbCB0aW1lb3V0IGRlcGVuZGllbmRvIHNpIGVzIGZvdG8gbyB2aWRlbztcbiAgICAgIG9wdGlvbnMudGltZW91dCA9IGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQ7XG4gICAgICAvLyRzY29wZS5kYXRhLnRpbWVvdXQ7XG4gICAgICAvLzUwMDsvLzMwMDAwOy8vbWlsaXNlY29uZHNcbiAgICAgIGNvbnNvbGUudGltZSgnZmlsZVVwbG9hZCcpO1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhRmlsZVRyYW5zZmVyLnVwbG9hZChzZXJ2ZXIsIG9iai5wYXRoLCBvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgLy8gY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIHJldHVybiBzdWNjZXNzOyAgLy9UT0RPOiB2ZXJpZmljYXIgc2kgcHVlZG8gcG9uZXIgZWwgZXJyb3IgYWNhIHkgZGlzcGFyYXIgZWwgb29mbGluZW1vZGUgZGVzZGUgYWNhIHkgbm8gZGVzZGUgdG9kb3MgbG9zIGNvbnRyb2xsZXJzXG4gICAgICB9ICAvLyBUT0RPOiBzaSBlamVjdXRvIGVuIGVsIHNlcnZpY2lvIG5vIGxsZWdhIGFsIGNvbnRyb2xhZG9yLCBhdW5xdWUgcG9kcmlhIGhhY2VyIHVuYSBwcmFjdGljYSBwYXJhIGRlZmluaXIgbG9zIHBhcmFtZXRyb3MgZGUgYWZ0ZXJ1cGxvYWQgYXF1aSBtaXNtbywgeSBxdWVkYSBtdWNobyBtZWpvclxuICAgICAgICAgLy8gLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgLy8gICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgICAgIC8vIH1cbik7XG4gICAgfTtcbiAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5maWxlVXBsb2FkID0gX2ZpbGVVcGxvYWQ7XG4gICAgcmV0dXJuIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZmlyc3RJbml0U2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICckbG9jYWxTdG9yYWdlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljTG9hZGluZycsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNMb2FkaW5nKSB7XG4gICAgdmFyIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8c3Bhbj5JbmljaWFsaXphbmRvPC9zcGFuPjxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgIHZhciBfaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgIH07XG4gICAgdmFyIF9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgY29uc29sZS5sb2coJ2NyZWFuZG8gb2JqIGxvY2Fsc3RvcmFnZScpO1xuICAgICAgaWYgKG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgICBfc2hvdygpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZpcnN0IGluaXQgb2snKTtcbiAgICAgICAgICAkbG9jYWxTdG9yYWdlLmRhdGEgPSB7XG4gICAgICAgICAgICBsYXN0RGlyQ3JlYXRlZDogJycsXG4gICAgICAgICAgICBmaXJzdFp5bmM6IG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKVxuICAgICAgICAgIH07XG4gICAgICAgICAgX2hpZGUoKTtcbiAgICAgICAgICBxLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZmlyc3QgaW5pdCBlcnJvcicsIGUpO1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgcS5yZWplY3QoZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcS5yZWplY3QoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBxLnByb21pc2U7XG4gICAgfTtcbiAgICBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeS5pbml0ID0gX2luaXQ7XG4gICAgcmV0dXJuIGZpcnN0SW5pdFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZm9jdXMnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIGZvY3VzRmFjdG9yeSA9IHt9O1xuICB2YXIgX2ZvY3VzID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgLy8gdGltZW91dCBtYWtlcyBzdXJlIHRoYXQgaXMgaW52b2tlZCBhZnRlciBhbnkgb3RoZXIgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgIC8vIGUuZy4gY2xpY2sgZXZlbnRzIHRoYXQgbmVlZCB0byBydW4gYmVmb3JlIHRoZSBmb2N1cyBvclxuICAgIC8vIGlucHV0cyBlbGVtZW50cyB0aGF0IGFyZSBpbiBhIGRpc2FibGVkIHN0YXRlIGJ1dCBhcmUgZW5hYmxlZCB3aGVuIHRob3NlIGV2ZW50c1xuICAgIC8vIGFyZSB0cmlnZ2VyZWQuXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGZvY3VzRmFjdG9yeS5mb2N1cyA9IF9mb2N1cztcbiAgcmV0dXJuIGZvY3VzRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdmb3Rvc1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhbWVyYScsXG4gICckY29yZG92YUZpbGUnLFxuICAnc3FsaXRlU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFDYW1lcmEsICRjb3Jkb3ZhRmlsZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgbW9tZW50U2VydmljZSkge1xuICAgIHZhciBmb3Rvc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBbXTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lm5hbWVzID0gW107XG4gICAgLy8gW3tcbiAgICAvLyAgICAgcGxhY2E6ICdBQkMxMTEnLFxuICAgIC8vICAgICBzcmM6ICcnLFxuICAgIC8vICAgICBzeW5jOiBmYWxzZVxuICAgIC8vICAgfV07XG4gICAgdmFyIF9yZW1vdmUgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zLnNwbGljZShmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcy5pbmRleE9mKHBsYWNhKSwgMSk7XG4gICAgfTtcbiAgICB2YXIgX2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3RvcztcbiAgICB9O1xuICAgIHZhciBfdGFrZWRwaWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgcXVhbGl0eTogNDUsXG4gICAgICAgIC8vNTAsXG4gICAgICAgIGRlc3RpbmF0aW9uVHlwZTogQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5GSUxFX1VSSSxcbiAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgLy8gYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgICBlbmNvZGluZ1R5cGU6IENhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgICAgdGFyZ2V0V2lkdGg6IDEwMDAsXG4gICAgICAgIC8vaW1wb3J0YW50ZSBjb24gMTAwIHNlIHZlaWEgaG9ycmlibGVcbiAgICAgICAgdGFyZ2V0SGVpZ2h0OiAxMDAwLFxuICAgICAgICAvLyBUT0RPOiByZXZpc2FyIHBhcmEgcXVlIHNpcnZlIGVzdGEgb3BjaW9uXG4gICAgICAgIC8vIHBvcG92ZXJPcHRpb25zOiBDYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2VcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICByZXR1cm4gaW1hZ2VVUkk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0UGhvdG9zID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRmb3RvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIHJldHVybiBfZ2V0TmFtZXMoKTsgIC8vIGNvbnNvbGUubG9nKGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfZ2V0TmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBJZFRpcG8sIE5vbWJyZSwgVmFsb3IsIE9yZGVuIEZST00gIEJhc2VfVGlwb3MgV0hFUkUgKElkTWFlc3Ryb1RpcG9zID0gMjUpIG9yZGVyIGJ5IE5vbWJyZSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTsgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2NvcHlGaWxlID0gZnVuY3Rpb24gKGltYWdlVVJJKSB7XG4gICAgICB2YXIgRmlsZU5hbWUgPSBpbWFnZVVSSS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgICBjb25zb2xlLmxvZyhGaWxlTmFtZSk7XG4gICAgICB2YXIgbmV3RmlsZU5hbWUgPSAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUoY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnksIEZpbGVOYW1lLCBjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgbmV3RmlsZU5hbWUpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3M7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Rm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkZm90b3MoaWRpbnNwZWNjaW9uLCBwYXRoLHN5bmMsdXVpZCxkZWxldGVkLCBvblVwbG9hZCwgcGxhY2EsIGZlY2hhLCBydXRhU3J2KSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyknO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZGluc3BlY2Npb24sXG4gICAgICAgIGltYWdlVVJJLFxuICAgICAgICBzeW5jLFxuICAgICAgICAndGVzdHV1aWQnLFxuICAgICAgICAwLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIG1vbWVudFNlcnZpY2UucnV0YVNydihpbWFnZVVSSSlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIHBhdGgsIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAvL1RPRE86IGVzIGVsIHBhdGggbGEgbWVqb3IgZm9ybWEgeSBtYXMgZWZlY3RpdmEgZGUgaGFjZXIgZWwgd2hlcmUgZGUgbGEgY29uc3VsdGFcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgc3luYz0/ICwgb25VcGxvYWQ9ID8gV0hFUkUgaWRpbnNwZWNjaW9uID0/IEFORCBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICAvLyBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfc2V0TmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRmb3RvcyBzZXQgaWR0aXBvPT8gIFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZHRpcG8sXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24sXG4gICAgICAgIGZvdG8ucGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnJlbW92ZSA9IF9yZW1vdmU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBfYWxsO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudGFrZWRwaWMgPSBfdGFrZWRwaWM7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5Lmluc2VydEZvdG8gPSBfaW5zZXJ0Rm90bztcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LmdldFBob3RvcyA9IF9nZXRQaG90b3M7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS51cGRhdGVGb3RvID0gX3VwZGF0ZUZvdG87XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5zZXROYW1lID0gX3NldE5hbWU7XG4gICAgcmV0dXJuIGZvdG9zU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdnZXRWaWRlb1NlcnZpY2UnLCBbXG4gICckY29yZG92YUNhbWVyYScsXG4gICckcScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhQ2FtZXJhLCAkcSwgY2hlY2tGaWxlU2VydmljZSkge1xuICAgIHZhciBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgLy9nZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeT1udWxsOy8vIHBlcmRlcmlhIGxhIHVsdGltYSBpbmZvcm1hY2lvbiBzaSBsbyB2dWVsdm8gYSByZWZlcmVuY2lhcjtcbiAgICAvLyBUT0RPOiAgZXN0byBzZSBkZWJlIGRlIGxsYW1hciBkZW50cm8gZGUgbGEgbWlzbWEgZnVuY2lvbiwgcG9yIHF1ZSBzaSBsbyBpbmljaWFsaXphbW9zIHBvciBmdWVyYSwgZWwgcHVnaW4gbm8gaGEgY2FyZ2FkbyB5IG9idGVuZ28gY2FtZXJhIGlzIG5vdCBkZWZpbmVkXG4gICAgLy8gdmFyIF9nZXRGaWxlRW50cnkgPSBmdW5jdGlvbiAodmlkZW9Db250ZW50UGF0aCkge1xuICAgIC8vICAgY29uc29sZS5sb2codmlkZW9Db250ZW50UGF0aCk7XG4gICAgLy8gICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIC8vICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwodmlkZW9Db250ZW50UGF0aCwgZnVuY3Rpb24gKEZpbGVFbnRyeSkge1xuICAgIC8vICAgICBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSA9IEZpbGVFbnRyeTtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIC8vICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgIC8vICAgfSk7XG4gICAgLy8gICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAvLyB9O1xuICAgIC8vIFRPRE86IGNyZWF0ZSBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeSB5IC5maWxlLCBwYXJhIGRldm9sdmVyIGxhIHByb21lc2Egc2luIGRhdGEgeSByZWZlcmVuY2lhciBlbCBjb250cm9sYWRvciBjb24gbGEgcHJvcGllZGFkIGRlZGwgc2VydmljaW8gdG9kZCBtb3RcbiAgICB2YXIgX2dldFZpZGVvQ29tcHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLlNBVkVEUEhPVE9BTEJVTSxcbiAgICAgICAgbWVkaWFUeXBlOiBDYW1lcmEuTWVkaWFUeXBlLlZJREVPXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FtZXJhLmdldFBpY3R1cmUob3B0aW9ucykudGhlbihmdW5jdGlvbiAodmlkZW9Db250ZW50UGF0aCkge1xuICAgICAgICAvLyByZXR1cm4gX2dldEZpbGVFbnRyeSh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrRmlsZVNlcnZpY2UuY2hlY2tGaWxlKHZpZGVvQ29udGVudFBhdGgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRWaWRlb1NlcnZpY2VGYWN0b3J5LmdldFZpZGVvQ29tcHJlc3MgPSBfZ2V0VmlkZW9Db21wcmVzcztcbiAgICByZXR1cm4gZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2dwc1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGVycm9yU2VydmljZSwgJGxvY2FsU3RvcmFnZSwgbW9tZW50U2VydmljZSwgJHEsIGludGVybWVkaWF0ZVNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UpIHtcbiAgdmFyIGdwc1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfZ3BzSHRtbFByb21pc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgb3B0ID0ge1xuICAgICAgbWF4aW11bUFnZTogOTAwMDAsXG4gICAgICB0aW1lb3V0OiAxNTAwMDAsXG4gICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICB9O1xuICAgIC8vdmFyIG9wdD0geyBtYXhpbXVtQWdlOiA5MDAwMCwgdGltZW91dDogMzAwMCwgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlIH07Ly90YW1iaWVuIHNlIHByb2JvIGNvbiAyMiwgcGVybyBzZSBiYWphIGhhc3RhIDEzXG4gICAgLy8gY29uc29sZS5sb2cobmF2aWdhdG9yLCBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKTtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIC8vYmV0YWRvcGFyYXBydWViYXNjb25zb2xlLmxvZyhcImdwc0h0bWxQcm9taXNlIFwiLCByZXN1bHQpXG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgLy8gQW4gZXJyb3Igb2NjdXJlZC4gU2hvdyBhIG1lc3NhZ2UgdG8gdGhlIHVzZXJcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpOyAgLy8kc2NvcGUuZGlhbG9nKGVycik7XG4gICAgfSwgb3B0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcbiAgdmFyIF9ncHNIdG1sID0gZnVuY3Rpb24gKGlkaW5zcGVjY2lvbikge1xuICAgIC8vIFRPRE86IGF1biBzaW4gd2kgZmkgbmkgZGF0b3MgZWwgZ3BzIHNpZ3VlIGZ1bmNpb25hbmRvXG4gICAgLy8gVE9ETzogcG9yIHF1ZSBtZSBkaXNwYXJhIGVsIHZlbnRvIGRlIG9uIG9ubGluZSwgbWFzIHF1ZSB0b2RvIGNvbiBlbCB3aWZpPz8/P1xuICAgIGlmICghJGxvY2FsU3RvcmFnZS5sYXRlc3RHcHMgfHwgbW9tZW50U2VydmljZS5kaWZmTm93KCRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzKSA+IDcpIHtcbiAgICAgIHZhciBvcHQgPSB7XG4gICAgICAgIG1heGltdW1BZ2U6IDMwMDAsXG4gICAgICAgIHRpbWVvdXQ6IDE1MDAwMCxcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgICB9O1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICBfaW5zZXJ0R3BzTG9nKGlkaW5zcGVjY2lvbiwgcG9zaXRpb24uY29vcmRzKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IsIG9wdCk7XG4gICAgfVxuICB9O1xuICB2YXIgX2luc2VydEdwc0xvZyA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIGNvb3Jkcykge1xuICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbZ3BzTG9nc10gKFtpZGluc3BlY2Npb25dICAgLFtmZWNoYV0gLFthY2N1cmFjeV0gICxbYWx0aXR1ZGVdLCAnO1xuICAgIHF1ZXJ5ICs9ICdbYWx0aXR1ZGVBY2N1cmFjeV0gICxbaGVhZGluZ10gICxbbGF0aXR1ZGVdICxbbG9uZ2l0dWRlXSxbc3BlZWRdKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPyw/KSc7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBpZGluc3BlY2Npb24sXG4gICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICBjb29yZHMuYWNjdXJhY3ksXG4gICAgICBjb29yZHMuYWx0aXR1ZGUsXG4gICAgICBjb29yZHMuYWx0aXR1ZGVBY2N1cmFjeSxcbiAgICAgIGNvb3Jkcy5oZWFkaW5nLFxuICAgICAgY29vcmRzLmxhdGl0dWRlLFxuICAgICAgY29vcmRzLmxvbmdpdHVkZSxcbiAgICAgIGNvb3Jkcy5zcGVlZFxuICAgIF07XG4gICAgc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgJGxvY2FsU3RvcmFnZS5sYXRlc3RHcHMgPSBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCk7XG4gICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gIH07XG4gIGdwc1NlcnZpY2VGYWN0b3J5Lmdwc0h0bWxQcm9taXNlID0gX2dwc0h0bWxQcm9taXNlO1xuICBncHNTZXJ2aWNlRmFjdG9yeS5ncHNIdG1sID0gX2dwc0h0bWw7XG4gIHJldHVybiBncHNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdpbnNwZWNjaW9uU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHEnLFxuICAnJGZpbHRlcicsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRxLCAkZmlsdGVyLCBlcnJvclNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UpIHtcbiAgICB2YXIgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZWN0aW9ucyA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uID0gMDtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaXRlbSA9IHt9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgICAga2lsb21ldHJhamU6ICcnLFxuICAgICAgb2JzZXJ2YWNpb246ICcnXG4gICAgfTtcbiAgICB2YXIgX3NldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHByZUl0ZW1zLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiBvYmouY29udHJvbEpzb25bMF0uaWQsXG4gICAgICAgICAgbGFiZWw6IG9iai5jb250cm9sSnNvblswXS50ZXh0XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcmltZXInKTtcbiAgICAgICAgb2JqLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBwcmVJdGVtcztcbiAgICB9O1xuICAgIHZhciBfc2VjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2VjdGlvbnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJGZpbHRlcigndW5pcXVlJykoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCwgJ2N1c3RvbXNlY3Rpb24nKSwgJ2N1c3RvbXNlY3Rpb24nKTtcbiAgICB9O1xuICAgIHZhciBfZ2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb24nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBfc2V0SXRlbXMoKTtcbiAgICAgIF9zZWN0aW9ucygpO1xuICAgICAgLy8gVE9ETzogbG9naWNhIHBhcmEgc2FiZXIgc2kgeWEgZnVlIGNhbGlmaWNhZG9cbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbHJlYWR5U2F2ZWQgPSBmYWxzZTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZHNlcnZpY2lvLFxuICAgICAgICBvYmouaWRpdGVtLFxuICAgICAgICBvYmouaWRQYXJlbnRJdGVtLFxuICAgICAgICBvYmoubm9tYnJlLFxuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wubGFiZWxcbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxYXJyYXkgPSBbXTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRBbGxJdGVtcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRPYnNlcnZhY2lvbigpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9pbnNlcnRLaWxvbWV0cmFqZSgpKTtcbiAgICAgIHJldHVybiAkcS5hbGwocWFycmF5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VlbHRhcyBsYXMgMyBwcm9tZXNhcyBlbiBlbCBzZXJ2aWNpbyBpbnNwZWNjaW9uJyk7XG4gICAgICAgIHJldHVybiBfdXBkYXRlSWRDbGFzZUNhcnJvY2VyaWEoKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIGNvbnNvbGUubG9nKCdpbmdyZXNvIG9rJywgcmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRBbGxJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRwcm9waWVkYWRlc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAsW2lkaXRlbV0sW2lkcGFyZW50aXRlbV0gICxbbm9tYnJlXSAsW2lkb3BjaW9uXSAgLFtzZWxlY2Npb25dICkgVkFMVUVTICg/LD8sPyw/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZ3MgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgYmluZGluZ3MucHVzaChfcnRuQmluZGluZyhvYmopKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuaW5zZXJ0Q29sbGVjdGlvbihxdWVyeSwgYmluZGluZ3MpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRPYnNlcnZhY2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbb2JzZXJ2YWNpb25lc10gKFtpZGluc3BlY2Npb25dICxbaWRzdWJwcm9jZXNvXSAgLFtvYnNlcnZhY2lvbl0pICAgVkFMVUVTICg/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9fY2wudGlwbyxcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEub2JzZXJ2YWNpb25cbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRLaWxvbWV0cmFqZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBba2lsb21ldHJhamVzXSAgICAgICAgKFtpZGluc3BlY2Npb25dLCBba2lsb21ldHJhamVdKSAgICAgIFZBTFVFUyAoPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamVcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpO1xuICAgIH07XG4gICAgdmFyIF9ydG5CaW5kaW5nVXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBhcnNlSW50KG9iai5zbC52YWx1ZSksXG4gICAgICAgIG9iai5zbC5sYWJlbCxcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgb2JqLmlkaXRlbVxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVTaW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIFtpZHByb3BpZWRhZGVzXSBzZXQgW2lkb3BjaW9uXT0/ICwgW3NlbGVjY2lvbl09ID8gV0hFUkUgW2lkaW5zcGVjY2lvbl09PyBhbmQgW2lkaXRlbV09PyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBfcnRuQmluZGluZ1VwZGF0ZShpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaXRlbSk7XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHNpbmdsZScsIHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9jbCA9IHtcbiAgICAgIGlkY2xhc2U6IG51bGwsXG4gICAgICBpZGNhcnJvY2VyaWE6IG51bGwsXG4gICAgICB0aXBvOiBudWxsXG4gICAgfTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2xhc2VzID0gW107XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gW107XG4gICAgLy8gVE9ETzogcGFyYSBsYSBpbXBsZW1lbnRhY2lvbiBkZSBwZXNhZG9zIHkgbW90b3MsIHlhIHNpIGRlYmUgc2VyIHVuYSBjb25zdWx0YVxuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS50aXBvcyA9IFt7XG4gICAgICAgIHZhbHVlOiA4MjksXG4gICAgICAgIGxhYmVsOiAnTGl2aWFub3MnXG4gICAgICB9ICAvLyAsXG4gICAgICAgICAvLyB7XG4gICAgICAgICAvLyAgIHZhbHVlOiA4NDQsXG4gICAgICAgICAvLyAgIGxhYmVsOiAnUGVzYWRvcydcbiAgICAgICAgIC8vIH1cbl07XG4gICAgdmFyIF9nZXRDbGFzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoX2NsLnRpcG8pICYmIGFuZ3VsYXIuaXNOdW1iZXIocGFyc2VJbnQoX2NsLnRpcG8pKSkge1xuICAgICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICBkaXN0aW5jdCBjYy5pZGNsYXNlIGFzIHZhbHVlICAsIGJ0Lk5vbWJyZSBhcyBsYWJlbCAgRlJPTSBjbGFzZXNfdGlwb1ZlaGljdWxvIGN0ICBpbm5lciBqb2luICAgY2xhc2VzX2NhcnJvY2VyaWFzIGNjIG9uIGNjLmlkY2xhc2U9Y3QuaWRjbGFzZSAgIGlubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG89Y2MuaWRjbGFzZSAgd2hlcmUgY3QuaWR0aXBvdmVoaWN1bG89Pyc7XG4gICAgICAgIHZhciBiaW5kaW5nID0gW3BhcnNlSW50KF9jbC50aXBvKV07XG4gICAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgLy8gVE9ETzogQVNJIE5PIFNJUlZFICwgbm8gc2UgYWN0dWFsaXphIGVsIGV4cHVlc3RvICwsX2NsYXNlcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2xhc2VzID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAgIF9jbC5pZGNsYXNlID0gbnVsbDtcbiAgICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBbXTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX2dldENhcnJvY2VyaWFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKF9jbC5pZGNsYXNlKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KF9jbC5pZGNsYXNlKSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgZGlzdGluY3QgY2MuaWRjYXJyb2NlcmlhIGFzIHZhbHVlICwgYnQuTm9tYnJlIGFzIGxhYmVsICBGUk9NICAgIGNsYXNlc19jYXJyb2NlcmlhcyBjYyAgaW5uZXIgam9pbiBCYXNlX1RpcG9zIGJ0IG9uIGJ0LklkVGlwbz1jYy5pZGNhcnJvY2VyaWEgICB3aGVyZSBjYy5pZGNsYXNlPT8nO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtwYXJzZUludChfY2wuaWRjbGFzZSldO1xuICAgICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBfY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX3NldElkQ2xhQ2EgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUIFtpZGNsYXNlY2Fycm9jZXJpYV0gLFtpZGNsYXNlXSAsW2lkY2Fycm9jZXJpYV0gICxbaWRjb2RpZ29jYWxpZmljYWNpb25dICAsW2lkZXh0cmFpbmZvXSAgIEZST00gW2NsYXNlc19jYXJyb2Nlcmlhc10gV0hFUkUgaWRjbGFzZT0/IGFuZCBpZGNhcnJvY2VyaWE9PyAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBhcnNlSW50KF9jbC5pZGNsYXNlKSxcbiAgICAgICAgcGFyc2VJbnQoX2NsLmlkY2Fycm9jZXJpYSlcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRDbGFzZUNhcnJvY2VyaWEgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uaWRjbGFzZWNhcnJvY2VyaWE7XG4gICAgICAgIHJldHVybiBfZ2V0VG9JbnNwZWN0KHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGNvZGlnb2NhbGlmaWNhY2lvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0SnNvbiA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YWx1ZS5jb250cm9sSnNvbiA9IGFuZ3VsYXIuZnJvbUpzb24odmFsdWUuY29udHJvbEpzb24pO1xuICAgICAgICB2YXIgc2wgPSB7XG4gICAgICAgICAgdmFsdWU6IHZhbHVlLmNvbnRyb2xKc29uWzBdLnZhbHVlLFxuICAgICAgICAgIGxhYmVsOiB2YWx1ZS5jb250cm9sSnNvblswXS5sYWJlbFxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJpbWVyJyk7XG4gICAgICAgIHZhbHVlLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBhcnJheTtcbiAgICB9O1xuICAgIHZhciBfc2V0QWxyZWFkeUluc3BlY3RKc29uID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIHZhbHVlLmNvbnRyb2xKc29uID0gYW5ndWxhci5mcm9tSnNvbih2YWx1ZS5jb250cm9sSnNvbik7XG4gICAgICAgIC8vIFRPRE86IGVsIGpzb24gZGUgY29udHJvbEpzb24gZGV2dWVsdmUgdW4gdmFsdWU9IFwiXCIgc3RyaW5nLCB2ZXIgc2kgc2UgcHVlZGUgbWVqb3JhcjtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZS52YWx1ZS50b1N0cmluZygpLFxuICAgICAgICAgIGxhYmVsOiB2YWx1ZS5sYWJlbFxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJpbWVyJyk7XG4gICAgICAgIHZhbHVlLnNsID0gc2w7XG4gICAgICB9KTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBhcnJheTtcbiAgICB9O1xuICAgIHZhciBfY2xlYXJPYnNLbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplID0gJyc7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvbiA9ICcnO1xuICAgIH07XG4gICAgLy8gdmFyIF9jbGVhclRpcG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wuaWRjbGFzZSA9IHtcbiAgICAvLyAgICAgaWRjbGFzZTogbnVsbCxcbiAgICAvLyAgICAgaWRjYXJyb2NlcmlhOiBudWxsLFxuICAgIC8vICAgICB0aXBvOiBudWxsXG4gICAgLy8gICB9O1xuICAgIC8vIH07XG4gICAgdmFyIF9nZXRUb0luc3BlY3QgPSBmdW5jdGlvbiAoaWRjb2RpZ29jYWxpZmljYWNpb24pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3Qgb2lmLmlkc2VydmljaW8gLCBjcGMuaWRpdGVtLCBpZFBhcmVudEl0ZW0sIG5vbWJyZSxjdXN0b21zZWN0aW9uLCBjdXN0b21vcmRlciAsIGNvbnRyb2xKc29uIGZyb20gIHZpZXdWMyBvaWYgJztcbiAgICAgIC8vc2llbXByZSBkZWphciB1biBlc3BhY2lvIGVuIGJsYW5jbyAgXG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjYWxpZmljYWNpb25waWV6YXNjb2RpZ28gY3BjIG9uICBjcGMuaWRpdGVtPSBvaWYuaWRpdGVtICBhbmQgb2lmLnRpcG89MSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY29udHJvbEVsZW1lbnRvcyBjZSBvbiBjZS5pZGNvbnRyb2wgPW9pZi5pZGNvbnRyb2wgJztcbiAgICAgIHF1ZXJ5ICs9ICd3aGVyZSBvaWYuaWRzZXJ2aWNpbz0/IGFuZCBjcGMuaWRjb2RpZ29jYWxpZmljYWNpb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgODI5LFxuICAgICAgICAvL3BhcnNlSW50KF9jbC50aXBvKSxcbiAgICAgICAgaWRjb2RpZ29jYWxpZmljYWNpb25cbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBfc2V0SnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICBfc2VjdGlvbnMoKTtcbiAgICAgICAgX2NsZWFyT2JzS20oKTsgIC8vIF9jbGVhclRpcG8oKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9zZXJPYnNLbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICAgby5pZG9ic2VydmFjaW9uLCAgIG9ic2VydmFjaW9uLCBraWxvbWV0cmFqZSBGUk9NICAgb2JzZXJ2YWNpb25lcyBvIGlubmVyIGpvaW4ga2lsb21ldHJhamVzIGsgb24gay5pZGluc3BlY2Npb249by5pZGluc3BlY2Npb24gJztcbiAgICAgIHF1ZXJ5ICs9ICdXSEVSRSAgICAgKG8uaWRpbnNwZWNjaW9uID0gPykgQU5EIChpZHN1YnByb2Nlc28gPSA/KSBPcmRlciBieSBvLmlkb2JzZXJ2YWNpb24gZGVzYyBsaW1pdCAxICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5XG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmFyIG9ic0ttID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdO1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5vYnNlcnZhY2lvbiA9IG9ic0ttLm9ic2VydmFjaW9uO1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZSA9IG9ic0ttLmtpbG9tZXRyYWplO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2dldEFscmVhZHlJbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBvaWYuaWRzZXJ2aWNpbyAsIGNwYy5pZGl0ZW0sIG9pZi5pZFBhcmVudEl0ZW0sIG9pZi5ub21icmUsY3VzdG9tc2VjdGlvbiwgY3VzdG9tb3JkZXIgLCBjb250cm9sSnNvbiAsIGlkcC5pZG9wY2lvbiBhcyB2YWx1ZSwgaWRwLnNlbGVjY2lvbiBhcyBsYWJlbCAnO1xuICAgICAgcXVlcnkgKz0gJ2Zyb20gIHZpZXdWZG9zIG9pZiBpbm5lciBqb2luIGNhbGlmaWNhY2lvbnBpZXphc2NvZGlnbyBjcGMgb24gIGNwYy5pZGl0ZW09IG9pZi5pZGl0ZW0gIGFuZCBvaWYudGlwbz0xICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBjb250cm9sRWxlbWVudG9zIGNlIG9uIGNlLmlkY29udHJvbCA9b2lmLmlkY29udHJvbCAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gIGNsYXNlc19jYXJyb2NlcmlhcyBjYyBvbiBjYy5pZGNvZGlnb2NhbGlmaWNhY2lvbj1jcGMuaWRjb2RpZ29jYWxpZmljYWNpb24gJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGlkaW5zcGVjY2lvbiBpIG9uIGkuaWRDbGFzZUNhcnJvY2VyaWE9Y2MuaWRjbGFzZWNhcnJvY2VyaWEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGlkcHJvcGllZGFkZXMgaWRwIG9uIGlkcC5pZGluc3BlY2Npb249aS5pZGluc3BlY2Npb24gYW5kIGlkcC5pZGl0ZW0gPSBjcGMuaWRpdGVtICc7XG4gICAgICBxdWVyeSArPSAnd2hlcmUgIGkuaWRpbnNwZWNjaW9uID0/IGFuZCBvaWYuaWRzZXJ2aWNpbz0/ICAgICc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5XG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgX3NldEFscmVhZHlJbnNwZWN0SnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICBfc2VjdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuIF9zZXJPYnNLbSgpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRpbnNwZWNjaW9uXSAgIFNFVCBbaWRDbGFzZUNhcnJvY2VyaWFdID0/IFdIRVJFIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRDbGFzZUNhcnJvY2VyaWEsXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb25cbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gX2luc2VydFN0YXRlKDQ3Nyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0U3RhdGUgPSBmdW5jdGlvbiAoaWRlc3RhZG8pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBbaWRzdWJwcm9jZXNvc2VndWltaWVudG9dIChbaWRpbnNwZWNjaW9uXSAgICAsW2lkc3VicHJvY2Vzb10gICAsW2lkZXN0YWRvXSAgICxbZmVjaGFdICApICBWQUxVRVMgICAgKD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjksXG4gICAgICAgIC8vX2NsLnRpcG8sXG4gICAgICAgIGlkZXN0YWRvLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gdHJ1ZTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDMpOyAgLy8gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsLnRpcG8gPSBudWxsO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZ2V0SXRlbXMgPSBfZ2V0SXRlbXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnVwZGF0ZVNpbmdsZSA9IF91cGRhdGVTaW5nbGU7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNhdmUgPSBfc2F2ZTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2wgPSBfY2w7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldENsYXNlcyA9IF9nZXRDbGFzZXM7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldENhcnJvY2VyaWFzID0gX2dldENhcnJvY2VyaWFzO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zZXRJZENsYUNhID0gX3NldElkQ2xhQ2E7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldEFscmVhZHlJbnNwZWN0ID0gX2dldEFscmVhZHlJbnNwZWN0O1xuICAgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbGVhclRpcG8gPSBfY2xlYXJUaXBvO1xuICAgIHJldHVybiBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdpbnRlcm1lZGlhdGVTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBpbnRlcm1lZGlhdGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICBpbnRlcm1lZGlhdGVTZXJ2aWNlRmFjdG9yeS5kYXRhID0ge1xuICAgIGlzVGFraW5nUGljOiBmYWxzZSxcbiAgICBpc1Rha2luZ1ZpZDogZmFsc2UsXG4gICAgbmF2QmFyU2VhcmNoOiBmYWxzZSxcbiAgICBwbGFjYTogbnVsbCxcbiAgICBpZGluc3BlY2Npb25TeW5jOiBmYWxzZSxcbiAgICBpZGluc3BlY2Npb246IG51bGxcbiAgfTtcbiAgcmV0dXJuIGludGVybWVkaWF0ZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ21vbWVudFNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIG1vbWVudFNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfZ2V0RGF0ZVRpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX2FkZERheXMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ2RheXMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGRIb3VycyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAnaG91cnMnKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGRTZWNvbmRzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfcnV0YVNydiA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGZpbGVuYW1lID0gcGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIHJ1dGEgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVkvTU1NTS9ERC8nKSArIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSArICcvJyArIGZpbGVuYW1lO1xuICAgIHJldHVybiBydXRhO1xuICB9O1xuICB2YXIgX2RpZmZOb3cgPSBmdW5jdGlvbiAoYiwgdGlwbykge1xuICAgIHZhciBydGEgPSBtb21lbnQoKS5kaWZmKG1vbWVudChiKSwgdGlwbyk7XG4gICAgY29uc29sZS5sb2cocnRhLCAnZGlmZicpO1xuICAgIHJldHVybiBydGE7XG4gIH07XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmdldERhdGVUaW1lID0gX2dldERhdGVUaW1lO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGREYXlzID0gX2FkZERheXM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmFkZEhvdXJzID0gX2FkZEhvdXJzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGRTZWNvbmRzID0gX2FkZFNlY29uZHM7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LnJ1dGFTcnYgPSBfcnV0YVNydjtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuZGlmZk5vdyA9IF9kaWZmTm93O1xuICByZXR1cm4gbW9tZW50U2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnb2ZmbGluZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICBvZmZsaW5lU2VydmljZUZhY3RvcnkuZGF0YSA9IHt9O1xuICAvLyB2YXIgX2ZvY3VzID0gZnVuY3Rpb24gKGlkKSB7XG4gIC8vICAgLy8gdGltZW91dCBtYWtlcyBzdXJlIHRoYXQgaXMgaW52b2tlZCBhZnRlciBhbnkgb3RoZXIgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAvLyAgIC8vIGUuZy4gY2xpY2sgZXZlbnRzIHRoYXQgbmVlZCB0byBydW4gYmVmb3JlIHRoZSBmb2N1cyBvclxuICAvLyAgIC8vIGlucHV0cyBlbGVtZW50cyB0aGF0IGFyZSBpbiBhIGRpc2FibGVkIHN0YXRlIGJ1dCBhcmUgZW5hYmxlZCB3aGVuIHRob3NlIGV2ZW50c1xuICAvLyAgIC8vIGFyZSB0cmlnZ2VyZWQuXG4gIC8vICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAvLyAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIC8vICAgICBpZiAoZWxlbWVudCkge1xuICAvLyAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vIH07XG4gIG9mZmxpbmVTZXJ2aWNlRmFjdG9yeS5kYXRhLm9mZmxpbmVNb2RlID0gZmFsc2U7XG4gIHJldHVybiBvZmZsaW5lU2VydmljZUZhY3Rvcnk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb25saW5lU3RhdHVzU2VydmljZScsIFtcbiAgJyRyb290U2NvcGUnLFxuICAnJHEnLFxuICAnJGluamVjdG9yJyxcbiAgJyRsb2NhdGlvbicsXG4gICckY29yZG92YU5ldHdvcmsnLFxuICAnJGlvbmljUG9wdXAnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdvZmZsaW5lU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsICRpbmplY3RvciwgJGxvY2F0aW9uLCAkY29yZG92YU5ldHdvcmssICRpb25pY1BvcHVwLCB6dW1lcm9TZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgdG9hc3RTZXJ2aWNlKSB7XG4gICAgdmFyIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGlzT25saW5lOiBmYWxzZSxcbiAgICAgIGNvbm5UeXBlOiAnbm9uZSdcbiAgICB9O1xuICAgIHZhciBfaXNPbmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9ICRjb3Jkb3ZhTmV0d29yay5pc09ubGluZSgpO1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuZGF0YS5pc09ubGluZSA9ICRjb3Jkb3ZhTmV0d29yay5pc09ubGluZSgpO1xuICAgIH07XG4gICAgdmFyIF90eXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSAkY29yZG92YU5ldHdvcmsuZ2V0TmV0d29yaygpO1xuICAgIH07XG4gICAgdmFyIF9vbk9ubGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRyb290U2NvcGUuJG9uKCckY29yZG92YU5ldHdvcms6b25saW5lJywgZnVuY3Rpb24gKGV2ZW50LCBuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIG5ldHdvcmtTdGF0ZSk7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IHRydWU7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gbmV0d29ya1N0YXRlO1xuICAgICAgICAvLyBUT0RPOiBldmFsdWFyIHRvZGFzIGxhcyBwb3NpYmlsaWRhZGVzIGRlIGVzdG8gYWNhLCBwb3IgcXVlIHNpIGxhIHNlw7FhbCBlcyBtdXkgbWFsYSBxdWUgcHVlZGUgcGFzYXIsIGF1bnF1ZSBlbCB6eW5jIGRlIGJhc2VzIGRlIGRhdG9zIG51bmNhIGhhc2lkbyBtdXkgZ3JhbmRlIGVuIGluZm9ybWFjaW9uXG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKTsgIC8vIGNvcmRvdmFFdmVudHNTZXJ2aWNlLmNhbGxaeW5jKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qaWYoIXNpZ25hbFNlcnZpY2UuaXNJbml0KXtcbiAgICAgICAgICAgICAgICAgICAgc2lnbmFsU2VydmljZS5zdGFydEh1YigpO1xuXG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJGNvcmRvdmFOZXR3b3JrOnNpZ25hbCcseyduZXR3b3JrU3RhdGUnOm5ldHdvcmtTdGF0ZX0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX29uT2ZmbGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGxpc3RlbiBmb3IgT2ZmbGluZSBldmVudFxuICAgICAgJHJvb3RTY29wZS4kb24oJyRjb3Jkb3ZhTmV0d29yazpvZmZsaW5lJywgZnVuY3Rpb24gKGV2ZW50LCBuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQsIG5ldHdvcmtTdGF0ZSk7XG4gICAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IGZhbHNlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IG5ldHdvcmtTdGF0ZTsgIC8qIGlmKG5ldHdvcmtTdGF0ZSA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJJbnRlcm5ldCBEaXNjb25uZWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiVGhlIGludGVybmV0IGlzIGRpc2Nvbm5lY3RlZCBvbiB5b3VyIGRldmljZS5cIlxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpb25pYy5QbGF0Zm9ybS5leGl0QXBwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5vbk9ubGluZSA9IF9vbk9ubGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5vbk9mZmxpbmUgPSBfb25PZmZsaW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmlzT25saW5lID0gX2lzT25saW5lO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gX3R5cGU7XG4gICAgcmV0dXJuIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgncGxhY2FzU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHJvb3RTY29wZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2F1dGhTZXJ2aWNlJyxcbiAgJ2RldmljZVNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3VwZGF0ZVN5bmNTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKHNxbGl0ZVNlcnZpY2UsICRyb290U2NvcGUsIG1vbWVudFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB1cGRhdGVTeW5jU2VydmljZSkge1xuICAgIHZhciBwbGFjYXNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IFtdO1xuICAgIHZhciBfc2VsZWN0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRlc3QgPSBbe1xuICAgICAgICAgIGlkaW5zcGVjY2lvbjogMSxcbiAgICAgICAgICBwbGFjYTogJ2FiYzExMSdcbiAgICAgICAgfV07XG4gICAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh0ZXN0KTsgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBiaW5kaW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFBsYWNhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkaW5zcGVjY2lvbic7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGkuaWRpbnNwZWNjaW9uLCBwbGFjYSwgaS5zeW5jLCAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgY2FzZSB3aGVuIGlzcy5pZGluc3BlY2Npb24gaXMgbnVsbCB0aGVuIDAgZWxzZSAxIGVuZCBhcyBjYWxpZmljYWRvICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICAgIGZyb20gaWRpbnNwZWNjaW9uIGkgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgIGxlZnQgam9pbiAoc2VsZWN0IGlkaW5zcGVjY2lvbiBmcm9tICBpZHN1YnByb2Nlc29zZWd1aW1pZW50byAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgICAgICAgICAgIHdoZXJlIGlkZXN0YWRvPTQ3NykgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgaXNzIG9uIGlzcy5pZGluc3BlY2Npb249aS5pZGluc3BlY2Npb24nO1xuICAgICAgcXVlcnkgKz0gJyAgICAgIFdIRVJFIFVzZXJOYW1lPT8gYW5kIGZlY2hhPiA/JztcbiAgICAgIHF1ZXJ5ICs9ICcgT3JkZXIgYnkgaS5pZGluc3BlY2Npb24gREVTQyBMaW1pdCAxMCc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHBsYWNhc1NlcnZpY2VGYWN0b3J5LmFsbCk7XG4gICAgICAgIF9pbnNlcnREZXZpY2UoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHZhciBfdXBkYXRlU3luYyA9IGZ1bmN0aW9uIChwbGFjYSwgc3luYykge1xuICAgIC8vICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBpZGluc3BlY2Npb24gc2V0IHN5bmM9PyAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+Pyc7XG4gICAgLy8gICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgIC8vICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgLy8gICAgIHN5bmMsXG4gICAgLy8gICAgIHBsYWNhLFxuICAgIC8vICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAvLyAgICAgbW9tZW50U2VydmljZS5hZGREYXlzKC0zKVxuICAgIC8vICAgXTtcbiAgICAvLyAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIC8vIH07XG4gICAgdmFyIF9pbnNlcnRQTGFjYSA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIGlkaW5zcGVjY2lvbihwbGFjYSwgZmVjaGEsVXNlck5hbWUsdXVpZCwgc3luYykgVkFMVUVTICg/LD8sPyw/LCA/KSc7XG4gICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAvLyAwIG1lYW5zIGZhbHNlXG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGxhY2EsXG4gICAgICAgIG1vbWVudFNlcnZpY2UuZ2V0RGF0ZVRpbWUoKSxcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS51dWlkLFxuICAgICAgICBzeW5jXG4gICAgICBdO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhID0gcGxhY2E7XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRQbGFjYXMoKTsgIC8vIHJldHVybiBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwucHVzaCh7XG4gICAgICAgIC8vICAgcGxhY2E6IHBsYWNhLFxuICAgICAgICAvLyAgIGlkaW5zcGVjY2lvbjogcmVzLmluc2VydElkXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gcmVzLmluc2VydElkO1xuICAgICAgICByZXR1cm4genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfZ2V0UGxhY2FzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3Igb24genVtZXJvIHN5bmMgZGVzZGUgcHMnKTtcbiAgICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydERldmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgT1IgSUdOT1JFIElOVE8gW2RldmljZXNdKFt1dWlkXSxbbW9kZWxdKSAgVkFMVUVTKD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGRldmljZVNlcnZpY2UuZGF0YS51dWlkLFxuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEubW9kZWxcbiAgICAgIF07XG4gICAgICBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnNlcnQgZGV2aWNlJywgcmVzKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5zZWxlY3RBbGwgPSBfc2VsZWN0QWxsO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5LmdldFBsYWNhcyA9IF9nZXRQbGFjYXM7XG4gICAgcGxhY2FzU2VydmljZUZhY3RvcnkuaW5zZXJ0UExhY2EgPSBfaW5zZXJ0UExhY2E7XG4gICAgLy8gcGxhY2FzU2VydmljZUZhY3RvcnkuaW5zZXJ0RGV2aWNlID0gX2luc2VydERldmljZTtcbiAgICByZXR1cm4gcGxhY2FzU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdzcWxpdGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFTUUxpdGUnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFTUUxpdGUpIHtcbiAgICB2YXIgc3FsaXRlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2V4ZWN1dGVRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeSwgYmluZGluZykge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoZGIsIHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRDb2xsZWN0aW9uID0gZnVuY3Rpb24gKHF1ZXJ5LCBiaW5kaW5ncykge1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhU1FMaXRlLmluc2VydENvbGxlY3Rpb24oZGIsIHF1ZXJ5LCBiaW5kaW5ncykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfcnRuQXJyYXkgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgIGlmIChyZXMucm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcnJheS5wdXNoKHJlcy5yb3dzLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIFRPRE86IHNpIHlvIGNhbWJpbyBlbCB0aXBvIGRlIGRhdG8gZGUgdW5hIGNvbHVtbmEsIGVqZW1wbG8gc3RyaW5nIHRvIGludCwgZGVibyByZWVzdGFibGVjZXIgbGEgYmFzZSBkZSBkYXRvcyB6dW1lcm8sIHBhcmEgYWdyZWdhciB1bmEgY29sdW1uYSBubyB0ZW5nbyBwcm9ibGVtYVxuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5LmV4ZWN1dGVRdWVyeSA9IF9leGVjdXRlUXVlcnk7XG4gICAgc3FsaXRlU2VydmljZUZhY3RvcnkuaW5zZXJ0Q29sbGVjdGlvbiA9IF9pbnNlcnRDb2xsZWN0aW9uO1xuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5LnJ0bkFycmF5ID0gX3J0bkFycmF5O1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3RpdGxlU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgdGl0bGVTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB0aXRsZVNlcnZpY2VGYWN0b3J5LnRpdGxlID0gJyc7XG4gIHJldHVybiB0aXRsZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3RvYXN0U2VydmljZScsIGZ1bmN0aW9uICgkY29yZG92YVRvYXN0KSB7XG4gIHZhciB0b2FzdFNlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfc2hvd0xvbmdCb3R0b20gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgcmV0dXJuICRjb3Jkb3ZhVG9hc3Quc2hvd0xvbmdCb3R0b20obXNnKTtcbiAgfTtcbiAgdmFyIF9zaG93U2hvcnRCb3R0b20gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgcmV0dXJuICRjb3Jkb3ZhVG9hc3Quc2hvd1Nob3J0Qm90dG9tKG1zZyk7XG4gIH07XG4gIHRvYXN0U2VydmljZUZhY3Rvcnkuc2hvd0xvbmdCb3R0b20gPSBfc2hvd0xvbmdCb3R0b207XG4gIHRvYXN0U2VydmljZUZhY3Rvcnkuc2hvd1Nob3J0Qm90dG9tID0gX3Nob3dTaG9ydEJvdHRvbTtcbiAgcmV0dXJuIHRvYXN0U2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndW5zeW5jU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgaW50ZXJtZWRpYXRlU2VydmljZSwgdG9hc3RTZXJ2aWNlLCBhdXRoU2VydmljZSwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZmlsZVRyYW5zZmVyU2VydmljZSwgZm90b3NTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG4gIHZhciB1bnN5bmNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMgPSBbXTtcbiAgdmFyIF9nZXRJbWdVbnN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgICAgaWRmb3RvLCBpLmlkaW5zcGVjY2lvbiwgcGF0aCwgZi5zeW5jLCAgaS5wbGFjYSwgZi5ydXRhU3J2ICc7XG4gICAgcXVlcnkgKz0gJ0ZST00gICAgICBpZGluc3BlY2Npb24gaSAgICBpbm5lciBqb2luICBpZGZvdG9zIGYgb24gaS5pZGluc3BlY2Npb24gPSBmLmlkaW5zcGVjY2lvbiAnO1xuICAgIHF1ZXJ5ICs9ICdXSEVSRSAgICBpLnVzZXJOYW1lID0gPyBBTkQgIGkuZmVjaGE+PyBBTkQgKGYuc3luYyA9IDApIEFORCAoZGVsZXRlZCA9IDApICc7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykubGVuZ3RoO1xuICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICB9O1xuICB2YXIgX3N5bmNJbWFnZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2dldEltZ1Vuc3luYygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA8IDEpIHtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhbmd1bGFyLmZvckVhY2godW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jLCBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICAgICAgX3ByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB2YXIgX3ByZUZpbGVVcGxvYWQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgLy8gfHwgIW9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUpIHtcbiAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgIF91cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBlbiBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICB2YXIgX3VwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgIF91cGRhdGVGb3RvKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCk7XG4gIH07XG4gIHZhciBfdXBkYXRlRm90byA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICBmb3Rvc1NlcnZpY2UudXBkYXRlRm90byhpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAvLyBpZiAocy5tYXNzaXZlVXBsb2FkKSB7XG4gICAgICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPSB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggLSAxO1xuICAgICAgaWYgKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc29sZS5sb2codW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gfVxuICAgICAgLy8gX2ZpbHRlclVuc3luYygwKTsgICAgICAgICAgXG4gICAgICBjb25zb2xlLmxvZyh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGgsICdzeW5jJyk7XG4gICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXlFdmVudCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LmdldEltZ1Vuc3luYyA9IF9nZXRJbWdVbnN5bmM7XG4gIHVuc3luY1NlcnZpY2VGYWN0b3J5LnN5bmNJbWFnZXMgPSBfc3luY0ltYWdlcztcbiAgcmV0dXJuIHVuc3luY1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3VwZGF0ZVN5bmNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBhdXRoU2VydmljZSwgbW9tZW50U2VydmljZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSkge1xuICB2YXIgdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5ID0ge307XG4gIHZhciBfdXBkYXRlU3luYyA9IGZ1bmN0aW9uIChwbGFjYSwgc3luYykge1xuICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRpbnNwZWNjaW9uIHNldCBzeW5jPT8gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8nO1xuICAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICBzeW5jLFxuICAgICAgcGxhY2EsXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZyk7ICAvLyAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSk7XG4gIH07XG4gIHZhciBfc2VsZWN0SWRpbnNwZWNjaW9uU3luYyA9IGZ1bmN0aW9uIChwbGFjYSkge1xuICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgaWRpbnNwZWNjaW9uIGZyb20gaWRpbnNwZWNjaW9uICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/IE9yZGVyIGJ5IGlkaW5zcGVjY2lvbiBERVNDIExpbWl0IDEnO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgcGxhY2EsXG4gICAgICBhdXRoU2VydmljZS5hdXRoZW50aWNhdGlvbi51c2VyTmFtZSxcbiAgICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICBdO1xuICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkaW5zcGVjY2lvbjtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jID0gdHJ1ZTtcbiAgICAgIHJldHVybiBfdXBkYXRlU3luYyhwbGFjYSwgdHJ1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUsICdlcnJvcicpO1xuICAgIH0pOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgLy8gICByZXR1cm4gO1xuICAgICAgICAgLy8gfSk7XG4gIH07XG4gIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS51cGRhdGVTeW5jID0gX3VwZGF0ZVN5bmM7XG4gIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS5zZWxlY3RJZGluc3BlY2Npb25TeW5jID0gX3NlbGVjdElkaW5zcGVjY2lvblN5bmM7XG4gIC8vIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeS5zeW5jSW1hZ2VzID0gX3N5bmNJbWFnZXM7XG4gIHJldHVybiB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgndmlkZW9TZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYXB0dXJlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhQ2FwdHVyZSwgc3FsaXRlU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgbW9tZW50U2VydmljZSkge1xuICAgIHZhciB2aWRlb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3MgPSBbXTtcbiAgICB2YXIgX2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcztcbiAgICB9O1xuICAgIHZhciBfdGFrZWRWaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgbGltaXQ6IDEsXG4gICAgICAgIGR1cmF0aW9uOiAxMlxuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhcHR1cmUuY2FwdHVyZVZpZGVvKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHZpZGVvRGF0YSkge1xuICAgICAgICByZXR1cm4gdmlkZW9EYXRhO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFZpZGVvcyA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkVmlkZW9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2lkaW5zcGVjY2lvbl07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnZpZGVvcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgY29uc29sZS5sb2codmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnRWaWRlbyA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIHBhdGgsIHN5bmMsIHRodW1ibmFpbCwgb25VcGxvYWQpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZFZpZGVvcyhpZGluc3BlY2Npb24sIHBhdGgsc3luYyx1dWlkLHRodW1ibmFpbCwgb25VcGxvYWQsIHBsYWNhLCBmZWNoYSwgcnV0YVNydiApIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyw/LCA/KSc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGlkaW5zcGVjY2lvbixcbiAgICAgICAgcGF0aCxcbiAgICAgICAgc3luYyxcbiAgICAgICAgJ3Rlc3R1dWlkJyxcbiAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVWaWRlbyA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24sIHBhdGgsIHN5bmMsIG9uVXBsb2FkKSB7XG4gICAgICAvL1RPRE86IGVzIGVsIHBhdGggbGEgbWVqb3IgZm9ybWEgeSBtYXMgZWZlY3RpdmEgZGUgaGFjZXIgZWwgd2hlcmUgZGUgbGEgY29uc3VsdGFcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRWaWRlb3Mgc2V0IHN5bmM9PyAsIG9uVXBsb2FkPSA/IFdIRVJFIHBhdGg9Pyc7XG4gICAgICAvLyBUT0RPOiBlbCBjYW1wbyBkZWxldGVkIGVzIGJvb2xlYW4gLCBwZXJvIGRlYmUgYXNpZ25hcnNlbGUgMSBvIDBcbiAgICAgIC8vIFRPRE86ICBtdWNobyBjdWlkYWRvIHBvciBlamVtcGxvIGVsIHBhdGggZGViZSBzZXIgbnZhcmNoYXIoKSBOTyAgTkNIQVJcbiAgICAgIHN5bmMgPSBzeW5jID8gMSA6IDA7XG4gICAgICBvblVwbG9hZCA9IG9uVXBsb2FkID8gMSA6IDA7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgc3luYyxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIHBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5yb3dzQWZmZWN0ZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB3YXMgdXBkYXRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5yb3dzQWZmZWN0ZWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5hbGwgPSBfYWxsO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudGFrZWRWaWQgPSBfdGFrZWRWaWQ7XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS5nZXRWaWRlb3MgPSBfZ2V0VmlkZW9zO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuaW5zZXJ0VmlkZW8gPSBfaW5zZXJ0VmlkZW87XG4gICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS51cGRhdGVWaWRlbyA9IF91cGRhdGVWaWRlbztcbiAgICByZXR1cm4gdmlkZW9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3ZpZGVvVGh1bWJuYWlsU2VydmljZScsIFtcbiAgJyRxJyxcbiAgZnVuY3Rpb24gKCRxKSB7XG4gICAgdmFyIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2dlbmVyYXRlVGh1bWJuYWlsID0gZnVuY3Rpb24gKG5hdGl2ZVVSTCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBuYW1lID0gbmF0aXZlVVJMLnNsaWNlKDAsIC00KTtcbiAgICAgIHdpbmRvdy5QS1ZpZGVvVGh1bWJuYWlsLmNyZWF0ZVRodW1ibmFpbChuYXRpdmVVUkwsIG5hbWUgKyAnLnBuZycsIGZ1bmN0aW9uIChwcmV2U3VjYykge1xuICAgICAgICBjb25zb2xlLmxvZyhwcmV2U3VjYyk7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJldlN1Y2MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIGdlbmVybmFkbyB0aHVtYm5haWwnLCBlKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3RvcnkuZ2VuZXJhdGVUaHVtYm5haWwgPSBfZ2VuZXJhdGVUaHVtYm5haWw7XG4gICAgcmV0dXJuIHZpZGVvVGh1bWJuYWlsU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd6dW1lcm9TZXJ2aWNlJywgW1xuICAnJHEnLFxuICAnJGNvcmRvdmFEZXZpY2UnLFxuICAnJGNvcmRvdmFTUUxpdGUnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd1cGRhdGVTeW5jU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnJHRpbWVvdXQnLFxuICAvLyAnb25saW5lU3RhdHVzU2VydmljZScsXG4gIGZ1bmN0aW9uICgkcSwgJGNvcmRvdmFEZXZpY2UsICRjb3Jkb3ZhU1FMaXRlLCBvZmZsaW5lU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdXBkYXRlU3luY1NlcnZpY2UsIHRvYXN0U2VydmljZSwgJHRpbWVvdXQpIHtcbiAgICB2YXIgenVtZXJvID0gbnVsbDtcbiAgICB2YXIgenVtZXJvU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX3NldERiUGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfb3B0aW9ucyA9IHtcbiAgICAgICAgQW5kcm9pZDogJy9kYXRhL2RhdGEvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnBhY2thZ2VOYW1lICsgJy9kYXRhYmFzZXMvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLFxuICAgICAgICBpT1M6ICdjZHZmaWxlOi8vbG9jYWxob3N0L3BlcnNpc3RlbnQvJyArIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLFxuICAgICAgICB3aW4zMm50OiAnLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZVxuICAgICAgfTtcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRicGF0aCA9IF9vcHRpb25zWyRjb3Jkb3ZhRGV2aWNlLmdldFBsYXRmb3JtKCldO1xuICAgIH07XG4gICAgdmFyIF9zZXRadW1lcm8gPSBmdW5jdGlvbiAoZGJmaWxlKSB7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUgPSBkYmZpbGU7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSA9IHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZSArICcuZGInO1xuICAgICAgLy9vcGVuIGRiIGNvbiBzcWxpdGVwbHVnaW4gYnJvZHlcbiAgICAgIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZUNvbXBsZXRlLCAxKTtcbiAgICAgIHp1bWVybyA9IGNvcmRvdmEucmVxdWlyZSgnY29yZG92YS9wbHVnaW4venVtZXJvJyk7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXJ2ZXIgPSAnaHR0cDovLzE5MC4xNDUuMzkuMTM4OjgwODAvJztcbiAgICAgIC8vJ2h0dHA6Ly8xOTIuMTY4LjAuNTE6ODA4MC8nO1xuICAgICAgLy8gVE9ETzogREVQRU5ERSBTSSBFU1RPWSBFTiBNSSBDQVNBIE8gRU4gTEEgT0ZJQ0lOQSdodHRwOi8vMTkyLjE2OC4xLjEzOjgwODAvJztcbiAgICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnBhY2thZ2VOYW1lID0gJ2NvbS5hanVzdGV2LmInO1xuICAgICAgX3NldERiUGF0aCgpO1xuICAgIH07XG4gICAgLy8gVE9ETzogIHJlY29yZGFyIGsgZXN0byBlcyB1bmEgcHJvbWVzYSB5IGRlc2VuY2FkZW5hIGFjY2lvbmVzLCBzaSBlcyByZXN1ZWx0YSBvIHNpIGVzIHJlamVjdCAsIHZhbGxpZGFyXG4gICAgdmFyIF96eW5jID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIC8vIFRPRE86IGFicmlyaSBlbCBwdWVydG8gcGFyYSB6dW1lcm8gZW4gZWwgZmlyZXdhbGxcbiAgICAgIC8vIFRPRE86IGNyZWFyIHVuYSBzZXJ2aWNpbyBnbG9iYWwgcGFyYSBkZSBhaGkgc2FjYXIgZWwgaWRpbnNwZWNjaW9uIGFjdHVhbCwgaW5jdXNpdmUgZGVzcHVlcyBkZSB1biB6eW5jIHBhcmEgc2FiZXIgcXVlIGVzIGVsIGFkZWN1YWRvXG4gICAgICB2YXIgcSA9ICRxLmRlZmVyKCk7XG4gICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAvLyB8fCAhb25saW5lU3RhdHVzU2VydmljZS5kYXRhLmlzT25saW5lKSB7XG4gICAgICAgIC8vIFRPRE86IG1lIHBhcmVjZSBtYXMgbG9naWNvIHJldG9ybmFyIHVuIHJlamVjdCBzaSBlc3RhIGVuIG1vZG8gb2ZmbGluZVxuICAgICAgICBxLnJlamVjdCgnb2ZmbGluZU1vZGUgbyBzaW4gY29uZXhpb24nKTtcbiAgICAgICAgY29uc29sZS5sb2coJ29mZmxpbmUgbW9kZSBhY3RpdmFkbycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS50aW1lKCd6eW5jJyArIGkpO1xuICAgICAgICB2YXIgdGltZXIgPSAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnc2luY3Jvbml6YW5kby4uJyk7XG4gICAgICAgIH0sIDI1MDApO1xuICAgICAgICB6dW1lcm8uc3luYyh6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYnBhdGgsICcnLCB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5zZXJ2ZXIsIHp1bWVyb1NlcnZpY2VGYWN0b3J5LmRiZmlsZSwgbnVsbCwgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvaycpO1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnenluYycgKyBpKTtcbiAgICAgICAgICBpZiAoIWludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb25TeW5jICYmIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICAgIC8vIHVwZGF0ZVN5bmNTZXJ2aWNlLnVwZGF0ZVN5bmMoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCB0cnVlKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVwZGF0ZVN5bmNTZXJ2aWNlLnNlbGVjdElkaW5zcGVjY2lvblN5bmMoaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcS5yZXNvbHZlKCd6eW5jIG9rJyk7XG4gICAgICAgICAgICB9KTsgIC8vIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZXIpO1xuICAgICAgICAgICAgcS5yZXNvbHZlKCd6eW5jIG9rJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3p5bmMnICsgaSk7XG4gICAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09IDQ1Nikge1xuICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH07XG4gICAgenVtZXJvU2VydmljZUZhY3Rvcnkuc2V0WnVtZXJvID0gX3NldFp1bWVybztcbiAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS56eW5jID0gX3p5bmM7XG4gICAgcmV0dXJuIHp1bWVyb1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=