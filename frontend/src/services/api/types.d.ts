import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    __isRetryRequest?: boolean;
  }
}
