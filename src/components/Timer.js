import React from "react";
import './Timer.css';
import Progress from './Progress';

 class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsed: 0,
            running: false,
            duration: 1200,
            update: null,
            started: null,
        };

        this.startTimer = this.startTimer.bind(this);
        this.run = this.run.bind(this);
    }

    componentDidMount() {
        clearInterval(this.state.update);
        let updateInterval = setInterval(this.run, 100);
        this.setState({
            update: updateInterval
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.update);
    }

    startTimer() {
        this.setState({
            running: true,
            started: Date.now() - (this.state.elapsed * 100)
        }, this.run);
    }

    run() {
        if (!this.state.running) {
            return;
        }

        let diff = (Date.now() - this.state.started) / 100;
        this.setState({
            elapsed: diff,
            running: diff <= this.state.duration
        });
    }

    stop() {
        this.setState({
            running: false
        });
    }

    render() {
        return (
            <div className="timer">
                <div className="timerHeader">Timer</div>
                <div className="timerBody">
                    <div />
                    <div className="timerBodyRow">
                        <div className="timerElapsedLabel">Elapsed time</div>
                        <Progress progress={this.state.elapsed / this.state.duration} />
                        
                    </div>
                    <div className="timerBodyRow">
                        <div className="timerCurrentElapsed">
                            {Math.min(Math.round(this.state.elapsed) / 10, this.state.duration / 10)}
                        </div>
                    </div>
                    <div className="timerBodyRow">
                        <div className="timerDurationLabel">Duration</div>
                        <div className="timerDurationSlider">
                            <input 
                                type="range" 
                                min="1" 
                                max="600" 
                                value={this.state.duration / 10}
                                onChange={(e) => {
                                    this.setState({
                                        duration: e.target.value * 10
                                    }, () => {
                                        if(this.state.elapsed < this.state.duration) {
                                            this.startTimer();
                                        }
                                    });
                                }}
                                className="timerDurationSlider" 
                            />
                        </div>
                    </div>
                    <div className="timerBodyRow">
                        <button className="timerResetButton"
                            onClick={() => {
                                    if (this.state.elapsed > this.state.duration) {
                                        this.setState({
                                            elapsed: 0,
                                            running: false
                                        });
                                    }
                                    else if (this.state.running) {
                                        this.stop();
                                    }
                                    else {
                                        this.startTimer();
                                    }
                                }
                            }
                        >
                            {this.state.elapsed > this.state.duration ? "Reset" : this.state.running ? "Stop" : "Start"}
                        </button>
                    </div>
                    <div />
                </div>
            </div>
        );
    }

}

export default Timer;