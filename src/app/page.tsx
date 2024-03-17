import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-full flex-row items-center justify-evenly">
      <div className="flex min-h-screen w-full flex-row items-center justify-evenly bg-primary">
        <section className="w-1/3 border-2 min-h-screen flex flex-col p-5">
          <div>Hour Logger</div>
        </section>
        <section className="w-1/3 border-2 min-h-screen flex flex-col justify-evenly align-center p-5">
          <div>Timer</div>
          <div>Graph</div>
          <div>Daily Task Todo</div>
        </section>
        <section className="w-1/3 border-2 min-h-screen flex flex-col justify-evenly align-center p-5">
          <div>Year Goals Todo</div>
          <div>Month Goals Todo</div>
          <div>Week Goals Todo</div>
        </section>
      </div>
    </main>
  );
}
