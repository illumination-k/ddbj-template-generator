import React from "react";

export default function createCtx<T>() {
  const ctx = React.createContext<T | undefined>(undefined);

  const useCtx = () => {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  };

  return [useCtx, ctx.Provider] as const;
}
