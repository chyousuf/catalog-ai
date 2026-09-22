import { Product } from "@/types/product";

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) {
    return '""';
  }
  const str = String(field);
  // Replace quotes with double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function generateProductCsvString(products: Product[]): string {
  const headers = [
    "Handle",
    "Title",
    "Original Name",
    "Category",
    "Price",
    "Currency",
    "Short Description",
    "Detailed Description",
    "Search Tags",
    "SEO Meta Description",
    "Instagram Caption",
    "Material",
    "Dimensions",
    "Certifications",
    "Brand",
    "Image URL",
    "Is Demo Data",
    "Created At",
  ];

  const rows = products.map((p) => [
    escapeCsvField(slugify(p.title || p.name || p.id)),
    escapeCsvField(p.title || p.name),
    escapeCsvField(p.name),
    escapeCsvField(p.category),
    escapeCsvField(p.price),
    escapeCsvField(p.currency),
    escapeCsvField(p.shortDescription),
    escapeCsvField(p.detailedDescription),
    escapeCsvField(Array.isArray(p.tags) ? p.tags.join(", ") : ""),
    escapeCsvField(p.seoMetaDescription),
    escapeCsvField(p.instagramCaption),
    escapeCsvField(p.specifications?.material || "Not Specified"),
    escapeCsvField(p.specifications?.dimensions || "Not Specified"),
    escapeCsvField(p.specifications?.certifications || "Not Specified"),
    escapeCsvField(p.specifications?.brand || "Not Specified"),
    escapeCsvField(p.imageUrl),
    escapeCsvField(p.isDemo ? "Yes (Demo)" : "No"),
    escapeCsvField(p.createdAt),
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
  return csvContent;
}

export function downloadProductsCsv(products: Product[], filename = "catalogai-products.csv"): boolean {
  if (!products || products.length === 0) return false;

  const csvContent = generateProductCsvString(products);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
