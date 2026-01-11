export default function LoadingState({ label }: { label: string }) {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300 border-t-transparent mx-auto"></div>
      <p className="text-white mt-4 font-medium">{label}</p>
    </div>
  );
}
