import { Link } from 'react-router-dom';
import { memo } from 'react';
import { useAuth } from '../../contexts/auth.js';

const getBackgroundColor = (prioriteit, afgewerkt) => {
  if (afgewerkt) {
    return 'from-green-700 to-green-500';
  }
  switch (prioriteit) {
    case 'HEEL_DRINGEND':
      return 'from-red-700 to-red-500';
    case 'DRINGEND':
      return 'from-orange-500 to-yellow-500';
    case 'NIET_DRINGEND':
      return 'from-yellow-500 to-yellow-300';
  }
};

const getPrioriteitText = (prioriteit) => {
  switch (prioriteit) {
    case 'HEEL_DRINGEND':
      return 'Heel dringend';
    case 'DRINGEND':
      return 'Dringend';
    case 'NIET_DRINGEND':
      return 'Niet dringend';
  }
};

const TaakMemoized = memo(function Taak({ id, titel, beschrijving, prioriteit, gemaaktDoor, gemaaktVoor, afgewerkt, onDelete, onAfgewerkt }) {

  const { user } = useAuth();

  const handleDelete = () => {
    onDelete(id);
  };
  const handleAfgewerkt = (event) => {
    onAfgewerkt(id, event.target.checked);
  };

  return (
    <>
      <div className={`card rounded-box border-2 border-black shadow-2xl m-5 bg-gradient-to-r ${getBackgroundColor(prioriteit, afgewerkt)} mb-4 h-full`} data-cy='taak'>
        <div className={'card-body'}>
          <span className='badge badge-info' data-cy='taak_prioriteit'>{getPrioriteitText(prioriteit)}</span>
          <h4 className='pb-3 text-2xl break-words text-pretty font-bold' data-cy='taak_titel'>{titel}</h4>
          <div className='break-words' data-cy='taak_beschrijving'>{beschrijving}</div>
          <div className='font-semibold'>Aangemaakt door:</div>
          <div>
            <span className='badge badge-neutral' data-cy='taak_gemaakt_door'>{gemaaktDoor.voornaam + ' ' + gemaaktDoor.naam}</span>
          </div>
          <div className='font-semibold'>Voor: </div>
          <div>
            {gemaaktVoor.map((g) => (
              <div key={g.id}>
                <span className='badge badge-neutral'>{g.voornaam + ' ' + g.naam}</span>
              </div>
            ))}
          </div>
          <div className='form-check p-2 pl-0 mt-auto'>
            {gemaaktVoor.some((g) => g.id === user?.id) && (
              <div>
                <input className='form-check-input' type='checkbox' checked={afgewerkt} onChange={handleAfgewerkt}></input>
                <label className='form-check-label pl-2 font-semibold'>
                  Afgewerkt
                </label>
              </div>
            )}
          </div>
          <div className='flex space-x-2 '>
            <button className='btn glass text-white' disabled={gemaaktDoor.id !== user?.id} data-cy='taak_change_btn'><Link to={`/taken/edit/${id}`}>Aanpassen</Link></button>
            <button className='btn glass text-white' disabled={gemaaktDoor.id !== user?.id} onClick={handleDelete} data-cy='taak_remove_btn'>Verwijder</button>
          </div>
        </div>
      </div>
    </>
  );
});

export default TaakMemoized;