-- MIGRATION FOR DASHBOARD EXTENSIONS (RESERVATIONS, REVIEWS, FAQS, SETTINGS)
-- Execute this script in your Supabase SQL Editor.

-- 1. Create Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  activity TEXT NOT NULL,
  persons INTEGER NOT NULL,
  num_quads INTEGER DEFAULT 0,
  num_buggies INTEGER DEFAULT 0,
  total_price TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  text TEXT NOT NULL,
  text_en TEXT,
  text_fr TEXT,
  text_es TEXT,
  text_de TEXT,
  rating INTEGER DEFAULT 5,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  q_en TEXT,
  q_fr TEXT,
  q_es TEXT,
  q_de TEXT,
  a_en TEXT,
  a_fr TEXT,
  a_es TEXT,
  a_de TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable Row Level Security (RLS) so public/admin clients can access freely
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 5. Seed Default Settings
INSERT INTO settings (key, value)
VALUES 
  ('phone_number', '212661374773'),
  ('site_title', 'Land of Sand and Adventures'),
  ('site_description', 'Experience the best desert adventure in Agadir with Quad Biking, Buggy Riding, Massa off-road tours, and overnight stays.')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

-- 6. Seed Initial Reviews (English equivalents)
INSERT INTO reviews (name, date, text, text_en, text_fr, text_es, text_de, rating, is_visible)
VALUES
  ('Sarah L.', 'May 2026', 'Amazing quad tour! The dunes of Takadt were beautiful, and our guide was friendly and safe. Highly recommend for families!', 'Amazing quad tour! The dunes of Takadt were beautiful, and our guide was friendly and safe. Highly recommend for families!', 'Super circuit en quad ! Les dunes de Takadt étaient magnifiques, notre guide était amical et prudent. Hautement recommandé pour les familles !', '¡Increíble recorrido en quad! Las dunas de Takadt eran hermosas y nuestro guía fue amable y seguro. ¡Altamente recomendado para familias!', 'Tolle Quad-Tour! Die Dünen von Takadt waren wunderschön, und unser Guide war freundlich und sicher. Sehr zu empfehlen für Familien!', 5, true),
  ('Michael K.', 'April 2026', 'We rented the two-seater buggy. Driving through the desert was pure thrill! The organization was seamless and free hotel pickup was a big plus.', 'We rented the two-seater buggy. Driving through the desert was pure thrill! The organization was seamless and free hotel pickup was a big plus.', 'Nous avons loué le buggy biplace. Conduire dans le désert était un pur frisson ! L''organisation était parfaite et le transfert gratuit depuis l''hôtel était un grand plus.', 'Alquilamos el buggy biplaza. ¡Conducir por el desierto fue pura emoción! La organización fue impecable y el traslado gratuito desde el hotel fue un gran punto a favor.', 'Wir haben den Zweisitzer-Buggy gemietet. Die Fahrt durch die Wüste war purer Nervenkitzel! Die Organisation war reibungslos und die kostenlose Abholung vom Hotel war ein großes Plus.', 5, true)
ON CONFLICT DO NOTHING;

-- 7. Seed Initial FAQs
INSERT INTO faqs (q, a, q_en, q_fr, q_es, q_de, a_en, a_fr, a_es, a_de, sort_order)
VALUES
  ('Do I need a driving license to ride the quads or buggies?', 'No driving license is required. Anyone over 16 can ride a quad or drive a buggy. Children under 16 can ride as passengers with a parent or guide.', 'Do I need a driving license to ride the quads or buggies?', 'Faut-il un permis de conduire pour piloter les quads ou les buggys ?', '¿Necesito licencia de conducir para manejar los quads o buggies?', 'Benötige ich einen Führerschein, um die Quads oder Buggys zu fahren?', 'No driving license is required. Anyone over 16 can ride a quad or drive a buggy. Children under 16 can ride as passengers with a parent or guide.', 'Aucun permis de conduire n''est requis. Toute personne de plus de 16 ans peut piloter un quad ou conduire un buggy. Les enfants de moins de 16 ans peuvent monter en tant que passagers avec un parent ou un guide.', 'No se requiere licencia de conducir. Cualquier persona mayor de 16 años puede montar un quad o conducir un buggy. Los niños menores de 16 años pueden ir como pasajeros con un padre o guía.', 'Es ist kein Führerschein erforderlich. Jeder über 16 Jahre kann ein Quad oder einen Buggy fahren. Kinder unter 16 Jahren können als Beifahrer bei einem Elternteil oder Guide mitfahren.', 0),
  ('Is hotel pickup and drop-off really free?', 'Yes! We provide free transportation to and from all hotels in Agadir (including Taghazout, Imi Ouaddar, and surrounding tourist zones). Just tell us your hotel name when booking.', 'Is hotel pickup and drop-off really free?', 'Le transfert depuis et vers l''hôtel est-il vraiment gratuit ?', '¿El servicio de traslado desde y hacia el hotel es realmente gratuito?', 'Ist die Abholung vom Hotel und der Rücktransport wirklich kostenlos?', 'Yes! We provide free transportation to and from all hotels in Agadir (including Taghazout, Imi Ouaddar, and surrounding tourist zones). Just tell us your hotel name when booking.', 'Oui ! Nous fournissons un transport gratuit depuis et vers tous les hôtels d''Agadir (y compris Taghazout, Imi Ouaddar et les zones touristiques environnantes). Indiquez-nous simplement le nom de votre hôtel lors de votre réservation.', '¡Sí! Ofrecemos transporte gratuito desde y hacia todos los hoteles de Agadir (incluyendo Taghazout, Imi Ouaddar y las zonas turísticas circundantes). Solo indíquenos el nombre de su hotel al reservar.', 'Ja! Wir bieten einen kostenlosen Transport von und zu allen Hotels in Agadir (einschließlich Taghazout, Imi Ouaddar und den umliegenden Touristenzonen) an. Teilen Sie uns bei der Buchung einfach den Namen Ihres Hotels mit.', 1)
ON CONFLICT DO NOTHING;

-- Force reload schema cache
NOTIFY pgrst, 'reload schema';
