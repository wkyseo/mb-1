import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import nodeStore from '../../../../stores/nodeStore';
require('./Today.less');

class TodayNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      month: 0,
      day: 0,
      week: 0
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-today.png' />
        <span className="node-preview-name">{languages.getTranslation('today')}</span>
      </div>
    );
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className='node-actual-body'>
            <span className="date">{this.state.month}{languages.getTranslation('month')}{this.state.day}{languages.getTranslation('day')}</span>
            <span className="week">{languages.getTranslation('week')}{this.state.week}</span>
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  nodeOutPutChange(bundle){
    if(this.props.id == bundle.id){
      switch (bundle.port) {
      case 'month':
        this.setState({month: bundle.value});
        break;
      case 'day':
        this.setState({day: bundle.value});
        break;
      case 'week':
        this.setState({week: bundle.value});
        break;   
      }       
    }
  }

  componentDidMount(){
    this.nodeOutPutChangeFunc = this.nodeOutPutChange.bind(this);
    nodeStore.on('NodeOutputChange', this.nodeOutPutChangeFunc);
  }
  componentWillUnmount(){
    nodeStore.off('NodeOutputChange', this.nodeOutPutChangeFunc);
  }
  
}

export { TodayNode };
