let httpReference = dependencies.http;


/**
 * Gets a configuration from the properties.
 *
 * @param {string} property - The name of the property to get. If it is empty, return the entire configuration object.
 * @return {string} - The value of the property or the whole object as string.
 */
exports.getConfiguration = function (property) {
    if (!property) {
        return config.get();
    }
    return config.get(property);
};

// this is the default model if nothing is specified
let defaultModel = 'gemini-1.5-flash';

/**
 * Lists all the models available.
 *
 * @returns {string[]} - The names of the available models
 */
exports.listModels = function() {
    let res = pkg.googlegemini.api.get('/v1/models');
    let modelNames = [];
    for (let model of res.models) {
        let nameWithoutPrefix = model.name.replace("models/", "");
        modelNames.push(nameWithoutPrefix);
    }
    return modelNames;
};

/**
 * Generates content based on a text prompt. Using the selected model.
 *
 * @param prompt - The text prompt to send to Google Gemini
 * @param options - Optional. Object with options. Currently, the only option is `model` where you can pass the name of the model to use. Otherwise, the default one will be used.
 * @returns {string} - The text response from the model
 */
exports.generateContentFromText = function(prompt, options) {
    let model = options && options.model ? options.model : defaultModel;
    let requestBody = {
        'contents': [
            {
                'parts': [
                    {text: prompt}
                ]
            },
        ]
    };
    let res = pkg.googlegemini.api.post({
        path: `/v1/models/${model}:generateContent`,
        body: requestBody
    });
    return res.candidates[0].content.parts[0].text;
};


/**
 * This function uploads a file, given its ID.
 *
 * @param {string} fileId - The unique identifier of the file to be uploaded.
 *
 * @returns {string} - The URI of the uploaded file
 */
exports.uploadFile = function (fileId) {
    let fileContentType, fileName;
    let file = sys.files.open(fileId);
    try {
        fileName = file.descriptor().name();
        fileContentType = file.descriptor().type();
    } finally {
        file.close();
    }
    let res = pkg.googlegemini.api.post({
        path: `/upload/v1beta/files`,
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Type': fileContentType
        },
        body: {
            file: {
                displayName: fileName
            }
        },
        settings: {
            fullResponse: true
        }
    });

    let uploadUrl = res.headers['X-Goog-Upload-URL'];
    sys.logs.debug('[google-gemini] Uploading file to URL: ' + uploadUrl);

    // We need to make a call outside the domain, so we need to use the HTTP service directly
    res = httpReference.post({
        url: uploadUrl,
        headers: {
            'X-Goog-Upload-Offset': '0',
            'X-Goog-Upload-Command': 'upload, finalize'
        },
        params: {
            key: config.get("apiKey")
        },
        settings: {
            multipart: true,
            fullResponse: true,
            parts: [
                {
                    name: 'file',
                    type: 'file',
                    fileId: fileId
                }
            ]
        }
    });

    return res.body.file.uri;
};