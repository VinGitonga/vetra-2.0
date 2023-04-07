import PrimaryButton from "@/components/buttons/PrimaryButton";
import FileCard from "@/components/cards/FIleCard";
import useDb from "@/hooks/useDb";
import useInterval from "@/hooks/useInterval";
import MainLayout from "@/layouts";
import { IBlocFile } from "@/types/BlocFile";
import { NextPageWithLayout } from "@/types/Layout";
import { useInkathon } from "@scio-labs/use-inkathon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const SharedWithMe: NextPageWithLayout = () => {
  const { getFilesSharedWithMe } = useDb();
  const { activeAccount } = useInkathon();
  const [files, setFiles] = useState<IBlocFile[]>([]);

  const getFiles = async () => {
    const resp = await getFilesSharedWithMe();
    if (resp.status === "ok") {
      setFiles(resp.data);
    } else {
      toast.error(resp.msg);
    }
  };

  useEffect(() => {
    getFiles();
  }, [activeAccount]);

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
          <PrimaryButton
            text={"Refresh Files"}
            isWidthFull={false}
            onClick={getFiles}
          />
        </div>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-4 mb-4">
            {files.map((fileItem) => (
              <FileCard
                key={fileItem.entityId}
                file={fileItem}
                isShared={true}
              />
            ))}
          </div>
        ) : (
          <div className="font-bold text-gray-700 mt-2">
            No Files yet! Request Some 🚀
          </div>
        )}
      </div>
    </>
  );
};

SharedWithMe.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default SharedWithMe;
