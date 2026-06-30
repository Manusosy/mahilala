import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { useAdminPrograms } from '@workspace/esaora-core/hooks/usePrograms';
import { supabase } from '@workspace/esaora-core/lib/supabase';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { Save, Send, Loader2, AlertCircle, Check, ImagePlus, X, Video, Target, TrendingUp, HelpCircle, Layers, Plus, MapPin } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const PILLARS = ['WASH', 'Climate Resilience', 'Blue Economy', 'Public Health', 'Governance'];
const STATUSES = ['active', 'completed', 'planned', 'paused'];
const COUNTRIES = ['Kenya', 'Tanzania', 'Mozambique', 'Madagascar'];
const FUNDING_STATUSES = ['unfunded', 'partially funded', 'fully funded'];

export default function ProgramEditor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const isEdit = !!id;

  const { create, update } = useAdminPrograms();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [pillar, setPillar] = useState(PILLARS[0]);
  const [countries, setCountries] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [keyOutput, setKeyOutput] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState('active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // New Fields
  const [impact, setImpact] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [fundingStatus, setFundingStatus] = useState('unfunded');
  const [fundingGoal, setFundingGoal] = useState<number>(0);
  const [fundingRaised, setFundingRaised] = useState<number>(0);
  const [gallery, setGallery] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState<'draft' | 'publish'>('publish');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [mediaModalMode, setMediaModalMode] = useState<'cover' | 'gallery'>('cover');
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // Main Body Editor
  const bodyEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Describe this programme in detail…' })],
    editorProps: { attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-5 py-4' } },
  });

  // Objectives Editor
  const objectivesEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'What are the core objectives?' })],
    editorProps: { attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-5 py-4' } },
  });

  // Challenges Editor
  const challengesEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'What challenges are being addressed?' })],
    editorProps: { attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-5 py-4' } },
  });

  // Impact Editor (Narrative)
  const impactEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'What is the intended impact?' })],
    editorProps: { attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-5 py-4' } },
  });

  useEffect(() => {
    if (!isEdit || !id || !bodyEditor || !objectivesEditor || !challengesEditor || !impactEditor) return;
    setLoading(true);
    supabase.from('programs').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setName(data.name); setSlug(data.slug); setSlugEdited(true);
        setPillar(data.pillar); setCountries(data.countries || []);
        setSummary(data.summary || ''); setKeyOutput(data.key_output || '');
        setCoverImageUrl(data.cover_image_url || ''); setStatus(data.status);
        setStartDate(data.start_date || ''); setEndDate(data.end_date || '');
        setIsPublished(data.is_published); setSortOrder(data.sort_order);
        
        // New fields
        setFocusAreas(data.focus_areas || []);
        setFundingStatus(data.funding_status || 'unfunded');
        setFundingGoal(data.funding_goal || 0);
        setFundingRaised(data.funding_raised || 0);
        setGallery(data.gallery || []);
        setVideoUrl(data.video_url || '');

        bodyEditor.commands.setContent(data.body || '');
        objectivesEditor.commands.setContent(data.objectives || '');
        challengesEditor.commands.setContent(data.challenges || '');
        impactEditor.commands.setContent(data.impact || '');
      }
      setLoading(false);
    });
  }, [id, isEdit, bodyEditor, objectivesEditor, challengesEditor, impactEditor]);

  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [name, slugEdited]);

  const validateForPublish = () => {
    const missing = [];
    if (!name.trim()) missing.push('Name');
    if (countries.length === 0) missing.push('At least one Country');
    if (!summary.trim()) missing.push('Summary');
    if (!bodyEditor?.getText().trim()) missing.push('Description Body');
    if (!objectivesEditor?.getText().trim()) missing.push('Objectives');
    if (!impactEditor?.getText().trim()) missing.push('Impact Narrative');
    if (!coverImageUrl) missing.push('Cover Image');
    return missing;
  };

  const handleSave = async (mode: 'draft' | 'publish') => {
    if (mode === 'publish') {
      const missing = validateForPublish();
      if (missing.length > 0) {
        setError(`Cannot publish. Please complete the following: ${missing.join(', ')}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (!name.trim()) {
      setError('Name is required to save.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setError(null); setSaveMode(mode); setSaving(true);
    const payload = {
      name: name.trim(), slug: slug.trim(), pillar,
      countries, summary: summary || null, body: bodyEditor?.getHTML() || '',
      key_output: keyOutput || null, cover_image_url: coverImageUrl || null,
      status, start_date: startDate || null, end_date: endDate || null,
      is_published: mode === 'publish', sort_order: sortOrder,
      // New fields
      objectives: objectivesEditor?.getHTML() || null,
      challenges: challengesEditor?.getHTML() || null,
      impact: impactEditor?.getHTML() || null,
      focus_areas: focusAreas,
      funding_status: fundingStatus,
      funding_goal: fundingGoal,
      funding_raised: fundingRaised,
      gallery: gallery,
      video_url: videoUrl || null,
    };

    try {
      if (isEdit && id) { await update(id, payload); }
      else { await create(payload as any); }
      setSuccess(true);
      setTimeout(() => setLocation('/admin/programs'), 1200);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const toggleCountry = (c: string) => {
    setCountries((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !focusAreas.includes(newFocusArea.trim())) {
      setFocusAreas([...focusAreas, newFocusArea.trim()]);
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (area: string) => {
    setFocusAreas(focusAreas.filter(a => a !== area));
  };

  const removeFromGallery = (url: string) => {
    setGallery(prev => prev.filter(item => item !== url));
  };

  if (loading) return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Programmes', href: '/admin/programs' }, { label: 'Loading…' }]}>
      <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Programmes', href: '/admin/programs' }, { label: isEdit ? 'Edit' : 'New' }]}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900 font-bold text-xl">{isEdit ? 'Edit Programme' : 'New Programme'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
            {saving && saveMode === 'draft' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft
          </button>
          <button onClick={() => handleSave('publish')} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
            {saving && saveMode === 'publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {isPublished ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-[6px] p-4 mb-4 text-red-700 text-sm font-medium shadow-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
      {success && <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-[6px] p-4 mb-4 text-emerald-700 text-sm font-medium shadow-sm"><Check className="w-4 h-4 flex-shrink-0" />Saved! Redirecting…</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-6">
          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Name + Slug */}
            <div className="bg-white rounded-[6px] border border-gray-200 p-5">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Programme Name" className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 outline-none" />
              {name.trim().length > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-800 font-semibold flex-shrink-0">URL Slug:</span>
                    <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }} className="text-xs text-gray-900 bg-white border border-gray-300 rounded-[4px] px-2 py-1 outline-none focus:border-gray-500 flex-1 min-w-0" />
                    <span className="text-[10px] text-gray-500 font-medium">/programs/{slug}</span>
                  </div>
              )}
            </div>

            {/* Narrative Sections */}
            <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Programme Overview</p>
                <Layers className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <EditorContent editor={bodyEditor} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Objectives</p>
                  <Target className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <EditorContent editor={objectivesEditor} />
              </div>
              <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Challenges</p>
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <EditorContent editor={challengesEditor} />
              </div>
            </div>

            <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Intended Impact</p>
                <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <EditorContent editor={impactEditor} />
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-[6px] border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Programme Gallery <span className="text-gray-400 font-normal">({gallery.length}/6)</span></p>
                <button type="button" onClick={() => { setMediaModalMode('gallery'); setMediaModalOpen(true); }} disabled={gallery.length >= 6} className="text-[10px] font-bold text-brand-cyan uppercase tracking-tighter hover:underline disabled:opacity-30 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Image
                </button>
              </div>
              {gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded overflow-hidden border border-gray-200 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeFromGallery(url)} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-[6px] py-10 flex flex-col items-center justify-center">
                  <ImagePlus className="w-6 h-6 text-gray-200 mb-2" />
                  <p className="text-[11px] text-gray-400 font-medium">No gallery images yet</p>
                </div>
              )}
            </div>

            {/* Video Link */}
            <div className="bg-white rounded-[6px] border border-gray-200 p-5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                <Video className="w-3.5 h-3.5" /> Video Presentation <span className="text-gray-400 font-normal lowercase">(YouTube URL)</span>
              </label>
              <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata Card */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Thematic Pillar</p>
              <select value={pillar} onChange={(e) => setPillar(e.target.value)} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500">
                {PILLARS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Operating Countries</p>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map((c) => (
                  <button key={c} type="button" onClick={() => toggleCountry(c)}
                    className={`px-3 py-1.5 rounded-[4px] text-[10px] font-bold uppercase tracking-tight border transition-all flex items-center gap-1 ${countries.includes(c) ? 'bg-[#001BB7] text-white border-[#001BB7]' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-500'}`}>
                    {countries.includes(c) ? <Check className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}{c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50">
              <label className="text-xs font-bold text-gray-800 mb-2 block uppercase tracking-wider">Brief Summary</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Snapshot for cards..." className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 outline-none focus:border-gray-500 resize-none" />
            </div>
          </div>

          {/* Funding Tracker */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5 space-y-4">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Funding Tracker</p>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Status</label>
              <select value={fundingStatus} onChange={(e) => setFundingStatus(e.target.value)} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-500">
                {FUNDING_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Goal ($)</label>
                <input type="number" value={fundingGoal} onChange={(e) => setFundingGoal(Number(e.target.value))} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Raised ($)</label>
                <input type="number" value={fundingRaised} onChange={(e) => setFundingRaised(Number(e.target.value))} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-500" />
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Focus Areas</p>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newFocusArea} onChange={(e) => setNewFocusArea(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())} placeholder="Add focus area..." className="flex-1 bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-500" />
              <button type="button" onClick={addFocusArea} className="px-2 py-2 bg-gray-100 rounded text-gray-600 hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {focusAreas.map((area, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">
                  {area} <button onClick={() => removeFocusArea(area)} className="text-blue-400 hover:text-blue-600"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Status + Dates */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5 space-y-3">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Timeline</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-gray-300 rounded-[4px] px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-500 mb-2">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Start</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded-[4px] px-2 py-1.5 text-[10px] text-gray-900 outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">End</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded-[4px] px-2 py-1.5 text-[10px] text-gray-900 outline-none focus:border-gray-500" />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-[6px] border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Hero / Cover Image</p>
            {coverImageUrl ? (
              <div className="relative rounded-[6px] overflow-hidden mb-2 shadow-sm">
                <img src={coverImageUrl} alt="" className="w-full h-36 object-cover border border-gray-200" />
                <button onClick={() => setCoverImageUrl('')} className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded hover:bg-black shadow-sm"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <div onClick={() => { setMediaModalMode('cover'); setMediaModalOpen(true); }} className="border border-gray-300 rounded-[6px] h-28 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-all bg-white group">
                <ImagePlus className="w-5 h-5 text-gray-400 group-hover:text-gray-600 mb-2" /><p className="text-xs font-bold text-gray-800">Select cover image</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {mediaModalOpen && (
        <MediaSelectModal
          onClose={() => setMediaModalOpen(false)}
          onSelect={(url) => { 
            if (mediaModalMode === 'cover') setCoverImageUrl(url);
            else if (gallery.length < 6) setGallery([...gallery, url]);
            setMediaModalOpen(false); 
          }}
          allowedBuckets={['images']}
        />
      )}
      <style>{`
        .ProMirror { min-height: 150px; } 
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #adb5bd; pointer-events: none; height: 0; }
        .prose { font-size: 0.875rem; line-height: 1.5; color: #374151; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </AdminLayout>
  );
}
