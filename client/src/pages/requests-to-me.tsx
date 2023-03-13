import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequestItem from "@/components/requests/RequestItem";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const RequestsToMe: NextPageWithLayout = () => {
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

RequestsToMe.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default RequestsToMe;
