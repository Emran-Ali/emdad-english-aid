const Modal = ({isOpen, onClose, children, title, size}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center transition ease-in-out duration-300 bg-black/60 backdrop-blur-sm z-[150] p-4'
      onClick={handleOutsideClick}>
      <div
        className={`bg-cyan-950 border border-cyan-800/50 rounded-2xl shadow-2xl p-6 relative transition-all duration-300 ${
          size === 'small' ? 'max-w-md w-full' : 
          size === 'large' ? 'max-w-4xl w-full' : 
          size === 'xl' ? 'max-w-6xl w-full' : 
          'max-w-2xl w-full'
        } ml-4 mr-4`}>
        <button
          className='absolute top-4 right-4 text-cyan-500 hover:text-red-400 transition-colors'
          onClick={onClose}>
          &#x2715; {/* Close button */}
        </button>
        {title && (
          <div className='text-xl font-bold text-cyan-400 mb-6 pr-8 border-b border-cyan-800/50 pb-4'>{title}</div>
        )}
        <div className='text-cyan-100 w-full overflow-y-auto max-h-[80vh]'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
