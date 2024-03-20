export default function Loader({ spinnerRef }) {
  return (
    <div className='loader player-spinner' ref={spinnerRef}>
      <svg viewBox='25 25 50 50'>
        <circle r='20' cy='50' cx='50'></circle>
      </svg>
    </div>
  );
}
