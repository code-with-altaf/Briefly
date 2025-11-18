import { Separator } from "./ui/separator"

const HomeFooter = () => {
  return (
    <div>
      <footer className="relative overflow-hidden mt-20 border-t dark:border-neutral-800 bg-black dark:bg-black">

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-10">

          {/* TOP SECTION */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            {/* Logo + Info */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-white">PDF-Genie</h2>
              <p className="text-sm text-neutral-400 mt-1">
                AI Powered PDF Summaries & Reel Formatter
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-neutral-300">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#" className="hover:text-white transition">Pricing</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>

          </div>

          <Separator className="bg-neutral-700" />

          {/* BOTTOM SECTION */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-neutral-400 gap-4">

            <p className="text-center md:text-left">
              © {new Date().getFullYear()} PDF-Genie. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
            </div>

          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeFooter
