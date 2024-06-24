import apiClient from "@/api/apiClient";
// import { useApiClient } from "../hooks/useApiClient";

// ユーザ新規登録hook
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    // if(response.)
    const response = await apiClient.post("/auth/dregister", userData);
    return response.data;
  } catch (error) {
    console.error("Error fetching user regist:", error);
  }
}

// ログインhook
export async function loginUser(userData: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/auth/dlogin", userData);
    console.log(response.data.resultData);
    localStorage.setItem("accessToken", response.data.resultData.accessToken);
    localStorage.setItem("refreshToken", response.data.resultData.refreshToken);
    return response.data;
  } catch (error) {
    console.error("Error fetching login:", error);
  }
}

// ワークアウト履歴
export const fetchWorkoutHistory = async () => {
  // const apiClient = useApiClient(); // 使うとリクエストがうまくいかない

  try {
    const response = await apiClient.post("/workouts/history");
    if (response.status === 200) {
      localStorage.setItem(
        "workoutHistory",
        JSON.stringify(response.data.resultData),
      );
    }
  } catch (error) {
    console.error("Error fetching workout history:", error);
  }
};

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

export const addWorkout = async (formData: {
  date: string;
  workout: Array<{
    exerciseId: number;
    sets: Array<{
      setNumber: number;
      reps: number;
      weight: number;
    }>;
  }>;
}) => {
  try {
    const response = await apiClient.post("workouts/add", formData);

    console.log("Success:", response.data);
  } catch (error) {
    console.log(JSON.stringify(formData));
    console.error("Error:", error);
  }
};
