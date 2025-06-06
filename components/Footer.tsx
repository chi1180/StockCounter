import Link from "next/link";

export default function Footer() {
  const SectionData = [
    {
      title: "ダッシュボード",
      path: "/",
    },
    {
      title: "商品管理",
      path: "/stocks_management",
    },
    {
      title: "カウンター",
      path: "/counter",
    },
    {
      title: "フィードバック",
      path: "https://docs.google.com/forms/d/e/1FAIpQLSeSsh9IXsh3xARh1rLDKflU4G2sp-0mlt6DIAZBtjBz4kpojg/viewform?usp=dialog",
    },
  ];

  return (
    <footer className="w-screen py-20 px-2 sm:py-40 bg-(--footer) flex flex-col gap-20 sm:gap-40 items-center *:text-(--light)">
      <div className="w-full flex items-center justify-around sm:justify-center sm:gap-96">
        <div className="">
          <h1 className="text-4xl sm:text-7xl">Stock counter</h1>
          <div className="w-40 aspect-square bg-cover bg-center rounded-lg bg-[url('/logo.png')] mt-4 sm:mt-12 ml-4 sm:ml-12" />
        </div>
        <ol className="w-fit flex flex-col gap-6 sm:gap-12">
          {SectionData.map((section) => {
            return (
              <li key={section.title}>
                <Link
                  href={section.path}
                  className="text-xl sm:text-2xl hover:text-(--accent-normal)"
                  target={section.path.at(0) !== "/" ? "_blank" : ""}
                >
                  {section.title}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="text-center">
        2025 Stock counter - for Kamokita high school festival
      </p>
    </footer>
  );
}
