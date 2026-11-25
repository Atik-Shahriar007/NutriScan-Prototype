import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function ScanTab() {
  const router = useRouter();
  useEffect(() => {
    router.push("/scan");
  }, [router]);
  return null;
}
