/**
 * One-time menu import.
 * Reads the old `images/` folder, uploads every photo to Supabase Storage,
 * and inserts all menu items (names, prices, categories, sizes).
 *
 * Run from the cpc-next folder:
 *    node --env-file=.env.local scripts/import-menu.mjs
 *
 * Requires: the `menu-images` storage bucket (run supabase/storage.sql first).
 * NOTE: this clears existing menu items + test orders for a clean import.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, "..", "..", "images"); // ../../images (old site)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing env. Run with:  node --env-file=.env.local scripts/import-menu.mjs");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const V = {
  karhai: [{ label: "Half", price_offset: 0 }, { label: "Full", price_offset: 400 }],
  pizza: [{ label: "Small", price_offset: 0 }, { label: "Medium", price_offset: 150 }, { label: "Large", price_offset: 300 }],
  tikka: [{ label: "Leg", price_offset: 0 }, { label: "Chest", price_offset: 50 }],
  boti: [{ label: "Single", price_offset: 0 }, { label: "Full", price_offset: 250 }],
  pasta: [{ label: "Half", price_offset: 0 }, { label: "Full", price_offset: 150 }],
  wings: [{ label: "Leg", price_offset: 0 }, { label: "Chest", price_offset: 50 }],
};

// [categoryId, imageFolder, [names], [prices], [imageFiles]]
const DATA = [
  ["karhai", "karhai", ["Chicken Karahi","Mutton Karahi","Beef Karahi","Handi Karahi","Butter Karahi"], [850,1100,950,800,900], ["IMG_5499.JPG","IMG_5510.JPG","IMG_5511.JPG","IMG_5512.JPG","IMG_5513.WEBP"]],
  ["burger", "burger", ["Zinger Burger","Crispy Chicken Burger","Double Patty Burger","BBQ Burger","Spicy Burger","Cheese Burger","Club Burger","Special Burger"], [350,320,480,400,370,380,420,450], ["IMG_5555.JPG","IMG_5556.JPG","IMG_5557.JPG","IMG_5558.JPG","IMG_5559.JPG","IMG_5560.JPG","IMG_5561.JPG","IMG_5562.JPG"]],
  ["pizza", "pizza", ["Chicken Fajita Pizza","Kababish Pizza","Chicken Supreme","Creamy Pizza","Delight Pizza","Margherita","Calzone","Sicilian Meatball","Tikka Pizza"], [650,600,700,580,620,500,680,750,630], ["Chicken-Fajita-1.webp","Kababish Pizza.webp","chicken supreme.webp","creamy pizza.jpg","delight.png","images.jpg","kalzon.jpg","sicilian-meatballs.webp","tikka pizza.jpg"]],
  ["tikka", "tikka", ["Chicken Tikka","Seekh Tikka","Malai Tikka"], [500,450,550], ["IMG_5526.JPG","IMG_5527.JPG","IMG_5528.JPG"]],
  ["boti", "boti", ["Chicken Boti","Mutton Boti","Beef Boti","Reshmi Boti","Seekh Boti","Mixed Boti"], [400,550,500,420,380,480], ["IMG_5530.JPG","IMG_5531.JPG","IMG_5532.JPG","IMG_5533.JPG","IMG_5534.JPG","IMG_5535.JPG"]],
  ["rolls", "rolls", ["Chicken Roll","Seekh Roll","Beef Roll","Paratha Roll","Veggie Roll","Special Roll","BBQ Roll","Club Roll"], [180,200,220,160,150,250,230,280], ["IMG_5507.JPG","IMG_5519.JPG","IMG_5520.JPG","IMG_5521.JPG","IMG_5522.JPG","IMG_5523.PNG","IMG_5524.JPG","IMG_5525.JPG"]],
  ["sandwiches", "sandwiches", ["Club Sandwich","Chicken Sandwich","Toasted Sandwich"], [280,250,220], ["IMG_5576.JPG","IMG_5577.JPG","IMG_5578.JPG"]],
  ["paratha", "paratha", ["Plain Paratha","Aloo Paratha","Egg Paratha","Beef Paratha","Chicken Paratha","Keema Paratha","Paneer Paratha","Butter Paratha","Mixed Paratha","Desi Paratha","Special Paratha"], [60,120,100,180,160,200,150,80,140,90,220], ["IMG_5515.JPG","IMG_5545.JPG","IMG_5546.JPG","IMG_5547.JPG","IMG_5548.JPG","IMG_5549.JPG","IMG_5550.JPG","IMG_5551.JPG","IMG_5552.JPG","IMG_5553.JPG","IMG_5554.JPG"]],
  ["pasta", "pasta", ["Chicken Pasta","Creamy Pasta","Spicy Pasta"], [350,380,360], ["IMG_5497.JPG","IMG_5498.JPG","IMG_5500.JPG"]],
  ["fries", "fries", ["Plain Fries","Masala Fries","Loaded Fries","Cheese Fries","Spicy Fries"], [150,180,250,220,200], ["IMG_5568.JPG","IMG_5569.JPG","IMG_5570.JPG","IMG_5571.JPG","IMG_5572.JPG"]],
  ["wings", "wings", ["BBQ Wings","Buffalo Wings","Honey Garlic Wings"], [400,420,450], ["IMG_5502.JPG","IMG_5503.JPG","IMG_5504.JPG"]],
  ["chai", "chai", ["Doodh Patti","Kashmiri Chai","Karak Chai","Green Tea","Cardamom Chai","Ginger Chai","Masala Chai","Black Tea","Mint Tea"], [60,100,80,70,80,80,90,50,70], ["IMG_5536.JPG","IMG_5537.PNG","IMG_5538.JPG","IMG_5539.JPG","IMG_5540.JPG","IMG_5541.JPG","IMG_5542.JPG","IMG_5543.JPG","IMG_5544.JPG"]],
  ["beverage", "beverage", ["Mango Shake","Cold Coffee","Lemonade","Rooh Afza","Soft Drink"], [180,200,120,100,80], ["IMG_5583.JPG","IMG_5584.JPG","IMG_5585.JPG","IMG_5586.JPG","IMG_5587.JPG"]],
  ["soup", "soup", ["Chicken Corn Soup","Hot & Sour Soup"], [200,220], ["IMG_5573.JPG","IMG_5574.JPG"]],
  ["kids-menu", "kids menu", ["Mini Burger","Nuggets","Kids Pasta","Mini Pizza","Kids Deal"], [200,180,220,250,350], ["IMG_5563.JPG","IMG_5564.JPG","IMG_5565.JPG","IMG_5566.JPG","IMG_5567.JPG"]],
  ["salad", "salad", ["Garden Salad"], [150], ["IMG_5582.JPG"]],
  ["side-items", "side items", ["Raita","Naan","Garlic Naan","Tandoori Roti","Salted Butter"], [60,30,50,25,40], ["IMG_5516.WEBP","IMG_5517.JPG","IMG_5579.JPG","IMG_5580.JPG","IMG_5581.JPG"]],
];

const mime = (f) => {
  const e = f.split(".").pop().toLowerCase();
  return e === "png" ? "image/png" : e === "webp" ? "image/webp" : "image/jpeg";
};

async function run() {
  console.log("Clearing old menu + test orders…");
  await supabase.from("order_items").delete().neq("id", 0);
  await supabase.from("orders").delete().neq("id", 0);
  await supabase.from("menu_items").delete().neq("id", 0);

  let count = 0;
  for (const [catId, folder, names, prices, images] of DATA) {
    const variants = V[catId] ?? null;
    for (let i = 0; i < names.length; i++) {
      let image_url = null;
      const file = images[i];
      if (file) {
        try {
          const buf = readFileSync(join(IMAGES_DIR, folder, file));
          const dest = `${catId}-${i}-${Date.now()}.${file.split(".").pop().toLowerCase()}`;
          const { error } = await supabase.storage
            .from("menu-images")
            .upload(dest, buf, { contentType: mime(file), upsert: true });
          if (error) console.log(`  ⚠ upload failed (${folder}/${file}): ${error.message}`);
          else image_url = supabase.storage.from("menu-images").getPublicUrl(dest).data.publicUrl;
        } catch (e) {
          console.log(`  ⚠ image not found: ${folder}/${file}`);
        }
      }
      const { error } = await supabase.from("menu_items").insert({
        category_id: catId, name: names[i], price: prices[i], image_url, variants, sort_order: i,
      });
      if (error) console.log(`  ⚠ insert failed (${names[i]}): ${error.message}`);
      else { count++; process.stdout.write(`\r✓ Imported ${count} items…`); }
    }
  }
  console.log(`\nDone — ${count} menu items imported with photos. 🎉`);
}

run().catch((e) => { console.error(e); process.exit(1); });
