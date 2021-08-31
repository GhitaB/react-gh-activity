import './App.css';
import React, { useEffect, useState } from "react";

function ItemsList(props) {
  const itemsList = props.items[0];
  console.log(props.items[1]);
  const items = itemsList.map((item) =>
    <div key={item.toString()}>
      {item}
    </div>
  );
  return (
    <div>{items}</div>
  );
}

                // created: evt.created_at,
                // repo: evt.repo_name,
                // id: evt.id,
                // commits: evt.payload.commits
function ItemsList2(props) {
  const itemsList = props.items[1];
  const items = itemsList.map((item) =>
    <div key={item.toString()} className="item">
      <span className="created">{item.created}</span>
    </div>
  );
  return (
    <div className="items">{items}</div>
  );
}

window.hasData = false;

function App() {
  const [events, setEvents] = useState([[],[]]);

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
            var eventsDetails = [];
            for(var evt of filtered) {
              prepared.push(`${evt.created_at}: ${evt.repo.name} - ${evt.id} - ${evt.payload.commits[0].message}`);
              eventsDetails.push({
                created: evt.created_at,
                repo: evt.repo_name,
                id: evt.id,
                commits: evt.payload.commits
              });
            }

            setEvents([prepared, eventsDetails]);
            window.hasData = true;
          }
        );
    }
  });

  return (
    <div className="App">
      <div className="container">
        <ItemsList2 items={events} />
      </div>
    </div>
  );
}

export default App;
