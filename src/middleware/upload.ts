import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.resolve("uploads"));
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
