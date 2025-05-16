interface LogoProps {
  className?: string | null;
}

export function Logo({className}: LogoProps) {
  return (
    <div>
      <h1 className={className ? className : "text-white font-bold"}>CINFOTEC</h1>
    </div>
  );
}
