import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl">Todos</h1>
      <div>
        <Link href={"/add-todo"} className="bg-blue-500 p-2 rounded">add todo</Link>
      </div>
    </main>
  );
}
