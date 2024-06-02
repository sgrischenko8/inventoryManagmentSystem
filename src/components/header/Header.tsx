import css from './Header.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { orderApi } from '../../redux';
import { NavLink } from 'react-router-dom';
import sprite from '../../images/sprite.svg';
import { SearchBar } from './SearchBar/SearchBar';
import { OrderType } from '../../../@types/custom';
import { useState } from 'react';

export const Header = () => {
  const orders = useSelector(
    (state: RootState) =>
      orderApi.endpoints.fetchOrders.select(undefined)(state)?.data,
  );
  const counter = orders?.orders?.filter((el: OrderType) => !el.paid).length;

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <header className={css.header}>
      <div>
        <nav>
          <NavLink to={'/'} title="To inventory">
            Products
          </NavLink>
          <NavLink to={'/orders'} title={'To orders'}>
            Orders
            {!!counter && <span>{counter}</span>}
          </NavLink>
        </nav>
        <SearchBar />
        <button
          type="button"
          title="Change Role"
          onClick={() => setIsAdmin(!isAdmin)}
        >
          <svg width={20} height={20} fill="white">
            <use href={`${sprite}#${isAdmin ? 'logout' : 'key'}`} />
          </svg>
        </button>
      </div>
    </header>
  );
};
