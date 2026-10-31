import { useState, type ReactNode } from "react";
import { Button } from "../ui/button";
import { ErrorBoundary } from "./ErrorBoundary";
import { ErrorState } from "./ErrorState";

export default { title: "Views/ErrorBoundary", component: ErrorBoundary, tags: ["autodocs"] };

function Failure({ shouldFail }: { shouldFail: boolean }): ReactNode {
  if (shouldFail) throw new Error("Workspace failed to render.");
  return <p>Workspace recovered.</p>;
}

function RecoveryExample() {
  const [shouldFail, setShouldFail] = useState(true);
  return (
    <ErrorBoundary
      componentName="Workspace"
      fallback={(error, reset) => (
        <ErrorState
          title="Unable to display workspace"
          message={error.message}
          retryLabel="Retry"
          onRetry={() => {
            setShouldFail(false);
            reset();
          }}
        />
      )}
    >
      <Failure shouldFail={shouldFail} />
    </ErrorBoundary>
  );
}

export const Recovery = { render: () => <RecoveryExample /> };
export const Healthy = {
  render: () => (
    <ErrorBoundary fallback={(error) => <ErrorState message={error.message} />}>
      <Button>Working action</Button>
    </ErrorBoundary>
  ),
};
