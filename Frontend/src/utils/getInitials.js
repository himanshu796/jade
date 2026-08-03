export const getInitials = (fullname = "", fallback = "?") => {
  const initials = fullname
    .trim()
    .split(/\s+/)          // splits on any amount of whitespace, handles extra spaces
    .filter(Boolean)        // drops empty strings just in case
    .map((word) => word[0])
    .slice(0, 2)             // cap at 2 letters
    .join("")
    .toUpperCase();

  return initials || fallback;
};