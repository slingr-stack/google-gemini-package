# Overview

This package helps to connect to Google Gemini API. It has the following features:

- Authentication through API key
- Direct access to the API
- Helpers to make it easier to use Google Gemini from your app

Keep in mind that OAuth authentication is not supported so far. This means it is not possible to use the API for semantic retrieval.

# Configuration

These are the configuration parameters:

- `API Key`: this is the API key for Google Gemini. For more information on how to get it, please look at its documentation [here](https://ai.google.dev/gemini-api/docs/api-key).

# Javascript API

## HTTP calls

You can make standard HTTP requests to the Google Gemini API:

```js
// list all models available
let res = pkg.googlegemini.get('/v1/models');

// generate content using google gemini
let res = pkg.googlegemini.post({
    path: '/v1/models/gemini-1.5-flash:generateContent',
    body: {
        'contents': [
            {
                'parts': [
                    {text: 'What is Slingr? Answer in one sentence.'}
                ]
            },
        ]

    }
});
```

The package automatically handles authentication, so no need to worry about that.

More information about making HTTP calls, please refer to the documentation of the [HTTP service](https://github.com/slingr-stack/http-service). 

Finally, there are some helpers that are explained below.

## List models

```js
pkg.googlegemini.utils.listModels()
```

Returns an array with the names of the models, like `gemini-1.5-flash`, for example.

Examples:

```js
let models = pkg.googlegemini.utils.listModels();
log(JSON.stringify(models));
```

## Generate content from text

```js
pkg.googlegemini.utils.generateContentFromText(prompt, options);
```

Sends the text prompt to Google Gemini and returns the text response. This is the most common use case for Google Gemini.

Parameters:

- `prompt`: a text prompt to send to Google Gemini.
- `options`: optional object with options. Today, the only available option is `model` and is the name of the model (for example, `gemini-1.5-flash`).

Examples:

```js
// use the default model
let response = pkg.googlegemini.utils.generateContentFromText('What is Slingr? Answer in one sentence.');
log(response);

// specify the model
response = pkg.googlegemini.utils.generateContentFromText('What is Slingr? Answer in one sentence.', {model: 'gemini-1.0-pro'});
log(response);
```

# About Slingr

Slingr is a low-code rapid application development platform that speeds up development,
with robust architecture for integrations and executing custom workflows and automation.

[More info about Slingr](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
