import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://nodered-5709-6651e6ef40bae411000001f5.ubos.tech';

export const productApi = createApi({
  reducerPath: 'product',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: (params) => ({
        url: '/get-all-products/',
        params,
      }),
      providesTags: ['Product'],
    }),
    fetchProductById: builder.query({
      query: (id) => `/get-product/${id}`,
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: '/postProduct/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    editProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
  tagTypes: ['Product'],
});

export const {
  useFetchProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
} = productApi;
