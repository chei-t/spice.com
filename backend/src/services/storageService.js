import cloudinary from '../config/cloudinary.js';
import { v2 as cloudinaryUploader } from 'cloudinary';

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'spices') => {
  try {
    const result = await cloudinaryUploader.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (files, folder = 'spices') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinaryUploader.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// AWS S3 integration (placeholder - would need aws-sdk)
export const uploadToS3 = async (file, bucket, key) => {
  // Placeholder for AWS S3 integration
  // In a real implementation, you would use AWS SDK
  console.log(`Uploading ${file} to S3 bucket ${bucket} with key ${key}`);

  return {
    bucket,
    key,
    url: `https://${bucket}.s3.amazonaws.com/${key}`,
  };
};

// Delete from S3
export const deleteFromS3 = async (bucket, key) => {
  // Placeholder for AWS S3 deletion
  console.log(`Deleting ${key} from S3 bucket ${bucket}`);

  return { deleted: true };
};

// Generate signed URL for private files
export const generateSignedUrl = async (bucket, key, expiresIn = 3600) => {
  // Placeholder for signed URL generation
  console.log(`Generating signed URL for ${key} in bucket ${bucket}`);

  return `https://${bucket}.s3.amazonaws.com/${key}?signed=true`;
};