import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequestItem from "@/components/requests/RequestItem";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { useInkathon } from "@scio-labs/use-inkathon";
import { IRequest } from "@/types/Contracts";
import { useEffect, useState } from "react";
import useTransaction from "@/hooks/useTransaction";

const MyFileRequests: NextPageWithLayout = () => {
  const { activeAccount } = useInkathon();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const { getRequestBySentBy } = useTransaction();

  const handleRefreshRequests = async () => {
    const requests = await getRequestBySentBy();
    if (requests) {
      setRequests(requests);
    }
  };

  console.log("requests", requests);
  useEffect(() => {
    handleRefreshRequests();
  }, [activeAccount]);
  return (
    <>
      <Head>
        <title>Vetra | My File Requests</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              My File Requests
            </h1>
            <PrimaryButton
              text={"Refresh Requests"}
              isWidthFull={false}
              onClick={handleRefreshRequests}
            />
          </div>
          <div className="mt-6">
            {requests.length > 0 ? (
              requests.map((item) => (
                <RequestItem key={item.sentAt} data={item} />
              ))
            ) : (
              <div className="font-bold text-gray-700">
                No New Requests
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

MyFileRequests.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default MyFileRequests;
