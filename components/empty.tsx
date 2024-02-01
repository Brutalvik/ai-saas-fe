import Image from "next/image";

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justiy-center">
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};
