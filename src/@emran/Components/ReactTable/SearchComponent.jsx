import {IoCloseCircleOutline, IoSearchOutline} from 'react-icons/io5';

import {useCallback, useState} from 'react';

const searchStyles = {
  container: `
    flex justify-between
    relative
    rounded-full
    bg-cyan-900/50
    h-10
    border
    border-cyan-700/50
    focus-within:border-cyan-500
    max-w-fit
    transition-all`,

  searchWrapper: `
    flex
    items-center
    `,

  iconWrapper: `
    absolute
    left-3
    pointer-events-none
    `,

  input: `
    bg-transparent
    outline-none
    pl-10 pr-4 py-2
    w-full
    text-cyan-100
    placeholder-cyan-600/60
    xl:w-[45ch]
    lg:w-[35ch]
    md:w-[30ch]
    focus:ring-0
    transition-all
    duration-200
    `,

  clearButton: (isDisabled) =>
    `px-3
    flex
    items-center
    justify-center
    ${
      isDisabled
        ? 'opacity-0 cursor-default'
        : 'text-red-400 hover:text-red-500 cursor-pointer'
    } transition-all`,
};

const SearchComponent = ({setGlobalFilter}) => {
  const [isDisableCancelIcon, setIsDisableCancelIcon] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const onChangeGlobalSearch = useCallback((e) => {
    const value = e.target.value;
    setGlobalFilter(value);
    setSearchValue(value);
    setIsDisableCancelIcon(!value.toString().length);
  }, []);

  const handleClear = () => {
    setIsDisableCancelIcon(true);
    setGlobalFilter('');
    setSearchValue('');
  };

  return (
    <div className={searchStyles.container}>
      <div className={searchStyles.searchWrapper}>
        <div className={searchStyles.iconWrapper}>
          <IoSearchOutline className='text-cyan-500' size={18} />
        </div>

        <input
          value={searchValue}
          placeholder='Search here...'
          className={searchStyles.input}
          onChange={onChangeGlobalSearch}
        />

        <button
          disabled={isDisableCancelIcon}
          onClick={handleClear}
          className={searchStyles.clearButton(isDisableCancelIcon)}>
          <IoCloseCircleOutline
            color={isDisableCancelIcon ? '#9CA3AF' : '#fa0055'}
            height='20px'
            width='20px'
          />
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
