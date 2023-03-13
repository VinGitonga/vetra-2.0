import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequestItem from "@/components/requests/RequestItem";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const MyFileRequests: NextPageWithLayout = () => {
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
            <PrimaryButton text={"Refresh Requests"} isWidthFull={false} />
          </div>
          <div className="mt-6">
            {[...Array(4)].map((_, i) => (
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
