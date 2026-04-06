const Modal = ({isOpen, onClose, children, title, size}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center transition ease-in-out duration-300 bg-black bg-opacity-50 z-50 p-4'
      onClick={handleOutsideClick}>
      <div
        className={`bg-white rounded-lg shadow-lg p-6 relative transition-all duration-300 ${
          size === 'small' ? 'max-w-md w-full' : 
          size === 'large' ? 'max-w-4xl w-full' : 
          size === 'xl' ? 'max-w-6xl w-full' : 
          'max-w-2xl w-full'
        } ml-4 mr-4`}>
        <button
          className='absolute top-2 right-3 text-red-500 hover:text-red-700'
          onClick={onClose}>
          &#x2715; {/* Close button */}
        </button>
        {title && (
          <div className='text-xl font-bold text-cyan-700'>{title}</div>
        )}
        <div className='text-black w-full'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
