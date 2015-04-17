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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiY29udHJvbGxlcnMvQWNjZXNvcmlvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9Gb3RvQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0luc3BlY2Npb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvTWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9QbGFjYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvVGVzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9WaWRlb0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9hY2Nlc29yaW9zU2VydmljZS5qcyIsInNlcnZpY2VzL2F1dGhJbnRlcmNlcHRvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9hdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL2NoZWNrRmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3B5RmlsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9jb3Jkb3ZhRXZlbnRzU2VydmljZS5qcyIsInNlcnZpY2VzL2NyZWF0ZURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9kZXZpY2VTZXJ2aWNlLmpzIiwic2VydmljZXMvZWFzeURpclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9lcnJvclNlcnZpY2UuanMiLCJzZXJ2aWNlcy9maWxlVHJhbnNmZXJTZXJ2aWNlLmpzIiwic2VydmljZXMvZmlyc3RJbml0U2VydmljZS5qcyIsInNlcnZpY2VzL2ZvY3VzU2VydmljZS5qcyIsInNlcnZpY2VzL2ZvdG9zU2VydmljZS5qcyIsInNlcnZpY2VzL2dldFZpZGVvU2VydmljZS5qcyIsInNlcnZpY2VzL2dwc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9pbnNwZWNjaW9uU2VydmljZS5qcyIsInNlcnZpY2VzL2ludGVybWVkaWF0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9tb21lbnRTZXJ2aWNlLmpzIiwic2VydmljZXMvb2ZmbGluZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9vbmxpbmVTdGF0dXNTZXJ2aWNlLmpzIiwic2VydmljZXMvcGxhY2FzU2VydmljZS5qcyIsInNlcnZpY2VzL3NxbGl0ZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90aXRsZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy90b2FzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy91bnN5bmNTZXJ2aWNlLmpzIiwic2VydmljZXMvdXBkYXRlU3luY1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1NlcnZpY2UuanMiLCJzZXJ2aWNlcy92aWRlb1RodW1ibmFpbFNlcnZpY2UuanMiLCJzZXJ2aWNlcy96dW1lcm9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuLy8gdmFyIGxzID0gbnVsbDtcbi8vIHZhciB6dW1lcm8gPSBudWxsO1xuLy8gdmFyIGNzID0gbnVsbDtcbi8vIHZhciB6cyA9IG51bGw7XG4vLyB2YXIgcHMgPSBudWxsO1xuLy8gdmFyIHBjID0gbnVsbDtcbi8vIHZhciBjZiA9IG51bGw7XG4vLyB2YXIgZWQgPSBudWxsO1xuLy8gdmFyIGNjID0gbnVsbDtcbnZhciBkYiA9IG51bGw7XG52YXIgc2VydmljZXMgPSB7fTtcbnZhciBuZ0NvcmRvdmEgPSB7fTtcbnZhciBhbHJlYWR5SW5zcGVjdCA9IGZhbHNlO1xudmFyIHJwID0gbnVsbDtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFtcbiAgJ2lvbmljJyxcbiAgJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLFxuICAnbmdTdG9yYWdlJyxcbiAgJ25nQ29yZG92YScsXG4gICd1aS51dGlscycsXG4gICduZ0Z4JyxcbiAgJ25nQW5pbWF0ZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZSdcbl0pLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJyk7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhcHAnLCB7XG4gICAgdXJsOiAnL2FwcCcsXG4gICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbWVudS5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQXBwQ3RybCdcbiAgfSkuc3RhdGUoJ2FwcC5zZWFyY2gnLCB7XG4gICAgdXJsOiAnL3NlYXJjaCcsXG4gICAgdmlld3M6IHsgJ21lbnVDb250ZW50JzogeyB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9zZWFyY2guaHRtbCcgfSB9XG4gIH0pLnN0YXRlKCdhcHAuYnJvd3NlJywge1xuICAgIHVybDogJy9icm93c2UnLFxuICAgIHZpZXdzOiB7ICdtZW51Q29udGVudCc6IHsgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYnJvd3NlLmh0bWwnIH0gfVxuICB9KS5zdGF0ZSgnYXBwLnBsYXlsaXN0cycsIHtcbiAgICB1cmw6ICcvcGxheWxpc3RzJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9wbGF5bGlzdHMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5bGlzdHNDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5wbGFjYXMnLCB7XG4gICAgdXJsOiAnL3BsYWNhcycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcGxhY2FzLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxhY2FzQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAuc2luZ2xlJywge1xuICAgIHVybDogJy9wbGF5bGlzdHMvOnBsYXlsaXN0SWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3BsYXlsaXN0Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnUGxheWxpc3RDdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5mb3RvJywge1xuICAgIHVybDogJy9mb3Rvcy86aWQnLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2ZvdG8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGb3RvQ3RybCdcbiAgICAgIH1cbiAgICB9XG4gIH0pLnN0YXRlKCdhcHAudmlkZW8nLCB7XG4gICAgdXJsOiAnL3ZpZGVvLzppZCcsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdmlkZW8uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdWaWRlb0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgdXJsOiAnL2luc3BlY2Npb24vOmlkLzpwbGFjYS86Y2FsaWZpY2FkbycsXG4gICAgdmlld3M6IHtcbiAgICAgICdtZW51Q29udGVudCc6IHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaW5zcGVjY2lvbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0luc3BlY2Npb25DdHJsJ1xuICAgICAgfVxuICAgIH1cbiAgfSkuc3RhdGUoJ2FwcC5sb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHZpZXdzOiB7XG4gICAgICAnbWVudUNvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xvZ2luSW9uaWMuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInXG4gICAgICB9XG4gICAgfVxuICB9KS5zdGF0ZSgnYXBwLmFjY2Vzb3Jpb3MnLCB7XG4gICAgdXJsOiAnL2FjY2Vzb3Jpb3MvOmlkJyxcbiAgICB2aWV3czoge1xuICAgICAgJ21lbnVDb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY2Nlc29yaW9zLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWNjZXNvcmlvc0N0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9wbGFjYXMnKTtcbiAgLy8gVE9ETzogcGFyYSBxdWUgc2UgY29uc2lkZXJlbiBzYW5hcyBsYXMgbmctc3JjIHF1ZSB0ZW5nYW4gZXN0YSBzaW50YXhpcztcbiAgJGNvbXBpbGVQcm92aWRlci5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoL15cXHMqKGh0dHBzP3xmaWxlfGJsb2J8Y2R2ZmlsZXxjb250ZW50KTp8ZGF0YTppbWFnZVxcLy8pO1xuICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQodHJ1ZSk7XG59KTtcbnZhciBzZXJ2aWNlQmFzZSA9ICdodHRwOi8vMTkwLjE0NS4zOS4xMzgvYXV0aC8nO1xuYXBwLmNvbnN0YW50KCduZ0F1dGhTZXR0aW5ncycsIHtcbiAgYXBpU2VydmljZUJhc2VVcmk6IHNlcnZpY2VCYXNlLFxuICBjbGllbnRJZDogJ25nQXV0aEFwcCdcbn0pLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQsICRpb25pY1BsYXRmb3JtLCAkbG9jYWxTdG9yYWdlLCAkY29yZG92YVNRTGl0ZSwgY2hlY2tGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCAkY29yZG92YUNhbWVyYSwgZmlsZVRyYW5zZmVyU2VydmljZSwgenVtZXJvU2VydmljZSwgJGNvcmRvdmFGaWxlLCBlYXN5RGlyU2VydmljZSwgZ2V0VmlkZW9TZXJ2aWNlLCBjb3B5RmlsZVNlcnZpY2UsIGFjY2Vzb3Jpb3NTZXJ2aWNlLCBpbnNwZWNjaW9uU2VydmljZSwgcGxhY2FzU2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgY29yZG92YUV2ZW50c1NlcnZpY2UsIHRvYXN0U2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGZpcnN0SW5pdFNlcnZpY2UsIGF1dGhTZXJ2aWNlLCBkZXZpY2VTZXJ2aWNlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkc3RhdGUsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVuc3luY1NlcnZpY2UsIGZvdG9zU2VydmljZSwgZ3BzU2VydmljZSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICB9XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICBjb25zb2xlLmxvZyhldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyk7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmICh0b1N0YXRlLm5hbWUgPT09ICdhcHAubG9naW4nKSB7XG4gICAgICAgIC8vIGRvZSBzaGUvaGUgdHJ5IHRvIGdvIHRvIGxvZ2luPyAtIGxldCBoaW0vaGVyIGdvXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYXV0aERhdGEgfHwgbW9tZW50U2VydmljZS5kaWZmTm93KGF1dGhEYXRhLmV4cCwgJ20nKSA+IC02MCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlZGlyZWN0Jyk7XG4gICAgICAgICAgLy9XYXMgY2FsbGluZyB0aGlzIGJ1dCBjb21tZW50aW5nIG91dCB0byBrZWVwIGl0IHNpbXBsZTogYXV0aFNlcnZpY2UucmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgLy9DaGFuZ2VzIFVSTCBidXQgbm90IHRoZSB2aWV3IC0gZ29lcyB0byBvcmlnaW5hbCB2aWV3IHRoYXQgSSdtIHRyeWluZyB0byByZWRpcmVjdFxuICAgICAgICAgIC8vYXdheSBmcm9tIG5vdyB3aXRoIDEuMy4gRmluZSB3aXRoIGl0IGJ1dCBpbnRlcmVzdGVkIGluIHVuZGVyc3RhbmRpbmcgdGhlIFxuICAgICAgICAgIC8vXCJwcm9wZXJcIiB3YXkgdG8gZG8gaXQgbm93IHNvIGxvZ2luIHZpZXcgZ2V0cyByZWRpcmVjdGVkIHRvLlxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7ICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vTmljZSBhZGRpdGlvbiEgQ2FuJ3QgZG8gYW55IHJlZGlyZWN0IHdoZW4gaXQncyBjYWxsZWQgdGhvdWdoXG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGxzID0gJGxvY2FsU3RvcmFnZTtcbiAgICAvLyB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2UgPSB6dW1lcm9TZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmdldFZpZGVvU2VydmljZSA9IGdldFZpZGVvU2VydmljZTtcbiAgICBzZXJ2aWNlcy5jb3B5RmlsZVNlcnZpY2UgPSBjb3B5RmlsZVNlcnZpY2U7XG4gICAgc2VydmljZXMuZmlsZVRyYW5zZmVyU2VydmljZSA9IGZpbGVUcmFuc2ZlclNlcnZpY2U7XG4gICAgc2VydmljZXMudmlkZW9UaHVtYm5haWxTZXJ2aWNlID0gdmlkZW9UaHVtYm5haWxTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmVhc3lEaXJTZXJ2aWNlID0gZWFzeURpclNlcnZpY2U7XG4gICAgc2VydmljZXMuY2hlY2tGaWxlU2VydmljZSA9IGNoZWNrRmlsZVNlcnZpY2U7XG4gICAgc2VydmljZXMuYWNjZXNvcmlvc1NlcnZpY2UgPSBhY2Nlc29yaW9zU2VydmljZTtcbiAgICBzZXJ2aWNlcy5pbnNwZWNjaW9uU2VydmljZSA9IGluc3BlY2Npb25TZXJ2aWNlO1xuICAgIHNlcnZpY2VzLnVuc3luY1NlcnZpY2UgPSB1bnN5bmNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLm9ubGluZVN0YXR1c1NlcnZpY2UgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmNvcmRvdmFFdmVudHNTZXJ2aWNlID0gY29yZG92YUV2ZW50c1NlcnZpY2U7XG4gICAgc2VydmljZXMudG9hc3RTZXJ2aWNlID0gdG9hc3RTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLm9mZmxpbmVTZXJ2aWNlID0gb2ZmbGluZVNlcnZpY2U7XG4gICAgc2VydmljZXMubG9jYWxTdG9yYWdlID0gJGxvY2FsU3RvcmFnZTtcbiAgICBzZXJ2aWNlcy5maXJzdEluaXRTZXJ2aWNlID0gZmlyc3RJbml0U2VydmljZTtcbiAgICBzZXJ2aWNlcy5tb21lbnRTZXJ2aWNlID0gbW9tZW50U2VydmljZTtcbiAgICBzZXJ2aWNlcy5hdXRoU2VydmljZSA9IGF1dGhTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmRldmljZVNlcnZpY2UgPSBkZXZpY2VTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmludGVybWVkaWF0ZVNlcnZpY2UgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlO1xuICAgIHNlcnZpY2VzLmZvdG9zU2VydmljZSA9IGZvdG9zU2VydmljZTtcbiAgICBzZXJ2aWNlcy5ncHNTZXJ2aWNlID0gZ3BzU2VydmljZTtcbiAgICBuZ0NvcmRvdmEuY29yZG92YVNRTGl0ZSA9ICRjb3Jkb3ZhU1FMaXRlO1xuICAgIG5nQ29yZG92YS5jb3Jkb3ZhRmlsZSA9ICRjb3Jkb3ZhRmlsZTtcbiAgICBuZ0NvcmRvdmEuY29yZG92YUNhbWVyYSA9ICRjb3Jkb3ZhQ2FtZXJhO1xuICAgIC8vIHpzID0genVtZXJvU2VydmljZTtcbiAgICAvLyBjcyA9IDtcbiAgICAvLyBjZiA9IDtcbiAgICAvLyBlZCA9IGVhc3lEaXJTZXJ2aWNlO1xuICAgIC8vIGRiID0gJGNvcmRvdmFTUUxpdGUub3BlbkRCKCd6ZGJmaWxlLmRiJywgMSk7XG4gICAgLy8gY2MgPSAkY29yZG92YUNhbWVyYTtcbiAgICAvLyBjYyA9IGdldFZpZGVvU2VydmljZTtcbiAgICAvLyBzZXJ2aWNlcy56dW1lcm9TZXJ2aWNlLnNldFp1bWVybygnemRiZmlsZScpO1xuICAgIHNlcnZpY2VzLnp1bWVyb1NlcnZpY2Uuc2V0WnVtZXJvKCd6dW1lcm90ZXN0ZGJmaWxlJyk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5vbk9ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2Uub25PZmZsaW5lKCk7XG4gICAgb25saW5lU3RhdHVzU2VydmljZS5pc09ubGluZSgpO1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2UuY29ublR5cGUoKTtcbiAgICBjb3Jkb3ZhRXZlbnRzU2VydmljZS5vblBhdXNlKCk7XG4gICAgY29yZG92YUV2ZW50c1NlcnZpY2Uub25SZXN1bWUoKTtcbiAgICBkZXZpY2VTZXJ2aWNlLnNldEluZm8oKTtcbiAgICAvLyBUT0RPOiAgdmVyaWZpY2FyIHNpIGV4aXN0ZSBlbiBlbCBsb2NhbHN0b3JhZ2UgYWxndW5hIGJhbmRlcmEgcXVlIGRpZ2Egc2kgeWEgc2Ugc3luYyBhbGd1bmEgdmV6IFxuICAgICRsb2NhbFN0b3JhZ2UubWVzc2FnZSA9ICdIZWxsbyBXb3JsZCc7XG4gICAgYXV0aFNlcnZpY2UuZmlsbEF1dGhEYXRhKCk7ICAvLyB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICghYXV0aERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbiB0ZXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICB9KTtcbn0pOyAgLy8gYXBwLnJ1bihbXG4gICAgIC8vICAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAgICAvLyAgICckbG9jYXRpb24nLFxuICAgICAvLyAgIGZ1bmN0aW9uIChsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgICAgLy8gICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAvLyAgICAgaWYgKCFhdXRoRGF0YSkge1xuICAgICAvLyAgICAgICBjb25zb2xlLmxvZygndG9rZW4gcmVkaXJlY3QgbG9naW4nKTtcbiAgICAgLy8gICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgLy8gICAgICAgLy8gVE9ETzogZXN0byBubyBlcyBuZWNlc2FyaW8sIHBvciBxdWUgYWwgaW50ZW50YXIgc2luY3Jvbml6YXIgdW5hIGltYWdlbiB5IGVsIHRva2VuIGVzdGEgdmVuY2lkbywgc2UgcmVkaXJlY2Npb25hIGEgbG9naW4gYXV0b21hdGljYW1lbnRlXG4gICAgIC8vICAgICAgIHZhciBuID0gbW9tZW50KCk7XG4gICAgIC8vICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgIC8vICAgICAgIGNvbnNvbGUubG9nKG4uZGlmZihlLCAnc2Vjb25kcycpKTtcbiAgICAgLy8gICAgICAgaWYgKG4uZGlmZihlLCAnc2Vjb25kcycpID4gMCkge1xuICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBsb2dpbicpO1xuICAgICAvLyAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAgLy8gICAgICAgfVxuICAgICAvLyAgICAgfVxuICAgICAvLyAgIH1cbiAgICAgLy8gXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycsIFtdKS5jb250cm9sbGVyKCdBcHBDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljTW9kYWwsICR0aW1lb3V0KSB7XG4gIC8vIEZvcm0gZGF0YSBmb3IgdGhlIGxvZ2luIG1vZGFsXG4gICRzY29wZS5sb2dpbkRhdGEgPSB7fTtcbiAgLy8gQ3JlYXRlIHRoZSBsb2dpbiBtb2RhbCB0aGF0IHdlIHdpbGwgdXNlIGxhdGVyXG4gICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL2xvZ2luLmh0bWwnLCB7IHNjb3BlOiAkc2NvcGUgfSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcbiAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgfSk7XG4gIC8vIFRyaWdnZXJlZCBpbiB0aGUgbG9naW4gbW9kYWwgdG8gY2xvc2UgaXRcbiAgJHNjb3BlLmNsb3NlTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgfTtcbiAgLy8gT3BlbiB0aGUgbG9naW4gbW9kYWxcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gIH07XG4gIC8vIFBlcmZvcm0gdGhlIGxvZ2luIGFjdGlvbiB3aGVuIHRoZSB1c2VyIHN1Ym1pdHMgdGhlIGxvZ2luIGZvcm1cbiAgJHNjb3BlLmRvTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ0RvaW5nIGxvZ2luJywgJHNjb3BlLmxvZ2luRGF0YSk7XG4gICAgLy8gU2ltdWxhdGUgYSBsb2dpbiBkZWxheS4gUmVtb3ZlIHRoaXMgYW5kIHJlcGxhY2Ugd2l0aCB5b3VyIGxvZ2luXG4gICAgLy8gY29kZSBpZiB1c2luZyBhIGxvZ2luIHN5c3RlbVxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5jbG9zZUxvZ2luKCk7XG4gICAgfSwgMTAwMCk7XG4gIH07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdHNDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xuICAkc2NvcGUucGxheWxpc3RzID0gW1xuICAgIHtcbiAgICAgIHRpdGxlOiAnUmVnZ2FlJyxcbiAgICAgIGlkOiAxXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NoaWxsJyxcbiAgICAgIGlkOiAyXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0R1YnN0ZXAnLFxuICAgICAgaWQ6IDNcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnSW5kaWUnLFxuICAgICAgaWQ6IDRcbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnUmFwJyxcbiAgICAgIGlkOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0Nvd2JlbGwnLFxuICAgICAgaWQ6IDZcbiAgICB9XG4gIF07XG59KS5jb250cm9sbGVyKCdQbGF5bGlzdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdBY2Nlc29yaW9zQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJ3BsYWNhc1NlcnZpY2UnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnJGxvY2F0aW9uJyxcbiAgJyRpb25pY1BvcHVwJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZvY3VzJyxcbiAgJyRzdGF0ZScsXG4gICckaW9uaWNTaWRlTWVudURlbGVnYXRlJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNNb2RhbCcsXG4gICdhY2Nlc29yaW9zU2VydmljZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ2Vycm9yU2VydmljZScsXG4gICdjaGVja0ZpbGVTZXJ2aWNlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHNjb3BlLCB6dW1lcm9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgcGxhY2FzU2VydmljZSwgJGlvbmljTmF2QmFyRGVsZWdhdGUsICRsb2NhdGlvbiwgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCBmb2N1cywgJHN0YXRlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCBhY2Nlc29yaW9zU2VydmljZSwgZm90b3NTZXJ2aWNlLCBjb3B5RmlsZVNlcnZpY2UsIGVycm9yU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgenVtZXJvU2VydmljZSwgbW9tZW50U2VydmljZSkge1xuICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLmlkaW5zcGVjY2lvbiA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb247XG4gICAgICAvL3BhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAkc2NvcGUudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy9cbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL29wZW5OZXdBY2Nlc29yaW8uaHRtbCcsIHsgc2NvcGU6ICRzY29wZSB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICAgIH0pO1xuICAgICAgJHNjb3BlLmFjY2VzID0gW107XG4gICAgICAkc2NvcGUuc2V0SXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2NlcyA9IGFjY2Vzb3Jpb3NTZXJ2aWNlLmFsbDtcbiAgICAgIH07XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0IGl0ZW1zIGVuICBlbCBjb250cm9sbGVyJyk7XG4gICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgfSk7XG4gICAgICBhY2Nlc29yaW9zU2VydmljZS5pbml0T3B0aW9ucygpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWVsdGFzIGxhcyAzIHByb21lc2FzIGVuIGVsIGNvbnRyb2xhZG9yJyk7XG4gICAgICAgICRzY29wZS5vcHRpb25zID0gYWNjZXNvcmlvc1NlcnZpY2UuaW5pdERhdGE7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5pbml0YWNjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYWNjID0gYWNjZXNvcmlvc1NlcnZpY2UuaW5pdEFjYygpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5zaG93TW9kYWxOZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5pbml0YWNjKCk7XG4gICAgICAgICRzY29wZS5tb2RzaG93ID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5zZXRJdGVtcygpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYyg0KTtcbiAgICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgICAgICB9KTsgIC8vICRzY29wZS5hY2Nlcy5wdXNoKCRzY29wZS5hY2MpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5tb2RhbC5oaWRlKCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdldFBpY0ZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLnBhdGggPSAnaHR0cDovL2kuZGFpbHltYWlsLmNvLnVrL2kvcGl4LzIwMTQvMDMvMjMvYXJ0aWNsZS0yNTg3NDU0LTFDODY0OTkxMDAwMDA1NzgtNDM4XzYzNHg0MzAuanBnJztcbiAgICAgIH07XG4gICAgICAkc2NvcGUubW9kID0gZnVuY3Rpb24gKGFjYykge1xuICAgICAgICAkc2NvcGUubW9kc2hvdyA9IHRydWU7XG4gICAgICAgICRzY29wZS5hY2MgPSBhY2M7XG4gICAgICAgICRzY29wZS5tb2RhbC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmNsb3NlQWN0TW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IEFRVUkgVEVORFJJQSBRVUUgSEFDRVIgRUwgVVBEQVRFIFxuICAgICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgIHZhciBpbnNlcnRGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UuaW5zZXJ0Rm90bygkc2NvcGUuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMSwgZmFsc2UpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKCRzY29wZS5pZGluc3BlY2Npb24sIGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSB1cGRhdGUgc3FsaXRlIGZvdG8gJyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHZhciB1cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgICAgJHNjb3BlLmFjYy5pbWcuc3luYyA9IHN5bmM7XG4gICAgICAgICRzY29wZS5hY2MuaW1nLm9uVXBsb2FkID0gb25VcGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9uVXBsb2FkKTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gZmFsc2U7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIGZvdG8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKGZvdG8pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQaWNGaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdQaWMgPSB0cnVlO1xuICAgICAgICBmb3Rvc1NlcnZpY2UudGFrZWRwaWMoKS50aGVuKGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgICB2YXIgc3luYyA9IDA7XG4gICAgICAgICAgICB2YXIgb25VcGxvYWQgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcuc3luYyA9IHN5bmM7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5vblVwbG9hZCA9IG9uVXBsb2FkO1xuICAgICAgICAgICAgJHNjb3BlLmFjYy5pbWcucGF0aCA9IHJlcy5uYXRpdmVVUkw7XG4gICAgICAgICAgICAkc2NvcGUuYWNjLmltZy5ydXRhU3J2ID0gbW9tZW50U2VydmljZS5ydXRhU3J2KHJlcy5uYXRpdmVVUkwpO1xuICAgICAgICAgICAgaW5zZXJ0Rm90byhyZXMubmF0aXZlVVJMLCBzeW5jLCBvblVwbG9hZCk7XG4gICAgICAgICAgICBwcmVGaWxlVXBsb2FkKCRzY29wZS5hY2MuaW1nKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZm5FcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdGb3RvQ3RybCcsIFtcbiAgJyRzY29wZScsXG4gICdmb3Rvc1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZmlsZVRyYW5zZmVyU2VydmljZScsXG4gICckZmlsdGVyJyxcbiAgJyRzdGF0ZVBhcmFtcycsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICdjb3B5RmlsZVNlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICBmdW5jdGlvbiAocywgZm90b3NTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgY2hlY2tGaWxlU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBvZmZsaW5lU2VydmljZSwgZXJyb3JTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHp1bWVyb1NlcnZpY2UsIG1vbWVudFNlcnZpY2UsIGdwc1NlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzLnRpdHRsZSA9ICcnO1xuICAgICAgcy50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgICBzLmltZ1Vuc3luYyA9IFtdO1xuICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAvLyRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHRpdGxlU2VydmljZS50aXRsZSA9IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYTtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAgIC8vICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgIHMub2ZmID0gb2ZmbGluZVNlcnZpY2UuZGF0YTtcbiAgICAgIC8vIFRPRE86IEVTVEEgRVNUUkFURUdJQSBGVU5DSU9OQSBCSUVOIFBBUkEgVkVSIEVMIENBTUJJTyBJTk1FRElBVEFNRU5URVxuICAgICAgLy8gcy5vbmxpbmVTdGF0dXMgPSBvbmxpbmVTdGF0dXNTZXJ2aWNlO1xuICAgICAgLy8gVE9ETzogRVNUQSBFU1RSQVRFR0lBIFJFUVVJRVJFIE9UUk8gRElHRVNUIFBBUkEgUVVFIEZVTkNJT05FXG4gICAgICAvLyBzLm9zcyA9IHsgb25saW5lOiBvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lIH07XG4gICAgICAvLyBUT0RPOiBFU1RBIEVTVFJBVEVHSUEgRlVOQ0lPTkEgQklFTiBQQVJBIFZFUiBFTCBDQU1CSU8gSU5NRURJQVRBTUVOVEUgIEVTIE1FSk9SIFJBU1RSRUFSIFNJRU1QUkUgVU4gT0JKRVRPXG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIC8vICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAvLyBUT0RPOiBvbmhvbGQgY2FuIGVkaXQgcGxhY2EsIG9uIHN3aXBlIGxlZnQgZGVsZXRlIHdpdGggY29uZmlybVxuICAgICAgLy8gVE9ETzogYWx3YXlzIHVzZSBpb24tbmF2LXRpdGxlICwgcGFyYSBwb2RlcmxlIHBvbmVyIGxvcyB0aXR1bG9zIHF1ZSBxdWllcm9cbiAgICAgIC8vIHMub3NzID0geyBvbmxpbmU6IG9ubGluZVN0YXR1c1NlcnZpY2UuaXNPbmxpbmUgfTtcbiAgICAgIHMucGhvdG9zID0gZm90b3NTZXJ2aWNlLnBob3RvcztcbiAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICBzLmdldFBob3RvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm90b3NTZXJ2aWNlLmdldFBob3RvcyhzLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcy5waG90b3MgPSBmb3Rvc1NlcnZpY2UucGhvdG9zO1xuICAgICAgICAgIHMubmFtZXMgPSBmb3Rvc1NlcnZpY2UubmFtZXM7XG4gICAgICAgICAgX2ZpbHRlclVuc3luYygwKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIHMuJG9uKCdteUV2ZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXkgZXZlbnQgb2NjdXJyZWQnKTtcbiAgICAgICAgcy5nZXRQaG90b3MoKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIF9maWx0ZXJVbnN5bmMgPSBmdW5jdGlvbiAoZXF1YWwpIHtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykocy5waG90b3MsIHsgc3luYzogZXF1YWwgfSwgdHJ1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHMucGhvdG9zLCBmb3VuZCk7XG4gICAgICAgIHMuaW1nVW5zeW5jID0gZm91bmQ7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgICAgIGZvdG9zU2VydmljZS51cGRhdGVGb3RvKHMuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICAgIGlmIChzLm1hc3NpdmVVcGxvYWQpIHtcbiAgICAgICAgICAgIHMubWFzc2l2ZUxlbmd0aCA9IHMubWFzc2l2ZUxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocy5tYXNzaXZlTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzLm1hc3NpdmVMZW5ndGgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIF9maWx0ZXJVbnN5bmMoMCk7XG4gICAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gZmFsc2U7XG4gICAgICAgICAgY29uc29sZS5sb2cocy5tYXNzaXZlTGVuZ3RoLCAnc3luYycpO1xuICAgICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIHVwZGF0ZUZvdG8oaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgLy9UT0RPIDogQ1VBTkRPIEVTIFVOQSBTT0xBIEVTVEEgQklFTiwgQ1VFTkFPRCBFUyBVTiBBUlJBWSBERUJPIERFIEhBQ0VSIFFVRSBTWU5DIENPTiBMQSBVTFRJTUEgRk9UTyBVTiAuTEVOVEhHIFBVRURFIFNFUlxuICAgICAgICAvLyB6dW1lcm9TZXJ2aWNlLnp5bmMoMik7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1BpYyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIHZhciBpbnNlcnRGb3RvID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICBmb3Rvc1NlcnZpY2UuaW5zZXJ0Rm90byhzLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlciBkZXNwdWVzIGRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgcmVmcmVzaFByb2dyZXNzID0gZnVuY3Rpb24gKGltYWdlVVJJLCBwZXJjZW50YWdlKSB7XG4gICAgICAgIHZhciBvYmpGb3RvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9iakZvdG8ucHJvZ3Jlc3MgPSBwZXJjZW50YWdlO1xuICAgICAgfTtcbiAgICAgIHZhciBwcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBpZiAob2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSkge1xuICAgICAgICAgIC8vIFRPRE86IHlhIG5vZSBzIG5lY2VzYXJpbyBwb3IgcXVlIG9mZmxpbmUgdGFtYmllbiBlc3RhIGVuIG9ubGlsbmVzdGF0dXNzcmVydmljZVxuICAgICAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICAgICAgdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAxLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgMCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gNCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdG9hc3RTZXJ2aWNlLnNob3dTaG9ydEJvdHRvbSgnYWN0aXZhZG8gbW9kbyBvZmZsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqZWN0Rm90byA9IGZ1bmN0aW9uIChwbGFjYSwgcGF0aCwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICAvLyBUT0RPOiBIQUJSQSBPVFJBIEZPUk1BIERFIEZJTFRBUiBNQVMgUkFQSURBIEsgRUwgU1RSSU5HIFBBVEg7XG4gICAgICAgIHZhciBmb3VuZCA9ICRmaWx0ZXIoJ2ZpbHRlcicpKHMucGhvdG9zLCB7IHBhdGg6IHNyY0ltZyB9LCB0cnVlKTtcbiAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBmb3VuZFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm90IGZvdW5kIGluIGFycmF5IHNlYXJjaCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcy50cnlVcGxvYWQgPSBmdW5jdGlvbiAoZm90bykge1xuICAgICAgICB2YXIgb2JqRm90byA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqRm90by5vblVwbG9hZCA9IHRydWU7XG4gICAgICAgIHByZUZpbGVVcGxvYWQob2JqRm90byk7XG4gICAgICB9O1xuICAgICAgLy8gcy5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgICAvLyAgIHMub2ZmLm9mZmxpbmVNb2RlID0gYm9vbDtcbiAgICAgIC8vICAgaWYgKGJvb2wpIHtcbiAgICAgIC8vICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnT2ZmbGluZSBNb2RlJyk7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfTtcbiAgICAgIHMuc3luY0ltZ1Vuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcy5tYXNzaXZlVXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgcy5tYXNzaXZlTGVuZ3RoID0gcy5pbWdVbnN5bmMubGVuZ3RoO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gocy5pbWdVbnN5bmMsIGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgICAgICAgIHMudHJ5VXBsb2FkKG9iaik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuc2V0bmFtZSA9IGZ1bmN0aW9uIChpZHRpcG8sIGZvdG8pIHtcbiAgICAgICAgLy9iZXRhZG9wYXJhcHJ1ZWJhc2NvbnNvbGUubG9nKG5vbWJyZSwgZm90byk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkdGlwbywgZm90byk7XG4gICAgICAgIGZvdG9zU2VydmljZS5zZXROYW1lKGlkdGlwbywgZm90bykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHMuZ2V0UGljRmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljID0gdHJ1ZTtcbiAgICAgICAgZm90b3NTZXJ2aWNlLnRha2VkcGljKCkudGhlbihmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgICAvLyBUT0RPOiBwYXJhIGxhcyB0YWJsZXRzIGFwYWdvIGVsIGdwcywgeSBhbGdvIHBhc2EgY29uIGxhIGNhbWFyYVxuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZVVSSSk7XG4gICAgICAgICAgLy8gZm90b3NTZXJ2aWNlLmNvcHlGaWxlKGltYWdlVVJJKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAvLyBjb3B5RmlsZVNlcnZpY2UuY29weUZpbGUoaW1hZ2VVUkkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShpbWFnZVVSSSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5LCBjaGVja0ZpbGVTZXJ2aWNlLmZpbGUpO1xuICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgICAgICAgdmFyIG9udXBsb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGjCv2d1YXJkYXIgYXF1aSBlbCBzcWxpdGUgeSBsdWVnbyBhY3R1YWxpemFybG8gc2kgc3ViZSBleGl0b3NvO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9iamVjdEZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBzeW5jLCBvbnVwbG9hZCk7XG4gICAgICAgICAgICBzLnBob3Rvcy5wdXNoKG9iaik7XG4gICAgICAgICAgICBpbnNlcnRGb3RvKHJlcy5uYXRpdmVVUkwsIHN5bmMsIG9udXBsb2FkKTtcbiAgICAgICAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbWFpblNjcm9sbCcpLnNjcm9sbEJvdHRvbSh0cnVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IGVzIG1lam9yIGxsYW1hciBhIHVuYSBmdW5jaW9uLCBwb3IgcXVlIGFzaSBzZSBlamVjdXRhIHBhcmEgY2FkYSB1bm8sIHkgc2UgZWplY3V0YSBiaWVuLCBlbiB2ZXogZGUgbGxhbWFyIGZpbHVwbG9hZCBkZXNkZSBhY2FcbiAgICAgICAgICAgIC8vcHJlRmlsZVVwbG9hZChyZXMubmF0aXZlVVJMKTsgIC8vICRzY29wZS5waG90b3MucHVzaChyZXMubmF0aXZlVVJMKTtcbiAgICAgICAgICAgIHByZUZpbGVVcGxvYWQob2JqKTtcbiAgICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7ICAvLyAkY29yZG92YUNhbWVyYS5jbGVhbnVwKCkudGhlbihmblN1Y2Nlc3MsZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7IC8vIG9ubHkgZm9yIEZJTEVfVVJJICBcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdJbnNwZWNjaW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHRpdGxlU2VydmljZSwgaW5zcGVjY2lvblNlcnZpY2UsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY01vZGFsLCAkaW9uaWNOYXZCYXJEZWxlZ2F0ZSwgJGlvbmljTG9hZGluZywgJHRpbWVvdXQsICRmaWx0ZXIsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsIHNxbGl0ZVNlcnZpY2UsICRpb25pY1BsYXRmb3JtLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCB0b2FzdFNlcnZpY2UpIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICRzY29wZS5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuYWxyZWFkeVNhdmVkID0gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmNhbGlmaWNhZG8pID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICRzY29wZS5hbHJlYWR5U2F2ZWQgPSBpbnNwZWNjaW9uU2VydmljZS5hbHJlYWR5U2F2ZWQ7XG4gICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgIC8vJHN0YXRlUGFyYW1zLmlkO1xuICAgIC8vIHBhcnNlSW50KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgLy9wYXJzZUludCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRzY29wZS50aXR0bGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2E7XG4gICAgaW5zcGVjY2lvblNlcnZpY2UuaWRpbnNwZWNjaW9uID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbjtcbiAgICAkc2NvcGUuZGF0YSA9IGluc3BlY2Npb25TZXJ2aWNlLmRhdGE7XG4gICAgLy8gcGFyc2VJbnQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9vcGNpb25Nb2RhbC5odG1sJywgeyBzY29wZTogJHNjb3BlIH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgICB9KTtcbiAgICAvLyBUT0RPOiBjb21vIGVzdG8gc2Ugc2luY3Jvbml6YSB1bmEgc29sYSB2ZXosIG5vIGhheSBwcm9ibGVtYSBjb24gZWwgaWRpbnNwZWNjaW9uLCBlbCBwcm9ibGVtYSBlc3RhIGVuIGFjY2Vzb3Jpb3MgeSBlbiBmb3RvcywgcXVlIHNlIHN1YmUgdW5vIGEgdW5vLCBlbnRvbmNlcyBwb2RyaWEgY2FtYmlhciwgbyBlbiBhY2Nlc29yaW9zIGhhY2VyIHVuIGJlZm9ybGVhdmUgZGUgdmlldywgbWkgcHJlZ3VudGEgZXMgLCBzaSBubyBhYmFuZG9uYSBsYSB2aWV3LCBjb21vIHNpbmNyb25pem8/IG90cmEgbWFzIHNpIHBhc28gYSBiYWNrZ3JvdW5kIHB1ZWRvIHNpbmNyb25pemFyPz8/XG4gICAgLy8gVE9ETzogZXN0YSB2YXJpYWJsZSBtZSBsYSBkYSBsYSBwYmFzZSBkZSBzYXRvcywgc2kgeWEgZXN0YSBjYWxpZmljYWRvIG8gbm9cbiAgICAkc2NvcGUub2JqID0geyBjdXN0b21zZWN0aW9uOiAwIH07XG4gICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLnNob3coeyB0ZW1wbGF0ZTogJzxpb24tc3Bpbm5lciBpY29uPVwiYW5kcm9pZFwiPjwvaW9uLXNwaW5uZXI+JyB9KTtcbiAgICB9O1xuICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5oaWRlKCk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuc2hvdygpO1xuICAgIC8vICR0aW1lb3V0KCRzY29wZS5oaWRlLCAxNTAwMCk7XG4gICAgJHNjb3BlLml0ZW1zID0gW107XG4gICAgLy8gaW5pdGlhbCBpbWFnZSBpbmRleFxuICAgICRzY29wZS5fSW5kZXggPSAwO1xuICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5zZWN0aW9ucywgaSk7XG4gICAgICAkc2NvcGUub2JqLmN1c3RvbXNlY3Rpb24gPSAkc2NvcGUuc2VjdGlvbnNbaV0uY3VzdG9tc2VjdGlvbjtcbiAgICAgIC8vICRzY29wZS5zZXRNaW4oKTtcbiAgICAgICRpb25pY1Njcm9sbERlbGVnYXRlLnNjcm9sbFRvcCgpO1xuICAgIH07XG4gICAgLy9yZWZlbmNlIHNlcnZpY2VcbiAgICAvLyBpZiBhIGN1cnJlbnQgaW1hZ2UgaXMgdGhlIHNhbWUgYXMgcmVxdWVzdGVkIGltYWdlXG4gICAgJHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICByZXR1cm4gJHNjb3BlLl9JbmRleCA9PT0gaW5kZXg7XG4gICAgfTtcbiAgICAvLyBzaG93IHByZXYgaW1hZ2VcbiAgICAkc2NvcGUuc2hvd1ByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuX0luZGV4ID0gJHNjb3BlLl9JbmRleCA+IDAgPyAtLSRzY29wZS5fSW5kZXggOiAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICRzY29wZS5zZXRDdXN0b21TZWN0aW9uKCRzY29wZS5fSW5kZXgpO1xuICAgIH07XG4gICAgLy8gc2hvdyBuZXh0IGltYWdlXG4gICAgJHNjb3BlLnNob3dOZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLl9JbmRleCA9ICRzY29wZS5fSW5kZXggPCAkc2NvcGUuc2VjdGlvbnMubGVuZ3RoIC0gMSA/ICsrJHNjb3BlLl9JbmRleCA6IDA7XG4gICAgICAkc2NvcGUuc2V0Q3VzdG9tU2VjdGlvbigkc2NvcGUuX0luZGV4KTtcbiAgICB9O1xuICAgIC8qIFNob3cgbGlzdCAqL1xuICAgICRzY29wZS5zaG93SXRlbXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgLy8gVE9ETzogcGFyYSBkZXNoYWJpbGl0YXIgZWwgdXBkYXRlLCBhdW5xdWUgeWEgZXN0YSBtb250YWRvLCBtZSBwcmVvY3VwYSBlcyBlbCB6eW5jIGNhZGEgcXVlIHNlIGhhZ2EgdW4gdXBkYXRlXG4gICAgICBpZiAoJHNjb3BlLmFscmVhZHlTYXZlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpdGVtLmRpcnR5ID0gdHJ1ZTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLml0ZW0gPSBpdGVtO1xuICAgICAgJHNjb3BlLml0ZW0gPSBpbnNwZWNjaW9uU2VydmljZS5pdGVtO1xuICAgICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgICB9O1xuICAgIC8qIEhpZGUgbGlzdCAqL1xuICAgICRzY29wZS5oaWRlSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAgIH07XG4gICAgJHNjb3BlLnZhbGlkYXRlU2luZ2xlID0gZnVuY3Rpb24gKG9wY2lvbikge1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHRleHRcbiAgICAgICRzY29wZS5pdGVtLnNsLmxhYmVsID0gb3BjaW9uLmxhYmVsO1xuICAgICAgLy8gU2V0IHNlbGVjdGVkIHZhbHVlXG4gICAgICAkc2NvcGUuaXRlbS5zbC52YWx1ZSA9IG9wY2lvbi52YWx1ZTtcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnVwZGF0ZVNpbmdsZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdvayB1cGRhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBIaWRlIGl0ZW1zXG4gICAgICAkc2NvcGUuaGlkZUl0ZW1zKCk7ICAvLyBFeGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgfTtcbiAgICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdHdWFyZGFuZG8gaW5mb3JtYWNpb24nKTtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNhdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFscmVhZHlTYXZlZCA9IGluc3BlY2Npb25TZXJ2aWNlLmFscmVhZHlTYXZlZDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWwucmVtb3ZlKCk7XG4gICAgfSk7XG4gICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUubW9kYWxPbmUuaGlkZSgpO1xuICAgICAgLy8gaW5zcGVjY2lvblNlcnZpY2UuY2xlYXJUaXBvKCk7XG4gICAgICAkc2NvcGUuY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAkc2NvcGUuY2wuaWRjYXJyb2NlcmlhID0gbnVsbDtcbiAgICAgICRzY29wZS5jbC50aXBvID0gbnVsbDtcbiAgICB9O1xuICAgICRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCgndGVtcGxhdGVzL21vZGFsR2V0SXRlbXMuaHRtbCcsIHtcbiAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xuICAgICAgJHNjb3BlLm1vZGFsT25lID0gbW9kYWw7XG4gICAgfSk7XG4gICAgJHNjb3BlLm9wZW5Nb2RhbE9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5tb2RhbE9uZS5zaG93KCk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKGlkdGlwbykge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2xhc2VzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5jbGFzZXMgPSBpbnNwZWNjaW9uU2VydmljZS5jbGFzZXM7XG4gICAgICAgICRzY29wZS5jYXJyb2NlcmlhcyA9IGluc3BlY2Npb25TZXJ2aWNlLmNhcnJvY2VyaWFzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuZ2V0Q2Fycm9jZXJpYXMgPSBmdW5jdGlvbiAoaWRjbGFzZSkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0Q2Fycm9jZXJpYXMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmNhcnJvY2VyaWFzID0gaW5zcGVjY2lvblNlcnZpY2UuY2Fycm9jZXJpYXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5pdGVtcyA9IGluc3BlY2Npb25TZXJ2aWNlLmFsbDtcbiAgICAgICRzY29wZS5zZWN0aW9ucyA9IGluc3BlY2Npb25TZXJ2aWNlLnNlY3Rpb25zO1xuICAgICAgJHNjb3BlLnNldEN1c3RvbVNlY3Rpb24oJHNjb3BlLl9JbmRleCk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2V0SWRDbGFDYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc3BlY2Npb25TZXJ2aWNlLnNldElkQ2xhQ2EoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldElkQ2xhQ2EgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAkc2NvcGUuc2V0SXRlbXMoKTtcbiAgICAgICAgJHNjb3BlLmNsb3NlTW9kYWxPbmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmdldEFscmVhZHlJbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2UuZ2V0QWxyZWFkeUluc3BlY3QoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldEFscmVhZHlJbnNwZWN0IGVuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgJHNjb3BlLnNldEl0ZW1zKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnRpcG9zID0gaW5zcGVjY2lvblNlcnZpY2UudGlwb3M7XG4gICAgICAkc2NvcGUuY2wgPSBpbnNwZWNjaW9uU2VydmljZS5jbDtcbiAgICAgIC8vIFRPRE86IGFxdWkgdmFsaWRvIHNpIHlhIHNlIGNhbGlmaWNvIG8gc2kgYXBlbmFzIHNlIHZhIGEgcmVhbGl6YXJcbiAgICAgIGlmICgkc2NvcGUuYWxyZWFkeVNhdmVkKSB7XG4gICAgICAgICRzY29wZS5nZXRBbHJlYWR5SW5zcGVjdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8vIG9uIGluaXRcbiAgICAkc2NvcGUuaW5pdCgpO1xuICB9KTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdNYWluQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRpb25pY05hdkJhckRlbGVnYXRlLCBvZmZsaW5lU2VydmljZSwgdGl0bGVTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCB0b2FzdFNlcnZpY2UsIHVuc3luY1NlcnZpY2UsICRzdGF0ZSwgYXV0aFNlcnZpY2UpIHtcbiAgJHNjb3BlLm9mZiA9IG9mZmxpbmVTZXJ2aWNlLmRhdGE7XG4gICRzY29wZS5pbnRlcm1lZGlhdGUgPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGE7XG4gICRzY29wZS5zZXRPZmZsaW5lTW9kZSA9IGZ1bmN0aW9uIChib29sKSB7XG4gICAgJHNjb3BlLm9mZi5vZmZsaW5lTW9kZSA9IGJvb2w7XG4gICAgLy8gaWYgKGJvb2wpIHtcbiAgICAvLyAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCdPZmZsaW5lIE1vZGUnKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgJGlvbmljTmF2QmFyRGVsZWdhdGUudGl0bGUodGl0bGVTZXJ2aWNlLnRpdGxlKTtcbiAgICAvLyB9XG4gICAgaWYgKCFib29sICYmIG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgdG9hc3RTZXJ2aWNlLnNob3dMb25nQm90dG9tKCdzaW5jcm9uaXphbmRvJyk7XG4gICAgICB1bnN5bmNTZXJ2aWNlLnN5bmNJbWFnZXMoKSAgLy8gLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHp1bWVyb1NlcnZpY2UuenluYygwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTsgIC8vIHp1bWVyb1NlcnZpY2UuenluYygwKTtcbjtcbiAgICB9XG4gIH07XG4gICRzY29wZS5sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgYXV0aFNlcnZpY2UubG9nT3V0KCk7XG4gICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgfTtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdQbGFjYXNDdHJsJywgW1xuICAnJHNjb3BlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnJGlvbmljUGxhdGZvcm0nLFxuICAncGxhY2FzU2VydmljZScsXG4gICckaW9uaWNOYXZCYXJEZWxlZ2F0ZScsXG4gICckbG9jYXRpb24nLFxuICAnJGlvbmljUG9wdXAnLFxuICAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLFxuICAnZm9jdXMnLFxuICAnJHN0YXRlJyxcbiAgJ3RpdGxlU2VydmljZScsXG4gICckaW9uaWNNb2RhbCcsXG4gICd0b2FzdFNlcnZpY2UnLFxuICAnZmlyc3RJbml0U2VydmljZScsXG4gICckbG9jYWxTdG9yYWdlJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICAnJGZpbHRlcicsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgenVtZXJvU2VydmljZSwgJGlvbmljUGxhdGZvcm0sIHBsYWNhc1NlcnZpY2UsICRpb25pY05hdkJhckRlbGVnYXRlLCAkbG9jYXRpb24sICRpb25pY1BvcHVwLCAkaW9uaWNTY3JvbGxEZWxlZ2F0ZSwgZm9jdXMsICRzdGF0ZSwgdGl0bGVTZXJ2aWNlLCAkaW9uaWNNb2RhbCwgdG9hc3RTZXJ2aWNlLCBmaXJzdEluaXRTZXJ2aWNlLCAkbG9jYWxTdG9yYWdlLCAkaW9uaWNMb2FkaW5nLCAkZmlsdGVyLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgLy8gcGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vIHBzID0gcGxhY2FzU2VydmljZTtcbiAgICAgIC8vIHBjID0gJHNjb3BlO1xuICAgICAgLy8gJHNjb3BlLnBsYWNhc1NlcnZpY2UgPSBwbGFjYXNTZXJ2aWNlO1xuICAgICAgJHNjb3BlLnBsYWNhcyA9IHBsYWNhc1NlcnZpY2UuYWxsO1xuICAgICAgJHNjb3BlLm9iaiA9IHsgZmlsdGVyOiAnJyB9O1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAkc2NvcGUucGxhY2FzU2VydmljZS5zZWxlY3RBbGwoKTtcbiAgICAgIC8vICAgY29uc29sZS5sb2cocGxhY2FzU2VydmljZS5hbGwpO1xuICAgICAgLy8gfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vIH0pO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDEpO1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gJ1BsYWNhcyc7XG4gICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGlvbmljTG9hZGluZy5zaG93KHsgdGVtcGxhdGU6ICc8aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2NhcmdhbmRvIGluZm9ybWFjaW9uJyk7XG4gICAgICAgIHBsYWNhc1NlcnZpY2UuZ2V0UGxhY2FzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXInKTtcbiAgICAgICAgICAkc2NvcGUucGxhY2FzID0gcGxhY2FzU2VydmljZS5hbGw7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIC8vIFRPRE86IHNlcmlhIGJ1ZW5vIHF1ZSBsYSBjb25zdWx0YSBkZSBwbGFjYXMgc3VwaWVyYSB0b2RvLCBjb21vIHBvciBlamVtcGxvIHNpIHlhIHNlIGNhbGlmaWNvLCBzaSB5YSB0aWVuZSBhbGd1bmEgZm90byBvIHVuIHZpZGVvLCBwdWVkZSBzZXIgbWFyY2FuZG9sbyBjb24gYWxndW5hIGNsYXNlXG4gICAgICBpZiAoISRsb2NhbFN0b3JhZ2UuZGF0YSkge1xuICAgICAgICAkc2NvcGUuc2hvdygpO1xuICAgICAgICAvLyBUT0RPOiBwdWVkbyBwb2RlciBvYmo9bnVsbCwgcGFyYSBxdWUgbWUgZWxpbWluZSBsYSBiYXNlIGRlIGRhdG9zIHNpIHlhIGVzdGEgY3JlYWRhIHkgdnVlbHZhIGEgc2luY3Jvbml6YXIsIGVzdG8gc2VyaWEgYmVuZWZpY2lvc28gc2kgdGVuZ28gcXVlIGhhY2VyIHVuIGNhbWJpbyBlbiBsYSBiYXNlIGRlIGRkYXRvcyBxdWUgcmVxdWllcmEgcmVjb25zdHJ1aXJsYVxuICAgICAgICBmaXJzdEluaXRTZXJ2aWNlLmluaXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuaGlkZSgpO1xuICAgICAgICAgICRzY29wZS5nZXRQbGFjYXMoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmdldFBsYWNhcygpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnBsYWNhUG9wdXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IG9yZ2FuaXphciBlbCBmb2N1cyBlbiBlbCBpbnB1dCBkZWwgcG9wdXBcbiAgICAgICAgdmFyIG15cHJvbXB0ID0gJGlvbmljUG9wdXAucHJvbXB0KHtcbiAgICAgICAgICB0aXRsZTogJ051ZXZhIFBsYWNhJyxcbiAgICAgICAgICB0ZW1wbGF0ZTogJ0luZ3Jlc2UgbGEgbnVldmEgcGxhY2EnLFxuICAgICAgICAgIGlucHV0VHlwZTogJ3RleHQnLFxuICAgICAgICAgIGlucHV0UGxhY2Vob2xkZXI6ICdQbGFjYSdcbiAgICAgICAgfSk7XG4gICAgICAgIG15cHJvbXB0LnRoZW4oZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgICAgJHNjb3BlLmFkZFBsYWNhKHBsYWNhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmFkZFBsYWNhID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHBsYWNhKSkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3ZlcmlmaXF1ZSBsYSBwbGFjYSBlIGluZ3Jlc2UgbnVldmFtZW50ZScpO1xuICAgICAgICAgIC8vIGFsZXJ0KFwidmVyaWZpcXVlIGxhIHBsYWNhIGUgaW5ncmVzZSBudWV2YW1lbnRlXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2EubGVuZ3RoIDwgNCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2xvbmdpdHVkIGRlIHBsYWNhIG11eSBjb3J0YScpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwbGFjYSA9IHBsYWNhLnJlcGxhY2UoL1teXFx3XFxzXS9naSwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHBsYWNhID0gcGxhY2EucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIGZvdW5kID0gJGZpbHRlcignZmlsdGVyJykoJHNjb3BlLnBsYWNhcywgeyBwbGFjYTogcGxhY2EgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICB0b2FzdFNlcnZpY2Uuc2hvd1Nob3J0Qm90dG9tKCdwbGFjYSB5YSByZWdpc3RyYWRhJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93TG9uZ0JvdHRvbSgnSW5ncmVzYW5kbyBudWV2YSBwbGFjYScpO1xuICAgICAgICBwbGFjYXNTZXJ2aWNlLmluc2VydFBMYWNhKHBsYWNhKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgICRzY29wZS5wbGFjYXMgPSBwbGFjYXNTZXJ2aWNlLmFsbDtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS5zY3JvbGxUb3AoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmhhc0ZvY3VzID0gZmFsc2U7XG4gICAgICAkc2NvcGUuc2V0Rm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IHRydWU7XG4gICAgICAgICRpb25pY05hdkJhckRlbGVnYXRlLnRpdGxlKCcnKTtcbiAgICAgICAgZm9jdXMuZm9jdXMoJ3NlYXJjaFByaW1hcnknKTsgIC8vbm8gZXMgbmVjZXNhcmlvIGFicmlyIGVsIGtleWJvYXJkIHNlIGFicmUgc29sbyBjdWFuZG8gYXNpZ25hbW9zIGVsIGZvY3VzIC8vIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5zaG93KCk7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm5vRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5oYXNGb2N1cyA9IGZhbHNlO1xuICAgICAgICAkaW9uaWNOYXZCYXJEZWxlZ2F0ZS50aXRsZSgnJyk7XG4gICAgICAgICRzY29wZS5vYmouZmlsdGVyID0gJyc7XG4gICAgICB9O1xuICAgICAgJHNjb3BlLnNldEludERhdGEgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIC8vIFRPRE86IHNpIGxhcyBwbGFjYXMgc29uIGlndWFsZXMsIHB1ZWRlIHNlciBxdWUgc2UgaGF5YSBzaW5jcm9uaXphZG8geSBubyBzZSBoYXlhIGFjeWF1bGl6YWRvIGxhIGxpc3RhIGRlIHBsYWNhcywgZW50b25jZXMgc2UgcGFzYXJpYSB1biBpZGluc3BlY2Npb24gcXVlIG5vICxlcyBlc3RvIGN1YW5kbyBvZmZsaW5lIGNyZW8gdW5hIHBsYWNhLCBtZSBwb25nbyBvbmxpbmUgeSBsdWVnbyBvbiBwYXVzZSBoYWdvIGVsIHN5bmMsIGF1bnF1ZSBoYXlxIHVlIHBlbnNhciBxdWUgY3VhbmRvIGxlIHBvbmdvIG9ubGluZSwgZGViZXJpYSBzaW5jcm9uaXphciBzaSBoYXkgc2XDsWFsIDRnIG8gd2lmaSBwYXJhIGltYWdlbmVzIG8gcGFyYSB0b2RvXG4gICAgICAgIGlmIChvYmoucGxhY2EgIT09IGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkge1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSA9IG9iai5wbGFjYTtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IG9iai5zeW5jID09PSAxID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24gPSBvYmouaWRpbnNwZWNjaW9uO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLmdvRm90b3MgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICRzY29wZS5zZXRJbnREYXRhKG9iaik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmZvdG8nLCB7IGlkOiBvYmouaWRpbnNwZWNjaW9uIH0pOyAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvZm90b3MvJyArIG9iai5pZGluc3BlY2Npb24pOyAgLy8gVE9ETzogY2FtYmlhciBwb3Igc3RhdGUuZ28gbWFzIHBhcmFtZXRyb3MsIHZlciBiZXN0IHByYWN0aWNlc1xuICAgICAgfTtcbiAgICAgICRzY29wZS5nb1ZpZGVvID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyAkbG9jYXRpb24ucGF0aCgnL2FwcC92aWRlby8nICsgb2JqLmlkaW5zcGVjY2lvbik7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnZpZGVvJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29JbnNwZWNjaW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAvLyBUT0RPOiBhcXVpIHBvZHJpYSBldmFsdWFyIHNpIHlhIHNlIGNhbGlmaWNvIG8gbm8sIHNpIG5vIHNlIGhhIGNhbGlmaWNhZG8gcG9kcmlhIGRlc3BsZWdhciBlbCBtb2RhbCBkZSBjbGFzZSBjYXJyb2NlcmlhXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmluc3BlY2Npb24nLCB7XG4gICAgICAgICAgaWQ6IG9iai5pZGluc3BlY2Npb24sXG4gICAgICAgICAgcGxhY2E6IG9iai5wbGFjYSxcbiAgICAgICAgICBjYWxpZmljYWRvOiBvYmouY2FsaWZpY2Fkb1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZ29BY2Nlc29yaW9zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAkc2NvcGUuc2V0SW50RGF0YShvYmopO1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5hY2Nlc29yaW9zJywgeyBpZDogb2JqLmlkaW5zcGVjY2lvbiB9KTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdUZXN0Q3RybCcsIFtcbiAgJyRzY29wZScsXG4gICckaW9uaWNQbGF0Zm9ybScsXG4gICdzcWxTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRzY29wZSwgJGlvbmljUGxhdGZvcm0sIHNxbFNlcnZpY2UpIHtcbiAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB2YXIgenVtZXJvID0gY29yZG92YS5yZXF1aXJlKCdjb3Jkb3ZhL3BsdWdpbi96dW1lcm8nKTtcbiAgICAgICRzY29wZS5vcGVuZGIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHggPSB3aW5kb3cuc3FsaXRlUGx1Z2luLm9wZW5EYXRhYmFzZSh7IG5hbWU6ICd6dW1lcm90ZXN0ZGJmaWxlJyB9LCBmdW5jdGlvbiAocmVzdWx0T2JqLCBmdWxsUGF0aFBhcmFtLCBkYk9iamVjdCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGRiT2JqZWN0LCAnZGJvYmplY3QnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRPYmosICdmdWxwYXRoOicsIGZ1bGxQYXRoUGFyYW0pOyAgLy9JbXBvcnRhbnQhICBJZiB5b3UgZG9uJ3QgY2xvc2UgdGhlIGRhdGFiYXNlIG9iamVjdCwgZnV0dXJlIGNhbGxzIHRvIG9wZW5EYXRhYmFzZSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy93b24ndCBjYWxsIHRoZSBzdWNjZXNzIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkYk9iamVjdC5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY2xvc2VkYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NlcnJhbmRvJywgeCk7XG4gICAgICAgIC8vIGlmICgheCkge1xuICAgICAgICB4LmNsb3NlKCk7XG4gICAgICAgIC8vIHp1bWVybyBzcWxpdGUgZnVuY2lvbmEgYXNpIC5jbG9zZSA9IGZ1bmN0aW9uKHN1Y2Nlc3MsIGVycm9yKSB7IHBlcm8gbm8gc2UgdXNhbiBhbCBsbGFtYXIgY29yb2R2YS5leGVcbiAgICAgICAgY29uc29sZS5sb2coeC5vcGVuREJTKTsgIC8vIH1cbiAgICAgIH07XG4gICAgICAkc2NvcGUuc3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZ1bGxQYXRoUGFyYW0gPSAnL2RhdGEvZGF0YS9jb20uaW9uaWNmcmFtZXdvcmsuZm90b3N2aWV3MzkwNzQ3L2RhdGFiYXNlcy96dW1lcm90ZXN0ZGIuZGInO1xuICAgICAgICB2YXIgc2VydmVyID0gJ2h0dHA6Ly8xOTIuMTY4LjEuMTM6ODA4MC8nO1xuICAgICAgICB2YXIgZGJmaWxlID0gJ3p1bWVyb3Rlc3RkYmZpbGUnO1xuICAgICAgICB2YXIgbm90aWZ5U3VjY2VzcyA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocyk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBub3RpZnlFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH07XG4gICAgICAgIHp1bWVyby5zeW5jKGZ1bGxQYXRoUGFyYW0sICcnLCBzZXJ2ZXIsIGRiZmlsZSwgbnVsbCwgbnVsbCwgbnVsbCwgbm90aWZ5U3VjY2Vzcywgbm90aWZ5RXJyb3IpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5vID0ge1xuICAgICAgICBzOiB0cnVlLFxuICAgICAgICBlOiB0cnVlLFxuICAgICAgICB1OiB0cnVlXG4gICAgICB9O1xuICAgICAgc3FsU2VydmljZS5zeW5jKCk7XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5jb250cm9sbGVyKCdWaWRlb0N0cmwnLCBbXG4gICckc2NvcGUnLFxuICAndmlkZW9TZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRpb25pY1Njcm9sbERlbGVnYXRlJyxcbiAgJ2ZpbGVUcmFuc2ZlclNlcnZpY2UnLFxuICAnJGZpbHRlcicsXG4gICckc3RhdGVQYXJhbXMnLFxuICAnJGlvbmljTmF2QmFyRGVsZWdhdGUnLFxuICAnY29weUZpbGVTZXJ2aWNlJyxcbiAgJ3ZpZGVvVGh1bWJuYWlsU2VydmljZScsXG4gICdnZXRWaWRlb1NlcnZpY2UnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICd0aXRsZVNlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAnb25saW5lU3RhdHVzU2VydmljZScsXG4gICdpbnRlcm1lZGlhdGVTZXJ2aWNlJyxcbiAgJ3RvYXN0U2VydmljZScsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ2dwc1NlcnZpY2UnLFxuICBmdW5jdGlvbiAocywgdmlkZW9TZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJGlvbmljU2Nyb2xsRGVsZWdhdGUsIGZpbGVUcmFuc2ZlclNlcnZpY2UsICRmaWx0ZXIsICRzdGF0ZVBhcmFtcywgJGlvbmljTmF2QmFyRGVsZWdhdGUsIGNvcHlGaWxlU2VydmljZSwgdmlkZW9UaHVtYm5haWxTZXJ2aWNlLCBnZXRWaWRlb1NlcnZpY2UsIGNoZWNrRmlsZVNlcnZpY2UsIHRpdGxlU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIG9ubGluZVN0YXR1c1NlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgZXJyb3JTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCBncHNTZXJ2aWNlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgdGl0bGVTZXJ2aWNlLnRpdGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgLy8gcy50aXR0bGUgPSAnJztcbiAgICAgIHMudGl0dGxlID0gaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhO1xuICAgICAgLy8gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgcy5pZGluc3BlY2Npb24gPSBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uO1xuICAgICAgLy8kc3RhdGVQYXJhbXMuaWQ7XG4gICAgICBzLm9zcyA9IG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YTtcbiAgICAgIHMudmlkZW9zID0gdmlkZW9TZXJ2aWNlLnZpZGVvcztcbiAgICAgIC8vdmlkZW9TZXJ2aWNlLmFsbCgpO1xuICAgICAgdmlkZW9TZXJ2aWNlLmdldFZpZGVvcyhzLmlkaW5zcGVjY2lvbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHMudmlkZW9zID0gdmlkZW9TZXJ2aWNlLnZpZGVvcztcbiAgICAgIH0pO1xuICAgICAgLy8gdmFyIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gICBjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcbiAgICAgIC8vIH07XG4gICAgICB2YXIgaW5zZXJ0VmlkZW8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLmluc2VydFZpZGVvKHMuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgdGh1bWJuYWlsLCBvbnVwbG9hZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2VuIGVsIGNvbnRyb2xsZXIgZGVzcHVlcyBkZSBpbnNlcnQgc3FsaXRlIHZpZGVvICcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB2YXIgdXBkYXRlVmlkZW8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIHRodW1ibmFpbCwgb251cGxvYWQpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlLnVwZGF0ZVZpZGVvKHMuaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb251cGxvYWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSB2aWRlbyAnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdmFyIHVwZGF0ZUFmdGVyVXBsb2FkID0gZnVuY3Rpb24gKGltYWdlVVJJLCBzeW5jLCBvbnVwbG9hZCkge1xuICAgICAgICB2YXIgb2JqVmlkZW8gPSBzZWFyY2hPbmVJbkFycmF5KGltYWdlVVJJKTtcbiAgICAgICAgb2JqVmlkZW8uc3luYyA9IHN5bmM7XG4gICAgICAgIG9ialZpZGVvLm9uVXBsb2FkID0gb251cGxvYWQ7XG4gICAgICAgIC8vIGluc2VydFZpZGVvKGltYWdlVVJJLCBzeW5jLCBvYmpWaWRlby50aHVtYm5haWwpO1xuICAgICAgICB1cGRhdGVWaWRlbyhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMyk7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IGZhbHNlO1xuICAgICAgfTtcbiAgICAgIHZhciByZWZyZXNoUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgdmFyIG9ialZpZGVvID0gc2VhcmNoT25lSW5BcnJheShpbWFnZVVSSSk7XG4gICAgICAgIG9ialZpZGVvLnByb2dyZXNzID0gcGVyY2VudGFnZTtcbiAgICAgIH07XG4gICAgICB2YXIgcHJlRmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlLmZpbGVVcGxvYWQob2JqKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgICAgIHVwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaWxlVXBsb2FkJyk7XG4gICAgICAgICAgICB1cGRhdGVBZnRlclVwbG9hZChvYmoucGF0aCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgb2ZmbGluZVNlcnZpY2UuZGF0YS5vZmZsaW5lTW9kZSA9IHRydWU7XG4gICAgICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAgICAgICAgICAgLy8gY29uc3RhbnQgcHJvZ3Jlc3MgdXBkYXRlc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgLy8gcmVmcmVzaFByb2dyZXNzKGltYWdlVVJJLCBNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhNYXRoLnJvdW5kKHByb2dyZXNzLmxvYWRlZCAvIHByb2dyZXNzLnRvdGFsICogMTAwKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcnRuT2JqVmlkZW8gPSBmdW5jdGlvbiAocGxhY2EsIHBhdGgsIHN5bmMsIG9uVXBsb2FkLCB0aHVtYm5haWwpIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICBwbGFjYTogcGxhY2EsXG4gICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICBzeW5jOiBzeW5jLFxuICAgICAgICAgIG9uVXBsb2FkOiBvblVwbG9hZCxcbiAgICAgICAgICAvL3Mub3NzLm9ubGluZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIHRodW1ibmFpbDogdGh1bWJuYWlsLFxuICAgICAgICAgIHJ1dGFTcnY6IG1vbWVudFNlcnZpY2UucnV0YVNydihwYXRoKVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfTtcbiAgICAgIHZhciBzZWFyY2hPbmVJbkFycmF5ID0gZnVuY3Rpb24gKHNyY0ltZykge1xuICAgICAgICB2YXIgZm91bmQgPSAkZmlsdGVyKCdmaWx0ZXInKShzLnZpZGVvcywgeyBwYXRoOiBzcmNJbWcgfSwgdHJ1ZSk7XG4gICAgICAgIGlmIChmb3VuZC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZm91bmRbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ25vdCBmb3VuZCBpbiBhcnJheSBzZWFyY2gnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBsb2FkVGh1bWJuYWlsID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2aWRlb1RodW1ibmFpbFNlcnZpY2UuZ2VuZXJhdGVUaHVtYm5haWwob2JqLnBhdGgpLnRoZW4oZnVuY3Rpb24gKHRodW1ibmFpbFNyYykge1xuICAgICAgICAgIHNlYXJjaE9uZUluQXJyYXkob2JqLnBhdGgpLnRodW1ibmFpbCA9IHRodW1ibmFpbFNyYztcbiAgICAgICAgICB2YXIgc3luYyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFRPRE86IG9udXBsb2FkIGRlcGVuZGVyYSBzaSBlc3RhIG9ubGluZSBvIG5vIHBhcmEgc2FiZXIgc2kgc2UgaW50ZW50YSBzdWJpcjtcbiAgICAgICAgICB2YXIgb25VcGxvYWQgPSB0cnVlO1xuICAgICAgICAgIGluc2VydFZpZGVvKG9iai5wYXRoLCBzeW5jLCB0aHVtYm5haWxTcmMsIG9uVXBsb2FkKTtcbiAgICAgICAgICAkaW9uaWNTY3JvbGxEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ21haW5TY3JvbGwnKS5zY3JvbGxCb3R0b20odHJ1ZSk7XG4gICAgICAgICAgcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICAgIH07XG4gICAgICBzLnRyeVVwbG9hZCA9IGZ1bmN0aW9uIChmb3RvKSB7XG4gICAgICAgIHZhciBvYmpWaWRlbyA9IHNlYXJjaE9uZUluQXJyYXkoZm90by5wYXRoKTtcbiAgICAgICAgb2JqVmlkZW8ub25VcGxvYWQgPSB0cnVlO1xuICAgICAgICBwcmVGaWxlVXBsb2FkKG9ialZpZGVvKTtcbiAgICAgIH07XG4gICAgICBzLmdldFZpZEZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIHZpZGVvU2VydmljZS50YWtlZFZpZCgpLnRoZW4oZnVuY3Rpb24gKHZpZGVvRGF0YSkge1xuICAgICAgICAgIGdwc1NlcnZpY2UuZ3BzSHRtbChpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2aWRlb0RhdGEpO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2aWRlb0RhdGEsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkgKyAnOiAnICsgdmFsdWUpO1xuICAgICAgICAgICAgY29weUZpbGVTZXJ2aWNlLmNvcHlGaWxlKHZhbHVlLmZ1bGxQYXRoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnksIGNoZWNrRmlsZVNlcnZpY2UuZmlsZSk7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVFbnRyeTtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHJ0bk9ialZpZGVvKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgcmVzLm5hdGl2ZVVSTCwgZmFsc2UsIHRydWUsICcnKTtcbiAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLCAnY29weW9rJyk7XG4gICAgICAgICAgICAgIHMudmlkZW9zLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgbG9hZFRodW1ibmFpbChvYmopOyAgLy8gcHJlRmlsZVVwbG9hZChvYmopO1xuICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAgLy8gJGNvcmRvdmFDYW1lcmEuY2xlYW51cCgpLnRoZW4oZm5TdWNjZXNzLGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpOyAvLyBvbmx5IGZvciBGSUxFX1VSSSAgXG4gICAgICB9O1xuICAgICAgcy5nZXRWaWRGaWxlQ29tcHJlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pc1Rha2luZ1ZpZCA9IHRydWU7XG4gICAgICAgIGdldFZpZGVvU2VydmljZS5nZXRWaWRlb0NvbXByZXNzKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZ3BzU2VydmljZS5ncHNIdG1sKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5pZGluc3BlY2Npb24pO1xuICAgICAgICAgIHZhciByZXNWaWRlb0NvbXByZXNzID0gY2hlY2tGaWxlU2VydmljZS5maWxlRW50cnk7XG4gICAgICAgICAgLy8gVE9ETzogMTI1ODI5MTIgc29uIDEyTUIgO1xuICAgICAgICAgIGlmIChjaGVja0ZpbGVTZXJ2aWNlLmZpbGUuc2l6ZSA8IDEyNTgyOTEyKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhnZXRWaWRlb1NlcnZpY2UuZmlsZUVudHJ5KTtcbiAgICAgICAgICAgIGNvcHlGaWxlU2VydmljZS5jb3B5RmlsZShyZXNWaWRlb0NvbXByZXNzLm5hdGl2ZVVSTCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvcHlGaWxlU2VydmljZS5maWxlRW50cnksIGNvcHlGaWxlU2VydmljZS5maWxlKTtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IGNoZWNrRmlsZVNlcnZpY2UuZmlsZUVudHJ5O1xuICAgICAgICAgICAgICB2YXIgb2JqID0gcnRuT2JqVmlkZW8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLCByZXMubmF0aXZlVVJMLCBmYWxzZSwgdHJ1ZSwgJycpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMsICdjb3B5b2snKTtcbiAgICAgICAgICAgICAgcy52aWRlb3MucHVzaChvYmopO1xuICAgICAgICAgICAgICBsb2FkVGh1bWJuYWlsKG9iaik7ICAvLyBwcmVGaWxlVXBsb2FkKHJlcy5uYXRpdmVVUkwpO1xuICAgICAgICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdlbCBhcmNoaXZvIHN1cGVyYSBlbCB0YW1hXFx4RjFhIG1heGltbyBwZXJtaXRpZG8uIG1heGltbyAxMk1CJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vICRjb3Jkb3ZhQ2FtZXJhLmNsZWFudXAoKS50aGVuKGZuU3VjY2VzcyxlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgLy8gb25seSBmb3IgRklMRV9VUkkgIFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFtcbiAgJyRzY29wZScsXG4gICckbG9jYXRpb24nLFxuICAnYXV0aFNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZScsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgJyRpb25pY1BsYXRmb3JtJyxcbiAgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCAkaW9uaWNQbGF0Zm9ybSwgJHN0YXRlKSB7XG4gICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLnNyYyA9ICdpbWcvaWNvbi5wbmcnO1xuICAgICAgLy8gVE9ETzogdmVyaWZpY2FyIHNpIGVzdG8gc2UgcHVlZGUgaGFjZXIgZW4gZWwgcnVuLCBwZXJvIGNvbiBzdGF0ZS5nbyBhcHAucGxhY2FzXG4gICAgICB2YXIgX2FscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgICAgICB2YXIgbiA9IG1vbWVudCgpO1xuICAgICAgICAgIHZhciBlID0gbW9tZW50KGF1dGhEYXRhLmV4cCk7XG4gICAgICAgICAgY29uc29sZS5sb2cobi5kaWZmKGUsICdzZWNvbmRzJykpO1xuICAgICAgICAgIGlmIChuLmRpZmYoZSwgJ3NlY29uZHMnKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b2tlbiByZWRpcmVjdCBwbGFjYXMnKTtcbiAgICAgICAgICAgIC8vICRsb2NhdGlvbi5wYXRoKCcvYXBwL3BsYWNhcycpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGxhY2FzJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgX2FscmVhZHkoKTtcbiAgICAgICRzY29wZS5sb2dnZWROb3cgPSBmYWxzZTtcbiAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUuY2FuRHJhZ0NvbnRlbnQoZmFsc2UpO1xuICAgICAgJHNjb3BlLmxvZ2luRGF0YSA9IHtcbiAgICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IGZhbHNlXG4gICAgICB9O1xuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbigkc2NvcGUubG9naW5EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLm9uTG9nZ2VkKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBlcnIuZXJyb3JfZGVzY3JpcHRpb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAndmVyaWZpcXVlIHF1ZSBkaXNwb25nYSBkZSBjb25leGlvbiBhIGludGVybmV0LCBlIGludGVudGUgZGUgbnVldm8nO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgJHNjb3BlLm9uTG9nZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgIC8vICRzY29wZS5sb2dnZWQodHJ1ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UsJGxvY2F0aW9uKTtcbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9hcHAvcGxhY2FzJyk7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLnBsYWNhcycpO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hdXRoRXh0ZXJuYWxQcm92aWRlciA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgcmVkaXJlY3RVcmkgPSBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0ICsgJy9hdXRoY29tcGxldGUuaHRtbCc7XG4gICAgICAgIHZhciBleHRlcm5hbFByb3ZpZGVyVXJsID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmkgKyAnYXBpL0FjY291bnQvRXh0ZXJuYWxMb2dpbj9wcm92aWRlcj0nICsgcHJvdmlkZXIgKyAnJnJlc3BvbnNlX3R5cGU9dG9rZW4mY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZCArICcmcmVkaXJlY3RfdXJpPScgKyByZWRpcmVjdFVyaTtcbiAgICAgICAgd2luZG93LiR3aW5kb3dTY29wZSA9ICRzY29wZTtcbiAgICAgICAgdmFyIG9hdXRoV2luZG93ID0gd2luZG93Lm9wZW4oZXh0ZXJuYWxQcm92aWRlclVybCwgJ0F1dGhlbnRpY2F0ZSBBY2NvdW50JywgJ2xvY2F0aW9uPTAsc3RhdHVzPTAsd2lkdGg9NjAwLGhlaWdodD03NTAnKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuYXV0aENvbXBsZXRlZENCID0gZnVuY3Rpb24gKGZyYWdtZW50KSB7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChmcmFnbWVudC5oYXNsb2NhbGFjY291bnQgPT09ICdGYWxzZScpIHtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZXh0ZXJuYWxBdXRoRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICB1c2VyTmFtZTogZnJhZ21lbnQuZXh0ZXJuYWxfdXNlcl9uYW1lLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Fzc29jaWF0ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL09idGFpbiBhY2Nlc3MgdG9rZW4gYW5kIHJlZGlyZWN0IHRvIG9yZGVyc1xuICAgICAgICAgICAgdmFyIGV4dGVybmFsRGF0YSA9IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGZyYWdtZW50LnByb3ZpZGVyLFxuICAgICAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBmcmFnbWVudC5leHRlcm5hbF9hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhdXRoU2VydmljZS5vYnRhaW5BY2Nlc3NUb2tlbihleHRlcm5hbERhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXJzJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gZXJyLmVycm9yX2Rlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gIC8vICRzY29wZS5hbHJlYWR5TG9nZ2VkKCk7ICAgICAgICAgICAgICAgXG47XG4gICAgfSk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdhY2Nlc29yaW9zU2VydmljZScsIFtcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnJHEnLFxuICAnJGZpbHRlcicsXG4gICdlcnJvclNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcSwgJGZpbHRlciwgZXJyb3JTZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gICAgdmFyIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5hbGwgPSBbXTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gZmFsc2U7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbiA9IDA7XG4gICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0gPSB7fTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdERhdGEgPSB7fTtcbiAgICB2YXIgX2dldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRhY2Nlc29yaW9zIHdoZXJlIGlkaW5zcGVjY2lvbj0/JztcbiAgICAgIHZhciBiaW5kaW5nID0gW2FjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldCBpdGVtcyBlbiBlbCBzZXJ2aWNpbycpO1xuICAgICAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfbm9tYnJlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ3RleHRhJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICd0ZXh0YicsXG4gICAgICAgIGlkOiAyXG4gICAgICB9XG4gICAgXTtcbiAgICB2YXIgX2VzdGFkb3MgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdlc3RhZG9hJyxcbiAgICAgICAgaWQ6IDFcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdlc3RhZG9iJyxcbiAgICAgICAgaWQ6IDJcbiAgICAgIH1cbiAgICBdO1xuICAgIHZhciBfY2FudGlkYWRlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJzEnLFxuICAgICAgICBpZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJzInLFxuICAgICAgICBpZDogMlxuICAgICAgfVxuICAgIF07XG4gICAgdmFyIF9zZXROb21icmVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgaWRjb250cm9sZWxlbWVudG8sIGlkY29udHJvbCwgY29udHJvbEpzb24gRlJPTSAgY29udHJvbEVsZW1lbnRvcyBXSEVSRSAgIGlkY29udHJvbCA9IDIxJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcykuY29udHJvbEpzb24pO1xuICAgICAgICAvLyB2YXIganNvbiA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYW5ndWxhci5mcm9tSnNvbihqc29uKSk7XG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5ub21icmVzID0gYW5ndWxhci5mcm9tSnNvbihzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uY29udHJvbEpzb24pOyAgLy9hbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0RXN0YWRvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMCc7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmVzdGFkb3MgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2V0Q2FudGlkYWRlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGlkY29udHJvbGVsZW1lbnRvLCBpZGNvbnRyb2wsIGNvbnRyb2xKc29uIEZST00gIGNvbnRyb2xFbGVtZW50b3MgV0hFUkUgICBpZGNvbnRyb2wgPSAyMic7XG4gICAgICB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmNhbnRpZGFkZXMgPSBhbmd1bGFyLmZyb21Kc29uKHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5jb250cm9sSnNvbik7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUT0RPOiAgdW5hIGJhbmRlcmEgcGFyYSBzYWJlciBxdWUgeWEgc2Ugc2V0aW8sIHVuYSB2ZXosIHkgZXZpdGFyIG1hcyBjb25zdWxhdHMsIGEgbWVub3MgcXVlIHNlIGhhZ2EgdW5hIGFjdHVhbGl6YWNpb24gZGVsIHNlcnZpZG9yXG4gICAgICB2YXIgcWFycmF5ID0gW107XG4gICAgICBxYXJyYXkucHVzaChfc2V0Tm9tYnJlcygpKTtcbiAgICAgIHFhcnJheS5wdXNoKF9zZXRDYW50aWRhZGVzKCkpO1xuICAgICAgcWFycmF5LnB1c2goX3NldEVzdGFkb3MoKSk7XG4gICAgICByZXR1cm4gJHEuYWxsKHFhcnJheSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgc2VydmljaW8nKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9pbml0QWNjID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVE9ETzogc2VyaWEgYnVlbm8gaW5pY2lhciBlc3RvcyBkZGwgc2luIHZhbG9yZXMsICBwZXJvIHRlbmRyaWEgcXVlIHZhbGlkYXIgcXVlIHNpIHNlIHNlbGVjY2lvbmUgYWxnbztcbiAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pdGVtID0ge1xuICAgICAgICBub21icmU6IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5ub21icmVzWzBdLFxuICAgICAgICBlc3RhZG86IGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0RGF0YS5lc3RhZG9zWzBdLFxuICAgICAgICBjYW50aWRhZDogYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmluaXREYXRhLmNhbnRpZGFkZXNbMF0sXG4gICAgICAgIHZhbG9yOiAwLFxuICAgICAgICBtYXJjYTogJycsXG4gICAgICAgIHJlZmVyZW5jaWE6ICcnLFxuICAgICAgICBpbWc6IHtcbiAgICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgICBzeW5jOiBmYWxzZSxcbiAgICAgICAgICBvblVwbG9hZDogZmFsc2UsXG4gICAgICAgICAgaWRpbnNwZWNjaW9uOiBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW07XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLnBsYWNhLFxuICAgICAgICBvYmoubm9tYnJlLmxhYmVsLFxuICAgICAgICBvYmouZXN0YWRvLmxhYmVsLFxuICAgICAgICBwYXJzZUludChvYmouY2FudGlkYWQudmFsdWUpLFxuICAgICAgICBvYmoubWFyY2EsXG4gICAgICAgIG9iai5yZWZlcmVuY2lhLFxuICAgICAgICBvYmoudmFsb3IsXG4gICAgICAgIG9iai5pbWcucGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgIH07XG4gICAgdmFyIF9zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ0lOU0VSVCBJTlRPIFtpZGFjY2Vzb3Jpb3NdIChbaWRpbnNwZWNjaW9uXSAsW3BsYWNhXSAsW25vbWJyZV0gLFtlc3RhZG9dICxbY2FudGlkYWRdICxbbWFyY2FdICxbcmVmZXJlbmNpYV0sW3ZhbG9yXSxbaW1nU3JjXSkgVkFMVUVTICAoPyw/LD8sPyw/LD8sPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmcoYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRJdGVtcygpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3J0bkJpbmRpbmdVcGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLnRleHQsXG4gICAgICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZGl0ZW1cbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlU2luZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRwcm9waWVkYWRlc10gc2V0IFtpZG9wY2lvbl09PyAsIFtzZWxlY2Npb25dPSA/IFdIRVJFIFtpZGluc3BlY2Npb25dPT8gYW5kIFtpZGl0ZW1dPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmdVcGRhdGUoYWNjZXNvcmlvc1NlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzaW5nbGUnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5nZXRJdGVtcyA9IF9nZXRJdGVtcztcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkudXBkYXRlU2luZ2xlID0gX3VwZGF0ZVNpbmdsZTtcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3Rvcnkuc2F2ZSA9IF9zYXZlO1xuICAgIGFjY2Vzb3Jpb3NTZXJ2aWNlRmFjdG9yeS5pbml0T3B0aW9ucyA9IF9pbml0T3B0aW9ucztcbiAgICBhY2Nlc29yaW9zU2VydmljZUZhY3RvcnkuaW5pdEFjYyA9IF9pbml0QWNjO1xuICAgIHJldHVybiBhY2Nlc29yaW9zU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlJywgW1xuICAnJHEnLFxuICAnJGluamVjdG9yJyxcbiAgJyRsb2NhdGlvbicsXG4gICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRxLCAkaW5qZWN0b3IsICRsb2NhdGlvbiwgbG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBhdXRoSW50ZXJjZXB0b3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfcmVxdWVzdCA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgYXV0aERhdGEudG9rZW47XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uZmlnO1xuICAgIH07XG4gICAgdmFyIF9yZXNwb25zZUVycm9yID0gZnVuY3Rpb24gKHJlamVjdGlvbikge1xuICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICB2YXIgYXV0aFNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgICAgaWYgKGF1dGhEYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcmVmcmVzaCcpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgIH07XG4gICAgYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3RvcnkucmVxdWVzdCA9IF9yZXF1ZXN0O1xuICAgIGF1dGhJbnRlcmNlcHRvclNlcnZpY2VGYWN0b3J5LnJlc3BvbnNlRXJyb3IgPSBfcmVzcG9uc2VFcnJvcjtcbiAgICByZXR1cm4gYXV0aEludGVyY2VwdG9yU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdhdXRoU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgJyRxJyxcbiAgJ2xvY2FsU3RvcmFnZVNlcnZpY2UnLFxuICAnbmdBdXRoU2V0dGluZ3MnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkaHR0cCwgJHEsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIG5nQXV0aFNldHRpbmdzLCBtb21lbnRTZXJ2aWNlKSB7XG4gICAgdmFyIHNlcnZpY2VCYXNlID0gbmdBdXRoU2V0dGluZ3MuYXBpU2VydmljZUJhc2VVcmk7XG4gICAgdmFyIGF1dGhTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfYXV0aGVudGljYXRpb24gPSB7XG4gICAgICBpc0F1dGg6IGZhbHNlLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgdXNlUmVmcmVzaFRva2VuczogZmFsc2UsXG4gICAgICBsYXN0TG9naW5nOiAnJ1xuICAgIH07XG4gICAgdmFyIF9leHRlcm5hbEF1dGhEYXRhID0ge1xuICAgICAgcHJvdmlkZXI6ICcnLFxuICAgICAgdXNlck5hbWU6ICcnLFxuICAgICAgZXh0ZXJuYWxBY2Nlc3NUb2tlbjogJydcbiAgICB9O1xuICAgIHZhciBfc2F2ZVJlZ2lzdHJhdGlvbiA9IGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcbiAgICAgIF9sb2dPdXQoKTtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ2FwaS9hY2NvdW50L3JlZ2lzdGVyJywgcmVnaXN0cmF0aW9uKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfbG9naW4gPSBmdW5jdGlvbiAobG9naW5EYXRhKSB7XG4gICAgICB2YXIgZGF0YSA9ICdncmFudF90eXBlPXBhc3N3b3JkJnVzZXJuYW1lPScgKyBsb2dpbkRhdGEudXNlck5hbWUgKyAnJnBhc3N3b3JkPScgKyBsb2dpbkRhdGEucGFzc3dvcmQgKyAnJmNsaWVudF9pZD0nICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XG4gICAgICAvL3NpZW1wcmUgdm95IGEgbWFuZGFyIGVsIGNsaWVudGlkXG4gICAgICAvKmlmIChsb2dpbkRhdGEudXNlUmVmcmVzaFRva2Vucykge1xyXG4gICAgICAgICAgIGRhdGEgPSBkYXRhICsgXCImY2xpZW50X2lkPVwiICsgbmdBdXRoU2V0dGluZ3MuY2xpZW50SWQ7XHJcbiAgICAgICB9Ki9cbiAgICAgIC8vdGVuZ28gcXVlIHJldmlzYXIgbG9zIGNyb3NzIG9yaWdpbiwgZW4gbGEgYmFzZSBkZSBkYXRvcyAsIHkgaGFiaWxpdGFybG8gZW4gZWwgbmF2ZWdhZG9yIGNocm9tZSAsIGltcG9ydGFudGVcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgZCA9IG1vbWVudCgpO1xuICAgICAgJGh0dHAucG9zdChzZXJ2aWNlQmFzZSArICd0b2tlbicsIGRhdGEsIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKVxuICAgICAgICBycCA9IHJlc3BvbnNlO1xuICAgICAgICBpZiAobG9naW5EYXRhLnVzZVJlZnJlc2hUb2tlbnMpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgdXNlck5hbWU6IGxvZ2luRGF0YS51c2VyTmFtZSxcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2UucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgIHVzZVJlZnJlc2hUb2tlbnM6IHRydWUsXG4gICAgICAgICAgICBsYXN0TG9naW46IGQgIC8vICxcbiAgICAgICAgICAgICAgIC8vIGV4cDptb21lbnQocmVzcG9uc2UuLmV4cGlyZXMpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuLFxuICAgICAgICAgICAgZXhwOiBtb21lbnRTZXJ2aWNlLmFkZFNlY29uZHMocmVzcG9uc2UuZXhwaXJlc19pbilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICB0b2tlbjogcmVzcG9uc2UuYWNjZXNzX3Rva2VuLFxuICAgICAgICAgICAgdXNlck5hbWU6IGxvZ2luRGF0YS51c2VyTmFtZSxcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogJycsXG4gICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3RMb2dpbjogZCAgLy8gLFxuICAgICAgICAgICAgICAgLy8gZXhwOm1vbWVudChyZXNwb25zZS4uZXhwaXJlcykuZm9ybWF0KCdZWVlZLU1NLUREJylcbixcbiAgICAgICAgICAgIGV4cDogbW9tZW50U2VydmljZS5hZGRTZWNvbmRzKHJlc3BvbnNlLmV4cGlyZXNfaW4pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi5sYXN0TG9naW5nID0gbW9tZW50KCk7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IGxvZ2luRGF0YS51c2VyTmFtZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZVJlZnJlc2hUb2tlbnMgPSBsb2dpbkRhdGEudXNlUmVmcmVzaFRva2VucztcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyLCBzdGF0dXMpIHtcbiAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX2xvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2UucmVtb3ZlKCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IGZhbHNlO1xuICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gJyc7XG4gICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgIH07XG4gICAgdmFyIF9maWxsQXV0aERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXV0aERhdGEgPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgIGlmIChhdXRoRGF0YSkge1xuICAgICAgICBfYXV0aGVudGljYXRpb24uaXNBdXRoID0gdHJ1ZTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLnVzZXJOYW1lID0gYXV0aERhdGEudXNlck5hbWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VSZWZyZXNoVG9rZW5zID0gYXV0aERhdGEudXNlUmVmcmVzaFRva2VucztcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBfcmVmcmVzaFRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgIHZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xuICAgICAgaWYgKGF1dGhEYXRhKSB7XG4gICAgICAgIGlmIChhdXRoRGF0YS51c2VSZWZyZXNoVG9rZW5zKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSAnZ3JhbnRfdHlwZT1yZWZyZXNoX3Rva2VuJnJlZnJlc2hfdG9rZW49JyArIGF1dGhEYXRhLnJlZnJlc2hUb2tlbiArICcmY2xpZW50X2lkPScgKyBuZ0F1dGhTZXR0aW5ncy5jbGllbnRJZDtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgnYXV0aG9yaXphdGlvbkRhdGEnKTtcbiAgICAgICAgICAkaHR0cC5wb3N0KHNlcnZpY2VCYXNlICsgJ3Rva2VuJywgZGF0YSwgeyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9IH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICAgIHVzZXJOYW1lOiByZXNwb25zZS51c2VyTmFtZSxcbiAgICAgICAgICAgICAgcmVmcmVzaFRva2VuOiByZXNwb25zZS5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICAgICAgX2xvZ091dCgpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdmFyIF9vYnRhaW5BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uIChleHRlcm5hbERhdGEpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5nZXQoc2VydmljZUJhc2UgKyAnYXBpL2FjY291bnQvT2J0YWluTG9jYWxBY2Nlc3NUb2tlbicsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgcHJvdmlkZXI6IGV4dGVybmFsRGF0YS5wcm92aWRlcixcbiAgICAgICAgICBleHRlcm5hbEFjY2Vzc1Rva2VuOiBleHRlcm5hbERhdGEuZXh0ZXJuYWxBY2Nlc3NUb2tlblxuICAgICAgICB9XG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IHJlc3BvbnNlLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfcmVnaXN0ZXJFeHRlcm5hbCA9IGZ1bmN0aW9uIChyZWdpc3RlckV4dGVybmFsRGF0YSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLnBvc3Qoc2VydmljZUJhc2UgKyAnYXBpL2FjY291bnQvcmVnaXN0ZXJleHRlcm5hbCcsIHJlZ2lzdGVyRXh0ZXJuYWxEYXRhKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldCgnYXV0aG9yaXphdGlvbkRhdGEnLCB7XG4gICAgICAgICAgdG9rZW46IHJlc3BvbnNlLmFjY2Vzc190b2tlbixcbiAgICAgICAgICB1c2VyTmFtZTogcmVzcG9uc2UudXNlck5hbWUsXG4gICAgICAgICAgcmVmcmVzaFRva2VuOiAnJyxcbiAgICAgICAgICB1c2VSZWZyZXNoVG9rZW5zOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgX2F1dGhlbnRpY2F0aW9uLmlzQXV0aCA9IHRydWU7XG4gICAgICAgIF9hdXRoZW50aWNhdGlvbi51c2VyTmFtZSA9IHJlc3BvbnNlLnVzZXJOYW1lO1xuICAgICAgICBfYXV0aGVudGljYXRpb24udXNlUmVmcmVzaFRva2VucyA9IGZhbHNlO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIsIHN0YXR1cykge1xuICAgICAgICBfbG9nT3V0KCk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5zYXZlUmVnaXN0cmF0aW9uID0gX3NhdmVSZWdpc3RyYXRpb247XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmxvZ2luID0gX2xvZ2luO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5sb2dPdXQgPSBfbG9nT3V0O1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5maWxsQXV0aERhdGEgPSBfZmlsbEF1dGhEYXRhO1xuICAgIGF1dGhTZXJ2aWNlRmFjdG9yeS5hdXRoZW50aWNhdGlvbiA9IF9hdXRoZW50aWNhdGlvbjtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVmcmVzaFRva2VuID0gX3JlZnJlc2hUb2tlbjtcbiAgICBhdXRoU2VydmljZUZhY3Rvcnkub2J0YWluQWNjZXNzVG9rZW4gPSBfb2J0YWluQWNjZXNzVG9rZW47XG4gICAgYXV0aFNlcnZpY2VGYWN0b3J5LmV4dGVybmFsQXV0aERhdGEgPSBfZXh0ZXJuYWxBdXRoRGF0YTtcbiAgICBhdXRoU2VydmljZUZhY3RvcnkucmVnaXN0ZXJFeHRlcm5hbCA9IF9yZWdpc3RlckV4dGVybmFsO1xuICAgIHJldHVybiBhdXRoU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjaGVja0ZpbGVTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFGaWxlJyxcbiAgJyRxJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZSwgJHEpIHtcbiAgICB2YXIgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZUVudHJ5ID0gRmlsZUVudHJ5O1xuICAgICAgRmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgY2hlY2tGaWxlU2VydmljZUZhY3RvcnkuZmlsZSA9IGZpbGU7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2YXIgX2NoZWNrRmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgLy8gdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNoZWNrRmlsZShwYXRoLCBGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIHJldHVybiBfZmlsZURldGFpbChGaWxlRW50cnkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjaGVja0ZpbGVTZXJ2aWNlRmFjdG9yeS5jaGVja0ZpbGUgPSBfY2hlY2tGaWxlO1xuICAgIGNoZWNrRmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVEZXRhaWwgPSBfZmlsZURldGFpbDtcbiAgICByZXR1cm4gY2hlY2tGaWxlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdjb3B5RmlsZVNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNvcHlGaWxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICAvLyB2YXIgX2ZpbGVEZXRhaWwgPSBmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgLy8gICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIC8vICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICBGaWxlRW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgIC8vICAgICBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGUgPSBmaWxlO1xuICAgIC8vICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgLy8gICB9LCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIC8vIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChtZWRpYVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gbWVkaWFVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgLy8gdmFyIHBhdGg9Y29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeTsgLy8gaW1hZ2VuZXMgY29yZG92YS5maWxlLmV4dGVybmFsQ2FjaGVEaXJlY3RvcnlcbiAgICAgIHZhciBwYXRoID0gbWVkaWFVUkkuc3Vic3RyaW5nKDAsIG1lZGlhVVJJLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhdGgpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gRmlsZU5hbWU7XG4gICAgICAvLyAnbmV3XycgKyBGaWxlTmFtZTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGUuY29weUZpbGUocGF0aCwgRmlsZU5hbWUsIGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBuZXdGaWxlTmFtZSkudGhlbihmdW5jdGlvbiAoRmlsZUVudHJ5KSB7XG4gICAgICAgIC8vIHJldHVybiBjb3B5RmlsZVNlcnZpY2VGYWN0b3J5LmZpbGVFbnRyeT1GaWxlRW50cnk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmZpbGVEZXRhaWwoRmlsZUVudHJ5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29weUZpbGVTZXJ2aWNlRmFjdG9yeS5jb3B5RmlsZSA9IF9jb3B5RmlsZTtcbiAgICByZXR1cm4gY29weUZpbGVTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2NvcmRvdmFFdmVudHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBvbmxpbmVTdGF0dXNTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlLCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciBjb3Jkb3ZhRXZlbnRzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdmFyIF9vblJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZXN1bWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgYXBwbGljYXRpb24gaXMgcmVzdW1pbmcgZnJvbSB0aGUgYmFja2dyb3VuZCcpO1xuICAgICAgfSwgMCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuICB2YXIgX29uUGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9jYWxsWnluYygpO1xuICAgICAgICBjb25zb2xlLmxvZygnVGhlIGFwcGxpY2F0aW9uIGlzIHBhdXNpbmcgdG8gdGhlIGJhY2tncm91bmQnKTtcbiAgICAgIH0sIDApO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcbiAgdmFyIF9jYWxsWnluYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBldmFsdWFyIHRvZGFzIGxhcyBwb3NpYmlsaWRhZGVzIGRlIGVzdG8gYWNhLCBwb3IgcXVlIHNpIGxhIHNlw7FhbCBlcyBtdXkgbWFsYSBxdWUgcHVlZGUgcGFzYXIsIGF1bnF1ZSBlbCB6eW5jIGRlIGJhc2VzIGRlIGRhdG9zIG51bmNhIGhhc2lkbyBtdXkgZ3JhbmRlIGVuIGluZm9ybWFjaW9uXG4gICAgaWYgKG9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSAmJiAhaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlzVGFraW5nUGljICYmICFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaXNUYWtpbmdWaWQpIHtcbiAgICAgIHp1bWVyb1NlcnZpY2UuenluYygxKTtcbiAgICB9XG4gIH07XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblBhdXNlID0gX29uUGF1c2U7XG4gIGNvcmRvdmFFdmVudHNTZXJ2aWNlRmFjdG9yeS5vblJlc3VtZSA9IF9vblJlc3VtZTtcbiAgLy8gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5LmNhbGxaeW5jID0gX2NhbGxaeW5jO1xuICByZXR1cm4gY29yZG92YUV2ZW50c1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ2NyZWF0ZURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUZpbGUsICRxLCBjaGVja0ZpbGVTZXJ2aWNlKSB7XG4gICAgdmFyIGNyZWF0ZURpclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9jcmVhdGVEaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNyZWF0ZURpcihjb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgZGlyKS50aGVuKGZ1bmN0aW9uIChzdWNjZXMpIHtcbiAgICAgICAgcmV0dXJuIHN1Y2NlcztcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY3JlYXRlRGlyU2VydmljZUZhY3RvcnkuY3JlYXRlRGlyID0gX2NyZWF0ZURpcjtcbiAgICByZXR1cm4gY3JlYXRlRGlyU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gKCRjb3Jkb3ZhRGV2aWNlKSB7XG4gIHZhciBkZXZpY2VTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3NldEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgZGV2aWNlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGRldmljZTogJGNvcmRvdmFEZXZpY2UuZ2V0RGV2aWNlKCksXG4gICAgICBjb3Jkb3ZhOiAkY29yZG92YURldmljZS5nZXRDb3Jkb3ZhKCksXG4gICAgICBtb2RlbDogJGNvcmRvdmFEZXZpY2UuZ2V0TW9kZWwoKSxcbiAgICAgIHBsYXRmb3JtOiAkY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpLFxuICAgICAgdXVpZDogJGNvcmRvdmFEZXZpY2UuZ2V0VVVJRCgpLFxuICAgICAgdmVyc2lvbjogJGNvcmRvdmFEZXZpY2UuZ2V0VmVyc2lvbigpXG4gICAgfTtcbiAgfTtcbiAgZGV2aWNlU2VydmljZUZhY3Rvcnkuc2V0SW5mbyA9IF9zZXRJbmZvO1xuICByZXR1cm4gZGV2aWNlU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZWFzeURpclNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlKSB7XG4gICAgdmFyIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfY3JlYXRlRGlyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvZGF5ID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICB2YXIgQ3VycmVudERhdGUgPSBtb21lbnQoKS51bml4KCk7XG4gICAgICAkY29yZG92YUZpbGUuY2hlY2tEaXIoY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIHRvZGF5KS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbHJlYWR5ZXhpc3QnKTsgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAkY29yZG92YUZpbGUuY3JlYXRlRGlyKGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCB0b2RheSwgZmFsc2UpLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGlyIGNyZWF0ZWQnLCB0b2RheSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY3JlYXRlZCBkaXInLCB0b2RheSk7XG4gICAgICAgIH0pOyAgLy8gZXJyb3JcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZWFzeURpclNlcnZpY2VGYWN0b3J5LmNyZWF0ZURpciA9IF9jcmVhdGVEaXI7XG4gICAgcmV0dXJuIGVhc3lEaXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2Vycm9yU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgZXJyb3JTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2NvbnNvbGVFcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gIH07XG4gIGVycm9yU2VydmljZUZhY3RvcnkuY29uc29sZUVycm9yID0gX2NvbnNvbGVFcnJvcjtcbiAgcmV0dXJuIGVycm9yU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZmlsZVRyYW5zZmVyU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhRmlsZVRyYW5zZmVyJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhRmlsZVRyYW5zZmVyKSB7XG4gICAgdmFyIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3Rvcnkuc2V0VGltZU91dCA9IDE3MDAwO1xuICAgIHZhciBfZmlsZVVwbG9hZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBGaWxlTmFtZSA9IG9iai5wYXRoLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKTtcbiAgICAgIGNvbnNvbGUubG9nKEZpbGVOYW1lKTtcbiAgICAgIHZhciBmaWxlRXh0ID0gb2JqLnBhdGguc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdleHRlbnNpb24nLCBmaWxlRXh0KTtcbiAgICAgIHZhciBtaW1ldHlwZSA9ICdpbWFnZS9qcGVnJztcbiAgICAgIC8vIGZpbGVUcmFuc2ZlclNlcnZpY2VGYWN0b3J5LnNldFRpbWVPdXQgPSAyMDAwMDtcbiAgICAgIGlmIChmaWxlRXh0ID09PSAnbXA0Jykge1xuICAgICAgICBtaW1ldHlwZSA9ICd2aWRlby9tcDQnO1xuICAgICAgICBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0ID0gNjAwMDA7XG4gICAgICB9XG4gICAgICB2YXIgc2VydmVyID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzOC9hdXRoL2FwaS9maWxlJztcbiAgICAgIC8vICdodHRwczovL3d3dy5hanVzdGV2c2l2YS5jb20vYXV0aC9hcGkvZmlsZSc7XG4gICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgb3B0aW9ucy5maWxlS2V5ID0gJ2ZpbGUnO1xuICAgICAgb3B0aW9ucy5maWxlTmFtZSA9IG9iai5wYXRoLnN1YnN0cihvYmoucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBvcHRpb25zLm1pbWVUeXBlID0gbWltZXR5cGU7XG4gICAgICAvKnZhciBhdXRoRGF0YSA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCdhdXRob3JpemF0aW9uRGF0YScpO1xyXG4gICAgICAgaWYgKGF1dGhEYXRhKSB7XHJcbiAgICAgICAgIHZhciBoZWFkZXJzID0geyAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuIH07XHJcbiAgICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IGhlYWRlcnM7XHJcbiAgICAgICB9Ki9cbiAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgIHBhcmFtcy5wYXRoRmlsZVNlcnZlciA9IG9iai5ydXRhU3J2LnN1YnN0cmluZygwLCBvYmoucnV0YVNydi5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICAvLyAnMjAxNS9NYXJjaC8xOC9QUlVFQkE3MDAnO1xuICAgICAgLy8gdXJsOy8vVXBQcm9taXNlLnBhdGhGaWxlU2VydmVyO1xuICAgICAgcGFyYW1zLnZhbHVlMiA9ICdwYXJhbSc7XG4gICAgICBvcHRpb25zLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgIC8vIFRPRE86IGRlZmluaXIgdW4gc2VydmljaW8gcGFyYSBzZXQgZWwgdGltZW91dCBkZXBlbmRpZW5kbyBzaSBlcyBmb3RvIG8gdmlkZW87XG4gICAgICBvcHRpb25zLnRpbWVvdXQgPSBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeS5zZXRUaW1lT3V0O1xuICAgICAgLy8kc2NvcGUuZGF0YS50aW1lb3V0O1xuICAgICAgLy81MDA7Ly8zMDAwMDsvL21pbGlzZWNvbmRzXG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgIHJldHVybiAkY29yZG92YUZpbGVUcmFuc2Zlci51cGxvYWQoc2VydmVyLCBvYmoucGF0aCwgb3B0aW9ucykudGhlbihmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgICBjb25zb2xlLmxvZygnc3VjY2VzIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgIC8vIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICByZXR1cm4gc3VjY2VzczsgIC8vVE9ETzogdmVyaWZpY2FyIHNpIHB1ZWRvIHBvbmVyIGVsIGVycm9yIGFjYSB5IGRpc3BhcmFyIGVsIG9vZmxpbmVtb2RlIGRlc2RlIGFjYSB5IG5vIGRlc2RlIHRvZG9zIGxvcyBjb250cm9sbGVyc1xuICAgICAgfSAgLy8gVE9ETzogc2kgZWplY3V0byBlbiBlbCBzZXJ2aWNpbyBubyBsbGVnYSBhbCBjb250cm9sYWRvciwgYXVucXVlIHBvZHJpYSBoYWNlciB1bmEgcHJhY3RpY2EgcGFyYSBkZWZpbmlyIGxvcyBwYXJhbWV0cm9zIGRlIGFmdGVydXBsb2FkIGFxdWkgbWlzbW8sIHkgcXVlZGEgbXVjaG8gbWVqb3JcbiAgICAgICAgIC8vICwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgIC8vICAgY29uc29sZS5sb2coJ2Vycm9yIGVuIGVsIHNlcnZpY2lvJyk7XG4gICAgICAgICAvLyB9XG4pO1xuICAgIH07XG4gICAgZmlsZVRyYW5zZmVyU2VydmljZUZhY3RvcnkuZmlsZVVwbG9hZCA9IF9maWxlVXBsb2FkO1xuICAgIHJldHVybiBmaWxlVHJhbnNmZXJTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZpcnN0SW5pdFNlcnZpY2UnLCBbXG4gICckY29yZG92YUZpbGUnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICAnJGxvY2FsU3RvcmFnZScsXG4gICd6dW1lcm9TZXJ2aWNlJyxcbiAgJyRpb25pY0xvYWRpbmcnLFxuICBmdW5jdGlvbiAoJGNvcmRvdmFGaWxlLCAkcSwgY2hlY2tGaWxlU2VydmljZSwgbW9tZW50U2VydmljZSwgb25saW5lU3RhdHVzU2VydmljZSwgJGxvY2FsU3RvcmFnZSwgenVtZXJvU2VydmljZSwgJGlvbmljTG9hZGluZykge1xuICAgIHZhciBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZhciBfc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7IHRlbXBsYXRlOiAnPHNwYW4+SW5pY2lhbGl6YW5kbzwvc3Bhbj48aW9uLXNwaW5uZXIgaWNvbj1cImFuZHJvaWRcIj48L2lvbi1zcGlubmVyPicgfSk7XG4gICAgfTtcbiAgICB2YXIgX2hpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICB9O1xuICAgIHZhciBfaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxID0gJHEuZGVmZXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhbmRvIG9iaiBsb2NhbHN0b3JhZ2UnKTtcbiAgICAgIGlmIChvbmxpbmVTdGF0dXNTZXJ2aWNlLmRhdGEuaXNPbmxpbmUpIHtcbiAgICAgICAgX3Nob3coKTtcbiAgICAgICAgenVtZXJvU2VydmljZS56eW5jKDEpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmaXJzdCBpbml0IG9rJyk7XG4gICAgICAgICAgJGxvY2FsU3RvcmFnZS5kYXRhID0ge1xuICAgICAgICAgICAgbGFzdERpckNyZWF0ZWQ6ICcnLFxuICAgICAgICAgICAgZmlyc3RaeW5jOiBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKClcbiAgICAgICAgICB9O1xuICAgICAgICAgIF9oaWRlKCk7XG4gICAgICAgICAgcS5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2ZpcnN0IGluaXQgZXJyb3InLCBlKTtcbiAgICAgICAgICBfaGlkZSgpO1xuICAgICAgICAgIHEucmVqZWN0KGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHEucmVqZWN0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcS5wcm9taXNlO1xuICAgIH07XG4gICAgZmlyc3RJbml0U2VydmljZUZhY3RvcnkuaW5pdCA9IF9pbml0O1xuICAgIHJldHVybiBmaXJzdEluaXRTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ2ZvY3VzJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBmb2N1c0ZhY3RvcnkgPSB7fTtcbiAgdmFyIF9mb2N1cyA9IGZ1bmN0aW9uIChpZCkge1xuICAgIC8vIHRpbWVvdXQgbWFrZXMgc3VyZSB0aGF0IGlzIGludm9rZWQgYWZ0ZXIgYW55IG90aGVyIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcbiAgICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcbiAgICAvLyBhcmUgdHJpZ2dlcmVkLlxuICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBmb2N1c0ZhY3RvcnkuZm9jdXMgPSBfZm9jdXM7XG4gIHJldHVybiBmb2N1c0ZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnZm90b3NTZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJGNvcmRvdmFGaWxlJyxcbiAgJ3NxbGl0ZVNlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICdtb21lbnRTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhQ2FtZXJhLCAkY29yZG92YUZpbGUsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UpIHtcbiAgICB2YXIgZm90b3NTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zID0gW107XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5uYW1lcyA9IFtdO1xuICAgIC8vIFt7XG4gICAgLy8gICAgIHBsYWNhOiAnQUJDMTExJyxcbiAgICAvLyAgICAgc3JjOiAnJyxcbiAgICAvLyAgICAgc3luYzogZmFsc2VcbiAgICAvLyAgIH1dO1xuICAgIHZhciBfcmVtb3ZlID0gZnVuY3Rpb24gKHBsYWNhKSB7XG4gICAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcy5zcGxpY2UoZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MuaW5kZXhPZihwbGFjYSksIDEpO1xuICAgIH07XG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3M7XG4gICAgfTtcbiAgICB2YXIgX3Rha2VkcGljID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHF1YWxpdHk6IDQ1LFxuICAgICAgICAvLzUwLFxuICAgICAgICBkZXN0aW5hdGlvblR5cGU6IENhbWVyYS5EZXN0aW5hdGlvblR5cGUuRklMRV9VUkksXG4gICAgICAgIHNvdXJjZVR5cGU6IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5DQU1FUkEsXG4gICAgICAgIC8vIGFsbG93RWRpdDogdHJ1ZSxcbiAgICAgICAgZW5jb2RpbmdUeXBlOiBDYW1lcmEuRW5jb2RpbmdUeXBlLkpQRUcsXG4gICAgICAgIHRhcmdldFdpZHRoOiAxMDAwLFxuICAgICAgICAvL2ltcG9ydGFudGUgY29uIDEwMCBzZSB2ZWlhIGhvcnJpYmxlXG4gICAgICAgIHRhcmdldEhlaWdodDogMTAwMCxcbiAgICAgICAgLy8gVE9ETzogcmV2aXNhciBwYXJhIHF1ZSBzaXJ2ZSBlc3RhIG9wY2lvblxuICAgICAgICAvLyBwb3BvdmVyT3B0aW9uczogQ2FtZXJhUG9wb3Zlck9wdGlvbnMsXG4gICAgICAgIHNhdmVUb1Bob3RvQWxidW06IGZhbHNlXG4gICAgICB9O1xuICAgICAgcmV0dXJuICRjb3Jkb3ZhQ2FtZXJhLmdldFBpY3R1cmUob3B0aW9ucykudGhlbihmdW5jdGlvbiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgcmV0dXJuIGltYWdlVVJJO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldFBob3RvcyA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24pIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3QgKiBmcm9tIGlkZm90b3Mgd2hlcmUgaWRpbnNwZWNjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbaWRpbnNwZWNjaW9uXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkucGhvdG9zID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICByZXR1cm4gX2dldE5hbWVzKCk7ICAvLyBjb25zb2xlLmxvZyhmb3Rvc1NlcnZpY2VGYWN0b3J5LnBob3Rvcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2dldE5hbWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgSWRUaXBvLCBOb21icmUsIFZhbG9yLCBPcmRlbiBGUk9NICBCYXNlX1RpcG9zIFdIRVJFIChJZE1hZXN0cm9UaXBvcyA9IDI1KSBvcmRlciBieSBOb21icmUnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGZvdG9zU2VydmljZUZhY3RvcnkubmFtZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7ICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm90b3NTZXJ2aWNlRmFjdG9yeS5waG90b3MpO1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9jb3B5RmlsZSA9IGZ1bmN0aW9uIChpbWFnZVVSSSkge1xuICAgICAgdmFyIEZpbGVOYW1lID0gaW1hZ2VVUkkucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgICAgY29uc29sZS5sb2coRmlsZU5hbWUpO1xuICAgICAgdmFyIG5ld0ZpbGVOYW1lID0gJ25ld18nICsgRmlsZU5hbWU7XG4gICAgICByZXR1cm4gJGNvcmRvdmFGaWxlLmNvcHlGaWxlKGNvcmRvdmEuZmlsZS5leHRlcm5hbENhY2hlRGlyZWN0b3J5LCBGaWxlTmFtZSwgY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG5ld0ZpbGVOYW1lKS50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBzdWNjZXNzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydEZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBpbWFnZVVSSSwgc3luYywgb25VcGxvYWQpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZGZvdG9zKGlkaW5zcGVjY2lvbiwgcGF0aCxzeW5jLHV1aWQsZGVsZXRlZCwgb25VcGxvYWQsIHBsYWNhLCBmZWNoYSwgcnV0YVNydikgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sID8pJztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgICBpbWFnZVVSSSxcbiAgICAgICAgc3luYyxcbiAgICAgICAgJ3Rlc3R1dWlkJyxcbiAgICAgICAgMCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYoaW1hZ2VVUkkpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IHN5bmM9PyAsIG9uVXBsb2FkPSA/IFdIRVJFIGlkaW5zcGVjY2lvbiA9PyBBTkQgcGF0aD0/JztcbiAgICAgIC8vIFRPRE86IGVsIGNhbXBvIGRlbGV0ZWQgZXMgYm9vbGVhbiAsIHBlcm8gZGViZSBhc2lnbmFyc2VsZSAxIG8gMFxuICAgICAgLy8gVE9ETzogIG11Y2hvIGN1aWRhZG8gcG9yIGVqZW1wbG8gZWwgcGF0aCBkZWJlIHNlciBudmFyY2hhcigpIE5PICBOQ0hBUlxuICAgICAgLy8gc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAgIG9uVXBsb2FkID0gb25VcGxvYWQgPyAxIDogMDtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBzeW5jLFxuICAgICAgICBvblVwbG9hZCxcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbixcbiAgICAgICAgcGF0aFxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmICghcmVzLnJvd3NBZmZlY3RlZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RoaW5nIHdhcyB1cGRhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLnJvd3NBZmZlY3RlZCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzdWNjZXNzZnVsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3NldE5hbWUgPSBmdW5jdGlvbiAoaWR0aXBvLCBmb3RvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkZm90b3Mgc2V0IGlkdGlwbz0/ICBXSEVSRSBpZGluc3BlY2Npb24gPT8gQU5EIHBhdGg9Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaWR0aXBvLFxuICAgICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uLFxuICAgICAgICBmb3RvLnBhdGhcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5yb3dzQWZmZWN0ZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB3YXMgdXBkYXRlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5yb3dzQWZmZWN0ZWQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUgc3VjY2Vzc2Z1bCcpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5yZW1vdmUgPSBfcmVtb3ZlO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuYWxsID0gX2FsbDtcbiAgICBmb3Rvc1NlcnZpY2VGYWN0b3J5LnRha2VkcGljID0gX3Rha2VkcGljO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkuY29weUZpbGUgPSBfY29weUZpbGU7XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5pbnNlcnRGb3RvID0gX2luc2VydEZvdG87XG4gICAgZm90b3NTZXJ2aWNlRmFjdG9yeS5nZXRQaG90b3MgPSBfZ2V0UGhvdG9zO1xuICAgIGZvdG9zU2VydmljZUZhY3RvcnkudXBkYXRlRm90byA9IF91cGRhdGVGb3RvO1xuICAgIGZvdG9zU2VydmljZUZhY3Rvcnkuc2V0TmFtZSA9IF9zZXROYW1lO1xuICAgIHJldHVybiBmb3Rvc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnZ2V0VmlkZW9TZXJ2aWNlJywgW1xuICAnJGNvcmRvdmFDYW1lcmEnLFxuICAnJHEnLFxuICAnY2hlY2tGaWxlU2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhbWVyYSwgJHEsIGNoZWNrRmlsZVNlcnZpY2UpIHtcbiAgICB2YXIgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIC8vZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnk9bnVsbDsvLyBwZXJkZXJpYSBsYSB1bHRpbWEgaW5mb3JtYWNpb24gc2kgbG8gdnVlbHZvIGEgcmVmZXJlbmNpYXI7XG4gICAgLy8gVE9ETzogIGVzdG8gc2UgZGViZSBkZSBsbGFtYXIgZGVudHJvIGRlIGxhIG1pc21hIGZ1bmNpb24sIHBvciBxdWUgc2kgbG8gaW5pY2lhbGl6YW1vcyBwb3IgZnVlcmEsIGVsIHB1Z2luIG5vIGhhIGNhcmdhZG8geSBvYnRlbmdvIGNhbWVyYSBpcyBub3QgZGVmaW5lZFxuICAgIC8vIHZhciBfZ2V0RmlsZUVudHJ5ID0gZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKHZpZGVvQ29udGVudFBhdGgpO1xuICAgIC8vICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAvLyAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHZpZGVvQ29udGVudFBhdGgsIGZ1bmN0aW9uIChGaWxlRW50cnkpIHtcbiAgICAvLyAgICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgPSBGaWxlRW50cnk7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAvLyAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgLy8gfTtcbiAgICAvLyBUT0RPOiBjcmVhdGUgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5maWxlRW50cnkgeSAuZmlsZSwgcGFyYSBkZXZvbHZlciBsYSBwcm9tZXNhIHNpbiBkYXRhIHkgcmVmZXJlbmNpYXIgZWwgY29udHJvbGFkb3IgY29uIGxhIHByb3BpZWRhZCBkZWRsIHNlcnZpY2lvIHRvZGQgbW90XG4gICAgdmFyIF9nZXRWaWRlb0NvbXByZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHNvdXJjZVR5cGU6IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5TQVZFRFBIT1RPQUxCVU0sXG4gICAgICAgIG1lZGlhVHlwZTogQ2FtZXJhLk1lZGlhVHlwZS5WSURFT1xuICAgICAgfTtcbiAgICAgIHJldHVybiAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHZpZGVvQ29udGVudFBhdGgpIHtcbiAgICAgICAgLy8gcmV0dXJuIF9nZXRGaWxlRW50cnkodmlkZW9Db250ZW50UGF0aCk7XG4gICAgICAgIHJldHVybiBjaGVja0ZpbGVTZXJ2aWNlLmNoZWNrRmlsZSh2aWRlb0NvbnRlbnRQYXRoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0VmlkZW9TZXJ2aWNlRmFjdG9yeS5nZXRWaWRlb0NvbXByZXNzID0gX2dldFZpZGVvQ29tcHJlc3M7XG4gICAgcmV0dXJuIGdldFZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCdncHNTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBlcnJvclNlcnZpY2UsICRsb2NhbFN0b3JhZ2UsIG1vbWVudFNlcnZpY2UsICRxLCBpbnRlcm1lZGlhdGVTZXJ2aWNlLCBzcWxpdGVTZXJ2aWNlKSB7XG4gIHZhciBncHNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2dwc0h0bWxQcm9taXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIG9wdCA9IHtcbiAgICAgIG1heGltdW1BZ2U6IDkwMDAwLFxuICAgICAgdGltZW91dDogMTUwMDAwLFxuICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgfTtcbiAgICAvL3ZhciBvcHQ9IHsgbWF4aW11bUFnZTogOTAwMDAsIHRpbWVvdXQ6IDMwMDAsIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSB9Oy8vdGFtYmllbiBzZSBwcm9ibyBjb24gMjIsIHBlcm8gc2UgYmFqYSBoYXN0YSAxM1xuICAgIC8vIGNvbnNvbGUubG9nKG5hdmlnYXRvciwgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbik7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAvL2JldGFkb3BhcmFwcnVlYmFzY29uc29sZS5sb2coXCJncHNIdG1sUHJvbWlzZSBcIiwgcmVzdWx0KVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIC8vIEFuIGVycm9yIG9jY3VyZWQuIFNob3cgYSBtZXNzYWdlIHRvIHRoZSB1c2VyXG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTsgIC8vJHNjb3BlLmRpYWxvZyhlcnIpO1xuICAgIH0sIG9wdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG4gIHZhciBfZ3BzSHRtbCA9IGZ1bmN0aW9uIChpZGluc3BlY2Npb24pIHtcbiAgICAvLyBUT0RPOiBhdW4gc2luIHdpIGZpIG5pIGRhdG9zIGVsIGdwcyBzaWd1ZSBmdW5jaW9uYW5kb1xuICAgIC8vIFRPRE86IHBvciBxdWUgbWUgZGlzcGFyYSBlbCB2ZW50byBkZSBvbiBvbmxpbmUsIG1hcyBxdWUgdG9kbyBjb24gZWwgd2lmaT8/Pz9cbiAgICBpZiAoISRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzIHx8IG1vbWVudFNlcnZpY2UuZGlmZk5vdygkbG9jYWxTdG9yYWdlLmxhdGVzdEdwcykgPiA3KSB7XG4gICAgICB2YXIgb3B0ID0ge1xuICAgICAgICBtYXhpbXVtQWdlOiAzMDAwLFxuICAgICAgICB0aW1lb3V0OiAxNTAwMDAsXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcbiAgICAgICAgX2luc2VydEdwc0xvZyhpZGluc3BlY2Npb24sIHBvc2l0aW9uLmNvb3Jkcyk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yLCBvcHQpO1xuICAgIH1cbiAgfTtcbiAgdmFyIF9pbnNlcnRHcHNMb2cgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBjb29yZHMpIHtcbiAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2dwc0xvZ3NdIChbaWRpbnNwZWNjaW9uXSAgICxbZmVjaGFdICxbYWNjdXJhY3ldICAsW2FsdGl0dWRlXSwgJztcbiAgICBxdWVyeSArPSAnW2FsdGl0dWRlQWNjdXJhY3ldICAsW2hlYWRpbmddICAsW2xhdGl0dWRlXSAsW2xvbmdpdHVkZV0sW3NwZWVkXSkgVkFMVUVTICg/LD8sPyw/LD8sPyw/LD8sPyknO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgaWRpbnNwZWNjaW9uLFxuICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgY29vcmRzLmFjY3VyYWN5LFxuICAgICAgY29vcmRzLmFsdGl0dWRlLFxuICAgICAgY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXG4gICAgICBjb29yZHMuaGVhZGluZyxcbiAgICAgIGNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgIGNvb3Jkcy5sb25naXR1ZGUsXG4gICAgICBjb29yZHMuc3BlZWRcbiAgICBdO1xuICAgIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICRsb2NhbFN0b3JhZ2UubGF0ZXN0R3BzID0gbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpO1xuICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICB9O1xuICBncHNTZXJ2aWNlRmFjdG9yeS5ncHNIdG1sUHJvbWlzZSA9IF9ncHNIdG1sUHJvbWlzZTtcbiAgZ3BzU2VydmljZUZhY3RvcnkuZ3BzSHRtbCA9IF9ncHNIdG1sO1xuICByZXR1cm4gZ3BzU2VydmljZUZhY3Rvcnk7XG59KTsiLCJhcHAuZmFjdG9yeSgnaW5zcGVjY2lvblNlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRxJyxcbiAgJyRmaWx0ZXInLFxuICAnZXJyb3JTZXJ2aWNlJyxcbiAgJ21vbWVudFNlcnZpY2UnLFxuICAnenVtZXJvU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcSwgJGZpbHRlciwgZXJyb3JTZXJ2aWNlLCBtb21lbnRTZXJ2aWNlLCB6dW1lcm9TZXJ2aWNlKSB7XG4gICAgdmFyIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2VjdGlvbnMgPSBbXTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gZmFsc2U7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbiA9IDA7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5Lml0ZW0gPSB7fTtcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICAgIGtpbG9tZXRyYWplOiAnJyxcbiAgICAgIG9ic2VydmFjaW9uOiAnJ1xuICAgIH07XG4gICAgdmFyIF9zZXRJdGVtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChwcmVJdGVtcywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogb2JqLmNvbnRyb2xKc29uWzBdLmlkLFxuICAgICAgICAgIGxhYmVsOiBvYmouY29udHJvbEpzb25bMF0udGV4dFxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJpbWVyJyk7XG4gICAgICAgIG9iai5zbCA9IHNsO1xuICAgICAgfSk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gcHJlSXRlbXM7XG4gICAgfTtcbiAgICB2YXIgX3NlY3Rpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LnNlY3Rpb25zID0gJGZpbHRlcignb3JkZXJCeScpKCRmaWx0ZXIoJ3VuaXF1ZScpKGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5hbGwsICdjdXN0b21zZWN0aW9uJyksICdjdXN0b21zZWN0aW9uJyk7XG4gICAgfTtcbiAgICB2YXIgX2dldEl0ZW1zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCAqIGZyb20gaWRpbnNwZWNjaW9uJztcbiAgICAgIHZhciBiaW5kaW5nID0gW107XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgX3NldEl0ZW1zKCk7XG4gICAgICBfc2VjdGlvbnMoKTtcbiAgICAgIC8vIFRPRE86IGxvZ2ljYSBwYXJhIHNhYmVyIHNpIHlhIGZ1ZSBjYWxpZmljYWRvXG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxyZWFkeVNhdmVkID0gZmFsc2U7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICBvYmouaWRzZXJ2aWNpbyxcbiAgICAgICAgb2JqLmlkaXRlbSxcbiAgICAgICAgb2JqLmlkUGFyZW50SXRlbSxcbiAgICAgICAgb2JqLm5vbWJyZSxcbiAgICAgICAgcGFyc2VJbnQob2JqLnNsLnZhbHVlKSxcbiAgICAgICAgb2JqLnNsLmxhYmVsXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfTtcbiAgICB2YXIgX3NhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcWFycmF5ID0gW107XG4gICAgICBxYXJyYXkucHVzaChfaW5zZXJ0QWxsSXRlbXMoKSk7XG4gICAgICBxYXJyYXkucHVzaChfaW5zZXJ0T2JzZXJ2YWNpb24oKSk7XG4gICAgICBxYXJyYXkucHVzaChfaW5zZXJ0S2lsb21ldHJhamUoKSk7XG4gICAgICByZXR1cm4gJHEuYWxsKHFhcnJheSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1ZWx0YXMgbGFzIDMgcHJvbWVzYXMgZW4gZWwgc2VydmljaW8gaW5zcGVjY2lvbicpO1xuICAgICAgICByZXR1cm4gX3VwZGF0ZUlkQ2xhc2VDYXJyb2NlcmlhKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTsgIC8vIHJldHVybiBzcWxpdGVTZXJ2aWNlLmluc2VydENvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAvLyBjb25zb2xlLmxvZygnaW5ncmVzbyBvaycsIHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0QWxsSXRlbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkcHJvcGllZGFkZXNdIChbaWRpbnNwZWNjaW9uXSAsW2lkc3VicHJvY2Vzb10gLFtpZGl0ZW1dLFtpZHBhcmVudGl0ZW1dICAsW25vbWJyZV0gLFtpZG9wY2lvbl0gICxbc2VsZWNjaW9uXSApIFZBTFVFUyAoPyw/LD8sPyw/LD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmdzID0gW107XG4gICAgICBhbmd1bGFyLmZvckVhY2goaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFsbCwgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIGJpbmRpbmdzLnB1c2goX3J0bkJpbmRpbmcob2JqKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmluc2VydENvbGxlY3Rpb24ocXVlcnksIGJpbmRpbmdzKTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0T2JzZXJ2YWNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW29ic2VydmFjaW9uZXNdIChbaWRpbnNwZWNjaW9uXSAsW2lkc3VicHJvY2Vzb10gICxbb2JzZXJ2YWNpb25dKSAgIFZBTFVFUyAoPyw/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uLFxuICAgICAgICA4MjksXG4gICAgICAgIC8vX2NsLnRpcG8sXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLm9ic2VydmFjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0S2lsb21ldHJhamUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2tpbG9tZXRyYWplc10gICAgICAgIChbaWRpbnNwZWNjaW9uXSwgW2tpbG9tZXRyYWplXSkgICAgICBWQUxVRVMgKD8sPyknO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5kYXRhLmtpbG9tZXRyYWplXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKTtcbiAgICB9O1xuICAgIHZhciBfcnRuQmluZGluZ1VwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChvYmouc2wudmFsdWUpLFxuICAgICAgICBvYmouc2wubGFiZWwsXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIG9iai5pZGl0ZW1cbiAgICAgIF07XG4gICAgICByZXR1cm4gYmluZGluZztcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlU2luZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1VQREFURSBbaWRwcm9waWVkYWRlc10gc2V0IFtpZG9wY2lvbl09PyAsIFtzZWxlY2Npb25dPSA/IFdIRVJFIFtpZGluc3BlY2Npb25dPT8gYW5kIFtpZGl0ZW1dPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gX3J0bkJpbmRpbmdVcGRhdGUoaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5Lml0ZW0pO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZSBzaW5nbGUnLCByZXMpO1xuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfY2wgPSB7XG4gICAgICBpZGNsYXNlOiBudWxsLFxuICAgICAgaWRjYXJyb2NlcmlhOiBudWxsLFxuICAgICAgdGlwbzogbnVsbFxuICAgIH07XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsYXNlcyA9IFtdO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jYXJyb2NlcmlhcyA9IFtdO1xuICAgIC8vIFRPRE86IHBhcmEgbGEgaW1wbGVtZW50YWNpb24gZGUgcGVzYWRvcyB5IG1vdG9zLCB5YSBzaSBkZWJlIHNlciB1bmEgY29uc3VsdGFcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkudGlwb3MgPSBbe1xuICAgICAgICB2YWx1ZTogODI5LFxuICAgICAgICBsYWJlbDogJ0xpdmlhbm9zJ1xuICAgICAgfSAgLy8gLFxuICAgICAgICAgLy8ge1xuICAgICAgICAgLy8gICB2YWx1ZTogODQ0LFxuICAgICAgICAgLy8gICBsYWJlbDogJ1Blc2Fkb3MnXG4gICAgICAgICAvLyB9XG5dO1xuICAgIHZhciBfZ2V0Q2xhc2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKF9jbC50aXBvKSAmJiBhbmd1bGFyLmlzTnVtYmVyKHBhcnNlSW50KF9jbC50aXBvKSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCAgZGlzdGluY3QgY2MuaWRjbGFzZSBhcyB2YWx1ZSAgLCBidC5Ob21icmUgYXMgbGFiZWwgIEZST00gY2xhc2VzX3RpcG9WZWhpY3VsbyBjdCAgaW5uZXIgam9pbiAgIGNsYXNlc19jYXJyb2NlcmlhcyBjYyBvbiBjYy5pZGNsYXNlPWN0LmlkY2xhc2UgICBpbm5lciBqb2luIEJhc2VfVGlwb3MgYnQgb24gYnQuSWRUaXBvPWNjLmlkY2xhc2UgIHdoZXJlIGN0LmlkdGlwb3ZlaGljdWxvPT8nO1xuICAgICAgICB2YXIgYmluZGluZyA9IFtwYXJzZUludChfY2wudGlwbyldO1xuICAgICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIC8vIFRPRE86IEFTSSBOTyBTSVJWRSAsIG5vIHNlIGFjdHVhbGl6YSBlbCBleHB1ZXN0byAsLF9jbGFzZXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsYXNlcyA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKTtcbiAgICAgICAgICBfY2wuaWRjbGFzZSA9IG51bGw7XG4gICAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNhcnJvY2VyaWFzID0gW107XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9nZXRDYXJyb2NlcmlhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChfY2wuaWRjbGFzZSkgJiYgYW5ndWxhci5pc051bWJlcihwYXJzZUludChfY2wuaWRjbGFzZSkpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgIGRpc3RpbmN0IGNjLmlkY2Fycm9jZXJpYSBhcyB2YWx1ZSAsIGJ0Lk5vbWJyZSBhcyBsYWJlbCAgRlJPTSAgICBjbGFzZXNfY2Fycm9jZXJpYXMgY2MgIGlubmVyIGpvaW4gQmFzZV9UaXBvcyBidCBvbiBidC5JZFRpcG89Y2MuaWRjYXJyb2NlcmlhICAgd2hlcmUgY2MuaWRjbGFzZT0/JztcbiAgICAgICAgdmFyIGJpbmRpbmcgPSBbcGFyc2VJbnQoX2NsLmlkY2xhc2UpXTtcbiAgICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2Fycm9jZXJpYXMgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgX2NsLmlkY2Fycm9jZXJpYSA9IG51bGw7XG4gICAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIF9zZXRJZENsYUNhID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHF1ZXJ5ID0gJ1NFTEVDVCBbaWRjbGFzZWNhcnJvY2VyaWFdICxbaWRjbGFzZV0gLFtpZGNhcnJvY2VyaWFdICAsW2lkY29kaWdvY2FsaWZpY2FjaW9uXSAgLFtpZGV4dHJhaW5mb10gICBGUk9NIFtjbGFzZXNfY2Fycm9jZXJpYXNdIFdIRVJFIGlkY2xhc2U9PyBhbmQgaWRjYXJyb2NlcmlhPT8gJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBwYXJzZUludChfY2wuaWRjbGFzZSksXG4gICAgICAgIHBhcnNlSW50KF9jbC5pZGNhcnJvY2VyaWEpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpWzBdLmlkY2xhc2VjYXJyb2NlcmlhO1xuICAgICAgICByZXR1cm4gX2dldFRvSW5zcGVjdChzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcylbMF0uaWRjb2RpZ29jYWxpZmljYWNpb24pO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX3NldEpzb24gPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFsdWUuY29udHJvbEpzb24gPSBhbmd1bGFyLmZyb21Kc29uKHZhbHVlLmNvbnRyb2xKc29uKTtcbiAgICAgICAgdmFyIHNsID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZS5jb250cm9sSnNvblswXS52YWx1ZSxcbiAgICAgICAgICBsYWJlbDogdmFsdWUuY29udHJvbEpzb25bMF0ubGFiZWxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICB2YWx1ZS5zbCA9IHNsO1xuICAgICAgfSk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gYXJyYXk7XG4gICAgfTtcbiAgICB2YXIgX3NldEFscmVhZHlJbnNwZWN0SnNvbiA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YWx1ZS5jb250cm9sSnNvbiA9IGFuZ3VsYXIuZnJvbUpzb24odmFsdWUuY29udHJvbEpzb24pO1xuICAgICAgICAvLyBUT0RPOiBlbCBqc29uIGRlIGNvbnRyb2xKc29uIGRldnVlbHZlIHVuIHZhbHVlPSBcIlwiIHN0cmluZywgdmVyIHNpIHNlIHB1ZWRlIG1lam9yYXI7XG4gICAgICAgIHZhciBzbCA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUudmFsdWUudG9TdHJpbmcoKSxcbiAgICAgICAgICBsYWJlbDogdmFsdWUubGFiZWxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3ByaW1lcicpO1xuICAgICAgICB2YWx1ZS5zbCA9IHNsO1xuICAgICAgfSk7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuYWxsID0gYXJyYXk7XG4gICAgfTtcbiAgICB2YXIgX2NsZWFyT2JzS20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuZGF0YS5raWxvbWV0cmFqZSA9ICcnO1xuICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEub2JzZXJ2YWNpb24gPSAnJztcbiAgICB9O1xuICAgIC8vIHZhciBfY2xlYXJUaXBvID0gZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsLmlkY2xhc2UgPSB7XG4gICAgLy8gICAgIGlkY2xhc2U6IG51bGwsXG4gICAgLy8gICAgIGlkY2Fycm9jZXJpYTogbnVsbCxcbiAgICAvLyAgICAgdGlwbzogbnVsbFxuICAgIC8vICAgfTtcbiAgICAvLyB9O1xuICAgIHZhciBfZ2V0VG9JbnNwZWN0ID0gZnVuY3Rpb24gKGlkY29kaWdvY2FsaWZpY2FjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IG9pZi5pZHNlcnZpY2lvICwgY3BjLmlkaXRlbSwgaWRQYXJlbnRJdGVtLCBub21icmUsY3VzdG9tc2VjdGlvbiwgY3VzdG9tb3JkZXIgLCBjb250cm9sSnNvbiBmcm9tICB2aWV3VjMgb2lmICc7XG4gICAgICAvL3NpZW1wcmUgZGVqYXIgdW4gZXNwYWNpbyBlbiBibGFuY28gIFxuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY2FsaWZpY2FjaW9ucGllemFzY29kaWdvIGNwYyBvbiAgY3BjLmlkaXRlbT0gb2lmLmlkaXRlbSAgYW5kIG9pZi50aXBvPTEgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luIGNvbnRyb2xFbGVtZW50b3MgY2Ugb24gY2UuaWRjb250cm9sID1vaWYuaWRjb250cm9sICc7XG4gICAgICBxdWVyeSArPSAnd2hlcmUgb2lmLmlkc2VydmljaW89PyBhbmQgY3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uPT8nO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIDgyOSxcbiAgICAgICAgLy9wYXJzZUludChfY2wudGlwbyksXG4gICAgICAgIGlkY29kaWdvY2FsaWZpY2FjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgX3NldEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAgIF9jbGVhck9ic0ttKCk7ICAvLyBfY2xlYXJUaXBvKCk7XG4gICAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgICB9O1xuICAgIHZhciBfc2VyT2JzS20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnU0VMRUNUICAgIG8uaWRvYnNlcnZhY2lvbiwgICBvYnNlcnZhY2lvbiwga2lsb21ldHJhamUgRlJPTSAgIG9ic2VydmFjaW9uZXMgbyBpbm5lciBqb2luIGtpbG9tZXRyYWplcyBrIG9uIGsuaWRpbnNwZWNjaW9uPW8uaWRpbnNwZWNjaW9uICc7XG4gICAgICBxdWVyeSArPSAnV0hFUkUgICAgIChvLmlkaW5zcGVjY2lvbiA9ID8pIEFORCAoaWRzdWJwcm9jZXNvID0gPykgT3JkZXIgYnkgby5pZG9ic2VydmFjaW9uIGRlc2MgbGltaXQgMSAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHZhciBvYnNLbSA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXTtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEub2JzZXJ2YWNpb24gPSBvYnNLbS5vYnNlcnZhY2lvbjtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmRhdGEua2lsb21ldHJhamUgPSBvYnNLbS5raWxvbWV0cmFqZTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF9nZXRBbHJlYWR5SW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdzZWxlY3Qgb2lmLmlkc2VydmljaW8gLCBjcGMuaWRpdGVtLCBvaWYuaWRQYXJlbnRJdGVtLCBvaWYubm9tYnJlLGN1c3RvbXNlY3Rpb24sIGN1c3RvbW9yZGVyICwgY29udHJvbEpzb24gLCBpZHAuaWRvcGNpb24gYXMgdmFsdWUsIGlkcC5zZWxlY2Npb24gYXMgbGFiZWwgJztcbiAgICAgIHF1ZXJ5ICs9ICdmcm9tICB2aWV3VmRvcyBvaWYgaW5uZXIgam9pbiBjYWxpZmljYWNpb25waWV6YXNjb2RpZ28gY3BjIG9uICBjcGMuaWRpdGVtPSBvaWYuaWRpdGVtICBhbmQgb2lmLnRpcG89MSAnO1xuICAgICAgcXVlcnkgKz0gJ2lubmVyIGpvaW4gY29udHJvbEVsZW1lbnRvcyBjZSBvbiBjZS5pZGNvbnRyb2wgPW9pZi5pZGNvbnRyb2wgJztcbiAgICAgIHF1ZXJ5ICs9ICdpbm5lciBqb2luICBjbGFzZXNfY2Fycm9jZXJpYXMgY2Mgb24gY2MuaWRjb2RpZ29jYWxpZmljYWNpb249Y3BjLmlkY29kaWdvY2FsaWZpY2FjaW9uICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZGluc3BlY2Npb24gaSBvbiBpLmlkQ2xhc2VDYXJyb2NlcmlhPWNjLmlkY2xhc2VjYXJyb2NlcmlhICc7XG4gICAgICBxdWVyeSArPSAnaW5uZXIgam9pbiBpZHByb3BpZWRhZGVzIGlkcCBvbiBpZHAuaWRpbnNwZWNjaW9uPWkuaWRpbnNwZWNjaW9uIGFuZCBpZHAuaWRpdGVtID0gY3BjLmlkaXRlbSAnO1xuICAgICAgcXVlcnkgKz0gJ3doZXJlICBpLmlkaW5zcGVjY2lvbiA9PyBhbmQgb2lmLmlkc2VydmljaW89PyAgICAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5pZGluc3BlY2Npb24sXG4gICAgICAgIDgyOVxuICAgICAgXTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIF9zZXRBbHJlYWR5SW5zcGVjdEpzb24oc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgX3NlY3Rpb25zKCk7XG4gICAgICAgIHJldHVybiBfc2VyT2JzS20oKTtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgdmFyIF91cGRhdGVJZENsYXNlQ2Fycm9jZXJpYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdVUERBVEUgW2lkaW5zcGVjY2lvbl0gICBTRVQgW2lkQ2xhc2VDYXJyb2NlcmlhXSA9PyBXSEVSRSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkQ2xhc2VDYXJyb2NlcmlhLFxuICAgICAgICBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuaWRpbnNwZWNjaW9uXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgcmV0dXJuIF9pbnNlcnRTdGF0ZSg0NzcpO1xuICAgICAgfSwgZXJyb3JTZXJ2aWNlLmNvbnNvbGVFcnJvcik7XG4gICAgfTtcbiAgICB2YXIgX2luc2VydFN0YXRlID0gZnVuY3Rpb24gKGlkZXN0YWRvKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gW2lkc3VicHJvY2Vzb3NlZ3VpbWllbnRvXSAoW2lkaW5zcGVjY2lvbl0gICAgLFtpZHN1YnByb2Nlc29dICAgLFtpZGVzdGFkb10gICAsW2ZlY2hhXSAgKSAgVkFMVUVTICAgICg/LD8sPyw/KSc7XG4gICAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmlkaW5zcGVjY2lvbixcbiAgICAgICAgODI5LFxuICAgICAgICAvL19jbC50aXBvLFxuICAgICAgICBpZGVzdGFkbyxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmFscmVhZHlTYXZlZCA9IHRydWU7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygzKTsgIC8vIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5jbC50aXBvID0gbnVsbDtcbiAgICAgIH0sIGVycm9yU2VydmljZS5jb25zb2xlRXJyb3IpO1xuICAgIH07XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmdldEl0ZW1zID0gX2dldEl0ZW1zO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS51cGRhdGVTaW5nbGUgPSBfdXBkYXRlU2luZ2xlO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5zYXZlID0gX3NhdmU7XG4gICAgaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5LmNsID0gX2NsO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDbGFzZXMgPSBfZ2V0Q2xhc2VzO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRDYXJyb2NlcmlhcyA9IF9nZXRDYXJyb2NlcmlhcztcbiAgICBpbnNwZWNjaW9uU2VydmljZUZhY3Rvcnkuc2V0SWRDbGFDYSA9IF9zZXRJZENsYUNhO1xuICAgIGluc3BlY2Npb25TZXJ2aWNlRmFjdG9yeS5nZXRBbHJlYWR5SW5zcGVjdCA9IF9nZXRBbHJlYWR5SW5zcGVjdDtcbiAgICAvLyBpbnNwZWNjaW9uU2VydmljZUZhY3RvcnkuY2xlYXJUaXBvID0gX2NsZWFyVGlwbztcbiAgICByZXR1cm4gaW5zcGVjY2lvblNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnaW50ZXJtZWRpYXRlU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCkge1xuICB2YXIgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgaW50ZXJtZWRpYXRlU2VydmljZUZhY3RvcnkuZGF0YSA9IHtcbiAgICBpc1Rha2luZ1BpYzogZmFsc2UsXG4gICAgaXNUYWtpbmdWaWQ6IGZhbHNlLFxuICAgIG5hdkJhclNlYXJjaDogZmFsc2UsXG4gICAgcGxhY2E6IG51bGwsXG4gICAgaWRpbnNwZWNjaW9uU3luYzogZmFsc2UsXG4gICAgaWRpbnNwZWNjaW9uOiBudWxsXG4gIH07XG4gIHJldHVybiBpbnRlcm1lZGlhdGVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCdtb21lbnRTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0LCBpbnRlcm1lZGlhdGVTZXJ2aWNlKSB7XG4gIHZhciBtb21lbnRTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX2dldERhdGVUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcbiAgfTtcbiAgdmFyIF9hZGREYXlzID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gbW9tZW50KCkuYWRkKHgsICdkYXlzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkSG91cnMgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBtb21lbnQoKS5hZGQoeCwgJ2hvdXJzJykuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gIH07XG4gIHZhciBfYWRkU2Vjb25kcyA9IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIG1vbWVudCgpLmFkZCh4LCAncycpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuICB9O1xuICB2YXIgX3J1dGFTcnYgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHZhciBmaWxlbmFtZSA9IHBhdGgucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBydXRhID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZL01NTU0vREQvJykgKyBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EgKyAnLycgKyBmaWxlbmFtZTtcbiAgICByZXR1cm4gcnV0YTtcbiAgfTtcbiAgdmFyIF9kaWZmTm93ID0gZnVuY3Rpb24gKGIsIHRpcG8pIHtcbiAgICB2YXIgcnRhID0gbW9tZW50KCkuZGlmZihtb21lbnQoYiksIHRpcG8pO1xuICAgIGNvbnNvbGUubG9nKHJ0YSwgJ2RpZmYnKTtcbiAgICByZXR1cm4gcnRhO1xuICB9O1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5nZXREYXRlVGltZSA9IF9nZXREYXRlVGltZTtcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkRGF5cyA9IF9hZGREYXlzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5hZGRIb3VycyA9IF9hZGRIb3VycztcbiAgbW9tZW50U2VydmljZUZhY3RvcnkuYWRkU2Vjb25kcyA9IF9hZGRTZWNvbmRzO1xuICBtb21lbnRTZXJ2aWNlRmFjdG9yeS5ydXRhU3J2ID0gX3J1dGFTcnY7XG4gIG1vbWVudFNlcnZpY2VGYWN0b3J5LmRpZmZOb3cgPSBfZGlmZk5vdztcbiAgcmV0dXJuIG1vbWVudFNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ29mZmxpbmVTZXJ2aWNlJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG4gIHZhciBvZmZsaW5lU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgb2ZmbGluZVNlcnZpY2VGYWN0b3J5LmRhdGEgPSB7fTtcbiAgLy8gdmFyIF9mb2N1cyA9IGZ1bmN0aW9uIChpZCkge1xuICAvLyAgIC8vIHRpbWVvdXQgbWFrZXMgc3VyZSB0aGF0IGlzIGludm9rZWQgYWZ0ZXIgYW55IG90aGVyIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgLy8gICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcbiAgLy8gICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcbiAgLy8gICAvLyBhcmUgdHJpZ2dlcmVkLlxuICAvLyAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgLy8gICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAvLyAgICAgaWYgKGVsZW1lbnQpIHtcbiAgLy8gICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9O1xuICBvZmZsaW5lU2VydmljZUZhY3RvcnkuZGF0YS5vZmZsaW5lTW9kZSA9IGZhbHNlO1xuICByZXR1cm4gb2ZmbGluZVNlcnZpY2VGYWN0b3J5O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ29ubGluZVN0YXR1c1NlcnZpY2UnLCBbXG4gICckcm9vdFNjb3BlJyxcbiAgJyRxJyxcbiAgJyRpbmplY3RvcicsXG4gICckbG9jYXRpb24nLFxuICAnJGNvcmRvdmFOZXR3b3JrJyxcbiAgJyRpb25pY1BvcHVwJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnb2ZmbGluZVNlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCAkaW5qZWN0b3IsICRsb2NhdGlvbiwgJGNvcmRvdmFOZXR3b3JrLCAkaW9uaWNQb3B1cCwgenVtZXJvU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIHRvYXN0U2VydmljZSkge1xuICAgIHZhciBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEgPSB7XG4gICAgICBpc09ubGluZTogZmFsc2UsXG4gICAgICBjb25uVHlwZTogJ25vbmUnXG4gICAgfTtcbiAgICB2YXIgX2lzT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSAkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKTtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmRhdGEuaXNPbmxpbmUgPSAkY29yZG92YU5ldHdvcmsuaXNPbmxpbmUoKTtcbiAgICB9O1xuICAgIHZhciBfdHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG9ubGluZVN0YXR1c1NlcnZpY2VGYWN0b3J5LmNvbm5UeXBlID0gJGNvcmRvdmFOZXR3b3JrLmdldE5ldHdvcmsoKTtcbiAgICB9O1xuICAgIHZhciBfb25PbmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkcm9vdFNjb3BlLiRvbignJGNvcmRvdmFOZXR3b3JrOm9ubGluZScsIGZ1bmN0aW9uIChldmVudCwgbmV0d29ya1N0YXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXR3b3JrU3RhdGUpO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSB0cnVlO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IG5ldHdvcmtTdGF0ZTtcbiAgICAgICAgLy8gVE9ETzogZXZhbHVhciB0b2RhcyBsYXMgcG9zaWJpbGlkYWRlcyBkZSBlc3RvIGFjYSwgcG9yIHF1ZSBzaSBsYSBzZcOxYWwgZXMgbXV5IG1hbGEgcXVlIHB1ZWRlIHBhc2FyLCBhdW5xdWUgZWwgenluYyBkZSBiYXNlcyBkZSBkYXRvcyBudW5jYSBoYXNpZG8gbXV5IGdyYW5kZSBlbiBpbmZvcm1hY2lvblxuICAgICAgICB6dW1lcm9TZXJ2aWNlLnp5bmMoMSk7ICAvLyBjb3Jkb3ZhRXZlbnRzU2VydmljZS5jYWxsWnluYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmlmKCFzaWduYWxTZXJ2aWNlLmlzSW5pdCl7XG4gICAgICAgICAgICAgICAgICAgIHNpZ25hbFNlcnZpY2Uuc3RhcnRIdWIoKTtcblxuICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRjb3Jkb3ZhTmV0d29yazpzaWduYWwnLHsnbmV0d29ya1N0YXRlJzpuZXR3b3JrU3RhdGV9KTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9vbk9mZmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBsaXN0ZW4gZm9yIE9mZmxpbmUgZXZlbnRcbiAgICAgICRyb290U2NvcGUuJG9uKCckY29yZG92YU5ldHdvcms6b2ZmbGluZScsIGZ1bmN0aW9uIChldmVudCwgbmV0d29ya1N0YXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LCBuZXR3b3JrU3RhdGUpO1xuICAgICAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5kYXRhLmlzT25saW5lID0gZmFsc2U7XG4gICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICBvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlID0gdHJ1ZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuaXNPbmxpbmUgPSBmYWxzZTtcbiAgICAgICAgb25saW5lU3RhdHVzU2VydmljZUZhY3RvcnkuY29ublR5cGUgPSBuZXR3b3JrU3RhdGU7ICAvKiBpZihuZXR3b3JrU3RhdGUgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiSW50ZXJuZXQgRGlzY29ubmVjdGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlRoZSBpbnRlcm5ldCBpcyBkaXNjb25uZWN0ZWQgb24geW91ciBkZXZpY2UuXCJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0uZXhpdEFwcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKi9cbiAgICAgIH0pO1xuICAgIH07XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnkub25PbmxpbmUgPSBfb25PbmxpbmU7XG4gICAgb25saW5lU3RhdHVzU2VydmljZUZhY3Rvcnkub25PZmZsaW5lID0gX29uT2ZmbGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5pc09ubGluZSA9IF9pc09ubGluZTtcbiAgICBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeS5jb25uVHlwZSA9IF90eXBlO1xuICAgIHJldHVybiBvbmxpbmVTdGF0dXNTZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7IiwiYXBwLmZhY3RvcnkoJ3BsYWNhc1NlcnZpY2UnLCBbXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJyRyb290U2NvcGUnLFxuICAnbW9tZW50U2VydmljZScsXG4gICdhdXRoU2VydmljZScsXG4gICdkZXZpY2VTZXJ2aWNlJyxcbiAgJ3p1bWVyb1NlcnZpY2UnLFxuICAnaW50ZXJtZWRpYXRlU2VydmljZScsXG4gICd1cGRhdGVTeW5jU2VydmljZScsXG4gIGZ1bmN0aW9uIChzcWxpdGVTZXJ2aWNlLCAkcm9vdFNjb3BlLCBtb21lbnRTZXJ2aWNlLCBhdXRoU2VydmljZSwgZGV2aWNlU2VydmljZSwgenVtZXJvU2VydmljZSwgaW50ZXJtZWRpYXRlU2VydmljZSwgdXBkYXRlU3luY1NlcnZpY2UpIHtcbiAgICB2YXIgcGxhY2FzU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwgPSBbXTtcbiAgICB2YXIgX3NlbGVjdEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ZXN0ID0gW3tcbiAgICAgICAgICBpZGluc3BlY2Npb246IDEsXG4gICAgICAgICAgcGxhY2E6ICdhYmMxMTEnXG4gICAgICAgIH1dO1xuICAgICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsLnB1c2godGVzdCk7ICAvLyB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgYmluZGluZyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgLy8gJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRQbGFjYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZGluc3BlY2Npb24nO1xuICAgICAgdmFyIHF1ZXJ5ID0gJ3NlbGVjdCBpLmlkaW5zcGVjY2lvbiwgcGxhY2EsIGkuc3luYywgJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgIGNhc2Ugd2hlbiBpc3MuaWRpbnNwZWNjaW9uIGlzIG51bGwgdGhlbiAwIGVsc2UgMSBlbmQgYXMgY2FsaWZpY2FkbyAnO1xuICAgICAgcXVlcnkgKz0gJyAgICAgICAgICBmcm9tIGlkaW5zcGVjY2lvbiBpICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgICBsZWZ0IGpvaW4gKHNlbGVjdCBpZGluc3BlY2Npb24gZnJvbSAgaWRzdWJwcm9jZXNvc2VndWltaWVudG8gJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICAgICAgICAgICAgICB3aGVyZSBpZGVzdGFkbz00NzcpICc7XG4gICAgICBxdWVyeSArPSAnICAgICAgIGlzcyBvbiBpc3MuaWRpbnNwZWNjaW9uPWkuaWRpbnNwZWNjaW9uJztcbiAgICAgIHF1ZXJ5ICs9ICcgICAgICBXSEVSRSBVc2VyTmFtZT0/IGFuZCBmZWNoYT4gPyc7XG4gICAgICBxdWVyeSArPSAnIE9yZGVyIGJ5IGkuaWRpbnNwZWNjaW9uIERFU0MgTGltaXQgMTAnO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpKTtcbiAgICAgICAgcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgICAvLyAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhwbGFjYXNTZXJ2aWNlRmFjdG9yeS5hbGwpO1xuICAgICAgICBfaW5zZXJ0RGV2aWNlKCk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyB2YXIgX3VwZGF0ZVN5bmMgPSBmdW5jdGlvbiAocGxhY2EsIHN5bmMpIHtcbiAgICAvLyAgIHZhciBxdWVyeSA9ICdVUERBVEUgaWRpbnNwZWNjaW9uIHNldCBzeW5jPT8gIFdIRVJFIHBsYWNhPT8gYW5kIHVzZXJOYW1lPT8gYW5kIGZlY2hhPj8nO1xuICAgIC8vICAgc3luYyA9IHN5bmMgPyAxIDogMDtcbiAgICAvLyAgIHZhciBiaW5kaW5nID0gW1xuICAgIC8vICAgICBzeW5jLFxuICAgIC8vICAgICBwbGFjYSxcbiAgICAvLyAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgLy8gICAgIG1vbWVudFNlcnZpY2UuYWRkRGF5cygtMylcbiAgICAvLyAgIF07XG4gICAgLy8gICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAvLyB9O1xuICAgIHZhciBfaW5zZXJ0UExhY2EgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICAgIHZhciBxdWVyeSA9ICdJTlNFUlQgSU5UTyBpZGluc3BlY2Npb24ocGxhY2EsIGZlY2hhLFVzZXJOYW1lLHV1aWQsIHN5bmMpIFZBTFVFUyAoPyw/LD8sPywgPyknO1xuICAgICAgdmFyIHN5bmMgPSAwO1xuICAgICAgLy8gMCBtZWFucyBmYWxzZVxuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHBsYWNhLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLmdldERhdGVUaW1lKCksXG4gICAgICAgIGF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0aW9uLnVzZXJOYW1lLFxuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgc3luY1xuICAgICAgXTtcbiAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSA9IHBsYWNhO1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvblN5bmMgPSBmYWxzZTtcbiAgICAgIHJldHVybiBzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVRdWVyeShxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8vIHJldHVybiBfZ2V0UGxhY2FzKCk7ICAvLyByZXR1cm4gcGxhY2FzU2VydmljZUZhY3RvcnkuYWxsLnB1c2goe1xuICAgICAgICAvLyAgIHBsYWNhOiBwbGFjYSxcbiAgICAgICAgLy8gICBpZGluc3BlY2Npb246IHJlcy5pbnNlcnRJZFxuICAgICAgICAvLyB9KTtcbiAgICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IHJlcy5pbnNlcnRJZDtcbiAgICAgICAgcmV0dXJuIHp1bWVyb1NlcnZpY2UuenluYygxKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlU3luY1NlcnZpY2Uuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyhwbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2dldFBsYWNhcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIG9uIHp1bWVybyBzeW5jIGRlc2RlIHBzJyk7XG4gICAgICAgICAgcmV0dXJuIF9nZXRQbGFjYXMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9pbnNlcnREZXZpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIE9SIElHTk9SRSBJTlRPIFtkZXZpY2VzXShbdXVpZF0sW21vZGVsXSkgIFZBTFVFUyg/LD8pJztcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBkZXZpY2VTZXJ2aWNlLmRhdGEudXVpZCxcbiAgICAgICAgZGV2aWNlU2VydmljZS5kYXRhLm1vZGVsXG4gICAgICBdO1xuICAgICAgc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0IGRldmljZScsIHJlcyk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcGxhY2FzU2VydmljZUZhY3Rvcnkuc2VsZWN0QWxsID0gX3NlbGVjdEFsbDtcbiAgICBwbGFjYXNTZXJ2aWNlRmFjdG9yeS5nZXRQbGFjYXMgPSBfZ2V0UGxhY2FzO1xuICAgIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydFBMYWNhID0gX2luc2VydFBMYWNhO1xuICAgIC8vIHBsYWNhc1NlcnZpY2VGYWN0b3J5Lmluc2VydERldmljZSA9IF9pbnNlcnREZXZpY2U7XG4gICAgcmV0dXJuIHBsYWNhc1NlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnc3FsaXRlU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhU1FMaXRlJyxcbiAgZnVuY3Rpb24gKCRjb3Jkb3ZhU1FMaXRlKSB7XG4gICAgdmFyIHNxbGl0ZVNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9leGVjdXRlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnksIGJpbmRpbmcpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5leGVjdXRlKGRiLCBxdWVyeSwgYmluZGluZykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0Q29sbGVjdGlvbiA9IGZ1bmN0aW9uIChxdWVyeSwgYmluZGluZ3MpIHtcbiAgICAgIHJldHVybiAkY29yZG92YVNRTGl0ZS5pbnNlcnRDb2xsZWN0aW9uKGRiLCBxdWVyeSwgYmluZGluZ3MpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgX3J0bkFycmF5ID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICBpZiAocmVzLnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJyYXkucHVzaChyZXMucm93cy5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvLyBUT0RPOiBzaSB5byBjYW1iaW8gZWwgdGlwbyBkZSBkYXRvIGRlIHVuYSBjb2x1bW5hLCBlamVtcGxvIHN0cmluZyB0byBpbnQsIGRlYm8gcmVlc3RhYmxlY2VyIGxhIGJhc2UgZGUgZGF0b3MgenVtZXJvLCBwYXJhIGFncmVnYXIgdW5hIGNvbHVtbmEgbm8gdGVuZ28gcHJvYmxlbWFcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5leGVjdXRlUXVlcnkgPSBfZXhlY3V0ZVF1ZXJ5O1xuICAgIHNxbGl0ZVNlcnZpY2VGYWN0b3J5Lmluc2VydENvbGxlY3Rpb24gPSBfaW5zZXJ0Q29sbGVjdGlvbjtcbiAgICBzcWxpdGVTZXJ2aWNlRmFjdG9yeS5ydG5BcnJheSA9IF9ydG5BcnJheTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd0aXRsZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQpIHtcbiAgdmFyIHRpdGxlU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdGl0bGVTZXJ2aWNlRmFjdG9yeS50aXRsZSA9ICcnO1xuICByZXR1cm4gdGl0bGVTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd0b2FzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJGNvcmRvdmFUb2FzdCkge1xuICB2YXIgdG9hc3RTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3Nob3dMb25nQm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dMb25nQm90dG9tKG1zZyk7XG4gIH07XG4gIHZhciBfc2hvd1Nob3J0Qm90dG9tID0gZnVuY3Rpb24gKG1zZykge1xuICAgIHJldHVybiAkY29yZG92YVRvYXN0LnNob3dTaG9ydEJvdHRvbShtc2cpO1xuICB9O1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dMb25nQm90dG9tID0gX3Nob3dMb25nQm90dG9tO1xuICB0b2FzdFNlcnZpY2VGYWN0b3J5LnNob3dTaG9ydEJvdHRvbSA9IF9zaG93U2hvcnRCb3R0b207XG4gIHJldHVybiB0b2FzdFNlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3Vuc3luY1NlcnZpY2UnLCBmdW5jdGlvbiAoJHRpbWVvdXQsIGludGVybWVkaWF0ZVNlcnZpY2UsIHRvYXN0U2VydmljZSwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGVycm9yU2VydmljZSwgb2ZmbGluZVNlcnZpY2UsIGZpbGVUcmFuc2ZlclNlcnZpY2UsIGZvdG9zU2VydmljZSwgenVtZXJvU2VydmljZSwgJHJvb3RTY29wZSkge1xuICB2YXIgdW5zeW5jU2VydmljZUZhY3RvcnkgPSB7fTtcbiAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gW107XG4gIHZhciBfZ2V0SW1nVW5zeW5jID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBxdWVyeSA9ICdTRUxFQ1QgICAgIGlkZm90bywgaS5pZGluc3BlY2Npb24sIHBhdGgsIGYuc3luYywgIGkucGxhY2EsIGYucnV0YVNydiAnO1xuICAgIHF1ZXJ5ICs9ICdGUk9NICAgICAgaWRpbnNwZWNjaW9uIGkgICAgaW5uZXIgam9pbiAgaWRmb3RvcyBmIG9uIGkuaWRpbnNwZWNjaW9uID0gZi5pZGluc3BlY2Npb24gJztcbiAgICBxdWVyeSArPSAnV0hFUkUgICAgaS51c2VyTmFtZSA9ID8gQU5EICBpLmZlY2hhPj8gQU5EIChmLnN5bmMgPSAwKSBBTkQgKGRlbGV0ZWQgPSAwKSAnO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpO1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gc3FsaXRlU2VydmljZS5ydG5BcnJheShyZXMpLmxlbmd0aDtcbiAgICB9LCBlcnJvclNlcnZpY2UuY29uc29sZUVycm9yKTtcbiAgfTtcbiAgdmFyIF9zeW5jSW1hZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIF9nZXRJbWdVbnN5bmMoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPCAxKSB7XG4gICAgICAgIHp1bWVyb1NlcnZpY2UuenluYygyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYW5ndWxhci5mb3JFYWNoKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luYywgZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgICAgIF9wcmVGaWxlVXBsb2FkKG9iaik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIF9wcmVGaWxlVXBsb2FkID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvZmZsaW5lU2VydmljZS5kYXRhLm9mZmxpbmVNb2RlKSB7XG4gICAgICAvLyBUT0RPOiB5YSBub2UgcyBuZWNlc2FyaW8gcG9yIHF1ZSBvZmZsaW5lIHRhbWJpZW4gZXN0YSBlbiBvbmxpbG5lc3RhdHVzc3JlcnZpY2VcbiAgICAgIC8vIHx8ICFvbmxpbmVTdGF0dXNTZXJ2aWNlLmlzT25saW5lKSB7XG4gICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDAsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZVRyYW5zZmVyU2VydmljZS5maWxlVXBsb2FkKG9iaikudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmlsZVVwbG9hZCcpO1xuICAgICAgICBfdXBkYXRlQWZ0ZXJVcGxvYWQob2JqLnBhdGgsIDEsIGZhbHNlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbGVVcGxvYWQnKTtcbiAgICAgICAgX3VwZGF0ZUFmdGVyVXBsb2FkKG9iai5wYXRoLCAwLCBmYWxzZSk7XG4gICAgICAgIGlmIChlLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3IgZW4gZWwgY29udHJvbGxlcicpO1xuICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ2FjdGl2YWRvIG1vZG8gb2ZmbGluZScpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgdmFyIF91cGRhdGVBZnRlclVwbG9hZCA9IGZ1bmN0aW9uIChpbWFnZVVSSSwgc3luYywgb251cGxvYWQpIHtcbiAgICBfdXBkYXRlRm90byhpbWFnZVVSSSwgc3luYywgb251cGxvYWQpO1xuICB9O1xuICB2YXIgX3VwZGF0ZUZvdG8gPSBmdW5jdGlvbiAoaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKSB7XG4gICAgZm90b3NTZXJ2aWNlLnVwZGF0ZUZvdG8oaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiwgaW1hZ2VVUkksIHN5bmMsIG9udXBsb2FkKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlbiBlbCBjb250cm9sbGVyIGRlc3B1ZXMgZGUgdXBkYXRlIHNxbGl0ZSBmb3RvICcpO1xuICAgICAgLy8gaWYgKHMubWFzc2l2ZVVwbG9hZCkge1xuICAgICAgdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoID0gdW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoIC0gMTtcbiAgICAgIGlmICh1bnN5bmNTZXJ2aWNlRmFjdG9yeS5pbWdVbnN5bmNMZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHVuc3luY1NlcnZpY2VGYWN0b3J5LmltZ1Vuc3luY0xlbmd0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIH1cbiAgICAgIC8vIF9maWx0ZXJVbnN5bmMoMCk7ICAgICAgICAgIFxuICAgICAgY29uc29sZS5sb2codW5zeW5jU2VydmljZUZhY3RvcnkuaW1nVW5zeW5jTGVuZ3RoLCAnc3luYycpO1xuICAgICAgLy8genVtZXJvU2VydmljZS56eW5jKDIpO1xuICAgICAgenVtZXJvU2VydmljZS56eW5jKDApLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ215RXZlbnQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5nZXRJbWdVbnN5bmMgPSBfZ2V0SW1nVW5zeW5jO1xuICB1bnN5bmNTZXJ2aWNlRmFjdG9yeS5zeW5jSW1hZ2VzID0gX3N5bmNJbWFnZXM7XG4gIHJldHVybiB1bnN5bmNTZXJ2aWNlRmFjdG9yeTtcbn0pOyIsImFwcC5mYWN0b3J5KCd1cGRhdGVTeW5jU2VydmljZScsIGZ1bmN0aW9uICgkdGltZW91dCwgYXV0aFNlcnZpY2UsIG1vbWVudFNlcnZpY2UsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UpIHtcbiAgdmFyIHVwZGF0ZVN5bmNTZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICB2YXIgX3VwZGF0ZVN5bmMgPSBmdW5jdGlvbiAocGxhY2EsIHN5bmMpIHtcbiAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkaW5zcGVjY2lvbiBzZXQgc3luYz0/ICBXSEVSRSBwbGFjYT0/IGFuZCB1c2VyTmFtZT0/IGFuZCBmZWNoYT4/JztcbiAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgc3luYyxcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpOyAgLy8gLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJldHVybiA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICB9O1xuICB2YXIgX3NlbGVjdElkaW5zcGVjY2lvblN5bmMgPSBmdW5jdGlvbiAocGxhY2EpIHtcbiAgICB2YXIgcXVlcnkgPSAnc2VsZWN0IGlkaW5zcGVjY2lvbiBmcm9tIGlkaW5zcGVjY2lvbiAgV0hFUkUgcGxhY2E9PyBhbmQgdXNlck5hbWU9PyBhbmQgZmVjaGE+PyBPcmRlciBieSBpZGluc3BlY2Npb24gREVTQyBMaW1pdCAxJztcbiAgICB2YXIgYmluZGluZyA9IFtcbiAgICAgIHBsYWNhLFxuICAgICAgYXV0aFNlcnZpY2UuYXV0aGVudGljYXRpb24udXNlck5hbWUsXG4gICAgICBtb21lbnRTZXJ2aWNlLmFkZERheXMoLTMpXG4gICAgXTtcbiAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgaW50ZXJtZWRpYXRlU2VydmljZS5kYXRhLmlkaW5zcGVjY2lvbiA9IHNxbGl0ZVNlcnZpY2UucnRuQXJyYXkocmVzKVswXS5pZGluc3BlY2Npb247XG4gICAgICBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyA9IHRydWU7XG4gICAgICByZXR1cm4gX3VwZGF0ZVN5bmMocGxhY2EsIHRydWUpO1xuICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlLCAnZXJyb3InKTtcbiAgICB9KTsgIC8vIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgIC8vICAgcmV0dXJuIDtcbiAgICAgICAgIC8vIH0pO1xuICB9O1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3RvcnkudXBkYXRlU3luYyA9IF91cGRhdGVTeW5jO1xuICB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc2VsZWN0SWRpbnNwZWNjaW9uU3luYyA9IF9zZWxlY3RJZGluc3BlY2Npb25TeW5jO1xuICAvLyB1cGRhdGVTeW5jU2VydmljZUZhY3Rvcnkuc3luY0ltYWdlcyA9IF9zeW5jSW1hZ2VzO1xuICByZXR1cm4gdXBkYXRlU3luY1NlcnZpY2VGYWN0b3J5O1xufSk7IiwiYXBwLmZhY3RvcnkoJ3ZpZGVvU2VydmljZScsIFtcbiAgJyRjb3Jkb3ZhQ2FwdHVyZScsXG4gICdzcWxpdGVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAnbW9tZW50U2VydmljZScsXG4gIGZ1bmN0aW9uICgkY29yZG92YUNhcHR1cmUsIHNxbGl0ZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIG1vbWVudFNlcnZpY2UpIHtcbiAgICB2YXIgdmlkZW9TZXJ2aWNlRmFjdG9yeSA9IHt9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zID0gW107XG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3M7XG4gICAgfTtcbiAgICB2YXIgX3Rha2VkVmlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGxpbWl0OiAxLFxuICAgICAgICBkdXJhdGlvbjogMTJcbiAgICAgIH07XG4gICAgICByZXR1cm4gJGNvcmRvdmFDYXB0dXJlLmNhcHR1cmVWaWRlbyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uICh2aWRlb0RhdGEpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvRGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdmFyIF9nZXRWaWRlb3MgPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnc2VsZWN0ICogZnJvbSBpZFZpZGVvcyB3aGVyZSBpZGluc3BlY2Npb249Pyc7XG4gICAgICB2YXIgYmluZGluZyA9IFtpZGluc3BlY2Npb25dO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgdmlkZW9TZXJ2aWNlRmFjdG9yeS52aWRlb3MgPSBzcWxpdGVTZXJ2aWNlLnJ0bkFycmF5KHJlcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZpZGVvU2VydmljZUZhY3RvcnkudmlkZW9zKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfaW5zZXJ0VmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCB0aHVtYm5haWwsIG9uVXBsb2FkKSB7XG4gICAgICB2YXIgcXVlcnkgPSAnSU5TRVJUIElOVE8gaWRWaWRlb3MoaWRpbnNwZWNjaW9uLCBwYXRoLHN5bmMsdXVpZCx0aHVtYm5haWwsIG9uVXBsb2FkLCBwbGFjYSwgZmVjaGEsIHJ1dGFTcnYgKSBWQUxVRVMgKD8sPyw/LD8sPyw/LD8sPywgPyknO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgIHZhciBiaW5kaW5nID0gW1xuICAgICAgICBpZGluc3BlY2Npb24sXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHN5bmMsXG4gICAgICAgICd0ZXN0dXVpZCcsXG4gICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgb25VcGxvYWQsXG4gICAgICAgIGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSxcbiAgICAgICAgbW9tZW50U2VydmljZS5nZXREYXRlVGltZSgpLFxuICAgICAgICBtb21lbnRTZXJ2aWNlLnJ1dGFTcnYocGF0aClcbiAgICAgIF07XG4gICAgICByZXR1cm4gc3FsaXRlU2VydmljZS5leGVjdXRlUXVlcnkocXVlcnksIGJpbmRpbmcpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfdXBkYXRlVmlkZW8gPSBmdW5jdGlvbiAoaWRpbnNwZWNjaW9uLCBwYXRoLCBzeW5jLCBvblVwbG9hZCkge1xuICAgICAgLy9UT0RPOiBlcyBlbCBwYXRoIGxhIG1lam9yIGZvcm1hIHkgbWFzIGVmZWN0aXZhIGRlIGhhY2VyIGVsIHdoZXJlIGRlIGxhIGNvbnN1bHRhXG4gICAgICB2YXIgcXVlcnkgPSAnVVBEQVRFIGlkVmlkZW9zIHNldCBzeW5jPT8gLCBvblVwbG9hZD0gPyBXSEVSRSBwYXRoPT8nO1xuICAgICAgLy8gVE9ETzogZWwgY2FtcG8gZGVsZXRlZCBlcyBib29sZWFuICwgcGVybyBkZWJlIGFzaWduYXJzZWxlIDEgbyAwXG4gICAgICAvLyBUT0RPOiAgbXVjaG8gY3VpZGFkbyBwb3IgZWplbXBsbyBlbCBwYXRoIGRlYmUgc2VyIG52YXJjaGFyKCkgTk8gIE5DSEFSXG4gICAgICBzeW5jID0gc3luYyA/IDEgOiAwO1xuICAgICAgb25VcGxvYWQgPSBvblVwbG9hZCA/IDEgOiAwO1xuICAgICAgdmFyIGJpbmRpbmcgPSBbXG4gICAgICAgIHN5bmMsXG4gICAgICAgIG9uVXBsb2FkLFxuICAgICAgICBwYXRoXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHNxbGl0ZVNlcnZpY2UuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5LCBiaW5kaW5nKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMucm93c0FmZmVjdGVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgd2FzIHVwZGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMucm93c0FmZmVjdGVkKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuYWxsID0gX2FsbDtcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5LnRha2VkVmlkID0gX3Rha2VkVmlkO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkuZ2V0VmlkZW9zID0gX2dldFZpZGVvcztcbiAgICB2aWRlb1NlcnZpY2VGYWN0b3J5Lmluc2VydFZpZGVvID0gX2luc2VydFZpZGVvO1xuICAgIHZpZGVvU2VydmljZUZhY3RvcnkudXBkYXRlVmlkZW8gPSBfdXBkYXRlVmlkZW87XG4gICAgcmV0dXJuIHZpZGVvU2VydmljZUZhY3Rvcnk7XG4gIH1cbl0pOyIsImFwcC5mYWN0b3J5KCd2aWRlb1RodW1ibmFpbFNlcnZpY2UnLCBbXG4gICckcScsXG4gIGZ1bmN0aW9uICgkcSkge1xuICAgIHZhciB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9nZW5lcmF0ZVRodW1ibmFpbCA9IGZ1bmN0aW9uIChuYXRpdmVVUkwpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgbmFtZSA9IG5hdGl2ZVVSTC5zbGljZSgwLCAtNCk7XG4gICAgICB3aW5kb3cuUEtWaWRlb1RodW1ibmFpbC5jcmVhdGVUaHVtYm5haWwobmF0aXZlVVJMLCBuYW1lICsgJy5wbmcnLCBmdW5jdGlvbiAocHJldlN1Y2MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocHJldlN1Y2MpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHByZXZTdWNjKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBnZW5lcm5hZG8gdGh1bWJuYWlsJywgZSk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5LmdlbmVyYXRlVGh1bWJuYWlsID0gX2dlbmVyYXRlVGh1bWJuYWlsO1xuICAgIHJldHVybiB2aWRlb1RodW1ibmFpbFNlcnZpY2VGYWN0b3J5O1xuICB9XG5dKTsiLCJhcHAuZmFjdG9yeSgnenVtZXJvU2VydmljZScsIFtcbiAgJyRxJyxcbiAgJyRjb3Jkb3ZhRGV2aWNlJyxcbiAgJyRjb3Jkb3ZhU1FMaXRlJyxcbiAgJ29mZmxpbmVTZXJ2aWNlJyxcbiAgJ2ludGVybWVkaWF0ZVNlcnZpY2UnLFxuICAndXBkYXRlU3luY1NlcnZpY2UnLFxuICAndG9hc3RTZXJ2aWNlJyxcbiAgJyR0aW1lb3V0JyxcbiAgLy8gJ29ubGluZVN0YXR1c1NlcnZpY2UnLFxuICBmdW5jdGlvbiAoJHEsICRjb3Jkb3ZhRGV2aWNlLCAkY29yZG92YVNRTGl0ZSwgb2ZmbGluZVNlcnZpY2UsIGludGVybWVkaWF0ZVNlcnZpY2UsIHVwZGF0ZVN5bmNTZXJ2aWNlLCB0b2FzdFNlcnZpY2UsICR0aW1lb3V0KSB7XG4gICAgdmFyIHp1bWVybyA9IG51bGw7XG4gICAgdmFyIHp1bWVyb1NlcnZpY2VGYWN0b3J5ID0ge307XG4gICAgdmFyIF9zZXREYlBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX29wdGlvbnMgPSB7XG4gICAgICAgIEFuZHJvaWQ6ICcvZGF0YS9kYXRhLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5wYWNrYWdlTmFtZSArICcvZGF0YWJhc2VzLycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgaU9TOiAnY2R2ZmlsZTovL2xvY2FsaG9zdC9wZXJzaXN0ZW50LycgKyB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSxcbiAgICAgICAgd2luMzJudDogJy8nICsgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGVcbiAgICAgIH07XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYnBhdGggPSBfb3B0aW9uc1skY29yZG92YURldmljZS5nZXRQbGF0Zm9ybSgpXTtcbiAgICB9O1xuICAgIHZhciBfc2V0WnVtZXJvID0gZnVuY3Rpb24gKGRiZmlsZSkge1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlID0gZGJmaWxlO1xuICAgICAgenVtZXJvU2VydmljZUZhY3RvcnkuZGJmaWxlQ29tcGxldGUgPSB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUgKyAnLmRiJztcbiAgICAgIC8vb3BlbiBkYiBjb24gc3FsaXRlcGx1Z2luIGJyb2R5XG4gICAgICBkYiA9ICRjb3Jkb3ZhU1FMaXRlLm9wZW5EQih6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGVDb21wbGV0ZSwgMSk7XG4gICAgICB6dW1lcm8gPSBjb3Jkb3ZhLnJlcXVpcmUoJ2NvcmRvdmEvcGx1Z2luL3p1bWVybycpO1xuICAgICAgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyID0gJ2h0dHA6Ly8xOTAuMTQ1LjM5LjEzODo4MDgwLyc7XG4gICAgICAvLydodHRwOi8vMTkyLjE2OC4wLjUxOjgwODAvJztcbiAgICAgIC8vIFRPRE86IERFUEVOREUgU0kgRVNUT1kgRU4gTUkgQ0FTQSBPIEVOIExBIE9GSUNJTkEnaHR0cDovLzE5Mi4xNjguMS4xMzo4MDgwLyc7XG4gICAgICB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5wYWNrYWdlTmFtZSA9ICdjb20uYWp1c3Rldi5iJztcbiAgICAgIF9zZXREYlBhdGgoKTtcbiAgICB9O1xuICAgIC8vIFRPRE86ICByZWNvcmRhciBrIGVzdG8gZXMgdW5hIHByb21lc2EgeSBkZXNlbmNhZGVuYSBhY2Npb25lcywgc2kgZXMgcmVzdWVsdGEgbyBzaSBlcyByZWplY3QgLCB2YWxsaWRhclxuICAgIHZhciBfenluYyA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAvLyBUT0RPOiBhYnJpcmkgZWwgcHVlcnRvIHBhcmEgenVtZXJvIGVuIGVsIGZpcmV3YWxsXG4gICAgICAvLyBUT0RPOiBjcmVhciB1bmEgc2VydmljaW8gZ2xvYmFsIHBhcmEgZGUgYWhpIHNhY2FyIGVsIGlkaW5zcGVjY2lvbiBhY3R1YWwsIGluY3VzaXZlIGRlc3B1ZXMgZGUgdW4genluYyBwYXJhIHNhYmVyIHF1ZSBlcyBlbCBhZGVjdWFkb1xuICAgICAgdmFyIHEgPSAkcS5kZWZlcigpO1xuICAgICAgaWYgKG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUpIHtcbiAgICAgICAgLy8gfHwgIW9ubGluZVN0YXR1c1NlcnZpY2UuZGF0YS5pc09ubGluZSkge1xuICAgICAgICAvLyBUT0RPOiBtZSBwYXJlY2UgbWFzIGxvZ2ljbyByZXRvcm5hciB1biByZWplY3Qgc2kgZXN0YSBlbiBtb2RvIG9mZmxpbmVcbiAgICAgICAgcS5yZWplY3QoJ29mZmxpbmVNb2RlIG8gc2luIGNvbmV4aW9uJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvZmZsaW5lIG1vZGUgYWN0aXZhZG8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUudGltZSgnenluYycgKyBpKTtcbiAgICAgICAgdmFyIHRpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRvYXN0U2VydmljZS5zaG93U2hvcnRCb3R0b20oJ3NpbmNyb25pemFuZG8uLicpO1xuICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgenVtZXJvLnN5bmMoenVtZXJvU2VydmljZUZhY3RvcnkuZGJwYXRoLCAnJywgenVtZXJvU2VydmljZUZhY3Rvcnkuc2VydmVyLCB6dW1lcm9TZXJ2aWNlRmFjdG9yeS5kYmZpbGUsIG51bGwsIG51bGwsIG51bGwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb2snKTtcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3p5bmMnICsgaSk7XG4gICAgICAgICAgaWYgKCFpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEuaWRpbnNwZWNjaW9uU3luYyAmJiBpbnRlcm1lZGlhdGVTZXJ2aWNlLmRhdGEucGxhY2EpIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgICAvLyB1cGRhdGVTeW5jU2VydmljZS51cGRhdGVTeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSwgdHJ1ZSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1cGRhdGVTeW5jU2VydmljZS5zZWxlY3RJZGluc3BlY2Npb25TeW5jKGludGVybWVkaWF0ZVNlcnZpY2UuZGF0YS5wbGFjYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgICAgfSk7ICAvLyB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVyKTtcbiAgICAgICAgICAgIHEucmVzb2x2ZSgnenluYyBvaycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCd6eW5jJyArIGkpO1xuICAgICAgICAgIGlmIChlcnJvci5jb2RlID09PSA0NTYpIHtcbiAgICAgICAgICAgIG9mZmxpbmVTZXJ2aWNlLmRhdGEub2ZmbGluZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHEucHJvbWlzZTtcbiAgICB9O1xuICAgIHp1bWVyb1NlcnZpY2VGYWN0b3J5LnNldFp1bWVybyA9IF9zZXRadW1lcm87XG4gICAgenVtZXJvU2VydmljZUZhY3RvcnkuenluYyA9IF96eW5jO1xuICAgIHJldHVybiB6dW1lcm9TZXJ2aWNlRmFjdG9yeTtcbiAgfVxuXSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9