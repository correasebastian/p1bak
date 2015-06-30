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