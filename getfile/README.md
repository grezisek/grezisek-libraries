# getfile

This library will download desired file and use localStorage api to save fetched data.
Getfile will only fetch when file is not in localStorage or live version is newer than localStorage version.
When saving to localStorage, saved data is compared with original, so overflowed and not valid localStorage data will be removed automatically.

## Usage
Function getFile can be used in sync or async style.

Sync:
```
getFile("./path/to.file").then(function(data){
  //console.log(data);
});
```

Async:
```
const data = await getFile("./path/to.file");
//console.log(data);
```
