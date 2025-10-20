'use client';

import { useState, useEffect } from 'react';
import SessionsHeader from './components/SessionsHeader';
import SessionsFilter from './components/SessionsFilter';
import SessionsTable from './components/SessionsTable';
import SessionDetailsModal from './components/SessionDetailsModal';
import SessionEditModal from './components/SessionEditModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { formatSessions } from './utils/sessionHelpers';
import { API_CONFIG } from '../../../lib/api/config'; // Import the API configuration
import { useNotificationHelpers } from "../../../components/shared/NotificationSystem";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);

  // Update pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Modal state
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const { showSuccess, showError } = useNotificationHelpers();

  // Move fetchSessions outside useEffect so it's accessible everywhere
  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use API_CONFIG.baseURL instead of hardcoded URL
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/sessions?limit=999`,
        {
          // headers: {
          //   'Authorization': `Bearer ${localStorage.getItem('token')}`
          // }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const { data } = await response.json();

      // Transform the API data to match your component's expected format
      const formattedSessions = data.bookings.map((booking) => ({
        id: booking.id,
        student: {
          id: booking.student.id,
          name: booking.student.fullName,
          email: booking.student.email,
        },
        tutor: {
          id: booking.provider.id,
          name: booking.provider.fullName,
          email: booking.provider.email,
          subject: booking.subject || '',
        },
        subject: booking.subject || '',
        topic: booking.topic || '',
        date: new Date(booking.startTime).toISOString().split('T')[0],
        startTime: new Date(booking.startTime).toLocaleTimeString(),
        endTime: new Date(booking.endTime).toLocaleTimeString(),
        duration: (new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60), // Convert to minutes
        status: (booking.status || '').charAt(0).toUpperCase() + (booking.status || '').slice(1),
        notes: booking.notes,
        location: booking.sessionType,
        sessionType: booking.sessionType || '',
        price: booking.price || null,
        planName: booking.planName || '',
        planType: booking.planType || '',
        meetingLink: booking.meetingLink,
      }));

      setSessions(formattedSessions);
      setFilteredSessions(formattedSessions);

      // Update pagination totals
      setPagination((prev) => ({
        ...prev,
        total: formattedSessions.length,
        totalPages: Math.ceil(formattedSessions.length / prev.limit),
      }));
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect now just calls fetchSessions
  useEffect(() => {
    fetchSessions();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = sessions;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (session) =>
          session.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((session) => statusFilter.includes(session.status));
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= dateRange.start && dateRange.end;
      });
    }

    setFilteredSessions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, dateRange, sessions]);

  // Add client-side pagination logic
  const indexOfLastSession = pagination.page * pagination.limit;
  const indexOfFirstSession = indexOfLastSession - pagination.limit;
  const paginatedSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

  // Handlers
  const handleViewSession = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCancelSession = async (sessionId) => {
    // Implement API call to cancel session
    try {
      // await cancelSession(sessionId);

      // Optimistic update
      const updatedSessions = sessions.map((session) =>
        session.id === sessionId ? { ...session, status: 'Canceled' } : session
      );

      setSessions(updatedSessions);
    } catch (err) {
      console.error('Error canceling session:', err);
      // Show error toast or message
    }
  };

  const handleEditSession = (session) => {
    setSessionToEdit(session);
    setIsEditModalOpen(true);
  };

  const handleDeleteSession = (session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Use API_CONFIG.baseURL instead of hardcoded URL
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/sessions/${sessionToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      // Refresh sessions
      fetchSessions();
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
      showSuccess('Deleted', 'Session deleted successfully', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting session:', error);
      showError('Delete failed', error?.message || 'Failed to delete session', { duration: 3000 });
    }
  };

  const handleUpdateSession = async (updatedSession) => {
    try {
      console.log('Updating session with data:', updatedSession); // Debug log

      // Use API_CONFIG.baseURL instead of hardcoded URL
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/sessions/${updatedSession.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            studentId: updatedSession.studentId,
            providerId: updatedSession.providerId,
            startTime: new Date(updatedSession.startTime).toISOString(),
            endTime: new Date(updatedSession.endTime).toISOString(),
            status: updatedSession.status.toLowerCase(),
            sessionType: updatedSession.sessionType,
            notes: updatedSession.notes || '',
            meetingLink: updatedSession.meetingLink || '',
          }),
        }
      );

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update session');
      }

      // Refresh sessions list after successful update
      await fetchSessions();
      setIsEditModalOpen(false);
      setSessionToEdit(null);

      // Show success toast
      showSuccess('Updated', 'Session updated successfully', { duration: 3000 });
    } catch (error) {
      console.error('Error updating session:', error);
      showError('Update failed', error?.message || 'Failed to update session', { duration: 3000 });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <SessionsHeader
        totalSessions={sessions.length}
        completedSessions={sessions.filter((s) => s.status === 'Completed').length}
        scheduledSessions={sessions.filter((s) => s.status === 'Scheduled').length}
      />

      <SessionsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : (
        <SessionsTable
          sessions={paginatedSessions}
          handleViewSession={handleViewSession}
          handleEditSession={handleEditSession}
          handleDeleteSession={handleDeleteSession}
          handleCancelSession={handleCancelSession}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          setCurrentPage={(page) => {
            setPagination((prev) => ({ ...prev, page }));
          }}
          totalSessions={sessions.length}
          pagination={pagination}
        />
      )}

      {selectedSession && (
        <SessionDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={selectedSession}
          onCancel={handleCancelSession}
        />
      )}

      <SessionEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSessionToEdit(null);
        }}
        session={sessionToEdit}
        onUpdate={handleUpdateSession}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
      />
    </div>
  );
}
