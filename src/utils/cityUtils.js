import * as israelCities from '../data/israel-cities';

export const translateCityName = (cityName, toLang) => {
    try {
        const cities = israelCities.default;
        if (toLang == "en") {
            const city = cities.find(city => {
                return city.name === cityName;
            })
            return city.english_name
        } else if (toLang == "he") {
            const city = cities.find(city => {
                return city.english_name === cityName.toUpperCase() ;
            })
            return city.name
        }
    } catch {
        return cityName
    }
}