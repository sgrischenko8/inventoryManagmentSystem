import { useState } from 'react';
import { Increment } from '../Increment/Increment';
import { Modal } from '../Modal/Modal';
import { ProductType } from '../../../@types/custom';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal/DeleteConfirmationModal';

interface ProductInOrderProps {
  increment: (quantity: number, orderId?: string, productId?: string) => void;
  product: ProductType;
  orderId: string;
  deleteProductFromOrder: (
    e: React.FormEvent,
    orderId: string,
    productId: string,
  ) => void;
  isOrderPaid: boolean;
}

export const ProductInOrder = ({
  increment,
  product,
  orderId,
  deleteProductFromOrder,
  isOrderPaid,
}: ProductInOrderProps) => {
  const [amount, setAmount] = useState<number>(product.amount as number);
  const [productId, setProductId] = useState('');

  return (
    <>
      {!isOrderPaid && (
        <Increment
          increment={increment}
          quantity={amount}
          limit={product.quantity}
          orderId={orderId}
          productId={product._id}
          setAmount={setAmount}
        />
      )}

      <h4>{product.name}</h4>
      <p> &nbsp; - &nbsp; </p>
      <p>{product.amount} piece(s)</p>
      {!isOrderPaid && (
        <button
          type="button"
          onClick={() => setProductId(product._id as string)}
          title="Delete the Product from the Order"
        >
          X
        </button>
      )}

      {productId && (
        <Modal onClose={() => setProductId('')}>
          <></>
          <DeleteConfirmationModal
            subject={'product from the order'}
            onSubmit={(e: React.FormEvent) => {
              setProductId('');
              deleteProductFromOrder(e, orderId, product._id as string);
            }}
            onClose={() => setProductId('')}
          />
        </Modal>
      )}
    </>
  );
};
