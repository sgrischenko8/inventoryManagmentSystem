import css from './CatalogCard.module.scss';
import { Link } from 'react-router-dom';
import { ProductType } from '../../../@types/custom';

interface CatalogCardProps {
  item: ProductType;
  short?: boolean;
}

export const CatalogCard = ({ item, short }: CatalogCardProps) => {
  const { _id, name, price, quantity, category } = item;
  const image = 'https://loremflickr.com/640/480/';

  return (
    <Link to={`/${_id}`} className={css.catalogCard}>
      <img
        src={image + name}
        alt={name}
        width={200}
        height={150}
        loading="lazy"
      />
      <h4> {name}</h4>
      {!short && (
        <>
          <p>
            Category: <b>{category?.name as string}</b>
          </p>
          <p>₴ {price}</p>
          <p>Amount: {quantity}</p>
        </>
      )}
    </Link>
  );
};
