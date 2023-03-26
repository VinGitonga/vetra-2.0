import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RiLoginCircleFill } from "react-icons/ri";
import Head from "next/head";
import { toast } from "react-hot-toast";
import {
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { NextPageWithLayout } from "@/types/Layout";
import OnboardingLayout from "@/layouts/Onboarding";

const Onboarding: NextPageWithLayout = () => {
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const resetFields = () => {
    setEmail("");
    setPhone("");
  };

  const clickSubmit = async () => {
    // email regex
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }

    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    if (phone.length < 10) {
      toast.error("Invalid phone number");
      return;
    }

    if (!activeAccount || !activeSigner || !api || !contract) {
      toast.error("Please connect to your wallet");
      return;
    }

    try {
      setLoading(true);
      api.setSigner(activeSigner);
      await contractTx(
        api,
        activeAccount.address,
        contract,
        "addUser",
        {},
        [email, phone],
        ({ status }) => {
          if (status.isInBlock) {
            toast.success("Successfully registered");
            resetFields();
            router.push("/dashboard");
          }
        }
      )
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>OnBoarding | Vetra</title>
      </Head>
      <section className="w-full min-h-screen bg-white dark:bg-gray-900">
        <div className="container relative flex flex-col min-h-screen px-6 py-8 mx-auto">
          <section className="flex items-center flex-1">
            <div className="w-full max-w-md mx-auto">
              <h3 className="text-3xl font-semibold text-center text-gray-700 dark:text-white">
                Create an Account with Vetra
              </h3>

              <form className="mt-6">
                <div className="my-4">
                  <div>
                    <label className="block text-sm text-gray-800 dark:text-gray-200">
                      Email Address
                    </label>
                  </div>

                  <input
                    type="email"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="walt@kovu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="my-4">
                  <label className="block text-sm text-gray-800 dark:text-gray-200">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Walt Mich"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <PrimaryButton
                    text="Submit"
                    isLoading={loading}
                    loadingText={"Saving your info ..."}
                    onClick={clickSubmit}
                    Icon={RiLoginCircleFill}
                  />
                </div>
              </form>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

Onboarding.getLayout = (page) => <OnboardingLayout>{page}</OnboardingLayout>;

export default Onboarding;
