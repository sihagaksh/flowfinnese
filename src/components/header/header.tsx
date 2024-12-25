"use client";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowRight,Sun,Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
const Navbar =  () => {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/65 backdrop-blur-lg transition-all dark:bg-inherit dark:border-zinc-600 dark:bg-opacity-65 dark:backdrop-blur-lg">
      <MaxWidthWrapper className="">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-600">
          <Link href="/" className="flex z-40 font-semibold text-2xl">
            flow<span className="text-green-600 dark:text-rose-600">finesse</span>
          </Link>
          <div className="h-full flex items-center space-x-4">
            <>
                <Link
                  href="/"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>
                <Link 
                    href="/"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>
                <div className="h-8 w-px bg-zinc-200 hidden sm:block " />
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Split Expense
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
              </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;