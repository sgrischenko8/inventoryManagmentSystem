import css from './Catalog.module.scss';
import { useState, useEffect, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import MultiRangeSlider from 'multi-range-slider-react';
import { Loader } from '../../components/Loader/Loader';
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { Modal } from '../../components/Modal/Modal';
import { ProductForm } from '../../components/ProductForm/ProductForm';
import { CatalogCard } from '../../components/CatalogCard/CatalogCard';

import sprite from '../../images/sprite.svg';
import {
  useFetchCategoriesQuery,
  useFetchProductsQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
} from '../../redux';

import { CategoryType, ProductType } from '../../../@types/custom';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query');

  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  const {
    data: category,
    isLoading,
    refetch: refetchCategory,
  } = useFetchCategoriesQuery(true);

  const {
    data,
    isLoading: isProductLoading,
    refetch,
  } = useFetchProductsQuery(params ? params : undefined);
  const products = data?.products;
  const top5 = data?.top5;

  const [addCategory, { isLoading: isAddCategoryLoading }] =
    useAddCategoryMutation();
  const [deleteCategory, { isLoading: isDeleteCategoryLoading }] =
    useDeleteCategoryMutation();
  const [editCategory, { isLoading: isEditCategoryLoading }] =
    useEditCategoryMutation();

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [renamedCategory, setRenamedCategory] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  function isChecked(value: string): boolean {
    const temp = params.category;
    return temp && temp.includes(value) ? true : false;
  }

  function getPriceValue() {
    const temp = +params.price_min;
    return temp ? temp : 0;
  }

  function getHighestPrice(): number {
    if (!products) {
      return 10000;
    }
    const numbers = products.map((obj: { price: number }) => obj.price);
    return Math.max(...numbers);
  }

  const [minValue, setMinValue] = useState<number>(getPriceValue());
  const [maxValue, setMaxValue] = useState<number>();

  useEffect(() => {
    if (maxValue && maxValue >= getHighestPrice()) {
      return;
    }

    setMaxValue(getHighestPrice());
  }, [params]);

  function onChangeHandler(value: string) {
    let newparams: { category?: string } = {};
    let temp: string = params.category;

    if (temp && temp.includes(value)) {
      const t = temp
        .replace(`&category=${value}`, '')
        .replace(`${value}&category=`, '')
        .replace(value, '');
      newparams = {
        ...params,
        category: t,
      };
      if (t === '') {
        delete newparams.category;
      }
    } else {
      newparams = {
        ...params,
        category: temp ? temp + `&category=` + value : value,
      };
    }

    setSearchParams(newparams);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e?.preventDefault();

    let tempPrice: URLSearchParamsInit = {};
    if (minValue !== 0) {
      tempPrice.price_min = minValue.toString();
    }
    if (maxValue !== getHighestPrice()) {
      tempPrice.price_max = maxValue
        ? maxValue.toString()
        : getHighestPrice().toString();
    }

    setSearchParams({ ...params, ...tempPrice });

    // let newparams: URLSearchParamsInit = {};
    // newparams = {
    //   ...params,
    // };

    // if (newparams.price_min || newparams.price_max) {
    //   newparams.price_max = maxValue;
    //   newparams.price_min = minValue;
    //   setSearchParams(newparams);
    // }
  };

  async function editCategoryHandler(e: React.FocusEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value: string = target.value;
    if (value.trim() === '' || category.includes(value)) {
      setEditCategoryId('');
      return;
    }

    try {
      const data = { id: editCategoryId, body: { name: target.value } };
      await editCategory(data).unwrap();

      refetchCategory();
    } catch (error) {
      console.log(error);
    }
    setEditCategoryId('');
  }

  async function addCategoryHandler(e: React.FocusEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value: string = target.value;

    if (value.trim() === '' || category.includes(value)) {
      setShowNewCategory(false);
      return;
    }
    try {
      await addCategory({ name: value }).unwrap();
      refetchCategory();
    } catch (error) {
      console.log(error);
    }
    setShowNewCategory(false);
  }

  async function deleteCategoryHandler(e: React.FormEvent) {
    e.preventDefault();

    try {
      await deleteCategory(categoryId);
      setCategoryId('');
      refetchCategory();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {(isLoading ||
        isProductLoading ||
        isAddCategoryLoading ||
        isDeleteCategoryLoading ||
        isEditCategoryLoading) && <Loader />}
      {!isLoading && products && (
        <div className={css.catalogWrapper}>
          <aside>
            {categoryId && (
              <Modal onClose={() => setCategoryId('')}>
                <></>
                <DeleteConfirmationModal
                  subject={'category'}
                  onSubmit={deleteCategoryHandler}
                  onClose={() => setCategoryId('')}
                />
              </Modal>
            )}
            <form
              onSubmit={handleSubmit}
              id="filter"
              className={css.filterCatalogForm}
            >
              {/* if role==='ADMIN' */}
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                title="Add new category"
              >
                +
              </button>

              <ul>
                {!editCategoryId &&
                  category?.map((el: CategoryType) => (
                    <li key={el._id}>
                      <button
                        type="button"
                        onClick={() =>
                          setCategoryId(el._id as unknown as string)
                        }
                        title="Delete Category"
                      >
                        X
                      </button>
                    </li>
                  ))}
              </ul>

              <ul>
                {!editCategoryId &&
                  category?.map((el: CategoryType, index: number) => (
                    <li key={el._id}>
                      <button
                        type="button"
                        title="Rename Category"
                        onClick={() => {
                          setRenamedCategory(category[index].name);
                          setEditCategoryId(el._id as unknown as string);
                        }}
                      >
                        <svg width={16} height={16}>
                          <use href={`${sprite}#edit`} />
                        </svg>
                      </button>
                    </li>
                  ))}
              </ul>
              {/* if role==='ADMIN' */}
              {/* -------- */}
              <fieldset>
                <legend>Categories:</legend>
                {category?.map((el: CategoryType) => (
                  <label key={el._id}>
                    {editCategoryId && editCategoryId === el._id ? (
                      <input
                        type="text"
                        name="renameCategory"
                        value={renamedCategory}
                        onChange={(e) => setRenamedCategory(e.target.value)}
                        onBlur={editCategoryHandler}
                        autoFocus
                      />
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          name="cat"
                          value={el._id}
                          checked={isChecked(el._id as string)}
                          onChange={() => onChangeHandler(el._id as string)}
                        />
                        {el.name}
                        {el?.amount ? ` (${el.amount})` : ''}
                      </>
                    )}
                  </label>
                ))}
                {showNewCategory && (
                  <input
                    type="text"
                    name="newCategory"
                    autoFocus
                    onBlur={addCategoryHandler}
                  />
                )}
              </fieldset>

              <fieldset className={css.priceSection}>
                <legend>Price</legend>
                <div>
                  <span>From</span>
                  <span>To</span>
                </div>

                <div>
                  <label>
                    <input
                      type="number"
                      name="price_min"
                      max={maxValue}
                      value={minValue}
                      onChange={(e) => {
                        if (maxValue && +e.target.value > maxValue) return;
                        setMinValue(+e.target.value);
                      }}
                      placeholder="0"
                      min="0"
                    />
                  </label>
                  <label>
                    <input
                      type="number"
                      name="price_max"
                      value={maxValue}
                      onChange={(e) => {
                        if (+e.target.value < minValue) return;
                        setMaxValue(+e.target.value);
                      }}
                      placeholder={getHighestPrice().toString()}
                      min={minValue}
                    />
                  </label>
                </div>
                <MultiRangeSlider
                  min={0}
                  max={getHighestPrice()}
                  minValue={minValue}
                  maxValue={maxValue}
                  onInput={(e) => {
                    setMinValue(e.minValue);
                    setMaxValue(e.maxValue);
                  }}
                  canMinMaxValueSame={true}
                  ruler={false}
                  label={false}
                  barLeftColor="#a7a5a3"
                  barInnerColor="#101010"
                  barRightColor="#a7a5a3"
                  thumbLeftColor="#101010"
                  thumbRightColor="#101010"
                  style={{ border: 'none', boxShadow: 'none', width: '100%' }}
                  className={css.priceRange}
                />
              </fieldset>
              <div>
                <button
                  type="reset"
                  form="filter"
                  onClick={() => {
                    setMinValue(0);
                    setMaxValue(getHighestPrice());
                    setSearchParams(query ? { query } : {});
                  }}
                >
                  Clear
                </button>
                <button type="submit" onClick={() => false}>
                  Search
                </button>
              </div>
            </form>

            {top5?.length > 0 && (
              <div className={css.top5}>
                <h3>Top 5 BestSellers</h3>
                <ul>
                  {top5.map((el: ProductType) => (
                    <li key={el._id}>
                      <CatalogCard item={el} short={true} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {query && products?.length === 0 ? (
            <p>No results</p>
          ) : (
            <section className={css.productSection}>
              <button
                type="submit"
                onClick={() => setShowAddProductModal(true)}
                title="Add Product"
              >
                + Add Product
              </button>

              <ul className={css.productsList}>
                {products?.map((el: ProductType) => (
                  <li key={el._id}>
                    <CatalogCard item={el} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {showAddProductModal && (
        <Modal onClose={() => setShowAddProductModal(false)}>
          <></>
          <ProductForm
            onClose={() => setShowAddProductModal(false)}
            refetch={refetch}
          />
        </Modal>
      )}
    </>
  );
};

export default Catalog;
