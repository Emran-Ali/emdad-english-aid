
const Modal = ({ isOpen, onClose, children, title, size }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    console.log(size);

    let modalSize = '';
    if (size === 'large') modalSize = 'w-10/12';
    if (size === 'small') modalSize = 'w-4/12';

    return (
        <div className="fixed inset-0 flex items-center justify-center transition ease-in-out delay-[3000]duration-1000 bg-black bg-opacity-50" onClick={handleOutsideClick}>
            <div className={`bg-white rounded-lg shadow-lg p-6 relative ${size ? modalSize : 'w-6/12'}`}>
                <button
                    className="absolute top-2 right-3 text-red-500 hover:text-red-700"
                    onClick={onClose}
                >
                    &#x2715; {/* Close button */}
                </button>
                {title && <div className="text-xl font-bold text-cyan-700">{title}</div>}
                <div className='text-black w-full'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal