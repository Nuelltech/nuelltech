'use client';

import { useEffect, useRef } from 'react';

// List of section IDs to monitor
const TRACKED_SECTIONS = ['hero', 'problem', 'demos-container', 'pathway', 'widget'];

export default function StoreTracker() {
  const activeSectionRef = useRef<string | null>(null);
  const sectionStartTimeRef = useRef<number>(0);

  const sendEvent = (payload: Record<string, unknown>) => {
    // Retrieve session ID from local storage, or generate if missing
    let sessionId = localStorage.getItem('nuell_session_id');
    if (!sessionId) {
      sessionId = 'ns_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('nuell_session_id', sessionId);
    }

    const body = {
      sessionId,
      ...payload,
    };

    // Use keepalive: true to ensure the request completes even if the page unloads
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch((err) => console.warn('Analytics send failed:', err));
  };

  useEffect(() => {
    // Set initial start time here to maintain react hook purity
    sectionStartTimeRef.current = Date.now();

    // 1. Initialize Session & campaign query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';

    // Let the backend handle geolocating based on IP header or standard request data
    sendEvent({
      type: 'session_init',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      utmSource,
      utmMedium,
      utmCampaign,
    });

    // 2. Section Dwell Time Tracking (Intersection Observer)
    const reportDwellTime = () => {
      if (activeSectionRef.current) {
        const duration = Math.round((Date.now() - sectionStartTimeRef.current) / 1000);
        if (duration >= 2) {
          // Send dwell time only if user spent at least 2 seconds
          sendEvent({
            type: 'dwell',
            sectionId: activeSectionRef.current,
            duration,
          });
        }
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Shrink vertical viewport triggers for accuracy
      threshold: 0.25, // Section must be at least 25% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (activeSectionRef.current !== sectionId) {
            // Report dwell time of the previous section
            reportDwellTime();

            // Set new active section
            activeSectionRef.current = sectionId;
            sectionStartTimeRef.current = Date.now();
          }
        }
      });
    }, observerOptions);

    // Observe each target section element
    TRACKED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 3. Document Clicks Listener (Element click attributes)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickId = target.closest('[data-analytics-id]')?.getAttribute('data-analytics-id');
      if (clickId) {
        sendEvent({
          type: 'click',
          elementId: clickId,
        });
      }
    };
    document.addEventListener('click', handleClick);

    // 4. Calendly Conversion Event Listener (Calendly widget integration)
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.data && e.data.event) {
        if (e.data.event === 'calendly.event_scheduled') {
          const inviteeName = e.data.payload?.invitee?.name || 'Unknown';
          const inviteeEmail = e.data.payload?.invitee?.email || 'Unknown';
          const eventTime = e.data.payload?.event?.start_time || 'Unknown';

          sendEvent({
            type: 'booking',
            name: inviteeName,
            email: inviteeEmail,
            eventTime,
          });
        }
      }
    };
    window.addEventListener('message', handleCalendlyMessage);

    // 5. Page Unload handler (Record final active section view)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportDwellTime();
      } else {
        sectionStartTimeRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      reportDwellTime();
      observer.disconnect();
      document.removeEventListener('click', handleClick);
      window.removeEventListener('message', handleCalendlyMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
