import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, SelectStyle} from '../../../configurator/configStyle';
import languages from '../../../../languages';
require('./GyroSensor.less');

class GyroSensorNode extends Component {
  constructor() {
    super(...arguments);

    this.type = this.props.info.props.configs.type.defaultValue;
    this.axis = this.props.info.props.configs.axis.defaultValue;
  }

  adjustStyle() {
    if(this.refs.node) {
      let core = this.refs.node.querySelector('.core');
      let coreLabel = this.refs.node.querySelector('.core .node-port-label');
      let coreValue = this.refs.node.querySelector('.core .node-port-value');
      coreValue.textContent = '';
      if(this.type == 'shake') {
        core.classList.add('round');
      } else {
        core.classList.remove('round');
      }
      if(this.type != 'shake' && this.axis) {
        coreLabel.textContent = this.axis;
      } else {
        coreLabel.textContent = '';
      }
    }
  }

  onConfigChange(conf) {
    if( conf.type ) {
      this.type = conf.type;
    }
    if( conf.axis ) {
      this.axis = conf.axis;
    }
    
    this.adjustStyle();
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-shelf node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-gyroSensor.png" />
      </div>
    );
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category} ref="node">
        <div className='node-body node-draggable' style={{
          background: 'url("img/electronic-gyroSensor.png") center center /112px no-repeat'}}>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true} />
        <Configurator
          title={languages.getTranslation('setting')}
          configs={this.props.info.props.configs}
          nodeId={this.props.id}
          type={this.props.info.name}
          selectStyle={SelectStyle.GYRO}
          bodyStyle={ConfigBodyStyle.GYRO}
          onConfigChange={this.onConfigChange.bind(this)}/>
        <Tools nodeId={this.props.id} isElectronic={true} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
  componentDidMount() {
    this.adjustStyle();
  }
}

export { GyroSensorNode };