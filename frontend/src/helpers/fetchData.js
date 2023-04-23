export const CLIENT_ERROR = 'client-error';
export const NETWORK_ERROR = 'network-error';
export const SERVER_ERROR = 'server-error';

export class ResponseError extends Error {
  constructor({message, errorType, errorCode, errorCodeText, data} = {}) {
    super(message);
    this.name = 'ResponseError';
    this.errorType = errorType;
    this.errorCode = errorCode;
    this.errorCodeText = errorCodeText;
    this.data = data;
  }
}

export async function fetchData(uri, options) {
  try {
    const response = await fetch(uri, options);
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : undefined;

    // HTTP error occured (4xx - 5xx)
    if (!response.ok) {
      // Server error (5xx)
      if (500 <= response.status && response.status <= 599) {
        throw new ResponseError({
          message: 'Encountered server-error response (5xx)',
          errorType: SERVER_ERROR,
          errorCode: response.status,
          errorCodeText: response.statusText,
        });
      }
      // Client error (4xx)
      else {
        throw new ResponseError({
          message: 'Encountered client-error response (4xx)',
          errorType: CLIENT_ERROR,
          errorCode: response.status,
          errorCodeText: response.statusText,
          data: data,
        });
      }
    }

    // Successful request
    return data;
  }
  catch (e) {
    // Network error occured
    if (e instanceof TypeError) {
      throw new ResponseError({
        message: 'Encountered network error',
        errorType: NETWORK_ERROR,
      });
    }
    else {
      throw e;
    }
  }
}

export function isClientError(e) {
  if (e instanceof ResponseError && e.errorType === CLIENT_ERROR) {
    return true;
  }
  return false;
}

export function isNetworkError(e) {
  if (e instanceof ResponseError && e.errorType === NETWORK_ERROR) {
    return true;
  }
  return false;
}

export function isServerError(e) {
  if (e instanceof ResponseError && e.errorType === SERVER_ERROR) {
    return true;
  }
  return false;
}
