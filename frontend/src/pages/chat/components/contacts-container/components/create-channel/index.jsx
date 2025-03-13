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
import { useToast } from "@/hooks/use-toast";

function CreateChannel() {

    const {setSelectedChatType, setSelectedChatData, addChannel} = useAppStore()
    const [newChannelModal, setNewChannelModal] = useState(false)
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    useEffect(()=>{
        const getData=async()=>{
            try {
                const {data}=await apiClient.get(GET_ALL_CONTACTS_ROUTES,{withCredentials:true})
                if(data.success){
                    setAllContacts(data.contacts)
                }
            } catch (error) {
                console.error("Error fetching contacts:", error)
                toast({
                    title: "Error",
                    description: "Failed to load contacts. Please try again.",
                    variant: "destructive"
                })
            }
        }
        getData()
    },[toast])

    const createChannel=async()=>{
        try {
            if(channelName.length === 0) {
                toast({
                    title: "Missing Information",
                    description: "Please enter a channel name",
                    variant: "destructive"
                })
                return
            }
            
            if(selectedContacts.length === 0) {
                toast({
                    title: "Missing Information",
                    description: "Please select at least one contact",
                    variant: "destructive"
                })
                return
            }
            
            setIsLoading(true)
            const {data}=await apiClient.post(CREATE_CHANNEL_ROUTE,{
                name:channelName,
                members:selectedContacts.map((contact)=>contact.value)
            },{withCredentials:true})
            
            if(data.success){
                // Ensure the channel has a valid _id before adding to store
                if(data.channel && data.channel._id) {
                    addChannel(data.channel)
                    setChannelName("")
                    setSelectedContacts([])
                    setNewChannelModal(false)
                    toast({
                        title: "Success",
                        description: "Channel created successfully",
                    })
                } else {
                    throw new Error("Invalid channel data returned")
                }
            } else {
                throw new Error(data.message || "Failed to create channel")
            }
        } catch (error) {
            console.error("Error creating channel:", error)
            toast({
                title: "Error",
                description: error.message || "Failed to create channel. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
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
                        <Button 
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-sm sm:text-base"
                            onClick={createChannel}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Channel"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateChannel