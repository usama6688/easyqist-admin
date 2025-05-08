import React, { Suspense, lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import PATHS from "./Paths";
import { useSelector } from "react-redux";
import FullLayout from "../layouts/FullLayout.js";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<h3>Loading...</h3>}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy-loaded components
const SigninUser = Loadable(lazy(() => import("../views/ui/SigninUser.jsx")));
const Signup = Loadable(lazy(() => import("../views/ui/Signup.jsx")));
const Dashboard = Loadable(lazy(() => import("../views/Dashboard.js")));
const AddProduct = Loadable(lazy(() => import("../views/ui/AddProduct.jsx")));
const ViewProduct = Loadable(lazy(() => import("../views/ui/ViewProduct.jsx")));
const EditProduct = Loadable(lazy(() => import("../views/ui/EditProduct.jsx")));
const Products = Loadable(lazy(() => import("../views/ui/Products.jsx")));
const Users = Loadable(lazy(() => import("../views/ui/Users.jsx")));
const AddUser = Loadable(lazy(() => import("../views/ui/AddUser.jsx")));
const Admins = Loadable(lazy(() => import("../views/ui/Admins.jsx")));
const AddAdmin = Loadable(lazy(() => import("../views/ui/AddAdmin.jsx")));
const EditAdmin = Loadable(lazy(() => import("../views/ui/EditAdmin.jsx")));
const ViewUserData = Loadable(lazy(() => import("../views/ui/ViewUserData.jsx")));
const OrderRequests = Loadable(lazy(() => import("../views/ui/OrderRequests.jsx")));
const ViewOrderRequest = Loadable(lazy(() => import("../views/ui/ViewOrderRequests.jsx")));
const ViewOrderPayment = Loadable(lazy(() => import("../views/ui/ViewOrderPayment.jsx")));
const Categories = Loadable(lazy(() => import("../views/ui/Categories.jsx")));
const AddCategory = Loadable(lazy(() => import("../views/ui/AddCategories.jsx")));
const EditCategory = Loadable(lazy(() => import("../views/ui/EditCategories.jsx")));
const Brands = Loadable(lazy(() => import("../views/ui/Brands.jsx")));
const AddBrands = Loadable(lazy(() => import("../views/ui/AddBrand.jsx")));
const EditBrand = Loadable(lazy(() => import("../views/ui/EditBrand.jsx")));
const Banners = Loadable(lazy(() => import("../views/ui/Banners.jsx")));
const AddBanner = Loadable(lazy(() => import("../views/ui/AddBanner.jsx")));
const EditBanner = Loadable(lazy(() => import("../views/ui/EditBanner.jsx")));
const Employees = Loadable(lazy(() => import("../views/ui/Employees.jsx")));
const AddEmployee = Loadable(lazy(() => import("../views/ui/AddEmployee.jsx")));
const EditEmployee = Loadable(lazy(() => import("../views/ui/EditEmployee.jsx")));
const Customers = Loadable(lazy(() => import("../views/ui/Customers.jsx")));
const AddCustomers = Loadable(lazy(() => import("../views/ui/AddCustomer.jsx")));
const EditCustomers = Loadable(lazy(() => import("../views/ui/EditCustomer.jsx")));
const RequestedProducts = Loadable(lazy(() => import("../views/ui/RequestedProducts.jsx")));
const ViewRequestedProduct = Loadable(lazy(() => import("../views/ui/ViewRequestedProduct.jsx")));
const ProductDetail = Loadable(lazy(() => import("../views/ui/ProductDetail.jsx")));
const Notifications = Loadable(lazy(() => import("../views/ui/Notifications.jsx")));
const Blogs = Loadable(lazy(() => import("../views/ui/Blogs.jsx")));
const AddBlog = Loadable(lazy(() => import("../views/ui/AddBlog.jsx")));
const EditBlog = Loadable(lazy(() => import("../views/ui/EditBlog.jsx")));
const EditProductRequests = Loadable(lazy(() => import("../views/ui/EditProductRequests.jsx")));
const ViewProductRequest = Loadable(lazy(() => import("../views/ui/ViewProductRequest.jsx")));
const ViewEditRequestProduct = Loadable(lazy(() => import("../views/ui/ViewEditRequestProduct.jsx")));
const AllVendors = Loadable(lazy(() => import("../views/ui/Vendors.jsx")));
const AddVendor = Loadable(lazy(() => import("../views/ui/AddVendor.jsx")));
const VendorOrderRequests = Loadable(lazy(() => import("../views/ui/VendorOrderRequests.jsx")));
const ViewVendorOrderRequests = Loadable(lazy(() => import("../views/ui/ViewVendorOrderRequest.jsx")));

export default function Router() {
  const auth = useSelector((data) => data?.auth);

  return useRoutes(
    auth?.isLoggedIn && auth?.userDetail
      ? [
        {
          path: "/",
          element: <FullLayout />,
          children: [
            { path: "/admin/", element: <Navigate to={PATHS.dashboard} /> },
            { path: PATHS.dashboard, element: <Dashboard /> },
            { path: PATHS.addProduct, element: <AddProduct /> },
            { path: PATHS.viewProduct, element: <ViewProduct /> },
            { path: PATHS.editProduct, element: <EditProduct /> },
            { path: PATHS.products, element: <Products /> },
            { path: PATHS.users, element: <Users /> },
            { path: PATHS.addUser, element: <AddUser /> },
            { path: PATHS.admins, element: <Admins /> },
            { path: PATHS.addAdmin, element: <AddAdmin /> },
            { path: PATHS.editAdmin, element: <EditAdmin /> },
            { path: PATHS.viewUserData, element: <ViewUserData /> },
            { path: PATHS.orderRequests, element: <OrderRequests /> },
            { path: PATHS.viewOrderRequest, element: <ViewOrderRequest /> },
            { path: PATHS.viewOrderPayment, element: <ViewOrderPayment /> },
            { path: PATHS.categories, element: <Categories /> },
            { path: PATHS.addCategory, element: <AddCategory /> },
            { path: PATHS.editCategory, element: <EditCategory /> },
            { path: PATHS.brands, element: <Brands /> },
            { path: PATHS.addBrands, element: <AddBrands /> },
            { path: PATHS.editBrand, element: <EditBrand /> },
            { path: PATHS.banners, element: <Banners /> },
            { path: PATHS.addBanner, element: <AddBanner /> },
            { path: PATHS.editBanner, element: <EditBanner /> },
            { path: PATHS.employees, element: <Employees /> },
            { path: PATHS.addEmployee, element: <AddEmployee /> },
            { path: PATHS.editEmployee, element: <EditEmployee /> },
            { path: PATHS.customers, element: <Customers /> },
            { path: PATHS.addCustomers, element: <AddCustomers /> },
            { path: PATHS.editCustomers, element: <EditCustomers /> },
            { path: PATHS.requestedProducts, element: <RequestedProducts /> },
            { path: PATHS.viewRequestedProduct, element: <ViewRequestedProduct /> },
            { path: PATHS.productDetail, element: <ProductDetail /> },
            { path: PATHS.notifications, element: <Notifications /> },
            { path: PATHS.allBlogs, element: <Blogs /> },
            { path: PATHS.addBlog, element: <AddBlog /> },
            { path: PATHS.editBlog, element: <EditBlog /> },
            { path: PATHS.editProductRequests, element: <EditProductRequests /> },
            { path: PATHS.viewProductRequest, element: <ViewProductRequest /> },
            { path: PATHS.viewEditRequestProduct, element: <ViewEditRequestProduct /> },
            { path: PATHS.allVendors, element: <AllVendors /> },
            { path: PATHS.addVendors, element: <AddVendor /> },
            { path: PATHS.vendorOrderRequests, element: <VendorOrderRequests /> },
            { path: PATHS.viewVendorOrderRequests, element: <ViewVendorOrderRequests /> },
          ],
        },
      ]
      : [
        { path: "/admin/", element: <Navigate to={PATHS.signin} /> },
        { path: PATHS.signin, element: <SigninUser /> },
        { path: PATHS.signup, element: <Signup /> },
        { path: "*", element: <Navigate to={PATHS.signin} /> },
      ]
  );
}