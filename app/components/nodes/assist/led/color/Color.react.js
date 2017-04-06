/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../../Node.react';
import { Configurator } from '../../../../configurator/Configurator.react';
import languages from '../../../../../languages';
import nodeStore from '../../../../../stores/nodeStore';

require('./Color.less');


class COLORNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      value: this.props.info.props.configs.color.defaultValue
    };   
    this.colorMap = ['#d8d8d8','#d50022', '#f8a443', '#f8e653', '#77d24b', '#3ce3c4', '#35619d', '#9325f3'];
  }

  getDefaultSelected(){
    let configs = nodeStore.getNodeConfigs(this.props.id);
    return configs.color.defaultValue;
  }    

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-color.png" />
        <span className="node-preview-name">{languages.getTranslation('assistance-node-color')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    console.log(conf.color);
    this.setState({
      value: Number(conf.color)
    });
  }
  
  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className="color-selected" style={{background: this.colorMap[this.state.value]}}></div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator 
          configs={this.props.info.props.configs}
          selected = {this.getDefaultSelected()}
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

export { COLORNode };