import React from "react";
import ReactDOM from 'react-dom'
import Tabs from "../tabs";
import '../style/index.less'
const App = () => {
    return <div className="app"><Tabs /></div>
}
ReactDOM.render(<App />, document.getElementById('#app'))