interface Set {
  set_number: number;
  weight: number;
  reps: number;
}

interface Exercise {
  id: number;
  partId: number;
  name: string;
  sets: Set[];
}

interface Part {
  part: string;
  exercises: Exercise[];
}

interface Workout {
  date: string;
  parts: Part[];
}

interface History {
  workoutHistory: Workout[];
}

// サンプルresultData
export const workoutHistoryData: History = {
  workoutHistory: [
    {
      date: "2024-06-01",
      parts: [
        {
          part: "胸",
          exercises: [
            {
              id: 14,
              partId: 4,
              name: "ベンチプレス",
              sets: [
                { set_number: 1, weight: 100.0, reps: 10 },
                { set_number: 2, weight: 100.0, reps: 8 },
              ],
            },
            {
              id: 15,
              partId: 4,
              name: "インクラインベンチプレス",
              sets: [
                { set_number: 1, weight: 100.0, reps: 10 },
                { set_number: 2, weight: 100.0, reps: 8 },
              ],
            },
          ],
        },
      ],
    },
    {
      date: "2024-05-03",
      parts: [
        {
          part: "背中",
          exercises: [
            {
              id: 16,
              partId: 3,
              name: "懸垂",
              sets: [{ set_number: 1, weight: 70.0, reps: 10 }],
            },
          ],
        },
      ],
    },
    {
      date: "2024-06-05",
      parts: [
        {
          part: "胸",
          exercises: [
            {
              id: 14,
              partId: 4,
              name: "ベンチプレス",
              sets: [
                { set_number: 1, weight: 100.0, reps: 10 },
                { set_number: 2, weight: 100.0, reps: 8 },
              ],
            },
            {
              id: 15,
              partId: 4,
              name: "インクラインベンチプレス",
              sets: [
                { set_number: 1, weight: 100.0, reps: 10 },
                { set_number: 2, weight: 100.0, reps: 8 },
              ],
            },
          ],
        },
      ],
    },
  ],
};
