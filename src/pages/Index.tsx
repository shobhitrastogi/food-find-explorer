
import Layout from "@/components/Layout";
import ProductList from "@/components/ProductList";

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Discover Food Products</h1>
        <ProductList />
      </div>
    </Layout>
  );
};

export default Index;
