/**
 * Created by junxie on 2016/10/10.
 */
import React, { Component } from 'react';
import AppDispatcher from '../../../dispatcher/AppDispatcher';
import AppConstants from '../../../constants/AppConstants';
import Modal from 'react-modal';
import tapOrClick from 'react-tap-or-click';
import { Pattern } from './Pattern.react';
import { SelectMode } from './SelectMode.react';
import { DialogColorList } from '../../configurator/ColorPanel.react';
import languages from '../../../languages';

require('./PatternDialog.less');

const DEFAULT_COLOR = 1;

/*打开多功能对话框*/
class PatternDialog extends Component {
  constructor(){
    super(...arguments);
    this.state={
      modalIsOpen: false,
      title: '',
      selectedColor: '', //top color select index
      onConfirm: null,  //current selected color range from [0~8], 0 stands for #000000
      forwards: new Array(),
      currentSelected: '',
      mode: ''
    };
    this.mainStream = {mainSeq: [], selection: []};
    this.count = -1;
    this.redoList = {mainSeq: [], selection: []};
    this.newOption = false;
  }
  closeModal() {
    this.setState({modalIsOpen: false, });
  }
  
  //in LedSetting get the current Led list
  getCurrentLedList(){
    let leds = document.getElementsByClassName('light');
    let list = [];
    for(let i=0; i<leds.length; i++){
      if(leds[i].getAttribute('data-color')){
        list[i] = parseInt(leds[i].getAttribute('data-color'));
      }
    }
    return list;
  }
  getCurrentSelection(){
    let leds = document.getElementsByClassName('lightList');
    let selection = document.querySelector('.lightList.selected');
    let index = '';
    for(let i=0; i<leds.length; i++){
      if(leds[i]==selection){
        index = i;
      }
    }
    return index;
  }

  // set ledSetting configuration
  setConf(){
    let obj = {};
    obj.mode = document.querySelector('.icon-ok-2').dataset.value;
    obj.colors = this.getCurrentLedList();
    return obj;
  }
  onClose(){
    this.closeModal();
  }

  onSelect(color){
    //get selected color
    console.log('id: '+color.id+' color: '+color.color+' relate: '+color.relate);
    let self = this;
    self.count++;
    self.newOption = true;
    if(self.mainStream.mainSeq.length >= 5){
      self.updateMainList();
      let newArr = self.state.forwards.concat();
      newArr[color.relate] = color.id;
      self.setState({
        forwards: newArr,
        currentSelected: color.relate,
      });
    } else {
      self.mainStream.mainSeq[self.count] = self.getCurrentLedList();
      self.mainStream.selection[self.count] = self.getCurrentSelection();
      let newArr = self.state.forwards.concat();
      newArr[color.relate] = color.id;
      self.setState({
        forwards: newArr,
        currentSelected: color.relate,
      });
    }

  }

  //add button option
  addLedBtn(){
    let self = this;
    self.count++;
    if(document.querySelector('.colorBlock.icon-selected')!=null){
      document.querySelector('.colorBlock.icon-selected').classList.remove('icon-selected');
    }

    document.getElementsByClassName('colorBlock')[1].classList.add('icon-selected');
    self.newOption = true;
    if(self.mainStream.mainSeq.length == 5){
      self.updateMainList();
      self.latestPattern('add');
    }
    else {
      self.mainStream.mainSeq[self.count] = self.getCurrentLedList();
      self.mainStream.selection[self.count] = self.getCurrentSelection();
      self.latestPattern('add');
    }
  }

  //remove button option
  delBLedBtn(){
    let self = this;
    if(document.querySelector('.colorBlock.icon-selected') == null){
      return;
    }
    document.querySelector('.colorBlock.icon-selected').classList.remove('icon-selected');
    self.count++;
    setTimeout(function(){
      if(document.querySelector('.lightList.selected') == null){
        return;
      }
      let count = parseInt(document.querySelector('.lightList.selected').dataset.color);
      document.getElementsByClassName('colorBlock')[count].classList.add('icon-selected');
    }, 1);
    self.newOption = true;
    if(self.mainStream.mainSeq.length == 5){
      self.updateMainList();
      self.latestPattern('del');
    }
    else {
      self.mainStream.mainSeq[self.count] = self.getCurrentLedList();
      self.mainStream.selection[self.count] = self.getCurrentSelection();
      self.latestPattern('del');
    }
  }

  updateMainList(){
    let self = this;
    self.mainStream.mainSeq.shift();
    self.mainStream.selection.shift();
    self.mainStream.selection.push(self.getCurrentSelection());
    self.mainStream.mainSeq.push(self.getCurrentLedList());
  }
  undo(){
    let self = this;
    self.newOption = false;
    if(self.mainStream.mainSeq.length==0){
      return;
    }
    let newArr = self.mainStream.mainSeq.pop();
    let count = self.mainStream.selection.pop();
    setTimeout(function(){
      if(document.querySelector('.lightList.selected')!=null)
      {
        let num = parseInt(document.querySelector('.lightList.selected').dataset.color);
        document.querySelector('.colorBlock.icon-selected').classList.remove('icon-selected');
        document.getElementsByClassName('colorBlock')[num].classList.add('icon-selected');
      }
    }, 100);

    if(newArr==undefined){
      return;
    }
    self.redoList.mainSeq.push(self.getCurrentLedList());
    self.redoList.selection.push(self.getCurrentSelection());
    self.setState({
      forwards: newArr,
      currentSelected: count,
    });
  }
  redo(){
    let self = this;
    let newArr = self.redoList.mainSeq.pop();
    let count = self.redoList.selection.pop();
    if(newArr == undefined || self.newOption == true){
      return;
    }
    if(self.mainStream.mainSeq.length == 5){
      return;
    }
    setTimeout(function(){
      if(document.querySelector('.lightList.selected')!=null){
        let num = parseInt(document.querySelector('.lightList.selected').dataset.color);
        document.querySelector('.colorBlock.icon-selected').classList.remove('icon-selected');
        document.getElementsByClassName('colorBlock')[num].classList.add('icon-selected');
      }
    }, 100);
    self.mainStream.mainSeq.push(self.getCurrentLedList());
    self.mainStream.selection.push(self.getCurrentSelection());
    self.setState({
      forwards: newArr,
      currentSelected: count,
    });
  }
  //to update LED list view
  latestPattern(value){
    let self = this;
    if(value!=undefined){
      if(value=='add'){
        self.setState({
          forwards: self.addLedFunc().addArr,
          currentSelected: self.addLedFunc().count,
        });
      } else if(value=='del') {
        self.setState({
          forwards: self.delLedFunc().delArr,
          currentSelected: self.delLedFunc().count,
        });
      }
    }
    return (
      <Pattern pattern={self.state.forwards}
               currentSelected={self.state.currentSelected}
               addLed={self.addLedBtn.bind(this)}/>
    );
  }

  //return new LED list after add
  addLedFunc(){
    let self = this;
    let newArr = self.state.forwards.concat();
    newArr.push(1);
    let addOption = {addArr: newArr, count: newArr.length-1};
    return addOption;
  }

  //return new LED list after delete
  delLedFunc(){
    let self = this;
    let newArr = self.state.forwards.concat();
    let getDeleteItem = document.querySelectorAll('.selectLed');
    let ledList = document.getElementsByClassName('lightList');
    let count = 0;//表示删除第几个，index
    let tmpArr = [];
    let delItem = '';
    for(let i=0; i<getDeleteItem.length; i++){
      if(getDeleteItem[i].style.border!='' && getDeleteItem[i].style.border!='none'){
        delItem = getDeleteItem[i].parentNode;
      }
    }
    for(let i=0; i<ledList.length; i++){
      if(ledList[i] == delItem){
        count = i;
      }
    }
    for(let i=0; i<newArr.length; i++){
      if(i!=count){
        tmpArr.push(newArr[i]);
      }
    }
    if(count == tmpArr.length){ // if the delete item is the last item, set next selected item as last one
      count = count-1;
    }
    let delOption = {delArr: tmpArr, count:count};
    return delOption;
  }

  // close window and change state
  onConfirm() {
    let self = this;
    self.setState({
      mode: document.querySelector('.icon-ok-2').dataset.value
    });
    let pattern = this.setConf();
    this.state.onConfirm && this.state.onConfirm(pattern);
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  renderActions() {
    return (
      <div className="pattern-dialog-actions">
        <span className={'pattern-dialog-undo '} {...tapOrClick(this.undo.bind(this))}>
          <i className="icon-undo"></i>
        </span>
        <span className={'pattern-dialog-redo '} {...tapOrClick(this.redo.bind(this))}>
          <i className="icon-redo"></i>
        </span>
        <span className={'pattern-dialog-delete '} {...tapOrClick(this.delBLedBtn.bind(this))}>
          <i className="icon-delete-2"></i>
        </span>
      </div>
    );
  }

  render(){
    let self = this;
    return (
      <Modal
        isOpen={self.state.modalIsOpen}
        className={'pattern-dialog'}
        contentLabel='PatternDialogModal'
        overlayClassName='dialog-overlay'>
        <div className='dialog-container' ref='container'>
         <div className='title'>
          {self.state.title}
         </div>
         <div className={'pattern-dialog-body ' + (this.state.showExamples?'spring': '')}>  
          <DialogColorList color={DEFAULT_COLOR} onSelect={self.onSelect.bind(self)}/>     
           <div className='ledSet' >
            {self.latestPattern()}
           </div>
           {this.renderActions()}
           <SelectMode
                  options={[{name: languages.getTranslation('dialog-pattern-mode-static'), value: 'static'},
                          {name: languages.getTranslation('dialog-pattern-mode-roll'), value: 'roll'},
                          {name: languages.getTranslation('dialog-pattern-mode-repeat'), value: 'repeat'},
                          {name: languages.getTranslation('dialog-pattern-mode-marquee'), value: 'marquee'}]}
                          selected={self.state.mode}/>   
             <div className="color-dialog-footer">
              <span className="color-dialog-btn color-dialog-confirm" {...tapOrClick(self.onConfirm.bind(self))}>{languages.getTranslation('dialog-action-confirm')}</span>
              <span className="color-dialog-btn color-dialog-cancel" {...tapOrClick(self.onCancel.bind(self))}>{languages.getTranslation('dialog-action-cancel')}</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  componentDidMount() {
    let self = this;
    self._registerToken = AppDispatcher.register((action) => {
      if (action.actionType == AppConstants.PATTERN_SETTING_DIALOG) {       
        console.log('opening color setting dialog');
        self.setState({
          modalIsOpen: true,
          title: action.titleName,
          onConfirm: action.onConfirm,
          forwards: action.defaultConf.pattern.colors,
          currentSelected: action.defaultConf.pattern.colors.length-1,
          selectedColor: action.defaultConf.pattern.colors[action.defaultConf.pattern.colors.length-1],
          mode: action.defaultConf.pattern.mode,
          id: action.id
        });
        self.count = -1;
        self.mainStream.mainSeq = [];
      }
    });
  }
  componentDidUpdate() {
    let self = this;
    if (!self.state.modalIsOpen) {
      return;
    }
    // fix ios touch scroll
    setTimeout(()=> {
      self.refs.container.addEventListener('touchmove', (e) => {
        e.preventDefault();
      });
    }, 1);
  }

  componentWillUnmount() {
    let self = this;
    AppDispatcher.unregister(self._registerToken);
  }   
}

export { PatternDialog };
