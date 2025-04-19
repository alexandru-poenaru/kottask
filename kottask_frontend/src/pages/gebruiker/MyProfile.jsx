import { getById, save } from '../../api';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import AsyncData from '../../components/AsyncData';
import GebruikerForm from '../../components/gebruikers/GebruikerForm';

const MyProfile = () => {
  const {
    data: gebruiker,
    error: gebruikerError,
    isLoading: gebruikerLoading,
  } = useSWR('gebruikers/me', getById);  

  const { trigger: saveGebruiker, error: saveError } = useSWRMutation(
    'gebruikers',
    save,
  );

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-lg p-8 space-y-6 rounded-lg shadow-2xl m-4'>
          <h1 className='text-3xl font-bold text-center'>Mijn profiel</h1>

          <AsyncData error={gebruikerError || saveError} loading={gebruikerLoading}>
            <GebruikerForm gebruiker={gebruiker} saveGebruiker={saveGebruiker} />
          </AsyncData>
        </div>
      </div>
    </>
  );
};
export default MyProfile;
