"use client";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";

export default function Loading() {
  return (
    <div>
      <div className="border-b border-gray-900/10 pb-12 mt-12">
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-4 w-9/10" />
          </CardHeader>
          <CardContent className="h-10" />
          <CardFooter>
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
