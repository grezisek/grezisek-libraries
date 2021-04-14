# getfile

This library will download desired file and use [localStorage api](https://developer.mozilla.org/pl/docs/Web/API/Window/localStorage) to save fetched data.
Getfile will only [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) when file is not in localStorage or live version is newer than localStorage version.
When saving to localStorage, saved data is compared with original, so [overflowed](https://stackoverflow.com/a/14191200/15480072) and not valid localStorage data will be removed automatically.

## Usage
Function getFile can be used in sync or [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) [style](https://stackoverflow.com/a/2035662/15480072).

Sync:
```
getFile("./path/to.file").then(function(data){
  console.log(data);
});

getFile("./path/to.file").then(data => console.log(data));

getFile("./path/to.file").then(console.log);

```
Async:
```
/*var*/ /*let*/ const data = await getFile("./path/to.file");
console.log(data);
```

## Details

### Ways of adding library to project

- **Copy and Paste** [this](https://raw.githubusercontent.com/grezisek/grezisek-libraries/main/getfile/getfile.js) into your `<script>` tag or script file. Library will be usable in scope.
- **Link to a .js file** in your project by adding `<script>` with valid `src=""` attribute.

### Support of file types and environments

Everything, that fits in browser's localStorage should be fine:

- **.txt files** is typical usage scenario. Create static database file, article content, product list or private collection of own poems and use them as you want.
- **.html, .css, .js files** should be fine. If your css is flooded with poems and javascript is quoting them all[,](https://en.wikipedia.org/wiki/So_What%3F_(Anti-Nowhere_League_song)) get them local.
- **image, video, audio files** are worth trying. Keep in mind localStorage limitations and you should be good to go.
- **.csv, .zip, .iso, .poem files** were not checked. Try one.



### Cookies and privacy

Library is not using cookies. Cookies are shared between browser and server - localStorage exists only inside browser.
It still can he read by server, script or **malicious code**, so always think twice about safety.
