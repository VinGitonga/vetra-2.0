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

const Dashboard: NextPageWithLayout = () => {
  const [blocs, setBlocs] = useState<IBloc[]>([]);
  const [files, setFiles] = useState<IBlocFile[]>([]);
  const { getOwnerBlocs, getOwnerFiles } = useDb();

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
    getBlocs()
    getFiles()
  }, 10000);


  return (
    <>
      <Head>
        <title>Vetra | Dashboard</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              Dashboard
            </h1>
            
          </div>
          <h1 className="text-xl font-semibold text-gray-800 capitalize mb-4">
            Folders
          </h1>
          {blocs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-3">
              <FolderCard
                title={"All Folders"}
                hrefPath={"/dashboard/folder"}
              />
              {blocs.length > 8
                ? blocs
                    .slice(0, 8)
                    .map((bloc) => (
                      <FolderCard
                        key={bloc.entityId}
                        title={bloc.displayName}
                        hrefPath={`/dashboard/folder/${bloc.entityId}`}
                      />
                    ))
                : blocs.map((bloc) => (
                    <FolderCard
                      key={bloc.entityId}
                      title={bloc.displayName}
                      hrefPath={`/dashboard/folder/${bloc.entityId}`}
                    />
                  ))}
            </div>
          ) : (
            <div className="font-bold text-gray-700 mt-2 text-xl">
              You haven&apos;t created any folder yet! 😢 Create One 😂
            </div>
            // <div className="flex flex-col items-center justify-center h-96">

            // </div>
          )}
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

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
