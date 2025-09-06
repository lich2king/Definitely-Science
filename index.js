import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
//import { join } from "node:path";
import { hostname } from "node:os";
//import wisp from "wisp-server-node";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

import { createBareServer } from "@tomphttp/bare-server-node";
import cors from "cors";

import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import validator from 'validator';

import { createRequire } from "node:module";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
// const scramjetDistPath = path.join(
//   path.dirname(require.resolve("@mercuryworkshop/scramjet/package.json")),
//   "dist"
// );
// Resolve the exported entry file, then find the nearest "dist" folder
const scramjetEntry = require.resolve("@mercuryworkshop/scramjet");
let probe = dirname(scramjetEntry);
const root = path.parse(probe).root;
while (probe !== root && !fs.existsSync(path.join(probe, "dist", "scramjet.all.js"))) {
  probe = dirname(probe);
}
const scramjetDistPath = path.join(probe, "dist");

const app = express();
const bareServer = createBareServer("/bare/")


app.use(express.json());

wisp.options.dns_method = "resolve";
wisp.options.dns_servers = ["1.1.1.3", "1.0.0.3"];
wisp.options.dns_result_order = "ipv4first";
wisp.options.allow_udp_streams = false;

logging.set_level(logging.NONE);

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
  const className = validator.escape(req.params.className);
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

app.get('/class2/:className', async (req, res) => {
  const className = validator.escape(req.params.className);
  try {
      const filePath = path.join(__dirname, 'public', 'class2.html');
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

app.get('/classes/:className', async (req, res) => {
  const className = validator.escape(req.params.className);
  try {
      const filePath = path.join(__dirname, 'public', 'classes.html');
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
          .replace(/{{classesName}}/g, className)
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
    const appName = validator.escape(req.params.appName);
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
    const appName = validator.escape(req.params.appName);
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

app.get('/app3/:appName', async (req, res) => {
    const appName = validator.escape(req.params.appName);
    try {
        const filePath = path.join(__dirname, 'public', 'app3.html');
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

          const className = '';
          const headPath = path.join(__dirname, 'src', 'head.html');
          const footerPath = path.join(__dirname, 'src', 'footer.html');
          const navbarPath = path.join(__dirname, 'src', 'navbar.html');


          //console.log(`Reading file: ${filePath}`);
          const [htmlContent, headContent, footerContent, navbarContent] = await Promise.all([
              readFileContent(filePath),
              readFileContent(headPath),
              readFileContent(footerPath),
              readFileContent(navbarPath)
          ]);

            //let modifiedNavbarContent = navbarContent;


          //console.log('Successfully read all files');

          // Replace placeholders with actual content
          let modifiedData = htmlContent
              .replace(/{{className}}/g, className)
              .replace(/{{head}}/g, headContent)
              .replace(/{{footer}}/g, footerContent)
              .replace(/{{navbar}}/g, navbarContent);

          //console.log('Successfully replaced placeholders');
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
app.use("/libcurl/", express.static(libcurlPath));
app.use("/bareasmodule/", express.static(bareModulePath));
app.use("/baremux/", express.static(baremuxPath));
app.use("/scram/", express.static(scramjetDistPath));

app.use("/bare", cors({ origin: true }));




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
  host: '0.0.0.0',
});
