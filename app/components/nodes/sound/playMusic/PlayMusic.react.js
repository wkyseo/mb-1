/**
 * Created by KongyunWu on 2017/3/29.
 */
import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import {SoundStyle} from '../../../configurator/configStyle';

require('./PlayMusic.less');

class PlayMusicNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      tune: this.props.info.props.configs.tune.defaultValue,
      length: this.props.info.props.configs.length.defaultValue
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-music.png' />
        <span className="node-preview-name">{languages.getTranslation('sound-node-playmusic')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    console.log(conf);
    let newState = {};
    if(conf.hasOwnProperty('tune')) {
      newState.tune = conf.tune;
    }
    if(conf.hasOwnProperty('length')) {
      newState.length = conf.length;
    }
    this.setState(newState);

  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' style={{
          background: 'url("img/icon-music.png") center center / 88px no-repeat'}}>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          bodyStyle={SoundStyle.PLAYMUSIC}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

}

export { PlayMusicNode };