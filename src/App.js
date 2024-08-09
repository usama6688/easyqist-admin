import "./App.css";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import Router from "./routes/Router";

const App = () => {
  return <div className="dark">
    <Router />
  </div>;
};

export default App;
