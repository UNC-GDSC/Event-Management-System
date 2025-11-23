// PostHog Analytics Integration

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event, properties)
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits)
    }
  },

  page: () => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('$pageview')
    }
  },
}

// Track common events
export const trackEvent = {
  signUp: (method: string) => analytics.track('user_signup', { method }),
  signIn: (method: string) => analytics.track('user_signin', { method }),
  subscribe: (plan: string) => analytics.track('subscription_created', { plan }),
  cancelSubscription: (plan: string) => analytics.track('subscription_cancelled', { plan }),
  referralShared: () => analytics.track('referral_link_shared'),
  featureUsed: (feature: string) => analytics.track('feature_used', { feature }),
}
