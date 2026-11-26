interface TopBarButtonProps {
  icon: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function TopBarButton({
  icon,
  label,
  className = "",
  onClick,
}: TopBarButtonProps) {
  return (
    <button
      type="button"
      className={`top-item ${className}`}
      data-sound-hover="true"
      data-sound-click="true"
      onClick={onClick}
    >
      <i className={`bi ${icon}`}></i>
      <span>{label}</span>
    </button>
  );
}
