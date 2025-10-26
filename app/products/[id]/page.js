import ProductDetailContent from '../../../components/ProductDetailContent_New';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailContent productId={id} />;
}