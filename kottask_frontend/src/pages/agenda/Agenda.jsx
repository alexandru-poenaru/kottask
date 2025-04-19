import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import useSWR from 'swr';
import { getAll, getManyById, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData.jsx';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useSWRMutation from 'swr/mutation';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import { useAuth } from '../../contexts/auth.js';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const Agenda = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [gebruikerKleuren, setGebruikerKleuren] = useState({});
  const { user } = useAuth();

  const {
    data: agendablokken = [],
    isLoading,
    error,
  } = useSWR(
    location.pathname.startsWith('/me/') ? '/gebruikers/me/agendablokken' : 'agendablokken',
    location.pathname.startsWith('/me/')
      ? getManyById
      : getAll,
  );

  const { trigger: deleteAgendablok, error: deleteError } = useSWRMutation(
    'agendablokken',
    deleteById,
  );

  const getRandomColor = () => {
    const letters = '0123456789ABC';
    let kleur = '#';
    for (let i = 0; i < 6; i++) {
      const range = i % 2 === 0 ? '01234567' : letters;
      kleur += range[Math.floor(Math.random() * range.length)];
    }
    return kleur;
  };  

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      gebruikerId: clickInfo.event.extendedProps.gebruikerId,
      naam: clickInfo.event.extendedProps.naam,
      voornaam: clickInfo.event.extendedProps.voornaam,
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      taak: clickInfo.event.extendedProps.taak,
    });
  };

  useEffect(() => {
    const newGebruikerKleuren = {};
    agendablokken.forEach((blok) => {
      if (!newGebruikerKleuren[blok.gebruiker.id]) {
        newGebruikerKleuren[blok.gebruiker.id] = getRandomColor();
      }
    });
    setGebruikerKleuren(newGebruikerKleuren);
  }, [agendablokken]);

  const uniqueUsers = Array.from(new Map(agendablokken.map((blok) => [blok.gebruiker.id, blok.gebruiker])).values());

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteAgendablok(deleteId);
    setShowModal(false);
    setDeleteId(null);
    setSelectedEvent(null);
  };

  const handleWindowResize = () => {
    const calendarApi = calendarRef.current.getApi();
    if (window.innerWidth < 768) {
      calendarApi.changeView('timeGridDay');
      calendarApi.setOption('headerToolbar', {
        left: 'prev,next',
        center: '',
        right: 'title',
      });
    } else {
      calendarApi.changeView('timeGridWeek');
      calendarApi.setOption('headerToolbar', {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridWeek,timeGridDay,dayGridMonth',
      });
    }
  };

  const calendarRef = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <>
      <AsyncData data={agendablokken} isLoading={isLoading} error={error || deleteError}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-10 p-4 md:p-20'>
          <div className='col-span-10 md:col-span-5'>
            <div className='w-full'>
              <h1 className='text-2xl font-bold mb-4'>{location.pathname.startsWith('/agendablokken') ? 'Algemene' : 'Mijn'} agenda</h1>
              <div className='flex mb-3'>
                <Link to='/agendablokken/add' className='btn btn-primary'>
                  Voeg agendablok toe
                </Link>
              </div>
              <div className='pb-4'>
                {uniqueUsers.map((gebruiker) => (
                  <div key={gebruiker.id} className='flex items-center mr-4'>
                    <div
                      className='w-4 h-4 rounded-full mr-2'
                      style={{ backgroundColor: gebruikerKleuren[gebruiker.id] }}
                    ></div>
                    <span>{gebruiker.voornaam + ' ' + gebruiker.naam}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full justify-end col-span-10 md:col-span-3'>
              {selectedEvent && (
                <div className='w-full max-w-md p-4 rounded-lg shadow-2xl'>
                  <h2 className='text-xl font-bold'>{selectedEvent.title}</h2>
                  <h4 className='font-bold'>{selectedEvent.naam + ' ' + selectedEvent.voornaam}</h4>
                  <p className='mb-2'>Start: {dateFormat.format(selectedEvent.start)}</p>
                  <p className='mb-2'>Eind: {dateFormat.format(selectedEvent.end)}</p>
                  {selectedEvent.taak && (
                    <div className='border-t-2 border-gray-300 pt-2 mt-2'>
                      <p className='mb-2'>Taak: {selectedEvent.taak.titel}</p>
                      <p className='mb-2'>Beschrijving: {selectedEvent.taak.beschrijving}</p>
                      <p className='mb-2'>Gemaakt door: {selectedEvent.taak.gemaaktDoor.voornaam + ' ' + selectedEvent.taak.gemaaktDoor.naam}</p>
                    </div>
                  )}
                  <button className='btn btn-primary m-1 ml-0' disabled={selectedEvent.gebruikerId !== user?.id}>
                    <Link to={`/agendablokken/edit/${selectedEvent.id}`} >
                      Agendablok aanpassen
                    </Link>
                  </button>
                  <button className='btn btn-outline' onClick={() => handleDelete(selectedEvent.id)} data-cy='delete_agendablok_btn' disabled={selectedEvent.gebruikerId !== user?.id}>Verwijder</button>
                </div>
              )}
            </div>
          </div>
          <div className='col-span-10 md:col-span-5 h-full'>
            <div className=''>
              <FullCalendar
                ref={calendarRef}
                height='70vh'
                plugins={[timeGridPlugin, dayGridPlugin]}
                initialView='timeGridWeek'
                headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay,dayGridMonth',
                }}
                events={agendablokken.map((blok) => ({
                  title: blok.taak ? `${blok.titel} - **${blok.taak.titel}**` : blok.titel,
                  start: blok.datumVan,
                  end: blok.datumTot,
                  description: blok.gebruiker.voornaam,
                  backgroundColor: gebruikerKleuren[blok.gebruiker.id],
                  borderColor: gebruikerKleuren[blok.gebruiker.id],
                  naam: blok.gebruiker.naam,
                  voornaam: blok.gebruiker.voornaam,
                  gebruikerId: blok.gebruiker.id,
                  id: blok.id,
                  taak: blok.taak,
                }))}
                eventClick={handleEventClick}
              />
            </div>
          </div>
        </div>

        {showModal && (
          <div tabIndex={0} className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='p-6 rounded shadow-lg m-4' style={theme === 'dracula' ? { backgroundColor: '#292b35' } : { backgroundColor: '#ffffff' }}>
              <h2 className='text-xl font-bold mb-4'>Bevestig Verwijderen</h2>
              <p className='mb-4'>Weet je zeker dat je dit agendablok wilt verwijderen?</p>
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
                  data-cy='confirm_delete_agendablok_btn'
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        )}
      </AsyncData>
    </>
  );
};

export default Agenda;