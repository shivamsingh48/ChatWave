import Logo from "@/assets/logo"
import ProfileInfo from "./components/profile-info"
import NewDM from "./components/new-dm"
import { useEffect } from "react"
import { apiClient } from "@/lib/api.client"
import { GET_DM_CONTACTS_ROUTES } from "@/utils/contanst"
import { useAppStore } from "@/store"
import ContactList from "@/components/contacts-list"

function ContactsContainer() {

    const {setDirectMessagesContacts,directMessagesContacts}=useAppStore()

    useEffect(()=>{
        const getContacts=async()=>{
            const {data}=await apiClient.get(GET_DM_CONTACTS_ROUTES,{withCredentials:true})
            if(data.success){
                setDirectMessagesContacts(data.contacts)
            }
        }

        getContacts()
    },[])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
        <div  className="pt-3">
            <Logo/>
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Tile text="Direct Messages"/>
                <NewDM/>
            </div>
            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                <ContactList contacts={directMessagesContacts}/>
            </div>
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Tile text="Channels"/>
            </div>
        </div>
        <ProfileInfo/>
    </div>
  )
}

export default ContactsContainer

const Tile=({text})=>{
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-100 text-sm ">
            {text}
        </h6>
    )
}
