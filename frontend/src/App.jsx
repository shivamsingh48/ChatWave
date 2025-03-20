import {useEffect, useState, Suspense, lazy } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAppStore } from './store'
import { apiClient } from './lib/api.client'
import { AUTH_ROUTES, GET_USERINFO } from './utils/contanst'
import { useToast } from './hooks/use-toast'

// Preload critical components
const Auth = lazy(() => import('./pages/auth'))
const Chat = lazy(() => import('./pages/chat'))
const Profile = lazy(() => import('./pages/profile'))

// Loading component
const LoadingScreen = () => (
  <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-br from-[#121218] to-[#1c1d25]">
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-r-4 border-l-4 border-transparent border-r-blue-500 border-l-blue-600 animate-pulse"></div>
      </div>
      <div className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text text-2xl font-bold">
        ChatWave
      </div>
      <div className="flex space-x-2 mt-3">
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  </div>
)

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

function AppContent() {
  const {userInfo,setUserInfo}=useAppStore()
  const [loading, setLoading] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const { toast } = useToast()
  const [isAuthPage, setIsAuthPage] = useState(window.location.pathname.includes('/auth'))

  useEffect(() => {
    // Update isAuthPage when URL changes
    const handleLocationChange = () => {
      setIsAuthPage(window.location.pathname.includes('/auth'))
    }
    
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  useEffect(()=>{
    let mounted = true;

    const getUserInfo=async ()=>{
      try {
        // Check if we have cached user info
        const cachedUserInfo = sessionStorage.getItem('userInfo');
        if (cachedUserInfo) {
          const { data, timestamp } = JSON.parse(cachedUserInfo);
          // Use cache if it's less than 5 minutes old
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setUserInfo(data);
            setLoading(false);
            setInitialLoadComplete(true);
            return;
          }
        }

        const {data}=await apiClient.get(GET_USERINFO,{withCredentials:true});
        if(data.success && mounted){
          setUserInfo(data.user)
          // Cache the user info
          sessionStorage.setItem('userInfo', JSON.stringify({
            data: data.user,
            timestamp: Date.now()
          }));
        }
        else if(mounted){
          setUserInfo(undefined)
          if (data.message && !isAuthPage) {
            toast({
              title: "Authentication Error",
              description: data.message,
              variant: "destructive"
            })
          }
        }
        
      } catch (error) {
        if(mounted){
          setUserInfo(undefined)
          if (!isAuthPage) {
            toast({
              title: "Connection Error",
              description: error?.response?.data?.message || "Failed to connect to server. Please try again later.",
              variant: "destructive"
            })
          }
        }
      } finally{
        if(mounted){
          setLoading(false)
          setInitialLoadComplete(true)
        }
      }
    }

    if(!userInfo){
      getUserInfo();
    }
    else{
      setLoading(false);
      setInitialLoadComplete(true);
    }

    return () => {
      mounted = false;
    }
  },[userInfo,setUserInfo, toast, isAuthPage])

  // Global error handler for API requests
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      config => config,
      error => {
        if (!isAuthPage) {
          toast({
            title: "Request Error",
            description: "Failed to send request to server",
            variant: "destructive"
          })
        }
        return Promise.reject(error)
      }
    )

    const responseInterceptor = apiClient.interceptors.response.use(
      response => response,
      error => {
        if (isAuthPage) {
          return Promise.reject(error)
        }
        
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: "Authentication Error",
              description: "Your session has expired. Please login again.",
              variant: "destructive"
            })
            setUserInfo(undefined)
          } else if (error.response.status === 403) {
            toast({
              title: "Permission Denied",
              description: "You don't have permission to perform this action",
              variant: "destructive"
            })
          } else if (error.response.status >= 500) {
            toast({
              title: "Server Error",
              description: "Something went wrong on our servers. Please try again later.",
              variant: "destructive"
            })
          } else {
            toast({
              title: "Error",
              description: error.response.data?.message || "An unexpected error occurred",
              variant: "destructive"
            })
          }
        } else if (error.request) {
          toast({
            title: "Network Error",
            description: "Unable to connect to server. Please check your internet connection.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Application Error",
            description: "An unexpected error occurred",
            variant: "destructive"
          })
        }
        return Promise.reject(error)
      }
    )

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor)
      apiClient.interceptors.response.eject(responseInterceptor)
    }
  }, [toast, setUserInfo, isAuthPage])

  if(loading) return <LoadingScreen />

  return (
    <Suspense fallback={<LoadingScreen />}>
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
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
