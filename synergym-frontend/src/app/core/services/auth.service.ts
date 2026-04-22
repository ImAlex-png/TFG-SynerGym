import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthState, LoginResponse, Usuario, Rol } from '../models/user.model';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = 'http://localhost:8081/auth';
  private readonly TOKEN_KEY = 'synergym_token';
  private readonly REFRESH_KEY = 'synergym_refresh';

  // State
  private state = signal<AuthState>({
    user: null,
    token: this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null,
    isAuthenticated: this.isBrowser ? !!localStorage.getItem(this.TOKEN_KEY) : false,
  });

  // Selectors
  user = computed(() => this.state().user);
  token = computed(() => this.state().token);
  isAuthenticated = computed(() => this.state().isAuthenticated);
  role = computed(() => this.state().user?.rol);

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  constructor() {
    if (this.isBrowser) {
      const token = this.state().token;
      if (token) {
        this.decodeAndSetUser(token);
      }
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  register(data: any) {
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    }
    this.state.set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: LoginResponse) {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, response.access);
      localStorage.setItem(this.REFRESH_KEY, response.refresh);
    }
    this.decodeAndSetUser(response.access);
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const backendRoles = decoded.roles || [];
      let rol = Rol.ALUMNO;

      if (backendRoles.includes('ROLE_ADMINISTRADOR')) rol = Rol.ADMINISTRADOR;
      else if (backendRoles.includes('ROLE_ENTRENADOR')) rol = Rol.ENTRENADOR;

      const user: Usuario = {
        id: decoded.id || 0,
        nombre: decoded.sub.split('@')[0],
        apellidos: '',
        dni: '',
        telefono: '',
        email: decoded.sub,
        rol: rol,
        activo: true,
      };

      this.state.update((s) => ({
        ...s,
        user,
        token,
        isAuthenticated: true,
      }));
    } catch (e) {
      if (this.isBrowser) {
        this.logout();
      }
    }
  }
}
