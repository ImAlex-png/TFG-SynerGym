export const environment = {
  production: true,
  apiUrl: typeof window !== 'undefined'? `http://${window.location.hostname}:8081` : 'http://backend:8081'
};