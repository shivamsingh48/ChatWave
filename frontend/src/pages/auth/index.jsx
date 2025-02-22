import Background from "@/assets/login2.png"
import victory from "@/assets/victory.svg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api.client"
import { useAppStore } from "@/store"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/contanst"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Auth() {

    const navigate=useNavigate()
    const {setUserInfo}=useAppStore()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const {toast}=useToast();

    const validateLogin=()=>{
        if(!email.length){
            toast({
                title: "Email is required",
              })
            return false;
        }
        if(!password.length){
            toast({
                title: "Password is required",
            })
            return false;
        }
        return true;
    }

    const validateSignup=()=>{
        if(!email.length){
            toast({
                title: "Email is required",
              })
            return false;
        }
        if(!password.length){
            toast({
                title: "Password is required",
            })
            return false;
        }
        if(password!==confirmPassword){
            toast({
                title: "Password and Confirm password should be same",
            })
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        if(validateLogin()){
            const {data}=await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
            if(data.success){
                setUserInfo(data.user)
                if(data.user.profileSetup){
                    navigate('/chat')
                }
                else navigate('/profile')
            }
        }
    }

    const handleSignUp = async () => {
        if(validateSignup()){
            const {data}=await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true})
            if(data.success){
                setUserInfo(data.user)
                navigate('/profile')
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">
                            FIll in the details to get started with the best chat app!
                        </p>
                        </div>
                        <div className="flex itmes-center justify-center w-full">
                            <Tabs className="w-3/4" defaultValue="login">
                                <TabsList className="bg-transparent rounded-none w-full ">
                                    <TabsTrigger value="login"
                                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold
                                    data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                    >Login</TabsTrigger>
                                    <TabsTrigger value="signup"
                                        className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-bold
                                    data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                    >Signup</TabsTrigger>
                                </TabsList>
                                <TabsContent className="flex flex-col gap-5 mt-8" value="login">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-full p-3"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-full p-3"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <Button className="rounded-full p-3" onClick={handleLogin}>Login</Button>

                                </TabsContent>
                                <TabsContent className="flex flex-col gap-5" value="signup">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-full p-3"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-full p-3"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Confirm Password"
                                        type="password"
                                        className="rounded-full p-3"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                    <Button className="rounded-full p-3" onClick={handleSignUp}>signup</Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                <div className="hidden xl:flex  justify-center items-center ">
                    <img src={Background} alt="Background login " className="h-[600px]" />
                </div>
            </div>
        </div>
    )
}

export default Auth