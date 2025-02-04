import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Chat() {

    const {userInfo}=useAppStore()
    const navigate=useNavigate()
    const {toast} =useToast();

    useEffect(()=>{
      if(!userInfo.profileSetup){
        toast({
          title:"please setup your profile to continue"
        })
        navigate('/profile')
      }
    },[])

  return (
    <div>Chat</div>
  )
}

export default Chat