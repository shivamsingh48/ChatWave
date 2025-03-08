import { useSocket } from "@/context/socketContext"
import { apiClient } from "@/lib/api.client"
import { useAppStore } from "@/store"
import { UPLOAD_FILE_route } from "@/utils/contanst"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

function MessageBar() {

  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore()
  const socket = useSocket()
  const emojiRef = useRef()
  const fileInputRef = useRef()
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined
      })
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })
    }
    setMessage("")
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file)
        setIsUploading(true)
        const { data } = await apiClient.post(UPLOAD_FILE_route, formData,
          {
            withCredentials: true,
            onUploadProgress: (data) => {
              setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
            }
          },
        )
        if (data.success) {
          if (selectedChatType === "contact") {
            setIsUploading(false)
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: data.filePath
            })
          }else if (selectedChatType === "channel") {
            setIsUploading(false)
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: data.filePath,
              channelId: selectedChatData._id,
            })
          }
          }
        }
      } catch (error) {
        setIsUploading(false)
        console.log(error)
      }
    }

  return (
      <div className="min-h-[60px] h-auto pb-safe bg-[#1c1d25] flex justify-center items-center px-2 sm:px-8 py-3 gap-2 sm:gap-6 sticky bottom-0 left-0 right-0">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 sm:gap-5 pr-2 sm:pr-5">
          <input
            type="text"
            className="flex-1 py-2 px-3 sm:p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-sm sm:text-base"
            placeholder="Enter Message"
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all p-1 sm:p-2'
            onClick={handleAttachmentClick}
          >
            <GrAttachment className="text-lg sm:text-2xl" />
          </button>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
          <div className="relative">
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all p-1 sm:p-2'
              onClick={() => setEmojiPickerOpen(true)}
            >
              <RiEmojiStickerLine className="text-lg sm:text-2xl" />
            </button>
            <div className="absolute bottom-14 right-0 z-50" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>
        <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-2 sm:p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all'
          onClick={handleSendMessage}
        >
          <IoSend className="text-lg sm:text-2xl" />
        </button>
      </div>
    )
  }

  export default MessageBar