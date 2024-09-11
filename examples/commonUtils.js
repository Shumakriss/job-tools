"use strict";
var _slicedToArray = function() {
        return function(e, t) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return function(e, t) {
                var r = [],
                    n = !0,
                    a = !1,
                    o = void 0;
                try {
                    for (var i, s = e[Symbol.iterator](); !(n = (i = s.next()).done) && (r.push(i.value), !t || r.length !== t); n = !0);
                } catch (e) {
                    a = !0, o = e
                } finally {
                    try {
                        !n && s.return && s.return()
                    } finally {
                        if (a) throw o
                    }
                }
                return r
            }(e, t);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }(),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };

function _toConsumableArray(e) {
    if (Array.isArray(e)) {
        for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
        return r
    }
    return Array.from(e)
}

function _defineProperty(e, t, r) {
    return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r, e
}
var anonymizableYearsKeys = ["yearsOfExperience", "yearsAtCompany", "yearsAtLevel"],
    defaultHomepageJobFamilies = ["Software Engineer", "Product Manager", "Product Designer", "Software Engineering Manager", "Management Consultant"];

function findShortestTitleName(e) {
    return e.reduce(function(e, t) {
        return e.length < t.length ? e : t
    })
}

function encodeNameForUrl(e) {
    var t = e.replace("&", " and ").replace(/\W+/g, "-").replace(/-+/g, "-");
    return t.startsWith("-") && (t = t.slice(1, t.length)), t.endsWith("-") && (t = t.slice(0, t.length - 1)), "" === t && console.log("ERROR: Encoded Name has no valid characters"), t
}

function shortenAddress(e) {
    return e.split(",").filter(function(e) {
        return e
    }).slice(1).join(", ").trim()
}

function capitalizeFirstLetter(e) {
    return e.charAt(0).toUpperCase() + e.slice(1)
}

function yearComparison(e, t, r) {
    return "=" === r ? parseInt(e) === parseInt(t) : "<" === r ? parseInt(e) < parseInt(t) : ">" === r ? parseInt(e) > parseInt(t) : "<=" === r ? parseInt(e) <= parseInt(t) : ">=" === r && parseInt(e) >= parseInt(t)
}

function isElementFalse(e) {
    return !e
}

function getQueryStringMap() {
    return function() {
        var e = {},
            t = window.location.search.substring(1);
        "/" == t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1));
        for (var r = t.split("&"), n = 0; n < r.length; n++) {
            var a = r[n].split("=");
            if (void 0 === e[a[0]]) e[a[0]] = decodeURIComponent(a[1]);
            else if ("string" == typeof e[a[0]]) {
                var o = [e[a[0]], decodeURIComponent(a[1])];
                e[a[0]] = o
            } else e[a[0]].push(decodeURIComponent(a[1]))
        }
        return e
    }()
}

function numberWithCommas(e) {
    if (isNaN(e)) return NaN;
    return parseFloat(e).toLocaleString("en-US", {
        style: "decimal"
    })
}

function compactNumber(e) {
    if (isNaN(e)) return NaN;
    return parseFloat(e).toLocaleString("en-US", {
        style: "decimal",
        notation: "compact"
    })
}

function compactDollarFormatter(e) {
    return "$" + compactNumber(e)
}

function throttle(e, t) {
    var r = null;
    return function() {
        var n = this,
            a = arguments;
        clearTimeout(r), r = window.setTimeout(function() {
            e.apply(n, a)
        }, t || 500)
    }
}

function isEmail(e) {
    return /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/.test(e)
}

function levelNameMatches(e, t, r, n) {
    return n || (n = "Software Engineer"), e.some(function(e) {
        return levelNameMatch(e, t, r, n)
    })
}

function levelNameMatch(e, t, r, n) {
    var a = e.toLowerCase().trim(),
        o = t.toLowerCase().trim();
    if ("" === o) return !1;
    if ("squarespace" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("carta" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("rubrik" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("airbnb" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("adobe" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("vmware" === r.toLowerCase().trim() && "Software Engineer" === n) return "mts 1" === a ? o === a || "mts1" === o || "member of technical staff (mts 1)" === o : a === o || a.replace(/ /g, "") === o.replace(/ /g, "");
    if ("ebay" === r.toLowerCase().trim() && "Software Engineer" === n) return "senior mts" === a && ("senior member of technical staff" === o || "sr. mts" === o) || (a === o || a.replace(/ /g, "") === o.replace(/ /g, ""));
    if ("roblox" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("instacart" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if (("electronic arts" === r.toLowerCase().trim() || "ea" === r.toLowerCase().trim()) && "Software Engineer" === n) return a === o;
    if ("cisco" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("paypal" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("autodesk" === r.toLowerCase().trim() && "Software Engineer" === n) {
        if (("senior software engineer 1" === a || "senior software engineer 2" === a) && -1 === o.indexOf("senior")) return !1;
        if (("software engineer 1" === a || "software engineer 2" === a) && o.indexOf("senior") > -1) return !1
    }
    if ("flexport" === r.toLowerCase().trim() && "Software Engineer" === n) {
        if ("software engineer i" === a) return a === o || "swe1" === o || "swe I" === o || "swe 1" === o;
        if ("software engineer ii" === a) return a === o || "swe II" === o || "sde2" === o
    }
    if ("twilio" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("oyo" === r.toLowerCase().trim() && "Software Engineer" === n) return a === o;
    if ("uber" === r.toLowerCase().trim() && ("5a" === a || "5b" === a)) return -1 !== o.indexOf(a);
    if ("Software Engineering Manager" === n && "google" === r.toLowerCase()) return a === o;
    if ("Product Manager" === n && "google" === r.toLowerCase()) return a === o;
    if ("Software Engineering Manager" === n && "facebook" === r.toLowerCase()) {
        if ("m1" === a) return o.indexOf("m1") > -1 || o.indexOf("m 1") > -1 || o.indexOf("manager1") > -1 || o.indexOf("manager 1") > -1 || o === a;
        if ("d1" === a) return o.indexOf("d1") > -1 || o.indexOf("d 1") > -1 || o.indexOf("director1") > -1 || o.indexOf("director 1") > -1 || o.indexOf("dir1") > -1 || o.indexOf("dir 1") > -1 || o === a;
        if ("vp1" === a) return o.indexOf("vp1") > -1 || o.indexOf("vp 1") > -1 || o.indexOf("vice president 1") > -1 || o.indexOf("vicepresident1") > -1 || o.indexOf("vicepresident 1") > -1 || o.indexOf("vice president1") > -1 || o === a;
        if ("m2" === a) return o.indexOf("m2") > -1 || o.indexOf("m 2") > -1 || o.indexOf("manager2") > -1 || o.indexOf("manager 2") > -1 || o === a;
        if ("d2" === a) return o.indexOf("d2") > -1 || o.indexOf("d 2") > -1 || o.indexOf("director2") > -1 || o.indexOf("director 2") > -1 || o.indexOf("dir2") > -1 || o.indexOf("dir 2") > -1 || o === a;
        if ("vp2" === a) return o.indexOf("vp2") > -1 || o.indexOf("vp 2") > -1 || o.indexOf("vice president 2") > -1 || o.indexOf("vicepresident2") > -1 || o.indexOf("vicepresident 2") > -1 || o.indexOf("vice president2") > -1 || o === a
    }
    if ("Product Manager" === n && "google" === r.toLowerCase()) {
        if ("apm1" === a || "associate product manager 1" === a) return o.indexOf("apm1") > -1 || o.indexOf("apm 1") > -1 || o === a;
        if ("apm2" === a || "associate product manager 2" === a) return o.indexOf("apm2") > -1 || o.indexOf("apm 2") > -1 || o === a
    }
    var i = a === o || null !== a.match(/\d/g) && null !== o.match(/\d/g) && a.match(/\d/g).join("") === o.match(/\d/g).join("") || a.replace(/ /g, "") === o.replace(/ /g, "");
    return "Software Engineer" !== n && (i = a === o), i
}

function determineCountryToFilterTo(e, t, r, n) {
    if ("United States" === n) return "United States";
    var a = e.filter(function(e) {
            return e.title === t && (e.company.toLowerCase().trim() === r.toLowerCase().trim() && !(!e.basesalary || "" === e.basesalary))
        }),
        o = a.filter(function(e) {
            return !(!e.dmaid || "0" === e.dmaid)
        });
    if ("United States" !== n) {
        var i = a.filter(function(e) {
            if (n && !(e.dmaid && "0" !== e.dmaid)) {
                var t = e.location.split(","),
                    r = t.length - 1;
                return n === t[r].trim()
            }
            return !1
        });
        if (o.length < i.length) return n
    }
    return "United States"
}

function getFilteredSalaryRows(e, t, r, n, a, o, i) {
    var s = t[i ? "Software Engineer" : r][n].map(function(e) {
            return e.titles
        }).filter(function(e) {
            return e.includes(a)
        })[0],
        l = e.filter(function(e) {
            if (e.title !== r) return !1;
            if (e.company.toLowerCase().trim() !== n.toLowerCase().trim()) return !1;
            if (!levelNameMatches(s, e.level, n, r)) return !1;
            if (!e.basesalary || "" === e.basesalary) return !1;
            if (o) {
                if (e.dmaid && "0" !== e.dmaid) return "United States" === o;
                var t = e.location.split(","),
                    a = t.length - 1;
                return o === t[a].trim()
            }
            return !0
        });
    if (l.length > 20) {
        var c = l.filter(function(e) {
            var t = new Date(e.timestamp),
                r = new Date;
            return !(t < r.setMonth(r.getMonth() - 12))
        });
        return c.length < 4 && l.length > 20 ? l.filter(function(e) {
            var t = new Date(e.timestamp),
                r = new Date;
            return !(t < r.setMonth(r.getMonth() - 24))
        }) : c
    }
    return l
}

function getAverageSalaryInfo(e, t, r, n, a, o, i) {
    if (null == e) return "";
    var s = getFilteredSalaryRows(e, t, r, n, a, o, i);
    if ((s = s.sort(function(e, t) {
            return -1 * ((Date.parse(e.timestamp) > Date.parse(t.timestamp)) - (Date.parse(e.timestamp) < Date.parse(t.timestamp)))
        })).length < 4) return "";
    s.length >= 10 && (s = filterSalariesByStd(s));
    for (var l = 0, c = 0, u = 0, g = 0, m = 0; m < s.length; m++) {
        var p = s[m];
        if (p && p.basesalary) {
            var d = parseInt(p.basesalary),
                f = parseInt(p.stockgrantvalue || "0"),
                y = parseInt(p.bonus || "0"),
                S = parseInt(p.totalyearlycompensation || "0"),
                h = d < 1e3 ? 1e3 * d : d,
                C = f < 2e3 ? 1e3 * f : f,
                v = y < 1e3 ? 1e3 * y : y,
                A = S < 2e3 ? 1e3 * S : S;
            if (Math.abs(A - (h + C + v)) > 2e4) {
                if (Math.abs(A - (h + C / 4 + v)) > 2e4) continue;
                C /= 4
            }
            l += h, c += C, u += v, g++
        }
    }
    return [l = Math.round(l / g), c = Math.round(c / g), u = Math.round(u / g)]
}

function getNumRowsForCompanyAndLevel(e, t, r, n, a) {
    if (null == e) return 0;
    var o = getFilteredSalaryRows(e, t, r, n, a);
    if ((o = o.sort(function(e, t) {
            return -1 * ((Date.parse(e.timestamp) > Date.parse(t.timestamp)) - (Date.parse(e.timestamp) < Date.parse(t.timestamp)))
        })).length < 4) return 0;
    for (var i = 0, s = 0; s < o.length; s++) {
        var l = o[s];
        if (l && l.basesalary) {
            var c = parseInt(l.basesalary),
                u = parseInt(l.stockgrantvalue || "0"),
                g = parseInt(l.bonus || "0"),
                m = parseInt(l.totalyearlycompensation || "0"),
                p = c < 1e3 ? 1e3 * c : c,
                d = u < 1e3 ? 1e3 * u : u,
                f = g < 1e3 ? 1e3 * g : g,
                y = m < 1e3 ? 1e3 * m : m;
            if (Math.abs(y - (p + d + f)) > 2e4) {
                if (Math.abs(y - (p + d / 4 + f)) > 2e4) continue;
                d /= 4
            }
            p, d, f, i++
        }
    }
    return i
}

function getMedianSalaryInfo(e, t, r, n, a, o, i) {
    if (null == e) return "";
    var s = getFilteredSalaryRows(e, t, r, n, a, o, i).map(function(e) {
        parseInt(e.basesalary), parseInt(e.stockgrantvalue || "0"), parseInt(e.bonus || "0"), parseInt(e.totalyearlycompensation || "0");
        return e
    }).filter(function(e) {
        var t = parseInt(e.basesalary),
            r = parseInt(e.stockgrantvalue || "0"),
            n = parseInt(e.bonus || "0"),
            a = parseInt(e.totalyearlycompensation || "0"),
            o = t < 1e3 ? 1e3 * t : t,
            i = r < 1e3 ? 1e3 * r : r,
            s = n < 1e3 ? 1e3 * n : n,
            l = a < 1e3 ? 1e3 * a : a;
        return !(Math.abs(l - (o + i + s)) > 2e4 && Math.abs(l - (o + i / 4 + s)) > 2e4)
    });
    if (s.sort(function(e, t) {
            return parseInt(e.totalyearlycompensation || "0") - parseInt(t.totalyearlycompensation || "0")
        }), 0 === s.length) return [0, 0, 0];
    var l = s[parseInt(s.length / 2)],
        c = parseInt(l.basesalary || "0"),
        u = parseInt(l.stockgrantvalue || "0"),
        g = parseInt(l.bonus || "0");
    return [c = c < 1e3 ? 1e3 * c : c, u = u < 1e3 ? 1e3 * u : u, g = g < 1e3 ? 1e3 * g : g]
}

function getMedianSalaryRow(e, t) {
    if (null === e || 0 === e.length) return null;
    t && (e = e.filter(function(e) {
        return !(!e.basesalary || "" === e.basesalary || 0 === e.basesalary)
    }));
    var r = e.filter(function(e) {
        var t = new Date(e.timestamp),
            r = new Date;
        return !(t < r.setMonth(r.getMonth() - 12))
    });
    r.length >= 30 && (e = r);
    var n = e.map(function(e) {
        parseInt(e.basesalary), parseInt(e.stockgrantvalue || "0"), parseInt(e.bonus || "0"), parseInt(e.totalyearlycompensation || "0");
        return e
    });
    if (n.sort(function(e, t) {
            return parseInt(e.totalyearlycompensation || "0") - parseInt(t.totalyearlycompensation || "0")
        }), 0 === n.length) return null;
    var a = n[parseInt(n.length / 2)],
        o = parseInt(a.basesalary || "0"),
        i = parseInt(a.stockgrantvalue || "0"),
        s = parseInt(a.bonus || "0");
    return {
        row: a,
        base: o = o < 1e3 ? 1e3 * o : o,
        stock: i = i < 1e3 ? 1e3 * i : i,
        bonus: s = s < 1e3 ? 1e3 * s : s
    }
}

function filterSalariesByStd(e) {
    var t = e.map(function(e) {
            var t = e.totalyearlycompensation;
            return t > 5e3 && (t /= 1e3), parseInt(t)
        }),
        r = average(t),
        n = standardDeviation(t);
    return e.filter(function(e) {
        var t = e.totalyearlycompensation;
        return t > 5e3 && (t /= 1e3), Math.abs(r - parseInt(t)) < n
    })
}

function hideSalaryBreakdowns(e) {
    return !parseInt(e.baseSalary) && !parseInt(e.avgAnnualStockGrantValue) && !parseInt(e.AvgAnnualBonusValue) || new Date(e.timestamp) < new Date("9/10/2018")
}

function getCurrentVisibleTracks() {
    return ["Software Engineer", "Product Manager", "Product Designer", "Software Engineering Manager", "Technical Program Manager", "Data Scientist", "Solution Architect", "Hardware Engineer", "Management Consultant", "Marketing", "Business Analyst", "Recruiter", "Sales", "Mechanical Engineer", "Human Resources"]
}

function getCompanyLevelingDetails() {
    var e;
    return {
        colors: (_defineProperty(e = {
            Google: "60, 186, 84",
            Facebook: "59, 89, 152",
            Microsoft: "0, 161, 241",
            Amazon: "255, 153, 0",
            LinkedIn: "0, 119, 181",
            Uber: "0, 0, 0",
            eBay: "255, 211, 0",
            Netflix: "185, 9, 11",
            Apple: "153, 153, 153",
            Salesforce: "117, 170, 255",
            Symantec: "255,215,0",
            Palantir: "31,35,39",
            Oracle: "248,0,0",
            NetApp: "0,103,197",
            Intuit: "16,128,0",
            Yahoo: "123,0,153",
            VMware: "113,112,116",
            "Dell Technologies": "0,125,184",
            Spotify: "29,185,84",
            Dropbox: "0,126,229",
            Twitter: "0,132,180",
            "Morgan Stanley": "33,108,166",
            Citi: "216,28,28",
            "Bank of America Merrill Lynch": "4,37,100",
            UBS: "255,0,0",
            "Goldman Sachs": "120,153,194",
            "Jefferies and Co": "41,57,82",
            Snap: "232,229,2",
            Lyft: "231,11,129",
            "JPMorgan Chase": "88,14,235",
            IBM: "0, 102, 153",
            Airbnb: "241, 102, 100",
            "Tableau Software": "232, 119, 46",
            Qualcomm: "50, 83, 220",
            "T-Mobile": "226, 0, 116",
            Barclays: "0,174,239",
            Cisco: "27, 160, 215",
            Square: "108, 121, 128",
            "HBC Digital": "0, 0, 0",
            Intel: "0, 113, 197",
            Workday: "240, 137, 35",
            "GE Digital": "58, 115, 184",
            Tesla: "220, 20, 60",
            Pinterest: "189, 8, 28",
            "Capital One": "0, 73, 119",
            Squarespace: "0, 0, 0",
            GoDaddy: "0, 73, 119",
            Yandex: "255, 0, 0",
            "Veritas Technologies": "169, 44, 36",
            Quora: "170, 34, 0",
            SmartThings: "69, 190, 250",
            Splunk: "0, 0, 0",
            Reddit: "255, 86, 0",
            Groupon: "83, 163, 24",
            "General Motors": "7, 57, 128",
            Coursera: "83, 138, 214",
            PayPal: "0, 112, 186",
            "Citrix Systems Inc": "0, 0, 0",
            Udacity: "78, 179, 189",
            USAA: "21, 41, 62",
            Indeed: "44, 105, 235",
            "Kimley Horn": "144, 37, 55",
            "Johnson & Johnson": "187, 47, 27",
            Medtronic: "29, 74, 131",
            SAP: "0, 185, 242",
            Stripe: "94, 115, 224",
            Yelp: "196, 18, 0",
            Autodesk: "6, 150, 215",
            Nextdoor: "25, 151, 93",
            Adobe: "255, 0, 0",
            Intercom: "0, 92, 255",
            Comcast: "217, 0, 58",
            SoFi: "76, 167, 203",
            Careem: "96, 178, 91",
            Flipkart: "62, 115, 232",
            Broadcom: "188, 52, 55",
            Pivotal: "81, 178, 63",
            Visa: "221, 153, 6",
            "Just Eat": "242, 77, 77",
            DoorDash: "254, 47, 7",
            Instacart: "96, 171, 89",
            Zillow: "18, 119, 225",
            OYO: "239, 37, 31",
            Arm: "0, 143, 190",
            Atlassian: "0, 82, 204",
            "Argo AI": "243, 160, 85",
            WeWork: "200, 200, 200",
            Standard: "180, 180, 180",
            "Walmart Labs": "0, 114, 206",
            Slack: "74, 21, 75",
            Nvidia: "122, 181, 71",
            "BCG Digital Ventures": "70, 70, 70",
            Cerner: "0, 126, 185",
            McKinsey: "5, 28, 44",
            Accenture: "0, 137, 255",
            "Oliver Wyman": "0, 168, 200",
            Bain: "238, 50, 36",
            BCG: "38, 106, 46",
            "AT Kearney": "137, 48, 36",
            Deloitte: "134, 188, 36",
            "Deloitte Advisory": "134, 188, 36",
            "Ernst and Young": "255, 219, 0",
            KPMG: "0, 51, 141",
            LEK: "0, 92, 66",
            "Strategy by PwC": "0, 0, 0",
            PwC: "216, 86, 4",
            Expedia: "0, 53, 95",
            MongoDB: "77, 179, 61",
            Bloomberg: "40, 0, 215",
            Cloudera: "249, 103, 2",
            Disney: "17, 60, 207",
            GitHub: "0, 0, 0",
            Wayfair: "107, 0, 107",
            Box: "9, 72, 203",
            Qualtrics: "28, 164, 235",
            Rubrik: "30, 140, 155",
            "Two Sigma": "30, 137, 149",
            Opendoor: "28, 133, 232",
            ServiceNow: "249, 80, 80",
            Okta: "0, 125, 193",
            Glassdoor: "12, 170, 65",
            "Epic Systems": "188, 1, 58",
            ByteDance: "50, 90, 180",
            Mozilla: "226, 88, 33",
            Etsy: "235, 109, 32",
            DocuSign: "56, 123, 235",
            Robinhood: "33, 206, 153",
            Cruise: "255, 77, 55",
            Roblox: "164, 166, 171",
            Shopify: "149, 191, 71",
            Twilio: "242, 47, 70",
            Affirm: "15, 114, 229",
            "Electronic Arts": "92, 92, 92",
            Coinbase: "22, 82, 240",
            Twitch: "100, 65, 164",
            Flexport: "0, 67, 110",
            Asana: "254, 80, 102",
            AMD: "77, 77, 77",
            Convoy: "246, 83, 53",
            Databricks: "255, 54, 33"
        }, "GitHub", "63, 63, 63"), _defineProperty(e, "Ticketmaster", "2, 108, 223"), _defineProperty(e, "UiPath", "250, 70, 22"), _defineProperty(e, "Nutanix", "34, 39, 46"), _defineProperty(e, "SpaceX", "0, 82, 136"), _defineProperty(e, "Redfin", "160, 32, 33"), _defineProperty(e, "Plaid", "0, 177, 232"), _defineProperty(e, "Unity Technologies", "0, 0, 0"), _defineProperty(e, "Tinder", "255, 88, 99"), _defineProperty(e, "Carta", "37, 49, 76"), _defineProperty(e, "NASA JPL", "66, 135, 245"), _defineProperty(e, "Booking.com", "35, 56, 126"), _defineProperty(e, "Adyen", "10,191,83"), _defineProperty(e, "Snowflake", "160, 227, 246"), _defineProperty(e, "Waymo", "0,119,255"), e),
        skillSpectrumPercent: {
            Google: {
                "Software Engineer": 100,
                "Software Engineering Manager": 100,
                "Product Manager": 100,
                "Product Designer": 90.9
            },
            Microsoft: 100,
            LinkedIn: {
                "Software Engineer": 90,
                "Software Engineering Manager": 90,
                "Product Manager": 90,
                "Product Designer": 86.4
            },
            Uber: {
                "Software Engineer": 90,
                "Software Engineering Manager": 90,
                "Product Manager": 90,
                "Product Designer": 85.8
            },
            Facebook: {
                "Software Engineer": 95,
                "Software Engineering Manager": 100,
                "Product Manager": 95,
                "Product Designer": 87.6
            },
            Amazon: {
                "Software Engineer": 95,
                "Software Engineering Manager": 95,
                "Product Manager": 100,
                "Product Designer": 87
            },
            IBM: {
                "Product Manager": 95
            },
            Salesforce: {
                "Software Engineer": 93,
                "Software Engineering Manager": 94,
                "Product Designer": 87
            },
            "Argo AI": {
                "Software Engineer": 92,
                "Software Engineering Manager": 92
            },
            Airbnb: {
                "Software Engineer": 85,
                "Product Manager": 94
            },
            Tesla: {
                "Software Engineer": 93,
                "Software Engineering Manager": 77
            },
            Opendoor: {
                "Software Engineer": 85,
                "Software Engineering Manager": 92
            },
            WeWork: {
                "Software Engineer": 95,
                "Product Manager": 97
            },
            "BCG Digital Ventures": {
                "Software Engineer": 90,
                "Product Manager": 100
            },
            Accenture: {
                "Software Engineer": 90,
                "Management Consultant": 90
            },
            McKinsey: {
                "Management Consultant": 90
            },
            Bain: {
                "Management Consultant": 90
            },
            BCG: {
                "Management Consultant": 90
            },
            Disney: 86,
            Spotify: 94,
            Cloudera: 87,
            Bloomberg: 73,
            MongoDB: 90,
            Expedia: 84,
            Cerner: 82,
            Nvidia: 89,
            eBay: 82,
            Slack: 85,
            "Walmart Labs": {
                "Software Engineer": 85,
                "Product Manager": 97
            },
            Standard: 91,
            Intel: 94,
            SAP: 80,
            Yahoo: 95,
            Pinterest: 80,
            Qualcomm: 86,
            Broadcom: 88,
            Quora: 85,
            SmartThings: 75,
            "General Motors": 75,
            Udacity: 70,
            USAA: 80,
            Indeed: 89,
            "Veritas Technologies": 82,
            Stripe: 93,
            Yelp: 88,
            VMware: 95,
            Autodesk: 93,
            Nextdoor: 81,
            Adobe: 85,
            Intercom: 88,
            Instacart: 90,
            SoFi: 88,
            Careem: 88,
            Pivotal: 80,
            "Just Eat": 93,
            DoorDash: 85,
            Zillow: {
                "Software Engineer": 86,
                "Software Engineering Manager": 88
            },
            OYO: 89,
            Arm: 92,
            Atlassian: 87,
            Square: 83,
            ServiceNow: 95,
            "Goldman Sachs": {
                "Software Engineer": 88
            },
            Wayfair: {
                "Software Engineer": 87,
                "Product Manager": 95
            },
            Dropbox: {
                "Software Engineer": 90,
                "Software Engineering Manager": 82
            },
            Rubrik: 80,
            Okta: 92,
            Glassdoor: 95,
            "Epic Systems": 85,
            ByteDance: 86,
            Mozilla: 97,
            Etsy: 95,
            DocuSign: {
                "Software Engineer": 89,
                "Software Engineering Manager": 84
            },
            Robinhood: 86,
            Cruise: {
                "Software Engineer": 92,
                "Software Engineering Manager": 91
            },
            Roblox: 97,
            Shopify: 95,
            Twilio: 91,
            Affirm: 88,
            "Electronic Arts": 83,
            Coinbase: 93,
            Twitch: 88,
            Flexport: 80,
            Asana: 78,
            AMD: 85,
            Convoy: {
                "Software Engineer": 88,
                "Software Engineering Manager": 88
            },
            Databricks: 87,
            GitHub: 83,
            Ticketmaster: 92,
            Snap: 90,
            UiPath: 91,
            Nutanix: 85,
            SpaceX: 87,
            Redfin: 86,
            Plaid: 85,
            "Unity Technologies": {
                "Software Engineer": 94,
                "Software Engineering Manager": 97
            },
            Tinder: 98,
            "JPMorgan Chase": 86,
            Carta: {
                "Software Engineer": 83,
                "Software Engineering Manager": 88
            },
            Apple: {
                "Software Engineer": 100
            },
            "NASA JPL": 88,
            Reddit: 96,
            "Booking.com": 85,
            Adyen: 80,
            "Capital One": {
                "Software Engineer": 92,
                "Software Engineering Manager": 91
            },
            Snowflake: 94
        },
        companyButtons: {
            "Software Engineer": [{
                name: "Amazon",
                slug: "amazon",
                icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Amazon-512.png"
            }, {
                name: "Microsoft",
                slug: "microsoft",
                icon: "https://i.imgur.com/HTNiPJH.png"
            }, {
                name: "Google",
                slug: "google",
                icon: "https://i.imgur.com/1y1UHYp.png"
            }, {
                name: "Facebook",
                slug: "facebook",
                icon: "https://i.imgur.com/WbP1Dvi.png"
            }, {
                name: "Capital One",
                slug: "capital-one",
                icon: "https://img.logo.dev/capitalone.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Product Manager": [{
                name: "Amazon",
                slug: "amazon",
                icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Amazon-512.png"
            }, {
                name: "Microsoft",
                slug: "microsoft",
                icon: "https://i.imgur.com/HTNiPJH.png"
            }, {
                name: "Google",
                slug: "google",
                icon: "https://i.imgur.com/1y1UHYp.png"
            }, {
                name: "Facebook",
                slug: "facebook",
                icon: "https://i.imgur.com/WbP1Dvi.png"
            }, {
                name: "Capital One",
                slug: "capital-one",
                icon: "https://img.logo.dev/capitalone.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Product Designer": [{
                name: "Facebook",
                slug: "facebook",
                icon: "https://i.imgur.com/WbP1Dvi.png"
            }, {
                name: "Google",
                slug: "google",
                icon: "https://i.imgur.com/1y1UHYp.png"
            }, {
                name: "Amazon",
                slug: "amazon",
                icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Amazon-512.png"
            }, {
                name: "Microsoft",
                slug: "microsoft",
                icon: "https://i.imgur.com/HTNiPJH.png"
            }, {
                name: "IBM",
                slug: "ibm",
                icon: "https://img.logo.dev/ibm.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Management Consultant": [{
                name: "Deloitte",
                slug: "deloitte",
                icon: "https://img.logo.dev/deloitte.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Accenture",
                slug: "accenture",
                icon: "https://img.logo.dev/accenture.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Ernst and Young",
                slug: "ernst-and-young",
                icon: "https://img.logo.dev/ey.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "PwC",
                slug: "pwc",
                icon: "https://img.logo.dev/pwc.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "KPMG",
                slug: "kpmg",
                icon: "https://img.logo.dev/kpmg.ca?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Investment Banker": [{
                name: "Goldman Sachs",
                slug: "goldman-sachs",
                icon: "https://img.logo.dev/goldmansachs.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "JPMorgan Chase",
                slug: "jpmorgan-chase",
                icon: "https://img.logo.dev/jpmorganchase.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Barclays",
                slug: "barclays",
                icon: "https://img.logo.dev/home.barclays?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Citi",
                slug: "citi",
                icon: "https://img.logo.dev/citi.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Morgan Stanley",
                slug: "morgan-stanley",
                icon: "https://img.logo.dev/morganstanley.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Software Engineering Manager": [{
                name: "Amazon",
                slug: "amazon",
                icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Amazon-512.png"
            }, {
                name: "Microsoft",
                slug: "microsoft",
                icon: "https://i.imgur.com/HTNiPJH.png"
            }, {
                name: "Facebook",
                slug: "facebook",
                icon: "https://i.imgur.com/WbP1Dvi.png"
            }, {
                name: "Google",
                slug: "google",
                icon: "https://i.imgur.com/1y1UHYp.png"
            }, {
                name: "Capital One",
                slug: "capital-one",
                icon: "https://img.logo.dev/capitalone.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Civil Engineer": [{
                name: "Kimley Horn",
                slug: "kimley-horn",
                icon: "https://img.logo.dev/kimley-horn.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            "Biomedical Engineer": [{
                name: "Medtronic",
                slug: "medtronic",
                icon: "https://img.logo.dev/medtronic.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Johnson & Johnson",
                slug: "johnson-and-johnson",
                icon: "https://img.logo.dev/jnj.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }, {
                name: "Philips",
                slug: "philips",
                icon: "https://img.logo.dev/philips.com?token=pk_Ez-J4YOpSS-Bjtug_T41Dw"
            }],
            Recruiter: [{
                name: "Amazon",
                slug: "amazon",
                icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Amazon-512.png"
            }, {
                name: "Facebook",
                slug: "facebook",
                icon: "https://i.imgur.com/WbP1Dvi.png"
            }, {
                name: "Google",
                slug: "google",
                icon: "https://i.imgur.com/1y1UHYp.png"
            }, {
                name: "Microsoft",
                slug: "microsoft",
                icon: "https://i.imgur.com/HTNiPJH.png"
            }, {
                name: "Uber",
                slug: "uber",
                icon: "https://i.imgur.com/WWFXHYX.png"
            }]
        }
    }
}
var supportedCountryRegions = new Map([
        ["Australia", 14],
        ["Canada", 43],
        ["Germany", 91],
        ["India", 113],
        ["Ireland", 117],
        ["Israel", 118],
        ["Japan", 122],
        ["Netherlands", 175],
        ["Russia", 203],
        ["Singapore", 219],
        ["Switzerland", 234],
        ["United Kingdom", 253]
    ]),
    supportedDmasByRegion = {
        "Greater SF Bay Area": "807",
        "Greater Seattle Area": "819",
        "Greater NYC Area": "501",
        "Greater LA Area": "803",
        "Greater Boston Area": "506",
        "Greater Chicago Area": "602",
        "Greater Austin Area": "635",
        "Greater Boulder Area": "751"
    },
    supportedDmaIds = new Set(Object.values(supportedDmasByRegion)),
    supportedRegionsbyDmas = reverseObject(supportedDmasByRegion);

function getDMAsForRegions(e) {
    for (var t = new Set, r = 0; r < e.length; r++) {
        var n = supportedDmasByRegion[e[r]];
        void 0 !== n && (t = t.add(n))
    }
    return t
}

function getCitiesByRegions(e) {
    for (var t = {
            "Greater SF Bay Area": ["San Francisco, CA", "Silicon Valley", "SF Bay Area", "Bay Area", "San Francisco", "San Francisco Bay Area", "San Mateo, CA", "Redwood City, CA", "Menlo Park, CA", "Fremont, CA", "Palo Alto, CA", "Santa Clara, CA", "Sunnyvale, CA", "San Jose, CA", "Berkeley, CA", "Oakland, CA", "Mountain View, CA", "Burlingame, CA", "Marin, CA", "Union City, CA", "Pleasanton, CA", "Cupertino, CA"],
            807: ["San Francisco, CA", "San Mateo, CA", "Redwood City, CA", "Menlo Park, CA", "Fremont, CA", "Palo Alto, CA", "Santa Clara, CA", "Sunnyvale, CA", "San Jose, CA", "Berkeley, CA", "Oakland, CA", "Mountain View, CA", "Burlingame, CA", "Marin, CA", "Union City, CA", "Pleasanton, CA", "Cupertino, CA"],
            "Greater Seattle Area": ["Seattle", "Seattle, WA", "Kirkland, WA", "Redmond, WA", "Bellevue, WA"],
            819: ["Seattle, WA", "Kirkland, WA", "Redmond, WA", "Bellevue, WA"],
            "Greater NYC Area": ["New York", "New York, NY", "NYC", "NYC, NY", "Manhattan, NY", "Brooklyn, NY"],
            501: ["New York, NY", "Manhattan, NY", "Brooklyn, NY"],
            "Greater LA Area": ["Los Angeles", "Los Angeles, CA", "Santa Monica, CA", "Santa Monica", "Pasadena, CA", "Pasadena", "Irvine, CA", "Orange County, CA", "Anaheim, CA", "Venice, CA", "Burbank, CA", "Long Beach, CA", "Malibu, CA", "Culver City, CA"],
            "Greater Boston Area": ["Boston", "Boston, MA", "Cambridge", "Cambridge, MA", "Somerville, MA", "Newton, MA", "Quincy, MA", "Brookline, MA", "Malden, MA", "Waltham, MA", "Medford, MA", "Revere, MA", "Watertown, MA", "Lexington, MA"],
            "Greater Chicago Area": ["Chicago", "Chicago, IL", "Joliet, IL", "Naperville, IL", "Schaumburg, IL", "Evanston, IL"],
            "Greater Austin Area": ["Austin, TX"],
            "Greater Boulder Area": ["Boulder", "Boulder, CO", "Denver, CO"]
        }, r = [], n = 0; n < e.length; n++) {
        e[n] = e[n].toString();
        var a = t[e[n]];
        r = r.concat(a)
    }
    return r.filter(function(e) {
        return null != e
    })
}

function convertKeysToLowerCase(e) {
    return Object.keys(e).reduce(function(t, r) {
        return t[r.toLowerCase()] = e[r], t
    }, {})
}

function levelingStandardResponsibilities(e) {
    return {
        L1: "Develop and maintain lower complexity components with guidance and support from experienced team members. This is the new graduate level.",
        L2: "Develop and maintain low to moderately complex components working on a team. Receives minimal amount of guidance and support from senior level peers.",
        L3: "Develop and own moderate to complex components. Possibly lead a small team / project. Ability to mentor engineers, provide technical guidance, code reviews, design and deliver on small projects end-to-end. Impact is typically at the immediate-team scope. This is typically considered a 'career-level', as in you can spend the rest of your career operating at this level.",
        L4: "This level is much more coveted than the previous and typically 10% or less of the entire company. Expected to lead and own complex technical initiatives. Begin setting the vision / future direction of team. Impact across multiple related teams within an org. Role shifts more towards design rather than implementation depending on size / expectations at company. ",
        L5: "Impact spans across organizations. Entrusted with business-critical projects and for setting technical vision for an org or multiple orgs. Responsible for reviewing and providing feedback on technical designs across an org. Little to no day-to-day coding. Role depends highly on organizational / company needs and becomes loosely defined. Expected to operate fully autonomously.",
        L6: "Impact spans across the company and sometimes industry."
    } [e]
}

function reverseObject(e) {
    for (var t = {}, r = Object.keys(e), n = 0; n < r.length; n++) t[e[r[n]]] = r[n];
    return t
}
var CURRENCY_STORAGE_KEY = "renderCurrency",
    LOCALE_STORAGE_KEY = "renderLocale",
    formatCash = function(e, t) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
            n = arguments[3],
            a = arguments[4];
        if (null === e || "" === e || isNaN(e)) return "--";
        var o = getLocalStorageData(LOCALE_STORAGE_KEY, !0) || {};
        n = n || o && o.localeShortCode || navigator.language || "en-US";
        var i = parseFloat(e),
            s = getLocalStorageData(CURRENCY_STORAGE_KEY, !0);
        if (!t && s) {
            var l = a || s.rate || 1;
            i = "USD" !== s.code ? i * l : i, t = s.code
        }
        var c = {
                minimumFractionDigits: 0,
                maximumFractionDigits: r = "BTC" === (t = t || "USD") && r < 5 ? 5 : r,
                style: "currency",
                currency: t
            },
            u = Intl.NumberFormat(n, c).format(i);
        return s && s.symbol && s.code === t && !u.includes(s.symbol) && u.replace(t, s.symbol) || u
    };

function getMaxDigits(e, t, r) {
    var n = t;
    if (null === t || void 0 === t) {
        n = e > 1e6 ? 2 : 1;
        "en-US" === r && (n = e > 1e5 && e < 1e6 ? 0 : n)
    }
    return n || 0
}
var formatCashCompact = function(e, t, r) {
        if (null === e || "" === e || isNaN(e)) return "N/A";
        var n = getLocalStorageData(LOCALE_STORAGE_KEY, !0) || {},
            a = n && n.localeShortCode || navigator.language || "en-US",
            o = parseFloat(e),
            i = getLocalStorageData(CURRENCY_STORAGE_KEY, !0);
        !t && i && (o = "USD" !== i.code ? o * i.rate : o, t = i.code), t = t || "USD", r = getMaxDigits(e, r, a);
        var s = {
                minimumFractionDigits: 0,
                maximumFractionDigits: r = "BTC" === t && r < 5 ? 5 : r,
                style: "currency",
                currency: t,
                notation: "compact"
            },
            l = Intl.NumberFormat(a, s).format(o);
        return i && i.symbol && i.code === t && !l.includes(i.symbol) && l.replace(t, i.symbol) || l
    },
    formatCashNoCurrency = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
            r = arguments[2],
            n = arguments[3];
        if (null === e || "" === e || isNaN(e)) return "--";
        var a = getLocalStorageData(LOCALE_STORAGE_KEY, !0);
        r = r || a && a.localeShortCode || navigator.language || "en-US";
        var o = parseFloat(e),
            i = getLocalStorageData(CURRENCY_STORAGE_KEY, !0);
        !n && i && (o = i.rate ? o * i.rate : o, t = "BTC" === i.code && t < 5 ? 5 : t, n = i.code);
        var s = {
            minimumFractionDigits: t,
            maximumFractionDigits: t,
            style: "decimal",
            currency: n = n || "USD"
        };
        return Intl.NumberFormat(r, s).format(o)
    },
    formatCashCompactNoCurrency = function(e, t, r, n) {
        if (null === e || "" === e || isNaN(e)) return "N/A";
        var a = getLocalStorageData(CURRENCY_STORAGE_KEY, !0),
            o = getLocalStorageData(LOCALE_STORAGE_KEY, !0);
        r = r || o && o.localeShortCode || navigator.language || "en-US";
        var i = parseFloat(e);
        !n && a && (i = "USD" !== a.code ? i * a.rate : i, n = a.code), n = n || "USD", t = getMaxDigits(e, t, r);
        var s = {
            minimumFractionDigits: 0,
            maximumFractionDigits: t = "BTC" === n && t < 5 ? 5 : t,
            style: "decimal",
            notation: "compact",
            currency: n
        };
        return Intl.NumberFormat(r, s).format(i)
    },
    formatDate = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "standard",
            r = navigator.language || "en-US",
            n = {};
        return "standard" === t ? (n.year = "numeric", n.month = "2-digit", n.day = "2-digit") : n.dateStyle = t, Intl.DateTimeFormat(r, n).format(e)
    };

function timeSince(e) {
    "object" !== (void 0 === e ? "undefined" : _typeof(e)) && (e = new Date(e));
    var t, r = Math.floor((new Date - e) / 1e3),
        n = Math.floor(r / 31536e3);
    return n >= 1 ? t = "year" : (n = Math.floor(r / 2592e3)) >= 1 ? t = "month" : (n = Math.floor(r / 86400)) >= 1 ? t = "day" : (n = Math.floor(r / 3600)) >= 1 ? t = "hour" : (n = Math.floor(r / 60)) >= 1 ? t = "minute" : (n = r, t = "second"), (n > 1 || 0 === n) && (t += "s"), n + " " + t
}

function average(e) {
    return e.reduce(function(e, t) {
        return e + t
    }, 0) / e.length
}

function standardDeviation(e) {
    var t = average(e),
        r = average(e.map(function(e) {
            var r = e - t;
            return r * r
        }));
    return Math.sqrt(r)
}

function getSalariesFilteredByTrailingYear(e) {
    var t = new Date,
        r = t.setMonth(t.getMonth() - 12);
    return e = e.filter(function(e) {
        return new Date(e.timestamp) > r
    })
}

function getStandardSalaryPercentiles(e) {
    for (var t = [.1, .25, .5, .75, .9], r = [], n = 0; n < t.length; n++) {
        var a = getSalaryByPercentile(e, t[n]);
        r.push(a || 0)
    }
    return r
}

function getSalaryByPercentile(e, t) {
    var r = ((e = e.sort(function(e, t) {
            return e - t
        })).length - 1) * t,
        n = Math.floor(r),
        a = r - n;
    return void 0 !== e[n + 1] ? e[n] + a * (e[n + 1] - e[n]) : e[n]
}

function ResponseUtil() {
    var e = "levelstothemoon!!",
        t = 16;
    return {
        parse: function(r) {
            if (!r.payload) return r;
            var n = r.payload,
                a = CryptoJS.MD5(e).toString(CryptoJS.enc.Base64).substr(0, t),
                o = CryptoJS.AES.decrypt({
                    ciphertext: CryptoJS.enc.Base64.parse(n)
                }, CryptoJS.enc.Utf8.parse(a), {
                    mode: CryptoJS.mode.ECB,
                    iv: null
                }).toString(CryptoJS.enc.Base64),
                i = atob(o).split("").map(function(e) {
                    return e.charCodeAt(0)
                }),
                s = pako.inflate(i, {
                    to: "string"
                });
            return JSON.parse(s)
        }
    }
}

function camelCaseToKebabCase(e) {
    return e.replace(/[A-Z]/g, function(e) {
        return "-" + e.toLowerCase()
    })
}

function camelCaseToSpaced(e) {
    return e.replace(/([a-z])([A-Z])/g, "$1 $2")
}

function applyHiddenIfAnonymized(e, t) {
    var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "hidden";
    return isAnonymized(e, t) ? anonStyleWrapper(e, r) : t
}

function isAnonymized(e, t) {
    return "boolean" == typeof t && !1 === t || anonymizableYearsKeys.includes(e) && "string" == typeof t
}

function anonStyleWrapper(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "hidden",
        r = '<span \n    class="anonymization text-muted" \n    data-toggle="tooltip" \n    data-placement="right"\n    data-key="' + e + '"\n    title="' + capitalizeFirstLetter(camelCaseToSpaced(e)) + ' for this data point is hidden until there are more submissions."\n  >' + t + "</span>";
    return anonymizableYearsKeys.includes(e) ? r : '<span class="text-muted">(' + r + ")</span>"
}

function applyAnonTooltip(e) {
    var t = e[0] ? e[0].dataset.key : null;
    e.on("click", function(e) {
        e.stopPropagation()
    }).tooltip({
        placement: "level" === t ? "top" : "right",
        trigger: "hover",
        container: "body",
        template: '<div class="tooltip levelsTooltipOuter" role="tooltip">\n        <div class="tooltip-arrow arrow" style="border-' + ("level" === t ? "top" : "right") + '-color: #071230 !important;"></div>\n        <div class="tooltip-inner lfont" style="background: #071230;"></div>\n        </div>'
    })
}
var COMP_MULTIPLIER = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
        t: 1e3,
        l: 1e5,
        lac: 1e5,
        lak: 1e5,
        cr: 1e7
    },
    COMPENSATION_VALUE_RE = /(aed|aud|a\$|au\$|brl|r\$|cad|c\$|ca\$|chf|cny|¥|czk|kč|eur|€|gbp|£|hkd|hd\$|ils|inr|₹|jpy|mxn|mex\$|nzd|nz\$|rub|₽|sar|sek|sgd|s\$|thb|twd|nt\$|usd|us\$|\$|zar)\s?(\d[\d,]*\.?(?=\d+)\d*)(k|m|b|lac|lak|cr)?/gim,
    CURRENCY_AND_ISO_CODE = [
        [/^(aed)$/, "AED"],
        [/^(aud|a\$|au\$)$/, "AUD"],
        [/^(brl|r\$)$/, "BRL"],
        [/^(cad|c\$|ca\$)$/, "CAD"],
        [/^(chf)$/, "CHF"],
        [/^(cny|¥)$/, "CNY"],
        [/^(czk|kč)$/, "CZK"],
        [/^(eur|€)$/, "EUR"],
        [/^(gbp|£)$/, "GBP"],
        [/^(hkd|hd\$)$/, "HKD"],
        [/^(ils)$/, "ILS"],
        [/^(inr|₹)$/, "INR"],
        [/^(pkr|₨)$/, "PKR"],
        [/^(pln|zł)$/, "PLN"],
        [/^(jpy)$/, "JPY"],
        [/^(mxn|mex\$)$/, "MXN"],
        [/^(nzd|nz\$)$/, "NZD"],
        [/^(rub|₽)$/, "RUB"],
        [/^(sar)$/, "SAR"],
        [/^(sek)$/, "SEK"],
        [/^(sgd|s\$)$/, "SGD"],
        [/^(thb)$/, "THB"],
        [/^(twd|nt\$)$/, "TWD"],
        [/^(usd|us\$|\$)$/, "USD"],
        [/^(zar)$/, "ZAR"]
    ];

function currencyToIsoCode(e) {
    var t = !0,
        r = !1,
        n = void 0;
    try {
        for (var a, o = CURRENCY_AND_ISO_CODE[Symbol.iterator](); !(t = (a = o.next()).done); t = !0) {
            var i = a.value,
                s = _slicedToArray(i, 2),
                l = s[0],
                c = s[1];
            if (l.test(e)) return c
        }
    } catch (e) {
        r = !0, n = e
    } finally {
        try {
            !t && o.return && o.return()
        } finally {
            if (r) throw n
        }
    }
}

function extractCashValueFromText(e) {
    if (e) return COMPENSATION_VALUE_RE.lastIndex = 0, [].concat(_toConsumableArray(e.matchAll(COMPENSATION_VALUE_RE))).map(function(e) {
        var t = _slicedToArray(e, 4),
            r = t[0],
            n = t[1],
            a = t[2],
            o = t[3],
            i = void 0;
        n && (i = currencyToIsoCode(n));
        var s = 1;
        o && (s = COMP_MULTIPLIER[o.toLowerCase()] || 1);
        var l = a;
        return a && (l = +a.replace(/,/g, "") * s), isNaN(l) || !isFinite(l) ? null : {
            currency: i,
            amount: l,
            originalValue: r,
            multiplier: s
        }
    }).filter(Boolean)
}

function getLocalStorageData(e, t) {
    if (window.isLocalStorageNameSupported && isLocalStorageNameSupported()) {
        var r = window.localStorage.getItem(e);
        if (null !== r) {
            if (r = JSON.parse(r), t) return r;
            var n = r.timestamp;
            if (!(new Date > new Date(n))) return r.value;
            window.localStorage.removeItem(e)
        }
    }
}
"undefined" != typeof exports && (exports.findShortestTitleName = findShortestTitleName, exports.encodeNameForUrl = encodeNameForUrl, exports.shortenAddress = shortenAddress, exports.levelNameMatches = levelNameMatches, exports.determineCountryToFilterTo = determineCountryToFilterTo, exports.getAverageSalaryInfo = getAverageSalaryInfo, exports.getMedianSalaryInfo = getMedianSalaryInfo, exports.getMedianSalaryRow = getMedianSalaryRow, exports.filterSalariesByStd = filterSalariesByStd, exports.getNumRowsForCompanyAndLevel = getNumRowsForCompanyAndLevel, exports.isEmail = isEmail, exports.getCitiesByRegions = getCitiesByRegions, exports.getCurrentVisibleTracks = getCurrentVisibleTracks, exports.average = average, exports.standardDeviation = standardDeviation, exports.formatCash = formatCash, exports.formatCashCompact = formatCashCompact, exports.formatCashNoCurrency = formatCashNoCurrency, exports.formatCashCompactNoCurrency = formatCashCompactNoCurrency, exports.formatDate = formatDate, exports.timeSince = timeSince, exports.numberWithCommas = numberWithCommas, exports.compactNumber = compactNumber, exports.compactDollarFormatter = compactDollarFormatter, exports.getSalariesFilteredByTrailingYear = getSalariesFilteredByTrailingYear, exports.getStandardSalaryPercentiles = getStandardSalaryPercentiles, exports.getSalaryByPercentile = getSalaryByPercentile, exports.getFilteredSalaryRows = getFilteredSalaryRows, exports.hideSalaryBreakdowns = hideSalaryBreakdowns, exports.ResponseUtil = ResponseUtil, exports.camelCaseToKebabCase = camelCaseToKebabCase, exports.camelCaseToSpaced = camelCaseToSpaced, exports.anonStyleWrapper = anonStyleWrapper, exports.applyAnonTooltip = applyAnonTooltip, exports.isAnonymized = isAnonymized, exports.applyHiddenIfAnonymized = applyHiddenIfAnonymized);