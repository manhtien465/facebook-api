const crypto = require('crypto');
const axios = require('axios');

// const VENTURE = {
//     SINGAPORE: 'SINGAPORE',
//     THAILAND: 'THAILAND',
//     MALAYSIA: 'MALAYSIA',
//     VIETNAM: 'VIETNAM',
//     PHILIPPINES: 'PHILIPPINES',
//     INDONESIA: 'INDONESIA',
// };
// const GATEWAY = {
//     SINGAPORE: 'api.lazada.sg/rest',
//     THAILAND: 'api.lazada.co.th/rest',
//     MALAYSIA: 'api.lazada.com.my/rest',
//     VIETNAM: 'api.lazada.vn/rest',
//     PHILIPPINES: 'api.lazada.com.ph/rest',
//     INDONESIA: 'api.lazada.co.id/rest',
//     AUTH: 'auth.lazada.com/rest',
// };
const BASE_URL = 'https://auth.lazada.com/rest';
/**
 * Calculate a signature hash
 * @param {string} appSecret
 * @param {string} apiPath e.g. /order/get
 * @param {Object} params
 * @return {string} signature hash
 */
const signRequest = (
    appSecret,
    apiPath,
    params,
) => {
    // 1. Sort all request parameters (except the “sign” and parameters with byte array type)
    const keysortParams = keysort(params);

    // 2. Concatenate the sorted parameters into a string i.e. "key" + "value" + "key2" + "value2"...
    const concatString = concatDictionaryKeyValue(keysortParams);

    // 3. Add API name in front of the string in (2)
    const preSignString = apiPath + concatString;

    // 4. Encode the concatenated string in UTF-8 format & and make a digest (HMAC_SHA256)
    const hash = crypto
        .createHmac('sha256', appSecret)
        .update(preSignString)
        // 5. Convert the digest to hexadecimal format
        .digest('hex');

    return hash.toUpperCase(); // must use upper case
};

/**
 * Shallow copy an object with sorted keys
 * @param {Object} unordered
 * @return {Object} ordered
 */
const keysort = (unordered) => Object.keys(unordered)
    .sort()
    .reduce((ordered, key) => {
        // eslint-disable-next-line no-param-reassign
        ordered[key] = unordered[key];
        return ordered;
    }, {});

/**
 * { key: value } => 'keyvalue'
 * @param {Object} dictionary
 * @return {string} concatString
 */
const concatDictionaryKeyValue = (object) => Object.keys(object).reduce(
    (concatString, key) => concatString.concat(key + object[key]),
    '',
);

const generateAccessToken = async () => {
    const apiPath = '/auth/token/create';
    const timestamp = Date.now().toString();
    console.log(timestamp);
    await axios.post(`${BASE_URL}${apiPath}`, null, {
        params: {
            app_secret: '1WJCkbAlfnLVG0iiN0DXvjTmSP9AVahS',
            code: '0_107204_UujqsUHJIKJN2UWPLWRsRqZB5805',
            app_key: '107198',
            sign_method: 'sha256',
            timestamp: timestamp,
            sign: signRequest('1WJCkbAlfnLVG0iiN0DXvjTmSP9AVahS', apiPath, {
                code: '0_107204_UujqsUHJIKJN2UWPLWRsRqZB5805',
                app_key: '107198',
                sign_method: 'sha256',
                timestamp: timestamp,
            }),
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};
// console.log(
//     signRequest("107204", '/auth/token/create',
//         {
//             code: "0_107204_lvSPxVjxyeXYzUeGe6k1batG3",
//             sign_method: "sha256",
//             // timestamp: Math.floor(new Date().getTime() / 1000),
//             timestamp: 1645614240435
//         }
//     )
// )
export default {
    generateAccessToken
};

