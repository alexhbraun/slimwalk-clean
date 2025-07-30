
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type FunnelStep = string;

let sessionId: string | null = null;

function getSessionId(): string {
  if (typeof window !== 'undefined') {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', crypto.randomUUID());
    }
    sessionId = sessionStorage.getItem('sessionId');
  }
  // Fallback for SSR or environments without crypto
  return sessionId || 'unknown-session';
}

async function sendServerEvent(eventName: FunnelStep) {
    if (!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || !process.env.FACEBOOK_ACCESS_TOKEN) {
        console.warn("Facebook Pixel ID or Access Token not configured. Skipping server event.");
        return;
    }

    const eventData = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {}, // We can add more user data here if available and compliant
        action_source: 'website',
        event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    try {
        await fetch(`https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}/events?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [eventData]
            })
        });
    } catch (error) {
        console.error('Failed to send event to Facebook Conversions API:', error);
    }
}


export async function trackEvent(step: FunnelStep): Promise<void> {
  // Client-side tracking (Firebase and FB Pixel)
  if (typeof window !== 'undefined') {
    // Firebase event
    try {
      const eventsCollection = collection(db, 'funnel_events');
      await addDoc(eventsCollection, {
        sessionId: getSessionId(),
        step: step,
        timestamp: serverTimestamp(),
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error(`Failed to track Firebase event [${step}]:`, error);
    }

    // Facebook Pixel event
    if (window.fbq) {
      window.fbq('track', step);
    }
  }

  // Server-side tracking (FB Conversions API)
  await sendServerEvent(step);
}
