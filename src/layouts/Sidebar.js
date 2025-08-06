import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PATHS from "../routes/Paths";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const navigation = [
  {
    title: "Admins",
    href: PATHS.admins,
    icon: "fas fa-user-shield",
    color: "#667eea"
  },
  {
    title: "Dashboard",
    href: PATHS.dashboard,
    icon: "fas fa-chart-pie",
    color: "#4F46E5"
  },
  {
    title: "Users",
    href: PATHS.users,
    icon: "fas fa-users",
    color: "#06B6D4"
  },
  {
    title: "Vendors",
    href: PATHS.allVendors,
    icon: "fas fa-store",
    color: "#10B981"
  },
  {
    title: "Vendor Order Requests",
    href: PATHS.vendorOrderRequests,
    icon: "fas fa-clipboard-list",
    color: "#F59E0B"
  },
  {
    title: "Products",
    href: PATHS.products,
    icon: "fas fa-box-open",
    color: "#EF4444"
  },
  {
    title: "Order Requests",
    href: PATHS.orderRequests,
    icon: "fas fa-shopping-cart",
    color: "#8B5CF6"
  },
  {
    title: "Categories",
    href: PATHS.categories,
    icon: "fas fa-tags",
    color: "#EC4899"
  },
  {
    title: "Brands",
    href: PATHS.brands,
    icon: "fas fa-certificate",
    color: "#F97316"
  },
  {
    title: "Banners",
    href: PATHS.banners,
    icon: "fas fa-image",
    color: "#06B6D4"
  },
  {
    title: "Employees",
    href: PATHS.employees,
    icon: "fas fa-user-tie",
    color: "#84CC16"
  },
  {
    title: "Customers",
    href: PATHS.customers,
    icon: "fas fa-user-friends",
    color: "#F59E0B"
  },
  {
    title: "Requested Products",
    href: PATHS.requestedProducts,
    icon: "fas fa-hand-paper",
    color: "#EF4444"
  },
  {
    title: "Edit Product Requests",
    href: PATHS.editProductRequests,
    icon: "fas fa-edit",
    color: "#8B5CF6"
  },
  {
    title: "Notifications",
    href: PATHS.notifications,
    icon: "fas fa-bell",
    color: "#EC4899"
  },
  {
    title: "Blogs",
    href: PATHS.allBlogs,
    icon: "fas fa-blog",
    color: "#10B981"
  }
];

const sidebarStyles = {
  mobileBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1049,
    opacity: 0,
    visibility: "hidden",
    transition: "all 0.3s ease"
  },
  mobileBackdropShow: {
    opacity: 1,
    visibility: "visible"
  },
  modernSidebar: {
    height: "100vh",
    width: "260px",
    background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    zIndex: 1050,
    transition: "transform 0.3s ease"
  },
  modernSidebarMobile: {
    transform: "translateX(-100%)"
  },
  modernSidebarShow: {
    transform: "translateX(0)"
  },
  sidebarHeader: {
    padding: "2rem 1.5rem 1rem",
    position: "relative",
    zIndex: 2,
    borderBottom: "1px solid #f1f5f9"
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
   
  },
  brandSection: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  brandLogo: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.75rem",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
    transition: "transform 0.3s ease"
  },
  brandIcon: {
    color: "white",
    fontSize: "1.25rem"
  },
  brandText: {
    display: "flex",
    flexDirection: "column"
  },
  brandName: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: "0.75rem",
    color: "#64748b",
    lineHeight: 1.2
  },
  navWrapper: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem 0",
    position: "relative",
    zIndex: 2
  },
  navGroup: {
    marginBottom: "2rem"
  },
  groupHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 1.5rem 1rem",
    marginBottom: "0.5rem"
  },
  groupTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#64748b"
  },
  groupLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(to right, #e2e8f0, transparent)",
    marginLeft: "1rem"
  },
  modernNav: {
    padding: 0
  },
  navItemModern: {
    margin: "0 0.75rem 0.5rem",
    position: "relative"
  },
  navLinkModern: {
    display: "block",
    textDecoration: "none",
    color: "#475569",
    borderRadius: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
  },
  navLinkActive: {
    background:
      "linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))",
    boxShadow: "0 20px 25px -5px rgba(102, 126, 234, 0.2)"
  },
  linkContent: {
    display: "flex",
    alignItems: "center",
    padding: "1rem 1.25rem",
    position: "relative",
    zIndex: 2
  },
  iconContainer: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease"
  },
  iconContainerIcon: {
    color: "white",
    fontSize: "1rem"
  },
  linkText: {
    fontSize: "0.875rem",
    fontWeight: 600,
    flex: 1
  },
  linkTextActive: {
    color: "#4f46e5",
    fontWeight: 700
  },
  activeIndicator: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    opacity: 0,
    transition: "all 0.3s ease",
    boxShadow: "0 0 12px #10b981"
  },
  activeIndicatorShow: {
    opacity: 1
  },
  sidebarFooter: {
    padding: "1.5rem",
    borderTop: "1px solid #f1f5f9",
    position: "relative",
    zIndex: 2
  },
  footerContent: {
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    borderRadius: "16px",
    padding: "1rem",
    border: "1px solid #e2e8f0"
  },
  userInfo: {
    display: "flex",
    alignItems: "center"
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.75rem",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
  },
  userAvatarIcon: {
    color: "white",
    fontSize: "1rem"
  },
  userDetails: {
    flex: 1
  },
  userName: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1.2
  },
  userRole: {
    display: "block",
    fontSize: "0.75rem",
    color: "#64748b",
    lineHeight: 1.2
  }
};

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [backdropShow, setBackdropShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state?.auth);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991.98);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Listen for external toggle (from header)
  useEffect(() => {
    const sidebarElement = document.getElementById("sidebarArea");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const hasShowSidebar =
            sidebarElement.classList.contains("showSidebar");
          setIsOpen(hasShowSidebar);
          setBackdropShow(hasShowSidebar);
        }
      });
    });

    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  const toggleSidebar = () => {
    const sidebarElement = document.getElementById("sidebarArea");

    if (sidebarElement) {
      sidebarElement.classList.toggle("showSidebar");
      const hasShowSidebar = sidebarElement.classList.contains("showSidebar");
      setIsOpen(hasShowSidebar);
      setBackdropShow(hasShowSidebar);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const filteredNavigation = (() => {
    if (!auth?.userDetail?.type) return navigation;

    switch (Number(auth.userDetail.type)) {
      case 1:
        return navigation;
      case 2:
        return navigation.filter((item) => item.title !== "Admins");
      case 3:
        return navigation.filter(
          (navi) =>
            navi.title === "Dashboard" ||
            navi.title === "Notifications" ||
            navi.title === "Users"
        );
      case 4:
        return navigation.filter(
          (navi) =>
            navi.title === "Dashboard" ||
            navi.title === "Order Requests" ||
            navi.title === "Products" ||
            navi.title === "Users"
        );
      case 5:
        return navigation.filter(
          (navi) =>
            navi.title === "Dashboard" || navi.title === "Order Requests"
        );
      case 6:
        return navigation.filter(
          (navi) =>
            navi.title === "Dashboard" ||
            navi.title === "Products" ||
            navi.title === "Blogs" ||
            navi.title === "Notifications"
        );
      default:
        return navigation;
    }
  })();

  const getSidebarStyle = () => {
    const baseStyle = { ...sidebarStyles.modernSidebar };

    if (isMobile) {
      if (isOpen) {
        return { ...baseStyle, ...sidebarStyles.modernSidebarShow };
      } else {
        return { ...baseStyle, ...sidebarStyles.modernSidebarMobile };
      }
    }

    return baseStyle;
  };

  const getBackdropStyle = () => {
    return {
      ...sidebarStyles.mobileBackdrop,
      ...(backdropShow ? sidebarStyles.mobileBackdropShow : {})
    };
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        style={getBackdropStyle()}
        id="mobileBackdrop"
        onClick={toggleSidebar}
      />

      <div style={getSidebarStyle()} id="sidebarArea">
        {/* Header Section */}
        <div style={sidebarStyles.sidebarHeader}>
          <div style={sidebarStyles.headerContent}>
            <div style={sidebarStyles.brandSection}>
              <div style={sidebarStyles.brandLogo}>
                <i
                  className="fas fa-qrcode"
                  style={sidebarStyles.brandIcon}
                ></i>
              </div>
              <div style={sidebarStyles.brandText}>
                <span style={sidebarStyles.brandName}>EasyQist</span>
                <span style={sidebarStyles.brandSubtitle}>Admin Panel</span>
              </div>
            </div>
            {isMobile && (
              <Button
                close
                size="sm"
                onClick={toggleSidebar}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  color: "#1e293b",
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "flex-start", 
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  paddingTop: "4px", 
                  paddingBottom: "0",
                  paddingLeft: "0",
                  paddingRight: "0"
                }}
              >
                &times;
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <div style={sidebarStyles.navWrapper}>
          <Nav vertical style={sidebarStyles.modernNav}>
            {/* Super Admin Section */}
            {auth?.userDetail?.type === 1 && (
              <div style={sidebarStyles.navGroup}>
                <div style={sidebarStyles.groupHeader}>
                  <span style={sidebarStyles.groupTitle}>Super Admin</span>
                  <div style={sidebarStyles.groupLine}></div>
                </div>
                <NavItem style={sidebarStyles.navItemModern}>
                  <Link
                    to={PATHS.admins}
                    style={{
                      ...sidebarStyles.navLinkModern,
                      ...(location.pathname.startsWith(PATHS.admins)
                        ? sidebarStyles.navLinkActive
                        : {})
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(PATHS.admins);
                    }}
                  >
                    <div style={sidebarStyles.linkContent}>
                      <div
                        style={{
                          ...sidebarStyles.iconContainer,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        }}
                      >
                        <i
                          className="fas fa-user-shield"
                          style={sidebarStyles.iconContainerIcon}
                        ></i>
                      </div>
                      <span
                        style={{
                          ...sidebarStyles.linkText,
                          ...(location.pathname.startsWith(PATHS.admins)
                            ? sidebarStyles.linkTextActive
                            : {})
                        }}
                      >
                        Admins
                      </span>
                    </div>
                    <div
                      style={{
                        ...sidebarStyles.activeIndicator,
                        ...(location.pathname.startsWith(PATHS.admins)
                          ? sidebarStyles.activeIndicatorShow
                          : {})
                      }}
                    ></div>
                  </Link>
                </NavItem>
              </div>
            )}

            {/* Main Navigation */}
            <div style={sidebarStyles.navGroup}>
              <div style={sidebarStyles.groupHeader}>
                <span style={sidebarStyles.groupTitle}>Main Menu</span>
                <div style={sidebarStyles.groupLine}></div>
              </div>
              {filteredNavigation.map((navi, index) => (
                <NavItem key={index} style={sidebarStyles.navItemModern}>
                  <Link
                    to={navi.href}
                    style={{
                      ...sidebarStyles.navLinkModern,
                      ...(location.pathname.startsWith(navi.href)
                        ? sidebarStyles.navLinkActive
                        : {})
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(navi.href);
                    }}
                  >
                    <div style={sidebarStyles.linkContent}>
                      <div
                        style={{
                          ...sidebarStyles.iconContainer,
                          background: `linear-gradient(135deg, ${navi.color}, ${navi.color}99)`
                        }}
                      >
                        <i
                          className={navi.icon}
                          style={sidebarStyles.iconContainerIcon}
                        ></i>
                      </div>
                      <span
                        style={{
                          ...sidebarStyles.linkText,
                          ...(location.pathname.startsWith(navi.href)
                            ? sidebarStyles.linkTextActive
                            : {})
                        }}
                      >
                        {navi.title}
                      </span>
                    </div>
                    <div
                      style={{
                        ...sidebarStyles.activeIndicator,
                        ...(location.pathname.startsWith(navi.href)
                          ? sidebarStyles.activeIndicatorShow
                          : {})
                      }}
                    ></div>
                  </Link>
                </NavItem>
              ))}
            </div>
          </Nav>
        </div>

        {/* Footer */}
        <div style={sidebarStyles.sidebarFooter}>
          <div style={sidebarStyles.footerContent}>
            <div style={sidebarStyles.userInfo}>
              <div style={sidebarStyles.userAvatar}>
                <i
                  className="fas fa-user"
                  style={sidebarStyles.userAvatarIcon}
                ></i>
              </div>
              <div style={sidebarStyles.userDetails}>
                <span style={sidebarStyles.userName}>EasyQist</span>
                <span style={sidebarStyles.userRole}>Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
