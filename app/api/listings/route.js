import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

import { unstable_noStore } from 'next/cache';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function resolveListingCategory(listing) {
  const f = listing.features || {};

  // Primary — exact category field
  const rawCat = f["Kategori"];
  if (rawCat === "İş Yeri") return "isyeri";

  // Secondary — emlak tipi
  const et = f["Emlak Tipi"] || "";
  if (et.includes("Arsa")) return "arsa";

  // Fallback
  return "konut";
}

export async function GET(request) {
  const supabase = createClient();
  unstable_noStore();

  try {
    const { searchParams } = new URL(request.url);

    // 1. Parse Query Parameters
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const mode = searchParams.get('mode'); // "sale" or "rent"
    const category = searchParams.get('category'); // "konut" | "isyeri" | "arsa"
    const city = searchParams.get('city');
    const district = searchParams.get('district');

    // 2. Build Supabase Query
    let query = supabase
      .from('listings')
      .select(`
        listing_id,
        source_url,
        title,
        description,
        price_raw,
        price_value,
        manual_title,
        manual_description,
        manual_price_raw,
        city,
        district,
        neighborhood,
        features,
        status,
        listing_type, 
        category,
        is_deleted,
        scrape_status,
        created_at,
        updated_at
      `, { count: 'exact' });

    // Apply Filters
    query = query.in('status', ['active', 'inactive']);
    query = query.eq('is_deleted', false);

    if (city) query = query.eq('city', city);
    if (district) query = query.eq('district', district);

    // Price Filter (on price_value column if it exists and is populated)
    if (minPrice !== null) query = query.gte('price_value', minPrice);
    if (maxPrice !== null) query = query.lte('price_value', maxPrice);

    // Apply Ordering
    query = query.order('created_at', { ascending: false });

    const { data: listings, error: listingsError, count } = await query;

    if (listingsError) {
      console.error('[API /listings] Supabase listings error:', listingsError);
      return NextResponse.json({ error: 'Veritabanı bağlantı hatası' }, { status: 500 });
    }

    // 3. Process Listings & Derive Mode
    let processedListings = listings.map(listing => {
      // Derive Mode (Sale/Rent)
      // Priority: listing_type column > Features > Title logic
      let derivedMode = 'sale'; // Default

      const typeText = (
        listing.listing_type ||
        listing.features?.['Emlak Tipi'] ||
        listing.features?.['Durumu'] ||
        listing.title ||
        ''
      ).toLowerCase();

      if (typeText.includes('kiralık')) {
        derivedMode = 'rent';
      } else if (typeText.includes('günlük')) {
        derivedMode = 'rent'; // Daily rent is still rent
      } else if (typeText.includes('satılık')) {
        derivedMode = 'sale';
      } else if (typeText.includes('devren')) {
        derivedMode = 'sale'; // Devren usually implies sale logic
      }

      // Apply manual overrides for display
      const displayTitle = listing.manual_title || listing.title;
      const displayDescription = listing.manual_description || listing.description;
      const displayPrice = listing.manual_price_raw || listing.price_raw;

      return {
        ...listing,
        title: displayTitle,
        description: displayDescription,
        price: displayPrice,
        listing_mode: derivedMode,
        listing_category: resolveListingCategory(listing),
        // Keep original fields needed for media mapping
        listing_id: listing.listing_id
      };
    });

    // 4. Client-side Filtering (Mode)
    // NOTE: This reduces the page size if DB didn't filter it.
    if (mode) {
      processedListings = processedListings.filter(l => l.listing_mode === mode);
    }

    // 4b. Client-side Filtering (Category)
    // Apply after listing_category is derived
    if (category) {
      processedListings = processedListings.filter(l => l.listing_category === category);
    }

    // 5. Fetch Media for the current page's listings
    if (processedListings.length > 0) {
      const listingIds = processedListings.map(l => l.listing_id);

      const { data: allMedia, error: mediaError } = await supabase
        .from('listing_media')
        .select('listing_id, url, media_type, sort_order, is_cover')
        .in('listing_id', listingIds)
        .order('sort_order', { ascending: true });

      if (!mediaError && allMedia) {
        // Group media
        const mediaByListingId = {};
        allMedia.forEach(media => {
          if (!mediaByListingId[media.listing_id]) {
            mediaByListingId[media.listing_id] = [];
          }
          mediaByListingId[media.listing_id].push(media);
        });

        // Attach media to listings
        processedListings = processedListings.map(listing => {
          const listingMedia = mediaByListingId[listing.listing_id] || [];
          const sortedMedia = listingMedia.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

          return {
            ...listing,
            images: sortedMedia.map(m => m.url),
            // Clean up internal fields if needed, or keep for debugging
          };
        });
      }
    } else {
      // Ensure empty listings have images array
      processedListings = processedListings.map(l => ({ ...l, images: [] }));
    }

    // 6. Final Transformation (Public Shape)
    const finalItems = processedListings.map(l => ({
      listing_id: l.listing_id,
      url: l.source_url,
      title: l.title,
      price: l.price,
      location: {
        city: l.city,
        district: l.district,
        neighborhood: l.neighborhood
      },
      description: l.description,
      images: l.images || [],
      features: l.features || {},
      created_at: l.created_at,
      category: l.category,
      listing_type: l.listing_type,
      listing_mode: l.listing_mode,
      listing_category: l.listing_category
    }));

    // 7. Return Response with Pagination
    return NextResponse.json({
      items: finalItems,
      pagination: {
        page: 1,
        limit: finalItems.length,
        total: finalItems.length,
        pageCount: 1
      }
    });

  } catch (error) {
    console.error('[API /listings] API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
