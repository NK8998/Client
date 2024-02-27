import "./miniplayer.css";

export default function MiniPlayer({ miniplayerRef }) {
  return (
    <div className='mini-player-outer'>
      <div className='mini-player-inner' ref={miniplayerRef}></div>
    </div>
  );
}
