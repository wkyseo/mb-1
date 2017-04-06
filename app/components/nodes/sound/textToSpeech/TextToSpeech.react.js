/**
 * Created by shenghuowang on 17/3/30.
 */
import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import { SoundStyle } from '../../../configurator/configStyle';

require('./TextToSpeech.less');

class TextToSpeechNode extends Component {
  constructor() {
    super(...arguments);

  }

  onConfigChange(conf) {
    console.log(conf);
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-textToSpeech.png' />
        <span className="node-preview-name">{languages.getTranslation('sound-node-textToSpeech')}</span>
      </div>
    );
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' style={{
          background: 'url("img/sound-textToSpeech.png") center center / 88px no-repeat'}}>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          bodyStyle={SoundStyle.SPEECH}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

}

export { TextToSpeechNode };