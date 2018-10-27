import React from "react"
import ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { HashRouter } from "react-router-dom"
import App from "./app.js"

import store from "./store"

const Root = () => <Provider store={store}>
    <HashRouter>
        <App />
    </HashRouter>
</Provider>

ReactDOM.render(<Root />, document.getElementById("root"))
