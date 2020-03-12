import React from "react";
import "./App.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoffee} from "@fortawesome/free-solid-svg-icons";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FontAwesomeIcon icon={faCoffee}/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
