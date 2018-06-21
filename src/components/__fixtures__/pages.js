import Home from '../pages/Home';
import NotFound from '../pages/404';

export default [
  {
    name: 'Home Page',
    component: Home,
    url: '/',
  },
  {
    name: '404 Page',
    component: NotFound,
    url: '/404',
  },
];
