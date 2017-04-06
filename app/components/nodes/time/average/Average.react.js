import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle} from '../../../configurator/configStyle';

require('./Average.less');

class AverageNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-average.png' />
        <span className="node-preview-name">{languages.getTranslation('average')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    console.log(conf);
  } 

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' style={{
          background: 'url("img/average.png") center center /88px no-repeat'}}>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          title={languages.getTranslation('time-frame')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          bodyStyle={ConfigBodyStyle.COMMON}
          numberStyle={ConfigNumberStyle.COMMON}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
}

export { AverageNode };
