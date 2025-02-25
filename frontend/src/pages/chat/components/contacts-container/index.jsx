import Logo from "@/assets/logo"
import ProfileInfo from "./components/profile-info"
import NewDM from "./components/new-dm"

function ContactsContainer() {
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
