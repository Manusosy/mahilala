import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@workspace/esaora-core/hooks/useAuth';
import { supabase } from '@workspace/esaora-core/lib/supabase';
import { uploadFile } from '@workspace/esaora-core/hooks/useData';
import { Save, Loader2, Check, AlertCircle, UploadCloud } from 'lucide-react';

export default function ProfileSettingsTab() {
  const { user, profile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
    if (user) setEmail(user.email || '');
  }, [profile, user]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // 1. Update Profile name & avatar
      if (profile?.id) {
        const payload: { full_name?: string; avatar_url?: string } = {};
        if (fullName.trim() !== profile.full_name) payload.full_name = fullName.trim();
        if (avatarUrl !== profile.avatar_url) payload.avatar_url = avatarUrl;
        
        if (Object.keys(payload).length > 0) {
          const { error: profileError } = await supabase
            .from('admin_profiles')
            .update(payload)
            .eq('id', profile.id);
          if (profileError) throw profileError;
        }
      }

      // 2. Update Password if requested
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (newPassword.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
        if (authError) throw authError;
      }

      setSuccess('Profile updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError('');
    try {
      // Use the generic images bucket
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const url = await uploadFile('images', `avatars/${filename}`, file);
      setAvatarUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload profile image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const formattedRole = profile?.role 
    ? profile.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') 
    : 'Admin';

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-gray-900 font-bold">My Profile</h3>
        <p className="text-xs text-gray-500 mt-0.5">Manage your personal account details and security.</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-[6px] p-3 text-red-700 text-sm font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Profile Avatar Area */}
        <div className="flex items-center gap-5 pb-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || email || 'Admin')}&background=2E3899&color=fff&size=128&bold=true`}
              alt="Profile Gravatar" 
              className={`w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm transition-opacity ${uploadingAvatar ? 'opacity-50' : 'group-hover:opacity-80'}`}
            />
            {uploadingAvatar ? (
               <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-[#001BB7]" />
               </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#001BB7] border-2 border-white rounded-full flex items-center justify-center pointer-events-none">
              <Check className="w-3 h-3 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
          <div>
            <h4 className="text-gray-900 font-bold">{fullName || (email ? email.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Administrator')}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{formattedRole}</p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl border-t border-gray-100 pt-5">
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 transition-colors"
              placeholder="Your Full Name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-[6px] px-3 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 mt-1.5">Email address cannot be changed from this portal. Contact a Super Admin.</p>
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Change Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 transition-colors"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-emerald-600 font-semibold flex items-center gap-2 h-6">
          {success && <><Check className="w-4 h-4" /> {success}</>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-[6px] text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Profile
        </button>
      </div>
    </div>
  );
}
