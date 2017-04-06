/**
 * Created by junxie on 2016/12/14.
 */
import React, { Component } from 'react';
import tapOrClick from 'react-tap-or-click';
import {SelectStyle} from './configStyle';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import { getCompareIconUrl, getComputeIconUrl, getTextIconUrl } from './getIconUrl';
class Select extends Component {
  constructor() {
    super(...arguments);
    this.list = this.props.config.options;
    this.state = {
      isActive: false,
      selection: this.props.config.defaultValue,
      reRender: false
    };
  }
  selectOption(e){
    console.log(e.target.dataset.value);
    this.setState({
      isActive: false,
      selection: e.target.dataset.value
    });
    this.props.onChange && this.props.onChange(this.props.name, e.target.dataset.value);
  }

  renderOptions(){
    let i;
    let active = false;
    let opts = [];
    let width=49.5;
    switch (this.props.selectStyle){
    case SelectStyle.COMPUTE:
      for(i=0; i<this.list.length; i++){
        active =  (this.list[i]==this.state.selection?true:false);
        opts.push(
          <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] }            
            {...tapOrClick(this.selectOption.bind(this))}>
            <img className="option-icon" data-value={this.list[i]}  src={getComputeIconUrl(this.list[i],active)} />
          </li>
        );
      }
      break;      
    case SelectStyle.COMPARE:
      for(i=0; i<this.list.length; i++){
        active =  (this.list[i]==this.state.selection?true:false);
        opts.push(
          <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] }            
            {...tapOrClick(this.selectOption.bind(this))}>
            <img className="option-icon" data-value={this.list[i]}  src={getCompareIconUrl(this.list[i],active)} />
          </li>
        );
      } 
      break;     
    case SelectStyle.TEXT:
      for(i=0; i<this.list.length; i++){
        if (this.list[i] === 'none'){
          opts.push(
              <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] }
                {...tapOrClick(this.selectOption.bind(this))}>{this.list[i]}
              </li>
            );
        } else {
          opts.push(
              <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] }            
                {...tapOrClick(this.selectOption.bind(this))}>
                <span className="text-icon" data-value={this.list[i]} style={{background: 'url("'+ getTextIconUrl(this.list[i]) +'") center center /18px 18px no-repeat'}}></span>
              </li>
            );
        }
      } 
      break;
    case SelectStyle.MATRIX:
      for(i=0; i<this.list.length; i++){
        if (i >= (this.list.length-2)){
          width=99;
        }
        opts.push(
          <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] }
            style={{width: width}} 
            {...tapOrClick(this.selectOption.bind(this))}>{this.list[i]}
          </li>
        );
      } 
      break;
    default:
      for(i=0; i<this.list.length; i++){
        opts.push(
          <li className={this.list[i]==this.state.selection?'active': ''} key={i} data-value={this.list[i] } {...tapOrClick(this.selectOption.bind(this))}>{this.list[i]}</li>
        );
      }
    }
    return opts;
  }
  toggleOptions(){
    if(this.state.isActive==true){
      this.setState({
        isActive: false
      });
    } else {
      this.setState({
        isActive: true
      });
    }
  }

  renderdropDownIcon(){
    let key;
    switch (this.state.isActive) {    
    case true:
      key = './img/icon-drawup.png';
      break;
    case false:
      key = './img/icon-drawdown.png';
    }
    return (<img className="dropDownArrowIcon" src={key} />);
  }

  renderOperator(){
    let operator;
    if (this.props.selectStyle === SelectStyle.TEXT){
      if (this.state.selection === 'none'){
        operator =  (<span className='operator'>{this.state.selection}</span>);
      } else {
        operator = (<span className='operator'>
                               <span className="text-icon" style={{background: 'url("'+ getTextIconUrl(this.state.selection) +'") center center /18px 18px no-repeat'}}></span> 
                            </span>);
      }
    } else if (this.props.selectStyle === SelectStyle.COMPARE){
      operator = (<span className='operator'>
                               <img className="operator-icon" src={getCompareIconUrl(this.state.selection,false)} />
                            </span>);     
    } else if (this.props.selectStyle === SelectStyle.COMPUTE){
      operator = (<span className='operator'>
                               <img className="operator-icon" src={getComputeIconUrl(this.state.selection,false)} />
                            </span>);     
    } else {
      operator =  (<span className='operator'>{this.state.selection}</span>);
    }
    return operator;
  }

  render(){
    return (
      <div className={'select-dialog-'+this.props.selectStyle} {...tapOrClick(this.toggleOptions.bind(this))}>
        {this.renderOperator()}
        <div className='dropDownArrow'>
          {this.renderdropDownIcon()}
        </div>
        <ul className={'select-options '+ (this.state.isActive==true?'':'hide')}>
          {this.renderOptions()}
        </ul>
      </div>
    );
  }
  componentDidMount() {
    let self = this;
    this._register = AppDispatcher.register((action) => {
      if (action.actionType == AppConstants.GLOBAL_CANVAS_TOUCH) {
        self.setState({
          isActive: false
        });
      }
    });
    if(this.props.emitter) {
      this.props.emitter.addListener('listChange', (list)=>{
        self.list = list;
        self.setState({
          reRender: true
        });
      });
    }


  }
  componentWillUnmount() {
    AppDispatcher.unregister(this._register);
  }
}

export { Select };