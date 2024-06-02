import css from './Orders.module.scss';
import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductInOrder } from '../../components/ProductInOrder/ProductInOrder';
import { Loader } from '../../components/Loader/Loader';
import { getTotalCost } from '../../utils';
import {
  useFetchOrdersQuery,
  useDeleteOrderMutation,
  useEditOrderMutation,
} from '../../redux';
import { OrderType, ProductType } from '../../../@types/custom';

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');

  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const { data, isLoading, refetch } = useFetchOrdersQuery(params);
  const orders = data?.orders;
  const lowStock = data?.lowStock;
  const totalIncome = data?.totalIncome;

  const [deleteOrder, { isLoading: isDeleteOrderLoading }] =
    useDeleteOrderMutation();
  const [editOrder, { isLoading: isEditOrderLoading }] = useEditOrderMutation();

  const customer = { _id: 'ygaytauyay667ayuu', email: '', role: 'ADMIN' };

  async function payOrder(id: string) {
    try {
      const data = { id, body: { paid: true } };
      await editOrder(data).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelOrder(id: string) {
    try {
      await deleteOrder(id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateOrder(products: ProductType[], id?: string) {
    try {
      const data = {
        id,
        body: { totalCost: getTotalCost(products as []), products },
      };
      await editOrder(data).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  function increment(quantity: number, orderId?: string, productId?: string) {
    const tempProductsArray: ProductType[] = [
      ...orders.find((el: OrderType) => el._id === orderId).products,
    ];

    const filterfedProductArray = tempProductsArray.map((item) => {
      if (item._id === productId) {
        const temp = { ...item };
        temp.amount = quantity;
        return temp;
      }
      return item;
    });

    updateOrder(filterfedProductArray, orderId);
  }

  function deleteProductFromOrder(
    e: React.FormEvent,
    orderId: string,
    productId: string,
  ) {
    e.preventDefault();

    const tempProductsArray: ProductType[] = [
      ...orders.find((el: OrderType) => el._id === orderId).products,
    ];
    if (tempProductsArray.length === 1) {
      cancelOrder(orderId);
      return;
    }

    const filterfedProductArray = tempProductsArray.filter(
      (item) => item._id !== productId,
    );

    updateOrder(filterfedProductArray, orderId);
  }

  function datePickerHandler(e: React.FormEvent) {
    e.preventDefault();
    let newparams = { ...params };

    const target = e.target as HTMLFormElement;
    const elementsCollection =
      target.elements as HTMLCollectionOf<HTMLInputElement>;
    Array.from(elementsCollection).forEach((el) => {
      if (el.nodeName === 'INPUT' && el.value) {
        newparams[el.name] = el.value;
      }
    });

    setSearchParams(newparams);
  }

  return (
    <div className={css.orderWrapper}>
      {isLoading ||
        isEditOrderLoading ||
        (isDeleteOrderLoading && <Loader></Loader>)}
      <div>
        <form
          onSubmit={datePickerHandler}
          id="dateform"
          className={css.dateRangeForm}
        >
          <fieldset>
            <legend>Date Range</legend>
            <div>
              <label>
                From
                <input type="date" name="from" />
              </label>
              <label>
                To
                <input type="date" name="to" />
              </label>
            </div>
          </fieldset>
          <button
            type="reset"
            form="dateform"
            onClick={() => setSearchParams(query ? { query } : {})}
          >
            Clear
          </button>
          <button type="submit" onClick={() => false}>
            Search
          </button>
        </form>
        {totalIncome && (
          <>
            <p>
              Total Income:
              <b>{totalIncome} $</b>
            </p>
          </>
        )}

        {lowStock && lowStock.length > 0 && (
          <>
            <b> Attention!</b>
            <h2>Low stock:</h2>
            <ul>
              {lowStock.map((product: ProductType) => (
                <li key={product._id}>
                  <p>{product.name}:</p>
                  &nbsp;
                  <p>{product.quantity}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {orders?.length > 0 && !isLoading ? (
        <ul className={css.orderList}>
          {orders.map((el: OrderType) => (
            <li key={el._id} className={css.order}>
              {!el.paid && (
                <div>
                  <button
                    type="button"
                    onClick={() => cancelOrder(el._id as string)}
                  >
                    Cancel order
                  </button>
                  <button
                    type="button"
                    onClick={() => payOrder(el._id as string)}
                  >
                    Pay order
                  </button>
                </div>
              )}
              <p>number: {el.number}</p>
              {customer?.role === 'ADMIN' && <p>Placed: {el.customer?.name}</p>}

              <p>
                created at: {el.date.toString().slice(0, 19).replace('T', ', ')}
              </p>

              <ul className={css.productListinOrder}>
                {el.products.map((product) => (
                  <li key={product?._id}>
                    <ProductInOrder
                      increment={increment}
                      orderId={el._id as string}
                      product={product}
                      deleteProductFromOrder={deleteProductFromOrder}
                      isOrderPaid={el.paid}
                    />
                  </li>
                ))}
              </ul>

              <p>
                Total: <b>{el.totalCost || 0} $</b>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={css.noResults}>
          <h2>There are no orders</h2>
          <button type="button" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      )}
    </div>
  );
};
export default Orders;
