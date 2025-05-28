import { FaUserCircle } from "react-icons/fa";

const defaultClassName = "text-white text-[16px] font-extrabold bg-sky-800 hover:bg-sky-900 transition-all p-2 rounded-full cursor-pointer flex items-center justify-center h-10 w-10";

export function Avatar({name, className = defaultClassName}: {name: string | undefined, className?: string}) {
  if (!name) return <div className={defaultClassName}><FaUserCircle /></div>;
  let fullNameArray = name.split(" ");

  let avatar = "";
  let firtsName = "";
  let lastName = "";
  if (fullNameArray.length === 1) {
    avatar = fullNameArray[0].charAt(0);
  } else {
    firtsName = fullNameArray[0];
    lastName = fullNameArray[fullNameArray.length - 1];
    avatar = firtsName.charAt(0) + lastName.charAt(0);
  }
  return (
    <div className={className}>
        <span>{avatar.toLocaleUpperCase()}</span>
    </div>
  );
}
