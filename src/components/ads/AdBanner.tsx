'use client';
import { useEffect, useRef, useState } from 'react';

type Ad = {
  id: string;
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  htmlCode: string | null;
  adCode: string | null;
  width: number | null;
  height: number | null;
};

export function AdBanner({ position, className }: { position: string; className?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch(`/api/reklamlar?position=${position}`)
      .then(r => r.json())
      .then((data: Ad[]) => setAds(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [position]);

  if (!ads.length) return null;

  return (
    <div className={className}>
      {ads.map(ad => (
        <AdItem key={ad.id} ad={ad} />
      ))}
    </div>
  );
}

function AdItem({ ad }: { ad: Ad }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ad.adCode || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = '';
    const range = document.createRange();
    const fragment = range.createContextualFragment(ad.adCode);
    el.appendChild(fragment);

    if (ad.adCode.includes('adsbygoogle')) {
      try {
        type WindowWithAds = Window & { adsbygoogle: unknown[] };
        ((window as unknown as WindowWithAds).adsbygoogle =
          (window as unknown as WindowWithAds).adsbygoogle || []).push({});
      } catch {}
    }
  }, [ad.adCode]);

  if (ad.adCode) {
    return <div ref={containerRef} style={{ overflow: 'hidden' }} />;
  }

  if (ad.imageUrl) {
    const img = (
      <img
        src={ad.imageUrl}
        alt={ad.title}
        width={ad.width ?? undefined}
        height={ad.height ?? undefined}
        className="max-w-full h-auto block"
      />
    );
    return ad.linkUrl ? (
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    ) : (
      img
    );
  }

  if (ad.htmlCode) {
    return <div dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />;
  }

  return null;
}
