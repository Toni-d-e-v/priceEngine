'use client';

export function LoadingSpinner({ text = 'Laden...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
}
