import PrimaryButton from "@/components/buttons/PrimaryButton";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { IoWalletOutline, IoRocketSharp } from "react-icons/io5";
import { RiUserLine } from "react-icons/ri";

const CreateRequest: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Vetra | Create Request</title>
      </Head>
      <section>
        <div className="container flex flex-col items-center justify-center min-h-screen px-6 mx-auto">
          <h3 className="text-xl font-semibold tracking-wide text-center text-gray-800 capitalize">
            Create New File Request
          </h3>
          <div className="w-full max-w-md mx-auto mt-6">
            <form>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message ..."
                />
              </div>
              <div className="my-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Your Name
                </label>
                <div className="relative mb-6">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <RiUserLine className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Bonnie Green"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Wallet Address
                </label>
                <div className="relative mb-6">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <IoWalletOutline className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="HVJqBuGymzQWAM7JwixLvQcVSZ6rKowvo3j7eH1yScHN"
                  />
                </div>
                <p className="my-3 text-sm text-gray-500">
                  Paste the Wallet Address of the Recipient
                </p>
              </div>
              <PrimaryButton text="Send Request" Icon={IoRocketSharp} />
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

CreateRequest.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default CreateRequest;
