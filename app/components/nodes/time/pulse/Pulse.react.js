import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle, SelectStyle} from '../../../configurator/configStyle';
require('./Pulse.less');

class Pulse extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      func: this.props.info.props.configs.func.defaultValue,
      wavelength: this.props.info.props.configs.wavelength.defaultValue,
      amplitude: this.props.info.props.configs.amplitude.defaultValue,
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
       <img className="node-preview-icon" src='./img/icon-pulse.png' />
        <span className="node-preview-name">{languages.getTranslation('pulse')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    let newState = {};
    if(conf.hasOwnProperty('func')) {
      newState.func = conf.func;
    }
    if(conf.hasOwnProperty('wavelength')) {
      newState.wavelength = conf.wavelength;
    }
    if(conf.hasOwnProperty('amplitude')) {
      newState.amplitude = conf.amplitude;
    }  
    this.setState(newState);
  } 

  getIconUrl(){
    let url;
    switch (this.state.func) {
    case 'sin':
      url = './img/pulse-sin.png';
      break;
    case 'square':
      url = './img/pulse-square.png';
      break;
    case 'triangle':
      url = './img/pulse-triangle.png';
      break;
    }
    return url;
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' >
         <div className='node-actual-icon' style={{
           background: 'url("'+ this.getIconUrl() +'") center center /40px 25.3px no-repeat'}}>
         </div>     
        </div> 
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id}  showValue={true}/>       
        <Configurator 
          title={languages.getTranslation('pulse')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          numberStyle={ConfigNumberStyle.RANGE}
          selectStyle={SelectStyle.PULSE}
          bodyStyle={ConfigBodyStyle.PULSE}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  
}

export { Pulse };
