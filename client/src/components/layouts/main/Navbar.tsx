import IconButton from "@/components/buttons/IconButton";
import ConnectButton from "@/components/web3/ConnectButton";
import { RiMenu2Fill } from "react-icons/ri";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Sidebar from "./Sidebar";
import { useModal } from "@/hooks/store/useModal";
import { shallow } from "zustand/shallow";

export default function Navbar() {
  const { isOpen, toggleDrawer } = useModal(
    (state) => ({
      isOpen: state.openDrawer,
      toggleDrawer: state.toggleDrawer,
    }),
    shallow
  );

  return (
    <nav className="bg-white px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-20">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 mr-3 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Vetra
            </span>
          </a>
          <div className="block md:hidden px-4 py-2">
            <IconButton
              Icon={RiMenu2Fill}
              text="Small Devices"
              onClick={toggleDrawer}
            />
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="left"
              size={300}
              className="py-16 px-4"
            >
              <Sidebar />
            </Drawer>
          </div>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
}
