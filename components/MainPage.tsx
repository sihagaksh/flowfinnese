'use client';
import Image from "next/image";
import { Spotlight } from "./ui/spotlight";
import { TextHoverEffect } from "./ui/texthover";
const MainPage: React.FC = () => {
    return (
        <div className="bg-black">
           
            <div className="absolute top-0 left-0 -z-10">
            <Image src={"/design.svg"} alt="Design" width={1920} height={1080} />
            </div> 
            
        </div>
    );
}

export default MainPage;