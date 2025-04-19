import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../LabelInput';

const GebruikerForm = ({ gebruiker, saveGebruiker }) => {
  const navigate = useNavigate();

  const validationRules = {
    voornaam: {
      required: 'Voornaam is verplicht',
    },
    naam: {
      required: 'Naam is verplicht',
    },
    emailadres: {
      required: 'E-mailadres is verplicht',
      pattern: {
        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        message: 'Ongeldig e-mailadres',
      },
    },
  };

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      voornaam: gebruiker.voornaam,
      naam: gebruiker.naam,
      emailadres: gebruiker.emailadres,
    },
  });

  useEffect(() => {
    methods.reset({
      voornaam: gebruiker.voornaam,
      naam: gebruiker.naam,
      emailadres: gebruiker.emailadres,
    });
  }, [gebruiker, methods]);

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveGebruiker({
      id: gebruiker.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/taken'),
    });
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-5' noValidate>
        <LabelInput
          label='Voornaam'
          name='voornaam'
          type='text'
          validationRules={validationRules.voornaam}
          disabled={!isEditing}
          data-cy='voornaam_input'
        />
        <LabelInput
          label='Naam'
          name='naam'
          type='text'
          validationRules={validationRules.naam}
          disabled={!isEditing}
          data-cy='naam_input'
        />
        <LabelInput
          label='E-mailadres'
          name='emailadres'
          type='email'
          validationRules={validationRules.emailadres}
          disabled={!isEditing}
          data-cy='emailadres_input'
        />
        {!isEditing && (
          <div className='btn btn-outline' onClick={handleEditClick} data-cy='edit_user_btn'>
            Gegevens bewerken
          </div>
        )}
        {isEditing && (
          <div className='clearfix'>
            <div className='btn-group float-end'>
              <button
                type='submit'
                className='btn btn-primary px-4 py-2 mr-1 mt-5'
                disabled={isSubmitting}
                data-cy='save_user_btn'
              >
                Opslaan
              </button>
              <Link
                disabled={isSubmitting}
                className='btn btn-light ml-1'
                to='/taken'
              >
                Annuleer
              </Link>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default GebruikerForm;