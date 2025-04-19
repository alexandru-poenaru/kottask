import { useLocation, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className='grid h-screen place-content-center px-4 text-center'>
      <h1 className='text-7xl mb-20'>Pagina niet gevonden!</h1>
      <p className='text-2xl font-bold tracking-tight sm:text-4xl'>Er is geen pagina met als url {pathname}, probeer iets anders.</p>
      <button
        onClick={() => navigate('/taken', { replace: true })}
        className='btn btn-primary mt-4'
      >
        Go home!
      </button>
    </div>
  );
};

export default NotFound;
