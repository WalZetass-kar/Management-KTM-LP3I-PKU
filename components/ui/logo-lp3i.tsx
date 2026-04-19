import Image from "next/image";

interface LogoLP3IProps {
  className?: string;
  variant?: "default" | "white" | "colored";
  size?: "sm" | "md" | "lg" | "xl";
}

export function LogoLP3I({ 
  className = "", 
  variant = "default",
  size = "md" 
}: LogoLP3IProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
  };

  // Untuk variant white, kita bisa tambahkan background putih
  const containerClass = variant === "white" 
    ? "bg-white rounded-lg p-1" 
    : "";

  return (
    <div className={`${sizeClasses[size]} ${containerClass} ${className} relative flex items-center justify-center`}>
      <Image
        src="/images/logo-lp3i.png"
        alt="Logo Politeknik LP3I"
        width={sizePixels[size]}
        height={sizePixels[size]}
        className="object-contain"
        priority
      />
    </div>
  );
}

// Simplified version for small spaces
export function LogoLP3ISimple({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className} relative`}>
      <Image
        src="/images/logo-lp3i.png"
        alt="Logo Politeknik LP3I"
        width={40}
        height={40}
        className="object-contain"
      />
    </div>
  );
}
