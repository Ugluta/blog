import MegaHeader from "@/components/layout/MegaHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import EditorPickSection from "@/components/home/EditorPickSection";
import NewsCategoryBlocks from "@/components/home/NewsCategoryBlocks";
import ArticlesGridSection from "@/components/home/ArticlesGridSection";
import BlogSection from "@/components/home/BlogSection";
import ServicesSection from "@/components/home/ServicesSection";
import GalleryStrip from "@/components/home/GalleryStrip";
import FaqSection from "@/components/home/FaqSection";
import PricingSection from "@/components/home/PricingSection";
import TrendingSection from "@/components/home/TrendingSection";
import ContactCtaSection from "@/components/home/ContactCtaSection";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import AdBannerSection from "@/components/home/AdBannerSection";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const defaultSections = {
  hero: true,
  stats: true,
  ad_top: false,
  editor_pick: true,
  news: true,
  articles_grid: true,
  blog: true,
  gallery: true,
  ad_mid: false,
  services: true,
  faq: true,
  pricing: false,
  trending: true,
  contact_cta: false,
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

      <main style={{ backgroundColor: "#0a0f1e" }}>
        {sections.hero && <HeroSection />}
        {sections.stats && <StatsSection />}
        {sections.ad_top && <AdBannerSection position="top" />}
        {sections.editor_pick && <EditorPickSection />}
        {sections.news && <NewsCategoryBlocks />}
        {sections.articles_grid && <ArticlesGridSection />}
        {sections.blog && <BlogSection />}
        {sections.gallery && <GalleryStrip />}
        {sections.ad_mid && <AdBannerSection position="mid" />}
        {sections.services && <ServicesSection />}
        {sections.faq && <FaqSection />}
        {sections.pricing && <PricingSection />}
        {sections.trending && <TrendingSection />}
        {sections.contact_cta && <ContactCtaSection />}
        {sections.newsletter && <NewsletterStrip />}
      </main>

      <Footer />
    </>
  );
}
