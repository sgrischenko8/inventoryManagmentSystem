import css from './ProductForm.module.scss';
import { ChangeEvent, useState } from 'react';
import {
  useAddProductMutation,
  useFetchCategoriesQuery,
  useEditProductMutation,
} from '../../redux';
import { Loader } from '../Loader/Loader';
import { ProductType, CategoryType } from '../../../@types/custom';

interface ProductFormProps {
  onClose: () => void;
  refetch?: () => void;
  product?: ProductType;
}

export const ProductForm = ({
  onClose,
  refetch,
  product,
}: ProductFormProps) => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: isEditProductLoading }] =
    useEditProductMutation();

  const { data: categories, isLoading: isCategoryLoading } =
    useFetchCategoriesQuery(false);

  const [name, setName] = useState<string | undefined>(product?.name);
  const [quantity, setQuantity] = useState<number | undefined>(
    product?.quantity,
  );
  const [price, setPrice] = useState<number | undefined>(product?.price);
  const [categoryIndex, setCategoryIndex] = useState<number>(
    categories?.findIndex(
      (el: CategoryType) => product?.category?._id === el._id,
    ),
  );

  type Fields = {
    name?: string;
    quantity?: number;
    price?: number;
  };
  const fields: Fields = { name, quantity, price };

  const title = product ? 'Edit Product' : 'Add Product';

  function changeHandler(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    const inputName = target.name;

    if (inputName === 'name') {
      setName(value);
    }
    if (inputName === 'quantity') {
      setQuantity(+value);
    }
    if (inputName === 'price') {
      setPrice(+value);
    }
  }

  function changeSelectHandler(e: ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement;
    const index = target.selectedIndex;

    setCategoryIndex(index);
  }

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const elementsCollection =
      target.elements as HTMLCollectionOf<HTMLInputElement>;
    const elements = Array.from(elementsCollection).filter((el) => el.name);

    type dataObject = {
      [key: string]: string | undefined | CategoryType;
    };

    const body: dataObject = {};

    elements.map((el) => {
      body[el.name] =
        el.name === 'category'
          ? categories[categoryIndex]
          : el.name === 'name'
          ? el.value
          : +el.value;
    });

    try {
      if (product) {
        const data = { id: product._id, body };
        await editProduct(data).unwrap();
      } else {
        await addProduct(body).unwrap();
      }
      onClose();
      refetch && refetch();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={submitHandler} className={css.formEditProduct}>
      {Object.keys(fields).map((key) => (
        <label key={key}>
          {key}:
          <input
            type={key === 'name' ? 'text' : 'number'}
            name={key}
            placeholder={`Enter the ${key}`}
            value={fields[key as keyof Fields]}
            onChange={changeHandler}
            autoFocus={key === 'name' && !product}
            step={key === 'price' ? '0.01' : '1'}
            min={key === 'quantity' ? 1 : undefined}
            required
          />
        </label>
      ))}
      <fieldset>
        Category:{' '}
        <select
          name="category"
          value={
            categories && (categories[categoryIndex]?.name as unknown as string)
          }
          onChange={changeSelectHandler}
        >
          {categories?.map((el: CategoryType, index: number) => (
            <option value={el.name} key={index}>
              {el.name}
            </option>
          ))}
        </select>
      </fieldset>
      <button
        type="submit"
        title={title}
        disabled={isLoading}
        onClick={() => false}
      >
        {title}
      </button>
      {isLoading ||
        ((isCategoryLoading || isEditProductLoading) && <Loader></Loader>)}
    </form>
  );
};
