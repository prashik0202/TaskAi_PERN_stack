import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "IN_REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "DONE":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-400";
    case "medium":
      return "bg-orange-400";
    case "high":
      return "bg-red-400";
  }
};

export const getStatusColorCard = (status: string) => {
  switch (status) {
    case "TODO":
      return "bg-neutral-700";
    case "IN_PROGRESS":
      return "bg-sky-500";
    case "IN_REVIEW":
      return "bg-yellow-500";
    case "DONE":
      return "bg-green-500";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "TODO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "IN_REVIEW":
      return "In Review";
    case "DONE":
      return "Done";
    default:
      return "Unknown";
  }
};

export const getColumnColor = (status: string) => {
  switch (status) {
    case "TODO":
      return "border-gray-200";
    case "IN_PROGRESS":
      return "border-blue-200";
    case "IN_REVIEW":
      return "border-yellow-200";
    case "DONE":
      return "border-green-900";
    default:
      return "border-gray-200";
  }
};
