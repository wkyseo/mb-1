/**
 * Created by razr on 2016/10/11.
 */
import React, { Component } from 'react';
import tapOrClick from 'react-tap-or-click';

class SelectMode extends Component {
  constructor() {
    super();
    this.state = {
      result: '',
      dataValue: '',
    };
  }

  // options: [{name: '', value:''}, ...]
  renderOptions() {
    let select = this.props.selected;
    let options = this.props.options || [];
    let opts = [];
    for( let i=0; i<options.length; i++ ) {
      opts.push(
        <li key={i} className={options[i].value==select?'icon-ok-2 selected-option':''} data-value={options[i].value} {...tapOrClick(this.selectOption.bind(this))}>{options[i].name}</li>
      );
    }
    return opts;
  }

  findOptionName(value) {
    let options = this.props.options || [];
    let result = '';
    for ( let i=0; i<options.length; i++ ) {
      if(options[i].value == value) {
        result = options[i].name;
      }
    }
    return result;
  }

  toggleOptions() {
  }

  selectOption(e) {
    let value = e.target.dataset.value;
    let name = this.findOptionName(value);
    this.props.onChange && this.props.onChange(value);
    if(document.querySelector('.selected-option')){
      document.querySelector('.selected-option').classList.remove('selected-option');
      document.querySelector('.icon-ok-2').classList.remove('icon-ok-2');
    }
    e.currentTarget.classList.add('selected-option');
    e.currentTarget.classList.add('icon-ok-2');
    this.setState({
      result: name,
    });
  }

  render() {
    return (
      <div className={'mode-dialog-select'} {...tapOrClick(this.toggleOptions.bind(this))}>
        <ul className="mode-dialog-select-options">
          {this.renderOptions()}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      result: this.props.default,
    });

  }
}

export { SelectMode };