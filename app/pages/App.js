import React, { Component }  from 'react';
import { Editer } from '../components/editer/Editer.react';
import { LinkDialog } from '../components/dialogs/LinkDialog.react';
import { WifiDialog } from '../components/dialogs/WifiDialog.react';
import { DisconnDialog } from '../components/dialogs/DisconnDialog.react';
import { ImageDialog } from '../components/dialogs/ImageDialog.react';
import { PatternDialog } from '../components/dialogs/pattern/PatternDialog.react';
import { NumberInputDialog } from '../components/dialogs/NumberInputDialog.react';

require('main.less');

class App extends Component {

  render() {
    return (
      <div>
        <Editer projectId={this.props.params.id}/>
        <LinkDialog />
        <WifiDialog />
        <DisconnDialog />
        <ImageDialog />
        <PatternDialog />
        <NumberInputDialog />
      </div>);}
}

export { App };


