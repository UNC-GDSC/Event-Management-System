import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import { FiShare2, FiCopy, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { Event } from '../../types';

interface ShareEventProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const ShareEvent: React.FC<ShareEventProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const url = `${window.location.origin}/events/${event.id}`;
  const title = `Check out this event: ${event.title}`;
  const description = event.description.substring(0, 150) + '...';

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiShare2 className="text-2xl text-primary-600" />
            <h3 className="text-xl font-bold text-gray-900">Share Event</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 justify-center">
            <FacebookShareButton url={url} title={title}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>

            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={48} round />
            </TwitterShareButton>

            <LinkedinShareButton url={url} title={title} summary={description}>
              <LinkedinIcon size={48} round />
            </LinkedinShareButton>

            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="input-field flex-1 text-sm"
              />
              <button onClick={copyLink} className="btn-primary flex items-center gap-2">
                <FiCopy />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEvent;
