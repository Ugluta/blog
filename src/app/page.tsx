import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import BreakingNewsTicker from "@/components/home/BreakingNewsTicker";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import NewsCategoryBlocks from "@/components/home/NewsCategoryBlocks";
import BlogSection from "@/components/home/BlogSection";
import GalleryStrip from "@/components/home/GalleryStrip";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const defaultSections = {
  hero: true,
  stats: true,
  ad_top: false,
  news: true,
  blog: true,
  gallery: true,
  ad_mid: false,
  newsletter: true,
};

type SectionKey = keyof typeof defaultSections;

async function getHomepageSections(): Promise<Record<SectionKey, boolean>> {
  try {
    if (!prisma) return defaultSections;
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "homepage_sections" },
    });
    if (!setting?.value) return defaultSections;
    const parsed = JSON.parse(setting.value) as Partial<Record<SectionKey, boolean>>;
    return { ...defaultSections, ...parsed };
  } catch {
    return defaultSections;
  }
}

export default async function HomePage() {
  const sections = await getHomepageSections();

  return (
    <>
      <MegaHeader />
      <BreakingNewsTicker />

      <main style={{ backgroundColor: "#0a0f1e" }}>
        {sections.hero && <HeroSection />}
        {sections.stats && <StatsSection />}
        {sections.news && <NewsCategoryBlocks />}
        {sections.blog && <BlogSection />}
        {sections.gallery && <GalleryStrip />}
        {sections.newsletter && <NewsletterStrip />}
      </main>

      <Footer />
    </>
  );
}
