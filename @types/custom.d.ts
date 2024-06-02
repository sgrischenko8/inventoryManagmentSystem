/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

enum Role {
  'ADMIN',
  'USER',
}

export type CustomerType = {
  _id?: string;
  name: string;
  role: string[Role];
};

export type CategoryType = {
  _id?: string;
  name: string;
  amount?: number;
};

export type ProductType = {
  category: CategoryType;
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  amount?: number;
};

export type OrderType = {
  customer: CustomerType;
  date: Date;
  _id?: string;
  number: number;
  products: ProductType[];
  totalCost?: number;
  paid: boolean;
  totalIncome?: string;
};
