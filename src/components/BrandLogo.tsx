import logoAsset from "@/assets/jointheirs-logo.png.asset.json";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

/**
 * Brand logo used exactly as uploaded — original artwork, original background,
 * no inversion or recoloring in either theme.
 */
export function BrandLogo({ className = "h-10", alt = "JointHeirs DigiWorks Agency logo" }: BrandLogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt={alt}
      width={1347}
      height={469}
      className={`w-auto object-contain ${className}`}
      loading="lazy"
    />
  );
}
