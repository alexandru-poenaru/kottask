import Taak from '../../components/taken/Taak';
import { useState, useMemo } from 'react';
import AsyncData from '../../components/AsyncData';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById, save, getManyById } from '../../api';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.js';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

const TakenList = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState(false);

  const {
    data: taken = [],
    isLoading,
    error,
  } = useSWR(
    location.pathname.startsWith('/me/') ? '/gebruikers/me/taken' : 'taken',
    location.pathname.startsWith('/me/')
      ? getManyById
      : getAll,
  );

  const { trigger: deleteTaak, error: deleteError } = useSWRMutation(
    'taken',
    deleteById,
  );

  const { trigger: updateTaak, error: updateError } = useSWRMutation(
    'taken',
    save,
  );

  const filteredTaken = useMemo(() => {
    return taken.filter((t) => {
      const matchesSearch = t.titel.toLowerCase().includes(search.toLowerCase())
        || t.gemaaktDoor.voornaam.toLowerCase().includes(search.toLowerCase())
        || t.beschrijving.toLowerCase().includes(search.toLowerCase())
        || t.gemaaktVoor.some((persoon) => persoon.voornaam.toLowerCase().includes(search.toLowerCase()));
      const matchesUserFilter = !filter || t.gemaaktDoor.id === user?.id;
      return matchesSearch && matchesUserFilter;
    });
  }, [search, taken, filter, user?.id]);

  const handleAanpassenAfgewerkt = async (id, check) => {
    const updatedTaak = taken.find((t) => t.id === id);
    if (updatedTaak) {
      const body = {
        titel: updatedTaak.titel,
        beschrijving: updatedTaak.beschrijving,
        prioriteit: updatedTaak.prioriteit,
        gemaaktVoor: updatedTaak.gemaaktVoor.map((persoon) => persoon.id),
        afgewerkt: check,
      };
      await updateTaak({ id, ...body });

      const key = location.pathname.startsWith('/me/')
        ? '/gebruikers/me/taken'
        : 'taken';

      mutate(key);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteTaak(deleteId);
    const key = location.pathname.startsWith('/me/')
      ? '/gebruikers/me/taken'
      : 'taken';

    mutate(key);
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className='p-10'>
        <h1 className='text-2xl font-bold mb-4'>Taken</h1>
        <div className='flex flex-col md:flex-row mb-3 w-full'>
          <div className='flex flex-col md:flex-row w-full md:w-auto mb-3 md:mb-0'>
            <input
              type='search'
              id='search'
              className='form-input rounded-l px-4 py-2 mb-2 md:mb-0 md:mr-2'
              placeholder='Zoeken...'
              value={text}
              onChange={(e) => setText(e.target.value)}
              data-cy='taken_search_input'
            />
            <button
              type='button'
              className='btn btn-active px-4 py-2 mb-2 md:mb-0 md:mr-2'
              onClick={() => setSearch(text)}
              data-cy='taken_search_btn'
            >
              Zoeken
            </button>
            {!location.pathname.startsWith('/me/') && (
              <div className='flex items-center mb-2 md:mb-0 md:ml-2'>
                <input
                  type='checkbox'
                  id='filter'
                  className='form-checkbox'
                  checked={filter}
                  onChange={(e) => setFilter(e.target.checked)}
                />
                <label htmlFor='filterByUser' className='ml-2'>Aangemaakt door mij</label>
              </div>
            )}
          </div>
          <div className='ml-auto'>
            <Link to='/taken/add' className='btn btn-primary'>
              Voeg taak toe
            </Link>
          </div>
        </div>

        <AsyncData loading={isLoading} error={error || deleteError || updateError}>
          <div className='grid mt-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {!error ? (
                filteredTaken.map((taak, index) => (
                  <div className='col' key={index}>
                    <Taak {...taak} onDelete={handleDelete} onAfgewerkt={handleAanpassenAfgewerkt} />
                  </div>
                ))
              ) : null}
              {filteredTaken.length === 0 && (
                <div role='alert' className='alert alert-error' data-cy='no_taken_message'>
                  {search ? 'Er werden geen taken gevonden! Probeer een ander zoekterm.' : 'Er werden geen taken gevonden!'}
                </div>
              )}
            </div>
          </div>
        </AsyncData>
      </div >

      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='p-6 rounded shadow-lg m-4' style={theme === 'dracula' ? { backgroundColor: '#292b35' } : { backgroundColor: '#ffffff' }}>
            <h2 className='text-xl font-bold mb-4'>Bevestig Verwijderen</h2>
            <p className='mb-4'>Weet je zeker dat je deze taak wilt verwijderen? Alle agendablokken die hieraan verbonden zijn zullen ook verwijderd worden!</p>
            <div className='flex justify-end'>
              <button
                className='btn btn-secondary mr-2'
                onClick={() => setShowModal(false)}
              >
                Annuleren
              </button>
              <button
                className='btn btn-danger'
                onClick={confirmDelete}
                data-cy='taak_confirm_delete'
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TakenList;
