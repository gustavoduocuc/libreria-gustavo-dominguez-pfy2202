import { ApiError } from './ApiError';

// Error de una operación GraphQL: la respuesta llegó con HTTP 200 pero trae errors[].
export class GraphQLError extends ApiError {
  constructor(errors) {
    super(errors[0].message, 200);
    this.name = 'GraphQLError';
    this.errors = errors;
    this.code = errors[0].extensions?.code;
    this.fieldErrors = errors.reduce(function collect(fields, error) {
      const field = error.extensions?.field;
      if (field && !fields[field]) {
        return { ...fields, [field]: error.message };
      }
      return fields;
    }, {});
  }
}
