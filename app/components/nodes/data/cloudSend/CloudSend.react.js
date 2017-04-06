import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle} from '../../../configurator/configStyle';
require('./CloudSend.less');

class CloudSendNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      bucket: this.props.info.props.configs.bucket.defaultValue,
    };        
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-cloudSend.png' />
        <span className="node-preview-name">{languages.getTranslation('cloud-send')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    this.setState({
      bucket: conf.hasOwnProperty('bucket') ? conf.bucket : this.state.bucket
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
            <span className="cloud-send">{languages.getTranslation('cloud-send')}</span>
          </div>       
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator 
          title={languages.getTranslation('cloud-send')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          bodyStyle={ConfigBodyStyle.SQUARE}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  
}

export { CloudSendNode };
