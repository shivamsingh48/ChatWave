import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { HOST } from '@/utils/contanst'
import { getColor } from '@/lib/utils'

const ContactList = ({ contacts = [], isChannel = false }) => {

    const { selectedChatType, selectedChatData, setSelectedChatType, setSelectedChatData, setSelectedChatMessages } = useAppStore()

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")

        setSelectedChatData(contact)
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }

    // Make sure contacts is an array to avoid mapping errors
    if (!Array.isArray(contacts)) {
        return <div className="p-4 text-gray-400">No contacts available</div>;
    }

    return (
        <div className='mt-5'>
            {
                contacts.map((contact) => {
                    // Skip rendering if contact is null or doesn't have an _id
                    if (!contact || !contact._id) return null;
                    
                    return (
                        <div key={contact._id}
                            className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                            ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`}
                            onClick={() => handleClick(contact)}>
                            <div className='flex gap-5 items-center justify-start text-neutral-300'>
                                {
                                    !isChannel && <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                        {
                                            contact.avatar ?
                                                <AvatarImage
                                                    src={`${HOST}/${contact.avatar}`}
                                                    alt="profile"
                                                    className="object-cover w-full h-full bg-black"
                                                /> :
                                                <div className={`
                                                    ${
                                                        selectedChatData &&
                                                        selectedChatData._id === contact._id
                                                        ? getColor(contact.color || 'default') + " border border-white/50"
                                                        : getColor(contact.color || 'default')
                                                    }
                                                    uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full 
                                                    `}>
                                                    {
                                                        contact.firstName ?
                                                            contact.firstName.split("").shift() :
                                                            (contact.email ? contact.email.split("").shift() : '#')
                                                    }
                                                </div>
                                        }
                                    </Avatar>
                                }
                                {isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>}
                                {
                                    isChannel ? 
                                    <span>{contact.name || 'Unnamed Channel'}</span> :
                                    <span>{contact.firstName ? `${contact.firstName} ${contact.lastName || ''}` : (contact.email || 'Unknown Contact')}</span>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ContactList