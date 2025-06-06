import authHttpClient from './http';

// send register  request
export const register = (data) => {
  return authHttpClient.post('/auth/register', data);
};

// send login authorizaiton request
export const login = (params) => {
  return authHttpClient.post('/auth/login', params);
};

