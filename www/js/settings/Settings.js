(function () {
  angular.module('starter').controller('Settings', Settings);
  Settings.inject = [
    '$log',
    'settingsSrv',
    'errorService'
  ];
  function Settings($log, settingsSrv, errorService) {
    var vm = this;
    vm.pics = [];
    vm.vds = [];
    vm.deleteVds = deleteVds;
    vm.deleteImgs = deleteImgs;
    activate();
    function activate() {
      settingsSrv.get2Dlt().then(selectOk).catch(errorService.consoleError);
    }
    function selectOk() {
      vm.pics = settingsSrv.pics;
      vm.vds = settingsSrv.vds;
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
  }
}());