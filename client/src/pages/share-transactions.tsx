import PrimaryButton from "@/components/buttons/PrimaryButton";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import { getFileSize, getSlicedAddress } from "@/utils/utils";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Head from "next/head";
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

const ShareTransactions: NextPageWithLayout = () => {
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
              text={"Refresh Files"}
              isWidthFull={false}
              //   onClick={getMyTransactions}
            />
          </div>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    File Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Shared With
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Shared On
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="bg-white border-b  hover:bg-gray-50">
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {"Carbon.png"}
                    </th>
                    <td className="py-4 px-6">
                      {getSlicedAddress(
                        "0xeDa6028a4b72d60Eb2638B94FAE7CD974479bFAE"
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {timeAgo.format(new Date("2023-03-10"), "twitter-now")}
                    </td>
                    <td className="py-4 px-6">{getFileSize(23981)}</td>
                  </tr>
                ))}
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
