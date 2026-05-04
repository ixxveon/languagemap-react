import { premiumFeatureAccess, subscriptionProducts } from '../../mocks/user/subscriptionMockData';

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
