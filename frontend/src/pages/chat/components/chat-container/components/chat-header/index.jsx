import {RiCloseFill} from 'react-icons/ri'

function ChatHeader() {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10">
        <div className="flex gap-5 items-center">
            <div className="flex g-3 items-center justify-center"></div>
            <div className="flex items-center justify-center">
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                    <RiCloseFill className='text-3xl'/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatHeader