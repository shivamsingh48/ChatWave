import { animateDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"

function EmptyChatContainer() {
  return (
    <div className='flex-1 bg-[#1c1d25] hidden sm:flex flex-col justify-center items-center duration-1000 transition-all px-4 sm:px-0 sm:w-[60vw] md:w-[65vw] lg:w-[70vw] xl:w-[75vw]'>
        <Lottie
        isClickToPauseDisabled={true}
        height={150}
        width={150}
        options={animateDefaultOptions}
        />
        <div className="text-opacity-80 text-white flex flex-col gap-3 sm:gap-5 items-center mt-6 sm:mt-10 text-xl sm:text-3xl lg:text-4xl transition-all duration-300 text-center">
            <h3 className="poppins-medium">
                Hi <span className="text-purple-500">!</span> Welcome to
                <span className="text-purple-500"> ChatWave </span> Chat App 
                <span className="text-purple-500">.</span>
            </h3>
        </div>
    </div>
  )
}

export default EmptyChatContainer