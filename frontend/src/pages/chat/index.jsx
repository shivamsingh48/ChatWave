import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactsContainer from './components/contacts-container'
import EmptyChatContainer from './components/empty-chat-container'
import ChatContainer from './components/chat-container'

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
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactsContainer/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>
    </div>
  )
}

export default Chat