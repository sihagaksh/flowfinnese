import MaxWidthWrapper from "../MaxWidthWrapper";
import TexturedTriangles from "../textured-triangles";
import { User,Phone,Mail } from "lucide-react";
const Footer = () => {
    return (
        <footer className="h-[calc(100vh-64px)] relative ">
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
        </footer>
    );
}
export default Footer;