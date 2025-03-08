import React, { useEffect } from 'react'
import ChatHeader from './components/chat-header'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

function ChatContainer() {
  // Add viewport height adjustment for mobile browsers
  useEffect(() => {
    // Function to update CSS custom property with the viewport height
    const setVH = () => {
      // First get the viewport height and multiply it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial set
    setVH();

    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 h-[100vh] h-[calc(var(--vh,1vh)*100)] w-screen sm:static sm:h-[100vh] sm:w-[60vw] md:w-[65vw] lg:w-[70vw] xl:w-[75vw] bg-[#1c1d25] flex flex-col'>
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
    </div>
  )
}

export default ChatContainer