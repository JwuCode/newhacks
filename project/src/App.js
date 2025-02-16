import './App.css';
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { collection, doc, addDoc, getDoc } from "firebase/firestore";  
import { getFirestore } from "firebase/firestore";

function App() {


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj5OgO-GJLetg8TTKDADtBUTNQRVuEds8",
  authDomain: "newhacks-b144e.firebaseapp.com",
  projectId: "newhacks-b144e",
  storageBucket: "newhacks-b144e.appspot.com",
  messagingSenderId: "737121549886",
  appId: "1:737121549886:web:e5c6f6efa1743523765b6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

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



async function fetchArticle() {
  var articleName = "";
  var averageViews = 0;
  let res = await fetch('https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/api/rest_v1/page/random/title');
  const randomArticle = await res.json()
  articleName = randomArticle.items[0].title
  let resp = await fetch('https://cors-anywhere.herokuapp.com/https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/all-agents/' + articleName + '/daily/' + formattedOldDate + '/' + formattedCurrentDate);
  const articleStats = await resp.json()
  var totalviews = 0;
  for (let i = 0; i < articleStats.items.length; i++) {
    totalviews += articleStats.items[i].views
  }
  averageViews = totalviews / articleStats.items.length
  console.log(averageViews)
  return [averageViews, articleName];
}

async function webScraper() {
  console.log('webscraper called')
  const views = await fetchArticle()
  if (views[0]) {
    let res = await fetch('https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext&exintro&titles=' + views[1]);
    const articleInfo = await res.json()
    var pagenum = Object.keys(articleInfo.query.pages)
    var summary = articleInfo.query.pages[pagenum].extract
    summary = summary.slice(0, 800)
    summary += "..."
    var wikilink = "https://en.wikipedia.org/wiki/" + views[1]
    return [wikilink, views[1], summary, true]


  } else {
    return (false)
  }
}
var counter = 0;

while (counter < 20) {
  tester()
  setTimeout(5000);
  
}
async function tester() {

  const addlink = async (url, title, summary, id) => {
    await addDoc(collection(db, 'articles'), {
      url: url,
      title: title,
      body: summary,
      id: id
    })
  }
    var scrapeResults = await webScraper()

    if (scrapeResults.length == 4) {
      console.log('adding')
      console.log(scrapeResults)
      console.log(scrapeResults[0])
      console.log(scrapeResults[1])
      console.log(scrapeResults[2])
      addlink(scrapeResults[0], scrapeResults[1], scrapeResults[2], counter)
      counter += 1
    }
  }

  

  return (
    <div className="App">
      <header className="App-header">
        <p>placeholder</p>
<button onClick={tester}>tester</button>
      </header>
    </div>
  );
}

export default App;
