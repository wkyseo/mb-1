/**
 * Created by junxie on 2016/12/12.
 */

import React, { Component } from 'react';
import {Inputs, Outputs, Tools} from '../../../Node.react';
import { Configurator } from '../../../../configurator/Configurator.react';
import languages from '../../../../../languages';
import { ConfigBodyStyle, SelectStyle } from '../../../../configurator/configStyle';
require('./Face.less');

class FaceNode extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      faceId: this.props.info.props.configs.faceId.defaultValue
    }; 
  }

  renderPreview() {
    return (
      <div className={'node-preview node-preview-palette node-type-' + this.props.info.name} id={this.props.nodeId} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <img className="node-preview-icon" src="img/icon-face.png" />
        <span className="node-preview-name">{languages.getTranslation('face')}</span>
      </div>
    );
  }

  onConfigChange(conf) {
    if (conf.hasOwnProperty('faceId')){
      this.setState({
        faceId: conf.faceId
      });
    }
  }

  renderFaceIcon(){
    let icon;
    switch (this.state.faceId) {
    case 'angry':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-angry.png") center center /60px 6px no-repeat'}}></div> ); 
      break;
    case 'drowsy':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-drowsy.png") center center /63px 12px no-repeat'}}></div> );    
      break;
    case 'enlarged':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-enlarged.png") center center /56px 23px no-repeat'}}></div> );      
      break;
    case 'fixed':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-fixed.png") center center /53px 16px no-repeat'}}></div> );          
      break;
    case 'happy':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-happy.png") center center /60px 16px no-repeat'}}></div> );     
      break;
    case 'mini':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-mini.png") center center /60px 4px no-repeat'}}></div> );     
      break;     
    case 'normal':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-normal.png") center center /58px 23px no-repeat'}}></div> );       
      break;
    case 'sad':
      icon =  (<div className='face-icon' style={{background: 'url("img/face-sad.png") center center /57px 17px no-repeat'}}></div> );        
      break;    
    }
    return icon;
  }  
  
  renderActual() {
    return (
      <div className={'node-actual node-type-' + this.props.info.name} id={this.props.id} style={{
        left: this.props.left + 'px',
        top: this.props.top + 'px'
      }} data-type={this.props.info.name} data-category={this.props.info.props.category}>
        <div className='node-body node-draggable' >
          {this.renderFaceIcon()}  
        </div>
        <Inputs ports={this.props.info.props.in} nodeId={this.props.id} />
        <Outputs ports={this.props.info.props.out} nodeId={this.props.id} />
        <Configurator 
          title={languages.getTranslation('setting')}
          configs={this.props.info.props.configs}
          onConfigChange={this.onConfigChange.bind(this)}
          nodeId={this.props.id}
          bodyStyle={ConfigBodyStyle.FACE}
          selectStyle = {SelectStyle.FACE}
          type={this.props.info.name}/>
         <Tools nodeId={this.props.id} />
      </div>
    );
  }

  render() {
    return this.props.isPreview ? this.renderPreview() : this.renderActual();
  }
  
}

export { FaceNode };