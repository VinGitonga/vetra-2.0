import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequestItem from "@/components/requests/RequestItem";
import useTransaction from "@/hooks/useTransaction";
import MainLayout from "@/layouts";
import { IRequest } from "@/types/Contracts";
import { NextPageWithLayout } from "@/types/Layout";
import { useInkathon } from "@scio-labs/use-inkathon";
import Head from "next/head";
import { useEffect, useState } from "react";

const RequestsToMe: NextPageWithLayout = () => {
  const { activeAccount } = useInkathon();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const { getRequestsByAddressedTo } = useTransaction();

  const handleRefreshRequests = async () => {
    const requests = await getRequestsByAddressedTo();
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
        <title>Vetra | File Requests To Me</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              File Requests To Me
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

RequestsToMe.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default RequestsToMe;
