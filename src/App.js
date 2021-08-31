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

function App() {
  const [events, setEvents] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/users/ghitab/events/public", {
        method: "GET",
        headers: {
          Authorization: `token TOKEN `
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          debugger;
          // https://api.github.com/rate_limit
          var filtered = result.filter((item) => {
            return item.type === "PushEvent"
          });
          var prepared = [];
          for(var evt of filtered) {
            prepared.push(evt.id);
          }
          // console.log(filtered);
          setEvents(prepared);
        }
      );
  });

  return (
    <div className="App">
      <p>TEST: {events}</p>
      // <ItemsList items={events} />
    </div>
  );
}

export default App;
