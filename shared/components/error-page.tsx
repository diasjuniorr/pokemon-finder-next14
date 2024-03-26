"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ErrorPage = ({
  msg = "Oops... it looks like something went wrong.",
  callback,
}: {
  msg?: string;
  callback?: () => void;
}) => {
  const router = useRouter();

  const handleTryAgain = () => {
    if (callback) {
      callback();
      return;
    }
    router.push("/");
  };

  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <Image
          src="/togepi-error.png"
          alt="sad togepi"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </h1>

        <p className="mt-4 text-gray-500 mb-6">{msg}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  );
};
