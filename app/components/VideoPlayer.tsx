import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "./react-player.client";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  return (
    <ClientOnly fallback={<div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">Загрузка видео...</div>}>
      {() => (
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="400px"
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            }
          }}
        />
      )}
    </ClientOnly>
  );
}