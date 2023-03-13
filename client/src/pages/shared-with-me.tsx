import PrimaryButton from "@/components/buttons/PrimaryButton";
import FileCard from "@/components/cards/FIleCard";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const SharedWithMe: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Vetra | Shared With Me</title>
      </Head>
      <div className="container px-6 py-3 mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl mb-8">
          Shared With Me
        </h1>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
            All Files
          </h2>
          <PrimaryButton text={"Refresh Files"} isWidthFull={false} />
        </div>
        <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-4 mb-4">
          {[...Array(9)].map((_, i) => (
            <FileCard key={i} file={"File Name"} />
          ))}
        </div>
      </div>
    </>
  );
};

SharedWithMe.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default SharedWithMe;
