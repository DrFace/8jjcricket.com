import "../../src/styles/musicPlayer.css";

export const PlayingAnimation = () => {
  return (
    <div className="flex items-end gap-[3px] h-5">
      <span
        className="bar1 w-[3px] rounded-full bg-white"
        style={{ height: "6px" }}
      />
      <span
        className="bar2 w-[3px] rounded-full bg-white"
        style={{ height: "14px" }}
      />
      <span
        className="bar3 w-[3px] rounded-full bg-white"
        style={{ height: "10px" }}
      />
      <span
        className="bar4 w-[3px] rounded-full bg-white"
        style={{ height: "4px" }}
      />
    </div>
  );
};
