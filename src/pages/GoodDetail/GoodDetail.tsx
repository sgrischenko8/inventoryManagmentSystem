import css from './GoodDetail.module.scss';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CatalogCard } from '../../components/CatalogCard/CatalogCard';
import { Loader } from '../../components/Loader/Loader';
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { Modal } from '../../components/Modal/Modal';
import { ProductForm } from '../../components/ProductForm/ProductForm';
import { Increment } from '../../components/Increment/Increment';
import { getTotalCost } from '../../utils';
import {
  useFetchProductByIdQuery,
  useDeleteProductMutation,
  useFetchOrdersQuery,
  useAddOrderMutation,
  useEditOrderMutation,
} from '../../redux';
import { ProductType, OrderType } from '../../../@types/custom';

const GoodDetail = () => {
  const { goodId } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useFetchProductByIdQuery(goodId);
  const [deleteProduct, { isLoading: isDeletingLoading }] =
    useDeleteProductMutation();

  const {
    data,
    isLoading: isOrdersLoading,
    refetch,
  } = useFetchOrdersQuery(undefined);
  const orders = data?.orders;

  const [addOrder, { isLoading: isAddOrderLoading }] = useAddOrderMutation();
  const [editOrder, { isLoading: isEditOrderLoading }] = useEditOrderMutation();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(1);

  async function placeOrder() {
    const currentOrder = orders.find((order: OrderType) => !order.paid);
    const productCopy = { ...product };

    try {
      if (currentOrder) {
        const currentOrderCopy = { ...currentOrder };
        currentOrderCopy.products = [...currentOrderCopy.products];

        let i;
        const currentProduct = currentOrderCopy.products.find(
          (el: ProductType, index: number) => {
            if (el._id === goodId) {
              i = index;
              return true;
            }
          },
        );

        if (currentProduct) {
          const updatedProduct = {
            ...currentProduct,
            amount: currentProduct.amount + amount,
          };
          currentOrderCopy.products[i as unknown as number] = updatedProduct;
        } else {
          productCopy.amount = amount;
          currentOrderCopy.products.push(productCopy);
        }
        currentOrderCopy.totalCost = getTotalCost(currentOrderCopy.products);
        delete currentOrderCopy._id;
        await editOrder({
          id: currentOrder._id,
          body: currentOrderCopy,
        }).unwrap();
        return;
      } else {
        const body: OrderType | any = {};
        body.date = new Date();
        body.paid = false;
        body.products = [productCopy];
        body.products[0].amount = amount;
        body.totalCost = amount * product.price;
        await addOrder(body);
      }
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
      setAmount(1);
    }
  }

  function increment(amount: number) {
    setAmount(amount);
  }

  async function onDeleteSubmit(e: React.FormEvent) {
    e.preventDefault();
    await deleteProduct(product._id);
    navigate(-1);
  }
  return (
    <>
      {isLoading ||
        isAddOrderLoading ||
        isEditOrderLoading ||
        isDeletingLoading ||
        (isOrdersLoading && <Loader />)}
      {product ? (
        <>
          <CatalogCard item={product} />
          <div className={css.btnBox}>
            <Increment
              increment={increment}
              quantity={amount}
              limit={product.quantity}
            />
            <button
              type="button"
              onClick={() => placeOrder()}
              title="Add to Order"
              disabled={!orders}
            >
              Add to Order
            </button>
            {/* // ---if role===admin */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              title="Edit Product"
            >
              Edit Product
            </button>
            <button type="button" onClick={() => setShowModal(true)}>
              Del Product
            </button>
          </div>
          {/* // ---if role===admin */}
          {/* // ------------------ */}
          {showEditModal && (
            <Modal onClose={() => setShowEditModal(false)}>
              <></>
              <ProductForm
                onClose={() => setShowEditModal(false)}
                product={product}
              />
            </Modal>
          )}
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <></>
              <DeleteConfirmationModal
                subject={'product'}
                onSubmit={onDeleteSubmit}
                onClose={() => setShowModal(false)}
              />
            </Modal>
          )}
        </>
      ) : (
        <h2>This product no longer exist</h2>
      )}
    </>
  );
};

export default GoodDetail;
