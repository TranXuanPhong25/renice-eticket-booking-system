import { Carousel } from "antd";

export const EventSlider = () => {
  return (
    <>
      <Carousel autoplay className="mb-5">
        <div className="h-[250px]">
          <img
            className="object-contain w-full"
            src="https://assets.cticket.vn/tix/2025-kim-jaejoong-asia-tour-concert-beauty-in-chaos-in-hanoi/Thumbnail_1600%20x%20900%20px.webp?w=1500&q=75"
          />
        </div>
        <div className="h-[250px]">
          <img
            className="object-contain w-full"
            src="https://assets.cticket.vn/tix/uppoom-1st-fan-meeting-vietnam-my-stand-in-world-tour/2.thumbnail_1600x900.webp?w=1500&q=75"
          />
        </div>
      </Carousel>
    </>
  );
};
