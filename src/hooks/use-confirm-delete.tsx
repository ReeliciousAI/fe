import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { JSX, useState } from "react";

function ConfirmDialogPopUp({
  open,
  title,
  message,
  retypeValue,
  handleConfirm,
  handleCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  retypeValue?: string;
  handleConfirm?: () => void;
  handleCancel?: () => void;
}) {
  const [userInput, setUserInput] = useState("");

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        {retypeValue && (
          <>
            <p>
              Type{" "}
              <code className="bg-gray-200 rounded p-1">{retypeValue}</code> to
              confirm
            </p>
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.currentTarget.value)}
            />
          </>
        )}

        <AlertDialogFooter className="pt-2">
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant={"destructive"}
            disabled={retypeValue ? retypeValue != userInput : false}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const useConfirmDelete = (
  title: string,
  message: string,
  retypeValue?: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <ConfirmDialogPopUp
      open={promise != null}
      handleConfirm={handleConfirm}
      handleCancel={handleCancel}
      title={title}
      message={message}
      retypeValue={retypeValue}
    />
  );

  return [ConfirmDialog, confirm];
};
