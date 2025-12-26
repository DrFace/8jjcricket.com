"use client";

import { useMemo, useState } from "react";
import MobileMinigameCard from "@/components/mobile/MobileMinigameCard";
import { CategoryType } from "@/lib/games-api";
import MobileGameDropdown from "./MobileGameDropdown";

type Card = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  category: CategoryType | null;
};

type Props = {
  cards: Card[];
  categories: { id: number; name: string; slug: string }[];
};

export default function MobileMinigamesClient({ cards, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredCards = useMemo(() => {
    if (!selectedCategory) return cards;
    return cards.filter((card) => card.category?.name === selectedCategory);
  }, [cards, selectedCategory]);

  return (
    <>
      {/* Category Dropdown */}
      <MobileGameDropdown
        options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
        value={selectedCategory}
        onChange={setSelectedCategory}
        label="Categories"
      />

      {/* Minigames Grid */}
      {filteredCards.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 text-center shadow-md">
          No games found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fadeIn">
          {filteredCards.map((g) => (
            <div
              key={g.slug}
              className="transition-transform duration-200 hover:scale-105"
            >
              <MobileMinigameCard {...g} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
