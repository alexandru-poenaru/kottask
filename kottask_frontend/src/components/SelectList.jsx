import { useFormContext } from 'react-hook-form';

export default function SelectList({
  label, name, placeholder, items, validationRules, ...rest
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
        <select
          {...register(name, validationRules)}
          id={name}
          className='select select-bordered w-full'
          disabled={isSubmitting}
          {...rest}
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {items.map(({
            id, name,
          }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        {hasError ? (
          <div className='form-text text-error' data-cy='label_input_error'>
            {errors[name].message}
          </div>
        ) : null}
      </div>
    </div>
  );
}