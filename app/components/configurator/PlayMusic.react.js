/**
 * Created by KongyunWu on 2017/3/30.
 */
import React, { Component } from 'react';
import tapOrClick from 'react-tap-or-click';
import UIActions from '../../actions/UIActions';
import MusicBoardStore from '../../stores/MusicBoardStore';
//import AppDispatcher from '../../dispatcher/AppDispatcher';
//import AppConstants from '../../constants/AppConstants';
import languages from '../../languages';
//import { TouchHandler } from '../editer/TouchHandler';
//import engine from '../../core/FlowEngine';


class PlayMusic extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      boardValue: this.props.configs.tune.defaultValue,
      meterValue: this.props.configs.length.defaultValue ,
      id: this.props.id
    };

    this.showBoardKey = this.showBoardKey.bind(this);
    this.meterValueChange = this.meterValueChange.bind(this);
    this.keyValueChange = this.keyValueChange.bind(this);
  }

  showBoardKey() {
    let boardValue = this.state.boardValue;
    let meterValue = this.state.meterValue;
    UIActions.showMusicBoard({
      boardValue,
      meterValue,
      nodeId: this.props.id
    });
  }

  meterValueChange() {
    this.setState({
      meterValue: MusicBoardStore.meterValue
    });
  }

  keyValueChange() {
    this.setState({
      boardValue: MusicBoardStore.boardValue
    });

  }

  render(){
    return (<div>
      <span className='music-title'>{languages.getTranslation('music-note')}</span>
      <div className='music-input-div' ref='musicInput' {...tapOrClick(this.showBoardKey.bind(this))}>
        <span className="board-value">{this.state.boardValue}</span>
        <span className="meter-value">{this.state.meterValue}</span>
      </div>
    </div>);
  }

  componentDidMount() {
    let self = this;
    MusicBoardStore.addMeterChange(function () {
      if(MusicBoardStore.nodeId === self.state.id) {
        self.meterValueChange();
      }
    });
    MusicBoardStore.addKeyValueChange(function () {
      if(MusicBoardStore.nodeId === self.state.id) {
        self.keyValueChange();
      }
    });
  }

  componentWillUnmount() {
    let self = this;
    MusicBoardStore.removeMeterChange(() => {
      self.meterValueChange();
    });
    MusicBoardStore.removeKeyValueChange(() => {
      self.keyValueChange();
    });
  }
}
export { PlayMusic };