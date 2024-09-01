import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import Login from "../views/ui/SigninUser";
import { useSelector } from "react-redux";

const FullLayout = () => {

  // const auth = useSelector((data) => data.auth);

  return (
    <main>
      {/* {!auth?.isLoggedIn && !auth?.userDetail ?
        <Login />
        : */}
      <div className="pageWrapper d-lg-flex">
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>

        <div className="contentArea overflow-auto">
          <Header />
          <Container className="p-4 wrapper" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
      {/* } */}
    </main>
  );
};

export default FullLayout;
