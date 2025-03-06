import { useEffect } from "react";

const Preloader = () => {
  useEffect(() => {
    const imagePaths = [
      "/static/lizardwizard_150x150.png",
      "/static/cactus_1.svg",
      "/static/camel.svg",
      "/static/sabertooth_tiger.svg",

      "/static/lvl1/background_1.png",
      "/static/lvl1/background_2.png",
      "/static/lvl1/background_3.png",
      "/static/lvl1/background_4.png",
      "/static/lvl1/background_5.png",

      "/static/lvl2/background_1.png",
      "/static/lvl2/background_2.png",
      "/static/lvl2/background_3.png",
      "/static/lvl2/background_4.png",
      "/static/lvl2/background_5.png",
      
      "/static/lvl3/background_1.png",
      "/static/lvl3/background_2.png",
      "/static/lvl3/background_3.png",
      "/static/lvl3/background_4.png",
      "/static/lvl3/background_5.png",
    ];

    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, []); // ✅ Runs once when the component mounts

  return null; // ✅ Does not render anything
};

export default Preloader;
