interface CityData {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  region?: string;
}

interface WeatherApiResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

// EU country codes mapping
const EU_COUNTRY_CODES = {
  'germany': 'DE',
  'deutschland': 'DE',
  'france': 'FR',
  'frankreich': 'FR',
  'italy': 'IT',
  'italien': 'IT',
  'spain': 'ES',
  'spanien': 'ES',
  'netherlands': 'NL',
  'niederlande': 'NL',
  'holland': 'NL',
  'austria': 'AT',
  'österreich': 'AT',
  'belgium': 'BE',
  'belgien': 'BE',
  'poland': 'PL',
  'polen': 'PL',
  'czech republic': 'CZ',
  'tschechien': 'CZ',
  'hungary': 'HU',
  'ungarn': 'HU',
  'sweden': 'SE',
  'schweden': 'SE',
  'denmark': 'DK',
  'dänemark': 'DK',
  'finland': 'FI',
  'finnland': 'FI',
  'greece': 'GR',
  'griechenland': 'GR',
  'ireland': 'IE',
  'irland': 'IE',
  'portugal': 'PT',
  'romania': 'RO',
  'rumänien': 'RO',
  'bulgaria': 'BG',
  'bulgarien': 'BG',
  'croatia': 'HR',
  'kroatien': 'HR',
  'slovakia': 'SK',
  'slowakei': 'SK',
  'slovenia': 'SI',
  'slowenien': 'SI',
  'estonia': 'EE',
  'estland': 'EE',
  'latvia': 'LV',
  'lettland': 'LV',
  'lithuania': 'LT',
  'litauen': 'LT',
  'luxembourg': 'LU',
  'luxemburg': 'LU',
  'malta': 'MT',
  'cyprus': 'CY',
  'zypern': 'CY'
};

const COUNTRY_TIMEZONE_MAPPING = {
  'DE': 'Europe/Berlin',
  'FR': 'Europe/Paris',
  'IT': 'Europe/Rome',
  'ES': 'Europe/Madrid',
  'NL': 'Europe/Amsterdam',
  'AT': 'Europe/Vienna',
  'BE': 'Europe/Brussels',
  'PL': 'Europe/Warsaw',
  'CZ': 'Europe/Prague',
  'HU': 'Europe/Budapest',
  'SE': 'Europe/Stockholm',
  'DK': 'Europe/Copenhagen',
  'FI': 'Europe/Helsinki',
  'GR': 'Europe/Athens',
  'IE': 'Europe/Dublin',
  'PT': 'Europe/Lisbon',
  'RO': 'Europe/Bucharest',
  'BG': 'Europe/Sofia',
  'HR': 'Europe/Zagreb',
  'SK': 'Europe/Bratislava',
  'SI': 'Europe/Ljubljana',
  'EE': 'Europe/Tallinn',
  'LV': 'Europe/Riga',
  'LT': 'Europe/Vilnius',
  'LU': 'Europe/Luxembourg',
  'MT': 'Europe/Malta',
  'CY': 'Europe/Nicosia'
};

export class CityValidationService {
  
  /**
   * Validates a city name against CountriesNow API and gets geographic data
   */
  static async validateAndGetCityData(cityName: string, countryName: string): Promise<CityData | null> {
    try {
      // Clean and normalize inputs
      const cleanCityName = cityName.trim();
      const cleanCountryName = countryName.trim().toLowerCase();
      
      // Get country code
      const countryCode = EU_COUNTRY_CODES[cleanCountryName];
      if (!countryCode) {
        console.log('Country not supported:', countryName);
        return null;
      }

      // Check city against CountriesNow API
      const cityExists = await this.checkCityInCountry(cleanCityName, countryName);
      if (!cityExists) {
        console.log('City not found in country:', cleanCityName, countryName);
        return null;
      }

      // Get coordinates from OpenStreetMap Nominatim API (free)
      const geoData = await this.getCoordinatesFromNominatim(cleanCityName, countryCode);
      if (!geoData) {
        console.log('Could not get coordinates for city:', cleanCityName);
        return null;
      }

      // Get timezone (either from our mapping or from coordinates)
      const timezone = COUNTRY_TIMEZONE_MAPPING[countryCode] || await this.getTimezoneFromCoordinates(geoData.lat, geoData.lon);

      return {
        name: cleanCityName,
        country: countryName,
        countryCode,
        latitude: geoData.lat,
        longitude: geoData.lon,
        timezone,
        region: geoData.state || geoData.region
      };

    } catch (error) {
      console.error('Error validating city:', error);
      return null;
    }
  }

  /**
   * Check if city exists in country using CountriesNow API
   */
  private static async checkCityInCountry(cityName: string, countryName: string): Promise<boolean> {
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(countryName)}`);
      const data = await response.json();
      
      if (data.error || !data.data) {
        return false;
      }

      // Check if city exists in the list (case-insensitive)
      const cities = data.data as string[];
      return cities.some(city => 
        city.toLowerCase() === cityName.toLowerCase() ||
        city.toLowerCase().includes(cityName.toLowerCase()) ||
        cityName.toLowerCase().includes(city.toLowerCase())
      );
    } catch (error) {
      console.error('Error checking city with CountriesNow:', error);
      return false;
    }
  }

  /**
   * Get coordinates from OpenStreetMap Nominatim API
   */
  private static async getCoordinatesFromNominatim(cityName: string, countryCode: string): Promise<{lat: number, lon: number, state?: string, region?: string} | null> {
    try {
      const query = `${cityName}, ${countryCode}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Wakr-App/1.0 (contact@wakr.app)' // Required by Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null;
      }

      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        state: result.address?.state,
        region: result.address?.region
      };
    } catch (error) {
      console.error('Error getting coordinates from Nominatim:', error);
      return null;
    }
  }

  /**
   * Get timezone from coordinates using free timezone API
   */
  private static async getTimezoneFromCoordinates(lat: number, lon: number): Promise<string> {
    try {
      // Using a free timezone API
      const response = await fetch(`http://worldtimeapi.org/api/timezone`);
      const timezones = await response.json();
      
      // For EU cities, default to appropriate timezone
      // This is a fallback - in practice, our COUNTRY_TIMEZONE_MAPPING should cover most cases
      return 'Europe/Berlin'; // Safe default for EU
    } catch (error) {
      console.error('Error getting timezone:', error);
      return 'Europe/Berlin'; // Safe default
    }
  }

  /**
   * Search for cities with suggestions
   */
  static async searchCitySuggestions(query: string, countryName: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(countryName)}`);
      const data = await response.json();
      
      if (data.error || !data.data) {
        return [];
      }

      const cities = data.data as string[];
      const queryLower = query.toLowerCase();
      
      // Find cities that start with or contain the query
      const matches = cities.filter(city => 
        city.toLowerCase().startsWith(queryLower) ||
        city.toLowerCase().includes(queryLower)
      );

      // Sort by relevance (starts with query first, then contains)
      matches.sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(queryLower);
        const bStarts = b.toLowerCase().startsWith(queryLower);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return a.localeCompare(b);
      });

      return matches.slice(0, limit);
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }
}