import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'available-slots',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin-slots',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'book-appointment/:slotId',
    renderMode: RenderMode.Client
  },
  {
    path: 'confirmation/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
