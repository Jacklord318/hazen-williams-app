import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
      {...props}
    />
  );
}
