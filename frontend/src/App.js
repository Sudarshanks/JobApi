import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

import { ToastContainer } from 'react-toastify'
import Menu from './components/header/Menu'
import Home from './components/common/Home'
import Pnf from './components/common/Pnf'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import ProtectedRoute from './AuthGuard/ProtectedRoute'
import UserDashboard from './components/User/UserDashboard'
import AdminDashboard from './components/Admin/AdminDashboard'
import HRDashboard from './components/HR/HRDashboard'
import AccessDenied from './components/common/AccessDenied'
import AllUsers from './components/Admin/AllUsers'
import ForgotPassword from './components/Auth/ForgotPassword'
import Password from './components/Auth/Password'
import CreateJob from './components/HR/Job/CreateJob'
import JobDetails from './components/HR/Job/JobDetails'
import Details from './components/User/Details'


function App() {
  const context = useContext(AuthContext)
  const [currentUser] = context.authApi.currentUser
  const [isLogin] = context.authApi.isLogin
  const [isUser] = context.authApi.isUser
  const [isHr] = context.authApi.isHr
  const [isAdmin] = context.authApi.isAdmin

  return (
    <Router>
        <Menu/>
        <ToastContainer autoClose={4000} position={'top-left'} />
        <Routes>
           <Route element={<ProtectedRoute/>}>
                <Route path={`/`} element={<Home/>} />
           </Route>

          <Route element={<ProtectedRoute/>} >
                  <Route path={`/user/dashboard`} element={ isUser ? <UserDashboard/>: <Navigate to={`/unauthorized`} />} />
                  <Route path={`/user/job/details/:id`} element={ isUser ? <Details/>: <Navigate to={`/unauthorized`} />} />
          </Route>

          <Route element={<ProtectedRoute/>} >
                  <Route path={`/admin/dashboard`} element={isAdmin? <AdminDashboard/> : <Navigate to={`/unauthorized`}/>} />
                  <Route path={`/admin/users/all`} element={isAdmin? <AllUsers/> : <Navigate to={`/unauthorized`}/>} />
          </Route>

          <Route element={<ProtectedRoute/>} >
                <Route path={`/hr/dashboard`} element={isHr? <HRDashboard/>: <Navigate to={`/unauthorized`} />} />
                <Route path={`/job/create`} element={isHr? <CreateJob/>: <Navigate to={`/unauthorized`} />} />
                <Route path={`/job/details/:id`} element={isHr? <JobDetails/>: <Navigate to={`/unauthorized`} />} />
          </Route>

          <Route path={`/register`} element={isLogin ? <Navigate to={`/`}/> : <Register/>} />
          <Route path={`/login`} element={ isLogin ? <Navigate to={`/`}/> : <Login/> } />
          <Route path={`/forgotPassword`} element={ isLogin ? <Navigate to={`/`}/> : <ForgotPassword/> } />
          <Route path={`/generate/password/:token`} element={ isLogin ? <Navigate to={`/`}/> : <Password/> } />
          <Route path={`/unauthorized`} element={ isLogin ? <AccessDenied/> : <Login/> } />
          
            <Route path={`/*`} element={<Pnf/>} />
        </Routes>
    </Router>
  )
}

export default App
