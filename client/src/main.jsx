import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ShowUsers from './ShowUsers.jsx'
import { Provider } from 'react-redux';
import { store } from './app/store';
import 
      {    
       RouterProvider ,   
       createBrowserRouter
      }
      from 'react-router-dom'
import EditUser from './EditUser.jsx';
const router =createBrowserRouter([
    {
      path: "/",
      element:<App />
    },
    {
       path:"/show",
       element: <ShowUsers />
    },
    {
       path:"/edit",
       element: <EditUser />
    },

   ])
       
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
)
