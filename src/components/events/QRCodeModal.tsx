import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { FiDownload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { Event } from '../../types';

interface QRCodeModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ event, isOpen, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const url = `${window.location.origin}/events/${event.id}`;

  const downloadQR = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `${event.title}-qr-code.png`;
        link.href = dataUrl;
        link.click();
        toast.success('QR Code downloaded!');
      } catch (error) {
        toast.error('Failed to download QR code');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Event QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div ref={qrRef} className="bg-white p-6">
          <div className="flex flex-col items-center">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              includeMargin={true}
            />
            <div className="mt-4 text-center">
              <h4 className="font-bold text-lg text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Scan to view event details
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
        >
          <FiDownload />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
