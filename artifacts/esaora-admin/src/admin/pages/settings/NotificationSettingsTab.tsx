import { useState, useEffect } from 'react';
import { useAuth } from '@workspace/esaora-core/hooks/useAuth';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import { Save, Loader2, Check } from 'lucide-react';

export default function NotificationSettingsTab() {
  const { user } = useAuth();
  
  // Create a unique key for this user's notification preferences
  const notifKey = user ? `notif_prefs_${user.id}` : '';
  const { settings, loading: loadingConfig, updateSetting } = useSiteSettings(notifKey);
  
  const [emailNewContacts, setEmailNewContacts] = useState(true);
  const [emailNewMemberships, setEmailNewMemberships] = useState(true);
  const [appSounds, setAppSounds] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loadingConfig && notifKey && settings[notifKey]) {
      try {
        const prefs = JSON.parse(settings[notifKey]);
        setEmailNewContacts(prefs.emailNewContacts !== false);
        setEmailNewMemberships(prefs.emailNewMemberships !== false);
        setAppSounds(prefs.appSounds !== false);
      } catch (e) {
        // Defaults if parsing fails
      }
    }
  }, [loadingConfig, settings, notifKey]);

  const handleSave = async () => {
    if (!notifKey) return;
    setSaving(true);
    setSuccess(false);
    
    const newPrefs = {
      emailNewContacts,
      emailNewMemberships,
      appSounds
    };

    try {
      await updateSetting(notifKey, JSON.stringify(newPrefs));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save notification settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig || !user) {
    return <div className="flex justify-center p-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>;
  }

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-gray-900 font-bold">Notification Preferences</h3>
        <p className="text-xs text-gray-500 mt-0.5">Control how and when you receive alerts from the platform.</p>
      </div>

      <div className="p-6 space-y-6">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Email Alerts</h4>
        <div className="space-y-4">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[6px] border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">New Contact Messages</p>
              <p className="text-xs text-gray-500 mt-0.5">Receive an email when a user submits the general contact form.</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNewContacts(!emailNewContacts)}
              className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001BB7] ${emailNewContacts ? 'bg-[#001BB7]' : 'bg-gray-200'}`}
              style={{ width: 44, height: 24 }}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${emailNewContacts ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[6px] border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">New Partnership Applications</p>
              <p className="text-xs text-gray-500 mt-0.5">Receive an email when a new organization applies to join the Alliance.</p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNewMemberships(!emailNewMemberships)}
              className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001BB7] ${emailNewMemberships ? 'bg-[#001BB7]' : 'bg-gray-200'}`}
              style={{ width: 44, height: 24 }}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${emailNewMemberships ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h4 className="text-sm font-bold text-gray-900 mb-4">In-App Notifications</h4>
          
          {/* Toggle 3 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[6px] border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">Dashboard Notification Sounds</p>
              <p className="text-xs text-gray-500 mt-0.5">Play a subtle sound when a new alert populates the top bar.</p>
            </div>
            <button
              type="button"
              onClick={() => setAppSounds(!appSounds)}
              className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001BB7] ${appSounds ? 'bg-[#001BB7]' : 'bg-gray-200'}`}
              style={{ width: 44, height: 24 }}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${appSounds ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-emerald-600 font-semibold flex items-center gap-2 h-6">
          {success && <><Check className="w-4 h-4" /> Preferences saved</>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-[6px] text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Preferences
        </button>
      </div>
    </div>
  );
}
