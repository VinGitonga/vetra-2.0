import PrimaryButton from "@/components/buttons/PrimaryButton";
import useTransaction from "@/hooks/useTransaction";
import MainLayout from "@/layouts";
import { IShare } from "@/types/Contracts";
import { NextPageWithLayout } from "@/types/Layout";
import { getSlicedAddress } from "@/utils/utils";
import { useInkathon } from "@scio-labs/use-inkathon";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Head from "next/head";
import { useEffect, useState } from "react";
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const ShareTransactions: NextPageWithLayout = () => {
  const { activeAccount } = useInkathon();
  const { getMyShareTransactions } = useTransaction();
  const [shares, setShares] = useState<IShare[]>([]);

  const fetchShares = async () => {
    const myShares = await getMyShareTransactions();
    if (myShares) {
      setShares(myShares);
    }
  };

  useEffect(() => {
    fetchShares();
  }, [activeAccount]);
  return (
    <>
      <Head>
        <title>Vetra | Share Transactions</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl mb-8">
            Documents/Files Shared Transactions
          </h1>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 capitalize lg:text-xl mt-8 mb-4">
              Files Shared
            </h2>
            <PrimaryButton
              text={"Refresh Shares"}
              isWidthFull={false}
              onClick={fetchShares}
            />
          </div>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    File ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    File Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Shared With
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Shared On
                  </th>
                </tr>
              </thead>
              <tbody>
                {shares.length > 0 ? (
                  shares.map((item) => (
                    <tr className="bg-white border-b  hover:bg-gray-50">
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item.entityId}
                      </th>
                      <td className="py-4 px-6">{item.fileName}</td>

                      <td className="py-4 px-6">
                        {getSlicedAddress(item.sharedTo)}
                      </td>
                      <td className="py-4 px-6">
                        {timeAgo.format(
                          new Date(item.sharedAt ?? "2023-03-30"),
                          "twitter-now"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="font-bold text-gray-700">
                    No Files Shared Yet 😢
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

ShareTransactions.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default ShareTransactions;
