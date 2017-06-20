import React from 'react';

import './ColorMenu.css';
import { colorPickerVisible } from './AppActions';
import { setActiveColor } from './AppActions';
import SelectableColor from './SelectableColor';
import { getColor } from './App';

class ColorMenu extends React.Component {
  constructor(props) {
    // TODO: Give available colors as props
    super(props);
    this.onColorSelected = this.onColorSelected.bind(this);
    this.onOpenPicker = this.onOpenPicker.bind(this);
  }

  onColorSelected(color) {
    console.log("color selected: " + color);
    setActiveColor(color);
  }

  onOpenPicker(e) {
    colorPickerVisible(true);
  }

  //TODO: Dynamic progress bar
  render() {
    var colors = [];
    for (var i = 0; i < this.props.colors.length; ++i) {
      colors.push(<SelectableColor colorID={this.props.colors[i].ID} rgb={getColor(this.props.colors[i].ID)} key={i}
              group="colorSelect" onSelectionChanged={this.onColorSelected}
              checked={parseInt(this.props.activeColor, 10) === parseInt(this.props.colors[i].ID, 10)}/>)
    }

    var progressBarLength = (this.props.expCollected / this.props.expToNext) * 100 + "%";

    return (
      <div className="colorMenu">
        <style>
        @import url('https://fonts.googleapis.com/css?family=Open+Sans');
        </style>
        <div className="offset">

          <p>Your Colors</p>
          {colors}

          <div className="progressContainer">
            <p className="progressInfo">To next level: {this.props.expCollected}/{this.props.expToNext}</p>
            <div className="progressBar" style={{width:progressBarLength}} />
          </div>

          <button type="button" onClick={this.onOpenPicker}
            className="getColorsBtn">Get more!</button> <br/>

        </div>
      </div>
    )
  }
}

export default ColorMenu;
