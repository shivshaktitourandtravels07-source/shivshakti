import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Save, X, Phone, Calendar, Users, Eye, RefreshCw, Lock, KeyRound, Download, LogOut, ShieldCheck, FileSpreadsheet, MapPin, Building2, Navigation, Database, Copy, Check, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';
import { TourPackage, BookingInquiry, AgencySettings, HeroSlide } from '../types';
import { getStoredPackages, saveTourPackage, deleteTourPackage, uploadImageFile, syncAllPackagesToSupabase, SUPABASE_CONFIG, SUPABASE_SETUP_SQL, getAgencySettings, saveAgencySettings, DEFAULT_AGENCY_SETTINGS } from '../services/packageStorage';
import { HERO_SLIDES } from '../data/packagesData';

interface AdminPanelProps {
  packages: TourPackage[];
  onRefreshPackages: () => void;
  navigate: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  packages,
  onRefreshPackages,
  navigate
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sst_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State: packages | cover_banner | supabase | inquiries | uploads | addresses
  const [activeTab, setActiveTab] = useState<'packages' | 'cover_banner' | 'supabase' | 'inquiries' | 'uploads' | 'addresses'>('packages');
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [heroUploadLoading, setHeroUploadLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'connected' | 'table_missing' | 'error'>('testing');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  // Agency & Home Hero Banner Settings State
  const [addressSettings, setAddressSettings] = useState<AgencySettings>(DEFAULT_AGENCY_SETTINGS);
  const [savingAddresses, setSavingAddresses] = useState(false);
  const [savingHomeHero, setSavingHomeHero] = useState(false);
  const [customHomeHeroUrl, setCustomHomeHeroUrl] = useState('');

  // Form state for creating or editing package
  const [formData, setFormData] = useState<Partial<TourPackage>>({
    title: '',
    slug: '',
    tagline: '',
    duration: '2 Days / 1 Night',
    daysCount: 2,
    nightsCount: 1,
    pricePerPerson: 6499,
    originalPrice: 7999,
    badge: 'Popular Tour',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    overview: '',
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: []
  });

  const [highlightsText, setHighlightsText] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Check Supabase connection
  const checkSupabase = async () => {
    setSupabaseStatus('testing');
    try {
      const res = await fetch(`${SUPABASE_CONFIG.restUrl}/packages?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });

      if (res.ok) {
        setSupabaseStatus('connected');
      } else if (res.status === 404 || res.status === 400) {
        setSupabaseStatus('table_missing');
      } else {
        setSupabaseStatus('error');
      }
    } catch {
      setSupabaseStatus('error');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkSupabase();
    }
  }, [isAuthenticated]);

  // Handle Admin Login with password "Shubham@123"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        sessionStorage.setItem('sst_admin_token', data.token);
        setPasswordInput('');
      } else if (passwordInput === 'Shubham@123') {
        // Fallback local password verification
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Invalid password. Please enter authorized admin key.');
      }
    } catch {
      if (passwordInput === 'Shubham@123') {
        setIsAuthenticated(true);
        sessionStorage.setItem('sst_admin_auth', 'true');
        setPasswordInput('');
      } else {
        setLoginError('Invalid password. Please enter authorized admin key.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sst_admin_auth');
    sessionStorage.removeItem('sst_admin_token');
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Inquiries fetch error:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  // Fetch agency settings (Office addresses + Home Hero banner)
  const fetchAddressSettings = async () => {
    try {
      const data = await getAgencySettings();
      if (data) {
        setAddressSettings(data);
        if (data.homeHero?.coverImage) {
          setCustomHomeHeroUrl(data.homeHero.coverImage);
        }
      }
    } catch (err) {
      console.error('Settings fetch notice:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddressSettings();
      if (activeTab === 'inquiries') {
        fetchInquiries();
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddresses(true);
    try {
      const success = await saveAgencySettings(addressSettings);
      if (success) {
        showNotification('success', 'Branch office addresses saved successfully! They are now live on the website.');
      } else {
        showNotification('error', 'Failed to save addresses');
      }
    } catch (err: any) {
      showNotification('error', 'Network error: ' + err.message);
    } finally {
      setSavingAddresses(false);
    }
  };

  // Home Page Cover Image & Banner Handlers
  const handleSaveHomeHero = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingHomeHero(true);
    try {
      const success = await saveAgencySettings(addressSettings);
      if (success) {
        showNotification('success', 'Home Page Cover Image & Banner updated! Changes are now live on the homepage.');
      } else {
        showNotification('error', 'Failed to save Home Page Cover Image.');
      }
    } catch (err: any) {
      showNotification('error', 'Network error: ' + err.message);
    } finally {
      setSavingHomeHero(false);
    }
  };

  const handleSetGlobalHomeCover = async (imgUrl: string) => {
    if (!imgUrl) return;
    const updated: AgencySettings = {
      ...addressSettings,
      homeHero: {
        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
        coverImage: imgUrl
      }
    };
    setAddressSettings(updated);
    setCustomHomeHeroUrl(imgUrl);
    await saveAgencySettings(updated);
    showNotification('success', 'Home Page Cover Image updated! This photo is now live on the homepage.');
  };

  const handleHeroCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploadLoading(true);
    try {
      const url = await uploadImageFile(file);
      await handleSetGlobalHomeCover(url);
    } catch (err: any) {
      showNotification('error', 'Upload error: ' + err.message);
    } finally {
      setHeroUploadLoading(false);
      e.target.value = '';
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingPackage(null);
    setFormData({
      title: '',
      slug: '',
      tagline: '',
      duration: '2 Days / 1 Night',
      daysCount: 2,
      nightsCount: 1,
      pricePerPerson: 6499,
      originalPrice: 7999,
      badge: 'New Pilgrimage Tour',
      coverImage: '',
      galleryImages: [],
      overview: '',
      highlights: [
        'VIP Darshan at Shree Mahakaleshwar Jyotirlinga',
        'Dedicated sanitized cab for all sightseeing & transfers',
        'Super Deluxe hotel accommodation with modern amenities',
        '100% Pure vegetarian breakfast, lunch and dinner included'
      ],
      inclusions: [
        'Dedicated sanitized cab with fuel and driver allowances',
        'Super Deluxe hotel stay',
        'All meals: Breakfast, Lunch, Dinner',
        'VIP Darshan facilitation at temples',
        'All toll taxes and parking'
      ],
      exclusions: [
        'Train or flight tickets to Indore/Ujjain',
        'Bhasma Aarti booking fee',
        'Personal shopping and laundry'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Day 1: Holy Ujjain Darshan',
          subtitle: 'Mahakaleshwar & Shipra Ram Ghat Aarti',
          places: ['Mahakal Mandir', 'Kaal Bhairav', 'Ram Ghat Aarti'],
          description: 'Arrival and check-in. Head for VIP Mahakal Darshan, explore Kaal Bhairav and attend evening Shipra Aarti.',
          mealsIncluded: 'Lunch, Dinner',
          stayLocation: 'Super Deluxe Hotel, Ujjain'
        }
      ]
    });
    setHighlightsText('VIP Darshan at Shree Mahakaleshwar Jyotirlinga\nDedicated sanitized cab for all sightseeing & transfers\nSuper Deluxe hotel accommodation with modern amenities\n100% Pure vegetarian breakfast, lunch and dinner included');
    setInclusionsText('Dedicated sanitized cab with fuel and driver allowances\nSuper Deluxe hotel stay\nAll meals: Breakfast, Lunch, Dinner\nVIP Darshan facilitation at temples\nAll toll taxes and parking');
    setExclusionsText('Train or flight tickets to Indore/Ujjain\nBhasma Aarti booking fee\nPersonal shopping and laundry');
  };

  const handleStartEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setIsCreatingNew(false);
    const gallery = pkg.galleryImages || [];
    let cover = pkg.coverImage;
    if (!cover || cover.includes('photo-1548013146-72479768bada')) {
      cover = gallery[0] || '/hero/slide1.jpg';
    }
    setFormData({
      ...pkg,
      coverImage: cover,
      galleryImages: gallery
    });
    setHighlightsText(pkg.highlights?.join('\n') || '');
    setInclusionsText(pkg.inclusions?.join('\n') || '');
    setExclusionsText(pkg.exclusions?.join('\n') || '');
  };

  const handleCancelForm = () => {
    setEditingPackage(null);
    setIsCreatingNew(false);
  };

  // Image helpers for unlimited gallery images
  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    setFormData(prev => {
      const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
      return {
        ...prev,
        coverImage: isDefaultCover ? url : prev.coverImage,
        galleryImages: [...(prev.galleryImages || []), url]
      };
    });
    setCustomImageUrl('');
    showNotification('success', 'Image added to gallery!');
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadLoading(true);
    try {
      const fileList = Array.from(files) as File[];
      const uploadPromises = fileList.map((file: File) => uploadImageFile(file));
      const urls = await Promise.all(uploadPromises);

      setFormData(prev => {
        const existing = prev.galleryImages || [];
        const isDefaultCover = !prev.coverImage || prev.coverImage.includes('photo-1548013146-72479768bada');
        return {
          ...prev,
          coverImage: isDefaultCover ? urls[0] : prev.coverImage,
          galleryImages: [...existing, ...urls]
        };
      });

      setUploadedPhotos(prev => [...urls, ...prev]);
      showNotification('success', `${urls.length} image(s) uploaded and saved!`);
    } catch (err: any) {
      showNotification('error', 'Error uploading images: ' + err.message);
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => {
      const updated = (prev.galleryImages || []).filter((_, idx) => idx !== indexToRemove);
      let newCover = prev.coverImage;
      if (prev.coverImage === prev.galleryImages?.[indexToRemove]) {
        newCover = updated[0] || '';
      }
      return {
        ...prev,
        coverImage: newCover,
        galleryImages: updated
      };
    });
    showNotification('success', 'Image removed from gallery.');
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imgUrl,
      galleryImages: prev.galleryImages?.includes(imgUrl) ? prev.galleryImages : [imgUrl, ...(prev.galleryImages || [])]
    }));
    showNotification('success', 'Primary cover photo updated! This photo will appear on the Home Page and Package listings.');
  };

  // Save Package (Works with Supabase, Server & LocalStorage!)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showNotification('error', 'Package title is required.');
      return;
    }

    const preparedHighlights = highlightsText.split('\n').map(s => s.trim()).filter(Boolean);
    const preparedInclusions = inclusionsText.split('\n').map(s => s.trim()).filter(Boolean);
    const preparedExclusions = exclusionsText.split('\n').map(s => s.trim()).filter(Boolean);

    // Ensure cover image is valid and not stuck on default unsplash placeholder
    let finalCover = formData.coverImage;
    if (!finalCover || finalCover.includes('photo-1548013146-72479768bada')) {
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        finalCover = formData.galleryImages[0];
      } else {
        finalCover = '/hero/slide1.jpg';
      }
    }

    const payload: Partial<TourPackage> = {
      ...formData,
      coverImage: finalCover,
      highlights: preparedHighlights,
      inclusions: preparedInclusions,
      exclusions: preparedExclusions
    };

    try {
      const result = await saveTourPackage(payload, isCreatingNew);
      if (result.success) {
        showNotification('success', isCreatingNew ? 'Package created and synced to Supabase & Live site!' : 'Package updated successfully!');
        handleCancelForm();
        onRefreshPackages();
      } else {
        showNotification('error', result.error || 'Failed to save package.');
      }
    } catch (err: any) {
      showNotification('error', 'Error saving package: ' + err.message);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const success = await deleteTourPackage(id);
      if (success) {
        showNotification('success', 'Package deleted successfully.');
        onRefreshPackages();
      } else {
        showNotification('error', 'Failed to delete package.');
      }
    } catch (err: any) {
      showNotification('error', 'Error deleting package: ' + err.message);
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, status: BookingInquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        showNotification('success', `Inquiry status updated to ${status}.`);
      }
    } catch {
      showNotification('error', 'Failed to update inquiry status.');
    }
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showNotification('success', 'Supabase SQL copied to clipboard!');
  };

  // Sync all packages to Supabase
  const handleSyncAllToSupabase = async () => {
    setSyncingAll(true);
    try {
      const currentPkgs = await getStoredPackages();
      const res = await syncAllPackagesToSupabase(currentPkgs);
      if (res.success) {
        showNotification('success', `Successfully synced ${res.count} packages to Supabase cloud!`);
        onRefreshPackages();
      } else {
        showNotification('error', `Sync failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      showNotification('error', `Sync error: ${err.message}`);
    } finally {
      setSyncingAll(false);
    }
  };

  // 1. Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900/5">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-amber-200/80 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-800 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Shiv Shakti Admin Portal</h2>
            <p className="text-xs text-slate-600">
              Manage tour packages, images, Supabase database, and inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{loginLoading ? 'Authenticating...' : 'Unlock Admin Dashboard'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-500 hover:text-amber-800 transition-colors"
            >
              ← Return to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Shiv Shakti Tour & Travels • Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tour & Database Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Add unlimited images, edit itineraries, configure Supabase sync, and manage customer inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onRefreshPackages()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-all cursor-pointer"
            title="Refresh packages"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-900 border border-red-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { setActiveTab('packages'); handleCancelForm(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tour Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('cover_banner'); handleCancelForm(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cover_banner'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Home Cover & Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Sync</span>
          <span className={`w-2 h-2 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Office Addresses</span>
        </button>
      </div>

      {/* TAB 1: TOUR PACKAGES & DYNAMIC EDITOR */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Action Header */}
          {!isCreatingNew && !editingPackage && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Current Tour Packages</h3>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    supabaseStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{supabaseStatus === 'connected' ? 'Supabase Synced' : 'Local + Server Ready'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Edit existing packages, add new ones, or upload unlimited photos.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-xs transition-all flex items-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
                  title="Push all packages to Supabase cloud table"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>{syncingAll ? 'Syncing...' : 'Sync Supabase'}</span>
                </button>
                <button
                  onClick={handleStartCreate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Package</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Modal / In-line Editor */}
          {(isCreatingNew || editingPackage) && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {isCreatingNew ? 'Create Tour Package' : 'Edit Tour Package'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {formData.title || 'Untitled Tour Package'}
                  </h3>
                </div>
                <button
                  onClick={handleCancelForm}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Package Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 3 Days 2 Nights Complete Ujjain, Maheshwar & Mandu Tour"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Ribbon</label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Signature Royal Circuit"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 3 Days / 2 Nights"
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price Per Person (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.pricePerPerson || 0}
                      onChange={(e) => setFormData({ ...formData, pricePerPerson: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Original Cut Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || 0}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Short Tagline / Catchphrase</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Brief one-line summary displayed on cards..."
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Overview Description</label>
                    <textarea
                      rows={3}
                      value={formData.overview || ''}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Comprehensive overview of places, temples, history, and experience..."
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-700 text-slate-900"
                    />
                  </div>
                </div>

                {/* UNLIMITED GALLERY & COVER IMAGES SECTION */}
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-700" />
                        <span>Package Images & Photo Gallery (Add Unlimited Photos)</span>
                      </h4>
                      <p className="text-xs text-slate-600">
                        Upload multiple photos at once or paste image URLs. You can remove, add, or set any photo as cover.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      {formData.galleryImages?.length || 0} Photos Added
                    </span>
                  </div>

                  {/* Add Images Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* File Uploader */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        1. Upload Photos from Device (Multiple Allowed)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleFilesUpload}
                        disabled={uploadLoading}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                      />
                      {uploadLoading && (
                        <p className="text-[11px] text-amber-700 font-semibold mt-1">Uploading & processing images...</p>
                      )}
                    </div>

                    {/* Image URL Input */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. Or Add Photo via Web URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomImageUrl}
                          className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-2 rounded-lg text-xs shrink-0 cursor-pointer"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Cover Photo Preview & Live Manager */}
                  <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Primary Cover Photo</span>
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3" />
                            <span>Shown on Home Page & Package Cards</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800/80 mt-0.5">
                          This is the main image visitors see on the homepage and tour listings. Click any photo below to make it the cover.
                        </p>
                      </div>

                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={() => handleSetGlobalHomeCover(formData.coverImage!)}
                          className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                          title="Set this photo as the Home Page Cover Banner"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Use as Home Cover</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-4 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-amber-400 relative shadow-xs">
                        <img
                          src={formData.coverImage || (formData.galleryImages && formData.galleryImages[0]) || '/hero/slide1.jpg'}
                          alt="Primary cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                              target.src = '/hero/slide1.jpg';
                            }
                          }}
                        />
                        <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          Current Cover Preview
                        </div>
                      </div>

                      <div className="sm:col-span-8 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700">Cover Image URL</label>
                        <input
                          type="text"
                          value={formData.coverImage || ''}
                          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                          placeholder="Paste image URL or upload photo above..."
                          className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 font-mono focus:ring-2 focus:ring-amber-500/30"
                        />
                        <p className="text-[11px] text-slate-500">
                          Tip: Uploading photos automatically assigns the first photo as the cover image. You can switch covers anytime by clicking "Make Cover" below.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails Grid of all added images */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">Live Photo Gallery ({formData.galleryImages?.length || 0} Photos)</label>
                      <span className="text-[11px] text-slate-500">Click any image to make it Cover Photo</span>
                    </div>

                    {(!formData.galleryImages || formData.galleryImages.length === 0) ? (
                      <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                        No photos added yet. Upload from device or paste URLs above to add photos!
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {formData.galleryImages.map((imgUrl, idx) => {
                          const isCover = formData.coverImage === imgUrl;
                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-xl overflow-hidden border-2 aspect-video shadow-xs transition-all ${
                                isCover ? 'border-emerald-500 ring-2 ring-emerald-400/50 bg-emerald-950/20' : 'border-slate-200 bg-slate-100 hover:border-amber-400'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery item ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                                    target.src = '/hero/slide1.jpg';
                                  }
                                }}
                              />
                              {isCover && (
                                <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1 z-10">
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Cover Photo</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverImage(imgUrl)}
                                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold cursor-pointer w-full text-center"
                                    title="Set as package cover image"
                                  >
                                    ★ Make Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleSetGlobalHomeCover(imgUrl)}
                                  className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[9px] font-semibold cursor-pointer w-full text-center"
                                  title="Set as Home Page Cover"
                                >
                                  Use for Home
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(idx)}
                                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-[10px] cursor-pointer"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Highlights, Inclusions & Exclusions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Highlights (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inclusions (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={inclusionsText}
                      onChange={(e) => setInclusionsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Exclusions (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={exclusionsText}
                      onChange={(e) => setExclusionsText(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Sync Package</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Packages List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={pkg.coverImage || '/hero/slide1.jpg'}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                          target.src = '/hero/slide1.jpg';
                        }
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-amber-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {pkg.duration}
                    </div>
                    {pkg.galleryImages && pkg.galleryImages.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{pkg.galleryImages.length} photos</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-800 font-bold">₹{pkg.pricePerPerson} / person</span>
                      {pkg.badge && (
                        <span className="bg-amber-50 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {pkg.tagline || pkg.overview}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                  <a
                    href={`/package/${pkg.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-amber-800 rounded-lg hover:bg-slate-50"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSetGlobalHomeCover(pkg.coverImage || (pkg.galleryImages && pkg.galleryImages[0]) || '/hero/slide1.jpg')}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                      title="Set this photo as the Home Page Cover Banner"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Set Home Cover</span>
                    </button>
                    <button
                      onClick={() => handleStartEdit(pkg)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit & Photos</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                      className="p-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: HOME COVER & HERO BANNER MANAGER */}
      {activeTab === 'cover_banner' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Homepage Customization</span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Home Page Cover Image & Hero Banner</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Change the main cover background image, banner title, and sliding spots displayed at the very top of your homepage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveHomeHero()}
                  disabled={savingHomeHero}
                  className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingHomeHero ? 'Saving Changes...' : 'Save Live Home Banner'}</span>
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW OF CURRENT COVER BANNER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Live Homepage Cover Preview
              </label>
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[21/9] sm:aspect-[24/9] border-2 border-amber-500 shadow-md">
                <img
                  src={addressSettings.homeHero?.coverImage || '/hero/slide1.jpg'}
                  alt="Homepage Hero Banner Preview"
                  className="w-full h-full object-cover filter brightness-90"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                      target.src = '/hero/slide1.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-semibold w-fit mb-2 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Active Live Homepage Cover Image</span>
                  </div>
                  <h4 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                    {addressSettings.homeHero?.heading || 'Indore & Ujjain Darshan & Tour Packages'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl mt-1">
                    {addressSettings.homeHero?.subheading || 'Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas: Shree Mahakaleshwar Bhasma Aarti (Ujjain) and Holy Omkareshwar (Narmada Island)...'}
                  </p>
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Currently Live on Website</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS TO CHANGE COVER IMAGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Option A: Upload Direct from Device */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Upload className="w-4 h-4 text-amber-700" />
                  <span>Upload New Cover Image from Device</span>
                </div>
                <p className="text-xs text-slate-600">
                  Select a high-resolution photo from your phone or PC. It will automatically upload and become the new Homepage Cover.
                </p>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroCoverUpload}
                    disabled={heroUploadLoading}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                  />
                  {heroUploadLoading && (
                    <p className="text-xs text-amber-700 font-semibold mt-2 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading & setting home cover image...</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Option B: Enter Custom URL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-amber-700" />
                  <span>Or Paste Image URL</span>
                </div>
                <p className="text-xs text-slate-600">
                  Paste any web link or uploaded image path to use as the Home Cover Image.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHomeHeroUrl}
                    onChange={(e) => setCustomHomeHeroUrl(e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 p-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customHomeHeroUrl.trim()) {
                        handleSetGlobalHomeCover(customHomeHeroUrl.trim());
                      }
                    }}
                    className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

            </div>

            {/* PRE-VERIFIED SACRED DESTINATION PRESETS (1-CLICK SELECT) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  2. Choose from High-Resolution Sacred Presets (1-Click Apply)
                </label>
                <span className="text-[11px] text-slate-500">Instant preview & switch</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { title: 'Shree Mahakaleshwar, Ujjain', img: '/hero/slide1.jpg', tag: 'Mahakal Mandir' },
                  { title: 'Holy Omkareshwar Jyotirlinga', img: '/hero/slide2.jpg', tag: 'Narmada Island' },
                  { title: 'Royal Maheshwar Ahilya Fort', img: '/hero/slide3.jpg', tag: 'Ahilya Ghat' },
                  { title: 'Historic Rajwada Palace', img: '/hero/slide4.jpg', tag: 'Indore Heritage' },
                  { title: 'Mandu Jahaz Mahal', img: '/hero/slide5.jpg', tag: 'Mandu Fort' },
                ].map((preset, idx) => {
                  const isCurrent = addressSettings.homeHero?.coverImage === preset.img;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSetGlobalHomeCover(preset.img)}
                      className={`group relative rounded-xl overflow-hidden aspect-[4/3] border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-amber-400 hover:scale-[1.01]'
                      }`}
                    >
                      <img src={preset.img} alt={preset.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold text-amber-300 truncate">{preset.tag}</span>
                        <span className="text-[11px] font-semibold line-clamp-1">{preset.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHOOSE FROM YOUR TOUR PACKAGES' COVERS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  3. Or Pick From Any Tour Package's Cover Photo
                </label>
                <span className="text-[11px] text-slate-500">Uses that package's cover photo for Homepage</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {packages.map((pkg) => {
                  const isCurrent = addressSettings.homeHero?.coverImage === pkg.coverImage;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSetGlobalHomeCover(pkg.coverImage)}
                      className={`group relative rounded-xl overflow-hidden aspect-video border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <img
                        src={pkg.coverImage || '/hero/slide1.jpg'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== window.location.origin + '/hero/slide1.jpg') {
                            target.src = '/hero/slide1.jpg';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-semibold line-clamp-1">{pkg.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EDIT HOMEPAGE HEADINGS */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-800">
                4. Customize Hero Title & Subheading Text (Optional)
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Heading</label>
                  <input
                    type="text"
                    value={addressSettings.homeHero?.heading || ''}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      homeHero: {
                        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
                        heading: e.target.value
                      }
                    })}
                    placeholder="Indore & Ujjain Darshan & Tour Packages"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subheading Description</label>
                  <textarea
                    rows={3}
                    value={addressSettings.homeHero?.subheading || ''}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      homeHero: {
                        ...(addressSettings.homeHero || DEFAULT_AGENCY_SETTINGS.homeHero!),
                        subheading: e.target.value
                      }
                    })}
                    placeholder="Experience divine spiritual bliss across Madhya Pradesh’s revered Jyotirlingas..."
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveHomeHero()}
                  disabled={savingHomeHero}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingHomeHero ? 'Saving...' : 'Save & Publish All Homepage Changes'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SUPABASE CLOUD DATABASE STATUS & 1-CLICK SQL */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Cloud Storage</span>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <Database className="w-5 h-5 text-amber-700" />
                <span>Supabase Integration Hub</span>
              </h3>
            </div>
            <button
              onClick={checkSupabase}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Supabase API Endpoint</span>
              <p className="text-xs font-mono font-bold text-slate-800 truncate">{SUPABASE_CONFIG.restUrl}</p>
              <p className="text-[11px] text-slate-500">Project: kbqvgvnoemnyjbytnacu</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Connection Status</span>
                <button
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingAll}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>{syncingAll ? 'Syncing...' : 'Sync All Packages Now'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`w-3 h-3 rounded-full ${supabaseStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold text-slate-900">
                  {supabaseStatus === 'connected' ? 'Connected & Ready' : (supabaseStatus === 'table_missing' ? 'Connected (Table Schema Pending)' : 'Active (Local Sync Fallback Ready)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Automatic multi-tier fallback ensures zero downtime on Netlify or local preview.
              </p>
            </div>
          </div>

          {/* SQL Setup Helper */}
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">1-Click Supabase Table Setup SQL</h4>
                <p className="text-xs text-slate-600">
                  If you haven't created the `packages` table in your Supabase dashboard yet, copy this SQL and run it in your Supabase SQL Editor.
                </p>
              </div>
              <button
                onClick={handleCopySql}
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs overflow-x-auto font-mono max-h-60">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES MANAGEMENT */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Bookings</span>
              <h3 className="text-xl font-bold text-slate-900">Customer Booking Inquiries</h3>
            </div>
            <button
              onClick={fetchInquiries}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Inquiries</span>
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No booking inquiries logged yet. When visitors fill out WhatsApp booking forms, they will show here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Package</th>
                    <th className="py-3 px-3">Travel Date</th>
                    <th className="py-3 px-3">Persons</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {inq.customerName || 'Pilgrim'}
                        <div className="text-[11px] text-slate-500">{inq.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{inq.packageName}</td>
                      <td className="py-3 px-3 text-slate-600">{inq.travelDate || 'Flexible'}</td>
                      <td className="py-3 px-3 text-slate-600">{inq.numberOfPersons}</td>
                      <td className="py-3 px-3">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          className="text-xs p-1 rounded border border-slate-300 font-medium"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFICE ADDRESSES */}
      {activeTab === 'addresses' && (
        <form onSubmit={handleSaveAddresses} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Branch Offices</span>
              <h3 className="text-xl font-bold text-slate-900">Ujjain & Indore Office Addresses</h3>
            </div>
            <button
              type="submit"
              disabled={savingAddresses}
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savingAddresses ? 'Saving...' : 'Save Office Addresses'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ujjain Office */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Ujjain Branch Office</span>
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={addressSettings.ujjainOffice.title}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    ujjainOffice: { ...addressSettings.ujjainOffice, title: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={addressSettings.ujjainOffice.address}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    ujjainOffice: { ...addressSettings.ujjainOffice, address: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={addressSettings.ujjainOffice.phone}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      ujjainOffice: { ...addressSettings.ujjainOffice, phone: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timings</label>
                  <input
                    type="text"
                    value={addressSettings.ujjainOffice.timing}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      ujjainOffice: { ...addressSettings.ujjainOffice, timing: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Indore Office */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Indore Head Office</span>
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={addressSettings.indoreOffice.title}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    indoreOffice: { ...addressSettings.indoreOffice, title: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <textarea
                  rows={2}
                  value={addressSettings.indoreOffice.address}
                  onChange={(e) => setAddressSettings({
                    ...addressSettings,
                    indoreOffice: { ...addressSettings.indoreOffice, address: e.target.value }
                  })}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={addressSettings.indoreOffice.phone}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      indoreOffice: { ...addressSettings.indoreOffice, phone: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timings</label>
                  <input
                    type="text"
                    value={addressSettings.indoreOffice.timing}
                    onChange={(e) => setAddressSettings({
                      ...addressSettings,
                      indoreOffice: { ...addressSettings.indoreOffice, timing: e.target.value }
                    })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
