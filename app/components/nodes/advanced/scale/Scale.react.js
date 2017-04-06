import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import languages from '../../../../languages';
import nodeStore from '../../../../stores/nodeStore';
import { Configurator } from '../../../configurator/Configurator.react';
import {ConfigBodyStyle, ConfigNumberStyle} from '../../../configurator/configStyle';

require('./Scale.less');

class ScaleNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      minin: this.props.info.props.configs.minin.defaultValue,
      maxin: this.props.info.props.configs.maxin.defaultValue,
      minout: this.props.info.props.configs.minout.defaultValue,
      maxout: this.props.info.props.configs.maxout.defaultValue 
    };   
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-scale.png' />
        <span className="node-preview-name">{languages.getTranslation('scale')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    let newState = {};
    if(conf.hasOwnProperty('minin')) {
      newState.minin = conf.minin;
    }
    if(conf.hasOwnProperty('maxin')) {
      newState.maxin = conf.maxin;
    }
    if(conf.hasOwnProperty('minout')) {
      newState.minout = conf.minout;
    }
    if(conf.hasOwnProperty('maxout')) {
      newState.maxout = conf.maxout;
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
            <span className="scale-title">{languages.getTranslation('scale')}</span>
            <span className="scale-in">( {this.state.minin}-{this.state.maxin} )</span>          
            <img className="scale-arrow" src='./img/scale-arrow.png' />
            <span className="scale-out">( {this.state.minout}-{this.state.maxout} )</span>
          </div>       
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator
          title={languages.getTranslation('scale-setting')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          numberStyle={ConfigNumberStyle.RANGE}
          bodyStyle={ConfigBodyStyle.SCALE}/>
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

export { ScaleNode };
