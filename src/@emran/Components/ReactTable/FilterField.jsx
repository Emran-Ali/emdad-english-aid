import React, {useCallback} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {IoReloadOutline} from 'react-icons/io5';

// Custom Input Component
const CustomTextInput = ({label, register, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      {...register(name)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Custom Select Component
const CustomSelect = ({label, options, control, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <select
          {...field}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select...</option>
          {options?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      )}
    />
  </div>
);

// Custom Date Picker Component
const CustomDatePicker = ({label, control, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <input
          type="date"
          {...field}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    />
  </div>
);

// Custom Radio Input Component
const CustomRadioInput = ({label, options, control, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <div className="flex space-x-4">
          {options?.map((option) => (
            <label key={option.id} className="flex items-center space-x-2">
              <input
                type="radio"
                {...field}
                value={option.id}
                checked={field.value === option.id}
                className="form-radio text-blue-600"
              />
              <span className="text-sm text-gray-700">{option.title}</span>
            </label>
          ))}
        </div>
      )}
    />
  </div>
);

const DynamicFilterField = ({filter, control, register}) => {
  switch (filter.type) {
    case 'select':
      return (
        <CustomSelect
          label={filter.label}
          options={filter.options}
          control={control}
          name={filter.id}
        />
      );
    case 'date':
      return (
        <CustomDatePicker
          label={filter.label}
          control={control}
          name={filter.id}
        />
      );
    case 'radio':
      return (
        <CustomRadioInput
          label={filter.label}
          options={filter.options}
          control={control}
          name={filter.id}
        />
      );
    default:
      return (
        <CustomTextInput
          label={filter.label}
          register={register}
          name={filter.id}
        />
      );
  }
};

const FilterField = ({filters, setFilters, onFilterChange}) => {
  const {control, register, reset, watch} = useForm({
    defaultValues: filters.reduce((acc, filter) => {
      acc[filter.id] = '';
      return acc;
    }, {}),
  });

  // Watch all fields for changes
  const watchedFields = watch();

  // Update filters whenever fields change
  React.useEffect(() => {
    const activeFilters = Object.entries(watchedFields)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({
        id: key,
        value: value,
      }));
    onFilterChange(activeFilters);
  }, [watchedFields, onFilterChange]);

  const handleReset = useCallback(() => {
    reset();
    setFilters([]);
    onFilterChange([]);
  }, [reset, setFilters, onFilterChange]);

  return (
    <form className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <DynamicFilterField
              filter={filter}
              control={control}
              register={register}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <IoReloadOutline className="mr-2" />
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default FilterField;