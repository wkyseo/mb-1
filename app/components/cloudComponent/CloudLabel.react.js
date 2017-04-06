/**
 * Created by junxie on 2017/2/22.
 */

import React, { Component } from 'react';
import nodeStore from '../../stores/nodeStore';
import appStore from '../../stores/AppStore';
import tapOrClick from 'react-tap-or-click';
import UIActions from '../../actions/UIActions';
require('./cloudStyle.less');

class CloudLabel extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      value: this.props.action,
      name: this.props.name
    };
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

  changeName(){
    UIActions.editName(this.props.id, this.state.name, this.setName.bind(this));
  }

  setName(newName){
    this.setState({
      name: newName
    });
  }

  render(){
    return (
      <div className="project-style">
        <span className='cloudApp-desc-title' {...tapOrClick(this.changeName.bind(this))}>{this.state.name}</span>
      <div className='cloud-label'>
        <span className="cloud-text-input">{this.state.value}</span>
      </div>
    </div>);
  }

  MQTTMessage(message) {
    let tmpValue = JSON.parse(message);
    if (typeof tmpValue == 'boolean') {
      if (tmpValue == true) {
        tmpValue = 'YES';
      } else if (tmpValue == false) {
        tmpValue = 'NO';
      }
    }
    this.setState({
      value: tmpValue
    });
  }

  MQTTConnect() {
    if(this.props.topic) {
      this.topic = this.props.topic.text;
      appStore.subscribeMQTTTopic(this.topic);
    }
  }

  MQTTHistory(data) {
    if (data.length != 0) {
      let tmpValue = JSON.parse(data[0]);
      if(typeof tmpValue == 'boolean') {
        if (tmpValue == true) {
          tmpValue = 'YES';
        } else if (tmpValue == false) {
          tmpValue = 'NO';
        }
      }
      this.setState({
        value: tmpValue
      });
    }
  }

  setLabel() {
    let tmpValue = this.props.action;
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

  componentDidMount() {
    let self = this;
    if(self.props.mode == 'preview-mode') {
      self.topic = self.props.topic.text;
      self.MQTTConnectFunc = self.MQTTConnect.bind(self);
      appStore.on('connect', self.MQTTConnectFunc);
      self.MQTTMessageFunc = self.MQTTMessage.bind(self);
      appStore.on('message:' + self.topic, self.MQTTMessageFunc);

      self.MQTTHistoryFunc = self.MQTTHistory.bind(self);
      appStore.on('history:' + self.props.topic.text, self.MQTTHistoryFunc);

      appStore.getHistoryData(self.props.topic.text);
    } else if(self.props.mode == 'edit-mode') {
      this.setLabel();
      self.updateInputFunc = self.updateInput.bind(self);
      nodeStore.on('NodeInputChange', self.updateInputFunc);
    }
  }

  componentWillUnmount() {
    if(this.props.mode == 'preview-mode') {
      appStore.off('connect', this.MQTTConnectFunc);
      appStore.off('message:' + this.topic, this.MQTTMessageFunc);
      appStore.off('history:' + this.props.topic.text, this.MQTTHistoryFunc);
    } else if(this.props.mode == 'edit-mode') {
      nodeStore.off('NodeInputChange', this.updateInputFunc);
    }
  }
}

export { CloudLabel };
