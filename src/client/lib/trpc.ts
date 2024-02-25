import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../../server/routes/trpc';

export const IS_DEV = (import.meta as any).env.DEV;

const url = IS_DEV ? 'http://localhost:8000/trpc' : `${window.location.origin}/trpc`;

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url })],
  transformer: superjson,
});
