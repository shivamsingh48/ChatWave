import Logo from "@/assets/logo"
import ProfileInfo from "./components/profile-info"
import NewDM from "./components/new-dm"
import { useEffect } from "react"
import { apiClient } from "@/lib/api.client"
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/contanst"
import { useAppStore } from "@/store"
import ContactList from "@/components/contacts-list"
import CreateChannel from "./components/create-channel"

function ContactsContainer() {

    const {setDirectMessagesContacts,directMessagesContacts,channels,setChannels}=useAppStore()

    useEffect(()=>{
        const getContacts=async()=>{
            const {data}=await apiClient.get(GET_DM_CONTACTS_ROUTES,{withCredentials:true})
            if(data.success){
                setDirectMessagesContacts(data.contacts)
            }
        }

        const getChannels=async()=>{
            const {data}=await apiClient.get(GET_USER_CHANNELS_ROUTE,{withCredentials:true})
            if(data.success){
                setChannels(data.channels)
            }
        }

        getContacts()
        getChannels()
    },[setChannels,setDirectMessagesContacts])



  return (
    <div className="relative w-full h-[100vh] sm:h-full sm:w-[40vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-[#1b1c24] border-r-2 border-[#2f303b] flex flex-col">
        <div className="pt-3 px-4 sm:px-3 md:px-2 lg:px-4">
            <Logo/>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          <div className="my-5">
              <div className="flex items-center justify-between pr-3 sm:pr-3 md:pr-2 lg:pr-4">
                  <Tile text="Direct Messages"/>
                  <NewDM/>
              </div>
              <div className="max-h-[30vh] sm:max-h-[38vh] overflow-y-auto scrollbar-hidden">
                  <ContactList contacts={directMessagesContacts}/>
              </div>
          </div>
          <div className="my-5">
              <div className="flex items-center justify-between pr-3 sm:pr-3 md:pr-2 lg:pr-4">
                  <Tile text="Channels"/>
                  <CreateChannel/>
              </div>
              <div className="max-h-[30vh] sm:max-h-[38vh] overflow-y-auto scrollbar-hidden">
                  <ContactList contacts={channels} isChannel={true}/>
              </div>
          </div>
        </div>
        <ProfileInfo/>
    </div>
  )
}

export default ContactsContainer

const Tile=({text})=>{
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-3 sm:pl-3 md:pl-2 lg:pl-4 font-light text-opacity-100 text-xs sm:text-sm">
            {text}
        </h6>
    )
}
