export default function Loader() {
  return (
    <div className='flex flex-col items-center' data-cy='loader'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900'>
        <span className='sr-only'>Aan het laden...</span>
      </div>
    </div>
  );
}
