import axios from "axios";

export default async function AxiosFetching(method, endpoint, formData, backendUrl = "http://localhost:8220") {
  try {
    const config = {
      method: method,
      url: `${backendUrl}/${endpoint}`,
      data: formData,
      withCredentials: true,
    };

    const axiosResponse = await axios(config);
    const response = { data: axiosResponse.data, error: null };
    return response;
  } catch (error) {
    const response = { data: null, error: error };
    console.log(response);
    return response;
  }
}
