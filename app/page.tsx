import Image from "next/image";
import MainPage from "../components/MainPage";
import Link from "next/link";
import SidebarDemo from "../components/sidebar";
export default function Home() {
  return (
    <>
      {/* <SidebarDemo> */}
      <div className="h-full w-full z-10 ">
        <Link href={"/dashboard"}>Go to MainPage</Link>
        </div>
        
      {/* <div className="h-full w-full"><MainPage/></div> */}
    </>
  );
}
