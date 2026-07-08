import Image from "next/image";

export function DisputeResolutionBadges({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
        <Image src="/anpc-sal.png" alt="ANPC — Soluționarea alternativă a litigiilor" width={201} height={50} />
      </a>
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
        <Image src="/sol.png" alt="Soluționarea online a litigiilor" width={201} height={50} />
      </a>
    </div>
  );
}
