-- Demo gyms for local/MVP testing.
-- Run after migrations when the project has no Google Places ingestion yet.

insert into public.gyms (google_place_id, name, address, lat, lng)
values
  (
    'demo-smart-fit-vila-madalena',
    'Smart Fit Vila Madalena',
    'R. Wisard, 23 - Vila Madalena, Sao Paulo - SP',
    -23.5570,
    -46.6890
  ),
  (
    'demo-bio-ritmo-faria-lima',
    'Bio Ritmo Faria Lima',
    'Av. Brigadeiro Faria Lima - Pinheiros, Sao Paulo - SP',
    -23.5716,
    -46.6908
  ),
  (
    'demo-selfit-pinheiros',
    'Selfit Pinheiros',
    'Pinheiros, Sao Paulo - SP',
    -23.5662,
    -46.6870
  )
on conflict (google_place_id) do update
set
  name = excluded.name,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng;
