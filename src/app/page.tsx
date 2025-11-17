import { SparklesPreview } from "@/components/SparklePreview"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

const page = () => {
  return (
    <div>
        <div className="container mx-auto p-8 ">
    
    {/* //hover button  */}
     <div className="flex justify-center ">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Join Our Community 🚀</span>
      </HoverBorderGradient>
    </div>
     <SparklesPreview/>
    </div>
    <section className="min-h-screen">

    </section>
    </div>
  )
}

export default page