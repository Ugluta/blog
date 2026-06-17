import CurrencyWidget from "@/components/widgets/CurrencyWidget";
import StockWidget from "@/components/widgets/StockWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import EventCalendarWidget from "@/components/widgets/EventCalendarWidget";
import RecentPostsWidget from "@/components/widgets/RecentPostsWidget";
import MostCommentedWidget from "@/components/widgets/MostCommentedWidget";
import OnThisDayWidget from "@/components/widgets/OnThisDayWidget";
import AdBanner from "@/components/home/AdBanner";

export default function Sidebar() {
  return (
    <aside className="w-full max-w-xs lg:max-w-none space-y-5 lg:sticky lg:top-[138px] lg:self-start">
      {/* Weather */}
      <WeatherWidget />

      {/* Ad Rectangle */}
      <AdBanner size="rectangle" label="300 × 250 Reklam Alanı" />

      {/* Currency */}
      <CurrencyWidget />

      {/* Stock */}
      <StockWidget />

      {/* Calendar */}
      <CalendarWidget />

      {/* Events */}
      <EventCalendarWidget />

      {/* Recent Posts */}
      <RecentPostsWidget />

      {/* Most Commented */}
      <MostCommentedWidget />

      {/* On This Day */}
      <OnThisDayWidget />
    </aside>
  );
}
