import { async } from 'regenerator-runtime';
import { TIMEOUT_SECOND } from './config.js';
const timeout = function (second) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${second} second`)
      );
    }, 1000 * second);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro =
      uploadData == undefined
        ? fetch(url)
        : fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          });
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECOND)]);
    if (!response.ok) throw new Error(`${data.message}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECOND)]);
//     if (!response.ok) throw new Error(`${data.message}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECOND)]);
//     if (!response.ok) throw new Error(`${data.message}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
