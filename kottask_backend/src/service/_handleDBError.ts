import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {
  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_user_email_unique'):
        throw ServiceError.validationFailed(
          'There is already a gebruiker with this email address',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_agendablok_gebruiker'):
        throw ServiceError.notFound('This gebruiker does not exist');
      case message.includes('fk_agendablok_taak'):
        throw ServiceError.notFound('This taak does not exist');
      case message.includes('fk_taak_gebruiker'):
        throw ServiceError.notFound('This gebruiker does not exist');
      case message.includes('agendablok'):
        throw ServiceError.notFound('No agendablok with this id exists');
      case message.includes('taak'):
        throw ServiceError.notFound('No taak with this id exists');
      case message.includes('gebruiker'):
        throw ServiceError.notFound('No gebruiker with this id exists');
    }
  }

  throw error;
};

export default handleDBError;
