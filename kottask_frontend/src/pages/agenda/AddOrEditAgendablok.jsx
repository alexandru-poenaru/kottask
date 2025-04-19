import useSWR from 'swr';
import AgendablokForm from '../../components/agendablokken/AgendablokForm';
import AsyncData from '../../components/AsyncData';
import { useParams } from 'react-router-dom';
import { getById, getManyById, save } from '../../api';
import useSWRMutation from 'swr/mutation';

export default function AddOrEditAgendablok() {
  const { id } = useParams();

  const {
    data: taken = [],
    error: takenError,
    isLoading: takenLoading,
  } = useSWR('/gebruikers/me/taken', getManyById);

  const {
    data: agendablok,
    error: agendablokError,
    isLoading: agendablokLoading,
  } = useSWR(id ? `agendablokken/${id}` : null, getById);

  const { trigger: saveAgendablok, error: saveError } = useSWRMutation(
    'agendablokken',
    save,
  );

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-lg p-8 space-y-6 rounded-lg shadow-2xl m-4'>
          <h1 className='text-3xl font-bold text-center'>Agendablok {id ? 'aanpassen' : 'toevoegen'}</h1>
          <AsyncData error={agendablokError || saveError || takenError} loading={agendablokLoading || takenLoading}>
            <AgendablokForm agendablok={agendablok} taken={taken} saveAgendablok={saveAgendablok} />
          </AsyncData>
        </div>
      </div>
    </>
  );
}
