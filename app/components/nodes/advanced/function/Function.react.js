import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import {ConfigBodyStyle, SelectStyle} from '../../../configurator/configStyle';
require('./Function.less');

class FunctionNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      func: this.props.info.props.configs.func.defaultValue,
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-function.png' />
        <span className="node-preview-name">{languages.getTranslation('function')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    this.setState({
      func: conf.hasOwnProperty('func') ? conf.func : this.state.func,
    });
  }

  getIconUrl(){
    let url;
    switch (this.state.func) {
    case 'square':
      url = './img/node-function-square-icon.svg';
      break;
    case 'sqrt':
      url = './img/node-function-root-icon.svg';
      break;
    case 'abs':
      url = './img/node-function-abs-icon.svg';
      break;
    case '-':
      url = './img/node-function-negative-icon.svg';
      break;
    case 'ln':
      url = './img/node-function-ln-icon.svg';
      break;
    case 'log10':
      url = './img/node-function-log10-icon.svg';
      break;     
    case 'e^':
      url = './img/node-function-exp-icon.svg';
      break;
    case '10^':
      url = './img/node-function-10x-icon.svg';
      break;
    case 'sin':
      url = './img/node-function-sin-icon.svg';
      break;     
    case 'cos':
      url = './img/node-function-cos-icon.svg';
      break;
    case 'tan':
      url = './img/node-function-tan-icon.svg';
      break;
    case 'asin':
      url = './img/node-function-asin-icon.svg';
      break;        
    case 'acos':
      url = './img/node-function-acos-icon.svg';
      break;
    case 'atan':
      url = './img/node-function-atan-icon.svg';
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
           background: 'url("'+ this.getIconUrl() +'") center center /30px no-repeat'}}>
         </div>     
        </div> 
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator 
          title={languages.getTranslation('function')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          selectStyle={SelectStyle.MATRIX}
          bodyStyle={ConfigBodyStyle.SQUARE}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

}

export { FunctionNode };