import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { resumeService } from '../services/resumeService';
import { aiService } from '../services/aiService';
import { Save, Download, Sparkles, ChevronLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentResume,
    resumes,
    updateCurrentResume,
    setResumes,
    isAuthenticated,
    setLoginModalOpen,
    plan,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'content' | 'optimize'>('content');
  const [jobDescription, setJobDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (!currentResume && id) {
      const found = resumes.find((r) => r.id === id);
      if (found) {
        updateCurrentResume(found);
      } else {
        // Optimally we would fetch single resume by id here using resumeService.getResume(id)
        // For now, redirect to dashboard if not loaded in state
        navigate('/');
      }
    }
  }, [id, currentResume, resumes, navigate, updateCurrentResume]);

  if (!currentResume) return null;

  const handleSave = async () => {
    if (!isAuthenticated || !id) {
      setLoginModalOpen(true);
      return;
    }
    setIsSaving(true);
    try {
      const saved = await resumeService.updateResume(id, currentResume);
      setResumes(resumes.map((r) => (r.id === saved.id ? saved : r)));
      updateCurrentResume(saved); // Sync state entirely with backend
      toast.success('Resume saved successfully');
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptimize = async () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (plan === 'free') {
      toast.error('AI Optimization requires Pro plan.');
      navigate('/pricing');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first');
      return;
    }

    setIsOptimizing(true);
    const toastId = toast.loading('AI is analyzing and optimizing...');
    try {
      const { optimizedResume, atsScore, keywords } = await aiService.optimizeResume(
        jobDescription,
        currentResume
      );
      updateCurrentResume({ ...optimizedResume, atsScore });
      toast.success(`Optimized! ATS Score increased to ${atsScore}%`, { id: toastId });
    } catch (error) {
      toast.error('Optimization failed', { id: toastId });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated || !id) {
      setLoginModalOpen(true);
      return;
    }
    const toastId = toast.loading('Generating PDF...');
    try {
      const url = await resumeService.generatePdf(id, currentResume.templateId || 'default');
      toast.success('PDF ready for download!', { id: toastId });
      // In real scenario: window.location.href = url
    } catch (error) {
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  const addExperience = () => {
    updateCurrentResume({
      experience: [
        ...currentResume.experience,
        {
          id: `exp-${Date.now()}`,
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateExperience = (expId: string, field: string, value: string) => {
    updateCurrentResume({
      experience: currentResume.experience.map((exp) =>
        exp.id === expId ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (expId: string) => {
    updateCurrentResume({
      experience: currentResume.experience.filter((exp) => exp.id !== expId),
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={currentResume.title || ''}
            onChange={(e) => updateCurrentResume({ title: e.target.value })}
            className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 hover:bg-white dark:hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-colors w-full sm:w-auto outline-none"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 mr-2 sm:mr-4 text-sm font-medium">
            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">ATS Score:</span>
            <span
              className={cn(
                'px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5',
                (currentResume.atsScore || 0) >= 80
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : (currentResume.atsScore || 0) >= 50
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
              )}
            >
              <Sparkles className="w-4 h-4" />
              {currentResume.atsScore || 0}%
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-300 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden h-[50vh] lg:h-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveTab('content')}
              className={cn(
                'flex-1 py-4 text-sm font-semibold border-b-2 transition-all duration-300',
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
              )}
            >
              Content Editor
            </button>
            <button
              onClick={() => setActiveTab('optimize')}
              className={cn(
                'flex-1 py-4 text-sm font-semibold border-b-2 transition-all duration-300 flex items-center justify-center gap-2',
                activeTab === 'optimize'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50'
              )}
            >
              <Sparkles className="w-4 h-4" />
              AI Optimize
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {activeTab === 'content' ? (
              <div className="space-y-10">
                {/* Personal Info */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      1
                    </span>
                    Personal Information
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={currentResume.name || ''}
                        onChange={(e) => updateCurrentResume({ name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={currentResume.email || ''}
                          onChange={(e) => updateCurrentResume({ email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={currentResume.phone || ''}
                          onChange={(e) => updateCurrentResume({ phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Professional Summary
                      </label>
                      <textarea
                        value={currentResume.summary || ''}
                        onChange={(e) => updateCurrentResume({ summary: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none resize-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                        placeholder="Brief overview of your career..."
                      />
                    </div>
                  </div>
                </section>

                {/* Skills */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      2
                    </span>
                    Skills
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={currentResume.skills?.join(', ') || ''}
                      onChange={(e) =>
                        updateCurrentResume({
                          skills: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 dark:text-white"
                      placeholder="React, TypeScript, Node.js..."
                    />
                  </div>
                </section>

                {/* Experience */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        3
                      </span>
                      Experience
                    </h3>
                    <button
                      onClick={addExperience}
                      className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Role
                    </button>
                  </div>
                  <div className="space-y-6">
                    {currentResume.experience?.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="p-5 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm relative group hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors"
                      >
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                              Role
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(exp.id, 'startDate', e.target.value)
                              }
                              placeholder="MM/YYYY"
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              placeholder="Present or MM/YYYY"
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(exp.id, 'description', e.target.value)
                            }
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none resize-none bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                    {(!currentResume.experience || currentResume.experience.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          No experience added yet.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-6 h-full flex flex-col">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 mb-2 text-lg">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    AI ATS Optimizer
                  </h3>
                  <p className="text-sm text-indigo-700/80 dark:text-indigo-200/80 leading-relaxed">
                    Paste the job description you are applying for. Our AI will analyze it and
                    rewrite your resume to highlight matching keywords and improve your ATS score.
                  </p>
                </div>

                <div className="flex-1 flex flex-col min-h-[300px]">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="flex-1 w-full p-4 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none resize-none font-mono text-sm bg-gray-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-colors shadow-inner dark:text-gray-300"
                    placeholder="Paste the full job description here..."
                  />
                </div>

                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing || !jobDescription.trim()}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Optimizing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Optimize for this Job
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-full lg:w-1/2 bg-gray-200/50 dark:bg-slate-950/50 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-inner overflow-y-auto p-4 sm:p-8 flex justify-center h-[50vh] lg:h-auto no-scrollbar">
          {/* A4 Paper Mock */}
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-xl p-8 sm:p-12 font-serif text-gray-800 transform origin-top mx-auto">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                {currentResume.name || 'YOUR NAME'}
              </h1>
              <div className="text-sm text-gray-600 flex justify-center gap-4 flex-wrap">
                <span>{currentResume.email || 'email@example.com'}</span>
                {currentResume.phone && <span>•</span>}
                <span>{currentResume.phone || '(123) 456-7890'}</span>
              </div>
            </div>

            {/* Summary */}
            {(currentResume.summary || currentResume.name === '') && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  {currentResume.summary ||
                    'A highly motivated professional seeking to leverage skills and experience in a dynamic environment.'}
                </p>
              </div>
            )}

            {/* Skills */}
            {((currentResume.skills || []).length > 0 || currentResume.name === '') && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
                  {(currentResume.skills || []).length > 0
                    ? currentResume.skills.map((skill, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-800 rounded-full"></span> {skill}
                        </span>
                      ))
                    : 'Skill 1 • Skill 2 • Skill 3 • Skill 4'}
                </div>
              </div>
            )}

            {/* Experience */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4">
                Experience
              </h2>
              <div className="space-y-6">
                {(currentResume.experience || []).length > 0 ? (
                  currentResume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">{exp.role || 'Job Title'}</h3>
                        <span className="text-sm text-gray-600 font-medium mt-1 sm:mt-0">
                          {exp.startDate || 'Start'} - {exp.endDate || 'End'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-gray-700 mb-2">
                        {exp.company || 'Company Name'}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {exp.description ||
                          '• Describe your responsibilities and achievements here.\n• Use action verbs and metrics.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">Job Title</h3>
                      <span className="text-sm text-gray-600 font-medium mt-1 sm:mt-0">
                        MM/YYYY - Present
                      </span>
                    </div>
                    <div className="text-sm font-bold text-gray-700 mb-2">Company Name</div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      • Describe your responsibilities and achievements here.
                      <br />• Use action verbs and metrics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
