import "./miniplayer.css";

export default function MiniPlayer({ miniplayerRef }) {
  return (
    <div className='mini-player-outer'>
      <div className='mini-player-upper'>
        <div className='mini-player-inner miniplayer-upper' ref={miniplayerRef}></div>
      </div>
      <div className='mini-player-bottom'></div>
    </div>
  );
}
