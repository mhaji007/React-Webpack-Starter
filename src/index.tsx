import ReactDOM from "react-dom";
import { App } from "./App";

ReactDOM.render(<App />, document.getElementById("app"));

// Inject browser with the newest version of javascript on the fly without reload
if (module.hot) {
  module.hot.accept();
}
