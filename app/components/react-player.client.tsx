import ReactPlayer from "react-player";

// Обертка для ReactPlayer с настройками по умолчанию
const CustomReactPlayer = (props: any) => {
  return (
    <ReactPlayer
      {...props}
      config={{
        file: {
          attributes: {
            controlsList: 'nodownload nofullscreen noremoteplayback',
            // Отключаем контекстное меню
            onContextMenu: (e: Event) => e.preventDefault()
          }
        },
        // Объединяем с переданной конфигурацией
        ...props.config
      }}
    />
  );
};

export default CustomReactPlayer;