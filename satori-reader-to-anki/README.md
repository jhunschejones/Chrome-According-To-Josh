# Satori Reader To Anki

### Description
This is a neat little Chrome extension that adds an `Add to Anki` button in the Satori Reader review view. It is currently hard-coded with my card model and fields, but feel free to fork this code and make it your own!

### Setup
The only setup that is required is to install the [anki-connect](https://ankiweb.net/shared/info/2055492159) Anki add-on and then modify the extension settings to include `https://www.satorireader.com` as the first allowed origin:

```json
{
    "apiKey": null,
    "apiLogPath": null,
    "ignoreOriginList": [],
    "webBindAddress": "127.0.0.1",
    "webBindPort": 8765,
    "webCorsOriginList": [
        "https://www.satorireader.com",
        "http://localhost"
    ]
}
```
