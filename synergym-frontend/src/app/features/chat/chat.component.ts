import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService, Conversacion, Mensaje } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-120px)] flex bg-bg-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <!-- Sidebar de Chats -->
      <div class="w-80 border-r border-white/10 flex flex-col bg-black/20">
        <div class="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 class="text-xl font-black italic text-white uppercase tracking-tighter">Mensajes</h2>
          <button (click)="toggleUserList()" class="p-2 hover:bg-primary/20 rounded-full text-primary transition-all">
            <span class="text-xl">⊕</span>
          </button>
        </div>

        <!-- Lista de Usuarios -->
        @if (showUserList()) {
          <div class="p-4 bg-primary/10 border-b border-white/10 animate-fadeIn">
            <p class="text-[10px] font-black uppercase text-primary mb-2">Iniciar conversación con:</p>
            <div class="max-h-48 overflow-y-auto space-y-2">
              @for (user of allUsers(); track user.id) {
                @if (user.id !== currentUserId) {
                  <div 
                    (click)="startNewChat(user.id)"
                    class="p-3 hover:bg-white/10 rounded-xl cursor-pointer flex items-center space-x-3 transition-all active:scale-95 bg-white/5 relative z-30 mb-2"
                  >
                    <div class="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {{ user.nombre.charAt(0) }}
                    </div>
                    <div class="text-sm">
                      <p class="text-white font-bold leading-none">{{ user.nombre }}</p>
                      <p class="text-[10px] text-gray-500 uppercase">{{ user.rol }}</p>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        }

        <div class="flex-1 overflow-y-auto">
          @for (conv of conversaciones(); track conv.id) {
            <div 
              (click)="selectConversacion(conv)"
              [class.bg-primary/10]="selectedConv()?.id === conv.id"
              class="p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-black shadow-lg">
                  {{ getChatInitial(conv) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <h3 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                      {{ getChatName(conv) }}
                    </h3>
                    <!-- Solo mostrar si no está leída -->
                    @if (isUnread(conv)) {
                      <span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff4d4d] animate-pulse"></span>
                    }
                  </div>
                  <p class="text-xs text-gray-500 truncate mt-1">
                    {{ conv.ultimoMensaje || 'Sin mensajes todavía' }}
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Área de Chat -->
      <div class="flex-1 flex flex-col bg-black/40 relative">
        @if (selectedConv()) {
          <div class="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                {{ getChatInitial(selectedConv()!) }}
              </div>
              <div>
                <h2 class="text-lg font-black text-white italic uppercase tracking-tighter">{{ getChatName(selectedConv()!) }}</h2>
                <span class="text-[10px] text-green-500 font-black uppercase tracking-widest">En línea</span>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            @for (msg of mensajes(); track msg.id) {
              <div [class.justify-end]="isMyMessage(msg)" class="flex">
                <div 
                  [class]="isMyMessage(msg) ? 'bg-primary text-white rounded-2xl rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-2xl rounded-tl-none'"
                  class="max-w-[70%] p-4 shadow-xl"
                >
                  <p class="text-sm font-medium leading-relaxed">{{ msg.contenido }}</p>
                  <span class="text-[9px] opacity-50 block mt-2 font-black uppercase tracking-tighter text-right">
                    {{ msg.fechaEnvio | date:'HH:mm' }}
                  </span>
                </div>
              </div>
            }
          </div>

          <div class="p-4 bg-white/5 border-t border-white/10">
            <form (ngSubmit)="sendMessage()" class="flex space-x-4">
              <input 
                type="text" 
                [(ngModel)]="newMessage" 
                name="msg"
                class="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-600"
                placeholder="Escribe un mensaje..."
              >
              <button 
                type="submit"
                [disabled]="!newMessage.trim()"
                class="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform active:scale-90 disabled:opacity-50"
              >
                <span>🚀</span>
              </button>
            </form>
          </div>
        } @else {
          <div class="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-20">💬</div>
            <h3 class="text-2xl font-black text-white italic uppercase tracking-tighter">SynerGym Chat</h3>
            <p class="text-gray-500 max-w-xs mt-2 font-medium">Selecciona una conversación o inicia una nueva.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  `]
})
export class ChatComponent implements OnInit, OnDestroy {
  private messagingService = inject(MessagingService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  conversaciones = signal<Conversacion[]>([]);
  selectedConv = signal<Conversacion | null>(null);
  mensajes = signal<Mensaje[]>([]);
  allUsers = signal<Usuario[]>([]);
  showUserList = signal(false);
  newMessage = '';
  private pollInterval: any;

  // Estado local de lectura
  private readMessagesMap: Record<number, string> = {};

  get currentUserId(): number | undefined {
    return this.authService.currentUser()?.id;
  }

  ngOnInit() {
    // Cargar historial de lectura del localStorage
    const saved = localStorage.getItem('read_messages');
    if (saved) this.readMessagesMap = JSON.parse(saved);

    this.loadConversaciones();
    this.loadUsers();
    this.pollInterval = setInterval(() => {
      this.loadConversaciones();
      const selected = this.selectedConv();
      if (selected) {
        this.loadMensajes(selected.id);
        // Al estar el chat abierto, marcamos como leído automáticamente
        this.markAsRead(selected);
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  toggleUserList() {
    this.showUserList.update(val => !val);
  }

  loadConversaciones() {
    this.messagingService.getConversaciones().subscribe({
      next: (data) => {
        this.conversaciones.set(data);
        // Comprobar si hay algún mensaje no leído para el menú lateral
        const anyUnread = data.some(conv => this.isUnread(conv));
        this.messagingService.setUnreadStatus(anyUnread);
      }
    });
  }

  loadUsers() {
    this.usuarioService.getActivos().subscribe({
      next: (data) => this.allUsers.set(data)
    });
  }

  selectConversacion(conv: Conversacion) {
    this.selectedConv.set(conv);
    this.loadMensajes(conv.id);
    this.markAsRead(conv);
  }

  markAsRead(conv: Conversacion) {
    if (conv.ultimoMensaje) {
      this.readMessagesMap[conv.id] = conv.ultimoMensaje;
      localStorage.setItem('read_messages', JSON.stringify(this.readMessagesMap));
      
      // Recalcular estado global
      const anyUnread = this.conversaciones().some(c => this.isUnread(c));
      this.messagingService.setUnreadStatus(anyUnread);
    }
  }

  isUnread(conv: Conversacion): boolean {
    // Es no leído si hay un mensaje último y es distinto al que tenemos guardado como "leído"
    if (!conv.ultimoMensaje) return false;
    // Si la conversación está seleccionada, no mostramos el badge (se considera leída)
    if (this.selectedConv()?.id === conv.id) return false;
    
    return this.readMessagesMap[conv.id] !== conv.ultimoMensaje;
  }

  loadMensajes(id: number) {
    this.messagingService.getMensajes(id).subscribe({
      next: (data) => this.mensajes.set(data)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const selected = this.selectedConv();
    if (!selected) return;

    this.messagingService.enviarMensaje(selected.id, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMensajes(selected.id);
      }
    });
  }

  startNewChat(idOtroUsuario: number) {
    this.messagingService.crearConversacionPrivada(idOtroUsuario).subscribe({
      next: (newConv) => {
        this.showUserList.set(false);
        this.loadConversaciones();
        this.selectConversacion(newConv);
      }
    });
  }

  getChatName(conv: Conversacion): string {
    if (conv.tipo === 'GRUPAL') return conv.nombre || 'Grupo';
    const otherId = conv.idParticipantes?.find(id => id !== this.currentUserId);
    if (!otherId) return 'Chat Privado';
    const otherUser = this.allUsers().find(u => u.id === otherId);
    return otherUser ? `${otherUser.nombre} ${otherUser.apellidos}` : 'Usuario SynerGym';
  }

  getChatInitial(conv: Conversacion): string {
    return this.getChatName(conv).charAt(0).toUpperCase();
  }

  isMyMessage(msg: Mensaje): boolean {
    return msg.idEmisor === this.currentUserId;
  }
}
