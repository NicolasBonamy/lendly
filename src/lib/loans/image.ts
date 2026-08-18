const THUMBNAIL_MAX_SIZE = 256;
const JPEG_QUALITY = 0.8;

export function compressImageToThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Unable to read the image file"));
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        reject(new Error("Unable to decode the image file"));
      };

      image.onload = () => {
        const longestSide = Math.max(image.width, image.height);
        const scale = Math.min(1, THUMBNAIL_MAX_SIZE / longestSide);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Unable to create a canvas context"));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}
