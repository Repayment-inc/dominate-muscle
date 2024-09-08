import apiClient from "@/lib/api-client";

export const fetchExercises = async () => {
    // const apiClient = useApiClient(); // 使うとリクエストがうまくいかない
    try {
      console.log("aaa");
      const response = await apiClient.post("/exercise/get-all-exercises");
  
      if (response.status !== 200) {
        const errorData = await response.data;
        throw new Error(errorData.message || "Exercise fetch failed");
      }
  
      console.log(response.data.resultCode);
      // console.log(response.data.resultData);
  
      return response.data.resultData;
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };
  
  