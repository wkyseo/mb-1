import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../../Node.react';
import languages from '../../../../../languages';
import { Configurator } from '../../../../configurator/Configurator.react';
import { ConfigBodyStyle } from '../../../../configurator/configStyle';
require('./ColorCheck.less');

class ColorCheckNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      R: this.props.info.props.configs.sampleColor.defaultValue!==null?this.props.info.props.configs.sampleColor.defaultValue.R:0,
      G: this.props.info.props.configs.sampleColor.defaultValue!==null?this.props.info.props.configs.sampleColor.defaultValue.G:0,
      B: this.props.info.props.configs.sampleColor.defaultValue!==null?this.props.info.props.configs.sampleColor.defaultValue.B:0
    };   
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src='./img/icon-colorCheck.png' />
        <span className="node-preview-name">{languages.getTranslation('colorCheck')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    if ( (conf.hasOwnProperty('sampleColor')) && (conf.sampleColor!==null)) {
      let newState = {};
      if(conf.sampleColor.hasOwnProperty('R')) {
        newState.R = conf.sampleColor.R;
      }
      if(conf.sampleColor.hasOwnProperty('G')) {
        newState.G = conf.sampleColor.G;
      }   
      if(conf.sampleColor.hasOwnProperty('B')) {
        newState.B = conf.sampleColor.B;
      }       
      this.setState(newState); 
    }
  }  

  renderActual() {
    let R = this.state.R;
    let G = this.state.G;
    let B = this.state.B;
    let sampleColor = 'rgb' + '(' + R + ',' + G + ',' + B + ')';    
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable'>
          <div className='node-actual-body'>
            <div className="colorCheck">{languages.getTranslation('colorCheck')}</div>
            <div className="color" style={{background: sampleColor}}></div>
          </div>
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
         <Configurator
          configs={this.props.info.props.configs}
          nodeId={this.props.id}
          type={this.props.info.name}
          onConfigChange={this.onConfigChange.bind(this)}
          bodyStyle={ConfigBodyStyle.COLORCHECK}/>
        <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  
}

export { ColorCheckNode };
