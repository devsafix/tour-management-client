import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type ErrorProps = {
  message?: string;
};

export default function Error({ message }: ErrorProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Alert variant="destructive" className="w-full max-w-md">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Oops! Something went wrong.</AlertTitle>
        <AlertDescription>
          {message ||
            "We could not load the data you requested. Please try again later."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
