import React, { useState, useEffect } from "react";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
// import { Check, ChevronsUpDown } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BODY_PARTS } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Exercise = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

interface ExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exercises: Exercise[];
  onExerciseSelect: (exerciseId: number, exerciseName: string) => void;
}

export const ExerciseDialog: React.FC<ExerciseDialogProps> = ({
  isOpen,
  onOpenChange,
  exercises,
  onExerciseSelect,
}) => {
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<number | null>(
    null,
  );

  // console.log("test" + JSON.stringify(exercises));

  useEffect(() => {
    if (!isOpen) {
      setSelectedBodyPartId(null);
    }
  }, [isOpen]); // isOpen が変更されたときにのみこの効果を実行

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button>エクササイズを選択</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">エクササイズ選択</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          下記からエクササイズを選択してください。
        </DialogDescription>

        {/* 部位を選択するメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-20">
              部位
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-16">
            {BODY_PARTS.map((bodyPart, index) => (
              // <DropdownMenuItem key={index}>
              <DropdownMenuItem key={index} onClick={() => {
                setSelectedBodyPartId((prevSelectedBodyPartId) =>
                  prevSelectedBodyPartId === bodyPart.id ? null : bodyPart.id
                );
              }}>

                <span
                  className={
                    selectedBodyPartId === bodyPart.id
                      ? "text-blue-400 font-bold"
                      : ""
                  }
                >
                  {bodyPart.name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exerciseサーチボックス */}
        <Command className="rounded-lg border shadow-md max-h-[350px]">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {exercises
                .filter(
                  (exercise) =>
                    selectedBodyPartId === null ||
                    exercise.bodyPartId === selectedBodyPartId,
                )
                .map((exercise, index) => (
                  <CommandItem key={`${exercise.exerciseId}-${index}`}>
                    <span className="hidden">{exercise.exerciseName}</span>
                    <TableRow
                      onClick={() =>
                        onExerciseSelect(
                          exercise.exerciseId,
                          exercise.exerciseName,
                        )
                      }
                      className="cursor-pointer w-max"
                    >
                      <TableCell className="font-medium text-center py-0 w-20">
                        <div className="h-10 rounded-full bg-sky-100 flex items-center justify-center">
                          {exercise.bodyPartName}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {exercise.exerciseName}
                      </TableCell>
                    </TableRow>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
