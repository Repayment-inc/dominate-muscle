import { z } from "zod";
import { AddWorkoutType, EditWorkoutType } from "./workout.type";
import { dateSchema } from "../common/schemas";

const BaseSetSchema = z.object({
  setNumber: z.number().int().min(1),
  weight: z.number().min(0),
  reps: z.number().int().min(1),
})

const BaseExerciseSchema = z.object({
  exerciseId: z.number(),
})

const BaseWorkoutSchema = z.object({
  date: dateSchema,
  sessionTitle: z.string(),
});


// ワークアウト追加 start
const AddSetSchema = BaseSetSchema;

const AddExerciseSchema = BaseExerciseSchema.extend({
  sets: z.array(AddSetSchema),
});

const AddWorkoutSchema = BaseWorkoutSchema.extend({
  workouts: z.array(
    AddExerciseSchema,
  ),
}) satisfies z.ZodType<OmitStrict<AddWorkoutType, 'userId'>>;

const AddWorkoutReqSchema = z.object({
  body: AddWorkoutSchema
})
// ワークアウト追加 end 


// ワークアウト編集 start
const EditSetSchema = BaseSetSchema.extend({
  setId: z.number(),
  status: z.string(),
})

const EditExerciseSchema = BaseExerciseSchema.extend({
  sets: z.array(EditSetSchema),
});

const EditWorkoutSchema = BaseWorkoutSchema.extend({
  sessionId: z.number(),
  workouts: z.array(
    EditExerciseSchema,
  ),
}) satisfies z.ZodType<EditWorkoutType>;

const EditWorkoutReqSchema = z.object({
  body: EditWorkoutSchema
})
// ワークアウト編集 end

export { AddWorkoutReqSchema, EditWorkoutReqSchema }
