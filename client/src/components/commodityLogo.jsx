const CommodityLogo = ({ onClick, className }) => {
  return (
    <img
      src="/commodity.png" // Correct path for the public folder
      alt="Commodity Logo"
      onClick={onClick}
      width={50}
      height={30}
      className={className}
    />
  );
};

export default CommodityLogo;
