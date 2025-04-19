import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

export default function MultipleSelect({
  label, name, items, validationRules, ...rest
}) {
  const {
    register,
    formState: {
      errors,
      isSubmitting,
    },
  } = useFormContext();

  const hasError = name in errors;  

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        {label}
      </label>
      <div>
        <Select
          {...register(name, validationRules)}
          id={name}
          classNamePrefix='react-select'
          isMulti
          options={items}
          isDisabled={isSubmitting}
          {...rest}
        />
        {hasError && (
          <div className='form-text text-error' data-cy='label_input_error'>
            {errors[name]?.message}
          </div>
        )}
      </div>
    </div>
  );
}