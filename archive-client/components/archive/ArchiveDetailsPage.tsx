import { BreadcrumbDemo } from "./BreadcrumbDemo";
import ArticlePage from "./ArticlePage";

const ArchiveDetailsPage = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbDemo />
      </div>

      <ArticlePage />
    </>
  );
};

export default ArchiveDetailsPage;
