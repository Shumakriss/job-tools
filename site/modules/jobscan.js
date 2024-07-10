const jobscanUrl = 'https://api.jobscan.co/v4/scan'

async function jobscan(cookie, xsrfToken, resume, jobDescription) {
    console.log("Calling jobscan API");
//    console.log("Calling jobscan with resume\"" + resume + "\" and job description \"" + jobDescription + "\"");

    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7",
        "Accepts": "application/json",
        "Content-Length": "96",
        "Content-Type": "application/json",
        "Cookie": cookie,
        "Origin": "https://app.jobscan.co",
        "Priority": "u=1, i",
        "Referer": "https://app.jobscan.co/",
        "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "macOS",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "X-Spa-Version": "2024-07-03-a-S",
        "X-Xsrf-Token": xsrfToken
    }

    let payload = {
        "cv": resume,
        "jd": jobDescription,
        "coverletter": "",
        "conversion_id": null,
        "coverletter_conversion_id": null
    }

    try {
        const request = new Request(jobscanUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });

        const response = await fetch(request);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
//        console.log(json);
        console.log("Scan complete");
        return json;
      } catch (error) {
        console.error(error.message);
      }
}