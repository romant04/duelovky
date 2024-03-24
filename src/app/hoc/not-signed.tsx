"use client";

import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

export const NotSigned = (Component: FC<any>) =>
  function Comp(props: any) {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.user);
    const { mounted } = useSelector((state: RootState) => state.mount);

    if (!mounted) return null;

    if (!user && mounted) router.push("/main/prihlaseni");

    if (user) return <Component {...props} />;
  };
