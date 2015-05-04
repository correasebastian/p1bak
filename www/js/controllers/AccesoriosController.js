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