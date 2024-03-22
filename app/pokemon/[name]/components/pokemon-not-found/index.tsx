import Image from "next/image";

export const PokemonNotFound = () => {
  return (
    <div className="grid h-screen place-content-center  px-4">
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

        <p className="mt-4 text-gray-500">{`Pokemon not found.`}</p>
      </div>
    </div>
  );
};
