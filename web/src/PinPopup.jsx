import React, {Component} from 'react';
import Source from "react-mapbox-gl/lib/source";
import {Layer, Popup} from "react-mapbox-gl";
import Icon from "./marker.png";

class PinPopup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{
                position:"absolute",
                maxWidth:"600px",
                width:"90%",
                zIndex:"10",
                backgroundColor:"white",
                opacity:"0.8",
                top: "20%",
                left:"0",
                right:"0",
                margin:"auto"
            }}>
                <h2>{this.props.scream.title}</h2>
                <p>{this.props.scream.description}</p>
                <p>{this.props.scream.amount}</p>
                <a href="https://get.status.im/user/0x044d6956479643d6289144a1df359e1301ebbdc3be33a9df8a8bb5983ddb39f1a04e8f5a13c7fccdd735cb9cdedfb2d7a982291dd5ebe15839855487925137861c"
                    target="_blank"
                >Negotiate</a> <span>Rating: {this.props.scream.rating}</span>
            </div>
        );
    }
}

export default PinPopup;
