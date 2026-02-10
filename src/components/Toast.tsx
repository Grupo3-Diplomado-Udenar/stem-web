interface ToastProps {
    message: string;
    type: "success" | "error";
    position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

export default function Toast({ message, type, position = "top-right" }: ToastProps) {
    const styles =
        type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white";
    const positionStyles =
        position === "top-center"
            ? "left-1/2 top-6 -translate-x-1/2"
            : position === "bottom-center"
            ? "left-1/2 bottom-6 -translate-x-1/2"
            : position === "bottom-right"
            ? "right-6 bottom-6"
            : "right-6 top-6";

    return (
        <div className={`fixed z-50 ${positionStyles}`}>
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg ${styles}`}>
                <span className="text-sm font-semibold">{message}</span>
            </div>
        </div>
    );
}
