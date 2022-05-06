import React from "react";
import 'Timer.css';

 class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsed: 0,
            running: false,
            duration: 120,
        };
    }

}