import { TourPackage, DestinationInfo } from '../types';

// 4 Curated Hero Background Slides for the spiritual sliding background
export const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Shree Mahakaleshwar Jyotirlinga, Ujjain',
    subtitle: 'Sacred Bhasma Aarti, Mahakal Lok Corridor & Shipra Ram Ghat',
    image: '/hero/slide1.jpg'
  },
  {
    id: 'slide-2',
    title: 'Holy Omkareshwar Jyotirlinga & Narmada River',
    subtitle: 'Divine Island Pilgrimage, Mamleshwar Mahadev & Sacred Boat Ride',
    image: '/hero/slide2.jpg'
  },
  {
    id: 'slide-3',
    title: 'Royal Maheshwar Fort & Sacred Ahilya Ghat',
    subtitle: 'Ahilya Fort, Ahileshwar Mandir, Sahastradhara & Rehwa Handlooms',
    image: '/hero/slide3.jpg'
  },
  {
    id: 'slide-4',
    title: 'Historic Rajwada Palace & Indore City Heritage',
    subtitle: 'Rajwada Palace, Lal Bagh, 56 Dukan & Midnight Sarafa Street Food',
    image: '/hero/slide4.jpg'
  }
];

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-2d1n-ujjain-omkareshwar',
    slug: '2-days-1-night-ujjain-omkareshwar-darshan',
    title: '2 Days 1 Night Divine Ujjain & Omkareshwar Jyotirlinga Darshan',
    tagline: 'Experience sacred Mahakaleshwar Bhasma Aarti, Kaal Bhairav, & Omkareshwar Island on the holy Narmada.',
    duration: '2 Days / 1 Night',
    daysCount: 2,
    nightsCount: 1,
    pricePerPerson: 6499,
    originalPrice: 7999,
    suitableFor: 'Family, Couples, Group of 2 to 6+ Persons',
    badge: 'Most Popular Divine Tour',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Embark on a sacred 2-day pilgrimage across two revered Jyotirlingas in Madhya Pradesh — Shree Mahakaleshwar in Ujjain and Omkareshwar on the holy Narmada River. Includes VIP Darshan facilitation, dedicated comfortable sanitized cab throughout, super deluxe accommodation, authentic meals, and a scenic holy boat ride.',
    highlights: [
      'VIP Darshan assistance at Shree Mahakaleshwar Jyotirlinga (Ujjain)',
      'VIP Darshan at Omkareshwar Jyotirlinga & Mamleshwar Mahadev',
      'Dedicated Chauffeur-Driven Cab for 2 Days (Indore/Ujjain pickup to drop)',
      '1 Night Super Deluxe Hotel stay with AC, geyser, & modern amenities',
      'Scenic Omkareshwar Boat Ride touching 3 major holy ghat spots',
      'All Meals Included: Pure Veg Breakfast, Lunch, and Dinner',
      'Comprehensive temple circuit: Kaal Bhairav, Harsiddhi Shaktipeeth, Ram Ghat & Sandipani Ashram'
    ],
    inclusions: [
      'VIP Darshan facilitation at Mahakaleshwar & Omkareshwar',
      '2 Days dedicated sanitized Cab (Sedan / Ertiga / Innova) with fuel & driver allowance',
      '1 Night stay in Super Deluxe Hotel (Double/Triple sharing as per group)',
      'All meals: 1 Breakfast, 2 Lunches, 1 Dinner (100% Pure Vegetarian Sattvik)',
      'Holy Boat ride in Omkareshwar on Narmada River',
      'All toll taxes, parking fees, interstate road permits, and driver charges',
      '24/7 on-ground assistance by local pilgrimage coordinator'
    ],
    exclusions: [
      'Train or flight tickets to Indore/Ujjain (Available on request)',
      'Special Bhasma Aarti official ticket booking fees (Assistance provided)',
      'Personal expenses, laundry, telephone calls, and camera fees',
      'Any extra sightseeing not mentioned in the confirmed itinerary'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ujjain Divine Temple Circuit & Evening Shipra Aarti',
        subtitle: 'Mahakaleshwar Jyotirlinga & Ancient Holy Shrines',
        places: [
          'Mahakal Mandir (Shree Mahakaleshwar Jyotirlinga & Mahakal Lok)',
          'Sandipani Ashram (Lord Krishna, Balarama & Sudama study hermitage)',
          'Kaal Bhairav Temple (Guardian deity of Ujjain, offering sacred prasad)',
          'Gadhkalika Temple (Ancient Shakti shrine revered by Mahakavi Kalidasa)',
          'Ram Ghat (Holy dip and majestic evening Deep Daan Shipra Aarti)',
          'Harsiddhi Mata Temple (51 Shaktipeeth with illuminated Deepstambhas)',
          'Bada Ganesh Mandir (Historic huge elephant-headed deity)',
          'Bharthari Gufa (Centuries-old meditation caves overlooking Shipra)'
        ],
        description: 'Morning pickup from Indore/Ujjain airport or railway station in a dedicated sanitized cab. Check-in at your super deluxe hotel. Head for holy darshan at Mahakaleshwar Jyotirlinga and explore the magnificent Mahakal Lok Corridor. Visit Sandipani Ashram, sacred Kaal Bhairav temple, Gadhkalika, and Bada Ganesh. In the evening, gather at Ram Ghat for the mesmerizing Shipra River Aarti, followed by lamp lighting at Harsiddhi Mata Shaktipeeth. Return to hotel for delicious dinner.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'Sacred Narmada Island Darshan & Departure',
        places: [
          'Omkareshwar Jyotirlinga (Mandhata Om-shaped island)',
          'Mamleshwar Mahadev (Amareshwar ancient Shiva shrine)',
          'Shani Mandir (Navagraha Shani Dev Temple on Narmada banks)'
        ],
        description: 'Early morning breakfast and checkout from hotel. Drive through scenic Malwa landscapes to the sacred town of Omkareshwar. Board a private boat ride on the sacred Narmada River towards the Omkareshwar temple island. Avail VIP darshan at Omkareshwar Jyotirlinga and cross the footbridge or river to Mamleshwar Mahadev. After heartfelt prayers and visits to Shani Mandir, enjoy traditional lunch. Evening drop-off at Indore or Ujjain Airport/Railway Station with blessed memories.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with drop at Indore/Ujjain'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours before scheduled pickup. 50% refund within 24-48 hours.',
    seoKeywords: ['Ujjain 2 days tour package', 'Mahakaleshwar Omkareshwar package', 'Ujjain darshan cab price', 'Ujjain temple tour 6499', 'Omkareshwar jyotirlinga from Indore'],
    metaDescription: 'Book 2 Days 1 Night Ujjain & Omkareshwar Darshan Package at ₹6,499 per person. Includes Mahakal VIP Darshan, dedicated Cab, Super Deluxe Hotel, and Meals.'
  },
  {
    id: 'pkg-3d2n-ujjain-omkareshwar-indore',
    slug: '3-days-2-nights-ujjain-omkareshwar-maheshwar-tour',
    title: '3 Days 2 Nights Divine Ujjain, Omkareshwar & Maheshwar Heritage Tour',
    tagline: 'Experience the holy Jyotirlingas, Queen Ahilyabai Maheshwar Fort, Narmada boat ride, Sahastradhara, and scenic Jam Gate pass.',
    duration: '3 Days / 2 Nights',
    daysCount: 3,
    nightsCount: 2,
    pricePerPerson: 8499,
    originalPrice: 10499,
    suitableFor: 'Families, Senior Citizens, Devotees, Cultural Explorers, Groups of 2 to 6+ Persons',
    badge: 'Signature Heritage Circuit',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Our flagship 3-day royal pilgrimage covers the sacred Jyotirlingas of Shree Mahakaleshwar and Omkareshwar together with Queen Ahilyabai’s historic capital Maheshwar. Experience iconic destinations: Ahilya Fort, Ahileshwar & Raj Rajeshwar Temples, holy Narmada boat ride, Sahastradhara, authentic Rehwa handloom weaving, and scenic Jam Gate with comfortable chauffeur transfers.',
    highlights: [
      'VIP Darshan at Shree Mahakaleshwar & Omkareshwar Jyotirlinga',
      'Ahilya Fort (Maheshwar Fort) & Royal Holkar Heritage',
      'Ahileshwar & Shri Raj Rajeshwar Temples',
      'Scenic Boat ride in Narmada River & River views at Ahilya Ghat',
      'Rehwa Society Handloom Heritage & authentic Maheshwari saree shopping',
      'Majestic Sahastradhara waterfall & scenic Jam Gate panoramic pass',
      'Indore city orientation: Rajwada Palace & 56 Dukan',
      '3 Days dedicated chauffeur-driven sanitized cab with fuel and all permits',
      '2 Nights Super Deluxe accommodation with all pure veg meals'
    ],
    inclusions: [
      'VVIP / Special Darshan facilitation at Mahakaleshwar & Omkareshwar',
      'Dedicated sanitized Cab for all 3 days (Pickup from Indore/Ujjain, all transfers, drop)',
      '2 Nights accommodation in Super Deluxe AC room',
      'Daily Breakfast, Lunch, and Dinner during the tour (100% Pure Veg)',
      'Scenic Boat ride in Narmada River at Maheshwar & Omkareshwar',
      'All toll taxes, parking fees, state road taxes, and chauffeur allowances',
      'Sightseeing permits and 24/7 dedicated tour manager guidance'
    ],
    exclusions: [
      'Airfare or train tickets to/from Indore or Ujjain',
      'Official Bhasma Aarti reservation fees (assistance provided)',
      'Personal shopping, camera charges, and laundry'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1: Divine Ujjain Mahakal & Sacred Shrines Circuit',
        subtitle: 'Shree Mahakaleshwar Jyotirlinga & Evening Shipra River Aarti',
        places: [
          'Shree Mahakaleshwar Jyotirlinga & Grand Mahakal Lok Corridor',
          'Kaal Bhairav Temple (Guardian deity of Ujjain)',
          'Sandipani Ashram (Lord Krishna’s sacred education hermitage)',
          'Ram Ghat (Holy Shipra dip and grand evening Ganga-style aarti)',
          'Harsiddhi Mata Mandir (Sacred 51 Shaktipeeth with towering deepstambhas)'
        ],
        description: 'Warm welcome at Indore or Ujjain railway station/airport. Head directly for holy VIP Darshan at Shree Mahakaleshwar Jyotirlinga and stroll across the awe-inspiring Mahakal Lok Corridor. Visit sacred Kaal Bhairav, Sandipani Ashram, and the evening Shipra River Aarti at Ram Ghat. Conclude the day with blessings at Harsiddhi Mata Mandir before check-in and delicious dinner at your hotel.',
        mealsIncluded: 'Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Ujjain'
      },
      {
        day: 2,
        title: 'Day 2: Sacred Omkareshwar & Mamleshwar Jyotirlinga Pilgrimage',
        subtitle: 'Narmada Island Darshan, Holy Boat Ride & Shani Mandir',
        places: [
          'Omkareshwar Jyotirlinga (Mandhata Om-shaped island)',
          'Mamleshwar Mahadev (Amareshwar ancient Shiva shrine)',
          'Sacred Narmada River Boat Safari',
          'Shani Mandir (Navagraha shrine on river banks)'
        ],
        description: 'Post breakfast, drive across scenic Malwa landscapes to the holy island Jyotirlinga of Omkareshwar on river Narmada. Board a private boat ride touching sacred river spots. Experience VIP Darshan at Omkareshwar temple and cross over to Mamleshwar Mahadev for peaceful Jalabhishek. Enjoy traditional lunch, visit the serene riverside Shani Mandir, and proceed towards Maheshwar for evening dinner and comfortable overnight stay.',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        stayLocation: 'Super Deluxe Hotel, Maheshwar / Omkareshwar'
      },
      {
        day: 3,
        title: 'Day 3: Royal Maheshwar Fort, Sacred Narmada River Trail & Jam Gate',
        subtitle: 'Queen Ahilyabai Holkar’s Heritage, Temples, Sahastradhara & Jam Gate',
        places: [
          'Ahilya Fort (Maheshwar Fort - Grand Maratha stone citadel)',
          'Ahileshwar & Shri Raj Rajeshwar Temples (Exquisite stone carvings)',
          'Ahilya Ghat (Sacred river views and holy steps)',
          'Rehwa Society (Handloom heritage & authentic Maheshwari weaves)',
          'Boat ride in Narmada River (Serene sacred river cruise)',
          'Sahastradhara (Thousand streams roaring rocky cascade)',
          'Jam Gate (Historic mountain pass with breathtaking panoramic views)'
        ],
        description: 'Begin the morning exploring the magnificent Ahilya Fort (Maheshwar Fort) on the banks of sacred Narmada. Pay homage at the intricately carved Ahileshwar & Shri Raj Rajeshwar Temples, stroll along Ahilya Ghat, and take a peaceful holy boat ride on the river. Visit Rehwa Society to witness legendary Maheshwari weaving. Head to the scenic rock gorge of Sahastradhara and journey through the historic scenic Jam Gate pass. Conclude the tour with comfortable drop-off at Indore Airport / Railway Station.',
        mealsIncluded: 'Breakfast, Lunch',
        stayLocation: 'Tour concludes with evening drop at Indore Airport / Station'
      }
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to journey. Flexible rescheduling without penalty.',
    seoKeywords: [
      '3 days 2 night Ujjain Maheshwar package',
      'Maheshwar Ahilya fort tour',
      'Omkareshwar Ujjain Maheshwar cab package',
      'Jam Gate Sahastradhara tour',
      'Shiv Shakti Tour and Travels Indore Ujjain'
    ],
    metaDescription: 'Complete 3 Days 2 Nights Tour: Ujjain Mahakal, Omkareshwar, Ahilya Fort Maheshwar, Narmada boat ride, Sahastradhara & Jam Gate. Book with Shiv Shakti Tour & Travels.'
  },
  {
    id: 'pkg-1d-ujjain-mahakal-special',
    slug: '1-day-ujjain-mahakal-darshan-day-tour',
    title: '1 Day Complete Ujjain Mahakaleshwar & Local Temples Excursion',
    tagline: 'Ideal for same-day pilgrims starting and returning to Indore or Ujjain with priority temple darshan.',
    duration: '1 Day (12-14 Hours)',
    daysCount: 1,
    nightsCount: 0,
    pricePerPerson: 2499,
    originalPrice: 3200,
    suitableFor: 'Day visitors, corporate travelers, pilgrims with short layover',
    badge: 'Same Day Special',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Short on time? Experience the spiritual energy of Shree Mahakaleshwar Jyotirlinga, Kaal Bhairav, Sandipani Ashram, and the Ram Ghat evening aarti with our punctual, comfortable dedicated sanitized cab service.',
    highlights: [
      'Pickup and drop from Indore Airport / Railway Station or Ujjain',
      'VIP Darshan assistance at Mahakaleshwar & Kaal Bhairav',
      'Dedicated Chauffeur-driven Sedan or SUV with knowledgeable local driver',
      'Evening Shipra River Aarti at Ram Ghat',
      'Pure Veg Lunch included'
    ],
    inclusions: [
      'Dedicated Cab for 12-14 hours including fuel & driver allowances',
      'VIP Darshan guidance at temples',
      'Vegetarian Lunch and bottled water',
      'All toll taxes and parking'
    ],
    exclusions: [
      'Bhasma Aarti entrance slip (prior booking required)',
      'Any personal donations or shopping'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Full Day Ujjain Spiritual Circuit',
        subtitle: 'From Morning Darshan to Evening Shipra Deep Daan',
        places: [
          'Mahakal Mandir (Mahakaleshwar Jyotirlinga)',
          'Kaal Bhairav Temple',
          'Sandipani Ashram',
          'Harsiddhi Mata Mandir',
          'Ram Ghat Aarti'
        ],
        description: 'Morning pickup from Indore/Ujjain. Drive directly to Mahakaleshwar Temple for peaceful darshan. Tour Kaal Bhairav, Sandipani Ashram, and Harsiddhi Mata. Enjoy lunch at a traditional Malwi restaurant. Attend the serene Shipra Aarti at Ram Ghat and return safely to Indore/Ujjain by late evening.',
        mealsIncluded: 'Lunch',
        stayLocation: 'Day tour (No night stay)'
      }
    ],
    cancellationPolicy: 'Full refund if cancelled 24 hours prior to travel date.',
    seoKeywords: ['1 day Ujjain tour from Indore', 'Indore to Ujjain cab tour', 'Same day Mahakal darshan package', 'Ujjain day trip price'],
    metaDescription: '1 Day Ujjain Mahakaleshwar Darshan Package at ₹2,499 per person. Dedicated cab, VIP darshan support, Kaal Bhairav, and Ram Ghat Aarti.'
  }
];

export const DESTINATIONS_DATA: DestinationInfo[] = [
  {
    id: 'ujjain',
    slug: 'ujjain',
    name: 'Ujjain - The Holy City of Mahakal',
    tagline: 'Ancient Avanti, home to Shree Mahakaleshwar Jyotirlinga & the divine Shipra River.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: 'Ujjain is one of Hinduism’s seven sacred Moksha-giving cities (Sapta Puri) and hosts the colossal Simhastha Kumbh Mela every 12 years. Revered for the south-facing Dakshinmukhi Mahakaleshwar Jyotirlinga and the world-famous daily dawn Bhasma Aarti, Ujjain is steeped in Vedic astronomy, classical poetry of Kalidasa, and centuries of spiritual mysticism.',
    topAttractions: [
      {
        name: 'Shree Mahakaleshwar Jyotirlinga & Mahakal Lok',
        description: 'One of the 12 sacred Jyotirlingas, famous for the daily 4:00 AM Bhasma Aarti and the majestic 900-meter Mahakal Lok corridor with grand murals and statues.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '04:00 AM to 11:00 PM'
      },
      {
        name: 'Kaal Bhairav Temple',
        description: 'Fierce guardian deity of Ujjain where liquor and holy prasad are offered as centuries-old Tantric rituals.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:00 PM'
      },
      {
        name: 'Harsiddhi Mata Mandir',
        description: 'Ancient 51 Shaktipeeth where Goddess Sati’s elbow fell; famed for its dual towering stone Deepstambhas lit with thousands of oil lamps.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:30 PM'
      },
      {
        name: 'Ram Ghat & Shipra River',
        description: 'Venerated riverfront ghat where Lord Rama performed sacred rituals; site of evening Deep Daan aarti and holy snan.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        timings: 'Open 24 hours (Aarti: 07:00 PM)'
      }
    ],
    bestTimeToVisit: 'October to March offers pleasant weather. July-August (Shravan month) is spiritually vibrant.',
    howToReach: 'Direct trains to Ujjain Junction (UJN). Nearest airport is Devi Ahilyabai Holkar Airport in Indore (55 km, 1 hour by cab).',
    travelTips: [
      'Book Bhasma Aarti tickets at least 15-30 days in advance on official temple portals or request our tour guide assistance.',
      'Dress code for Garbhagriha Jalabhishek: Traditional Dhoti-Kurta for men and Saree for women.',
      'Keep 1 full day for local temple visits and evening aarti at Ram Ghat.'
    ]
  },
  {
    id: 'indore',
    slug: 'indore',
    name: 'Indore - The Cleanest City & Food Capital of India',
    tagline: 'Historic capital of the Holkars, architectural marvels, and unmatched culinary street adventures.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    description: 'Awarded India’s cleanest city 7 years in a row, Indore blends royal Maratha heritage under Devi Ahilya Bai Holkar with unmatched modern vibrancy. From the 7-story Rajwada Palace and Lal Bagh Palace to midnight street food at Sarafa Bazaar and culinary thrills at 56 Dukan, Indore captivates every traveler.',
    topAttractions: [
      {
        name: 'Rajwada Palace & Sarafa Bazaar',
        description: 'Iconic 200-year-old seven-story palace of the Holkars; neighboring Sarafa transforms into India’s only midnight street food bazaar.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        timings: 'Palace: 10:00 AM - 05:00 PM; Sarafa Food: 08:30 PM - 02:00 AM'
      },
      {
        name: '56 Dukan (Chappan Dukan)',
        description: 'Renowned culinary lane with 56 legendary specialty food stalls serving Johny Hot Dog, Vijay Chaat, Shreemaya sweets, and coconut crush.',
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 11:30 PM'
      },
      {
        name: 'Lal Bagh Palace',
        description: 'Sprawling European-style royal palace with rose gardens, Belgian mirrors, Italian marble, and Buckingham Palace style gates.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '10:00 AM to 05:00 PM (Closed Mondays)'
      },
      {
        name: 'Ranjeet Hanuman & Annapurna Mandir',
        description: 'Two of Central India’s most revered spiritual landmarks attracting thousands of devotees daily.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 10:00 PM'
      }
    ],
    bestTimeToVisit: 'September to March when the climate is cool and evening food strolls are delightful.',
    howToReach: 'Devi Ahilyabai Holkar International Airport (IDR) connects to Mumbai, Delhi, Bengaluru, Dubai, and all major hubs.',
    travelTips: [
      'Never miss early morning Poha-Jalebi at Chappan Dukan and night Garadu / Bhutte ka Kees at Sarafa.',
      'Take our full-day dedicated cab to cover Rajwada, Lal Bagh, Kanch Mandir, and temples comfortably without traffic stress.'
    ]
  },
  {
    id: 'omkareshwar',
    slug: 'omkareshwar',
    name: 'Omkareshwar - The Island Jyotirlinga on Sacred Narmada',
    tagline: 'Revered holy island shaped in the sacred Hindu symbol OM (ॐ), flanked by Mamleshwar Mahadev.',
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    description: 'Located at the confluence of rivers Narmada and Kaveri, Omkareshwar is divided into two major shrines: Omkareshwar on the Mandhata island (Shiva Linga) and Mamleshwar (Amareshwar) on the south mainland bank. Completing darshan of both fulfills the Jyotirlinga pilgrimage.',
    topAttractions: [
      {
        name: 'Omkareshwar Jyotirlinga',
        description: 'Five-story temple complex with intricate carvings on Mandhata Island in the Narmada River.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '05:00 AM to 09:30 PM'
      },
      {
        name: 'Mamleshwar (Amareshwar) Mahadev',
        description: 'Ancient monolithic stone temple on the southern bank dating back to the Paramara period.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '05:30 AM to 09:00 PM'
      },
      {
        name: 'Narmada River Boat Safari & Sangam',
        description: 'Motorized boat ride cruising through river gorges, suspension bridges, and Triveni Sangam.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:00 PM'
      }
    ],
    bestTimeToVisit: 'August to March. River water levels and boating conditions are picturesque.',
    howToReach: '78 km from Indore (approx. 2 hours by dedicated cab) via Khandwa road.',
    travelTips: [
      'Take our package boat ride to avoid long walking queues and access the temple directly from the river landing.',
      'Always visit both Omkareshwar and Mamleshwar temples to complete the divine Jyotirlinga fruit (phala).'
    ]
  },
  {
    id: 'maheshwar-mandu',
    slug: 'maheshwar-mandu',
    name: 'Maheshwar & Mandu (Mandoo) - Royal Forts & Ancient Shrines',
    tagline: 'Ahilya Fort, Narmada Ghats, Jam Gate, Jahaz Mahal & Nilkanth Mahadev.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore the grandeur of Maheshwar, the holy riverside capital of Rajmata Ahilyabai Holkar with Ahilya Fort and exquisite ghats, and the medieval hilltop wonderland of Mandu (Mandoo) featuring the floating Jahaz Mahal and the sacred Nilkanth Mahadev temple.',
    topAttractions: [
      {
        name: 'Ahilya Fort & Ghats (Maheshwar)',
        description: '250-year-old riverside fort overlooking holy Narmada with magnificent stone balconies and cenotaphs.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 07:00 PM'
      },
      {
        name: 'Jahaz Mahal & Hindola Mahal (Mandu)',
        description: 'Fabled Afghan architectural masterwork built like an immense ship floating between two reservoirs.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:00 PM'
      },
      {
        name: 'Rani Roopmati Pavilion & Rewa Kund',
        description: 'High vantage pavilion gazing upon the sacred Narmada plains, built for Rani Roopmati.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 06:30 PM'
      },
      {
        name: 'Nilkanth Mahadev Temple',
        description: 'Historic Shiva temple built inside a grand Mughal stone pavilion with perpetual spring water flowing over the lingam.',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80',
        timings: '06:00 AM to 07:00 PM'
      }
    ],
    bestTimeToVisit: 'Monsoon (July-September) turns Mandu into a lush green heaven; October to March is also wonderful.',
    howToReach: 'Directly covered in our 3 Days 2 Nights Tour Package with dedicated pickup and return to Indore/Ujjain.',
    travelTips: [
      'Shop for authentic world-famous handwoven Maheshwari sarees at Rehwa Society inside the fort.',
      'Stop at Jam Gate for photographs of the Malwa plateau.'
    ]
  }
];

export const AGENCY_INFO = {
  name: 'Shiv Shakti Tour & Travels',
  tagline: 'Your Journey, Our Expertise.',
  phone: '7999 353 101',
  phoneRaw: '7999353101',
  whatsapp: '917999353101',
  email: 'shivshaktitourtravels7999@gmail.com',
  address: 'Shop No. 12, Mahakal Commercial Complex, Near Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456001',
  indoreOffice: '204, Treasure Island Rd, Near Rajwada, Indore, Madhya Pradesh 452001',
  serviceHours: '24 Hours / 7 Days Available',
  rating: 5.0,
  yearsInBusiness: 12,
  completedTrips: '25,000+'
};
