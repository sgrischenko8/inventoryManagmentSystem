import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://nodered-5709-6651e6ef40bae411000001f5.ubos.tech';

export const categoryApi = createApi({
  reducerPath: 'category',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: (params) => `/get-all-category?needAmount=${params}`,
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: '/postCategory',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/delete-category/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    editCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-category/${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
  tagTypes: ['Category'],
});

export const {
  useFetchCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} = categoryApi;
