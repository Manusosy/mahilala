import { useState, useRef } from 'react';
import { useStorage, getPublicUrl } from '@workspace/esaora-core/hooks/useStorage';
import { Loader2, ImagePlus, File, Folder, X, Search, Upload, CheckCircle2 } from 'lucide-react';

interface MediaSelectModalProps {
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  onClose: () => void;
  multiSelect?: boolean;
  allowedBuckets?: string[];
  title?: string;
  /** Pass true while the parent is processing the selection to lock the confirm button */
  saving?: boolean;
}

const ALL_BUCKETS = [
  { id: 'images', name: 'Images', icon: <ImagePlus className="w-4 h-4" /> },
  { id: 'documents', name: 'Documents', icon: <File className="w-4 h-4" /> },
  { id: 'partner-logos', name: 'Partner Logos', icon: <Folder className="w-4 h-4" /> },
  { id: 'team-photos', name: 'Team Photos', icon: <Folder className="w-4 h-4" /> }
];

export function MediaSelectModal({ 
  onSelect, 
  onSelectMultiple, 
  onClose, 
  multiSelect = false,
  allowedBuckets = ['images', 'partner-logos', 'team-photos'], 
  title = "Select Media",
  saving = false,
}: MediaSelectModalProps) {
  const buckets = ALL_BUCKETS.filter(b => allowedBuckets.includes(b.id));
  const [activeBucket, setActiveBucket] = useState(buckets[0]?.id || 'images');
  const [search, setSearch] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  
  const { files, loading, error, uploading, uploadFile } = useStorage(activeBucket);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
    
    try {
      const url = await uploadFile(file);
      if (multiSelect) {
        setSelectedUrls(prev => [...prev, url]);
      } else if (onSelect) {
        onSelect(url);
      }
    } catch (err: any) {
       console.error("Upload failed", err);
    }
  };

  const toggleSelection = (url: string) => {
    if (!multiSelect) {
      if (onSelect) onSelect(url);
      return;
    }
    
    setSelectedUrls(prev => 
      prev.includes(url) 
        ? prev.filter(u => u !== url) 
        : [...prev, url]
    );
  };

  const handleConfirmSelection = () => {
    if (multiSelect && onSelectMultiple) {
      onSelectMultiple(selectedUrls);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              {multiSelect && selectedUrls.length > 0 && (
                  <span className="bg-[#204f79] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {selectedUrls.length} SELECTED
                  </span>
              )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-4 flex-shrink-0 bg-white">
            <div className="flex space-x-1">
                {buckets.map(bucket => (
                    <button
                        key={bucket.id}
                        onClick={() => setActiveBucket(bucket.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                            activeBucket === bucket.id 
                            ? 'bg-[#204f79] text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        {bucket.icon}
                        {bucket.name}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search files..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                    />
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploading}
                    className="flex items-center gap-2 bg-[#204f79] hover:bg-[#F78A28] text-white px-3 py-1.5 rounded-lg text-sm font-black transition-colors disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload New
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} multiple={multiSelect} />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 min-h-[300px]">
            {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    Failed to load files: {error}
                </div>
            )}
            
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-sm font-medium">Loading media...</span>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImagePlus className="w-12 h-12 mb-2 text-gray-300" />
                    <p className="font-medium">No files found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => {
                        const url = getPublicUrl(activeBucket, file.name);
                        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
                        const isSelected = selectedUrls.includes(url);
                        
                        return (
                            <button
                                key={file.name}
                                onClick={() => toggleSelection(url)}
                                className={`group relative border rounded-xl overflow-hidden transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#204f79] ${
                                    isSelected 
                                    ? 'border-[#204f79] shadow-lg ring-2 ring-[#204f79]' 
                                    : 'border-gray-200 bg-white hover:border-[#204f79] hover:shadow-md'
                                }`}
                            >
                                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {isImage ? (
                                        <img src={url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <File className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div className="p-2 border-t border-gray-100 bg-white">
                                    <p className="text-[10px] font-bold text-gray-700 truncate" title={file.name}>{file.name}</p>
                                </div>
                                
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#204f79] bg-white rounded-full shadow-lg" />
                                    </div>
                                )}

                                <div className={`absolute inset-0 bg-[#204f79]/0 group-hover:bg-[#204f79]/5 transition-colors flex items-center justify-center pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <span className="bg-[#204f79] text-white text-[9px] font-black tracking-[0.2em] uppercase px-2 py-1 rounded shadow-sm transition-opacity">
                                        {isSelected ? 'SELECTED' : 'SELECT'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Footer for Multi-Select */}
        {multiSelect && (
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {selectedUrls.length} image{selectedUrls.length !== 1 ? 's' : ''} chosen
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmSelection}
                        disabled={selectedUrls.length === 0 || saving}
                        className="px-6 py-2 bg-[#204f79] text-white text-sm font-black uppercase tracking-widest rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center gap-2"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {saving ? 'Uploading…' : 'Add Selected Images'}
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
