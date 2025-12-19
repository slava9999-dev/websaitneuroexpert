import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * Vercel Analytics wrapper component
 * Note: For analytics to work, you need to enable it in Vercel Dashboard:
 * Project Settings -> Analytics -> Enable Web Analytics
 */
export default function AnalyticsWrapper() {
  return (
    <>
      <Analytics mode="production" />
      <SpeedInsights />
    </>
  );
}


