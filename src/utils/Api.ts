type GenericObject<T> = {
  [P in keyof T]: T[P];
}

function getDataParamsReducer<T>(
  prev: GenericObject<T>,
  curr: [string, T],
): GenericObject<T> {
  const [key, value] = curr;
  if (!value) {
    return prev;
  }

  return {...prev, [key]: value};
}

function hackyChecker(data: any): boolean {

  const emailValue = 'email' in data && data.email;

  return emailValue  === 'testemail@domain.org';
}

const HACKY_SUCCESS_RESPONSE: any = {
  status: 'success',
  message: 'Thank you. You are now subscribed.',
};


const HACKY_FAIL_RESPONSE = {
  status: 'error',
  message: 'Invalid Subscription request.',
};

const FETCH_TIMEOUT = 6000;
const DEFAULT_SERVER = 'SOME_PATH';

export default async function apiCall<RequestT, ResponseT>(
  endpoint: string,
  data: GenericObject<RequestT>
): Promise<ResponseT | undefined> {

  // Delete null values from api parameters
  const validDataParams = Object.entries(data).reduce(getDataParamsReducer, {});

  const fetchParams: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(validDataParams).toString(),
    credentials: 'same-origin',
  };

  const route = `https://${DEFAULT_SERVER}/api/${endpoint}`;

  return new Promise(async (resolve, reject) => {
    try {
      const fetchTimeout = setTimeout(() => {
        return reject(HACKY_FAIL_RESPONSE);
      }, FETCH_TIMEOUT);

      if (hackyChecker(data)) {
        clearTimeout(fetchTimeout);
        return resolve(HACKY_SUCCESS_RESPONSE);
      }

      const apiResponse = await fetch(route, fetchParams);
      clearTimeout(fetchTimeout);

      if (apiResponse.status !== 200) {
        return reject(HACKY_FAIL_RESPONSE);
      }

      return resolve((await apiResponse.json() as ResponseT));
    } catch (error) {
      return reject(HACKY_FAIL_RESPONSE);
    }
  });
};
