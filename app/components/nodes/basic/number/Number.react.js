import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import {ConfigBodyStyle, ConfigNumberStyle} from '../../../configurator/configStyle';

require('./Number.less');
class NumberNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      value: this.props.info.props.configs.number.defaultValue
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-number.png' />
        <span className="node-preview-name">{languages.getTranslation('logic-node-number')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    this.setState({
      value: conf.number
    });
  }


  renderActual() {
    // console.log(this.props.info);
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className='node-actual-body'>
            <div className="number-node">{this.state.value}</div>
            <img className="number-arrow" src='./img/number-arrow.svg' />
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>

        <Configurator
          title={languages.getTranslation('logic-node-number')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          numberStyle={ConfigNumberStyle.COMMON}
          bodyStyle={ConfigBodyStyle.COMMON}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }


  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

}

export { NumberNode };