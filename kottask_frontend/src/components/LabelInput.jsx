import { useFormContext } from 'react-hook-form';

export default function LabelInput({
  label,
  name,
  type,
  validationRules,
  ...rest
}) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const hasError = name in errors;

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='form-label'>
        {label}
      </label>
      <div>
        <input
          {...register(name, validationRules)}
          id={name}
          type={type}
          disabled={isSubmitting}
          className='input input-bordered w-full'
          {...rest}
        />
      </div>
      {hasError ? (
        <div className='form-text text-error' data-cy='label_input_error'>{errors[name].message}</div>
      ) : null}
    </div>
  );
}