import React, {Component} from 'react';
import ReactMapboxGl, {ScaleControl, ZoomControl} from "react-mapbox-gl";
import './App.css';
import {ScreamBar} from "./ScreamBar";
import MapPin from "./MapPin";
import PinPopup from "./PinPopup";
import PinMarker from "./PinMarker";


const Map = ReactMapboxGl(
    {
        accessToken: "pk.eyJ1Ijoicm9tYWthdHNhIiwiYSI6ImNqbnJqd3FkZjA2Mmczb2xrMHliZmgxeTIifQ.AwLH4y3Et0uW2IeOgIAJDA"
    }
);

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showScreamInputForm: false,
            newScream: true,
            showPopup: false,
            scream: {
                title: "",
                description: "",
                amount: ""
            },
            zoom: [17],
            center: [-87.63097788775872, 41.767174164037044]
        };
        this.updateShowScreamInputForm = this.updateShowScreamInputForm.bind(this);
        this._onClickMap = this._onClickMap.bind(this);
    }

    updateShowScreamInputForm(newShow) {
        this.setState({showScreamInputForm: newShow});
    }

    _onMouseMoveMap(map, e) {
        let features = map.queryRenderedFeatures(e.point, {layers: ['layer_id']});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    }

    _onClickMap(map, e) {

        this.updateShowScreamInputForm(false);

        let features = map.queryRenderedFeatures(e.point, {layers: ['layer_id']});
        if (!features.length) {
            return;
        }
        let feature = features[0];
        console.log(feature.properties.description);
        this.setState({
                          showPopup: true,
                          center: feature.geometry.coordinates,
                          scream: {
                              title: feature.properties.title,
                              description: feature.properties.description,
                              amount: feature.properties.amount
                          }
                      });
    }

    render() {
        const json = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-77.03238901390978, 38.913188059745586]
                    },
                    "properties": {
                        "title": "Tordlo",
                        "description": "Bring me the best tordlo in the Universe",
                        "amount": "14.88 ETH (3000 USD)"
                    }
                }, {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-122.414, 37.776]
                    },
                    "properties": {
                        "title": "Dick Suck",
                        "description": "Sucking a dick for 5 hours",
                        "amount": "0 ETH (0 USD)"
                    }
                }]
            }
        };

        return (
            <div>
                <Map
                    key={"map"}
                    style={"mapbox://styles/romakatsa/cjnrxz3yh0qa12rpsbne9h43s"}
                    onClick={this._onClickMap}
                    onMouseMove={this._onMouseMoveMap}
                    containerStyle={{
                        height: "100vh",
                        width: "100vw"
                    }}
                    center={this.state.center}
                    zoom={this.state.zoom}
                >
                    <ScaleControl/>
                    <ZoomControl/>
                    <MapPin jsonData={json}/>
                </Map>
                <ScreamBar showScreamInputForm={this.state.showScreamInputForm}
                           updateShowScreamInputForm={this.updateShowScreamInputForm}
                />
                {this.state.showPopup ? <PinPopup key={1} scream={this.state.scream}/> : ""}
                {this.state.newScream ? <PinMarker/> : ""}
            </div>
        );
    }
}

export default App;
