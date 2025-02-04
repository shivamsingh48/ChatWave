import {useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api.client'
import { AUTH_ROUTES, GET_USERINFO } from './utils/contanst'

const PrivateRoute=({children})=>{
  const {userInfo}=useAppStore()
  const isAuthenticated=!!userInfo
  return isAuthenticated ? children :<Navigate to="/auth"/>;
}

const AuthRoute=({children})=>{
  const {userInfo}=useAppStore()
  const isAuthenticated=!!userInfo
  return isAuthenticated ? <Navigate to="/chat"/> : children;
}

function App() {

  const {userInfo,setUserInfo}=useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{

    const getUserInfo=async ()=>{
      try {
        const {data}=await apiClient.get(GET_USERINFO,{withCredentials:true});
        if(data.success){
          setUserInfo(data.user)
        }
        else{
          setUserInfo(undefined)
        }
        
      } catch (error) {
        setUserInfo(undefined)
      } finally{
        setLoading(false)
      }
    }

    if(!userInfo){
      getUserInfo();
    }
    else{
      setLoading(false);
    }

  },[userInfo,setUserInfo])

  if(loading) return <div>loading...</div>

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={
        <AuthRoute>
          <Auth/>
        </AuthRoute>
      }/>
      <Route path='/chat' element={
        <PrivateRoute>
          <Chat/>
        </PrivateRoute>
      }/>
      <Route path='/profile' element={
        <PrivateRoute>
          <Profile/>
        </PrivateRoute>
      }/>

      <Route path='*' element={<Navigate to="/auth"/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
