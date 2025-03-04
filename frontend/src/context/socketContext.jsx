import { useAppStore } from "@/store"
import { HOST } from "@/utils/contanst"
import { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client"

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const { selectedChatType, selectedChatData, addMessage, userInfo,addChannelInChannelList,addContactsInDMContacts } = useAppStore()
    // console.log("chat data",selectedChatData);

    const selectedChatDataRef = useRef(selectedChatData);
    const selectedChatTypeRef = useRef(selectedChatType);
    const addChannelInChannelListRef=useRef(addChannelInChannelList);
    const addContactsInDMContactsRef=useRef(addContactsInDMContacts)

    useEffect(() => {
        selectedChatDataRef.current = selectedChatData;
        selectedChatTypeRef.current = selectedChatType;
        addChannelInChannelListRef.current=addChannelInChannelList;
        addContactsInDMContactsRef.current=addContactsInDMContacts
    }, [selectedChatData, selectedChatType,addChannelInChannelList,addContactsInDMContacts]);


    useEffect(() => {
        // console.log("chat type",selectedChatType);

        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            })
            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            })

            const handleRecieveMessage = (message) => {
                if (
                    selectedChatTypeRef.current !== undefined &&
                    (selectedChatDataRef.current._id === message.sender._id ||
                        selectedChatDataRef.current._id === message.recipient._id)
                ) {
                    addMessage(message);
                }
                addContactsInDMContactsRef.current(message)
            }

            const handleRecieveChannelMessage=(message)=>{
                if (
                    selectedChatTypeRef.current !== undefined &&
                    (selectedChatDataRef.current._id === message.channelId )
                ) {
                    addMessage(message);
                }
                addChannelInChannelListRef.current(message)
            }

            socket.current.on("recieveMessage", handleRecieveMessage)
            socket.current.on("receive-channel-message",handleRecieveChannelMessage)

            return () => {
                socket.current.disconnect()
            }
        }
    }, [userInfo, addMessage])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}