import { useNavigate } from 'react-router-dom';
import LabelInput from '../LabelInput';
import { FormProvider, useForm } from 'react-hook-form';
import SelectList from '../SelectList';
import MultipleSelect from '../MultipleSelect.jsx';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

const prioriteiten = [
  {
    id: 'NIET_DRINGEND',
    name: 'Niet dringend',
  },
  {
    id: 'DRINGEND',
    name: 'Dringend',
  },
  {
    id: 'HEEL_DRINGEND',
    name: 'Heel dringend',
  },
];

const EMPTY_TAAK = {
  id: undefined,
  titel: '',
  beschrijving: '',
  prioriteit: '',
  gemaaktDoor: {},
  gemaaktVoor: [],
  afgewerkt: false,
};

const validationRules = {
  titel: {
    required: 'Titel is verplicht',
  },
  beschrijving: {
    required: 'Beschrijving is verplicht',
  },
  prioriteit: {
    required: 'Prioriteit is verplicht',
  },
  gemaaktVoor: {
    required: 'Gemaakt voor is verplicht',
  },
};

export default function TaakForm({ gebruikers = [], taak = EMPTY_TAAK, saveTaak }) {
  const { theme } = useContext(ThemeContext);

  const customStyles = theme === 'dracula' ? {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#282a36',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#282a36',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#99c8ff' : '#282a36',
    }),
  } : undefined;

  const [selectedGebruikers, setSelectedGebruikers] = useState(taak?.gemaaktVoor.map((g) => ({ value: g.id, label: `${g.voornaam} ${g.naam}` })));

  const handleChange = (selectedGebruikers) => {
    setSelectedGebruikers(selectedGebruikers);
  };

  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      titel: taak?.titel,
      beschrijving: taak?.beschrijving,
      prioriteit: taak?.prioriteit,
      gemaaktVoor: selectedGebruikers.map((g) => g.value),
    },
  });

  useEffect(() => {
    setSelectedGebruikers(taak?.gemaaktVoor.map((g) => ({ value: g.id, label: `${g.voornaam} ${g.naam}` })));
    methods.reset({
      titel: taak?.titel,
      beschrijving: taak?.beschrijving,
      prioriteit: taak?.prioriteit,
      gemaaktVoor: taak?.gemaaktVoor.map((g) => g.id),
    });
  }, [taak, methods]);

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;

    const payload = {
      ...values,
    };

    if (taak?.id) {
      payload.id = taak.id;
      payload.afgewerkt = taak.afgewerkt;
    }

    await saveTaak(payload, {
      throwOnError: false,
      onSuccess: () => navigate(-1),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
        <LabelInput
          label='Titel'
          name='titel'
          type='text'
          validationRules={validationRules.titel}
          data-cy='taak_titel_input'
        />
        <LabelInput
          label='Beschrijving'
          name='beschrijving'
          type='text'
          validationRules={validationRules.beschrijving}
          data-cy='taak_beschrijving_input'
        />
        <SelectList
          label='Prioriteit'
          name='prioriteit'
          placeholder='-- Selecteer een prioriteit --'
          items={prioriteiten}
          validationRules={validationRules.prioriteit}
          data-cy='taak_prioriteit_input'
        />
        <MultipleSelect
          label='Gemaakt voor'
          defaultValue={taak?.gemaaktVoor.map((g) => ({ value: g.id, label: `${g.voornaam} ${g.naam}` }))}
          name='gemaaktVoor'
          options={gebruikers.map((g) => ({ value: g.id, label: `${g.voornaam} ${g.naam}` }))}
          value={selectedGebruikers}
          onChange={(selected) => {
            handleChange(selected);
            methods.setValue('gemaaktVoor', selected.map((g) => g.value), { shouldValidate: true });
          }}
          validationRules={validationRules.gemaaktVoor}
          styles={customStyles}
          id='gemaaktVoor'
        />
        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button
              type='submit'
              className='btn btn-primary px-4 py-2 mr-1 mt-5'
              disabled={isSubmitting}
              data-cy='submit_taak'
            >
              {taak?.id ? 'Taak opslaan' : 'Taak toevoegen'}
            </button>
            <button
              type='button'
              className='btn btn-light ml-1'
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Annuleer
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}