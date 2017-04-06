/**
 * Created by junxie on 2017/2/14.
 */
import React, { Component } from 'react';
import nodeFactory from '../nodes/nodeFactory.js';
import { TouchHandler } from './TouchHandler';
import editerStore from '../../stores/editerStore';
require('./editer.less');

class NodeTouchHandler extends TouchHandler {
  constructor() {
    super(...arguments);
    this.canMove = false;
    this.draggingObject = null;
    this._canMoveEvent = false;
  }

  onStart(e) {
    if (e.target.closest('.node-preview') && e.touches.length == 1) {
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
      if (!this._canMoveEvent) {
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
      if (!elem.closest('.sub-node-shelf')) {
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

class SubPalette extends Component {

  constructor() {
    super(...arguments);
    this.emitter = this.props.emitter;
    this.touchHandler = new NodeTouchHandler(this);
    this.state = {
      category: null,
    };
  }

  onStart(e) {
    e.preventDefault();
    if(e.currentTarget.classList.contains('show-subPalette')) {
      this.touchHandler.onStart(e);
    }
  }

  onMove(e) {
    e.preventDefault();
    this.touchHandler.onMove(e);
  }

  onEnd(e) {
    e.preventDefault();
    this.touchHandler.onEnd(e);
  }

  renderSubNodes() {
    let nodes = [];
    for(let type in this.props.nodeTypes){
      if(this.props.nodeTypes[type].props.category == this.state.category && nodeFactory[type]) {
        let Node = nodeFactory[type];
        nodes.push(
          <Node isPreview={true} info={this.props.nodeTypes[type]} key={type}/>
        );
      }
    }
    return nodes;
  }

  render() {
    return (
      <div className={'sub-node-shelf '} ref='paletteTab'
           onTouchStart={this.onStart.bind(this)}
           onTouchMove={this.onMove.bind(this)}
           onTouchEnd={this.onEnd.bind(this)}>
        {this.renderSubNodes()}
      </div>
    );
  }

  togglePalette() {
    let activeInfo = editerStore.getActiveNode();
    if(activeInfo) {
      if(this.props.nodeTypes[activeInfo.type].props && this.props.nodeTypes[activeInfo.type].props.hasassistanceNode == true) {
        for (let nodeType in this.props.nodeTypes) {
          if (this.props.nodeTypes[nodeType].props.category == activeInfo.type) {
            this.setState({
              category: activeInfo.type
            });
            break;
          }
        }
        this.refs.paletteTab.classList.add('show-subPalette');
      }
    }


    else {
      this.refs.paletteTab.classList.remove('show-subPalette');
      setTimeout(()=>{
        this.setState({
          category: null
        });
      }, 300);

    }
  }

  componentDidMount() {
    this.toggleConfigFunc = this.togglePalette.bind(this);
    editerStore.on('activateNode', this.toggleConfigFunc);
  }

  componentWillUnmount() {
    editerStore.off('activateNode', this.toggleConfigFunc);
  }
}

export { SubPalette };
