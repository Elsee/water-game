import { Link } from 'wouter';
import { Card } from '@tui-react/card-medium';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">Vibe Workshop</h1>
      <p className="text-xl mb-8">
        Build simple 2D and 3D browser games with pure TypeScript
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GameCard
          title="Counter Demo"
          description="Simple TanStack Store example"
          href="/counter"
        />
        <GameCard
          title="Game Template"
          description="Base game with canvas and HUD"
          href="/game"
        />
        <GameCard
          title="Переливашки"
          description="Water puzzle game with levels"
          href="/water-game"
        />
      </div>

      <div className="mt-12 text-sm">
        <p>Check out the docs for more:</p>
        <ul className="mt-2 space-y-1">
          <li>• <code className="px-2 py-1 rounded">docs/PROMPTS.md</code> — Game ideas</li>
          <li>• <code className="px-2 py-1 rounded">docs/ARCHITECTURE.md</code> — System design</li>
          <li>• <code className="px-2 py-1 rounded">docs/GAME-IDEAS.md</code> — Game catalog</li>
        </ul>
      </div>
    </div>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  href: string;
}

function GameCard({ title, description, href }: GameCardProps) {
  return (
    <Link href={href}>
      <a className="block">
        <Card
          textPosition="top"
          appearance="elevated"
          behaviour="shadow"
          className="h-full"
        >
          <Card.Header>
            <Card.Title>{title}</Card.Title>
            <Card.Subtitle>{description}</Card.Subtitle>
          </Card.Header>
        </Card>
      </a>
    </Link>
  );
}
