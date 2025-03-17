import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jokes, setjokes] = useState([]);

  useEffect(() => {
    // axios
    //   .get("api/jokes")
    //   .then((res) => {
    //     setjokes(res.data);
    //   })
    //   .catch((rej) => {
    //     console.error(rej);
    //   });
    fetch("api/jokes", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setjokes(data))
      .catch((rej) => {
        console.error(rej);
      });
  }, []);

  return (
    <>
      <h1>Connecting backend and frontend</h1>
      <p>Jokes {jokes.length}</p>
      <ul>
        {jokes.map((joke) => (
          <li key={joke.id}>
            {joke.setup} , {joke.punchline}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
