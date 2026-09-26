import { DATA } from "@/data/resume";

function plainText(value: string) {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
}

function period(start: string, end?: string) {
  return `${start}–${end ?? "Present"}`;
}

/** Person JSON-LD built from the resume data already rendered on the page. */
export function personJsonLd() {
  const name = DATA.name.split(" - ")[0] || DATA.name;
  const [locality, region = ""] = DATA.location.split(",").map((part) => part.trim());
  const currentJobs = DATA.work.filter((job) => job.end === undefined);

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${DATA.url}/#person`,
    name,
    alternateName: DATA.preferredName,
    description: DATA.summary,
    url: DATA.url,
    image: `${DATA.url}${DATA.avatarUrl}`,
    email: DATA.contact.email,
    telephone: DATA.contact.tel,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: region.toLowerCase() === "indonesia" ? "ID" : region,
    },
    sameAs: Object.values(DATA.contact.social)
      .map((social) => social.url)
      .filter((url) => url.startsWith("http")),
    jobTitle: currentJobs[0]?.title,
    worksFor: currentJobs.map((job) => ({
      "@type": "Organization",
      name: job.company,
      url: job.href,
    })),
    hasOccupation: DATA.work.map((job) => ({
      "@type": "Occupation",
      name: job.title,
      description: `${job.company} (${period(job.start, job.end)}), ${job.location}. ${plainText(job.description)}`,
      occupationLocation: {
        "@type": "Place",
        name: job.location,
      },
    })),
    alumniOf: DATA.education.map((education) => ({
      "@type": "EducationalOrganization",
      name: education.school,
      url: education.href,
    })),
    hasCredential: DATA.education.map((education) => ({
      "@type": "EducationalOccupationalCredential",
      name: education.degree,
      recognizedBy: {
        "@type": "EducationalOrganization",
        name: education.school,
        url: education.href,
      },
    })),
    knowsAbout: DATA.skills.map((skill) => skill.name),
  }).replace(/</g, "\\u003c");
}
