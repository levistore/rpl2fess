const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const envContent = fs.readFileSync(".env.local", "utf8");
let url = "";
let key = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    url = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
  }
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
    key = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
  }
}

const supabase = createClient(url, key);

const initialDocs = [
  {
    title: "Awal dari Banyak Cerita",
    caption: "XI RPL 2 — awal dari banyak cerita.",
    category_label: "DOCUMENTATION / 01",
    meta_text: "XI RPL 2 / 2026",
    overlay_text: "ARCHIVE // 2026",
    image_url: "/images/class/class-01.jpg",
    display_order: 1,
    is_active: true
  },
  {
    title: "Momen Berharga",
    caption: "Beberapa momen yang layak disimpan.",
    category_label: "DOCUMENTATION / 02",
    meta_text: "XI RPL 2 / 2026",
    overlay_text: "SERIES // VOL. 01",
    image_url: "/images/class/class-02.jpg",
    display_order: 2,
    is_active: true
  },
  {
    title: "Di Balik Layar",
    caption: "Tawa kecil di sela baris kode.",
    category_label: "DOCUMENTATION / 03",
    meta_text: "XI RPL 2 / 2026",
    overlay_text: "MEMORIES // 03",
    image_url: "/images/class/class-03.jpg",
    display_order: 3,
    is_active: true
  },
  {
    title: "Langkah Bersama",
    caption: "Satu langkah kecil menuju masa depan.",
    category_label: "DOCUMENTATION / 04",
    meta_text: "XI RPL 2 / 2026",
    overlay_text: "MOMENTS // 04",
    image_url: "/images/class/class-04.jpg",
    display_order: 4,
    is_active: true
  }
];

async function seed() {
  const { data: existing } = await supabase.from("documentation").select("id");
  if (existing && existing.length > 0) {
    console.log("Already seeded, count:", existing.length);
    return;
  }
  const { data, error } = await supabase.from("documentation").insert(initialDocs).select();
  if (error) {
    console.error("Error seeding docs:", error);
  } else {
    console.log("Successfully seeded documentation:", data.length, "items");
  }
}

seed();
