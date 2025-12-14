import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import NotFound from './components/NotFound/NotFound'
import ProdectedAuth from './components/ProdectedAuth/ProdectedAuth'
import ProdectedRoute from './components/ProdectedRoute/ProdectedRoute'
import PostDetails from './components/PostDetails/PostDetails'

function App() {

  const routes = createBrowserRouter([
    {path:"",element:<Layout />,children:[
      {path:"",element:<ProdectedRoute><Home /></ProdectedRoute>},
      {path:"profile",element:<ProdectedRoute><Profile /></ProdectedRoute>},
      {path:"postDetails/:id",element:<ProdectedRoute><PostDetails /></ProdectedRoute>},
      {path:"login",element:<ProdectedAuth><Login /></ProdectedAuth>},
      {path:"register",element:<ProdectedAuth><Register /></ProdectedAuth>},
      {path:"*",element:<NotFound />}
    ]}
  ])

  return (
    <>
    <RouterProvider router={routes}/>
    </>
  )
}

export default App
