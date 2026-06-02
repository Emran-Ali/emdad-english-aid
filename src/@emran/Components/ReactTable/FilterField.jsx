import React, {useCallback} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {IoReloadOutline} from 'react-icons/io5';

// Custom Input Component
const CustomTextInput = ({label, register, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-cyan-300">{label}</label>
    <input
      {...register(name)}
      className="px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
    />
  </div>
);

// Custom Select Component
const CustomSelect = ({label, options, control, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-cyan-300">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <select
          {...field}
          className="px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="" className="bg-cyan-950">Select...</option>
          {options?.map((option) => (
            <option key={option.id} value={option.id} className="bg-cyan-950">
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
    <label className="text-sm font-medium text-cyan-300">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <input
          type="date"
          {...field}
          className="px-3 py-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
        />
      )}
    />
  </div>
);

// Custom Radio Input Component
const CustomRadioInput = ({label, options, control, name}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-cyan-300">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <div className="flex space-x-4">
          {options?.map((option) => (
            <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                {...field}
                value={option.id}
                checked={field.value === option.id}
                className="form-radio text-cyan-500 focus:ring-cyan-500 bg-cyan-900 border-cyan-700"
              />
              <span className="text-sm text-cyan-100">{option.title}</span>
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

  // Update filters whenever fields change
  React.useEffect(() => {
    const subscription = watch((newValues) => {
      const activeFilters = Object.entries(newValues)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => ({
          id: key,
          value: value,
        }));
      onFilterChange(activeFilters);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFilterChange]);

  const handleReset = useCallback(() => {
    reset();
    setFilters([]);
    onFilterChange([]);
  }, [reset, setFilters, onFilterChange]);

  return (
    <form className="p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center px-6 py-2 bg-cyan-600/20 text-cyan-400 border border-cyan-600/50 rounded-lg hover:bg-cyan-600 hover:text-white transition-all duration-200"
        >
          <IoReloadOutline className="mr-2" />
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default FilterField;