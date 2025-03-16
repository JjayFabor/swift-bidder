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
            <AlertDialogContent className="bg-gray-800/95 backdrop-blur-md border border-gray-700 shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-white text-xl">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                        The '{title}' auction will be archived.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 focus:ring-offset-gray-900">Cancel</AlertDialogCancel>
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
