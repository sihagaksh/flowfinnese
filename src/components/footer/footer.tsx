import MaxWidthWrapper from "../MaxWidthWrapper";
import TexturedTriangles from "../textured-triangles";
import { User,Phone,Mail } from "lucide-react";
const Footer = () => {
    return (
        <footer className="w-screen h-screen relative">
            <MaxWidthWrapper className="w-screen h-screen flex flex-col justify-center items-center">
                <section className="text-7xl text-green-600 dark:text-rose-600">FLOW FINESSE</section>
                <section className="max-w-3xl mt-16 text-center">
                Our platform simplifies splitting bills and tracking shared expenses with friends or groups. Easily add expenses, and we'll handle the calculations. Stay organized and keep everyone on the same page with real-time updates.</section>
                <section className="w-1/2 h-[2px] bg-gradient-to-r from-white via-green-600 to-white dark:from-gray-800/10 dark:via-rose-600 dark:to-gray-800/10 mt-8"></section>
                <section className="text-gray-950 dark:text-white h-16 justify-center items-center text-sm flex font-normal"><User strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white" /> <pre>  kenzinlawson  </pre> <pre className="dark:text-white/50 text-sm">|  </pre> <Mail strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white" /> <pre>  kenzi.lawson@example.com  </pre>
            <pre className="dark:text-white/50 text-sm">|  </pre> <Phone strokeWidth={1.75} className="text-sm text-gray-900 dark:text-white" /> <pre>  kenzi.lawson@example.com  </pre>
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