/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../../Node.react';
import { Configurator } from '../../../../configurator/Configurator.react';
import { LedSet } from '../../../../configurator/Pattern.react';
import languages from '../../../../../languages';
import nodeStore from '../../../../../stores/nodeStore';

require('./Pattern.less');

class PatternNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: this.props.id,
      pattern: {}
    };   
  }

  getDefaultSelected(){
    let configs = nodeStore.getNodeConfigs(this.props.id);
    return configs.selected.defaultValue;
  } 

  getEditPattern(){
    let configs = nodeStore.getNodeConfigs(this.props.id);
    return configs.editPattern.defaultValue;
  } 

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/LedStrip/icon-pattern-preview.png" />
        <span className="node-preview-name">{languages.getTranslation('pattern')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    if(conf.hasOwnProperty('pattern')) {
      this.setState({
        pattern: conf.pattern.pattern
      });
    }
  }
  
  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className='display-pattern'>
            <LedSet colors={this.state.pattern.colors}/>
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator 
          configs={this.props.info.props.configs}
          selected = {this.getDefaultSelected()}
          editPattern = {this.getEditPattern()}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}/>
         <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
}

export { PatternNode };