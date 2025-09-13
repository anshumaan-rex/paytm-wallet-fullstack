import { useNavigate } from "react-router-dom";

const SuccessPopup = ({ message, onClose }) => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    onClose();
    navigate("/signin"); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">Success!</h3>
          <p className="text-cyan-200">{message}</p>
          
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 
                     text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;