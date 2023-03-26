import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequestItem from "@/components/requests/RequestItem";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { toast } from "react-hot-toast";
import {
  contractQuery,
  contractTx,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import { ContractID } from "@/types/Contracts";
import { useEffect, useState } from "react";
import useTransaction from "@/hooks/useTransaction";


const MyFileRequests: NextPageWithLayout = () => {
  const { activeAccount, activeSigner, api } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const [loading, setLoading] = useState<boolean>(false);
 const [requests, setRequests] = useState<any[]>([]);
 const {getRequestBySentBy}  = useTransaction();

  const handleRefreshRequests = async () => {
    const request = await getRequestBySentBy ();
    if (request) {
      setRequests(request);
    }
  }
  console.log(requests);

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
            <PrimaryButton text={"Refresh Requests"} isWidthFull={false}
            onClick = {handleRefreshRequests} />
          </div>
          <div className="mt-6">
            {requests.map((_, i) => (
              <RequestItem key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

MyFileRequests.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default MyFileRequests;
