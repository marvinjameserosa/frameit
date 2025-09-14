import Image from "next/image";

const Header = ({ textMutedOnBg }: { textMutedOnBg: string }) => (
  <header className="text-center mb-6 md:mb-10">
    <div className="inline-block relative w-48 h-24">
      <Image
        src="/logo.png"
        alt="SED SPARK 2025 Logo"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
    <h1 className="text-3xl sm:text-4xl font-bold mt-2">FrameIt</h1>
    <p className={`${textMutedOnBg} mt-2 max-w-2xl mx-auto`}>
      Upload your photo to generate your personalized frame. Made by ICPEP SE -
      PUP
    </p>
  </header>
);

export default Header;
