import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import PATHS from "../routes/Paths";
import { useSelector } from "react-redux";

const navigation = [
  {
    title: "Dashboard",
    href: PATHS.dashboard,
  },
  {
    title: "Users",
    href: PATHS.users,
  },
  {
    title: "Vendors",
    href: PATHS.allVendors,
  },
  {
    title: "Vendor Order Requests",
    href: PATHS.vendorOrderRequests,
  },
  {
    title: "Products",
    href: PATHS.products,
  },
  {
    title: "Order Requests",
    href: PATHS.orderRequests,
  },
  {
    title: "Categories",
    href: PATHS.categories,
  },
  {
    title: "Brands",
    href: PATHS.brands,
  },
  {
    title: "Banners",
    href: PATHS.banners,
  },
  {
    title: "Employees",
    href: PATHS.employees,
  },
  {
    title: "Customers",
    href: PATHS.customers,
  },
  {
    title: "Requested Products",
    href: PATHS.requestedProducts,
  },
  {
    title: "Edit Product Requests",
    href: PATHS.editProductRequests,
  },
  {
    title: "Notifications",
    href: PATHS.notifications,
  },
  {
    title: "Blogs",
    href: PATHS.allBlogs,
  },
];

const Sidebar = () => {

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  let location = useLocation();

  const auth = useSelector((data) => data?.auth);

  const filteredNavigation = auth?.userDetail?.type == 3
    ? navigation.filter(navi => navi?.title == "Dashboard" || navi?.title == "Notifications" || navi?.title == "Users") : auth?.userDetail?.type == 4 ? navigation.filter(navi => navi?.title == "Dashboard" || navi?.title == "Order Requests" || navi?.title == "Products" || navi?.title == "Users") : auth?.userDetail?.type == 5 ? navigation.filter(navi => navi?.title == "Dashboard" || navi?.title == "Order Requests")
      : auth?.userDetail?.type == 6 ? navigation.filter(navi => navi?.title == "Dashboard" || navi?.title == "Products" || navi?.title == "Blogs") : navigation;

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <a href={PATHS.dashboard}>
          <Logo />
        </a>
        <span className="ms-auto d-lg-none">
          <Button
            close
            size="sm"
            className="ms-auto d-lg-none"
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {auth?.userDetail?.type == 1 && (
            <NavItem className="sidenav-bg">
              <a
                href={PATHS.admins}
                className={
                  location.pathname == PATHS.admins
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className="your-icon-class"></i>
                <span className="ms-3 d-inline-block">Admins</span>
              </a>
            </NavItem>
          )}

          {filteredNavigation?.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <a
                href={navi.href}
                className={
                  location.pathname == navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </a>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;