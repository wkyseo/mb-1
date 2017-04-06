import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import nodeStore from '../../../../stores/nodeStore';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle} from '../../../configurator/configStyle';
require('./Filter.less');

class FilterNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      number: 0,
      from: this.props.info.props.configs.from.defaultValue,
      to: this.props.info.props.configs.to.defaultValue,
    };   
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <span className="node-preview-icon">{languages.getTranslation('filter')}</span>
        <span className="node-preview-name">{languages.getTranslation('filter')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    let newState = {};
    if(conf.hasOwnProperty('from')) {
      if(conf.from >= 1000 || conf.from <= -1000) {
        newState.from = '...';
      } else {
        newState.from = conf.from;
      }
    }
    if(conf.hasOwnProperty('to')) {
      if(conf.to >= 1000 || conf.to <= -1000) {
        newState.to = '...';
      } else {
        newState.to = conf.to;
      }
    }
    this.setState(newState); 
  } 

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
           <div className='node-actual-body'>
            <span className="to">{this.state.to}</span>
            <img className="arrow" src='./img/filter-arrow.png' />
            <span className="from">{this.state.from}</span>
          </div>       
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          title={languages.getTranslation('filter-range')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          bodyStyle={ConfigBodyStyle.RANGE}
          numberStyle={ConfigNumberStyle.RANGE}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  nodeOutPutChange(bundle){
    if(this.props.id == bundle.id){
      this.setState({
        number: bundle.value
      });
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

export { FilterNode };
