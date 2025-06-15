import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import type { Task } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { priorityOptions, statusOptions } from "@/utils/constant";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Loader } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskSchema, type TaskSchemaType } from "@/types/schema";
import { toast } from "sonner";
import { taskService } from "@/services/taskService";
import { usePlatform } from "@/context/PlatformContext";

interface TaskFormProps {
  projectId: string;
  task?: Task;
  trigger: React.ReactNode;
}

const TaskForm = ({ projectId, task, trigger }: TaskFormProps) => {

  const { handleSubmit, register, reset, formState : { errors, isLoading }, control } = useForm<TaskSchemaType>({
    resolver : zodResolver(TaskSchema),
    defaultValues : task ? (
      {
        taskName : task.taskName,
        description : task.description,
        dueDate : task.dueDate,
        priority : task.priority,
        status : task.status
      }
    ) : undefined
  });
  const { dispatch  } = usePlatform();

  const [open, setOpen] = useState(false);

  const handleTaskFormSubmit = async(data : TaskSchemaType) => {
    try {
      const newTask = await taskService.createTask(projectId,data);
      dispatch({ type : "ADD_TASK", payload : newTask.data });
    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setOpen(false);
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button variant="outline">Open Dialog</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(handleTaskFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>you can create your tasks</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label htmlFor="taskName">Task Name</Label>
              <Input id="taskName" {...register("taskName")} />
              {errors.taskName && (
                <p className="text-xs text-red-500">{errors.taskName.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" className="resize-none" {...register("description")}/>
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller 
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label>Status</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.displayValue}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-xs text-red-500">{errors.status.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller 
                control={control}
                name="priority"
                render={({ field }) => (
                  <div className="grid gap-3">
                    <Label>Status</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.displayValue}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.priority && (
                      <p className="text-xs text-red-500">{errors.priority.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <Controller 
              control={control}
              name="dueDate"
              render={({ field }) => (
                <div className="grid gap-3">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()}/>
                    </PopoverContent>
                  </Popover>
                  {errors.dueDate && (
                    <p className="text-xs text-red-500">{errors.dueDate.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{ isLoading ? <Loader className="h-5 w-5 animate-spin"/> : "Create" }</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
