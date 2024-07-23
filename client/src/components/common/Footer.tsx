// import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { GiMuscleUp } from "react-icons/gi";
import { cn } from "@/utils/cn";

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const Footer = () => {
  // const navigate = useNavigate();
  // const handlenav = () => {
  //     navigate

  // }
  const navigation = [
    { name: "Dashboard", to: ".", icon: GiMuscleUp },
    {
      name: "Discussions",
      to: "./discussions",
      icon: (props: React.SVGProps<SVGSVGElement>) => <GiMuscleUp {...props} />,
    },
    { name: "toppage", to: "./top", icon: GiMuscleUp },
    // checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
    //   name: 'Users',
    //   to: './users',
    //   icon: Users,
    // },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      <div className="fixed bottom-0 right-0 left-0 z-10 bg-sky-200">
        <div className="flex justify-center item-center space-x-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium",
                  isActive && "bg-gray-900 text-white",
                )
              }
            >
              <item.icon
                className={cn(
                  "text-gray-400 group-hover:text-gray-300",
                  "mr-4 size-6 shrink-0",
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}

          {/* <Button className="rounded-3xl">
                トレーニングを記録する
                </Button> */}
          {/* <Button className="rounded-3xl">
                ダッシュボードを見る
                </Button> */}
          {/* <Button className="rounded-3xl">
                エクササイズ一覧
                </Button> */}
          {navigation[0].icon({
            className: cn(
              "text-gray-400 group-hover:text-gray-300",
              "mr-4 size-6 shrink-0",
            ),
          })}
        </div>
      </div>
    </>
  );
};
