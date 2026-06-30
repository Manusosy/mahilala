import { useState, useEffect } from 'react';
import { useSiteSettings } from '@workspace/esaora-core/hooks/useData';
import { MediaSelectModal } from '@/admin/components/MediaSelectModal';
import { Save, Loader2, Check, ImageIcon } from 'lucide-react';

type PreviewBg = 'light' | 'brand';
type LogoField = 'header' | 'footer' | 'favicon';

function LogoRow({
  label,
  description,
  recommended,
  value,
  previewBg,
  onPick,
  onClear,
}: {
  label: string;
  description: string;
  recommended?: string;
  value: string;
  previewBg: PreviewBg;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* Preview — transparent logos shown on their real background, never cropped or rounded */}
      <div
        className={`w-[92px] h-14 flex-shrink-0 rounded-md border flex items-center justify-center overflow-hidden ${
          previewBg === 'brand' ? 'bg-[#001BB7] border-[#001496]' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {value ? (
          <img src={value} alt={label} className="max-h-10 max-w-[76px] w-auto object-contain" />
        ) : (
          <ImageIcon className={`w-5 h-5 ${previewBg === 'brand' ? 'text-white/40' : 'text-gray-300'}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        {recommended && <p className="text-[11px] text-gray-400 mt-1">{recommended}</p>}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        )}
        <button
          type="button"
          onClick={onPick}
          className="px-3.5 py-2 border border-gray-300 text-gray-700 hover:border-[#001BB7] hover:text-[#001BB7] rounded-md text-xs font-semibold transition-colors"
        >
          {value ? 'Change' : 'Select'}
        </button>
      </div>
    </div>
  );
}

export default function SystemSettingsTab() {
  const { settings, loading: loadingConfig, updateSetting } = useSiteSettings();

  const [siteName, setSiteName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [headerLogo, setHeaderLogo] = useState('');
  const [footerLogo, setFooterLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const [picker, setPicker] = useState<LogoField | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loadingConfig) {
      setSiteName(settings.site_name || 'Mahilala Madagascar');
      setContactEmail(settings.contact_email || '');
      setHeaderLogo(settings.header_logo_url || '');
      setFooterLogo(settings.footer_logo_url || '');
      setFavicon(settings.favicon_url || '');
      setMaintenanceMode(settings.maintenance_mode === 'true');
      setAllowRegistration(settings.allow_registration !== 'false');
    }
  }, [loadingConfig, settings]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await updateSetting('site_name', siteName);
      await updateSetting('contact_email', contactEmail);
      await updateSetting('header_logo_url', headerLogo);
      await updateSetting('footer_logo_url', footerLogo);
      await updateSetting('favicon_url', favicon);
      await updateSetting('maintenance_mode', maintenanceMode ? 'true' : 'false');
      await updateSetting('allow_registration', allowRegistration ? 'true' : 'false');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save system settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePick = (url: string) => {
    if (picker === 'header') setHeaderLogo(url);
    else if (picker === 'footer') setFooterLogo(url);
    else if (picker === 'favicon') setFavicon(url);
    setPicker(null);
  };

  if (loadingConfig) {
    return <div className="flex justify-center p-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>;
  }

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-gray-900 font-bold">System Configuration</h3>
        <p className="text-xs text-gray-500 mt-0.5">Manage global variables and core functionality overrides for the platform.</p>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Mahilala Madagascar"
              className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1.5">Shown in the browser tab and used as the logo alt text across the public site.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Global Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@organization.com"
              className="w-full bg-white border border-gray-300 rounded-[6px] px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 transition-colors"
            />
          </div>
        </div>

        {/* Branding / Logos */}
        <div>
          <div className="mb-1">
            <h4 className="text-sm font-bold text-gray-900">Branding &amp; Logos</h4>
            <p className="text-xs text-gray-500 mt-0.5">Pick transparent PNG/SVG assets from the media library. Changes apply to the public site once saved.</p>
          </div>

          <div className="border border-gray-200 rounded-[6px] divide-y divide-gray-100 px-4">
            <LogoRow
              label="Header Logo"
              description="Shown in the public site's top navigation bar (white background)."
              recommended="Transparent PNG/SVG, ~320×96px."
              value={headerLogo}
              previewBg="light"
              onPick={() => setPicker('header')}
              onClear={() => setHeaderLogo('')}
            />
            <LogoRow
              label="Footer Logo"
              description="Shown in the public site's footer (brand blue background)."
              recommended="Transparent PNG/SVG, light/white version."
              value={footerLogo}
              previewBg="brand"
              onPick={() => setPicker('footer')}
              onClear={() => setFooterLogo('')}
            />
            <LogoRow
              label="Favicon"
              description="The small icon shown in the browser tab and bookmarks."
              recommended="Square PNG, 512×512px (or .ico)."
              value={favicon}
              previewBg="light"
              onPick={() => setPicker('favicon')}
              onClear={() => setFavicon('')}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[6px] border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">Maintenance Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">When enabled, the public site redirects to a maintenance page.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001BB7] ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
              style={{ width: 44, height: 24 }}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${maintenanceMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[6px] border border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">Allow Partnership Registrations</p>
              <p className="text-xs text-gray-500 mt-0.5">Turn off to temporarily hide partnership application forms.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowRegistration(!allowRegistration)}
              className={`relative inline-flex items-center flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001BB7] ${allowRegistration ? 'bg-[#001BB7]' : 'bg-gray-200'}`}
              style={{ width: 44, height: 24 }}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${allowRegistration ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-emerald-600 font-semibold flex items-center gap-2 h-6">
          {success && <><Check className="w-4 h-4" /> Changes saved</>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#001BB7] hover:bg-[#F78A28] text-white rounded-[6px] text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </button>
      </div>

      {picker && (
        <MediaSelectModal
          title={picker === 'favicon' ? 'Select Favicon' : 'Select Logo'}
          allowedBuckets={['images', 'partner-logos']}
          onSelect={handlePick}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
