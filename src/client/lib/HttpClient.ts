const IS_DEV = (import.meta as any).env.DEV;

export const BASE_URL = IS_DEV ? 'http://localhost:8000' : `${window.location.origin}`;
const INTERCEPTORS_IGNORE_PATHS = ['/api/refresh', '/api/info'];

interface PayloadContainer {
  payload: any;
}

export class HttpClient {
  static requestInterceptors: ((req: Request) => Promise<Request>)[] = [];
  static responseInterceptors: ((
    req: Request,
    res: Response
  ) => Promise<[req: Request, res: Response]>)[] = [];

  static setup() {
    this.requestInterceptors = [this.addJwt.bind(this)];
    this.responseInterceptors = [this.refreshToken.bind(this)];
  }

  static shouldRunInterceptors(urlStr: string): boolean {
    let url = new URL(urlStr);
    return INTERCEPTORS_IGNORE_PATHS.every(p => !url.pathname.startsWith(p));
  }

  static updateBaseUrl(url: string): string {
    return `${BASE_URL}${url}`;
  }

  static async addJwt(req: Request): Promise<Request> {
    req.headers.set('Authorization', 'example-token');
    return req;
  }

  static async refreshToken(req: Request, res: Response): Promise<[req: Request, res: Response]> {
    if (res.status === 401) {
      res = await this.get('/api/info');
    }
    return [req, res];
  }

  static async get<T>(resource: string, reqInit?: RequestInit): Promise<T> {
    // Make sure this is a GET request
    // if (resource instanceof Request && resource.method !== 'GET') {
    //   resource = new Request(resource, {
    //     method: 'GET',
    //   });
    // }
    return await this.sendRequest(resource, { ...reqInit, method: 'GET' });
  }

  static async post<T>(resource: string, reqInit?: RequestInit & PayloadContainer): Promise<T> {
    return await this.sendRequest(resource, { ...reqInit, method: 'POST' });
  }

  static async sendRequest<T>(resource: string | Request, reqInit?: RequestInit): Promise<T> {
    // Update base url
    if (typeof resource === 'string') {
      resource = this.updateBaseUrl(resource);
    } else if (resource instanceof Request) {
      resource = new Request(this.updateBaseUrl(resource.url), resource);
    }

    // Prep request init to create the request object
    reqInit ??= {};
    reqInit.credentials ??= 'same-origin';
    reqInit.mode ??= 'cors';
    if (!reqInit.headers) {
      let headers = new Headers(reqInit?.headers);
      headers.set('Content-Type', 'application/json');
      reqInit.headers = headers;
    }

    if ((reqInit as RequestInit & PayloadContainer)['payload'] !== undefined) {
      reqInit.body = JSON.stringify((reqInit as RequestInit & PayloadContainer).payload);
    }

    let req = new Request(resource, reqInit);

    if (this.shouldRunInterceptors(req.url)) {
      // Run request interceptors
      req = await this.requestInterceptors.reduce(
        async (req, fn) => fn(await req),
        Promise.resolve(req)
      );
    }

    // Send the request
    let res = await fetch(req);

    if (this.shouldRunInterceptors(req.url)) {
      // Run response interceptors
      res = (
        await this.responseInterceptors.reduce(async (pair, fn) => {
          return fn(...(await pair));
        }, Promise.resolve([req, res] as [req: Request, res: Response]))
      )[1];
    }

    if (res instanceof Response) {
      let json = await res.json();
      if (res.ok) return json;
      else throw json;
    } else {
      return res;
    }
  }
}
