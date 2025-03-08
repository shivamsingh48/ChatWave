import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { animateDefaultOptions, getColor } from "@/lib/utils"
import Lottie from "react-lottie"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api.client";
import { HOST, SEARCH_ROUTE } from "@/utils/contanst";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";


function NewDM() {

    const {setSelectedChatType, setSelectedChatData } = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [isSignupLoading, setIsSignupLoading] = useState(false)

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false)
        setSelectedChatType("contact")
        const contactData = {
            ...contact,
            color: contact.color || 'purple-500'
        }
        setSelectedChatData(contactData)
        setSearchedContacts([])
    }

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const { data } = await apiClient.post(SEARCH_ROUTE, { searchTerm }, { withCredentials: true })
                if (data.success) {
                    setSearchedContacts(data.contacts)
                }
            }
            else {
                setSearchedContacts([])
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
                        <p>Select New Contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[95vw] sm:w-[400px] max-w-[400px] h-[400px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Please select a contact</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search contacts"
                            className="rounded-lg p-4 sm:p-6 bg-[#2c2e3b] border-none text-sm sm:text-base"
                            onChange={e => searchContacts(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-3 sm:gap-5">
                                {
                                    searchedContacts.map((contact) => (
                                        <div key={contact._id} className="flex gap-2 sm:gap-3 items-center cursor-pointer"
                                            onClick={() => selectNewContact(contact)}>
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden">
                                                    {
                                                        contact.avatar ?
                                                            <AvatarImage
                                                                src={`${HOST}/${contact.avatar}`}
                                                                alt="profile"
                                                                className="object-cover w-full h-full bg-black"
                                                            /> :
                                                            <div className={`uppercase h-10 w-10 sm:h-12 sm:w-12 text-base sm:text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                                {
                                                                    contact.firstName ?
                                                                        contact.firstName.split("").shift() :
                                                                        contact.email.split("").shift()
                                                                }
                                                            </div>
                                                    }
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm sm:text-base">
                                                    {contact.firstName && contact.lastName ?
                                                        `${contact.firstName} ${contact.lastName}` : contact.email}
                                                </span>
                                                <span className="text-xs opacity-70 truncate max-w-[180px] sm:max-w-none">{contact.email}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </ScrollArea>
                    )}
                    {
                        searchedContacts.length <= 0 && <div className='flex-1 flex flex-col justify-center items-center duration-1000 transition-all'>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={80}
                                width={80}
                                options={animateDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-2 sm:gap-5 items-center mt-3 sm:mt-5 text-base sm:text-xl lg:text-2xl transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    Hi <span className="text-purple-500">!</span> Search new
                                    <span className="text-purple-500"> Contact. </span>
                                </h3>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>


        </div>
    )
}

export default NewDM