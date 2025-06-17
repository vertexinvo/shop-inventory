const BetaBadge = ({ text = "Beta", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white  ${className}`}
    >
      {text}
    </span>
  );
};

export default BetaBadge;