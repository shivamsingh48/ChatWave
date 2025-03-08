import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api.client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES} from "@/utils/contanst";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";


function CreateChannel() {

    const {setSelectedChatType, setSelectedChatData,addChannel } = useAppStore()
    const [newChannelModal, setNewChannelModal] = useState(false)
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(()=>{
        const getData=async()=>{
            const {data}=await apiClient.get(GET_ALL_CONTACTS_ROUTES,{withCredentials:true})
            if(data.success){
                setAllContacts(data.contacts)
            }
        }
        getData()
    },[])

    const createChannel=async()=>{
        try {
            if(channelName.length>0 && selectedContacts.length>0){
                const {data}=await apiClient.post(CREATE_CHANNEL_ROUTE,{
                    name:channelName,
                    members:selectedContacts.map((contact)=>contact.value)
                },{withCredentials:true})
                if(data.success){
                    setChannelName("")
                    setSelectedContacts([])
                    setNewChannelModal(false)
                    addChannel(data.contacts)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[95vw] sm:w-[400px] max-w-[400px] h-[400px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Please fill up the details for new channel</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-4 sm:p-6 bg-[#2c2e3b] border-none text-sm sm:text-base"
                            onChange={e => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white text-sm sm:text-base"
                        defaultOptions={allContacts}
                        placeholder="Search Contacts"
                        value={selectedContacts}
                        onChange={setSelectedContacts}
                        emptyIndicator={
                            <p className="text-center text-base sm:text-lg leading-10 text-gray-600">No result found</p>
                        }
                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-sm sm:text-base"
                        onClick={createChannel}>
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


        </div>
    )
}

export default CreateChannel