import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import BreakingNewsTicker from "@/components/home/BreakingNewsTicker";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AdBanner from "@/components/home/AdBanner";
import NewsCategoryBlocks from "@/components/home/NewsCategoryBlocks";
import BlogSection from "@/components/home/BlogSection";
import ProductsServices from "@/components/home/ProductsServices";
import CodeExamples from "@/components/home/CodeExamples";
import Sidebar from "@/components/layout/Sidebar";

export default function HomePage() {
  return (
    <>
      <MegaHeader />
      <BreakingNewsTicker />

      <main className="pb-10">
        <div className="container mx-auto px-4">
          {/* Leaderboard Ad */}
          <AdBanner size="leaderboard" />

          {/* Main Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-2">
            {/* Left Column */}
            <div className="min-w-0">
              <HeroSection />
              <StatsSection />
              <AdBanner size="rectangle" />
              <NewsCategoryBlocks />
              <BlogSection />
              <ProductsServices />
              <CodeExamples />
            </div>

            {/* Right Sidebar */}
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
