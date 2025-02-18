import React from 'react';
import Modal from './Modal';
import { QRCode } from 'react-qrcode-logo';
import { usePage } from '@inertiajs/react';

function LinkDeviceQrcode(props) {

     const setting = usePage().props.setting;

  return (
    <Modal show={props.isOpen}  onClose={props.onClose}>
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="flex justify-center p-10">
          <div className="text-2xl font-medium text-[#5d596c] ">
            Link Device
          </div>
        </div>
        <div className="px-10 flex justify-center mb-5">
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
             <QRCode  value={""} size={150} logoImage={setting.site_favicon} logoOpacity={0.8} />
            </h3>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={props.onClose}
                className="text-gray-500 bg-[#eaebec] hover:bg-[#eaebec] focus:ring-4 focus:ring-[#eaebec] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Close
              </button>
           
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LinkDeviceQrcode;
