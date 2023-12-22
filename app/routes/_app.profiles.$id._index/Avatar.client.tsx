import { useState } from 'react';
import ReactNiceAvatar, { genConfig, type AvatarFullConfig, type NiceAvatarProps } from 'react-nice-avatar';

interface Props extends NiceAvatarProps {
  config: string | AvatarFullConfig;
}

export default function Avatar({ config, ...props }: Props) {
  const [avatarConfig] = useState(genConfig(config));
  return <ReactNiceAvatar {...props} {...avatarConfig} />;
}
