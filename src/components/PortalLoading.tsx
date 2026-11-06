export function PortalLoading() {
  return (
    <div className="grid min-h-screen place-content-center bg-background text-center">
      <img src="/elimu-bridge-logo.png" alt="ElimuBridge" className="mx-auto h-20 w-20" />
      <p className="mt-4 text-sm text-muted-foreground" role="status">
        Opening your learning space…
      </p>
    </div>
  );
}
