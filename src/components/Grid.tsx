import MaxWidthWrapper from "./MaxWidthWrapper";
const GridDesign=()=>{
    return(
        <section className="bg-gradient-to-b from-black to-gray-100 dark:text-gray-400 dark:from-[#1c1917] dark:to-[#1e1d24] h-[380vh] md:h-[220vh] backdrop:blur-3xl overflow-hidden">
          {/* <WobbleCard containerClassName="bg-black from-black to-gray-100 dark:from-[#1c1917] dark:to-[#1e1d24] dark:text-gray-400" className="h-[220vh]"> */}
  <MaxWidthWrapper className="max-w-screen-2xl">
    <div className="h-[28vh] md:h-72 flex items-center justify-start px-4 md:px-0 py-6 md:py-0">

      <h1 className="text-4xl md:text-6xl text-white">Start splitting expenses today.</h1>
    </div>
    <div className=" h-[65vh] md:h-[40vh] z-10 bg-white dark:bg-black/45 rounded-lg mb-8 p-6 md:p-12 mx-4 md:mx-0 relative [mask-image:radial-gradient(#fff,transparent,75%)]"
    style={{backgroundImage: "url('/noise.webp')",backgroundSize: "10%"}}>
      
      <h1 className="text-3xl md:text-5xl dark:text-white font-semibold">Why Choose Flow Finesse?</h1>
      <p className="text-gray-700 dark:text-gray-400 mt-4 md:mt-6 max-w-full md:max-w-3xl">
        Flow Finesse is a user-friendly platform that simplifies expense management for groups. It ensures transparency in shared expenses, minimizes transactions, and provides real-time updates for better financial tracking.
      </p>
    </div>
    <div className="h-[260vh] md:h-[140vh] space-y-8">
      <div className="flex flex-col md:flex-row lg:space-x-4">
        <div className="h-[65vh] md:h-[60vh] md:w-1/2 bg-white dark:bg-black/45 rounded-lg p-6 md:p-12 mb-4 md:mb-0 md:mr-4 mx-4 md:mx-0"
        >
          <h1 className="text-3xl md:text-5xl dark:text-white font-semibold">Minimized Transactions</h1>
          <p className="text-gray-700 dark:text-gray-400 mt-4 md:mt-6 text-sm">
            A program designed to simplify expense management within a group. It keeps track of individual expenses, calculates outstanding balances among group members.
          </p>
        </div>
        <div className="h-[65vh] md:h-[60vh] md:w-1/2 bg-white dark:bg-black/45 rounded-lg p-6 md:p-12 mx-4 md:mx-0"
        style={{backgroundImage: "url('/noise.webp')",backgroundSize: "30%"}}
        >
          <h1 className="text-3xl md:text-5xl dark:text-white font-semibold">Transparency Matters!</h1>
          <p className="text-gray-700 dark:text-gray-400 mt-4 md:mt-6">
            Splitwise ensures clarity in financial dealings among friends, families, or roommates. It breaks down shared expenses, making it easier to understand who owes whom, and eliminates confusion in group settings.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row lg:space-x-4">
        <div className="h-[65vh] md:h-[60vh] md:w-1/2 bg-white dark:bg-black/45 rounded-lg p-6 md:p-12 mb-4 md:mb-0 md:mr-4 mx-4 md:mx-0"
        style={{backgroundImage: "url('/noise.webp')",backgroundSize: "25%"}}
        >
          <h1 className="text-3xl md:text-5xl dark:text-white font-semibold">Real-Time Expense Tracking</h1>
          <p className="text-gray-700 dark:text-gray-400 mt-4 md:mt-6">
            With real-time updates, Splitwise keeps everyone informed of new expenses or changes. Users can instantly see how shared costs are distributed, promoting timely payments and better budgeting.
          </p>
        </div>
        <div className="h-[65vh] md:h-[60vh] md:w-1/2 bg-white dark:bg-black/45 rounded-lg p-6 md:p-12 mx-4 md:mx-0"      >
          <h1 className="text-3xl md:text-5xl dark:text-white font-semibold">User-Friendly and Intuitive</h1>
          <p className="text-gray-700 dark:text-gray-400 mt-4 md:mt-6">
            Designed for simplicity, Splitwise features an intuitive interface that makes managing group expenses seamless. From adding expenses to settling debts, every step is streamlined for ease of use.
          </p>
        </div>
      </div>
    </div>
  </MaxWidthWrapper>
  {/* </WobbleCard> */}
</section>
    )
};
export default GridDesign;