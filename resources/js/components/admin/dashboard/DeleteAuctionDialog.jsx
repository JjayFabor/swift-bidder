import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function DeleteAuctionDialog({ isOpen, onClose, onConfirm, title }) {
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <AlertDialogContent className="backdrop-blur-md shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        The '{title}' auction will be archived.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
                    >
                        Yes, Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
