import apiClient from "@/lib/api-client";

// ワークアウト履歴
export const fetchWorkoutHistory = async () => {
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

export const addWorkout = async (formData: {
  date: string;
  sessionTitle: string;
  workouts: Array<{
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

export const deleteWorkoutHistory = async (date: string) => {
  try {
    const response = await apiClient.post("/workouts/delete", { date });

    if (response.status !== 200) {
      const errorData = await response.data;
      throw new Error(errorData.message || "Workout history deletion failed");
    }

    console.log("Workout history deleted successfully:", response.data);
  } catch (error) {
    console.error("Error deleting workout history:", error);
  }
};

export const updateWorkoutHistory = async (workoutData: {
  sessionId: number;
  date: string;
  sessionTitle: string;
  workouts: Array<{
    exerciseId: number;
    sets: Array<{
      setId: number;
      setNumber: number;
      weight: number;
      reps: number;
      status: "updated" | "unchanged" | "deleted" | "new";
    }>;
  }>;
}) => {
  try {
    console.log("workoutData:", workoutData);
    const response = await apiClient.post("/workouts/edit", workoutData);

    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error updating workout history:", error);
    throw error;
  }
};
