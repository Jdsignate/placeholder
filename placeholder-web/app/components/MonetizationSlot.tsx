interface MonetizationSlotProps {
  followerCount: number;
  category: string;
  adSenseClientId?: string | null;
  showAds: boolean;
}

export default function MonetizationSlot({
  followerCount,
  category,
  adSenseClientId,
  showAds,
}: MonetizationSlotProps) {
  // Tier 3 - Pro (>= 1000 followers): Ignore showAds
  if (followerCount >= 1000) {
    if (category === "Tech" || category?.toLowerCase() === "tech") {
      return (
        <div
          className="ethical-ads my-8 p-4 border border-neutral-200 dark:border-neutral-800 rounded text-center text-sm text-neutral-500"
          data-ea-publisher="placeholder-platform"
          data-ea-type="text"
        ></div>
      );
    }

    return (
      <div
        id="media-net-ad"
        className="medianet-ads my-8 p-4 border border-neutral-200 dark:border-neutral-800 rounded text-center text-sm text-neutral-500"
        data-mnet-unit="placeholder-platform"
      ></div>
    );
  }

  // Tier 2 - Rising Star (500 <= followerCount < 1000)
  if (followerCount >= 500 && followerCount < 1000) {
    if (!showAds) {
      // Clean reading experience
      return null;
    }
    // If showAds is true, fall through to Tier 1 logic
  }

  // Tier 1 - Starter (< 500 followers) or falling through from Tier 2
  return (
    <div className="my-8 text-center">
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adSenseClientId || "ca-pub-placeholder"}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
