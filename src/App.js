import { useEffect } from "react";
import Header from "./Header";
import Main from "./components/Main";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/questions");
      const data = await res.json();
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        <p>Question?</p>
      </Main>
    </div>
  );
};

export default App;
