import FileCard from "@/components/cards/FIleCard";
import FolderCard from "@/components/cards/FolderCard";
import useDb from "@/hooks/useDb";
import useInterval from "@/hooks/useInterval";
import MainLayout from "@/layouts";
import { IBloc } from "@/types/Bloc";
import { IBlocFile } from "@/types/BlocFile";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";

const MyFiles: NextPageWithLayout = () => {
  const { getOwnerBlocs, getOwnerFiles } = useDb();
  const [blocs, setBlocs] = useState<IBloc[]>([]);
  const [files, setFiles] = useState<IBlocFile[]>([]);

  const getBlocs = async () => {
    const resp = await getOwnerBlocs();
    if (resp.status === "ok") {
      setBlocs(resp.data);
    } else {
      toast.error(resp.msg);
    }
  };

  const getFiles = async () => {
    const resp = await getOwnerFiles();
    if (resp.status === "ok") {
      setFiles(resp.data);
    } else {
      toast.error(resp.msg);
    }
  };

  useInterval(() => {
    getBlocs();
    getFiles();
  }, 10000);

  return (
    <>
      <Head>
        <title>Vetra | My Files</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              My Files
            </h1>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 capitalize my-2">
            Folders
          </h3>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-3">
            {blocs.length > 0 ? (
              blocs.map((bloc) => (
                <FolderCard
                  key={bloc.entityId}
                  title={bloc.displayName}
                  hrefPath={`/dashboard/folder/${bloc.entityId}`}
                />
              ))
            ) : (
              <div className="font-bold text-gray-700 mt-2 text-xl">
                You haven&apos;t created any folder yet! 😢 Create One 😂
              </div>
            )}
          </div>
          <h2 className="text-sm font-semibold text-gray-800 capitalize lg:text-xl mt-8 mb-4">
            All Files
          </h2>
          {files.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-4 mb-4">
              {files.map((fileItem) => (
                <FileCard key={fileItem.entityId} file={fileItem} />
              ))}
            </div>
          ) : (
            <div className="font-bold text-gray-700 mt-2 text-xl">
              You haven&apos;t uploaded any file yet! 😢 Upload One 😂
            </div>
          )}
        </div>
      </section>
    </>
  );
};

MyFiles.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default MyFiles;
