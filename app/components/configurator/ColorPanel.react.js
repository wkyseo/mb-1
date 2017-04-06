import React, { Component } from 'react';
import tapOrClick from 'react-tap-or-click';

class ColorPanel extends Component {
  constructor() {
    super(...arguments);
    this.colorArray = ['#d50022', '#f8a443', '#f8e653', '#77d24b', '#3ce3c4', '#35619d', '#9325f3', '#FFFFFF'];
    this.state = {
      selected: this.props.selected
    };   
  }

  initState(key){
    // key=0 : white 
    let realKey = (key+1)==8?0:(key+1);
    return ( Number(this.state.selected)===realKey)?'':'hide';
  }

  onSelect(e){
    this.props.onChange && this.props.onChange(this.props.name, e.currentTarget.dataset.value);
    let selectList = e.currentTarget.closest('.color-list').querySelectorAll('.selectedColor');
    for(let i=0; i<selectList.length; i++){
      if(selectList[i].classList.contains('hide') == false){
        selectList[i].classList.add('hide');
      }
    }
    e.currentTarget.querySelector('.selectedColor').classList.remove('hide'); 
  }

  colorList() {
    let colorBoard = '';
    colorBoard = this.colorArray.map((value, key) => {
      return (
        <li key={key} className='color-card' data-value={(key+1)==8?0:(key+1)} style={{backgroundColor: value}} {...tapOrClick(this.onSelect.bind(this))}>
          <div className={'selectedColor '+this.initState(key)}></div>
        </li>
      );
    });
    return colorBoard;
  }

  render() {
    return (
      <ul className='color-list'>
        {this.colorList()}
      </ul>
    );
  }
}

class DialogColorList extends Component {
  constructor(){
    super(...arguments);
    //   黑0       红1          橙2        黄3       绿4         青5         蓝6         紫7        白8
    this.COLOR_LIST = ['#9DB0CE', '#FF0000', '#FFAF00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#D400FF', '#FFFFFF'];

  }
  /*set selected color*/
  selected(e){
    let leds = document.getElementsByClassName('lightList');
    let cur = document.querySelector('.lightList.selected');
    let num = '';
    for(let i=0; i<leds.length; i++){
      if(leds[i] == cur){
        num = i;
      }
    }
    let colorList = document.getElementsByClassName('colorBlock');
    let counter;
    let tmp={id: '', color: ''};
    for(counter=0; counter<colorList.length; counter++){
      if(colorList[counter].classList.contains('icon-selected')){
        colorList[counter].classList.remove('icon-selected');
      }
    }
    e.target.classList.add('icon-selected');
    tmp.id=e.target.getAttribute('data-color');
    tmp.color = this.COLOR_LIST[tmp.id];
    tmp.relate = num;
    this.props.onSelect(tmp);

  }
  /*render light color*/
  color(){
    let self = this;
    let current_color = this.props.color; //current selected color
    let colorBlock = this.COLOR_LIST.map(function(value, index){
      //black colo set right most, others left to right, if selected, classList add selected
      return (
        <li className={'colorBlock'+(index==0?' right icon-eraser': '')+( index==current_color?' icon-selected': '')}  key={value} data-color={index} {...tapOrClick(self.selected.bind(self))}
            style={{backgroundColor:value}}>
        </li>
      );
    });
    return colorBlock;
  }
  render(){
    let colorSet = this.color();
    return (
      <div className='dialog-color-list'><ul>{colorSet}</ul></div>
    );
  }
}

export { ColorPanel, DialogColorList };