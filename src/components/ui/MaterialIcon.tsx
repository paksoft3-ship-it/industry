interface MaterialIconProps {
  icon: string;
  className?: string;
}

export default function MaterialIcon({ icon, className = "" }: MaterialIconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{icon}</span>
  );
}
