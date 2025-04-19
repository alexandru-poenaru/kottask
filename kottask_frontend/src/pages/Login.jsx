import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import LabelInput from '../components/LabelInput';
import { useAuth } from '../contexts/auth';
import Error from '../components/Error';

const validationRules = {
  emailadres: {
    required: 'Het emailadres mag niet leeg zijn',
    pattern: {
      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      message: 'Ongeldig e-mailadres',
    },
  },
  wachtwoord: {
    required: 'Wachtwoord is verplicht',
  },
};

export default function Login() {
  const { search } = useLocation();
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();

  const methods = useForm();
  const { handleSubmit } = methods;

  const handleLogin = useCallback(
    async ({ emailadres, wachtwoord }) => {
      const loggedIn = await login(emailadres, wachtwoord);
      if (loggedIn) {
        const params = new URLSearchParams(search);
        navigate({
          pathname: params.get('redirect') || '/',
          replace: true,
        });
      }
    },
    [login, navigate, search],
  );

  return (
    <>
      <FormProvider {...methods}>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='w-full max-w-md m-4 p-8 space-y-6 rounded-lg shadow-2xl'>
            <h1 className='text-3xl font-bold text-center'>Log in</h1>
            <form className='space-y-4' onSubmit={handleSubmit(handleLogin)}>
              <Error error={error} />
              <LabelInput
                label='E-mailadres'
                type='email'
                name='emailadres'
                placeholder='your@email.com'
                validationRules={validationRules.emailadres}
                data-cy='email_input'
              />
              <LabelInput
                label='Wachtwoord'
                type='password'
                name='wachtwoord'
                validationRules={validationRules.wachtwoord}
                data-cy='password_input'
              />
              <button
                type='submit'
                className='w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'
                disabled={loading}
                data-cy='submit_btn'
              >
                Sign in
              </button>
              <div className='text-center'>
                <p>Nog geen account?</p>
                <a href='/register' className='text-blue-600 hover:underline'>
                  Maak een account aan
                </a>
              </div>
            </form>
          </div>
        </div >
      </FormProvider >
    </>
  );
}
