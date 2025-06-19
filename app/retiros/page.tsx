import React from "react";

const videos = [
  {
    url: "https://www.youtube.com/embed/zusCHPjHj0Q",
    title: "Retiro Parque Nacional Conguillio 24'"
  },
  {
    url: "https://www.youtube.com/embed/cxFPlW3_wEY",
    title: "Retiro Amor Propio 24'"
  },
  {
    url: "https://www.youtube.com/embed/MfYuX4hveJ4",
    title: "Testimonio 24'"
  },
  {
    url: "https://www.youtube.com/embed/abvDCGdGQWk",
    title: "Retiro en el Mar 24'"
  }
];

export default function RetirosPage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white min-h-screen">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">Retiros</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg shadow-lg p-4 flex flex-col items-center">
              <div className="w-full aspect-video rounded overflow-hidden mb-4">
                <iframe
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded"
                />
              </div>
              <h2 className="text-lg font-semibold text-center">{video.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 