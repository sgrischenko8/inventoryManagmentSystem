import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://nodered-5709-6651e6ef40bae411000001f5.ubos.tech';

export const orderApi = createApi({
  reducerPath: 'order',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fetchOrders: builder.query({
      query: (params) => ({
        url: '/get-all-orders/',
        params,
      }),
    }),
    addOrder: builder.mutation({
      query: (body) => ({
        url: '/postOrder',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/delete-order/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    editOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-order/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
  tagTypes: ['Order'],
});

export const {
  useFetchOrdersQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useEditOrderMutation,
} = orderApi;
