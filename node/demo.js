const pako = require('pako');
var CryptoJS = require("crypto-js");

var e = "levelstothemoon!!",
    t = 16;

var md5 = CryptoJS.MD5(e)
//console.log(md5)

var md5_str = md5.toString(CryptoJS.enc.Base64)
//console.log(md5_str)

var md5_substr = md5_str.substr(0, t)
//console.log(md5_substr)

var payload = "fuMk20OVAzF6BdEf/srQHdNXJFas7jtkGGaPDPOhemNrsn2iHb9RXHhmyGHz1phlWgzCD7T2qsV1vPX+NOG3SXYaYTE68kw4AhlDfBv0JnrxwGnR37PbGm61HilU/C7VdYFTe9ShWfUNrO0nvlpGiiZFO+hVce3RajdzJiLB9ylm77MQwKxOxpU2naSLWNEwOJEivgjvBM0FGSZgR4GL6o/XfYHzX1ZZ1XupcEDNSTpx5cUyJdU14Y/LZn8NG9VahaEjUzoTnXojR9UVIwgh93mtpnKESaPzz6GYW+Qhv4qAooQTfd68vBvA5tJdph3POtfvg7+WGyazZph0Y1Jzqtj9ZKWu64/qhWGUZEYy9f1cP70kJNwxtF5SUmozCoGoa8awkqNklGRulSIl5zQssgkduva2mqasZR5xSX22sHUny8Wmo1RhZggvHc85DnTXlHzDearQBt/6lsdluF5cJyuo6wd0wufciEr9DWXQ+ekQHw2Br9EWLtJp87BrJbszPRbQ/DaGX6HOVpA9G41+Wt1cYlbDOS2O5bnSH0XEYzS12SAADzrheCGTJR9vQ2vrwpVmoxNoye2OD6Ht+A3lOLdUpcYDiKyn0wT75LidylwuRESniFHpJInYueLR7iBu6enOZwfV981C31Z8xf4vitr09WIm43XafnfZBryuFUwjBVwrNVzt1XbWDMR/bii9FxZ5zSEJytCRfSKRU4/6npQQ9iequPijvwMuELIBZmRM4TBPm0pffA9iZVd0mQT3eEHLGWt2QHGNFySjkB6HDtFnmdozkqIIbAmfTK4lzT5C2vDUFDR+hritfgbCOTt74G2I5HruqY7gddhLb95N2RqLzQICLCXWgsYzErnqbxB799zijiSHaPrl1z/Ycq8pxRzC8zeGbh9PnI3Kh00cHikXHuMIpUOTxyX5zQOIJ0QNJEEQ6DUkK4VaQac78RV4wmXSdAT80TnEp9xCdckwkGkeyATrqDn75zasMNh4yuYkfKEZvUwBzf3lxt8OW91YYIzCjf1wCDSCfUNGC+SFZGgr5nbFsyP4tEU4rrUGvlelXgaz1U8NF3OplnnfqE0vYZEihnkY+792mj5zHCkLtTsC3Lju8xvquAC/i7ZPa/XEGWsSBqMcl/ZlDuSWj8C2Vg0zohmFoKIGylJUT9WecOZX2pjtqJBTsB5iD2KDzR74gPvq6BQO8QyVH1L4svQ+kai3xlk1TV43pX6ls4Z+7mIqLYguXFjXvPrOPHy8Fz0SXCwAIMxbwgX98SthMkLs7+OOt/PzwO//YDX3W7KgcEmkjvyHcT7BLRTSAjwCGHOOqy7Z/flTAgqjsRovBOkshtkzhH1037ZIAh2Rdu8ISu+5K3DlLOA16Dpp3Hu/pf9K/in3i7J0fHdl6bVcDjIAMFP2aD6IS2BFb5pqs0AYd42mJXV3M5QJZudWz/TyRI75Ha+ehA1j2Chh6/NUv+GSUkcDJ/2Ndd8WgZAJLuLYkPS6oOxLzyrGmi/iXngcBBN7zM26ltmm4TFFdqvOirSnFy7Kt0/3nxxd2yt/xVIOs5cYSyeN6ODUjRJW29DgTqIBV4MYNImPGwr81NUE8lWE5W/xkk0GMUWbsUuI5dQnGPWhzRTfGifKHnp0M5H70IiPJSeyEfQPIFHSPfQGsYgCu7Mo+kFG+0u3umMCeoSDVg=="

var encoded_payload = CryptoJS.enc.Base64.parse(payload)
//console.log(encoded_payload)

var body = { ciphertext: encoded_payload }

var encoded_key = CryptoJS.enc.Utf8.parse(md5_substr)
//console.log(encoded_key)

var config = {
    mode: CryptoJS.mode.ECB,
    iv: null
}

var decrypted = CryptoJS.AES.decrypt(body, encoded_key, config)
//console.log(decrypted)
//
var encoded_decrypted = decrypted.toString(CryptoJS.enc.Base64)
//console.log(encoded_decrypted)

var decoded = atob(encoded_decrypted)   // Base64 decode
//console.log(decoded)

var split_decoded = decoded.split("")
//console.log(split_decoded)

var utf16_codes = split_decoded.map(function(e) { return e.charCodeAt(0) })   // Get UTF-16 codes
//console.log(utf16_codes)

var inflated = pako.inflate(utf16_codes, { to: "string" });
console.log(inflated)

obj = JSON.parse(inflated)

//console.log(obj)