import { capabilities, bySlug } from '../../capabilities';
import Placeholder from '../../placeholder';

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capability = bySlug(slug);

  if (!capability) {
    return (
      <Placeholder
        index="--"
        title="Not found"
        lede="That part of the complex does not exist yet."
        body={['Head back to the complex and pick a capability from the model.']}
        current=""
      />
    );
  }

  return (
    <Placeholder
      index={capability.index}
      title={capability.name}
      status={capability.status === 'TBD' ? 'Process detail and capacity figures — to be confirmed' : undefined}
      lede={capability.summary}
      body={capability.detail}
      current={capability.slug}
    />
  );
}
