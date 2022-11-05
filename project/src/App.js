import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  var currDate = new Date().toLocaleDateString();
  var oldDate = new Date();
  const m = oldDate.getMonth();
  oldDate.setMonth(oldDate.getMonth() - 1);
  if (oldDate.getMonth() == m) oldDate.setDate(0);
  oldDate = oldDate.toLocaleDateString();
  if (currDate[4] === "/") {
    currDate = currDate.slice(0, 3) + "0" + currDate.slice(3);
  }
  if (oldDate[4] === "/") {
    oldDate = oldDate.slice(0, 3) + "0" + oldDate.slice(3);
  }
  var formattedOldDate = oldDate.replace(/\//g, '');
  var formattedCurrentDate = currDate.replace(/\//g, '');
  formattedOldDate = formattedOldDate.slice(4, 8) + formattedOldDate.slice(0, 2) + formattedOldDate.slice(2, 4)
  formattedCurrentDate = formattedCurrentDate.slice(4, 8) + formattedCurrentDate.slice(0, 2) + formattedCurrentDate.slice(2, 4)


  var articleName = "";
  var averageViews = 0;

  async function fetchArticle() {
    let res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/title');
    const randomArticle = await res.json()
    articleName = randomArticle.items[0].title
    articleViews()
  }
  async function articleViews() {
    let res = await fetch('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/all-agents/' + articleName + '/daily/' + formattedOldDate + '/' + formattedCurrentDate);
    const articleInfo = await res.json()
    var totalviews = 0;
    console.log(articleInfo.items)
    for (let i = 0; i < articleInfo.items.length; i++) {
      totalviews += articleInfo.items[i].views
    }
    averageViews = totalviews / articleInfo.items.length
    console.log(averageViews)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>placeholder</p>
        <button onClick={fetchArticle}>get article</button>

      </header>
    </div>
  );
}

export default App;
