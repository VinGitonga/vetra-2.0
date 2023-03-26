import { IApiResponse } from "@/types/Api";
import axios from "axios";

const useApi = () => {
  const updateSession = async (
    address: string,
    email: string,
    phone: string
  ) => {
    const res = await axios.post<IApiResponse>("/api/account/auth", {
      address,
      email,
      phone,
    });

    return res.data;
  };

  return {
    updateSession,
  };
};

export default useApi;
