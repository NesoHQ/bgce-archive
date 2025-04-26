import Image from "next/image";
import image from "../app/assets/images/Go-Logo_LightBlue.svg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-blue-600 w-full py-4 text-white text-center text-2xl font-bold">
        Welcome to GoLang Vault
      </header>
      <main className="flex flex-col items-center mt-10">
        <Image src={image} alt="GoLang Logo" width={150} height={150} />
        <h1 className="text-4xl text-center font-bold text-gray-800 mt-6">
          Explore the World of GoLang
        </h1>
        <p className="text-gray-600 mt-4 text-center max-w-2xl">
          Dive into the GoLang Vault to learn about arrays, slices, maps, and
          more. Discover the power of GoLang and enhance your programming skills
          with our comprehensive guides and examples.
        </p>
        <div className="mt-8">
          <a
            href="/docs/services/intereview-qa/topic-wise/mdimamhosen"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </main>
      <footer className="bg-gray-800 w-full py-4 text-white text-center mt-auto">
        © 2025 GoLang Vault. All rights reserved.
      </footer>
    </div>
  );
}
