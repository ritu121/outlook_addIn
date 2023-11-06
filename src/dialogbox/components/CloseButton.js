
const CloseButton = ({ onClose }) => (
    <div>
        <button
            onClick={onClose}
            className="py-3 w-full text-xl text-white bg-slt-blue hover:bg-slt-blue-light rounded-2xl">
            <span>Close</span>
        </button>
    </div>
);

export default CloseButton;