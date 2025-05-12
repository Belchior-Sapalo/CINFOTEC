export function Logo({className} : {className: string | null}) {
  return (
    <div>
      <h1 className={className ? className : "text-white font-bold"}>CINFOTEC</h1>
    </div>
  );
}
