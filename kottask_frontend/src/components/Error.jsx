import { isAxiosError } from 'axios';

export default function Error({ error }) {
  if (isAxiosError(error)) {

    if (error.response.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }

    return (
      <div role='alert' className='alert alert-error' data-cy='axios_error_message'>
        <div>
          <h4 className='font-bold'>Oops, something went wrong</h4>
          {error?.response?.data?.message || error.message}
          {error?.response?.data?.details && (
            <>
              :
              <br />
              {JSON.stringify(error.response.data.details)}
            </>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='alert alert-error' role='alert'>
        <h4 className='font-bold'>An unexpected error occurred</h4>
        {error.message || JSON.stringify(error)}
      </div>
    );
  }

  return null;
}
