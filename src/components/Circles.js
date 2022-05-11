import React from "react";
import './Circles.css';

function circle(centerX, centerY, radius) {
    return {
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            id: centerX + "," + centerY,
        };

};

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startingSize: props.radius
        };
    }

    render() {
        return (
            <div 
                className="contextMenu"
                style={{
                    left: this.props.x + "px",
                    top: this.props.y + "px",
                }}
                onMouseLeave={() => {
                    this.props.close(this.state.startingSize)}
                }
            >
                <div />
                <div className="contextMenuRow">Adjust diameter</div>
                <div className="contextMenuRow">
                    <input type="range" min="1" max="100" value={this.props.radius} onChange={(e) => this.props.onChange(e.target.value)} />
                </div>
            </div>
        );
    }
}    

class Circles extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            circleMap: new Map(),
            undoStack: [],
            redoStack: [],
            selectedCircle: null,
            showContextMenu: false,
            showAdjustModal: false,
            context: null,
        };

        this.defaultCircleRadius = 10;
        this.defaultCircleColor = "black";
        this.selectedCircleColor = "red";
        this.canvasColor = "antiquewhite";

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        const circleCanvasRow = document.querySelector(".canvasRow");
        const circlesCanvas = document.querySelector(".circlesCanvas");

        circlesCanvas.style.height = circleCanvasRow.clientHeight + "px";
        circlesCanvas.style.width = circleCanvasRow.clientWidth + "px";

        circlesCanvas.height = circleCanvasRow.clientHeight;
        circlesCanvas.width = circleCanvasRow.clientWidth;

        //get the canvas context
        const context = circlesCanvas.getContext("2d");

        this.setState({
            context: circlesCanvas.getContext("2d"),
        });

    }

    componentDidUpdate() {
        this.drawCircles();
    }

    circlesOverlap(circleOne, circleTwo) {
        let distance = Math.sqrt(Math.pow(circleOne.centerX - circleTwo.centerX, 2) + Math.pow(circleOne.centerY - circleTwo.centerY, 2));

        return distance < circleOne.radius + circleTwo.radius;
    }

    undo() {
        const undoStack = this.state.undoStack;

        if (undoStack.length === 0) {
            return;
        }

        let undoItem = undoStack.pop();
        this.state.redoStack.push({
            circle: undoItem.circle,
            prevSize: undoItem.circle.radius
        });

        if(undoItem.prevSize === 0) {
            this.state.circleMap.delete(undoItem.circle.id);
            if (this.state.selectedCircle && this.state.selectedCircle.id == undoItem.circle.id) {
                this.setState({
                    selectedCircle: null,
                    showContextMenu: false,
                }); 
            }
        } else {
            this.state.circleMap.get(undoItem.circle.id).radius = undoItem.prevSize;
        }

        this.setState({
            circleMap: this.state.circleMap,
            undoStack: undoStack,
            redoStack: this.state.redoStack,
        });
    }

    redo() {
        const redoStack = this.state.redoStack;

        if (redoStack.length === 0) {
            return;
        }

        let redoItem = redoStack.pop();

        if(this.state.circleMap.has(redoItem.circle.id)) {
            let circle = this.state.circleMap.get(redoItem.circle.id);
            let undoItem = {
                circle: redoItem.circle,
                prevSize: circle.radius
            };
            circle.radius = redoItem.prevSize;
            this.state.undoStack.push(undoItem);
        } else {
            this.state.circleMap.set(redoItem.circle.id, redoItem.circle);
            this.state.undoStack.push({
                circle: redoItem.circle,
                prevSize: 0
            });
        }

        this.setState({
            redoStack: redoStack,
            circleMap: this.state.circleMap,
            undoStack: this.state.undoStack,
        });
    }

    drawCircle(circle, context, color, borderColor) {
        context.beginPath();
        context.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
        context.strokeStyle = borderColor || this.defaultCircleColor;
        context.fillStyle = color || this.defaultCircleColor;
        context.fill();
        context.closePath();

    }

    handleCanvasClick(event) {
        const canvas = event.target;
        const context = canvas.getContext("2d");
        const canvasRect = canvas.getBoundingClientRect();

        let mouseX = event.clientX - canvasRect.left - canvas.clientLeft;
        let mouseY = event.clientY - canvasRect.top - canvas.clientTop;

        //determine if the click was on a circle
        let selectedCircle = null;
        for(let circle of this.state.circleMap.values()) {
            let distance = Math.sqrt(Math.pow(circle.centerX - mouseX, 2) + Math.pow(circle.centerY - mouseY, 2));
            if(distance < circle.radius) {
                selectedCircle = circle;
                break;
            }
        }

        if (selectedCircle) {
            this.setState({
                selectedCircle: selectedCircle,
            });

            return;
        }
        
        let newCircle = circle(mouseX, mouseY, this.defaultCircleRadius, context);

        let undoItem = {
            circle: newCircle,
            prevSize: 0
        };

        this.state.circleMap.set(newCircle.id, newCircle);
        this.state.undoStack.push(undoItem);

        this.setState({
            circleMap: this.state.circleMap,
            undoStack: this.state.undoStack,
            selectedCircle: newCircle,
            redoStack: [],
        });

    }

    handleMouseMove(event) {
        const canvas = event.target;
        const context = canvas.getContext("2d");
        const canvasRect = canvas.getBoundingClientRect();

        //get mouse x and y
        let mouseX = event.clientX - canvasRect.left - canvas.clientLeft;
        let mouseY = event.clientY - canvasRect.top - canvas.clientTop;

        //determine if the mouse is over a circle
        let selectedCircle = null;
        for(let circle of this.state.circleMap.values()) {
            let distance = Math.sqrt(Math.pow(circle.centerX - mouseX, 2) + Math.pow(circle.centerY - mouseY, 2));
            if(distance < circle.radius) {
                selectedCircle = circle;
                break;
            }
        }

        if (selectedCircle) {
            this.setState({
                selectedCircle: selectedCircle,
            });
        } else if (this.state.selectedCircle) {
            this.setState({
                selectedCircle: null,
                showContextMenu: false,
            });
        }
    }

    drawCircles() {
        if(!this.state.context) {
            return;
        }
        const context = this.state.context;

        //blank the canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for(let [key, circle] of this.state.circleMap) {
            this.drawCircle(circle, context);
        }

        if (this.state.selectedCircle) {
            this.drawCircle(this.state.selectedCircle, context, this.selectedCircleColor);
        }
    }

    render() {
        return (
            <div className="circles">
                {this.state.selectedCircle && this.state.showContextMenu && <ContextMenu 
                    onChange={(newRadius) => {
                        this.state.selectedCircle.radius = newRadius;
                        this.setState({
                            circleMap: this.state.circleMap,
                            selectedCircle: this.state.selectedCircle,
                        });
                    }}
                    close={(startingSize) => {
                        this.state.undoStack.push({
                            circle: this.state.selectedCircle,
                            prevSize: startingSize
                        });

                        this.setState({
                            undoStack: this.state.undoStack,
                            redoStack: [],
                        });
                    }}
                    x={this.state.contextMenuX}
                    y={this.state.contextMenuY}
                    radius={this.state.selectedCircle.radius}
                />}
                <div className="circlesHeader">
                    Circles
                </div>
                <div className="circlesBody">
                    <div />
                    <div className="circlesBodyRow">
                        <button 
                            className="circlesButton"
                            disabled={this.state.undoStack.length === 0}
                            onClick={() => this.undo()}
                        >Undo</button>
                        <button 
                            className="circlesButton"
                            disabled={this.state.redoStack.length === 0}
                            onClick={() => this.redo()}
                        >Redo</button>
                    </div>
                    <div className="circlesBodyRow canvasRow">
                        <canvas 
                            className="circlesCanvas"
                            height="250px"
                            width="600px"
                            style={{
                                height: "250px",
                                width: "600px",
                            }}
                            onClick={this.handleCanvasClick}
                            onMouseMove={this.handleMouseMove}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                this.setState({
                                    showContextMenu: true,
                                    contextMenuX: event.pageX,
                                    contextMenuY: event.pageY,

                                })
                            }}
                        />
                    </div>
                    <div />
                </div>
            </div>
        );
    }
}

export default Circles;