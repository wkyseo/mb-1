import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import nodeStore from '../../../../stores/nodeStore';
import languages from '../../../../languages';
require('./Toggle.less');

class ToggleNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isActive: false
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="./img/icon-toggle.png" />
        <span className="node-preview-name">{languages.getTranslation('logic-node-toggle')}</span>
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
          background: 'url("' + (this.state.isActive ? 'img/icon-toggle-active.png' : 'img/icon-toggle.png') + '") center center / 88px no-repeat'}}>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  nodeOutPutChange(bundle){
    if(this.props.id == bundle.id){
      this.setState({
        isActive: bundle.value
      });
    }
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  componentDidMount() {
    this.nodeOutPutChangeFunc = this.nodeOutPutChange.bind(this);
    nodeStore.on('NodeOutputChange', this.nodeOutPutChangeFunc);
  }
  componentWillUnmount(){
    nodeStore.off('NodeOutputChange', this.nodeOutPutChangeFunc);
  }

  
}

export { ToggleNode };
