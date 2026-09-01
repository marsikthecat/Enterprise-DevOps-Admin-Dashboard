import { useCallback, useEffect, useState } from "react";

export interface CurrentUser {
  name: string;
  email: string;
}

function readStoredUser(): CurrentUser {
  try {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) return { name: "User", email: "" };

    const parsedUser = JSON.parse(storedUser) as Partial<CurrentUser>;
    return {
      name: parsedUser?.name || "User",
      email: parsedUser?.email || "",
    };
  } catch {
    return { name: "User", email: "" };
  }
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(() => readStoredUser());

  const syncUser = useCallback(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser]);

  const setCurrentUser = useCallback((nextUser: CurrentUser) => {
    localStorage.setItem("authUser", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearCurrentUser = useCallback(() => {
    localStorage.removeItem("authUser");
    setUser({ name: "User", email: "" });
  }, []);

  return {
    ...user,
    setCurrentUser,
    clearCurrentUser,
  };
}
