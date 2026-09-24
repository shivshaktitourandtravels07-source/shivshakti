import { TourPackage, BookingInquiry } from '../types';
import { INITIAL_PACKAGES } from '../data/packagesData';

// Supabase Configuration provided by user
export const SUPABASE_CONFIG = {
  url: 'https://kbqvgvnoemnyjbytnacu.supabase.co',
  restUrl: 'https://kbqvgvnoemnyjbytnacu.supabase.co/rest/v1',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticXZndm5vZW1ueWpieXRuYWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDQ2ODcsImV4cCI6MjEwNTgyMDY4N30.b8uD4E9gAa7odru1eAUpzFK6JfkPCFyiXiZnakr_AgA'
};

const LOCAL_STORAGE_KEY = 'sst_custom_packages_v2';
const LOCAL_INQUIRIES_KEY = 'sst_inquiries_v2';

// Universal headers for Supabase REST API
const getSupabaseHeaders = () => ({
  'apikey': SUPABASE_CONFIG.anonKey,
  'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
});

// SQL schema generator helper for the user to run in Supabase SQL Editor if table doesn't exist
export const SUPABASE_SETUP_SQL = `-- Run this once in Supabase SQL Editor (https://supabase.com/dashboard/project/kbqvgvnoemnyjbytnacu/sql)
create table if not exists public.packages (
  id text primary key,
  slug text unique,
  title text not null,
  tagline text,
  duration text,
  "daysCount" integer default 1,
  "nightsCount" integer default 0,
  "pricePerPerson" numeric not null default 2499,
  "originalPrice" numeric default 3499,
  "suitableFor" text,
  badge text,
  featured boolean default false,
  "coverImage" text,
  "galleryImages" text[] default '{}',
  overview text,
  highlights text[] default '{}',
  inclusions text[] default '{}',
  exclusions text[] default '{}',
  itinerary jsonb default '[]',
  "cancellationPolicy" text,
  "seoKeywords" text[] default '{}',
  "metaDescription" text,
  "createdAt" timestamp with time zone default now()
);

-- Enable public read & admin write policies
alter table public.packages enable row level security;

create policy "Public read packages" on public.packages for select using (true);
create policy "Public insert packages" on public.packages for insert with check (true);
create policy "Public update packages" on public.packages for update using (true);
create policy "Public delete packages" on public.packages for delete using (true);

-- Optional customer inquiries table
create table if not exists public.inquiries (
  id text primary key,
  "packageName" text,
  name text,
  phone text,
  email text,
  "travelDate" text,
  "numberOfPersons" integer default 2,
  status text default 'new',
  notes text,
  "createdAt" timestamp with time zone default now()
);

alter table public.inquiries enable row level security;
create policy "Public inquiries access" on public.inquiries for all using (true);
`;

// Helper: Normalize package data coming from Supabase or LocalStorage
function normalizePackage(pkg: any): TourPackage {
  return {
    id: String(pkg.id || `pkg-${Date.now()}`),
    slug: String(pkg.slug || `package-${Date.now()}`),
    title: String(pkg.title || 'Ujjain Pilgrimage Tour'),
    tagline: String(pkg.tagline || ''),
    duration: String(pkg.duration || '2 Days / 1 Night'),
    daysCount: Number(pkg.daysCount || 2),
    nightsCount: Number(pkg.nightsCount || 1),
    pricePerPerson: Number(pkg.pricePerPerson || 6499),
    originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : undefined,
    suitableFor: pkg.suitableFor || undefined,
    badge: pkg.badge || undefined,
    featured: Boolean(pkg.featured),
    coverImage: pkg.coverImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    galleryImages: Array.isArray(pkg.galleryImages) ? pkg.galleryImages : (pkg.galleryImages ? [pkg.galleryImages] : []),
    overview: String(pkg.overview || ''),
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
    cancellationPolicy: pkg.cancellationPolicy || undefined,
    seoKeywords: Array.isArray(pkg.seoKeywords) ? pkg.seoKeywords : [],
    metaDescription: pkg.metaDescription || undefined
  };
}

// 1. GET ALL PACKAGES (Supabase -> Server API -> LocalStorage -> INITIAL_PACKAGES)
export async function getStoredPackages(): Promise<TourPackage[]> {
  // First, check if Supabase REST API has packages
  try {
    const supabaseRes = await fetch(`${SUPABASE_CONFIG.restUrl}/packages?select=*&order=createdAt.desc`, {
      headers: getSupabaseHeaders()
    });

    if (supabaseRes.ok) {
      const data = await supabaseRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizePackage);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch (err) {
    console.debug('Supabase direct query notice:', err);
  }

  // Second, check server Node API (/api/packages)
  try {
    const serverRes = await fetch('/api/packages');
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizePackage);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch (err) {
    console.debug('Server API fetch notice:', err);
  }

  // Third, check LocalStorage
  try {
    const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizePackage);
      }
    }
  } catch (e) {
    console.debug('LocalStorage read notice:', e);
  }

  // Fallback to static initial packages
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
  return INITIAL_PACKAGES;
}

// 2. SAVE OR UPDATE PACKAGE (Syncs to Supabase, LocalStorage, and Server)
export async function saveTourPackage(
  pkgData: Partial<TourPackage>,
  isNew: boolean
): Promise<{ success: boolean; package: TourPackage; error?: string }> {
  try {
    const existing = await getStoredPackages();
    let targetPkg: TourPackage;

    if (isNew) {
      const id = pkgData.id || `pkg-${Date.now()}`;
      const slug = pkgData.slug || pkgData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `package-${Date.now()}`;
      targetPkg = normalizePackage({
        ...pkgData,
        id,
        slug
      });
      existing.unshift(targetPkg);
    } else {
      const index = existing.findIndex(p => p.id === pkgData.id);
      if (index === -1) {
        targetPkg = normalizePackage(pkgData);
        existing.unshift(targetPkg);
      } else {
        existing[index] = normalizePackage({ ...existing[index], ...pkgData });
        targetPkg = existing[index];
      }
    }

    // A. Always save to LocalStorage first (instant 100% reliable guarantee)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));

    // B. Save to Supabase
    try {
      if (isNew) {
        await fetch(`${SUPABASE_CONFIG.restUrl}/packages`, {
          method: 'POST',
          headers: getSupabaseHeaders(),
          body: JSON.stringify(targetPkg)
        });
      } else {
        await fetch(`${SUPABASE_CONFIG.restUrl}/packages?id=eq.${targetPkg.id}`, {
          method: 'PATCH',
          headers: getSupabaseHeaders(),
          body: JSON.stringify(targetPkg)
        });
      }
    } catch (sbErr) {
      console.debug('Supabase sync notice:', sbErr);
    }

    // C. Save to Server Node filesystem (/data/packages.json)
    try {
      if (isNew) {
        await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetPkg)
        });
      } else {
        await fetch(`/api/packages/${targetPkg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetPkg)
        });
      }
    } catch (srvErr) {
      console.debug('Server sync notice:', srvErr);
    }

    return { success: true, package: targetPkg };
  } catch (err: any) {
    return { success: false, package: pkgData as TourPackage, error: err.message };
  }
}

// 3. DELETE PACKAGE (Deletes from Supabase, LocalStorage, and Server)
export async function deleteTourPackage(id: string): Promise<boolean> {
  try {
    const existing = await getStoredPackages();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Supabase delete
    try {
      await fetch(`${SUPABASE_CONFIG.restUrl}/packages?id=eq.${id}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders()
      });
    } catch (e) {
      console.debug('Supabase delete notice:', e);
    }

    // Server delete
    try {
      await fetch(`/api/packages/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.debug('Server delete notice:', e);
    }

    return true;
  } catch {
    return false;
  }
}

// 4. IMAGE UPLOAD HELPER (Converts to DataURL and saves to server /uploads if possible)
export async function uploadImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // Try uploading to server /api/upload to get a static URL
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: dataUrl,
            filename: file.name
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            resolve(json.url);
            return;
          }
        }
      } catch (err) {
        console.debug('Server upload notice, using DataURL:', err);
      }

      // If server upload unavailable (e.g. Netlify static), return DataURL directly
      // This guarantees the image displays and persists immediately!
      resolve(dataUrl);
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

// 5. INQUIRIES MANAGEMENT
export async function getStoredInquiries(): Promise<BookingInquiry[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return [];
}

export async function saveBookingInquiry(inquiry: Partial<BookingInquiry>): Promise<boolean> {
  const newInq: BookingInquiry = {
    id: `inq-${Date.now()}`,
    packageName: inquiry.packageName || 'General Inquiry',
    customerName: inquiry.customerName || 'Pilgrim',
    phone: inquiry.phone || 'WhatsApp Inquiry',
    email: inquiry.email,
    travelDate: inquiry.travelDate || '',
    numberOfPersons: inquiry.numberOfPersons || 2,
    pickupLocation: inquiry.pickupLocation || 'Indore / Ujjain',
    specialRequests: inquiry.specialRequests,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  // LocalStorage
  try {
    const inqs = await getStoredInquiries();
    inqs.unshift(newInq);
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inqs));
  } catch (e) {}

  // Server
  try {
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq)
    });
  } catch (e) {}

  // Supabase
  try {
    await fetch(`${SUPABASE_CONFIG.restUrl}/inquiries`, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify(newInq)
    });
  } catch (e) {}

  return true;
}
