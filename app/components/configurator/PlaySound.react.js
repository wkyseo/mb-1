/**
 * Created by junxie on 17/3/29.
 */
import React, { Component } from 'react';
import { Select } from './Select.react';
import tapOrClick from 'react-tap-or-click';
import languages from '../../languages';
import { EventEmitter } from 'fbemitter';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import soundStore from '../../stores/soundStore';

class SoundList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isActive: false,
      showDelete: false,
      soundList: this.props.soundList
    };

  }
  renderSoundList() {
    if (this.props.soundList && this.props.soundList.length != 0) {
      let list = [];
      let self = this;
      this.props.soundList.map((soundName, index)=> {
        list.push(<li className='sound-detail' key={soundName} data-value={index}><span
          className='sound-name'>{soundName}</span>
        <span
          className={'icon-sound-delete '+(self.state.showDelete==true? 'hide':'')} {...tapOrClick(self.tapToSHowDeleteIcon.bind(self))}>
          {languages.getTranslation('sound-delete')}
        </span>
          <div className={'deleteOrNot '+(self.state.showDelete == true? 'show': '')}>
            <span className='icon-delete-btn'{...tapOrClick(self.cancel.bind(self))}>{languages.getTranslation('cancel')}</span>
            <span className='icon-confirm-btn'{...tapOrClick(self.confirm.bind(self))}>{languages.getTranslation('icon-confirm-ok')}</span>
          </div>
        </li>);
      });
      return list;
    }
  }

  cancel() {
    this.setState({
      showDelete: false
    });
  }

  confirm(e) {
    this.setState({
      showDelete: true
    });
    let option = e.target.closest('.sound-detail').dataset.value;
    soundStore.deleteSound(this.props.id, option);
    if(this.props.emitter) {
      this.props.emitter.emit('deleteDone', option);
    }

  }

  tapToSHowDeleteIcon() {
    this.setState({
      showDelete: true
    });
  }

  closeList() {
    this.setState({
      isActive: false,
      showDelete: false
    });
    this.props.closeList && this.props.closeList(true);
  }

  render() {
    return (<div className={'sound-list-management '+(this.state.isActive == true?'show-list':'')}>
      <div className='sound-list-management-title'>
        <span className='sound-management-txt'>{languages.getTranslation('record-management')}</span><img {...tapOrClick(this.closeList.bind(this))} src='img/icon-close.png'/>
      </div>
      <ul className={'sound-list '+(this.props.isShow == 'record'?'':'hide')}>{this.renderSoundList()}</ul>
    </div>);
  }


  componentDidMount() {
    this._register = AppDispatcher.register((action) => {
      if (action.actionType == AppConstants.NODE_TAP) {
        if(this.props.id == action.nodeId) {
          this.closeList();
        }
      } else if (action.actionType == AppConstants.SOUND_LIST_LOAD_FINISHED) {
        if(this.props.id == action.nodeId) {
          if(action.showType == 'show') {
            this.setState({
              isActive: true
            });
          }
        }
      }
    });
  }

  componentWillUnmount() {
    AppDispatcher.unregister(this._register);
  }

}

class PlaySound extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      name: '',
      id: this.props.id,
      curTab: this.props.configs.soundType.defaultValue,
      soundEffect: this.props.configs.soundEffect.defaultValue,
      soundList: [],
      curPlay: this.props.configs.record.defaultValue
    };
    soundStore.fetchData(this.props.id);
    this.emitter = new EventEmitter();
  }
  playEffect(e) {
    this.setState({
      soundEffect: e.target.dataset.effect
    });
    this.props.onChange && this.props.onChange('soundEffect', e.target.dataset.effect);
  }

  changeTab(e) {
    let list = [];
    let confirmBtn = e.target.closest('.node-config').querySelector('.confirm');
    if(e.target.dataset.action == 'record') {
      list = soundStore.getDropdownList(this.state.id, 'hide');
      confirmBtn.style.display = 'none';
      this.setState({
        curTab: e.target.dataset.action,
        soundList: list
      });
    } else {
      confirmBtn.style.display = 'block';
      this.setState({
        curTab: e.target.dataset.action
      });
    }
    this.props.onChange && this.props.onChange('soundType', e.target.dataset.action);
  }

  onConfigSelect(key, value){
    this.props.onChange && this.props.onChange('record', value);
    this.curPlay = value;
  }

  showSoundList() {
    soundStore.requestSoundList(this.state.id, 'show');
  }

  onConfig(key, value) {
    this.props.onChange && this.props.onChange(key, value);
  }

  //forward or backward play sound
  SoundPlay(e) {
    let playList = this.state.soundList;
    let onPlay;
    switch (e.currentTarget.dataset.action) {
    case 'prevSound':
      onPlay = playList[playList.indexOf(this.curPlay)-1];
      if(onPlay !=undefined ) {
        this.props.onChange && this.props.onChange('record', onPlay);
        this.curPlay = onPlay;
        if(this.refs.nextSound.src.indexOf('blur')!=-1) {
          this.refs.nextSound.src = 'img/icon-nextSound.png';
        }
        this.setState({
          curPlay: onPlay
        });
      } else {
        e.target.src = 'img/icon-prevSound-blur.png';
      }
      break;
    case 'curSound':
      this.props.onChange && this.props.onChange('record', this.curPlay);
      break;
    case 'nextSound':
      onPlay = playList[playList.indexOf(this.curPlay)+1];
      if(onPlay !=undefined ) {
        this.props.onChange && this.props.onChange('record', playList[playList.indexOf(this.curPlay)+1]);
        this.curPlay = onPlay;
        if(this.refs.prevSound.src.indexOf('blur')!=-1) {
          this.refs.prevSound.src = 'img/icon-prevSound.png';
        }
      } else {
        e.target.src = 'img/icon-nextSound-blur.png';
      }
      this.setState({
        curPlay: onPlay
      });
      break;
    }
  }

  renderPanel() {
    if(this.state.curTab == 'effect') {
      return (<div className='play-effect'>
        <div className={'play-effect-div '+ (this.state.soundEffect == 'cat'?'is-selected-cat':'')}><span className='play-effect-icon cat'><img className='icon-sound-effect' data-effect='cat' src='img/soundEffect/icon-sound-miao.png' {...tapOrClick(this.playEffect.bind(this))} /></span></div>
        <div className={'play-effect-div '+ (this.state.soundEffect == 'dog'?'is-selected-dog':'')}><span className='play-effect-icon dog'><img className='icon-sound-effect' data-effect='dog' src='img/soundEffect/icon-sound-dog.png' {...tapOrClick(this.playEffect.bind(this))} /></span></div>
        <div className={'play-effect-div '+ (this.state.soundEffect == 'duck'?'is-selected-duck':'')}><span className='play-effect-icon duck'><img className='icon-sound-effect' data-effect='duck' src='img/soundEffect/icon-sound-duck.png' {...tapOrClick(this.playEffect.bind(this))} /></span></div>
        <div className={'play-effect-div '+ (this.state.soundEffect == 'alert'?'is-selected-alert':'')}><span className='play-effect-icon alert'><img className='icon-sound-effect' data-effect='alert' src='img/soundEffect/icon-sound-alert.png' {...tapOrClick(this.playEffect.bind(this))} /></span></div>
        <div className={'play-effect-div '+ (this.state.soundEffect == 'bell'?'is-selected-bell':'')}><span className='play-effect-icon bell'><img className='icon-sound-effect' data-effect='bell' src='img/soundEffect/icon-sound-bell.png' {...tapOrClick(this.playEffect.bind(this))} /></span></div>
      </div>);
    } else if(this.state.curTab == 'record') {
      let soundsOption = {options:this.state.soundList, defaultValue: this.state.curPlay};
      return (<div className='sound-record'>
        <div className='sound-dropdown-list'>
          <Select config={soundsOption} emitter={this.emitter} selectStyle='playsound' onChange={this.onConfigSelect.bind(this)} />
          <div className='sound-management' {...tapOrClick(this.showSoundList.bind(this))}>{languages.getTranslation('record-management')}<img className='icon-right' src='img/icon-back.png'/></div>
        </div>
        <div className='play-action'>
          <div className='prevSound' data-action='prevSound' {...tapOrClick(this.SoundPlay.bind(this))}><img ref='prevSound' src='img/icon-prevSound.png' /></div>
          <div className='curSound' data-action='curSound' {...tapOrClick(this.SoundPlay.bind(this))}><img ref='curSound' src='img/icon-curSound.png' /></div>
          <div className='nextSound' data-action='nextSound' {...tapOrClick(this.SoundPlay.bind(this))}><img ref='nextSound' src='img/icon-nextSound.png' /> </div>
        </div>
      </div>);
    }
  }

  render() {
    return (<div className='play-sound'>
      <div className='play-type' {...tapOrClick(this.changeTab.bind(this))} >
        <span className={'play-sound-effect '+(this.state.curTab == 'effect'? 'is-selected': '')} data-action='effect' ref='effect'>{languages.getTranslation('play-sound-effect')}</span>
        <span className={'play-sound-record '+(this.state.curTab == 'record'? 'is-selected': '')} data-action='record' ref='record'>{languages.getTranslation('play-sound-record')}</span>
      </div>
      <div className='sound-category'>{this.renderPanel()}</div>
      <SoundList id={this.state.id} isShow={this.state.curTab} emitter={this.emitter} soundList={this.state.soundList} onChange={this.onConfig.bind(this)}/>
    </div>);
  }

  deleteDone(option) {
    let list = self.state.soundList;
    list.splice(option, 1);
    self.setState({
      soundList: list
    });
    this.emitter.emit('listChange', self.state.soundList);
  }


  componentDidMount() {
    let self = this;
    this.deleteDoneFunc = this.deleteDone.bind(this);
    this.refs.effect.classList.add('is-selected');
    this.refs.effect.closest('.node-config').querySelector('.confirm').style.display = '';
    for ( let key in this.props.configs){
      if (this.props.configs[key].hasOwnProperty('defaultValue')){
        this.props.onChange && this.props.onChange( key, this.props.configs[key].defaultValue);
      }
    }
    this.emitter.addListener('deleteDone', this.deleteDoneFunc);
    this._register = AppDispatcher.register((action) => {
      if (action.actionType == AppConstants.SOUND_LIST_LOAD_FINISHED) {
        if(this.props.id == action.nodeId) {
          if(action.nodeId == this.state.id) {
            self.setState({
              soundList: action.soundList
            });
          }
        }
      }
    });
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners();
    AppDispatcher.unregister(this._register);
  }
}

export { PlaySound, SoundList };