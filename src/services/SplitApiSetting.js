import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SplitApiSettings = createApi({
  baseQuery: fetchBaseQuery({
    //prepare headers work need to be done
    prepareHeaders: async (headers, { getState }) => {
      try {
        const token = getState().auth?.token;
        // if (token) {
        headers.set("authorization", `Bearer ${token}`);
        headers.set("accept", "application/json");
        // headers.set("Content-Type", "application/x-www-form-urlencoded");
        // } else {
        //   headers.set("authorization", "");
        // }
      } catch (err) {
        headers.set("authorization", "");
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [],
});