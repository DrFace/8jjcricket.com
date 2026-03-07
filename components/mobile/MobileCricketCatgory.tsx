import { CRICKET_CATEGORIES } from "@/lib/constant";
type Props = {
  selected: string;
  setSelected: (cat: string) => void;
};

const MobileCricketCategory = ({ selected, setSelected }: Props) => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-4">
        {CRICKET_CATEGORIES.map((cat) => {
          const active = selected === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelected(cat)}
              className={[
                "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                "border backdrop-blur",
                active
                  ? "border-amber-300/60 bg-amber-300/15 text-amber-200 shadow"
                  : "border-white/15 bg-white/5 text-sky-100/70 hover:border-amber-300/40 hover:text-sky-100",
              ].join(" ")}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCricketCategory;
