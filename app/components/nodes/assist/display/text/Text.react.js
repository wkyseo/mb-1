/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../../Node.react';
import { Configurator } from '../../../../configurator/Configurator.react';
import languages from '../../../../../languages';
import { ConfigBodyStyle, SelectStyle } from '../../../../configurator/configStyle';
require('./Text.less');

class TextNode extends Component {
  constructor() {
    super(...arguments);
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-text.png" />
        <span className="node-preview-name">{languages.getTranslation('text')}</span>
      </div>
    );
  } 
  
  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' >
           <div className='text-icon' style={{background: 'url("img/text.png") center center /31px 21px no-repeat'}}>
           </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator 
          title={languages.getTranslation('text-content')}
          configs={this.props.info.props.configs}
          nodeId={this.props.id}
          bodyStyle={ConfigBodyStyle.TEXT}
          selectStyle = {SelectStyle.TEXT}
          type={this.props.info.name}/>
         <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
}

export { TextNode };