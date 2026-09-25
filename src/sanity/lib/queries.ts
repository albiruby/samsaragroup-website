import { client } from "./client";
import { urlFor } from "./image";

const revalidate = { next: { revalidate: 60 } };

export async function getEvents() {
  try {
    return await client.fetch(
      `*[_type == "event"] | order(date desc) { _id, title, slug, category, date, time, location, capacity, entry, description, image, featured, link }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getEvents failed:", e.message);
    return [];
  }
}

export async function getEventBySlug(slug) {
  try {
    return await client.fetch(
      `*[_type == "event" && slug.current == $slug][0]{_id, title, slug, category, date, time, location, capacity, entry, description, image, featured, link}`,
      { slug },
      revalidate
    );
  } catch (e) {
    console.error("getEventBySlug failed:", e.message);
    return null;
  }
}

export async function getWorlds() {
  try {
    return await client.fetch(
      `*[_type == "world"] | order(_createdAt asc) { _id, name, slug, tagline, description, image, gallery, specifications }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getWorlds failed:", e.message);
    return [];
  }
}

export async function getContactInfo() {
  try {
    return await client.fetch(
      `*[_type == "contactInfo"][0] { _id, emails, addresses, hours, inquiryTypes }`,
      {},
      revalidate
    );
  } catch (e) {
    console.error("getContactInfo failed:", e.message);
    return null;
  }
}

export async function getCarouselImages(placement) {
  try {
    return await client.fetch(
      `*[_type == "carouselImage" && placement == $placement && active != false] | order(order asc) { title, image, alt, brand }`,
      { placement },
      revalidate
    );
  } catch (e) {
    console.error("getCarouselImages failed:", e.message);
    return [];
  }
}
