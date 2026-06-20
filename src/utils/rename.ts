import fs from "fs";
import path from "path"; 

const folders = [
  {
    folder: "../../public/images/men-suits",
    prefix: "ms",
  },
  {
    folder: "../../public/images/men-coats",
    prefix: "mc",
  },
  {
    folder: "../../public/images/men-hoodies",
    prefix: "mh",
  },
  {
    folder: "../../public/images/women-dresses",
    prefix: "wd",
  },
  {
    folder: "../../public/images/women-hoodies",
    prefix: "wh",
  },
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