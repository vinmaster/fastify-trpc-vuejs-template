import { createTRPCClient } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import superjson from 'superjson';
import type { AppRouter } from '../../server/routes/trpc';

const IS_DEV = (import.meta as any).env.DEV;

export const wsClient = createWSClient({
  url: IS_DEV ? `ws://localhost:8000/trpc` : `wss://${window.location.host}/trpc`,
});

export const client = createTRPCClient<AppRouter>({
  url: IS_DEV ? 'http://localhost:8000/trpc' : `${window.location.origin}/trpc`,
  transformer: superjson,
  links: [wsLink({ client: wsClient })],
});
