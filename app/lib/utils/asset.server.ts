import type { AssetInfo } from '@lib/models/asset';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';

if (!process.env.CLOUDINARY_CLOUD_NAME)
  throw new ReferenceError('CLOUDINARY_CLOUD_NAME environment variable must be provided');

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true,
  },
});

export function toImage(asset: AssetInfo): CloudinaryImage {
  return cld.image(asset.key).format(asset.format).setVersion(asset.version);
}
