import { Button } from "@/components/ui/button";

interface btnType {
  name: string;
  type: "submit" | "button" | "reset";
  onClick?: () => void;
}

export function EditButton({ name, type, onClick }: btnType) {
  return (
    <Button type={type} onClick={onClick}>
      {name}
    </Button>
  );
}
