import React, {Component} from 'react';
import Source from "react-mapbox-gl/lib/source";
import {Layer, Feature} from "react-mapbox-gl";
import Icon from "./marker.png";
import PinPopup from "./PinPopup";

class MapPin extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     jsonData: props.jsonData,
        // };
    }

    // handleClick = (map, ev) => {
    //     const {lng, lat} = ev.lngLat;
    //     var {points} = this.state;
    //     points = [...points, [lng, lat]];
    //     const zoom = [map.transform.tileZoom + map.transform.zoomFraction];
    //     this.setState({
    //                       points,
    //                       zoom,
    //                       center: map.getCenter()
    //                   });
    // };

    render() {

        const image = new Image(60, 60);
        image.src = Icon;
        const images = ["myImage", image];

        return (
            <React.Fragment>
                    {/*<Source id="source_id" tileJsonSource={this.props.jsonData} />*/}
                    <Layer id="layer_id"
                images={images}
                type="symbol"
                layout={{
                    "icon-image": "myImage",
                        "text-field": "{title}",
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, -3],
                        "text-anchor": "top"
                }}
                // sourceId="source_id"
                    >
                        {this.props.jsonData.data.features.map((feature,i) => <Feature key={i} properties={feature.properties} coordinates={feature.geometry.coordinates}/>)}
                    </Layer>
            </React.Fragment>
        );
    }
}

export default MapPin;
