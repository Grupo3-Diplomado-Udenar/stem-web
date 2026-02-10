const API_URL = 'http://localhost:3000/auth';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    type: 'student' | 'organization';
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const registerStudent = async (
  numero_identificacion: string,
  tipo_identificacion: string,
  nombres: string,
  apellidos: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const payload = {
    numero_identificacion,
    tipo_identificacion,
    nombres: nombres.toUpperCase(),
    apellidos: apellidos.toUpperCase(),
    email,
    password,
  };

  console.log('📤 Enviando registro de estudiante:', payload);

  const response = await fetch(`${API_URL}/register/student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Error:', error);
    throw new Error(error.message || 'Error al registrar estudiante');
  }

  const data = await response.json();
  console.log('✅ Registro exitoso:', data);
  
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const registerOrganization = async (
  nit: string,
  organizationName: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const payload = {
    nit,
    nombre: organizationName.toUpperCase(),
    email,
    password,
  };

  console.log('📤 Enviando registro de organización:', payload);

  const response = await fetch(`${API_URL}/register/organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Error:', error);
    throw new Error(error.message || 'Error al registrar organización');
  }

  const data = await response.json();
  console.log('✅ Registro exitoso:', data);
  
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

interface StudentProfile {
  numero_identificacion: string;
  email: string;
  nombres: string;
  apellidos: string;
  tipo_identificacion: string;
  celular: string;
  ciudad: string;
  estado: boolean;
}

interface OrganizationProfile {
  id_organizacion: string;
  nit: string;
  nombre: string;
  email: string;
  sector: string;
  descripcion: string;
  logo_url: string;
  ubicacion: string;
  estado: boolean;
}

export type ProfileData = StudentProfile | OrganizationProfile;

export const getProfile = async (): Promise<ProfileData> => {
  const token = getToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el perfil');
  }

  return response.json();
};

export const updateProfile = async (data: Partial<StudentProfile> | Partial<OrganizationProfile>): Promise<ProfileData> => {
  const token = getToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar el perfil');
  }

  return response.json();
};