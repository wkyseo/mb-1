/**
 * Created by junxie on 2017/3/7.
 */
import EventEmitter from 'wolfy87-eventemitter';
import RestfulApiImpl from '../utils/RestfulApiImpl';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import engine, {engineGetUUID} from '../core/FlowEngine';
import ProjectStore from './projectStore';
class cloudAppStore extends EventEmitter {
  constructor() {
    super(...arguments);
    this.projectName = '';
    this.projectId = '';
    this.projectURL = {};
    this.cloudId = '';
    let self = this;
    AppDispatcher.register((action)=>{
      if (action.actionType == AppConstants.SHARE_CLOUD_PROJECT) {
        let jsonData = JSON.stringify(engine.getActiveCloudNodes());
        let postData = {device_id: engineGetUUID(), local_id: ProjectStore.getCurrentProjectId(), project_name: ProjectStore.getCurrentProjectName(), project_data: jsonData};
        self.postCloudAppData(postData, ProjectStore.getCurrentCloudId());
      } else if(action.actionType == AppConstants.UPDATE_CLOUD_PROJECT) {
        self.updateCloudProject();
      }
    });
  }

  updateCloudProject() {
    if(ProjectStore.getCurrentCloudId() != undefined || this.cloudId !='') {
      if(ProjectStore.getCurrentCloudId() != undefined) {
        this.cloudId = ProjectStore.getCurrentCloudId()[0];
      }
      let jsonData = JSON.stringify(engine.getActiveCloudNodes());
      let postData = {device_id: engineGetUUID(), local_id: ProjectStore.getCurrentProjectId(), project_name: ProjectStore.getCurrentProjectName(), project_data: jsonData};
      this.postCloudAppData(postData, self.cloudId);
    }
  }

  getCurrentCloudId() {
    return this.cloudId;
  }

  clearCloudId() {
    this.cloudId = '';
  }

  fetchSuccess(id) {
    if(id !='defaultCloudID') {
      this.cloudId = id;
    }
    this.trigger('fetchSuccess', [{status: 'success', url: this.projectURL, id: id}]);
  }

  fetchError() {
    this.trigger('fetchFail', [{status: 'fail', url: ''}]);
  }

  retrieveSuccess() {
    this.cloudId = '';
    this.trigger('retrieveSuccess');
  }
  retrieveFailed() {
    this.trigger('retrieveFail');
  }

  postCloudAppData(data, cloudId) {
    let setUrl;
    if(cloudId==undefined) {
      setUrl = 'http://iot.makeblock.com/http/cloudapps';
    } else {
      setUrl = 'http://iot.makeblock.com/http/cloudapps/'+cloudId;
    }
    let self = this;
    let callback = function(status, responseText) {
      if(status == 200) {
        let data = JSON.parse(responseText);
        self.projectURL = 'http://iot.makeblock.com/http/cloudapp/?id='+data.cloudID;
        self.fetchSuccess(data.cloudID);
      } else {
        self.fetchError();
      }
    };
    RestfulApiImpl.doPost(setUrl, JSON.stringify(data), callback, 5000);
  }

  retriveCloudAppData(cloudId) {
    let setUrl = 'http://iot.makeblock.com/http/cloudapps/'+cloudId;
    let self = this;
    let callback = function(status, responseText) {
      if(status == 200) {
        let data = JSON.parse(responseText);
        self.projectURL = 'http://iot.makeblock.com/http/cloudapp/?id='+data.cloudID;
        self.retrieveSuccess();
      } else {
        self.retrieveFailed();
      }
    };
    RestfulApiImpl.doDelete(setUrl, callback, 5000);
  }

  deleteProjects(cloudList) {
    let setUrl = 'http://iot.makeblock.com/http/cloudapps/delete';
    let postData = {device_id: engineGetUUID(), localIDs: cloudList};
    let callback = function(status) {
      if(status == 200) {
        //remote delete published cloud apps do not respond
        console.log('remote delete success!!');
      } else {
        console.log('remote delete fail');
      }
    };
    RestfulApiImpl.doPost(setUrl, JSON.stringify(postData), callback, 5000);
  }
}

export default new cloudAppStore();