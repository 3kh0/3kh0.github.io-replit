const express = require("express");
const fetch = require("node-fetch"); // How we are actually proxying the assets
const kuler = require("kuler"); // Console colors
const app = express();

const proxyUrl = "3kh0.github.io";
console.log(kuler("Proxying the domain: " + proxyUrl, "#00ffdd"));
app.get("/*", async (req, res) => {
  const proxied = await fetch("https://" + proxyUrl + req.url); // Get the asset from the website
  const mime = proxied.headers.get("content-type"); // Send the correct MIME type so the browser knows what it is
  res.set("Content-Type", mime.split(";")[0]); // Setting the MIME type
  const body = new Buffer.from(await proxied.arrayBuffer()); // Get the buffer of the asset
  res.status(proxied.status); // Send the correct HTTP Response back
  res.write(body); // Write the buffered asset to the response
  res.end();
});

// Here we start the proxy
app.listen(3000, () => {
  console.log(`
██████╗ ██╗   ██╗███████╗███████╗██╗   ██╗
██╔══██╗██║   ██║██╔════╝██╔════╝╚██╗ ██╔╝
██████╔╝██║   ██║█████╗  █████╗   ╚████╔╝ 
██╔══██╗██║   ██║██╔══╝  ██╔══╝    ╚██╔╝  
██████╔╝╚██████╔╝██║     ██║        ██║   
╚═════╝  ╚═════╝ ╚═╝     ╚═╝        ╚═╝   
https://github.com/retronbv/buffy
`)
  console.log(kuler("Server has been started! Listening on port 3000", "#00ff00"));
  console.log("Link to view: " + kuler(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`, "#0000ff"));
});