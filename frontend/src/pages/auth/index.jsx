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
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [isSignupLoading, setIsSignupLoading] = useState(false)
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
            try {
                setIsLoginLoading(true);
                const {data}=await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
                if(data.success){
                    setUserInfo(data.user)
                    toast({
                        title: "Login Successful",
                        description: "Welcome back to ChatWave!",
                        variant: "default"
                    })
                    if(data.user.profileSetup){
                        navigate('/chat')
                    }
                    else navigate('/profile')
                } else {
                    toast({
                        title: "Login Failed",
                        description: data.message || "Invalid email or password",
                        variant: "destructive"
                    })
                }
            } catch (error) {
                toast({
                    title: "Login Error",
                    description: error?.response?.data?.message || "Failed to login. Please check your credentials and try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoginLoading(false);
            }
        }
    }

    const handleSignUp = async () => {
        if(validateSignup()){
            try {
                setIsSignupLoading(true);
                const {data}=await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true})
                if(data.success){
                    setUserInfo(data.user)
                    toast({
                        title: "Signup Successful",
                        description: "Welcome to ChatWave! Let's set up your profile.",
                        variant: "default"
                    })
                    navigate('/profile')
                } else {
                    toast({
                        title: "Signup Failed",
                        description: data.message || "Failed to create account",
                        variant: "destructive"
                    })
                }
            } catch (error) {
                toast({
                    title: "Signup Error",
                    description: error?.response?.data?.message || "Failed to create account. This email may already be in use.",
                    variant: "destructive"
                });
            } finally {
                setIsSignupLoading(false);
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-br from-[#121218] to-[#1c1d25]">
            <div className="h-auto min-h-[550px] max-h-[95vh] bg-[#181920] border border-[#2f303b] text-white shadow-2xl w-[92vw] sm:w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 overflow-hidden">
                <div className="flex flex-col gap-4 items-center justify-center p-6 py-7">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center mb-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Welcome</h1>
                            <img src={victory} alt="Victory Emoji" className="h-[50px] sm:h-[60px] md:h-[80px]" />
                        </div>
                        <p className="font-medium text-center text-sm text-gray-400 mt-1">
                            Fill in the details to get started with the best chat app!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full mt-4 max-w-[350px]">
                        <Tabs className="w-full" defaultValue="login">
                            <TabsList className="bg-[#232530] rounded-xl w-full mb-4 p-1">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-[#8417ff] text-gray-300 rounded-lg w-full data-[state=active]:text-white data-[state=active]:font-bold
                                p-2.5 text-sm transition-all duration-300"
                                >Login</TabsTrigger>
                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-[#8417ff] text-gray-300 rounded-lg w-full data-[state=active]:text-white data-[state=active]:font-bold
                                p-2.5 text-sm transition-all duration-300"
                                >Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-4 mt-4" value="login">
                                <div className="relative">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-xl p-5 pl-10 bg-[#232530] border-none text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:ring-2 transition-all"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-[14px] h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-xl p-5 pl-10 bg-[#232530] border-none text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:ring-2 transition-all"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-[14px] h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <Button className="rounded-xl p-5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-900/20 border-none outline-none relative" 
                                onClick={handleLogin} 
                                disabled={isLoginLoading}>
                                    {isLoginLoading ? (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                                            <div className="h-5 w-5 relative">
                                                <div className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></div>
                                                <div className="relative h-5 w-5 rounded-full bg-white opacity-90"></div>
                                            </div>
                                        </div>
                                    ) : "Login"}
                                </Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-4 mt-4" value="signup">
                                <div className="relative">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-xl p-5 pl-10 bg-[#232530] border-none text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:ring-2 transition-all"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-[14px] h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-xl p-5 pl-10 bg-[#232530] border-none text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:ring-2 transition-all"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-[14px] h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirm Password"
                                        type="password"
                                        className="rounded-xl p-5 pl-10 bg-[#232530] border-none text-sm text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:ring-2 transition-all"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-[14px] h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <Button className="rounded-xl p-5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-900/20 border-none outline-none relative" 
                                onClick={handleSignUp}
                                disabled={isSignupLoading}>
                                    {isSignupLoading ? (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                                            <div className="flex space-x-2">
                                                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                            </div>
                                        </div>
                                    ) : "Signup"}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex flex-col overflow-hidden relative rounded-r-3xl">
                    <img src={Background} alt="background"
                        className="rounded-r-3xl h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-10">
                        <h2 className="text-4xl font-bold text-white mb-4">ChatWave</h2>
                        <p className="text-center text-white text-opacity-90">
                            Connect with friends, family, and colleagues through seamless messaging and secure file sharing. Join ChatWave today!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth