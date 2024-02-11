const axios = require('axios');
const { log } = require('./logger');

class Helper {
    static countryCodesMap = {};

    static fetchCountryCodes = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) {
                throw new Error('Failed to fetch country codes');
            }
            const data = await response.json();
            Helper.countryCodesMap = data.reduce((acc, country) => {
                if (country.hasOwnProperty('cca2') && country.hasOwnProperty('name')) {
                    acc[country.cca2] = country.name.common;
                }
                return acc;
            }, {});
            console.log('Country codes fetched successfully:', Helper.countryCodesMap);
        } catch (error) {
            console.error('Error fetching country codes:', error);
        }
    }

    static getCountryName = async (codeOrName) => {
        if (Object.keys(Helper.countryCodesMap).length === 0) {            
            await Helper.fetchCountryCodes();
        } 
        
        if (Helper.countryCodesMap.hasOwnProperty(codeOrName.toUpperCase())) {
            return await Helper.countryCodesMap[codeOrName.toUpperCase()];
        } else {
            return await Helper.capitalizeFirstLetter(codeOrName);
        }
    }

    static capitalizeFirstLetter = (str) => {
        // Check if the input is a string
        if (typeof str === "string" && str.length > 0) {
            // Capitalize the first letter and concatenate it with the rest of the string
            return str.charAt(0).toUpperCase() + str.slice(1);
        } else {
            // Return the input unchanged if it's not a valid string
            return str;
        }
    }

    static containsLocationInfo = (str) => {
        str = str.toLowerCase();

        for (const countryCode in Helper.countryCodesMap) {
            const countryName = Helper.countryCodesMap[countryCode].toLowerCase();
            if (str.includes(countryName)) {
                return true;
            }
        }
    
        return false;
    }

    static fetchData = async (url) => {
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          log(`Error fetching data from ${url}: ${error.message}`);
          return null;
        }
    }
}

module.exports = Helper;