import { useEffect, useState, type ComponentType } from 'react';

interface VideoPlayerProps {
  url: string;
  poster?: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const [ReactPlayerComponent, setReactPlayerComponent] = useState<ComponentType<any> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let mounted = true;
    import('./react-player.client')
      .then((module) => {
        if (!mounted) return;
        const candidate = (module as { default?: unknown }).default ?? (module as unknown);
        if (typeof candidate === 'function') {
          setReactPlayerComponent(() => candidate as ComponentType<any>);
        } else if (
          candidate &&
          typeof candidate === 'object' &&
          'default' in (candidate as Record<string, unknown>) &&
          typeof (candidate as Record<string, unknown>).default === 'function'
        ) {
          setReactPlayerComponent(() => (candidate as { default: ComponentType<any> }).default);
        } else if (process.env.NODE_ENV === 'development') {
          console.error('VideoPlayer: unable to resolve react-player default export', module);
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('VideoPlayer: failed to load react-player', error);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isClient) {
    return (
      <div className="w-full rounded-xl bg-gray-900/40 dark:bg-gray-800/60 animate-pulse" style={{ paddingTop: '56.25%' }} />
    );
  }

  if (ReactPlayerComponent) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-dark-border bg-black" style={{ paddingTop: '56.25%' }}>
        <ReactPlayerComponent
          url={url}
          controls
          width="100%"
          height="100%"
          playing={false}
          light={poster && poster !== 'N/A' ? poster : undefined}
          className="absolute inset-0"
          config={{ file: { attributes: { crossOrigin: 'anonymous' } } }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-dark-border bg-black" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={url}
        title="Video player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
