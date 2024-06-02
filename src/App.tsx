import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import './App.scss';

const Catalog = lazy(() => import('./pages/Catalog/Catalog'));
const GoodDetail = lazy(() => import('./pages/GoodDetail/GoodDetail'));
const Orders = lazy(() => import('./pages/Orders/Orders'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Catalog />} />

        <Route path="orders" element={<Orders />} />
        <Route path=":goodId" element={<GoodDetail />} />
        <Route path="*" element={<Catalog />} />
      </Route>
    </Routes>
  );
}

export default App;
