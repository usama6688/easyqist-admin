export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const BASE_URL_IMAGES = process.env.REACT_APP_BASE_URL_IMAGES;

export const API_END_POINTS = {
  /////////////////////////////<===MUTATIONS===>//////////////////////////////
  loginUser: BASE_URL + "admin/login",
  deleteCategory: BASE_URL + "category/delete",
  addCategory: BASE_URL + "category/add",
  editCategory: BASE_URL + "category/edit",
  deleteBrand: BASE_URL + "brand/delete",
  deleteProduct: BASE_URL + "product/delete",
  addProduct: BASE_URL + "product/add",
  editProduct: BASE_URL + "product/edit",
  editProductImages: BASE_URL + "productimage/edit",
  addProductImages: BASE_URL + "productimage/add",
  addProductType: BASE_URL + "producttype/add",
  editProductType: BASE_URL + "producttype/edit",
  addProductInstallment: BASE_URL + "productinstallment/add",
  editProductInstallment: BASE_URL + "productinstallment/edit",
  deleteProductImage: BASE_URL + "productimage/delete",
  changeOrderStatus: BASE_URL + "change_order_status",
  addBanner: BASE_URL + "banner/add",
  addBrand: BASE_URL + "brand/add",
  editBrand: BASE_URL + "brand/edit",
  addThumbnail: BASE_URL + "upload/thumbnail",
  addProductImage: BASE_URL + "upload/image",
  addPayment: BASE_URL + "add_order_payment",
  deleteBanner: BASE_URL + "banner/delete",
  editBanner: BASE_URL + "banner/edit",
  deleteEmployee: BASE_URL + "employment/delete",
  addEmployee: BASE_URL + "employment/add",
  editEmployee: BASE_URL + "employment/edit",
  employmentAssign: BASE_URL + "employment/assign",
  deleteType: BASE_URL + "producttype/delete",
  deletePlan: BASE_URL + "productinstallment/delete",
  addCustomer: BASE_URL + "customer/add",
  editCustomer: BASE_URL + "customer/edit",
  deleteCustomer: BASE_URL + "customer/delete",
  sendMessage: BASE_URL + "send/msg",
  addAdmin: BASE_URL + "admin/register",
  editAdmin: BASE_URL + "admin/edit2",
  deleteAdmin: BASE_URL + "admin/delete2",
  deleteUser: BASE_URL + "delete-user",
  deleteOrder: BASE_URL + "order/delete",
  /////////////////////////////<===QUERIES===>////////////////////////////////
  getBrands: BASE_URL + "get-brand",
  getProductCat: BASE_URL + "get-category",
  getUser: BASE_URL + "get-all-user",
  getProducts: BASE_URL + "getallproduct2",
  RejectedOrApproved: BASE_URL + "get-category",
  viewOrderRequest: BASE_URL + "view_order_listing",
  getAllProducts: BASE_URL + "getallproductcategory2",
  getBanners: BASE_URL + "get-banner",
  viewOrderHistory: BASE_URL + "view_order_history",
  viewPaymentHistory: BASE_URL + "view_order_payment",
  viewProductDetail: BASE_URL + "getProductDetail2",
  getEmployees: BASE_URL + "employment",
  viewOrderDetail: BASE_URL + "view_order_detail",
  viewDashboardCounts: BASE_URL + "counter",
  getCustomers: BASE_URL + "customer/list",
  getAdmins: BASE_URL + "admin/listing",
  chartData: BASE_URL + "Order/graph",
};