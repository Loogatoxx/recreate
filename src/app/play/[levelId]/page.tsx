import { notFound } from 'next/navigation';
import { Cockpit } from '@/components/cockpit/Cockpit';
import { getLevel } from '@/lib/levels';

type Props = {
  params: Promise<{ levelId: string }>;
};

export default async function PlayPage({ params }: Props) {
  const { levelId } = await params;
  const level = getLevel(levelId);
  if (!level) notFound();
  return <Cockpit level={level} />;
}
