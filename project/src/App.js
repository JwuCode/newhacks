import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';


function App() {

function fetchArticle() {
  fetch('https://en.wikipedia.org/api/rest_v1/page/random/title')
        .then(response => response.json())
        .then((data) => {
          setInfo(data);
          console.log(data);
       })
}


const [data, setInfo] = useState();

  return (
    <div className="App">
      <header className="App-header">
    <p>penis</p>
    <button onClick={fetchArticle}>get article</button>

        
      </header>
    </div>
  );
}


export default App;
