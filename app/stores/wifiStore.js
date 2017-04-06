import EventEmitter from 'wolfy87-eventemitter';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import engine from '../core/FlowEngine';
import RestfulApiImpl from '../utils/RestfulApiImpl';
import ErrorCode from '../constants/ErrorCode';
import {engineGetUUID} from '../core/FlowEngine';
import UIActions from '../actions/UIActions';

const EVENT_SERVICE_WIFI_STATUS_CHANGE = 'serviceWifiStatusChange';
const EVENT_WIFI_MODULE_STATUS_CHANGE = 'wifiModuleStatusChange';
const EVENT_CONNECT_CHOSEN_WIFI_STATUS_CHANGE = 'wifiConnected';

const EVENT_AP_QUERY_WIFI_LIST_STATUS_CHANGE = 'apQueryWifiListStatusChange';
const EVENT_WIFI_CONFIG_STATUS_CHANGE = 'wifiConfigStatusChange';

const WIFI_RUNNING_STATUS = 'wifiRunningStatus';

const EVENT_CONFIRM_UPLOAD_CODE_STATUS_CHANGE = 'uploadCodeStatusChange';

const TIMEOUT = 5000;
const TIMEOUT_1 = 2500;

const STA_STATE_CONNECTED = 0;
const STA_STATE_CONNECTING = 1;
const STA_STATE_CONNECT_FAILED = 2;

class WifiStore extends EventEmitter {
  constructor() {
    super(...arguments);
    this._serviceWifiConnected = true;
    this._connectChosenWifiSuc = false;
    this._socketId = 0;
    this._intervalId = 0;
    this._wifiModuleList = [];
    this._wifiConfigSuc = false;
    this._wifiSSIDList = [];
    this._wifiConfigLimit = 15;
    this._wifiConfigCounter = 0;
    this._wifiConfigIntervalId = 0;
    this._targetIp = '';
    this._targetPort = 0;
    this._wifiRunningStatus = 'stopped'; //running stopped
    this._uploadCodeSuc = true; 
    this._recvwifiCount = 0;
    this._recvwifiMaxCount = 10;
    this._wifiType = 'AP';
    this._getSSIDIntervalId = 0;
    this._needQuery = false;
    this._targetApIp = '';
    this._targetApPort = 0;
    engine.on('driverConnectResult', this.connectCallback.bind(this));
    engine.on('driverDisconnect', this.disConnectCallback.bind(this));
    setInterval(this.wifiStoreTimer.bind(this), 1000);
  }

  wifiStoreTimer() {
    this._recvwifiCount += 1;
    if(this._recvwifiCount >= this._recvwifiMaxCount) {
      this._wifiModuleList = [];
      this._recvwifiCount = 0;
    }
  }

  connectCallback(connectResult) {
    console.log('connectCallback connect success');
    let self = this;
    self.stopSearchConfigWifiModule();
    if(connectResult && connectResult.result == 'success') {
      self._connectChosenWifiSuc = true;
      self.trigger(EVENT_CONNECT_CHOSEN_WIFI_STATUS_CHANGE);
      self.queryWifiWorkMode();
    } else {
      self._connectChosenWifiSuc = false;
      self.trigger(EVENT_CONNECT_CHOSEN_WIFI_STATUS_CHANGE);
    }
  }

  disConnectCallback(type) {
    let self = this;
    console.log('disConnectCallback type:' + type);
    self._connectChosenWifiSuc = false;
    self.trigger(EVENT_CONNECT_CHOSEN_WIFI_STATUS_CHANGE);
    self.stopSearchConfigWifiModule();
    UIActions.openWifiDialog();
  }

  resetState() {
    console.log('wifiStore resetState');
    let self = this;
    self._wifiModuleList = [];
    self._wifiSSIDList = [];
    self._socketId = 0;
    self._intervalId = 0;
    self._wifiConfigCounter = 0;
    self._wifiConfigIntervalId = 0;
    self._uploadCodeSuc = true;
    self._wifiRunningStatus = 'stopped';
    self._getSSIDIntervalId = 0;
    self._needQuery = false;
  }

  getUploadSuc() {
    return this._uploadCodeSuc;
  }
  
  getWifiRunningStatus() {
    return this._wifiRunningStatus;
  }

  getWifiConfigStatus() {
    return this._wifiConfigSuc;
  }

  getServiceWifiConnectStatus() {
    return this._serviceWifiConnected;
  }

  getSearchWifiModuleStatus() {
    let self = this;
    return self._wifiModuleList;
  }

  getApConfigWifiList() {
    let self = this;
    return self._wifiSSIDList;
  }

  getConnectChosenWifiStatus() {
    return this._connectChosenWifiSuc;
  }

  queryWifiWorkMode() {
    console.log('queryWifiWorkMode');
    let self = this;
    let getUrl = 'http://' + self._targetIp + ':8083/queryWorkMode';
    self._wifiRunningStatus = 'stopped';
    let callback = function(status, responseText) {
      if(responseText == 'timeout') {
        console.log('queryWifiWorkMode request timeout');
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('queryWifiWorkMode response.errCode:' + response.errCode);
        if(response.errCode == ErrorCode.EVERYTHING_OK) {
          console.log('queryWifiWorkMode response.workMode:' + response.workMode);
          if(response.workMode == 'LocalMode') {
            self._wifiRunningStatus = 'running';
            self.trigger(WIFI_RUNNING_STATUS);
          }
        } 
      } else {
        console.log('query workMode failed');
      }
    };
    RestfulApiImpl.doGet(getUrl, callback, TIMEOUT);
  }

  stopGetServiceConnectedWifi() {
    let self = this;
    if(self._getSSIDIntervalId != 0) {
      console.log('stopGetWifiSSID _getSSIDIntervalId:' + self._getSSIDIntervalId);
      clearInterval(self._getSSIDIntervalId);
      self._getSSIDIntervalId = 0;
    }
  }

  getServiceConnectedWifi() {
    console.log('[WifiStore:getServiceConnectedWifi]');
    let self = this;
    if(window.WifiWizard) {
      if(self._wifiType == 'STA') {
        WifiWizard.getCurrentSSID(function(ssid) {
          console.log('[WifiStore:getServiceConnectedWifi] ssid:' + ssid);
          self._serviceWifiConnected = true;
          self.trigger(EVENT_SERVICE_WIFI_STATUS_CHANGE);
        }, function(failed) {
          console.log('[WifiStore:getServiceConnectedWifi] failed:' + failed);
          this._serviceWifiConnected = false;
          self.trigger(EVENT_SERVICE_WIFI_STATUS_CHANGE);
        });
      } else if(self._wifiType == 'AP') {
        if(self._getSSIDIntervalId == 0) {
          self._getSSIDIntervalId = setInterval(function() {
            WifiWizard.getCurrentSSID(function(ssid) {
              console.log('[WifiStore:getServiceConnectedWifi] ssid:' + ssid);
              if(ssid.substr(0,6) == 'neuron') {
                clearInterval(self._getSSIDIntervalId);
                self._getSSIDIntervalId = 0;
                self._serviceWifiConnected = true;
              } else {
                self._serviceWifiConnected = false;
              }
              self.trigger(EVENT_SERVICE_WIFI_STATUS_CHANGE);
            }, function(failed) {
              console.log('wifiStore get ssid failed:' + failed);
              this._serviceWifiConnected = false;
              self.trigger(EVENT_SERVICE_WIFI_STATUS_CHANGE);
            });
          }, 1000);
        }
      }
    }
  }

  startSearchConfigWifiModule() {
    let self = this;
    if(window.chrome) {
      let ipRequest = [{msgType: 'ipRequest'}];
      let ipRequestStr = JSON.stringify(ipRequest);
      chrome.sockets.udp.onReceiveError.addListener(self.receiveErrorListener.bind(this));
      chrome.sockets.udp.onReceive.addListener(self.receiveListener.bind(self));
      chrome.sockets.udp.create(function(createInfo) {
        self._socketId = createInfo.socketId;
        console.log('startSearchConfigWifiModule createInfo.socketId:' + self._socketId);
        chrome.sockets.udp.bind(createInfo.socketId, '0.0.0.0', 0, function(result) {
          console.log('startSearchConfigWifiModule bind result:' + result);
          chrome.sockets.udp.setBroadcast(createInfo.socketId, true, function(result) { 
            console.log('startSearchConfigWifiModule setBroadcast result:' + result);
            
            self._intervalId = setInterval(function() {
              let message = self.stringToArrayBuffer(ipRequestStr);
              chrome.sockets.udp.send(createInfo.socketId, message, '255.255.255.255', 8081, function(result) {
                if (result < 0) {
                  console.log('startSearchConfigWifiModule fail: ' + result);
                } else {
                  console.log('startSearchConfigWifiModule success ' + result);
                }
              });
            } ,1000);

          });
        });
      });
    } else {
      console.log('startSearchConfigWifiModule not window.chrome');
    }
  }

  stringToArrayBuffer(requestMsg) {
    let buf = new ArrayBuffer(requestMsg.length);
    let bufView = new Uint8Array(buf);
    for (let i = 0, strLen = requestMsg.length; i < strLen; i++) {
      bufView[i] = requestMsg.charCodeAt(i);
    }
    return buf;
  }

  stopSearchConfigWifiModule() {
    let self = this;
    
    if(window.chrome) {
      console.log('stopSearchConfigWifiModule intervalId:' + self._intervalId + ', close socketId:' + self._socketId);
      clearInterval(self._intervalId);
      self._intervalId = 0;
      chrome.sockets.udp.close(self._socketId);
      chrome.sockets.udp.onReceiveError.removeListener(self.receiveErrorListener.bind(self));
      chrome.sockets.udp.onReceive.removeListener(self.receiveListener.bind(self));

    } else {
      console.log('stopSearchConfigWifiModule not window.chrome');
    }
  }

  receiveErrorListener(info) {
    console.log('wifiStore RecvError on socket: ' + info.socketId);
    this.stopSearchConfigWifiList();
  }

  ab2str(buf) {
    let bufStr = String.fromCharCode.apply(null, new Uint8Array(buf));
    let bufObj = JSON.parse(bufStr);
    if(bufObj.length > 0) {
      // console.log('msgType:' + bufObj[0].msgType);
      // console.log('IP:' + bufObj[0].IP);
      // console.log('MAC:' + bufObj[0].MAC);
      return bufObj[0].MAC;
    }
    return 'defaultname';
  }

  getWifiName(ip, connectTo) {
    let ipArr = ip.split('.');
    let name = '';
    for(let i = 0; i < ipArr.length; i++) {
      name += ipArr[i];
    }
    let wifiName = '';
    if(name.length > 6) {
      wifiName = name.substr(name.length-6);
    } else {
      wifiName = name;
    }

    if(connectTo) {
      wifiName = '连接到' + wifiName;
    }
    return wifiName;
  }

  receiveListener(info) {
    let self = this;
    console.log('wifiStore Recv from socket: ' + JSON.stringify(info));

    //todo get ip
    let needPut = true;
    let ip = info.remoteAddress;
    let port = info.remotePort;
    let name = self.ab2str(info.data);
    if(name == 'defaultname') {
      name = self.getWifiName(info.remoteAddress, false);
    }
    for(let i = 0; i < self._wifiModuleList.length; i++) {
      if(ip == self._wifiModuleList[i].ip) {
        needPut = false;
        break;
      }
    }

    if(needPut) {
      let wifi = {};
      wifi.ip = ip;
      wifi.port = port;
      wifi.mac = name;
      self._wifiModuleList.push(wifi);
      self.trigger(EVENT_WIFI_MODULE_STATUS_CHANGE);
    }
    if(self._needQuery) {
      self.stopSearchConfigWifiModule();
      self._targetApIp = ip;
      self._targetApPort = port;
      self.queryWifiList();
    }
  }

  changeWifiType(type) {
    console.log('changeWifiType type:' + type);
    let self = this;
    self.stopSearchConfigWifiModule();
    self.stopGetServiceConnectedWifi();
    self.stopQueryWifiStaState();
    self.resetState();
    self._wifiType = type;
  }

  queryStaConnectedWifi() {
    console.log('[WifiStore:queryStaConnectedWifi]');
    let self = this;
    self.changeWifiType('STA');
    self.getServiceConnectedWifi();
  }

  openWifiDialog() {
    console.log('[WifiStore:openWifiDialog]');
    let self = this;
    self.changeWifiType('STA');
    self.getServiceConnectedWifi();
  }

  searchWifiModule() {
    let self = this;
    self.stopSearchConfigWifiModule();
    self.resetState();
    self.startSearchConfigWifiModule();
  }

  stopSearchWifiModule() {
    let self = this;
    self.stopSearchConfigWifiModule();
    self.stopQueryWifiStaState();
    self.stopGetServiceConnectedWifi();
    self.resetState();
  }

  connectChosenWifi(ip, port) {
    let self = this;
    self.stopSearchConfigWifiModule();
    self.resetState();
    console.log('connectChosenWifi ip:' + ip + ', port:' + port);
    self._targetIp = ip;
    self._targetPort = port;
    engine.setConfig({serverIP: ip});
    engine.setDriver('cordovatcp');
  }

  disconnWifi() {
    let self = this;
    console.log('WifiStore disconnWifi');
    engine.closeDriver();
    self._connectChosenWifiSuc = false;
    self.trigger(EVENT_CONNECT_CHOSEN_WIFI_STATUS_CHANGE);
  }

  queryApConnectedWifi() {
    console.log('WifiStore queryApConnectedWifi');
    let self = this;
    self.stopSearchConfigWifiModule();
    self.stopGetServiceConnectedWifi();
    self.stopQueryWifiStaState();
    self.resetState();
    if(self._wifiType == 'STA') {
      self._wifiType = 'AP';
      self.getServiceConnectedWifi();
    } else if(self._wifiType == 'AP') {
      setTimeout(()=>{
        self.getServiceConnectedWifi();
      }, 2000);
    }
  }

  queryApWifiList() {
    let self = this;
    self.stopSearchConfigWifiModule();
    self.resetState();
    self._needQuery = true;
    self.startSearchConfigWifiModule();
    // self.queryWifiList();
  }

  queryWifiList() {
    let self = this;
    self.stopSearchWifiModule();
    let getUrl = 'http://' + self._targetApIp + ':8083/queryWifiList';
    console.log(getUrl);
    let callback = function(status, responseText) {
      if(responseText == 'timeout') {
        console.log('request queryWifiList timeout');
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('response.errCode:' + response.errCode);
        if(response.errCode == ErrorCode.EVERYTHING_OK) {
          console.log('response.ssids.length:' + response.ssids.length);
          for(let i = 0; i < response.ssids.length; i++) {
            let ssidObj = response.ssids[i];
            console.log('ssidObj:' + JSON.stringify(ssidObj));
            let obj = {};
            obj.encrypt = 1;
            for(let ssid in ssidObj) {
              obj.ssid = ssid;
              if(ssidObj[ssid] == 'none' || ssidObj[ssid] == 'NONE') {
                obj.encrypt = 0;
              }
            }

            console.log('response.ssids.ssid-' + i + ':' + obj.ssid + ',encryption:' + obj.encrypt);
            let needPut = true;
            for(let j = 0; j < self._wifiSSIDList.length; j++) {
              if(self._wifiSSIDList[j].ssid == obj.ssid) {
                needPut = false;
                break;
              }
            }
            if(needPut) {
              self._wifiSSIDList.push(obj);
            }
          }
          self.trigger(EVENT_AP_QUERY_WIFI_LIST_STATUS_CHANGE);
        } 
      } else {
        console.log('request queryWifiList failed');
      }
    };
    RestfulApiImpl.doGet(getUrl, callback, 20000);
  }

  uploadWifiConfig(ssid, passwd) {
    console.log('uploadWifiConfig ssid:' + ssid + ', passwd:' + passwd);
    let self = this;
    self.stopQueryWifiStaState();
    self.stopSearchWifiModule();

    let postUrl = 'http://' + self._targetApIp + ':8083/configSta';
    console.log(postUrl);

    let wifiConfig = {};
    wifiConfig.ssid = ssid;
    wifiConfig.passwd = passwd;
    let postData = JSON.stringify(wifiConfig);
    let callback = function(status, responseText) {
      console.log('request.status:' + status);
      if(responseText == 'timeout') {
        console.log('request timeout');
        self._wifiConfigSuc = false;
        self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('response.errCode:' + response.errCode);
        if(response.errCode == ErrorCode.EVERYTHING_OK) {
          self._wifiConfigSuc = true;
          self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
          console.log('AP set websocket driver');
          engine.setDriver('cordovatcp');
          return;
        }
      } else {
        console.log('post wifi config failed, request.status:' + status);
        // self._wifiConfigSuc = false;
        // self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
      }
      if(self._wifiConfigIntervalId == 0) {
        self._wifiConfigIntervalId = setInterval(function() {
          self.queryWifiStaState();
        }, 3000);
        console.log('uploadWifiConfig _wifiConfigIntervalId:' + self._wifiConfigIntervalId);
      }
    };
    console.log('uploadWifiConfig doPost');
    RestfulApiImpl.doPost(postUrl, postData, callback, TIMEOUT);
  }

  stopQueryWifiStaState() {
    let self = this;
    console.log('stopQueryWifiStaState self._wifiConfigIntervalId:' + self._wifiConfigIntervalId);
    if(self._wifiConfigIntervalId != 0) {
      clearInterval(self._wifiConfigIntervalId);
      self._wifiConfigIntervalId = 0;
    }
  }

  queryWifiStaState() {
    let self = this;
    self._wifiConfigCounter += 1;
    console.log('_wifiConfigCounter:' + self._wifiConfigCounter);
    if(self._wifiConfigCounter >= self._wifiConfigLimit) {
      self._wifiConfigCounter = 0;
      clearInterval(self._wifiConfigIntervalId);
      self._wifiConfigIntervalId = 0;
      console.log('clearInterval intervalId:' + self._wifiConfigIntervalId);
      self._wifiConfigSuc = false;
      self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
    }

    let getUrl = 'http://' + self._targetApIp + ':8083/queryStaState';
    console.log(getUrl);

    let callback = function(status, responseText) {
      if(responseText == 'timeout') {
        console.log('request queryWifiStaState timeout');
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('response.errCode:' + response.errCode + ', typeof(errCode):' + typeof(response.errCode));
        if(response.errCode == STA_STATE_CONNECTED) {
          console.log('response.ssid:' + response.ssid);
          self._wifiConfigCounter = 0;
          clearInterval(self._wifiConfigIntervalId);
          self._wifiConfigIntervalId = 0;
          self._wifiConfigSuc = true;
          self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
          engine.setDriver('cordovatcp');
        } else if(response.errCode == STA_STATE_CONNECT_FAILED) {
          self._wifiConfigCounter = 0;
          clearInterval(self._wifiConfigIntervalId);
          self._wifiConfigIntervalId = 0;
          self._wifiConfigSuc = false;
          self.trigger(EVENT_WIFI_CONFIG_STATUS_CHANGE);
        } else if(response.errCode == STA_STATE_CONNECTING) {
          console.log('request queryWifiStaState connecting');
        }
      } else {
        console.log('request queryWifiStaState failed');
      }
    };
    RestfulApiImpl.doGet(getUrl, callback, TIMEOUT_1);
  }

  confirmUploadCode() {
    let self = this;
    let postUrl = 'http://' + self._targetIp + ':8083/uploadFlow';
    console.log(postUrl);
    let uploadData = {};
    uploadData.uuid = engineGetUUID();
    uploadData.userkey = 'makeiotblock';
    uploadData.flow = engine.exportFlow();
    let postData = JSON.stringify(uploadData);
    
    let callback = function(status, responseText) {
      console.log('request.status:' + status);
      if(responseText == 'timeout') {
        console.log('request timeout');
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('response.errCode:' + response.errCode);
        if(response.errCode == ErrorCode.EVERYTHING_OK) {
          self._wifiRunningStatus = 'running';
          self._uploadCodeSuc = true;
          self.trigger(EVENT_CONFIRM_UPLOAD_CODE_STATUS_CHANGE);
        } 
      } else {
        console.log('post projectData failed, request.status:' + status);
      }
      if(self._uploadCodeSuc) {
        setTimeout(()=>{
          self.trigger(WIFI_RUNNING_STATUS);
        }, 2000);
      } else {
        self.trigger(WIFI_RUNNING_STATUS);
      }
      
    };
    RestfulApiImpl.doPost(postUrl, postData, callback, TIMEOUT);
  }

  cancelUpload() {
    let self = this;
    let getUrl = 'http://' + self._targetIp + ':8083/stopRunning';
    console.log(getUrl);
    let callback = function(status, responseText) {
      if(responseText == 'timeout') {
        console.log('request timeout');
      } else if(status == 200) {
        let response = JSON.parse(responseText);
        console.log('response.errCode:' + response.errCode);
        if(response.errCode == ErrorCode.EVERYTHING_OK) {
          self._wifiRunningStatus = 'stopped';
          self.trigger(WIFI_RUNNING_STATUS);
        } 
      } else {
        console.log('get cloudapps failed');
      }
    };
    RestfulApiImpl.doGet(getUrl, callback, TIMEOUT);
  }
  
}

let _instance = new WifiStore();

AppDispatcher.register((action) => {
  if (action.actionType == AppConstants.WIFI_DIALOG_OPEN || action.actionType == AppConstants.RECONNECT_SERVICE_WIFI) {
    console.log('open wifi dialog or reconnect service wifi');
    _instance.openWifiDialog();
  } else if(action.actionType == AppConstants.SEARCH_WIFI_MODULE) {
    console.log('search wifi module');
    _instance.searchWifiModule();
  } else if(action.actionType == AppConstants.CONNECT_CHOSEN_WIFI) {
    console.log('connect chosen wifi');
    _instance.connectChosenWifi(action.ip, action.port);
  } else if(action.actionType == AppConstants.STOP_SEARCH_WIFI_MODULE) {
    console.log('stop searching wifi module');
    _instance.stopSearchWifiModule();
    _instance.stopGetServiceConnectedWifi();
  } else if(action.actionType == AppConstants.DISCONN_WIFI) {
    console.log('disconn wifi');
    _instance.disconnWifi();
  } else if(action.actionType == AppConstants.UPLOAD_WIFI_CONFIG) {
    console.log('upload wifi config');
    _instance.uploadWifiConfig(action.ssid, action.pwd);
  } else if(action.actionType == AppConstants.QUERY_AP_CONNECTED_WIFI) {
    console.log('query ap connected wifi');
    _instance.queryApConnectedWifi(); 
  } else if(action.actionType == AppConstants.QUERY_AP_WIFILIST) {
    console.log('query ap wifilist');
    _instance.queryApWifiList();
  } else if(action.actionType == AppConstants.CONFIRM_UPLOAD_CODE) {
    console.log('confirm upload code');
    _instance.confirmUploadCode();
  } else if(action.actionType == AppConstants.CANCEL_UPLOAD) {
    console.log('cancel upload');
    _instance.cancelUpload();
  } else if(action.actionType == AppConstants.CHANGE_WIFI_TYPE) {
    console.log('change wifi type');
    _instance.changeWifiType(action.type);
  } else if(action.actionType == AppConstants.QUERY_STA_CONNECTED_WIFI) {
    console.log('query sta connected wifi');
    _instance.queryStaConnectedWifi();
  }
});

export default _instance;



