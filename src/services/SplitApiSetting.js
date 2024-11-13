import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import PATHS from '../routes/Paths';
import { userLogout } from '../redux/AuthSliceQist';

const baseQuery = fetchBaseQuery({
  prepareHeaders: async (headers, { getState }) => {
    try {
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('accept', 'application/json');
      } else {
        headers.set('authorization', '');
      }
    } catch (err) {
      headers.set('authorization', '');
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status == 403) {
    api.dispatch(userLogout(null));
    window.location.replace(PATHS.signin);
  }
  return result;
};

export const SplitApiSettings = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: []
});