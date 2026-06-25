import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import SectionDetail from './pages/SectionDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/section/:id',
    Component: SectionDetail,
  },
]);
