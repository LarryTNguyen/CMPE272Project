import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AppLayout from './pages/AppLayout';
import InputBid from './pages/InputBid';
import ProtectedRoute from './pages/ProtectedRoute';
import Profile from './pages/Profile'
import Portfolio from './pages/portfolio'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // time needed to update data in cache
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/input',
    element: <InputBid />,
  },
  {
    path: '/profile/:username',
    element: <Profile/>,
  },
  {
    path: '/portfolio',
    element: <Portfolio/>,
  },
  
]);

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
