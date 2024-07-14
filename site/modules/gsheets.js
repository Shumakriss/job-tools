function callback() {
    console.log("Callback");
}

async function appendApplicationLog(sheetId, companyName) {
    console.log("Append application log");
    const currentDate = new Date();
    const dateString = (currentDate.getMonth() + 1) + "/" + currentDate.getDate();
    let values = [
        [
          companyName, "Applied", dateString
        ],
      ];
    try {
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: "sheetId",
        range: "Sheet1!A1:D1",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values,
        },
    }).then((response) => {
      const result = response.result;
      console.log(`${result.updates.updatedCells} cells appended.`);
      if (callback) callback(response);
    });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
  }
}