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
    const { selectedChatType, selectedChatData, addMessage, userInfo } = useAppStore()
    // console.log("chat data",selectedChatData);

    const selectedChatDataRef = useRef(selectedChatData);
    const selectedChatTypeRef = useRef(selectedChatType);

    useEffect(() => {
        selectedChatDataRef.current = selectedChatData;
        selectedChatTypeRef.current = selectedChatType;
    }, [selectedChatData, selectedChatType]);


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
                console.log("Current Chat Data:", selectedChatDataRef);
                if (
                    selectedChatTypeRef.current !== undefined &&
                    (selectedChatDataRef.current._id === message.sender._id ||
                        selectedChatDataRef.current._id === message.recipient._id)
                ) {
                    console.log(message);
                    addMessage(message);
                }
            }

            socket.current.on("recieveMessage", handleRecieveMessage)

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