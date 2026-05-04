import { supportFaqItems, supportInquiryTemplates, supportNoticeItems } from '../mocks/supportMockData';

function fetchSupportNotices() {
  return supportNoticeItems;
}

function fetchSupportNoticeById(id) {
  return supportNoticeItems.find((item) => String(item.id) === String(id)) ?? null;
}

function fetchAdjacentNotices(id) {
  const index = supportNoticeItems.findIndex((item) => String(item.id) === String(id));
  return {
    prev: index < supportNoticeItems.length - 1 ? supportNoticeItems[index + 1] : null,
    next: index > 0 ? supportNoticeItems[index - 1] : null,
  };
}

function fetchSupportFaqs() {
  return supportFaqItems;
}

function fetchSupportInquiryTemplates() {
  return supportInquiryTemplates;
}

export const supportService = {
  fetchSupportNotices,
  fetchSupportNoticeById,
  fetchAdjacentNotices,
  fetchSupportFaqs,
  fetchSupportInquiryTemplates,
};