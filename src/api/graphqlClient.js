import { ApiError } from './ApiError';
import { GraphQLError } from './GraphQLError';

const networkMessage = 'No se pudo conectar con el servidor. Revisa tu conexión.';
const serverMessage = 'El servidor respondió con un error.';
const invalidBodyMessage = 'La respuesta del servidor no es válida.';

function isAbort(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}

export async function graphqlRequest({ operationName, query, variables, signal }) {
  let response;
  try {
    response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName, query, variables }),
      signal,
    });
  } catch (error) {
    if (isAbort(error)) {
      throw error;
    }
    throw new ApiError(networkMessage);
  }

  if (!response.ok) {
    throw new ApiError(serverMessage, response.status);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(invalidBodyMessage, response.status);
  }

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    throw new GraphQLError(body.errors);
  }
  return body.data;
}
