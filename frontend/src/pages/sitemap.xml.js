import React from "react";
import api from "services/axios";
import { DOMAIN } from "configs/constants";

const origin = DOMAIN;
const getSitemap = (products) => `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
    <loc>${origin}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    </url>
${products
  .map(
    (product) =>
      `<url>
      <loc>${origin}/product/${product.slug}</loc>   
    <lastmod>${new Date(product.updatedAt).toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join("")}
 
</urlset>`;

class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    try {
      const { data } = await api.get("/api/product");

      if (data) {
        // Not use req for orgin because it -> https://search.google.com/
        // let origin = "";
        // if (typeof req.headers.referer !== "undefined") {
        //   origin = req.headers.referer.match(/(http[s]?:\/\/?[^\/\s]+)\/(.*)/i)[1];
        // } else {
        //   //For vercel
        //   origin = `${req.headers["x-forwarded-proto"]}://${req.headers["x-forwarded-host"]}`;
        // }

        res.setHeader("Content-Type", "text/xml");
        res.write(getSitemap(data.products));
        res.end();
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Sitemap;
