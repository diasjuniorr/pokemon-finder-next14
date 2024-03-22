import Image from "next/image";
import Link from "next/link";

export const ErrorPage = () => {
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

        <p className="mt-4 text-gray-500">{`Oops... It looks like something went wrong.`}</p>
        <Link href="/">
          <button className="mt-4 bg-slate-500 text-white px-4 py-2 rounded-md">
            Try again
          </button>
        </Link>
      </div>
    </div>
  );
};
