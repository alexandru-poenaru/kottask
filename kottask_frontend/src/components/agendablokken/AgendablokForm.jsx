import { useNavigate } from 'react-router-dom';
import LabelInput from '../LabelInput';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import SelectList from '../SelectList';

const EMPTY_AGENDABLOK = {
  id: undefined,
  gebruiker: {},
  titel: '',
  datumVan: undefined,
  datumTot: undefined,
  taak: {},
};

const validationRules = {
  titel: {
    required: 'Titel is verplicht',
  },
  datumVan: {
    required: 'Beginmoment is verplicht',
  },
  datumTot: {
    required: 'Eindmoment is verplicht',
    validate: (value, { datumVan }) => {
      if (value && datumVan && new Date(value) < new Date(datumVan)) {
        return 'Eindmoment kan niet eerder zijn dan beginmoment';
      }
      return true;
    },
  },
};

const toDateInputString = (date) => {
  if (!date) return null;
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  date.setHours(date.getHours() + 1);
  let asString = date.toISOString();
  return asString.slice(0, 16);
};

export default function AgendablokForm({ agendablok = EMPTY_AGENDABLOK, taken = [], saveAgendablok }) {
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      gebruiker: agendablok?.gebruiker?.id,
      titel: agendablok?.titel,
      datumVan: toDateInputString(agendablok?.datumVan),
      datumTot: toDateInputString(agendablok?.datumTot),
      taak: agendablok?.taak?.id,
    },
  });

  useEffect(() => {
    methods.reset({
      titel: agendablok?.titel,
      datumVan: toDateInputString(agendablok?.datumVan),
      datumTot: toDateInputString(agendablok?.datumTot),
      taak: agendablok?.taak?.id,
    });
  }, [agendablok, methods]);

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    if (values.taak === '') {
      delete values.taak;
    }
    if (!isValid) return;
    await saveAgendablok({
      id: agendablok?.id,
      ...values,
    }, {
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
          data-cy='agendablok_titel_input'
        />
        <LabelInput
          label='Van'
          name='datumVan'
          type='datetime-local'
          validationRules={validationRules.datumVan}
          data-cy='agendablok_datumVan_input'
        />
        <LabelInput
          label='Tot'
          name='datumTot'
          type='datetime-local'
          validationRules={validationRules.datumTot}
          data-cy='agendablok_datumTot_input'
        />
        <SelectList
          label='Taak'
          name='taak'
          placeholder='-- Selecteer een taak --'
          items={[{ id: '', name: 'Geen taak' }, ...taken.map((taak) => ({ id: taak.id, name: taak.titel }))]}
          data-cy='agendablok_taak_input'
        />
        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button
              type='submit'
              className='btn btn-primary px-4 py-2 mr-1 mt-5'
              disabled={isSubmitting}
              data-cy='submit_agendablok'
            >
              {agendablok?.id ? 'Agendablok opslaan' : 'Agendablok toevoegen'}
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