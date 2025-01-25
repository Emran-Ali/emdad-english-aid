import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";
import clsx from "clsx";

import React, {useCallback, useState} from "react";

const searchStyles = {
    container:`
    flex justify-between
    relative
    rounded-lg
    bg-gray-100
    h-10
    max-w-fit`,

    searchWrapper:`
    flex
    items-center
    `,

    iconWrapper:`
    absolute
    left-2
    pointer-events-none
    `,

    input:`
        bg-transparent
    outline-none
    pl-10 pr-4 py-2
    w-full
    text-gray-700
    placeholder-gray-500
    xl:w-[45ch]
    lg:w-[35ch]
    md:w-[30ch]
    focus:ring-2
    focus:ring-blue-500
    focus:ring-opacity-50
    transition-all
    duration-200
    `,

    clearButton: (isDisabled) =>
        `px-2
    flex
    items-center
    justify-center
    ${isDisabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:text-gray-700 cursor-pointer'}`

};

const SearchComponent = ({ setGlobalFilter }) => {

    const [isDisableCancelIcon, setIsDisableCancelIcon] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const onChangeGlobalSearch = useCallback(
        (e) => {
            const value = e.target.value;
            setGlobalFilter(value);
            setSearchValue(value);
            setIsDisableCancelIcon(!value.toString().length);
        },
        []
    );

    const handleClear = () => {
        setIsDisableCancelIcon(true);
        setGlobalFilter('');
        setSearchValue('');
    };

    return (
        <div className={searchStyles.container}>
            <div className={searchStyles.searchWrapper}>
                <div className={searchStyles.iconWrapper}>
                    <IoSearchOutline
                        color="#6B7280"
                        height="20px"
                        width="20px"
                    />
                </div>

                <input
                    value={searchValue}
                    placeholder="Search here..."
                    className={searchStyles.input}
                    onChange={onChangeGlobalSearch}
                />

                <button
                    disabled={isDisableCancelIcon}
                    onClick={handleClear}
                    className={searchStyles.clearButton(isDisableCancelIcon)}
                >
                    <IoCloseCircleOutline
                        color={isDisableCancelIcon ? "#9CA3AF" : "#4B5563"}
                        height="20px"
                        width="20px"
                    />
                </button>
            </div>
        </div>
    );
};

export default SearchComponent;