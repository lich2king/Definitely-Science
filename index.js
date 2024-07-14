import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";

import { createBareServer } from "@tomphttp/bare-server-node";
import cors from "cors";

import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import axios from 'axios';
import cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const bareServer = createBareServer("/ov/")


app.use(express.json());


// Function to read file content
function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}

app.get('/class/:className', async (req, res) => {
  const className = req.params.className;
  try {
      const filePath = path.join(__dirname, 'public', 'class.html');
      const headPath = path.join(__dirname, 'src', 'head.html');
      const footerPath = path.join(__dirname, 'src', 'footer.html');
      const navbarPath = path.join(__dirname, 'src', 'navbar.html');

      const [htmlContent, headContent, footerContent, navbarContent] = await Promise.all([
        readFileContent(filePath),
        readFileContent(headPath),
        readFileContent(footerPath),
        readFileContent(navbarPath)
    ]);

      // Replace placeholders with actual content
      let modifiedData = htmlContent
          .replace(/{{className}}/g, className)
          .replace(/{{head}}/g, headContent)
          .replace(/{{footer}}/g, footerContent)
          .replace(/{{navbar}}/g, navbarContent);

      res.send(modifiedData);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    res.status(500).send('Server error');
  }
});

app.get('/app/:appName', async (req, res) => {
    const appName = req.params.appName;
    try {
        const filePath = path.join(__dirname, 'public', 'app.html');
        const headPath = path.join(__dirname, 'src', 'head.html');
        const footerPath = path.join(__dirname, 'src', 'footer.html');
        const navbarPath = path.join(__dirname, 'src', 'navbar.html');
  
        const [htmlContent, headContent, footerContent, navbarContent] = await Promise.all([
          readFileContent(filePath),
          readFileContent(headPath),
          readFileContent(footerPath),
          readFileContent(navbarPath)
      ]);
  
        // Replace placeholders with actual content
        let modifiedData = htmlContent
            .replace(/{{appName}}/g, appName)
            .replace(/{{head}}/g, headContent)
            .replace(/{{footer}}/g, footerContent)
            .replace(/{{navbar}}/g, navbarContent);
  
        res.send(modifiedData);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      res.status(500).send('Server error');
    }
  });

app.get('/app2/:appName', async (req, res) => {
    const appName = req.params.appName;
    try {
        const filePath = path.join(__dirname, 'public', 'app2.html');
        const headPath = path.join(__dirname, 'src', 'head.html');
        const footerPath = path.join(__dirname, 'src', 'footer.html');
        const navbarPath = path.join(__dirname, 'src', 'navbar.html');
  
        const [htmlContent, headContent, footerContent, navbarContent] = await Promise.all([
          readFileContent(filePath),
          readFileContent(headPath),
          readFileContent(footerPath),
          readFileContent(navbarPath)
      ]);
  
        // Replace placeholders with actual content
        let modifiedData = htmlContent
            .replace(/{{appName}}/g, appName)
            .replace(/{{head}}/g, headContent)
            .replace(/{{footer}}/g, footerContent)
            .replace(/{{navbar}}/g, navbarContent);
  
        res.send(modifiedData);
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      res.status(500).send('Server error');
    }
  });


// Middleware to handle template replacements
app.use(async (req, res, next) => {
  let reqPath = req.path;
  
  // Determine if the request is for the root URL or a subfolder
  if (reqPath === '/' || reqPath.endsWith('/')) {
      reqPath = path.join(reqPath, 'index.html');
  }

  if (reqPath.endsWith('.html')) {
      try {
          const filePath = path.join(__dirname, 'public', reqPath);
          
          // Check if the file exists
          try {
              await fs.promises.access(filePath);
          } catch (err) {
            console.error(`File not found: ${filePath}`);
            return next(); // Call next() to pass the request to the next middleware
          }

          const className = req.params.className || '';
          const headPath = path.join(__dirname, 'src', 'head.html');
          const footerPath = path.join(__dirname, 'src', 'footer.html');
          const navbarPath = path.join(__dirname, 'src', 'navbar.html');
          const scriptToAdd = `
            <script>
                if (window.location.hostname !== 'totallyscience.co') {
                    window.location.href = 'https://totallyscience.co';
                }
            </script>`;

          console.log(`Reading file: ${filePath}`);
          const [htmlContent, headContent, footerContent, navbarContent] = await Promise.all([
              readFileContent(filePath),
              readFileContent(headPath),
              readFileContent(footerPath),
              readFileContent(navbarPath)
          ]);

            let modifiedNavbarContent = navbarContent;

            if (!navbarContent.includes('totallyscience.co')) {
                modifiedNavbarContent += scriptToAdd;
            }

          console.log('Successfully read all files');

          // Replace placeholders with actual content
          let modifiedData = htmlContent
              .replace(/{{className}}/g, className)
              .replace(/{{head}}/g, headContent)
              .replace(/{{footer}}/g, footerContent)
              .replace(/{{navbar}}/g, modifiedNavbarContent);

          console.log('Successfully replaced placeholders');
          res.send(modifiedData);
      } catch (error) {
          console.error(`Error processing request: ${error.message}`);
          res.status(500).send('Server error');
      }
  } else {
      next();
  }
});





app.use(express.static("public"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.use("/ov", cors({ origin: true }));

app.use((req, res, next) => {
    if (req.url.includes(".php")) {
        const newUrl = req.url.replace(".php", ".html");
        res.redirect(301, newUrl);
    } else {
        next();
    }
});


///////////////////////
// Function to fetch the HTML content of the page
async function fetchPage(url) {
    try {
        const response = await axios.get(url, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://definitelyscience.com/' // You might want to change this based on your actual referer.
            }
        });
        console.log("Successfully fetched page with status code:", response.status);
        console.log("Response Headers:", response.headers);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Failed to fetch page: ", error.message);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up the request:", error.message);
        }
        return null;
    }
}

// Function to extract URLs containing 'roblox'
function extractRobloxLinks(html) {
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (href && href.includes('roblox')) {
            links.push(href);
        }
    });
    return links;
}

// Endpoint to handle crawling requests
app.post('/api2/crawl', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        console.log("No URL provided");
        return res.status(400).json({ error: 'URL parameter is required.' });
    }
	const referer = req.get('Referer');
	if (!referer) {
        console.log("No Referer header provided");
        return res.status(403).json({ error: 'Unauthorized request.' });
    }
	const refererDomain = new URL(referer).hostname;
    const requestDomain = req.hostname;
    if (refererDomain !== requestDomain) {
        console.log(`Unauthorized request from: ${refererDomain}`);
        return res.status(403).json({ error: 'Unauthorized request.' });
    }
	
    console.log("Attempting to crawl URL:", url);
    const html = await fetchPage(url);
    if (html) {
        console.log("Page fetched, extracting links...");
        const robloxLinks = extractRobloxLinks(html);
        console.log("Links extracted:", robloxLinks);
        res.json({ links: robloxLinks });
    } else {
        console.error("Failed to fetch URL:", url);
        res.status(500).json({ error: 'Failed to fetch the requested URL.' });
    }
});
////////////////////////



// Error for everything else
app.use((req, res) => {
  res.status(404);
  //res.sendFile(join("public", "404.html"));
  res.sendFile(path.join(__dirname, 'public', '404.html'));
});


const server = createServer();

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
})

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/"))
    wisp.routeRequest(req, socket, head);
  else
  {
	  if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	  } else {
		socket.end();
	  }
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 80;

server.on("listening", () => {
  const address = server.address();

  console.log("Server:");
  console.log(`\thttp://${hostname()}:${address.port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  process.exit(0);
}

server.listen({
  port,
});