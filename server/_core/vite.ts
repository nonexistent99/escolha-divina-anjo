import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import path from "path";

export async function setupVite(app: Express, _server: Server) {
  // Development mode: serve static files
  const publicPath = path.join(process.cwd(), "client", "public");
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  
  // Serve index.html for SPA
  const indexPath = path.join(process.cwd(), "client", "index.html");
  app.use("*", (_req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

export function serveStatic(app: Express) {
  // Production mode: serve from dist
  const distPath = path.join(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
  }

  app.use(express.static(distPath));

  // Serve index.html for SPA
  app.use("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}
