/**
 * Created by junxie on 17/3/31.
 */
import { EventEmitter } from 'fbemitter';
import engine from '../core/FlowEngine';
import UIActions from '../actions/UIActions';
class SoundStore extends EventEmitter {
  constructor() {
    super(...arguments);
    this.soundList = '';
    this.updated = false;
  }

  fetchData(id) {
    engine.callMethod(id, 'reportRecordList', (id, list)=>{
      this.soundList = list;
    });
    let conf = {'getRecordList': true};
    UIActions.configNode(id, conf);
  }



  requestSoundList(id, type) {
    engine.callMethod(id, 'reportRecordList', (id, list)=>{
      this.soundList = list;
      UIActions.SoundListLoadFinished(id, list, type);
    });
    let conf = {'getRecordList': true};
    UIActions.configNode(id, conf);

  }

  getDropdownList() {
    return this.soundList;
  }

  deleteSound(id, option) {
    let conf = {'deleteRecord': this.soundList[option]};
    UIActions.configNode(id, conf);
    this.requestSoundList(id, 'show');
  }
}

let _instance = new SoundStore();


export default _instance;