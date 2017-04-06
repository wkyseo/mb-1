/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import languages from '../../../../languages';
import {Inputs, Outputs, Tools} from '../../Node.react';
import tapOrClick from 'react-tap-or-click';
import UIActions from '../../../../actions/UIActions';
import { Configurator } from '../../../configurator/Configurator.react';
import nodeStore from '../../../../stores/nodeStore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

require('./ControlSlider.less');

class ControlSlider extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      value: 0
    };
  }

  EditName(){
    UIActions.editName(this.props.id, nodeStore.getCurrentConfig(this.props.id, 'name'));
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-controlSlider.png" />
        <span className="node-preview-name">{languages.getTranslation('control-slider')}</span>
      </div>
    );
  }

  getValue(value){
    UIActions.configNode(this.props.id, {'state': parseInt(value)});
  }

  renderActual() {
    return (
      <div className={'project-style node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category} ref='slider'>
        <div className='node-body node-draggable'>
          <span className='editer-gear' {...tapOrClick(this.EditName.bind(this))} style={{background:'url("img/icon-gear.png") center center / 20px no-repeat'}}></span>
          <span className="slider-value">{this.state.value}</span>
          <Slider onChange={this.getValue.bind(this)} value={this.state.value}/>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          configs={this.props.info.props.configs}
          nodeId={this.props.id}
          action={'hideConfig'}
          />
        <Tools nodeId={this.props.id} />
      </div>);
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  updateSliderStatus(result) {
    if (result.id === this.props.id) {
      this.setState({
        value: Number(result.value)
      });
    }
  }

  componentDidMount(){
    let self = this;
    if(nodeStore.getNodeConfigs(this.props.id)) {
      self.setState({
        value: nodeStore.getNodeConfigs(this.props.id).state.defaultValue
      });
    }
    self.updateSliderStatusFunc = self.updateSliderStatus.bind(self);
    nodeStore.on('NodeOutputChange', self.updateSliderStatusFunc);
  }

  componentWillUnmount(){
    nodeStore.off('NodeOutputChange', this.updateSliderStatusFunc);
  }
}

export { ControlSlider };