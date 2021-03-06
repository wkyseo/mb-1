import React, { Component } from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import wifiStore from '../../stores/wifiStore';
import UIActions from '../../actions/UIActions';
import Modal from 'react-modal';
import languages from '../../languages';
import tapOrClick from '../../utils/tapOrClick';

require('./WifiDialog.less');


class WifiDialog extends Component {
  constructor() {
    super(...arguments);
    this._wifiType = 'STA';
    this._apNeuronsWifiConfigStatus = 'apDisconn'; //apDisconn apConn apConnPwd apConfiging apConfigSuc apConfigFail
    this._staNeuronsWifiConfigStatus = 'staDisconn';  //staDisconn staConnSuc staConnFail staSearchSuc staSearchFail staWifiConnecting staWifiConnSuc staWifiConnFail
    this._firstSecondConnected = false;
    this._secondThirdConnected = false;
    this._downCountNumber = 10;
    this._intervalID = 0;
    this._chosenWifiIP = '';
    this._chosenWifiPort = 0;
    this._wifiModuleList = [];
    this._chosenWifiIndex = 0;
    this._showQueryWifiList = false;
    this._chosenSSID = '';
    this._chosenSSIDEncrypt = 0;
    this._chosenSSIDPwd = '';
    this._wifiConfigSuc = false;
    this._apConnectedWifi = false;
    this._wifiSSIDList = [];
    this._querySSIDSuc = false;
    this.state = {
      modalIsOpen: false,
      rerender: false,
    };
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    clearInterval(this._intervalID);
    UIActions.stopSearchWifiModule();
    this.resetState();
    this.setState({modalIsOpen: false});
  }

  cancelConfigApWifi() {
    this.resetState();
    this.setState({modalIsOpen: false});
  }

  resetState() {
    let self = this;
    self._wifiType = 'STA';
    self._apNeuronsWifiConfigStatus = 'apDisconn';
    self._staNeuronsWifiConfigStatus = 'staDisconn';
    self._firstSecondConnected = false;
    self._secondThirdConnected = false;
    self._downCountNumber = 20;
    self._intervalID = 0;
    self._chosenWifiIP = '';
    self._chosenWifiPort = 0;
    self._wifiModuleList = [];
    self._showQueryWifiList = false;
    self._chosenSSID = '';
    self._chosenSSIDEncrypt = 0;
    self._chosenSSIDPwd = '';
    self._wifiConfigSuc = false;
    self._wifiSSIDList = [];
    self._querySSIDSuc = false;
  }

  chooseWifi(e) {
    let self = this;
    let ip = e.currentTarget.dataset.ip;
    let port = e.currentTarget.dataset.port;
    self._chosenWifiIP = ip;
    self._chosenWifiPort = port;
    self._staNeuronsWifiConfigStatus = 'staWifiConnecting';
    self.setState({
      rerender: false
    });
    UIActions.connectChosenWifi(ip, port);
    self._chosenWifiIndex = 0;
    self._intervalID = setInterval(self.connectingWifi.bind(self), 500);
  }

  connectingWifi() {
    let self = this;
    if(self._staNeuronsWifiConfigStatus != 'staWifiConnecting') {
      clearInterval(self._intervalID);
      self._intervalID = 0;
    } else {
      console.log('connectingWifi');
      self.setState({
        rerender: false
      });
    }
  }

  reRenderWifiConnect() {
    let self = this;
    self.resetState();
    console.log('reRenderWifiConnect');
    self.setState({
      rerender: false
    });
    clearInterval(self._intervalID);
    self._intervalID = setInterval(self.downCountInterval.bind(self), 1000);
    UIActions.reConnectServiceIpad();
  }

  reConnectWifi() {
    let self = this;
    let tips = '';
    if(self._wifiType == 'STA' && self._staNeuronsWifiConfigStatus == 'staConnFail') {
      tips = (
        <div className='wifi-body-reconnect' {...tapOrClick(self.reRenderWifiConnect.bind(self))}> 
          <j className='wifi-body-reconnect-text'>{languages.getTranslation('reconnect-wifi')}</j>
        </div>
      );
    }
    return tips;
  }

  getConnectingWifiStatus() {
    let self = this;
    let tips = '';
    if(self._wifiType == 'STA' && self._staNeuronsWifiConfigStatus == 'staWifiConnecting') {
      let index = self._chosenWifiIndex++ % 5;
      let imgSrc = './img/wifi-' + index + '.png';
      tips = (
        <img className="dialog-wifi-unit-name-icon-connecting" src={imgSrc} />
      );
    }
    return tips;
  }

  getWifiUnit(key, mac, ip, port) {
    let self = this;
    let tips = '';
    // console.log(ip, port, self._chosenWifiIP, self._chosenWifiPort);
    if(self._wifiType == 'STA' && self._staNeuronsWifiConfigStatus == 'staWifiConnecting') {
      if(ip != self._chosenWifiIP || port != self._chosenWifiPort) {
        return tips;
      }
    }

    let imgSrc = './img/wifi-module.png';
    if(ip == self._chosenWifiIP && port == self._chosenWifiPort) {
      imgSrc = './img/wifi-module-press.png';
    }
    tips = (
      <li className="dialog-wifi-unit" key={key} data-ip={ip} data-port={port} {...tapOrClick(self.chooseWifi.bind(self))}>
          <div className="dialog-wifi-unit-name">
            <img className="dialog-wifi-unit-name-icon" src={imgSrc} /> 
            {self.getConnectingWifiStatus()}
            <j className='dialog-wifi-unit-name-text' style={{display: self._staNeuronsWifiConfigStatus != 'staWifiConnecting'? 'inline': 'none'}} >{mac}</j>
          </div>
      </li>
    );
    return tips;
  }

  getWifiList() {
    let self = this;
    let tips = '';
    let wifiArr = [];
    let length = 0;
    for(let i = 0; i < self._wifiModuleList.length; ++i) {
      let w = self._wifiModuleList[i];
      wifiArr.push(self.getWifiUnit(i, w.mac, w.ip, w.port));
    }
    // wifiArr.push(self.getWifiUnit(0, 'mac0', '127.0.0.1', 8000));
    // wifiArr.push(self.getWifiUnit(1, 'mac1', '127.0.0.1', 8001));
    // wifiArr.push(self.getWifiUnit(2, 'mac2', '127.0.0.1', 8002));
    // wifiArr.push(self.getWifiUnit(3, 'mac3', '127.0.0.1', 8003));
   
    if(self._wifiType == 'STA' && self._staNeuronsWifiConfigStatus == 'staWifiConnecting') {
      length = 200;
    } else {
      length = wifiArr.length * 200;
    }
    if(self._wifiType == 'STA' && (self._staNeuronsWifiConfigStatus == 'staSearchSuc' || self._staNeuronsWifiConfigStatus == 'staWifiConnecting')) {
      tips = (
        <div className='dialog-wifi-list-div'>
          <ul className="dialog-wifi-list" ref="wifiList"  style={{width: length+'px'}}>
            {wifiArr}
          </ul>
        </div>
      );
    }
    return tips;
  }

  getStaWifiConnSuc() {
    let self = this;
    let tips = '';
    
    if(self._wifiType == 'STA' && self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
      tips = (
        <div className='dialog-wifi-list-div'>
          <ul className="dialog-wifi-list" ref="wifiList" style={{width: '200px'}}>
            <li className="dialog-wifi-unit" key='0' data-ip='127.0.0.1' data-port='8000' style={{left: '108px'}} >
              <div className="dialog-wifi-unit-name">
                <img className="dialog-wifi-unit-name-icon" src='./img/wifi-module.png' /> 
                <img className="dialog-wifi-unit-name-icon-suc" src='./img/wifi-success.png' /> 
              </div>
            </li>
          </ul>
        </div>
      );
    }
    return tips;
  }

  getDownCount() {
    let self = this;
    let tips = '';
    if(self._wifiType == 'STA') {
      if(self._staNeuronsWifiConfigStatus == 'staDisconn' || self._staNeuronsWifiConfigStatus == 'staConnSuc') {
        tips = (
          <div className='dialog-wifi-body-downcount'>
            <j className='downcount-number'>{self._downCountNumber}</j>
          </div>
        );
      }
    }
    return tips;
  }

  downCountInterval() {
    let self = this;
    let continueDownCount = false;
    // console.log('_intervalID:' + self._intervalID + ', downCountInterval:' + self._downCountNumber);
    if(self._wifiType == 'STA') {
      if(self._staNeuronsWifiConfigStatus == 'staDisconn' || self._staNeuronsWifiConfigStatus == 'staConnSuc') {
        if(self._downCountNumber > 0) {
          continueDownCount = true;
          self._downCountNumber = self._downCountNumber - 1;
          self.setState({
            rerender: false
          });
        } else {
          if(self._staNeuronsWifiConfigStatus == 'staDisconn') {
            self._staNeuronsWifiConfigStatus = 'staConnFail';
          } else if(self._staNeuronsWifiConfigStatus == 'staConnSuc') {
            self._staNeuronsWifiConfigStatus = 'staSearchFail';
          }
          
          // self._staNeuronsWifiConfigStatus = 'staConnSuc';
          console.log('downCountInterval set self._staNeuronsWifiConfigStatus == staConnFail');
          self.setState({
            rerender: false
          });
        }
      }
    } 
    if(!continueDownCount) {
      clearInterval(self._intervalID);
      self._intervalID = 0;
    }
  }

  getStaBody() {
    let self = this;
    let tips = '';
    tips = (
      <div className='dialog-wifi-sta-body'>
        <j className='dialog-wifi-body-text'>{self.getStaBodyTips()}</j>
        {self.getStaBodyTipsReason()}
      </div>
    );
    return tips;
  }

  getStaBodyTipsReason() {
    let self = this;
    let tips = '';
    if(self._staNeuronsWifiConfigStatus == 'staSearchFail') {
      tips = (
        <div className='dialog-wifi-sta-body-reason'>
          <div className='reason-one'></div>
          <j className='dialog-reason-one'>{languages.getTranslation('check-if-hardware-poweroff')}</j>
          <div className='reason-second'></div>
          <j className='dialog-reason-second'>{languages.getTranslation('check-if-wifi-added')}</j>
        </div>
      );
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
      tips = (
        <div className='dialog-wifi-sta-body-reason'>
          <div className='reason-one'></div>
          <div className='dialog-reason-one' style={{left: '3px'}}>{languages.getTranslation('network-unstable')}</div>
          <div className='reason-second'></div>
          <div className='dialog-reason-second'>{languages.getTranslation('try-connect-new-wifi-module')}</div>
          <div className='reason-third'></div>
          <div className='dialog-reason-third'>{languages.getTranslation('wifi-destroyed')}</div>
          <div className='dialog-reason-fourth'>tecsupport@makeblock.com</div>
        </div>
      );
    }
    return tips;
  }

  getStaBodyTips() {
    let self = this;
    let tips = '';
    if(self._staNeuronsWifiConfigStatus == 'staDisconn') {
      tips = languages.getTranslation('wifi-connecting');
    } else if(self._staNeuronsWifiConfigStatus == 'staConnSuc') {
      tips = languages.getTranslation('searching-wifi-module');
    } else if(self._staNeuronsWifiConfigStatus == 'staConnFail') {
      tips = languages.getTranslation('open-wifi-settings');
    } else if(self._staNeuronsWifiConfigStatus == 'staSearchSuc') {
      tips = languages.getTranslation('choose-connected-wifi');
    } else if(self._staNeuronsWifiConfigStatus == 'staSearchFail') {
      tips = languages.getTranslation('configed-wifi-not-found');
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnecting') {
      tips = languages.getTranslation('connecting-neuron-wifi');
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
      tips = languages.getTranslation('connect-wifi-success');
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
      tips = languages.getTranslation('cannot-connect-neuron-wifi');
    }
    return tips;
  }

  getApBodyTips() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
      tips = languages.getTranslation('connect-neuron-hotpoint');
    } else if(self._apNeuronsWifiConfigStatus == 'apConn') {
      tips = languages.getTranslation('choose-hotpoint-for-wifi');
    } else if(self._apNeuronsWifiConfigStatus == 'apConnPwd') {
      tips = languages.getTranslation('input-password');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfiging') {
      tips = languages.getTranslation('config-wifi-connecting-network');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigSuc') {
      tips = languages.getTranslation('connect-wifi-module-success');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigFail') {
      tips = languages.getTranslation('cannot-connect-neuron-wifi');
    }
    return tips;
  }

  getWifiSetting() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
      tips = (
        <div className='dialog-wifi-settings'> 
          <img className="wifi-setting" src="./img/wifi-setting.png" /> 
          <div className='wifi-setting-text'>{languages.getTranslation('wifi-setting-text')} > </div>
          <img className="wifi-setting-icon" src="./img/wifi-setting-icon.png" /> 
          <div className='wifi-setting-icon-text'>WIFI</div>
        </div>
      );
    }
    return tips;
  }

  getWifiSettingIcon() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
      tips = (
        <div className='dialog-wifi-settings-icon'> 
          <div className='icon-div-first'></div>
          <div className='icon-div-second'></div>
          <div className='icon-div-third'></div>
          <div className='icon-div-fourth'>
            <img className="icon-div-fourth-hotpoint" src="./img/wifi-hotpoint.png" /> 
          </div>
        </div>
      );
    }
    return tips;
  }

  chooseSSID(e) {
    let self = this;
    self._chosenSSID = e.currentTarget.dataset.ssid;
    self._chosenSSIDEncrypt = e.currentTarget.dataset.encrypt;
    self.refs.inputssid.value = self._chosenSSID;
    self._showQueryWifiList = false;
    self.setState({
      rerender: false
    });
  }

  uploadWifiConfig(ssid, pwd) {
    UIActions.uploadWifiConfig(ssid, pwd);
  }

  showQueryWifiList() {
    let self = this;
    self._showQueryWifiList = self._showQueryWifiList ? false : true;
    self.setState({
      rerender: false
    });
  }

  getQueryWifiUnit(ssid, encrypt) {
    let self = this;
    let tips = '';
    tips = (
      <li className="dialog-wifi-unit" key={ssid} data-ssid={ssid} data-encrypt={encrypt} {...tapOrClick(self.chooseSSID.bind(self))}>
          <div className="dialog-wifi-unit-name">
            <div className="div-icon-input-wifi">
              <img className="icon-input-wifi" src="./img/wifi-input.png" /> 
            </div> 
            <div className='dialog-wifi-unit-name-text'>{ssid}</div>
          </div>
        </li>
    );
    return tips;
  }

  getQueryWifiList() {
    let self = this;
    let wifiListTips = '';
    let wifiArr = [];
    for(let i = 0; i < self._wifiSSIDList.length; ++i) {
      let ssidObj = self._wifiSSIDList[i];
      wifiArr.push(self.getQueryWifiUnit(ssidObj.ssid, ssidObj.encrypt));
    }
    // wifiArr.push(self.getQueryWifiUnit('makeblock-office', 1));
    // wifiArr.push(self.getQueryWifiUnit('makeblock-guest', 0));
    // wifiArr.push(self.getQueryWifiUnit('makeblock-shenghuo', 1));
    if(self._wifiType == 'AP' && self._showQueryWifiList) {
      wifiListTips = (
        <div className='dialog-query-wifilist-div'> 
          <ul className="dialog-query-wifilist" ref="queryWifiList">
            {wifiArr}
          </ul>
        </div>
      );
    }
    return wifiListTips;
  }

  getWifiSSIDInput() {
    let self = this;
    let tips = '';
    console.log('getWifiSSIDInput ' + self._chosenSSID);
    if(self._apNeuronsWifiConfigStatus == 'apConn') {
      tips = (
        <div className='dialog-wifi-ssid-input'> 
          <input className="wifi-ssid-input" ref="inputssid" type="text" name="ssid" defaultValue={self._chosenSSID}/>
          <div className="div-icon-input-wifi">
            <img className="icon-input-wifi" src="./img/wifi-input.png" /> 
          </div>
          <div className="div-icon-backward" {...tapOrClick(self.showQueryWifiList.bind(self))}>
            <img className="icon-wifi-backward" src="./img/icon-backward.png" /> 
          </div>
        </div>
      );
    } else if(self._apNeuronsWifiConfigStatus == 'apConnPwd') {
      tips = (
        <div className='dialog-wifi-ssid-input'> 
          <input className="wifi-ssid-input" ref="inputssid" type="text" name="ssid" defaultValue=""/>
          <div className="div-icon-input-wifi">
            <img className="icon-input-wifi" src="./img/wifi-input.png" /> 
          </div>
          <div className="div-icon-backward" {...tapOrClick(self.showQueryWifiList.bind(self))}>
            <img className="icon-wifi-backward" src="./img/icon-backward.png" /> 
          </div>
          <input className="wifi-pwd-input" ref="inputpwd" type="password" name="pwd" defaultValue={self._chosenSSIDPwd}/>
          <div className="div-icon-wifi-fill">
            <img className="icon-wifi-fill" src="./img/wifi-fill.png" /> 
          </div>
        </div>
      );
    }
    return tips;
  }

  getUseOffLineMode() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apConn' || self._apNeuronsWifiConfigStatus == 'apConnPwd') {
      tips = (
        <div className='dialog-wifi-offline' {...tapOrClick(self.cancelConfigApWifi.bind(self))}> 
         <j className='offline-text'>{languages.getTranslation('use-offline-mode')}</j>
        </div>
      );
    }
    return tips;
  }

  getApBodyTipsReason() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apConfigFail') {
      tips = (
        <div className='dialog-wifi-ap-body-reason'>
          <div className='reason-one'></div>
          <j className='dialog-reason-one'>{languages.getTranslation('wrong-password')}</j>
          <div className='reason-second'></div>
          <j className='dialog-reason-second'>{languages.getTranslation('router-not-support-quick-online')}</j>
        </div>
      );
    } 
    return tips;
  }

  getWifiIcon() {
    let self = this;
    let tips = '';
    
    if(self._wifiType == 'AP' && self._apNeuronsWifiConfigStatus == 'apConfiging') {
      tips = (
        <div className="dialog-ap-wifi-configing">
          <img className="icon-ap-wifi" src='./img/wifi-module.png' /> 
        </div>
      );
    } else if(self._wifiType == 'AP' && self._apNeuronsWifiConfigStatus == 'apConfigSuc') {
      tips = (
        <div className='dialog-wifi-list-div'>
          <ul className="dialog-wifi-list" ref="wifiList" style={{width: '200px'}}>
            <li className="dialog-wifi-unit" key='0' data-ip='127.0.0.1' data-port='8000' style={{left: '108px'}} >
              <div className="dialog-wifi-unit-name">
                <img className="dialog-wifi-unit-name-icon" src='./img/wifi-module.png' /> 
                <img className="dialog-wifi-unit-name-icon-suc" src='./img/wifi-success.png' /> 
              </div>
            </li>
          </ul>
        </div>
      );
    }
    return tips;
  }

  getApBody() {
    let self = this;
    let tips = '';
    tips = (
      <div className='dialog-wifi-ap-body'>
        <j className='dialog-wifi-body-text'>{self.getApBodyTips()}</j>
        {self.getWifiSetting()}
        {self.getWifiSettingIcon()}
        {self.getWifiSSIDInput()}
        {self.getQueryWifiList()}
        {self.getUseOffLineMode()}
        {self.getWifiIcon()}
        {self.getApBodyTipsReason()}
      </div>
    );
    return tips;
  }

  getApFooterTips() {
    let self = this;
    let tips = '';
    if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
      tips = languages.getTranslation('ap-return');
    } else if(self._apNeuronsWifiConfigStatus == 'apConn' || self._apNeuronsWifiConfigStatus == 'apConnPwd') {
      tips = languages.getTranslation('ap-next-step');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfiging') {
      tips = languages.getTranslation('ap-cancel');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigSuc') {
      tips = languages.getTranslation('ap-finish');
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigFail') {
      tips = languages.getTranslation('ap-retry');
    }
    return tips;
  }

  getStaFooterTips() {
    let self = this;
    let tips = '';
    if(self._staNeuronsWifiConfigStatus == 'staWifiConnecting' || self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
      tips = languages.getTranslation('sta-cancel');
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
      tips = languages.getTranslation('sta-finish');
    } else {
      tips = languages.getTranslation('add-new-wifi-module');
    }
    return tips;
  }

  getStaFooterTipsIcon() {
    let self = this;
    let tips = '';
    if(self._staNeuronsWifiConfigStatus == 'staWifiConnecting' || self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
      tips = '';
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
      tips = '';
    } else {
      tips = (
        <img className="icon-add-white" src="./img/icon-add-white.png" /> 
      );
    }
    return tips;
  }

  addNewModule() {
    let self = this;
    clearInterval(self._intervalID);
    self._intervalID = 0;
    if(self._staNeuronsWifiConfigStatus == 'staWifiConnecting' || self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
      self.closeModal();
    } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
      self.closeModal();
    } else {
      self._wifiType = 'AP';
      console.log('addNewModule');
      self.setState({
        rerender: false
      });
      UIActions.queryApConnectedWifi();
    }
  }

  apModeWifiAction() {
    let self = this;
    console.log('apModeWifiAction');
    if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
      self._wifiType = 'STA';
      self.resetState();
      UIActions.changeWifiType('STA');
      self.setState({
        rerender: false
      });
      clearInterval(self._intervalID);
      self._intervalID = setInterval(self.downCountInterval.bind(self), 1000);
      UIActions.queryStaConnectedWifi();
    } else if(self._apNeuronsWifiConfigStatus == 'apConn') {
      self._chosenSSID = self.refs.inputssid.value;
      if(self._querySSIDSuc) {
        if(self._chosenSSID != '') {
          if(self._chosenSSIDEncrypt != 0) {
            self._apNeuronsWifiConfigStatus = 'apConnPwd';
          } else {
            self._apNeuronsWifiConfigStatus = 'apConfiging';
            self.uploadWifiConfig(self._chosenSSID, self._chosenSSIDPwd);
          }
        }
      } else {
        if(self._chosenSSID != '') {
          self._apNeuronsWifiConfigStatus = 'apConnPwd';
        }
      }
      
      self._showQueryWifiList = false;
      self.setState({
        rerender: false
      });
    } else if(self._apNeuronsWifiConfigStatus == 'apConnPwd') {
      self._chosenSSIDPwd = self.refs.inputpwd.value;
      console.log(self._chosenSSID, self._chosenSSIDPwd, self._chosenSSIDEncrypt);
      if(self._querySSIDSuc) {
        if(self._chosenSSID != '' && self._chosenSSIDPwd != '') {
          self._apNeuronsWifiConfigStatus = 'apConfiging';
          self.uploadWifiConfig(self._chosenSSID, self._chosenSSIDPwd);
        }
      } else {
        self._apNeuronsWifiConfigStatus = 'apConfiging';
        self.uploadWifiConfig(self._chosenSSID, self._chosenSSIDPwd);
      }
      self.setState({
        rerender: false
      });
    } else if(self._apNeuronsWifiConfigStatus == 'apConfiging') {
      self._apNeuronsWifiConfigStatus = 'apDisconn';
      self.setState({
        rerender: false
      });
      UIActions.queryApConnectedWifi();
      // self.cancelConfigApWifi();
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigFail') {
      UIActions.changeWifiType('AP');
      self._apNeuronsWifiConfigStatus = 'apConnPwd';
      self.setState({
        rerender: false
      });
      setTimeout(()=>{
        self.refs.inputssid.value = self._chosenSSID;
        console.log(self.refs.inputssid.value);
      }, 1000);
      // self.uploadWifiConfig(self._chosenSSID, self._chosenSSIDPwd);
    } else if(self._apNeuronsWifiConfigStatus == 'apConfigSuc') {
      self.cancelConfigApWifi();
      UIActions.changeWifiType('AP');
    }
  }

  getSecondWifi() {
    let self = this;
    let tips = '';
    if(self._wifiType == 'STA') {
      tips = (
        <img className="header-second-wifi-icon" src="./img/wifi-router.png" /> 
      );
    } else if(self._wifiType == 'AP') {
      tips = (
        <img className="header-third-wifi-icon" src="./img/wifi-neuron.png" /> 
      );
    }
    return tips;
  }

  getThirdWifi() {
    let self = this;
    let tips = '';
    if(self._wifiType == 'STA') {
      tips = (
        <img className="header-third-wifi-icon" src="./img/wifi-neuron.png" /> 
      );
    } else if(self._wifiType == 'AP') {
      tips = (
        <img className="header-second-wifi-icon" src="./img/wifi-router.png" /> 
      );
    }
    return tips;
  }

  renderDialogHeader() {
    let self = this;
    let headerTips = '';
    let firstSecondDashlineTips = 'first-second-dashline';
    let firstSecondReallineTips = 'first-second-realline';

    let secondThirdDashlineTips = 'second-third-dashline';
    let secondThirdReallineTips = 'second-third-realline';

    let showFirstSecondDisconn = false;
    let showSecondThirdDisconn = false;
    if(self._wifiType == 'STA') {
      if(self._staNeuronsWifiConfigStatus == 'staDisconn') {
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
      } else if(self._staNeuronsWifiConfigStatus == 'staConnSuc') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline';
      } else if(self._staNeuronsWifiConfigStatus == 'staConnFail') {
        firstSecondDashlineTips = 'first-second-dashline connect-fail-cover';
        firstSecondReallineTips = 'first-second-realline connect-fail';
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
        showFirstSecondDisconn = true;
      } else if(self._staNeuronsWifiConfigStatus == 'staSearchSuc' || self._staNeuronsWifiConfigStatus == 'staWifiConnecting') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline';
      } else if(self._staNeuronsWifiConfigStatus == 'staSearchFail' || self._staNeuronsWifiConfigStatus == 'staWifiConnFail') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline';
        secondThirdReallineTips = 'second-third-realline connect-fail';
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
        showSecondThirdDisconn = true;
      } else if(self._staNeuronsWifiConfigStatus == 'staWifiConnSuc') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline connect-success';
      }
    } else if(self._wifiType == 'AP') {
      if(self._apNeuronsWifiConfigStatus == 'apDisconn') {
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
      } else if(self._apNeuronsWifiConfigStatus == 'apConn' || self._apNeuronsWifiConfigStatus == 'apConnPwd') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
      } else if(self._apNeuronsWifiConfigStatus == 'apConfiging') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline';
      } else if(self._apNeuronsWifiConfigStatus == 'apConfigSuc') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline connect-success';
      } else if(self._apNeuronsWifiConfigStatus == 'apConfigFail') {
        firstSecondDashlineTips = 'first-second-dashline connect-success';
        secondThirdDashlineTips = 'second-third-dashline';
        secondThirdReallineTips = 'second-third-realline connect-fail';
        secondThirdDashlineTips = 'second-third-dashline connect-fail-cover';
        showSecondThirdDisconn = true;
      }
    }
    


    headerTips = (
      <div className="dialog-wifi-header">
        <div className="header-first-wifi"> 
          <img className="header-first-wifi-icon" src="./img/wifi-phone.png" /> 
        </div>
        <div className={firstSecondDashlineTips}>
          <div className={firstSecondReallineTips}>
          </div>
          <div className="first-second-disconnect" style={{display: showFirstSecondDisconn ? 'block' : 'none'}}> 
            <img className="first-second-disconnect-icon" src="./img/wifi-connect-fail.png" /> 
          </div>
        </div>
        <div className="header-second-wifi" style={{background: self._firstSecondConnected? '#469cff': '#a9d2fb'}}> 
          {self.getSecondWifi()}
        </div>
        <div className={secondThirdDashlineTips}>
          <div className={secondThirdReallineTips}>
          </div>
          <div className="second-third-disconnect" style={{display: showSecondThirdDisconn ? 'block' : 'none'}}> 
            <img className="second-third-disconnect-icon" src="./img/wifi-connect-fail.png" /> 
          </div>
        </div>
        <div className="header-third-wifi" style={{background: self._secondThirdConnected? '#469cff': '#a9d2fb'}}> 
          {self.getThirdWifi()}
        </div>
      </div>
    );
    return headerTips;
  }

  renderDialogBody() {
    let self = this;
    let bodyTips = '';
    if(self._wifiType == 'STA') {
      bodyTips = (
        <div className='dialog-wifi-body-sta'> 
          {self.getStaBody()}
          {self.getDownCount()}
          {self.reConnectWifi()}
          {self.getWifiList()}
          {self.getStaWifiConnSuc()}
        </div>
      );
    } else if(self._wifiType == 'AP') {
      bodyTips = (
        <div className='dialog-wifi-body-ap'> 
          {self.getApBody()}
        </div>
      );
    }
    
    return bodyTips;
  }

  renderDialogFooter() {
    let self = this;
    let footerTips = '';
    if(self._wifiType == 'STA') {
      footerTips = (
        <div className="dialog-add-new-module" ref='add-new-module' {...tapOrClick(self.addNewModule.bind(this))}>
          {self.getStaFooterTipsIcon()}
          <j className="add-new-module-text">{self.getStaFooterTips()}</j>
        </div>
      );
    } else if(self._wifiType == 'AP') {
      footerTips = (
        <div className="dialog-apmode-wifi" ref='apmode-wifi' {...tapOrClick(self.apModeWifiAction.bind(this))}>
          <j className="apmode-wifi-text">{self.getApFooterTips()}</j>
        </div>
      );
    }
    return footerTips;
  }

  render() {
    let self = this;
    let diffColor = false;
    if(self._wifiType == 'AP' && (self._apNeuronsWifiConfigStatus == 'apConn' || self._apNeuronsWifiConfigStatus == 'apConnPwd')) {
      diffColor = true;
    }
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        className="WifiDialog dialog " 
        contentLabel="WifiDialogModal"
        overlayClassName="dialog-overlay">
        <div className="dialog-container">
          <div className="dialog-header">
            {self.renderDialogHeader()}
            <div className="dialog-tools" ref="tools">
              <img className="wifi-dialog-close" {...tapOrClick(this.closeModal.bind(this))} src="./img/close.png" />
            </div>
          </div>
          <div className="dialog-body">
            {self.renderDialogBody()}
          </div>
          <div className="dialog-footer" ref="footer" style={{background: diffColor ? '#ebf4ff' : '#3391ff'}}>
            {self.renderDialogFooter()}
          </div>
        </div>
      </Modal>
    );
  }

  serviceWifiStatusChange() {
    let self = this;
    self._firstSecondConnected = wifiStore.getServiceWifiConnectStatus();

    if(self._wifiType == 'STA') {
      clearInterval(self._intervalID);
      if(self._firstSecondConnected) {
        self._staNeuronsWifiConfigStatus = 'staConnSuc';
      } else {
        self._staNeuronsWifiConfigStatus = 'staConnFail';
      }
      self._downCountNumber = 20;
      self.setState({
        rerender: false
      });
      if(self._staNeuronsWifiConfigStatus == 'staConnSuc') {
        self._intervalID = setInterval(self.downCountInterval.bind(self), 1000);
        UIActions.searchWifiModule();
      }
    } else if(self._wifiType == 'AP') {
      if(self._firstSecondConnected) {
        self._apNeuronsWifiConfigStatus = 'apConn';
        self.setState({
          rerender: false
        });
        UIActions.queryApWifiList();
      } else {
        self._apNeuronsWifiConfigStatus = 'apDisconn';
        self.setState({
          rerender: false
        });
      }
    }
  }

  wifiModuleStatusChange() {
    let self = this;
    clearInterval(self._intervalID);
    self._wifiModuleList = wifiStore.getSearchWifiModuleStatus();
    if(self._wifiModuleList.length == 0) {
      self._staNeuronsWifiConfigStatus = 'staSearchFail';
    } else {
      self._staNeuronsWifiConfigStatus = 'staSearchSuc';
    }
    self.setState({
      rerender: false
    });
  }

  connectChosenWifiStatusChange() {
    let self = this;
    clearInterval(self._intervalID);
    self._secondThirdConnected = wifiStore.getConnectChosenWifiStatus();
    if(self._secondThirdConnected) {
      self._staNeuronsWifiConfigStatus = 'staWifiConnSuc';
    } else {
      self._staNeuronsWifiConfigStatus = 'staWifiConnFail';
    }
    self.setState({
      rerender: false
    });
  }

  apQueryWifiListStatusChange() {
    let self = this;
    if(self._wifiType != 'AP') {
      console.log('[apQueryWifiListStatusChange] unexpected _wifiType != AP');
      return;
    }
    self._querySSIDSuc = false;
    self._wifiSSIDList = wifiStore.getApConfigWifiList();
    if(self._apNeuronsWifiConfigStatus == 'apConn') {
      if(self._wifiSSIDList.length > 0) {
        self._chosenSSID = self._wifiSSIDList[0].ssid;
        self._chosenSSIDEncrypt = self._wifiSSIDList[0].encrypt;
        self._querySSIDSuc = true;
      }
      self.refs.inputssid.value = self._chosenSSID;
    }
  }

  wifiConfigStatusChange() {
    let self = this;
    if(self._wifiType != 'AP') {
      console.log('[wifiConfigStatusChange] unexpected _wifiType != AP');
      return;
    }
    self._wifiConfigSuc = wifiStore.getWifiConfigStatus();
    if(self._wifiConfigSuc) {
      self._apNeuronsWifiConfigStatus = 'apConfigSuc';
      self._secondThirdConnected = true;
    } else {
      self._apNeuronsWifiConfigStatus = 'apConfigFail';
    }
    self.setState({
      rerender: false
    });
  }

  componentDidMount() {
    let self = this;
    this.callbackDispatcher = AppDispatcher.register((action) => {

      if (action.actionType == AppConstants.WIFI_DIALOG_OPEN) {
        console.log('openning wifi dialog');
        self.resetState();
        self.setState({
          modalIsOpen: true
        });
        clearInterval(self._intervalID);
        self._intervalID = setInterval(self.downCountInterval.bind(self), 1000);
      }

    });

    self.serviceWifiStatusChangeFunc = self.serviceWifiStatusChange.bind(self);
    self.wifiModuleStatusChangeFunc = self.wifiModuleStatusChange.bind(self);
    self.connectChosenWifiStatusChangeFunc = self.connectChosenWifiStatusChange.bind(self);
    self.wifiConfigStatusChangeFunc = self.wifiConfigStatusChange.bind(self);
    self.apQueryWifiListStatusChangeFunc = self.apQueryWifiListStatusChange.bind(self);

    wifiStore.on('serviceWifiStatusChange', self.serviceWifiStatusChangeFunc);
    wifiStore.on('wifiModuleStatusChange', self.wifiModuleStatusChangeFunc);
    wifiStore.on('wifiConnected', self.connectChosenWifiStatusChangeFunc);
    wifiStore.on('apQueryWifiListStatusChange', self.apQueryWifiListStatusChangeFunc);
    wifiStore.on('wifiConfigStatusChange', self.wifiConfigStatusChangeFunc);
  }

  componentWillUnmount() {
    let self = this;
    AppDispatcher.unregister(this.callbackDispatcher);
    clearInterval(self._intervalID);
    wifiStore.off('serviceWifiStatusChange', self.serviceWifiStatusChangeFunc);
    wifiStore.off('wifiModuleStatusChange', self.wifiModuleStatusChangeFunc);
    wifiStore.off('connectChosenWifiStatusChange', self.connectChosenWifiStatusChangeFunc);
    wifiStore.off('apQueryWifiListStatusChange', self.apQueryWifiListStatusChangeFunc);
    wifiStore.off('wifiConfigStatusChange', self.wifiConfigStatusChangeFunc);
  }
}

export { WifiDialog};
