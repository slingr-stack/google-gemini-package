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
    let res = app.gemini.api.get('/v1/models');
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
    let res = app.gemini.api.post({
        path: `/v1/models/${model}:generateContent`,
        body: requestBody
    });
    return res.candidates[0].content.parts[0].text;
};