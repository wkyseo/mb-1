import React, { Component } from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import linkStore from '../../stores/LinkStore';
import UIActions from '../../actions/UIActions';
import Modal from 'react-modal';
import languages from '../../languages';
import tapOrClick from '../../utils/tapOrClick';

require('./LinkDialog.less');

const MAX_LIST_ITEMS = 20;

class LinkDialog extends Component {
  constructor() {
    super(...arguments);
    this._showBle = false;
    this.state = {
      modalIsOpen: false,
      scanList: [],
      linkStatus: linkStore.getStatus(),
      linkAutoConnect: '',
      linkCircleStatus: '',
      rerender: false
    };
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
    UIActions.closeLinkDialog();
  }

  selectDevice(event) {
    UIActions.selectLinkDialogDevice(event.currentTarget.dataset.deviceid);
  }

  disconnect() {
    UIActions.disconnectLinkDevice();
  }

  refreshBluetooth() {
    console.log('refreshBluetooth');
    UIActions.refreshBluetooth();
  }

  connectConfirm() {
    let self = this;
    self.closeModal();
  }

  openScanList() {
    this.setState({linkStatus: 'disconnected',linkAutoConnect: 'auto-connect-closed'});
    UIActions.openLinkDialog();
  }

  renderScanList() {
    let self = this;
    self.state.scanList.sort((a, b) => {
      return a.distance - b.distance;
    });
    let deviceCnt = 0;
    let list = self.state.scanList.map((device) => {
      if((++deviceCnt) > MAX_LIST_ITEMS){
        return;
      }
      return (
        <tr key={deviceCnt} data-deviceid={device.id} {...tapOrClick(self.selectDevice.bind(self))}>
          <td>{device.name}</td><td>{device.distance.toFixed(1)}m</td>
        </tr>
      );
    });

    return (
      <div className="dialog-link-scan-list" >
        <table cellSpacing={0} className='connect-tab' >
        <thead>
          <tr>
            <td className='device'>{languages.getTranslation('dialog-bluetooth-devices')}</td>
            <td className='distance'>{languages.getTranslation('dialog-bluetooth-distance')}</td>
          </tr>
        </thead>
        <tbody ref="list">
          {list}
        </tbody>
        </table>
      </div>
    );
  }

  renderConnected() {
    return (
      <div className="dialog-link-connected">
        <span className="connected-text">
          {languages.getTranslation('dialog-bluetooth-autoconnected')}
        </span>
        <div></div>
        <span className="connected-name">
          {linkStore.getDeviceName() || 'Makeblock_LE'}
        </span>
      </div>
    );
  }

  renderAutoConnect() {
    let self = this;
    let linkStatusTextA = '';
    let linkStatusTextB = '';
    let circleName = '';
    let circleStatus = self.state.linkCircleStatus;
    let linkStatus = self.state.linkStatus;
    if(circleStatus == 'less-half-meter') {
      circleName = 'auto-connect-less-half-meter';
    } else {
      circleName = 'auto-connect-less-one-meter';
    }
    if(linkStatus == 'closed') {
      linkStatusTextA = languages.getTranslation('icon-please-open');
      linkStatusTextB = languages.getTranslation('icon-bluetooth');
    } else {
      linkStatusTextA = languages.getTranslation('icon-close-to-bluetooth');
      linkStatusTextB = languages.getTranslation('icon-node');
    }
    return (
      <div className='bluetooth-connect'>
        <div className="dialog-link-autoconnect">
          <span className="autoconnect-text">
            {linkStatusTextA}<br/>{linkStatusTextB}
          </span>
        </div>
        <span className={circleName}></span>
      </div>
    );
  }

  renderStatus() {
    let self = this;

    let statusText = '';
    let statusConfirm = '';
    let status = self.state.linkStatus;
    if(status == 'disconnected' || status == 'closed') {
      statusText = (
        <j>{languages.getTranslation('dialog-bluetooth-disconnected')}</j>
      );
    } else if (status == 'connecting') {
      statusText = (
        <j>{languages.getTranslation('dialog-bluetooth-connecting')}</j>
      );
    } else if (status == 'failed') {
      statusText = (
        <j>{languages.getTranslation('dialog-bluetooth-failed')}</j>
      );
    } else if (status == 'connected') {
      statusText = (
        <div className="disconnect-bluetooth" ref='disconnect' {...tapOrClick(self.disconnect.bind(this))}>
          <img className="icon-disconnect" src="./img/icon-disconnect-ble.svg" /> 
          <j className="icon-disconnect-text">{languages.getTranslation('dialog-bluetooth-reconnect')}</j>
        </div>
      );
      statusConfirm = (
        <div className="confirm-connect-ble" ref='confirm-connect' {...tapOrClick(self.connectConfirm.bind(this))}>
          <img className="icon-ok" src="./img/icon-confirm-ble.svg" /> 
          <j className="icon-ok-text">{languages.getTranslation('icon-confirm-ok')}</j>
        </div>
      ); 
    }

    return (
      <div className="dialog-link-status">{statusText} {statusConfirm}</div>
    );
  }

  renderAutoConnectStatus() {
    let self = this;
    let statusText = (
        <span ref='auto-connect-status' {...tapOrClick(self.openScanList.bind(this))}>
          <img className="scan-ble-list" src="./img/ble-list.png" />
          {languages.getTranslation('icon-choose-bluetooth-list')}
        </span>
      );
    return (
      <span className="dialog-auto-connect-status">{statusText}</span>
    );
  }

  renderDialogHeader() {
    let self = this;
    //if connection is failed, do not show refresh button
    if(self.state.linkStatus == 'failed'){
      return '';
    }
    if(self.state.linkAutoConnect == 'auto-connect-closed' && self.state.linkStatus != 'connected') {
      return (
        <div className="dialog-fresh" ref="refresh">
          <img className="icon-refresh" {...tapOrClick(this.refreshBluetooth.bind(this))} src="./img/ble-refresh.svg" /> 
          <div className="icon-refresh-text" {...tapOrClick(this.refreshBluetooth.bind(this))}>{languages.getTranslation('dialog-bluetooth-refresh')}</div>
        </div>
      );
    } else {
      return '';
    }
  }

  renderDialogBody() {
    let self = this;
    if(self.state.linkStatus == 'connected') {
      return self.renderConnected();
    } else if(self.state.linkStatus == ''){
      return self.renderAutoConnect();  //start connection
    } else if(self.state.linkStatus == 'failed'){
      return self.renderAutoConnect();  //if connected failed, treat as first connect attempt
    }
    else {
      if(self.state.linkAutoConnect == 'auto-connect-closed') {
        return self.renderScanList();
      } else {
        return self.renderAutoConnect();
      }
    }
  }

  renderDialogFooter() {
    let self = this;
    if(self.state.linkStatus == 'connected') {
      return self.renderStatus();
    }
    else if(self.state.linkStatus == 'failed'){
      return self.renderAutoConnectStatus();
    }
    else {
      if(self.state.linkAutoConnect == 'auto-connect-opened' || self.state.linkAutoConnect == '') {
        return self.renderAutoConnectStatus();
      } else {
        return self.renderStatus();
      }
    }
  }

  render() {
    let self = this;
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        className="dialog" 
        contentLabel="LinkDialogModal"
        overlayClassName="dialog-overlay">
        <div className="dialog-container">
          <div className="dialog-header">
            <div className="dialog-title">
              <img className="icon-bluetooth-svg" src="./img/icon-bluetooth-blue.svg" />
              <div className="bluetooth-connect-text" style={{display: self._showBle? 'inline': 'none'}}>{languages.getTranslation('dialog-bluetooth-connection')}</div>
            </div>
            {self.renderDialogHeader()}
            <div className="dialog-tools" ref="tools">
              <img className="ble-dialog-close" {...tapOrClick(this.closeModal.bind(this))} src="./img/close.png" />
            </div>
          </div>
          <div className="dialog-body">
            {self.renderDialogBody()}
          </div>
          <div className="dialog-footer" ref="footer">
            {self.renderDialogFooter()}
          </div>
        </div>
      </Modal>
    );
  }

  listChange() {
    let self = this;
    self.setState({
      scanList: linkStore.getDeviceList()
    });
  }
  statusChange() {
    let self = this;
    let status = linkStore.getStatus();
    let disconnectType = linkStore.getDisconnectType();
    let openModal = true;
    if(disconnectType == 'tab') {
      openModal = false;
    }
    self.setState({
      modalIsOpen: openModal,
      linkStatus: status,
      scanList: linkStore.getDeviceList()
    });
  }

  circleChange(){
    let self = this;
    console.log('circleChange:' + linkStore.getCircleStatus());
    self.setState({
      linkCircleStatus: linkStore.getCircleStatus()
    });
  }

  componentDidMount() {
    let self = this;
    this.callbackDispatcher = AppDispatcher.register((action) => {

      if (action.actionType == AppConstants.LINK_AUTO_CONNECT_DIALOG_OPEN) {
        console.log('openning link auto connect dialog');
        self._showBle = false;
        self.setState({
          modalIsOpen: true,
          linkAutoConnect: 'auto-connect-opened',
          scanList: []
        });

        setTimeout(()=> {
          self._showBle = true;
          self.setState({
            rerender: false
          });
        }, 300);
        
      } else if (action.actionType == AppConstants.LINK_DIALOG_OPEN) {
        console.log('openning link dialog');
        self.setState({
          modalIsOpen: true,
          scanList: []
        });
      } else if(action.actionType == AppConstants.LINK_DIALOG_CLOSE) {
        console.log('closing link dialog');
        self.setState({
          modalIsOpen: false
        });
      }
    });

    this.listChangeFunc = this.listChange.bind(this);
    this.statusChangeFunc = this.statusChange.bind(this);
    this.circleChangeFunc = this.circleChange.bind(this);

    linkStore.on('listChange', this.listChangeFunc);
    linkStore.on('statusChange', this.statusChangeFunc);
    linkStore.on('circleChange', this.circleChangeFunc);
  }

  componentWillUnmount() {
    linkStore.off('listChange', this.listChangeFunc);
    linkStore.off('statusChange', this.statusChangeFunc);
    linkStore.off('circleChange', this.circleChangeFunc);
    AppDispatcher.unregister(this.callbackDispatcher);
  }
}

export { LinkDialog};
