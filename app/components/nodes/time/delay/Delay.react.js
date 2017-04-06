import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle} from '../../../configurator/configStyle';
require('./Delay.less');

class DelayNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      delay: this.props.info.props.configs.delay.defaultValue
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-delay.png' />
        <span className="node-preview-name">{languages.getTranslation('delay')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    this.setState({
      delay: conf.delay
    });
  }
 

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
           <div className='node-actual-body'>
            <span className="delay-title">{languages.getTranslation('delay')}</span>
            <span className="delay-value">{this.state.delay}s</span>
          </div>       
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          title={languages.getTranslation('delay')}
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

export { DelayNode };
