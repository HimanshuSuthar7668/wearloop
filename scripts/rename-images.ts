import fs from "fs";
import path from "path";

const imagesDir = path.join(__dirname, "../public/images");

const folders = [
  { folder: path.join(imagesDir, "men-suits"), prefix: "ms" },
  { folder: path.join(imagesDir, "men-coats"), prefix: "mc" },
  { folder: path.join(imagesDir, "men-hoodies"), prefix: "mh" },
  { folder: path.join(imagesDir, "women-dresses"), prefix: "wd" },
  { folder: path.join(imagesDir, "women-hoodies"), prefix: "wh" },
];

for (const { folder, prefix } of folders) {
  const files = fs
    .readdirSync(folder)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort();

  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();

    const newName = `${prefix}_${index + 1}${ext}`;

    fs.renameSync(
      path.join(folder, file),
      path.join(folder, newName)
    );

    console.log(`${file} -> ${newName}`);
  });
}

console.log("Done!");