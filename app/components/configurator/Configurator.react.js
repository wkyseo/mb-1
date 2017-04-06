import React, { Component } from 'react';
import { Select } from './Select.react';
import { NumberInput } from './NumberInput.react';
import { ColorPanel } from './ColorPanel.react';
import { Image } from './Image.react';
import { Pattern } from './Pattern.react';
import tapOrClick from 'react-tap-or-click';
import UIActions from '../../actions/UIActions';
import editerStore from '../../stores/editerStore';
import nodeStore from '../../stores/nodeStore';
import languages from '../../languages';
import { Hold } from './Hold.react';
import { Gyro } from './Gyro.react';
import { ColorCheck } from './ColorCheck.react';
import { Face } from './Face.react';
import { Text } from './Text.react';
import { SoundRecordManagement } from './SoundRecordManagement.react';
import { PlaySound } from './PlaySound.react';
import { PlayMusic } from './PlayMusic.react';
import { Speech } from './Speech.react';
import { MatchText } from './MatchText.react';
require('./Configurator.less');

class Configurator extends Component {
  constructor() {
    super(...arguments);
    this.conf = {};
    this.defaultConf = {};
    this.state = {
      isActive: false
    };
    this.soundSaveStatus = false;
  }

  onConfig(key, value){
    let conf = {[key]: value};
    UIActions.configNode(this.props.nodeId, conf);
    this.props.onConfigChange && this.props.onConfigChange(conf); 
  }

  onConfirm() {
    UIActions.nodeTap(this.props.nodeId, this.props.type);
  }

  renderControl(key, config){
    let control = null;
    switch(config.type) {
    case 'options':
      control = (<Select key={key} name={key} config={config} selectStyle={this.props.selectStyle} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'number': 
      control = (<NumberInput key={key} name={key} config={config} numberStyle={this.props.numberStyle} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'color':
      control = (<ColorPanel key={key} name={key} selected={this.props.selected} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'image':
      control = (<Image key={key} name={key} id={this.props.nodeId} selected={this.props.selected} editImage={this.props.editImage} onChange={this.onConfig.bind(this)} />);
      break;
    case 'pattern':
      control = (<Pattern key={key} name={key} id={this.props.nodeId} selected={this.props.selected} editPattern={this.props.editPattern} onChange={this.onConfig.bind(this)} />);
      break;
    case 'hidden':
      break;
    default:
      console.log('config type not support: ', config.type);

    }
    if (config.hasOwnProperty('defaultValue')){
      this.defaultConf[key] = config.defaultValue;
    }
    return control;
  }

  renderRange(configs){
    let self = this;
    let controls = [];
    controls.push(self.renderControl('from', configs.from));
    controls.push(<div className='range' key={'rangeIcon'}>~</div>);
    controls.push(self.renderControl('to', configs.to));
    return controls;
  }

  renderScaleRange(configs){
    let self = this;
    let controls = [];
    controls.push(self.renderControl('minin', configs.minin));
    controls.push(<div className='range' key={'inputRange'}>~</div>);
    controls.push(self.renderControl('maxin', configs.maxin));
    controls.push(<img className="scale-to" key={'scale-to'} src='./img/icon-scale-to.png' />);
    controls.push(self.renderControl('minout', configs.minout));
    controls.push(<div className='range' key={'outputRange'}>~</div>);
    controls.push(self.renderControl('maxout', configs.maxout));    
    return controls;
  } 

  renderPulse(configs){
    let self = this;
    let controls = [];
    controls.push(self.renderControl('func', configs.func));
    controls.push(<span className="wavelength" key='waveLength'>{languages.getTranslation('wavelength')}</span>);
    controls.push(self.renderControl('wavelength', configs.wavelength));
    controls.push(<span className="second" key='s'>s</span>);
    controls.push(<span className="amplitude" key='amp'>{languages.getTranslation('amplitude')}</span>);
    controls.push(self.renderControl('amplitude', configs.amplitude));
    return controls;
  }

  saveStateCallBack(config) {
    this.soundSaveStatus = config;
  }

  render() {
    let self = this;
    let controls = [];
    let configs = nodeStore.getNodeConfigs(this.props.nodeId);
    switch (self.props.bodyStyle) {
    case 'range':
      controls = self.renderRange(configs);
      break;
    case 'scale':
      controls = self.renderScaleRange(configs);
      break;
    case 'pulse':
      controls = self.renderPulse(configs);
      break;
    case 'hold':
      controls = (<Hold configs={configs} bodyStyle={self.props.bodyStyle}  numberStyle={self.props.numberStyle} selectStyle={this.props.selectStyle} id={this.props.nodeId}  onChange={this.onConfig.bind(this)} />);
      break;
    case 'gyro':
      controls = (<Gyro configs={configs} bodyStyle={self.props.bodyStyle}  selectStyle={this.props.selectStyle} id={this.props.nodeId}  onChange={this.onConfig.bind(this)} />);
      break;
    case 'colorCheck':
      controls = (<ColorCheck configs={configs} bodyStyle={self.props.bodyStyle} id={this.props.nodeId}  onChange={this.onConfig.bind(this)} />);
      break;
    case 'face':
      controls = (<Face configs={configs} bodyStyle={self.props.bodyStyle}  selectStyle={this.props.selectStyle} id={this.props.nodeId}  onChange={this.onConfig.bind(this)} />);
      break;
    case 'text':
      controls = (<Text configs={configs} bodyStyle={self.props.bodyStyle}  selectStyle={this.props.selectStyle} id={this.props.nodeId}  onChange={this.onConfig.bind(this)} />);
      break;
    case 'record':
      controls=(<SoundRecordManagement id={this.props.nodeId} onChange={this.onConfig.bind(this)} saveStateCallBack={this.saveStateCallBack.bind(this)} saveState={this.soundSaveStatus} />);
      break;
    case 'playsound':
      controls=(<PlaySound configs={configs} id={this.props.nodeId} selectStyle={this.props.selectStyle} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'speech':
      controls=(<Speech configs={configs} id={this.props.nodeId} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'playmusic':
      controls = (<PlayMusic configs={configs} id={this.props.nodeId} onChange={this.onConfig.bind(this)}/>);
      break;
    case 'matchText':
      controls=(<MatchText configs={configs} id={this.props.nodeId} onChange={this.onConfig.bind(this)}/>);
      break;
    default:
      for(let key in configs) {
        controls.push(self.renderControl(key, configs[key]));
      }
      break;
    }

    return(
      <div className={'node-config ' + (this.state.isActive==true?'':'hide')} data-bodyStyle={this.props.bodyStyle}>
        <div className='triangle'></div>
        <span className='title'>{this.props.title}</span>
        {controls}
        <div className='confirm' {...tapOrClick(this.onConfirm.bind(this))}>{languages.getTranslation('icon-confirm-ok')}</div>
      </div>
    );
  }

  toggleConfig(){
    let self = this;
    let config = editerStore.getConfigureNode();
    if(config && config.id == self.props.nodeId && self.props.action !='hideConfig') {
      self.setState({
        isActive: true
      });
    }
    else {
      self.setState({
        isActive: false
      });
    }
  }

  componentDidMount() {
    for ( let key in this.defaultConf){
      this.onConfig( key, this.defaultConf[key] );
    }
    
    this.toggleConfigFunc = this.toggleConfig.bind(this);
    editerStore.on('configureNode', this.toggleConfigFunc);
  }

  componentWillUnmount(){
    editerStore.off('configureNode', this.toggleConfigFunc);
    editerStore.clearConfig();
  }

}

export { Configurator };
