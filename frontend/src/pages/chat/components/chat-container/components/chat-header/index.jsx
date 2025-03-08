import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST } from '@/utils/contanst'
import { RiCloseFill } from 'react-icons/ri'

function ChatHeader() {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore()

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-10">
      <div className="flex gap-3 sm:gap-5 items-center w-full justify-between">
        <div className="flex gap-2 sm:gap-3 items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
            {
              selectedChatType==="contact" ?
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden">
              {
                selectedChatData.avatar ?
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.avatar}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  /> :
                  <div className={`uppercase h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                    {
                      selectedChatData.firstName ?
                        selectedChatData.firstName.split("").shift() :
                        selectedChatData.email.split("").shift()
                    }
                  </div>
              }
            </Avatar> :
            <div className='bg-[#ffffff22] h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full'>#</div>
            }  
          </div>
          <div className="text-sm sm:text-base truncate max-w-[180px] sm:max-w-none">
            {selectedChatType==="channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName?
              `${selectedChatData.firstName} ${selectedChatData.lastName}`:selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={closeChat}>
            <RiCloseFill className='text-2xl sm:text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader