// composables/useProjectRequest.ts
import {
  fetchShowcase,
  fetchProfessional,
  fetchCaseStudy,
} from '../api/index.api';

let abortController: AbortController | null = null;

export function useProjectRequest() {
  const cancelPending = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };

  const fetchShowcaseData = async (slug: string) => {
    cancelPending();
    abortController = new AbortController();
    // 注意：如果 fetchShowcase 不支持 signal，就只传 slug
    const res = await fetchShowcase(slug);
    return res.data.data;
  };

  const fetchProfessionalData = async (slug: string) => {
    cancelPending();
    abortController = new AbortController();
    const res = await fetchProfessional(slug);
    return res.data.data;
  };

  const fetchCaseStudyData = async (slug: string) => {
    cancelPending();
    abortController = new AbortController();
    const res = await fetchCaseStudy(slug);
    return res.data.data;
  };

  return { cancelPending, fetchShowcaseData, fetchProfessionalData, fetchCaseStudyData };
}