import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1";
import HappyCustomers from "@/components/Customers";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Video from "@/components/Video";
import About from "@/components/About";

export default function Home() {
  return (
    <div className="font-ibm-plex-mono">
      <Navbar1 />
      <Landing />
      <Video />
      <About />
      <div className="relative w-full mt-12 lg:mt-24"> {/* Removed h-screen and adjusted mt */}
    <HappyCustomers />
  </div>

  <div className="w-full px-4 mt-12"> {/* Removed -mt-40 */}
    <Faqs />
  </div>
      <Footer />
    </div>
  );
}