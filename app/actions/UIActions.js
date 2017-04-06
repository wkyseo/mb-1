import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

const UIActions = {
  openLinkAutoConnectDialog: function() {
    console.log('openBleDialog');
    AppDispatcher.dispatch({
      actionType: AppConstants.LINK_AUTO_CONNECT_DIALOG_OPEN
    });
  },

  refreshBluetooth: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.REFRESH_BLUETOOTH
    });
  },

  openLinkDialog: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.LINK_DIALOG_OPEN,
    });
  },

  selectLinkDialogDevice: function(device) {
    AppDispatcher.dispatch({
      actionType: AppConstants.LINK_DIALOG_CONNECT,
      deviceId: device
    });
  },

  disconnectLinkDevice: function(_needTrigger) {
    AppDispatcher.dispatch({
      actionType: AppConstants.LINK_DIALOG_DISCONNECT,
      needTrigger: _needTrigger
    });
  },

  closeLinkDialog: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.LINK_DIALOG_CLOSE
    });
  },

  openNumberInputDialog: function(onInput) {
    AppDispatcher.dispatch({
      actionType: AppConstants.NUMBER_INPUT_DIALOG_OPEN,
      callback: onInput
    });
  },

  addNode: function(node) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_ADD,
      nodeInfo: node
    });
  },
  moveNode: function(node) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_MOVE,
      nodeInfo: node
    });
  },
  removeNode: function(node) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_REMOVE,
      nodeId: node
    });
  },
  addWire: function(wire) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_WIRE_ADD,
      wireInfo: wire
    });
  },
  removeWires: function(wireId){
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_SINGLE_WIRE_REMOVE,
      wireId: wireId
    });
  },
  configNode: function(id, conf) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_CONFIG,
      nodeId: id,
      conf: conf
    });
  },
  useNode: function(id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_USE,
      nodeId: id
    });
  },
  unUseNode: function(id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.EDITER_NODE_UNUSE,
      nodeId: id
    });
  },

  globalCanvasTouch: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.GLOBAL_CANVAS_TOUCH
    });
  },

  nodeTap: function(id, type) {
    AppDispatcher.dispatch({
      actionType: AppConstants.NODE_TAP,
      nodeId: id,
      nodeType: type
    });
  },

  longpressNode: function(id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.LONGPRESS_NODE,
      nodeId: id
    });
  },

  beginMovingNodeToCanvas: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.BEGIN_MOVING_NODE_TO_CANVAS
    });
  },

  movingNode: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.MOVING_NODE
    });
  },
  showImageDialog: function(titleName, id, defaultConf,callback){
    AppDispatcher.dispatch({
      actionType: AppConstants.IMAGE_SETTING_DIALOG,
      titleName: titleName,
      id: id,
      defaultConf: defaultConf,
      onConfirm: callback
    });
  },
  createProject: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_CREATE
    });
  },
  saveProject: function(projectId, projectData, cloudData, cloudID) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_SAVE,
      projectId: projectId,
      projectData: projectData,
      cloudData: cloudData,
      cloudID: cloudID
    });
  },
  openProject: function(projectId) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_OPEN,
      projectId: projectId
    });
  },
  openCloudProject: function(projectId) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_CLOUD_OPEN,
      projectId: projectId
    });
  },
  deleteProject: function(projectIdArr) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_DELETE,
      projectIdArr: projectIdArr
    });
  },
  saveProjectName: function(projectId, projectName) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PROJECT_SAVE_NAME,
      projectId: projectId,
      projectName: projectName
    });
  },
  showPatternDialog: function(titleName, id, defaultConf,callback){
    AppDispatcher.dispatch({
      actionType: AppConstants.PATTERN_SETTING_DIALOG,
      titleName: titleName,
      id: id,
      defaultConf: defaultConf,
      onConfirm: callback
    });
  },
  showShelfDelete: function(showDelete) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHELF_SHOW_DELETE,
      showDelete: showDelete
    });
  }, 
  showPaletteDelete: function(showDelete) {
    AppDispatcher.dispatch({
      actionType: AppConstants.PALETTE_SHOW_DELETE,
      showDelete: showDelete
    });
  },  
  editName: function(id, name, callback) {
    AppDispatcher.dispatch({
      actionType: 'EDIT_CLOUD_NODE_NAME',
      id: id,
      name: name,
      onConfirm: callback
    });
  },
  setTextInput: function(id, text, callback) {
    AppDispatcher.dispatch({
      actionType: 'EDIT_TEXT_INPUT',
      id: id,
      text: text,
      onConfirm: callback
    });
  },
  getTextInput: function(id, text) {
    AppDispatcher.dispatch({
      actionType: 'GET_TEXT_INPUT',
      id: id,
      text: text
    });
  },
  openWifiDialog: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.WIFI_DIALOG_OPEN
    });
  },
  reConnectServiceIpad: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.RECONNECT_SERVICE_WIFI
    });
  },
  searchWifiModule: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.SEARCH_WIFI_MODULE
    });
  },
  connectChosenWifi: function(ip, port) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CONNECT_CHOSEN_WIFI,
      ip: ip,
      port: port
    });
  },
  stopSearchWifiModule: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.STOP_SEARCH_WIFI_MODULE
    });
  },
  openDisconnDialog: function(type) {
    AppDispatcher.dispatch({
      actionType: AppConstants.OPEN_DISCONN_DIALOG,
      type: type
    });
  },
  disconnWifi: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.DISCONN_WIFI
    });
  },
  uploadWifiConfig: function(ssid, pwd) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPLOAD_WIFI_CONFIG,
      ssid: ssid,
      pwd: pwd
    });
  },
  queryApConnectedWifi: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.QUERY_AP_CONNECTED_WIFI
    });
  },
  queryApWifiList: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.QUERY_AP_WIFILIST
    });
  },
  confirmUploadCode: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.CONFIRM_UPLOAD_CODE
    });
  },
  cancelUpload: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.CANCEL_UPLOAD
    });
  },
  shareCloudProject: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHARE_CLOUD_PROJECT
    });
  },
  updateCloudProject: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_CLOUD_PROJECT
    });
  },
  changeWifiType: function(type) {
    AppDispatcher.dispatch({
      actionType: AppConstants.CHANGE_WIFI_TYPE,
      type: type
    });
  },
  queryStaConnectedWifi: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.QUERY_STA_CONNECTED_WIFI
    });
  },
  showMusicBoard: function (params) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SHOW_MUSIC_BOARD,
      boardValue: params.boardValue,
      meterValue: params.meterValue,
      nodeId: params.nodeId
    });
  },
  musicChangeMeter:function (meterValue, id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MUSIC_METER_CHANGE,
      meterValue,
      id
    });
  },
  musicChangeKeyValue:function (boardValue, id) {
    AppDispatcher.dispatch({
      actionType: AppConstants.MUSIC_KEY_VALUE_CHANGE,
      boardValue,
      id
    });
  },
  musicSyncConfigurator: function (id) {
    setTimeout(function () {
      AppDispatcher.dispatch({
        actionType: AppConstants.MUSIC_SYNC_CONFIGURATOR,
        id
      });
    }, 0);

  },
  SoundListLoadFinished: function(id, list, type) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SOUND_LIST_LOAD_FINISHED,
      nodeId: id,
      soundList: list,
      showType: type
    });
  }
};

export default UIActions;
