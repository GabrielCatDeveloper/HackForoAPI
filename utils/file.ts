import fs from 'fs/promises';
import path from 'path';

export async function readFileBase64(filePath: string): Promise<string> {
  try {
    // Resolve the absolute path to avoid relative path issues
    const absolutePath = path.resolve(filePath);
    
    // Read the file as a Buffer
    const fileBuffer = await fs.readFile(absolutePath);
    
    // Convert the Buffer to Base64 string
    const base64String = fileBuffer.toString('base64');
    
    return base64String;
  } catch (error) {
    throw new Error(`Error reading file: ${(error as Error).message}`);
  }
}