import React, { Component } from 'react';
import nodeFactory from '../nodes/nodeFactory.js';
import { TouchHandler } from './TouchHandler';
import editerStore from '../../stores/editerStore';
import tapOrClick from 'react-tap-or-click';
import languages from '../../languages';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import engine from '../../core/FlowEngine';
require('./editer.less');

class NodeTouchHandler extends TouchHandler {
  constructor() {
    super(...arguments);
    this.canMove = false;
    this.draggingObject = null;
    this._canMoveEvent = false;
  }

  onStart(e) {
    if ( e.target.closest('.node-preview') && e.touches.length == 1) {
      let tmp = e.target.closest('.node-preview');
      this.canMove = true;
      this._canMoveEvent = false;
      this.baseTop = this._getOffsetRect(tmp).top - parseInt(window.getComputedStyle(tmp).marginTop);
      this.baseLeft = this._getOffsetRect(tmp).left - parseInt(window.getComputedStyle(tmp).marginLeft);
      this.draggingObject = tmp.cloneNode(true);
      this.draggingObject.style.position = 'absolute';
      this.draggingObject.classList.add('fakeNode');
      this.draggingObject.style.top = this.baseTop + 'px';
      this.draggingObject.style.left = this.baseLeft + 'px';
      this.touchX = this._touches(e)[0].pageX;
      this.touchY = this._touches(e)[0].pageY;
      document.querySelector('.editer-main').appendChild(this.draggingObject);
    }

  }

  onMove(e) {
    if (this.canMove) {
      let deltaX = this._touches(e)[0].pageX - this.touchX;
      let deltaY = this._touches(e)[0].pageY - this.touchY;
      this.draggingObject.style.top = this.baseTop + deltaY + 'px';
      this.draggingObject.style.left = this.baseLeft + deltaX + 'px';
      if(!this._canMoveEvent) {
        this._canMoveEvent = true;
        this.container.emitter.emit('beginMovingNodeToCanvas');
      }
    }
  }

  onEnd(e) {
    if (this.canMove) {
      this.canMove = false;
      if (this.draggingObject) {
        this.draggingObject.remove();
      }
      var elem = document.elementFromPoint(this._touches(e)[0].pageX, this._touches(e)[0].pageY);
      if (!elem.closest('.editer-palette-nodes')) {
        let nodeInfo = {
          left: parseInt(this.draggingObject.style.left),
          top: parseInt(this.draggingObject.style.top),
          ins: [],
          outs: [],
          type: this.draggingObject.dataset.type,
          category: this.draggingObject.dataset.category
        };
        this.container.emitter.emit('addNode', nodeInfo);
      }
    }
  }
}

class Palette extends Component {
  constructor() {
    super(...arguments);
    this.emitter = this.props.emitter;
    this.touchHandler = new NodeTouchHandler(this);
    this._showDelete = false;
    this.state = {
      category: 'common',
      reRender: false,
      tabList: [],
      nodesList: []
    };
    this.hasShowSoundNodes = false;
    this.audio = false;
    this.video = false;
  }

  getAudioStatus() {
    let status = engine.getavblockState();
    if(status.sound == 'connected') {
      this.audio = true;
      this.refs.tabNames.style.width = '55.5%';
      //'shrink-with-sound-node' use to expand and shrink tabs within "sound"
      if(this.refs.tabNames.classList.contains('shrink')) {
        this.refs.tabNames.classList.remove('shrink');
        this.refs.tabNames.classList.add('shrink-with-sound-node');
      }
    } else if (status.camera == 'connected') {
      this.video = true;
    }
    this.setTabNames();
  }

  setTabNames() {
    let tabList = [];
    for(let type in this.props.nodeTypes){
      if(tabList.indexOf(this.props.nodeTypes[type].props.category)==-1 &&
        this.props.nodeTypes[type].props.assistanceNode == undefined &&
        this.props.nodeTypes[type].props.category != 'electronic') {
        if(this.props.nodeTypes[type].props.category == 'sound' && this.audio == false){
          continue;
        } else {
          tabList.push(this.props.nodeTypes[type].props.category);
        }
      }
    }
    tabList = this.setSeq(tabList);

    this.setState({
      tabList: tabList
    });
  }

  setSeq(tabList) {
    let iconSound = tabList.splice(tabList.indexOf('sound'), 1).toString();
    tabList.splice(2,0,iconSound);
    return tabList;
  }

  renderTabs(){
    let tabs = [];
    for(let tabName in this.state.tabList){
      tabs.push(<li key={tabName} data-tab={this.state.tabList[tabName]} className={'tab-name '+(this.state.tabList[tabName]==this.state.category?'active':'')} {...tapOrClick(this.switchTab.bind(this))}>{languages.getTranslation(this.state.tabList[tabName])}<span className='tab-separate'></span></li>);
    }
    return (<ul className='tabs shrink' ref='tabNames'>{tabs}</ul>);
  }

  setNodeList() {
    this.setState({
      nodesList: this.props.nodeTypes
    });
  }

  renderNodes() {
    let nodes = [];
    for (let type in this.state.nodesList) {
      if (this.state.nodesList[type].props.category == this.state.category && nodeFactory[type]) {
        let Node = nodeFactory[type];
        nodes.push(
          <Node isPreview={true} info={this.state.nodesList[type]} key={type}/>
        );
      }
    }
    return nodes;
  }

  onStart(e) {
    e.preventDefault();
    this.touchHandler.onStart(e);
  }

  onMove(e) {
    e.preventDefault();
    this.touchHandler.onMove(e);
  }

  onEnd(e) {
    e.preventDefault();
    this.touchHandler.onEnd(e);
  }

  switchTab(e){
    this.setState({
      category: e.target.dataset.tab
    });
  }

  /* expand or shrink tab
  * when shrink tabs, if current active is neither 'common' nor 'control', set common tab as active, if 'control' do nothing
  *
  */
  onToggleTabDisplay(e){
    let palette = e.target.closest('.editer-palette-tab');
    if( this.hasShowSoundNodes == true || this.audio == true) {

      palette.querySelector('.tabs').classList.toggle('shrink-with-sound-node');
    } else {
      palette.querySelector('.tabs').classList.toggle('shrink');
    }

    palette.querySelector('.icon-tab-arrow').classList.toggle('direction');
    if(palette.querySelector('.tabs').classList.contains('shrink') == true) {
      if (this.state.category != 'common') {
        if(this.state.category !='control') {
          this.setState({
            category: 'common'
          });
        }
      }
    }
  }

  render() {
    return (
        <div className={'editer-palette '} ref='mainPaletteTab'>
        <div className='editer-palette-tab'>
          {this.renderTabs()}
          <div className='expand tabs-control' {...tapOrClick(this.onToggleTabDisplay.bind(this))}>
            <i className='icon-tab-arrow'/>
          </div>
        </div>
        <div className="editer-palette-nodes"
          onTouchStart={this.onStart.bind(this)}
          onTouchMove={this.onMove.bind(this)}
          onTouchEnd={this.onEnd.bind(this)}
          ref='editerPalette'>
          {this.renderNodes()}
        </div>
        <div className='palette-div-delete' style={{display: this._showDelete ? 'block' : 'none'}}>
          <img className='icon-drag-delete' src={'img/icon-delete-red.png'}/>
        </div>
      </div>
    );
  }

  togglePalette(){
    let activeInfo = editerStore.getActiveNode();
    if(activeInfo) {
      if(this.props.nodeTypes[activeInfo.type].props && this.props.nodeTypes[activeInfo.type].props.hasassistanceNode == true) {
        this.refs.mainPaletteTab.classList.add('hide-mainPalette');
      }
    }
    else {
      this.refs.mainPaletteTab.classList.remove('hide-mainPalette');
    }
  }

  mountSound(soundNode) {
    if(soundNode.state == 'connected') {
      this.hasShowSoundNodes = true;
      this.audio = true;
      let newTabList = this.state.tabList;
      newTabList.splice(2,0,soundNode.category);
      this.setState({
        tabList: newTabList,
        category: soundNode.category,
      });
      this.refs.tabNames.style.width = '55.5%';
      //'shrink-with-sound-node' use to expand and shrink tabs within "sound"
      if(this.refs.tabNames.classList.contains('shrink')) {
        this.refs.tabNames.classList.remove('shrink');
        this.refs.tabNames.classList.add('shrink-with-sound-node');
      }
    } else {
      this.hasShowSoundNodes = false;
      this.audio = false;
      let newTabList = this.state.tabList;
      newTabList.splice(newTabList.indexOf(soundNode.category), 1);
      this.setState({
        tabList: newTabList,
        category: 'common'
      });
      this.refs.tabNames.style.width = '';
      if(this.refs.tabNames.classList.contains('shrink-with-sound-node')) {
        this.refs.tabNames.classList.remove('shrink-with-sound-node');
        this.refs.tabNames.classList.add('shrink');
      }
    }
  }

  componentDidMount() {
    this.getAudioStatus();

    this.setNodeList();
    this.toggleConfigFunc = this.togglePalette.bind(this);
    editerStore.on('activateNode', this.toggleConfigFunc);
    this.mountSoundFunc = this.mountSound.bind(this);
    engine.on('CategoryChanged', this.mountSoundFunc);
    this._register = AppDispatcher.register((action) => {
      if (action.actionType == AppConstants.PALETTE_SHOW_DELETE) { 
        if(this._showDelete != action.showDelete) {
          this._showDelete = action.showDelete;
          this.setState({
            reRender: false
          });
        }
      }
    });
  }

  componentWillUnmount(){
    editerStore.off('activateNode', this.toggleConfigFunc);
    engine.removeListener('CategoryChanged', this.mountSoundFunc);
    engine.removeListener('activateNode', this.toggleConfigFunc);
    AppDispatcher.unregister(this._register);
  }
}

export { Palette };