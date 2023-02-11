// This script is a Service Worker script that listens for requests from a web page and acts as an intermediary between the web page and the network.
// The handleRequest function is used to handle the fetch requests made by the web page. This function checks if the URL of the request starts with /files/ and if so, it uses the getCDN function to determine the best available CDN (Content Delivery Network) from a list of 4 options. Then the handleRequest function uses the fetch API to retrieve the content from the selected CDN.
// If the request URL does not start with /files/, the Service Worker returns the response from the cache if it's available, otherwise it fetches the response from the network.
// The install event is used to install the Service Worker, and it adds the manifest.json file to the cache.
// The Service Worker acts as a caching layer between the web page and the network and ensures that the web page has fast, reliable access to the required resources, even when the network is slow or unavailable.

async function isBlocked(url) {
  try {
    var README = await fetch(url + "/README.md");
    var content = await README.text();
    if (content.startsWith("# 3kh0 Assets")) {
      return false;
    } else {
      return true;
    }
  } catch {
    return true;
  }
}

async function getCDN(cdns) {
  for (let cdn in cdns) {
    var blocked = await isBlocked(cdns[cdn]);
    if (!blocked) {
      return cdns[cdn];
    }
  }

  return cdns[0];
}
async function handleRequest(fetchPath) {
  var currentCDN = await getCDN(["https://raw.githack.com/3kh0/3kh0-assets/main", "https://d1wnfatapmxxni.cloudfront.net", "https://d38a7mob3guz4f.cloudfront.net", "https://cloudbase-labs.s3.amazonaws.com"]);

  fetchPath = currentCDN + "/" + fetchPath;

  if (!fetchPath.endsWith(".html")) {
    try {
      return await fetch(fetchPath);
    } catch (error) {
      console.error(`Fetch request for ${fetchPath} failed with error: ${error}`);
    }
  }

  try {
    var customFetch = await fetch(fetchPath);
    var htmlCode = await customFetch.text();

    var newHeaders = Object.assign({}, customFetch.rawHeaders);

    newHeaders["content-type"] = "text/html";

    return new Response(htmlCode, {
      status: customFetch.status,
      headers: newHeaders,
    });
  } catch (error) {
    console.error(`Fetch request for ${fetchPath} failed with error: ${error}`);
  }
}

self.addEventListener("fetch", function (e) {
  var path = new URL(e.request.url).pathname;

  if (path.startsWith("/files/")) {
    var fetchPath = path.split("/files/")[1];

    return e.respondWith(handleRequest(fetchPath));
  } else {
    return e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open("3kh0").then(function (cache) {
      return cache.addAll(["/manifest.json"]);
    })
  );
  self.skipWaiting();
});
