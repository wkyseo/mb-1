import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle, SelectStyle} from '../../../configurator/configStyle';
require('./Hold.less');

class HoldNode extends Component {
  constructor() {
    super(...arguments);
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-hold.png' />
        <span className="node-preview-name">{languages.getTranslation('hold')}</span>
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
        <div className='node-body node-draggable'>
          <div className='node-actual-body'>
            <span className="hold">{languages.getTranslation('hold')}</span>
            <img className="arrow" src='./img/hold-arrow.png' />
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          title={languages.getTranslation('hold')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          numberStyle={ConfigNumberStyle.HOLD}
          selectStyle={SelectStyle.HOLD}
          bodyStyle={ConfigBodyStyle.HOLD}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
}

export { HoldNode };
