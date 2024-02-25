const IS_DEV = (import.meta as any).env.DEV;

export const BASE_URL = IS_DEV ? 'http://localhost:8000' : `${window.location.origin}`;
console.log('http client loaded');

export class HttpClient {
  static setup() {
    console.log(BASE_URL);
  }

  static async get<T>(path: string, reqInit?: RequestInit) {
    let res = await fetch(`${BASE_URL}${path}`, reqInit);
    let json = (await res.json()) as T;
    return json;
  }
}
