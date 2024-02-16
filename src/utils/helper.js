const axios = require("axios");

class Helper {
  static countryCodesMap = {
    CY: "Cyprus",
    ER: "Eritrea",
    LR: "Liberia",
    BM: "Bermuda",
    VA: "Vatican City",
    CK: "Cook Islands",
    SO: "Somalia",
    ZM: "Zambia",
    VE: "Venezuela",
    TM: "Turkmenistan",
    AL: "Albania",
    HR: "Croatia",
    GB: "United Kingdom",
    SD: "Sudan",
    TL: "Timor-Leste",
    CG: "Republic of the Congo",
    AZ: "Azerbaijan",
    KE: "Kenya",
    AS: "American Samoa",
    CI: "Ivory Coast",
    SN: "Senegal",
    VN: "Vietnam",
    SV: "El Salvador",
    AF: "Afghanistan",
    MF: "Saint Martin",
    LV: "Latvia",
    GT: "Guatemala",
    KW: "Kuwait",
    ST: "São Tomé and Príncipe",
    KG: "Kyrgyzstan",
    PL: "Poland",
    GU: "Guam",
    GH: "Ghana",
    LT: "Lithuania",
    AM: "Armenia",
    JE: "Jersey",
    GD: "Grenada",
    TJ: "Tajikistan",
    ET: "Ethiopia",
    EH: "Western Sahara",
    MA: "Morocco",
    PR: "Puerto Rico",
    CX: "Christmas Island",
    NZ: "New Zealand",
    BN: "Brunei",
    GF: "French Guiana",
    NU: "Niue",
    RO: "Romania",
    SJ: "Svalbard and Jan Mayen",
    BY: "Belarus",
    PA: "Panama",
    CM: "Cameroon",
    CZ: "Czechia",
    BL: "Saint Barthélemy",
    GR: "Greece",
    ML: "Mali",
    MQ: "Martinique",
    FR: "France",
    PK: "Pakistan",
    PE: "Peru",
    BB: "Barbados",
    GL: "Greenland",
    PM: "Saint Pierre and Miquelon",
    TD: "Chad",
    HU: "Hungary",
    KM: "Comoros",
    BD: "Bangladesh",
    TK: "Tokelau",
    FJ: "Fiji",
    CN: "China",
    CO: "Colombia",
    VG: "British Virgin Islands",
    DZ: "Algeria",
    MV: "Maldives",
    MY: "Malaysia",
    KY: "Cayman Islands",
    ES: "Spain",
    IE: "Ireland",
    EE: "Estonia",
    PY: "Paraguay",
    UY: "Uruguay",
    ZA: "South Africa",
    LC: "Saint Lucia",
    VU: "Vanuatu",
    FI: "Finland",
    SE: "Sweden",
    IO: "British Indian Ocean Territory",
    LB: "Lebanon",
    US: "United States",
    CL: "Chile",
    NF: "Norfolk Island",
    MS: "Montserrat",
    AU: "Australia",
    BZ: "Belize",
    GY: "Guyana",
    MN: "Mongolia",
    TV: "Tuvalu",
    DO: "Dominican Republic",
    GQ: "Equatorial Guinea",
    KN: "Saint Kitts and Nevis",
    BO: "Bolivia",
    NP: "Nepal",
    TF: "French Southern and Antarctic Lands",
    TW: "Taiwan",
    BJ: "Benin",
    BG: "Bulgaria",
    MD: "Moldova",
    IM: "Isle of Man",
    BT: "Bhutan",
    KH: "Cambodia",
    AG: "Antigua and Barbuda",
    HT: "Haiti",
    CV: "Cape Verde",
    GE: "Georgia",
    BI: "Burundi",
    BS: "Bahamas",
    MU: "Mauritius",
    LY: "Libya",
    MW: "Malawi",
    MX: "Mexico",
    SZ: "Eswatini",
    PG: "Papua New Guinea",
    DM: "Dominica",
    LI: "Liechtenstein",
    RU: "Russia",
    IL: "Israel",
    SG: "Singapore",
    UG: "Uganda",
    SK: "Slovakia",
    TO: "Tonga",
    AE: "United Arab Emirates",
    YT: "Mayotte",
    SR: "Suriname",
    UZ: "Uzbekistan",
    SA: "Saudi Arabia",
    EG: "Egypt",
    IT: "Italy",
    MG: "Madagascar",
    NC: "New Caledonia",
    CA: "Canada",
    VI: "United States Virgin Islands",
    MH: "Marshall Islands",
    MR: "Mauritania",
    GM: "Gambia",
    TT: "Trinidad and Tobago",
    SC: "Seychelles",
    JP: "Japan",
    BR: "Brazil",
    SY: "Syria",
    SH: "Saint Helena, Ascension and Tristan da Cunha",
    TZ: "Tanzania",
    AD: "Andorra",
    IR: "Iran",
    TG: "Togo",
    MT: "Malta",
    KR: "South Korea",
    WS: "Samoa",
    DE: "Germany",
    NE: "Niger",
    BV: "Bouvet Island",
    JM: "Jamaica",
    NI: "Nicaragua",
    GN: "Guinea",
    AI: "Anguilla",
    AX: "Åland Islands",
    BE: "Belgium",
    PT: "Portugal",
    DK: "Denmark",
    PH: "Philippines",
    WF: "Wallis and Futuna",
    AT: "Austria",
    GW: "Guinea-Bissau",
    MC: "Monaco",
    NA: "Namibia",
    UM: "United States Minor Outlying Islands",
    CR: "Costa Rica",
    BA: "Bosnia and Herzegovina",
    MO: "Macau",
    MZ: "Mozambique",
    RE: "Réunion",
    ME: "Montenegro",
    KP: "North Korea",
    MP: "Northern Mariana Islands",
    UA: "Ukraine",
    IQ: "Iraq",
    GS: "South Georgia",
    AO: "Angola",
    SL: "Sierra Leone",
    FM: "Micronesia",
    CU: "Cuba",
    TC: "Turks and Caicos Islands",
    RS: "Serbia",
    EC: "Ecuador",
    FO: "Faroe Islands",
    AQ: "Antarctica",
    PS: "Palestine",
    TR: "Turkey",
    KI: "Kiribati",
    KZ: "Kazakhstan",
    GI: "Gibraltar",
    IS: "Iceland",
    PW: "Palau",
    QA: "Qatar",
    CH: "Switzerland",
    PF: "French Polynesia",
    PN: "Pitcairn Islands",
    JO: "Jordan",
    MM: "Myanmar",
    TH: "Thailand",
    BQ: "Caribbean Netherlands",
    AW: "Aruba",
    GP: "Guadeloupe",
    NG: "Nigeria",
    BH: "Bahrain",
    LA: "Laos",
    CC: "Cocos (Keeling) Islands",
    DJ: "Djibouti",
    SB: "Solomon Islands",
    HM: "Heard Island and McDonald Islands",
    IN: "India",
    SM: "San Marino",
    LU: "Luxembourg",
    SX: "Sint Maarten",
    FK: "Falkland Islands",
    CF: "Central African Republic",
    BW: "Botswana",
    CW: "Curaçao",
    GG: "Guernsey",
    NO: "Norway",
    GA: "Gabon",
    ZW: "Zimbabwe",
    LS: "Lesotho",
    SI: "Slovenia",
    AR: "Argentina",
    BF: "Burkina Faso",
    YE: "Yemen",
    CD: "DR Congo",
    OM: "Oman",
    ID: "Indonesia",
    NR: "Nauru",
    RW: "Rwanda",
    MK: "North Macedonia",
    XK: "Kosovo",
    NL: "Netherlands",
    TN: "Tunisia",
    SS: "South Sudan",
    HN: "Honduras",
    VC: "Saint Vincent and the Grenadines",
    LK: "Sri Lanka",
    HK: "Hong Kong",
  };

  static getCountryName = (codeOrName) => {
    if (Helper.countryCodesMap.hasOwnProperty(codeOrName.toUpperCase())) {
      return Helper.countryCodesMap[codeOrName.toUpperCase()];
    } else {
      return Helper.capitalizeFirstLetter(codeOrName);
    }
  };

  static capitalizeFirstLetter = (str) => {
    // Check if the input is a string
    if (typeof str === "string" && str.length > 0) {
      // Capitalize the first letter and concatenate it with the rest of the string
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      // Return the input unchanged if it's not a valid string
      return str;
    }
  };

  static capitalizeFirstLetterSentence = (sentence) => {
    // Check if the input is a string
    if (typeof sentence === "string" && sentence.length > 0) {
      // Split the sentence into words
      const words = sentence.split(" ");

      // Capitalize the first letter of each word
      const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });

      // Join the words back together to form the capitalized sentence
      const capitalizedSentence = capitalizedWords.join(" ");

      return capitalizedSentence;
    } else {
      // Return the input unchanged if it's not a valid string
      return sentence;
    }
  };

  static containsLocationInfo = (str) => {
    if (!str) {
      return false;
    }
    str = str.toLowerCase();

    for (const countryCode in Helper.countryCodesMap) {
      const countryName = Helper.countryCodesMap[countryCode].toLowerCase();
      if (str.includes(countryName)) {
        return true;
      }
    }

    return false;
  };

  static fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(`Error fetching data from ${url}: ${error.message}`);
      return null;
    }
  };
}

module.exports = Helper;
