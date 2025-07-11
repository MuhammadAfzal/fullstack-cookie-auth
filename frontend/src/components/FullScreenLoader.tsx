interface Props {
  message?: string;
}

export default function FullScreenLoader({ message }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300">
      <div className="animate-spin h-12 w-12 mb-4 rounded-full border-4 border-blue-500 border-t-transparent" />
      {message && (
        <p className="text-gray-700 dark:text-gray-200 text-sm">{message}</p>
      )}
    </div>
  );
}
