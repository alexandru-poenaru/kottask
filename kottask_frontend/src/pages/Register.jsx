import {
  useCallback, useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormProvider, useForm,
} from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';
// import { useThemeColors } from '../contexts/theme';

export default function Register() {
  // const {
  //   theme, oppositeTheme,
  // } = useThemeColors();
  const {
    error, loading, register,
  } = useAuth();

  const navigate = useNavigate();

  const methods = useForm();
  const {
    getValues, handleSubmit,
  } = methods;

  const handleRegister = useCallback(
    async ({
      naam, voornaam, emailadres, wachtwoord,
    }) => {
      const loggedIn = await register({
        naam, voornaam, emailadres, wachtwoord,
      });

      if (loggedIn) {
        navigate({
          pathname: '/',
          replace: true,
        });
      }
    },
    [register, navigate],
  );

  const validationRules = useMemo(() => ({
    naam: { required: 'Naam is verplicht' },
    voornaam: { required: 'Voornaam is verplicht' },
    emailadres: {
      required: 'Het emailadres mag niet leeg zijn',
      pattern: {
        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        message: 'Ongeldig e-mailadres',
      },
    },
    wachtwoord: { required: 'Wachtwoord is verplicht' },
    bevestigWachtwoord: {
      required: 'Wachtwoordbevestiging is verplicht',
      validate: (value) => {
        const wachtwoord = getValues('wachtwoord');
        return wachtwoord === value || 'Wachtwoorden komen niet overeen';
      },
    },
  }), [getValues]);

  return (
    <FormProvider {...methods}>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-md m-4 p-8 space-y-6 rounded-lg shadow-2xl'>
          <h1 className='text-3xl font-bold text-center'>Registreer</h1>
          <form className='space-y-4' onSubmit={handleSubmit(handleRegister)}>
            <Error error={error} />
            <LabelInput
              label='Voornaam'
              type='text'
              name='voornaam'
              placeholder='Jouw voornaam'
              validationRules={validationRules.voornaam}
            />
            <LabelInput
              label='Naam'
              type='text'
              name='naam'
              placeholder='Jouw naam'
              validationRules={validationRules.naam}
            />
            <LabelInput
              label='E-mailadres'
              type='email'
              name='emailadres'
              placeholder='your@email.com'
              validationRules={validationRules.emailadres}
            />
            <LabelInput
              label='Wachtwoord'
              type='password'
              name='wachtwoord'
              validationRules={validationRules.wachtwoord}
            />
            <LabelInput
              label='Bevestig wachtwoord'
              type='password'
              name='bevestigWachtwoord'
              validationRules={validationRules.bevestigWachtwoord}
            />
            <button
              type='submit'
              className='w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
              disabled={loading}
            >
              Registreer
            </button>
            <div className='text-center'>
              <p>Al een account?</p>
              <a href='/login' className='text-blue-600 hover:underline'>
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}