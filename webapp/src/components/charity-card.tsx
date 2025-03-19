import Image from "next/image";

type ImageWithDescriptionProps = {
    imageSrc: string;
    description: string;
  };

const ImageWithDescription = ({ imageSrc, description }: ImageWithDescriptionProps) => {
    return (
      <div className="w-3/4 mx-auto flex items-center gap-4 px-8 pt-2
                      md:px-16 lg:px-24 
                      flex-col md:flex-row 
                      text-center md:text-left
                      " 
      >
        <Image
          src={imageSrc}
          alt="Charity image"
          width={500}
          height={300}
          className="w-1/3 h-auto rounded-lg"
        />
        <p className="text-lg w-2/3">{description}</p>
      </div>
    );
  };
  
  export default ImageWithDescription;
  