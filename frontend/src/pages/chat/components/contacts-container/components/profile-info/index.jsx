import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
import { HOST, LOGOUT_ROUTE } from "@/utils/contanst"
import {FiEdit2} from 'react-icons/fi'
import { useNavigate } from "react-router-dom";
import {IoPowerSharp} from 'react-icons/io5'
import { apiClient } from "@/lib/api.client";


function ProfileInfo() {

    const { userInfo ,setUserInfo} = useAppStore()
    const navigate=useNavigate()

    const logout=async()=>{
        const {data}=await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})
        if(data.success){
            setUserInfo(null)
            navigate("/auth");
        }
    }

    return (
        <div className="h-16 flex items-center justify-between px-2 w-full bg-[#2a2b33] overflow-hidden">
            <div className="flex gap-2 items-center justify-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 relative">
                    <Avatar className="h-8 w-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
                        {
                            userInfo.avatar ?
                                <AvatarImage
                                    src={`${HOST}/${userInfo.avatar}`}
                                    alt="profile"
                                    className="object-cover w-full h-full bg-black"
                                /> :
                                <div className={`uppercase h-8 w-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-sm sm:text-base border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                    {
                                        userInfo.firstName ?
                                            userInfo.firstName.split("").shift() :
                                            userInfo.email.split("").shift()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div className="text-xs sm:text-sm md:text-base truncate max-w-[60px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[120px] xl:max-w-[140px]">
                    {
                        userInfo.firstName && userInfo.lastName ?
                            `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-1 sm:gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center justify-center rounded-full bg-[#343541] hover:bg-[#424353] p-1 sm:p-1.5 transition-all duration-300">
                                <FiEdit2 className="text-purple-500 text-sm sm:text-base"
                                onClick={()=>navigate("/profile")}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Edit profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center justify-center rounded-full bg-[#3a2a35] hover:bg-[#4c2f44] p-1 sm:p-1.5 transition-all duration-300">
                                <IoPowerSharp className="text-red-500 text-sm sm:text-base"
                                onClick={logout}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo