import { apiClient } from './apiClient';
import { Resume } from '../types';

export const resumeService = {
  // Expected endpoint: POST /api/resume/create
  async createResume(payload: Partial<Resume>): Promise<Resume> {
    await apiClient('/resume/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Untitled Resume',
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      atsScore: 0,
      lastModified: new Date().toISOString(),
      templateId: 'default',
      ...payload,
    } as Resume;
  },

  // Expected endpoint: GET /api/resume
  async getResumes(): Promise<Resume[]> {
    await apiClient('/resume', { method: 'GET' });
    // Mocking an empty list by default until real persistence exists
    return [];
  },

  // Expected endpoint: GET /api/resume/:id
  async getResume(id: string): Promise<Resume | null> {
    await apiClient(`/resume/${id}`, { method: 'GET' });
    return null;
  },

  // Expected endpoint: PUT /api/resume/update/:id
  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume> {
    await apiClient(`/resume/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    // Simulate returned updated object
    return { ...updates, id } as Resume;
  },

  // Expected endpoint: DELETE /api/resume/:id
  async deleteResume(id: string): Promise<void> {
    await apiClient(`/resume/${id}`, { method: 'DELETE' });
  },

  // Expected endpoint: POST /api/pdf/generate
  async generatePdf(resumeId: string, templateId: string): Promise<string> {
    await apiClient('/pdf/generate', {
      method: 'POST',
      body: JSON.stringify({ resumeId, templateId }),
    });
    // Simulates returning a signed URL or blob URL
    return `https://mock-domain.com/downloads/${resumeId}.pdf`;
  },

  // Prepare support for uploading a resume (parsing document) -> POST /api/resume/upload
  async uploadResume(file: File): Promise<Partial<Resume>> {
    const formData = new FormData();
    formData.append('resume', file);

    await apiClient('/resume/upload', {
      method: 'POST',
      // DO NOT set Content-Type header manually for FormData, fetch does it with boundary automatically
      // ...options override handled appropriately in real implementation
      body: formData,
    });

    // Simulates OCR/AI parsing results
    return {
      summary: 'Parsed summary from uploaded document...',
    };
  },
};
