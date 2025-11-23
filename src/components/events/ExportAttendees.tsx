import React from 'react';
import { useEventRSVPs } from '../../hooks/useRSVPs';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { unparse } from 'papaparse';

interface ExportAttendeesProps {
  eventId: string;
  eventTitle: string;
}

const ExportAttendees: React.FC<ExportAttendeesProps> = ({ eventId, eventTitle }) => {
  const { rsvps, loading } = useEventRSVPs(eventId);

  const exportToCSV = () => {
    const attendees = rsvps.filter((rsvp) => rsvp.status === 'going');

    if (attendees.length === 0) {
      toast.error('No attendees to export');
      return;
    }

    const data = attendees.map((attendee) => ({
      Name: attendee.userName,
      Email: attendee.userEmail,
      Status: attendee.status,
      'Number of Guests': attendee.numberOfGuests,
      'RSVP Date': new Date(attendee.createdAt).toLocaleDateString(),
    }));

    const csv = unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${eventTitle}-attendees.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Attendees list exported!');
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={loading}
      className="btn-secondary flex items-center gap-2"
    >
      <FiDownload />
      Export Attendees
    </button>
  );
};

export default ExportAttendees;
