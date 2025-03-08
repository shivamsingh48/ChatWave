import React from 'react'
import ChatHeader from './components/chat-header'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

function ChatContainer() {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 h-screen w-screen sm:static sm:h-[100vh] sm:w-[60vw] md:w-[65vw] lg:w-[70vw] xl:w-[75vw] bg-[#1c1d25] flex flex-col'>
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
    </div>
  )
}

export default ChatContainer