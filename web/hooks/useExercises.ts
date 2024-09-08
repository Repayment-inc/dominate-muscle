import { useState, useEffect } from "react";
import { fetchExercises } from "@/services/api/exercise";

type Exercise = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

type ResultData = {
  exercises: Exercise[];
};

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const resultData: ResultData | null = await fetchExercises();
        if (resultData) {
          setExercises(resultData.exercises);
        } else {
          setError("Failed to load exercises");
        }
      } catch (error) {
        setError("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, []);

  return { exercises, loading, error };
};
