import LogisticMap from '@/components/simulations/LogisticMap';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    title: t('logisticMapTitle'),
    description: t('logisticMapDescription')
  };
}

const LogisticMapPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <LogisticMap />
    </div>
  );
};

export default LogisticMapPage;
