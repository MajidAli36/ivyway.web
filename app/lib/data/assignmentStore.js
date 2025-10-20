// Shared assignment data store for real-time updates between teacher and tutor
class AssignmentStore {
  constructor() {
    this.assignments = [];
    this.listeners = [];
    this.loadFromStorage();
  }

  // Load assignments from localStorage on initialization
  loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ivyway_assignments');
      if (stored) {
        this.assignments = JSON.parse(stored);
      }
    }
  }

  // Save assignments to localStorage
  saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ivyway_assignments', JSON.stringify(this.assignments));
    }
  }

  // Add a new assignment
  addAssignment(assignment) {
    const newAssignment = {
      id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assignment,
      status: 'pending',
      assignedAt: new Date().toISOString(),
      acceptedAt: null,
      declinedAt: null,
      declineReason: null,
      currentStatus: null
    };
    
    this.assignments.push(newAssignment);
    this.saveToStorage();
    this.notifyListeners();
    return newAssignment;
  }

  // Update assignment status
  updateAssignment(assignmentId, updates) {
    const index = this.assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.assignments[index] = { ...this.assignments[index], ...updates };
      this.saveToStorage();
      this.notifyListeners();
      return this.assignments[index];
    }
    return null;
  }

  // Get assignments by tutor ID
  getAssignmentsByTutor(tutorId) {
    return this.assignments.filter(a => a.providerId === tutorId);
  }

  // Get assignments by teacher ID
  getAssignmentsByTeacher(teacherId) {
    return this.assignments.filter(a => a.teacherId === teacherId);
  }

  // Get assignments by status
  getAssignmentsByStatus(status) {
    return this.assignments.filter(a => a.status === status);
  }

  // Get all assignments
  getAllAssignments() {
    return this.assignments;
  }

  // Accept assignment
  acceptAssignment(assignmentId) {
    return this.updateAssignment(assignmentId, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      currentStatus: 'active'
    });
  }

  // Decline assignment
  declineAssignment(assignmentId, reason) {
    return this.updateAssignment(assignmentId, {
      status: 'declined',
      declinedAt: new Date().toISOString(),
      declineReason: reason
    });
  }

  // Update assignment status
  updateAssignmentStatus(assignmentId, status, notes) {
    return this.updateAssignment(assignmentId, {
      currentStatus: status,
      statusNotes: notes,
      lastUpdated: new Date().toISOString()
    });
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.assignments));
  }

  // Clear all assignments (for testing)
  clearAll() {
    this.assignments = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // Add some sample data for testing
  addSampleData() {
    if (this.assignments.length === 0) {
      const sampleAssignments = [
        {
          id: 'assign_sample_001',
          teacherId: 'teacher_001',
          studentId: 'student_001',
          providerId: 'tutor_001',
          providerRole: 'tutor',
          assignmentType: 'tutoring',
          subjects: ['Mathematics'],
          goals: 'Master calculus concepts',
          specialInstructions: 'Focus on problem-solving techniques',
          startDate: '2024-01-15',
          endDate: '2024-06-15',
          frequency: 'weekly',
          sessionDuration: 60,
          status: 'pending',
          assignedAt: '2024-01-10T10:00:00Z',
          referralStudent: {
            id: 'student_001',
            fullName: 'Emma Davis',
            email: 'emma.davis@school.edu',
            grade: '11th Grade',
            school: 'Lincoln High School'
          },
          assignmentTeacher: {
            id: 'teacher_001',
            fullName: 'Ms. Sarah Johnson',
            email: 'sarah.johnson@school.edu',
            school: 'Lincoln High School'
          },
          referral: {
            id: 'referral_001',
            studentName: 'Emma Davis',
            gradeLevel: '11th Grade',
            subjects: ['Mathematics'],
            academicGoals: 'Improve math skills and prepare for SAT'
          }
        }
      ];

      sampleAssignments.forEach(assignment => {
        this.assignments.push(assignment);
      });
      this.saveToStorage();
      this.notifyListeners();
    }
  }
}

// Create singleton instance
const assignmentStore = new AssignmentStore();

// Add sample data if no assignments exist
assignmentStore.addSampleData();

export default assignmentStore;
