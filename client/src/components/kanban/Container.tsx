import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical, Plus } from "lucide-react";

interface ContainerProps {
  id: UniqueIdentifier;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onAddItem?: () => void;
}

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 bg-neutral-100 rounded-xl flex flex-col gap-y-4 shadow-xl",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>
        <Button variant={"ghost"} {...listeners}>
          <GripVertical className="h-5 w-5 text-black" />
        </Button>
      </div>

      {children}
      <Button
        variant="ghost"
        onClick={onAddItem}
        className="hover:bg-transparent"
      >
        <Plus /> Task
      </Button>
    </div>
  );
};

export default Container;
