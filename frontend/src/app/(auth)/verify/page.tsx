import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Verifying email...</div>}>
      <VerifyContent />
    </Suspense>
  );
}