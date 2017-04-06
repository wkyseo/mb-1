import React, { Component } from 'react';

import tapOrClick from 'react-tap-or-click';
import CopyToClipboard from 'react-copy-to-clipboard';
import { CloudSlider } from '../cloudComponent/CloudSlider.react';
import { CloudButton } from '../cloudComponent/CloudButton.react';
import { CloudToggle } from '../cloudComponent/CloudToggle.react';
import { CloudLabel } from '../cloudComponent/CloudLabel.react';
import { CloudText } from '../cloudComponent/CloudText.react';
import { CloudNumber } from '../cloudComponent/CloudNumber.react';
import { CloudIndicator } from '../cloudComponent/CloudIndicator.react';
import { CloudLineGraph } from '../cloudComponent/CloudLineGraph.react';
import nodeStore from '../../stores/nodeStore';
import ProjectStore from '../../stores/projectStore';
import cloudAppStore from '../../stores/cloudAppStore';
import UIActions from '../../actions/UIActions';
class CloudApp extends Component{
  constructor(){
    super(...arguments);
    this.emitter = this.props.emitter;
    this.state = {
      isActive: false,
      cloudAppList: [],
      shareDialog: 'hide',
      shareStatus: 'static',
      url: '',
      qrcode: 'hide',
      shadowDisplay: 'hide',
      cloudId: '',
      copied: false
    };
  }

  cloudAppStyle(value){
    let nameValue = nodeStore.getCurrentConfig(value.id, 'name') || '未命名';
    let action;
    switch (value.type){
    case 'CONTROLBUTTON': //按钮
      return <CloudButton name={nameValue} id={value.id} mode={'edit-mode'}/>;
    case 'SLIDER': //滑块
      action = nodeStore.getCurrentConfig(value.id, 'state');
      return <CloudSlider name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'CONTROLTOGGLE': //开关
      action = nodeStore.getCurrentConfig(value.id, 'state');
      return <CloudToggle name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'LABEL': // 标签
      action = nodeStore.getNodeInputValue(value.id, 'text');
      return <CloudLabel name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'TEXT_INPUT': //文本输入
      action = nodeStore.getCurrentConfig(value.id, 'text');
      return <CloudText name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'NUMBER_INPUT': //数字输入
      action = nodeStore.getCurrentConfig(value.id, 'number');
      return <CloudNumber name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'INDICATOR': //指示灯
      action = nodeStore.getNodeInputValue(value.id, 'input');
      return <CloudIndicator name={nameValue} id={value.id} action={action} mode={'edit-mode'}/>;
    case 'LINE_GRAPH': //图表显示
      return <CloudLineGraph name={nameValue} id={value.id} mode={'edit-mode'}/>;
    default:
      console.log('nothing');
    }
  }

  cloudAppList(){
    let list = [];
    this.state.cloudAppList.map((value)=>{
      list.push(<li className="cloudApp-desc" key={value.id} data-id={value.id} data-type={value.type}>
        {this.cloudAppStyle(value)}
      </li>);
    });
    return(list);
  }

  openShareDialog() {
    if(this.state.qrcode !='hide') {
      return;
    }
    if(ProjectStore.getCurrentCloudId() && ProjectStore.getCurrentCloudId().length!=0) {
      let curUrl = ProjectStore.getCurrentCloudId();
      this.setState({
        shareDialog: '',
        shadowDisplay: '',
        shareStatus: 'success',
        url: 'http://iot.makeblock.com:3000/cloudapp/?id='+curUrl[0],
      });
    } else {
      this.setState({
        shareDialog: '',
        shadowDisplay: ''
      });
    }
  }

  shareDialog() {
    if(this.state.shareStatus == 'static') {
      return this.shareStatic();
    } else if(this.state.shareStatus == 'hold') {
      return this.shareHoldingDialog();
    } else if(this.state.shareStatus =='success') {
      return this.shareSuccessDialog();
    } else if(this.state.shareStatus == 'share-fail') {
      return this.shareFailDialog();
    } else if(this.state.shareStatus == 'retrieve-fail') {
      return this.retriveFailDialog();
    }
  }

  closeShareDialog() {
    this.setState({
      shareDialog: 'hide',
      shadowDisplay: 'hide',
      copied: false
    });
  }

  closeQRCode() {
    this.setState({
      qrcode: 'hide',
      shadowDisplay: 'hide'
    });
  }

  closeAll() {
    this.setState({
      shareDialog: 'hide',
      qrcode: 'hide',
      shadowDisplay: 'hide',
      copied: false
    });
  }

  checkQRCode() {
    let self = this;
    let qrNode = self.refs.qrDisplay;
    if(self._qrcode == null) {
      self._qrcode = new QRCode(qrNode, {
        width : 146,
        height : 146
      });
    }
    let url = self.state.url;
    self._qrcode.clear();
    self._qrcode.makeCode(url);
    self.setState({
      qrcode: '',
      shareDialog: 'hide',
    });
  }

  retrieveShare() {
    if(this.state.cloudId!='')
    {
      cloudAppStore.retriveCloudAppData(this.state.cloudId);
    } else {
      cloudAppStore.retriveCloudAppData(cloudAppStore.getCurrentCloudId());
    }
  }

  shareProject() {
    this.setState({
      shareStatus: 'hold',
      url: '',
      copied: false
    });
    UIActions.shareCloudProject();
  }



  shareStatic() {
    return (<div className={'share-dialog '+this.state.shareDialog} ref='shareDialog'>
      <div className='triangle'></div>
      <div className='share-title'>{'分享'}</div>
      <div className='share-text'>{'通过连接可控制本项目'}</div>
      <div className='share-btn' {...tapOrClick(this.shareProject.bind(this))}>分享项目</div>
      <div className='share-cancel' {...tapOrClick(this.closeShareDialog.bind(this))}>取消</div>
    </div>);
  }

  shareSuccessDialog() {
    return (<div className={'share-dialog share-success '+this.state.shareDialog} ref='shareDialog'>
      <div className='triangle'></div>
      <div className='share-title'>{'分享成功'}</div>
      <div className='share-url'>{this.state.url}</div>
      <CopyToClipboard className='share-copy-button' text={this.state.url} onCopy={() => this.setState({copied: true})}>
        <span>复制链接</span>
      </CopyToClipboard>
      <div className={'share-copy-hint '+(this.state.copied==true?'':'share-copy-hint-hide')}>copied</div>
      <div className='share-btn' {...tapOrClick(this.checkQRCode.bind(this))}>查看二维码</div>
      <div className='share-btn' {...tapOrClick(this.retrieveShare.bind(this))}>撤回分享</div>
      <div className='share-cancel' {...tapOrClick(this.closeShareDialog.bind(this))}>完成</div>
    </div>);
  }

  shareFailDialog() {
    return (<div className={'share-dialog '+this.state.shareDialog} ref='shareDialog'>
      <div className='triangle'></div>
      <div className='share-title'>{'分享失败'}</div>
      <div className='share-text'>{'请检查网络是否正常'}</div>
      <div className='share-btn' {...tapOrClick(this.shareProject.bind(this))}>重新分享</div>
      <div className='share-cancel' {...tapOrClick(this.closeShareDialog.bind(this))}>取消</div>
    </div>);
  }

  retriveFailDialog() {
    return (<div className={'share-dialog '+this.state.shareDialog} ref='shareDialog'>
      <div className='triangle'></div>
      <div className='share-title'>{'撤回失败'}</div>
      <div className='share-text'>{'请检查网络是否正常'}</div>
      <div className='share-btn' {...tapOrClick(this.retrieveShare.bind(this))}>重新撤回</div>
      <div className='share-cancel' {...tapOrClick(this.closeShareDialog.bind(this))}>取消</div>
    </div>);
  }

  shareHoldingDialog() {
    return (<div className={'share-dialog '+this.state.shareDialog} ref='shareDialog'>
      <div className='triangle'></div>
      <div className='share-title'>{'分享中'}</div>
      <div className="loading"><span></span><span></span><span></span></div>
      <div className='share-cancel' {...tapOrClick(this.closeShareDialog.bind(this))}>取消</div>
    </div>);
  }

  render(){
    return (
      <div className={'cloudApp-main '+(this.state.isActive==true?'show-cloudApp-main':'')}>
        <div className="cloudApp-header">
          <div className='cloudApp-close' {...tapOrClick(this.closeCloudApp.bind(this))}><img className='icon-close' src='img/icon-backward.png' ref='iconBackWard' /></div>
          <span className='cloudApp-title'>云 APP</span>
          <span className='cloudApp-publish' {...tapOrClick(this.openShareDialog.bind(this))}><img className='share-icon' src='img/icon-share.png'/></span>
          {this.shareDialog()}
        </div>
        <div className='cloudApp-projects'>
          <ul className='cloudApp-list' ref='AppList'>
            {this.cloudAppList()}
          </ul>
        </div>
        <div className={'panel-cover' +this.state.shadowDisplay } {...tapOrClick(this.closeAll.bind(this))}></div>
        <div className={'qrcode-display ' + this.state.qrcode}>
          <span className='qrcode-title'>{'请扫描二维码'}</span>
          <div className='qrcode-code-div' >
            <div className='qrcode-code' ref='qrDisplay'></div>
          </div>
          <div className='qrcode-btn-div'><div className='qrcode-btn' {...tapOrClick(this.closeQRCode.bind(this))}>{'确定'}</div></div>
        </div>
      </div>
    );
  }

  openCloudApp(cloudAppList){
    this.setState({
      isActive: true,
      cloudAppList: cloudAppList
    });

  }

  closeCloudApp(){
    let self = this;
    self.setState({
      isActive: false,
      cloudAppList: [],
      shareDialog: 'hide',
      shadowDisplay: 'hide',
      qrcode: 'hide',
      copied: false
    });
    self.refs.iconBackWard.style.webkitTransform = 'translate(19px, -50%) rotate(180deg)';
    setTimeout(()=>{
      self.refs.iconBackWard.style.webkitTransform = '';
    }, 500);
  }

  fetchSucceed(result) {
    if(result.id == 'defaultCloudID') {
      this.setState({
        shareStatus: 'success',
        url: 'http://iot.makeblock.com:3000/cloudapp/?id='+this.state.cloudId,
      });
    } else {
      this.setState({
        shareStatus: 'success',
        url: result.url,
        cloudId: result.id
      });
    }
    this.emitter.emit('getCloudID', [this.state.cloudId]);
  }

  fetchFailed() {
    this.setState({
      shareStatus: 'share-fail',
      url: ''
    });
  }

  retrieveSuccess() {
    this.setState({
      shareStatus: 'static'
    });
  }
  retrieveFailed() {
    this.setState({
      shareStatus: 'retrieve-fail',
    });
  }

  componentDidMount(){
    this.openCloudAppFunc = this.openCloudApp.bind(this);
    this.openCloudProject = this.emitter.addListener('openCloudApp', this.openCloudAppFunc);
    this.fetchedDataFunc = this.fetchSucceed.bind(this);
    this.fetchFailedFunc = this.fetchFailed.bind(this);
    cloudAppStore.on('fetchSuccess', this.fetchedDataFunc);
    cloudAppStore.on('fetchFail', this.fetchFailedFunc);

    this.retrieveSuccessFunc = this.retrieveSuccess.bind(this);
    this.retrieveFailedFunc = this.retrieveFailed.bind(this);
    cloudAppStore.on('retrieveSuccess', this.retrieveSuccessFunc);
    cloudAppStore.on('retrieveFail', this.retrieveFailedFunc);
  }

  componentDidUpdate() {
    if(this.state.copied == true) {
      setTimeout(()=>{
        this.setState({
          copied: false
        });
      }, 500);
    }
  }

  componentWillUnmount(){
    cloudAppStore.off('fetchSuccess', this.fetchedDataFunc);
    cloudAppStore.off('fetchFail', this.fetchFailedFunc);
    cloudAppStore.off('retrieveSuccess', this.retrieveSuccessFunc);
    cloudAppStore.off('retrieveFail', this.retrieveFailedFunc);
    this.openCloudProject.remove();
  }


}

export { CloudApp };