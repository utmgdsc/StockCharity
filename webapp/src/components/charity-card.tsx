const ImageWithDescription = ({ imageSrc, description, imagePosition = "left" }) => {
    return (
      <div 
        className={`w-3/4 mx-auto flex items-center gap-4 px-8 pt-2
                    md:px-16 lg:px-24 
                    flex-col md:${imagePosition === "left" ? "flex-row" : "flex-row-reverse"} 
                    text-center md:text-left`}
      >
        <img
          src={imageSrc}
          alt="charity logo"
          className="w-1/3 h-auto rounded-lg"
        />
        <p className="text-lg w-2/3">{description}</p>
      </div>
    );
  };
  
  export default ImageWithDescription;
  