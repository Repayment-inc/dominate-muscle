import apiClient from "@/api/apiClient";
// import { useApiClient } from "../hooks/useApiClient";

// ユーザ新規登録hook
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch("http://localhost:7000/api/auth/dregister", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (response.status === 400) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Invalid request");
  }

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

// ログインhook
export async function loginUser(userData: { email: string; password: string }) {
  const response = await fetch("http://localhost:7000/api/auth/dlogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const res = await response.json(); // JSONデータをawaitで待つ

  console.log(res.resultData);

  localStorage.setItem("accessToken", res.resultData.accessToken);
  localStorage.setItem("refreshToken", res.resultData.refreshToken);

  return res;
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
