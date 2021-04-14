async function getFile(filePath = "") {
    //solve cache
    const fileHeadRequest = new Request(filePath, {method: "HEAD"});
    const fileHeadResponse = await fetch(fileHeadRequest);
    const fileLastModified = fileHeadResponse.headers.get("Last-Modified");

    let local = localStorage.getItem("grezisek-"+filePath);
    if (local) local = JSON.parse(local)
    else local = {lastModified: "Thu, 01 Jan 1970 00:00:00 GMT"};

    //cached return
    if (local.lastModified == fileLastModified) return local.data;
    
    //new fetch
    const fileRequest = new Request(filePath, {cache: "reload"});
    const fileResponse = await fetch(fileRequest);
    const fileData = await fileResponse.text();

    localStorage.setItem("grezisek-"+filePath, JSON.stringify({lastModified: fileLastModified, data: fileData}));
    if (JSON.parse(localStorage.getItem("grezisek-"+filePath).data) != fileData) localStorage.removeItem("grezisek-"+filePath);

    //live return
    return fileData;
}
