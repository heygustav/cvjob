
export type ToastMessagesType = {
  letterGenerated: {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
  };
  [key: string]: {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
  };
};
