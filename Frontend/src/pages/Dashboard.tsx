import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { resumeService } from '../services/resumeService';
import {
  FileText,
  Plus,
  MoreVertical,
  Download,
  Edit3,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function Dashboard() {
  const { user, plan, resumes, setResumes, setCurrentResume, setLoginModalOpen, isAuthenticated } =
    useStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    } else {
      setResumes([]);
    }
  }, [isAuthenticated]);

  const loadResumes = async () => {
    try {
      const data = await resumeService.getResumes();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to load resumes');
    }
  };

  const handleCreateResume = async () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    if (plan === 'free' && resumes.length >= 1) {
      toast.error('Free plan limited to 1 resume. Please upgrade to Pro.');
      navigate('/pricing');
      return;
    }

    const toastId = toast.loading('Creating new resume...');
    try {
      const newResume = await resumeService.createResume({ title: 'Untitled Resume' });
      setResumes([...resumes, newResume]);
      setCurrentResume(newResume);
      toast.success('Resume created!', { id: toastId });
      navigate(`/editor/${newResume.id}`);
    } catch (error) {
      toast.error('Failed to create resume', { id: toastId });
    }
  };

  const handleEdit = (resume: any) => {
    setCurrentResume(resume);
    navigate(`/editor/${resume.id}`);
  };

  const handleDownload = async (e: React.MouseEvent, resumeId: string, templateId: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    const toastId = toast.loading('Generating PDF...');
    try {
      const url = await resumeService.generatePdf(resumeId, templateId);
      toast.success('PDF generated successfully!', { id: toastId });
      // Logic to actually trigger file download using URL would go here
    } catch (error) {
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    const toastId = toast.loading('Uploading and parsing resume...');
    try {
      const parsedData = await resumeService.uploadResume(file);
      const newResume = await resumeService.createResume(parsedData);
      setResumes([...resumes, newResume]);
      setCurrentResume(newResume);
      toast.success('Resume uploaded successfully!', { id: toastId });
      navigate(`/editor/${newResume.id}`);
    } catch (error) {
      toast.error('Failed to upload resume', { id: toastId });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hidden File Input for Resume Upload Support */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 p-4 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resumes</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {resumes.length}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. ATS Score</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {resumes.length > 0
                ? Math.round(
                    resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group sm:col-span-2 lg:col-span-1">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 p-4 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Plan</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
              {plan}
            </p>
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Your Resumes
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={handleCreateResume}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-12 text-center flex flex-col items-center justify-center hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors duration-300">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-full mb-5 shadow-inner">
              <FileText className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
              Create your first resume to start optimizing it for Applicant Tracking Systems and
              land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Upload className="w-5 h-5" />
                Upload Resume
              </button>
              <button
                onClick={handleCreateResume}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create First Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => handleEdit(resume)}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
              >
                <div className="aspect-[1/1.4] bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700/50 p-4 relative overflow-hidden flex items-center justify-center">
                  {/* Mini Preview Mock */}
                  <div className="w-full h-full bg-white dark:bg-slate-800 shadow-sm rounded border border-gray-200 dark:border-slate-700 p-4 text-[4px] leading-tight text-gray-300 dark:text-gray-600 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="font-bold text-[8px] text-gray-800 dark:text-gray-200 mb-1.5">
                      {resume.name || 'Your Name'}
                    </div>
                    <div className="mb-3 text-[5px]">{resume.email || 'email@example.com'}</div>
                    <div className="bg-gray-200 dark:bg-slate-700 h-px w-full mb-3"></div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded w-4/5"></div>
                    </div>
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(resume);
                      }}
                      className="p-3 bg-white text-gray-900 rounded-full shadow-lg hover:scale-110 hover:text-indigo-600 transition-all duration-300"
                      title="Edit"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, resume.id, resume.templateId)}
                      className="p-3 bg-white text-gray-900 rounded-full shadow-lg hover:scale-110 hover:text-indigo-600 transition-all duration-300"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      Updated {new Date(resume.lastModified || new Date()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold',
                        (resume.atsScore || 0) >= 80
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : (resume.atsScore || 0) >= 50
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-50 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                      )}
                    >
                      <Target className="w-4 h-4" />
                      <span>{resume.atsScore || 0}% ATS</span>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); /* Future module handle menu */
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
