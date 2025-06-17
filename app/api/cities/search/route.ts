import { NextRequest, NextResponse } from 'next/server';

// EU Countries and their major cities
const EU_COUNTRIES = {
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bonn', 'Hannover', 'Nuremberg', 'Bremen', 'Dresden'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
  'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
  'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
  'Portugal': ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém'],
  'Czech Republic': ['Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec', 'Olomouc', 'Budweis', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice'],
  'Hungary': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'],
  'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'],
  'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Piraeus', 'Larissa', 'Heraklion', 'Peristeri', 'Kallithea', 'Acharnes', 'Kalamaria'],
  'Ireland': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
  'Croatia': ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Slavonski Brod', 'Pula', 'Sesvete', 'Karlovac', 'Varaždin'],
  'Slovakia': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin', 'Trenčín', 'Poprad'],
  'Slovenia': ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Velenje', 'Koper', 'Novo Mesto', 'Ptuj', 'Trbovlje', 'Kamnik'],
  'Estonia': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu', 'Sillamäe', 'Kuressaare'],
  'Latvia': ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera', 'Jēkabpils', 'Ogre'],
  'Lithuania': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena'],
  'Bulgaria': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'],
  'Romania': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea'],
  'Luxembourg': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck', 'Diekirch', 'Strassen', 'Bertrange', 'Bettembourg', 'Schifflange'],
  'Malta': ['Valletta', 'Birkirkara', 'Mosta', 'Qormi', 'Żabbar', 'Sliema', 'San Pawl il-Baħar', 'Naxxar', 'Żejtun', 'Ħamrun'],
  'Cyprus': ['Nicosia', 'Limassol', 'Larnaca', 'Strovolos', 'Famagusta', 'Paphos', 'Kyrenia', 'Protaras', 'Paralimni', 'Ayia Napa']
};

// Timezone mapping for EU countries
const COUNTRY_TIMEZONES = {
  'Germany': 'Europe/Berlin',
  'France': 'Europe/Paris', 
  'Italy': 'Europe/Rome',
  'Spain': 'Europe/Madrid',
  'Netherlands': 'Europe/Amsterdam',
  'Poland': 'Europe/Warsaw',
  'Belgium': 'Europe/Brussels',
  'Austria': 'Europe/Vienna',
  'Portugal': 'Europe/Lisbon',
  'Czech Republic': 'Europe/Prague',
  'Hungary': 'Europe/Budapest',
  'Sweden': 'Europe/Stockholm',
  'Denmark': 'Europe/Copenhagen',
  'Finland': 'Europe/Helsinki',
  'Greece': 'Europe/Athens',
  'Ireland': 'Europe/Dublin',
  'Croatia': 'Europe/Zagreb',
  'Slovakia': 'Europe/Bratislava',
  'Slovenia': 'Europe/Ljubljana',
  'Estonia': 'Europe/Tallinn',
  'Latvia': 'Europe/Riga',
  'Lithuania': 'Europe/Vilnius',
  'Bulgaria': 'Europe/Sofia',
  'Romania': 'Europe/Bucharest',
  'Luxembourg': 'Europe/Luxembourg',
  'Malta': 'Europe/Malta',
  'Cyprus': 'Europe/Nicosia'
};

// Fallback cities data structure
const MAJOR_CITIES = [
  // Germany
  { id: 1, name: "Berlin", country: "Germany", countryCode: "DE", region: "Berlin", latitude: 52.5200, longitude: 13.4050 },
  { id: 2, name: "Munich", country: "Germany", countryCode: "DE", region: "Bavaria", latitude: 48.1351, longitude: 11.5820 },
  { id: 3, name: "Hamburg", country: "Germany", countryCode: "DE", region: "Hamburg", latitude: 53.5511, longitude: 9.9937 },
  { id: 4, name: "Cologne", country: "Germany", countryCode: "DE", region: "North Rhine-Westphalia", latitude: 50.9375, longitude: 6.9603 },
  { id: 5, name: "Frankfurt", country: "Germany", countryCode: "DE", region: "Hesse", latitude: 50.1109, longitude: 8.6821 },
  { id: 6, name: "Stuttgart", country: "Germany", countryCode: "DE", region: "Baden-Württemberg", latitude: 48.7758, longitude: 9.1829 },
  { id: 7, name: "Düsseldorf", country: "Germany", countryCode: "DE", region: "North Rhine-Westphalia", latitude: 51.2277, longitude: 6.7735 },
  
  // USA
  { id: 101, name: "New York", country: "United States", countryCode: "US", region: "New York", latitude: 40.7128, longitude: -74.0060 },
  { id: 102, name: "Los Angeles", country: "United States", countryCode: "US", region: "California", latitude: 34.0522, longitude: -118.2437 },
  { id: 103, name: "Chicago", country: "United States", countryCode: "US", region: "Illinois", latitude: 41.8781, longitude: -87.6298 },
  { id: 104, name: "Houston", country: "United States", countryCode: "US", region: "Texas", latitude: 29.7604, longitude: -95.3698 },
  { id: 105, name: "San Francisco", country: "United States", countryCode: "US", region: "California", latitude: 37.7749, longitude: -122.4194 },
  { id: 106, name: "Miami", country: "United States", countryCode: "US", region: "Florida", latitude: 25.7617, longitude: -80.1918 },
  { id: 107, name: "Seattle", country: "United States", countryCode: "US", region: "Washington", latitude: 47.6062, longitude: -122.3321 },
  { id: 108, name: "Boston", country: "United States", countryCode: "US", region: "Massachusetts", latitude: 42.3601, longitude: -71.0589 },
  
  // UK
  { id: 201, name: "London", country: "United Kingdom", countryCode: "GB", region: "England", latitude: 51.5074, longitude: -0.1278 },
  { id: 202, name: "Manchester", country: "United Kingdom", countryCode: "GB", region: "England", latitude: 53.4808, longitude: -2.2426 },
  { id: 203, name: "Birmingham", country: "United Kingdom", countryCode: "GB", region: "England", latitude: 52.4862, longitude: -1.8904 },
  { id: 204, name: "Edinburgh", country: "United Kingdom", countryCode: "GB", region: "Scotland", latitude: 55.9533, longitude: -3.1883 },
  { id: 205, name: "Glasgow", country: "United Kingdom", countryCode: "GB", region: "Scotland", latitude: 55.8642, longitude: -4.2518 },
  
  // France
  { id: 301, name: "Paris", country: "France", countryCode: "FR", region: "Île-de-France", latitude: 48.8566, longitude: 2.3522 },
  { id: 302, name: "Lyon", country: "France", countryCode: "FR", region: "Auvergne-Rhône-Alpes", latitude: 45.7640, longitude: 4.8357 },
  { id: 303, name: "Marseille", country: "France", countryCode: "FR", region: "Provence-Alpes-Côte d'Azur", latitude: 43.2965, longitude: 5.3698 },
  { id: 304, name: "Nice", country: "France", countryCode: "FR", region: "Provence-Alpes-Côte d'Azur", latitude: 43.7102, longitude: 7.2620 },
  
  // Spain
  { id: 401, name: "Madrid", country: "Spain", countryCode: "ES", region: "Community of Madrid", latitude: 40.4168, longitude: -3.7038 },
  { id: 402, name: "Barcelona", country: "Spain", countryCode: "ES", region: "Catalonia", latitude: 41.3851, longitude: 2.1734 },
  { id: 403, name: "Valencia", country: "Spain", countryCode: "ES", region: "Valencia", latitude: 39.4699, longitude: -0.3763 },
  { id: 404, name: "Seville", country: "Spain", countryCode: "ES", region: "Andalusia", latitude: 37.3886, longitude: -5.9823 },
  
  // Italy
  { id: 501, name: "Rome", country: "Italy", countryCode: "IT", region: "Lazio", latitude: 41.9028, longitude: 12.4964 },
  { id: 502, name: "Milan", country: "Italy", countryCode: "IT", region: "Lombardy", latitude: 45.4642, longitude: 9.1900 },
  { id: 503, name: "Naples", country: "Italy", countryCode: "IT", region: "Campania", latitude: 40.8518, longitude: 14.2681 },
  { id: 504, name: "Florence", country: "Italy", countryCode: "IT", region: "Tuscany", latitude: 43.7696, longitude: 11.2558 },
  { id: 505, name: "Venice", country: "Italy", countryCode: "IT", region: "Veneto", latitude: 45.4408, longitude: 12.3155 },
  
  // Netherlands
  { id: 601, name: "Amsterdam", country: "Netherlands", countryCode: "NL", region: "North Holland", latitude: 52.3676, longitude: 4.9041 },
  { id: 602, name: "Rotterdam", country: "Netherlands", countryCode: "NL", region: "South Holland", latitude: 51.9244, longitude: 4.4777 },
  { id: 603, name: "The Hague", country: "Netherlands", countryCode: "NL", region: "South Holland", latitude: 52.0705, longitude: 4.3007 },
  
  // Switzerland
  { id: 701, name: "Zurich", country: "Switzerland", countryCode: "CH", region: "Zurich", latitude: 47.3769, longitude: 8.5417 },
  { id: 702, name: "Geneva", country: "Switzerland", countryCode: "CH", region: "Geneva", latitude: 46.2044, longitude: 6.1432 },
  { id: 703, name: "Basel", country: "Switzerland", countryCode: "CH", region: "Basel-Stadt", latitude: 47.5596, longitude: 7.5886 },
  
  // Austria
  { id: 801, name: "Vienna", country: "Austria", countryCode: "AT", region: "Vienna", latitude: 48.2082, longitude: 16.3738 },
  { id: 802, name: "Salzburg", country: "Austria", countryCode: "AT", region: "Salzburg", latitude: 47.8095, longitude: 13.0550 },
  
  // Canada
  { id: 901, name: "Toronto", country: "Canada", countryCode: "CA", region: "Ontario", latitude: 43.6532, longitude: -79.3832 },
  { id: 902, name: "Vancouver", country: "Canada", countryCode: "CA", region: "British Columbia", latitude: 49.2827, longitude: -123.1207 },
  { id: 903, name: "Montreal", country: "Canada", countryCode: "CA", region: "Quebec", latitude: 45.5017, longitude: -73.5673 },
  
  // Australia
  { id: 1001, name: "Sydney", country: "Australia", countryCode: "AU", region: "New South Wales", latitude: -33.8688, longitude: 151.2093 },
  { id: 1002, name: "Melbourne", country: "Australia", countryCode: "AU", region: "Victoria", latitude: -37.8136, longitude: 144.9631 },
  { id: 1003, name: "Brisbane", country: "Australia", countryCode: "AU", region: "Queensland", latitude: -27.4698, longitude: 153.0251 },
  
  // Japan
  { id: 1101, name: "Tokyo", country: "Japan", countryCode: "JP", region: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { id: 1102, name: "Osaka", country: "Japan", countryCode: "JP", region: "Osaka", latitude: 34.6937, longitude: 135.5023 },
  { id: 1103, name: "Kyoto", country: "Japan", countryCode: "JP", region: "Kyoto", latitude: 35.0116, longitude: 135.7681 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        cities: [],
        message: 'Query must be at least 2 characters'
      }, { status: 400 });
    }

    const searchTerm = query.toLowerCase();
    const matchingCities: any[] = [];

    // Search through EU countries and cities
    for (const [country, cities] of Object.entries(EU_COUNTRIES)) {
      for (const city of cities) {
        if (city.toLowerCase().includes(searchTerm) || 
            country.toLowerCase().includes(searchTerm)) {
          
          // Get timezone for this country
          const timezone = COUNTRY_TIMEZONES[country] || 'Europe/Berlin';
          
          matchingCities.push({
            id: `${country}-${city}`.replace(/\s+/g, '-').toLowerCase(),
            name: city,
            country: country,
            countryCode: getCountryCode(country),
            region: city,
            timezone: timezone,
            latitude: 0, // We'll use coordinates from external API if needed
            longitude: 0
          });
        }
      }
    }

    // Sort by relevance (exact city matches first, then country matches)
    const sortedCities = matchingCities.sort((a, b) => {
      const aExactCity = a.name.toLowerCase().startsWith(searchTerm);
      const bExactCity = b.name.toLowerCase().startsWith(searchTerm);
      const aExactCountry = a.country.toLowerCase().startsWith(searchTerm);
      const bExactCountry = b.country.toLowerCase().startsWith(searchTerm);
      
      if (aExactCity && !bExactCity) return -1;
      if (!aExactCity && bExactCity) return 1;
      if (aExactCountry && !bExactCountry) return -1;
      if (!aExactCountry && bExactCountry) return 1;
      
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      cities: sortedCities.slice(0, 20), // Limit to 20 results
      total: sortedCities.length
    });

  } catch (error) {
    console.error('Error searching cities:', error);
    return NextResponse.json(
      { error: 'Failed to search cities' },
      { status: 500 }
    );
  }
}

// Helper function to get country codes
function getCountryCode(country: string): string {
  const codes: Record<string, string> = {
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES',
    'Netherlands': 'NL',
    'Poland': 'PL',
    'Belgium': 'BE',
    'Austria': 'AT',
    'Portugal': 'PT',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Sweden': 'SE',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Greece': 'GR',
    'Ireland': 'IE',
    'Croatia': 'HR',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Estonia': 'EE',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Bulgaria': 'BG',
    'Romania': 'RO',
    'Luxembourg': 'LU',
    'Malta': 'MT',
    'Cyprus': 'CY'
  };
  return codes[country] || 'EU';
}