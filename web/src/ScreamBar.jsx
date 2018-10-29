import React, {Component} from "react";

export class ScreamBar extends Component {

    constructor(props) {
        super(props);
        this.titleInput = null;
        this.descriptionInput = null;
        this.amountInput = null;
        this.statusImLink = null;
    }


    render() {
        return (
            <div style={this.props.showScreamInputForm
                ? ScreamBar.styles.topBarHigh
                : ScreamBar.styles.topBarShort}
            >
                <div style={ScreamBar.styles.textInputWrapper}>
                    <input type="text"
                           style={ScreamBar.styles.textInput}
                           placeholder="What do you scream for?"
                           onFocus={() => this.props.updateShowScreamInputForm(true)}
                           ref={(ref) => {
                               this.titleInput = ref;
                           }}
                    />
                    {this.props.showScreamInputForm
                        ? (
                            <div>
                                <input type="text"
                                       style={ScreamBar.styles.textInput}
                                       placeholder="What's your Status.im userlink?"
                                       onFocus={() => this.props.updateShowScreamInputForm(true)}
                                       ref={(ref) => {
                                           this.statusImLink = ref;
                                       }}
                                />
                                <textarea style={ScreamBar.styles.textArea}
                                          placeholder="Please provide the details of your emergency"
                                          ref={(ref) => {
                                              this.descriptionInput = ref;
                                          }}
                                />
                                <input type="number"
                                       step="0.0000001"
                                       style={ScreamBar.styles.textInput}
                                       placeholder="Amount in ETH you are willing to pay for it"
                                       ref={(ref) => {
                                           this.amountInput = ref;
                                       }}
                                />
                            </div>

                        )
                        : null}
                </div>
                <button style={ScreamBar.styles.topBarButton}
                        onClick={() => this.props.handleScreamClick(this.titleInput.value,
                                                                    this.descriptionInput.value,
                                                                    this.amountInput.value,
                                                                    this.statusImLink.value)}>
                    SCREAM</button>
            </div>
        )
    }
}

ScreamBar.styles = {
    textInput: {
        "backgroundColor": "#e5e5e5",
        "width": "98%",
        "outline": "none",
        "fontSize": "1rem",
        "padding": ".5rem 0",
        "margin": "0 1%",
        "border": "0",
        "borderBottom": "2px",
        "borderStyle": "solid",
        "borderColor": "#d3d3d3",
        "boxSizing": "border-box",
        ":focus": {
            "border": "0",
            "borderBottom": "2px",
            "borderStyle": "solid",
            "borderColor": "#3770c6"
        }
    },
    textArea: {
        "backgroundColor": "#e5e5e5",
        "width": "98%",
        "outline": "none",
        "fontSize": "1rem",
        "padding": ".5rem 0",
        "margin": "0 1%",
        "border": "0",
        "borderBottom": "2px",
        "borderStyle": "solid",
        "borderColor": "#d3d3d3",
        "boxSizing": "border-box",
        ":focus": {
            "border": "0",
            "borderBottom": "2px",
            "borderStyle": "solid",
            "borderColor": "#3770c6"
        }
    },
    textInputWrapper: {
        "borderWidth": "1px 0 1px 1px",
        "borderStyle": "solid",
        "borderColor": "#3770c6",
        "backgroundColor": "#e5e5e5",
        "height": "100%",
        "width": "100%",
        "borderRadius": "6px 0 0 6px",
        "boxSizing": "border-box",
        ":hover": {
            "backgroundColor": "#d1d1d1"
        }
    },
    topBarButton: {
        "borderWidth": "1px 1px 1px 0",
        "borderStyle": "solid",
        "borderColor": "#3770c6",
        "backgroundColor": "rgb(84, 152, 255)",
        "height": "100%",
        "color": "white",
        "borderRadius": "0 6px 6px 0",
        "cursor": "pointer",
        "boxSizing": "border-box",
        "outline": "none",
        ":hover": {
            "backgroundColor": "#3770c6"
        }
    },
    topBarHigh: {
        "position": "absolute",
        "align": "justify",
        "top": "5%",
        "left": "50%",
        "transform": "translate(-50%)",
        "width": "80%",
        "height": "12rem",
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "padding": "0"
    },
    topBarShort: {
        "position": "absolute",
        "align": "justify",
        "top": "5%",
        "left": "50%",
        "transform": "translate(-50%)",
        "width": "80%",
        "height": "3rem",
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "padding": "0"
    }
};
