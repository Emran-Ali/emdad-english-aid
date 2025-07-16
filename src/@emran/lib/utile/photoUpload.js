import {writeFile} from 'fs/promises';

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/gif',
];

export const photoUpload = async (file, path) => {
  try {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(
        'Invalid file type. Allowed types: JPG, PNG, SVG, WEBP, GIF',
      );
    }

    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Define the path where the file will be saved
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', path);
    const filePath = path.join(uploadDir, filename);

    // Convert the file to buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file
    await writeFile(filePath, buffer);

    // Return the public URL path
    return `/uploads/${path}/${filename}`; // Return the public URL path
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};
