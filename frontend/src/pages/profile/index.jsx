import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api.client';
import { ADD_PROFILE_IMAGE_ROUTE, DELETE_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE } from '@/utils/contanst';
import { useToast } from '@/hooks/use-toast';

function Profile() {

  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef=useRef(null)
  const {toast}=useToast();

  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.avatar){
      setAvatar(`${HOST}/${userInfo.avatar}`)
      console.log(avatar);
    }
  },[userInfo])

  const validateProfile=()=>{
    if(!firstName){
      toast({
        title:"FirstName is required"
      })
      return false;
    }
    if(!lastName){
      toast({
        title:"LastName is required"
      })
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
      if(validateProfile()){
        try {
          const {data}=await apiClient.patch(UPDATE_PROFILE,{firstName,lastName,color:selectedColor},{withCredentials:true})
          console.log(data);
          if(data.success){
            setUserInfo(data.user)
            toast({
              title:"profile updated successfully"
            })
            navigate('/buy')
          }
          
        } catch (error) {
          console.log(error);
        }
      }
  }

  const handleFileInputClick=()=>{
    fileInputRef.current.click()

  }

  const handleImageChange=async(event)=>{
      const file=event.target.files[0];
      if(file){
        const formData=new FormData();
        formData.append("profile-image",file)
        const {data}=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true})
        console.log(data);
        
        if(data.success){
          setUserInfo({...userInfo,avatar:data.avatar})
          toast({
            title:"avatar updated successfully."
          })
        }
      }
      
  }

  const handleDeleteImage=async()=>{
    try {
      const {data}=await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE,{withCredentials:true})
      if(data.success){
        setUserInfo({...userInfo,avatar:null})
        toast({
          title:"avatar deleted successfully."
        })
        setAvatar(null)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div
        onClick={()=>navigate('/chat')}
        >
          <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                avatar ?
                  <AvatarImage
                    src={avatar}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  /> :
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                    {
                      firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                    }
                  </div>
              }
            </Avatar>
            {
              hovered && <div 
              className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full '
              onClick={avatar?handleDeleteImage:handleFileInputClick}
              >
                {
                  avatar ? <FaTrash className='text-white text-3xl cursor-pointer' /> : <FaPlus className='text-white text-3xl cursor-pointer' />
                }
              </div>
            }
          <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name='profile-image' accept='.png, .jpeg, .jpg, .svg, .webp'/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center ">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disable value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {
                colors.map((color, index) =>
                  <div className={`
                    ${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                    ${selectedColor === index ? "outline outline-white outline-1" : ""}
                  `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  ></div>
                )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button 
          className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile