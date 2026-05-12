import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signals
  currentUser = signal<Usuario | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  login(credentials: any) {
    const loginData = {
      username: credentials.email,
      password: credentials.password
    };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        this.setSession(response, loginData);
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        // En caso de éxito con auto-login desde el backend (opcional)
        if (response && response.access) {
          this.setSession(response, userData);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(authResult: any, userData?: any) {
    localStorage.setItem('token', authResult.access);
    localStorage.setItem('refreshToken', authResult.refresh);

    // Si tenemos datos del usuario, los guardamos temporalmente
    if (userData) {
      const email = userData.email || userData.username;
      let id = authResult.userId || 0;
      let rol = userData.rol || 'ALUMNO';

      // Mapeo manual para los usuarios iniciales del data.sql
      let nombre = userData.nombre || 'Usuario';
      
      if (email === 'admin@synergym.com') {
        id = 1;
        rol = 'ADMINISTRADOR';
        nombre = 'Admin';
      } else if (email === 'marcos.entrenador@synergym.com') {
        id = 2;
        rol = 'ENTRENADOR';
        nombre = 'Marcos';
      } else if (email === 'sara.entrenador@synergym.com') {
        id = 3;
        rol = 'ENTRENADOR';
        nombre = 'Sara';
      }

      const user = { id, nombre, email, rol };
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user as Usuario);
    }

    this.loadUserProfile();
  }

  private loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Intentamos obtener el perfil real del backend para tener el ROL correcto
    this.http.get<Usuario>(`${this.apiUrl}/me`).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      },
      error: () => {
        // Si falla el /me, al menos intentamos mantener lo que había o cerramos si el token no vale
        if (!this.currentUser()) this.logout();
      }
    });
  }

  private loadSession() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.rol === role;
  }
}
