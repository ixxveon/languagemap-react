import { premiumFeatureAccess, subscriptionProducts } from '../mocks/subscriptionMockData';

function fetchSubscriptionProducts() {
  return subscriptionProducts;
}

function fetchPremiumFeatureAccess() {
  return premiumFeatureAccess;
}

export const subscriptionService = {
  fetchSubscriptionProducts,
  fetchPremiumFeatureAccess,
};
