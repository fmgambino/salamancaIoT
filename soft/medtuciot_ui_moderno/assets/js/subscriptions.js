export function getSubscription() {
  return { status: 'active', plan: 'Business', period: 'yearly', devicesUsed: 12, devicesLimit: null, expiresAt: '2027-04-13' };
}
export function isSubscriptionBlocked() { return false; }
