import { supabase } from '../lib/supabase';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 100 * 1024; // 100 KB
const MAX_DIMENSION = 2000;
const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour in seconds

/**
 * Generate a signed URL for an avatar given its storage path
 * @param {string} avatarPath - The storage path (e.g., "user-id/avatar.webp")
 * @returns {Promise<string>} The signed URL
 */
export async function getAvatarSignedUrl(avatarPath) {
  if (!avatarPath) return null;

  // If it's already a full URL (legacy data), return as-is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  const { data, error } = await supabase.storage
    .from('avatars')
    .createSignedUrl(avatarPath, SIGNED_URL_EXPIRY);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

export async function uploadAvatar(userId, file) {
  if (!file) {
    throw new Error('No file selected.');
  }

  // 1. MIME type validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WEBP images are allowed.');
  }

  // 2. File size validation
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 100 KB limit.');
  }

  // 3. Load image to validate dimensions & process image
  const img = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image.'));
      image.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

  if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
    throw new Error(`Image dimensions exceed ${MAX_DIMENSION}×${MAX_DIMENSION} px limit.`);
  }

  // 4. Center crop to square & resize to 200x200
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  const minDim = Math.min(img.width, img.height);
  const sx = (img.width - minDim) / 2;
  const sy = (img.height - minDim) / 2;

  ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 200, 200);

  // 5. Convert to WEBP (quality ~0.9)
  const webpBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to convert image to WEBP.'));
    }, 'image/webp', 0.9);
  });

  // 6. Upload to Supabase Storage bucket 'avatars' with path `${userId}/avatar.webp`
  const filePath = `${userId}/avatar.webp`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, webpBlob, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Failed to upload avatar.');
  }

  // 7. Store only the storage path in profiles.avatar_url
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: filePath })
    .eq('id', userId)
    .select('id, display_name, created_at, avatar_url, default_discipline_state, first_day_of_week, habit_display_mode')
    .single();

  if (updateError) {
    throw new Error(updateError.message || 'Failed to update profile with avatar path.');
  }

  return updatedProfile;
}
