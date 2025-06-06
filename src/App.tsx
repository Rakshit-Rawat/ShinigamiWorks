import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

import Navbar from "./Navbar";

type HeroSectionProps = {
  scrollYProgress: MotionValue<number>;
  background: string;
};

type SubSectionProps = {
  title: string;
  sectionNumber: number;
  isBottom: boolean;
  imageUrl?: string;
};

const HeroSection = ({ scrollYProgress, background }: HeroSectionProps) => {
  const x1 = useTransform(scrollYProgress, [0, 0.2], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 0.25], [0, -250]);

  return (
    <div className="relative h-full w-full text-8xl font-bold overflow-hidden">
      <motion.h1
        style={{ x: x1 }}
        className="absolute left-[30%] top-28 z-10 text-[#fcfaf5] mix-blend-difference"
      >
        CONVERSE
      </motion.h1>
      <motion.h1
        style={{ x: x2 }}
        className="absolute left-[40%] top-[25%] z-10 text-[#fcfaf5] mix-blend-difference"
      >
        ANIKET RANA
      </motion.h1>
      <div className="flex h-full w-full" style={{ transform: 'translateZ(0)' }}>
        {/* Added overflow-hidden to both sides */}
        <div className="w-[46%] bg-[url('/photo.jpg')] bg-cover overflow-hidden" style={{ transform: 'translateZ(0)' }}></div>
        <div className="w-[54%] relative bg-white overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          <motion.div
            className="absolute inset-0 bg-black"
            initial={false}
            animate={{ 
              y: background === "dark" ? "-100%" : "0%"
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.25, 1]
            }} 
          />
        </div>
      </div>
    </div>
  );
};

const SubSection = ({
  title,
  sectionNumber,
  isBottom,
  imageUrl,
}: SubSectionProps) => (
  <div className="relative h-full w-full bg-white overflow-hidden">
    <div
      className={`absolute left-0 right-0 mx-auto flex h-[60%] w-[50%] flex-col items-center justify-center z-10 ${
        isBottom ? "bottom-0" : "top-0"
      }`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: imageUrl ? undefined : "#ef4444",
      }}
    />
  </div>
);

const App = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [background, setBackground] = useState<"light" | "dark">("light");
  const totalOriginalSections = 13;

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionImages = ["/blue.jpg", "/rose.jpg"];

  const sections = [
    {
      id: 1,
      Component: HeroSection,
      width: 100,
    },
    ...Array.from({ length: totalOriginalSections - 1 }, (_, index) => ({
      id: index + 2,
      Component: () => (
        <SubSection
          title={`Subsection ${index + 1}`} 
          sectionNumber={index + 2}
          isBottom={index % 2 === 0}
          imageUrl={sectionImages[index % sectionImages.length]}
        />
      ),
      width: 100,
    })),
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalWidth = sections.reduce((acc, section) => acc + section.width, 0);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${totalWidth - 100}vw`],
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const sectionWidth = 1 / totalOriginalSections;
      const sectionIndex = Math.min(
        Math.floor(value / sectionWidth) + 1,
        totalOriginalSections,
      );
      setCurrentSection(sectionIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, totalOriginalSections]);

  return (
    <div className="relative">
      <Navbar
        currentSection={currentSection}
        totalOriginalSections={totalOriginalSections}
        onToggleBackground={() =>
          setBackground((prev) => (prev === "light" ? "dark" : "light"))
        }
      />

      <div
        ref={containerRef}
        style={{ height: `${totalOriginalSections * 100}vh` }}
      >
        {/* Added overflow-hidden to the sticky container */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Added will-change-transform for better rendering */}
          <motion.div 
            style={{ x }} 
            className="flex h-full w-full relative will-change-transform"
          >
            {sections.map((section) => {
              const { Component } = section;
              return (
                // Added overflow-hidden to each section container
                <div
                  key={section.id}
                  className="h-full flex-shrink-0 overflow-hidden"
                  style={{ width: `${section.width}vw` }}
                >
                  <Component
                    scrollYProgress={scrollYProgress}
                    background={background}
                  />
                </div>
              );
            })}
            
            {/* Enhanced overlay with precise positioning */}
            <motion.div
              className="absolute top-0 bg-black pointer-events-none"
              style={{
                left: "100vw",
                width: `${(totalOriginalSections - 1) * 100}vw`,
                height: "100%",
                // Ensure perfect alignment with sections
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden'
              }}
              initial={false}
              animate={{ 
                y: background === "dark" ? "-100%" : "0%"
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.1, 0.25, 1]
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default App;