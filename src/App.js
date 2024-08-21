import "./App.css";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import Router from "./routes/Router";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "./redux/AuthSliceQist";
import { useLocation } from "react-router-dom";

const App = () => {

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logoutFunction();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [!location?.pathname]);

  const logoutFunction = () => {
    dispatch(userLogout(null));
  };

  return <div className="dark">
    <Router />
  </div>;
};

export default App;