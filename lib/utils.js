/**
 * Copyright 2017 Tierion
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const fs = require('fs')
const jmespath = require('jmespath')

// wait for a specified number of milliseconds to elapse
function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function sleepAsync (ms) {
  await timeout(ms)
}

/**
 * Add specified seconds to a Date object
 *
 * @param {Date} date - The starting date
 * @param {number} seconds - The seconds of seconds to add to the date
 * @returns {Date}
 */
function addSeconds (date, seconds) {
  return new Date(date.getTime() + (seconds * 1000))
}

/**
 * Add specified minutes to a Date object
 *
 * @param {Date} date - The starting date
 * @param {number} minutes - The number of minutes to add to the date
 * @returns {Date}
 */
function addMinutes (date, minutes) {
  return new Date(date.getTime() + (minutes * 60000))
}

/**
 * Convert Date to ISO8601 string, stripping milliseconds
 * '2017-03-19T23:24:32Z'
 *
 * @param {Date} date - The date to convert
 * @returns {string} An ISO8601 formatted time string
 */
function formatDateISO8601NoMs (date) {
  return date.toISOString().slice(0, 19) + 'Z'
}

/**
 * Convert strings in an Array of hashes to lower case
 *
 * @param {string[]} hashes - An array of string hashes to convert to lower case
 * @returns {string[]} An array of lowercase hash strings
 */
function lowerCaseHashes (hashes) {
  return hashes.map((hash) => {
    return hash.toLowerCase()
  })
}

function fileExists (path) {
  return fs.existsSync(path)
}

function readFile (path, asBinary) {
  if (!fileExists(path)) return false
  let contents = null
  try {
    contents = fs.readFileSync(path, { encoding: asBinary ? null : 'utf8' })
  } catch (err) {
    console.log(err)
    return false
  }
  return contents
}

function writeFile (path, contents) {
  try {
    fs.writeFileSync(path, contents)
  } catch (err) {
    return false
  }
  return true
}

function writeAndConfirmFile (path, writeContents) {
  try {
    fs.writeFileSync(path, writeContents)
  } catch (error) {
    throw new Error(`Unable to write file at ${path}: ${error.message}`)
  }
  let readContents
  try {
    readContents = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (error) {
    throw new Error(`Unable to read file at ${path}: ${error.message}`)
  }
  if (writeContents !== readContents) throw new Error(`Write contents do not match read contents`)
}

function parseAnchorsComplete (proofObject) {
  // Because the minimum proof will contain a cal anchor, always start with cal
  let anchorsComplete = ['cal'].concat(jmespath.search(proofObject, '[branches[].branches[].ops[].anchors[].type] | [0]'))
  return anchorsComplete
}

/**
 * Checks if value is a hexadecimal string
 *
 * @param {string} value - The value to check
 * @returns {bool} true if value is a hexadecimal string, otherwise false
 */
function isHex (value) {
  var hexRegex = /^[0-9a-f]{2,}$/i
  var isHex = hexRegex.test(value) && !(value.length % 2)
  return isHex
}
/**
 * Checks if value is a valid IP
 *
 * @param {string} value - The value to check
 * @returns {bool} true if value is a valid IP, otherwise false
 */
function isIP (value) {
  var ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/
  var isIP = ipRegex.test(value)
  return isIP
}

module.exports = {
  sleepAsync: sleepAsync,
  addMinutes: addMinutes,
  addSeconds: addSeconds,
  formatDateISO8601NoMs: formatDateISO8601NoMs,
  lowerCaseHashes: lowerCaseHashes,
  fileExists: fileExists,
  readFile: readFile,
  writeFile: writeFile,
  writeAndConfirmFile: writeAndConfirmFile,
  parseAnchorsComplete: parseAnchorsComplete,
  isHex: isHex,
  isIP: isIP
}
