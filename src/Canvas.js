import React from 'react';
import './Canvas.css';
import { setPixel, setDrawCanvas } from './AppActions';
import { sendTile, getColor } from './App';

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        x: 0.0,
        y: 0.0,
        lastX: 0.0,
        lastY: 0.0,
        mouseIsDown: false,
        dragging: false,
        canvasX: 0.0,
        canvasY: 0.0,
        scale: 1.0
    }

    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    var mouseX = parseInt(e.clientX, 10) - this.state.canvasX;
    var mouseY = parseInt(e.clientY, 10) - this.state.canvasY;

    var pixelX = Math.floor(mouseX/this.props.pixelSize);
    mouseX = pixelX * this.props.pixelSize;
    var pixelY = Math.floor(mouseY/this.props.pixelSize);
    mouseY = pixelY * this.props.pixelSize;

    console.log("Clicked at " + mouseX + ", " + mouseY)

    sendTile(pixelX, pixelY, this.props.activeColor);
  }

  componentDidUpdate() {
    if(this.props.canvasDraw) {
      console.log("Drawing canvas!");

      // OLD DRAW WITH X AND Y VALUES
      for (var i = 1; i < this.props.canvas.length; i++) {
        this.c.fillStyle=getColor(this.props.canvas[i].colorID);
        var pixelX = this.props.canvas[i].X * this.props.pixelSize;
        var pixelY = this.props.canvas[i].Y * this.props.pixelSize;
        this.c.fillRect(pixelX, pixelY, this.props.pixelSize, this.props.pixelSize);
      }
      setDrawCanvas(false);

      // TODO: NOT OPTIMAL! RUSHED SOLUTION
/*
      var counter = 0;
      for (var y = 0; y < this.props.rows; y++) {
        for(var x = 0; x < this.props.columns; x++) {
          this.c.fillStyle=getColor(this.props.canvas[counter].colorID);
          var pixelX = x * this.props.pixelSize;
          var pixelY = y * this.props.pixelSize;
          this.c.fillRect(pixelX, pixelY, this.props.pixelSize, this.props.pixelSize);
          counter++;
        }
      }*/
    }

   if(this.props.updatePixel != null) {
     const pixel = this.props.updatePixel;
     console.log("Canvas received pixel color: " + pixel[0].colorID)
     this.c.fillStyle=getColor(pixel[0].colorID)
     this.c.fillRect(pixel[0].X * this.props.pixelSize, pixel[0].Y * this.props.pixelSize,
       this.props.pixelSize, this.props.pixelSize);
     // Sets update pixel back to none
     setPixel(null)
    }
  }

  onMouseDown(e) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    this.setState({
      lastX: e.screenX,
      lastY: e.screenY,
      mouseIsDown: true
    });
  }

  clearCanvas() {
    this.c.save();
    this.c.setTransform(1,0,0,1,0,0);
    this.c.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.c.restore();
  }

  onMouseMove(e) {
    if (this.state.mouseIsDown) {
      var moveX = this.state.lastX - e.screenX;
      var moveY = this.state.lastY - e.screenY;
      if (moveX !== 0 || moveY !== 0) {
        this.clearCanvas();

        this.c.translate(-moveX, -moveY);

        setDrawCanvas(true);

        this.setState({
          canvasX: this.state.canvasX - moveX,
          canvasY: this.state.canvasY - moveY,
          dragging: true,
          lastX: e.screenX,
          lastY: e.screenY
        });
      }
    }
  }

  onMouseUp(e) {
    if (!this.state.dragging) {
      this.onClick(e);
    }

    this.setState({
      mouseIsDown: false,
      dragging: false
    });
  }

  onMouseWheel(e) {
    var delta = -e.deltaY / 20;

    if ((delta > 0 && this.state.scale > 2.0) || (delta < 0 && this.state.scale < 0.5)) return;

    var factor = Math.pow(1.1, delta);

    var transX = (this.canvas.width / 2 - this.state.canvasX) * this.state.zoom;
    var transY = (this.canvas.height / 2 - this.state.canvasY) * this.state.zoom;
    this.c.translate(transX, transY);
    this.c.scale(factor,factor);
    this.c.translate(-transX, -transY);

    this.clearCanvas();

    setDrawCanvas(true);
    this.forceUpdate();

    this.setState({
      scale: this.state.scale * factor
    })
  }

  render() {
    return (
      <canvas id="canvas" ref={(c) => {
                if(c != null) {
                  this.c = c.getContext('2d');
                  this.canvas = c;
                }}
              }
              width={window.innerWidth} height={window.innerHeight}
              onMouseMove={this.onMouseMove} onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp} onWheel={this.onMouseWheel} />
    )
  }
}

export default Canvas;
