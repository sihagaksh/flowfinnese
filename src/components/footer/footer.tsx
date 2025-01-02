import MaxWidthWrapper from "../MaxWidthWrapper";
import TexturedTriangles from "../textured-triangles";
import { User,Phone,Mail } from "lucide-react";
const Footer = () => {
    return (
        <footer className="h-[calc(100vh-64px)] relative">
            <MaxWidthWrapper className="h-full flex flex-col justify-center items-center">
                <section className="lg:text-7xl md:text-6xl text-5xl text-green-600 dark:text-rose-600 lg:mt-0 mt-36">FLOW FINESSE</section>
                <section className="lg:max-w-3xl mt-16 text-center lg:text-lg md:text-md text-sm max-w-xl">
                Our platform simplifies splitting bills and tracking shared expenses with friends or groups. Easily add expenses, and we&apos;ll handle the calculations. Stay organized and keep everyone on the same page with real-time updates.</section>
                <section className="w-1/2 h-[2px] bg-gradient-to-r from-white via-green-600 to-white dark:from-gray-800/10 dark:via-rose-600 dark:to-gray-800/10 mt-8"></section>
               
                <section className="mt-4 text-gray-950 dark:text-white h-16 justify-center items-center text-sm flex font-normal"><User strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white hidden lg:block" /> <pre className="hidden lg:block">  kenzinlawson  </pre> <pre className="dark:text-white/50 text-sm hidden lg:block">|  </pre> <Mail strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white hidden md:block" /> <pre>  kenzi.lawson@example.com  </pre>
            <pre className="dark:text-white/50 text-sm">|  </pre> <Phone strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white hidden md:block" /> <pre> (+91)9819392912  </pre>
          </section>
                <section></section>
                <section className="max-w-6xl">

                </section>
            </MaxWidthWrapper>
            <TexturedTriangles/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 91" className="w-full absolute bottom-0 block md:hidden">
  <path fill="#FFD700" d="M349 76.499L286 113V40z"></path>
  <path fill="#2E8B57" d="M480 74.5L446 94V55z"></path>
  <path fill="#87CEEB" d="M223 76.5l63 36.5V40zm182 1.999L446 102V55z"></path>
  <path fill="#4682B4" d="M169 48v82l71-41z"></path>
  <path fill="#FFA07A" d="M121 75.499L169 103V48z"></path>
  <path fill="#708090" d="M456 101h-96V46z"></path>
  <path fill="#B0C4DE" d="M360 46v55h-96z"></path>
  <path fill="#BA55D3" d="M436 93h63V57z"></path>
  <path fill="#DDA0DD" d="M499 57v36h63z"></path>
  <path fill="#8B0000" d="M491 93h84.18V44z"></path>
  <path fill="#FF4500" d="M575.18 93h84.179l-84.18-49z"></path>
  <path fill="#FF6347" d="M601 94h48V66z"></path>
  <path fill="#FF7F50" d="M649 66v28h48z"></path>
  <path fill="#F08080" d="M170.385 93h76V49z"></path>
  <path fill="#DC143C" d="M246.385 49v44h76z"></path>
  <path fill="#252511" d="M166 93H70V38z"></path>
  <path fill="#111E23" d="M70 38v55h-96z"></path>
</svg>

             </footer>
    );
}
export default Footer;