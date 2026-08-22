/**
 * KHARANDI ÉCOLE — API CLIENT (TypeScript)
 * Base URL: /api/v1/ecole/
 */

const API_BASE = '/api/v1/ecole';

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = (data as any)?.error || (data as any)?.message || `Erreur HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// 1. AUTHENTIFICATION
export const authApi = {
  activate: (payload: {
    school_name: string;
    email: string;
    phone?: string;
    password?: string;
    activation_code?: string;
    address?: string;
    dpe?: string;
    ministere?: string;
    admin_name?: string;
  }) => fetchJson<any>('/activate', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  login: (payload: { email?: string; password?: string; code?: string }) =>
    fetchJson<any>('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  teacherLogin: (payload: { email?: string; phone?: string; matricule?: string; password?: string }) =>
    fetchJson<any>('/teacher/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// 2. ÉTABLISSEMENTS
export const schoolsApi = {
  getAll: () => fetchJson<{ success: boolean; schools: any[]; count: number }>('/schools'),
  
  getById: (schoolId: string) =>
    fetchJson<{ success: boolean; school: any }>(`/schools/${schoolId}`),
  
  create: (schoolData: any) =>
    fetchJson<{ success: boolean; school: any; message: string }>('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    }),
  
  update: (schoolId: string, updates: any) =>
    fetchJson<{ success: boolean; school: any; message: string }>(`/schools/${schoolId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  
  delete: (schoolId: string) =>
    fetchJson<{ success: boolean; message: string }>(`/schools/${schoolId}`, {
      method: 'DELETE',
    }),
};

// 3. ÉLÈVES
export const studentsApi = {
  getBySchool: (
    schoolId: string,
    params?: { class_id?: string; level?: string; status?: string; search?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.class_id) query.set('class_id', params.class_id);
    if (params?.level) query.set('level', params.level);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; students: any[] }>(
      `/schools/${schoolId}/students${queryString}`
    );
  },

  create: (schoolId: string, studentData: any) =>
    fetchJson<{ success: boolean; student: any; badge: any; message: string }>(
      `/schools/${schoolId}/students`,
      {
        method: 'POST',
        body: JSON.stringify(studentData),
      }
    ),

  update: (studentId: string, updates: any) =>
    fetchJson<{ success: boolean; student: any; message: string }>(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  delete: (studentId: string) =>
    fetchJson<{ success: boolean; message: string; deletedStudentId: string }>(
      `/students/${studentId}`,
      {
        method: 'DELETE',
      }
    ),
};

// 4. CLASSES
export const classesApi = {
  getAll: (params?: { school_id?: string; level?: string }) => {
    const query = new URLSearchParams();
    if (params?.school_id) query.set('school_id', params.school_id);
    if (params?.level) query.set('level', params.level);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; classes: any[] }>(`/classes${queryString}`);
  },

  create: (classData: any) =>
    fetchJson<{ success: boolean; class: any; message: string }>('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),
};

// 5. ENSEIGNANTS
export const teachersApi = {
  getAll: (params?: { school_id?: string; subject?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.school_id) query.set('school_id', params.school_id);
    if (params?.subject) query.set('subject', params.subject);
    if (params?.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; teachers: any[] }>(
      `/teachers${queryString}`
    );
  },

  getById: (teacherId: string) =>
    fetchJson<{ success: boolean; teacher: any }>(`/teachers/${teacherId}`),

  create: (teacherData: any) =>
    fetchJson<{ success: boolean; teacher: any; message: string }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    }),

  update: (teacherId: string, updates: any) =>
    fetchJson<{ success: boolean; teacher: any; message: string }>(`/teachers/${teacherId}`, {
      method: 'POST',
      body: JSON.stringify(updates),
    }),

  delete: (teacherId: string) =>
    fetchJson<{ success: boolean; message: string; teacherId: string }>(`/teachers/${teacherId}`, {
      method: 'DELETE',
    }),

  deleteMany: (teacherIds: string[]) =>
    fetchJson<{ success: boolean; message: string; deletedCount: number }>('/teachers', {
      method: 'DELETE',
      body: JSON.stringify({ teacher_ids: teacherIds }),
    }),
};

// 6. NOTES
export const gradesApi = {
  getAll: (params?: {
    student_id?: string;
    class_id?: string;
    subject_id?: string;
    trimester?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.student_id) query.set('student_id', params.student_id);
    if (params?.class_id) query.set('class_id', params.class_id);
    if (params?.subject_id) query.set('subject_id', params.subject_id);
    if (params?.trimester) query.set('trimester', String(params.trimester));
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; grades: any[] }>(`/grades${queryString}`);
  },

  create: (gradesData: any | any[]) =>
    fetchJson<{ success: boolean; count: number; grades: any[]; message: string }>('/grades', {
      method: 'POST',
      body: JSON.stringify(gradesData),
    }),
};

// 7. ABSENCES
export const absencesApi = {
  getAll: (params?: {
    student_id?: string;
    class_id?: string;
    date?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.student_id) query.set('student_id', params.student_id);
    if (params?.class_id) query.set('class_id', params.class_id);
    if (params?.date) query.set('date', params.date);
    if (params?.status) query.set('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; absences: any[] }>(
      `/absences${queryString}`
    );
  },

  create: (recordsData: any | any[]) =>
    fetchJson<{
      success: boolean;
      count: number;
      absences: any[];
      alertsDispatched: any[];
      message: string;
    }>('/absences', {
      method: 'POST',
      body: JSON.stringify(recordsData),
    }),
};

// 8. ESPACE PARENT
export const parentApi = {
  getByMatricule: (matricule: string) =>
    fetchJson<{
      success: boolean;
      student: any;
      school: any;
      classInfo: any;
      academicOverview: any;
      attendanceSummary: any;
      financialStatus: any;
      homeworkAndLogbook: any[];
      badges: any[];
    }>(`/parent/${encodeURIComponent(matricule)}`),

  getStudentBadges: (studentId: string) =>
    fetchJson<{ success: boolean; count: number; student: any; badges: any[] }>(
      `/parents/students/${studentId}/badges`
    ),

  getBadgePdf: (studentId: string, badgeId: string) =>
    fetchJson<{
      success: boolean;
      message: string;
      downloadUrl: string;
      certificateVerification: any;
    }>(`/parents/students/${studentId}/badges/${badgeId}/pdf`),
};

// 9. BADGES
export const badgesApi = {
  issue: (payload: {
    studentId?: string;
    classId?: string;
    schoolId?: string;
    badgeType?: string;
    expiryDate?: string;
  }) =>
    fetchJson<{ success: boolean; count: number; badges: any[]; message: string }>(
      '/schools/badges/issue',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  getHistory: (schoolId: string, params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.status) query.set('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; badges: any[]; schoolId: string }>(
      `/schools/badges/history/${schoolId}${queryString}`
    );
  },

  delete: (badgeId: string) =>
    fetchJson<{ success: boolean; message: string; badgeId: string }>(
      `/schools/badges/${badgeId}`,
      {
        method: 'DELETE',
      }
    ),
};
