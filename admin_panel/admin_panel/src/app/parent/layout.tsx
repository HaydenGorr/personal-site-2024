'use client'

import { are_we_logged_in } from "../../../utils/is_logged_in";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

interface ParentProps {
  children: React.ReactNode;
}

export default function Parent({ children }: Readonly<ParentProps>) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      await are_we_logged_in(
        () => {
          if (isMounted) {
            if (pathname == "/") router.push("/admin");
          }
        },
        () => {
          if (isMounted) {
            // If we're in login don't route to login
            if (pathname == "/login") return

            router.push('/login');
          }
        }
      );

      if (isMounted) {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div className="flex justify-center">{children}</div>;
}