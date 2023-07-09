import type { APIRoute } from 'astro';

export const get: APIRoute = function get({ params, request }) {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
};
