-- UPGRADE SCHEMA FOR ACTIVITIES TABLE
-- Execute this script in your Supabase SQL Editor.

-- 1. Add columns if they do not exist
ALTER TABLE activities ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN DEFAULT FALSE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS is_static BOOLEAN DEFAULT FALSE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS static_id TEXT UNIQUE;

-- Add localized columns for translation
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_fr TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_es TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_de TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_fr TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_es TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_de TEXT;

-- Add new base fields for custom activities
ALTER TABLE activities ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS schedule TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS suitable TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS includes TEXT[] DEFAULT '{}';

-- Add localization columns for new base fields
ALTER TABLE activities ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS subtitle_fr TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS subtitle_es TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS subtitle_de TEXT;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS schedule_en TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS schedule_fr TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS schedule_es TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS schedule_de TEXT;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS suitable_en TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS suitable_fr TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS suitable_es TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS suitable_de TEXT;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS includes_en TEXT[] DEFAULT '{}';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS includes_fr TEXT[] DEFAULT '{}';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS includes_es TEXT[] DEFAULT '{}';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS includes_de TEXT[] DEFAULT '{}';

-- Disable Row-Level Security (RLS) so the admin panel can insert/update activities freely
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- 2. Seed/Sync default activities
-- Tour 1 (Quad Tour)
INSERT INTO activities (
  title, price, description, images, duration, coming_soon, is_static, static_id,
  title_en, title_fr, title_es, title_de,
  description_en, description_fr, description_es, description_de,
  subtitle, subtitle_en, subtitle_fr, subtitle_es, subtitle_de,
  schedule, schedule_en, schedule_fr, schedule_es, schedule_de,
  suitable, suitable_en, suitable_fr, suitable_es, suitable_de,
  includes, includes_en, includes_fr, includes_es, includes_de
)
VALUES (
  'Quad Tour', 
  '$25', 
  'Epic ride through the authentic Agadir Takadt Sahara-style dunes on a powerful Quad bike.', 
  ARRAY['images/QuadAgadir1.JPG', 'images/quadagadir2.JPG', 'images/QuadAgadir3.JPG', 'images/quadagadir4.JPG'],
  '2 Hours',
  FALSE,
  FALSE,
  'tour1',
  'Quad Tour', 'Excursion en Quad', 'Tour en Quad', 'Quad Tour',
  'Epic ride through the authentic Agadir Takadt Sahara-style dunes on a powerful Quad bike.',
  'Balade épique à travers les dunes authentiques de Agadir Takadt sur un Quad puissant.',
  'Paseo épico por las auténticas dunas de Agadir Takadt en un potente Quad.',
  'Epische Fahrt durch die authentischen Agadir Takadt Sahara-Dünen auf einem leistungsstarken Quad.',
  'Dunes & Off-Road', 'Dunes & Off-Road', 'Dunes et Hors-Piste', 'Dunas y Off-Road', 'Dünen & Offroad',
  'Available daily', 'Available daily', 'Disponible tous les jours', 'Disponible todos los días', 'Täglich verfügbar',
  'All levels', 'All levels', 'Tous niveaux', 'Todos los niveles', 'Alle Levels',
  ARRAY['Professional Guide', 'GoPro Video', 'Tea Break', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Professional Guide', 'GoPro Video', 'Tea Break', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Guide Professionnel', 'Vidéo GoPro', 'Pause Thé Traditionnel', 'Prise en charge gratuite à l''hôtel (Zone touristique d''Agadir)'],
  ARRAY['Guía Profesional', 'Video GoPro', 'Pausa de Té', 'Recogida gratuita en el hotel (Zona turística de Agadir)'],
  ARRAY['Professioneller Guide', 'GoPro Video', 'Tee Pause', 'Kostenlose Hotelabholung (Tourismuszone Agadir)']
)
ON CONFLICT (static_id) DO UPDATE SET
  images = CASE WHEN activities.images IS NULL OR cardinality(activities.images) = 0 THEN EXCLUDED.images ELSE activities.images END,
  price = CASE WHEN activities.price IS NULL OR activities.price = '' THEN EXCLUDED.price ELSE activities.price END,
  duration = CASE WHEN activities.duration IS NULL OR activities.duration = '' THEN EXCLUDED.duration ELSE activities.duration END,
  coming_soon = EXCLUDED.coming_soon,
  is_static = EXCLUDED.is_static,
  title = CASE WHEN activities.title IS NULL OR activities.title = '' THEN EXCLUDED.title ELSE activities.title END,
  title_en = CASE WHEN activities.title_en IS NULL OR activities.title_en = '' THEN EXCLUDED.title_en ELSE activities.title_en END,
  title_fr = CASE WHEN activities.title_fr IS NULL OR activities.title_fr = '' THEN EXCLUDED.title_fr ELSE activities.title_fr END,
  title_es = CASE WHEN activities.title_es IS NULL OR activities.title_es = '' THEN EXCLUDED.title_es ELSE activities.title_es END,
  title_de = CASE WHEN activities.title_de IS NULL OR activities.title_de = '' THEN EXCLUDED.title_de ELSE activities.title_de END,
  description = CASE WHEN activities.description IS NULL OR activities.description = '' THEN EXCLUDED.description ELSE activities.description END,
  description_en = CASE WHEN activities.description_en IS NULL OR activities.description_en = '' THEN EXCLUDED.description_en ELSE activities.description_en END,
  description_fr = CASE WHEN activities.description_fr IS NULL OR activities.description_fr = '' THEN EXCLUDED.description_fr ELSE activities.description_fr END,
  description_es = CASE WHEN activities.description_es IS NULL OR activities.description_es = '' THEN EXCLUDED.description_es ELSE activities.description_es END,
  description_de = CASE WHEN activities.description_de IS NULL OR activities.description_de = '' THEN EXCLUDED.description_de ELSE activities.description_de END,
  subtitle = CASE WHEN activities.subtitle IS NULL OR activities.subtitle = '' THEN EXCLUDED.subtitle ELSE activities.subtitle END,
  subtitle_en = CASE WHEN activities.subtitle_en IS NULL OR activities.subtitle_en = '' THEN EXCLUDED.subtitle_en ELSE activities.subtitle_en END,
  subtitle_fr = CASE WHEN activities.subtitle_fr IS NULL OR activities.subtitle_fr = '' THEN EXCLUDED.subtitle_fr ELSE activities.subtitle_fr END,
  subtitle_es = CASE WHEN activities.subtitle_es IS NULL OR activities.subtitle_es = '' THEN EXCLUDED.subtitle_es ELSE activities.subtitle_es END,
  subtitle_de = CASE WHEN activities.subtitle_de IS NULL OR activities.subtitle_de = '' THEN EXCLUDED.subtitle_de ELSE activities.subtitle_de END,
  schedule = CASE WHEN activities.schedule IS NULL OR activities.schedule = '' THEN EXCLUDED.schedule ELSE activities.schedule END,
  schedule_en = CASE WHEN activities.schedule_en IS NULL OR activities.schedule_en = '' THEN EXCLUDED.schedule_en ELSE activities.schedule_en END,
  schedule_fr = CASE WHEN activities.schedule_fr IS NULL OR activities.schedule_fr = '' THEN EXCLUDED.schedule_fr ELSE activities.schedule_fr END,
  schedule_es = CASE WHEN activities.schedule_es IS NULL OR activities.schedule_es = '' THEN EXCLUDED.schedule_es ELSE activities.schedule_es END,
  schedule_de = CASE WHEN activities.schedule_de IS NULL OR activities.schedule_de = '' THEN EXCLUDED.schedule_de ELSE activities.schedule_de END,
  suitable = CASE WHEN activities.suitable IS NULL OR activities.suitable = '' THEN EXCLUDED.suitable ELSE activities.suitable END,
  suitable_en = CASE WHEN activities.suitable_en IS NULL OR activities.suitable_en = '' THEN EXCLUDED.suitable_en ELSE activities.suitable_en END,
  suitable_fr = CASE WHEN activities.suitable_fr IS NULL OR activities.suitable_fr = '' THEN EXCLUDED.suitable_fr ELSE activities.suitable_fr END,
  suitable_es = CASE WHEN activities.suitable_es IS NULL OR activities.suitable_es = '' THEN EXCLUDED.suitable_es ELSE activities.suitable_es END,
  suitable_de = CASE WHEN activities.suitable_de IS NULL OR activities.suitable_de = '' THEN EXCLUDED.suitable_de ELSE activities.suitable_de END,
  includes = CASE WHEN activities.includes IS NULL OR cardinality(activities.includes) = 0 THEN EXCLUDED.includes ELSE activities.includes END,
  includes_en = CASE WHEN activities.includes_en IS NULL OR cardinality(activities.includes_en) = 0 THEN EXCLUDED.includes_en ELSE activities.includes_en END,
  includes_fr = CASE WHEN activities.includes_fr IS NULL OR cardinality(activities.includes_fr) = 0 THEN EXCLUDED.includes_fr ELSE activities.includes_fr END,
  includes_es = CASE WHEN activities.includes_es IS NULL OR cardinality(activities.includes_es) = 0 THEN EXCLUDED.includes_es ELSE activities.includes_es END,
  includes_de = CASE WHEN activities.includes_de IS NULL OR cardinality(activities.includes_de) = 0 THEN EXCLUDED.includes_de ELSE activities.includes_de END;

-- Tour 2 (Buggy Tour)
INSERT INTO activities (
  title, price, description, images, duration, coming_soon, is_static, static_id,
  title_en, title_fr, title_es, title_de,
  description_en, description_fr, description_es, description_de,
  subtitle, subtitle_en, subtitle_fr, subtitle_es, subtitle_de,
  schedule, schedule_en, schedule_fr, schedule_es, schedule_de,
  suitable, suitable_en, suitable_fr, suitable_es, suitable_de,
  includes, includes_en, includes_fr, includes_es, includes_de
)
VALUES (
  'Buggy Tour', 
  '$50', 
  'Experience the thrill of the dunes in our premium two-seater Buggies.', 
  ARRAY['images/buggyAgadir1.JPG', 'images/buggyAgadir2.JPG', 'images/buggyAgadir3.JPG', 'images/buggyAgadir4.JPG', 'images/buggyAgadir5.JPG'],
  '2 Hours',
  FALSE,
  FALSE,
  'tour2',
  'Buggy Tour', 'Excursion en Buggy', 'Tour en Buggy', 'Buggy Tour',
  'Experience the thrill of the dunes in our premium two-seater Buggies.',
  'Vivez le frisson des dunes dans nos Buggys premium à deux places.',
  'Experimenta la emoción de las dunas en nuestros Buggies premium de dos plazas.',
  'Erleben Sie den Nervenkitzel der Dünen in unseren Premium-Zweisitzer-Buggys.',
  'Dunes & Off-Road', 'Dunes & Off-Road', 'Dunes & Off-Road', 'Dunas y Off-Road', 'Dunes & Off-Road',
  'Available daily', 'Available daily', 'Disponible tous les jours', 'Disponible todos los días', 'Täglich verfügbar',
  'Families & friends', 'Families & friends', 'Familles et amis', 'Familias y amigos', 'Familien & Freunde',
  ARRAY['Professional Guide', 'GoPro Video', 'Tea Break', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Professional Guide', 'GoPro Video', 'Tea Break', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Guide Professionnel', 'Vidéo GoPro', 'Pause Thé Traditionnel', 'Prise en charge gratuite à l''hôtel (Zone touristique d''Agadir)'],
  ARRAY['Guía Profesional', 'Video GoPro', 'Pausa de Té', 'Recogida gratuita en el hotel (Zona turística de Agadir)'],
  ARRAY['Professioneller Guide', 'GoPro Video', 'Tee Pause', 'Kostenlose Hotelabholung (Tourismuszone Agadir)']
)
ON CONFLICT (static_id) DO UPDATE SET
  images = CASE WHEN activities.images IS NULL OR cardinality(activities.images) = 0 THEN EXCLUDED.images ELSE activities.images END,
  price = CASE WHEN activities.price IS NULL OR activities.price = '' THEN EXCLUDED.price ELSE activities.price END,
  duration = CASE WHEN activities.duration IS NULL OR activities.duration = '' THEN EXCLUDED.duration ELSE activities.duration END,
  coming_soon = EXCLUDED.coming_soon,
  is_static = EXCLUDED.is_static,
  title = CASE WHEN activities.title IS NULL OR activities.title = '' THEN EXCLUDED.title ELSE activities.title END,
  title_en = CASE WHEN activities.title_en IS NULL OR activities.title_en = '' THEN EXCLUDED.title_en ELSE activities.title_en END,
  title_fr = CASE WHEN activities.title_fr IS NULL OR activities.title_fr = '' THEN EXCLUDED.title_fr ELSE activities.title_fr END,
  title_es = CASE WHEN activities.title_es IS NULL OR activities.title_es = '' THEN EXCLUDED.title_es ELSE activities.title_es END,
  title_de = CASE WHEN activities.title_de IS NULL OR activities.title_de = '' THEN EXCLUDED.title_de ELSE activities.title_de END,
  description = CASE WHEN activities.description IS NULL OR activities.description = '' THEN EXCLUDED.description ELSE activities.description END,
  description_en = CASE WHEN activities.description_en IS NULL OR activities.description_en = '' THEN EXCLUDED.description_en ELSE activities.description_en END,
  description_fr = CASE WHEN activities.description_fr IS NULL OR activities.description_fr = '' THEN EXCLUDED.description_fr ELSE activities.description_fr END,
  description_es = CASE WHEN activities.description_es IS NULL OR activities.description_es = '' THEN EXCLUDED.description_es ELSE activities.description_es END,
  description_de = CASE WHEN activities.description_de IS NULL OR activities.description_de = '' THEN EXCLUDED.description_de ELSE activities.description_de END,
  subtitle = CASE WHEN activities.subtitle IS NULL OR activities.subtitle = '' THEN EXCLUDED.subtitle ELSE activities.subtitle END,
  subtitle_en = CASE WHEN activities.subtitle_en IS NULL OR activities.subtitle_en = '' THEN EXCLUDED.subtitle_en ELSE activities.subtitle_en END,
  subtitle_fr = CASE WHEN activities.subtitle_fr IS NULL OR activities.subtitle_fr = '' THEN EXCLUDED.subtitle_fr ELSE activities.subtitle_fr END,
  subtitle_es = CASE WHEN activities.subtitle_es IS NULL OR activities.subtitle_es = '' THEN EXCLUDED.subtitle_es ELSE activities.subtitle_es END,
  subtitle_de = CASE WHEN activities.subtitle_de IS NULL OR activities.subtitle_de = '' THEN EXCLUDED.subtitle_de ELSE activities.subtitle_de END,
  schedule = CASE WHEN activities.schedule IS NULL OR activities.schedule = '' THEN EXCLUDED.schedule ELSE activities.schedule END,
  schedule_en = CASE WHEN activities.schedule_en IS NULL OR activities.schedule_en = '' THEN EXCLUDED.schedule_en ELSE activities.schedule_en END,
  schedule_fr = CASE WHEN activities.schedule_fr IS NULL OR activities.schedule_fr = '' THEN EXCLUDED.schedule_fr ELSE activities.schedule_fr END,
  schedule_es = CASE WHEN activities.schedule_es IS NULL OR activities.schedule_es = '' THEN EXCLUDED.schedule_es ELSE activities.schedule_es END,
  schedule_de = CASE WHEN activities.schedule_de IS NULL OR activities.schedule_de = '' THEN EXCLUDED.schedule_de ELSE activities.schedule_de END,
  suitable = CASE WHEN activities.suitable IS NULL OR activities.suitable = '' THEN EXCLUDED.suitable ELSE activities.suitable END,
  suitable_en = CASE WHEN activities.suitable_en IS NULL OR activities.suitable_en = '' THEN EXCLUDED.suitable_en ELSE activities.suitable_en END,
  suitable_fr = CASE WHEN activities.suitable_fr IS NULL OR activities.suitable_fr = '' THEN EXCLUDED.suitable_fr ELSE activities.suitable_fr END,
  suitable_es = CASE WHEN activities.suitable_es IS NULL OR activities.suitable_es = '' THEN EXCLUDED.suitable_es ELSE activities.suitable_es END,
  suitable_de = CASE WHEN activities.suitable_de IS NULL OR activities.suitable_de = '' THEN EXCLUDED.suitable_de ELSE activities.suitable_de END,
  includes = CASE WHEN activities.includes IS NULL OR cardinality(activities.includes) = 0 THEN EXCLUDED.includes ELSE activities.includes END,
  includes_en = CASE WHEN activities.includes_en IS NULL OR cardinality(activities.includes_en) = 0 THEN EXCLUDED.includes_en ELSE activities.includes_en END,
  includes_fr = CASE WHEN activities.includes_fr IS NULL OR cardinality(activities.includes_fr) = 0 THEN EXCLUDED.includes_fr ELSE activities.includes_fr END,
  includes_es = CASE WHEN activities.includes_es IS NULL OR cardinality(activities.includes_es) = 0 THEN EXCLUDED.includes_es ELSE activities.includes_es END,
  includes_de = CASE WHEN activities.includes_de IS NULL OR cardinality(activities.includes_de) = 0 THEN EXCLUDED.includes_de ELSE activities.includes_de END;

-- Tour 3 (Gnawa Dinners)
INSERT INTO activities (
  title, price, description, images, duration, coming_soon, is_static, static_id,
  title_en, title_fr, title_es, title_de,
  description_en, description_fr, description_es, description_de,
  subtitle, subtitle_en, subtitle_fr, subtitle_es, subtitle_de,
  schedule, schedule_en, schedule_fr, schedule_es, schedule_de,
  suitable, suitable_en, suitable_fr, suitable_es, suitable_de,
  includes, includes_en, includes_fr, includes_es, includes_de
)
VALUES (
  'Moroccan Nights & Gnawa Dinners', 
  '', 
  'Traditional dinners (Tajine, Couscous) under Sahara tents with live Gnawa musicians.', 
  ARRAY['images/Gnawa/GnawaEvent1.png', 'images/Gnawa/GnawaEvent2.png', 'images/Gnawa/GnawaEvent3.png', 'images/Gnawa/GnawaEvent4.png', 'images/Gnawa/GnawaEvent5.png', 'images/Gnawa/GnawaEvent6.jpg', 'images/Gnawa/GnawaEvent7.jpg'],
  '',
  FALSE,
  FALSE,
  'tour3',
  'Moroccan Nights & Gnawa Dinners', 'Nuits Marocaines & Dîners Gnawa', 'Noches Marroquíes y Cenas Gnawa', 'Marokkanische Nächte & Gnawa',
  'Traditional dinners (Tajine, Couscous) under Sahara tents with live Gnawa musicians.',
  'Dîners traditionnels (Tajine, Couscous) sous des tentes sahariennes avec des musiciens Gnawa en direct.',
  'Cenas tradicionales bajo carpas saharianas con músicos Gnawa en vivo.',
  'Traditionelles Abendessen unter Sahara-Zelten mit Live-Musik.',
  'Cultural Experience', 'Cultural Experience', 'Expérience Culturelle', 'Experiencia Cultural', 'Kulturelles Erlebnis',
  'Evening', 'Evening', 'En soirée', 'Por la noche', 'Abends',
  'Couples, Families', 'Couples, Families', 'Couples, Familles', 'Parejas, Familias', 'Paare, Familien',
  ARRAY['Dinner', 'Live Music', 'Night Desert Vibe', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Dinner', 'Live Music', 'Night Desert Vibe', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Dîner', 'Musique Live', 'Ambiance du Désert de Nuit', 'Prise en charge gratuite à l''hôtel (Zone touristique d''Agadir)'],
  ARRAY['Cena', 'Música en Vivo', 'Ambiente del Desierto', 'Recogida gratuita en el hotel (Zona turística de Agadir)'],
  ARRAY['Abendessen', 'Live Musik', 'Nacht-Wüstenflair', 'Kostenlose Hotelabholung (Tourismuszone Agadir)']
)
ON CONFLICT (static_id) DO UPDATE SET
  images = CASE WHEN activities.images IS NULL OR cardinality(activities.images) = 0 THEN EXCLUDED.images ELSE activities.images END,
  price = CASE WHEN activities.price IS NULL OR activities.price = '' THEN EXCLUDED.price ELSE activities.price END,
  duration = CASE WHEN activities.duration IS NULL OR activities.duration = '' THEN EXCLUDED.duration ELSE activities.duration END,
  coming_soon = EXCLUDED.coming_soon,
  is_static = EXCLUDED.is_static,
  title = CASE WHEN activities.title IS NULL OR activities.title = '' THEN EXCLUDED.title ELSE activities.title END,
  title_en = CASE WHEN activities.title_en IS NULL OR activities.title_en = '' THEN EXCLUDED.title_en ELSE activities.title_en END,
  title_fr = CASE WHEN activities.title_fr IS NULL OR activities.title_fr = '' THEN EXCLUDED.title_fr ELSE activities.title_fr END,
  title_es = CASE WHEN activities.title_es IS NULL OR activities.title_es = '' THEN EXCLUDED.title_es ELSE activities.title_es END,
  title_de = CASE WHEN activities.title_de IS NULL OR activities.title_de = '' THEN EXCLUDED.title_de ELSE activities.title_de END,
  description = CASE WHEN activities.description IS NULL OR activities.description = '' THEN EXCLUDED.description ELSE activities.description END,
  description_en = CASE WHEN activities.description_en IS NULL OR activities.description_en = '' THEN EXCLUDED.description_en ELSE activities.description_en END,
  description_fr = CASE WHEN activities.description_fr IS NULL OR activities.description_fr = '' THEN EXCLUDED.description_fr ELSE activities.description_fr END,
  description_es = CASE WHEN activities.description_es IS NULL OR activities.description_es = '' THEN EXCLUDED.description_es ELSE activities.description_es END,
  description_de = CASE WHEN activities.description_de IS NULL OR activities.description_de = '' THEN EXCLUDED.description_de ELSE activities.description_de END,
  subtitle = CASE WHEN activities.subtitle IS NULL OR activities.subtitle = '' THEN EXCLUDED.subtitle ELSE activities.subtitle END,
  subtitle_en = CASE WHEN activities.subtitle_en IS NULL OR activities.subtitle_en = '' THEN EXCLUDED.subtitle_en ELSE activities.subtitle_en END,
  subtitle_fr = CASE WHEN activities.subtitle_fr IS NULL OR activities.subtitle_fr = '' THEN EXCLUDED.subtitle_fr ELSE activities.subtitle_fr END,
  subtitle_es = CASE WHEN activities.subtitle_es IS NULL OR activities.subtitle_es = '' THEN EXCLUDED.subtitle_es ELSE activities.subtitle_es END,
  subtitle_de = CASE WHEN activities.subtitle_de IS NULL OR activities.subtitle_de = '' THEN EXCLUDED.subtitle_de ELSE activities.subtitle_de END,
  schedule = CASE WHEN activities.schedule IS NULL OR activities.schedule = '' THEN EXCLUDED.schedule ELSE activities.schedule END,
  schedule_en = CASE WHEN activities.schedule_en IS NULL OR activities.schedule_en = '' THEN EXCLUDED.schedule_en ELSE activities.schedule_en END,
  schedule_fr = CASE WHEN activities.schedule_fr IS NULL OR activities.schedule_fr = '' THEN EXCLUDED.schedule_fr ELSE activities.schedule_fr END,
  schedule_es = CASE WHEN activities.schedule_es IS NULL OR activities.schedule_es = '' THEN EXCLUDED.schedule_es ELSE activities.schedule_es END,
  schedule_de = CASE WHEN activities.schedule_de IS NULL OR activities.schedule_de = '' THEN EXCLUDED.schedule_de ELSE activities.schedule_de END,
  suitable = CASE WHEN activities.suitable IS NULL OR activities.suitable = '' THEN EXCLUDED.suitable ELSE activities.suitable END,
  suitable_en = CASE WHEN activities.suitable_en IS NULL OR activities.suitable_en = '' THEN EXCLUDED.suitable_en ELSE activities.suitable_en END,
  suitable_fr = CASE WHEN activities.suitable_fr IS NULL OR activities.suitable_fr = '' THEN EXCLUDED.suitable_fr ELSE activities.suitable_fr END,
  suitable_es = CASE WHEN activities.suitable_es IS NULL OR activities.suitable_es = '' THEN EXCLUDED.suitable_es ELSE activities.suitable_es END,
  suitable_de = CASE WHEN activities.suitable_de IS NULL OR activities.suitable_de = '' THEN EXCLUDED.suitable_de ELSE activities.suitable_de END,
  includes = CASE WHEN activities.includes IS NULL OR cardinality(activities.includes) = 0 THEN EXCLUDED.includes ELSE activities.includes END,
  includes_en = CASE WHEN activities.includes_en IS NULL OR cardinality(activities.includes_en) = 0 THEN EXCLUDED.includes_en ELSE activities.includes_en END,
  includes_fr = CASE WHEN activities.includes_fr IS NULL OR cardinality(activities.includes_fr) = 0 THEN EXCLUDED.includes_fr ELSE activities.includes_fr END,
  includes_es = CASE WHEN activities.includes_es IS NULL OR cardinality(activities.includes_es) = 0 THEN EXCLUDED.includes_es ELSE activities.includes_es END,
  includes_de = CASE WHEN activities.includes_de IS NULL OR cardinality(activities.includes_de) = 0 THEN EXCLUDED.includes_de ELSE activities.includes_de END;

-- Tour 4 (Overnight Stays)
INSERT INTO activities (
  title, price, description, images, duration, coming_soon, is_static, static_id,
  title_en, title_fr, title_es, title_de,
  description_en, description_fr, description_es, description_de,
  subtitle, subtitle_en, subtitle_fr, subtitle_es, subtitle_de,
  schedule, schedule_en, schedule_fr, schedule_es, schedule_de,
  suitable, suitable_en, suitable_fr, suitable_es, suitable_de,
  includes, includes_en, includes_fr, includes_es, includes_de
)
VALUES (
  'Overnight Stays', 
  '', 
  'Beautiful private desert rooms, strictly reserved for families to maintain a safe, high-end atmosphere.', 
  ARRAY['images/quadAgadirNight/AgadirNight1.JPG', 'images/quadAgadirNight/AgadirNight2.JPG'],
  'Full Day',
  TRUE,
  FALSE,
  'tour4',
  'Overnight Stays', 'Séjours d''une Nuit', 'Alojamiento Nocturno', 'Übernachtungen',
  'Beautiful private desert rooms, strictly reserved for families to maintain a safe, high-end atmosphere.',
  'De magnifiques chambres privées dans le désert, strictement réservées aux familles pour maintenir une atmosphère sûre et haut de gamme.',
  'Hermosas habitaciones privadas en el desierto, reservadas estrictamente para familias.',
  'Wunderschöne private Wüstenzimmer, streng für Familien reserviert.',
  'Families-Only', 'Families-Only', 'Réservé aux Familles', 'Solo para Familias', 'Nur für Familien',
  'Overnight', 'Overnight', 'Une nuit', 'Una noche', 'Eine Nacht',
  'Families only', 'Families only', 'Familles uniquement', 'Solo familias', 'Nur Familien',
  ARRAY['Private Room', 'Dinner & Breakfast', 'Desert Sunrise', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Private Room', 'Dinner & Breakfast', 'Desert Sunrise', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Chambre Privée', 'Dîner et Petit-Déjeuner', 'Lever de Soleil dans le Désert', 'Prise en charge gratuite à l''hôtel (Zone touristique d''Agadir)'],
  ARRAY['Habitación Privada', 'Cena y Desayuno', 'Amanecer en el Desierto', 'Recogida gratuita en el hotel (Zona turística de Agadir)'],
  ARRAY['Privatzimmer', 'Abendessen & Frühstück', 'Sonnenaufgang', 'Kostenlose Hotelabholung (Tourismuszone Agadir)']
)
ON CONFLICT (static_id) DO UPDATE SET
  images = CASE WHEN activities.images IS NULL OR cardinality(activities.images) = 0 THEN EXCLUDED.images ELSE activities.images END,
  price = CASE WHEN activities.price IS NULL OR activities.price = '' THEN EXCLUDED.price ELSE activities.price END,
  duration = CASE WHEN activities.duration IS NULL OR activities.duration = '' THEN EXCLUDED.duration ELSE activities.duration END,
  coming_soon = EXCLUDED.coming_soon,
  is_static = EXCLUDED.is_static,
  title = CASE WHEN activities.title IS NULL OR activities.title = '' THEN EXCLUDED.title ELSE activities.title END,
  title_en = CASE WHEN activities.title_en IS NULL OR activities.title_en = '' THEN EXCLUDED.title_en ELSE activities.title_en END,
  title_fr = CASE WHEN activities.title_fr IS NULL OR activities.title_fr = '' THEN EXCLUDED.title_fr ELSE activities.title_fr END,
  title_es = CASE WHEN activities.title_es IS NULL OR activities.title_es = '' THEN EXCLUDED.title_es ELSE activities.title_es END,
  title_de = CASE WHEN activities.title_de IS NULL OR activities.title_de = '' THEN EXCLUDED.title_de ELSE activities.title_de END,
  description = CASE WHEN activities.description IS NULL OR activities.description = '' THEN EXCLUDED.description ELSE activities.description END,
  description_en = CASE WHEN activities.description_en IS NULL OR activities.description_en = '' THEN EXCLUDED.description_en ELSE activities.description_en END,
  description_fr = CASE WHEN activities.description_fr IS NULL OR activities.description_fr = '' THEN EXCLUDED.description_fr ELSE activities.description_fr END,
  description_es = CASE WHEN activities.description_es IS NULL OR activities.description_es = '' THEN EXCLUDED.description_es ELSE activities.description_es END,
  description_de = CASE WHEN activities.description_de IS NULL OR activities.description_de = '' THEN EXCLUDED.description_de ELSE activities.description_de END,
  subtitle = CASE WHEN activities.subtitle IS NULL OR activities.subtitle = '' THEN EXCLUDED.subtitle ELSE activities.subtitle END,
  subtitle_en = CASE WHEN activities.subtitle_en IS NULL OR activities.subtitle_en = '' THEN EXCLUDED.subtitle_en ELSE activities.subtitle_en END,
  subtitle_fr = CASE WHEN activities.subtitle_fr IS NULL OR activities.subtitle_fr = '' THEN EXCLUDED.subtitle_fr ELSE activities.subtitle_fr END,
  subtitle_es = CASE WHEN activities.subtitle_es IS NULL OR activities.subtitle_es = '' THEN EXCLUDED.subtitle_es ELSE activities.subtitle_es END,
  subtitle_de = CASE WHEN activities.subtitle_de IS NULL OR activities.subtitle_de = '' THEN EXCLUDED.subtitle_de ELSE activities.subtitle_de END,
  schedule = CASE WHEN activities.schedule IS NULL OR activities.schedule = '' THEN EXCLUDED.schedule ELSE activities.schedule END,
  schedule_en = CASE WHEN activities.schedule_en IS NULL OR activities.schedule_en = '' THEN EXCLUDED.schedule_en ELSE activities.schedule_en END,
  schedule_fr = CASE WHEN activities.schedule_fr IS NULL OR activities.schedule_fr = '' THEN EXCLUDED.schedule_fr ELSE activities.schedule_fr END,
  schedule_es = CASE WHEN activities.schedule_es IS NULL OR activities.schedule_es = '' THEN EXCLUDED.schedule_es ELSE activities.schedule_es END,
  schedule_de = CASE WHEN activities.schedule_de IS NULL OR activities.schedule_de = '' THEN EXCLUDED.schedule_de ELSE activities.schedule_de END,
  suitable = CASE WHEN activities.suitable IS NULL OR activities.suitable = '' THEN EXCLUDED.suitable ELSE activities.suitable END,
  suitable_en = CASE WHEN activities.suitable_en IS NULL OR activities.suitable_en = '' THEN EXCLUDED.suitable_en ELSE activities.suitable_en END,
  suitable_fr = CASE WHEN activities.suitable_fr IS NULL OR activities.suitable_fr = '' THEN EXCLUDED.suitable_fr ELSE activities.suitable_fr END,
  suitable_es = CASE WHEN activities.suitable_es IS NULL OR activities.suitable_es = '' THEN EXCLUDED.suitable_es ELSE activities.suitable_es END,
  suitable_de = CASE WHEN activities.suitable_de IS NULL OR activities.suitable_de = '' THEN EXCLUDED.suitable_de ELSE activities.suitable_de END,
  includes = CASE WHEN activities.includes IS NULL OR cardinality(activities.includes) = 0 THEN EXCLUDED.includes ELSE activities.includes END,
  includes_en = CASE WHEN activities.includes_en IS NULL OR cardinality(activities.includes_en) = 0 THEN EXCLUDED.includes_en ELSE activities.includes_en END,
  includes_fr = CASE WHEN activities.includes_fr IS NULL OR cardinality(activities.includes_fr) = 0 THEN EXCLUDED.includes_fr ELSE activities.includes_fr END,
  includes_es = CASE WHEN activities.includes_es IS NULL OR cardinality(activities.includes_es) = 0 THEN EXCLUDED.includes_es ELSE activities.includes_es END,
  includes_de = CASE WHEN activities.includes_de IS NULL OR cardinality(activities.includes_de) = 0 THEN EXCLUDED.includes_de ELSE activities.includes_de END;

-- Tour 5 (Full Day Excursion)
INSERT INTO activities (
  title, price, description, images, duration, coming_soon, is_static, static_id,
  title_en, title_fr, title_es, title_de,
  description_en, description_fr, description_es, description_de,
  subtitle, subtitle_en, subtitle_fr, subtitle_es, subtitle_de,
  schedule, schedule_en, schedule_fr, schedule_es, schedule_de,
  suitable, suitable_en, suitable_fr, suitable_es, suitable_de,
  includes, includes_en, includes_fr, includes_es, includes_de
)
VALUES (
  'Full Day Excursion Takadt to Massa', 
  '', 
  'An unforgettable full-day adventure starting with morning preparations at 10 AM and concluding at 5 PM. Explore the breathtaking route from Takadt to Massa.', 
  ARRAY['images/AgadirTour/AgadirTour1.jpg', 'images/AgadirTour/AgadirTour2.jpg', 'images/AgadirTour/AgadirTour3.jpg', 'images/AgadirTour/AgadirTour4.jpg', 'images/AgadirTour/AgadirTour5.jpg', 'images/AgadirTour/AgadirTour6.jpg', 'images/AgadirTour/AgadirTour7.jpg', 'images/AgadirTour/AgadirTour8.jpg', 'images/AgadirTour/AgadirTour9.jpg', 'images/AgadirTour/AgadirTour10.jpg', 'images/AgadirTour/AgadirTour11.jpg'],
  '10:00 AM - 05:00 PM',
  FALSE,
  FALSE,
  'tour5',
  'Full Day Excursion Takadt to Massa', 'Excursion d''une journée de Takadt à Massa', 'Excursión de día completo de Takadt a Massa', 'Ganztagesausflug von Takadt nach Massa',
  'An unforgettable full-day adventure starting with morning preparations at 10 AM and concluding at 5 PM. Explore the breathtaking route from Takadt to Massa.',
  'Une aventure inoubliable d''une journée entière commençant par les préparatifs matinaux à 10h00 et se terminant à 17h00. Explorez la route à couper le souffle de Takadt à Massa.',
  'Una aventura inolvidable de día completo que comienza con los preparativos de la mañana a las 10 a.m. y concluye a las 5 p.m. Explora la impresionante ruta de Takadt a Massa.',
  'Ein unvergessliches Ganztagesabenteuer, beginnend mit den morgendlichen Vorbereitungen um 10:00 Uhr und endend um 17:00 Uhr. Erkunden Sie die atemberaubende Route von Takadt nach Massa.',
  'Elite Expedition', 'Elite Expedition', 'Expédition d''élite', 'Expedición de élite', 'Elite-Expedition',
  '10:00 AM - 05:00 PM', '10:00 AM - 05:00 PM', '10:00 - 17:00', '10:00 - 17:00', '10:00 - 17:00',
  'Adventure seekers', 'Adventure seekers', 'Amateurs d''aventure', 'Amantes de la aventura', 'Abenteuerliebhaber',
  ARRAY['Food Included', 'Professional Filming', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Food Included', 'Professional Filming', 'Free Hotel Pickup (Agadir Tourist Zone)'],
  ARRAY['Nourriture Inclus', 'Tournage Professionnel', 'Prise en charge gratuite à l''hôtel (Zone touristique d''Agadir)'],
  ARRAY['Comida Incluida', 'Grabación Profesional', 'Recogida gratuita en el hotel (Zona turística de Agadir)'],
  ARRAY['Essen Inklusive', 'Professionelle Filmaufnahmen', 'Kostenlose Hotelabholung (Tourismuszone Agadir)']
)
ON CONFLICT (static_id) DO UPDATE SET
  images = CASE WHEN activities.images IS NULL OR cardinality(activities.images) = 0 THEN EXCLUDED.images ELSE activities.images END,
  price = CASE WHEN activities.price IS NULL OR activities.price = '' THEN EXCLUDED.price ELSE activities.price END,
  duration = CASE WHEN activities.duration IS NULL OR activities.duration = '' THEN EXCLUDED.duration ELSE activities.duration END,
  coming_soon = EXCLUDED.coming_soon,
  is_static = EXCLUDED.is_static,
  title = CASE WHEN activities.title IS NULL OR activities.title = '' THEN EXCLUDED.title ELSE activities.title END,
  title_en = CASE WHEN activities.title_en IS NULL OR activities.title_en = '' THEN EXCLUDED.title_en ELSE activities.title_en END,
  title_fr = CASE WHEN activities.title_fr IS NULL OR activities.title_fr = '' THEN EXCLUDED.title_fr ELSE activities.title_fr END,
  title_es = CASE WHEN activities.title_es IS NULL OR activities.title_es = '' THEN EXCLUDED.title_es ELSE activities.title_es END,
  title_de = CASE WHEN activities.title_de IS NULL OR activities.title_de = '' THEN EXCLUDED.title_de ELSE activities.title_de END,
  description = CASE WHEN activities.description IS NULL OR activities.description = '' THEN EXCLUDED.description ELSE activities.description END,
  description_en = CASE WHEN activities.description_en IS NULL OR activities.description_en = '' THEN EXCLUDED.description_en ELSE activities.description_en END,
  description_fr = CASE WHEN activities.description_fr IS NULL OR activities.description_fr = '' THEN EXCLUDED.description_fr ELSE activities.description_fr END,
  description_es = CASE WHEN activities.description_es IS NULL OR activities.description_es = '' THEN EXCLUDED.description_es ELSE activities.description_es END,
  description_de = CASE WHEN activities.description_de IS NULL OR activities.description_de = '' THEN EXCLUDED.description_de ELSE activities.description_de END,
  subtitle = CASE WHEN activities.subtitle IS NULL OR activities.subtitle = '' THEN EXCLUDED.subtitle ELSE activities.subtitle END,
  subtitle_en = CASE WHEN activities.subtitle_en IS NULL OR activities.subtitle_en = '' THEN EXCLUDED.subtitle_en ELSE activities.subtitle_en END,
  subtitle_fr = CASE WHEN activities.subtitle_fr IS NULL OR activities.subtitle_fr = '' THEN EXCLUDED.subtitle_fr ELSE activities.subtitle_fr END,
  subtitle_es = CASE WHEN activities.subtitle_es IS NULL OR activities.subtitle_es = '' THEN EXCLUDED.subtitle_es ELSE activities.subtitle_es END,
  subtitle_de = CASE WHEN activities.subtitle_de IS NULL OR activities.subtitle_de = '' THEN EXCLUDED.subtitle_de ELSE activities.subtitle_de END,
  schedule = CASE WHEN activities.schedule IS NULL OR activities.schedule = '' THEN EXCLUDED.schedule ELSE activities.schedule END,
  schedule_en = CASE WHEN activities.schedule_en IS NULL OR activities.schedule_en = '' THEN EXCLUDED.schedule_en ELSE activities.schedule_en END,
  schedule_fr = CASE WHEN activities.schedule_fr IS NULL OR activities.schedule_fr = '' THEN EXCLUDED.schedule_fr ELSE activities.schedule_fr END,
  schedule_es = CASE WHEN activities.schedule_es IS NULL OR activities.schedule_es = '' THEN EXCLUDED.schedule_es ELSE activities.schedule_es END,
  schedule_de = CASE WHEN activities.schedule_de IS NULL OR activities.schedule_de = '' THEN EXCLUDED.schedule_de ELSE activities.schedule_de END,
  suitable = CASE WHEN activities.suitable IS NULL OR activities.suitable = '' THEN EXCLUDED.suitable ELSE activities.suitable END,
  suitable_en = CASE WHEN activities.suitable_en IS NULL OR activities.suitable_en = '' THEN EXCLUDED.suitable_en ELSE activities.suitable_en END,
  suitable_fr = CASE WHEN activities.suitable_fr IS NULL OR activities.suitable_fr = '' THEN EXCLUDED.suitable_fr ELSE activities.suitable_fr END,
  suitable_es = CASE WHEN activities.suitable_es IS NULL OR activities.suitable_es = '' THEN EXCLUDED.suitable_es ELSE activities.suitable_es END,
  suitable_de = CASE WHEN activities.suitable_de IS NULL OR activities.suitable_de = '' THEN EXCLUDED.suitable_de ELSE activities.suitable_de END,
  includes = CASE WHEN activities.includes IS NULL OR cardinality(activities.includes) = 0 THEN EXCLUDED.includes ELSE activities.includes END,
  includes_en = CASE WHEN activities.includes_en IS NULL OR cardinality(activities.includes_en) = 0 THEN EXCLUDED.includes_en ELSE activities.includes_en END,
  includes_fr = CASE WHEN activities.includes_fr IS NULL OR cardinality(activities.includes_fr) = 0 THEN EXCLUDED.includes_fr ELSE activities.includes_fr END,
  includes_es = CASE WHEN activities.includes_es IS NULL OR cardinality(activities.includes_es) = 0 THEN EXCLUDED.includes_es ELSE activities.includes_es END,
  includes_de = CASE WHEN activities.includes_de IS NULL OR cardinality(activities.includes_de) = 0 THEN EXCLUDED.includes_de ELSE activities.includes_de END;

-- Force reload the schema cache so PostgREST picks up the new columns immediately
NOTIFY pgrst, 'reload schema';

-- STORAGE BUCKETS SETUP (Commented out to avoid table ownership errors in SQL editor)
-- If you need to create the 'activities' bucket, you can do it directly in the Supabase Storage dashboard.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('activities', 'activities', true) ON CONFLICT (id) DO NOTHING;
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public Access" ON storage.objects;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'activities');
-- DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
-- CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'activities');
-- DROP POLICY IF EXISTS "Public Deletes" ON storage.objects;
-- CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'activities');
