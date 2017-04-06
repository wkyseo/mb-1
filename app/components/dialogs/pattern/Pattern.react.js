/**
 * Created by junxie on 2016/10/11.
 */
import React, { Component } from 'react';
import tapOrClick from 'react-tap-or-click';
                  //   黑0       红1          橙2        黄3       绿4         青5         蓝6         紫7        白8
const COLOR_LIST = ['#9DB0CE', '#FF0000', '#FFAF00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#D400FF', '#FFFFFF'];
class Pattern extends Component {
  LedSet(){
    /*self.props.pattern is the data passed in*/
    let self = this;
    if(self.props.pattern){
      let data = self.props.pattern;
      let curSelect = self.props.currentSelected; //该选中的元素
      //console.log('curSelect: '+curSelect+' last: '+last);
      let tmp = data.map(function (value, key) {
        if (key <= 7) {
          if (key == curSelect) {
            return (
              <li className={'light lightList selected '+(key==7?' mid right': '')} key={key} data-color={value}
                  style={{backgroundColor: COLOR_LIST[value]}} {...tapOrClick(self.onClick.bind(self))}>
                <span className='selectLed' style={{border: '3px solid '+self.getRGBA(COLOR_LIST[value])}}></span>
              </li>
            );
          } else {
            return (
              <li className={'light lightList '+(key==7?' mid right': '')} key={key} data-color={value}
                  style={{backgroundColor: COLOR_LIST[value]}} {...tapOrClick(self.onClick.bind(self))}>
                <span className='selectLed'></span>
              </li>
            );
          }
        } else {
          if (key == curSelect) {
            return (
              <li className={'light lightList selected '+('right')} key={key} data-color={value}
                  style={{backgroundColor: COLOR_LIST[value]}} {...tapOrClick(self.onClick.bind(self))}>
                <span className='selectLed' style={{border: '3px solid '+self.getRGBA(COLOR_LIST[value])}}></span>
              </li>
            );
          } else {
            return (
              <li className={'light right lightList'} key={key} data-color={value}
                  style={{backgroundColor: COLOR_LIST[value]}} {...tapOrClick(self.onClick.bind(self))}>
                <span className='selectLed'></span>
              </li>
            );
          }
        }
      });

      return tmp;
    }
  }

  // change HEX color to rgba color
  getRGBA(value) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = value.toLowerCase();
    if(sColor && reg.test(sColor)){
      if(sColor.length === 4){
        let sColorNew = '#';
        for(let i=1; i<4; i+=1){
          sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for(let i=1; i<7; i+=2){
        sColorChange.push(parseInt('0x'+sColor.slice(i,i+2)));
      }
      return 'rgba(' + sColorChange.join(',') + ', 0.6)';
    }else{
      return sColor;
    }
  }

  /*set the selected led light*/
  onClick(e){
    let self = this;
    let leds = document.getElementsByClassName('light');
    let selectedColor = e.currentTarget.dataset.color;
    let colorSet = document.getElementsByClassName('colorBlock');
    for(let i=0; i<leds.length; i++){
      leds[i].classList.remove('selected');
    }
    e.currentTarget.classList.add('selected');
    self.isSelected(e);
    for(let i=0; i<colorSet.length; i++){
      colorSet[i].classList.remove('icon-selected');
      if(i == selectedColor){
        colorSet[i].classList.add('icon-selected');
      }
    }
  }
  isSelected(e){
    let leds = document.getElementsByClassName('lightList');
    for(let i=0; i<leds.length; i++){
      leds[i].childNodes[0].style.border = 'none';
    }
    let colorStr = e.currentTarget.style.backgroundColor;
    let colorSet = [];
    for(let i=0; i<colorStr.match(/\d+/g).length; i++){
      colorSet[i] = parseInt(colorStr.match(/\d+/g)[i]);
    }
    let borderStyle = '3px solid rgba('+colorSet[0]+', '+colorSet[1]+', '+colorSet[2]+', '+0.6+')';
    e.currentTarget.childNodes[0].style.border = borderStyle;
  }
  /* add more led light*/
  add(){
    let self = this;
    self.props.addLed();
  }

  render(){
    let self = this;
    let LedSet = self.LedSet();
    let classList = '';
    if(self.props.pattern){
      let length = self.props.pattern.length;

      if(length<7){
        classList = 'light addLed icon-add';
      }
      //if equal to 7, set the 7th light to the mid position by add class 'mid'
      else if(length == 7){
        classList = 'light mid addLed icon-add right';
      } else if(length>7){
        //if length equals to maximum lenght, then hide the add light button by add class 'hide'
        classList = length==15?'light right addLed icon-add hide':'light right addLed icon-add';
      }
    }
    return(
      <ul className='ledList'>
        {LedSet}
        <li className={classList} {...tapOrClick(self.add.bind(self))}></li>
      </ul>);
  }
}

export { Pattern };