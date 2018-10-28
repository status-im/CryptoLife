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
            screams: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [-77.03238901390978, 38.913188059745586]
                        },
                        properties: {
                            title: "Want some croquttes",
                            description: "",
                            amount: "0.002 ETH ",
                            rating: "3.5"
                        }
                    }, {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [-122.414, 37.776]
                        },
                        properties: {
                            title: "Make homework",
                            description: "Help me with maths!",
                            amount: "0.01 ETH ",
                            rating: "4.1"
                        }
                    }]
                }
            },
            showScreamInputForm: false,
            newScream: true,
            showPopup: false,
            scream: {
                title: "",
                description: "",
                amount: "",
                rating: ""
            },
            zoom: [17],
            center: [-87.63097788775872, 41.767174164037044]
        };
        this.updateShowScreamInputForm = this.updateShowScreamInputForm.bind(this);
        this._onClickMap = this._onClickMap.bind(this);
        this.addScream = this.addScream.bind(this);
        this._onMouseMoveMap = this._onMouseMoveMap.bind(this);
    }

    updateShowScreamInputForm(newShow) {
        this.setState({showScreamInputForm: newShow});
    }

    _onMouseMoveMap(map, e) {
        let features = map.queryRenderedFeatures(e.point, {layers: ['layer_id']});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        this.setState({center:[map.getCenter().lng, map.getCenter().lat]});
        console.log(this.state.center);
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
                              amount: feature.properties.amount,
                              rating: feature.properties.rating,
                          }
                      });
    }

    addScream(title, description, amount) {

        console.log(title);
        console.log(description);
        console.log(amount);
        console.log(this.state.center);
        console.log(Object.keys(Map));
        let prev = this.state;

        prev.screams.data.features = [...this.state.screams.data.features,
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: this.state.center,
                },
                properties: {
                    title: title,
                    description: description,
                    amount: amount,
                    rating: "4.95"
                }
            }
        ];

        this.setState({screams: prev.screams});
        console.log(this.state.screams);
    }

    render() {
        return (
            <div>
                <Map
                    key={"map"}
                    style={"mapbox://styles/romakatsa/cjnsma1oq31xf2stevzztlyrw"}
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
                    <MapPin jsonData={this.state.screams}/>
                </Map>
                <ScreamBar showScreamInputForm={this.state.showScreamInputForm}
                           updateShowScreamInputForm={this.updateShowScreamInputForm}
                           handleScreamClick={this.addScream}
                />
                {this.state.showPopup ? <PinPopup key={1} scream={this.state.scream}/> : ""}
                {this.state.newScream ? <PinMarker/> : ""}
            </div>
        );
    }
}

export default App;
