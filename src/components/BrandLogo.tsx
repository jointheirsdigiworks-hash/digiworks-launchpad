import logoLightAsset from "@/assets/jointheirs-logo.png.asset.json";
import logoDarkAsset from "@/assets/jointheirs-logo-dark.png.asset.json";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

/**
 * Brand logo with a smooth cross-fade between the light-background artwork
 * and the dark-mode artwork (wordmark reversed, JH mark untouched).
 */
export function BrandLogo({ className = "h-10", alt = "JointHeirs DigiWorks Agency logo" }: BrandLogoProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <img
        src={logoLightAsset.url}
        alt={alt}
        width={1024}
        height={1024}
        className="h-full w-auto object-contain transition-opacity duration-700 ease-out opacity-100 dark:opacity-0"
        loading="lazy"
      />
      <img
        src={logoDarkAsset.url}
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-700 ease-out opacity-0 dark:opacity-100"
        loading="lazy"
      />
    </span>
  );
}
