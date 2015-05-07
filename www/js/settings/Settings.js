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