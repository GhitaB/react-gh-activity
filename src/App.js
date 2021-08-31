import React, { useEffect, useState } from "react";   // JS Modules (ES Modules) import
import GitHub from 'github-api';
import { DateTime } from 'luxon';

import './App.css';

const eventTypes = [
  'PushEvent', 'IssueCommentEvent', 'WatchEvent', 'PullRequestEvent', 'CreateEvent'
]


const PushEvent = ({item}) => {
  // console.log('item', item);
  const { created_at } = item;
  const d = DateTime.fromISO(created_at).setLocale('ro');
  // console.log(d);
  return <div className="item push-event">
    <div>
      <strong>Push</strong> at {d.toLocaleString()} in {item.repo.name}
    </div>
    {item.payload?.commits?.map(commit => {
      return (
        <div>
          <em>{commit.author.name}</em> <strong>{commit.message}</strong>
        </div>
      )
    })}
  </div>;
}

const DefaultView = ({item}) => {
  return (
    <div key={item.toString()} className="item">
      <span className="created">{JSON.stringify(item)}</span>
    </div>
  );
}


const views = {
  PushEvent,
}


// created: evt.created_at,
// repo: evt.repo_name,
// id: evt.id,
// commits: evt.payload.commits
function ItemsList( {entries} ) {
  const items = entries;
  return (
    <div className="items">
      { items.map((item, i) => {
          const View = views[item.type] || DefaultView;
          return (<View item={item} key={i} />);
        })
      }</div>
  );
}

const config = {
  username: process.env.REACT_APP_USERNAME,
  token: process.env.REACT_APP_TOKEN,
}


const prepareShowEvents = (entries) => {
  const filtered = entries.filter((item) => {
    return item.type === "PushEvent"
  });
  const events = [];
  const eventsDetails = [];

  for(const evt of filtered) {
    events.push(`${evt.created_at}: ${evt.repo.name} - ${evt.id} - ${evt.payload.commits[0].message}`);
    eventsDetails.push({
      created: evt.created_at,
      repo: evt.repo_name,
      id: evt.id,
      commits: evt.payload.commits
    });
  }

  return { events, eventsDetails }
}


function App() {
  const [entries, setEntries] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(['PushEvent']);
  console.log(entries);

  useEffect(() => {

    // basic auth
    const gh = new GitHub(config);
    const me = gh.getUser();
    // console.log(me);

    fetch(`https://api.github.com/users/${config.username}/events/public`, {
      method: "GET",
      headers: {
        Authorization: `token ${me.__auth.token} `
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          // https://api.github.com/rate_limit
          setEntries(result);
        }
      );
  }, []);

  // const { events = [], eventsDetails = []} = prepareShowEvents(entries);
  // console.log({events, eventsDetails});

  return (
    <div className="App">
      <div className="container">
        <form>
          <fieldset>
            <legend>Filter events</legend>
            {eventTypes.map((name, i) => <div key={name}>
              <input
                type="checkbox"
                defaultChecked={filteredEvents.includes(name)}
                onChange={(ev, v) => {
                  setFilteredEvents([...filteredEvents, name].filter(n => ev.target.checked ? true : n !== name))
                }}
              />
              <label>{name}</label>
            </div>) }
          </fieldset>
        </form>

        <ItemsList entries={entries.filter(e => filteredEvents.includes(e.type))} />
      </div>
    </div>
  );
}

export default App;
