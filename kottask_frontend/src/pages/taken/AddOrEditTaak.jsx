import useSWR from 'swr';
import TaakForm from '../../components/taken/TaakForm';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import { getById, save, getAll } from '../../api';
import useSWRMutation from 'swr/mutation';

export default function AddOrEditTaak() {
  const { id } = useParams();

  const {
    data: gebruikers = [],
    error: gebruikersError,
    isLoading: gebruikersLoading,
  } = useSWR('gebruikers', getAll);

  const {
    data: taak,
    error: taakError,
    isLoading: taakLoading,
  } = useSWR(id ? `taken/${id}` : null, getById);

  const { trigger: saveTaak, error: saveError } = useSWRMutation(
    'taken',
    save,
  );

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-lg p-8 space-y-6 rounded-lg shadow-2xl m-4'>
          <h1 className='text-3xl font-bold text-center'>Taak {id ? 'aanpassen' : 'toevoegen'}</h1>

          <AsyncData error={taakError || saveError || gebruikersError} loading={taakLoading || gebruikersLoading}>

            <TaakForm gebruikers={gebruikers} taak={taak} saveTaak={saveTaak} />
          </AsyncData>
        </div>
      </div>
    </>
  );
}
