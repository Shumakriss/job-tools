/*
* This file stores functions built on the Google Docs interaction
*/

/*
* Based on https://developers.google.com/docs/api/how-tos/merge
*/
async function mergeTextInResume(docId, jobTitle) {
    console.log("Merging job title '" + jobTitle + " to doc: " + docId);
    let requests = [
        {
            replaceAllText: {
                containsText: {
                    text: '{{job-title}}',
                    matchCase: true,
                },
                replaceText: jobTitle,
            },
        }
    ];

    let requestPayload = {
        documentId: docId,
        resource: {
            requests,
        },
    };
    let errorHandler = (err, {data}) => {
        console.log("There was an error")
        if (err) return console.log('The API returned an error: ' + err);
            console.log(data);
    }

    await gapi.client.docs.documents.batchUpdate(requestPayload, errorHandler);
    console.log("All done");
}