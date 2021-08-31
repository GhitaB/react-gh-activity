import './App.css';
import React, { useEffect, useState } from "react";

function ItemsList(props) {
  const itemsList = props.items;
  const items = itemsList.map((item) =>
    <li key={item.toString()}>
      TEST: {item}
    </li>
  );
  return (
    <ul>{items}</ul>
  );
}

window.hasData = false;

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if(!window.hasData) {
      var GitHub = require('github-api');

      // basic auth
      var gh = new GitHub({
         username: 'ghitab',
         // token: 'TOKEN'
      });

      var me = gh.getUser();
      console.log(me);

      fetch("https://api.github.com/users/ghitab/events/public", {
          method: "GET",
          headers: {
            Authorization: `token ${me.__auth.token} `
          }
        })
        .then(res => res.json())
        .then(
          (result) => {
            // https://api.github.com/rate_limit
            var filtered = result.filter((item) => {
              return item.type === "PushEvent"
            });
            var prepared = [];
            for(var evt of filtered) {
              prepared.push(evt.id);
            }
            setEvents(prepared);
            window.hasData = true;
            console.log("Done");
          }
        );
    }
  });

  return (
    <div className="App">
      <p>TEST: {events}</p>
      <ItemsList items={events} />
    </div>
  );
}

export default App;
