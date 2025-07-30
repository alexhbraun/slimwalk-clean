
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

export const FacebookPixel = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      return;
    }
    // This is the fallback for when the script is loaded but the window.fbq is not yet available
    if (window.fbq) {
        window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams, pixelId])

  if (!pixelId || pixelId === 'YOUR_PIXEL_ID') {
    console.warn("NEXT_PUBLIC_FACEBOOK_PIXEL_ID is not set. Facebook Pixel will not be loaded.");
    return null;
  }

  return (
    <>
      <Script id="fb-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
