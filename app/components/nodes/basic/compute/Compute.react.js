import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import {ConfigBodyStyle, ConfigNumberStyle, SelectStyle} from '../../../configurator/configStyle';
require('./Compute.less');

class ComputeNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      operation: this.props.info.props.configs.operation.defaultValue,
      value: this.props.info.props.configs.b.defaultValue
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-compute.png' />
        <span className="node-preview-name">{languages.getTranslation('compute')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    let newState = {};
    if(conf.hasOwnProperty('operation')) {
      newState.operation = conf.operation;
    }
    if(conf.hasOwnProperty('b')) {
      newState.value = conf.b;
    }
    this.setState(newState);
  }

  getOperation(){
    let key;
    switch (this.state.operation) {
    case '+':
      key = './img/compute/icon-addition-active.png';
      break;
    case '-':
      key = './img/compute/icon-subtract-active.png';
      break;
    case '*':
      key = './img/compute/icon-multiply-active.png';
      break;
    case '/':
      key = './img/compute/icon-divide-active.png';
      break;
    case '%':
      key = './img/compute/icon-mod-active.png';
      break;
    }
    return (<img className="node-actual-icon" src={key} />);
  }

  getValue(){
    let value = this.state.value;
    if(value>999){
      value = '999+';
    }
    return (<span className="node-actual-value">{value}</span>);
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className='node-actual-body'>
            {this.getOperation()}
            {this.getValue()}
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator 
          title={languages.getTranslation('compute')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          numberStyle={'common'}
          selectStyle={'common'}
          selectStyle={SelectStyle.COMPUTE}
          bodyStyle={ConfigBodyStyle.COMPUTE}
          numberStyle={ConfigNumberStyle.COMPUTE}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

}

export { ComputeNode };