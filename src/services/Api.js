import { SplitApiSettings } from "./SplitApiSetting";
import { API_END_POINTS } from "./ApiEndpoints";

export const api = SplitApiSettings.injectEndpoints({
  reducerPath: "api",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    /////////////////////////////<===MUTATIONS===>//////////////////////////////
    loginUser: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.loginUser,
        method: "POST",
        body: data,
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteCategory}?id=${data}`,
        method: "GET",
      }),
    }),

    deleteProductImage: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteProductImage}?id=${data}`,
        method: "GET",
      }),
    }),

    addCategory: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addCategory,
        method: "POST",
        body: data,
      }),
    }),

    addBrand: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addBrand,
        method: "POST",
        body: data,
      }),
    }),

    editBrand: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editBrand,
        method: "POST",
        body: data,
      }),
    }),

    editCategory: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editCategory,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteProduct}?id=${data}`,
        method: "GET",
      }),
    }),

    deleteBrand: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteBrand}?id=${data}`,
        method: "GET",
      }),
    }),

    deleteUser: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteUser}?id=${data}`,
        method: "GET",
      }),
    }),

    isRejectedOrApproved: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.RejectedOrApproved}?id=${data}`,
        method: "GET",
      }),
    }),

    addProduct: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addProduct,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    editProduct: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editProduct,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    editProductImages: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editProductImages,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    addProductImages: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addProductImages,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    addProductType: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addProductType,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    editProductType: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editProductType,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    addProductInstallment: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addProductInstallment,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    editProductInstallment: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editProductInstallment,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: data,
      }),
    }),

    changeOrderStatus: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.changeOrderStatus,
        method: "POST",
        body: data,
      }),
    }),

    addBanner: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addBanner,
        method: "POST",
        body: data,
      }),
    }),

    addThumbnail: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addThumbnail,
        method: "POST",
        body: data,
      }),
    }),

    addProductImage: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addProductImage,
        method: "POST",
        body: data,
      }),
    }),

    addPayment: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addPayment,
        method: "POST",
        body: data,
      }),
    }),

    deleteBanner: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteBanner}?id=${data}`,
        method: "GET",
      }),
    }),

    editBanner: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editBanner,
        method: "POST",
        body: data,
      }),
    }),

    deleteEmployee: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteEmployee}?id=${data}`,
        method: "GET",
      }),
    }),

    deleteType: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteType}?id=${data}`,
        method: "GET",
      }),
    }),

    deletePlan: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deletePlan}?id=${data}`,
        method: "GET",
      }),
    }),

    addEmployee: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addEmployee,
        method: "POST",
        body: data,
      }),
    }),

    editEmployee: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editEmployee,
        method: "POST",
        body: data,
      }),
    }),

    employmentAssign: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.employmentAssign,
        method: "POST",
        body: data,
      }),
    }),

    addCustomer: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addCustomer,
        method: "POST",
        body: data,
      }),
    }),

    deleteCustomer: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteCustomer}?id=${data}`,
        method: "GET",
      }),
    }),

    editCustomer: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editCustomer,
        method: "POST",
        body: data,
      }),
    }),

    sendMessage: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.sendMessage,
        method: "POST",
        body: data,
      }),
    }),

    addAdmin: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addAdmin,
        method: "POST",
        body: data,
      }),
    }),

    editAdmin: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.editAdmin,
        method: "POST",
        body: data,
      }),
    }),

    deleteAdmin: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.deleteAdmin}?id=${data}`,
        method: "GET",
      }),
    }),

    deleteOrder: builder.mutation({
      query: ({ data }) => {
        return {
          url: `${API_END_POINTS.deleteOrder}?order_id=${data}`,
          method: "GET",
        }
      },
    }),

    deleteRequestedProduct: builder.mutation({
      query: ({ data }) => {
        return {
          url: `${API_END_POINTS.deleteRequestedProduct}?id=${data}`,
          method: "DELETE",
        }
      },
    }),

    changeProductStatus: builder.mutation({
      query: ({ data }) => {
        return {
          url: API_END_POINTS.changeProductStatus,
          method: "POST",
          body: data,
        }
      },
    }),

    newUser: builder.mutation({
      query: ({ data }) => {
        return {
          url: API_END_POINTS.newUser,
          method: "POST",
          body: data,
        }
      },
    }),

    addToCart: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.addToCart,
        method: "POST",
        body: data,
      }),
    }),

    proceed: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.proceed,
        method: "POST",
        body: data,
      }),
    }),

    changeUserStatus: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.changeUserStatus,
        method: "POST",
        body: data,
      }),
    }),

    /////////////////////////////<===QUERIES===>////////////////////////////////

    getBrands: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getBrands,
          method: "GET",
          params,
        };
      },
    }),

    getProductCat: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.getProductCat,
          method: "GET",
        };
      },
    }),

    getProducts: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getProducts,
          method: "GET",
          params,
        };
      },
    }),

    getAllProducts: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getAllProducts,
          method: "GET",
          params,
        };
      },
    }),

    getUser: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getUser,
          method: "GET",
          params,
        };
      },
    }),

    viewOrderRequest: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewOrderRequest,
          method: "GET",
          params,
        };
      },
    }),

    viewPaymentHistory: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewPaymentHistory,
          method: "GET",
          params,
        };
      },
    }),

    getBanners: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.getBanners,
          method: "GET",
        };
      },
    }),

    viewOrderHistory: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewOrderHistory,
          method: "GET",
          params,
        };
      },
    }),

    viewProductDetail: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewProductDetail,
          method: "GET",
          params,
        };
      },
    }),

    getEmployees: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.getEmployees,
          method: "GET",
        };
      },
    }),

    viewOrderDetail: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewOrderDetail,
          method: "GET",
          params
        };
      },
    }),

    viewDashboardCounts: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.viewDashboardCounts,
          method: "GET",
        };
      },
    }),

    getCustomers: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.getCustomers,
          method: "GET",
        };
      },
    }),

    getAdmins: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getAdmins,
          method: "GET",
          params,
        };
      },
    }),

    chartData: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.chartData,
          method: "GET",
        };
      },
    }),

    requestedProducts: builder.query({
      query: () => {
        return {
          url: API_END_POINTS.requestedProducts,
          method: "GET",
        };
      },
    }),

    requestedProductDetail: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.requestedProductDetail,
          method: "GET",
          params,
        };
      },
    }),

    getProductDetails: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.getProductDetails,
          method: "GET",
          params,
        };
      },
    }),

    viewCartOrders: builder.query({
      query: ({ params }) => {
        return {
          url: API_END_POINTS.viewCartOrders,
          method: "GET",
          params,
        };
      },
    }),

  }),

  overrideExisting: true,
});

export const {
  /////////////////////////////<===MUTATIONS===>//////////////////////////////
  useLoginUserMutation,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useDeleteBrandMutation,
  useDeleteUserMutation,
  useIsRejectedOrApprovedMutation,
  useDeleteProductMutation,
  useAddProductMutation,
  useChangeOrderStatusMutation,
  useAddBannerMutation,
  useAddBrandMutation,
  useAddThumbnailMutation,
  useAddProductImageMutation,
  useDeleteProductImageMutation,
  useEditBrandMutation,
  useAddPaymentMutation,
  useEditProductMutation,
  useEditProductImagesMutation,
  useAddProductImagesMutation,
  useAddProductTypeMutation,
  useEditProductTypeMutation,
  useAddProductInstallmentMutation,
  useEditProductInstallmentMutation,
  useDeleteBannerMutation,
  useEditBannerMutation,
  useDeleteEmployeeMutation,
  useDeleteTypeMutation,
  useDeletePlanMutation,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
  useEmploymentAssignMutation,
  useAddCustomerMutation,
  useEditCustomerMutation,
  useDeleteCustomerMutation,
  useSendMessageMutation,
  useAddAdminMutation,
  useEditAdminMutation,
  useDeleteAdminMutation,
  useDeleteOrderMutation,
  useDeleteRequestedProductMutation,
  useChangeProductStatusMutation,
  useNewUserMutation,
  useAddToCartMutation,
  useProceedMutation,
  useChangeUserStatusMutation,
  /////////////////////////////<===QUERIES===>////////////////////////////////
  useGetBrandsQuery,
  useGetProductCatQuery,
  useGetProductsQuery,
  useGetAllProductsQuery,
  useGetUserQuery,
  useViewOrderRequestQuery,
  useGetBannersQuery,
  useViewOrderHistoryQuery,
  useViewPaymentHistoryQuery,
  useViewProductDetailQuery,
  useGetEmployeesQuery,
  useViewOrderDetailQuery,
  useViewDashboardCountsQuery,
  useGetCustomersQuery,
  useGetAdminsQuery,
  useChartDataQuery,
  useRequestedProductsQuery,
  useRequestedProductDetailQuery,
  useGetProductDetailsQuery,
  useViewCartOrdersQuery,
} = api;