import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startQuiz":
      return { ...state, status: "active" };
    case "newAnswer":
      const currQues = state.questions[state.index];
      const currPoints =
        action.payload === currQues.correctOption ? currQues.points : 0;

      return {
        ...state,
        answer: action.payload,
        points: state.points + currPoints,
      };
    default:
      throw new Error("Invalid action!");
  }
};
const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

const App = () => {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (e) {
        dispatch({ type: "dataFailed" });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
            points={points}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
