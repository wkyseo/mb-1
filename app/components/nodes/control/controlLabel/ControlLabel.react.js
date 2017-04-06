/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import nodeStore from '../../../../stores/nodeStore';
import tapOrClick from 'react-tap-or-click';
import UIActions from '../../../../actions/UIActions';
import { Configurator } from '../../../configurator/Configurator.react';
require('./ControlLabel.less');

class ControlLabelNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      value: ''
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-controlLabel.png" />
        <span className="node-preview-name">{languages.getTranslation('control-label')}</span>
      </div>
    );
  }

  updateInput(bundle) {
    if(bundle.id === this.props.id){
      let tmpValue = bundle.value;
      if(typeof tmpValue == 'boolean') {
        if(tmpValue == true) {
          tmpValue = 'YES';
        } else if(tmpValue == false) {
          tmpValue = 'NO';
        }
      }
      this.setState({
        value: tmpValue
      });
    }
  }

  EditName(){
    UIActions.editName(this.props.id, nodeStore.getCurrentConfig(this.props.id, 'name'));
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' >
          <span className='editer-gear' {...tapOrClick(this.EditName.bind(this))} style={{background:'url("img/icon-gear.png") center center / 20px no-repeat'}}></span>
          <div className="node-actual-title">{languages.getTranslation('control-label')}</div>
          <div className="node-actual-content">{'' + this.state.value}</div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          configs={this.props.info.props.configs}
          nodeId={this.props.id}
          action={'hideConfig'}
          />
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }   

  componentDidMount() {
    let self = this;
    self.updateInputFunc = self.updateInput.bind(self);
    nodeStore.on('NodeInputChange', self.updateInputFunc);
    self.setState({
      value: nodeStore.getNodeInputValue(self.props.id, 'text')
    });
  }

  componentWillUnmount() {
    nodeStore.off('NodeInputChange', this.updateInputFunc);
  }   

}

export { ControlLabelNode };
