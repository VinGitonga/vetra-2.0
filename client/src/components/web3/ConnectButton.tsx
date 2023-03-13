import { env } from "@/config/enviroment";
import { truncateHash } from "@/utils/truncateHash";
import { Menu, Transition } from "@headlessui/react";
import {
  getSubstrateChain,
  SubstrateChain,
  useBalance,
  useInkathon,
} from "@scio-labs/use-inkathon";
import { FC, Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import NotConnectedBtn from "../buttons/NotConnectedBtn";
import { AiOutlineCheckCircle, AiOutlineDisconnect } from "react-icons/ai";
import { encodeAddress } from "@polkadot/util-crypto";
import ConnectedBtn from "../buttons/ConnectedBtn";

export interface ConnectButtonProps {}

const ConnectButton: FC<ConnectButtonProps> = () => {
  const {
    activeChain,
    switchActiveChain,
    connect,
    disconnect,
    isConnecting,
    activeAccount,
    accounts,
    setActiveAccount,
  } = useInkathon();

  const { balanceFormatted } = useBalance(activeAccount?.address);

  const [supportedChains] = useState(
    env.supportedChains.map(
      (networkId) => getSubstrateChain(networkId) as SubstrateChain
    )
  );

  if (!activeAccount) {
    return (
      <NotConnectedBtn
        onClick={connect}
        text="Connect Wallet"
        isLoading={isConnecting}
      />
    );
  }

  return (
    <div className="flex" >
      <Menu as="div" className="relative inline-block text-left">
        <ConnectedBtn text={balanceFormatted ?? "Some Balance"} />
      </Menu>
      <div className="w-56 text-right">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex flex-col w-full justify-center items-center rounded-3xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 border border-gray-300">
              <p className="text-sm">{activeAccount?.meta?.name}</p>
              <p className="text-xs">
                {truncateHash(activeAccount?.address, 8)}
              </p>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                {supportedChains.map((chain) => (
                  <div
                    key={chain?.network}
                    onClick={async () => {
                      await switchActiveChain?.(chain);
                      toast.success(`Switched to ${chain?.name}`);
                    }}
                  >
                    <Menu.Item
                      disabled={chain?.network === activeChain?.network}
                    >
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {chain?.name}
                          {chain?.network === activeChain?.network && (
                            <AiOutlineCheckCircle size={16} />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                ))}
                {(accounts || []).map((acc) => {
                  const encodedAddress = encodeAddress(
                    acc?.address,
                    activeChain?.ss58Prefix || 42
                  );
                  const truncatedEncodedAddress = truncateHash(
                    encodedAddress,
                    10
                  );

                  return (
                    <div key={encodedAddress}>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-start flex-col rounded-md px-2 py-2 text-sm`}
                            disabled={acc?.address === activeAccount?.address}
                            onClick={() => setActiveAccount?.(acc)}
                          >
                            <div>
                              {acc?.meta?.name}
                              {acc?.address === activeAccount?.address && (
                                <AiOutlineCheckCircle size={16} />
                              )}
                            </div>
                            <p className="text-xs">{truncatedEncodedAddress}</p>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  );
                })}
                {/* Divider */}
                <div className="h-0.5 my-2 bg-gray-200" />
                {/* Disconnect Btn */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={disconnect}
                    >
                      <AiOutlineDisconnect size={18} />
                      Disconnect
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default ConnectButton;
