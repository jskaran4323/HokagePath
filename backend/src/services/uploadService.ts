// backend/src/services/uploadService.ts

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET_NAME } from '../config/aws';

export class UploadServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'UploadServiceError';
  }
}

export class UploadService {

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      
      const key = this.getKeyFromUrl(fileUrl);
      
      if (!key) {
        throw new UploadServiceError('Invalid file URL', 400);
      }

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });

      await s3.send(command);

    } catch (error: any) {
      console.error('Delete file error:', error);
      throw new UploadServiceError('Failed to delete file from S3');
    }
  }

  private getKeyFromUrl(url: string): string | null {
    try {
      const parts = url.split('.com/');
      return parts[1] || null;
    } catch (error) {
      return null;
    }
  }

  getFileUrl(key: string): string {
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

export default new UploadService();