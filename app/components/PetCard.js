import Link from "next/link";
import SafeImage from "./SafeImage";
import { PET_EMOJI } from "../lib/constants";

export default function PetCard({ pet }) {
  return (
    <Link
      href={"/adopt/" + pet.id}
      className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition block"
    >
      <SafeImage
        src={pet.image_url}
        alt={pet.name}
        className="h-40 w-full"
        emoji={PET_EMOJI[pet.type] || "🐾"}
      />
      <div className="p-3">
        <h3 className="font-semibold text-black">{pet.name}</h3>
        <p className="text-sm text-gray-500">
          {pet.type}, {pet.age}
        </p>
        <p className="text-sm text-gray-500">📍 {pet.location}</p>
      </div>
    </Link>
  );
}
