import React from 'react';
import Modal from './Modal';

function ConfirmModal(props) {
  return (
    <Modal show={props.isOpen} onClose={props.onClose}>
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="flex justify-center p-10">
          <div className="text-2xl font-medium text-[#5d596c] ">
            Confirm Action
          </div>
        </div>
        <div className="px-10 flex justify-center mb-5">
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              {props.title}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={props.onClose}
                className="text-gray-500 bg-[#eaebec] hover:bg-[#eaebec] focus:ring-4 focus:ring-[#eaebec] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                No
              </button>
              <button
                type="button"
                onClick={()=>{props.onConfirm()}}
                className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
