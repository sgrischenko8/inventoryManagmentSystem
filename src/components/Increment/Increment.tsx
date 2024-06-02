import css from './Increment.module.scss';

interface IncrementProps {
  increment: (quantity: number, orderId?: string, productId?: string) => void;
  quantity: number;
  limit: number;
  orderId?: string;
  productId?: string;
  setAmount?: (arg0: number) => void;
}

export const Increment = ({
  increment,
  quantity = 1,
  limit,
  orderId,
  productId,
  setAmount,
}: IncrementProps) => {
  function incrementHandle(payload: number) {
    const sum = payload + quantity;
    if (sum === 0 || sum > limit) {
      return;
    }
    increment(sum, orderId, productId);
    setAmount && setAmount(sum);
  }

  return (
    <div className={css.increment}>
      <button type="button" onClick={() => incrementHandle(-1)}>
        -
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={() => incrementHandle(1)}>
        +
      </button>
    </div>
  );
};
