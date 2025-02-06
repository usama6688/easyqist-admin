import "./App.css";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import Router from "./routes/Router";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const App = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.pathname != "/admin/orderRequests" && location.pathname != "/admin/viewOrderRequest" && location.pathname != "/admin/viewOrderPayment") {
      localStorage.removeItem("status");
    }
  }, [location.pathname]);

  return <div className="dark">
    <Router />
  </div>;
};

export default App;