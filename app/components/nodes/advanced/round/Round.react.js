import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../Node.react';
import { Configurator } from '../../../configurator/Configurator.react';
import languages from '../../../../languages';
import {ConfigBodyStyle, SelectStyle} from '../../../configurator/configStyle';
import nodeStore from '../../../../stores/nodeStore';

require('./Round.less');

class RoundNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      round: this.props.info.props.configs.round.defaultValue,
      value: 0
    };
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <span className="node-preview-icon">{languages.getTranslation('round')}</span>
        <span className="node-preview-name">{languages.getTranslation('round')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    this.setState({
      round: conf.hasOwnProperty('round') ? conf.round : this.state.round,
    });
  }

  renderValue(){
    if (!isNaN(this.state.value)) {
      let style;
      let value = this.state.value + '';
      if  (value.indexOf('.') != -1){
        let array = value.split('.');
        let integer = array[0];
        let decimal = array[1];
        style = (<div className="value">
                      <span className='integer'>{integer}</span>
                       <span className='dot'>.</span>
                      <span className='decimal'>{decimal}</span>
                    </div> );
      } else {
        style = (<span className='value'>{this.state.value}</span>);
      }
      return style;
    }   
  }

  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' >
            <div className='node-actual-body'>
             <span className="title">{languages.getTranslation('round')}</span>
             {this.renderValue()}           
           </div>  
        </div> 
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id}/>
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} showValue={true}/>
        <Configurator 
          title={languages.getTranslation('round')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          type={this.props.info.name}
          selectStyle={SelectStyle.ROUND}
          bodyStyle={ConfigBodyStyle.SQUARE}/>
        <Tools nodeId={this.props.id}/>
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }

  updateInput(result){
    if (result.id === this.props.id) {
      this.setState({
        value: result.value
      });
    }    
  }

  componentDidMount(){
    let self = this;
    self.updateInputFunc = self.updateInput.bind(self);
    nodeStore.on('NodeInputChange', self.updateInputFunc);
  }

  componentWillUnmount(){
    nodeStore.off('NodeInputChange', this.updateInputFunc);
  } 

}

export { RoundNode };