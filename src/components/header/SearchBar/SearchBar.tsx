import css from './SearchBar.module.scss';
import sprite from '../../../images/sprite.svg';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const params = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const input = target[0] as HTMLInputElement;

    setSearchParams({ name: input.value });
  }

  const handleChangeInput = (value: string) => {
    const newParams: { query?: string } = { ...params };

    if (value) {
      newParams.query = value;
    } else {
      delete newParams.query;
    }

    setSearchParams(newParams);
  };

  return (
    <>
      <search>
        <form
          className={css.search}
          onSubmit={handleSubmit}
          style={{
            boxShadow: query ? '1px 1px 7px 0 #c6b89e' : '',
            background: query ? '#fff' : '#F2F0EC',
          }}
        >
          <input
            type={'search'}
            name="query"
            value={query}
            placeholder="search..."
            onChange={(e) => handleChangeInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => {
              return false;
            }}
            title="Search"
          >
            <svg width={16} height={16} stroke="black" fill="transparent">
              <use href={`${sprite}#search`} />
            </svg>
          </button>
        </form>
      </search>
    </>
  );
};
