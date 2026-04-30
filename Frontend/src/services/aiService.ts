import { apiClient } from './apiClient';
import { Resume } from '../types';

interface OptimizeResponse {
  optimizedResume: Partial<Resume>;
  atsScore: number;
  keywords: string[];
}

export const aiService = {
  // Expected endpoint: POST /api/ai/optimize
  async optimizeResume(jobDescription: string, resumeData: Resume): Promise<OptimizeResponse> {
    await apiClient('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, resumeData }),
    });

    // Hardcoded mock response structured as future backend response
    return {
      optimizedResume: {
        ...resumeData,
        summary:
          `Strategic ${resumeData.name ? 'Professional' : 'candidate'} ready to excel. ` +
          `Highly experienced in driving cross-functional initiatives aligned with business goals. ` +
          `(Optimized by AI for ATS indexing).`,
      },
      atsScore: Math.floor(Math.random() * 20) + 75, // 75-94
      keywords: ['Leadership', 'Agile', 'Communication'],
    };
  },
};
