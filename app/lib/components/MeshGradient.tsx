import { displayP3ToHex } from '@lib/utils';
import { generateJSXMeshGradient } from 'meshgrad';
import { useEffect, useRef, useState } from 'react';

export default function MeshGradient({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [gradientStyle, setGradientStyle] = useState<
    ReturnType<typeof generateJSXMeshGradient> | undefined
  >();

  useEffect(() => {
    setGradientStyle(
      generateJSXMeshGradient(
        6,
        displayP3ToHex(
          window
            .getComputedStyle(ref.current!)
            .getPropertyValue('background-color')
        )
      )
    );
  }, []);

  return <div ref={ref} {...props} style={{ ...gradientStyle, ...style }} />;
}
